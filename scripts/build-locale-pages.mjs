import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const config = JSON.parse(readFileSync(resolve(root, 'i18n.config.json'), 'utf8'));
const html = readFileSync(resolve(root, 'dist/index.html'), 'utf8');

// GitHub Pages serves real directories, not Vite's SPA fallback. Registered
// locale URLs need their own index files; absolute asset URLs keep them rooted
// at this user-site's domain. Keep the existing canonical/OG metadata intact.
for (const locale of config.locales) {
  if (Intl.getCanonicalLocales(locale.tag)[0] !== locale.tag ||
      !/^[A-Za-z0-9-]+$/.test(locale.tag) ||
      !['ltr', 'rtl'].includes(locale.direction)) {
    throw new Error('Invalid locale entry');
  }
  const output = resolve(root, 'dist', locale.tag);
  mkdirSync(output, { recursive: true });
  writeFileSync(resolve(output, 'index.html'), html.replace(
    /<html\b[^>]*>/,
    `<html lang="${locale.tag}" dir="${locale.direction}">`,
  ));
}
console.log(`locale pages: ${config.locales.length} static entries; no SPA fallback required`);
