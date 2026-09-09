#!/usr/bin/env node

import { lstat, readFile, readdir } from 'node:fs/promises';
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultRoot = resolve(scriptDirectory, '..');
const independentCollections = new Set(['apps', 'packages', 'control-plane', 'tooling']);
const ignoredDirectories = new Set([
  '.dart_tool',
  '.git',
  '.gradle',
  '.pnpm-store',
  '.turbo',
  'Pods',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'outputs',
  'reports',
]);

function finding(code, path, message) {
  return { code, path, message };
}

function isInside(rootPath, candidatePath) {
  const fromRoot = relative(rootPath, candidatePath);
  return fromRoot === ''
    || (!fromRoot.startsWith(`..${sep}`) && fromRoot !== '..' && !isAbsolute(fromRoot));
}

async function loadIndependentRoots(rootPath) {
  const portfolioPath = resolve(rootPath, 'portfolio.json');
  let portfolio;
  try {
    portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return { portfolioMode: false, roots: [] };
    throw new Error(`Cannot parse portfolio.json while checking documentation links: ${error.message}`);
  }
  // Both record kinds are independent repositories whose Markdown this checker
  // must not walk; since schemaVersion 3 the catalog declares the module roots
  // too, so no collection path is hardcoded here any more.
  const declared = [...(Array.isArray(portfolio.apps) ? portfolio.apps : []), ...(Array.isArray(portfolio.modules) ? portfolio.modules : [])]
    .map((record) => record?.path)
    .filter((path) => typeof path === 'string');
  const roots = [...new Set(declared)]
    .filter((path) => /^(?:apps|packages|control-plane|tooling)\/[A-Za-z0-9._-]+$/.test(path))
    .map((path) => resolve(rootPath, path));
  return { portfolioMode: true, roots };
}

async function collectMarkdownFiles(rootPath, { portfolioMode }) {
  const files = [];
  const queue = [rootPath];
  while (queue.length > 0) {
    const directory = queue.shift();
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') && entry.name !== '.github') continue;
      const absolutePath = resolve(directory, entry.name);
      const relativeParts = relative(rootPath, absolutePath).split(sep).filter(Boolean);
      if (entry.isDirectory()) {
        if (ignoredDirectories.has(entry.name)) continue;
        if (portfolioMode && relativeParts.length >= 2 && independentCollections.has(relativeParts[0])) continue;
        queue.push(absolutePath);
      } else if (entry.isFile() && extname(entry.name).toLowerCase() === '.md') {
        files.push(absolutePath);
      }
    }
  }
  return files.sort();
}

function declaredCheckoutRoot(independentRoots, targetPath) {
  return independentRoots.find((root) => isInside(root, targetPath));
}

async function inspectPathWithoutSymlink(rootPath, targetPath) {
  const parts = relative(rootPath, targetPath).split(sep).filter(Boolean);
  let current = rootPath;
  for (const part of parts) {
    current = resolve(current, part);
    let stat;
    try {
      stat = await lstat(current);
    } catch (error) {
      if (error?.code === 'ENOENT') return { exists: false, missingPath: current };
      throw error;
    }
    if (stat.isSymbolicLink()) return { exists: true, symlinkPath: current };
  }
  return { exists: true, symlinkPath: null };
}

function destinationWithoutTitle(value) {
  const destination = value.trim();
  if (!destination) return null;
  if (destination.startsWith('<')) {
    const closing = destination.indexOf('>');
    if (closing < 0) return null;
    return destination.slice(1, closing);
  }
  const destinationWithOptionalTitle = destination.match(
    /^(\S+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?$/u,
  );
  return destinationWithOptionalTitle?.[1] ?? null;
}

function markdownDestinations(source) {
  const destinations = [];
  const pattern = /!?(?:\[[^\]]*\])\(([^)]+)\)/g;
  const lines = source.split(/\r?\n/u);
  let fence = null;
  for (let index = 0; index < lines.length; index += 1) {
    const transition = markdownFenceTransition(lines[index], fence);
    fence = transition.fence;
    if (transition.boundary || fence) continue;
    const codeMaskedLine = maskInlineCodeSpans(lines[index]);
    for (const match of codeMaskedLine.matchAll(pattern)) {
      const destination = destinationWithoutTitle(match[1]);
      if (!destination) continue;
      destinations.push({ destination, line: index + 1 });
    }
  }
  return destinations;
}

