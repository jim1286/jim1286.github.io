#!/usr/bin/env node

// Release import is explicit and online. Normal app checks read the resulting
// committed record offline, so a registry update cannot change a past CI result.
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstat, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { runInNewContext } from 'node:vm';

const execFileAsync = promisify(execFile);
export const releasePath = 'docs/profiles/hjm-release.json';
export const catalogPath = 'docs/profiles/hjm-catalog.snapshot.json';
const examplePath = 'docs/examples/app-contract.example.json';
const repository = 'https://github.com/jim1286/hjm-design-system.git';
const packageNames = ['@hjmds/design-contracts', '@hjmds/react', '@hjmds/react-native'];
const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

function catalogDeclarations(source) {
  // HJM 1.8 hoists these imports above the data declarations. Their bindings are
  // used only by recipeRegistry; importing or stubbing recipes would widen the evaluator.
  // HJM 1.9 adds the Web-only Affix, Watermark and ColorPicker recipes the same way (2026-09-30).
  const recipeImports = new Map([
    ['affixRecipe', './affix.js'],
    ['watermarkRecipe', './watermark.js'],
    ['colorPickerRecipe', './color-picker.js'],
    ['masonryRecipe', './masonry.js'],
    ['virtualListRecipe', './virtual-list.js'],
    ['qrCodeRecipe', './qr-code-recipe.js'],
    ['thinkingOrbRecipe', './thinking-orb-recipe.js'],
  ]);
  let declarations = source;
  while (/^\s*import\b/u.test(declarations)) {
    const imported = declarations.match(/^\s*import\s+\{\s*(\w+)\s*\}\s+from\s+(["'])([^"']+)\2\s*;\s*/u);
    if (!imported || recipeImports.get(imported[1]) !== imported[3]) {
      throw new Error('Published HJM catalog has an unsupported leading import');
    }
    declarations = declarations.slice(imported[0].length);
  }
  // Keep the explicit registry boundary even if its imports were all hoisted;
  // otherwise the full module tail would execute in the catalog-only context.
  const boundary = declarations.search(/^\s*(?:import\b|(?:export\s+)?const\s+recipeRegistry\b)/m);
  return boundary === -1 ? declarations : declarations.slice(0, boundary);
}

export function verifyTarball(bytes, integrity) {
  const actual = `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
  if (actual !== integrity) throw new Error('Published HJM tarball integrity mismatch');
}

export function buildRelease({ version, packages, catalogSource, versionSource, consumerPolicySource, commit }) {
  if (!versionPattern.test(version) || !/^[a-f0-9]{40}$/.test(commit)) {
    throw new Error('HJM release needs an exact stable version and resolved Git commit');
  }
  for (const name of packageNames) {
    const entry = packages[name];
    const shortName = name.split('/')[1];
    if (entry?.version !== version
      || entry.metadataUrl !== `https://registry.npmjs.org/${encodeURIComponent(name)}/${version}`
      || entry.tarballUrl !== `https://registry.npmjs.org/${name}/-/${shortName}-${version}.tgz`
      || !/^sha512-[A-Za-z0-9+/]{86}==$/.test(entry.integrity)) {
      throw new Error(`Published HJM package mismatch: ${name}`);
    }
  }
  if (!new RegExp(`designSystemVersion\\s*=\\s*["']${version.replaceAll('.', '\\.')}["']`).test(versionSource)) {
    throw new Error('Published designSystemVersion export differs from the release');
  }
  // Evaluate only data declarations without host capabilities or dynamic code creation.
  const catalogDefinition = catalogDeclarations(catalogSource);
  const entries = JSON.parse(runInNewContext(
    `${catalogDefinition.replace(/^export /gm, '')}\nJSON.stringify(componentCatalog.map(({name,status}) => ({name,status})))`,
    Object.create(null), { timeout: 1000, contextCodeGeneration: { strings: false, wasm: false } },
  ));
  const components = entries.filter(({ status }) => status !== 'planned' && status !== 'deprecated')
    .map(({ name, status }) => ({ id: name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(), status }))
    .sort((a, b) => a.id.localeCompare(b.id, 'en'));
  if (components.length === 0 || new Set(components.map(({ id }) => id)).size !== components.length
    || components.some(({ id, status }) => !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id) || !['stable', 'beta'].includes(status))) {
    throw new Error('Published HJM catalog has invalid or duplicate active components');
  }
  const source = { repository, tag: `v${version}`, commit,
    sourcePath: 'packages/design-contracts/dist/catalog.js', contentSha256: sha256(catalogSource) };
  const catalog = { $id: `hjm.catalog-snapshot/${version}`, designSystemVersion: version, source, components };
  // Keep the established compact component-row snapshot format.
  const catalogText = json(catalog).replace(/\{\n      "id": "([^"]+)",\n      "status": "([^"]+)"\n    \}/g,
    '{ "id": "$1", "status": "$2" }');
  const release = { schemaVersion: 1, version, packages, source,
    catalog: { snapshotSource: catalogPath, generatedPath: 'docs/hjm-catalog.snapshot.json', sha256: sha256(catalogText) } };
  // The app validator accepts the companionPolicy version this release published
  // instead of a hardcoded number that went stale (2026-09-27 audit §5). Releases
  // that predate the "./consumer-policy.md" export simply omit the field.
  if (consumerPolicySource !== undefined) {
    const policyVersion = consumerPolicySource.match(/^정책 버전: \*\*((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*))\*\*$/m)?.[1];
    if (!policyVersion) throw new Error('Published HJM consumer policy has no exact policy version line');
    release.consumerPolicy = { version: policyVersion, sourcePath: 'packages/design-contracts/docs/consumer-policy.md',
      contentSha256: sha256(consumerPolicySource) };
  }
  return { release, catalogText };
}

