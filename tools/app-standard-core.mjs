#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { execFile } from 'node:child_process';
import {
  lstat,
  mkdir,
  readFile,
  readdir,
  realpath,
  rm,
  writeFile,
} from 'node:fs/promises';
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { checkDocLinks } from './check-doc-links.mjs';
import { bound, bindingScripts, validateBindings, checkBindings, bindingWorkflow } from './runtime-bindings.mjs';
import { auditJsonSchema, validateWithJsonSchema } from './json-schema-validator.mjs';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const defaultWorkspaceRoot = resolve(scriptDirectory, '..');
const canonicalSchemaPath = resolve(defaultWorkspaceRoot, 'docs/app-contract.schema.json');
const canonicalProfilePath = resolve(
  defaultWorkspaceRoot,
  basename(scriptDirectory) === 'tools' ? 'docs/app-profile.json' : 'docs/profiles/portfolio-default-v1.json',
);
const canonicalReleaseRelativePath = 'docs/profiles/hjm-release.json';
const canonicalCatalogRelativePath = 'docs/profiles/hjm-catalog.snapshot.json';
const canonicalReleaseSource = readFileSync(resolve(defaultWorkspaceRoot, canonicalReleaseRelativePath), 'utf8');
const canonicalRelease = JSON.parse(canonicalReleaseSource);
assertDesignReleaseRecord(canonicalRelease);
const canonicalDesignVersion = canonicalRelease.version;
const canonicalCatalogPath = resolve(defaultWorkspaceRoot, canonicalCatalogRelativePath);
const templateRoot = resolve(defaultWorkspaceRoot, 'docs/templates');
const canonicalSchema = JSON.parse(readFileSync(canonicalSchemaPath, 'utf8'));
const canonicalCatalogSource = readFileSync(canonicalCatalogPath, 'utf8');
const canonicalCatalog = JSON.parse(canonicalCatalogSource);
const canonicalCatalogSha256 = createHash('sha256').update(canonicalCatalogSource).digest('hex');
const expectedCatalogSha256 = canonicalRelease.catalog.sha256;
const catalogMaturity = new Map(canonicalCatalog.components.map(({ id, status }) => [id, status]));
const execFileAsync = promisify(execFile);

const contractVersion = 1;
const standardVersion = '1.0.0';
const canonicalProfileSha256 = '3441dd6202c5fe2d214669d18d34c4854ec129f3879beea5c02a555e28fb3836';
const approvedCentralVerifierCommit = '0000000000000000000000000000000000000000';
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const semverIdentifier = '(?:(?:0|[1-9]\\d*)|(?:\\d*[A-Za-z-][0-9A-Za-z-]*))';
const semverPattern = new RegExp(`^(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)(?:-${semverIdentifier}(?:\\.${semverIdentifier})*)?(?:\\+[0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*)?$`);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const relativePathPattern = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/;
const requiredDocumentKeys = ['product', 'architecture', 'design', 'release', 'decisionsDir'];
const canonicalDocuments = {
  product: 'docs/PRODUCT.md',
  architecture: 'docs/ARCHITECTURE.md',
  design: 'docs/DESIGN.md',
  release: 'docs/RELEASE.md',
  decisionsDir: 'docs/decisions',
};
const requiredScriptNames = [
  'dev',
  'lint',
  'format',
  'format:check',
  'typecheck',
  'test',
  'test:e2e',
  'build',
  'i18n:check',
  'design:check',
  'contract:check',
  'docs:check',
  'check',
];
const conditionalScriptNames = {
  mobile: 'dev:mobile',
  web: 'dev:web',
  server: 'dev:server',
};
const allowedScriptNames = new Set([
  ...requiredScriptNames,
  ...Object.values(conditionalScriptNames),
]);
const canonicalLocalCheckCommands = {
  'design:check': 'node tools/check-design-contract.mjs',
  'contract:check': 'node tools/check-app-contract.mjs',
};
const canonicalNpmrcSource = 'registry=https://registry.npmjs.org/\n@hjmds:registry=https://registry.npmjs.org/\n';
// The cross-runtime lint/format contract. Mirrored byte-for-byte in the profile's
// toolchain.staticAnalysis so apps carry it in docs/app-profile.json.
const staticAnalysisPolicy = {
  "checkedAt": "2026-09-04",
  "linter": "eslint",
  "formatter": "prettier",
  "shared": [
    {
      "package": "eslint",
      "version": "9.39.5",
      "sourceUrl": "https://registry.npmjs.org/eslint/9.39.5",
      "tarballUrl": "https://registry.npmjs.org/eslint/-/eslint-9.39.5.tgz",
      "integrity": "sha512-DgZS62aPLXKlnxILS/AYCoRvHaZeXceIzlXPkkGGzJWSow1aEk0lbTlxUSlyjC8jcaKxAdOnTDz+o1JFSBsyjw=="
    },
    {
      "package": "typescript-eslint",
      "version": "8.69.0",
      "sourceUrl": "https://registry.npmjs.org/typescript-eslint/8.69.0",
      "tarballUrl": "https://registry.npmjs.org/typescript-eslint/-/typescript-eslint-8.69.0.tgz",
      "integrity": "sha512-B3MltX0VqjUBNEe3b3sSuiRbfa6XrfHFtBiPamjT5AsW/dfq+y+bc0wyuS9DxAS1LyzCxRp2+rxzpLUvqM2BvA=="
    },
    {
      "package": "prettier",
      "version": "3.9.6",
      "sourceUrl": "https://registry.npmjs.org/prettier/3.9.6",
      "tarballUrl": "https://registry.npmjs.org/prettier/-/prettier-3.9.6.tgz",
      "integrity": "sha512-OpN0zzVdiaiAhxpuuj5efpIS4sY9j7bY6uR5mnj5yPzGkdkjNKSJeUThPb60Jw29QuAZgA4o+/iB49kFiaBX6g=="
    },
    {
      "package": "eslint-config-prettier",
      "version": "10.1.8",
      "sourceUrl": "https://registry.npmjs.org/eslint-config-prettier/10.1.8",
      "tarballUrl": "https://registry.npmjs.org/eslint-config-prettier/-/eslint-config-prettier-10.1.8.tgz",
      "integrity": "sha512-82GZUjRS0p/jganf6q1rEO25VSoHH0hKPCTrgillPjdI/3bgBhAE1QzHrHTizjpRvy6pGAvKjDJtk2pF9NDq8w=="
    }
  ],
  "presets": {
    "mobile": {
      "package": "eslint-config-expo",
      "version": "57.0.2",
      "entry": "eslint-config-expo/flat.js",
      "sourceUrl": "https://registry.npmjs.org/eslint-config-expo/57.0.2",
      "tarballUrl": "https://registry.npmjs.org/eslint-config-expo/-/eslint-config-expo-57.0.2.tgz",
      "integrity": "sha512-dOWkx+MWclLVnYpPPBzas4sfnPaAjk+fe/dbvJSzbWtHUR4fGGaTT/lTcOpxqhwRIlTKKBUYGKude0tcTBsZHg=="
    },
    "web": {
      "package": "eslint-config-next",
      "version": "16.3.3",
      "entry": "eslint-config-next/core-web-vitals",
      "sourceUrl": "https://registry.npmjs.org/eslint-config-next/16.3.3",
      "tarballUrl": "https://registry.npmjs.org/eslint-config-next/-/eslint-config-next-16.3.3.tgz",
      "integrity": "sha512-teqtsR26tnlfXFHfVLTM/4tzEzU8DMu6GS1sddZzhfGzgd2f2ofbgDUcsk6cssSCzX6Tk6fmWifJcdANSdPJrw=="
    }
  },
  "canonicalFiles": [
    ".editorconfig",
    "prettier.config.mjs",
    ".prettierignore",
    "eslint.config.mjs",
    "tools/eslint.base.mjs"
  ],
  "runtimeConfig": "each runtime root has eslint.config.mjs that imports hjmRuntimeConfig from tools/eslint.base.mjs and, for mobile/web, the pinned preset entry",
  "rationale": "One lint/format contract across Expo, Next.js and NestJS: ESLint owns rules, Prettier owns formatting (eslint-config-prettier disables overlaps), framework presets add runtime-specific rules, and the base config encodes HJM import and shared-package dependency boundaries. ESLint stays on the 9.x line because eslint-plugin-react (required by both eslint-config-expo and eslint-config-next) supports ESLint <=9.7+ only; moving to ESLint 10 needs a standard revision once that plugin ships ESLint 10 support."
};
const packageManagerScanIgnoredDirectories = new Set([
  '.git',
  '.next',
  '.expo',
  'build',
  'coverage',
  'dist',
  'node_modules',
]);

function expectedToolchainScripts(appId, runtimes) {
  const expected = {
    dev: 'pnpm --parallel --recursive dev',
    lint: 'eslint . && pnpm --recursive lint',
    format: 'prettier --write .',
    'format:check': 'prettier --check .',
    typecheck: 'pnpm --recursive typecheck',
    test: 'pnpm --recursive test',
    'test:e2e': 'pnpm --recursive test:e2e',
    build: 'pnpm --recursive build',
    'i18n:check': `pnpm --filter @${appId}/i18n check`,
    ...canonicalLocalCheckCommands,
    'docs:check': 'node tools/check-doc-links.mjs',
    check: 'pnpm lint && pnpm format:check && pnpm typecheck && pnpm test && pnpm test:e2e && pnpm build && pnpm i18n:check && pnpm design:check && pnpm contract:check && pnpm docs:check',
  };
  for (const runtime of Array.isArray(runtimes) ? runtimes : []) {
    const scriptName = conditionalScriptNames[runtime?.kind];
    if (scriptName) expected[scriptName] = `pnpm --filter @${appId}/${runtime.kind} dev`;
  }
  return expected;
}
const waivableRuleIds = new Set([
  'APP-SERVER-ADAPTER-001',
  'APP-FRONTEND-TEST-001',
  'APP-DESIGN-EVIDENCE-001',
]);
const runtimeFrameworks = {
  mobile: 'expo',
  web: 'nextjs',
  server: 'nestjs',
};
const runtimeFrameworkVersions = {
  mobile: '57.0.18',
  web: '16.3.3',
  server: '12.0.1',
};
const requiredProtectedPaths = [
  '.github/workflows/quality-gate.yml',
  '.github/CODEOWNERS',
  '.github/dependabot.yml',
  'app.contract.json',
  'package.json',
  '.npmrc',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'packages/**/package.json',
  'tools',
  'docs/app-profile.json',
  'docs/app-contract.schema.json',
  'docs/hjm-catalog.snapshot.json',
];
const runtimeFrameworkPackages = {
  mobile: 'expo',
  web: 'next',
  server: '@nestjs/core',
};
const runtimeDefaultRoots = {
  mobile: 'apps/mobile',
  web: 'apps/web',
  server: 'apps/server',
};
const runtimeRendererPackages = {
  mobile: '@hjmds/react-native',
  web: '@hjmds/react',
};
const optionalBetaRuntimeSupport = {
  'bottom-cta': ['mobile'],
  'top-bar': ['mobile'],
  tooltip: ['web'],
  'visually-hidden': ['web'],
};

const usage = `Usage:
  node scripts/app-standard.mjs [--json] validate-contract --contract PATH
  node scripts/app-standard.mjs [--json] create --contract PATH [--workspace-root PATH] [--write]
  node scripts/app-standard.mjs [--json] check-app --app-root PATH [--target-stage STAGE]
  node scripts/app-standard.mjs [--json] check-doc-links [--workspace-root PATH]
  node scripts/app-standard.mjs [--json] check-standard-assets
  node scripts/app-standard.mjs [--json] verify-initializers [--kind mobile|web|server]
  node scripts/app-standard.mjs [--json] sync-standard --app-root PATH [--write]
  node scripts/app-standard.mjs [--json] sync-docs --app-root PATH [--write]
  node scripts/app-standard.mjs [--json] digest-evidence --app-root PATH [--evidence EV-NNN]

create is a dry-run unless --write is present. It only targets a previously
absent apps/<contract.app.id> directory and never updates portfolio.json.

check-app --target-stage implementation-conformant rehearses the active gate on
a draft-governance app. A rehearsal never grants a stage; it reports which
findings the app can fix now and which are blocked by portfolio authority.

verify-initializers re-queries the official npm registry for every initializer
and lint/format package pinned in the active profile (--kind static-analysis
selects only the latter) and compares dist.integrity and dist.tarball
byte-for-byte; it replaces the manual npm view comparison.

sync-standard reviews or updates only centrally owned projection files in an
existing app. It preserves app.contract.json, product prose, evidence, manifests,
lockfiles and runtime sources. Run from the central portfolio checkout.

sync-docs rewrites only the Acceptance criteria / Evidence registry table rows
and the hjm-contract-evidence marker of the four canonical documents from
app.contract.json. It is a dry-run unless --write is present and never touches
prose outside those tables. Rows that exist only in a document are reported and
must be added to the contract first; the contract is the source of truth.

digest-evidence prints the SHA-256 that app.contract.json must record for each
evidence location: the file bytes for a regular file, or the sorted manifest of
"<sha256>  <relative path>" lines for a directory record whose index.md is the
type-specific narrative.`;

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function assertDesignReleaseRecord(release) {
  const version = release?.version;
  const packageNames = ['@hjmds/design-contracts', '@hjmds/react', '@hjmds/react-native'];
  if (release?.schemaVersion !== 1 || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)
    || release.source?.repository !== 'https://github.com/jim1286/hjm-design-system.git'
    || release.source?.tag !== `v${version}` || !/^[a-f0-9]{40}$/.test(release.source?.commit)
    || release.source?.sourcePath !== 'packages/design-contracts/dist/catalog.js'
    || !/^[a-f0-9]{64}$/.test(release.source?.contentSha256)
    || release.catalog?.snapshotSource !== 'docs/profiles/hjm-catalog.snapshot.json'
    || release.catalog?.generatedPath !== 'docs/hjm-catalog.snapshot.json'
    || !/^[a-f0-9]{64}$/.test(release.catalog?.sha256)
    || Object.keys(release.packages ?? {}).sort().join() !== [...packageNames].sort().join()) {
    throw new Error('Invalid central HJM release record; import a published release with sync-design-system.mjs.');
  }
  for (const name of packageNames) {
    const item = release.packages[name];
    if (item.version !== version
      || item.metadataUrl !== `https://registry.npmjs.org/${encodeURIComponent(name)}/${version}`
      || item.tarballUrl !== `https://registry.npmjs.org/${name}/-/${name.split('/')[1]}-${version}.tgz`
      || !/^sha512-[A-Za-z0-9+/]{86}==$/.test(item.integrity)) {
      throw new Error(`Invalid central HJM release package: ${name}`);
    }
  }
}

function hasText(value) {
  return typeof value === 'string' && value.trim() === value && value.length > 0;
}

function finding(code, path, message) {
  return { code, path, message };
}

function addFinding(findings, code, path, message) {
  findings.push(finding(code, path, message));
}

function assertObject(value, path, findings) {
  if (isPlainObject(value)) return true;
  addFinding(findings, 'OBJECT_REQUIRED', path, `${path} must be an object.`);
  return false;
}

function assertKeys(value, allowed, path, findings) {
  if (!isPlainObject(value)) return;
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      addFinding(findings, 'UNKNOWN_PROPERTY', `${path}.${key}`, `${path}.${key} is not allowed by contract v1.`);
    }
  }
}

function assertText(value, path, findings) {
  if (hasText(value)) return true;
  addFinding(findings, 'TEXT_REQUIRED', path, `${path} must be non-empty with no surrounding whitespace.`);
  return false;
}

function validDate(value) {
  if (typeof value !== 'string' || !datePattern.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function validDateTime(value) {
  if (typeof value !== 'string') return false;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))$/);
  if (!match) return false;
  const [, yearText, monthText, dayText, hourText, minuteText, secondText, offsetHourText, offsetMinuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return month >= 1
    && month <= 12
    && day >= 1
    && day <= daysInMonth[month - 1]
    && Number(hourText) <= 23
    && Number(minuteText) <= 59
    && Number(secondText) <= 59
    && (offsetHourText === undefined || Number(offsetHourText) <= 23)
    && (offsetMinuteText === undefined || Number(offsetMinuteText) <= 59)
    && !Number.isNaN(Date.parse(value));
}

function validTemplateDisplayName(value) {
  return typeof value === 'string'
    && value.length <= 100
    && /^[^"\\\r\n\u0000-\u001f\u007f]+$/u.test(value)
    && !value.includes('{{')
    && !value.includes('}}')
    && value.trim() === value;
}

function validOwner(value) {
  return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._@/-]{0,127}$/.test(value);
}

// The implementation gate is a conformance claim, keyed on governance.status alone. The
// product lifecycle (incubating/active/...) is catalog-owned product state and never by
// itself demands or grants implementation conformance — a v1 app may be active in the
// portfolio while its governance is still draft, exactly like a legacy app.
function requiresImplementationGate(app, governance) {
  return governance?.status !== 'draft';
}

const conformanceStages = ['governance-scaffold', 'implementation-conformant'];

function resolveImplementationGate(contract, targetStage) {
  if (targetStage !== undefined && !conformanceStages.includes(targetStage)) {
    throw Object.assign(new Error(`--target-stage must be one of ${conformanceStages.join(', ')}.`), { code: 'TARGET_STAGE_INVALID' });
  }
  return targetStage === 'implementation-conformant' || requiresImplementationGate(contract?.app, contract?.governance);
}

// Findings only the portfolio bootstrap (published central verifier, organization
// ruleset, CODEOWNER team, live repository-policy verification) can clear. An app
// rehearsing the active gate cannot fix these on its own.
const portfolioAuthorityFindingCodes = new Set([
  'CENTRAL_VERIFIER_BOOTSTRAP_INVALID',
  'CENTRAL_VERIFIER_BOOTSTRAP_UNPUBLISHED',
  'MERGE_POLICY_NOT_VERIFIED',
  'REPOSITORY_POLICY_EVIDENCE_NOT_VERIFIED',
]);

function isInside(rootPath, candidatePath) {
  const fromRoot = relative(rootPath, candidatePath);
  return fromRoot === ''
    || (!fromRoot.startsWith(`..${sep}`) && fromRoot !== '..' && !isAbsolute(fromRoot));
}

function validRelativePath(value) {
  return typeof value === 'string' && relativePathPattern.test(value) && !value.includes('\\');
}

function validateRepository(repository, findings) {
  if (!assertObject(repository, 'contract.app.repository', findings)) return;
  assertKeys(repository, new Set(['remoteName', 'url']), 'contract.app.repository', findings);
  if (!assertText(repository.remoteName, 'contract.app.repository.remoteName', findings)) return;
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(repository.remoteName)) {
    addFinding(findings, 'REMOTE_NAME_INVALID', 'contract.app.repository.remoteName', 'remoteName must be a Git remote token such as "origin".');
  }
  if (!assertText(repository.url, 'contract.app.repository.url', findings)) return;
  try {
    const parsed = new URL(repository.url);
    if (!['https:', 'ssh:'].includes(parsed.protocol)
      || parsed.password
      || (parsed.protocol === 'https:' && parsed.username)
      || !parsed.hostname) {
      throw new Error('unsupported');
    }
  } catch {
    if (!/^git@[^/:\s]+:[^\s]+$/.test(repository.url)) {
      addFinding(findings, 'REPOSITORY_URL_INVALID', 'contract.app.repository.url', 'repository URL must be credential-free HTTPS, SSH, or git@ SCP-style Git; git:// is prohibited.');
    }
  }
}

