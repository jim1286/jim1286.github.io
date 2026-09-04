#!/usr/bin/env node
// 정책·지원·계정삭제 URL의 단일 원천은 App Release Hub의 config/portfolio.json(policySite.origin + paths 템플릿)과
// config/apps/<id>/policy.json(방침이 존재하는 앱)이다. 이 사이트는 그 값을 손으로 복사하지 않고 여기서 생성한다
// (포트폴리오 설계 Phase 3: 공유값의 사본을 두 곳에서 손으로 관리하지 않는다).
// Hub 체크아웃은 메타 저장소 배치(../../control-plane/app-release-hub)에서만 존재하므로, 없으면 커밋된 생성 파일을 그대로 쓴다.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const output = resolve(here, '../src/policyLinks.generated.ts');
const hubConfig = process.env.HUB_CONFIG_DIR ?? resolve(here, '../../../control-plane/app-release-hub/config');
const check = process.argv.includes('--check');

if (!existsSync(join(hubConfig, 'portfolio.json'))) {
  console.log(`hub config not found at ${hubConfig}; keeping committed src/policyLinks.generated.ts`);
  process.exit(0);
}
const portfolio = JSON.parse(readFileSync(join(hubConfig, 'portfolio.json'), 'utf8'));
const appsWithPolicy = readdirSync(join(hubConfig, 'apps'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(hubConfig, 'apps', entry.name, 'policy.json')))
  .map((entry) => entry.name)
  .sort();
const rendered = `// 생성 파일 — 손으로 고치지 말고 \`pnpm run policy:sync\`를 실행한다.
// 원천: app-release-hub/config/portfolio.json(policySite)과 config/apps/<id>/policy.json 존재 여부.
export const policyOrigin = ${JSON.stringify(portfolio.policySite.origin)};
export const policyPaths = ${JSON.stringify(portfolio.policySite.paths, null, 2)} as const;
export const appsWithPolicy = ${JSON.stringify(appsWithPolicy)} as const;
export type PolicyAppId = (typeof appsWithPolicy)[number];
export function policyUrl(appId: PolicyAppId, kind: keyof typeof policyPaths): string {
  return \`\${policyOrigin}\${policyPaths[kind].replace('{id}', appId)}\`;
}
`;
const current = existsSync(output) ? readFileSync(output, 'utf8') : null;
if (check) {
  if (current !== rendered) {
    console.error('src/policyLinks.generated.ts is out of date with the Hub config; run pnpm run policy:sync');
    process.exit(1);
  }
  console.log('policy links in sync with hub config');
} else if (current !== rendered) {
  writeFileSync(output, rendered);
  console.log(`wrote ${output}`);
} else {
  console.log('policy links already in sync');
}
