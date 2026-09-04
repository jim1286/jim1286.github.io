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
pnpm run lint
pnpm run build
```

## 배포

`main` 브랜치를 push한 뒤 `pnpm run deploy`로 빌드 결과를 `gh-pages` 브랜치에 배포합니다.

## 2026-09-04 toolchain 변경 근거

- `.nvmrc`(24.20.0), `package.json#engines.node`, `packageManager` pnpm@11.24.0: 포트폴리오 baseline
  (exact Node, 단일 pnpm). 이 저장소는 그동안 Node·패키지 매니저를 아무 곳에도 고정하지 않았다.
- `pnpm-lock.yaml`은 `pnpm import`로 기존 `package-lock.json`에서 생성 후 npm lockfile 삭제.
  `scripts.predeploy`/`deploy`의 `npm run`은 `pnpm run`으로 변경.

## 정책 URL 원천

개인정보처리방침·지원·계정삭제 링크는 App Release Hub의 `config/portfolio.json`에서 생성한다.
`pnpm run policy:sync`가 `src/policyLinks.generated.ts`를 다시 만들고, `build`는 `policy:check`로 원천과의 불일치를 막는다.
Hub 체크아웃이 없는 환경(GitHub Actions 등)에서는 커밋된 생성 파일을 그대로 사용한다.
