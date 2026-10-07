#!/usr/bin/env node
// Release-only CI keeps routine pushes free of quality jobs. Path filters admit only
// version manifests; this cheap gate distinguishes version increases from config edits.
import { execFileSync } from 'node:child_process';
import { readFileSync, appendFileSync } from 'node:fs';
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
  push:
    branches: [main]
    paths: ${JSON.stringify(paths)}
` + source.slice(end);
  // Release candidates must execute current checks even when only a version changed.
  // Carrying over a previous push's heavy checks would defeat the user's pre-deploy gate.
  if (/^env:$/m.test(source)) source = source.replace(/^env:$/m, "env:\n  RELEASE_QUALITY: '1'");
  else source = source.replace(/^jobs:$/m, "env:\n  RELEASE_QUALITY: '1'\n\njobs:");
  const jobsAt = source.indexOf('jobs:\n');
  let jobs = source.slice(jobsAt + 6);
  jobs = jobs.split(/(?=^  [\w-]+:\n)/m).map(block => {
    if (!/^  [\w-]+:\n/.test(block)) return block;
    if (/^    needs:/m.test(block)) throw new Error('Review existing job dependencies before release gating');
    const condition = "needs.release-intent.outputs.run == 'true'";
    if (/^    if:/m.test(block)) block = block.replace(/^    if: (.*)$/m, (_, old) => `    if: ${condition} && (${old.replace(/^\$\{\{\s*|\s*\}\}$/g, '')})`);
    else block = block.replace(/^(  [\w-]+:\n)/, `$1    if: ${condition}\n`);
    return block.replace(/^(  [\w-]+:\n)/, '$1    needs: release-intent\n');
  }).join('');
  const intent = `  release-intent:
    runs-on: \${{ vars.CI_RUNNER || 'ubuntu-latest' }}
    timeout-minutes: 5
    outputs:
      run: \${{ steps.intent.outputs.run }}
    steps:
      # Keep the reviewed Dependabot v7 pin during standard projection; v7 hardens privileged PR checkout.
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          ref: \${{ github.sha }}
          fetch-depth: 0
          persist-credentials: false
      # Admission executes repository code too: use the product's exact Node pin,
      # not the hosted runner's changing default (2026-10-08 consumer CI audit).
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020
        with:
          node-version-file: .nvmrc
      - name: Admit only an increased release version
        id: intent
        run: node tools/release-quality.mjs

`;
  return source.slice(0, jobsAt + 6) + intent + jobs;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const env = process.env;
    const run = releaseQualityIntent({ contract: JSON.parse(readFileSync('app.contract.json', 'utf8')), event: JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8')), eventName: env.GITHUB_EVENT_NAME, ref: env.GITHUB_REF, sha: env.GITHUB_SHA });
    if (!env.GITHUB_OUTPUT) throw new Error('GITHUB_OUTPUT missing');
    appendFileSync(env.GITHUB_OUTPUT, `run=${run}\n`);
    console.log(`Release quality: ${run ? 'version increased or explicit manual check' : 'version unchanged; no quality checks'}`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
