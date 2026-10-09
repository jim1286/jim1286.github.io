// The site has no server runtime: publish the checked dist bytes, without source or credentials.
import { createHash } from 'node:crypto';
import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
export const origin = 'https://jmstudioapps.com';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export function inventory(root, prefix = '') {
  return readdirSync(join(root, prefix)).sort().flatMap(name => {
    const file = prefix ? `${prefix}/${name}` : name;
    // Prevent dotfiles, shell/control characters, traversal and symlinks crossing the public boundary.
    if (!/^[A-Za-z0-9_-][A-Za-z0-9_.-]*$/.test(name)) throw new Error(`Unsafe public path: ${file}`);
    const stat = lstatSync(join(root, file));
    if (stat.isDirectory()) return inventory(root, file);
    if (!stat.isFile() || !/\.(html|css|js|json|png|jpg|jpeg|webp|svg|ico|txt|woff2?)$/.test(name))
      throw new Error(`Unsupported public file: ${file}`);
    const bytes = readFileSync(join(root, file));
    return [{ file, bytes: bytes.length, sha256: digest(bytes), path: file === 'index.html' ? '/' : file.endsWith('/index.html') ? `/${file.slice(0,-10)}` : `/${file}` }];
  }).sort((a,b) => a.file.localeCompare(b.file,'en'));
}
export function verifyArtifact(artifact, expectedSource) {
  const manifest = JSON.parse(readFileSync(join(artifact,'manifest.json'),'utf8'));
  if (manifest.schemaVersion !== 1 || manifest.origin !== origin || !/^[0-9a-f]{40}$/.test(manifest.sourceSha) ||
      (expectedSource && manifest.sourceSha !== expectedSource)) throw new Error('Artifact identity mismatch');
  const files = inventory(join(artifact,'public'));
  if (JSON.stringify(files) !== JSON.stringify(manifest.files)) throw new Error('Public file closure or digest mismatch');
  for (const file of ['index.html','ko-KR/index.html']) {
    const html = readFileSync(join(artifact,'public',file),'utf8');
    const canonical = file === 'index.html' ? `${origin}/` : `${origin}/ko-KR/`;
    if (/%PORTFOLIO_[A-Z_]+%|\/src\/main\.tsx/.test(html) || !html.includes(`<link rel="canonical" href="${canonical}"`))
      throw new Error(`Unbuilt or incorrect canonical HTML: ${file}`);
    for (const match of html.matchAll(/(?:src|href)="(\/[^"?#]+)"/g)) {
      if (!files.some(entry => `/${entry.file}` === match[1])) throw new Error(`Missing HTML asset: ${match[1]}`);
    }
  }
  return manifest;
}
export function renderCaddy(publicRoot, preview = false) {
  if (!/^\/srv\/portfolio-site\/(current|releases\/[0-9a-f]{40}-[0-9a-f]{12})\/public$/.test(publicRoot)) throw new Error('Unsafe content root');
  // Exact directory files preserve locale direct-entry; unknown URLs stay 404 instead of a SPA fallback.
  return `${preview ? '{\n  admin off\n  auto_https off\n}\nhttp://127.0.0.1:18085' : 'jmstudioapps.com'} {\n  root * ${publicRoot}\n  encode zstd gzip\n  header X-Content-Type-Options nosniff\n  header Referrer-Policy strict-origin-when-cross-origin\n  header Cache-Control "public, max-age=300"\n  @html path / /ko-KR/ *.html\n  header @html Cache-Control "no-cache"\n  @hashed path /assets/*\n  header @hashed Cache-Control "public, max-age=31536000, immutable"\n  file_server\n}\n${preview ? '' : '\nwww.jmstudioapps.com {\n  redir https://jmstudioapps.com{uri} 308\n}\n'}`;
}
if (import.meta.main) {
  const [command, output, sourceOrRoot] = process.argv.slice(2);
  if (!output || !isAbsolute(output)) throw new Error('Usage: prepare|verify|caddy ABSOLUTE_PATH [SOURCE_SHA|CONTENT_ROOT]');
  if (command === 'prepare') {
    if (!/^[0-9a-f]{40}$/.test(sourceOrRoot ?? '') || execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim() !== sourceOrRoot) throw new Error('Source must be current exact HEAD');
    if (existsSync(output) && (!lstatSync(output).isDirectory() || lstatSync(output).isSymbolicLink() || readdirSync(output).length)) throw new Error('Output must be a new/empty real directory');
    inventory(resolve('dist'));
    mkdirSync(output,{recursive:true}); cpSync(resolve('dist'),join(output,'public'),{recursive:true});
    writeFileSync(join(output,'manifest.json'), JSON.stringify({schemaVersion:1,origin,sourceSha:sourceOrRoot,files:inventory(join(output,'public'))},null,2)+'\n');
    console.log(`prepared ${verifyArtifact(output,sourceOrRoot).files.length} static files`);
  } else if (command === 'verify') console.log(`verified ${verifyArtifact(output,sourceOrRoot).files.length} static files`);
  else if (command === 'caddy') { verifyArtifact(output); process.stdout.write(renderCaddy(sourceOrRoot,process.argv.includes('--preview'))); }
  else throw new Error('Unknown artifact operation');
}
