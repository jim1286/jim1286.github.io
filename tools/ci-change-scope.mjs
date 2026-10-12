#!/usr/bin/env node
/**
 * 품질 게이트의 무거운 검사(타입체크·테스트·빌드)를 이번 커밋에서 돌려야 하는지 정한다.
 *
 * 왜 있는가(2026-09-30 게이트 전수 조사): 모든 게이트가 push마다 전부 돌았다. 다에리는 그날 게이트 6번 중 4번이
 * 제품 코드가 없는 커밋(버전 올림·릴리스 문서)이었는데 매번 20분을 썼고, 그 사이 VM 디스크가 차서 게이트가 ENOSPC로
 * 죽기도 했다. 허브는 릴리스 전에 "바로 그 커밋의 게이트 통과"를 요구하므로 게이트를 끌 수는 없고, 무거운 step만
 * 건너뛴 채 성공으로 끝내야 한다.
 *
 * 규칙은 좁게 둔다. 허용 목록에 든 변경만 건너뛰고, 모르는 것·판정 실패는 전부 돌린다(fail-closed):
 *   - `*.md` 파일(문서·릴리스 기록)
 *   - package.json의 version, pubspec.yaml의 version 한 줄
 *   - `app.json`에서 `expo.version` 한 값만 바뀐 경우(버전 올림). 다른 값이 바뀌었는지는 JSON 비교로 확인한다.
 * `docs/`의 JSON(계약 스키마·HJM 카탈로그)은 넣지 않았다 — 계약·디자인 검사가 읽는 입력이다. 테스트·설정·workflow·
 * lockfile도 넣지 않았다: 코드는 그대로여도 검사가 깨졌는지는 확인해야 한다.
 *
 * 비교 기준은 직전 커밋이 아니라 **이 workflow가 성공한 가장 가까운 first-parent 조상**이다. 직전 커밋만 보면
 * 코드 커밋 바로 뒤의 문서 커밋이 그 코드 변경을 가린다(다에리 배포 범위 검사가 2026-09-13에 같은 함정을 겪었다).
 * 기준 run이 이 규칙으로 건너뛴 run이어도 허용 목록 변경끼리는 합쳐도 허용 목록이라 전이적으로 안전하다.
 */
import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const MAX_ANCESTORS = 50;

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  return value;
}

/** `expo.version`만 다르면 true. 파싱 실패나 expo 설정이 아닌 app.json은 false(=돌린다). */
export function onlyExpoVersionChanged(before, after) {
  let a;
  let b;
  try {
    a = JSON.parse(before);
    b = JSON.parse(after);
  } catch {
    return false;
  }
  if (!a?.expo || !b?.expo || typeof b.expo.version !== 'string') return false;
  delete a.expo.version;
  delete b.expo.version;
  return JSON.stringify(stable(a)) === JSON.stringify(stable(b));
}

// Release metadata does not change tested behavior. Compare the entire manifest
// with only its version removed; dependencies/scripts/name changes still run.
export function onlyPackageVersionChanged(before, after) {
  try {
    const a = JSON.parse(before), b = JSON.parse(after);
    if (typeof a.version !== 'string' || typeof b.version !== 'string') return false;
    delete a.version; delete b.version;
    return JSON.stringify(stable(a)) === JSON.stringify(stable(b));
  } catch { return false; }
}
export function onlyFlutterVersionChanged(before, after) {
  const version = /^version: [0-9]+\.[0-9]+\.[0-9]+(?:\+[0-9]+)?\s*$/m;
  return version.test(before) && version.test(after) && before.replace(version, 'version:') === after.replace(version, 'version:');
}

// Only paths inside one declared runtime are narrow. Shared packages, lockfiles,
// tools and unknown paths fan out to every consumer instead of guessing imports.
export function affectedRuntimes(changes, contract, readBoth) {
  const runtimes = contract.runtimes ?? [];
  const id = r => r.id ?? r.kind;
  const all = runtimes.map(id);
  const selected = new Set();
  for (const change of changes) {
    if (!classifyChanges([change], readBoth).heavy) continue;
    const owners = runtimes.filter(r => r.root !== '.' && change.path.startsWith(r.root + '/'));
    if (owners.length !== 1) return all;
    selected.add(id(owners[0]));
  }
  return all.filter(value => selected.has(value));
}

export function runtimeCheckCommand(contract, ids, script, manifest) {
  if (!['typecheck', 'test', 'build'].includes(script)) throw new Error('Unknown runtime check');
  if (!ids.length) return ['pnpm', '--recursive', script];
  const runtimes = contract.runtimes ?? [];
  if (ids.some(id => !runtimes.some(r => (r.id ?? r.kind) === id))) throw new Error('Unknown scoped runtime');
  const filters = ids.flatMap(id => {
    const runtime = runtimes.find(r => (r.id ?? r.kind) === id);
    const name = manifest(runtime).name;
    if (typeof name !== 'string' || !/^[@a-z0-9][@a-zA-Z0-9/._-]*$/.test(name)) throw new Error('Invalid runtime package name');
    // Include the workspace dependency closure so shared contract checks survive.
    return ['--filter', name + '...'];
  });
  return ['pnpm', ...filters, script];
}

/**
 * @param {Array<{status: string, path: string}>} changes `git diff --name-status`를 푼 결과
 * @param {(path: string) => {before: string, after: string}} readBoth 기준·현재 커밋의 파일 내용
 * @returns {{heavy: boolean, reason: string}}
 */
