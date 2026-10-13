#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Baseline jobs need the same observations as cache-enabled jobs. Otherwise the
// default (uncached) path has no comparable Actions summary (2026-10-14 pilot).
export function timingWorkflow(source) {
  const jobs = [...source.matchAll(/^  ([a-zA-Z0-9_-]+):\n/gm)];
  for (let index = jobs.length - 1; index >= 0; index--) {
    if (!['essential', 'quality'].includes(jobs[index][1])) continue;
    const start = jobs[index].index, end = jobs[index + 1]?.index ?? source.length;
    let block = source.slice(start, end);
    if (!/^    steps:\s*$/m.test(block)) continue;
    if (block.includes('      - name: Summarize observed CI timings\n')) {
      block = block.replace(/(      - name: Summarize observed CI timings\n)        if: [^\n]+\n/,
        "$1        if: ${{ always() && github.ref == 'refs/heads/main' }}\n");
    } else {
      block = block.trimEnd() + `
      # Read-only observation must not change the product check result.
      - name: Summarize observed CI timings
        if: \${{ always() && github.ref == 'refs/heads/main' }}
        continue-on-error: true
        run: node tools/ci-metrics.mjs "$GITHUB_REPOSITORY" "$GITHUB_RUN_ID" "$RUNNER_TEMP/product-check-timing.json"
        env:
          GITHUB_TOKEN: \${{ github.token }}
          CI_METRICS_SUMMARY: '1'
`;
    }
    source = source.slice(0, start) + block + source.slice(end);
  }
  return source;
}
export function evidenceWorkflow(source, contract) {
  return timingWorkflow(wireEvidenceWorkflow(source, contract));
}
function wireEvidenceWorkflow(source, contract) {
  if (contract.runtimes?.length && contract.runtimes.every(r => r.binding?.checks?.typecheck && ['expo', 'nestjs'].includes(r.framework))) return boundEvidenceWorkflow(source);
  // Bound/custom commands and other stacks need their own reviewed preparation adapter.
  if (!(contract.runtimes?.length && contract.runtimes.every(r => !r.binding && r.root !== '.' && ['expo', 'nestjs', 'nextjs'].includes(r.framework)))) return source;
  if (source.includes('# check-evidence-v1')) return source;
  const start = source.indexOf('  essential:\n');
  if (start < 0) return source;
  const end = source.indexOf('\n  regression:\n', start);
  if (end < 0) throw new Error('Expected essential/regression boundary');
  let block = source.slice(start, end);
  const original = /      - name: Typecheck\n(        if: ([^\n]+)\n)?        run: node tools\/ci-change-scope.mjs --run typecheck\n        env:\n          CI_RUNTIME_IDS: ([^\n]+)\n/;
  const match = block.match(original);
  if (!match) throw new Error('Review custom typecheck before evidence wiring');
  const heavy = match[2]?.replace(/^\$\{\{\s*|\s*\}\}$/g, '') ?? 'true';
  const active = `(${heavy}) && vars.CI_EVIDENCE_MODE != '' && github.ref == 'refs/heads/main'`;
  const fallback = `(${heavy}) && (vars.CI_EVIDENCE_MODE == '' || github.ref != 'refs/heads/main')`;
  const steps = `      # check-evidence-v1: opt-in; removing CI_EVIDENCE_MODE restores original execution.
      - name: Typecheck
        if: \${{ ${fallback} }}
        run: node tools/ci-change-scope.mjs --run typecheck
        env:
          CI_RUNTIME_IDS: ${match[3]}
      - name: Prepare generated types for evidence checks
        if: \${{ ${active} }}
        run: node tools/ci-product-evidence.mjs prepare
        env:
          CI_RUNTIME_IDS: ${match[3]}
      - name: Restore trusted main check evidence
        if: \${{ ${active} }}
        uses: actions/cache/restore@caa296126883cff596d87d8935842f9db880ef25 # v5
        with:
          path: \${{ runner.temp }}/product-check-evidence/cache
          key: product-check-evidence-v1-\${{ runner.os }}-\${{ runner.arch }}-\${{ github.sha }}-\${{ github.run_id }}-\${{ github.run_attempt }}
          restore-keys: product-check-evidence-v1-\${{ runner.os }}-\${{ runner.arch }}-
      - name: Typecheck with input evidence
        id: evidence
        if: \${{ ${active} }}
        run: node tools/ci-product-evidence.mjs "$CI_EVIDENCE_MODE" "$RUNNER_TEMP/product-check-evidence" "$RUNNER_TEMP/product-check-evidence-report.json"
        env:
          CI_RUNTIME_IDS: ${match[3]}
          CI_EVIDENCE_MODE: \${{ vars.CI_EVIDENCE_MODE }}
          GITHUB_TOKEN: \${{ github.token }}
          HJM_LOCAL_SOURCE: '0'
      # Save failed/pending evidence too, so an older success cannot reappear on the next run.
      - name: Preserve check cache and revocations
        if: \${{ always() && (${active}) && steps.evidence.outputs.cache_changed != 'false' }}
        uses: actions/cache/save@caa296126883cff596d87d8935842f9db880ef25 # v5
        with:
          path: \${{ runner.temp }}/product-check-evidence/cache
          key: product-check-evidence-v1-\${{ runner.os }}-\${{ runner.arch }}-\${{ github.sha }}-\${{ github.run_id }}-\${{ github.run_attempt }}
      # Timing is observational; API trouble must not convert a passed check into a product failure.
      - name: Summarize observed CI timings
        if: \${{ always() && vars.CI_EVIDENCE_MODE != '' && github.ref == 'refs/heads/main' }}
        continue-on-error: true
        run: node tools/ci-metrics.mjs "$GITHUB_REPOSITORY" "$GITHUB_RUN_ID" "$RUNNER_TEMP/product-check-timing.json"
        env:
          GITHUB_TOKEN: \${{ github.token }}
          CI_METRICS_SUMMARY: '1'
      - name: Preserve check evidence
        if: \${{ always() && vars.CI_EVIDENCE_MODE != '' && github.ref == 'refs/heads/main' }}
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a
        with:
          name: product-check-evidence-\${{ github.run_id }}-\${{ github.run_attempt }}
          path: |
            \${{ runner.temp }}/product-check-evidence-report.json
            \${{ runner.temp }}/product-check-timing.json
          if-no-files-found: warn
          retention-days: 14
`;
  block = block.replace(original, steps);
  return source.slice(0, start) + block + source.slice(end);
}

