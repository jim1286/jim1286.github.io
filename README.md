# 황지민 · 공식 개발자 사이트

[jmstudioapps.com](https://jmstudioapps.com/)에 배포되는 독립 개발자·앱 포트폴리오
사이트입니다. 앱 스토어의 개발자/마케팅 웹사이트와 앱별 개인정보처리방침·계정 삭제·지원
문서의 공식 진입점으로 사용합니다.

## 공개 정보의 기준

- 앱 identity와 저장소: `app-portfolio/portfolio.json`
- 버전, 스토어 상태와 URL: App Release Hub의 release profile 및 store binding
- 앱 설명: 각 앱 저장소의 최신 README
- 개인정보처리방침과 지원 문서: Hub의 제품별 게시 소유권·공개 URL. 중앙 사이트는 `policies.jmstudioapps.com`, 자체 게시 제품은 해당 제품 도메인

정책 본문은 이 저장소에 복제하지 않습니다. 이 사이트는 제품별 공식 문서로 연결합니다.
중앙 게시 정책은 App Release Hub, 자체 게시 정책은 각 제품 저장소가 원문과 게시를 관리합니다.
2026-10-17 대조에서 모든 정책을 Hub가 게시하는 듯한 설명을 실제 URL 생성 계약과 맞췄습니다.

## 개발

앱 아이콘과 최신 제품 소개의 원천·동기화는 [앱 자산 안내](docs/APP_ASSETS.md)를 따릅니다.

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

검사는 변경한 범위의 타입·관련 테스트를 선택합니다. `pnpm check`는 명시적으로 선택하는 전체 감사입니다.

`pnpm typecheck`는 개발 서버와 같은 로컬 HJM 공개 소스를 검사하고 Vite 설정 타입도 확인합니다.
2026-10-19 카드 배지 슬롯 이관 때 개발 화면과 설치 패키지 타입이 달라진 것이 계기입니다.
CI·production·`HJM_LOCAL_SOURCE=0`과 게시용 `pnpm build`는 설치 패키지를 검증하며 미게시 API를 지원한다고 가정하지 않습니다.

## 배포

2026-10-09 사용자가 자체 도메인 이전을 승인해 기존 VPS의 Caddy가 검증된 dist를 제공한다.
`www`는 메인 주소로 이동한다. GitHub 주소·운영 이력은 기존 링크 호환을 위해 유지한다.
다른 환경에서도 Node/pnpm과 관리 SSH 권한으로 [자체 호스팅 배포 절차](deploy/static-site/README.md)를 실행할 수 있다.
현재 기본 `pnpm run deploy`는 정적 artifact publisher이며 source/main과 앱 버전은 별개다.
공개 결과는 [QA](docs/qa/2026-10-09-owned-domain-deployment.md)에 기록한다.

## 2026-09-04 toolchain 변경 근거

- `.nvmrc`(24.20.0), `package.json#engines.node`, `packageManager` pnpm@11.24.0: 포트폴리오 baseline
  (exact Node, 단일 pnpm). 이 저장소는 그동안 Node·패키지 매니저를 아무 곳에도 고정하지 않았다.
- `pnpm-lock.yaml`은 `pnpm import`로 기존 `package-lock.json`에서 생성 후 npm lockfile 삭제.
  `scripts.predeploy`/`deploy`의 `npm run`은 `pnpm run`으로 변경.

## 정책 URL 원천

개인정보처리방침·지원·계정삭제 링크는 App Release Hub의 `config/portfolio.json`과
`config/apps/<id>/app.json` 또는 보관된 `retired.json`의 공개 URL·게시 소유권에서 생성한다.
`pnpm run policy:sync`가 `src/policyLinks.generated.ts`를 다시 만들고, `policy:check`는 Hub 원본과 비교하며 Hub가 없으면 실패합니다.
독립 환경과 `build`의 `policy:check:snapshot`은 공개 snapshot과 생성물의 일치만 검증하고,
Hub 최신 상태를 확인한 것으로 표시하지 않습니다.

## 개발·설계 문서

[제품](docs/PRODUCT.md) · [아키텍처](docs/ARCHITECTURE.md) · [디자인](docs/DESIGN.md) ·
[릴리스](docs/RELEASE.md). 이 앱은 공통 v1 심사 대상이며, 실제 계약 이관은 완료했고 구현 준수·운영 evidence는 별도 검증 대상입니다.

앱 소개는 `/#apps`에서 제공하며, 캐릭터 브랜딩·소셜 운영 사례는 마케팅 전략에서 설명합니다. [제품 문서](docs/PRODUCT.md#개발자-포트폴리오와-마케팅-사례)에 현재 경계를 기록합니다.

## 공통 개발 계약

`app.contract.json`이 실제 runtime·lockfile·검사 명령과 acceptance/evidence를 연결한다.
실제 runtime은 Vite이며 변경한 표면의 타입·관련 테스트·빌드를 선택한다. 전량 `standard:check`는
명시적으로 요청한 감사에만 사용하고 별도 피드백/품질 CI를 추가하지 않는다(2026-10-14 최소화 지시).
`build`는 입력 정합성·컴파일·정적 출력 생성이며 단위 테스트를 실행하지 않는다. 계약의 존재나
정적 검사 통과는 구현·실제 공개 배포 완료의 증거가 아니다.

## QA 자료 진입점

2026-10-09 앱별 QA 위치·형식 통일 요청으로 [QA 안내](docs/QA.md)를 단일 진입점으로 사용한다.
실행 범위·검사 명령·도구는 안내에서, 작업별 판정·재현·미확인 범위는 [결과 색인](docs/qa/README.md)에서 찾는다.

## HJM 배포 준비

2026-10-12 사용자 요청으로 제품 버전 상승 전에 `pnpm release:prepare`를 실행한다.
현재 메이저의 최신 HJM 안정 버전·lockfile을 고정하고 `check:hjm-release`의 웹/앱 검사 후 커밋한다.
프런트엔드 빌드를 포함하므로 hosted/candidate CI 환경에서 실행한다. 계획은 `pnpm release:prepare:plan`,
실패 재개는 `pnpm release:prepare --resume`이다. 준비 단계는 push·스토어 제출을 하지 않는다.
빌드 재시도는 확정한 SHA를 사용하며 최신 버전을 다시 선택하지 않는다.
[공통 운영 절차](https://github.com/jim1286/app-portfolio/blob/main/docs/STANDARD_OPERATIONS.md#hjm-개발-후보와-앱별-게시-버전).