export function classifyChanges(changes, readBoth) {
  if (changes.length === 0) return { heavy: true, reason: 'no changed files against the base (unexpected); running everything' };
  for (const { status, path } of changes) {
    if (path.endsWith('.md')) continue;
    if (/(^|\/)package\.json$/.test(path) && status === 'M') {
      const { before, after } = readBoth(path);
      if (onlyPackageVersionChanged(before, after)) continue;
    }
    if (/(^|\/)pubspec\.yaml$/.test(path) && status === 'M') {
      const { before, after } = readBoth(path);
      if (onlyFlutterVersionChanged(before, after)) continue;
    }
    if (/(^|\/)app\.json$/.test(path) && status === 'M') {
      const { before, after } = readBoth(path);
      if (onlyExpoVersionChanged(before, after)) continue;
      return { heavy: true, reason: `${path} changes more than expo.version` };
    }
    return { heavy: true, reason: `${path} is not a docs-only or version-only change` };
  }
  return { heavy: false, reason: `only documentation and release versions changed (${changes.length} files)` };
}

const git = (args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();

export function hasExecutedTypecheck(jobs) {
  return jobs.some(job => job.conclusion === 'success' && (job.steps ?? []).some(step =>
    step.conclusion === 'success' && ['Typecheck', 'Changed runtime typecheck (manual dispatch includes regression)'].includes(step.name)));
}

async function findPassedAncestor({ repository, workflowFile, token }) {
  const ancestors = git(['rev-list', '--first-parent', `--max-count=${MAX_ANCESTORS}`, 'HEAD~1']).split('\n').filter(Boolean);
  // One bounded listing plus one evidence lookup replaces up to 50 serial
  // network calls. Unknown or skipped history falls back to current typechecks.
  const url = `https://api.github.com/repos/${repository}/actions/workflows/${encodeURIComponent(workflowFile)}/runs?status=success&per_page=100`;
  const response = await fetch(url, { headers: { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`GitHub API ${response.status} listing ${workflowFile} runs`);
  const body = await response.json();
  const passed = new Set((body.workflow_runs ?? []).filter(run => run.event === 'push').map(run => run.head_sha));
  const closest = ancestors.find(sha => passed.has(sha));
  if (closest) {
    const run = (body.workflow_runs ?? []).find(run => run.head_sha === closest && run.event === 'push');
    // A green admission-only run has not checked its source. Treating that as a
    // baseline made a following version-only push skip newly changed code.
    const jobs = await fetch(`https://api.github.com/repos/${repository}/actions/runs/${run.id}/jobs?per_page=100`, {
      headers: { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(30000),
    });
    if (!jobs.ok) throw new Error(`GitHub API ${jobs.status} reading baseline jobs`);
    if (hasExecutedTypecheck((await jobs.json()).jobs ?? [])) return closest;
  }
  return null;
}

export async function decideScope(env = process.env) {
  // The Oct 12 CI minimization request allows unchanged behavior to carry over
  // from a successful first-parent gate; dispatch/unknown history still runs all.
  if (env.GITHUB_EVENT_NAME !== 'push') return { heavy: true, reason: `event ${env.GITHUB_EVENT_NAME ?? 'unknown'} always runs everything` };
  const workflowFile = (env.GITHUB_WORKFLOW_REF ?? '').match(/\.github\/workflows\/([^@]+)@/)?.[1];
  if (!workflowFile || !env.GITHUB_REPOSITORY || !env.GITHUB_TOKEN) return { heavy: true, reason: 'missing workflow identity or token' };
  const base = await findPassedAncestor({ repository: env.GITHUB_REPOSITORY, workflowFile, token: env.GITHUB_TOKEN });
  if (!base) return { heavy: true, reason: `no passing ${workflowFile} run among the last ${MAX_ANCESTORS} first-parent ancestors` };
  const changes = git(['diff', '--name-status', '--no-renames', base, 'HEAD'])
    .split('\n').filter(Boolean)
    .map((line) => { const [status, path] = line.split('\t'); return { status: status[0], path }; });
  const readBoth = (path) => ({ before: git(['show', `${base}:${path}`]), after: git(['show', `HEAD:${path}`]) });
  const result = classifyChanges(changes, readBoth);
  const contract = JSON.parse(readFileSync('app.contract.json', 'utf8'));
  return { ...result, runtimeIds: affectedRuntimes(changes, contract, readBoth), reason: `${result.reason}; base ${base.slice(0, 12)}` };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv[2] === '--run') {
    const contract = JSON.parse(readFileSync('app.contract.json', 'utf8'));
    const ids = (process.env.CI_RUNTIME_IDS ?? '').split(',').filter(Boolean);
    const [command, ...args] = runtimeCheckCommand(contract, ids, process.argv[3], runtime => JSON.parse(readFileSync(resolve(runtime.root, 'package.json'), 'utf8')));
    execFileSync(command, args, { stdio: 'inherit' });
  } else {
    let result;
    try {
      result = await decideScope();
    } catch (error) {
      // 판정 실패는 "돌린다"다. 건너뛰는 쪽으로 틀리면 검사 안 된 코드가 통과한다.
      result = { heavy: true, reason: `scope check failed (${error.message}); running everything` };
    }
    console.log(`change scope: heavy=${result.heavy} — ${result.reason}`);
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `heavy=${result.heavy}\nruntimes=${(result.runtimeIds ?? []).join(',')}\n`);
    if (process.env.GITHUB_STEP_SUMMARY && !result.heavy)
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, `Heavy checks skipped: ${result.reason}. The passing base run's results carry over.\n`);
  }
}
