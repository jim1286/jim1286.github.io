# QA — 자체 도메인 Storybook 연결

2026-10-10 사용자 승인에 따라 개발자 소개의 기존 facts 목록에 HJM 스토리북 링크를 추가했다.
URL은 `src/siteData.ts`, 한국어 label은 기존 i18n source catalog에서 제공하고 공개 HJM Link를 재사용한다.
제품 버전·메뉴·브랜드·최대 글자 조건은 바꾸지 않았다.

- main source `b802c5a448b5813e5ed0f6c5add3f014deceece2`, push 및 ls-remote 일치.
- Node 24.20.0 / pnpm 11.24.0 `pnpm check`, Hub source `pnpm policy:check` 통과.
- 공개 27파일 SHA와 검사한 artifact 일치. 실제 `/ko-KR/#developer`의 HJM 스토리북 label/새 HTTPS 링크 표시 확인.
- release `/srv/portfolio-site/releases/b802c5a448b5813e5ed0f6c5add3f014deceece2-0f4a82b37635`,
  manifest `0f4a82b37635a0bebe1233161f0939e9fa4b17206f5502f5358c82ae8c88b608`.
- 이전 release를 previous에 보존하고 정책·BurnTok readiness 유지 확인. 다른 세션의 QA template 변경은 stage하지 않았다.
- Storybook 도메인·CI artifact·기존 링크 이동·복구·임시 자료 정리의 전체 결과는
  [HJM 이관 QA](https://github.com/jim1286/hjm-design-system/blob/main/docs/qa/2026-10-10-storybook-domain-migration.md)에 기록한다.

새 branch/worktree/clone 없음. 제출 PDF/HTML은 수정하지 않았다. 작은 링크 추가의 영향 영역을 확인했으며 전체 UI QA를 반복하지 않았다.