async function getBytes(url) {
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(30000),
    headers: { Accept: 'application/json', 'User-Agent': 'app-portfolio-hjm-release-import' } });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > 20 * 1024 * 1024) throw new Error(`HJM source exceeded 20 MB: ${url}`);
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
const getJson = async (url) => JSON.parse((await getBytes(url)).toString('utf8'));

export async function publishedRelease(requestedVersion) {
  if (requestedVersion !== undefined && !versionPattern.test(requestedVersion)) {
    throw new Error('--version must be an exact stable version');
  }
  const first = await getJson(`https://registry.npmjs.org/${encodeURIComponent(packageNames[0])}/${requestedVersion ?? 'latest'}`);
  const version = first.version;
  if (!versionPattern.test(version)) throw new Error('The published HJM release is not a stable version');
  const packages = {};
  let catalogSource;
  let versionSource;
  let consumerPolicySource;
  const directory = await mkdtemp(join(tmpdir(), 'hjm-release-import-'));
  try {
    for (const name of packageNames) {
      const metadataUrl = `https://registry.npmjs.org/${encodeURIComponent(name)}/${version}`;
      const entry = name === first.name ? first : await getJson(metadataUrl);
      const tarballUrl = `https://registry.npmjs.org/${name}/-/${name.split('/')[1]}-${version}.tgz`;
      if (entry.name !== name || entry.version !== version || entry.dist?.tarball !== tarballUrl || entry.deprecated) {
        throw new Error(`HJM npm metadata is inconsistent or deprecated: ${name}`);
      }
      const bytes = await getBytes(tarballUrl);
      verifyTarball(bytes, entry.dist.integrity);
      const archive = join(directory, `${name.split('/')[1]}.tgz`);
      await writeFile(archive, bytes);
      // Read named members only; never extract package scripts into the checkout.
      const member = async (path) => (await execFileAsync('tar', ['-xOf', archive, `package/${path}`],
        { maxBuffer: 5 * 1024 * 1024, timeout: 10000 })).stdout;
      const manifest = JSON.parse(await member('package.json'));
      if (manifest.name !== name || manifest.version !== version) throw new Error(`HJM tarball manifest mismatch: ${name}`);
      packages[name] = { version, metadataUrl, tarballUrl, integrity: entry.dist.integrity };
      if (name === packageNames[0]) {
        catalogSource = await member('dist/catalog.js');
        versionSource = await member('dist/version.js');
        if (manifest.exports?.['./consumer-policy.md']) consumerPolicySource = await member('docs/consumer-policy.md');
      }
    }
    const tag = `v${version}`;
    const { stdout: refs } = await execFileAsync('git', ['ls-remote', repository, `refs/tags/${tag}`, `refs/tags/${tag}^{}`],
      { timeout: 30000, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
    const tags = new Map(refs.trim().split('\n').filter(Boolean).map((line) => {
      const [sha, ref] = line.split(/\s+/); return [ref, sha];
    }));
    const commit = tags.get(`refs/tags/${tag}^{}`) ?? tags.get(`refs/tags/${tag}`);
    if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('HJM release tag has no resolved commit');
    for (const name of packageNames) {
      const manifest = await getJson(`https://raw.githubusercontent.com/jim1286/hjm-design-system/${commit}/packages/${name.split('/')[1]}/package.json`);
      if (manifest.name !== name || manifest.version !== version) throw new Error(`Git tag and npm version differ: ${name}`);
    }
    return buildRelease({ version, packages, catalogSource, versionSource, consumerPolicySource, commit });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function readTarget(root, path) {
  const parts = path.split('/');
  for (let index = 0; index < parts.length; index += 1) {
    const current = join(root, ...parts.slice(0, index + 1));
    let stat;
    try { stat = await lstat(current); } catch (error) {
      if (error.code === 'ENOENT' && index === parts.length - 1) return null;
      throw error;
    }
    if (stat.isSymbolicLink() || (index === parts.length - 1 ? !stat.isFile() : !stat.isDirectory())) {
      throw new Error(`HJM update target must be a regular path: ${path}`);
    }
  }
  return readFile(join(root, path), 'utf8');
}

export async function syncDesignSystem({ root = resolve(import.meta.dirname, '..'), version, write = false,
  loadRelease = publishedRelease, appRoot } = {}) {
  if (appRoot) root = resolve(appRoot);
  if (appRoot && !version) throw new Error('--app-root requires --version X.Y.Z; adoption must be explicit');
  const { release, catalogText } = await loadRelease(version);
  const before = new Map();
  const contractPath = appRoot ? 'app.contract.json' : examplePath;
  for (const path of [releasePath, catalogPath, contractPath]) before.set(path, await readTarget(root, path));
  const example = JSON.parse(before.get(contractPath));
  if (!example?.designSystem?.contracts) throw new Error('Target has no HJM contract');
  example.designSystem.contracts.version = release.version;
  for (const renderer of example.designSystem.renderers) renderer.version = release.version;
  example.designSystem.catalog = { train: release.version, snapshotPath: release.catalog.generatedPath, sha256: release.catalog.sha256 };
  if (release.consumerPolicy) example.designSystem.companionPolicy.version = release.consumerPolicy.version;
  const expected = new Map([[releasePath, json(release)], [catalogPath, catalogText], [contractPath, json(example)]]);
  if (appRoot) {
    const generatedPath = release.catalog.generatedPath;
    before.set(generatedPath, await readTarget(root, generatedPath));
    expected.set(generatedPath, catalogText);
    // Upgrade every workspace consumer together, including shared app packages.
    // Do not rewrite the lockfile by hand: pnpm resolves peers and artifact integrity.
    const visit = async (directory = '') => {
      for (const entry of await readdir(join(root, directory), { withFileTypes: true })) {
        if (entry.name.startsWith('.') || ['node_modules', 'vendor', 'dist', 'build', 'coverage'].includes(entry.name)) continue;
        const path = directory ? `${directory}/${entry.name}` : entry.name;
        if (entry.isDirectory()) await visit(path);
        else if (entry.name === 'package.json') {
          const source = await readTarget(root, path);
          const manifest = JSON.parse(source);
          let changed = false;
          for (const field of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
            for (const name of packageNames) {
              if (manifest[field]?.[name] !== undefined) { manifest[field][name] = release.version; changed = true; }
            }
          }
          if (changed) { before.set(path, source); expected.set(path, json(manifest)); }
        }
      }
    };
    await visit();
  }
  const updates = [...expected].filter(([path, source]) => before.get(path) !== source);
  if (write) {
    // Recheck every target before the first write; preserve concurrent edits.
    for (const [path, original] of before) {
      if (await readTarget(root, path) !== original) throw new Error(`Concurrent edit during HJM release import: ${path}`);
    }
    const written = [];
    try {
      for (const [path, source] of updates) {
        if (before.get(path) !== null) written.push(path);
        await writeFile(join(root, path), source, { flag: before.get(path) === null ? 'wx' : 'w' });
        if (before.get(path) === null) written.push(path);
      }
    } catch (error) {
      for (const path of written.reverse()) {
        if (before.get(path) === null) await rm(join(root, path), { force: true });
        else await writeFile(join(root, path), before.get(path));
      }
      throw error;
    }
  }
  return { version: release.version, ...(appRoot ? { appRoot: root, next: ['pnpm install --lockfile-only', 'pnpm install --frozen-lockfile', 'run product checks and sync-docs; this import is not validation'] } : {}), action: write ? 'write' : 'dry-run', updates: updates.map(([path, source]) => ({
    path, beforeSha256: before.get(path) === null ? null : sha256(before.get(path)), afterSha256: sha256(source),
  })) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    const options = {};
    for (let i = 0; i < args.length; i += 1) {
      if (args[i] === '--write') options.write = true;
      else if (args[i] === '--app-root' && args[i + 1]) options.appRoot = args[++i];
      else if (args[i] === '--version' && args[i + 1]) options.version = args[++i];
      else throw new Error('Usage: node scripts/sync-design-system.mjs [--app-root PATH] [--version X.Y.Z] [--write]');
    }
    console.log(JSON.stringify(await syncDesignSystem(options), null, 2));
  } catch (error) {
    console.error(`HJM release import: ${error.message}`);
    process.exitCode = 1;
  }
}
