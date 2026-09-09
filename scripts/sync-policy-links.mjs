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
  return { origin: value.origin, paths: Object.fromEntries(keys.map((key) => [key, value.paths[key]])), apps: value.apps };
}

function readHub(hubConfig) {
  const source = resolve(hubConfig, 'portfolio.json');
  if (!existsSync(source)) throw new Error('Hub source unavailable: source verification was NOT performed. Supply HUB_CONFIG_DIR; standalone builds use policy:check:snapshot.');
  const portfolio = JSON.parse(readFileSync(source, 'utf8'));
  const appsRoot = resolve(hubConfig, 'apps');
  const apps = readdirSync(appsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(resolve(appsRoot, entry.name, 'policy.json')))
    .map((entry) => entry.name).sort();
  return validateProjection({ origin: portfolio.policySite.origin, paths: portfolio.policySite.paths, apps });
}

function render(projection) {
  return `// Generated from the public Hub projection. Run pnpm policy:sync; do not edit.\nexport const policyOrigin = ${JSON.stringify(projection.origin)};\nexport const policyPaths = ${JSON.stringify(projection.paths, null, 2)} as const;\nexport const appsWithPolicy = ${JSON.stringify(projection.apps)} as const;\nexport type PolicyAppId = (typeof appsWithPolicy)[number];\nexport function policyUrl(appId: PolicyAppId, kind: keyof typeof policyPaths): string {\n  return \`\${policyOrigin}\${policyPaths[kind].replace('{id}', appId)}\`;\n}\n`;
}

export function synchronizePolicies({ mode, hubConfig, output, snapshotFile }) {
  if (!['sync', 'source', 'snapshot'].includes(mode)) throw new Error('invalid policy verification mode');
  const projection = mode === 'snapshot' ? null : readHub(hubConfig);
  if (mode === 'sync') {
    const snapshot = { schemaVersion: 1, source: 'app-release-hub', sourceDigest: hash(projection), projection };
    writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2) + '\n');
    writeFileSync(output, render(projection));
    return 'source-synchronized';
  }
  const snapshot = JSON.parse(readFileSync(snapshotFile, 'utf8'));
  const cached = validateProjection(snapshot.projection);
  if (snapshot.schemaVersion !== 1 || snapshot.source !== 'app-release-hub' || snapshot.sourceDigest !== hash(cached))
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
