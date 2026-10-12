#!/usr/bin/env node
// Canonical server release intent gate; projected by app-standard sync-standard.
// Comparing the complete push range preserves an earlier bump in a multi-commit push.
// Never infer intent from changed dependencies, production drift, or a missing base.
import { execFileSync } from 'node:child_process';
import { readFileSync, appendFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

export function compareVersions(before, after) {
  const parse = (value) => {
    if (typeof value !== 'string' || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value)) {
      throw new Error(`Expected a stable major.minor.patch version: ${value}`);
    }
    return value.split('.').map(BigInt);
  };
  const a = parse(before), b = parse(after);
  for (let i = 0; i < 3; i += 1) if (a[i] !== b[i]) return b[i] > a[i] ? 1 : -1;
  return 0;
}

export function releaseIntent({ event, eventName, sha, ref, manifest, cwd = process.cwd() }) {
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  if (!['push', 'workflow_dispatch'].includes(eventName) || ref !== 'refs/heads/main') throw new Error('Only main push or main dispatch may release');
  if (!/^[0-9a-f]{40}$/.test(sha) || /^0+$/.test(sha) || git('rev-parse', 'HEAD') !== sha) throw new Error('Checkout must equal the event SHA');
  if (!/^(apps|modules)\/(server|web)\/package\.json$/.test(manifest)) throw new Error('Invalid server version manifest');
  // Manual retry must also demonstrate a bump and pass quality; it is no bypass.
  const base = eventName === 'push' ? event.before : git('rev-parse', `${sha}^`);
  if (!/^[0-9a-f]{40}$/.test(base ?? '') || /^0+$/.test(base)) throw new Error('Missing push base; refusing implicit first release');
  git('merge-base', '--is-ancestor', base, sha);
  const versionAt = (revision) => JSON.parse(git('show', `${revision}:${manifest}`)).version;
  const before = versionAt(base), version = versionAt(sha);
  const direction = compareVersions(before, version);
  if (direction < 0) throw new Error(`Server version downgrade refused: ${before} -> ${version}`);
  return { deploy: direction > 0, before, version, sha, base };
}

export function qualityState(runs, sha, repository) {
  // The same SHA in a PR, another repository, or a manual quality run is not the push gate.
  const run = runs.filter(x => x.head_sha === sha && x.event === 'push' && x.head_branch === 'main' && x.repository?.full_name === repository)
    .sort((a, b) => b.id - a.id)[0];
  if (!run || run.status !== 'completed') return 'pending';
  if (run.conclusion !== 'success') throw new Error(`Quality gate ${run.conclusion}: ${run.html_url}`);
  return 'success';
}

