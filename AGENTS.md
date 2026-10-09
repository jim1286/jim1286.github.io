# Portfolio Site 작업 지침

이 저장소는 React/Vite 기반 독립 웹 제품이며 공통 `portfolio-default-v1` 심사 대상이다.
현재 `app.contract.json`으로 Vite runtime과 공통 검사 명령을 연결했다. 구현 evidence 승격은 별도다. Vite를 Next.js로 허위 선언하거나 기존 제품이라는
이유로 검사를 면제하지 않는다. 제품·설계·배포 결정은 [PRODUCT](docs/PRODUCT.md),
[ARCHITECTURE](docs/ARCHITECTURE.md), [DESIGN](docs/DESIGN.md), [RELEASE](docs/RELEASE.md)에 기록한다.

- Node는 `.nvmrc`, 패키지 관리자는 `package.json#packageManager`의 exact 버전을 사용한다.
- 설치는 저장소 루트에서 `pnpm install --frozen-lockfile`, 검사는 `pnpm check`다.
- 정책 링크는 생성물을 직접 편집하지 않고 Hub 원본 변경 후 `pnpm policy:sync`로 갱신한다.
- `policy:check`는 Hub 원본과 비교하며 원본이 없으면 실패한다. 독립 CI의
  `policy:check:snapshot`은 저장된 공개 snapshot만 검증하며 Hub 최신 상태를 증명하지 않는다.
- 스토어 버전·공개 상태는 빌드/업로드 사실만으로 바꾸지 않는다. 정책 본문은 이곳에 복사하지 않는다.
- 빌드 성공·소스 검사·실제 공개 배포를 구분해 보고한다.

## QA 자료 진입점

2026-10-09 앱별 QA 위치·형식 통일 요청으로 [QA 안내](docs/QA.md)를 단일 진입점으로 사용한다.
실행 범위·검사 명령·도구는 안내에서, 작업별 판정·재현·미확인 범위는 [결과 색인](docs/qa/README.md)에서 찾는다.

## 자체 도메인 게시

2026-10-09 사용자 요청으로 대표 origin은 jmstudioapps.com, www는 대표 주소 이동, 중앙 정책은
policies.jmstudioapps.com이다. [VPS 정적 실행서](deploy/static-site/README.md)를 먼저 읽는다.
`pnpm run deploy`는 검증된 artifact·SSH 대상·키 파일 경로·exact source SHA를 받는다. 개발 HTML을
게시하지 않고 build한 dist의 파일 집합/hash와 실제 공개 bytes·DNS/TLS를 검증한다. Sites/Codex 계정은 필요 없다.

기존 GitHub 주소는 main /docs의 이동 안내로 유지한다. /docs/index.html·404.html·ko-KR/index.html은
그 호환 계층이며 Vite dist와 혼동하지 않는다. GitHub 이동 안내는 HTTP 서버 redirect가 아니다.
도메인/링크 변경 뒤 Hub 원천과 snapshot을 함께 확인하고 이력서·스토어·프로필 소비자 영향을
작업별 QA에 기록한다. root AGENTS의 main 작업/정리 및 delivery 분담 규칙은 유지한다.