function normalizeReferenceLabel(value) {
  return decodeHtmlEntities(value)
    .replace(/\\([\\[\]])/gu, '$1')
    .trim()
    .replace(/\s+/gu, ' ')
    .toLowerCase();
}

function maskInlineCodeSpans(line) {
  const masked = line.split('');
  const escapedAt = (index) => {
    let backslashes = 0;
    for (let cursor = index - 1; cursor >= 0 && line[cursor] === '\\'; cursor -= 1) backslashes += 1;
    return backslashes % 2 === 1;
  };
  let cursor = 0;
  while (cursor < line.length) {
    const opening = line.indexOf('`', cursor);
    if (opening < 0) break;
    if (escapedAt(opening)) {
      cursor = opening + 1;
      continue;
    }
    let openingEnd = opening;
    while (line[openingEnd] === '`') openingEnd += 1;
    const delimiterLength = openingEnd - opening;
    let search = openingEnd;
    let closing = -1;
    while (search < line.length) {
      const candidate = line.indexOf('`', search);
      if (candidate < 0) break;
      let candidateEnd = candidate;
      while (line[candidateEnd] === '`') candidateEnd += 1;
      if (!escapedAt(candidate) && candidateEnd - candidate === delimiterLength) {
        closing = candidateEnd;
        break;
      }
      search = candidateEnd;
    }
    if (closing < 0) {
      cursor = openingEnd;
      continue;
    }
    for (let index = opening; index < closing; index += 1) masked[index] = ' ';
    cursor = closing;
  }
  return masked.join('');
}

function markdownFenceTransition(line, fence) {
  const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/u);
  if (!match) return { fence, boundary: false };
  const marker = match[1][0];
  const length = match[1].length;
  if (!fence) return { fence: { marker, length }, boundary: true };
  const closesFence = marker === fence.marker
    && length >= fence.length
    && /^[ \t]*$/u.test(match[2]);
  return closesFence
    ? { fence: null, boundary: true }
    : { fence, boundary: false };
}

function markdownReferenceData(source) {
  const lines = source.split(/\r?\n/u);
  const definitions = new Map();
  const definitionDestinations = [];
  const definitionLines = new Set();
  const usedReferenceKeys = new Set();
  const unresolved = [];
  let fence = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const transition = markdownFenceTransition(line, fence);
    fence = transition.fence;
    if (transition.boundary) continue;
    if (fence) continue;
    const definition = line.match(/^ {0,3}\[([^\]]+)\]:[ \t]*(.*)$/u);
    if (!definition || definition[1].startsWith('^')) continue;
    const key = normalizeReferenceLabel(definition[1]);
    const destination = destinationWithoutTitle(definition[2]);
    if (!key || !destination) continue;
    definitionLines.add(index);
    if (!definitions.has(key)) definitions.set(key, { destination, line: index + 1 });
    definitionDestinations.push({ destination, line: index + 1 });
  }

  fence = null;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const transition = markdownFenceTransition(line, fence);
    fence = transition.fence;
    if (transition.boundary) continue;
    if (fence || definitionLines.has(index)) continue;

    const codeMaskedLine = maskInlineCodeSpans(line);
    for (const match of codeMaskedLine.matchAll(/(?<!!)\[([^\]]+)\]\[([^\]]*)\]/gu)) {
      const label = match[2].trim() ? match[2] : match[1];
      if (label.startsWith('^')) continue;
      const key = normalizeReferenceLabel(label);
      if (key && definitions.has(key)) {
        usedReferenceKeys.add(key);
      } else if (key) {
        unresolved.push({ label, line: index + 1 });
      }
    }

    const masked = codeMaskedLine
      .replace(/!?\[[^\]]*\]\([^)]*\)/gu, (value) => ' '.repeat(value.length))
      .replace(/!?\[[^\]]*\]\[[^\]]*\]/gu, (value) => ' '.repeat(value.length));
    for (const match of masked.matchAll(/(?<!!)\[([^\]]+)\]/gu)) {
      if (match[1].startsWith('^')) continue;
      const key = normalizeReferenceLabel(match[1]);
      if (key && definitions.has(key)) usedReferenceKeys.add(key);
    }
  }
  return { definitionDestinations, unresolved, usedReferenceKeys };
}

