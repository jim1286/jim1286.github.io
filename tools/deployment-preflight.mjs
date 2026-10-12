#!/usr/bin/env node
// Oct 12 deployment failures came from absent inputs/files/modules discovered
// after setup or image builds. Keep this built-in-only check small: no tests,
// build, store write, or dependency installation happens here.
import { existsSync, readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

function glob(pattern) {
  return new RegExp('^' + pattern.split(/(\*\*\/|\*\*|\*|\?)/).map(part =>
    part === '**/' ? '(?:.*/)?' : part === '**' ? '.*' : part === '*' ? '[^/]*' : part === '?' ? '[^/]' : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('') + '$');
}

export function dockerConfigFindings(files, dockerfile, ignore = '') {
  const rules = ignore.split(/\r?\n/).map(x => x.trim()).filter(x => x && !x.startsWith('#')).map(x => ({
    include: x.startsWith('!'), pattern: (x.startsWith('!') ? x.slice(1) : x).replace(/^\/+|\/+$/g, ''),
  }));
  // Check each parent too: Docker cannot reinclude a child of an excluded directory.
  const ignored = file => file.split('/').some((_, i, parts) => {
    const path = parts.slice(0, i + 1).join('/');
    let excluded = false;
    for (const rule of rules) if (glob(rule.pattern).test(path) || (!rule.pattern.includes('/') && glob(rule.pattern).test(parts[i]))) excluded = !rule.include;
    return excluded;
  });
  const copies = [];
  for (const line of dockerfile.replace(/\\\r?\n/g, ' ').split(/\r?\n/)) {
    if (/^RUN\b.*(?:pnpm|npm|next)\b.*\bbuild\b/i.test(line)) break;
    if (!/^COPY\s/i.test(line) || /--from=/.test(line)) continue;
    const body = line.replace(/^COPY\s+/i, '').replace(/--[\w-]+=\S+\s*/g, '');
    const paths = body.startsWith('[') ? JSON.parse(body) : body.trim().split(/\s+/);
    copies.push(...paths.slice(0, -1).map(x => x.replace(/^\.\//, '').replace(/\/$/, '')));
  }
  return files.flatMap(file => {
    if (ignored(file)) return [{ code: 'CONFIG_EXCLUDED_FROM_IMAGE', path: file }];
    if (!copies.some(src => src === '.' || src === file || file.startsWith(src + '/') || glob(src).test(file)))
      return [{ code: 'CONFIG_NOT_COPIED_BEFORE_BUILD', path: file }];
    return [];
  });
}

export function preflight(root, { phase = 'source', runtimeIds = [], requiredEnv = [], env = process.env } = {}) {
  if (!['source', 'dependencies'].includes(phase)) throw new Error('Choose source or dependencies');
  const findings = [];
  const fail = (code, path) => findings.push({ code, path });
  const file = path => {
    if (!existsSync(resolve(root, path))) { fail('FILE_MISSING', path); return false; }
    return true;
  };
  for (const name of requiredEnv) {
    if (!/^[A-Z][A-Z0-9_]*$/.test(name)) throw new Error('Invalid environment name');
    if (!env[name]?.trim()) fail('INPUT_MISSING', name);
  }
  const expectedSha = env.DEPLOY_SHA || env.GITHUB_SHA;
  if (phase === 'source' && expectedSha) {
    try {
      if (!/^[a-f0-9]{40}$/.test(expectedSha) || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim() !== expectedSha)
        fail('SOURCE_SHA_MISMATCH', 'HEAD');
    } catch { fail('SOURCE_SHA_UNREADABLE', 'HEAD'); }
  }
  let contract;
  try { contract = JSON.parse(readFileSync(resolve(root, 'app.contract.json'), 'utf8')); }
  catch { fail('CONTRACT_UNREADABLE', 'app.contract.json'); return findings; }
  const runtimes = contract.runtimes ?? [];
  for (const id of runtimeIds) if (!runtimes.some(r => (r.id ?? r.kind) === id)) fail('UNKNOWN_RUNTIME', id);
  const selected = runtimes.filter(r => !runtimeIds.length || runtimeIds.includes(r.id ?? r.kind));
  const module = (cwd, name) => {
    try { createRequire(resolve(root, cwd, 'package.json')).resolve(name); }
    catch { fail('MODULE_MISSING', `${cwd}:${name}`); }
  };
  // Only literal config imports/resources are followed. This does not execute
  // application config or claim to validate native prebuild/Xcode semantics.
  const seen = new Set();
  const closure = path => {
    const absolute = resolve(root, path);
    if (seen.has(absolute)) return;
    seen.add(absolute);
    const rel = relative(root, absolute);
    if (rel.startsWith('../') || isAbsolute(rel)) { fail('CONFIG_PATH_OUTSIDE_SOURCE', path); return; }
    if (!file(rel) || !/\.(?:[cm]?[jt]s)$/.test(rel)) return;
    if (rel.endsWith('.mjs') && existsSync(absolute.replace(/\.mjs$/, '.d.mts')))
      seen.add(absolute.replace(/\.mjs$/, '.d.mts'));
    const source = readFileSync(absolute, 'utf8');
    const imports = [...source.matchAll(/(?:\bfrom\s*|\bimport\s*|\brequire\s*\(\s*|\bimport\s*\(\s*|\bnew URL\s*\(\s*)['"](\.[^'"]+)['"]/g)];
    for (const [, specifier] of imports) {
      // new URL('.', import.meta.url) is a directory anchor, not a source file.
      if (specifier === '.' || specifier.endsWith('/')) continue;
      const target = resolve(dirname(absolute), specifier);
      const candidates = [target, ...['.ts', '.js', '.mjs', '.cjs', '.json', '/index.ts', '/index.js'].map(ext => target + ext)];
      closure(relative(root, candidates.find(existsSync) ?? target));
    }
  };
  if (phase === 'source') {
    file('.nvmrc'); file('package.json'); file('pnpm-lock.yaml');
    for (const runtime of selected) {
      const cwd = runtime.root ?? '.';
      if (runtime.framework === 'flutter') {
        file(`${cwd}/pubspec.yaml`); file(runtime.binding?.lockfile ?? `${cwd}/pubspec.lock`);
      } else {
        seen.clear();
        file(`${cwd}/package.json`);
        if (runtime.binding?.lockfile) file(runtime.binding.lockfile);
        for (const name of ['next.config.ts', 'next.config.mjs', 'next.config.js', 'vite.config.ts', 'app.config.ts', 'app.config.js']) {
          const path = `${cwd}/${name}`;
          if (existsSync(resolve(root, path))) closure(path);
        }
        if (runtime.framework === 'nextjs') {
          const dockerfile = [`${cwd}/Dockerfile`, 'Dockerfile.web'].find(path => existsSync(resolve(root, path)));
          if (dockerfile) {
            const files = [...seen].map(path => relative(root, path)).filter(path => !path.startsWith(cwd + '/'));
            const ignore = existsSync(resolve(root, '.dockerignore')) ? readFileSync(resolve(root, '.dockerignore'), 'utf8') : '';
            findings.push(...dockerConfigFindings(files, readFileSync(resolve(root, dockerfile), 'utf8'), ignore));
          }
        }
      }
    }
  } else {
    // Runtime binding parsing needs yaml at the tooling root; framework checks
    // run before generating clients/dist, so do not resolve workspace outputs.
    const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
    if (manifest.dependencies?.yaml || manifest.devDependencies?.yaml) module('.', 'yaml');
    for (const runtime of selected) {
      const cwd = runtime.root ?? '.';
      if (runtime.framework === 'flutter') continue;
      const framework = { expo: 'expo', nextjs: 'next', nestjs: '@nestjs/core', vite: 'vite' }[runtime.framework];
      if (framework) module(cwd, framework);
      module(cwd, 'typescript');
    }
  }
  return findings;
}

export function sshPreflight(env = process.env) {
  const names = ['HOST', 'USER', 'KEY', 'KNOWN_HOSTS', 'ROOT'];
  const findings = names.filter(name => !env[`PREFLIGHT_SSH_${name}`]?.trim()).map(name => ({ code: 'INPUT_MISSING', path: `PREFLIGHT_SSH_${name}` }));
  if (findings.length) return findings;
  if (!/^[a-zA-Z0-9.-]+$/.test(env.PREFLIGHT_SSH_HOST) || !/^[a-zA-Z0-9_-]+$/.test(env.PREFLIGHT_SSH_USER) || !/^\/(?:opt|srv|var\/lib)\/[a-zA-Z0-9/_-]+$/.test(env.PREFLIGHT_SSH_ROOT))
    return [{ code: 'SSH_INPUT_INVALID', path: 'target/root' }];
  const directory = mkdtempSync(resolve(tmpdir(), 'deployment-access-'));
  try {
    const key = resolve(directory, 'key'); const hosts = resolve(directory, 'known_hosts');
    writeFileSync(key, env.PREFLIGHT_SSH_KEY, { mode: 0o600 });
    writeFileSync(hosts, env.PREFLIGHT_SSH_KNOWN_HOSTS + '\n', { mode: 0o600 });
    // Read-only authentication and staging-parent permissions before building an
    // image. Keep the same pinned host keys as deployment; never trust keyscan.
    const result = spawnSync('ssh', ['-i', key, '-o', 'IdentitiesOnly=yes', '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', `UserKnownHostsFile=${hosts}`, '-o', 'ConnectTimeout=10', `${env.PREFLIGHT_SSH_USER}@${env.PREFLIGHT_SSH_HOST}`, `test -d '${env.PREFLIGHT_SSH_ROOT}' && test -w '${env.PREFLIGHT_SSH_ROOT}'`], { timeout: 15000, stdio: 'ignore' });
    return result.status === 0 ? [] : [{ code: 'SSH_ACCESS_FAILED', path: 'authentication/host-key/staging-permission' }];
  } finally { rmSync(directory, { recursive: true, force: true }); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [phase, ...args] = process.argv.slice(2);
    const requiredEnv = args.filter(arg => arg !== '--ssh').map(arg => {
      if (!arg.startsWith('--env=')) throw new Error('Only --env=NAME arguments are supported');
      return arg.slice(6);
    });
    const findings = preflight(process.cwd(), { phase, requiredEnv,
      runtimeIds: (process.env.CI_RUNTIME_IDS ?? '').split(',').filter(Boolean) });
    if (args.includes('--ssh')) findings.push(...sshPreflight());
    for (const { code, path } of findings) console.error(`${code}: ${path}`);
    console.log(`Deployment prerequisites (${phase}): ${findings.length ? `${findings.length} missing/invalid` : 'passed'}`);
    process.exitCode = findings.length ? 1 : 0;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
