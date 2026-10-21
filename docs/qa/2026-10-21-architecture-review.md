# 설계 탭 전체 드릴다운 검토 — 2026-10-21

판정: **수정 필요**. 공통 책임·동기/비동기·검증/배포 구분은 대체로 맞지만, 현재 구현과 다른 제품 정보 및 드릴다운 정보 손실이 있다. 사용자 요청은 흐름·문구 확인이며 이번 작업은 제품 소스를 수정하거나 배포하지 않았다.

## 확인 기준과 범위

- 로컬 `main` HEAD `126378deb53c477e3f96aab5fca49e43ab64997a`와 기존 미커밋 변경을 포함한 개발 화면 `http://127.0.0.1:5191/`을 확인했다. 다른 세션의 변경은 보존했다.
- 공개 `https://jmstudioapps.com/`는 조회 당시 기존 **설계 5단계 화면**이었다. 전체·앱웹·서버·공용 기반·요청결과를 각각 열었다. 아래 31개 드릴다운은 **로컬 개발본**이며 공개 반영됐다는 뜻이 아니다.
- Aside CLI로 화면을 읽고 페이지에서 발견한 드릴다운 링크를 따라 31개 고유 뷰에 모두 진입했다. `#design`과 `#design/arch/overview`는 동일 뷰다. 전 뷰의 제목·본문·카드·노드 문구를 읽고 소스 데이터와 대조했다.
- 236개 노드, 188개 연결의 참조 대상·경계·드릴다운 목적지를 검사했다. 없는 노드/뷰 참조는 0건. 계산된 선분이 출발·도착 외 노드 내부를 관통하는 사례도 0건이었다. 기존 도식 변환 과정에서 선언된 연결이 누락된 사례는 발견하지 않았다.
- 브라우저 SVG 측정에서 노드 제목·부제의 좌우 넘침은 0건이었다. 이는 모든 화면 크기·테마의 시각 QA 통과를 뜻하지 않는다. 앱웹 도식 스크린샷과 Utilverse의 상세 패널 열기·닫기 및 모바일 노드 드릴다운을 별도로 확인했다.
- 제품별 package.json, workflow, Prisma schema, 실제 import·인증 설정·서버 진입점과 중앙 정책을 대조했다. HJM 1.38.0, Expo 58, NestJS 12.1 계열, Next.js 16.4 계열, Hub caller 6개 v1.4.2/선택의창 v1.4.6, Prisma 모델 수 48/36/23은 현재 checkout과 일치한다.
- 운영 호스트의 실시간 프로세스·배포 SHA·스토어 공개 상태와 외부 유료 API는 조회하지 않았다. 호스트 관련 설명은 workflow·제품 실행서·중앙 현재 상태 문서와의 일치까지만 확인했다. ExploreQA와 제품 테스트는 실행하지 않았다.

## 발견 사항

### 1. Utilverse의 Google 로그인을 지원 중인 것으로 표시함 — 높음

`apps` 표와 `app-utilverse` 카드가 `Apple · Google`이라고 표시한다. 실제 `apps/utilverse/apps/server/src/auth/auth-settings.ts:83`은 네이티브 SDK/coordinator와 Google 삭제 경로가 연결되지 않아 Google을 `not_implemented`로 반환한다. 서버 검증 코드가 있는 것과 사용자 로그인 제공은 다르다.

원인: `src/architecture/archData.ts:460`에서 다에리의 로그인 문구 `archDiairyLogin`을 재사용했고, `src/i18n/ko.ts:1730`도 같은 지원 상태를 단정한다.

수정 방향: Utilverse 전용 상태를 사용해 `Apple · Google 연결 미완료`로 구분한다. 실제 공개 여부까지 표현하려면 별도 배포 근거가 필요하다.

### 2. 수동 정적/Cloud Run 배포를 Hub 버전 판정 경로로 설명함 — 높음

`app-portfolio-site`는 Hub를 사용하지 않는다고 설명하면서 배포 상세에는 “서버·웹 배포 여부는 Hub의 버전 변경 판정으로 정합니다”라고 적혀 있다. `app-unairplane`도 “조회 서버는 workflow 밖에서 배포”와 같은 Hub 판정 문장을 함께 사용한다.

근거: `src/i18n/ko.ts:1775`, `:1788`; 포트폴리오 `deploy/static-site/README.md`, 비행중 `deploy/cloud-run/README.md`. 비행중 서버는 별도 runtime 산출물 → Cloud Build → image digest → Cloud Run revision 경로다. 포트폴리오는 고정 정적 artifact 게시 경로다.