export async function requireQuality({ repository, workflow, sha, token, api = 'https://api.github.com', fetcher = fetch }) {
  if (!token || !/^[\w.-]+\/[\w.-]+$/.test(repository ?? '') || !/^[\w.-]+\.yml$/.test(workflow ?? '')) throw new Error('Quality API configuration missing');
  // Events start deployment after completion. Holding a worker while waiting for
  // another worker caused multi-minute stalls; manual retries must also be ready.
  const url = `${api}/repos/${repository}/actions/workflows/${workflow}/runs?event=push&branch=main&head_sha=${sha}&per_page=100`;
  const response = await fetcher(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Quality API returned HTTP ${response.status}`);
  if (qualityState((await response.json()).workflow_runs, sha, repository) !== 'success')
    throw new Error('Quality is not complete for this SHA; complete quality before retrying deployment');
}

// A completed quality event is authoritative only for its own repository/main/SHA.
// The receipt preserves the full push range; using HEAD^ misses multi-commit bumps.
export function completedQualitySource({ event, repository, workflow }) {
  const run = event.workflow_run;
  if (!run || run.event !== 'push' || run.head_branch !== 'main' || run.status !== 'completed' || run.conclusion !== 'success' ||
      run.repository?.full_name?.toLowerCase() !== repository?.toLowerCase() ||
      run.head_repository?.full_name?.toLowerCase() !== repository?.toLowerCase() ||
      run.path !== `.github/workflows/${workflow}` || !/^[a-f0-9]{40}$/.test(run.head_sha ?? '') ||
      !Number.isSafeInteger(run.id) || !Number.isSafeInteger(run.run_attempt)) throw new Error('Untrusted or unsuccessful quality event');
  return { sha: run.head_sha, runId: run.id, attempt: run.run_attempt };
}

export function receiptBoundary(receipt, source, repository) {
  if (receipt.schemaVersion !== 1 || receipt.repository?.toLowerCase() !== repository.toLowerCase() ||
      receipt.sha !== source.sha || receipt.runId !== source.runId || receipt.attempt !== source.attempt ||
      typeof receipt.deploy !== 'boolean' || !/^[a-f0-9]{40}$/.test(receipt.before ?? '') || /^0+$/.test(receipt.before))
    throw new Error('Release receipt does not match the completed quality run');
  return receipt.before;
}

export async function readQualityReceipt({ source, repository, token, api = 'https://api.github.com', fetcher = fetch }) {
  if (!token || !/^[\w.-]+\/[\w.-]+$/.test(repository ?? '')) throw new Error('Quality API configuration missing');
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' };
  const response = await fetcher(`${api}/repos/${repository}/actions/runs/${source.runId}/artifacts?per_page=100`, { headers, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Receipt API HTTP ${response.status}`);
  const artifacts = (await response.json()).artifacts.filter(a => a.name === `release-intent-${source.attempt}` && !a.expired);
  if (artifacts.length !== 1 || artifacts[0].size_in_bytes > 65536) throw new Error('Missing or ambiguous release receipt; rerun quality');
  // Never forward the GitHub token to the signed object-store redirect.
  const download = await fetcher(`${api}/repos/${repository}/actions/artifacts/${artifacts[0].id}/zip`, { headers, redirect: 'manual', signal: AbortSignal.timeout(30000) });
  if (download.status !== 302) throw new Error(`Receipt download HTTP ${download.status}`);
  const location = download.headers.get('location');
  if (!location || new URL(location).protocol !== 'https:') throw new Error('Invalid receipt download URL');
  const zip = await fetcher(location, { signal: AbortSignal.timeout(30000) });
  if (!zip.ok) throw new Error(`Receipt archive HTTP ${zip.status}`);
  const bytes = Buffer.from(await zip.arrayBuffer());
  if (bytes.length > 65536) throw new Error('Release receipt too large');
  const directory = mkdtempSync(join(tmpdir(), 'release-receipt-'));
  try {
    const file = join(directory, 'receipt.zip');
    writeFileSync(file, bytes);
    // Read a single bounded member to stdout; never extract paths or execute content.
    return JSON.parse(execFileSync('unzip', ['-p', file, 'release-intent.json'], { encoding: 'utf8', maxBuffer: 8192 }));
  } finally { rmSync(directory, { recursive: true, force: true }); }
}

async function main() {
  const [manifest, workflow] = process.argv.slice(2);
  const env = process.env;
  const event = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
  let intent;
  if (env.GITHUB_EVENT_NAME === 'workflow_run') {
    const source = completedQualitySource({ event, repository: env.GITHUB_REPOSITORY, workflow });
    const receipt = await readQualityReceipt({ source, repository: env.GITHUB_REPOSITORY, token: env.GH_TOKEN, api: env.GITHUB_API_URL });
    const before = receiptBoundary(receipt, source, env.GITHUB_REPOSITORY);
    intent = releaseIntent({ event: { before }, eventName: 'push', sha: source.sha, ref: 'refs/heads/main', manifest });
    // Recheck once for a newer failed/in-progress attempt; never poll or hold a runner.
    if (intent.deploy) await requireQuality({ repository: env.GITHUB_REPOSITORY, workflow, sha: source.sha, token: env.GH_TOKEN, api: env.GITHUB_API_URL });
  } else {
    intent = releaseIntent({ event, eventName: env.GITHUB_EVENT_NAME, sha: env.GITHUB_SHA, ref: env.GITHUB_REF, manifest });
    if (intent.deploy) await requireQuality({ repository: env.GITHUB_REPOSITORY, workflow, sha: intent.sha, token: env.GH_TOKEN, api: env.GITHUB_API_URL });
  }
  console.log(`Version ${intent.before} -> ${intent.version}: ${intent.deploy ? 'quality already passed' : 'no deployment'}`);
  if (!env.GITHUB_OUTPUT) throw new Error('GITHUB_OUTPUT missing');
  appendFileSync(env.GITHUB_OUTPUT, `source-sha=${intent.sha}\ndeploy=${intent.deploy}\nshould-deploy=${intent.deploy}\nserver-version=${intent.version}\n`);
  if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, `Server release: ${intent.before} → ${intent.version}; deploy=${intent.deploy}; source=${intent.sha}\n`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
