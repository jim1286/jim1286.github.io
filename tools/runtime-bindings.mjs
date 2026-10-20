// Framework adapters for the shared v1 contract. No product-ID exceptions.
import { readFile, lstat } from 'node:fs/promises';
import { resolve, relative, dirname, basename } from 'node:path';
import { createRequire } from 'node:module';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
import { pathToFileURL } from 'node:url';

export const bindingRoles = ['typecheck', 'test', 'build'];
const frameworks = { expo: ['mobile', 'expo'], nextjs: ['web', 'next'], vite: ['web', 'vite'],
  nestjs: ['server', '@nestjs/core'], node: ['server', null] };
export const bound = (contract) => contract?.execution?.model === 'runtime-bindings-v1';
const safePath = (path) => typeof path === 'string' && (path === '.' || (path.split('/').every((part) => part !== '.' && part !== '..') && /^[A-Za-z0-9._-][A-Za-z0-9._-]*(?:\/[A-Za-z0-9._-]+)*$/.test(path)));
const fail = (findings, code, path, message) => findings.push({ code, path, message });
export function bindingScripts() {
  return Object.fromEntries([...bindingRoles, 'check'].map((role) => [`standard:${role}`, `node tools/run-quality.mjs ${role}`]));
}
export function validateBindings(contract, findings) {
  const ids = new Set();
  const roots = new Set();
  for (const [index, runtime] of (contract.runtimes ?? []).entries()) {
    const path = `runtimes[${index}]`;
    const adapter = frameworks[runtime.framework];
    if (!adapter || adapter[0] !== runtime.kind) fail(findings, 'RUNTIME_ADAPTER_INVALID', path, 'Unsupported framework/kind binding.');
    if (!safePath(runtime.root) || roots.has(runtime.root)) fail(findings, 'RUNTIME_ROOT_INVALID', path, 'Runtime roots must be unique, normalized repository paths.');
    roots.add(runtime.root);
    if (!/^[a-z][a-z0-9-]*$/.test(runtime.id) || ids.has(runtime.id)) fail(findings, 'RUNTIME_ID_INVALID', path, 'Runtime IDs must be unique.');
    ids.add(runtime.id);
    if (!/^\d+\.\d+\.\d+$/.test(runtime.frameworkVersion)) fail(findings, 'RUNTIME_VERSION_INVALID', path, 'Record the exact resolved framework version.');
    const b = runtime.binding;
    if (!b || !safePath(b.manifest) || !safePath(b.lockfile) || !Array.isArray(b.entryPoints) || !b.entryPoints.length
      || b.entryPoints.some((p) => !safePath(p))) fail(findings, 'RUNTIME_BINDING_INVALID', path, 'Manifest, frozen lockfile and real entry points are required.');

    if (b?.manifest !== 'package.json') fail(findings, 'RUNTIME_MANIFEST_INVALID', path, 'JS runtimes must bind package.json.');
    if (b?.prepare && (!Array.isArray(b.prepare) || !['pnpm'].includes(b.prepare[0]) || b.prepare.some((arg) => typeof arg !== 'string' || /[\n\r\0]/.test(arg))))
      fail(findings, 'RUNTIME_PREPARE_INVALID', path, 'Preparation must be explicit argv.');
    if (b?.fixtures?.length) fail(findings, 'RUNTIME_FIXTURE_INVALID', path, 'Runtime fixture initialization is retired.');
    for (const role of bindingRoles) {
      const argv = b?.checks?.[role];
      if (!Array.isArray(argv) || !argv.length || !['pnpm', 'node'].includes(argv[0])
        || argv.some((arg) => typeof arg !== 'string' || /[\n\r\0]/.test(arg))
        || argv.some((arg) => ['--if-present', '--passWithNoTests', '--watch', '--fix', '-e', '--eval'].includes(arg))) {
        fail(findings, 'RUNTIME_CHECK_INVALID', `${path}.binding.checks.${role}`, 'Every runtime needs explicit non-optional, non-mutating argv checks.');
      }
    }
  }
  if (contract.execution?.model !== 'runtime-bindings-v1') fail(findings, 'EXECUTION_MODEL_INVALID', 'execution', 'Unknown execution model.');
}

async function regular(root, path, directory = false) {
  if (!safePath(path)) throw new Error(`Unsafe path: ${path}`);
  const absolute = resolve(root, path);
  const rel = relative(root, absolute);
  if (rel.startsWith('..')) throw new Error(`Path escapes repository: ${path}`);
  let current = root;
  for (const piece of rel.split('/').filter(Boolean)) {
    current = resolve(current, piece);
    const stat = await lstat(current);
    if (stat.isSymbolicLink()) throw new Error(`Symlink in contract path: ${path}`);
  }
  const stat = await lstat(absolute);
  if (directory ? !stat.isDirectory() : !stat.isFile()) throw new Error(`Wrong file type: ${path}`);
  return absolute;
}
export function yamlParser(root) {
  const base = basename(import.meta.dirname) === 'scripts'
    ? resolve(import.meta.dirname, 'library-policy-tools/package.json') : resolve(root, 'package.json');
  return createRequire(base)('yaml');
}

