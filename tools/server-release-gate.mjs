#!/usr/bin/env node
// Canonical server release intent gate; projected by app-standard sync-standard.
// Comparing the complete push range preserves an earlier bump in a multi-commit push.
// Never infer intent from changed dependencies, production drift, or a missing base.
import { execFileSync } from 'node:child_process';
import { readFileSync, appendFileSync } from 'node:fs';
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

export async function waitForQuality({ repository, workflow, sha, token, api = 'https://api.github.com', fetcher = fetch, sleep = ms => new Promise(r => setTimeout(r, ms)), attempts = 80 }) {
  if (!token || !/^[\w.-]+\/[\w.-]+$/.test(repository ?? '') || !/^[\w.-]+\.yml$/.test(workflow ?? '')) throw new Error('Quality API configuration missing');
  // Forty minutes includes queue time, matching the existing server gate budget.
  // Failure/cancellation is terminal; a retry must rerun quality for this same SHA.
  for (let i = 0; i < attempts; i += 1) {
    const url = `${api}/repos/${repository}/actions/workflows/${workflow}/runs?event=push&branch=main&head_sha=${sha}&per_page=100`;
    const response = await fetcher(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Quality API returned HTTP ${response.status}`);
    if (qualityState((await response.json()).workflow_runs, sha, repository) === 'success') return;
    if (i + 1 < attempts) await sleep(30000);
  }
  throw new Error('Quality gate did not succeed within the bounded wait');
}

async function main() {
  const [manifest, workflow] = process.argv.slice(2);
  const env = process.env;
  const intent = releaseIntent({ event: JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8')), eventName: env.GITHUB_EVENT_NAME, sha: env.GITHUB_SHA, ref: env.GITHUB_REF, manifest });
  console.log(`Server version ${intent.before} -> ${intent.version}: ${intent.deploy ? 'waiting for quality' : 'no deployment'}`);
  if (intent.deploy) await waitForQuality({ repository: env.GITHUB_REPOSITORY, workflow, sha: intent.sha, token: env.GH_TOKEN, api: env.GITHUB_API_URL });
  if (!env.GITHUB_OUTPUT) throw new Error('GITHUB_OUTPUT missing');
  appendFileSync(env.GITHUB_OUTPUT, `deploy=${intent.deploy}\nshould-deploy=${intent.deploy}\nserver-version=${intent.version}\n`);
  if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, `Server release: ${intent.before} → ${intent.version}; deploy=${intent.deploy}; source=${intent.sha}\n`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