function validateMergePolicy(mergePolicy, acceptance, runtimes, activeGate, findings) {
  const path = 'contract.governance.mergePolicy';
  if (!assertObject(mergePolicy, path, findings)) return;
  assertKeys(mergePolicy, new Set([
    'authority',
    'status',
    'centralVerifier',
    'codeownerTeam',
    'protectedPaths',
    'repositoryPolicyEvidenceId',
    'eligibilitySource',
  ]), path, findings);
  if (mergePolicy.authority !== 'external-required-workflow'
    || mergePolicy.eligibilitySource !== 'central-verifier-only') {
    addFinding(findings, 'MERGE_AUTHORITY_INVALID', path, 'Merge eligibility must come only from an external required workflow, not the repository-owned feedback workflow.');
  }
  if (!['planned', 'verified'].includes(mergePolicy.status)) {
    addFinding(findings, 'MERGE_POLICY_STATUS_INVALID', `${path}.status`, 'mergePolicy.status must be planned or verified.');
  } else if (activeGate && mergePolicy.status !== 'verified') {
    addFinding(findings, 'MERGE_POLICY_NOT_VERIFIED', `${path}.status`, 'An implementation-conformant app requires verified external repository protection.');
  }
  if (assertObject(mergePolicy.centralVerifier, `${path}.centralVerifier`, findings)) {
    assertKeys(mergePolicy.centralVerifier, new Set([
      'repository', 'workflowPath', 'commit', 'requiredCheck', 'branch',
    ]), `${path}.centralVerifier`, findings);
    if (!/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(mergePolicy.centralVerifier.repository || '')
      || mergePolicy.centralVerifier.workflowPath !== '.github/workflows/app-standard-required.yml'
      || mergePolicy.centralVerifier.requiredCheck !== 'app-standard-required'
      || mergePolicy.centralVerifier.branch !== 'main') {
      addFinding(findings, 'CENTRAL_VERIFIER_INVALID', `${path}.centralVerifier`, 'v1 records the planned portfolio central verifier identity and required check on main; it grants no merge eligibility until the workflow is published, immutable-pinned, and externally verified.');
    }
    if (typeof mergePolicy.centralVerifier.commit !== 'string'
      || !/^[a-f0-9]{40}$/.test(mergePolicy.centralVerifier.commit)) {
      addFinding(findings, 'CENTRAL_VERIFIER_COMMIT_INVALID', `${path}.centralVerifier.commit`, 'central verifier commit must be a full lowercase 40-character Git SHA.');
    } else if (mergePolicy.centralVerifier.commit !== approvedCentralVerifierCommit) {
      addFinding(findings, 'CENTRAL_VERIFIER_COMMIT_UNAPPROVED', `${path}.centralVerifier.commit`, 'The app-selected commit is not the central workflow approved verifier commit. App-controlled arbitrary or historical SHAs are forbidden.');
    }
    if (activeGate && approvedCentralVerifierCommit === '0000000000000000000000000000000000000000') {
      addFinding(findings, 'CENTRAL_VERIFIER_BOOTSTRAP_UNPUBLISHED', `${path}.centralVerifier.commit`, 'The v1 central verifier is still an unpublished fail-closed bootstrap; no app can claim active or merge eligibility until the profile and central workflow bake in a reviewed nonzero commit.');
    }
  }
  if (typeof mergePolicy.codeownerTeam !== 'string'
    || !/^@[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(mergePolicy.codeownerTeam)) {
    addFinding(findings, 'CODEOWNER_TEAM_INVALID', `${path}.codeownerTeam`, 'codeownerTeam must be an organization/team slug such as @org/app-standard-owners.');
  }
  if (!Array.isArray(mergePolicy.protectedPaths)
    || new Set(mergePolicy.protectedPaths).size !== mergePolicy.protectedPaths.length) {
    addFinding(findings, 'PROTECTED_PATHS_INVALID', `${path}.protectedPaths`, 'protectedPaths must be a unique array.');
  } else {
    const pathsRequiredForContract = [
      ...requiredProtectedPaths,
      ...(Array.isArray(runtimes) ? runtimes.map(({ root, binding }) => root === '.' ? (binding?.manifest ?? 'package.json') : `${root}/${binding?.manifest ?? 'package.json'}`) : []),
    ];
    for (const protectedPath of pathsRequiredForContract) {
      if (!mergePolicy.protectedPaths.includes(protectedPath)) {
        addFinding(findings, 'PROTECTED_PATH_MISSING', `${path}.protectedPaths`, `Required verifier path "${protectedPath}" is not protected.`);
      }
    }
  }
  if (typeof mergePolicy.repositoryPolicyEvidenceId !== 'string'
    || !/^EV-\d{3,}$/.test(mergePolicy.repositoryPolicyEvidenceId)) {
    addFinding(findings, 'REPOSITORY_POLICY_EVIDENCE_ID_INVALID', `${path}.repositoryPolicyEvidenceId`, 'repositoryPolicyEvidenceId must match EV-NNN.');
  } else {
    const evidence = Array.isArray(acceptance?.evidence)
      ? acceptance.evidence.find(({ id }) => id === mergePolicy.repositoryPolicyEvidenceId)
      : null;
    if (!evidence) {
      addFinding(findings, 'REPOSITORY_POLICY_EVIDENCE_MISSING', `${path}.repositoryPolicyEvidenceId`, 'The repository policy evidence ID must resolve in acceptance.evidence.');
    } else if (evidence.type !== 'repository-policy') {
      addFinding(findings, 'REPOSITORY_POLICY_EVIDENCE_TYPE_INVALID', `${path}.repositoryPolicyEvidenceId`, 'Merge protection evidence must use the repository-policy evidence type.');
    } else if (activeGate && evidence.status !== 'verified') {
      addFinding(findings, 'REPOSITORY_POLICY_EVIDENCE_NOT_VERIFIED', `${path}.repositoryPolicyEvidenceId`, 'External branch protection, CODEOWNERS, and central required-check evidence must be verified before active conformance.');
    }
  }
}

function validateRuntime(runtime, index, findings, seenKinds, seenRoots) {
  const path = `contract.runtimes[${index}]`;
  if (!assertObject(runtime, path, findings)) return;
  assertKeys(runtime, new Set(['kind', 'framework', 'frameworkVersion', 'moduleFormat', 'root']), path, findings);
  if (!Object.hasOwn(runtimeFrameworks, runtime.kind)) {
    addFinding(findings, 'RUNTIME_KIND_INVALID', `${path}.kind`, `${path}.kind must be mobile, web, or server.`);
  } else if (seenKinds.has(runtime.kind)) {
    addFinding(findings, 'RUNTIME_KIND_DUPLICATE', `${path}.kind`, `Runtime kind "${runtime.kind}" is declared more than once.`);
  } else {
    seenKinds.add(runtime.kind);
    if (runtime.framework !== runtimeFrameworks[runtime.kind]) {
      addFinding(
        findings,
        'RUNTIME_FRAMEWORK_INVALID',
        `${path}.framework`,
        `${runtime.kind} runtime must use ${runtimeFrameworks[runtime.kind]} under HJM-APP-STANDARD v1.`,
      );
    }
    if (runtime.frameworkVersion !== runtimeFrameworkVersions[runtime.kind]) {
      addFinding(
        findings,
        'RUNTIME_FRAMEWORK_VERSION_INVALID',
        `${path}.frameworkVersion`,
        `${runtime.kind} frameworkVersion must equal the portfolio-default-v1 exact train ${runtimeFrameworkVersions[runtime.kind]}.`,
      );
    }
    if (runtime.kind === 'server' && runtime.moduleFormat !== 'esm') {
      addFinding(findings, 'SERVER_MODULE_FORMAT_INVALID', `${path}.moduleFormat`, 'NestJS v1 runtime must declare moduleFormat "esm".');
    } else if (runtime.kind !== 'server' && Object.hasOwn(runtime, 'moduleFormat')) {
      addFinding(findings, 'RUNTIME_MODULE_FORMAT_UNEXPECTED', `${path}.moduleFormat`, 'moduleFormat is fixed only for the NestJS server runtime in app-standard v1.');
    }
    if (runtime.root !== runtimeDefaultRoots[runtime.kind]) {
      addFinding(
        findings,
        'RUNTIME_ROOT_NONSTANDARD',
        `${path}.root`,
        `${runtime.kind} runtime root must be "${runtimeDefaultRoots[runtime.kind]}"; use a reviewed standard change instead of a hidden path exception.`,
      );
    }
  }
  if (!validRelativePath(runtime.root)) {
    addFinding(findings, 'RUNTIME_ROOT_INVALID', `${path}.root`, `${path}.root must be a normalized repository-relative path.`);
  } else if (seenRoots.has(runtime.root)) {
    addFinding(findings, 'RUNTIME_ROOT_DUPLICATE', `${path}.root`, `Runtime root "${runtime.root}" is declared more than once.`);
  } else {
    seenRoots.add(runtime.root);
  }
}

function validateDocuments(documents, findings) {
  if (!assertObject(documents, 'contract.documents', findings)) return;
  assertKeys(documents, new Set(requiredDocumentKeys), 'contract.documents', findings);
  for (const key of requiredDocumentKeys) {
    const path = `contract.documents.${key}`;
    if (!validRelativePath(documents[key])) {
      addFinding(findings, 'DOCUMENT_PATH_INVALID', path, `${path} must be a normalized repository-relative path.`);
    } else if (documents[key] !== canonicalDocuments[key]) {
      addFinding(findings, 'DOCUMENT_PATH_NONSTANDARD', path, `${path} must equal "${canonicalDocuments[key]}" in contract v1.`);
    }
  }
}

function validateToolchain(toolchain, runtimes, appId, findings) {
  if (!assertObject(toolchain, 'contract.toolchain', findings)) return;
  assertKeys(toolchain, new Set(['packageManager', 'node', 'scripts']), 'contract.toolchain', findings);
  if (assertObject(toolchain.packageManager, 'contract.toolchain.packageManager', findings)) {
    assertKeys(toolchain.packageManager, new Set(['name', 'version']), 'contract.toolchain.packageManager', findings);
    if (toolchain.packageManager.name !== 'pnpm') {
      addFinding(findings, 'PACKAGE_MANAGER_INVALID', 'contract.toolchain.packageManager.name', 'New products must use pnpm.');
    }
    if (toolchain.packageManager.version !== '11.24.0') {
      addFinding(findings, 'PACKAGE_MANAGER_VERSION_INVALID', 'contract.toolchain.packageManager.version', 'portfolio-default-v1 requires pnpm exact version 11.24.0.');
    }
  }
  if (toolchain.node !== '24.20.0') {
    addFinding(findings, 'NODE_VERSION_INVALID', 'contract.toolchain.node', 'portfolio-default-v1 requires Node exact version 24.20.0.');
  }
  if (assertObject(toolchain.scripts, 'contract.toolchain.scripts', findings)) {
    const expectedScripts = expectedToolchainScripts(appId, runtimes);
    for (const [name, command] of Object.entries(toolchain.scripts)) {
      if (!Object.hasOwn(expectedScripts, name)) {
        addFinding(findings, 'SCRIPT_NAME_NONSTANDARD', `contract.toolchain.scripts.${name}`, `Script "${name}" is not part of the contract v1 script surface.`);
      }
      if (!hasText(name) || !hasText(command)) {
        addFinding(findings, 'SCRIPT_INVALID', `contract.toolchain.scripts.${name}`, 'Script names and commands must be non-empty strings.');
      }
    }
    for (const [name, command] of Object.entries(expectedScripts)) {
      if (toolchain.scripts[name] === undefined) {
        addFinding(findings, 'CANONICAL_SCRIPT_MISSING', `contract.toolchain.scripts.${name}`, `Canonical script "${name}" is required.`);
      } else if (toolchain.scripts[name] !== command) {
        addFinding(findings, 'CANONICAL_SCRIPT_MISMATCH', `contract.toolchain.scripts.${name}`, `Canonical script "${name}" must equal "${command}".`);
      }
    }
  }
}

function validateDesignSystem(designSystem, runtimes, acceptance, app, governance, findings, { implementationGate } = {}) {
  if (!assertObject(designSystem, 'contract.designSystem', findings)) return;
  const runtimeKinds = new Set(Array.isArray(runtimes) ? runtimes.map(({ kind }) => kind) : []);
  const hasFrontend = runtimeKinds.has('mobile') || runtimeKinds.has('web');
  const nativeAdapter = designSystem.applicability === 'native-adapter';
  if (nativeAdapter && (!hasFrontend || runtimes.some((r) => ['mobile', 'web'].includes(r.kind) && r.framework !== 'flutter')))
    addFinding(findings, 'DESIGN_ADAPTER_INVALID', 'contract.designSystem', 'Native adapter is only for Flutter frontend runtimes.');
  if (!hasFrontend) {
    assertKeys(designSystem, new Set(['applicability', 'rationale']), 'contract.designSystem', findings);
    if (designSystem.applicability !== 'not_applicable') {
      addFinding(findings, 'DESIGN_APPLICABILITY_INVALID', 'contract.designSystem.applicability', 'A server-only product must set designSystem.applicability to "not_applicable".');
    }
    assertText(designSystem.rationale, 'contract.designSystem.rationale', findings);
    return;
  }
  assertKeys(
    designSystem,
    new Set(['applicability', 'rationale', 'contracts', 'renderers', 'versionPolicy', 'adoptionPolicy', 'catalog', 'companionPolicy', 'requiredFoundations', 'optionalBetaAdoptions']),
    'contract.designSystem',
    findings,
  );
  if (nativeAdapter) assertText(designSystem.rationale, 'contract.designSystem.rationale', findings);
  else if (designSystem.applicability !== 'frontend' || designSystem.rationale !== null) {
    addFinding(findings, 'DESIGN_APPLICABILITY_INVALID', 'contract.designSystem', 'A mobile or web product must use applicability "frontend" with a null rationale.');
  }
  let contractsVersion;
  if (assertObject(designSystem.contracts, 'contract.designSystem.contracts', findings)) {
    assertKeys(designSystem.contracts, new Set(['package', 'version']), 'contract.designSystem.contracts', findings);
    if (designSystem.contracts.package !== '@hjmds/design-contracts') {
      addFinding(findings, 'DESIGN_CONTRACT_PACKAGE_INVALID', 'contract.designSystem.contracts.package', 'Design contracts package must be @hjmds/design-contracts.');
    }
    contractsVersion = designSystem.contracts.version;
    if (contractsVersion !== canonicalDesignVersion) {
      addFinding(findings, 'DESIGN_VERSION_INVALID', 'contract.designSystem.contracts.version', `HJM-APP-STANDARD v1 requires exact HJM version ${canonicalDesignVersion} from ${canonicalReleaseRelativePath}.`);
    }
  }
  if (designSystem.versionPolicy !== 'exact-and-aligned') {
    addFinding(findings, 'DESIGN_VERSION_POLICY_INVALID', 'contract.designSystem.versionPolicy', 'versionPolicy must be "exact-and-aligned".');
  }
  if (designSystem.adoptionPolicy !== 'stable-default') {
    addFinding(findings, 'DESIGN_ADOPTION_POLICY_INVALID', 'contract.designSystem.adoptionPolicy', 'adoptionPolicy must be "stable-default"; planned and deprecated components are unavailable for new use.');
  }
  if (assertObject(designSystem.catalog, 'contract.designSystem.catalog', findings)) {
    assertKeys(designSystem.catalog, new Set(['train', 'snapshotPath', 'sha256']), 'contract.designSystem.catalog', findings);
    if (designSystem.catalog.train !== canonicalDesignVersion
      || designSystem.catalog.snapshotPath !== 'docs/hjm-catalog.snapshot.json'
      || designSystem.catalog.sha256 !== expectedCatalogSha256) {
      addFinding(findings, 'DESIGN_CATALOG_INVALID', 'contract.designSystem.catalog', `catalog must pin the canonical HJM ${canonicalDesignVersion} snapshot path and SHA-256.`);
    }
  }
  if (assertObject(designSystem.companionPolicy, 'contract.designSystem.companionPolicy', findings)) {
    const policyPath = 'contract.designSystem.companionPolicy';
    assertKeys(designSystem.companionPolicy, new Set(['id', 'version', 'status', 'discoveryUrl']), policyPath, findings);
    if (designSystem.companionPolicy.id !== 'hjm-consumer-policy'
      || designSystem.companionPolicy.version !== '1.2.0'
      || designSystem.companionPolicy.status !== 'informational-next-release-pending'
      || designSystem.companionPolicy.discoveryUrl !== 'https://github.com/jim1286/hjm-design-system/blob/main/packages/design-contracts/docs/consumer-policy.md') {
      addFinding(findings, 'COMPANION_POLICY_INVALID', policyPath, 'companionPolicy is informational only and must identify the repo-local HJM policy pending a future release artifact.');
    }
  }
  const declaredEvidence = new Map(
    Array.isArray(acceptance?.evidence)
      ? acceptance.evidence
        .filter((evidence) => hasText(evidence?.id))
        .map((evidence) => [evidence.id, evidence])
      : [],
  );
  const activeGate = implementationGate ?? requiresImplementationGate(app, governance);
  const validateEvidenceIds = (evidenceIds, path, label) => {
    if (!Array.isArray(evidenceIds) || evidenceIds.length === 0) {
      addFinding(findings, `${label}_EVIDENCE_REQUIRED`, path, `${label.toLowerCase()} requires at least one evidence ID.`);
      return;
    }
    const seenEvidence = new Set();
    evidenceIds.forEach((evidenceId, evidenceIndex) => {
      const evidencePath = `${path}[${evidenceIndex}]`;
      if (typeof evidenceId !== 'string' || !/^EV-\d{3,}$/.test(evidenceId)) {
        addFinding(findings, `${label}_EVIDENCE_ID_INVALID`, evidencePath, `${label} evidence ID must match EV-NNN.`);
      } else if (seenEvidence.has(evidenceId)) {
        addFinding(findings, `${label}_EVIDENCE_DUPLICATE`, evidencePath, `${label} evidence ID "${evidenceId}" is duplicated.`);
      } else {
        seenEvidence.add(evidenceId);
        const evidence = declaredEvidence.get(evidenceId);
        if (!evidence) {
          addFinding(findings, `${label}_EVIDENCE_REFERENCE_MISSING`, evidencePath, `${label} evidence ID "${evidenceId}" is not declared in acceptance.evidence.`);
        } else if (activeGate && evidence.status !== 'verified') {
          addFinding(findings, `${label}_EVIDENCE_NOT_VERIFIED`, evidencePath, `${label} evidence ID "${evidenceId}" must be verified before lifecycle or governance becomes active.`);
        } else if (!['planned', 'verified'].includes(evidence.status)) {
          addFinding(findings, `${label}_EVIDENCE_UNUSABLE`, evidencePath, `${label} evidence ID "${evidenceId}" must be planned while draft/incubating or verified.`);
        }
      }
    });
  };

  const requiredFoundationIds = ['design-system-provider', 'text', 'icon', 'stack', 'container'];
  const seenFoundations = new Set();
  const foundationEvidenceOwners = new Map();
  if (!Array.isArray(designSystem.requiredFoundations)) {
    addFinding(findings, 'FOUNDATIONS_REQUIRED', 'contract.designSystem.requiredFoundations', 'requiredFoundations must declare the centrally approved minimum HJM foundation set.');
  } else {
    designSystem.requiredFoundations.forEach((foundation, index) => {
      const path = `contract.designSystem.requiredFoundations[${index}]`;
      if (!assertObject(foundation, path, findings)) return;
      assertKeys(foundation, new Set(['componentId', 'maturity', 'rationaleId', 'evidenceGate', 'evidenceIds']), path, findings);
      if (!requiredFoundationIds.includes(foundation.componentId)) {
        addFinding(findings, 'FOUNDATION_COMPONENT_INVALID', `${path}.componentId`, `Unknown required foundation "${String(foundation.componentId)}".`);
      } else if (seenFoundations.has(foundation.componentId)) {
        addFinding(findings, 'FOUNDATION_COMPONENT_DUPLICATE', `${path}.componentId`, `Required foundation "${foundation.componentId}" is duplicated.`);
      } else {
        seenFoundations.add(foundation.componentId);
        if (catalogMaturity.get(foundation.componentId) !== 'beta') {
          addFinding(findings, 'FOUNDATION_CATALOG_MATURITY_INVALID', `${path}.componentId`, `Required foundation "${foundation.componentId}" must resolve to beta in the pinned HJM catalog snapshot.`);
        }
      }
      if (foundation.maturity !== 'beta'
        || foundation.rationaleId !== 'HJM-FOUNDATION-CORE-001'
        || foundation.evidenceGate !== 'planned-in-draft-verified-before-active') {
        addFinding(findings, 'FOUNDATION_POLICY_INVALID', path, 'Required foundation must retain the central beta maturity, rationale, and lifecycle evidence gate.');
      }
      for (const evidenceId of Array.isArray(foundation.evidenceIds) ? foundation.evidenceIds : []) {
        if (foundationEvidenceOwners.has(evidenceId)) {
          addFinding(findings, 'FOUNDATION_EVIDENCE_SCOPE_AMBIGUOUS', `${path}.evidenceIds`, `Foundation evidence "${evidenceId}" is already scoped to "${foundationEvidenceOwners.get(evidenceId)}"; each required foundation needs independently scoped app evidence.`);
        } else {
          foundationEvidenceOwners.set(evidenceId, foundation.componentId);
        }
      }
      validateEvidenceIds(foundation.evidenceIds, `${path}.evidenceIds`, 'FOUNDATION');
    });
  }
  for (const componentId of requiredFoundationIds) {
    if (!seenFoundations.has(componentId)) {
      addFinding(findings, 'FOUNDATION_COMPONENT_MISSING', 'contract.designSystem.requiredFoundations', `Required foundation "${componentId}" is missing.`);
    }
  }

  const seenOptionalBetaComponents = new Set();
  if (!Array.isArray(designSystem.optionalBetaAdoptions)) {
    addFinding(findings, 'OPTIONAL_BETA_ADOPTIONS_REQUIRED', 'contract.designSystem.optionalBetaAdoptions', 'optionalBetaAdoptions must be an array; use [] when no app-selected beta is adopted.');
  } else {
    designSystem.optionalBetaAdoptions.forEach((adoption, index) => {
      const path = `contract.designSystem.optionalBetaAdoptions[${index}]`;
      if (!assertObject(adoption, path, findings)) return;
      assertKeys(adoption, new Set(['componentId', 'adrPath', 'evidenceIds']), path, findings);
      if (typeof adoption.componentId !== 'string'
        || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(adoption.componentId)) {
        addFinding(findings, 'OPTIONAL_BETA_COMPONENT_ID_INVALID', `${path}.componentId`, 'componentId must be the lowercase kebab-case ID used by the HJM component catalog.');
      } else if (requiredFoundationIds.includes(adoption.componentId)) {
        addFinding(findings, 'OPTIONAL_BETA_FOUNDATION_DUPLICATE', `${path}.componentId`, `Required foundation "${adoption.componentId}" must not be duplicated as an optional beta adoption.`);
      } else if (seenOptionalBetaComponents.has(adoption.componentId)) {
        addFinding(findings, 'OPTIONAL_BETA_COMPONENT_DUPLICATE', `${path}.componentId`, `Optional beta component "${adoption.componentId}" is declared more than once.`);
      } else {
        seenOptionalBetaComponents.add(adoption.componentId);
        if (catalogMaturity.get(adoption.componentId) !== 'beta') {
          addFinding(findings, 'OPTIONAL_BETA_CATALOG_MATURITY_INVALID', `${path}.componentId`, `Optional beta "${adoption.componentId}" must exist with beta status in the pinned HJM catalog snapshot; unknown, stable, planned, and deprecated IDs are rejected.`);
        }
        const supportedKinds = optionalBetaRuntimeSupport[adoption.componentId] || ['mobile', 'web'];
        if (!supportedKinds.some((kind) => runtimeKinds.has(kind))) {
          addFinding(findings, 'OPTIONAL_BETA_RUNTIME_UNSUPPORTED', `${path}.componentId`, `Optional beta "${adoption.componentId}" requires one of these frontend runtimes: ${supportedKinds.join(', ')}.`);
        }
      }
      if (typeof adoption.adrPath !== 'string'
        || !/^docs\/decisions\/ADR-(?!0000)\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(adoption.adrPath)) {
        addFinding(findings, 'OPTIONAL_BETA_ADR_PATH_INVALID', `${path}.adrPath`, 'Optional beta adoption requires a non-template docs/decisions/ADR-NNNN-kebab-title.md.');
      }
      validateEvidenceIds(adoption.evidenceIds, `${path}.evidenceIds`, 'OPTIONAL_BETA');
    });
  }

  if (nativeAdapter) return; // Same version, catalog and foundation evidence; Dart sources are checked by the binding.
  if (!Array.isArray(designSystem.renderers)) {
    addFinding(findings, 'DESIGN_RENDERERS_REQUIRED', 'contract.designSystem.renderers', 'designSystem.renderers must be an array.');
    return;
  }
  const seenKinds = new Set();
  designSystem.renderers.forEach((renderer, index) => {
    const path = `contract.designSystem.renderers[${index}]`;
    if (!assertObject(renderer, path, findings)) return;
    assertKeys(renderer, new Set(['kind', 'package', 'version']), path, findings);
    if (!Object.hasOwn(runtimeRendererPackages, renderer.kind)) {
      addFinding(findings, 'DESIGN_RENDERER_KIND_INVALID', `${path}.kind`, 'Renderer kind must be mobile or web.');
      return;
    }
    if (seenKinds.has(renderer.kind)) {
      addFinding(findings, 'DESIGN_RENDERER_DUPLICATE', `${path}.kind`, `Renderer kind "${renderer.kind}" is declared more than once.`);
    }
    seenKinds.add(renderer.kind);
    if (!runtimeKinds.has(renderer.kind)) {
      addFinding(findings, 'DESIGN_RENDERER_WITHOUT_RUNTIME', `${path}.kind`, `Renderer kind "${renderer.kind}" has no matching runtime.`);
    }
    if (renderer.package !== runtimeRendererPackages[renderer.kind]) {
      addFinding(findings, 'DESIGN_RENDERER_PACKAGE_INVALID', `${path}.package`, `${renderer.kind} renderer must be ${runtimeRendererPackages[renderer.kind]}.`);
    }
    if (!semverPattern.test(renderer.version)) {
      addFinding(findings, 'DESIGN_VERSION_INVALID', `${path}.version`, 'Renderer version must be an exact SemVer.');
    } else if (contractsVersion && renderer.version !== contractsVersion) {
      addFinding(findings, 'DESIGN_VERSION_MISMATCH', `${path}.version`, `Renderer version ${renderer.version} must exactly match contracts version ${contractsVersion}.`);
    }
  });
  for (const kind of Object.keys(runtimeRendererPackages)) {
    if (runtimeKinds.has(kind) && !seenKinds.has(kind)) {
      addFinding(findings, 'DESIGN_RENDERER_MISSING', 'contract.designSystem.renderers', `${kind} runtime requires ${runtimeRendererPackages[kind]}.`);
    }
  }
}

function validLocale(value) {
  return typeof value === 'string'
    && /^[A-Za-z]{2,3}(?:-[A-Za-z]{4})?(?:-(?:[A-Za-z]{2}|\d{3}))?(?:-[A-Za-z0-9]{5,8})*$/.test(value);
}

function validateI18n(i18n, findings) {
  if (!assertObject(i18n, 'contract.i18n', findings)) return;
  const keys = [
    'sourceLocale',
    'supportedLocales',
    'defaultLocale',
    'fallbackChain',
    'selectionPrecedence',
    'catalogRoot',
    'legalCopyRoot',
    'timeZonePolicy',
    'currencyPolicy',
  ];
  assertKeys(i18n, new Set(keys), 'contract.i18n', findings);
  for (const key of ['sourceLocale', 'defaultLocale']) {
    if (!validLocale(i18n[key])) {
      addFinding(findings, 'LOCALE_INVALID', `contract.i18n.${key}`, `${key} must be a canonicalizable BCP 47 locale.`);
    }
  }
  for (const key of ['supportedLocales', 'fallbackChain']) {
    const values = i18n[key];
    if (!Array.isArray(values) || values.length === 0) {
      addFinding(findings, 'LOCALE_LIST_REQUIRED', `contract.i18n.${key}`, `${key} must be a non-empty locale array.`);
      continue;
    }
    if (new Set(values).size !== values.length) {
      addFinding(findings, 'LOCALE_DUPLICATE', `contract.i18n.${key}`, `${key} must not repeat locales.`);
    }
    values.forEach((value, index) => {
      if (!validLocale(value)) {
        addFinding(findings, 'LOCALE_INVALID', `contract.i18n.${key}[${index}]`, `Invalid BCP 47 locale "${String(value)}".`);
      }
    });
  }
  if (Array.isArray(i18n.supportedLocales)) {
    if (!i18n.supportedLocales.includes(i18n.sourceLocale)) {
      addFinding(findings, 'SOURCE_LOCALE_UNSUPPORTED', 'contract.i18n.sourceLocale', 'sourceLocale must be included in supportedLocales.');
    }
    if (!i18n.supportedLocales.includes(i18n.defaultLocale)) {
      addFinding(findings, 'DEFAULT_LOCALE_UNSUPPORTED', 'contract.i18n.defaultLocale', 'defaultLocale must be included in supportedLocales.');
    }
  }
  const expectedPrecedence = ['user', 'account', 'device-or-browser', 'product-default'];
  if (!Array.isArray(i18n.selectionPrecedence)
    || i18n.selectionPrecedence.length !== expectedPrecedence.length
    || i18n.selectionPrecedence.some((value, index) => value !== expectedPrecedence[index])) {
    addFinding(findings, 'LOCALE_PRECEDENCE_INVALID', 'contract.i18n.selectionPrecedence', `selectionPrecedence must equal ${JSON.stringify(expectedPrecedence)}.`);
  }
  for (const key of ['catalogRoot', 'legalCopyRoot']) {
    if (key === 'legalCopyRoot' && i18n[key] === null) continue;
    if (!validRelativePath(i18n[key])) {
      addFinding(findings, 'I18N_PATH_INVALID', `contract.i18n.${key}`, `${key} must be a normalized repository-relative path or the allowed null value.`);
    }
  }
  assertText(i18n.timeZonePolicy, 'contract.i18n.timeZonePolicy', findings);
  assertText(i18n.currencyPolicy, 'contract.i18n.currencyPolicy', findings);
}

function validateRelease(release, runtimes, findings) {
  if (!assertObject(release, 'contract.release', findings)) return;
  assertKeys(release, new Set(['targets', 'releaseHub', 'rationale']), 'contract.release', findings);
  const allowedTargets = new Set(['app-store', 'google-play', 'web', 'server']);
  if (!Array.isArray(release.targets) || release.targets.length === 0) {
    addFinding(findings, 'RELEASE_TARGETS_REQUIRED', 'contract.release.targets', 'release.targets must be a non-empty array.');
  } else {
    if (new Set(release.targets).size !== release.targets.length) {
      addFinding(findings, 'RELEASE_TARGET_DUPLICATE', 'contract.release.targets', 'release.targets must not contain duplicates.');
    }
    release.targets.forEach((target, index) => {
      if (!allowedTargets.has(target)) {
        addFinding(findings, 'RELEASE_TARGET_INVALID', `contract.release.targets[${index}]`, `Unknown release target "${String(target)}".`);
      }
    });
  }
  const runtimeKinds = new Set(Array.isArray(runtimes) ? runtimes.map(({ kind }) => kind) : []);
  const releaseTargets = new Set(Array.isArray(release.targets) ? release.targets : []);
  const expectedTargetsByRuntime = {
    mobile: ['app-store', 'google-play'],
    web: ['web'],
    server: ['server'],
  };
  for (const [kind, targets] of Object.entries(expectedTargetsByRuntime)) {
    for (const target of targets) {
      if (runtimeKinds.has(kind) && !releaseTargets.has(target)) {
        addFinding(findings, 'RELEASE_TARGET_MISSING', 'contract.release.targets', `${kind} runtime requires release target "${target}".`);
      }
      if (!runtimeKinds.has(kind) && releaseTargets.has(target)) {
        addFinding(findings, 'RELEASE_TARGET_WITHOUT_RUNTIME', 'contract.release.targets', `Release target "${target}" requires a ${kind} runtime.`);
      }
    }
  }
  const hasMobile = runtimeKinds.has('mobile');
  if (hasMobile) {
    if (release.releaseHub !== 'required') {
      addFinding(findings, 'RELEASE_HUB_REQUIRED', 'contract.release.releaseHub', 'A mobile runtime requires Release Hub onboarding.');
    }
    if (release.rationale !== null) {
      addFinding(findings, 'RELEASE_RATIONALE_MUST_BE_NULL', 'contract.release.rationale', 'Mobile Release Hub onboarding is required; rationale must be null.');
    }
  } else {
    if (release.releaseHub !== 'not_applicable') {
      addFinding(findings, 'RELEASE_HUB_NOT_APPLICABLE', 'contract.release.releaseHub', 'A non-mobile product must mark Release Hub onboarding not_applicable under contract v1.');
    }
    assertText(release.rationale, 'contract.release.rationale', findings);
  }
}

function validateAcceptance(acceptance, waivers, findings) {
  if (!assertObject(acceptance, 'contract.acceptance', findings)) return;
  assertKeys(acceptance, new Set(['criteria', 'evidence']), 'contract.acceptance', findings);
  const categories = new Set(['product', 'architecture', 'design', 'i18n', 'security', 'quality', 'release']);
  const seenCategories = new Set();
  const criterionIds = new Set();
  const evidenceIds = new Set();
  const evidenceById = new Map();
  if (!Array.isArray(acceptance.criteria) || acceptance.criteria.length === 0) {
    addFinding(findings, 'ACCEPTANCE_CRITERIA_REQUIRED', 'contract.acceptance.criteria', 'acceptance.criteria must be a non-empty array.');
  } else {
    acceptance.criteria.forEach((criterion, index) => {
      const path = `contract.acceptance.criteria[${index}]`;
      if (!assertObject(criterion, path, findings)) return;
      assertKeys(criterion, new Set(['id', 'category', 'statement', 'verification', 'status', 'evidenceIds']), path, findings);
      if (typeof criterion.id !== 'string' || !/^[A-Z][A-Z0-9-]*-\d{3,}$/.test(criterion.id)) {
        addFinding(findings, 'CRITERION_ID_INVALID', `${path}.id`, 'Criterion ID must be a stable uppercase ID ending in at least three digits.');
      } else if (criterionIds.has(criterion.id)) {
        addFinding(findings, 'CRITERION_ID_DUPLICATE', `${path}.id`, `Criterion ID "${criterion.id}" is duplicated.`);
      } else criterionIds.add(criterion.id);
      if (!categories.has(criterion.category)) {
        addFinding(findings, 'CRITERION_CATEGORY_INVALID', `${path}.category`, `Unknown acceptance category "${String(criterion.category)}".`);
      } else seenCategories.add(criterion.category);
      assertText(criterion.statement, `${path}.statement`, findings);
      assertText(criterion.verification, `${path}.verification`, findings);
      if (!['pending', 'passed', 'failed'].includes(criterion.status)) {
        addFinding(findings, 'CRITERION_STATUS_INVALID', `${path}.status`, `Unknown criterion status "${String(criterion.status)}".`);
      }
      if (!Array.isArray(criterion.evidenceIds)) {
        addFinding(findings, 'CRITERION_EVIDENCE_REQUIRED', `${path}.evidenceIds`, 'criterion.evidenceIds must be an array.');
      } else if (criterion.status === 'passed' && criterion.evidenceIds.length === 0) {
        addFinding(findings, 'PASSED_WITHOUT_EVIDENCE', `${path}.evidenceIds`, 'A passed criterion must reference at least one evidence ID.');
      } else {
        const criterionEvidenceIds = new Set();
        criterion.evidenceIds.forEach((evidenceId, evidenceIndex) => {
          if (typeof evidenceId !== 'string' || !/^EV-\d{3,}$/.test(evidenceId)) {
            addFinding(findings, 'CRITERION_EVIDENCE_ID_INVALID', `${path}.evidenceIds[${evidenceIndex}]`, 'Criterion evidence ID must match EV-NNN.');
          } else if (criterionEvidenceIds.has(evidenceId)) {
            addFinding(findings, 'CRITERION_EVIDENCE_DUPLICATE', `${path}.evidenceIds[${evidenceIndex}]`, `Evidence ID "${evidenceId}" is duplicated in the criterion.`);
          } else {
            criterionEvidenceIds.add(evidenceId);
          }
        });
      }
    });
  }
  for (const category of categories) {
    if (!seenCategories.has(category)) {
      addFinding(findings, 'ACCEPTANCE_CATEGORY_MISSING', 'contract.acceptance.criteria', `Acceptance category "${category}" is required.`);
    }
  }
  if (!Array.isArray(acceptance.evidence)) {
    addFinding(findings, 'EVIDENCE_ARRAY_REQUIRED', 'contract.acceptance.evidence', 'acceptance.evidence must be an array.');
  } else {
    acceptance.evidence.forEach((evidence, index) => {
      const path = `contract.acceptance.evidence[${index}]`;
      if (!assertObject(evidence, path, findings)) return;
      assertKeys(evidence, new Set(['id', 'criterionIds', 'type', 'location', 'status', 'owner', 'capturedAt', 'digest', 'note']), path, findings);
      if (typeof evidence.id !== 'string' || !/^EV-\d{3,}$/.test(evidence.id)) {
        addFinding(findings, 'EVIDENCE_ID_INVALID', `${path}.id`, 'Evidence ID must match EV-NNN.');
      } else if (evidenceIds.has(evidence.id)) {
        addFinding(findings, 'EVIDENCE_ID_DUPLICATE', `${path}.id`, `Evidence ID "${evidence.id}" is duplicated.`);
      } else {
        evidenceIds.add(evidence.id);
        evidenceById.set(evidence.id, evidence);
      }
      if (!Array.isArray(evidence.criterionIds) || evidence.criterionIds.length === 0) {
        addFinding(findings, 'EVIDENCE_CRITERIA_REQUIRED', `${path}.criterionIds`, 'Evidence must reference at least one criterion ID.');
      } else if (new Set(evidence.criterionIds).size !== evidence.criterionIds.length) {
        addFinding(findings, 'EVIDENCE_CRITERION_DUPLICATE', `${path}.criterionIds`, 'Evidence criterionIds must not contain duplicates.');
      }
      if (!['automated-test', 'build-log', 'screenshot', 'recording', 'report', 'review', 'runbook-drill', 'measurement', 'decision', 'repository-policy'].includes(evidence.type)) {
        addFinding(findings, 'EVIDENCE_TYPE_INVALID', `${path}.type`, `Unknown evidence type "${String(evidence.type)}".`);
      }
      if (!['planned', 'verified', 'rejected', 'stale'].includes(evidence.status)) {
        addFinding(findings, 'EVIDENCE_STATUS_INVALID', `${path}.status`, `Unknown evidence status "${String(evidence.status)}".`);
      }
      if (!assertText(evidence.location, `${path}.location`, findings)
        || !/^docs\/evidence\/[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/.test(evidence.location)
        || !validRelativePath(evidence.location)) {
        addFinding(findings, 'EVIDENCE_LOCATION_INVALID', `${path}.location`, 'Evidence location must be a safe repository-local path under docs/evidence/.');
      }
      assertText(evidence.owner, `${path}.owner`, findings);
      if (evidence.status === 'verified' && !hasText(evidence.capturedAt)) {
        addFinding(findings, 'VERIFIED_EVIDENCE_TIMESTAMP_REQUIRED', `${path}.capturedAt`, 'Verified evidence requires capturedAt.');
      } else if (Object.hasOwn(evidence, 'capturedAt') && !validDateTime(evidence.capturedAt)) {
        addFinding(findings, 'EVIDENCE_TIMESTAMP_INVALID', `${path}.capturedAt`, 'capturedAt must be an RFC 3339 date-time with an explicit UTC offset.');
      }
      if (evidence.status === 'verified' && (typeof evidence.digest !== 'string' || !/^(?:sha256:)?[a-f0-9]{64}$/.test(evidence.digest))) {
        addFinding(findings, 'VERIFIED_EVIDENCE_DIGEST_REQUIRED', `${path}.digest`, 'Verified evidence requires a SHA-256 digest of the repository-local evidence bytes.');
      }
    });
  }
  if (Array.isArray(acceptance.criteria)) {
    acceptance.criteria.forEach((criterion, index) => {
      if (!Array.isArray(criterion.evidenceIds)) return;
      criterion.evidenceIds.forEach((id) => {
        if (!evidenceIds.has(id)) {
          addFinding(findings, 'EVIDENCE_REFERENCE_MISSING', `contract.acceptance.criteria[${index}].evidenceIds`, `Evidence ID "${id}" is not declared.`);
        } else {
          const evidence = evidenceById.get(id);
          if (!Array.isArray(evidence?.criterionIds) || !evidence.criterionIds.includes(criterion.id)) {
            addFinding(findings, 'EVIDENCE_BACK_REFERENCE_MISSING', `contract.acceptance.evidence.${id}.criterionIds`, `Evidence "${id}" must reference criterion "${criterion.id}".`);
          }
          if (criterion.status === 'passed' && evidence?.status !== 'verified') {
            addFinding(findings, 'PASSED_EVIDENCE_NOT_VERIFIED', `contract.acceptance.criteria[${index}].evidenceIds`, `Passed criterion evidence "${id}" must have status "verified".`);
          }
        }
      });
    });
  }
  if (Array.isArray(acceptance.evidence)) {
    acceptance.evidence.forEach((evidence, evidenceIndex) => {
      if (!Array.isArray(evidence?.criterionIds)) return;
      evidence.criterionIds.forEach((criterionId, criterionIndex) => {
        if (!criterionIds.has(criterionId)) {
          addFinding(findings, 'CRITERION_REFERENCE_MISSING', `contract.acceptance.evidence[${evidenceIndex}].criterionIds[${criterionIndex}]`, `Criterion ID "${criterionId}" is not declared.`);
        } else {
          const criterion = Array.isArray(acceptance.criteria)
            ? acceptance.criteria.find((candidate) => candidate?.id === criterionId)
            : null;
          if (!Array.isArray(criterion?.evidenceIds) || !criterion.evidenceIds.includes(evidence.id)) {
            addFinding(findings, 'CRITERION_BACK_REFERENCE_MISSING', `contract.acceptance.criteria.${criterionId}.evidenceIds`, `Criterion "${criterionId}" must reference evidence "${evidence.id}".`);
          }
        }
      });
    });
  }
}

function validateWaivers(waivers, findings, now = new Date()) {
  if (!Array.isArray(waivers)) {
    addFinding(findings, 'WAIVERS_ARRAY_REQUIRED', 'contract.waivers', 'contract.waivers must be an array.');
    return;
  }
  const seen = new Set();
  waivers.forEach((waiver, index) => {
    const path = `contract.waivers[${index}]`;
    if (!assertObject(waiver, path, findings)) return;
    const keys = ['ruleId', 'adrPath', 'reason', 'risk', 'mitigations', 'owner', 'approver', 'createdAt', 'expiresAt', 'status'];
    assertKeys(waiver, new Set(keys), path, findings);
    if (typeof waiver.ruleId !== 'string' || !/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/.test(waiver.ruleId)) {
      addFinding(findings, 'WAIVER_RULE_ID_INVALID', `${path}.ruleId`, 'waiver.ruleId must be a stable uppercase rule ID.');
    } else if (!waivableRuleIds.has(waiver.ruleId)) {
      addFinding(findings, 'WAIVER_RULE_NOT_ALLOWED', `${path}.ruleId`, `Rule "${waiver.ruleId}" is required or unknown and cannot be waived under portfolio-default-v1.`);
    } else if (seen.has(waiver.ruleId)) {
      addFinding(findings, 'WAIVER_RULE_ID_DUPLICATE', `${path}.ruleId`, `Waiver ruleId "${waiver.ruleId}" is duplicated.`);
    } else seen.add(waiver.ruleId);
    if (typeof waiver.adrPath !== 'string' || !/^docs\/decisions\/ADR-(?!0000)\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(waiver.adrPath)) {
      addFinding(findings, 'WAIVER_ADR_PATH_INVALID', `${path}.adrPath`, 'waiver.adrPath must reference a non-template docs/decisions/ADR-NNNN-kebab-title.md.');
    }
    for (const key of ['reason', 'risk', 'owner', 'approver']) assertText(waiver[key], `${path}.${key}`, findings);
    if (hasText(waiver.owner) && waiver.owner === waiver.approver) {
      addFinding(findings, 'WAIVER_SELF_APPROVAL_FORBIDDEN', `${path}.approver`, 'waiver owner and approver must be different identities.');
    }
    if (!Array.isArray(waiver.mitigations) || waiver.mitigations.length === 0 || waiver.mitigations.some((item) => !hasText(item))) {
      addFinding(findings, 'WAIVER_MITIGATIONS_REQUIRED', `${path}.mitigations`, 'waiver.mitigations must contain at least one non-empty mitigation.');
    }
    for (const key of ['createdAt', 'expiresAt']) {
      if (!validDate(waiver[key])) {
        addFinding(findings, 'WAIVER_DATE_INVALID', `${path}.${key}`, `${key} must be a real YYYY-MM-DD date.`);
      }
    }
    if (validDate(waiver.createdAt) && validDate(waiver.expiresAt)) {
      const created = Date.parse(`${waiver.createdAt}T00:00:00Z`);
      const expiresDate = Date.parse(`${waiver.expiresAt}T00:00:00Z`);
      const expires = Date.parse(`${waiver.expiresAt}T23:59:59Z`);
      if (expiresDate <= created) {
        addFinding(findings, 'WAIVER_DATE_ORDER_INVALID', `${path}.expiresAt`, 'expiresAt must be later than createdAt.');
      }
      const durationDays = (expiresDate - created) / 86_400_000;
      if (durationDays > 30) {
        addFinding(findings, 'WAIVER_DURATION_EXCEEDED', `${path}.expiresAt`, 'Waiver duration must not exceed 30 days.');
      }
      if (waiver.status === 'approved' && expires < now.getTime()) {
        addFinding(findings, 'WAIVER_EXPIRED', `${path}.expiresAt`, `Approved waiver ${waiver.ruleId} expired on ${waiver.expiresAt}.`);
      }
    }
    if (!['proposed', 'approved', 'rejected', 'expired', 'closed'].includes(waiver.status)) {
      addFinding(findings, 'WAIVER_STATUS_INVALID', `${path}.status`, `Unknown waiver status "${String(waiver.status)}".`);
    }
  });
}

/** Validate app-contract v1 with precise, dependency-free findings. */
export function validateAppContract(contract, { now = new Date(), targetStage } = {}) {
  const implementationGate = resolveImplementationGate(contract, targetStage);
  const findings = [...validateWithJsonSchema(contract, canonicalSchema).findings];
  if (!assertObject(contract, 'contract', findings)) return { ok: false, findings };
  const topLevelKeys = [
    '$schema',
    'execution',
    'contractVersion',
    'profile',
    'app',
    'governance',
    'runtimes',
    'documents',
    'toolchain',
    'designSystem',
    'i18n',
    'release',
    'acceptance',
    'waivers',
  ];
  assertKeys(contract, new Set(topLevelKeys), 'contract', findings);
  if (!hasText(contract.$schema) || !/(?:^|\/)app-contract\.schema\.json$/.test(contract.$schema)) {
    addFinding(findings, 'SCHEMA_REFERENCE_INVALID', 'contract.$schema', '$schema must reference app-contract.schema.json.');
  }
  if (contract.contractVersion !== contractVersion) {
    addFinding(findings, 'CONTRACT_VERSION_UNSUPPORTED', 'contract.contractVersion', `contractVersion must equal ${contractVersion}.`);
  }
  if (contract.profile !== 'portfolio-default-v1') {
    addFinding(findings, 'PROFILE_UNSUPPORTED', 'contract.profile', 'profile must equal "portfolio-default-v1" for HJM-APP-STANDARD v1.');
  }

  if (assertObject(contract.app, 'contract.app', findings)) {
    assertKeys(contract.app, new Set(['id', 'displayName', 'lifecycle', 'repository']), 'contract.app', findings);
    if (typeof contract.app.id !== 'string' || !idPattern.test(contract.app.id) || contract.app.id.length > 63) {
      addFinding(findings, 'APP_ID_INVALID', 'contract.app.id', 'app.id must be a lowercase kebab-case ID of at most 63 characters.');
    }
    if (!validTemplateDisplayName(contract.app.displayName)) {
      addFinding(findings, 'APP_DISPLAY_NAME_INVALID', 'contract.app.displayName', 'displayName must be a trimmed single line of at most 100 characters without quotes, backslashes, or control characters.');
    }
    if (!['incubating', 'active', 'maintenance', 'retiring', 'archived'].includes(contract.app.lifecycle)) {
      addFinding(findings, 'APP_LIFECYCLE_INVALID', 'contract.app.lifecycle', `Unknown lifecycle "${String(contract.app.lifecycle)}".`);
    }
    validateRepository(contract.app.repository, findings);
  }

  if (assertObject(contract.governance, 'contract.governance', findings)) {
    assertKeys(contract.governance, new Set(['status', 'owner', 'reviewedAt', 'documentVersion', 'mergePolicy']), 'contract.governance', findings);
    if (!['draft', 'active', 'superseded'].includes(contract.governance.status)) {
      addFinding(findings, 'GOVERNANCE_STATUS_INVALID', 'contract.governance.status', `Unknown governance status "${String(contract.governance.status)}".`);
    }
    if (!validOwner(contract.governance.owner)) {
      addFinding(findings, 'GOVERNANCE_OWNER_INVALID', 'contract.governance.owner', 'governance.owner must be a single-line identity token of at most 128 characters.');
    }
    if (!validDate(contract.governance.reviewedAt)) {
      addFinding(findings, 'REVIEW_DATE_INVALID', 'contract.governance.reviewedAt', 'reviewedAt must be a real YYYY-MM-DD date.');
    }
    if (!semverPattern.test(contract.governance.documentVersion)) {
      addFinding(findings, 'DOCUMENT_VERSION_INVALID', 'contract.governance.documentVersion', 'documentVersion must be an exact SemVer.');
    }
    validateMergePolicy(
      contract.governance.mergePolicy,
      contract.acceptance,
      contract.runtimes,
      implementationGate,
      findings,
    );
  }
  // incubating cannot claim conformance; live product states may be draft (not yet claimed)
  // or active (implementation-conformant); archived products are superseded.
  const allowedGovernanceByLifecycle = {
    incubating: ['draft'],
    active: ['draft', 'active'],
    maintenance: ['draft', 'active'],
    retiring: ['draft', 'active'],
    archived: ['superseded'],
  };
  if (Object.hasOwn(allowedGovernanceByLifecycle, contract.app?.lifecycle)
    && !allowedGovernanceByLifecycle[contract.app.lifecycle].includes(contract.governance?.status)) {
    addFinding(findings, 'LIFECYCLE_GOVERNANCE_MISMATCH', 'contract.governance.status', `${contract.app.lifecycle} lifecycle allows governance status ${allowedGovernanceByLifecycle[contract.app.lifecycle].map((value) => JSON.stringify(value)).join(' or ')}.`);
  }

  const seenKinds = new Set();
  const seenRoots = new Set();
  if (!Array.isArray(contract.runtimes) || contract.runtimes.length === 0) {
    addFinding(findings, 'RUNTIMES_REQUIRED', 'contract.runtimes', 'At least one runtime is required.');
  } else {
    if (bound(contract)) validateBindings(contract, findings);
    else contract.runtimes.forEach((runtime, index) => validateRuntime(runtime, index, findings, seenKinds, seenRoots));
  }
  validateDocuments(contract.documents, findings);
  if (!bound(contract)) validateToolchain(contract.toolchain, contract.runtimes, contract.app?.id, findings);
  validateDesignSystem(
    contract.designSystem,
    contract.runtimes,
    contract.acceptance,
    contract.app,
    contract.governance,
    findings,
    { implementationGate },
  );
  validateI18n(contract.i18n, findings);
  validateRelease(contract.release, contract.runtimes, findings);
  validateWaivers(contract.waivers, findings, now);
  validateAcceptance(contract.acceptance, contract.waivers, findings);
  if (implementationGate) {
    for (const category of ['product', 'architecture', 'design', 'i18n', 'security', 'quality', 'release']) {
      const passed = Array.isArray(contract.acceptance?.criteria)
        && contract.acceptance.criteria.some((candidate) => candidate?.category === category && candidate?.status === 'passed');
      if (!passed) {
        addFinding(findings, 'ACTIVE_ACCEPTANCE_NOT_SATISFIED', `contract.acceptance.criteria.${category}`, `Implementation-conformant lifecycle requires at least one passed ${category} criterion backed by verified evidence; a default-choice waiver never replaces product acceptance.`);
      }
    }
  }
  const declaredAdrPaths = [
    ...(Array.isArray(contract.designSystem?.optionalBetaAdoptions)
      ? contract.designSystem.optionalBetaAdoptions.map(({ adrPath }) => adrPath)
      : []),
    ...(Array.isArray(contract.waivers) ? contract.waivers.map(({ adrPath }) => adrPath) : []),
  ].filter(hasText);
  if (new Set(declaredAdrPaths).size !== declaredAdrPaths.length) {
    addFinding(findings, 'ADR_PATH_REUSED', 'contract', 'Each optional beta adoption and waiver must own a distinct non-template ADR path.');
  }

  return { ok: findings.length === 0, findings };
}

async function readRegularTextFile(filePath, label, { maxBytes = 1_048_576 } = {}) {
  let stat;
  try {
    stat = await lstat(filePath);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      const wrapped = new Error(`${label} does not exist: ${filePath}`);
      wrapped.code = 'FILE_MISSING';
      throw wrapped;
    }
    throw error;
  }
  if (stat.isSymbolicLink() || !stat.isFile()) {
    const error = new Error(`${label} must be a regular non-symlink file: ${filePath}`);
    error.code = 'FILE_TYPE_INVALID';
    throw error;
  }
  if (stat.size > maxBytes) {
    const error = new Error(`${label} exceeds ${maxBytes} bytes: ${filePath}`);
    error.code = 'FILE_TOO_LARGE';
    throw error;
  }
  return readFile(filePath, 'utf8');
}

async function readRegularFileBytes(filePath, label, { maxBytes = 10_485_760 } = {}) {
  let stat;
  try {
    stat = await lstat(filePath);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      const wrapped = new Error(`${label} does not exist: ${filePath}`);
      wrapped.code = 'FILE_MISSING';
      throw wrapped;
    }
    throw error;
  }
  if (stat.isSymbolicLink() || !stat.isFile()) {
    const error = new Error(`${label} must be a regular non-symlink file: ${filePath}`);
    error.code = 'FILE_TYPE_INVALID';
    throw error;
  }
  if (stat.size > maxBytes) {
    const error = new Error(`${label} exceeds ${maxBytes} bytes: ${filePath}`);
    error.code = 'FILE_TOO_LARGE';
    throw error;
  }
  return readFile(filePath);
}

