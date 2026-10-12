#!/usr/bin/env node
// Release preparation runs before the version-bump commit on mac-ci. Never
// resolve "latest" inside a build/retry: it would change the same source SHA.
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile, rename, rm, realpath } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { publishedRelease, syncDesignSystem, releasePath } from './sync-design-system.mjs';

const stable = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const compare = (a, b) => {
  const x = a.split('.').map(Number), y = b.split('.').map(Number);
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};
const digest = data => createHash('sha256').update(data).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';

export function selectStableVersion(current, metadata) {
  if (!stable.test(current)) throw new Error('Current HJM must be an exact stable version');
  const versions = Object.entries(metadata.versions ?? {})
    .filter(([version, entry]) => stable.test(version) && !entry.deprecated)
    .map(([version]) => version).sort(compare);
  const version = versions.filter(v => v.split('.')[0] === current.split('.')[0] && compare(v, current) >= 0).at(-1);
  if (!version) throw new Error('No non-deprecated stable HJM in the current major; never downgrade automatically');
  return { current, version, newerMajor: versions.at(-1)?.split('.')[0] !== current.split('.')[0] ? versions.at(-1) : null };
}

async function registryMetadata() {
  const response = await fetch('https://registry.npmjs.org/%40hjmds%2Fdesign-contracts', {
    redirect: 'error', signal: AbortSignal.timeout(30000), headers: { Accept: 'application/vnd.npm.install-v1+json' },
  });
  if (!response.ok) throw new Error(`HJM registry lookup failed: HTTP ${response.status}`);
  return response.json();
}

function git(root, args, raw = false) {
  const output = execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return raw ? output : output.trim();
}
async function hashes(root, paths) {
  return Object.fromEntries(await Promise.all(paths.map(async path => {
    try { return [path, digest(await readFile(join(root, path)))]; }
    catch (error) { if (error.code === 'ENOENT') return [path, null]; throw error; }
  })));
}
function changedPaths(root) {
  // Separate NUL-delimited names preserve paths with spaces; no porcelain slicing.
  return [...new Set(['diff', 'cached', 'untracked'].flatMap(kind => {
    const args = kind === 'untracked' ? ['ls-files', '--others', '--exclude-standard', '-z']
      : ['diff', ...(kind === 'cached' ? ['--cached'] : []), '--name-only', '-z'];
    return git(root, args, true).split('\0').filter(Boolean);
  }))];
}
function assertOwnedChanges(root, state) {
  if (git(root, ['rev-parse', 'HEAD']) !== state.baseSha) throw new Error('HEAD changed during preparation; preserve work and inspect before retrying');
  const unexpected = changedPaths(root).filter(path => !state.paths.includes(path));
  if (unexpected.length) throw new Error(`Unrelated changes preserved; not committing: ${unexpected.join(', ')}`);
}
async function saveState(file, state) {
  const temporary = `${file}.${process.pid}.tmp`;
  try { await writeFile(temporary, json(state)); await rename(temporary, file); }
  finally { await rm(temporary, { force: true }); }
}

