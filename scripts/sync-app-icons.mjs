import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const portfolio = resolve(root, '../..');
// A stale website copy reached the GitHub profile on 2026-10-09. These paths
// follow each product's current launcher configuration, rather than old site assets.
const sources = {
  burntok: 'apps/burntok/apps/mobile/assets/release-hub/icon.ios-opaque.png',
  unairplane: 'apps/unairplane/assets/release-hub/icon.ios-opaque.png',
  'choose-window': 'apps/choose-window/assets/icons/launcher.png',
  yajalal: 'apps/yajalal/modules/app/assets/icons/launcher.png',
  diairy: 'apps/diairy/packages/assets/brand/generated/v4/icon-1024.png',
  spint: 'apps/spint/apps/mobile/assets/release-hub/icon.ios-opaque.png',
  utilverse: 'apps/utilverse/apps/mobile/assets/images/icon.png',
};
const manifestPath = resolve(root, 'public/apps/sources.json');
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
if (process.argv.includes('--write')) {
  const manifest = {};
  for (const [id, source] of Object.entries(sources)) {
    const bytes = readFileSync(resolve(portfolio, source));
    writeFileSync(resolve(root, `public/apps/${id}.png`), bytes);
    manifest[id] = { source, sha256: digest(bytes) };
  }
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
for (const [id, source] of Object.entries(sources)) {
  const actual = digest(readFileSync(resolve(root, `public/apps/${id}.png`)));
  if (manifest[id]?.source !== source || manifest[id]?.sha256 !== actual) {
    throw new Error(`Icon snapshot mismatch: ${id}`);
  }
  // An independent checkout can verify its committed snapshot without private
  // product access; local portfolio checkouts additionally detect source drift.
  const current = resolve(portfolio, source);
  if (existsSync(current) && digest(readFileSync(current)) !== actual) {
    throw new Error(`Product icon changed: ${id}; review and run --write`);
  }
}
console.log(`Verified ${Object.keys(sources).length} current product icons`);