export async function loadAppContract(contractPath) {
  const absolutePath = resolve(contractPath);
  const source = await readRegularTextFile(absolutePath, 'App contract');
  let contract;
  try {
    contract = JSON.parse(source);
  } catch (error) {
    const wrapped = new Error(`App contract is not valid JSON: ${error.message}`);
    wrapped.code = 'CONTRACT_JSON_INVALID';
    throw wrapped;
  }
  return { contract, contractPath: absolutePath, source };
}

export async function validateAgainstCanonicalStandard(contract) {
  return validateAppContract(contract);
}

function substituteTemplate(source, values) {
  return source.replace(/\{\{([A-Z][A-Z0-9_]*)\}\}/g, (placeholder, key) => (
    Object.hasOwn(values, key) ? values[key] : placeholder
  ));
}

function makeReadme(contract) {
  const runtimeRows = contract.runtimes
    .map(({ kind, framework, frameworkVersion, root }) => `| ${kind} | ${framework} | ${frameworkVersion} | \`${root}\` |`)
    .join('\n');
  return `# ${contract.app.displayName}\n\n`
    + `\`${contract.app.id}\` is governed by HJM-APP-STANDARD ${standardVersion} and \`app.contract.json\`.\n\n`
    + `## Runtime map\n\n| Kind | Framework | Exact version | Root |\n| --- | --- | --- | --- |\n${runtimeRows}\n\n`
    + `## Quick start\n\n\`\`\`bash\npnpm install --frozen-lockfile\npnpm dev\npnpm check\n\`\`\`\n\n`
    + `## Canonical documents\n\n`
    + `- [Product contract](${contract.documents.product})\n`
    + `- [Architecture contract](${contract.documents.architecture})\n`
    + `- [Design contract](${contract.documents.design})\n`
    + `- [Release and recovery contract](${contract.documents.release})\n`
    + `- [Architecture decisions](${contract.documents.decisionsDir}/)\n\n`
    + `Environment variables, ports, deployment, and recovery procedures live in \`${contract.documents.release}\`; do not duplicate them here.\n\n`
    + `## Status\n\n`
    + `Lifecycle \`${contract.app.lifecycle}\`, governance \`${contract.governance.status}\`. \`pnpm contract:check\` reports the declared stage; `
    + `\`pnpm contract:check -- --target-stage implementation-conformant\` rehearses the governance active gate and lists what is still actionable. `
    + `Working notes live under \`docs/design/\`; they are non-normative.\n\n`
    + `## Merge authority\n\nThe repository-owned quality workflow is feedback only. This scaffold cannot claim merge eligibility or active governance until a configured external authority replaces the example organization and zero verifier SHA, installs the required gate, and records verified repository-policy evidence. Product lifecycle is a separate decision.\n`;
}

function makePackageJson(contract) {
  return `${JSON.stringify({
    name: contract.app.id,
    version: '0.0.0',
    private: true,
    packageManager: `pnpm@${contract.toolchain.packageManager.version}`,
    engines: { node: contract.toolchain.node },
    scripts: contract.toolchain.scripts,
  }, null, 2)}\n`;
}

function makeWorkspaceFile(contract) {
  return `packages:\n${contract.runtimes.map(({ root }) => `  - '${root}'`).join('\n')}\n  - 'packages/*'\n`;
}

function makeQaReadme(contract) {
  return `# ${contract.app.displayName} QA adapter\n\n`
    + `This directory owns product-specific boot, fixture, persona, route, and recovery knowledge.\n`
    + `Do not copy or fork the shared QA framework here. Record the product's local/CI QA entrypoint and evidence in its release document. The Hub's common qaBoot/releaseSmoke integration is not implemented.\n\n`
    + `## Minimum adapter set (HJM-APP-STANDARD v1, step 5)\n\n`
    + `| File | Owns | Required before active governance |\n| --- | --- | --- |\n`
    + `| \`exploreqa.toml\` | provider selection, report directory, lane/persona file anchors | yes |\n`
    + `| \`provider.py\` (or static \`[provider]\` in the toml) | \`boot_cmd\`, \`sessions\`, \`default_seeds\`, \`persona_entry\`, \`teardown_spec\`, \`collect_evidence\`, \`AGENT_GUIDE_PROJECT\` | yes |\n`
    + `| \`boot_dev.py\` / \`boot_store.py\` | development and store-fixture boot paths used by \`boot_cmd\` | dev yes, store when a store target exists |\n`
    + `| \`personas.json\` | who explores and what each persona must never do (\`PERSONA_SAFETY\`) | yes |\n`
    + `| \`lanes.json\` | lane → session/device mapping; one device per lane | yes |\n`
    + `| \`run.sh\` | the product's canonical local/CI QA entrypoint; common Hub integration is not implemented | yes |\n`
    + `| \`exploreqa_reports/\` | run artifacts; Git-ignored, never evidence by itself | n/a |\n\n`
    + `The framework contract (hook names, argv-only commands, control host spec) is owned by\n`
    + `\`tooling/qa-framework/README.md\` in the portfolio; this adapter only fills it in for ${contract.app.id}.\n`
    + `Copy a completed journey report into \`docs/evidence/\` and bind it to an acceptance criterion before\n`
    + `claiming QA evidence in \`app.contract.json\`.\n`;
}

function makeEditorconfig() {
  return 'root = true\n\n[*]\ncharset = utf-8\nend_of_line = lf\ninsert_final_newline = true\ntrim_trailing_whitespace = true\nindent_style = space\nindent_size = 2\n\n[*.md]\ntrim_trailing_whitespace = false\n';
}

function makePrettierConfig() {
  return '// HJM-APP-STANDARD v1 canonical formatter contract. Bytes are compared by check-app; do not edit per app.\n'
    + 'export default {\n  printWidth: 100,\n  singleQuote: true,\n  trailingComma: \'all\',\n  semi: true,\n  arrowParens: \'always\',\n  endOfLine: \'lf\',\n  proseWrap: \'preserve\',\n};\n';
}

function makePrettierIgnore() {
  return '# Build output and dependencies\nnode_modules/\ndist/\nbuild/\ncoverage/\n.next/\n.expo/\nios/\nandroid/\npnpm-lock.yaml\n'
    + '# Standard-owned projections: check-app compares these bytes, so they are never reformatted\n.github/\ndocs/\ntools/*.mjs\napp.contract.json\n';
}

function makeRootEslintConfig() {
  return '// Lints shared packages and root scripts. Each runtime root has its own eslint.config.mjs\n'
    + '// that imports hjmRuntimeConfig from tools/eslint.base.mjs (see the runtime README).\n'
    + "import { hjmBaseConfig } from './tools/eslint.base.mjs';\n\n"
    + "export default hjmBaseConfig({ rootDir: import.meta.dirname, ignores: ['apps/**', 'tools/**'] });\n";
}

function makeEslintBase() {
  return `// HJM-APP-STANDARD v1 shared ESLint contract (vendored; regenerate, do not edit).
// ESLint owns rules, Prettier owns formatting: eslint-config-prettier is applied last so the two never fight.
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

const generatedIgnores = [
  '**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**',
  '**/.next/**', '**/.expo/**', '**/ios/**', '**/android/**', '**/*.d.ts',
];

// HJM renderer usage the design checker rejects; caught earlier in the editor.
export const hjmImportRules = {
  'no-restricted-syntax': [
    'error',
    { selector: 'ImportNamespaceSpecifier[parent.source.value=/^@hjmds\\\\//]', message: 'HJM renderers allow direct named imports only (maturity and prop enforcement need the symbol).' },
    { selector: 'ExportAllDeclaration[source.value=/^@hjmds\\\\//]', message: 'Do not re-export HJM renderers; import them where they render.' },
  ],
  // Raw style props on HJM components are rejected by design:check, which knows each
  // symbol's import origin; a syntax selector here would flag host View/div style too.
};

// packages/* stay renderer- and framework-neutral: domain rules, schemas, query keys, messages.
export const sharedPackageRules = {
  'no-restricted-imports': [
    'error',
    {
      patterns: [{
        group: ['react', 'react/*', 'react-dom', 'react-dom/*', 'react-native', 'react-native/*', 'next', 'next/*', 'expo', 'expo-*', '@expo/*', '@nestjs/*', '@hjmds/react', '@hjmds/react-native'],
        message: 'Shared packages must not import a runtime framework or renderer (NEW_APP_DEVELOPMENT_GUIDE §2 dependency direction).',
      }],
    },
  ],
};

export const baseRules = {
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
  'no-console': ['error', { allow: ['warn', 'error'] }],
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  ...hjmImportRules,
};

// rootDir must be the directory of the calling eslint.config.mjs (import.meta.dirname):
// typescript-eslint refuses to guess when a workspace has several tsconfig files.
function parserRoot(rootDir) {
  if (!rootDir) throw new Error('hjm eslint config requires rootDir: import.meta.dirname');
  return { languageOptions: { parserOptions: { tsconfigRootDir: rootDir } } };
}

export function hjmBaseConfig({ rootDir, ignores = [] } = {}) {
  return tseslint.config(
    { ignores: [...generatedIgnores, ...ignores] },
    ...tseslint.configs.recommended,
    parserRoot(rootDir),
    { files: ['**/*.{ts,tsx,mts,cts,js,jsx,mjs}'], rules: baseRules },
    { files: ['packages/**/*.{ts,tsx,mts,cts,js,mjs}'], rules: sharedPackageRules },
    // CLI scripts and config files talk through stdout by design.
    { files: ['**/scripts/**', '**/tools/**', '**/*.config.{js,mjs,cjs,ts,mts}'], rules: { 'no-console': 'off' } },
    prettier,
  );
}

// Runtime roots call this with their framework preset (eslint-config-expo/flat.js,
// eslint-config-next/core-web-vitals + typescript, or none for NestJS).
export function hjmRuntimeConfig({ kind, rootDir, preset = [], ignores = [] } = {}) {
  const presetConfigs = Array.isArray(preset) ? preset : [preset];
  return tseslint.config(
    { ignores: [...generatedIgnores, ...ignores] },
    ...presetConfigs,
    ...tseslint.configs.recommended,
    parserRoot(rootDir),
    { files: ['**/*.{ts,tsx,mts,cts,js,jsx,mjs}'], rules: baseRules },
    // NestJS resolves constructor injection from decorator metadata, which needs value imports;
    // 'import type' would erase the token. Console is the Nest logger fallback in bootstrap code.
    ...(kind === 'server' ? [{ files: ['src/**/*.ts'], rules: { 'no-console': 'off', '@typescript-eslint/consistent-type-imports': 'off' } }] : []),
    { files: ['**/scripts/**', '**/*.config.{js,mjs,cjs,ts,mts}'], rules: { 'no-console': 'off' } },
    prettier,
  );
}
`;
}