function evidenceReferences(contract, runtime, findings, implementationGate) {
  const declared = new Map((contract.acceptance?.evidence ?? []).map((entry) => [entry.id, entry]));
  for (const id of runtime.binding.evidenceIds ?? []) {
    if (!declared.has(id)) fail(findings, 'RUNTIME_EVIDENCE_MISSING', `runtimes.${runtime.id}`, `Unknown evidence: ${id}`);
    else if (implementationGate && declared.get(id).status !== 'verified')
      fail(findings, 'RUNTIME_EVIDENCE_NOT_VERIFIED', `runtimes.${runtime.id}`, `Runtime evidence ${id} is not verified`);
  }
  if (!(runtime.binding.evidenceIds?.length)) fail(findings, 'RUNTIME_EVIDENCE_REQUIRED', `runtimes.${runtime.id}`, 'Declare runtime verification evidence, planned until actually verified.');
}

export async function checkBindings(root, contract, findings, release, { implementationGate = false } = {}) {
  let yaml;
  try { yaml = yamlParser(root); } catch (error) {
    fail(findings, 'RUNTIME_PARSER_MISSING', 'package.json', `Install the declared frozen tooling dependencies: ${error.message}`); return;
  }
  const rootManifest = JSON.parse(await readFile(await regular(root, 'package.json'), 'utf8'));
  if (rootManifest.private !== true || rootManifest.packageManager !== `pnpm@${contract.toolchain.packageManager.version}`)
    fail(findings, 'RUNTIME_TOOLCHAIN_MISMATCH', 'package.json', 'Private workspace and exact packageManager required');
  for (const [key, value] of Object.entries(contract.toolchain.scripts)) {
    if (rootManifest.scripts?.[key] !== value) fail(findings, 'PACKAGE_SCRIPT_MISMATCH', `package.json.scripts.${key}`, `Expected ${value}`);
  }
  for (const runtime of contract.runtimes) {
    const label = `runtimes.${runtime.id}`;
    evidenceReferences(contract, runtime, findings, implementationGate);
    try {
      const cwd = await regular(root, runtime.root, true);
      const manifestPath = await regular(root, relative(root, resolve(cwd, runtime.binding.manifest)));
      const lockPath = await regular(root, runtime.binding.lockfile);
      for (const fixture of runtime.binding.fixtures ?? []) await regular(root, relative(root, resolve(cwd, fixture.source)));
      const manifestText = await readFile(manifestPath, 'utf8');
      const lock = yaml.parse(await readFile(lockPath, 'utf8'));
      for (const entry of runtime.binding.entryPoints) await regular(root, relative(root, resolve(cwd, entry)));

        const manifest = JSON.parse(manifestText);
        const packageName = frameworks[runtime.framework]?.[1];
        const importerId = relative(dirname(lockPath), cwd) || '.';
        const importer = lock.importers?.[importerId];
        if (!importer) throw new Error(`No lockfile importer for ${importerId}`);
        const verifyPackage = (name, expected, direct = false) => {
          const spec = manifest.dependencies?.[name] ?? (!direct ? manifest.devDependencies?.[name] : undefined);
          const locked = importer.dependencies?.[name] ?? (!direct ? importer.devDependencies?.[name] : undefined);
          if (!locked || locked.specifier !== spec || locked.version?.split('(')[0] !== expected)
            throw new Error(`Manifest/importer mismatch for ${name}@${expected} in ${importerId}`);
          const resolved = lock.packages?.[`${name}@${expected}`];
          if (!/^sha512-[A-Za-z0-9+/]+={0,2}$/.test(resolved?.resolution?.integrity ?? ''))
            throw new Error(`Missing registry integrity for ${name}@${expected}`);
          return resolved;
        };
        if (packageName) {
          const spec = manifest.dependencies?.[packageName] ?? manifest.devDependencies?.[packageName];
          if (spec !== runtime.binding.frameworkSpecifier) throw new Error(`Framework declaration differs: ${packageName}`);
          verifyPackage(packageName, runtime.frameworkVersion);
        } else if (runtime.frameworkVersion !== contract.toolchain.node) throw new Error('Node runtime version differs from the toolchain');
        if (['expo', 'nextjs', 'vite'].includes(runtime.framework)) {
          const renderer = runtime.framework === 'expo' ? '@hjmds/react-native' : '@hjmds/react';
          for (const name of ['@hjmds/design-contracts', renderer]) {
            if (manifest.dependencies?.[name] !== release.version) throw new Error(`${name} must be direct exact ${release.version}`);
            const installed = verifyPackage(name, release.version, true);
            const published = release.packages[name];
            if (installed.resolution.integrity !== published?.integrity) throw new Error(`${name} integrity differs from the central release`);
          }
        }
        for (const [role, argv] of Object.entries(runtime.binding.checks)) {
          if (argv[0] === 'pnpm' && argv[1] === 'run') {
            const script = manifest.scripts?.[argv[2]];
            if (!script || /(?:^|[;&|])\s*(?:echo|true|exit\s+0)\b|passWithNoTests|--if-present|--fix|run-quality\.mjs/.test(script))
              throw new Error(`Missing, optional, mutating or vacuous ${role} script: ${argv[2]}`);
          }
        }

    } catch (error) { fail(findings, 'RUNTIME_BINDING_MISMATCH', label, error.message); }
  }
}

