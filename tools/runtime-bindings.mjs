// Framework adapters for the shared v1 contract. No product-ID exceptions.
import { readFile, lstat, copyFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve, relative, dirname, basename } from 'node:path';
import { createRequire } from 'node:module';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
import { pathToFileURL } from 'node:url';

export const bindingRoles = ['lint', 'typecheck', 'test', 'build'];
const frameworks = { expo: ['mobile', 'expo'], nextjs: ['web', 'next'], vite: ['web', 'vite'],
  nestjs: ['server', '@nestjs/core'], node: ['server', null], flutter: ['mobile', null] };
export const bound = (contract) => contract?.execution?.model === 'runtime-bindings-v1';
const safePath = (path) => typeof path === 'string' && (path === '.' || (path.split('/').every((part) => part !== '.' && part !== '..') && /^[A-Za-z0-9._-][A-Za-z0-9._-]*(?:\/[A-Za-z0-9._-]+)*$/.test(path)));
const fail = (findings, code, path, message) => findings.push({ code, path, message });
export function bindingScripts() {
  return Object.fromEntries(['lint', 'typecheck', 'test', 'build', 'check'].map((role) => [`standard:${role}`, `node tools/run-quality.mjs ${role}`]));
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
    if (runtime.framework === 'flutter' && b?.manifest !== 'pubspec.yaml') fail(findings, 'RUNTIME_MANIFEST_INVALID', path, 'Flutter must bind pubspec.yaml.');
    if (runtime.framework !== 'flutter' && b?.manifest !== 'package.json') fail(findings, 'RUNTIME_MANIFEST_INVALID', path, 'JS runtimes must bind package.json.');
    if (b?.prepare && (!Array.isArray(b.prepare) || !['pnpm', 'dart'].includes(b.prepare[0]) || b.prepare.some((arg) => typeof arg !== 'string' || /[\n\r\0]/.test(arg))))
      fail(findings, 'RUNTIME_PREPARE_INVALID', path, 'Preparation must be explicit argv.');
    for (const fixture of Array.isArray(b?.fixtures) ? b.fixtures : []) {
      if (runtime.framework !== 'flutter' || fixture.source !== '.env.example' || !/^\.env(?:\.(?:development|production|test))?$/.test(fixture.target))
        fail(findings, 'RUNTIME_FIXTURE_INVALID', path, 'Only Flutter example environment assets may be initialized without overwriting existing files.');
    }
    for (const role of bindingRoles) {
      const argv = b?.checks?.[role];
      if (!Array.isArray(argv) || !argv.length || !['pnpm', 'flutter', 'dart', 'node'].includes(argv[0])
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
function yamlParser(root) {
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
      if (runtime.framework !== 'flutter') {
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
      } else {
        const manifest = yaml.parse(manifestText);
        if (manifest.dependencies?.flutter?.sdk !== 'flutter' || !lock.sdks?.flutter) throw new Error('Flutter manifest/lock must declare Flutter');
        const pin = JSON.parse(await readFile(await regular(root, relative(root, resolve(cwd, '.fvmrc'))), 'utf8'));
        if (pin.flutter !== runtime.frameworkVersion) throw new Error('Flutter SDK pin differs from runtime contract');
        try {
          const releaseConfig = JSON.parse(await readFile(await regular(root, '.release-hub/app.json'), 'utf8'));
          if (releaseConfig.flutter?.version && releaseConfig.flutter.version !== pin.flutter) throw new Error('Flutter SDK pin differs from release tooling');
        } catch (error) { if (error.code !== 'ENOENT') throw error; }
        if (!runtime.binding.designSources?.length) throw new Error('Flutter design adapter sources must be bound, not marked exempt');
        for (const entry of runtime.binding.designSources) await regular(root, relative(root, resolve(cwd, entry)));
      }
    } catch (error) { fail(findings, 'RUNTIME_BINDING_MISMATCH', label, error.message); }
  }
}

export function bindingWorkflow(contract) {
  const appRoot = contract.app.id;
  const inCheckout = (path) => path === '.' ? appRoot : `${appRoot}/${path}`;
  const flutter = contract.runtimes.find((r) => r.framework === 'flutter');
  const installs = [...new Set(['.', ...contract.runtimes.filter((r) => r.framework !== 'flutter').map((r) => r.binding.lockfile.replace(/(?:^|\/)pnpm-lock\.yaml$/, '') || '.')])];
  return `name: App standard quality\non:\n  pull_request:\n  push:\n    branches: [main]\npermissions:\n  contents: read\nconcurrency:\n  group: app-standard-${appRoot}-\${{ github.ref }}\n  cancel-in-progress: true\njobs:\n  quality:\n    # 기본은 hosted. 저장소 변수 CI_RUNNER를 설정한 저장소만 self-hosted로 간다.\n    # 비워 두면 오늘과 동일하다. 켜기 전에 러너 여유 메모리와 이 게이트의 빌드\n    # 피크를 비교한다(2026-09-10 실측 Next 피크 2358MB). public 저장소에는\n    # 설정하지 않는다 - 포크 PR이 그 머신에서 코드를 실행한다.\n    runs-on: \${{ vars.CI_RUNNER || 'ubuntu-latest' }}\n    timeout-minutes: 30\n    defaults:\n      run:\n        working-directory: ${appRoot}\n    steps:\n      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1\n        with:\n          persist-credentials: false\n          path: ${appRoot}\n      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020\n        with:\n          node-version-file: ${appRoot}/.nvmrc\n      - run: corepack enable\n      - run: corepack prepare pnpm@11.24.0 --activate\n${flutter ? `      - name: Install pinned Flutter SDK\n        run: |\n          git clone --depth 1 --branch "$(node -p 'JSON.parse(require("fs").readFileSync("${flutter.root}/.fvmrc", "utf8")).flutter')" https://github.com/flutter/flutter.git "$RUNNER_TEMP/flutter"\n          echo "$RUNNER_TEMP/flutter/bin" >> "$GITHUB_PATH"\n` : ''}${installs.map((cwd) => `      - run: pnpm install --frozen-lockfile\n        working-directory: ${inCheckout(cwd)}\n`).join('')}${contract.runtimes.filter((r) => r.framework === 'flutter').map((r) => `      - run: flutter pub get --enforce-lockfile\n        working-directory: ${inCheckout(r.root)}\n`).join('')}      - name: Contract and CI runtime checks (Flutter builds run locally)\n        run: node tools/run-quality.mjs check-ci\n`;
}

export async function initializeFixtureAssets(root, runtime) {
  const cwd = await regular(root, runtime.root, true);
  for (const fixture of runtime.binding.fixtures ?? []) {
    if (runtime.framework !== 'flutter' || fixture.source !== '.env.example' || !/^\.env(?:\.(?:development|production|test))?$/.test(fixture.target))
      throw new Error('Unsupported fixture mapping');
    const source = await regular(root, relative(root, resolve(cwd, fixture.source)));
    const target = resolve(cwd, fixture.target);
    try { await copyFile(source, target, constants.COPYFILE_EXCL); }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      await regular(root, relative(root, target));
    }
  }
}