function makeRuntimeEslintSnippet(runtime) {
  const basePath = relative(runtime.root, 'tools/eslint.base.mjs').split(sep).join('/');
  if (runtime.kind === 'mobile') {
    return "import expoConfig from 'eslint-config-expo/flat.js';\n"
      + "import { hjmRuntimeConfig } from '" + basePath + "';\n\n"
      + "export default hjmRuntimeConfig({ kind: 'mobile', rootDir: import.meta.dirname, preset: expoConfig });\n";
  }
  if (runtime.kind === 'web') {
    return "import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';\n"
      + "import nextTypescript from 'eslint-config-next/typescript';\n"
      + "import { hjmRuntimeConfig } from '" + basePath + "';\n\n"
      + "export default hjmRuntimeConfig({ kind: 'web', rootDir: import.meta.dirname, preset: [...nextCoreWebVitals, ...nextTypescript] });\n";
  }
  return "import { hjmRuntimeConfig } from '" + basePath + "';\n\n"
    + "export default hjmRuntimeConfig({ kind: 'server', rootDir: import.meta.dirname });\n";
}

function makeQualityGateWorkflow(contract) {
  return `name: App feedback quality gate (not merge authority)

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: app-feedback-${contract.app.id}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    defaults:
      run:
        working-directory: ${contract.app.id}
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: app_test
        ports: ['5432:5432']
        options: >-
          --health-cmd "pg_isready -U postgres -d app_test"
          --health-interval 5s --health-timeout 5s --health-retries 12
      redis:
        image: redis:7
        ports: ['6379:6379']
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 5s --health-timeout 5s --health-retries 12
    env:
      # Public ephemeral CI fixtures; never production credentials.
      DATABASE_URL: postgresql://postgres:postgres@127.0.0.1:5432/app_test
      REDIS_URL: redis://127.0.0.1:6379/10
      DEVICE_TOKEN_SIGNING_KEY: public-ci-test-signing-key-at-least-32
      LETTER_ENCRYPTION_KEY: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
      NPM_CONFIG_REGISTRY: https://registry.npmjs.org/
      NPM_CONFIG_USERCONFIG: \${{ github.workspace }}/${contract.app.id}/.npmrc
    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
        with:
          persist-credentials: false
          path: ${contract.app.id}
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version-file: ${contract.app.id}/.nvmrc
      - name: Enable pinned package manager
        run: corepack enable
      - name: Verify canonical npm registries
        shell: bash
        run: |
          test "$(pnpm config get registry)" = "https://registry.npmjs.org/"
          test "$(pnpm config get '@hjmds:registry')" = "https://registry.npmjs.org/"
      - name: Install frozen dependencies
        run: pnpm install --frozen-lockfile
      - name: Prepare declared browser test runtimes
        run: pnpm --recursive --if-present browser:install
      - name: Run canonical app gate
        run: pnpm check
`;
}

function makeDependabotConfig() {
  return `version: 2
updates:
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: monthly
`;
}

function makeCodeowners(contract) {
  const mergePolicy = contract.governance?.mergePolicy;
  if (!mergePolicy || typeof mergePolicy.codeownerTeam !== 'string' || !Array.isArray(mergePolicy.protectedPaths)) return '';
  const team = mergePolicy.codeownerTeam;
  return mergePolicy.protectedPaths
    .map((path) => `/${path}${path === 'tools' ? '/**' : ''} ${team}`)
    .join('\n') + '\n';
}

function makeRuntimeReadme(contract, runtime) {
  const serverPolicy = runtime.kind === 'server'
    ? `\nNestJS v1 is fixed to ESM (moduleFormat esm, package type module, TypeScript NodeNext) with the ESLint/Vitest/Supertest versions pinned in docs/app-profile.json serverConformance. The Nest CLI oxlint/Jest alternative is not conformant.\n`
    : '';
  const preset = staticAnalysisPolicy.presets[runtime.kind];
  const sharedList = staticAnalysisPolicy.shared.map((entry) => entry.package + '@' + entry.version).join(', ');
  return `# ${contract.app.displayName} ${runtime.kind} runtime\n\n`
    + `Framework: ${runtime.framework} ${runtime.frameworkVersion}\n\n`
    + `Initialize this directory only with the exact initializer recorded by docs/app-profile.json, then verify the framework production dependency and frozen lockfile before running the repository conformance check.\n`
    + serverPolicy
    + `\n## Lint and format contract\n\n`
    + `Replace the initializer's lint setup with the portfolio contract. Shared devDependencies live at the workspace root (${sharedList})`
    + (preset ? `; this runtime adds ${preset.package}@${preset.version} as an exact devDependency.` : '.')
    + ` The \`lint\` script must be \`eslint .\`. Create \`eslint.config.mjs\` here with exactly:\n\n\`\`\`js\n${makeRuntimeEslintSnippet(runtime)}\`\`\`\n\n`
    + `Formatting is owned by the root \`prettier.config.mjs\` (\`pnpm format\` / \`pnpm format:check\`); do not add a runtime-level Prettier or Biome configuration.\n`;
}

function makePlannedDesignEvidence(contract, evidence, componentIds) {
  return `# Planned HJM app evidence: ${evidence.id}\n\n`
    + `Status: planned (draft governance only)\n\n`
    + `Owner: ${evidence.owner}\n\n`
    + `Components: ${componentIds.join(', ')}\n\n`
    + `Before governance becomes active, replace this plan with timestamped, verified app evidence covering the canonical HJM Provider theme preference, raw-token guard, supported environments, and real browser/device behavior. Record the subject head or artifact digest and the producer, reviewer, or external verification authority; the repository-local SHA proves these file bytes only.\n`;
}

export function makePlannedEvidence(contract, evidence) {
  if (evidence.type === 'repository-policy') {
    return `# Planned repository-policy evidence: ${evidence.id}\n\n`
      + `Status: planned (draft governance only)\n\n`
      + `Owner: ${evidence.owner}\n\n`
      + `Criteria: ${(evidence.criterionIds || []).join(', ')}\n\n`
      + `Before active or merge eligibility, replace this plan with a repository-policy record containing the app repository and head SHA, ruleset or branch-protection API endpoint and observation time, response digest, CODEOWNERS team, required-check result, and the immutable central verifier SHA.\n`;
  }
  return `# Planned acceptance evidence: ${evidence.id}\n\n`
    + `Status: planned (draft governance only)\n\n`
    + `Owner: ${evidence.owner}\n\n`
    + `Criteria: ${(evidence.criterionIds || []).join(', ')}\n\n`
    + `Verification type: ${evidence.type}\n\n`
    + `Before a criterion passes or governance becomes active, replace this plan with a non-placeholder type-specific record: one Markdown file, or (for screenshot/recording sets) one directory whose index.md carries this narrative. Include the subject head or artifact digest and producer/reviewer authority, then record capturedAt and the digest printed by \`node scripts/app-standard.mjs digest-evidence --app-root . --evidence ${evidence.id}\` in app.contract.json; that digest does not independently prove the observation is true.\n`;
}

function makeBoundAdr(renderedAdr, decisionPath, binding) {
  const adrId = basename(decisionPath).match(/^(ADR-\d{4})-/)?.[1] || 'ADR-XXXX';
  const title = binding.kind === 'optional-beta-adoption'
    ? `Adopt HJM beta ${binding.componentId}`
    : `Waive ${binding.ruleId}`;
  const marker = `<!-- hjm-contract-binding\n${JSON.stringify(binding, null, 2)}\n-->\n\n`;
  return renderedAdr
    .replaceAll('ADR-XXXX', adrId)
    .replace('[결정 제목]', title)
    .replace('## 9. Acceptance criteria', `## Contract binding\n\n${marker}## 9. Acceptance criteria`);
}

function documentEvidenceBinding(contract, category) {
  const criteria = (contract.acceptance?.criteria || []).filter((criterion) => criterion.category === category);
  const criterionIds = new Set(criteria.map(({ id }) => id));
  const evidence = (contract.acceptance?.evidence || []).filter((item) => (
    Array.isArray(item.criterionIds) && item.criterionIds.some((id) => criterionIds.has(id))
  ));
  return { category, criteria, evidence };
}

export function bindDocumentEvidence(source, contract, category) {
  const marker = `<!-- hjm-contract-evidence\n${JSON.stringify(documentEvidenceBinding(contract, category), null, 2)}\n-->\n`;
  return source.endsWith('\n') ? `${source}\n${marker}` : `${source}\n\n${marker}`;
}