export function boundQualitySteps(contract, role, { runtimeIds = [] } = {}) {
  if (!['check', ...bindingRoles].includes(role)) throw new Error('Choose check, typecheck, test or build');
  for (const id of runtimeIds) if (!contract.runtimes.some(runtime => runtime.id === id)) throw new Error(`Unknown runtime: ${id}`);
  const runtimes = contract.runtimes.filter(runtime => !runtimeIds.length || runtimeIds.includes(runtime.id));
  // The retired quality CI no longer owns automatic scope or skipped builds.
  // Each invocation explicitly selects a role or the full local audit.
  const targets = role === 'check' ? bindingRoles : [role];
  return targets.flatMap(target => runtimes.map(runtime => ({ runtime, target })));
}

// Local checks tolerate patch/minor updates within the declared major; CI remains
// exact for reproducibility. Rejecting every local patch blocked unrelated edits.
export function assertToolchainVersion(name, actual, expected, strict) {
  if (actual === expected) return;
  if (strict || !/^\d+\.\d+\.\d+$/.test(actual) || !/^\d+\.\d+\.\d+$/.test(expected) || actual.split('.')[0] !== expected.split('.')[0])
    throw new Error(`Use ${name} ${expected}; current ${actual}`);
  console.warn(`${name} ${actual}: local compatible major; CI uses ${expected}`);
}

export async function runBoundQuality(root, role, options = {}) {
  const contract = JSON.parse(await readFile(resolve(root, 'app.contract.json'), 'utf8'));
  const strict = Boolean(process.env.CI && process.env.CI !== 'false') || process.env.GITHUB_ACTIONS === 'true';
  assertToolchainVersion('Node', process.versions.node, contract.toolchain.node, strict);
  const pnpmVersion = (await execFileAsync('pnpm', ['--version'], { cwd: root })).stdout.trim();
  assertToolchainVersion('pnpm', pnpmVersion, contract.toolchain.packageManager.version, strict);
  const steps = boundQualitySteps(contract, role, options);
  const selectedRuntimes = [...new Set(steps.map(step => step.runtime))];
  // A direct scoped check validates the selected binding, not an unrelated runtime under repair.
  const findings = []; validateBindings({ ...contract, runtimes: selectedRuntimes }, findings);
  if (findings.length) throw new Error(JSON.stringify(findings));
  const run = async (argv, cwd) => new Promise((resolveResult, reject) => {
    const child = spawn(argv[0], argv.slice(1), { cwd, stdio: 'inherit', shell: false });
    child.on('error', reject); child.on('exit', (code, signal) => code === 0 ? resolveResult() : reject(new Error(`Command failed (${code ?? signal}): ${argv.join(' ')}`)));
  });
  // Direct typecheck/test/build must remain usable while governance edits are in progress.
  if (role === 'check') await run([process.execPath, 'tools/check-app-contract.mjs'], root);
  if (role === 'check') await run([process.execPath, 'tools/check-doc-links.mjs', ...(strict ? [] : ['--changed'])], root);
  for (const runtime of selectedRuntimes) {
    const cwd = await regular(root, runtime.root, true);

    if (runtime.binding.prepare) { console.log(`[${runtime.id}] prepare`); await run(runtime.binding.prepare, cwd); }
  }
  for (const { runtime, target } of steps) {
    const cwd = await regular(root, runtime.root, true);
    const argv = runtime.binding.checks[target];
    console.log(`[${runtime.id}] ${target}`);
    await run(argv, cwd);
  }
}

export function qualityOptions(args) {
  return { runtimeIds: args.map(argument => {
    if (!argument.startsWith('--runtime=') || !argument.slice(10)) throw new Error(`Unknown argument: ${argument}`);
    return argument.slice(10);
  }) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { await runBoundQuality(resolve(import.meta.dirname, '..'), process.argv[2] ?? 'check', qualityOptions(process.argv.slice(3))); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
