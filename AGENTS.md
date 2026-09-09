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