// Generated documents carry the contract's real acceptance/evidence rows instead of template
// placeholder rows, so a fresh scaffold is already in sync and sync-docs is a no-op on it.
export function projectDocumentTables(source, contract, category) {
  const binding = documentEvidenceBinding(contract, category);
  const acceptance = replaceProjectedTable(source, /## \d+\. Acceptance criteria\s*\n/, binding.criteria.map(projectCriterionRow), /^\|\s*([A-Z][A-Z0-9-]*-\d{3,})\s*\|/);
  const evidence = replaceProjectedTable(acceptance.source, /## \d+\. Evidence registry\s*\n/, binding.evidence.map(projectEvidenceRow), /^\|\s*(EV-\d{3,})\s*\|/);
  return evidence.source;
}

function makeLocalContractChecker() {
  return `#!/usr/bin/env node

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkAppConformance } from './app-standard-core.mjs';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const stageIndex = process.argv.indexOf('--target-stage');
const targetStage = stageIndex === -1 ? undefined : process.argv[stageIndex + 1];
const result = await checkAppConformance(appRoot, { targetStage });
if (result.mode === 'rehearsal') {
  const actionable = result.findings.filter((item) => !result.blockedByPortfolioAuthority.includes(item));
  process.stdout.write('app contract rehearsal (' + result.targetStage + '): '
    + actionable.length + ' actionable, ' + result.blockedByPortfolioAuthority.length + ' blocked by portfolio authority; no stage is granted by a rehearsal\\n');
  for (const finding of actionable) process.stderr.write('  - [' + finding.code + '] ' + finding.path + ': ' + finding.message + '\\n');
  for (const finding of result.blockedByPortfolioAuthority) process.stderr.write('  ~ [' + finding.code + '] ' + finding.path + ' (portfolio authority)\\n');
  if (!result.ok) process.exitCode = 1;
} else if (result.ok) {
  process.stdout.write('app contract: ready (' + result.stage + ')\\n');
} else {
  for (const finding of result.findings) {
    process.stderr.write('[' + finding.code + '] ' + finding.path + ': ' + finding.message + '\\n');
  }
  process.exitCode = 1;
}
`;
}

function makeLocalDesignChecker({ runtimeBindings = false } = {}) {
  return `#!/usr/bin/env node

import { access, readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const findings = [];
const packageFiles = [];
const add = (path, message) => findings.push({ path, message });
const ignoredDirectories = new Set(['.git', '.next', '.expo', 'build', 'coverage', 'dist', 'dist-standard', 'storybook-static', 'node_modules']);
const runtimeBindings = ${runtimeBindings};
const frameworkPackages = { mobile: 'expo', web: 'next', server: '@nestjs/core' };
const serverTooling = { eslint: '9.39.5', vitest: '4.1.11', supertest: '7.2.2' };

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
    if (entry.isFile() && /\\.(?:css|js|jsx|ts|tsx)$/.test(entry.name)) files.push(path);
  }
  return files;
}

function stripYamlInlineComment(line) {
  let quote = null;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (quote) {
      if (quote === '"' && character === '\\\\') {
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
    } else if (character === '#' && (index === 0 || /\\s/.test(line[index - 1]))) {
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
      if (quote === '"' && character === '\\\\') {
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
  if (/^ *\\t/.test(rawLine)) pnpmLockSyntaxError(lineNumber, 'tabs are forbidden in YAML indentation');
  const line = stripYamlInlineComment(rawLine);
  const syntax = yamlUnquotedSyntax(line);
  if (/^\\s*(?:---|\\.\\.\\.|%YAML\\b)/.test(syntax)) {
    pnpmLockSyntaxError(lineNumber, 'directives and multi-document YAML are forbidden');
  }
  if (/^\\s*<<\\s*:|[,{]\\s*<<\\s*:/.test(syntax)) {
    pnpmLockSyntaxError(lineNumber, 'YAML merge keys are forbidden');
  }
  if (/(?:^|[\\s,[{])(?:&|\\*)[A-Za-z0-9_-]+/.test(syntax)) {
    pnpmLockSyntaxError(lineNumber, 'YAML anchors and aliases are forbidden');
  }
  if (/(?:^|\\s)![A-Za-z0-9_!<]/.test(syntax)) {
    pnpmLockSyntaxError(lineNumber, 'YAML tags are forbidden');
  }
  if (/:\\s*[>|][+-]?[0-9]*\\s*$/.test(syntax)) {
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
    '\\\\': 0x5c,
    N: 0x85,
    _: 0xa0,
    L: 0x2028,
    P: 0x2029,
  };
  let result = '';
  for (let index = 0; index < inner.length; index += 1) {
    const character = inner[index];
    if (character !== '\\\\') {
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
      if (quote === '"' && character === '\\\\') {
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
      && (index === raw.length - 1 || /\\s/.test(raw[index + 1]))) {
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
    || /[\\u0000-\\u001f\\u007f']/.test(key.value)) {
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
      if (quote === '"' && character === '\\\\') {
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

  for (const [lineIndex, rawLine] of source.split(/\\r?\\n/).entries()) {
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

function verifyLockedDependency(lock, importerRoot, name, version) {
  const importer = lock.importers.get(importerRoot);
  if (!importer) {
    add('pnpm-lock.yaml#importers.' + importerRoot, 'runtime importer is missing from the frozen lockfile');
    return;
  }
  const dependency = importer.dependencies.get(name);
  const resolvedVersion = dependency?.version;
  const normalizedVersion = typeof resolvedVersion === 'string'
    && new RegExp('^' + version.replaceAll('.', '\\\\.') + '(?:\\\\([^\\\\r\\\\n()]+\\\\))*$').test(dependency.version);
  if (dependency?.specifier !== version || !normalizedVersion) {
    add('pnpm-lock.yaml#importers.' + importerRoot + '.dependencies.' + name, 'specifier must equal exact ' + version + ' and the resolved version may only add balanced pnpm peer suffixes');
  }
  if (!normalizedVersion) return;

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
  if (/^(?:true|:|exit\\s+0|echo(?:\\s+.*)?|printf(?:\\s+.*)?)$/i.test(normalized)) return true;
  const emptyEval = normalized.match(/^node\\s+(?:-e|--eval)\\s+(['"])([\\s\\S]*)\\1$/);
  return Boolean(emptyEval && /^(?:|;|void\\s+0;?|(?:process\\.)?exit\\(0\\);?)$/.test(emptyEval[2].trim()));
}

async function verifyServerRuntime(runtime, manifest) {
  if (runtime.kind !== 'server') return;
  if (runtime.moduleFormat !== 'esm') add('contract.runtimes.server.moduleFormat', 'NestJS runtime must declare moduleFormat esm');
  if (manifest.type !== 'module') add(runtime.root + '/package.json.type', 'NestJS v1 runtime must set package type to module');
  for (const [name, version] of Object.entries(serverTooling)) {
    if (manifest.devDependencies?.[name] !== version) {
      add(runtime.root + '/package.json.devDependencies.' + name, 'NestJS v1 runtime requires exact ' + name + '@' + version);
    }
  }
  if (!/^eslint(?:\\s|$)/.test(String(manifest.scripts?.lint || '').trim())) {
    add(runtime.root + '/package.json.scripts.lint', 'NestJS v1 keeps the cross-runtime ESLint contract; the CLI oxlint default is not accepted');
  }
  if (!/^vitest(?:\\s|$)/.test(String(manifest.scripts?.test || '').trim())) {
    add(runtime.root + '/package.json.scripts.test', 'NestJS v1 unit tests must run with Vitest');
  }
  if (!/^vitest(?:\\s|$)/.test(String(manifest.scripts?.['test:e2e'] || '').trim())) {
    add(runtime.root + '/package.json.scripts.test:e2e', 'NestJS v1 e2e tests must run with Vitest and Supertest');
  }
  try {
    const tsconfigSource = stripCodeComments(await readFile(resolve(appRoot, runtime.root, 'tsconfig.json'), 'utf8'))
      .replace(/,\\s*([}\\]])/g, '$1');
    const tsconfig = JSON.parse(tsconfigSource);
    if (tsconfig.compilerOptions?.module !== 'NodeNext' || tsconfig.compilerOptions?.moduleResolution !== 'NodeNext') {
      add(runtime.root + '/tsconfig.json.compilerOptions', 'NestJS ESM requires module and moduleResolution to equal NodeNext');
    }
  } catch (error) {
    add(runtime.root + '/tsconfig.json', 'NestJS ESM tsconfig must be readable JSON/JSONC: ' + error.message);
  }
}

function stripCodeComments(source) {
  return source.replace(/\\/\\*[\\s\\S]*?\\*\\//g, '').replace(/(^|[^:])\\/\\/.*$/gm, '$1');
}

function sanitizeJavaScriptStructure(source) {
  const uncommented = stripCodeComments(source);
  let result = '';
  let state = 'code';
  let preserveImportString = false;
  for (let index = 0; index < uncommented.length; index += 1) {
    const character = uncommented[index];
    if (state === 'code') {
      if (character === '\`') {
        state = 'template';
        result += ' ';
      } else if (character === "'" || character === '"') {
        const line = result.slice(result.lastIndexOf('\\n') + 1);
        preserveImportString = /\\b(?:from\\s*|import\\s*(?:\\(\\s*)?|require\\s*\\(\\s*)$/.test(line);
        state = character === "'" ? 'single' : 'double';
        result += preserveImportString ? character : ' ';
      } else {
        result += character;
      }
      continue;
    }
    const quote = state === 'single' ? "'" : state === 'double' ? '"' : '\`';
    if (character === '\\\\') {
      result += preserveImportString ? character + (uncommented[index + 1] || '') : '  ';
      index += 1;
    } else if (character === quote) {
      result += preserveImportString ? character : ' ';
      state = 'code';
      preserveImportString = false;
    } else {
      result += character === '\\n' ? '\\n' : preserveImportString ? character : ' ';
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
    for (const match of source.matchAll(/(?:\\bfrom\\s*|\\bimport\\s*(?:\\(\\s*)?|\\brequire\\s*\\(\\s*)(['"])([^'"]+)\\1/g)) {
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
      const name = relative(runtimeRoot, path).replaceAll('\\\\', '/');
      return runtime.framework === 'nextjs'
        ? /^(?:src\\/)?app\\/(?:.*\\/)?(?:layout|page)\\.(?:js|jsx|ts|tsx)$/.test(name)
        : runtime.framework === 'expo' && /^(?:src\\/)?app\\/.*\\.(?:js|jsx|ts|tsx)$/.test(name);
    });
    return [...new Set([...declared, ...routes])];
  }
  const relativeName = (path) => relative(runtimeRoot, path).replaceAll('\\\\', '/');
  const canonicalEntry = runtime.kind === 'web'
    ? /^(?:src\\/)?app\\/(?:.*\\/)?(?:layout|page)\\.(?:js|jsx|ts|tsx)$/
    : /^(?:src\\/)?app\\/.*\\.(?:js|jsx|ts|tsx)$/;
  let entries = codeSources.filter(({ path }) => canonicalEntry.test(relativeName(path)));
  if (entries.length === 0) entries = codeSources.filter(({ path }) => /^src\\/app\\.(?:js|jsx|ts|tsx)$/.test(relativeName(path)));
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
  const relativeName = (path) => relative(runtimeRoot, path).replaceAll('\\\\', '/');
  const boundaryPattern = runtime.kind === 'web'
    ? /^(?:src\\/)?app\\/layout\\.(?:js|jsx|ts|tsx)$/
    : /^(?:src\\/)?app\\/_layout\\.(?:js|jsx|ts|tsx)$/;
  const canonicalAppEntryPattern = runtime.kind === 'web'
    ? /^(?:src\\/)?app\\/(?:.*\\/)?(?:layout|page)\\.(?:js|jsx|ts|tsx)$/
    : /^(?:src\\/)?app\\/.*\\.(?:js|jsx|ts|tsx)$/;
  const hasCanonicalAppDirectory = codeSources.some(({ path }) => canonicalAppEntryPattern.test(relativeName(path)));
  let entries = codeSources.filter(({ path }) => boundaryPattern.test(relativeName(path)));
  if (runtime.kind === 'web' && entries.length === 0) {
    // Next permits a root under [locale] or a route group, provided it has no
    // ancestor layout. A nested layout under another layout is not a root.
    const layouts = codeSources.filter(({ path }) => /^(?:src\\/)?app\\/(?:.*\\/)?layout\\.(?:js|jsx|ts|tsx)$/.test(relativeName(path)));
    entries = layouts.filter(({ path }) => !layouts.some((other) => other.path !== path
      && relativeName(path).startsWith(relativeName(other.path).replace(/layout\\.[^/]+$/, ''))));
  }
  if (entries.length === 0 && !hasCanonicalAppDirectory) entries = codeSources.filter(({ path }) => /^src\\/app\\.(?:js|jsx|ts|tsx)$/.test(relativeName(path)));
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
    while (/\\s/.test(source[expressionStart] || '')) expressionStart += 1;
    const expressionEnd = findExpressionEnd(source, expressionStart, bodyEnd);
    ranges.push([expressionStart, expressionEnd]);
    index = expressionEnd;
  }
  return ranges;
}

function exportedRootReturnExpressions(structureSource, rawSource) {
  const ranges = [];
  for (const match of structureSource.matchAll(/export\\s+default\\s+(?:async\\s+)?function(?:\\s+[A-Za-z_$][A-Za-z0-9_$]*)?\\s*\\([^)]*\\)\\s*\\{/g)) {
    const openIndex = match.index + match[0].lastIndexOf('{');
    const endIndex = findBalancedBlockEnd(structureSource, openIndex);
    if (endIndex > openIndex) ranges.push(...topLevelReturnRanges(structureSource, openIndex + 1, endIndex - 1));
  }
  for (const match of structureSource.matchAll(/export\\s+const\\s+(?:App|RootLayout)\\s*=\\s*(?:async\\s*)?(?:\\([^)]*\\)|[A-Za-z_$][A-Za-z0-9_$]*)\\s*=>/g)) {
    let expressionStart = structureSource.indexOf('=>', match.index) + 2;
    while (/\\s/.test(structureSource[expressionStart] || '')) expressionStart += 1;
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
  const providerOpen = new RegExp('<' + providerSymbol + '\\\\b[^>]*\\\\btheme\\\\s*=\\\\s*[\\\'"]system[\\\'"]');
  const opening = providerOpen.exec(expression);
  if (!opening) return false;
  const closePattern = new RegExp('</' + providerSymbol + '\\\\s*>', 'g');
  const closings = [...expression.matchAll(closePattern)];
  if (closings.length === 0) return false;
  const prefix = expression.slice(0, opening.index);
  if (/=>|\\b(?:function|const|let|var|return)\\b|\\?|&&|\\|\\||<\\s*[A-Z_$]|<\\s*template\\b/i.test(prefix)) return false;
  const closing = closings[closings.length - 1];
  const suffix = expression.slice(closing.index + closing[0].length)
    .replace(/<\\/\\s*[a-z][A-Za-z0-9:-]*\\s*>/g, '')
    .replace(/<\\/\\s*>/g, '')
    .replace(/[\\s);]+/g, '');
  return suffix.length === 0;
}

function hasDirectRenderedJsxTag(expression, symbol) {
  const source = sanitizeJavaScriptStructure(expression);
  const openingTag = new RegExp('<' + symbol + '\\\\b', 'g');
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
      const rendererReExport = new RegExp('\\\\bexport\\\\s+(?:\\\\*|\\\\{[^}]*\\\\})\\\\s+from\\\\s*[\\\'"]' + rendererPackage + '(?:/[^\\\'"]+)?[\\\'"]');
      const dynamicRendererImport = new RegExp('\\\\bimport\\\\s*\\\\(\\\\s*[\\\'"]' + rendererPackage + '(?:/[^\\\'"]+)?[\\\'"]');
      const rendererLiteral = new RegExp('[\\\'"]' + rendererPackage + '(?:/[^\\\'"]+)?[\\\'"]');
      const namedRendererImport = new RegExp('\\\\bimport\\\\s*\\\\{[^}]*\\\\}\\\\s*from\\\\s*[\\\'"]' + rendererPackage + '(?:/[^\\\'"]+)?[\\\'"]\\\\s*;?', 'g');
      const typeRendererImport = new RegExp('\\\\bimport\\\\s+type\\\\s*\\\\{[^}]*\\\\}\\\\s*from\\\\s*[\\\'"]' + rendererPackage + '(?:/[^\\\'"]+)?[\\\'"]\\\\s*;?', 'g');
      const styleRendererImport = new RegExp('\\\\bimport\\\\s*[\\\'"]' + rendererPackage + '/styles\\\\.css[\\\'"]\\\\s*;?', 'g');
      const reachablePaths = new Set(reachableSources.map(({ path }) => path));
      for (const { path, source, rawSource } of (runtimeBindings ? reachableSources : codeSources)) {
        // Mocks and type queries in test-only files do not load a renderer in the
        // shipped app. A test file imported by a runtime entry is still checked.
        if (!reachablePaths.has(path)
          && /(?:^|\\/)(?:test|tests|__tests__|__mocks__)\\/|\\.(?:test|spec)\\.[cm]?[jt]sx?$/.test(relative(runtimeRoot, path))) continue;
        if (rendererReExport.test(source)) add(relative(appRoot, path), 'HJM renderer re-exports are prohibited; app code must use direct named renderer imports so maturity checks cannot be hidden by a barrel');
        if (dynamicRendererImport.test(source)) add(relative(appRoot, path), 'HJM renderer dynamic imports are prohibited; only direct static named imports are compatible with maturity and prop enforcement');
        const withoutStaticLoads = rawSource.replace(/\\brequire\\s*\\(\\s*(['"])([^'"]+)\\1\\s*\\)/g, (load, _quote, target) =>
          target.startsWith('@hjmds/') ? load : '');
        if (/\\brequire\\b|\\bcreateRequire\\b/.test(sanitizeJavaScriptStructure(withoutStaticLoads))) add(relative(appRoot, path), 'CommonJS require/createRequire is prohibited for HJM renderers or computed loads; native modules and assets must have a static literal target');
        if (rendererLiteral.test(rawSource.replace(namedRendererImport, '').replace(typeRendererImport, '').replace(styleRendererImport, ''))) add(relative(appRoot, path), 'HJM renderer references outside direct static named imports are prohibited');
      }
      const providerImport = new RegExp('(?:^|\\\\n)\\\\s*import\\\\s*\\\\{[^}]*\\\\b' + providerSymbol + '\\\\b[^}]*\\\\}\\\\s*from\\\\s*[\\\'\"]' + rendererPackage + '(?:/[^\\\'\"]+)?[\\\'\"]', 'm');
      if (!boundarySources.some(({ source, rawSource }) => providerImport.test(source)
        && exportedRootReturnExpressions(source, rawSource).some((expression) => returnedTreeHasProvider(expression, providerSymbol)))) {
        add(runtime.root, 'active frontend runtime must directly import ' + providerSymbol + ' and render theme="system" inside the canonical exported root boundary; dead helper JSX does not satisfy this gate');
      }
      const requiredSymbols = ['Text', 'Icon', 'Stack', 'Container'];
      for (const symbol of requiredSymbols) {
        const symbolImport = new RegExp('(?:^|\\\\n)\\\\s*import\\\\s*\\\\{[^}]*\\\\b' + symbol + '\\\\b[^}]*\\\\}\\\\s*from\\\\s*[\\\'\"]' + rendererPackage + '(?:/[^\\\'\"]+)?[\\\'\"]', 'm');
        if (!boundarySources.some(({ source, rawSource }) => symbolImport.test(source)
          && exportedRootReturnExpressions(source, rawSource)
            .some((expression) => hasDirectRenderedJsxTag(expression, symbol)))) {
          add(runtime.root, 'required foundation ' + symbol + ' must be imported from the declared renderer and rendered in the canonical exported root return tree');
        }
      }
      for (const { path, source } of reachableSources) {
        const importedHjmSymbols = new Map();
        const namespaceImports = new Set();
        const declaredMaturityComponents = new Set([
          ...(contract.designSystem?.requiredFoundations || []).map((item) => item.componentId),
          ...(contract.designSystem?.optionalBetaAdoptions || []).map((item) => item.componentId),
        ]);
        const importPattern = new RegExp('(?:^|\\\\n)\\\\s*import\\\\s*\\\\{([^}]*)\\\\}\\\\s*from\\\\s*[\\\'\"]' + rendererPackage + '(?:/[^\\\'\"]+)?[\\\'\"]', 'gm');
        for (const match of source.matchAll(importPattern)) {
          for (const specifier of match[1].split(',')) {
            const rawSpecifier = specifier.trim();
            if (/^type\\s+/.test(rawSpecifier)) continue;
            const cleaned = rawSpecifier;
            if (!cleaned) continue;
            const parts = cleaned.split(/\\s+as\\s+/);
            importedHjmSymbols.set((parts[1] || parts[0]).trim(), parts[0].trim());
          }
        }
        const namespacePattern = new RegExp('(?:^|\\\\n)\\\\s*import\\\\s*\\\\*\\\\s*as\\\\s+([A-Za-z_$][A-Za-z0-9_$]*)\\\\s*from\\\\s*[\\\'\"]' + rendererPackage + '(?:/[^\\\'\"]+)?[\\\'\"]', 'gm');
        for (const match of source.matchAll(namespacePattern)) {
          namespaceImports.add(match[1]);
          add(relative(appRoot, path), 'HJM renderer namespace imports are prohibited; use direct named imports for maturity and prop enforcement');
        }
        for (let pass = 0; pass < 4; pass += 1) {
          for (const match of source.matchAll(/(?:^|\\n)\\s*const\\s+([A-Za-z_$][A-Za-z0-9_$]*)\\s*=\\s*([A-Za-z_$][A-Za-z0-9_$]*)\\s*;?/gm)) {
            if (importedHjmSymbols.has(match[2])) importedHjmSymbols.set(match[1], importedHjmSymbols.get(match[2]));
          }
          for (const match of source.matchAll(/(?:^|\\n)\\s*const\\s+([A-Za-z_$][A-Za-z0-9_$]*)\\s*=\\s*(?:memo|forwardRef)\\(\\s*([A-Za-z_$][A-Za-z0-9_$]*)/gm)) {
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
            if (/\\{\\s*\\.\\.\\./.test(tag.attrs)) {
              add(relative(appRoot, path), 'HJM component ' + localSymbol + ' uses a spread prop; explicit props are required so prohibited style-like props cannot be hidden');
            }
            for (const prop of tag.attrs.matchAll(/\\b([A-Za-z][A-Za-z0-9]*Style|style)\\s*=/g)) {
              if (prop[1] !== 'layoutStyle') add(relative(appRoot, path), 'HJM component ' + localSymbol + ' uses prohibited legacy style-like prop "' + prop[1] + '"; only layoutStyle is allowed');
            }
          }
        };
        for (const [localSymbol, exportedSymbol] of importedHjmSymbols) {
          const openingTag = new RegExp('<' + localSymbol + '\\\\b([^>]*)>', 'g');
          inspectRenderedTags(localSymbol, exportedSymbol, [...source.matchAll(openingTag)].map((match) => ({ attrs: match[1] })));
        }
        for (const namespace of namespaceImports) {
          const namespaceTag = new RegExp('<' + namespace + '\\\\.([A-Za-z_$][A-Za-z0-9_$]*)\\\\b([^>]*)>', 'g');
          for (const match of source.matchAll(namespaceTag)) inspectRenderedTags(namespace + '.' + match[1], match[1], [{ attrs: match[2] }]);
        }
      }
      const rawPattern = /#[0-9A-Fa-f]{3,8}\\b|\\b(?:rgb|rgba|hsl|hsla|oklch|lab|lch|color)\\s*\\(|(?:^|[^0-9])(?:[0-9]*\\.[0-9]+)(?:px|rem|em|pt)\\b|\\b(?:gap|rowGap|columnGap|padding|margin|borderRadius|fontSize|lineHeight|letterSpacing)\\s*[:=]\\s*(?:-?(?:[0-9]+(?:\\.[0-9]+)?|\\.[0-9]+)(?:px|rem|em|pt|%)?|['"]-?(?:[0-9]+(?:\\.[0-9]+)?|\\.[0-9]+)(?:px|rem|em|pt|%)?['"])|\\b(?:padding|margin|font-size|line-height|letter-spacing|row-gap|column-gap|border-radius)\\s*:\\s*-?(?:[0-9]+(?:\\.[0-9]+)?|\\.[0-9]+)(?:px|rem|em|pt|%)?\\b|\\b(?:color|backgroundColor)\\s*[:=]\\s*['"](?:red|blue|green|black|white|gray|grey|transparent)['"]|\\b(?:color|background-color)\\s*:\\s*(?:red|blue|green|black|white|gray|grey|transparent)\\b|\\b(?:bg|text|border)-(?:red|blue|green|black|white|gray|grey|amber|indigo|violet|pink|rose)-[1-9][0-9]{1,2}\\b|\\b(?:(?:space-[xy])|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap)-[0-9]+(?:\\.[0-9]+)?\\b|var\\(\\s*--(?!hjm-)[A-Za-z0-9_-]+/i;
      for (const { path, rawSource } of reachableSources) {
        if (/(?:^|\\/)(?:test|tests|__tests__)\\//.test(path)) continue;
        if (rawPattern.test(rawSource)) add(relative(appRoot, path), 'raw color/spacing/radius/type value found outside HJM semantic contracts');
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
        if (!frameworkPackage || manifest.dependencies?.[frameworkPackage] !== runtime.frameworkVersion) {
          add(runtime.root + '/package.json.dependencies.' + frameworkPackage, 'implementation-conformant runtime must directly install its framework at contract exact version ' + runtime.frameworkVersion);
        }
        await verifyServerRuntime(runtime, manifest);
        for (const scriptName of ['dev', 'lint', 'typecheck', 'test', 'test:e2e', 'build']) {
          if (isNoopScript(manifest.scripts?.[scriptName])) add(runtime.root + '/package.json.scripts.' + scriptName, 'implementation-conformant runtime requires a non-noop ' + scriptName + ' command');
        }
      }
      try {
        const lock = parsePnpmLock(await readFile(resolve(appRoot, 'pnpm-lock.yaml'), 'utf8'));
        for (const runtime of contract.runtimes || []) {
          verifyLockedDependency(lock, runtime.root, frameworkPackages[runtime.kind], runtime.frameworkVersion);
          if (runtime.kind === 'server') {
            for (const [name, version] of Object.entries(serverTooling)) verifyLockedDependency(lock, runtime.root, name, version);
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
      if (activeGate && frameworkPackage) verifyLockedDependency(lock, runtime.root, frameworkPackage, runtime.frameworkVersion);
      if (activeGate && runtime.kind === 'server') {
        for (const [name, version] of Object.entries(serverTooling)) verifyLockedDependency(lock, runtime.root, name, version);
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
      if (!frameworkPackage || manifest.dependencies?.[frameworkPackage] !== runtime.frameworkVersion) {
        add(runtime.root + '/package.json.dependencies.' + frameworkPackage, 'implementation-conformant runtime must directly install its framework at contract exact version ' + runtime.frameworkVersion);
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
  for (const finding of findings) process.stderr.write('[DESIGN_CONTRACT] ' + finding.path + ': ' + finding.message + '\\n');
  process.exitCode = 1;
} else {
  process.stdout.write('design contract: ready\\n');
}
`;
}

async function buildScaffoldFiles(contract) {
  if (bound(contract)) throw Object.assign(new Error('Runtime bindings adopt existing sources; use the existing repository and reviewed contract, not source generation.'), { code: 'EXISTING_RUNTIME_ADOPTION_REQUIRED' });
  const [
    schemaSource,
    profileSource,
    catalogSource,
    product,
    architecture,
    design,
    release,
    adr,
    appStandardCore,
    docLinksCore,
    jsonSchemaCore,
  ] = await Promise.all([
    readRegularTextFile(canonicalSchemaPath, 'Canonical app-contract schema'),
    readRegularTextFile(resolve(defaultWorkspaceRoot, 'docs/profiles/portfolio-default-v1.json'), 'Canonical app profile'),
    readRegularTextFile(canonicalCatalogPath, 'Canonical HJM catalog snapshot'),
    readRegularTextFile(join(templateRoot, 'PRODUCT.md'), 'PRODUCT template'),
    readRegularTextFile(join(templateRoot, 'ARCHITECTURE.md'), 'ARCHITECTURE template'),
    readRegularTextFile(join(templateRoot, 'DESIGN.md'), 'DESIGN template'),
    readRegularTextFile(join(templateRoot, 'RELEASE.md'), 'RELEASE template'),
    readRegularTextFile(join(templateRoot, 'ADR.md'), 'ADR template'),
    readRegularTextFile(resolve(scriptDirectory, 'app-standard.mjs'), 'App standard validator core'),
    readRegularTextFile(resolve(scriptDirectory, 'check-doc-links.mjs'), 'Documentation link validator core'),
    readRegularTextFile(resolve(scriptDirectory, 'json-schema-validator.mjs'), 'JSON Schema validator core'),
  ]);
  const values = {
    APP_ID: contract.app.id,
    DISPLAY_NAME: contract.app.displayName,
    OWNER: contract.governance.owner,
    STANDARD_VERSION: contract.governance.documentVersion,
    REVIEW_DATE: contract.governance.reviewedAt,
    DOCUMENT_STATUS: contract.governance.status,
    HJM_POLICY_URL: contract.designSystem.applicability === 'frontend'
      ? contract.designSystem.companionPolicy.discoveryUrl
      : 'not-applicable — server-only product',
  };
  const generatedContract = structuredClone(contract);
  generatedContract.$schema = './docs/app-contract.schema.json';
  const renderedAdr = substituteTemplate(adr, values);

  const files = new Map([
    ['.github/CODEOWNERS', makeCodeowners(contract)],
    ['.github/dependabot.yml', makeDependabotConfig()],
    ['.github/workflows/quality-gate.yml', makeQualityGateWorkflow(contract)],
    ['.gitignore', 'node_modules/\n.next/\ndist/\nbuild/\n.expo/\ncoverage/\n.env\n.env.*\n!.env.example\n.DS_Store\n'],
    ['.npmrc', canonicalNpmrcSource],
    ['.nvmrc', `${contract.toolchain.node}\n`],
    ['.editorconfig', makeEditorconfig()],
    ['prettier.config.mjs', makePrettierConfig()],
    ['.prettierignore', makePrettierIgnore()],
    ['eslint.config.mjs', makeRootEslintConfig()],
    ['tools/eslint.base.mjs', makeEslintBase()],
    ['README.md', makeReadme(contract)],
    ['app.contract.json', `${JSON.stringify(generatedContract, null, 2)}\n`],
    ['package.json', makePackageJson(contract)],
    ['pnpm-workspace.yaml', makeWorkspaceFile(contract)],
    ['docs/app-contract.schema.json', schemaSource.endsWith('\n') ? schemaSource : `${schemaSource}\n`],
    ['docs/app-profile.json', profileSource.endsWith('\n') ? profileSource : `${profileSource}\n`],
    ['docs/hjm-catalog.snapshot.json', catalogSource.endsWith('\n') ? catalogSource : `${catalogSource}\n`],
    [canonicalCatalogRelativePath, catalogSource.endsWith('\n') ? catalogSource : `${catalogSource}\n`],
    [canonicalReleaseRelativePath, canonicalReleaseSource],
    [contract.documents.product, bindDocumentEvidence(projectDocumentTables(substituteTemplate(product, values), contract, 'product'), contract, 'product')],
    [contract.documents.architecture, bindDocumentEvidence(projectDocumentTables(substituteTemplate(architecture, values), contract, 'architecture'), contract, 'architecture')],
    [contract.documents.design, bindDocumentEvidence(projectDocumentTables(substituteTemplate(design, values), contract, 'design'), contract, 'design')],
    [contract.documents.release, bindDocumentEvidence(projectDocumentTables(substituteTemplate(release, values), contract, 'release'), contract, 'release')],
    [`${contract.documents.decisionsDir}/ADR-0000-template.md`, renderedAdr],
    ['tools/runtime-bindings.mjs', readFileSync(resolve(scriptDirectory, 'runtime-bindings.mjs'), 'utf8')],
    ['tools/app-standard-core.mjs', appStandardCore],
    ['tools/check-app-contract.mjs', makeLocalContractChecker()],
    ['tools/check-doc-links.mjs', docLinksCore],
    ['tools/check-design-contract.mjs', makeLocalDesignChecker()],
    ['tools/json-schema-validator.mjs', jsonSchemaCore],
    ['tools/qa/README.md', makeQaReadme(contract)],
  ]);
  const declaredDecisions = [
    ...(Array.isArray(contract.designSystem?.optionalBetaAdoptions)
      ? contract.designSystem.optionalBetaAdoptions.map((adoption) => ({
        path: adoption.adrPath,
        binding: {
          kind: 'optional-beta-adoption',
          componentId: adoption.componentId,
          evidenceIds: adoption.evidenceIds,
        },
      }))
      : []),
    ...(Array.isArray(contract.waivers) ? contract.waivers.map((waiver) => ({
      path: waiver.adrPath,
      binding: {
        kind: 'waiver',
        ruleId: waiver.ruleId,
        owner: waiver.owner,
        approver: waiver.approver,
        createdAt: waiver.createdAt,
        expiresAt: waiver.expiresAt,
      },
    })) : []),
  ];
  for (const decision of declaredDecisions) {
    files.set(decision.path, makeBoundAdr(renderedAdr, decision.path, decision.binding));
  }
  const designAdoptions = [
    ...(Array.isArray(contract.designSystem?.requiredFoundations) ? contract.designSystem.requiredFoundations : []),
    ...(Array.isArray(contract.designSystem?.optionalBetaAdoptions) ? contract.designSystem.optionalBetaAdoptions : []),
  ];
  const evidenceComponents = new Map();
  for (const adoption of designAdoptions) {
    for (const evidenceId of adoption.evidenceIds || []) {
      const components = evidenceComponents.get(evidenceId) || [];
      components.push(adoption.componentId);
      evidenceComponents.set(evidenceId, components);
    }
  }
  for (const evidence of Array.isArray(contract.acceptance?.evidence) ? contract.acceptance.evidence : []) {
    if (evidence?.status !== 'planned'
      || typeof evidence.location !== 'string'
      || !evidence.location.startsWith('docs/evidence/')
      || !validRelativePath(evidence.location)) continue;
    const componentIds = evidenceComponents.get(evidence.id);
    files.set(
      evidence.location,
      componentIds?.length
        ? makePlannedDesignEvidence(contract, evidence, componentIds)
        : makePlannedEvidence(contract, evidence),
    );
  }
  for (const runtime of contract.runtimes) {
    files.set(`${runtime.root}/README.md`, makeRuntimeReadme(contract, runtime));
  }
  return files;
}

function scaffoldPlanDigest(files) {
  const hash = createHash('sha256');
  for (const [path, content] of [...files.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    hash.update(path);
    hash.update('\0');
    hash.update(content);
    hash.update('\0');
  }
  return hash.digest('hex');
}

async function statWithoutFollowing(path) {
  try {
    return await lstat(path);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

async function ensureSafeWorkspaceRoot(workspaceRoot) {
  const absoluteRoot = resolve(workspaceRoot);
  const rootStat = await statWithoutFollowing(absoluteRoot);
  if (!rootStat || !rootStat.isDirectory() || rootStat.isSymbolicLink()) {
    const error = new Error(`Workspace root must be an existing non-symlink directory: ${absoluteRoot}`);
    error.code = 'WORKSPACE_ROOT_INVALID';
    throw error;
  }
  let expectedCanonicalRoot = absoluteRoot;
  for (const systemAlias of [resolve('/tmp'), resolve('/var')]) {
    const aliasStat = await statWithoutFollowing(systemAlias);
    if (aliasStat?.isSymbolicLink()
      && (absoluteRoot === systemAlias || absoluteRoot.startsWith(`${systemAlias}${sep}`))) {
      expectedCanonicalRoot = resolve(await realpath(systemAlias), relative(systemAlias, absoluteRoot));
      break;
    }
  }
  const canonicalRoot = await realpath(absoluteRoot);
  if (canonicalRoot !== expectedCanonicalRoot) {
    const error = new Error(`Workspace root must not be reached through a symlink ancestor: ${absoluteRoot}`);
    error.code = 'WORKSPACE_ANCESTOR_SYMLINK';
    throw error;
  }
  const appsRoot = resolve(absoluteRoot, 'apps');
  const appsStat = await statWithoutFollowing(appsRoot);
  if (appsStat && (!appsStat.isDirectory() || appsStat.isSymbolicLink())) {
    const error = new Error(`Workspace apps root must be a non-symlink directory: ${appsRoot}`);
    error.code = 'APPS_ROOT_INVALID';
    throw error;
  }
  return { workspaceRoot: absoluteRoot, appsRoot };
}

export async function planAppScaffold(contract, { workspaceRoot = defaultWorkspaceRoot } = {}) {
  const validation = await validateAgainstCanonicalStandard(contract);
  if (!validation.ok) {
    return {
      ok: false,
      action: 'dry-run',
      targetPath: null,
      files: [],
      planSha256: null,
      findings: validation.findings,
    };
  }
  const safeRoot = await ensureSafeWorkspaceRoot(workspaceRoot);
  const targetPath = resolve(safeRoot.appsRoot, contract.app.id);
  if (!isInside(safeRoot.appsRoot, targetPath) || basename(targetPath) !== contract.app.id) {
    return {
      ok: false,
      action: 'dry-run',
      targetPath,
      files: [],
      planSha256: null,
      findings: [finding('TARGET_BOUNDARY_INVALID', 'contract.app.id', 'Generated app target must be the exact apps/<app-id> directory.')],
    };
  }
  const targetStat = await statWithoutFollowing(targetPath);
  if (targetStat) {
    return {
      ok: false,
      action: 'dry-run',
      targetPath,
      files: [],
      planSha256: null,
      findings: [finding('TARGET_EXISTS', targetPath, 'Generator refuses to overwrite or merge into an existing target.')],
    };
  }
  const files = await buildScaffoldFiles(contract);
  return {
    ok: true,
    action: 'dry-run',
    targetPath,
    files: [...files.keys()].sort(),
    planSha256: scaffoldPlanDigest(files),
    findings: [],
    _files: files,
    _workspaceRoot: safeRoot.workspaceRoot,
    _appsRoot: safeRoot.appsRoot,
  };
}

async function writeScaffold(plan) {
  const publicPlan = { ...plan };
  delete publicPlan._files;
  delete publicPlan._workspaceRoot;
  delete publicPlan._appsRoot;
  if (!plan.ok) return publicPlan;
  const safeRoot = await ensureSafeWorkspaceRoot(plan._workspaceRoot);
  if (safeRoot.appsRoot !== plan._appsRoot || dirname(plan.targetPath) !== safeRoot.appsRoot) {
    const error = new Error('Generation boundary changed after planning; no files were written.');
    error.code = 'GENERATION_BOUNDARY_CHANGED';
    throw error;
  }
  await mkdir(safeRoot.appsRoot, { recursive: true });
  const appsStat = await statWithoutFollowing(safeRoot.appsRoot);
  if (!appsStat?.isDirectory() || appsStat.isSymbolicLink()) {
    const error = new Error(`Workspace apps root changed to an unsafe path: ${safeRoot.appsRoot}`);
    error.code = 'APPS_ROOT_CHANGED';
    throw error;
  }
  const targetStat = await statWithoutFollowing(plan.targetPath);
  if (targetStat) {
    return {
      ...publicPlan,
      ok: false,
      action: 'write',
      findings: [finding('TARGET_EXISTS', plan.targetPath, 'Target appeared after dry-run; no files were written.')],
    };
  }

  let targetCreated = false;
  try {
    await mkdir(plan.targetPath, { recursive: false });
    targetCreated = true;
    const [canonicalAppsRoot, canonicalTarget] = await Promise.all([
      realpath(safeRoot.appsRoot),
      realpath(plan.targetPath),
    ]);
    if (!isInside(canonicalAppsRoot, canonicalTarget) || dirname(canonicalTarget) !== canonicalAppsRoot) {
      const error = new Error('Generated target resolved outside the canonical apps root.');
      error.code = 'GENERATED_REALPATH_ESCAPE';
      throw error;
    }
    for (const [relativePath, content] of [...plan._files.entries()].sort(([left], [right]) => left.localeCompare(right))) {
      const destination = resolve(plan.targetPath, relativePath);
      if (!isInside(plan.targetPath, destination)) {
        const error = new Error(`Generated path escapes target: ${relativePath}`);
        error.code = 'GENERATED_PATH_ESCAPE';
        throw error;
      }
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, content, { encoding: 'utf8', flag: 'wx', mode: 0o644 });
    }
  } catch (error) {
    if (targetCreated) await rm(plan.targetPath, { recursive: true, force: true });
    if (error?.code === 'EEXIST') {
      return {
        ...publicPlan,
        ok: false,
        action: 'write',
        findings: [finding('TARGET_EXISTS', plan.targetPath, 'An existing path blocked generation; created scaffold content was rolled back.')],
      };
    }
    throw error;
  }
  return {
    ...publicPlan,
    action: 'write',
    written: true,
    nextSteps: [
      `Initialize ${plan.targetPath} as an independent Git repository and configure the reviewed remote.`,
      'Initialize declared runtimes with their official exact-version tools without replacing app.contract.json or canonical documents.',
      `Run node scripts/app-standard.mjs check-app --app-root ${plan.targetPath} from the portfolio root.`,
      'Add the app to portfolio.json as incubating, then run node scripts/portfolio.mjs doctor.',
    ],
  };
}

async function checkRequiredFile(appRoot, relativePath, findings, { allowTemplate = false } = {}) {
  const absolutePath = resolve(appRoot, relativePath);
  if (!isInside(appRoot, absolutePath)) {
    addFinding(findings, 'APP_FILE_PATH_ESCAPE', relativePath, `Required path escapes app root: ${relativePath}`);
    return null;
  }
  let source;
  try {
    source = await readRegularTextFile(absolutePath, `Required app file ${relativePath}`);
  } catch (error) {
    addFinding(findings, error.code || 'APP_FILE_INVALID', relativePath, error.message);
    return null;
  }
  if (!source.trim()) {
    addFinding(findings, 'APP_FILE_EMPTY', relativePath, `Required app file is empty: ${relativePath}`);
  }
  if (!allowTemplate && /\{\{(?:APP_ID|DISPLAY_NAME|OWNER|STANDARD_VERSION|REVIEW_DATE|DOCUMENT_STATUS|HJM_POLICY_URL)\}\}/.test(source)) {
    addFinding(findings, 'TEMPLATE_PLACEHOLDER_UNRESOLVED', relativePath, `Required app file contains an unresolved template placeholder: ${relativePath}`);
  }
  return source;
}

function isRegistryConfigurationKey(key) {
  const lower = key.toLowerCase();
  const compact = lower.replace(/[-_]/g, '');
  return lower === 'registry'
    || lower === 'userconfig'
    || lower.endsWith(':registry')
    || ['npmconfigregistry', 'npmconfiguserconfig', 'npmrc', 'registries', 'npmregistries', 'npmregistryserver', 'npmscopes'].includes(compact);
}

function findManifestRegistryOverrides(manifest) {
  const overrides = [];
  const managerContainers = new Set(['config', 'installconfig', 'npm', 'npmconfig', 'packagemanager', 'pnpm', 'publishconfig']);
  const visit = (value, path = [], insideManagerConfig = false) => {
    if (!isPlainObject(value)) return;
    for (const [key, child] of Object.entries(value)) {
      const lower = key.toLowerCase();
      const compact = lower.replace(/[-_]/g, '');
      const childPath = [...path, key];
      const childInsideManagerConfig = insideManagerConfig || managerContainers.has(compact);
      const strongRegistryKey = lower.endsWith(':registry');
      if (isRegistryConfigurationKey(key)
        && (path.length === 0 || insideManagerConfig || strongRegistryKey)) {
        overrides.push(childPath.join('.'));
      }
      visit(child, childPath, childInsideManagerConfig);
    }
  };
  visit(manifest);
  const registryScript = /(?:npm_config_(?:registry|userconfig)|--(?:config\.)?(?:(?:@[^:\s]+):)?(?:registry|userconfig)(?:=|\s)|\b(?:npm|pnpm)\s+(?:config\s+)?(?:set|delete)\s+(?:(?:@[^:\s]+):)?registry\b)/i;
  for (const [name, command] of Object.entries(isPlainObject(manifest.scripts) ? manifest.scripts : {})) {
    if (typeof command === 'string' && registryScript.test(command)) overrides.push('scripts.' + name);
  }
  return [...new Set(overrides)];
}

function findWorkspaceRegistryOverrides(source) {
  const overrides = [];
  for (const [index, rawLine] of source.split(/\r?\n/).entries()) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith('#')) continue;
    const quoted = rawLine.match(/^(\s*)(['"])(.*?)\2\s*:\s*(.*)$/);
    const plain = quoted ? null : rawLine.match(/^(\s*)(.*):(?:\s+|$)(.*)$/);
    const key = (quoted?.[3] ?? plain?.[2] ?? '').trim();
    if (!key || key.startsWith('-')) continue;
    if (isRegistryConfigurationKey(key)) overrides.push(index + 1);
  }
  return overrides;
}

async function checkPackageManagerRegistryBoundary(appRoot, contract, findings) {
  const npmrcPaths = [];
  const manifestPaths = [];
  const workspacePaths = [];
  const walk = async (directory) => {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      addFinding(findings, 'PACKAGE_MANAGER_CONFIG_SCAN_FAILED', relative(appRoot, directory) || '.', error.message);
      return;
    }
    for (const entry of entries) {
      const absolutePath = resolve(directory, entry.name);
      const path = relative(appRoot, absolutePath).replaceAll('\\', '/');
      if (entry.name === '.npmrc') npmrcPaths.push({ absolutePath, path });
      if (entry.name === 'package.json') manifestPaths.push({ absolutePath, path });
      if (entry.name === 'pnpm-workspace.yaml') workspacePaths.push({ absolutePath, path });
      if (entry.isDirectory() && !packageManagerScanIgnoredDirectories.has(entry.name)) await walk(absolutePath);
    }
  };
  await walk(appRoot);

  for (const { path } of npmrcPaths) {
    if (path !== '.npmrc') {
      addFinding(findings, 'NESTED_NPMRC_FORBIDDEN', path, 'Only the canonical root .npmrc is allowed; nested or additional npm configuration is forbidden.');
    }
  }
  for (const { absolutePath, path } of manifestPaths) {
    let source;
    try {
      source = await readRegularTextFile(absolutePath, `Package manager manifest ${path}`);
    } catch (error) {
      addFinding(findings, 'PACKAGE_MANAGER_CONFIG_FILE_INVALID', path, error.message);
      continue;
    }
    let manifest;
    try {
      manifest = JSON.parse(source);
    } catch (error) {
      addFinding(findings, 'PACKAGE_MANAGER_MANIFEST_INVALID', path, error.message);
      continue;
    }
    if (Object.hasOwn(manifest, 'packageManager')
      && manifest.packageManager !== `pnpm@${contract.toolchain?.packageManager?.version}`) {
      addFinding(findings, 'PACKAGE_MANAGER_OVERRIDE', path + '.packageManager', 'Every declared packageManager field must use the contract-pinned pnpm release; URL and alternate manager references are forbidden.');
    }
    for (const overridePath of findManifestRegistryOverrides(manifest)) {
      addFinding(findings, 'PACKAGE_MANAGER_REGISTRY_OVERRIDE', path + '.' + overridePath, 'Package manifests must not override the canonical npm registry or user configuration.');
    }
  }
  for (const { absolutePath, path } of workspacePaths) {
    let source;
    try {
      source = await readRegularTextFile(absolutePath, `Package manager workspace ${path}`);
    } catch (error) {
      addFinding(findings, 'PACKAGE_MANAGER_CONFIG_FILE_INVALID', path, error.message);
      continue;
    }
    for (const line of findWorkspaceRegistryOverrides(source)) {
      addFinding(findings, 'WORKSPACE_REGISTRY_OVERRIDE', path + ':' + line, 'Workspace configuration must not override the canonical npm registry.');
    }
  }
}

function parseSimpleFrontmatter(source, path, findings) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    addFinding(findings, 'DOCUMENT_FRONTMATTER_MISSING', path, `${path} must start with YAML frontmatter.`);
    return null;
  }
  const metadata = {};
  for (const [index, line] of match[1].split(/\r?\n/).entries()) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const field = line.match(/^([a-z_][a-z0-9_]*):(?:\s+(.*))?$/i);
    if (!field) {
      addFinding(findings, 'DOCUMENT_FRONTMATTER_UNSUPPORTED', `${path}:${index + 2}`, 'Frontmatter metadata must use one scalar key per line.');
      continue;
    }
    const [, key, rawValue = ''] = field;
    if (Object.hasOwn(metadata, key)) {
      addFinding(findings, 'DOCUMENT_FRONTMATTER_DUPLICATE', `${path}:${index + 2}`, `Frontmatter key "${key}" is duplicated.`);
      continue;
    }
    let value = rawValue.trim();
    if (value.startsWith('"')) {
      try {
        value = JSON.parse(value);
      } catch {
        addFinding(findings, 'DOCUMENT_FRONTMATTER_VALUE_INVALID', `${path}:${index + 2}`, `Frontmatter key "${key}" has an invalid quoted scalar.`);
      }
    }
    metadata[key] = value;
  }
  return metadata;
}

function parseAdrBinding(source, path, findings) {
  const match = source.match(/<!-- hjm-contract-binding\r?\n([\s\S]*?)\r?\n-->/);
  if (!match) {
    addFinding(findings, 'ADR_BINDING_MISSING', path, `${path} must contain the machine-readable hjm-contract-binding marker.`);
    return null;
  }
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    addFinding(findings, 'ADR_BINDING_INVALID', path, `${path} has invalid binding JSON: ${error.message}`);
    return null;
  }
}

