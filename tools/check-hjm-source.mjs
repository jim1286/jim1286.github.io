#!/usr/bin/env node

import { access, readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolvedVersionViolation, trainLabel, trainViolation } from './version-train.mjs';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const findings = [];
const packageFiles = [];
const add = (path, message) => findings.push({ path, message });
const ignoredDirectories = new Set(['.git', '.next', '.expo', 'build', 'coverage', 'dist', 'dist-standard', 'storybook-static', 'node_modules']);
const runtimeBindings = true;
const frameworkPackages = { mobile: 'expo', web: 'next', server: '@nestjs/core' };
// Reviewed floors inside their own major trains, like every other version the
// standard records; the lockfile still resolves one version per install. Baked in at
// generation time from the central constant so the projection cannot drift from it.
const runtimeFrameworkFloors = {"mobile":"57.0.18","web":"16.3.3","server":"12.0.1"};
const serverTooling = {"eslint":"9.39.5","vitest":"4.1.11","supertest":"7.2.2"};

async function collectPackageFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) await collectPackageFiles(path);
    if (entry.isFile() && entry.name === 'package.json') packageFiles.push(path);
  }
}

async function collectSourceFiles(directory, files = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name) && !entry.name.startsWith('.next-')) await collectSourceFiles(path, files);
    if (entry.isFile() && /\.(?:css|js|jsx|ts|tsx)$/.test(entry.name)) files.push(path);
  }
  return files;
}

function stripYamlInlineComment(line) {
  let quote = null;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (quote) {
      if (quote === '"' && character === '\\') {
        index += 1;
      } else if (quote === "'" && character === "'" && line[index + 1] === "'") {
        index += 1;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '#' && (index === 0 || /\s/.test(line[index - 1]))) {
      return line.slice(0, index).trimEnd();
    }
  }
  return line;
}

function pnpmLockSyntaxError(lineNumber, message) {
  throw new Error('semantic pnpm lock parse failed at line ' + lineNumber + ': ' + message);
}

function yamlUnquotedSyntax(line) {
  let result = '';
  let quote = null;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (quote) {
      if (quote === '"' && character === '\\') {
        result += '  ';
        index += 1;
      } else if (quote === "'" && character === "'" && line[index + 1] === "'") {
        result += '  ';
        index += 1;
      } else if (character === quote) {
        result += ' ';
        quote = null;
      } else {
        result += ' ';
      }
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      result += ' ';
      continue;
    }
    result += character;
  }
  return result;
}