또한 `app-portfolio-site`의 사용자 웹 → Caddy 연결에 “정적 게시”가 붙어 런타임 요청과 배포를 혼합한다(`archData.ts:1270`, `ko.ts:1789`). 브라우저 → 호스트는 HTTPS 정적 파일 요청으로 표시하고, 게시 흐름은 빌드 산출물에서 호스트로 별도 표현해야 한다.

수정 방향: 앱별 실제 배포 실행 경로를 문구 원천으로 삼고, overview의 버전 트리거 설명도 모바일/해당 서버 CI 범위임을 명시한다. “모든 빌드가 배포 Mac”이라는 표현은 이 Cloud Run 수동 빌드 경로까지 포함하는 전사 단정으로 사용하지 않는다.

### 3. 드릴다운하면 제품 상세가 사라지고 공통 도식으로 이동함 — 중간

모든 제품의 `mobile`·`web` 노드를 `code-client`, backend 서버를 `code-server`로 일괄 연결한다(`archData.ts:1296`). “Utilverse 모바일 앱 안으로 들어가기”를 누르면 웹·앱 공통 책임 구조로 이동하고 breadcrumb에서도 Utilverse 맥락이 사라진다. 포트폴리오의 정적 웹도 같은 공통 진입으로 연결된다.

`DrillArchitecture.tsx:183`은 drill이 있으면 링크만 만들고 상세 패널은 drill이 없는 노드만 연다. 현재 **detail과 drill을 함께 가진 55개 노드의 detail은 UI에서 직접 열 수 없다**. 원래 있던 제품 설명을 사용자에게 보여주지 못한다.

수정 방향: 제품 상세와 공통 설계 참조를 별도 행동으로 제공하거나 상세 안에 공통 설계 링크를 둔다. 공통 뷰로 이동한다면 “공통 설계 보기”처럼 대상이 드러나는 문구를 사용한다. 제품별 실제 내부 구조를 추가할 때만 “안으로 들어가기”라고 표현한다.

### 4. 앱·웹 공통 책임 도식에서 세 구성의 의존 관계가 끊김 — 중간

`code-client`는 6개 노드에 연결 2개만 있다. 웹·앱 진입점이 제품 코어로 연결되고 HJM·업무 규칙/전송 계약·API client/어댑터는 고립돼 있다. “공통 계약과 플랫폼 어댑터로 이어진다”는 본문을 화살표로 설명하지 못한다.

원인: 기존에 공통 영역 전체로 향하던 선을 화면 모델 노드 한 곳으로 옮긴 `legacyViews.ts:267-270`. 노드 참조 오류나 자동 변환 누락이 아니라 의미 연결을 불완전하게 정의한 것이다.

수정 방향: 실행 순서로 억지 직렬 연결하지 말고, 렌더러의 HJM/화면 모델 소비, 코어의 도메인/계약 소비, 통신·플랫폼 어댑터 연결을 의존 관계로 명시한다. “API client·어댑터”의 다음 화면이 전체 요청·결과 도식인 점도 구체적 내부 구현과 공통 참조를 구분한다.

### 5. 선택의창·Utilverse의 내부 패키지 설명이 현재 소스와 다름 — 중간

- 선택의창: `ko.ts:1747`의 “저장소 내부 패키지: 없음”은 틀림. `packages/domain`과 `packages/api-contracts`가 있고 모바일·서버 양쪽 manifest 및 실제 import에서 소비한다.
- Utilverse: `ko.ts:1733`의 `domain · i18n`에 `api-contracts`가 빠져 있다.
- 선택의창의 “없음” 키를 오늘야구와 포트폴리오도 재사용한다(`archData.ts:1101`, `:1282`). 선택의창 문구만 수정하면 다른 제품에 없는 패키지가 표시된다.

수정 방향: 제품별 패키지 목록을 분리하고 공통 “없음”은 별도 의미의 키로 유지한다. 다른 제품의 사실 문구를 동일 문자열이라는 이유로 재사용하지 않는다.

### 6. 비행중 서버와 Firestore의 책임을 덜 정확하게 표시함 — 중간

`Expo · Node`, `Node · Firestore`, `Node · 항공편 조회 서버`로 표시해 다른 앱과 같은 프레임워크 수준의 비교가 되지 않는다. 현재 `apps/unairplane/apps/server/package.json`은 NestJS 12.1.3/Fastify이고 `src/app.ts`에서 실제 NestFactory로 실행한다. Node라는 표현 자체가 거짓은 아니지만 현재 NestJS 실행 구조가 빠져 있다.