export function boundEvidenceWorkflow(source) {
  if (source.includes('# bound-check-evidence-v1')) return source;
  const original = /      - name: Changed runtime typecheck \(manual dispatch includes regression\)\n        if: ([^\n]+)\n        run: node tools\/run-quality.mjs check-ci\n        env:\n          CI_RUNTIME_IDS: ([^\n]+)\n          CI_FULL_REGRESSION: ([^\n]+)\n/;
  const match = source.match(original);
  if (!match) throw new Error('Review custom bound typecheck before evidence wiring');
  const heavy = match[1].replace(/^\$\{\{\s*|\s*\}\}$/g, '');
  const full = "github.event_name == 'workflow_dispatch' && inputs.full_regression == true";
  const active = `(${heavy}) && vars.CI_EVIDENCE_MODE != '' && github.ref == 'refs/heads/main' && !(${full})`;
  const fallback = `(${heavy}) && (vars.CI_EVIDENCE_MODE == '' || github.ref != 'refs/heads/main' || (${full}))`;
  // Full regression retains the original bound runner. Preparation for static
  // reuse stays inside runBoundQuality, ahead of its opt-in compiler callback.
  return source.replace(original, `      # bound-check-evidence-v1: reuse pure compiler checks only; full regression is unchanged.
${match[0].replace(`        if: ${match[1]}`, `        if: \${{ ${fallback} }}`)}      - name: Restore trusted main check evidence
        if: \${{ ${active} }}
        uses: actions/cache/restore@caa296126883cff596d87d8935842f9db880ef25 # v5
        with:
          path: \${{ runner.temp }}/bound-check-evidence/cache
          key: bound-check-evidence-v1-\${{ runner.os }}-\${{ runner.arch }}-\${{ github.sha }}-\${{ github.run_id }}-\${{ github.run_attempt }}
          restore-keys: bound-check-evidence-v1-\${{ runner.os }}-\${{ runner.arch }}-
      - name: Typecheck with input evidence
        id: evidence
        if: \${{ ${active} }}
        run: node tools/ci-bound-evidence.mjs "$CI_EVIDENCE_MODE" "$RUNNER_TEMP/bound-check-evidence" "$RUNNER_TEMP/product-check-evidence-report.json"
        env:
          CI_RUNTIME_IDS: ${match[2]}
          CI_EVIDENCE_MODE: \${{ vars.CI_EVIDENCE_MODE }}
          GITHUB_TOKEN: \${{ github.token }}
          HJM_LOCAL_SOURCE: '0'
      - name: Preserve check cache and revocations
        if: \${{ always() && (${active}) && steps.evidence.outputs.cache_changed != 'false' }}
        uses: actions/cache/save@caa296126883cff596d87d8935842f9db880ef25 # v5
        with:
          path: \${{ runner.temp }}/bound-check-evidence/cache
          key: bound-check-evidence-v1-\${{ runner.os }}-\${{ runner.arch }}-\${{ github.sha }}-\${{ github.run_id }}-\${{ github.run_attempt }}
      - name: Summarize observed CI timings
        if: \${{ always() && (${active}) }}
        continue-on-error: true
        run: node tools/ci-metrics.mjs "$GITHUB_REPOSITORY" "$GITHUB_RUN_ID" "$RUNNER_TEMP/product-check-timing.json"
        env:
          GITHUB_TOKEN: \${{ github.token }}
          CI_METRICS_SUMMARY: '1'
      - name: Preserve check evidence
        if: \${{ always() && (${active}) }}
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a
        with:
          name: product-check-evidence-\${{ github.run_id }}-\${{ github.run_attempt }}
          path: |
            \${{ runner.temp }}/product-check-evidence-report.json
            \${{ runner.temp }}/product-check-timing.json
          if-no-files-found: warn
          retention-days: 14
`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = resolve(process.argv[2] ?? '.');
  const contract = JSON.parse(readFileSync(resolve(root, 'app.contract.json'), 'utf8'));
  const path = resolve(root, '.github/workflows', contract.execution?.model === 'runtime-bindings-v1' ? 'app-standard.yml' : 'quality-gate.yml');
  const before = readFileSync(path, 'utf8');
  const after = evidenceWorkflow(before, contract);
  console.log(JSON.stringify({ path, changed: before !== after, write: process.argv.includes('--write') }));
  if (process.argv.includes('--write') && before !== after) writeFileSync(path, after);
}
