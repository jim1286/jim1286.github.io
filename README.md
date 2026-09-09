# 황지민 · 공식 개발자 사이트

[jim1286.github.io](https://jim1286.github.io/)에 배포되는 독립 개발자·앱 포트폴리오
사이트입니다. 앱 스토어의 개발자/마케팅 웹사이트와 앱별 개인정보처리방침·계정 삭제·지원
문서의 공식 진입점으로 사용합니다.

## 공개 정보의 기준

- 앱 identity와 저장소: `app-portfolio/portfolio.json`
- 버전, 스토어 상태와 URL: App Release Hub의 release profile 및 store binding
- 앱 설명: 각 앱 저장소의 최신 README
- 개인정보처리방침과 지원 문서: `hjm-app-policies.jimin1286.chatgpt.site`

정책 본문은 이 저장소에 복제하지 않습니다. 이 사이트는 정책 사이트의 앱별 공식 문서로
연결하며, 정책의 개정과 배포는 App Release Hub가 관리합니다.

## 개발

```bash
pnpm install --frozen-lockfile
pnpm run dev
pnpm check
```

## 배포

`pnpm run deploy`는 Hub 원본 비교와 전체 검사를 통과한 뒤 빌드 결과를 `gh-pages`에 게시합니다.
공개 배포는 [릴리스 지침](docs/RELEASE.md)을 따릅니다.

## 2026-09-04 toolchain 변경 근거

- `.nvmrc`(24.20.0), `package.json#engines.node`, `packageManager` pnpm@11.24.0: 포트폴리오 baseline
  (exact Node, 단일 pnpm). 이 저장소는 그동안 Node·패키지 매니저를 아무 곳에도 고정하지 않았다.
- `pnpm-lock.yaml`은 `pnpm import`로 기존 `package-lock.json`에서 생성 후 npm lockfile 삭제.
  `scripts.predeploy`/`deploy`의 `npm run`은 `pnpm run`으로 변경.

## 정책 URL 원천

개인정보처리방침·지원·계정삭제 링크는 App Release Hub의 `config/portfolio.json`에서 생성한다.
`pnpm run policy:sync`가 `src/policyLinks.generated.ts`를 다시 만들고, `policy:check`는 Hub 원본과 비교하며 Hub가 없으면 실패합니다.
독립 CI와 `build`의 `policy:check:snapshot`은 공개 snapshot과 생성물의 일치만 검증하고,
Hub 최신 상태를 확인한 것으로 표시하지 않습니다.

## 개발·설계 문서

[제품](docs/PRODUCT.md) · [아키텍처](docs/ARCHITECTURE.md) · [디자인](docs/DESIGN.md) ·
[릴리스](docs/RELEASE.md). 이 앱은 공통 v1 심사 대상이며, 실제 계약 이관은 완료했고 구현 준수·운영 evidence는 별도 검증 대상입니다.

## 공통 개발 계약

`app.contract.json`이 실제 runtime·lockfile·검사 명령과 acceptance/evidence를 연결한다.
`pnpm install --frozen-lockfile` 후 `pnpm standard:check`로 모든 선언된 runtime의 lint/typecheck/test/build를 실행한다.
Flutter SDK는 runtime의 `.fvmrc`를 따른다. 기존 제품 CI는 유지하며 공통 피드백 CI를 추가한다.
계약 작성 상태는 governance-scaffold이며 구현·실기기·외부 required gate 완료를 뜻하지 않는다.
