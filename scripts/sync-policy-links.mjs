#!/usr/bin/env node
// Hub owns public policy URLs. Source verification and standalone snapshot verification
// are separate operations; a missing Hub can never pass the source check.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const keys = ['privacyPolicy', 'accountDeletion', 'support'];
const hash = (projection) => createHash('sha256').update(JSON.stringify(projection)).digest('hex');

function validateProjection(value) {
  if (!value || typeof value !== 'object') throw new Error('policy projection is missing');
  const origin = new URL(value.origin);
  if (origin.protocol !== 'https:' || origin.origin !== value.origin)
    throw new Error('policy origin must be an HTTPS origin without a path');
  if (!value.paths || Object.keys(value.paths).sort().join() !== [...keys].sort().join())
    throw new Error('policy paths must declare privacyPolicy, accountDeletion and support');
  for (const key of keys) {
    const template = value.paths[key];
    if (typeof template !== 'string' || !template.startsWith('/') || template.startsWith('//') ||
        template.split('{id}').length !== 2 || /[?#\\]/.test(template) || template.split('/').includes('..'))
      throw new Error(`invalid policy path: ${key}`);
  }
  if (!Array.isArray(value.apps) || !value.apps.length || value.apps.some((id) => !/^[a-z][a-z0-9-]*$/.test(id)) ||
      value.apps.join() !== [...new Set(value.apps)].sort().join())
    throw new Error('policy app IDs must be unique, sorted identifiers');
  if (!value.urls || Object.keys(value.urls).sort().join() !== value.apps.join())
    throw new Error('policy URLs must cover exactly the declared apps');
  if (!value.publications || Object.keys(value.publications).sort().join() !== value.apps.join() ||
      value.apps.some((id) => !['central', 'app-owned'].includes(value.publications[id])))
    throw new Error('policy publication owners must cover exactly the declared apps');
  const urls = Object.fromEntries(value.apps.map((id) => {
    const links = value.urls[id];
    if (!links || Object.keys(links).sort().join() !== [...keys].sort().join())
      throw new Error(`policy URLs are incomplete: ${id}`);
    for (const key of keys) {
      const url = new URL(links[key]);
      if (url.protocol !== 'https:' || url.username || url.password)
        throw new Error(`policy URL must be public HTTPS without credentials: ${id}.${key}`);
    }
    return [id, Object.fromEntries(keys.map((key) => [key, links[key]]))];
  }));
  return { origin: value.origin, paths: Object.fromEntries(keys.map((key) => [key, value.paths[key]])), apps: value.apps,
    publications: Object.fromEntries(value.apps.map((id) => [id, value.publications[id]])), urls };
}

function readHub(hubConfig) {
  const source = resolve(hubConfig, 'portfolio.json');
  if (!existsSync(source)) throw new Error('Hub source unavailable: source verification was NOT performed. Supply HUB_CONFIG_DIR; standalone builds use policy:check:snapshot.');
  const portfolio = JSON.parse(readFileSync(source, 'utf8'));
  const appsRoot = resolve(hubConfig, 'apps');
  const apps = readdirSync(appsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(resolve(appsRoot, entry.name, 'policy.json')))
    .map((entry) => entry.name).sort();
  // BurnTok's app-owned policies deliberately do not exist on the central Site.
  // Project only public URL fields, not entire profiles that can contain review credentials.
  const publications = Object.create(null);
  const urls = Object.fromEntries(apps.map((id) => {
    // Hub retains legal pages after retirement: its policy binding falls back to retired.json.
    // Requiring an active app.json here would silently break that preserved legal history.
    const activeProfile = resolve(appsRoot, id, 'app.json');
    const profile = JSON.parse(readFileSync(existsSync(activeProfile) ? activeProfile : resolve(appsRoot, id, 'retired.json'), 'utf8'));
    const publication = profile.store?.policyPublication ?? 'central';
    if (!['central', 'app-owned'].includes(publication))
      throw new Error(`unsupported policy publication: ${id}`);
    publications[id] = publication;
    return [id, Object.fromEntries(keys.map((key) => {
      const explicit = profile.store?.[`${key}Url`];
      if (publication === 'app-owned' && !explicit)
        throw new Error(`app-owned policy URL is missing: ${id}.${key}`);
      return [key, explicit ?? `${portfolio.policySite.origin}${portfolio.policySite.paths[key].replace('{id}', id)}`];
    }))];
  }));
  return validateProjection({ origin: portfolio.policySite.origin, paths: portfolio.policySite.paths, apps, publications, urls });
}

function render(projection) {
  return `// Generated from the public Hub projection. Run pnpm policy:sync; do not edit.\nexport const policyOrigin = ${JSON.stringify(projection.origin)};\nexport const policyPaths = ${JSON.stringify(projection.paths, null, 2)} as const;\nexport const appsWithPolicy = ${JSON.stringify(projection.apps)} as const;\nexport const policyUrls = ${JSON.stringify(projection.urls, null, 2)} as const;\nexport type PolicyAppId = (typeof appsWithPolicy)[number];\nexport function policyUrl(appId: PolicyAppId, kind: keyof typeof policyPaths): string {\n  return policyUrls[appId][kind];\n}\n`;
}

export function synchronizePolicies({ mode, hubConfig, output, snapshotFile }) {
  if (!['sync', 'source', 'snapshot'].includes(mode)) throw new Error('invalid policy verification mode');
  const projection = mode === 'snapshot' ? null : readHub(hubConfig);
  if (mode === 'sync') {
    // v2 binds per-product destinations; v1 only bound a central URL template and lost overrides.
    const snapshot = { schemaVersion: 2, source: 'app-release-hub', sourceDigest: hash(projection), projection };
    writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2) + '\n');
    writeFileSync(output, render(projection));
    return 'source-synchronized';
  }
  const snapshot = JSON.parse(readFileSync(snapshotFile, 'utf8'));
  const cached = validateProjection(snapshot.projection);
  if (snapshot.schemaVersion !== 2 || snapshot.source !== 'app-release-hub' || snapshot.sourceDigest !== hash(cached))
    throw new Error('invalid policy source snapshot or digest');
  if (projection && hash(projection) !== snapshot.sourceDigest)
    throw new Error('policy snapshot differs from Hub source; run pnpm policy:sync');
  if (readFileSync(output, 'utf8') !== render(cached))
    throw new Error('generated policy links differ from the snapshot; run pnpm policy:sync');
  return mode === 'source' ? 'source-verified' : 'snapshot-verified (Hub freshness NOT checked)';
}

if (import.meta.main) {
  try {
    const args = process.argv.slice(2);
    if (args.length > 1 || args.some((arg) => !['--check', '--check-snapshot'].includes(arg)))
      throw new Error('usage: sync-policy-links.mjs [--check|--check-snapshot]');
    console.log(synchronizePolicies({
      mode: args.includes('--check') ? 'source' : args.includes('--check-snapshot') ? 'snapshot' : 'sync',
      hubConfig: process.env.HUB_CONFIG_DIR ?? resolve(here, '../../../control-plane/app-release-hub/config'),
      output: resolve(here, '../src/policyLinks.generated.ts'),
      snapshotFile: resolve(here, '../docs/policy-source.snapshot.json'),
    }));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