function run(command, args, root) {
  // Dependency checks must exercise the published package even when invoked
  // from a developer shell that still carries the source flag.
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit',
    env: { ...process.env, HJM_LOCAL_SOURCE: '0', CI: 'true' },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed; pinned preparation is retained for --resume`);
}

export async function prepareHjmRelease({ root = process.cwd(), write = false, resume = false,
  metadata = registryMetadata, loadRelease = publishedRelease, execute = run, pnpmVersion = toolVersion } = {}) {
  root = await realpath(resolve(root));
  if (git(root, ['branch', '--show-current']) !== 'main') throw new Error('Prepare HJM on the existing main checkout');
  if (git(root, ['rev-parse', '--show-toplevel']) !== root) throw new Error('Run from the product repository root');
  const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  if (!/^pnpm@\d+\.\d+\.\d+$/.test(manifest.packageManager ?? '')) throw new Error('A pinned pnpm packageManager is required');
  if (!manifest.scripts?.['check:hjm-release']) throw new Error('Product must define check:hjm-release for its affected web/native surfaces');
  // HJM token generation may legitimately update tracked product CSS. Products
  // explicitly name those outputs; arbitrary build side effects remain excluded.
  const generatedPaths = manifest.hjmRelease?.generatedPaths ?? [];
  if (!Array.isArray(generatedPaths) || generatedPaths.some(path => typeof path !== 'string' || !/^(?:[\w-]+\/)*[\w.-]+$/.test(path) || path.split('/').some(part => part === '.' || part === '..' || part.startsWith('.'))))
    throw new Error('Invalid HJM generatedPaths');
  for (const path of generatedPaths) git(root, ['ls-files', '--error-unmatch', '--', path]);
  const stateFile = resolve(root, git(root, ['rev-parse', '--git-path', 'hjm-release-preparation.json']));
  let previous;
  try { previous = JSON.parse(await readFile(stateFile, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  let state;
  if (resume) {
    if (!previous) throw new Error('No pinned preparation to resume');
    if (previous.phase === 'complete') {
      if (git(root, ['rev-parse', 'HEAD']) !== previous.sourceSha || changedPaths(root).length) throw new Error('Completed preparation no longer matches the checkout');
      return { action: 'already-prepared', version: previous.version, sourceSha: previous.sourceSha };
    }
    state = previous;
    assertOwnedChanges(root, state);
    if (JSON.stringify(await hashes(root, state.paths)) !== JSON.stringify(state.hashes))
      throw new Error('Preparation files changed since the last checkpoint; preserve edits and inspect before resuming');
    write = true;
  } else {
    if (previous && previous.phase !== 'complete') throw new Error('An unfinished preparation is pinned; use --resume instead of selecting a newer release');
    if (write && changedPaths(root).length) throw new Error('Working tree must be clean before release preparation; existing changes are preserved');
    const current = JSON.parse(await readFile(join(root, releasePath), 'utf8')).version;
    const selection = selectStableVersion(current, await metadata());
    // Import checks all three tarballs, integrity and the canonical Git tag.
    // An incomplete release fails; it never falls back to an older train.
    const bundle = await loadRelease(selection.version);
    if (bundle.release.version !== selection.version) throw new Error('Resolved HJM differs from selected stable version');
    const plan = await syncDesignSystem({ appRoot: root, version: selection.version, loadRelease: async () => bundle });
    if (!write) return { action: 'plan', ...selection, paths: [...plan.updates.map(x => x.path), 'pnpm-lock.yaml', ...generatedPaths], checks: manifest.scripts['check:hjm-release'] };
    // Save the exact artifact record before the first mutation. Retry never
    // queries latest again, even when the registry has published another version.
    state = { schemaVersion: 1, ...selection, baseSha: git(root, ['rev-parse', 'HEAD']), phase: 'selected', bundle,
      generatedPaths, paths: [...new Set([...plan.updates.map(x => x.path), 'pnpm-lock.yaml', ...generatedPaths])] };
    state.hashes = await hashes(root, state.paths);
    await saveState(stateFile, state);
  }
  try {
    assertOwnedChanges(root, state);
    const actualPnpm = pnpmVersion(root);
    if (actualPnpm !== manifest.packageManager.slice(5)) throw new Error('pnpm does not match packageManager');
    if (state.phase === 'selected') {
      await syncDesignSystem({ appRoot: root, version: state.version, write: true, loadRelease: async () => state.bundle });
      state.phase = 'imported';
      state.hashes = await hashes(root, state.paths);
      await saveState(stateFile, state);
    }
    if (state.phase === 'imported') {
      await execute('pnpm', ['install', '--lockfile-only', '--ignore-scripts'], root);
      state.phase = 'locked';
      state.hashes = await hashes(root, state.paths);
      await saveState(stateFile, state);
    }
    await execute('pnpm', ['install', '--frozen-lockfile'], root);
    const inputPaths = state.paths.filter(path => !state.generatedPaths.includes(path));
    const inputs = await hashes(root, inputPaths);
    await execute('pnpm', ['run', 'check:hjm-release'], root);
    assertOwnedChanges(root, state);
    if (JSON.stringify(await hashes(root, inputPaths)) !== JSON.stringify(inputs)) throw new Error('Release inputs changed during checks; no commit created');
    // Only our explicit paths enter the commit; another session's staged files
    // are never swept into this release preparation.
    const paths = changedPaths(root);
    if (paths.length) {
      git(root, ['add', '--', ...paths]);
      git(root, ['commit', '--only', '-m', `chore: prepare HJM ${state.version} for release`, '--', ...paths]);
    }
    state.phase = 'complete';
    state.sourceSha = git(root, ['rev-parse', 'HEAD']);
    state.hashes = await hashes(root, state.paths);
    await saveState(stateFile, state);
    return { action: 'prepared', version: state.version, newerMajor: state.newerMajor, sourceSha: state.sourceSha,
      next: 'Prepare the product version on mac-ci, commit and push through the existing release pipeline. Build retries reuse that SHA without running preparation again.' };
  } catch (error) {
    // Failed checks retain their exact version and edits; no reset/stash or push.
    state.hashes = await hashes(root, state.paths);
    await saveState(stateFile, state);
    throw error;
  }
}

function toolVersion(root) {
  return execFileSync('pnpm', ['--version'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const options = {};
  try {
    for (const arg of process.argv.slice(2)) {
      if (arg === '--write') options.write = true;
      else if (arg === '--resume') options.resume = true;
      else throw new Error('Usage: node tools/prepare-hjm-release.mjs [--write] [--resume]');
    }
    console.log(json(await prepareHjmRelease(options)));
  } catch (error) { console.error(`HJM release preparation: ${error.message}`); process.exitCode = 1; }
}