function parseDocumentEvidenceBinding(source, path, findings) {
  const match = source.match(/<!-- hjm-contract-evidence\r?\n([\s\S]*?)\r?\n-->/);
  if (!match) {
    addFinding(findings, 'DOCUMENT_EVIDENCE_BINDING_MISSING', path, `${path} must contain the generated hjm-contract-evidence registry projection.`);
    return null;
  }
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    addFinding(findings, 'DOCUMENT_EVIDENCE_BINDING_INVALID', path, `${path} has invalid evidence binding JSON: ${error.message}`);
    return null;
  }
}

function validateDeclaredAdr(source, path, contract, expectedBinding, findings, { acceptedRequired = false } = {}) {
  if (!source) return;
  const metadata = parseSimpleFrontmatter(source, path, findings);
  const expectedAdrId = basename(path).match(/^(ADR-\d{4})-/)?.[1];
  for (const [field, expected] of Object.entries({
    schema: 'hjm.app-document/1',
    document: 'adr',
    app_id: contract.app.id,
    owner: contract.governance.owner,
    adr_id: expectedAdrId,
  })) {
    if (metadata && metadata[field] !== expected) {
      addFinding(findings, 'ADR_METADATA_MISMATCH', `${path}.${field}`, `${path} frontmatter ${field} must equal ${JSON.stringify(expected)}.`);
    }
  }
  if (metadata && !['proposed', 'accepted'].includes(metadata.status)) {
    addFinding(findings, 'ADR_STATUS_INVALID', `${path}.status`, 'Declared ADR status must be proposed or accepted.');
  } else if (metadata && acceptedRequired && metadata.status !== 'accepted') {
    addFinding(findings, 'ADR_NOT_ACCEPTED', `${path}.status`, 'This ADR must be accepted before the active/approved contract state.');
  }
  const binding = parseAdrBinding(source, path, findings);
  if (binding && JSON.stringify(binding) !== JSON.stringify(expectedBinding)) {
    addFinding(findings, 'ADR_BINDING_MISMATCH', path, `${path} contract binding must exactly match app.contract.json.`);
  }
  if ((acceptedRequired || metadata?.status === 'accepted')
    && /\[작성\]|\[결정이 필요한|\[review\/test\/measurement\]/.test(source)) {
    addFinding(findings, 'ADR_INCOMPLETE', path, `${path} is still a generic template and cannot authorize an adoption or waiver.`);
  }
}

// Lint/format contract: canonical files are projection-checked at every stage; exact
// devDependencies, runtime configs and lint scripts are implementation-gate checks.
async function checkStaticAnalysisContract(appRoot, contract, implementationGate, findings) {
  if (!implementationGate) return;
  const readManifest = async (relativePath) => {
    try {
      return JSON.parse(await readRegularTextFile(resolve(appRoot, relativePath), relativePath));
    } catch {
      return null;
    }
  };
  const rootManifest = await readManifest('package.json');
  for (const entry of staticAnalysisPolicy.shared) {
    const declared = rootManifest?.devDependencies?.[entry.package];
    if (declared !== entry.version) {
      addFinding(findings, 'STATIC_ANALYSIS_DEPENDENCY_MISMATCH', `package.json.devDependencies.${entry.package}`, `Workspace root must declare ${entry.package}@${entry.version} as an exact devDependency (profile toolchain.staticAnalysis).`);
    }
  }
  for (const runtime of Array.isArray(contract.runtimes) ? contract.runtimes : []) {
    const configPath = `${runtime.root}/eslint.config.mjs`;
    let configSource = null;
    try {
      configSource = await readRegularTextFile(resolve(appRoot, configPath), configPath);
    } catch {
      addFinding(findings, 'STATIC_ANALYSIS_RUNTIME_CONFIG_MISSING', configPath, `${runtime.kind} runtime needs eslint.config.mjs; copy the snippet from ${runtime.root}/README.md.`);
    }
    const basePath = relative(runtime.root, 'tools/eslint.base.mjs').split(sep).join('/');
    if (configSource !== null && !configSource.includes(`from '${basePath}'`)) {
      addFinding(findings, 'STATIC_ANALYSIS_RUNTIME_CONFIG_UNBOUND', configPath, `${configPath} must import hjmRuntimeConfig from '${basePath}' so the runtime shares the portfolio lint contract.`);
    }
    const preset = staticAnalysisPolicy.presets[runtime.kind];
    const runtimeManifest = await readManifest(`${runtime.root}/package.json`);
    if (preset) {
      if (configSource !== null && !configSource.includes(`'${preset.package}/`)) {
        addFinding(findings, 'STATIC_ANALYSIS_PRESET_UNUSED', configPath, `${configPath} must load the ${preset.package} preset (${preset.entry}).`);
      }
      if (runtimeManifest && runtimeManifest.devDependencies?.[preset.package] !== preset.version) {
        addFinding(findings, 'STATIC_ANALYSIS_PRESET_MISMATCH', `${runtime.root}/package.json.devDependencies.${preset.package}`, `${runtime.kind} runtime must declare ${preset.package}@${preset.version} exactly.`);
      }
    }
    if (runtimeManifest && !/^eslint(?:\s|$)/.test(String(runtimeManifest.scripts?.lint || '').trim())) {
      addFinding(findings, 'STATIC_ANALYSIS_LINT_SCRIPT_INVALID', `${runtime.root}/package.json.scripts.lint`, `${runtime.kind} runtime lint script must run eslint (the framework CLI lint wrapper is not the portfolio contract).`);
    }
    for (const forbidden of ['.prettierrc', '.prettierrc.json', '.prettierrc.js', '.prettierrc.cjs', '.prettierrc.mjs', 'prettier.config.js', 'prettier.config.cjs', 'prettier.config.mjs', 'biome.json', 'biome.jsonc']) {
      if (await statWithoutFollowing(resolve(appRoot, runtime.root, forbidden))) {
        addFinding(findings, 'STATIC_ANALYSIS_FORMATTER_OVERRIDE', `${runtime.root}/${forbidden}`, 'Formatting is owned by the root prettier.config.mjs; runtime-level formatter configuration is not allowed.');
      }
    }
  }
}

// ESLint 10 resolves the config from each file's own directory, so a packages/*/eslint.config.*
// would silently replace the root contract for that package. Shared packages are linted by the
// root config only.
async function checkSharedPackageLintConfigs(appRoot, findings) {
  const packagesRoot = resolve(appRoot, 'packages');
  let entries = [];
  try {
    entries = await readdir(packagesRoot, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    for (const name of ['eslint.config.js', 'eslint.config.mjs', 'eslint.config.cjs', 'eslint.config.ts', 'eslint.config.mts', '.eslintrc', '.eslintrc.js', '.eslintrc.cjs', '.eslintrc.json']) {
      if (await statWithoutFollowing(resolve(packagesRoot, entry.name, name))) {
        addFinding(findings, 'STATIC_ANALYSIS_PACKAGE_CONFIG_FORBIDDEN', `packages/${entry.name}/${name}`, 'Shared packages are linted by the root eslint.config.mjs; a package-level ESLint config replaces the portfolio contract under ESLint 10 file-directory lookup.');
      }
    }
  }
}

// An evidence record is either one regular file or a directory whose index.md carries the
// type-specific narrative and whose every regular file is covered by one manifest digest.
// Directories exist for screenshot/recording sets that cannot be a single Markdown file.
async function readEvidenceRecord(absolutePath, label) {
  const stat = await statWithoutFollowing(absolutePath);
  if (!stat) {
    const error = new Error(`${label} does not exist: ${absolutePath}`);
    error.code = 'FILE_MISSING';
    throw error;
  }
  if (stat.isSymbolicLink()) {
    const error = new Error(`${label} must not be a symbolic link: ${absolutePath}`);
    error.code = 'FILE_TYPE_INVALID';
    throw error;
  }
  if (stat.isFile()) {
    const bytes = await readRegularFileBytes(absolutePath, label);
    return { kind: 'file', narrativeBytes: bytes, digest: createHash('sha256').update(bytes).digest('hex'), files: 1 };
  }
  if (!stat.isDirectory()) {
    const error = new Error(`${label} must be a regular file or a directory: ${absolutePath}`);
    error.code = 'FILE_TYPE_INVALID';
    throw error;
  }
  const files = [];
  const walk = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      if (entry.isSymbolicLink()) {
        const error = new Error(`${label} directory must not contain symbolic links: ${path}`);
        error.code = 'EVIDENCE_DIRECTORY_SYMLINK';
        throw error;
      }
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile()) files.push(path);
    }
  };
  await walk(absolutePath);
  const indexPath = resolve(absolutePath, 'index.md');
  if (!files.includes(indexPath)) {
    const error = new Error(`${label} directory record requires an index.md narrative: ${absolutePath}`);
    error.code = 'EVIDENCE_DIRECTORY_INDEX_MISSING';
    throw error;
  }
  const manifestLines = [];
  for (const path of files.sort()) {
    const bytes = await readRegularFileBytes(path, label);
    manifestLines.push(`${createHash('sha256').update(bytes).digest('hex')}  ${relative(absolutePath, path).split(sep).join('/')}`);
  }
  return {
    kind: 'directory',
    narrativeBytes: await readRegularFileBytes(indexPath, label),
    digest: createHash('sha256').update(`${manifestLines.join('\n')}\n`).digest('hex'),
    files: files.length,
  };
}

export async function digestEvidence(appRoot, { evidenceId } = {}) {
  const absoluteRoot = resolve(appRoot);
  const findings = [];
  const { contract } = await loadAppContract(resolve(absoluteRoot, 'app.contract.json'));
  const entries = (Array.isArray(contract.acceptance?.evidence) ? contract.acceptance.evidence : [])
    .filter((evidence) => !evidenceId || evidence.id === evidenceId);
  if (evidenceId && entries.length === 0) {
    addFinding(findings, 'EVIDENCE_REFERENCE_MISSING', 'contract.acceptance.evidence', `No evidence entry has ID ${evidenceId}.`);
  }
  const records = [];
  for (const evidence of entries) {
    const absolutePath = resolve(absoluteRoot, evidence.location || '');
    if (!validRelativePath(evidence.location) || !isInside(absoluteRoot, absolutePath)) {
      addFinding(findings, 'EVIDENCE_LOCATION_INVALID', evidence.id, `${evidence.id} location must be a safe repository-local path.`);
      continue;
    }
    try {
      const record = await readEvidenceRecord(absolutePath, `Evidence ${evidence.id}`);
      records.push({
        id: evidence.id,
        location: evidence.location,
        kind: record.kind,
        files: record.files,
        digest: `sha256:${record.digest}`,
        recordedDigest: evidence.digest ?? null,
        matchesRecorded: evidence.digest ? String(evidence.digest).replace(/^sha256:/, '') === record.digest : null,
      });
    } catch (error) {
      addFinding(findings, error.code || 'EVIDENCE_FILE_INVALID', evidence.location, error.message);
    }
  }
  return { ok: findings.length === 0, appRoot: absoluteRoot, records, findings };
}

function projectCriterionRow(criterion) {
  return `| ${criterion.id} | ${criterion.statement} | ${criterion.verification} | ${criterion.status} | ${(criterion.evidenceIds || []).join(', ') || '없음'} |`;
}

function projectEvidenceRow(evidence) {
  return `| ${evidence.id} | ${(evidence.criterionIds || []).join(', ')} | ${evidence.type} | ${evidence.location} | ${evidence.capturedAt || '—'} | ${evidence.digest || '—'} | ${evidence.status} | ${evidence.owner} |`;
}

