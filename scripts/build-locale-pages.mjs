import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const config = JSON.parse(readFileSync(resolve(root, 'i18n.config.json'), 'utf8'));
const html = readFileSync(resolve(root, 'dist/index.html'), 'utf8');

// Both static hosts serve real directories. Locale entry points need their own files;
// explicit canonical/OG URLs avoid treating a locale entry as duplicate root content.
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
  ).replaceAll('https://jmstudioapps.com/"', `https://jmstudioapps.com/${locale.tag}/"`));
}
console.log(`locale pages: ${config.locales.length} static entries; no SPA fallback required`);