function rejectAmbiguousYamlSyntax(rawLine, lineNumber) {
  if (/^ *\t/.test(rawLine)) pnpmLockSyntaxError(lineNumber, 'tabs are forbidden in YAML indentation');
  const line = stripYamlInlineComment(rawLine);
  const syntax = yamlUnquotedSyntax(line);
  if (/^\s*(?:---|\.\.\.|%YAML\b)/.test(syntax)) {
    pnpmLockSyntaxError(lineNumber, 'directives and multi-document YAML are forbidden');
  }
  if (/^\s*<<\s*:|[,{]\s*<<\s*:/.test(syntax)) {
    pnpmLockSyntaxError(lineNumber, 'YAML merge keys are forbidden');
  }
  if (/(?:^|[\s,[{])(?:&|\*)[A-Za-z0-9_-]+/.test(syntax)) {
    pnpmLockSyntaxError(lineNumber, 'YAML anchors and aliases are forbidden');
  }
  if (/(?:^|\s)![A-Za-z0-9_!<]/.test(syntax)) {
    pnpmLockSyntaxError(lineNumber, 'YAML tags are forbidden');
  }
  if (/:\s*[>|][+-]?[0-9]*\s*$/.test(syntax)) {
    pnpmLockSyntaxError(lineNumber, 'block scalar YAML is forbidden');
  }
}

function decodeYamlDoubleQuoted(inner, lineNumber) {
  const simpleEscapeCodes = {
    '0': 0x00,
    a: 0x07,
    b: 0x08,
    t: 0x09,
    n: 0x0a,
    v: 0x0b,
    f: 0x0c,
    r: 0x0d,
    e: 0x1b,
    ' ': 0x20,
    '"': 0x22,
    '/': 0x2f,
    '\\': 0x5c,
    N: 0x85,
    _: 0xa0,
    L: 0x2028,
    P: 0x2029,
  };
  let result = '';
  for (let index = 0; index < inner.length; index += 1) {
    const character = inner[index];
    if (character !== '\\') {
      result += character;
      continue;
    }
    const escape = inner[index + 1];
    if (escape === undefined) pnpmLockSyntaxError(lineNumber, 'unterminated double-quoted escape');
    if (Object.hasOwn(simpleEscapeCodes, escape)) {
      result += String.fromCodePoint(simpleEscapeCodes[escape]);
      index += 1;
      continue;
    }
    const width = escape === 'x' ? 2 : escape === 'u' ? 4 : escape === 'U' ? 8 : 0;
    if (width === 0) pnpmLockSyntaxError(lineNumber, 'unsupported double-quoted YAML escape');
    const digits = inner.slice(index + 2, index + 2 + width);
    if (digits.length !== width || !/^[A-Fa-f0-9]+$/.test(digits)) {
      pnpmLockSyntaxError(lineNumber, 'invalid hexadecimal YAML escape');
    }
    const codePoint = Number.parseInt(digits, 16);
    if (codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)) {
      pnpmLockSyntaxError(lineNumber, 'invalid Unicode YAML escape');
    }
    result += String.fromCodePoint(codePoint);
    index += 1 + width;
  }
  return result;
}

function parseYamlScalar(rawValue, lineNumber) {
  const raw = rawValue.trim();
  if (!raw) return { value: '', style: 'empty' };
  if (raw.startsWith("'")) {
    if (!raw.endsWith("'") || raw.length < 2) pnpmLockSyntaxError(lineNumber, 'unterminated single-quoted scalar');
    const inner = raw.slice(1, -1);
    let value = '';
    for (let index = 0; index < inner.length; index += 1) {
      if (inner[index] !== "'") {
        value += inner[index];
      } else if (inner[index + 1] === "'") {
        value += "'";
        index += 1;
      } else {
        pnpmLockSyntaxError(lineNumber, 'single quotes must be doubled inside a quoted scalar');
      }
    }
    return { value, style: 'single' };
  }
  if (raw.startsWith('"')) {
    if (!raw.endsWith('"') || raw.length < 2) pnpmLockSyntaxError(lineNumber, 'unterminated double-quoted scalar');
    return { value: decodeYamlDoubleQuoted(raw.slice(1, -1), lineNumber), style: 'double' };
  }
  if (raw.includes('"') || raw.includes("'")) pnpmLockSyntaxError(lineNumber, 'non-canonical mixed quoted scalar');
  return { value: raw, style: 'plain' };
}

function splitYamlMapping(raw, lineNumber) {
  let quote = null;
  let flowDepth = 0;
  for (let index = 0; index < raw.length; index += 1) {
    const character = raw[index];
    if (quote) {
      if (quote === '"' && character === '\\') {
        index += 1;
      } else if (quote === "'" && character === "'" && raw[index + 1] === "'") {
        index += 1;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === '{' || character === '[') flowDepth += 1;
    if (character === '}' || character === ']') flowDepth -= 1;
    if (flowDepth < 0) pnpmLockSyntaxError(lineNumber, 'unbalanced flow collection');
    if (character === ':' && flowDepth === 0
      && (index === raw.length - 1 || /\s/.test(raw[index + 1]))) {
      return {
        rawKey: raw.slice(0, index).trim(),
        rawValue: raw.slice(index + 1).trim(),
      };
    }
  }
  pnpmLockSyntaxError(lineNumber, 'expected one canonical YAML mapping entry');
}

function parseCanonicalEntryKey(rawKey, lineNumber) {
  const key = parseYamlScalar(rawKey, lineNumber);
  if (!['plain', 'single'].includes(key.style)
    || /[\u0000-\u001f\u007f']/.test(key.value)) {
    pnpmLockSyntaxError(lineNumber, 'record keys must be canonical plain or simple single-quoted scalars');
  }
  return key.value;
}

function parsePlainFieldKey(rawKey, lineNumber) {
  const key = parseYamlScalar(rawKey, lineNumber);
  if (key.style !== 'plain' || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(key.value)) {
    pnpmLockSyntaxError(lineNumber, 'mapping field keys must be unquoted canonical identifiers');
  }
  return key.value;
}

function splitFlowEntries(body, lineNumber) {
  const entries = [];
  let quote = null;
  let depth = 0;
  let start = 0;
  for (let index = 0; index < body.length; index += 1) {
    const character = body[index];
    if (quote) {
      if (quote === '"' && character === '\\') {
        index += 1;
      } else if (quote === "'" && character === "'" && body[index + 1] === "'") {
        index += 1;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '{' || character === '[') {
      depth += 1;
    } else if (character === '}' || character === ']') {
      depth -= 1;
      if (depth < 0) pnpmLockSyntaxError(lineNumber, 'unbalanced nested flow collection');
    } else if (character === ',' && depth === 0) {
      entries.push(body.slice(start, index).trim());
      start = index + 1;
    }
  }
  if (quote || depth !== 0) pnpmLockSyntaxError(lineNumber, 'unterminated flow collection');
  entries.push(body.slice(start).trim());
  if (entries.some((entry) => !entry)) pnpmLockSyntaxError(lineNumber, 'empty or trailing flow mapping entry');
  return entries;
}

function parseStrictFlowMap(rawValue, lineNumber) {
  const raw = rawValue.trim();
  if (!raw.startsWith('{') || !raw.endsWith('}')) {
    pnpmLockSyntaxError(lineNumber, 'expected a flow mapping');
  }
  const body = raw.slice(1, -1).trim();
  const result = new Map();
  if (!body) return result;
  for (const entry of splitFlowEntries(body, lineNumber)) {
    const { rawKey, rawValue: valueSource } = splitYamlMapping(entry, lineNumber);
    const key = parsePlainFieldKey(rawKey, lineNumber);
    if (result.has(key)) pnpmLockSyntaxError(lineNumber, 'duplicate flow mapping key ' + key);
    const value = parseYamlScalar(valueSource, lineNumber);
    if (value.style === 'empty') pnpmLockSyntaxError(lineNumber, 'flow mapping values must be scalar');
    result.set(key, value);
  }
  return result;
}

function completeSha512Integrity(value) {
  if (typeof value !== 'string' || !value.startsWith('sha512-')) return false;
  const encoded = value.slice('sha512-'.length);
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) return false;
  try {
    const digest = Buffer.from(encoded, 'base64');
    return digest.length === 64
      && digest.toString('base64').replace(/=+$/, '') === encoded.replace(/=+$/, '');
  } catch {
    return false;
  }
}

function applyRegistryResolution(record, resolution, lineNumber) {
  const validKeys = resolution.size === 1 && resolution.has('integrity');
  const integrity = resolution.get('integrity');
  if (!validKeys || integrity?.style !== 'plain' || !completeSha512Integrity(integrity?.value)) {
    pnpmLockSyntaxError(
      lineNumber,
      'registry resolution key set must be exactly {integrity} with a complete 64-byte sha512 integrity; tarball, Git, URL and path resolutions are forbidden',
    );
  }
  record.integrity = integrity.value;
}

function applyImporterDependencyFlow(record, rawValue, lineNumber) {
  const fields = parseStrictFlowMap(rawValue, lineNumber);
  if (fields.size !== 2 || !fields.has('specifier') || !fields.has('version')) {
    pnpmLockSyntaxError(lineNumber, 'importer dependency records must contain exactly specifier and version; resolution overrides and unknown keys are forbidden');
  }
  for (const field of ['specifier', 'version']) {
    const scalar = fields.get(field);
    if (!['plain', 'single'].includes(scalar.style)) {
      pnpmLockSyntaxError(lineNumber, 'importer dependency values must be canonical scalar versions');
    }
    record[field] = scalar.value;
    record.fields.add(field);
  }
}

function parsePnpmLock(source) {
  const importers = new Map();
  const packages = new Map();
  const snapshots = new Map();
  const topKeys = new Set();
  const dependencySections = new Set(['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']);
  const forbiddenSnapshotFields = new Set(['resolution', 'integrity', 'tarball', 'url', 'git', 'path', 'directory', 'file']);
  let top = null;
  let importer = null;
  let dependencySection = null;
  let dependency = null;
  let packageRecord = null;
  let packageChildMode = null;
  let snapshotRecord = null;

  for (const [lineIndex, rawLine] of source.split(/\r?\n/).entries()) {
    const lineNumber = lineIndex + 1;
    rejectAmbiguousYamlSyntax(rawLine, lineNumber);
    const line = stripYamlInlineComment(rawLine);
    if (!line.trim()) continue;
    const indent = line.match(/^ */)[0].length;
    if (indent % 2 !== 0) pnpmLockSyntaxError(lineNumber, 'pnpm lock mappings must use canonical two-space indentation');
    const content = line.slice(indent);

    if (indent === 0) {
      const mapping = splitYamlMapping(content, lineNumber);
      const key = parsePlainFieldKey(mapping.rawKey, lineNumber);
      if (topKeys.has(key)) pnpmLockSyntaxError(lineNumber, 'duplicate top-level key ' + key);
      topKeys.add(key);
      if (['importers', 'packages', 'snapshots'].includes(key) && mapping.rawValue !== '') {
        pnpmLockSyntaxError(lineNumber, key + ' must use a block mapping');
      }
      top = key;
      importer = null;
      dependencySection = null;
      dependency = null;
      packageRecord = null;
      packageChildMode = null;
      snapshotRecord = null;
      continue;
    }

    if (top === 'importers') {
      if (indent === 2) {
        const mapping = splitYamlMapping(content, lineNumber);
        const key = parseCanonicalEntryKey(mapping.rawKey, lineNumber);
        const emptyMapping = mapping.rawValue === '{}';
        if (mapping.rawValue !== '' && !emptyMapping) {
          pnpmLockSyntaxError(lineNumber, 'importer records must use block mappings or canonical empty mappings');
        }
        if (importers.has(key)) pnpmLockSyntaxError(lineNumber, 'duplicate importer key ' + key);
        importer = { dependencies: new Map(), fields: new Set() };
        importers.set(key, importer);
        // pnpm emits {} for dependency-free workspace packages; this record has no block children.
        if (emptyMapping) importer = null;
        dependencySection = null;
        dependency = null;
        continue;
      }
      if (!importer) pnpmLockSyntaxError(lineNumber, 'importer content appears before an importer key');
      if (indent === 4) {
        const mapping = splitYamlMapping(content, lineNumber);
        const key = parsePlainFieldKey(mapping.rawKey, lineNumber);
        if (importer.fields.has(key)) pnpmLockSyntaxError(lineNumber, 'duplicate importer field ' + key);
        importer.fields.add(key);
        dependencySection = dependencySections.has(key) && mapping.rawValue === '' ? key : null;
        dependency = null;
        continue;
      }
      if (indent === 6 && dependencySection) {
        const mapping = splitYamlMapping(content, lineNumber);
        const key = parseCanonicalEntryKey(mapping.rawKey, lineNumber);
        if (importer.dependencies.has(key)) pnpmLockSyntaxError(lineNumber, 'duplicate importer dependency key ' + key);
        dependency = { fields: new Set() };
        importer.dependencies.set(key, dependency);
        if (mapping.rawValue) {
          applyImporterDependencyFlow(dependency, mapping.rawValue, lineNumber);
          dependency = null;
        }
        continue;
      }
      if (indent === 8 && dependency) {
        const mapping = splitYamlMapping(content, lineNumber);
        const key = parsePlainFieldKey(mapping.rawKey, lineNumber);
        if (!['specifier', 'version'].includes(key)) {
          pnpmLockSyntaxError(lineNumber, 'importer dependency records allow only specifier and version; resolution overrides and unknown keys are forbidden');
        }
        if (dependency.fields.has(key)) pnpmLockSyntaxError(lineNumber, 'duplicate importer dependency field ' + key);
        const value = parseYamlScalar(mapping.rawValue, lineNumber);
        if (!['plain', 'single'].includes(value.style)) {
          pnpmLockSyntaxError(lineNumber, 'importer dependency values must be canonical scalar versions');
        }
        dependency.fields.add(key);
        dependency[key] = value.value;
        continue;
      }
      if (dependencySection && indent > 6) {
        pnpmLockSyntaxError(lineNumber, 'unexpected nested importer dependency structure');
      }
      continue;
    }

    if (top === 'packages') {
      if (indent === 2) {
        const mapping = splitYamlMapping(content, lineNumber);
        const key = parseCanonicalEntryKey(mapping.rawKey, lineNumber);
        if (mapping.rawValue !== '') pnpmLockSyntaxError(lineNumber, 'package records must use block mappings');
        if (packages.has(key)) pnpmLockSyntaxError(lineNumber, 'duplicate package key ' + key);
        packageRecord = { fields: new Set(), resolution: null, integrity: null, lineNumber };
        packages.set(key, packageRecord);
        packageChildMode = null;
        continue;
      }
      if (!packageRecord) pnpmLockSyntaxError(lineNumber, 'package content appears before a package key');
      if (indent === 4) {
        const mapping = splitYamlMapping(content, lineNumber);
        const key = parsePlainFieldKey(mapping.rawKey, lineNumber);
        if (packageRecord.fields.has(key)) pnpmLockSyntaxError(lineNumber, 'duplicate package field ' + key);
        packageRecord.fields.add(key);
        packageChildMode = mapping.rawValue === '' ? 'other-block' : 'scalar';
        if (key === 'resolution') {
          packageRecord.resolution = mapping.rawValue === ''
            ? new Map()
            : parseStrictFlowMap(mapping.rawValue, lineNumber);
          packageChildMode = mapping.rawValue === '' ? 'resolution-block' : 'resolution-flow';
          if (mapping.rawValue !== '') applyRegistryResolution(packageRecord, packageRecord.resolution, lineNumber);
        } else if (forbiddenSnapshotFields.has(key)) {
          pnpmLockSyntaxError(lineNumber, 'package resolution metadata must appear only in the exact resolution {integrity} mapping');
        }
        continue;
      }
      if (packageChildMode === 'resolution-flow' && indent > 4) {
        pnpmLockSyntaxError(lineNumber, 'flow resolution mappings cannot have nested block content');
      }
      if (packageChildMode === 'resolution-block') {
        if (indent !== 6) pnpmLockSyntaxError(lineNumber, 'block resolution fields must use exactly six spaces');
        const mapping = splitYamlMapping(content, lineNumber);
        const key = parsePlainFieldKey(mapping.rawKey, lineNumber);
        if (packageRecord.resolution.has(key)) pnpmLockSyntaxError(lineNumber, 'duplicate resolution key ' + key);
        const value = parseYamlScalar(mapping.rawValue, lineNumber);
        if (value.style === 'empty') pnpmLockSyntaxError(lineNumber, 'resolution values must be scalar');
        packageRecord.resolution.set(key, value);
      }
      continue;
    }

    if (top === 'snapshots') {
      if (indent === 2) {
        const mapping = splitYamlMapping(content, lineNumber);
        const key = parseCanonicalEntryKey(mapping.rawKey, lineNumber);
        if (snapshots.has(key)) pnpmLockSyntaxError(lineNumber, 'duplicate snapshot key ' + key);
        let inlineEmpty = false;
        if (mapping.rawValue !== '') {
          const inline = parseStrictFlowMap(mapping.rawValue, lineNumber);
          if (inline.size !== 0) {
            pnpmLockSyntaxError(lineNumber, 'inline snapshot records may only use the canonical empty {} mapping');
          }
          inlineEmpty = true;
        }
        snapshotRecord = { fields: new Set(), inlineEmpty };
        snapshots.set(key, snapshotRecord);
        continue;
      }
      if (!snapshotRecord) pnpmLockSyntaxError(lineNumber, 'snapshot content appears before a snapshot key');
      if (indent === 4) {
        if (snapshotRecord.inlineEmpty) {
          pnpmLockSyntaxError(lineNumber, 'an inline empty snapshot cannot also contain block fields');
        }
        const mapping = splitYamlMapping(content, lineNumber);
        const key = parsePlainFieldKey(mapping.rawKey, lineNumber);
        if (snapshotRecord.fields.has(key)) pnpmLockSyntaxError(lineNumber, 'duplicate snapshot field ' + key);
        snapshotRecord.fields.add(key);
        if (forbiddenSnapshotFields.has(key)) {
          pnpmLockSyntaxError(lineNumber, 'snapshot records must only bind the exact peer graph; package resolution metadata and non-registry sources are forbidden');
        }
      }
    }
  }

  for (const [key, importerRecord] of importers) {
    for (const [name, dependencyRecord] of importerRecord.dependencies) {
      if (dependencyRecord.fields.size !== 2
        || !dependencyRecord.fields.has('specifier')
        || !dependencyRecord.fields.has('version')) {
        pnpmLockSyntaxError(1, 'importer ' + key + ' dependency ' + name + ' must contain exactly specifier and version');
      }
    }
  }
  for (const [key, record] of packages) {
    if (!record.fields.has('resolution') || !record.resolution) {
      pnpmLockSyntaxError(record.lineNumber, 'package ' + key + ' requires one registry resolution {integrity}');
    }
    if (record.integrity === null) applyRegistryResolution(record, record.resolution, record.lineNumber);
  }
  return { importers, packages, snapshots, duplicateRecords: new Set() };
}

// A pnpm importer version is one resolved version plus zero or more balanced peer
// suffixes, e.g. "57.0.21(react@19.2.0)". Split it instead of pattern-building from
// the expected string so the same parse serves exact and train requirements.
const LOCK_VERSION = /^([^()\s]+)((?:\([^()\r\n]+\))*)$/;

/**
 * Verify one dependency in the frozen lockfile.
 * mode 'exact' requires the literal version (design-system releases, where the
 * release record is the authority). mode 'train' requires the specifier and the
 * resolved version to sit in the recorded floor's major train.
 */
function verifyLockedDependency(lock, importerRoot, name, requirement, { mode = 'exact' } = {}) {
  const importer = lock.importers.get(importerRoot);
  if (!importer) {
    add('pnpm-lock.yaml#importers.' + importerRoot, 'runtime importer is missing from the frozen lockfile');
    return;
  }
  const dependency = importer.dependencies.get(name);
  const parsedVersion = typeof dependency?.version === 'string' ? LOCK_VERSION.exec(dependency.version) : null;
  const version = parsedVersion?.[1] ?? null;
  const specifierViolation = mode === 'train'
    ? trainViolation(dependency?.specifier, requirement)
    : (dependency?.specifier === requirement ? null : 'must equal exact ' + requirement);
  const resolvedViolation = version === null
    ? 'must be one resolved version with balanced pnpm peer suffixes only'
    : (mode === 'train'
      ? resolvedVersionViolation(version, requirement)
      : (version === requirement ? null : 'must equal exact ' + requirement));
  if (specifierViolation || resolvedViolation) {
    const expectation = mode === 'train' ? 'the ' + trainLabel(requirement) + ' train' : 'exact ' + requirement;
    add('pnpm-lock.yaml#importers.' + importerRoot + '.dependencies.' + name,
      'specifier and resolved version must both satisfy ' + expectation
      + (specifierViolation ? '; specifier "' + dependency?.specifier + '" ' + specifierViolation : '')
      + (resolvedViolation ? '; resolved "' + dependency?.version + '" ' + resolvedViolation : ''));
  }
  if (version === null || resolvedViolation) return;
  const resolvedVersion = dependency.version;

  const baseKey = name + '@' + version;
  const exactKey = name + '@' + resolvedVersion;
  const peerQualified = exactKey !== baseKey;
  const packageRecord = lock.packages.get(baseKey);
  const exactPackageRecord = lock.packages.get(exactKey);
  const snapshotRecord = lock.snapshots.get(exactKey);
  const duplicateBase = lock.duplicateRecords.has('packages:' + baseKey);
  const duplicateExactPackage = lock.duplicateRecords.has('packages:' + exactKey);
  const duplicateSnapshot = lock.duplicateRecords.has('snapshots:' + exactKey);
  const correlationPath = 'pnpm-lock.yaml#importers.' + importerRoot + '.dependencies.' + name + '.version';

  if (peerQualified) {
    if (packageRecord === undefined || snapshotRecord === undefined) {
      add(correlationPath, 'peer-qualified importer version must map exactly to one snapshots record and its unqualified packages artifact record');
    }
    if (exactPackageRecord !== undefined || duplicateBase || duplicateExactPackage || duplicateSnapshot) {
      add(correlationPath, 'ambiguous peer-qualified package or snapshot candidates are forbidden');
    }
  } else if (packageRecord === undefined || duplicateBase || duplicateSnapshot) {
    add(correlationPath, 'importer version must map exactly to one packages record without duplicate candidates');
  }

  const encodedIntegrity = typeof packageRecord?.integrity === 'string'
    ? packageRecord.integrity.slice('sha512-'.length)
    : '';
  let integrityValid = false;
  try {
    const digest = Buffer.from(encodedIntegrity, 'base64');
    integrityValid = digest.length === 64
      && digest.toString('base64').replace(/=+$/, '') === encodedIntegrity.replace(/=+$/, '');
  } catch {
    integrityValid = false;
  }
  if (packageRecord === undefined || !integrityValid) {
    add('pnpm-lock.yaml#packages.' + baseKey, 'registry resolution with a complete 64-byte sha512 integrity is required; tarball, Git, URL and path resolutions are forbidden');
  }
}

function componentIdFromSymbol(symbol) {
  if (symbol === 'HjmProvider' || symbol === 'HjmNativeProvider') return 'design-system-provider';
  // The native renderer exports TextField for the catalog's shared Field recipe.
  if (symbol === 'TextField') return 'field';
  if (symbol === 'TabPanel') return 'tabs';
  if (symbol === 'ToastProvider' || symbol === 'ToastRegion') return 'toast';
  return symbol
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function isNoopScript(command) {
  if (typeof command !== 'string' || !command.trim()) return true;
  const normalized = command.trim();
  if (/^(?:true|:|exit\s+0|echo(?:\s+.*)?|printf(?:\s+.*)?)$/i.test(normalized)) return true;
  const emptyEval = normalized.match(/^node\s+(?:-e|--eval)\s+(['"])([\s\S]*)\1$/);
  return Boolean(emptyEval && /^(?:|;|void\s+0;?|(?:process\.)?exit\(0\);?)$/.test(emptyEval[2].trim()));
}

async function verifyServerRuntime(runtime, manifest) {
  if (runtime.kind !== 'server') return;
  if (runtime.moduleFormat !== 'esm') add('contract.runtimes.server.moduleFormat', 'NestJS runtime must declare moduleFormat esm');
  if (manifest.type !== 'module') add(runtime.root + '/package.json.type', 'NestJS v1 runtime must set package type to module');
  for (const [name, floor] of Object.entries(serverTooling)) {
    const violation = trainViolation(manifest.devDependencies?.[name], floor);
    if (violation) {
      add(runtime.root + '/package.json.devDependencies.' + name, 'NestJS v1 runtime devDependency ' + name + ' "' + manifest.devDependencies?.[name] + '" ' + violation);
    }
  }
  if (!/^eslint(?:\s|$)/.test(String(manifest.scripts?.lint || '').trim())) {
    add(runtime.root + '/package.json.scripts.lint', 'NestJS v1 keeps the cross-runtime ESLint contract; the CLI oxlint default is not accepted');
  }
  if (!/^vitest(?:\s|$)/.test(String(manifest.scripts?.test || '').trim())) {
    add(runtime.root + '/package.json.scripts.test', 'NestJS v1 unit tests must run with Vitest');
  }
  if (!/^vitest(?:\s|$)/.test(String(manifest.scripts?.['test:e2e'] || '').trim())) {
    add(runtime.root + '/package.json.scripts.test:e2e', 'NestJS v1 e2e tests must run with Vitest and Supertest');
  }
  try {
    const tsconfigSource = stripCodeComments(await readFile(resolve(appRoot, runtime.root, 'tsconfig.json'), 'utf8'))
      .replace(/,\s*([}\]])/g, '$1');
    const tsconfig = JSON.parse(tsconfigSource);
    if (tsconfig.compilerOptions?.module !== 'NodeNext' || tsconfig.compilerOptions?.moduleResolution !== 'NodeNext') {
      add(runtime.root + '/tsconfig.json.compilerOptions', 'NestJS ESM requires module and moduleResolution to equal NodeNext');
    }
  } catch (error) {
    add(runtime.root + '/tsconfig.json', 'NestJS ESM tsconfig must be readable JSON/JSONC: ' + error.message);
  }
}

function stripCodeComments(source) {
  // 블록 주석을 빈 문자열로 바꾸면 줄 수가 줄어 보고하는 행 번호가 원본과 어긋난다.
  // 같은 수의 줄바꿈으로 바꿔 위치를 유지한다.
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ''))
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

function sanitizeJavaScriptStructure(source) {
  const uncommented = stripCodeComments(source);
  let result = '';
  let state = 'code';
  let preserveImportString = false;
  for (let index = 0; index < uncommented.length; index += 1) {
    const character = uncommented[index];
    if (state === 'code') {
      if (character === '`') {
        state = 'template';
        result += ' ';
      } else if (character === "'" || character === '"') {
        const line = result.slice(result.lastIndexOf('\n') + 1);
        preserveImportString = /\b(?:from\s*|import\s*(?:\(\s*)?|require\s*\(\s*)$/.test(line);
        state = character === "'" ? 'single' : 'double';
        result += preserveImportString ? character : ' ';
      } else {
        result += character;
      }
      continue;
    }
    const quote = state === 'single' ? "'" : state === 'double' ? '"' : '`';
    if (character === '\\') {
      result += preserveImportString ? character + (uncommented[index + 1] || '') : '  ';
      index += 1;
    } else if (character === quote) {
      result += preserveImportString ? character : ' ';
      state = 'code';
      preserveImportString = false;
    } else {
      result += character === '\n' ? '\n' : preserveImportString ? character : ' ';
    }
  }
  return result;
}

function resolveLocalSource(runtimeRoot, fromPath, specifier, sourceByPath) {
  if (!specifier.startsWith('.') && !specifier.startsWith('@/')) return null;
  const base = specifier.startsWith('@/')
    ? resolve(runtimeRoot, 'src', specifier.slice(2))
    : resolve(dirname(fromPath), specifier);
  const candidates = [
    base,
    ...['.js', '.jsx', '.ts', '.tsx'].map((extension) => base + extension),
    ...['.js', '.jsx', '.ts', '.tsx'].map((extension) => resolve(base, 'index' + extension)),
  ];
  return candidates.find((candidate) => sourceByPath.has(candidate)) || null;
}

function walkReachable(runtimeRoot, entries, codeSources) {
  const sourceByPath = new Map(codeSources.map((item) => [item.path, item]));
  const reachable = new Set(entries.map(({ path }) => path));
  const queue = [...reachable];
  while (queue.length > 0) {
    const path = queue.shift();
    const source = sourceByPath.get(path)?.source || '';
    for (const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?|\brequire\s*\(\s*)(['"])([^'"]+)\1/g)) {
      const target = resolveLocalSource(runtimeRoot, path, match[2], sourceByPath);
      if (target && !reachable.has(target)) {
        reachable.add(target);
        queue.push(target);
      }
    }
  }
  return codeSources.filter(({ path }) => reachable.has(path));
}

function runtimeEntrySources(runtime, runtimeRoot, codeSources) {
  if (runtimeBindings) {
    const declared = codeSources.filter(({ path }) => runtime.binding.entryPoints.some((entry) => resolve(runtimeRoot, entry) === path));
    if (!declared.length) add(runtime.root, 'declared frontend runtime entrypoint has no inspectable JS/TS source');
    // File-system routers load pages without a JavaScript import from the layout.
    const routes = codeSources.filter(({ path }) => {
      const name = relative(runtimeRoot, path).replaceAll('\\', '/');
      return runtime.framework === 'nextjs'
        ? /^(?:src\/)?app\/(?:.*\/)?(?:layout|page)\.(?:js|jsx|ts|tsx)$/.test(name)
        : runtime.framework === 'expo' && /^(?:src\/)?app\/.*\.(?:js|jsx|ts|tsx)$/.test(name);
    });
    return [...new Set([...declared, ...routes])];
  }
  const relativeName = (path) => relative(runtimeRoot, path).replaceAll('\\', '/');
  const canonicalEntry = runtime.kind === 'web'
    ? /^(?:src\/)?app\/(?:.*\/)?(?:layout|page)\.(?:js|jsx|ts|tsx)$/
    : /^(?:src\/)?app\/.*\.(?:js|jsx|ts|tsx)$/;
  let entries = codeSources.filter(({ path }) => canonicalEntry.test(relativeName(path)));
  if (entries.length === 0) entries = codeSources.filter(({ path }) => /^src\/app\.(?:js|jsx|ts|tsx)$/.test(relativeName(path)));
  if (entries.length === 0) {
    add(runtime.root, 'active frontend runtime requires a canonical Next app page/layout or Expo app route entrypoint');
  }
  return entries;
}

function reachableRuntimeSources(runtime, runtimeRoot, codeSources) {
  return walkReachable(runtimeRoot, runtimeEntrySources(runtime, runtimeRoot, codeSources), codeSources);
}

function providerBoundarySources(runtime, runtimeRoot, codeSources) {
  if (runtimeBindings) return walkReachable(runtimeRoot, codeSources.filter(({ path }) => runtime.binding.entryPoints.some((entry) => resolve(runtimeRoot, entry) === path)), codeSources);
  const relativeName = (path) => relative(runtimeRoot, path).replaceAll('\\', '/');
  const boundaryPattern = runtime.kind === 'web'
    ? /^(?:src\/)?app\/layout\.(?:js|jsx|ts|tsx)$/
    : /^(?:src\/)?app\/_layout\.(?:js|jsx|ts|tsx)$/;
  const canonicalAppEntryPattern = runtime.kind === 'web'
    ? /^(?:src\/)?app\/(?:.*\/)?(?:layout|page)\.(?:js|jsx|ts|tsx)$/
    : /^(?:src\/)?app\/.*\.(?:js|jsx|ts|tsx)$/;
  const hasCanonicalAppDirectory = codeSources.some(({ path }) => canonicalAppEntryPattern.test(relativeName(path)));
  let entries = codeSources.filter(({ path }) => boundaryPattern.test(relativeName(path)));
  if (runtime.kind === 'web' && entries.length === 0) {
    // Next permits a root under [locale] or a route group, provided it has no
    // ancestor layout. A nested layout under another layout is not a root.
    const layouts = codeSources.filter(({ path }) => /^(?:src\/)?app\/(?:.*\/)?layout\.(?:js|jsx|ts|tsx)$/.test(relativeName(path)));
    entries = layouts.filter(({ path }) => !layouts.some((other) => other.path !== path
      && relativeName(path).startsWith(relativeName(other.path).replace(/layout\.[^/]+$/, ''))));
  }
  if (entries.length === 0 && !hasCanonicalAppDirectory) entries = codeSources.filter(({ path }) => /^src\/app\.(?:js|jsx|ts|tsx)$/.test(relativeName(path)));
  if (entries.length === 0) {
    add(runtime.root, 'active frontend runtime requires a root provider boundary in Next app/layout, Expo app/_layout, or the test-only src/app fallback');
    return [];
  }
  return walkReachable(runtimeRoot, entries, codeSources);
}

function findBalancedBlockEnd(source, openIndex) {
  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
  }
  return -1;
}

function findExpressionEnd(source, startIndex, limit = source.length) {
  let parentheses = 0;
  let brackets = 0;
  let braces = 0;
  for (let index = startIndex; index < limit; index += 1) {
    const character = source[index];
    if (character === '(') parentheses += 1;
    if (character === ')') parentheses -= 1;
    if (character === '[') brackets += 1;
    if (character === ']') brackets -= 1;
    if (character === '{') braces += 1;
    if (character === '}') braces -= 1;
    if (character === ';' && parentheses === 0 && brackets === 0 && braces === 0) return index;
  }
  return limit;
}

function topLevelReturnRanges(source, bodyStart, bodyEnd) {
  const ranges = [];
  let braces = 0;
  for (let index = bodyStart; index < bodyEnd; index += 1) {
    const character = source[index];
    if (character === '{') {
      braces += 1;
      continue;
    }
    if (character === '}') {
      braces -= 1;
      continue;
    }
    if (braces !== 0 || !source.startsWith('return', index)) continue;
    const before = source[index - 1] || ' ';
    const after = source[index + 6] || ' ';
    if (/[A-Za-z0-9_$]/.test(before) || /[A-Za-z0-9_$]/.test(after)) continue;
    let expressionStart = index + 6;
    while (/\s/.test(source[expressionStart] || '')) expressionStart += 1;
    const expressionEnd = findExpressionEnd(source, expressionStart, bodyEnd);
    ranges.push([expressionStart, expressionEnd]);
    index = expressionEnd;
  }
  return ranges;
}

function exportedRootReturnExpressions(structureSource, rawSource) {
  const ranges = [];
  for (const match of structureSource.matchAll(/export\s+default\s+(?:async\s+)?function(?:\s+[A-Za-z_$][A-Za-z0-9_$]*)?\s*\([^)]*\)\s*\{/g)) {
    const openIndex = match.index + match[0].lastIndexOf('{');
    const endIndex = findBalancedBlockEnd(structureSource, openIndex);
    if (endIndex > openIndex) ranges.push(...topLevelReturnRanges(structureSource, openIndex + 1, endIndex - 1));
  }
  for (const match of structureSource.matchAll(/export\s+const\s+(?:App|RootLayout)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][A-Za-z0-9_$]*)\s*=>/g)) {
    let expressionStart = structureSource.indexOf('=>', match.index) + 2;
    while (/\s/.test(structureSource[expressionStart] || '')) expressionStart += 1;
    if (structureSource[expressionStart] === '{') {
      const endIndex = findBalancedBlockEnd(structureSource, expressionStart);
      if (endIndex > expressionStart) ranges.push(...topLevelReturnRanges(structureSource, expressionStart + 1, endIndex - 1));
    } else {
      ranges.push([expressionStart, findExpressionEnd(structureSource, expressionStart)]);
    }
  }
  return ranges.map(([start, end]) => rawSource.slice(start, end));
}

function returnedTreeHasProvider(expression, providerSymbol) {
  const providerOpen = new RegExp('<' + providerSymbol + '\\b[^>]*\\btheme\\s*=\\s*[\'"]system[\'"]');
  const opening = providerOpen.exec(expression);
  if (!opening) return false;
  const closePattern = new RegExp('</' + providerSymbol + '\\s*>', 'g');
  const closings = [...expression.matchAll(closePattern)];
  if (closings.length === 0) return false;
  const prefix = expression.slice(0, opening.index);
  if (/=>|\b(?:function|const|let|var|return)\b|\?|&&|\|\||<\s*[A-Z_$]|<\s*template\b/i.test(prefix)) return false;
  const closing = closings[closings.length - 1];
  const suffix = expression.slice(closing.index + closing[0].length)
    .replace(/<\/\s*[a-z][A-Za-z0-9:-]*\s*>/g, '')
    .replace(/<\/\s*>/g, '')
    .replace(/[\s);]+/g, '');
  return suffix.length === 0;
}

function hasDirectRenderedJsxTag(expression, symbol) {
  const source = sanitizeJavaScriptStructure(expression);
  const openingTag = new RegExp('<' + symbol + '\\b', 'g');
  let braces = 0;
  let nextMatch = openingTag.exec(source);
  for (let index = 0; index < source.length && nextMatch; index += 1) {
    if (index === nextMatch.index && braces === 0) return true;
    if (source[index] === '{') braces += 1;
    if (source[index] === '}') braces = Math.max(0, braces - 1);
    if (index >= nextMatch.index) nextMatch = openingTag.exec(source);
  }
  return false;
}

async function verifyFrontendSources(contract, catalogMaturity) {
    for (const runtime of contract.runtimes || []) {
      if (!['mobile', 'web'].includes(runtime.kind) || runtime.framework === 'flutter') continue;
      const runtimeRoot = resolve(appRoot, runtime.root);
      let sourceFiles = [];
      try { sourceFiles = await collectSourceFiles(runtimeRoot); } catch { add(runtime.root, 'frontend runtime source root is missing'); }
      const sources = await Promise.all(sourceFiles.map(async (path) => ({ path, source: await readFile(path, 'utf8') })));
      const codeSources = sources.map(({ path, source }) => ({
        path,
        source: sanitizeJavaScriptStructure(source),
        rawSource: stripCodeComments(source),
      }));
      const reachableSources = reachableRuntimeSources(runtime, runtimeRoot, codeSources);
      const boundarySources = providerBoundarySources(runtime, runtimeRoot, codeSources);
      const providerSymbol = runtime.kind === 'web' ? 'HjmProvider' : 'HjmNativeProvider';
      const rendererPackage = runtime.kind === 'web' ? '@hjmds/react' : '@hjmds/react-native';
      const rendererReExport = new RegExp('\\bexport\\s+(?:\\*|\\{[^}]*\\})\\s+from\\s*[\'"]' + rendererPackage + '(?:/[^\'"]+)?[\'"]');
      const dynamicRendererImport = new RegExp('\\bimport\\s*\\(\\s*[\'"]' + rendererPackage + '(?:/[^\'"]+)?[\'"]');
      const rendererLiteral = new RegExp('[\'"]' + rendererPackage + '(?:/[^\'"]+)?[\'"]');
      const namedRendererImport = new RegExp('\\bimport\\s*\\{[^}]*\\}\\s*from\\s*[\'"]' + rendererPackage + '(?:/[^\'"]+)?[\'"]\\s*;?', 'g');
      const typeRendererImport = new RegExp('\\bimport\\s+type\\s*\\{[^}]*\\}\\s*from\\s*[\'"]' + rendererPackage + '(?:/[^\'"]+)?[\'"]\\s*;?', 'g');
      const styleRendererImport = new RegExp('\\bimport\\s*[\'"]' + rendererPackage + '/styles\\.css[\'"]\\s*;?', 'g');
      const reachablePaths = new Set(reachableSources.map(({ path }) => path));
      for (const { path, source, rawSource } of (runtimeBindings ? reachableSources : codeSources)) {
        // Mocks and type queries in test-only files do not load a renderer in the
        // shipped app. A test file imported by a runtime entry is still checked.
        if (!reachablePaths.has(path)
          && /(?:^|\/)(?:test|tests|__tests__|__mocks__)\/|\.(?:test|spec)\.[cm]?[jt]sx?$/.test(relative(runtimeRoot, path))) continue;
        if (rendererReExport.test(source)) add(relative(appRoot, path), 'HJM renderer re-exports are prohibited; app code must use direct named renderer imports so maturity checks cannot be hidden by a barrel');
        if (dynamicRendererImport.test(source)) add(relative(appRoot, path), 'HJM renderer dynamic imports are prohibited; only direct static named imports are compatible with maturity and prop enforcement');
        const withoutStaticLoads = rawSource.replace(/\brequire\s*\(\s*(['"])([^'"]+)\1\s*\)/g, (load, _quote, target) =>
          target.startsWith('@hjmds/') ? load : '');
        if (/\brequire\b|\bcreateRequire\b/.test(sanitizeJavaScriptStructure(withoutStaticLoads))) add(relative(appRoot, path), 'CommonJS require/createRequire is prohibited for HJM renderers or computed loads; native modules and assets must have a static literal target');
        if (rendererLiteral.test(rawSource.replace(namedRendererImport, '').replace(typeRendererImport, '').replace(styleRendererImport, ''))) add(relative(appRoot, path), 'HJM renderer references outside direct static named imports are prohibited');
      }
      const providerImport = new RegExp('(?:^|\\n)\\s*import\\s*\\{[^}]*\\b' + providerSymbol + '\\b[^}]*\\}\\s*from\\s*[\'"]' + rendererPackage + '(?:/[^\'"]+)?[\'"]', 'm');
      if (!boundarySources.some(({ source, rawSource }) => providerImport.test(source)
        && exportedRootReturnExpressions(source, rawSource).some((expression) => returnedTreeHasProvider(expression, providerSymbol)))) {
        add(runtime.root, 'active frontend runtime must directly import ' + providerSymbol + ' and render theme="system" inside the canonical exported root boundary; dead helper JSX does not satisfy this gate');
      }
      const requiredSymbols = ['Text', 'Icon', 'Stack', 'Container'];
      for (const symbol of requiredSymbols) {
        const symbolImport = new RegExp('(?:^|\\n)\\s*import\\s*\\{[^}]*\\b' + symbol + '\\b[^}]*\\}\\s*from\\s*[\'"]' + rendererPackage + '(?:/[^\'"]+)?[\'"]', 'm');
        if (!boundarySources.some(({ source, rawSource }) => symbolImport.test(source)
          && exportedRootReturnExpressions(source, rawSource)
            .some((expression) => hasDirectRenderedJsxTag(expression, symbol)))) {
          add(runtime.root, 'required foundation ' + symbol + ' must be imported from the declared renderer and rendered in the canonical exported root return tree');
        }
      }
      // HJM이 HjmCompositionStyleProp으로 좁힌 slot style prop. 시각 키는 타입에서 막힌다.
      const compositionStyleProps = new Set(['layoutStyle', 'headerStyle', 'copyStyle', 'actionStyle', 'contentStyle']);
      for (const { path, source } of reachableSources) {
        const importedHjmSymbols = new Map();
        const namespaceImports = new Set();
        const declaredMaturityComponents = new Set([
          ...(contract.designSystem?.requiredFoundations || []).map((item) => item.componentId),
          ...(contract.designSystem?.optionalBetaAdoptions || []).map((item) => item.componentId),
        ]);
        const importPattern = new RegExp('(?:^|\\n)\\s*import\\s*\\{([^}]*)\\}\\s*from\\s*[\'"]' + rendererPackage + '(?:/[^\'"]+)?[\'"]', 'gm');
        for (const match of source.matchAll(importPattern)) {
          for (const specifier of match[1].split(',')) {
            const rawSpecifier = specifier.trim();
            if (/^type\s+/.test(rawSpecifier)) continue;
            const cleaned = rawSpecifier;
            if (!cleaned) continue;
            const parts = cleaned.split(/\s+as\s+/);
            importedHjmSymbols.set((parts[1] || parts[0]).trim(), parts[0].trim());
          }
        }
        const namespacePattern = new RegExp('(?:^|\\n)\\s*import\\s*\\*\\s*as\\s+([A-Za-z_$][A-Za-z0-9_$]*)\\s*from\\s*[\'"]' + rendererPackage + '(?:/[^\'"]+)?[\'"]', 'gm');
        for (const match of source.matchAll(namespacePattern)) {
          namespaceImports.add(match[1]);
          add(relative(appRoot, path), 'HJM renderer namespace imports are prohibited; use direct named imports for maturity and prop enforcement');
        }
        for (let pass = 0; pass < 4; pass += 1) {
          for (const match of source.matchAll(/(?:^|\n)\s*const\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*;?/gm)) {
            if (importedHjmSymbols.has(match[2])) importedHjmSymbols.set(match[1], importedHjmSymbols.get(match[2]));
          }
          for (const match of source.matchAll(/(?:^|\n)\s*const\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*(?:memo|forwardRef)\(\s*([A-Za-z_$][A-Za-z0-9_$]*)/gm)) {
            if (importedHjmSymbols.has(match[2])) importedHjmSymbols.set(match[1], importedHjmSymbols.get(match[2]));
          }
        }
        for (const exportedSymbol of new Set(importedHjmSymbols.values())) {
          // Renderer hooks and ID helpers are functions, not catalog components.
          // An alias rendered as JSX still goes through inspectRenderedTags below.
          if (/^[a-z]/.test(exportedSymbol)) continue;
          const componentId = componentIdFromSymbol(exportedSymbol);
          const maturity = catalogMaturity.get(componentId);
          const runtimeSupport = {
            'bottom-cta': ['mobile'],
            'top-bar': ['mobile'],
            tooltip: ['web'],
            'visually-hidden': ['web'],
          }[componentId] || ['mobile', 'web'];
          if (!maturity) {
            add(relative(appRoot, path), 'imported HJM symbol ' + exportedSymbol + ' does not resolve to the pinned component catalog');
          } else if (!runtimeSupport.includes(runtime.kind)) {
            add(relative(appRoot, path), 'imported HJM component "' + componentId + '" is unsupported by the ' + runtime.kind + ' renderer');
          } else if (maturity === 'beta' && !declaredMaturityComponents.has(componentId)) {
            add(relative(appRoot, path), 'imported HJM beta component "' + componentId + '" is not declared by requiredFoundations or optionalBetaAdoptions');
          } else if (maturity === 'planned' || maturity === 'deprecated') {
            add(relative(appRoot, path), 'imported HJM component "' + componentId + '" has prohibited maturity ' + maturity);
          }
        }
        const inspectRenderedTags = (localSymbol, exportedSymbol, renderedTags) => {
          if (renderedTags.length > 0) {
            const componentId = componentIdFromSymbol(exportedSymbol);
            const maturity = catalogMaturity.get(componentId);
            const runtimeSupport = {
              'bottom-cta': ['mobile'],
              'top-bar': ['mobile'],
              tooltip: ['web'],
              'visually-hidden': ['web'],
            }[componentId] || ['mobile', 'web'];
            if (!maturity) {
              add(relative(appRoot, path), 'rendered HJM symbol ' + exportedSymbol + ' does not resolve to the pinned component catalog');
            } else if (!runtimeSupport.includes(runtime.kind)) {
              add(relative(appRoot, path), 'rendered HJM component "' + componentId + '" is unsupported by the ' + runtime.kind + ' renderer');
            } else if (maturity === 'beta' && !declaredMaturityComponents.has(componentId)) {
              add(relative(appRoot, path), 'rendered HJM beta component "' + componentId + '" is not declared by requiredFoundations or optionalBetaAdoptions');
            } else if (maturity === 'planned' || maturity === 'deprecated') {
              add(relative(appRoot, path), 'rendered HJM component "' + componentId + '" has prohibited maturity ' + maturity);
            }
          }
          for (const tag of renderedTags) {
            if (/\{\s*\.\.\./.test(tag.attrs)) {
              add(relative(appRoot, path), 'HJM component ' + localSymbol + ' uses a spread prop; explicit props are required so prohibited style-like props cannot be hidden');
            }
            for (const prop of tag.attrs.matchAll(/\b([A-Za-z][A-Za-z0-9]*Style|style)\s*=/g)) {
              // HJM 0.9.3부터 아래 slot prop들은 타입이 HjmCompositionStyleProp으로 좁혀져
              // 배치 키만 받는다. 규칙의 목적은 recipe 소유 외형을 slot으로 숨기는 것을
              // 막는 것이므로, 타입이 이미 막는 slot은 금지 대상이 아니다.
              if (!compositionStyleProps.has(prop[1])) add(relative(appRoot, path), 'HJM component ' + localSymbol + ' uses prohibited legacy style-like prop "' + prop[1] + '"; only layoutStyle or a composition-typed slot style is allowed');
            }
          }
        };
        for (const [localSymbol, exportedSymbol] of importedHjmSymbols) {
          const openingTag = new RegExp('<' + localSymbol + '\\b([^>]*)>', 'g');
          inspectRenderedTags(localSymbol, exportedSymbol, [...source.matchAll(openingTag)].map((match) => ({ attrs: match[1] })));
        }
        for (const namespace of namespaceImports) {
          const namespaceTag = new RegExp('<' + namespace + '\\.([A-Za-z_$][A-Za-z0-9_$]*)\\b([^>]*)>', 'g');
          for (const match of source.matchAll(namespaceTag)) inspectRenderedTags(namespace + '.' + match[1], match[1], [{ attrs: match[2] }]);
        }
      }
      const rawPattern = /#[0-9A-Fa-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch|lab|lch|color)\s*\(|(?:^|[^0-9])(?:[0-9]*\.[0-9]+)(?:px|rem|em|pt)\b|\b(?:gap|rowGap|columnGap|padding|margin|borderRadius|fontSize|lineHeight|letterSpacing)\s*[:=]\s*(?:-?(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)(?:px|rem|em|pt|%)?|['"]-?(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)(?:px|rem|em|pt|%)?['"])|\b(?:padding|margin|font-size|line-height|letter-spacing|row-gap|column-gap|border-radius)\s*:\s*-?(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)(?:px|rem|em|pt|%)?\b|\b(?:color|backgroundColor)\s*[:=]\s*['"](?:red|blue|green|black|white|gray|grey|transparent)['"]|\b(?:color|background-color)\s*:\s*(?:red|blue|green|black|white|gray|grey|transparent)\b|\b(?:bg|text|border)-(?:red|blue|green|black|white|gray|grey|amber|indigo|violet|pink|rose)-[1-9][0-9]{1,2}\b|\b(?:(?:space-[xy])|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap)-[0-9]+(?:\.[0-9]+)?\b|var\(\s*--(?!hjm-)[A-Za-z0-9_-]+/i;
      const rawPatternAll = new RegExp(rawPattern.source, 'gi');
      for (const { path, rawSource } of reachableSources) {
        if (/(?:^|\/)(?:test|tests|__tests__)\//.test(path)) continue;
        rawPatternAll.lastIndex = 0;
        const hits = [];
        for (let match = rawPatternAll.exec(rawSource); match !== null; match = rawPatternAll.exec(rawSource)) {
          const line = rawSource.slice(0, match.index).split('\n').length;
          hits.push(line + ':' + match[0].replace(/\s+/g, ' ').trim());
          if (match[0].length === 0) rawPatternAll.lastIndex += 1;
        }
        // 파일 이름만 알려주면 어디를 고칠지 알 수 없다. 처음 몇 곳과 전체 건수를 함께 준다.
        if (hits.length > 0) {
          const shown = hits.slice(0, 5).join(', ');
          add(relative(appRoot, path), 'raw color/spacing/radius/type value found outside HJM semantic contracts ('
            + hits.length + ' occurrence(s) at ' + shown + (hits.length > 5 ? ', ...' : '') + ')');
        }
      }
    }
}

let contract;
try {
  contract = JSON.parse(await readFile(resolve(appRoot, 'app.contract.json'), 'utf8'));
} catch (error) {
  add('app.contract.json', error.message);
}

if (contract && runtimeBindings) {
  try {
    const catalog = JSON.parse(await readFile(resolve(appRoot, contract.designSystem.catalog.snapshotPath), 'utf8'));
    await verifyFrontendSources(contract, new Map(catalog.components.map(({ id, status }) => [id, status])));
  } catch (error) { add('runtime source inspection', error.message); }
} else if (contract) {
  const frontendRuntimes = (contract.runtimes || []).filter((runtime) => ['mobile', 'web'].includes(runtime.kind));
  const activeGate = process.env.HJM_APP_STANDARD_TARGET_STAGE === 'implementation-conformant'
    || contract.governance?.status !== 'draft';
  if (frontendRuntimes.length === 0) {
    if (contract.designSystem?.applicability !== 'not_applicable' || typeof contract.designSystem?.rationale !== 'string' || !contract.designSystem.rationale.trim()) {
      add('contract.designSystem', 'server-only products must declare designSystem not_applicable with a rationale');
    }
    await collectPackageFiles(appRoot);
    const serverManifests = new Map();
    for (const packagePath of packageFiles) {
      const manifest = JSON.parse(await readFile(packagePath, 'utf8'));
      serverManifests.set(packagePath, manifest);
      for (const section of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
        for (const name of Object.keys(manifest[section] || {})) {
          if (name.startsWith('@hjmds/')) add(relative(appRoot, packagePath) + '.' + section + '.' + name, 'server-only products must not declare fake HJM dependencies');
        }
      }
    }
    if (activeGate) {
      for (const runtime of contract.runtimes || []) {
        const manifest = serverManifests.get(resolve(appRoot, runtime.root, 'package.json'));
        if (!manifest) {
          add(runtime.root + '/package.json', 'implementation-conformant runtime manifest is required');
          continue;
        }
        const frameworkPackage = frameworkPackages[runtime.kind];
        const frameworkViolation = frameworkPackage
          ? trainViolation(manifest.dependencies?.[frameworkPackage], runtimeFrameworkFloors[runtime.kind])
          : 'has no framework package for this runtime kind';
        if (frameworkViolation) {
          add(runtime.root + '/package.json.dependencies.' + frameworkPackage, 'implementation-conformant runtime must directly install its framework inside the ' + trainLabel(runtimeFrameworkFloors[runtime.kind]) + ' train; "' + manifest.dependencies?.[frameworkPackage] + '" ' + frameworkViolation);
        }
        await verifyServerRuntime(runtime, manifest);
        for (const scriptName of ['dev', 'lint', 'typecheck', 'test', 'test:e2e', 'build']) {
          if (isNoopScript(manifest.scripts?.[scriptName])) add(runtime.root + '/package.json.scripts.' + scriptName, 'implementation-conformant runtime requires a non-noop ' + scriptName + ' command');
        }
      }
      try {
        const lock = parsePnpmLock(await readFile(resolve(appRoot, 'pnpm-lock.yaml'), 'utf8'));
        for (const runtime of contract.runtimes || []) {
          verifyLockedDependency(lock, runtime.root, frameworkPackages[runtime.kind], runtimeFrameworkFloors[runtime.kind], { mode: 'train' });
          if (runtime.kind === 'server') {
            for (const [name, floor] of Object.entries(serverTooling)) verifyLockedDependency(lock, runtime.root, name, floor, { mode: 'train' });
          }
        }
      } catch (error) {
        add('pnpm-lock.yaml', 'structured frozen framework verification failed: ' + error.message);
      }
    }
  } else {
  const contractsPackage = contract.designSystem?.contracts?.package;
  const contractsVersion = contract.designSystem?.contracts?.version;
  const renderers = new Map((contract.designSystem?.renderers || []).map((renderer) => [renderer.kind, renderer]));
  const allowedByManifest = new Map(frontendRuntimes.map((runtime) => [
    resolve(appRoot, runtime.root, 'package.json'),
    new Set([contractsPackage, renderers.get(runtime.kind)?.package]),
  ]));
  const manifests = new Map();
  await collectPackageFiles(appRoot);
  for (const packagePath of packageFiles) {
    let manifest;
    try {
      manifest = JSON.parse(await readFile(packagePath, 'utf8'));
    } catch (error) {
      add(relative(appRoot, packagePath), error.message);
      continue;
    }
    manifests.set(packagePath, manifest);
    const allowedHjmPackages = allowedByManifest.get(packagePath) || new Set();
    for (const section of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      for (const [name, source] of Object.entries(manifest[section] || {})) {
        if (!name.startsWith('@hjmds/')) continue;
        const path = relative(appRoot, packagePath) + '.' + section + '.' + name;
        if (!allowedHjmPackages.has(name)) {
          add(path, 'HJM package is only allowed in the matching frontend runtime manifest');
        } else if (section !== 'dependencies') {
          add(path, 'HJM runtime packages must be production dependencies of the matching frontend runtime');
        } else if (source !== contractsVersion) {
          add(path, 'must use npm registry exact version ' + contractsVersion + '; ranges, aliases, workspace, Git, path, URL and tarball sources are forbidden');
        }
      }
    }
  }
  for (const runtime of contract.runtimes || []) {
    if (!['mobile', 'web'].includes(runtime.kind)) continue;
    const manifestPath = resolve(appRoot, runtime.root, 'package.json');
    const manifest = manifests.get(manifestPath);
    const renderer = renderers.get(runtime.kind);
    if (!manifest) {
      add(runtime.root + '/package.json', 'frontend runtime package manifest is required');
      continue;
    }
    for (const name of [contractsPackage, renderer?.package]) {
      if (!name) continue;
      if (manifest.dependencies?.[name] !== contractsVersion) {
        add(runtime.root + '/package.json.dependencies.' + name, 'matching frontend runtime must directly depend on npm exact version ' + contractsVersion);
      }
    }
  }

  try {
    const lockSource = await readFile(resolve(appRoot, 'pnpm-lock.yaml'), 'utf8');
    const lock = parsePnpmLock(lockSource);
    for (const runtime of contract.runtimes || []) {
      const frameworkPackage = frameworkPackages[runtime.kind];
      if (activeGate && frameworkPackage) verifyLockedDependency(lock, runtime.root, frameworkPackage, runtimeFrameworkFloors[runtime.kind], { mode: 'train' });
      if (activeGate && runtime.kind === 'server') {
        for (const [name, floor] of Object.entries(serverTooling)) verifyLockedDependency(lock, runtime.root, name, floor, { mode: 'train' });
      }
    }
    for (const runtime of frontendRuntimes) {
      const renderer = renderers.get(runtime.kind);
      for (const name of [contractsPackage, renderer?.package]) {
        if (!name) continue;
        verifyLockedDependency(lock, runtime.root, name, contractsVersion);
      }
    }
  } catch (error) {
    add('pnpm-lock.yaml', 'structured frozen dependency verification failed: ' + error.message);
  }

  if (contract.designSystem?.adoptionPolicy !== 'stable-default') add('contract.designSystem.adoptionPolicy', 'must be stable-default');
  let catalogMaturity = new Map();
  try {
    const catalogSource = await readFile(resolve(appRoot, contract.designSystem.catalog.snapshotPath), 'utf8');
    const catalogDigest = createHash('sha256').update(catalogSource).digest('hex');
    if (catalogDigest !== contract.designSystem.catalog.sha256) add('contract.designSystem.catalog.sha256', 'catalog snapshot bytes do not match the pinned SHA-256');
    const catalog = JSON.parse(catalogSource);
    if (catalog.designSystemVersion !== contract.designSystem.catalog.train) add('contract.designSystem.catalog.train', 'catalog snapshot train mismatch');
    catalogMaturity = new Map((catalog.components || []).map((component) => [component.id, component.status]));
  } catch (error) {
    add('contract.designSystem.catalog.snapshotPath', error.message);
  }
  const evidence = new Map((contract.acceptance?.evidence || []).map((item) => [item.id, item]));
  const maturityRecords = [...(contract.designSystem?.requiredFoundations || []), ...(contract.designSystem?.optionalBetaAdoptions || [])];
  for (const [index, adoption] of maturityRecords.entries()) {
    const prefix = 'contract.designSystem.maturityAdoptions[' + index + ']';
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(adoption.componentId || '')) add(prefix + '.componentId', 'must be a catalog lowercase kebab-case ID');
    if (catalogMaturity.get(adoption.componentId) !== 'beta') add(prefix + '.componentId', 'must resolve to beta in the pinned HJM catalog snapshot');
    if (adoption.adrPath) {
      try { await access(resolve(appRoot, adoption.adrPath)); } catch { add(prefix + '.adrPath', 'optional beta adoption ADR is missing'); }
    }
    if (!Array.isArray(adoption.evidenceIds) || adoption.evidenceIds.length === 0) {
      add(prefix + '.evidenceIds', 'beta adoption requires app evidence');
    } else {
      for (const evidenceId of adoption.evidenceIds) {
        const item = evidence.get(evidenceId);
        if (!item) add(prefix + '.evidenceIds', 'undeclared evidence ' + evidenceId);
        else if (activeGate && (item.status !== 'verified' || !item.capturedAt)) add(prefix + '.evidenceIds', 'foundation/beta evidence ' + evidenceId + ' must be verified and timestamped before active');
        else if (!['planned', 'verified'].includes(item.status)) add(prefix + '.evidenceIds', 'foundation/beta evidence ' + evidenceId + ' must be planned or verified');
      }
    }
  }

  if (activeGate) {
    for (const runtime of contract.runtimes || []) {
      const manifestPath = resolve(appRoot, runtime.root, 'package.json');
      const manifest = manifests.get(manifestPath);
      if (!manifest) {
        add(runtime.root + '/package.json', 'implementation-conformant runtime manifest is required');
        continue;
      }
      const frameworkPackage = frameworkPackages[runtime.kind];
      const frameworkViolation = frameworkPackage
        ? trainViolation(manifest.dependencies?.[frameworkPackage], runtimeFrameworkFloors[runtime.kind])
        : 'has no framework package for this runtime kind';
      if (frameworkViolation) {
        add(runtime.root + '/package.json.dependencies.' + frameworkPackage, 'implementation-conformant runtime must directly install its framework inside the ' + trainLabel(runtimeFrameworkFloors[runtime.kind]) + ' train; "' + manifest.dependencies?.[frameworkPackage] + '" ' + frameworkViolation);
      }
      await verifyServerRuntime(runtime, manifest);
      for (const scriptName of ['dev', 'lint', 'typecheck', 'test', 'test:e2e', 'build']) {
        if (isNoopScript(manifest.scripts?.[scriptName])) {
          add(runtime.root + '/package.json.scripts.' + scriptName, 'implementation-conformant runtime requires a non-noop ' + scriptName + ' command');
        }
      }
    }
    await verifyFrontendSources(contract, catalogMaturity);
  }
  }
}

if (findings.length) {
  for (const finding of findings) process.stderr.write('[DESIGN_CONTRACT] ' + finding.path + ': ' + finding.message + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write('design contract: ready\n');
}