export function boundQualitySteps(contract, role) {
  if (!['check', 'check-ci', ...bindingRoles].includes(role)) throw new Error('Choose check, check-ci, lint, typecheck, test or build');
  const targets = ['check', 'check-ci'].includes(role) ? bindingRoles : [role];
  return targets.flatMap(target => contract.runtimes.map(runtime => ({
    runtime, target,
    execution: role === 'check-ci' && target === 'build' && runtime.framework === 'flutter' ? 'local-only' : 'run',
  })));
}

export async function runBoundQuality(root, role) {
  const contract = JSON.parse(await readFile(resolve(root, 'app.contract.json'), 'utf8'));
  if (process.versions.node !== contract.toolchain.node) throw new Error(`Use Node ${contract.toolchain.node}; current ${process.versions.node}`);
  const pnpmVersion = (await execFileAsync('pnpm', ['--version'], { cwd: root })).stdout.trim();
  if (pnpmVersion !== contract.toolchain.packageManager.version) throw new Error(`Use pnpm ${contract.toolchain.packageManager.version}; current ${pnpmVersion}`);
  const findings = []; validateBindings(contract, findings);
  if (findings.length) throw new Error(JSON.stringify(findings));
  const steps = boundQualitySteps(contract, role);
  if (process.env.GITHUB_ACTIONS === 'true' && steps.some(step => step.runtime.framework === 'flutter' && step.target === 'build' && step.execution === 'run'))
    throw new Error('Flutter builds run locally. Use check-ci on GitHub Actions and provide separate local build evidence.');
  const run = async (argv, cwd) => new Promise((resolveResult, reject) => {
    const child = spawn(argv[0], argv.slice(1), { cwd, stdio: 'inherit', shell: false });
    child.on('error', reject); child.on('exit', (code, signal) => code === 0 ? resolveResult() : reject(new Error(`Command failed (${code ?? signal}): ${argv.join(' ')}`)));
  });
  await run([process.execPath, 'tools/check-app-contract.mjs'], root);
  if (['check', 'check-ci'].includes(role)) await run([process.execPath, 'tools/check-doc-links.mjs'], root);
  for (const runtime of contract.runtimes) {
    const cwd = await regular(root, runtime.root, true);
    if (runtime.framework === 'flutter') {
      const sdk = JSON.parse((await execFileAsync('flutter', ['--version', '--machine'], { cwd, maxBuffer: 1024 * 1024 })).stdout);
      if (sdk.frameworkVersion !== runtime.frameworkVersion) throw new Error(`Use Flutter ${runtime.frameworkVersion}; current ${sdk.frameworkVersion}`);
    }
    await initializeFixtureAssets(root, runtime);
    if (runtime.binding.prepare) { console.log(`[${runtime.id}] prepare`); await run(runtime.binding.prepare, cwd); }
  }
  for (const { runtime, target, execution } of steps) {
    if (execution === 'local-only') {
      console.log(`[${runtime.id}] build: not run in CI; local build evidence is required separately`);
      continue;
    }
    console.log(`[${runtime.id}] ${target}`);
    await run(runtime.binding.checks[target], await regular(root, runtime.root, true));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { await runBoundQuality(resolve(import.meta.dirname, '..'), process.argv[2] ?? 'check'); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
