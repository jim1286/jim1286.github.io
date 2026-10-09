#!/usr/bin/env node
// Candidate packages are disposable integration inputs, never release records.
// See NEW_APP_DEVELOPMENT_GUIDE §4: keep the published baseline and fail release
// checks while an overlay exists, instead of teaching production to accept file:.
import { execFile, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile, lstat } from 'node:fs/promises';
import { dirname, join, resolve, relative } from 'node:path';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';

const exec = promisify(execFile);
const names = ['@hjmds/design-contracts', '@hjmds/react', '@hjmds/react-native'];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const json = value => `${JSON.stringify(value, null, 2)}\n`;
const exactSha = value => /^[a-f0-9]{40}$/.test(value ?? '') && !/^0+$/.test(value);
const run = (argv, cwd) => new Promise((ok, fail) => {
  const child = spawn(argv[0], argv.slice(1), { cwd, stdio: 'inherit', env: process.env });
  child.on('error', fail);
  child.on('exit', (code, signal) => code === 0 ? ok() : fail(new Error(`${argv.join(' ')} failed (${code ?? signal})`)));
});

export async function packCandidate(source, output, expectedSha) {
  if (!exactSha(expectedSha)) throw new Error('HJM candidate requires a full nonzero commit SHA');
  source = resolve(source); output = resolve(output);
  const actual = (await exec('git', ['rev-parse', 'HEAD'], { cwd: source })).stdout.trim();
  if (actual !== expectedSha) throw new Error('HJM checkout does not match the requested SHA');
  if ((await exec('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: source })).stdout.trim())
    throw new Error('Pack a clean HJM checkout; commit source changes before candidate CI');
  await mkdir(output, { recursive: true });
  const packages = [];
  for (const name of names) {
    const cwd = join(source, 'packages', name.split('/')[1]);
    const manifest = JSON.parse(await readFile(join(cwd, 'package.json'), 'utf8'));
    if (manifest.name !== name) throw new Error(`Wrong candidate package: ${name}`);
    // Build is an explicit preceding step. npm pack avoids pnpm's prepack rebuilding
    // contracts after renderers have already consumed them.
    const { stdout } = await exec('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', output], { cwd, maxBuffer: 5 * 1024 * 1024 });
    const [{ filename }] = JSON.parse(stdout);
    const bytes = await readFile(join(output, filename));
    packages.push({ name, version: manifest.version, filename, sha256: digest(bytes) });
  }
  if (new Set(packages.map(p => p.version)).size !== 1) throw new Error('Candidate HJM packages must use the same version');
  const receipt = { schemaVersion: 1, kind: 'hjm-unpublished-candidate', sourceCommit: actual, packages };
  await writeFile(join(output, 'candidate.json'), json(receipt));
  return receipt;
}

async function manifests(root, directory = '') {
  const results = [];
  for (const entry of await readdir(join(root, directory), { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ['node_modules', 'vendor', 'dist', 'build', 'coverage'].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) results.push(...await manifests(root, path));
    else if (entry.name === 'package.json') {
      if (entry.isSymbolicLink()) throw new Error('Preview refuses symlink package manifests');
      results.push(path);
    }
  }
  return results;
}

export async function applyCandidate(root, artifacts, expectedSha) {
  root = resolve(root); artifacts = resolve(artifacts);
  if (!exactSha(expectedSha)) throw new Error('Expected candidate SHA is required');
  const receipt = JSON.parse(await readFile(join(artifacts, 'candidate.json'), 'utf8'));
  if (receipt.schemaVersion !== 1 || receipt.kind !== 'hjm-unpublished-candidate' || receipt.sourceCommit !== expectedSha
    || !Array.isArray(receipt.packages) || receipt.packages.length !== 3
    || new Set(receipt.packages.map(p => p.name)).size !== 3
    || new Set(receipt.packages.map(p => p.version)).size !== 1) throw new Error('Invalid candidate receipt');
  const overrides = {};
  for (const p of receipt.packages) {
    if (!names.includes(p.name) || !/^[a-zA-Z0-9._-]+\.tgz$/.test(p.filename)
      || !/^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$/.test(p.version)) throw new Error('Invalid candidate package');
    const archive = join(artifacts, p.filename);
    if (!(await lstat(archive)).isFile() || digest(await readFile(archive)) !== p.sha256) throw new Error('Candidate archive digest mismatch');
    const { stdout } = await exec('tar', ['-xOf', archive, 'package/package.json'], { maxBuffer: 1024 * 1024 });
    const manifest = JSON.parse(stdout);
    if (manifest.name !== p.name || manifest.version !== p.version) throw new Error('Candidate archive identity mismatch');
    overrides[p.name] = `file:${archive}`;
  }
  const updates = [];
  for (const path of await manifests(root)) {
    const manifest = JSON.parse(await readFile(join(root, path), 'utf8'));
    let changed = false;
    for (const field of ['dependencies', 'devDependencies', 'optionalDependencies']) {
      for (const name of names) if (manifest[field]?.[name] !== undefined) {
        manifest[field][name] = overrides[name]; changed = true;
      }
    }
    if (changed) updates.push([path, json(manifest)]);
  }
  if (!updates.length) throw new Error('This app has no HJM npm consumers');
  // pnpm overrides also replace HJM peers/transitive references, so renderers
  // cannot accidentally consume the published contracts beside the candidate.
  const workspacePath = join(root, 'pnpm-workspace.yaml');
  if (!(await lstat(workspacePath)).isFile()) throw new Error('Expected regular pnpm workspace');
  const { stdout: configured } = await exec('pnpm', ['config', 'get', '--json', 'overrides'], { cwd: root });
  const existing = !configured.trim() || configured.trim() === 'undefined' ? {} : JSON.parse(configured);
  // Refuse a shared dirty working tree; CI uses a fresh disposable checkout.
  if ((await exec('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: root })).stdout.trim())
    throw new Error('Candidate overlay requires a clean disposable app checkout');
  await writeFile(join(root, '.hjm-preview.json'), json({ ...receipt, appCommit: (await exec('git', ['rev-parse', 'HEAD'], { cwd: root })).stdout.trim() }), { flag: 'wx' });
  for (const [path, source] of updates) await writeFile(join(root, path), source);
  await exec('pnpm', ['config', 'set', '--location=project', '--json', 'overrides', JSON.stringify({ ...existing, ...overrides })], { cwd: root });
  return { kind: receipt.kind, sourceCommit: expectedSha, manifests: updates.map(([path]) => path) };
}

export async function candidateBaseline(root) {
  root = resolve(root);
  const { designReleaseContext } = await import(pathToFileURL(join(root, 'tools/app-standard-core.mjs')));
  const bundle = designReleaseContext(await readFile(join(root, 'docs/profiles/hjm-release.json'), 'utf8'),
    await readFile(join(root, 'docs/profiles/hjm-catalog.snapshot.json'), 'utf8'));
  const contract = JSON.parse(await readFile(join(root, 'app.contract.json'), 'utf8'));
  if (contract.designSystem?.contracts?.version !== bundle.release.version) throw new Error('Baseline HJM contract/release mismatch');
  return { scope: 'published-baseline-identity', version: bundle.release.version };
}

export async function candidateChecks(root, mode = 'fast') {
  if (!['fast', 'full'].includes(mode)) throw new Error('Choose fast or full candidate checks');
  root = resolve(root);
  const receipt = JSON.parse(await readFile(join(root, '.hjm-preview.json'), 'utf8'));
  if (receipt.kind !== 'hjm-unpublished-candidate') throw new Error('Candidate overlay required');
  const contract = JSON.parse(await readFile(join(root, 'app.contract.json'), 'utf8'));
  if (contract.runtimes.some(r => r.framework === 'flutter')) throw new Error('HJM npm preview does not support Flutter');
  const roles = mode === 'fast' ? ['typecheck', 'test'] : ['typecheck', 'test', 'build'];
  const runtimes = mode === 'fast' ? contract.runtimes.filter(r => ['mobile', 'web'].includes(r.kind)) : contract.runtimes;
  if (!runtimes.length) throw new Error('No frontend runtimes selected');
  if (contract.execution?.model === 'runtime-bindings-v1') {
    const { initializeFixtureAssets } = await import(pathToFileURL(join(root, 'tools/runtime-bindings.mjs')));
    for (const runtime of runtimes) {
      const cwd = resolve(root, runtime.root);
      if (relative(root, cwd).startsWith('..')) throw new Error('Runtime root escapes app');
      await initializeFixtureAssets(root, runtime);
      if (runtime.binding.prepare) await run(runtime.binding.prepare, cwd);
    }
    // Baseline contract/design checks ran before the overlay. Execute the actual
    // product commands here; runBoundQuality would reject intentional file: specs.
    // Honor the selected mode: fast feedback must not pay for bound builds.
    for (const role of roles) for (const runtime of runtimes) {
      await run(runtime.binding.checks[role], resolve(root, runtime.root));
    }
  } else {
    const filters = [];
    if (mode === 'fast') for (const runtime of runtimes) {
      const manifest = JSON.parse(await readFile(join(root, runtime.root, 'package.json'), 'utf8'));
      if (!manifest.name || roles.some(role => !manifest.scripts?.[role])) throw new Error('Frontend must declare typecheck and test scripts');
      filters.push('--filter', `${manifest.name}...`);
    }
    for (const role of roles) await run(['pnpm', ...filters, 'run', role], root);
  }
  return { scope: mode === 'fast' ? 'candidate-frontend-typecheck-test' : 'candidate-typecheck-test-build', releaseEligible: false, sourceCommit: receipt.sourceCommit };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [command, ...args] = process.argv.slice(2);
  try {
    let result;
    if (command === 'pack' && args.length === 3) result = await packCandidate(...args);
    else if (command === 'apply' && args.length === 3) result = await applyCandidate(...args);
    else if (command === 'baseline' && args.length === 1) result = await candidateBaseline(...args);
    else if (command === 'check' && [1, 2].includes(args.length)) result = await candidateChecks(...args);
    else throw new Error('Usage: hjm-preview.mjs pack SOURCE OUTPUT SHA | apply APP ARTIFACTS SHA | baseline APP | check APP [fast|full]');
    console.log(json(result));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
