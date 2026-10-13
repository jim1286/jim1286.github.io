#!/usr/bin/env node
// Release-only CI keeps routine pushes free of quality jobs. Path filters admit only
// version manifests; this cheap gate distinguishes version increases from config edits.
import { execFileSync } from 'node:child_process';
import { readFileSync, appendFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { compareVersions } from './server-release-gate.mjs';

export function readReleaseVersion(source, kind) {
  if (kind === 'flutter') {
    const match = source.match(/^version:\s*['"]?(\d+\.\d+\.\d+)\+(\d+)['"]?\s*(?:#.*)?$/m);
    if (!match) throw new Error('Flutter release requires version major.minor.patch+build');
    return { version: match[1], build: BigInt(match[2]) };
  }
  const data = JSON.parse(source);
  const version = kind === 'expo' ? data.expo?.version : ['server', 'web'].includes(kind) ? data.version : undefined;
  compareVersions(version, version);
  return { version };
}

export function releaseQualityIntent({ contract, event, eventName, ref, sha, cwd = process.cwd() }) {
  if (ref !== 'refs/heads/main') throw new Error('Release quality requires main');
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  if (!/^[0-9a-f]{40}$/.test(sha ?? '') || /^0+$/.test(sha) || git('rev-parse', 'HEAD') !== sha) throw new Error('Quality checkout must match event SHA');
  // Explicit manual diagnostics remain available but cannot auto-deploy (release callers
  // require push quality). Normal PR/source pushes have no automatic quality trigger.
  if (eventName === 'workflow_dispatch') return true;
  if (eventName !== 'push' || !/^[0-9a-f]{40}$/.test(event.before ?? '') || /^0+$/.test(event.before)) throw new Error('Missing release push base');
  git('merge-base', '--is-ancestor', event.before, sha);
  const entries = contract.qualityGate?.releaseVersions;
  if (contract.qualityGate?.trigger !== 'version-bump' || !entries?.length) throw new Error('Release quality contract missing');
  let increased = false;
  for (const { path, kind } of entries) {
    if (!/^[A-Za-z0-9_-][A-Za-z0-9_./-]*$/.test(path) || path.split('/').includes('..')) throw new Error('Unsafe version path');
    const previous = readReleaseVersion(git('show', `${event.before}:${path}`), kind);
    const current = readReleaseVersion(git('show', `${sha}:${path}`), kind);
    const direction = compareVersions(previous.version, current.version);
    if (direction < 0 || (kind === 'flutter' && current.build < previous.build)) throw new Error(`Version downgrade: ${path}`);
    const changed = direction > 0 || (kind === 'flutter' && current.build > previous.build);
    // Match Hub's Flutter policy: a marketing change needs a new store build number.
    if (kind === 'flutter' && direction > 0 && current.build <= previous.build) throw new Error(`Flutter build number must increase: ${path}`);
    increased ||= changed;
  }
  return increased;
}

export function releaseQualityWorkflow(source, contract) {
  if (contract.qualityGate?.trigger !== 'version-bump') return source;
  const paths = contract.qualityGate.releaseVersions.map(x => x.path);
  const start = source.indexOf('on:\n'), end = source.indexOf('\npermissions:', start);
  if (start < 0 || end < 0) throw new Error('Expected quality workflow trigger and permissions');
  source = source.slice(0, start) + `# Version manifests only: routine source/PR pushes do not run quality (2026-10-01).
on:
  workflow_dispatch:
    inputs:
      full_regression:
        description: Run full tests and audits (default runs only the essential gate)
        type: boolean
        default: false
  push:
    branches: [main]
    paths: ${JSON.stringify(paths)}
` + source.slice(end);
  // Admission still binds the gate to this release SHA. ci-change-scope may reuse
  // unchanged behavior from a passing ancestor under the Oct 12 minimization policy;
  // contract checks and the delivery artifact build still inspect the candidate.
  if (/^env:$/m.test(source)) source = source.replace(/^env:$/m, "env:\n  RELEASE_QUALITY: '1'");
  else source = source.replace(/^jobs:$/m, "env:\n  RELEASE_QUALITY: '1'\n\njobs:");
  if (!/^  actions: read$/m.test(source)) source = source.replace('  contents: read\n', '  contents: read\n  actions: read # successful ancestor scope\n');
  const jobsAt = source.indexOf('jobs:\n');
  let jobs = source.slice(jobsAt + 6);
  // Compute once in admission, before scarce runner slots are requested. Reusing
  // that result also avoids duplicate GitHub history calls in each heavy job.
  const scopeStep = `      - name: Decide change scope
        id: scope
        run: node tools/ci-change-scope.mjs
        env:
          GITHUB_TOKEN: \${{ github.token }}
`;
  const scopeHistory = '          # 변경 범위 판정이 게이트를 통과한 조상 커밋과 비교한다(그 조상은 임의로 멀 수 있다).\n          fetch-depth: 0\n';
  // Source prerequisites run once in admission, before package/SDK installation.
  jobs = jobs.replace(/      - name: Check source prerequisites before installation\n(?:        if:.*\n)?        run: node tools\/deployment-preflight.mjs source\n        env:\n          CI_RUNTIME_IDS:.*\n/g, '');
  jobs = jobs.replaceAll(scopeStep, '').replaceAll(scopeHistory, '').replaceAll('steps.scope.outputs', 'needs.release-intent.outputs');
  jobs = jobs.split(/(?=^  [\w-]+:\n)/m).map(block => {
    if (!/^  [\w-]+:\n/.test(block)) return block;
    if (/^    needs:/m.test(block)) throw new Error('Review existing job dependencies before release gating');
    const condition = "needs.release-intent.outputs.run == 'true'";
    if (/^    if:/m.test(block)) block = block.replace(/^    if: (.*)$/m, (_, old) => `    if: ${condition} && (${old.replace(/^\$\{\{\s*|\s*\}\}$/g, '')})`);
    else block = block.replace(/^(  [\w-]+:\n)/, `$1    if: ${condition}\n`);
    return block.replace(/^(  [\w-]+:\n)/, '$1    needs: release-intent\n');
  }).join('');
  // A root admission checkout cleaned the nested Diairy checkout on every run
  // (Oct 14: 15s refetch). Share the consumers' path while retaining checkout's
  // normal clean/reset; unfamiliar or mixed layouts keep the existing behavior.
  const checkoutPaths = [...jobs.matchAll(/^      - uses: actions\/checkout@[^\n]+\n(?: {8,}[^\n]*\n)*/gm)]
    .map(([block]) => block.match(/^          path: ([a-zA-Z0-9_-]+)\s*$/m)?.[1]);
  const checkoutPath = checkoutPaths.length && checkoutPaths.every(path => path && path === checkoutPaths[0]) ? checkoutPaths[0] : null;
  const receiptStep = paths.some(path => /^(apps|modules)\/(server|web)\/package\.json$/.test(path)) ? `      # The small receipt replaces 40-minute polling jobs in web/server deploys.
      - name: Preserve the original push boundary
        if: github.event_name == 'push'
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a
        with:
          name: release-intent-\${{ github.run_attempt }}
          path: \${{ runner.temp }}/release-intent.json
          retention-days: 7
          if-no-files-found: error
` : '';
  const intent = `  release-intent:
    runs-on: \${{ vars.CI_RUNNER || 'ubuntu-latest' }}
    timeout-minutes: 5
${checkoutPath ? `    defaults:\n      run:\n        working-directory: ${checkoutPath}\n` : ''}    outputs:
      run: \${{ steps.intent.outputs.run }}
      heavy: \${{ steps.scope.outputs.heavy }}
      runtimes: \${{ steps.scope.outputs.runtimes }}
    steps:
      # Keep the reviewed Dependabot v7 pin during standard projection; v7 hardens privileged PR checkout.
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          ref: \${{ github.sha }}
          fetch-depth: 0
          persist-credentials: false
${checkoutPath ? `          path: ${checkoutPath}\n` : ''}      # Admission executes repository code too: use the product's exact Node pin,
      # not the hosted runner's changing default (2026-10-08 consumer CI audit).
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020
        with:
          node-version-file: ${checkoutPath ? checkoutPath + '/' : ''}.nvmrc
      - name: Admit only an increased release version
        id: intent
        run: node tools/release-quality.mjs
${receiptStep}      - name: Check source prerequisites before setup
        if: steps.intent.outputs.run == 'true'
        run: node tools/deployment-preflight.mjs source
      # Decide before heavy jobs claim a runner slot. Only verified unchanged
      # behavior carries over; unknown history still admits the full checks.
      - name: Decide changed runtime scope
        id: scope
        if: steps.intent.outputs.run == 'true'
        run: node tools/ci-change-scope.mjs
        env:
          GITHUB_TOKEN: \${{ github.token }}

`;
  return source.slice(0, jobsAt + 6) + intent + jobs;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const env = process.env;
    const event = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
    const run = releaseQualityIntent({ contract: JSON.parse(readFileSync('app.contract.json', 'utf8')), event, eventName: env.GITHUB_EVENT_NAME, ref: env.GITHUB_REF, sha: env.GITHUB_SHA });
    if (!env.GITHUB_OUTPUT) throw new Error('GITHUB_OUTPUT missing');
    appendFileSync(env.GITHUB_OUTPUT, `run=${run}\n`);
    // workflow_run omits push.before. Carry only the original boundary, bound to
    // this run/attempt/SHA, so downstream jobs need neither polling nor HEAD^ guesses.
    if (env.GITHUB_EVENT_NAME === 'push' && env.RUNNER_TEMP) {
      writeFileSync(join(env.RUNNER_TEMP, 'release-intent.json'), JSON.stringify({
        schemaVersion: 1, repository: env.GITHUB_REPOSITORY, sha: env.GITHUB_SHA,
        before: event.before, runId: Number(env.GITHUB_RUN_ID), attempt: Number(env.GITHUB_RUN_ATTEMPT), deploy: run,
      }));
    }
    console.log(`Release quality: ${run ? 'version increased or explicit manual check' : 'version unchanged; no quality checks'}`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