Firestore도 “조회 결과 저장”만 표시하지만 `src/persistence.ts`의 `reserve()`가 일일 조회 한도를 영속 보존한다. 재생성 가능한 결과 캐시와 보존해야 하는 호출 한도를 구분해야 복구 책임이 정확해진다.

수정 방향: `NestJS · Fastify / Node`, `조회 캐시 · 일일 호출 한도`로 구체화한다. Cloud Run 운영 위치와 Gemini/Search 연동 자체는 현재 제품 문서·소스와 일치한다.

### 7. 오늘야구 Redis 연결에 다른 앱의 “큐·캐시” 문구를 재사용함 — 중간

Redis 노드 부제는 “캐시”인데 연결은 `archAppBurntokEdge8`의 “큐 · 캐시”를 사용한다(`archData.ts:1091`). 오늘야구는 Redis 서비스와 DB `CrawlJobStep`/`CrawlJobLedgerService`의 작업 기록 경로가 있으며, 번뚝의 BullMQ 구성을 그대로 설명하면 작업 전달·복구 위치를 오해할 수 있다.

근거: `apps/yajalal/apps/server/src/redis/redis.service.ts`, `src/data-import/services/crawl-job-ledger.service.ts`, 서버 package.json.

수정 방향: Redis의 실제 캐시·동기화 책임과 DB 작업 원장을 분리해서 표시한다. BullMQ 앱과 문구를 공유하지 않는다.

### 8. 설계 탭 소개 문구가 이전 화면 범위를 설명함 — 낮음

`ko.ts:1097`은 “제품 이름이나 특정 폴더 구조 대신 역할을 기준으로 구성”한다고 설명하지만 현재 첫 화면부터 앱 이름, 저장소, 호스트, 버전과 개발·QA·마케팅 경로를 보여준다. 도식의 범위가 확장됐는데 이전 5단계 화면의 소개가 남았다.

수정 방향: “공통 책임에서 제품별 실행 구조·개발·배포 흐름으로 들어갑니다”처럼 현재 탐색 구조와 일치시킨다. 운영 규칙/현재 구현/도입 구상 표시를 유지한다. dots는 이미 도입 구상으로 명확히 표시돼 있어 성과로 오인시키는 문구는 발견하지 않았다.

## 31개 화면별 확인 기록

아래 ‘일치’는 확인한 도식·문구·소스/정책의 책임 구분에 한정한다. 운영 실행이나 제품 전체 기능 통과를 뜻하지 않는다. 제품 공통 드릴다운 문제(3)는 각 행에서 반복하지 않는다.

| 뷰 | 판정 |
| --- | --- |
| overview | 메타/독립 저장소·공용 모듈 구분 일치. 배포 트리거 범위 한정 필요(2), 소개 갱신(8) |
| dev | main 작업·공유 변경 보존·변경 검사·개발/릴리스 경계가 현 지침과 일치 |
| ci | 중앙 기록과 일치. 모든 빌드라는 전사 표현은 수동 Cloud Build와 구분(2); 실시간 러너 미조회 |
| std | 정책→구현/계약→소비/적용 기록 및 로컬 HJM/게시 구분 일치 |
| apps | 8개 제품 뷰 진입 정상. Utilverse 로그인(1), 비행중 스택(6) |
| app-burntok | manifest·workflow·Prisma 모델 수·외부 AI 경계 일치 |
| app-diairy | manifest·workflow·Prisma 모델 수·OTA 수동 경로 일치 |
| app-spint | manifest·workflow·Prisma 모델 수 일치 |
| app-utilverse | Google 상태(1), api-contracts 누락(5) |
| app-choose-window | domain/api-contracts를 없음으로 표시(5); DB 없는 경로 API 구조는 일치 |
| app-yajalal | Redis/DB 작업 역할 구분 필요(7); MySQL/TypeORM·EC2·OTA 기록 일치 |
| app-unairplane | 별도 서버 배포(2), NestJS/Fastify·Firestore 한도 책임(6) |
| app-portfolio-site | Hub 판정 모순·정적 요청/게시 혼합(2) |
| code-overall | 제품 런타임과 HJM/Hub/ExploreQA 지원 계층 분리 일치 |
| code-client | HJM·계약·어댑터 의존 연결 부족(4) |
| code-server | API/서비스/영속 저장/캐시/작업/외부 연동의 선택 구성 구분 타당 |
| code-hjm | design-contracts→React/RN→제품 소비 구분 일치 |
| code-hub | 설정→등록/공용 CI 및 별도 정책 projection 구분 일치 |
| code-exploreqa | provider→runner/control-host→기록, 명시 요청 조건 일치 |
| code-change | 요청→인증→업무→저장/조회→화면, 비동기 접수/완료 구분 타당 |
| code-client-web | 논리 책임 모델로 명시, 쿠키/CSRF/요청 격리·선택적 서버 구분 타당 |
| code-client-app | 보안 저장·플랫폼 어댑터·중단/복귀와 계정 격리 설명 타당 |
| code-server-flow | DB/캐시/작업/worker 선택 및 결과·외부 수락 구분 타당 |
| guide | 대상/소유권→실행 준비→구현/관련 확인→기록/정리, 현 지침과 일치 |
| guide-modules | 등록 모듈 3개·모듈별 작업 진입 정상 |
| guide-module-0 | HJM 선택·계약/렌더러·관련 검사·게시/소비 구분 일치 |
| guide-module-1 | 미등록 CLI/등록 CI, 산출물·실제 상태 확인 구분 일치 |
| guide-module-2 | 명시 요청·기존 대상 연결·관찰/기록·미확인 구분 일치 |
| qa | 성공 결과 재사용, 실패 시 원인 수정, 검증 불가를 통과로 표현하지 않는 흐름 일치 |
| marketing | 검색/발견→사실 검수/공개 확인→반응→개선, 현 운영 지침과 일치. 채널 실적은 미조회 |
| marketing-dots | 현재 성과가 아닌 도입 구상으로 표시됨; 자동 게시 권한을 가정하지 않음 |

