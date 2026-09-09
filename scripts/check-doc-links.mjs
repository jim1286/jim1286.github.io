import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['README.md', 'AGENTS.md', ...readdirSync(resolve(root, 'docs')).filter((name) => name.endsWith('.md')).map((name) => `docs/${name}`)];
const failures = [];
for (const name of files) {
  const source = readFileSync(resolve(root, name), 'utf8');
  for (const match of source.matchAll(/\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)) {
    const target = match[1];
    if (/^(?:[a-z]+:|#)/i.test(target)) continue;
    if (!existsSync(resolve(root, dirname(name), decodeURIComponent(target.split('#')[0])))) failures.push(`${name}: ${target}`);
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Local links verified in ${files.length} entry documents.`);