function replaceProjectedTable(source, headingPattern, rows, idPattern) {
  const heading = source.match(headingPattern);
  if (!heading) return { source, error: 'section missing', removed: [], added: [] };
  const sectionStart = heading.index + heading[0].length;
  const rest = source.slice(sectionStart);
  const endOffset = rest.search(/\n## \d+\.|\n<!-- hjm-contract-evidence/);
  const sectionEnd = endOffset === -1 ? source.length : sectionStart + endOffset;
  const lines = source.slice(sectionStart, sectionEnd).split('\n');
  const tableStart = lines.findIndex((line) => line.startsWith('|'));
  if (tableStart === -1 || !lines[tableStart + 1]?.startsWith('|')) return { source, error: 'table missing', removed: [], added: [] };
  let tableEnd = tableStart + 2;
  while (tableEnd < lines.length && lines[tableEnd].startsWith('|')) tableEnd += 1;
  const existingRows = lines.slice(tableStart + 2, tableEnd);
  const existingIds = existingRows.map((row) => row.match(idPattern)?.[1]).filter(Boolean);
  const projectedIds = rows.map((row) => row.match(idPattern)?.[1]).filter(Boolean);
  const rebuilt = [...lines.slice(0, tableStart + 2), ...rows, ...lines.slice(tableEnd)];
  return {
    source: source.slice(0, sectionStart) + rebuilt.join('\n') + source.slice(sectionEnd),
    removed: existingIds.filter((id) => !projectedIds.includes(id)),
    added: projectedIds.filter((id) => !existingIds.includes(id)),
  };
}

export async function syncDocumentProjections(appRoot, { write = false } = {}) {
  const absoluteRoot = resolve(appRoot);
  const findings = [];
  const { contract } = await loadAppContract(resolve(absoluteRoot, 'app.contract.json'));
  const documents = [];
  for (const key of ['product', 'architecture', 'design', 'release']) {
    const path = contract.documents?.[key];
    if (!validRelativePath(path)) {
      addFinding(findings, 'DOCUMENT_PATH_INVALID', `contract.documents.${key}`, `contract.documents.${key} must be a safe relative path.`);
      continue;
    }
    let original;
    try {
      original = await readRegularTextFile(resolve(absoluteRoot, path), `${key} document`);
    } catch (error) {
      addFinding(findings, error.code || 'DOCUMENT_READ_FAILED', path, error.message);
      continue;
    }
    const binding = documentEvidenceBinding(contract, key);
    const acceptance = replaceProjectedTable(
      original,
      /## \d+\. Acceptance criteria\s*\n/,
      binding.criteria.map(projectCriterionRow),
      /^\|\s*([A-Z][A-Z0-9-]*-\d{3,})\s*\|/,
    );
    const evidence = replaceProjectedTable(
      acceptance.source,
      /## \d+\. Evidence registry\s*\n/,
      binding.evidence.map(projectEvidenceRow),
      /^\|\s*(EV-\d{3,})\s*\|/,
    );
    for (const [section, result] of [['Acceptance criteria', acceptance], ['Evidence registry', evidence]]) {
      if (result.error) addFinding(findings, 'DOCUMENT_SECTION_MISSING', path, `${path} ${section} ${result.error}; restore the template section before syncing.`);
    }
    const marker = `<!-- hjm-contract-evidence\n${JSON.stringify(binding, null, 2)}\n-->\n`;
    let updated = evidence.source;
    if (/<!-- hjm-contract-evidence\r?\n[\s\S]*?\r?\n-->\n?/.test(updated)) {
      updated = updated.replace(/<!-- hjm-contract-evidence\r?\n[\s\S]*?\r?\n-->\n?/, marker);
    } else {
      updated = bindDocumentEvidence(updated, contract, key);
    }
    const changed = updated !== original;
    documents.push({
      path,
      changed,
      removedRows: [...acceptance.removed, ...evidence.removed],
      addedRows: [...acceptance.added, ...evidence.added],
    });
    if (changed && write && findings.length === 0) {
      await writeFile(resolve(absoluteRoot, path), updated, 'utf8');
    }
  }
  const removed = documents.flatMap((document) => document.removedRows.map((id) => `${document.path}: ${id}`));
  return {
    ok: findings.length === 0,
    appRoot: absoluteRoot,
    action: write && findings.length === 0 ? 'write' : 'dry-run',
    documents,
    // Rows present only in a document are lost by a sync; they belong in app.contract.json first.
    documentOnlyRows: removed,
    findings,
  };
}

// One allow-list serves both verification and in-place standard updates. Product
// contracts, prose, evidence, manifests, lockfiles and runtime sources are not owned here.
function bindingProjectionSources(contract) {
  const core = readFileSync(fileURLToPath(import.meta.url), 'utf8');
  return new Map([
    ['.github/CODEOWNERS', makeCodeowners(contract)],
    ['.npmrc', canonicalNpmrcSource],
    ['.nvmrc', `${contract.toolchain.node}\n`],
    ['docs/app-contract.schema.json', readFileSync(canonicalSchemaPath, 'utf8')],
    ['docs/app-profile.json', readFileSync(canonicalProfilePath, 'utf8')],
    ['docs/hjm-catalog.snapshot.json', canonicalCatalogSource],
    [canonicalCatalogRelativePath, canonicalCatalogSource],
    [canonicalReleaseRelativePath, canonicalReleaseSource],
    ['tools/runtime-bindings.mjs', readFileSync(resolve(scriptDirectory, 'runtime-bindings.mjs'), 'utf8')],
    ['tools/run-quality.mjs', `#!/usr/bin/env node\nimport { runBoundQuality } from './runtime-bindings.mjs';\nimport { resolve } from 'node:path';\ntry { await runBoundQuality(resolve(import.meta.dirname, '..'), process.argv[2] ?? 'check'); }\ncatch (error) { console.error(error.message); process.exitCode = 1; }\n`],
    ['tools/app-standard-core.mjs', core],
    ['tools/check-app-contract.mjs', makeLocalContractChecker()],
    ['tools/check-design-contract.mjs', makeLocalContractChecker()],
    ['tools/check-hjm-source.mjs', makeLocalDesignChecker({ runtimeBindings: true })],
    ['tools/check-doc-links.mjs', readFileSync(resolve(scriptDirectory, 'check-doc-links.mjs'), 'utf8')],
    ['tools/json-schema-validator.mjs', readFileSync(resolve(scriptDirectory, 'json-schema-validator.mjs'), 'utf8')],
    ['.github/workflows/app-standard.yml', bindingWorkflow(contract)],
  ]);
}

export function standardProjectionSources(contract) {
  if (bound(contract)) return bindingProjectionSources(contract);
  return new Map([
    ['.github/CODEOWNERS', makeCodeowners(contract)],
    ['.github/dependabot.yml', makeDependabotConfig()],
    ['.npmrc', canonicalNpmrcSource],
    ['.editorconfig', makeEditorconfig()],
    ['prettier.config.mjs', makePrettierConfig()],
    ['.prettierignore', makePrettierIgnore()],
    ['eslint.config.mjs', makeRootEslintConfig()],
    ['tools/eslint.base.mjs', makeEslintBase()],
    ['docs/app-contract.schema.json', readFileSync(canonicalSchemaPath, 'utf8')],
    ['docs/app-profile.json', readFileSync(canonicalProfilePath, 'utf8')],
    ['docs/hjm-catalog.snapshot.json', canonicalCatalogSource],
    [canonicalCatalogRelativePath, canonicalCatalogSource],
    [canonicalReleaseRelativePath, canonicalReleaseSource],
    ['tools/runtime-bindings.mjs', readFileSync(resolve(scriptDirectory, 'runtime-bindings.mjs'), 'utf8')],
    ['tools/app-standard-core.mjs', readFileSync(fileURLToPath(import.meta.url), 'utf8')],
    ['tools/check-app-contract.mjs', makeLocalContractChecker()],
    ['tools/check-doc-links.mjs', readFileSync(resolve(scriptDirectory, 'check-doc-links.mjs'), 'utf8')],
    ['tools/check-design-contract.mjs', makeLocalDesignChecker()],
    ['tools/json-schema-validator.mjs', readFileSync(resolve(scriptDirectory, 'json-schema-validator.mjs'), 'utf8')],
    ['.github/workflows/quality-gate.yml', makeQualityGateWorkflow(contract)],
  ]);
}

async function assertSyncPath(appRoot, path, { allowMissing = false } = {}) {
  let current = appRoot;
  const parts = path.split('/');
  for (let index = 0; index < parts.length; index += 1) {
    current = resolve(current, parts[index]);
    let stat;
    try { stat = await lstat(current); } catch (error) {
      if (allowMissing && error.code === 'ENOENT' && index === parts.length - 1) return false;
      throw error;
    }
    if (stat.isSymbolicLink() || (index < parts.length - 1 ? !stat.isDirectory() : !stat.isFile())) {
      throw Object.assign(new Error(`Standard sync requires existing non-symlink paths: ${path}`), { code: 'STANDARD_SYNC_PATH_INVALID' });
    }
  }
  return true;
}

export async function syncStandardProjections(appRoot, { write = false } = {}) {
  if (basename(scriptDirectory) === 'tools') {
    throw Object.assign(new Error('Run sync-standard from the central portfolio checkout, not a vendored app validator.'), { code: 'CENTRAL_STANDARD_REQUIRED' });
  }
  const { workspaceRoot: absoluteRoot } = await ensureSafeWorkspaceRoot(appRoot);
  await assertSyncPath(absoluteRoot, 'app.contract.json');
  const { contract } = await loadAppContract(resolve(absoluteRoot, 'app.contract.json'));
  const validation = validateAppContract(contract);
  if (!validation.ok) return { ...validation, appRoot: absoluteRoot };
  if (basename(absoluteRoot) !== contract.app.id) {
    throw Object.assign(new Error('App root basename must match contract.app.id.'), { code: 'APP_ROOT_ID_MISMATCH' });
  }
  const updates = [];
  const findings = [];
  // Only explicitly introduced central projections may be created during migration.
  // Missing older scaffold files still require repair, and symlinks are rejected.
  const mayCreate = new Set([canonicalReleaseRelativePath, canonicalCatalogRelativePath, 'tools/runtime-bindings.mjs', 'tools/check-hjm-source.mjs']);
  const readProjection = async (path) => await assertSyncPath(absoluteRoot, path, { allowMissing: mayCreate.has(path) })
    ? readRegularTextFile(resolve(absoluteRoot, path), path) : null;
  for (const [path, expected] of standardProjectionSources(contract)) {
    try {
      const original = await readProjection(path);
      if (original !== expected) updates.push({ path, original, expected });
    } catch (error) {
      addFinding(findings, error.code || 'STANDARD_SYNC_READ_FAILED', path, error.message);
    }
  }
  if (write && findings.length === 0) {
    for (const update of updates) {
      if (await readProjection(update.path) !== update.original) {
        addFinding(findings, 'STANDARD_SYNC_CONCURRENT_EDIT', update.path, 'File changed during planning; retry after reviewing the working tree.');
      }
    }
    if (findings.length === 0) {
      const written = [];
      try {
        for (const update of updates) {
          if (update.original !== null) written.push(update);
          await writeFile(resolve(absoluteRoot, update.path), update.expected, { encoding: 'utf8', flag: update.original === null ? 'wx' : 'w' });
          if (update.original === null) written.push(update);
        }
      } catch (error) {
        for (const update of written.reverse()) {
          if (update.original === null) await rm(resolve(absoluteRoot, update.path));
          else await writeFile(resolve(absoluteRoot, update.path), update.original, 'utf8');
        }
        throw error;
      }
    }
  }
  const digest = (source) => source === null ? null : createHash('sha256').update(source).digest('hex');
  return {
    ok: findings.length === 0, appRoot: absoluteRoot,
    action: write && findings.length === 0 ? 'write' : 'dry-run',
    standardUpdates: updates.map(({ path, original, expected }) => ({ path, beforeSha256: digest(original), afterSha256: digest(expected) })),
    findings,
  };
}

export async function checkAppConformance(appRoot, { now = new Date(), targetStage } = {}) {
  const absoluteRoot = resolve(appRoot);
  const findings = [];
  resolveImplementationGate(undefined, targetStage);
  const rootStat = await statWithoutFollowing(absoluteRoot);
  if (!rootStat || !rootStat.isDirectory() || rootStat.isSymbolicLink()) {
    return {
      ok: false,
      appRoot: absoluteRoot,
      findings: [finding('APP_ROOT_INVALID', absoluteRoot, 'App root must be an existing non-symlink directory.')],
    };
  }
  let loaded;
  try {
    loaded = await loadAppContract(resolve(absoluteRoot, 'app.contract.json'));
  } catch (error) {
    return {
      ok: false,
      appRoot: absoluteRoot,
      findings: [finding(error.code || 'CONTRACT_READ_FAILED', 'app.contract.json', error.message)],
    };
  }
  const contract = loaded.contract;
  const implementationGate = resolveImplementationGate(contract, targetStage);
  const declaredStage = requiresImplementationGate(contract.app, contract.governance) ? 'implementation-conformant' : 'governance-scaffold';
  const rehearsal = implementationGate && declaredStage !== 'implementation-conformant';
  findings.push(...validateAppContract(contract, { now, targetStage }).findings);
  if (!isPlainObject(contract.app) || !idPattern.test(contract.app.id || '')) {
    return { ok: false, appRoot: absoluteRoot, findings };
  }
  if (basename(absoluteRoot) !== contract.app.id) {
    addFinding(findings, 'APP_ROOT_ID_MISMATCH', absoluteRoot, `App root basename must equal contract app ID "${contract.app.id}".`);
  }

  if (bound(contract)) {
    const bindingFindings = [];
    validateBindings(contract, bindingFindings);
    // Missing evidence or external protection must not hide independent source,
    // document or lockfile failures from a rehearsal. Only malformed input makes
    // traversing the declared runtime structure unsafe.
    if (validateWithJsonSchema(contract, canonicalSchema).findings.length || bindingFindings.length) {
      return { ok: false, appRoot: absoluteRoot, findings };
    }
  }

  const requiredFiles = bound(contract) ? [...bindingProjectionSources(contract).keys(), '.github/dependabot.yml', ...Object.entries(canonicalDocuments).filter(([key]) => key !== 'decisionsDir').map(([,path]) => path)] : [
    '.github/CODEOWNERS',
    '.github/dependabot.yml',
    '.github/workflows/quality-gate.yml',
    '.npmrc',
    ...staticAnalysisPolicy.canonicalFiles,
    'README.md',
    'package.json',
    'pnpm-workspace.yaml',
    '.nvmrc',
    'docs/app-contract.schema.json',
    'docs/app-profile.json',
    'docs/hjm-catalog.snapshot.json',
    canonicalCatalogRelativePath,
    canonicalReleaseRelativePath,
    ...Object.entries(canonicalDocuments)
      .filter(([key]) => key !== 'decisionsDir')
      .map(([, path]) => path),
    `${canonicalDocuments.decisionsDir}/ADR-0000-template.md`,
    'tools/app-standard-core.mjs',
    'tools/runtime-bindings.mjs',
    'tools/check-app-contract.mjs',
    'tools/check-doc-links.mjs',
    'tools/check-design-contract.mjs',
    'tools/json-schema-validator.mjs',
    'tools/qa/README.md',
  ];
  const fileSources = new Map();
  for (const path of requiredFiles) {
    const source = await checkRequiredFile(absoluteRoot, path, findings, {
      allowTemplate: path.endsWith('ADR-0000-template.md'),
    });
    if (source !== null) fileSources.set(path, source);
  }
  const canonicalProjectionSources = standardProjectionSources(contract);
  for (const [path, expectedSource] of canonicalProjectionSources) {
    const actualSource = fileSources.get(path);
    if (actualSource !== undefined && actualSource !== expectedSource) {
      addFinding(findings, 'STANDARD_PROJECTION_DRIFT', path, `${path} bytes differ from the canonical standard projection; run central sync-standard --app-root PATH to review updates, then repeat with --write.`);
    }
  }
  if (bound(contract)) await checkBindings(absoluteRoot, contract, findings, canonicalRelease, { implementationGate });
  else {
    await checkPackageManagerRegistryBoundary(absoluteRoot, contract, findings);
    await checkStaticAnalysisContract(absoluteRoot, contract, implementationGate, findings);
    if (implementationGate) await checkSharedPackageLintConfigs(absoluteRoot, findings);
  }
  for (const runtime of Array.isArray(contract.runtimes) ? contract.runtimes : []) {
    await checkRequiredFile(absoluteRoot, `${runtime.root}/README.md`, findings);
  }
  for (const waiver of Array.isArray(contract.waivers) ? contract.waivers : []) {
    const source = await checkRequiredFile(absoluteRoot, waiver.adrPath, findings);
    validateDeclaredAdr(source, waiver.adrPath, contract, {
      kind: 'waiver',
      ruleId: waiver.ruleId,
      owner: waiver.owner,
      approver: waiver.approver,
      createdAt: waiver.createdAt,
      expiresAt: waiver.expiresAt,
    }, findings, { acceptedRequired: waiver.status === 'approved' });
  }
  for (const adoption of Array.isArray(contract.designSystem?.optionalBetaAdoptions)
    ? contract.designSystem.optionalBetaAdoptions
    : []) {
    const source = await checkRequiredFile(absoluteRoot, adoption.adrPath, findings);
    validateDeclaredAdr(source, adoption.adrPath, contract, {
      kind: 'optional-beta-adoption',
      componentId: adoption.componentId,
      evidenceIds: adoption.evidenceIds,
    }, findings, {
      acceptedRequired: implementationGate,
    });
  }
  for (const [index, evidence] of (Array.isArray(contract.acceptance?.evidence) ? contract.acceptance.evidence : []).entries()) {
    const evidencePath = `contract.acceptance.evidence[${index}].location`;
    if (!validRelativePath(evidence?.location)
      || !evidence.location.startsWith('docs/evidence/')) {
      addFinding(findings, 'EVIDENCE_LOCATION_INVALID', evidencePath, 'Evidence must resolve to a safe repository-local file under docs/evidence/.');
      continue;
    }
    const absoluteEvidencePath = resolve(absoluteRoot, evidence.location);
    if (!isInside(absoluteRoot, absoluteEvidencePath)) {
      addFinding(findings, 'EVIDENCE_PATH_ESCAPE', evidencePath, `Evidence path escapes the app root: ${evidence.location}`);
      continue;
    }
    let record;
    try {
      record = await readEvidenceRecord(absoluteEvidencePath, `Acceptance evidence ${evidence.id}`);
    } catch (error) {
      addFinding(findings, error.code || 'EVIDENCE_FILE_INVALID', evidence.location, error.message);
      continue;
    }
    const evidenceBytes = record.narrativeBytes;
    if (evidence.status === 'verified') {
      const evidenceText = evidenceBytes.toString('utf8');
      const markerByType = {
        'automated-test': /(?:command|test|result|exit code):/i,
        'build-log': /(?:command|build|result|exit code):/i,
        screenshot: /(?:device|viewport|artifact|capture):/i,
        recording: /(?:device|viewport|artifact|capture):/i,
        report: /(?:result|conclusion|report):/i,
        review: /(?:result|conclusion|review):/i,
        'runbook-drill': /(?:result|drill|recovery):/i,
        measurement: /(?:result|measurement|metric):/i,
        decision: /(?:result|decision|outcome):/i,
        'repository-policy': /(?:repository|ruleset|branch protection|central verifier|response digest):/i,
      };
      if (evidenceBytes.length < 128
        || evidence.location.includes('/planned/')
        || /Status:\s*planned|Planned (?:acceptance|HJM app) evidence|\[작성\]|\[verified bytes digest\]/i.test(evidenceText)
        || !markerByType[evidence.type]?.test(evidenceText)) {
        addFinding(findings, 'EVIDENCE_PLACEHOLDER_STALE', evidence.location, `Verified evidence ${evidence.id} must be a nontrivial, type-specific record rather than a generated plan or placeholder.`);
      }
      const expectedDigest = String(evidence.digest || '').replace(/^sha256:/, '');
      if (expectedDigest !== record.digest) {
        addFinding(findings, 'EVIDENCE_DIGEST_MISMATCH', `contract.acceptance.evidence[${index}].digest`, `Verified evidence ${evidence.id} digest does not match the ${record.kind} record at ${evidence.location}${record.kind === 'directory' ? ' (sha256 of the sorted file manifest)' : ''}.`);
      }
    }
  }

  const schemaSource = fileSources.get('docs/app-contract.schema.json');
  if (schemaSource) {
    try {
      const schema = JSON.parse(schemaSource);
      if (schema.$id !== 'hjm.app-contract/1') {
        addFinding(findings, 'APP_SCHEMA_VERSION_MISMATCH', 'docs/app-contract.schema.json', 'App-local schema $id must equal hjm.app-contract/1.');
      }
      findings.push(...validateWithJsonSchema(contract, schema).findings);
    } catch (error) {
      addFinding(findings, 'APP_SCHEMA_JSON_INVALID', 'docs/app-contract.schema.json', `App-local schema is invalid JSON: ${error.message}`);
    }
  }
  const packageSource = fileSources.get('package.json');
  if (packageSource && isPlainObject(contract.toolchain)) {
    try {
      const packageJson = JSON.parse(packageSource);
      if (packageJson.name !== contract.app.id) {
        addFinding(findings, 'PACKAGE_NAME_MISMATCH', 'package.json.name', `package.json name must equal "${contract.app.id}".`);
      }
      if (packageJson.private !== true) {
        addFinding(findings, 'PACKAGE_PRIVATE_REQUIRED', 'package.json.private', 'App workspace package.json must set private to true.');
      }
      const expectedManager = `pnpm@${contract.toolchain.packageManager?.version}`;
      if (packageJson.packageManager !== expectedManager) {
        addFinding(findings, 'PACKAGE_MANAGER_MISMATCH', 'package.json.packageManager', `packageManager must equal "${expectedManager}".`);
      }
      for (const name of allowedScriptNames) {
        if (!Object.hasOwn(contract.toolchain.scripts || {}, name)) continue;
        if (packageJson.scripts?.[name] !== contract.toolchain.scripts?.[name]) {
          addFinding(findings, 'PACKAGE_SCRIPT_MISMATCH', `package.json.scripts.${name}`, `package.json script "${name}" must exactly match app.contract.json.`);
        }
      }
    } catch (error) {
      addFinding(findings, 'PACKAGE_JSON_INVALID', 'package.json', `package.json is invalid JSON: ${error.message}`);
    }
  }
  const nvmrc = fileSources.get('.nvmrc');
  if (nvmrc && nvmrc.trim() !== contract.toolchain?.node) {
    addFinding(findings, 'NODE_VERSION_MISMATCH', '.nvmrc', '.nvmrc must exactly match contract.toolchain.node.');
  }
  const qualityWorkflow = fileSources.get('.github/workflows/quality-gate.yml');
  if (qualityWorkflow && qualityWorkflow !== (bound(contract) ? bindingWorkflow(contract) : makeQualityGateWorkflow(contract))) {
    addFinding(findings, 'QUALITY_WORKFLOW_NONCANONICAL', '.github/workflows/quality-gate.yml', 'Quality workflow must exactly match the generated v1 workflow; comments or alternate no-op steps cannot satisfy this gate.');
  }
  for (const [key, path] of Object.entries(canonicalDocuments)) {
    if (key === 'decisionsDir') continue;
    const source = fileSources.get(path);
    if (!source) continue;
    const expectedDocument = key;
    const metadata = parseSimpleFrontmatter(source, path, findings);
    const expectedMetadata = {
      schema: 'hjm.app-document/1',
      document: expectedDocument,
      app_id: contract.app.id,
      display_name: contract.app.displayName,
      status: contract.governance?.status,
      owner: contract.governance?.owner,
      reviewed: contract.governance?.reviewedAt,
      version: contract.governance?.documentVersion,
    };
    for (const [field, expected] of Object.entries(expectedMetadata)) {
      if (metadata && metadata[field] !== expected) {
        addFinding(findings, 'DOCUMENT_METADATA_MISMATCH', `${path}.${field}`, `${path} frontmatter ${field} must equal ${JSON.stringify(expected)}.`);
      }
    }
    if (!/## \d+\. Acceptance criteria/.test(source)) {
      addFinding(findings, 'DOCUMENT_ACCEPTANCE_MISSING', path, `${path} must retain its Acceptance criteria section.`);
    }
    if (!/## \d+\. Evidence registry/.test(source)) {
      addFinding(findings, 'DOCUMENT_EVIDENCE_MISSING', path, `${path} must retain its Evidence registry section.`);
    }
    const binding = parseDocumentEvidenceBinding(source, path, findings);
    const expectedBinding = documentEvidenceBinding(contract, key);
    if (binding && JSON.stringify(binding) !== JSON.stringify(expectedBinding)) {
      addFinding(findings, 'DOCUMENT_EVIDENCE_BINDING_MISMATCH', path, `${path} evidence registry projection must exactly match the ${key} criteria and evidence in app.contract.json.`);
    }
    if (implementationGate) {
      if (/\[[^\]]*(?:작성|EV-(?:xxx|NNN)|RFC 3339|verified bytes digest)[^\]]*\]/i.test(source)
        || /(?:^|\|)\s*미정\s*[—-]/m.test(source)) {
        addFinding(findings, 'DOCUMENT_PLACEHOLDER_STALE', path, `${path} still contains visible template placeholders or undecided (미정) cells and cannot support an implementation-conformant claim.`);
      }
      const acceptanceSection = source.match(/## \d+\. Acceptance criteria\s*\n([\s\S]*?)(?=\n## \d+\.|\n<!-- hjm-contract-evidence|$)/);
      const evidenceSection = source.match(/## \d+\. Evidence registry\s*\n([\s\S]*?)(?=\n## \d+\.|\n<!-- hjm-contract-evidence|$)/);
      const visibleCriterionIds = acceptanceSection
        ? [...acceptanceSection[1].matchAll(/^\|\s*([A-Z][A-Z0-9-]*-\d{3,})\s*\|/gm)].map((match) => match[1])
        : [];
      const visibleEvidenceIds = evidenceSection
        ? [...evidenceSection[1].matchAll(/^\|\s*(EV-\d{3,})\s*\|/gm)].map((match) => match[1])
        : [];
      const expectedCriterionIds = expectedBinding.criteria.map(({ id }) => id);
      const expectedEvidenceIds = expectedBinding.evidence.map(({ id }) => id);
      if (JSON.stringify(visibleCriterionIds) !== JSON.stringify(expectedCriterionIds)) {
        addFinding(findings, 'DOCUMENT_VISIBLE_CRITERIA_DRIFT', path, `${path} visible acceptance rows must exactly project ${JSON.stringify(expectedCriterionIds)} from app.contract.json.`);
      }
      if (JSON.stringify(visibleEvidenceIds) !== JSON.stringify(expectedEvidenceIds)) {
        addFinding(findings, 'DOCUMENT_VISIBLE_EVIDENCE_DRIFT', path, `${path} visible evidence rows must exactly project ${JSON.stringify(expectedEvidenceIds)} from app.contract.json.`);
      }
      const tableRowsById = (section) => new Map((section?.[1] || '').split(/\r?\n/)
        .filter((line) => /^\|\s*(?:[A-Z][A-Z0-9-]*-\d{3,}|EV-\d{3,})\s*\|/.test(line))
        .map((line) => {
          const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
          return [cells[0], cells];
        }));
      const criterionRows = tableRowsById(acceptanceSection);
      for (const criterion of expectedBinding.criteria) {
        const row = criterionRows.get(criterion.id);
        const rowEvidenceIds = row?.[4]?.match(/EV-\d{3,}/g) || [];
        if (!row
          || row[1] !== criterion.statement
          || row[2] !== criterion.verification
          || row[3] !== criterion.status
          || JSON.stringify(rowEvidenceIds) !== JSON.stringify(criterion.evidenceIds || [])) {
          addFinding(findings, 'DOCUMENT_VISIBLE_CRITERION_CONTENT_DRIFT', path, `${path} visible row ${criterion.id} must match contract statement, verification, passed status, and evidence IDs.`);
        }
      }
      const evidenceRows = tableRowsById(evidenceSection);
      for (const evidence of expectedBinding.evidence) {
        const row = evidenceRows.get(evidence.id);
        const rowCriterionIds = row?.[1]?.match(/[A-Z][A-Z0-9-]*-\d{3,}/g) || [];
        if (!row
          || JSON.stringify(rowCriterionIds) !== JSON.stringify(evidence.criterionIds || [])
          || row[2] !== evidence.type
          || row[3] !== evidence.location
          || !row.includes(evidence.status)
          || !row.includes(evidence.owner)
          || (evidence.capturedAt && !row.includes(evidence.capturedAt))
          || (evidence.digest && !row.includes(evidence.digest))) {
          addFinding(findings, 'DOCUMENT_VISIBLE_EVIDENCE_CONTENT_DRIFT', path, `${path} visible row ${evidence.id} must match contract criteria, type, location, timestamp, digest, status, and owner.`);
        }
      }
    }
  }
  const resolvedTargetStage = implementationGate ? 'implementation-conformant' : 'governance-scaffold';
  const sourceChecker = bound(contract) ? 'tools/check-hjm-source.mjs' : 'tools/check-design-contract.mjs';
  if (implementationGate
    && fileSources.get(sourceChecker) === makeLocalDesignChecker({ runtimeBindings: bound(contract) })) {
    try {
      await execFileAsync(process.execPath, [resolve(absoluteRoot, sourceChecker)], {
        cwd: absoluteRoot,
        maxBuffer: 1_048_576,
        env: { ...process.env, HJM_APP_STANDARD_TARGET_STAGE: resolvedTargetStage },
      });
    } catch (error) {
      const detail = String(error?.stderr || error?.stdout || error?.message || 'design implementation check failed').trim();
      addFinding(findings, 'DESIGN_IMPLEMENTATION_GATE_FAILED', sourceChecker, detail);
    }
  }

  const ok = findings.length === 0;
  const result = {
    ok,
    appRoot: absoluteRoot,
    mode: rehearsal ? 'rehearsal' : 'conformance',
    declaredStage,
    // A rehearsal never grants a stage: the contract still declares draft governance.
    stage: ok && !rehearsal ? resolvedTargetStage : null,
    targetStage: resolvedTargetStage,
    findings,
  };
  if (rehearsal) {
    result.blockedByPortfolioAuthority = findings.filter((item) => portfolioAuthorityFindingCodes.has(item.code));
    result.actionable = findings.filter((item) => !portfolioAuthorityFindingCodes.has(item.code));
    // implementationReady is the honest local claim an incubating app may make while
    // the portfolio bootstrap is unconfigured: everything the app owns already passes.
    result.implementationReady = result.actionable.length === 0;
  }
  return result;
}

function defaultNpmView(spec) {
  return execFileAsync('npm', ['view', spec, 'dist.integrity', 'dist.tarball', '--json', '--registry=https://registry.npmjs.org/'], {
    maxBuffer: 1_048_576,
    env: { ...process.env, NPM_CONFIG_REGISTRY: 'https://registry.npmjs.org/' },
  }).then(({ stdout }) => JSON.parse(stdout));
}

export async function verifyInitializerProvenance({
  profilePath = canonicalProfilePath,
  view = defaultNpmView,
  kinds,
  now = new Date(),
} = {}) {
  const profile = JSON.parse(await readFile(profilePath, 'utf8'));
  const findings = [];
  const checked = [];
  const staleAfterDays = 31;
  const runtimes = (profile.runtimePolicy?.allowed || []).filter((runtime) => !kinds || kinds.includes(runtime.kind));
  const staticAnalysis = profile.toolchain?.staticAnalysis;
  const includeStaticAnalysis = staticAnalysis && (!kinds || kinds.includes('static-analysis'));
  if (runtimes.length === 0 && !includeStaticAnalysis) {
    addFinding(findings, 'INITIALIZER_KIND_UNKNOWN', 'profile.runtimePolicy.allowed', `No profile runtime matches ${JSON.stringify(kinds)}; use mobile, web, server or static-analysis.`);
  }
  if (includeStaticAnalysis) {
    // The lint/format packages share the initializer freshness policy: re-check monthly.
    const staticCheckedAt = new Date(`${staticAnalysis.checkedAt}T00:00:00Z`);
    if (Number.isNaN(staticCheckedAt.getTime()) || (now - staticCheckedAt) / 86_400_000 > staleAfterDays) {
      addFinding(findings, 'INITIALIZER_PROVENANCE_STALE', 'profile.toolchain.staticAnalysis.checkedAt', `Static analysis provenance was last checked ${staticAnalysis.checkedAt}; the profile requires a monthly re-check.`);
    }
    const entries = [...(staticAnalysis.shared || []), ...Object.values(staticAnalysis.presets || {})];
    for (const entry of entries) {
      const spec = `${entry.package}@${entry.version}`;
      const path = `profile.toolchain.staticAnalysis[${entry.package}]`;
      let observed;
      try {
        observed = await view(spec);
      } catch (error) {
        addFinding(findings, 'INITIALIZER_LOOKUP_FAILED', path, `${spec}: ${error.message}`);
        continue;
      }
      const observedIntegrity = observed?.['dist.integrity'] ?? observed?.dist?.integrity ?? observed?.integrity;
      const observedTarball = observed?.['dist.tarball'] ?? observed?.dist?.tarball ?? observed?.tarball;
      checked.push({ kind: 'static-analysis', subject: entry.package, spec, expectedIntegrity: entry.integrity, observedIntegrity, expectedTarballUrl: entry.tarballUrl, observedTarballUrl: observedTarball });
      if (observedIntegrity !== entry.integrity) addFinding(findings, 'INITIALIZER_INTEGRITY_DRIFT', path, `${spec} registry dist.integrity ${JSON.stringify(observedIntegrity)} differs from the pinned ${JSON.stringify(entry.integrity)}.`);
      if (observedTarball !== entry.tarballUrl) addFinding(findings, 'INITIALIZER_TARBALL_DRIFT', path, `${spec} registry dist.tarball ${JSON.stringify(observedTarball)} differs from the pinned ${JSON.stringify(entry.tarballUrl)}.`);
    }
  }
  for (const runtime of runtimes) {
    const initializer = runtime.initializer || {};
    const subjects = [{
      label: 'initializer',
      spec: `${initializer.package}@${initializer.version}`,
      integrity: initializer.integrity,
      tarballUrl: initializer.tarballUrl,
    }];
    if (initializer.templatePackage) {
      subjects.push({
        label: 'template',
        spec: `${initializer.templatePackage}@${initializer.templateVersion}`,
        integrity: initializer.templateIntegrity,
        tarballUrl: initializer.templateTarballUrl,
      });
    }
    const path = `profile.runtimePolicy.allowed[${runtime.kind}].initializer`;
    const checkedAt = new Date(`${initializer.checkedAt}T00:00:00Z`);
    if (Number.isNaN(checkedAt.getTime()) || (now - checkedAt) / 86_400_000 > staleAfterDays) {
      addFinding(findings, 'INITIALIZER_PROVENANCE_STALE', `${path}.checkedAt`, `Initializer provenance for ${runtime.kind} was last checked ${initializer.checkedAt}; the profile requires a monthly re-check.`);
    }
    for (const subject of subjects) {
      let observed;
      try {
        observed = await view(subject.spec);
      } catch (error) {
        addFinding(findings, 'INITIALIZER_LOOKUP_FAILED', `${path}.${subject.label}`, `${subject.spec}: ${error.message}`);
        continue;
      }
      const observedIntegrity = observed?.['dist.integrity'] ?? observed?.dist?.integrity ?? observed?.integrity;
      const observedTarball = observed?.['dist.tarball'] ?? observed?.dist?.tarball ?? observed?.tarball;
      const entry = {
        kind: runtime.kind,
        subject: subject.label,
        spec: subject.spec,
        expectedIntegrity: subject.integrity,
        observedIntegrity,
        expectedTarballUrl: subject.tarballUrl,
        observedTarballUrl: observedTarball,
      };
      checked.push(entry);
      if (observedIntegrity !== subject.integrity) {
        addFinding(findings, 'INITIALIZER_INTEGRITY_DRIFT', `${path}.${subject.label}`, `${subject.spec} registry dist.integrity ${JSON.stringify(observedIntegrity)} differs from the pinned ${JSON.stringify(subject.integrity)}. Stop new-app generation until the standard is revised.`);
      }
      if (observedTarball !== subject.tarballUrl) {
        addFinding(findings, 'INITIALIZER_TARBALL_DRIFT', `${path}.${subject.label}`, `${subject.spec} registry dist.tarball ${JSON.stringify(observedTarball)} differs from the pinned ${JSON.stringify(subject.tarballUrl)}.`);
      }
    }
  }
  return { ok: findings.length === 0, profilePath: resolve(profilePath), checked, findings };
}

export async function checkStandardAssets({ workspaceRoot = defaultWorkspaceRoot } = {}) {
  const root = resolve(workspaceRoot);
  const findings = [];
  const schemaPath = resolve(root, 'docs/app-contract.schema.json');
  const profilePath = resolve(root, 'docs/profiles/portfolio-default-v1.json');
  const catalogPath = resolve(root, canonicalCatalogRelativePath);
  const examplePath = resolve(root, 'docs/examples/app-contract.example.json');
  const jsonFiles = [
    ['schema', schemaPath],
    ['profile', profilePath],
    ['catalog', catalogPath],
    ['designRelease', resolve(root, canonicalReleaseRelativePath)],
    ['example', examplePath],
  ];
  const parsed = {};
  for (const [name, path] of jsonFiles) {
    try {
      parsed[name] = JSON.parse(await readRegularTextFile(path, `Standard ${name}`));
    } catch (error) {
      addFinding(findings, error.code || 'STANDARD_JSON_INVALID', relative(root, path), error.message);
    }
  }
  if (parsed.schema?.$id !== 'hjm.app-contract/1') {
    addFinding(findings, 'STANDARD_SCHEMA_ID_INVALID', 'docs/app-contract.schema.json', 'Schema $id must equal hjm.app-contract/1.');
  }
  if (parsed.schema) findings.push(...auditJsonSchema(parsed.schema).findings);
  try {
    assertDesignReleaseRecord(parsed.designRelease);
    if (JSON.stringify(parsed.designRelease) !== JSON.stringify(canonicalRelease)) {
      throw new Error('Release record differs from the central verifier release record.');
    }
  } catch (error) {
    addFinding(findings, 'STANDARD_DESIGN_RELEASE_INVALID', canonicalReleaseRelativePath, error.message);
  }
  if (parsed.profile?.id !== 'portfolio-default-v1'
    || parsed.profile?.profileVersion !== 1
    || parsed.profile?.standardVersion !== standardVersion) {
    addFinding(findings, 'STANDARD_PROFILE_INVALID', 'docs/profiles/portfolio-default-v1.json', `Profile id/profileVersion/standardVersion must be portfolio-default-v1 / 1 / ${standardVersion}.`);
  }
  const expectedRuntimeProfile = [
    {
      kind: 'mobile', framework: 'expo', frameworkPackage: 'expo', version: '57.0.18',
      sourceUrl: 'https://registry.npmjs.org/expo/latest', checkedAt: '2026-08-31',
      initializer: {
        package: 'create-expo-app', version: '4.0.0',
        sourceUrl: 'https://registry.npmjs.org/create-expo-app/4.0.0',
        tarballUrl: 'https://registry.npmjs.org/create-expo-app/-/create-expo-app-4.0.0.tgz',
        integrity: 'sha512-bZX0CuE6ZdJWKZUtJRnZYt6t1tbU6o/tHjffhZTJnpR2no+GncxQ2Okvc4+AyCBMx4Za2G85szrbAicgo4Qz9w==',
        templatePackage: 'expo-template-default', templateVersion: '57.0.19',
        templateSourceUrl: 'https://registry.npmjs.org/expo-template-default/57.0.19',
        templateTarballUrl: 'https://registry.npmjs.org/expo-template-default/-/expo-template-default-57.0.19.tgz',
        templateIntegrity: 'sha512-tDAkCVZoAXK070ogL39xwwYBjw5ghgDduKhOHdYR69RClzYVqz/V0xILWzRLukkNPKSj2GMU5lD47xQmf08oiw==',
        checkedAt: '2026-08-31',
      },
    },
    {
      kind: 'web', framework: 'nextjs', frameworkPackage: 'next', version: '16.3.3',
      sourceUrl: 'https://nextjs.org/blog/august-2026-security-release', checkedAt: '2026-08-31',
      initializer: {
        package: 'create-next-app', version: '16.3.3',
        sourceUrl: 'https://registry.npmjs.org/create-next-app/16.3.3',
        tarballUrl: 'https://registry.npmjs.org/create-next-app/-/create-next-app-16.3.3.tgz',
        integrity: 'sha512-xpcb/SW/NsOgGoLGiA5Zh5n0Psol4AAtM3TTgyMAX5a3/5jdKKwlLcp8HKVWVv4wo6/Mk0mtfp7tNy3jbv2cmw==',
        checkedAt: '2026-08-31',
      },
    },
    {
      kind: 'server', framework: 'nestjs', frameworkPackage: '@nestjs/core', version: '12.0.1', moduleFormat: 'esm',
      sourceUrl: 'https://registry.npmjs.org/@nestjs%2Fcore/latest', checkedAt: '2026-08-31',
      initializer: {
        package: '@nestjs/cli', version: '12.0.0',
        sourceUrl: 'https://registry.npmjs.org/@nestjs%2Fcli/12.0.0',
        tarballUrl: 'https://registry.npmjs.org/@nestjs/cli/-/cli-12.0.0.tgz',
        integrity: 'sha512-DxgGUKA4gj92lU2lF23Mlvm6y7AQBKEBuanNKNcmHeP6Cn3yqPZxN0LqyaJys25JCqO1bN8KgE3LICrvYlB93g==',
        checkedAt: '2026-08-31',
      },
      serverConformance: {
        packageType: 'module',
        tsconfig: { module: 'NodeNext', moduleResolution: 'NodeNext' },
        lint: {
          package: 'eslint', version: '9.39.5', sourceUrl: 'https://registry.npmjs.org/eslint/9.39.5', checkedAt: '2026-09-04',
          rationale: 'Keep one cross-runtime lint contract instead of accepting the Nest CLI oxlint default; ESLint 9.x because the Expo/Next presets depend on eslint-plugin-react, which does not support ESLint 10 yet.',
        },
        test: { package: 'vitest', version: '4.1.11', sourceUrl: 'https://registry.npmjs.org/vitest/latest', checkedAt: '2026-08-31' },
        e2e: { package: 'supertest', version: '7.2.2', sourceUrl: 'https://registry.npmjs.org/supertest/latest', checkedAt: '2026-08-31' },
      },
    },
  ];
  const expectedRuntimeReview = {
    cadence: 'monthly-and-immediate-on-critical-security-advisory',
    knownVulnerableAction: 'block-new-app-generation-until-profile-and-standard-update',
  };
  if (JSON.stringify(parsed.profile?.runtimePolicy?.allowed) !== JSON.stringify(expectedRuntimeProfile)
    || JSON.stringify(parsed.profile?.runtimePolicy?.reviewPolicy) !== JSON.stringify(expectedRuntimeReview)) {
    addFinding(findings, 'STANDARD_RUNTIME_PROFILE_INVALID', 'docs/profiles/portfolio-default-v1.json.runtimePolicy', 'Runtime trains, initializer provenance, review cadence, and vulnerable-train stop policy must match the reviewed v1 profile.');
  }
  if (parsed.profile?.toolchain?.packageManager !== 'pnpm'
    || parsed.profile?.toolchain?.packageManagerVersion !== '11.24.0'
    || parsed.profile?.toolchain?.nodeVersion !== '24.20.0'
    || parsed.profile?.toolchain?.sourceProvenance?.packageManager?.sourceUrl !== 'https://registry.npmjs.org/pnpm/latest'
    || parsed.profile?.toolchain?.sourceProvenance?.packageManager?.checkedAt !== '2026-08-31'
    || parsed.profile?.toolchain?.sourceProvenance?.node?.sourceUrl !== 'https://nodejs.org/dist/latest-v24.x/'
    || parsed.profile?.toolchain?.sourceProvenance?.node?.checkedAt !== '2026-08-31') {
    addFinding(findings, 'STANDARD_TOOLCHAIN_PROFILE_INVALID', 'docs/profiles/portfolio-default-v1.json.toolchain', 'Toolchain train and official-source provenance must pin Node 24.20.0 and pnpm 11.24.0.');
  }
  const expectedActionsPolicy = {
    checkout: {
      version: '6.0.2',
      sha: 'de0fac2e4500dabe0009e67214ff5f5447ce83dd',
      persistCredentials: false,
    },
    setupNode: {
      version: '7.0.0',
      sha: '820762786026740c76f36085b0efc47a31fe5020',
    },
    updatePolicy: {
      cadence: 'monthly-and-immediate-on-critical-security-advisory',
      automation: 'dependabot-or-renovate',
      organizationPolicy: 'full-length-sha-only',
    },
  };
  const expectedTrustModel = {
    bootstrapStatus: 'unconfigured-no-merge-eligibility',
    centralVerifierRepository: null,
    codeownerTeam: null,
    centralVerifierWorkflowPath: '.github/workflows/app-standard-required.yml',
    requiredCheck: 'app-standard-required',
    centralVerifierExecution: 'organization-ruleset-pull-request-and-merge-group-three-fresh-hosted-jobs',
    bootstrapApprovedCommit: '0000000000000000000000000000000000000000',
    requiredCentralSteps: [
      'trusted-static-precheck-fresh-runner',
      'isolated-untrusted-registry-check-corepack-enable-frozen-install-canonical-pnpm-check',
      'trusted-final-static-recheck-fresh-runner',
      'event-head-and-approved-standard-sha-reverified-in-each-trusted-job',
    ],
    untrustedQualityIsolation: {
      separateHostedRunner: true,
      sharesWorkspaceOrArtifactsWithTrustedJobs: false,
      trustedFinalJobExecutesAppCode: false,
    },
    publicationPrerequisites: [
      'approve-an-actual-organization-required-workflow-or-verified-github-app-authority-in-a-profile-revision',
      'publish-central-authority-and-record-the-real-repository',
      'create-or-transfer-app-repository-into-the-approved-ownership-boundary',
      'grant-the-recorded-codeowner-team-visible-write-access-when-using-an-organization-ruleset',
      'install-and-verify-the-approved-external-required-gate',
      'revise-profile-with-reviewed-nonzero-verifier-commit',
    ],
    localWorkflowRole: 'feedback-and-accidental-drift-detection-only',
    authoritativeMergeGate: 'external-required-workflow-at-immutable-commit',
    eligibilitySource: 'central-verifier-only',
    unverifiedExternalSettingsAction: 'not-merge-eligible',
    requiredGeneratedFiles: ['.github/CODEOWNERS', '.github/dependabot.yml', '.npmrc'],
    registryPolicy: {
      canonicalConfigPath: '.npmrc',
      defaultRegistry: 'https://registry.npmjs.org/',
      hjmScopeRegistry: 'https://registry.npmjs.org/',
      nestedConfigsForbidden: true,
      centralUserConfigRequired: true,
    },
    protectedPathsSource: 'governance.mergePolicy.protectedPaths',
    runtimeManifestProtection: 'each-declared-runtime-root/package.json',
    workspaceManifestProtectionRequired: true,
    sharedPackageManifestProtection: 'packages/**/package.json',
    repositoryPolicyEvidenceRequiredBeforeActive: true,
    repositoryPolicyLiveVerification: {
      performedBy: 'configured-external-authority',
      repositoryOwnedEvidenceIsNotAuthority: true,
      requiredComparisons: [
        'repository-and-head-sha',
        'ruleset-or-branch-protection-no-bypass-state',
        'codeowner-team-write-access-and-visibility',
        'required-workflow-source-and-approved-ref',
        'required-check-result',
        'live-api-response-digest-vs-evidence',
      ],
    },
  };
  if (JSON.stringify(parsed.profile?.ci?.actions) !== JSON.stringify(expectedActionsPolicy)
    || JSON.stringify(parsed.profile?.ci?.trustModel) !== JSON.stringify(expectedTrustModel)) {
    addFinding(findings, 'STANDARD_CI_TRUST_PROFILE_INVALID', 'docs/profiles/portfolio-default-v1.json.ci', 'CI action SHA pins, credential policy, updater, central verifier bootstrap status, protected paths, and fail-closed merge authority must match the reviewed v1 trust model.');
  }
  if (JSON.stringify(parsed.profile?.toolchain?.staticAnalysis) !== JSON.stringify(staticAnalysisPolicy)) {
    addFinding(findings, 'STANDARD_STATIC_ANALYSIS_PROFILE_INVALID', 'docs/profiles/portfolio-default-v1.json.toolchain.staticAnalysis', 'The lint/format contract (ESLint, typescript-eslint, Prettier, eslint-config-prettier, runtime presets, canonical files) must match the reviewed v1 policy byte-for-byte.');
  }
  const expectedAcceptancePolicy = {
    requiredCategories: ['product', 'architecture', 'design', 'i18n', 'security', 'quality', 'release'],
    passedRequiresEvidence: true,
    activeRequiresPassedEvidencePerCategory: true,
    waiversDoNotSatisfyAcceptance: true,
    verifiedEvidenceRequiresCapturedAt: true,
    verifiedEvidenceRequiresDigest: true,
    verifiedEvidenceRequiresNonPlaceholderTypeRecord: true,
    evidenceLocations: 'repository-local records under docs/evidence/: one regular file, or one directory whose index.md is the narrative and whose digest is the sorted sha256 manifest of every file',
    crossReferencesMustResolve: true,
    evidenceTrustBoundary: {
      repositoryDigestProves: 'byte-integrity-only',
      doesNotProve: 'factual-authenticity-of-the-observation',
      activeVerifiedRequires: [
        'subject-head-or-artifact-digest',
        'producer-or-verification-authority',
        'human-approval-or-external-attestation-when-applicable',
      ],
      repositoryPolicyLiveReverifiedByCentralGate: true,
    },
  };
  if (JSON.stringify(parsed.profile?.acceptance) !== JSON.stringify(expectedAcceptancePolicy)) {
    addFinding(findings, 'STANDARD_ACCEPTANCE_PROFILE_INVALID', 'docs/profiles/portfolio-default-v1.json.acceptance', 'Acceptance status, non-placeholder evidence, repository-local byte integrity, and external truth-verification boundaries must match the reviewed v1 policy.');
  }
  try {
    const profileSource = await readRegularTextFile(profilePath, 'Standard profile');
    const profileDigest = createHash('sha256').update(profileSource).digest('hex');
    if (profileDigest !== canonicalProfileSha256) {
      addFinding(findings, 'STANDARD_PROFILE_DIGEST_MISMATCH', 'docs/profiles/portfolio-default-v1.json', `Profile bytes must match the HJM-APP-STANDARD ${standardVersion} digest ${canonicalProfileSha256}.`);
    }
  } catch {
    // The parse/read finding above already identifies the missing or invalid profile.
  }
  if (parsed.catalog) {
    const componentIds = new Set();
    const allowedMaturities = new Set(['stable', 'beta', 'planned', 'deprecated']);
    if (parsed.catalog.$id !== `hjm.catalog-snapshot/${canonicalDesignVersion}`
      || parsed.catalog.designSystemVersion !== canonicalDesignVersion
      || JSON.stringify(parsed.catalog.source) !== JSON.stringify(canonicalRelease.source)) {
      addFinding(findings, 'STANDARD_CATALOG_PROVENANCE_INVALID', canonicalCatalogRelativePath, 'Catalog provenance must match the pinned HJM release record.');
    }
    for (const [index, component] of (Array.isArray(parsed.catalog.components) ? parsed.catalog.components : []).entries()) {
      if (!isPlainObject(component)
        || Object.keys(component).some((key) => !['id', 'status'].includes(key))
        || typeof component.id !== 'string'
        || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(component.id)
        || !allowedMaturities.has(component.status)
        || componentIds.has(component.id)) {
        addFinding(findings, 'STANDARD_CATALOG_COMPONENT_INVALID', `${canonicalCatalogRelativePath}.components[${index}]`, 'Catalog entries must be unique lowercase-kebab IDs with a recognized maturity.');
      }
      componentIds.add(component?.id);
    }
    try {
      const catalogSource = await readRegularTextFile(catalogPath, 'Standard catalog snapshot');
      if (createHash('sha256').update(catalogSource).digest('hex') !== expectedCatalogSha256) {
        addFinding(findings, 'STANDARD_CATALOG_DIGEST_INVALID', canonicalCatalogRelativePath, `Catalog snapshot must match pinned SHA-256 ${expectedCatalogSha256}.`);
      }
    } catch {
      // The parse/read finding above already identifies the missing catalog.
    }
  }
  if (parsed.profile?.designSystem?.versionPolicy !== 'exact-and-aligned'
    || parsed.profile?.designSystem?.adoptionPolicy !== 'stable-default'
    || !Array.isArray(parsed.profile?.designSystem?.forbiddenNewMaturities)
    || !parsed.profile.designSystem.forbiddenNewMaturities.includes('planned')
    || !parsed.profile.designSystem.forbiddenNewMaturities.includes('deprecated')) {
    addFinding(findings, 'STANDARD_DESIGN_POLICY_INVALID', 'docs/profiles/portfolio-default-v1.json', 'Profile must encode exact-and-aligned versions, stable-default adoption, and prohibit planned/deprecated new use.');
  }
  if (parsed.profile?.designSystem?.catalog?.releaseSource !== canonicalReleaseRelativePath
    || parsed.profile?.designSystem?.catalog?.snapshotSource !== canonicalCatalogRelativePath
    || parsed.designRelease?.catalog?.sha256 !== expectedCatalogSha256
    || parsed.example?.designSystem?.catalog?.sha256 !== expectedCatalogSha256
    || canonicalCatalogSha256 !== expectedCatalogSha256) {
    addFinding(findings, 'STANDARD_CATALOG_PROJECTION_MISMATCH', 'docs/profiles/portfolio-default-v1.json', 'Profile release reference, example contract, release record and catalog bytes must agree.');
  }
  if (parsed.example && parsed.schema) {
    findings.push(...validateWithJsonSchema(parsed.example, parsed.schema).findings);
    findings.push(...validateAppContract(parsed.example).findings);
  }

  const templateNames = ['PRODUCT.md', 'ARCHITECTURE.md', 'DESIGN.md', 'RELEASE.md', 'ADR.md'];
  for (const name of templateNames) {
    const path = resolve(root, 'docs/templates', name);
    try {
      const source = await readRegularTextFile(path, `Standard template ${name}`);
      for (const placeholder of ['APP_ID', 'DISPLAY_NAME', 'OWNER', 'STANDARD_VERSION', 'REVIEW_DATE']) {
        if (!source.includes(`{{${placeholder}}}`)) {
          addFinding(findings, 'TEMPLATE_PLACEHOLDER_MISSING', `docs/templates/${name}`, `${name} must include {{${placeholder}}}.`);
        }
      }
      if (!source.includes('schema: hjm.app-document/1')) {
        addFinding(findings, 'TEMPLATE_METADATA_MISSING', `docs/templates/${name}`, `${name} must declare hjm.app-document/1 frontmatter.`);
      }
      if (!source.includes('Acceptance criteria') || !source.includes('Evidence registry')) {
        addFinding(findings, 'TEMPLATE_EVIDENCE_SECTIONS_MISSING', `docs/templates/${name}`, `${name} must retain Acceptance criteria and Evidence registry sections.`);
      }
    } catch (error) {
      addFinding(findings, error.code || 'TEMPLATE_INVALID', `docs/templates/${name}`, error.message);
    }
  }
  try {
    const metaWorkflow = await readRegularTextFile(resolve(root, '.github/workflows/portfolio-meta.yml'), 'Root metadata workflow');
    const centralWorkflow = await readRegularTextFile(resolve(root, '.github/workflows/app-standard-required.yml'), 'Central verifier bootstrap workflow');
    const dependabot = await readRegularTextFile(resolve(root, '.github/dependabot.yml'), 'Root Dependabot policy');
    for (const [path, source] of [
      ['.github/workflows/portfolio-meta.yml', metaWorkflow],
      ['.github/workflows/app-standard-required.yml', centralWorkflow],
    ]) {
      if (!source.includes('actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2')
        || !source.includes('persist-credentials: false')
        || !source.includes('actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0')) {
        addFinding(findings, 'STANDARD_ACTION_PIN_INVALID', path, 'Root workflows must pin checkout/setup-node by reviewed full SHA and disable checkout credential persistence.');
      }
    }
    if (!centralWorkflow.includes('pull_request:')
      || !centralWorkflow.includes('merge_group:')
      || !centralWorkflow.includes('workflow_call:')
      || !centralWorkflow.includes('app-standard-required:')
      || !centralWorkflow.includes('APPROVED_STANDARD_COMMIT: "0000000000000000000000000000000000000000"')
      || !centralWorkflow.includes('verify-central-pin.mjs')
      || !centralWorkflow.includes('pnpm install --frozen-lockfile')
      || !centralWorkflow.includes('run: pnpm check')
      || centralWorkflow.match(/node standard\/scripts\/app-standard\.mjs check-app --app-root app/g)?.length !== 2
      || !centralWorkflow.includes('git -C app diff --exit-code HEAD -- .')) {
      addFinding(findings, 'CENTRAL_VERIFIER_BOOTSTRAP_INVALID', '.github/workflows/app-standard-required.yml', 'The bootstrap source must expose pull_request/merge_group ruleset events, fail closed on the unpublished commit, compare the approved immutable validator commit, install frozen dependencies, and execute the canonical quality graph inside the single required job.');
    }
    if (!dependabot.includes('package-ecosystem: github-actions') || !dependabot.includes('interval: monthly')) {
      addFinding(findings, 'STANDARD_ACTION_UPDATE_POLICY_INVALID', '.github/dependabot.yml', 'GitHub Action pins require monthly Dependabot or an equivalent managed updater.');
    }
  } catch (error) {
    addFinding(findings, error.code || 'STANDARD_CI_ASSET_INVALID', '.github', error.message);
  }
  return { ok: findings.length === 0, findings };
}

function parseArguments(argv) {
  const options = {
    command: null,
    json: false,
    write: false,
    contractPath: null,
    workspaceRoot: defaultWorkspaceRoot,
    appRoot: null,
  };
  const commands = new Set(['validate-contract', 'create', 'check-app', 'check-doc-links', 'check-standard-assets', 'verify-initializers', 'sync-docs', 'sync-standard', 'digest-evidence']);
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (commands.has(argument)) {
      if (options.command) throw new Error(`Only one command may be specified; received ${options.command} and ${argument}.`);
      options.command = argument;
    } else if (argument === '--json') {
      options.json = true;
    } else if (argument === '--write') {
      options.write = true;
    } else if (argument === '--contract') {
      options.contractPath = argv[index + 1];
      index += 1;
    } else if (argument === '--workspace-root') {
      options.workspaceRoot = argv[index + 1];
      index += 1;
    } else if (argument === '--app-root') {
      options.appRoot = argv[index + 1];
      index += 1;
    } else if (argument === '--target-stage') {
      options.targetStage = argv[index + 1];
      index += 1;
      if (!conformanceStages.includes(options.targetStage)) {
        throw new Error(`--target-stage must be one of ${conformanceStages.join(', ')}.`);
      }
    } else if (argument === '--evidence') {
      options.evidenceId = argv[index + 1];
      index += 1;
      if (!/^EV-\d{3,}$/.test(options.evidenceId || '')) throw new Error('--evidence requires an ID such as EV-003.');
    } else if (argument === '--kind') {
      options.kinds = (argv[index + 1] || '').split(',').map((kind) => kind.trim()).filter(Boolean);
      index += 1;
      if (options.kinds.length === 0) throw new Error('--kind requires a comma-separated list such as mobile,web,server.');
    } else if (argument === '--help' || argument === '-h') {
      options.command = 'help';
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  if (!options.workspaceRoot) throw new Error('--workspace-root requires a path.');
  return options;
}

function publicPlan(plan) {
  const result = { ...plan };
  delete result._files;
  delete result._workspaceRoot;
  delete result._appsRoot;
  return result;
}

export async function execute(argv) {
  let options;
  try {
    options = parseArguments(argv);
  } catch (error) {
    return {
      exitCode: 2,
      json: argv.includes('--json'),
      result: { ok: false, findings: [finding('ARGUMENT_INVALID', 'arguments', error.message)], usage },
    };
  }
  if (!options.command || options.command === 'help') {
    return { exitCode: options.command === 'help' ? 0 : 2, json: options.json, result: { ok: options.command === 'help', findings: [], usage } };
  }

  try {
    let result;
    if (options.command === 'validate-contract') {
      if (!options.contractPath) throw Object.assign(new Error('validate-contract requires --contract PATH.'), { code: 'CONTRACT_ARGUMENT_REQUIRED' });
      const { contract, contractPath } = await loadAppContract(options.contractPath);
      result = { ...await validateAgainstCanonicalStandard(contract), contractPath };
    } else if (options.command === 'create') {
      if (!options.contractPath) throw Object.assign(new Error('create requires --contract PATH.'), { code: 'CONTRACT_ARGUMENT_REQUIRED' });
      const { contract, contractPath } = await loadAppContract(options.contractPath);
      const plan = await planAppScaffold(contract, { workspaceRoot: options.workspaceRoot });
      result = options.write ? await writeScaffold(plan) : publicPlan(plan);
      result.contractPath = contractPath;
    } else if (options.command === 'check-app') {
      if (!options.appRoot) throw Object.assign(new Error('check-app requires --app-root PATH.'), { code: 'APP_ROOT_ARGUMENT_REQUIRED' });
      result = await checkAppConformance(options.appRoot, { targetStage: options.targetStage });
    } else if (options.command === 'check-doc-links') {
      result = await checkDocLinks({ rootPath: options.workspaceRoot });
    } else if (options.command === 'verify-initializers') {
      result = await verifyInitializerProvenance({ kinds: options.kinds });
    } else if (options.command === 'sync-standard') {
      if (!options.appRoot) throw Object.assign(new Error('sync-standard requires --app-root PATH.'), { code: 'APP_ROOT_ARGUMENT_REQUIRED' });
      result = await syncStandardProjections(options.appRoot, { write: options.write });
    } else if (options.command === 'sync-docs') {
      if (!options.appRoot) throw Object.assign(new Error('sync-docs requires --app-root PATH.'), { code: 'APP_ROOT_ARGUMENT_REQUIRED' });
      result = await syncDocumentProjections(options.appRoot, { write: options.write });
    } else if (options.command === 'digest-evidence') {
      if (!options.appRoot) throw Object.assign(new Error('digest-evidence requires --app-root PATH.'), { code: 'APP_ROOT_ARGUMENT_REQUIRED' });
      result = await digestEvidence(options.appRoot, { evidenceId: options.evidenceId });
    } else {
      result = await checkStandardAssets({ workspaceRoot: options.workspaceRoot });
    }
    return { exitCode: result.ok ? 0 : 1, json: options.json, result };
  } catch (error) {
    return {
      exitCode: 1,
      json: options.json,
      result: { ok: false, findings: [finding(error.code || 'EXECUTION_FAILED', 'execution', error.message)] },
    };
  }
}

function writeHumanResult(result) {
  if (result.usage) process.stdout.write(`${result.usage}\n`);
  if (result.ok && !result.usage) {
    if (result.standardUpdates !== undefined) {
      process.stdout.write(`standard projection ${result.action}: ${result.standardUpdates.length} file(s)\n`);
      for (const file of result.standardUpdates) process.stdout.write(`  ~ ${file.path} ${file.beforeSha256} -> ${file.afterSha256}\n`);
    } else if (result.documents !== undefined) {
      const changed = result.documents.filter((document) => document.changed);
      process.stdout.write(`document projection ${result.action}: ${changed.length} document(s) ${result.action === 'write' ? 'rewritten' : 'would change'}\n`);
      for (const document of result.documents) {
        process.stdout.write(`  ${document.changed ? '~' : '='} ${document.path}${document.addedRows.length ? ` +${document.addedRows.join(',')}` : ''}${document.removedRows.length ? ` -${document.removedRows.join(',')}` : ''}\n`);
      }
      if (result.documentOnlyRows.length > 0) {
        process.stdout.write('  rows that exist only in documents (add them to app.contract.json before syncing, or they are dropped):\n');
        for (const row of result.documentOnlyRows) process.stdout.write(`    ! ${row}\n`);
      }
    } else if (result.records !== undefined) {
      process.stdout.write(`evidence digests: ${result.records.length} record(s)\n`);
      for (const record of result.records) {
        process.stdout.write(`  ${record.id} ${record.kind}${record.kind === 'directory' ? `(${record.files} files)` : ''} ${record.digest}${record.matchesRecorded === null ? '' : record.matchesRecorded ? ' = contract' : ` ≠ contract ${record.recordedDigest}`}\n    ${record.location}\n`);
      }
    } else if (result.action === 'dry-run') {
      process.stdout.write(`app scaffold dry-run: ready\n  target: ${result.targetPath}\n  planSha256: ${result.planSha256}\n`);
      for (const file of result.files) process.stdout.write(`  + ${file}\n`);
    } else if (result.action === 'write') {
      process.stdout.write(`app scaffold write: ready\n  target: ${result.targetPath}\n  planSha256: ${result.planSha256}\n`);
    } else if (result.filesChecked !== undefined) {
      process.stdout.write(`documentation links: ready (${result.filesChecked} Markdown files)\n`);
    } else if (result.checked !== undefined) {
      process.stdout.write(`initializer provenance: ready (${result.checked.length} registry subject(s) match the profile)\n`);
    } else if (result.mode === 'rehearsal') {
      process.stdout.write(`app standard rehearsal (${result.targetStage}): no findings; declared stage stays ${result.declaredStage} until lifecycle/governance become active\n`);
    } else {
      process.stdout.write(`app standard: ready${result.stage ? ` (${result.stage})` : ''}\n`);
    }
  }
  if (!result.ok && result.mode === 'rehearsal') {
    process.stderr.write(`app standard rehearsal (${result.targetStage}): ${result.actionable.length} actionable, ${result.blockedByPortfolioAuthority.length} blocked by portfolio authority; implementationReady=${result.implementationReady}\n`);
    for (const item of result.actionable) {
      process.stderr.write(`  - [${item.code}] ${item.path}: ${item.message}\n`);
    }
    for (const item of result.blockedByPortfolioAuthority) {
      process.stderr.write(`  ~ [${item.code}] ${item.path}: blocked until the portfolio bootstrap is configured\n`);
    }
  } else if (!result.ok) {
    process.stderr.write(`app standard: ${result.findings?.length || 0} finding(s)\n`);
    for (const item of result.findings || []) {
      process.stderr.write(`  - [${item.code}] ${item.path}: ${item.message}\n`);
    }
  }
}

async function main() {
  const execution = await execute(process.argv.slice(2));
  if (execution.json) process.stdout.write(`${JSON.stringify(execution.result, null, 2)}\n`);
  else writeHumanResult(execution.result);
  process.exitCode = execution.exitCode;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