## 정리

제품 사실을 다른 제품의 번역 키로 재사용한 부분과 공통 뷰를 제품 내부처럼 연결한 부분을 먼저 고치는 것이 적절하다. 검토 보고서만 추가했으며 제품 소스·버전·운영 배포는 변경하지 않았다. 기존 개발 서버를 재사용했고 종료하지 않았다. 검사에 만든 임시 JSON·브라우저 텍스트·스크린샷은 결과를 이 문서에 정리한 뒤 제거했다.


## 후속 수정 — 요청한 세 항목 반영

사용자가 발견 사항 중 드릴다운 정보 손실(3), 앱·웹 의존 연결(4), 제품 정보(5·6·7)의 수정을 지정했다. 최초 검토 내용은 수정 전 근거로 보존한다.

- 모든 노드가 먼저 기존 HJM SidePanel에서 설명·입출력 관계를 연다. drill이 있는 노드도 detail을 읽을 수 있으며, 패널의 별도 링크에서 관련 도식으로 이동한다. 제품 뷰에서는 링크를 ‘공통 설계 보기’로 표시해 제품 내부 구현이라는 오해를 피한다. 노드/범례/힌트도 이 동작에 맞췄다.
- 앱·웹 공통 책임 도식은 6개 노드·6개 의존 연결로 수정했다. 웹·앱 각각 HJM과 화면 모델을 소비하고 화면 모델은 업무 규칙/전송 계약과 API/플랫폼 어댑터를 소비한다. 독립 패키지를 실행 순서처럼 직렬 연결하지 않는다.
- 선택의창 domain·api-contracts, Utilverse domain·api-contracts·i18n을 표시한다. 패키지 없음 문구를 별도 키로 분리해 오늘야구·포트폴리오에 선택의창 정보가 섞이지 않게 했다.
- 비행중은 NestJS/Fastify 조회 서버와 Firestore의 조회 캐시·일일 호출 한도 보존 책임을 표시한다. 오늘야구는 MySQL 작업 원장과 Redis 캐시·잠금/PubSub 동기화를 별도 문구와 상세로 설명한다.

검증: Node 24.20.0에서 `pnpm typecheck` 통과. 변경 파일 `git diff --check` 통과. Aside CLI로 Utilverse 모바일 상세 설명 표시 → 명시적 공통 설계 링크 이동, 앱웹 도식의 6개 연결과 업무 계약의 들어오는 연결, 선택의창/Utilverse 패키지 문구, 비행중 Firestore·오늘야구 Redis 상세를 확인했다. 앱웹 노드 제목/부제 좌우 넘침 0건이며 오늘야구·포트폴리오의 패키지 없음 표시도 보존됐다.

최초 검토의 별도 항목인 로그인 지원 상태(1), 배포 설명(2), 설계 소개 범위(8)는 이번 지정 범위에 포함하지 않았다. 공개 배포·패키지 게시·버전 상승은 하지 않았다. 다른 세션의 미커밋 변경과 기존 개발 서버는 보존했고 이번 화면 검사 임시 출력만 정리했다.