function decodeHtmlEntities(value) {
  const named = new Map([
    ['amp', '&'],
    ['apos', "'"],
    ['gt', '>'],
    ['lt', '<'],
    ['nbsp', ' '],
    ['quot', '"'],
  ]);
  return value.replace(/&(?:#([0-9]+)|#x([0-9a-f]+)|([a-z]+));/giu, (entity, decimal, hexadecimal, name) => {
    if (decimal) {
      const codePoint = Number.parseInt(decimal, 10);
      return Number.isSafeInteger(codePoint) && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : entity;
    }
    if (hexadecimal) {
      const codePoint = Number.parseInt(hexadecimal, 16);
      return Number.isSafeInteger(codePoint) && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : entity;
    }
    return named.get(name.toLowerCase()) ?? entity;
  });
}

function headingText(value) {
  return decodeHtmlEntities(value)
    .replace(/!\[([^\]]*)\]\([^)]*\)/gu, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/<[^>]*>/gu, '')
    .replace(/`+([^`]*)`+/gu, '$1')
    .replace(/\\([\\`*_[\]{}()#+.!~-])/gu, '$1')
    .replace(/[*~]/gu, '');
}

function githubHeadingSlug(value) {
  let slug = '';
  for (const character of headingText(value).trim().toLowerCase()) {
    if (/^[\p{L}\p{M}\p{N}]$/u.test(character) || character === '-' || character === '_') {
      slug += character;
    } else if (character === ' ') {
      slug += '-';
    }
  }
  // GitHub replaces each ASCII space and retains literal hyphens. Collapsing
  // them invents anchors ("A - B" is "a---b") and changes duplicate suffixes.
  // https://github.com/Flet/github-slugger/blob/master/index.js
  return slug;
}

function markdownAnchors(source) {
  const anchors = new Set();
  const generated = new Set();
  const nextSuffix = new Map();
  const lines = source.split(/\r?\n/u);
  let fence = null;

  const addGenerated = (text) => {
    const base = githubHeadingSlug(text);
    if (!base) return;
    let candidate = base;
    let suffix = nextSuffix.get(base) ?? 1;
    while (generated.has(candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
    nextSuffix.set(base, suffix);
    generated.add(candidate);
    anchors.add(candidate);
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const transition = markdownFenceTransition(line, fence);
    fence = transition.fence;
    if (transition.boundary) continue;
    if (fence) continue;

    for (const match of maskInlineCodeSpans(line).matchAll(/\bid\s*=\s*(["'])([^"']+)\1/giu)) {
      anchors.add(decodeHtmlEntities(match[2]));
    }

    const atx = line.match(/^ {0,3}#{1,6}(?:[ \t]+|$)(.*)$/u);
    if (atx) {
      addGenerated(atx[1].replace(/[ \t]+#+[ \t]*$/u, '').trim());
      continue;
    }
    if (index > 0 && /^ {0,3}(?:=+|-+)[ \t]*$/u.test(line) && lines[index - 1].trim()) {
      addGenerated(lines[index - 1].trim());
    }
  }
  return anchors;
}

export async function checkDocLinks({ rootPath = defaultRoot } = {}) {
  const absoluteRoot = resolve(rootPath);
  const findings = [];
  const { portfolioMode, roots: independentRoots } = await loadIndependentRoots(absoluteRoot);
  const files = await collectMarkdownFiles(absoluteRoot, { portfolioMode });
  const anchorCache = new Map();

  for (const filePath of files) {
    const source = await readFile(filePath, 'utf8');
    const sourceLabel = relative(absoluteRoot, filePath);
    const referenceData = markdownReferenceData(source);
    for (const { label, line } of referenceData.unresolved) {
      findings.push(finding(
        'LINK_REFERENCE_UNRESOLVED',
        `${sourceLabel}:${line}`,
        `Reference-style Markdown link has no definition: ${label}`,
      ));
    }
    const destinations = [...markdownDestinations(source), ...referenceData.definitionDestinations];
    for (const { destination, line } of destinations) {
      if (!destination) continue;
      if (/^(?:https?|mailto):/iu.test(destination)) continue;

      const fragmentOffset = destination.indexOf('#');
      const rawFragment = fragmentOffset < 0 ? null : destination.slice(fragmentOffset + 1);
      const pathAndQuery = fragmentOffset < 0 ? destination : destination.slice(0, fragmentOffset);
      const rawPath = pathAndQuery.split('?', 1)[0];
      let decodedPath;
      try {
        decodedPath = decodeURIComponent(rawPath);
      } catch {
        findings.push(finding(
          'LINK_ENCODING_INVALID',
          `${sourceLabel}:${line}`,
          `Local link has invalid percent encoding: ${destination}`,
        ));
        continue;
      }
      if (isAbsolute(decodedPath)) {
        findings.push(finding(
          'ABSOLUTE_LOCAL_LINK',
          `${sourceLabel}:${line}`,
          `Local Markdown links must be repository-relative: ${destination}`,
        ));
        continue;
      }

      const targetPath = rawPath === '' && rawFragment !== null
        ? filePath
        : resolve(dirname(filePath), decodedPath || '.');
      if (!isInside(absoluteRoot, targetPath)) {
        findings.push(finding(
          'LINK_ESCAPES_ROOT',
          `${sourceLabel}:${line}`,
          `Local link escapes the portfolio root: ${destination}`,
        ));
        continue;
      }

      const checkoutRoot = declaredCheckoutRoot(independentRoots, targetPath);
      if (checkoutRoot) {
        const checkout = await inspectPathWithoutSymlink(absoluteRoot, checkoutRoot);
        if (!checkout.exists) continue;
      }

      const inspected = await inspectPathWithoutSymlink(absoluteRoot, targetPath);
      if (inspected.symlinkPath) {
        findings.push(finding(
          'LINK_TARGET_SYMLINK',
          `${sourceLabel}:${line}`,
          `Local documentation target traverses a symlink: ${destination}`,
        ));
      } else if (!inspected.exists) {
        findings.push(finding(
          'LINK_TARGET_MISSING',
          `${sourceLabel}:${line}`,
          `Local documentation target does not exist: ${destination}`,
        ));
      } else if (rawFragment) {
        let decodedFragment;
        try {
          decodedFragment = decodeURIComponent(rawFragment);
        } catch {
          findings.push(finding(
            'LINK_ANCHOR_ENCODING_INVALID',
            `${sourceLabel}:${line}`,
            `Local link anchor has invalid percent encoding: ${destination}`,
          ));
          continue;
        }
        if (extname(targetPath).toLowerCase() !== '.md') continue;
        let anchors = anchorCache.get(targetPath);
        if (!anchors) {
          anchors = targetPath === filePath ? markdownAnchors(source) : markdownAnchors(await readFile(targetPath, 'utf8'));
          anchorCache.set(targetPath, anchors);
        }
        if (!anchors.has(decodedFragment)) {
          findings.push(finding(
            'LINK_ANCHOR_MISSING',
            `${sourceLabel}:${line}`,
            `Local Markdown anchor does not exist: ${destination}`,
          ));
        }
      }
    }
  }

  return { ok: findings.length === 0, filesChecked: files.length, findings };
}

async function main(argv) {
  let rootPath = defaultRoot;
  let json = false;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--root') {
      rootPath = argv[index + 1];
      index += 1;
    } else if (argument === '--json') {
      json = true;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  if (!rootPath) throw new Error('--root requires a path.');

  const result = await checkDocLinks({ rootPath });
  if (json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else if (result.ok) {
    process.stdout.write(`documentation links: ready (${result.filesChecked} Markdown files)\n`);
  } else {
    process.stderr.write(`documentation links: ${result.findings.length} finding(s)\n`);
    for (const item of result.findings) {
      process.stderr.write(`  - [${item.code}] ${item.path}: ${item.message}\n`);
    }
  }
  process.exitCode = result.ok ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
