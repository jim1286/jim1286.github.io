---

2026-10-25 사용자 요청: 제품 앱·웹의 미설정 테마 기본값은 라이트다. 기존에 저장된 라이트·다크·시스템 선택과 제공 중인 테마 전환은 유지한다. HJM 라이브러리 자체의 기본값은 바꾸지 않는다.
schema: hjm.app-document/1
document: design
app_id: "portfolio-site"
display_name: "Portfolio Site"
status: draft
owner: "jimin"
reviewed: "2026-10-08"
version: "1.1.0"
---

# Portfolio Site 화면 지침

## HJM 기본 테마 (2026-10-21)

사용자 요청으로 제품 전용 팔레트와 테마 강제를 제거하고 HJM 기본 색상을 사용한다. 기본 모드는 시스템 설정을 따른다. 구역별 숲색 팔레트와 반경 프로필도 제거해 모든 구역이 같은 기본 테마를 상속한다.


개발자와 앱의 핵심 정보를 읽고 목적에 맞는 공식 링크로 이동할 수 있게 한다.
디자인 구현 원천은 [App.tsx](../src/App.tsx)와 [site.css](../src/styles/site.css)다.

- 앱 카드에는 이름·요약·상태·플랫폼과 이동 목적을 명확히 표시한다.
- 저장소, 스토어, 개인정보, 지원 링크를 의미가 드러나는 이름으로 구분한다.
- 키보드 접근·초점 표시·대체 텍스트와 읽기 순서를 유지한다.
- 기본 좁은 화면, 긴 한국어/영문 이름에서 겹침과 잘림을 확인한다. 최대 글자 및 그 최대값 모사 확대는 사용자 지시로 범위에서 제외한다.
- 실제 배포 상태가 확인되지 않은 앱을 공개 출시 상태로 표시하지 않는다.

## 2026-10-18 탭과 도식 중심 UI

긴 단일 랜딩을 HJM `Tabs`·`TabPanel`의 주제별 패널로 전환했다. 선택된 패널만 mount하고 공개 API의 키보드·초점·가로 스크롤 동작을 사용한다. 사이트는 기존 종이·숲 브랜드를 유지하면서 작은 헤더와 주제 탭·일관된 제목·카드로 재구성했다. 제품은 공통 `ScreenLayout`·`TopBar`·`Section`·`Card`를 계속 소비하며 HJM 내부 CSS를 덮지 않는다.

소개에서 회사 사례의 상세 구현·도식은 `Collapsible`로 펼친다. 앱 카드에는 목적과 설계 관점을 함께 보여준다. 개발 흐름·HJM·지침·마케팅은 도식과 짧은 해설을 조합한다. 좁은 화면의 도식은 글자를 과하게 축소하지 않고 자체 가로 스크롤과 별도 확대 링크를 제공한다. 공유된 이전 해시와 locale 진입은 유지한다. 지원 정보는 별도 탭과 공통 footer에서 접근한다.

## 마케팅 사례의 위치

2026-10-09 사용자 요청으로 캐릭터 앱 카드 진입점을 제거했다. 개발자 소개→제품 목록→
작업 방식이라는 흐름을 유지하고, 포슬이의 그림·방문자 말투·별도 메뉴·중복 앱 카드는 쓰지 않는다.
마케팅 전략 카드 안의 공개 Surface/CompositionLayout으로 캐릭터 브랜딩과 소셜 콘텐츠 운영을 설명한다.
포슬이 이름은 이 사례 설명에만 남긴다. 실제 캠페인 결과로 오인할 성과 숫자는 넣지 않는다.

## 이관·검증 현황

### 2026-10-15 화면 내부 공통 구조

사이트 헤더의 앞/끝 영역을 `TopBar`로 옮기고 전략 카드의 단계·설명·보조 행동은
`CompositionLayout`으로 연결했다. 모바일 메뉴의 공개 `Collapsible`, hash 이동과 구역 초점,
브랜드 팔레트·그림·원천 데이터는 유지한다. 소개 화면은 `ScreenLayout`, 본문 구역은
`Section`, 제품/정책 카드는 `Card`를 계속 사용한다. 히어로의 문구 강조·사진 프레이밍과
개발자 연락처의 링크를 포함한 정의 목록은 제품 콘텐츠다.

설치된 HJM 1.23.0 기준 `tsc -b` 통과. Chromium 320/1440px에서 가로 넘침 없음,
모바일 메뉴 열기·Escape 닫기/초점 복귀·구역 이동 후 초점과 닫힘을 확인했다.
공개 사이트 배포는 이 검사에 포함하지 않았다.

### 2026-10-08 HJM 1.16 실제 구성 도입

첫 제품 도입은 공개 서비스 소개 지침의 소개 → 제품 정보 → 공식 이동 행동 순서에서
시작한다. 공개 `LandingScreen`이 없으므로 `ScreenLayout`·`Section`·`Grid`·`Card`로
정적 소개를 구성한다. 입력 체험·FAQ·조회 도구는 현재 제품에 없어 만들지 않는다.
데이터/도구 목록 목적의 `OverviewScreen`을 정적 소개 화면 전체로 사용하는 대안은 제외했다.

제목·글자·숫자·상태·링크·본문 건너뛰기·그림 액자를 각각 공개 Heading/Text/Statistic/
Badge/Tag/Link/SkipNav/Asset으로 연결했다. 제품 소유 profile은 Provider에서 실제로
상속하며 HJM private CSS를 덮지 않는다. 종이·숲 브랜드, 승인 그림, 앱 정보와 정책 원천,
mailto/스토어 목적지는 제품이 소유한다. 기존 밝은 editorial 표현은 두 OS 모드에서 유지한다.

공유 checkout의 진행 중 catalog·URL loader·생성기 기능을 보존해 통합했다.
공개 npm 1.16 exact 설치와 TypeScript 7 변경을 함께 검증한다. 기존 100 i18n 키와
formatter 인자는 보존하며 완성 문장·메뉴·저장소 접근 상태 문구만 같은 source에 추가한다.
등록 언어는 `ko-KR` 하나이며 GitHub Pages의 직접 URL 진입을 위해 실제 locale HTML을
빌드한다. 새 번역 언어를 제공한 것으로 세지 않는다.

실제 Chromium의 320/390/1440px 및 두 OS 색상 환경에서 문서 스크롤·13개 카드·모든
그림 로드·한국어 URL 직접 진입/새로고침·본문 건너뛰기·메뉴와 앵커를 확인했다.
모바일 기본 헤더가 212px를 차지해 공개 Collapsible로 접었고, 좁은 화면에서도 브랜드를
한 줄로 유지한다. 구역 선택은 구역에 초점을 두고 다음 Tab을 그 안으로 이어 준다.
단순 Escape 닫기는 메뉴 trigger에 초점을 돌린다. 새 사용자 사진은 원본 비율로 표시한다.
종이의 작은 muted 글자는 실측 4.44:1 문제를 공개 semantic palette에서 보정한다.

익명 방문자가 접근할 수 없는 private repository는 `sourceAccess`에 접근 경계를 명시해
Source 버튼 대신 비공개 상태를 보여 준다. GitHub 원래 주소는 데이터로 보존한다.
Taground는 archived 이력 카드로 보존하며 현재 개발 중으로 표시하지 않는다.
[이번 QA](qa/2026-10-08-hjm-adoption.md)에 검사·원본 통합 판단·실패/수정·최종 카피와
배포 경계를 보존한다. governance acceptance는 기존 pending을 유지한다.
OS 최대 접근성 글자와 그 최대값 모사 확대는 설계·추가 검사·후속·완료/릴리스 조건에서 제외한다.

2026-09-09에 HJM Provider와 Container·Stack·Text·Icon을 실제 화면에 연결했다.
[빌드 후 Chromium 관찰](evidence/verified/hjm-browser-20260909/index.md) 여섯 조건은 통과했지만
기존 브랜드 CSS의 토큰 이관과 전체 의미·접근성 준수는 아직 진행 중이다. 접근성 자동 검사,
브라우저별 screenshot, 큰 글자/키보드·screen reader evidence는 아직 공통 registry로
규격화되지 않았다. `pnpm check` 성공을 해당 UI 검증 완료로 대체하지 않는다.

## 90. Acceptance criteria

| ID | 기준 | 검증 방법 | 상태 | Evidence ID |
| --- | --- | --- | --- | --- |
| DESIGN-001 | Portfolio Site의 실제 frontend에서 기본·오류·빈 상태와 접근성, HJM foundation 의미 계약을 검증한다. | light/dark·기본 좁은 화면·키보드 parity review(최대 글자 제외) | pending | EV-003, EV-008, EV-009, EV-010, EV-011, EV-012, EV-1400 |

## 91. Evidence registry

| ID | 기준 | 타입 | 위치 | 캡처 시각 | digest | 상태 | 소유자 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| EV-003 | DESIGN-001 | review | docs/evidence/planned/design-parity.md | — | — | planned | jimin |
| EV-008 | DESIGN-001 | automated-test | docs/evidence/planned/design-system-provider-boundary.md | — | — | planned | jimin |
| EV-009 | DESIGN-001 | automated-test | docs/evidence/planned/text-foundation.md | — | — | planned | jimin |
| EV-010 | DESIGN-001 | automated-test | docs/evidence/planned/icon-foundation.md | — | — | planned | jimin |
| EV-011 | DESIGN-001 | automated-test | docs/evidence/planned/stack-foundation.md | — | — | planned | jimin |
| EV-012 | DESIGN-001 | automated-test | docs/evidence/planned/container-foundation.md | — | — | planned | jimin |
| EV-1400 | DESIGN-001 | automated-test | docs/evidence/planned/hjm-1-4-link.md | — | — | planned | jimin |

<!-- hjm-contract-evidence
{
  "category": "design",
  "criteria": [
    {
      "id": "DESIGN-001",
      "category": "design",
      "statement": "Portfolio Site의 실제 frontend에서 기본·오류·빈 상태와 접근성, HJM foundation 의미 계약을 검증한다.",
      "verification": "light/dark와 큰 글자를 포함한 parity review",
      "status": "pending",
      "evidenceIds": [
        "EV-003",
        "EV-008",
        "EV-009",
        "EV-010",
        "EV-011",
        "EV-012",
        "EV-1400"
      ]
    }
  ],
  "evidence": [
    {
      "id": "EV-003",
      "criterionIds": [
        "DESIGN-001"
      ],
      "type": "review",
      "location": "docs/evidence/planned/design-parity.md",
      "status": "planned",
      "owner": "jimin"
    },
    {
      "id": "EV-008",
      "criterionIds": [
        "DESIGN-001"
      ],
      "type": "automated-test",
      "location": "docs/evidence/planned/design-system-provider-boundary.md",
      "status": "planned",
      "owner": "jimin",
      "note": "Replace this generated plan with a non-placeholder, type-specific record before setting capturedAt, digest, and status to verified; relabeling the plan is insufficient."
    },
    {
      "id": "EV-009",
      "criterionIds": [
        "DESIGN-001"
      ],
      "type": "automated-test",
      "location": "docs/evidence/planned/text-foundation.md",
      "status": "planned",
      "owner": "jimin"
    },
    {
      "id": "EV-010",
      "criterionIds": [
        "DESIGN-001"
      ],
      "type": "automated-test",
      "location": "docs/evidence/planned/icon-foundation.md",
      "status": "planned",
      "owner": "jimin"
    },
    {
      "id": "EV-011",
      "criterionIds": [
        "DESIGN-001"
      ],
      "type": "automated-test",
      "location": "docs/evidence/planned/stack-foundation.md",
      "status": "planned",
      "owner": "jimin"
    },
    {
      "id": "EV-012",
      "criterionIds": [
        "DESIGN-001"
      ],
      "type": "automated-test",
      "location": "docs/evidence/planned/container-foundation.md",
      "status": "planned",
      "owner": "jimin"
    },
    {
      "id": "EV-1400",
      "criterionIds": [
        "DESIGN-001"
      ],
      "type": "automated-test",
      "location": "docs/evidence/planned/hjm-1-4-link.md",
      "status": "planned",
      "owner": "jimin"
    }
  ]
}
-->

## 2026-10-15 전체 화면·구성 확인

현재 제품 화면 `/`, 한국어 진입 `/ko-KR/`와 개발·마케팅 전략 도식 2개를 전수 확인했다. 제품 페이지는 ScreenLayout/TopBar/Collapsible/Section/Grid/Card/CompositionLayout을 직접 소비하며, 브랜드·앱 등록 데이터·외부 링크·해시 이동은 제품이 연결한다. 도식은 제품 설명용 콘텐츠로 보존한다. 이번 확인에서 공통 구조 재구현으로 추가 이관할 부분은 발견하지 않았다.

Chromium 320px·1440px에서 4개 주소의 가로 넘침·페이지 오류 없음, 모바일 메뉴 열기·Escape 닫기 확인. 공개 서비스 배포 상태를 이 로컬 렌더 결과로 주장하지 않는다.

확인: 7개 탭 전환·키보드 선택·뒤로가기·기존 discontinued 링크, 데스크톱 및 390px 폭의 페이지 넘침, 도식 로딩을 확인했다. 탭 전환 시 고정 탭이 아닌 본문 시작점으로 이동해 이전 스크롤이 남지 않게 했다. 최종 변경은 pnpm build 통과.

## 2026-10-18 HJM 1.30.0 채택과 화면 재점검

HJM 1.30.0을 채택하고 7개 탭 전체를 설치 버전 SELECTION과 대조했다. 진입 포커스 대상 입력은 없다.
이관: 소개 탭의 두 열 배치를 제품 CSS grid에서 HJM `Grid`로, 탭 소개문의 `.panel-intro` 여백 wrapper를
패널 `Stack` 간격과 배치 전용 `maxWidth`로 바꿨다(1.65:1 비율 대신 Grid의 같은 폭 두 열).
유지한 제품 고유 부분: 상단 헤더·고정 탭 막대·바닥 영역의 테두리와 sticky host(정적 사이트 문서 스크롤 chrome,
ScreenLayout footer는 하단 고정이라 페이지 끝 footer를 대신하지 않음), 기술 도식 이미지, 헤더의 GitHub·Storybook
외부 목적지 링크(도구성 행동이 아닌 이동), BrandProvider의 paper/forest 팔레트.
확인: `pnpm build` 통과, 로컬 `vite preview`에서 데스크톱 소개·앱 탭과 375px 폭 가로 넘침 없음. 공개 배포는 하지 않았다.

## 2026-10-18 HJM 1.31.0 채택

HJM 1.31.0을 채택하고 새 API(Card `onActivate`+`actions`, ScreenLayout `titleLeading`·`loadingIndicator`, Text `color`·`numeric`,
Tabs `indicator`, PageIndicator 등)를 7개 탭과 대조했다. 이 사이트에는 해당 API가 닫는 앱 우회·공백 기록이 없어 화면 코드는
바꾸지 않았다. 상단 헤더의 TopBar는 1.30 기록대로 정적 문서 스크롤 chrome이라 유지한다.
확인: `pnpm typecheck`, `pnpm build` 통과. 브라우저 화면 확인과 공개 배포는 하지 않았다.

## 작업 흐름 공개 지도

2026-10-19 전체 지침 흐름을 포트폴리오에 보여 달라는 요청으로 개발 흐름에는 공통 6단계, 지침 구조에는 8개 영역의 HJM Accordion을 배치한다. 작은 화면은 단일 열로 읽으며 세부 순서는 필요한 영역만 펼친다. 실제 사례는 소스 변경과 공개 배포를 구분한다. 지침 구조의 전체 작업 흐름과 디자인 시스템의 앱·웹 HJM 활용 흐름은 직접 작성한 SVG로 표시한다. HJM 활용은 설치 API 확인, 공통 구현 선택, 재사용 또는 HJM 확장, 제품 연결, 웹·앱 적용, 관련 검증 순서다. 도식의 카드와 색상은 HJM을 사용하며 작은 화면에서는 도식 내부만 가로로 이동한다. 기존 도식 열기·다운로드 연결은 제거했다.

확인: 개발용 타입 검사, 390px 화면의 가로 넘침·영역 펼침·6단계 표시, 공개 도식 응답을 확인했다. 배포 빌드는 기존 ProductCard의 `badges` prop과 설치된 HJM 공개 타입 불일치로 실패했으며, 공개 배포는 수행하지 않았다. 검토용 Vite 미리보기는 이 checkout의 `127.0.0.1:4319`에서 실행 중이며 사용자 검토 종료 시 해당 프로세스만 종료한다.

## 모듈별 지침 설계

2026-10-19 실제 모듈의 지침 경로를 보여 달라는 요청으로 지침 구조의 작업 영역 아래에 3개 모듈 카드를 추가했다. portfolio.json.modules, 각 AGENTS.md·module.contract.json, HJM SELECTION과 ExploreQA README를 대조했다. HJM·App Release Hub·QA Framework의 역할, 작업 순서 도식, 제품 경계, 관련 확인과 원문 링크를 제공한다. 인증·메시지 등 정책 영역을 별도 등록 모듈로 표현하지 않는다. 제품 채택·게시·실행 성공은 이 문서 대조로 주장하지 않는다.

2026-10-19 사용자 정정: 독립 저장소 목록보다 서버의 구성 계약을 보여주는 것이 목적이다. 서버 계약 구조도를 중심에 추가하고 저장소별 카드는 접힌 보조 설명으로 이동했다. BACKGROUND_JOB_POLICY, SERVER_CACHE_POLICY, 서버 표준 §9.2, DB 정책과 다에리 journey queue/worker를 확인했다. 응답 캐시와 큐 Redis의 논리 역할, 업무 결과와 큐 완료, 워커 종료·자원·복구를 분리했다. DB 작업·직접 실행을 BullMQ로 일괄 표현하지 않는다.

2026-10-19 앱·웹 계약 구조도 추가: WEB_NATIVE_GUIDELINES, WEB_NATIVE_REFERENCE_ARCHITECTURE, RUNTIME_BINDING_STANDARD, TANSTACK_QUERY_POLICY의 책임 경계를 요약했다. 라우트·HJM·제품 상태·저장/플랫폼 어댑터·API client·세션 전송·제품 API를 연결하고 SSR·세션 중계의 선택 조건과 정적 사이트 예외를 표시한다. GitHub 공개 여부 조회 결과 중앙 정책·Release Hub·QA는 비공개이므로 새 계약 영역의 접근 불가능한 링크를 제거하고 페이지 내 요약을 제공한다. HJM은 공개 문서 파일 존재를 확인해 링크를 유지했다.

## 2026-10-19 전체 UI 개편

사용자 요청의 역할 → 설계 → 관리 → 결과 흐름을 5개 장으로 재구성했다. 흰 배경과 선 없는 상단 탭을 유지하고 HJM Grid·Card·Surface·Section·Collapsible로 계층을 정리했다. 소개는 역할과 대표 작업, 제품은 문제/설계/결과와 서비스 링크, 설계는 결정 요약과 상세 도식, 운영은 검증/배포/지침/마케팅, 연락은 메일과 접힌 제품 지원 문서로 구성한다. 프로필 사진은 원본 비율을 보존한다. 선택의창 기술 표시는 실제 Expo runtime에 맞췄다.

검증: 개발용 타입 검사 통과. 1440px·390px에서 5개 장의 이동·펼침·이미지·가로 넘침을 확인했다. 배포용 빌드는 기존 ProductCard.badges와 설치 HJM 공개 타입 불일치로 실패했다. 개발용 소스 연결 검사와 설치 패키지 빌드는 별개이며 공개 배포하지 않았다. 미리보기 4319는 사용자 검토용으로 유지한다.

2026-10-19 설계 장의 정보 우선순위를 문제·분리 이유·바뀐 점으로 조정했다. HJM 공통 배치, 번뚝 결과 저장/검수 연결, Hubble 표시/편집 분리를 기존 확인 기록으로 설명한다. 기본 도식은 전체 연결 하나만 표시하며 개별 계약과 저장소 설명은 접힌 상세로 보존한다. 이전 guidelines 주소로 열어도 상세를 자동 펼치지 않는다.

## 발전 이력 — 2026-10-19 추가

포트폴리오 UI 변경이 아닌 솔루션 자체의 발전을 기록한다. #history에 최신순 6개 전환점을 배치하고 기록 기준일·변경 성격·배경·변경·확인한 결과를 표시한다. 전체 연혁 전수 조사를 완료한 목록은 아니다. 임의 버전이나 서비스 출시일을 만들지 않는다. 향후 항목은 날짜·근거·확인 범위를 갖춰 src/EvolutionHistory.tsx와 한국어 원본에 추가한다.

근거: 2026-08-12 HJM c548fb21, 09-04 중앙 docs/design/APP_MANAGEMENT_HISTORY_2026-09-04.md §1·4·6, 09-10 docs/design/STANDARD_ADOPTION.md HJM 0.9.1→0.9.8, 10-15 docs/design/HJM_SHARED_STRUCTURE_ADOPTION.md 후속 점검, 10-18 docs/design/STANDARD_ADOPTION.md 및 BACKGROUND_JOB_ADOPTION.md §7, docs/legacy/FLUTTER.md. 내부 문서는 공개 링크로 노출하지 않고 요약과 문서명을 표시한다.


## 발전 이력 주제별 확장 — 2026-10-19

큰 구조·설계 변경을 다 담되 한곳에 쌓지 말라는 요청으로 기존 6개를 36개 항목으로 확장했다. 디자인 시스템 / 웹·앱 경험 / 서버·데이터 / 운영·배포 / 개발 체계의 5개 탭에서 해당 주제만 표시한다. 각 주제는 최신순이며 배경과 변경을 먼저, 확인 결과와 근거는 펼침으로 제공한다. 과거 설계의 후속 폐기·검증 제한을 보존한다. 조사 대상과 항목별 원본은 [발전 이력 근거](EVOLUTION_HISTORY_SOURCES.md)에 남긴다.


## Git 이력 확장 — 2026-10-19 후속

사용자가 전체 Git을 확인해 빠진 큰 작업을 채우도록 요청했다. 36개에서 72개로 늘리고 주제를 8개로 나눴다. AI·생성 실행, 인증·데이터 보호, 마케팅 운영을 분리해 서버·데이터 한곳에 쌓이지 않게 했다. 주제별 최신순·핵심 문제와 설계 변경 우선·결과와 근거 펼침을 유지한다. 전수 추출과 선별 원문 검토의 범위를 [조사 기록](history-audit/README.md)에 구분했다.


## 운영과 QA 분리 — 2026-10-19

사용자 요청으로 ‘운영과 개선’을 운영과 QA 두 장으로 분리했다. 운영은 산출물 식별·실제 상태 관측·중복 실행 방지·데이터 호환성을 고려한 복구와 마케팅을 담는다. QA는 화면·로직/데이터·사용자 여정·네이티브 환경별 확인 방법과 ExploreQA의 명시적 실행 경계, 결과 기록을 설명한다. 근거는 중앙 DEPLOYMENT_POLICY, deployment/OPERATIONS_MONITORING, QA_REPORT_STANDARD다. 운영과 QA에 각각 6단계 도식을 배치하고 전체 개발 흐름은 설계의 접힌 상세로 보존했다. #operations·#qa를 추가하고 기존 #workflow·#strategy·#marketing은 운영으로 연결한다. 이 설명은 전 제품의 운영 정상 또는 QA 통과를 보증하지 않는다.

확인: 개발용 타입 검사와 변경 파일 diff 검사 통과. 브라우저에서 운영·QA 선택과 이전 주소 연결, 390px 화면의 페이지 넘침 없음 및 도식 내부 스크롤, 운영→QA→발전 이력 링크를 확인했다. 기존 설치 HJM Card.badges 관련 배포 빌드 제한은 이번 변경 범위에서 재검사하지 않았다. 공개 배포하지 않았으며 4319 미리보기를 유지한다.


## 구조 탭과 읽기 순서 — 2026-10-19

사용자 요청으로 제품과 결과를 제품으로 줄이고 QA 뒤로 옮겼다. 소개 → 구조 → 설계 → 운영 → QA → 제품 → 발전 이력 → 연락 순서로 탭과 다음 장 링크를 맞췄다. 구조는 실제 루트 폴더와 portfolio.json을 대조한 텍스트 트리와 역할 설명을 제공한다. 현재 존재하는 제품 8개와 공용 모듈 3개를 표시하며 중앙 README의 오래된 Flutter 설명은 옮기지 않았다. 주요 문서 경로만 표시하고 생략 범위·기준일을 명시한다. 독립 Git 저장소 경계와 제품/공통 책임, 현재 checkout/역사 기록의 구분을 설명한다. 트리는 보조 기술이 읽을 수 있는 텍스트이며 좁은 화면에서 내부 스크롤한다.

개발용 타입 검사 통과. 데스크톱에서 탭 순서·트리 표시, 390px에서 8개 탭 및 다음 장 이동과 페이지 가로 넘침 없음을 확인했다. 공개 배포는 수행하지 않았다.


## 설계의 top-down 서술 — 2026-10-19

사례가 먼저 나와 전체 그림을 잡기 어렵다는 사용자 요청으로 설계 탭을 전체 연결 → 클라이언트·HJM 책임 → 서버·DB·캐시·비동기 실행 → 상태·자원 수명 → 변경·검증 경계 순으로 재구성했다. 기본 본문만으로 연결과 분리 이유를 읽을 수 있게 하고 HJM·번뚝·Hubble 사례를 관련 설명 바로 아래에 배치했다. Hubble은 별도 프로젝트 사례임을 명시하고 공통 시스템 구성 요소로 표현하지 않는다. 기존 상세 계약·모듈 지침·개발 흐름은 해당 절의 펼침으로 보존한다. 전체 도식은 서버 사용 제품의 논리 구조이며 정적 웹에 같은 실행 구성을 강제하지 않는다고 설명한다.

확인: 개발용 타입 검사 통과, 데스크톱 제목 순서·기본 접힘 상태와 390px에서 5개 상세 펼침·페이지 가로 넘침 없음·운영으로 이어지는 링크 확인. 공개 배포는 하지 않았다.


## 설계·운영 Step UI — 2026-10-19

사용자가 각 설계 단계 도식화와 Step UI를 요청했다. 설치된 HJM Steps 공개 타입 및 사용 지침을 확인해 공통 Steps로 각 절의 위치를 표시한다. 모든 본문은 그대로 아래로 읽히며 현재 절 앞 단계는 앞선 설명을 뜻한다. 검증 성공·독자 열람 완료로 표시하지 않고 숫자 표지를 유지한다. 설계 전체 도식은 보존하고 화면·서버·상태·변경 단계에 AreaFlow 세로 도식과 절 사이 연결 문장을 추가했다. 운영도 배포 → 관측 → 복구 → 개선 4단계로 나눠 Steps와 세로 도식을 제공하고 지침·마케팅 상세는 개선 단계에 보존했다.

QA의 ‘필요한 범위만 검증’은 sunken 톤 때문에 그림자가 없었다. 사용자 요청으로 HJM Card raised 톤을 적용했으며 별도 그림자 CSS는 추가하지 않았다. 개발용 타입 검사 통과, 390px에서 설계·운영의 현재 단계 표시와 세로 도식 텍스트 경계·페이지 가로 넘침 없음, QA 카드 실제 box-shadow 적용을 확인했다. 1440px에서도 설계 5개·운영 4개 Steps와 넘침 없음을 확인했다. 공개 배포는 하지 않았다.


## 단계 선택형 화면으로 수정 — 2026-10-19

사용자 정정으로 설계·운영의 반복된 표시 전용 Steps를 상단 한 개의 선택형 Steps로 바꿨다. 각 단계 클릭 시 해당 절의 도식·설명만 표시한다. 이전·다음 버튼도 같은 상태에 연결하고 본문 시작을 볼 수 있도록 단계 레일로 스크롤한다. HJM 기본 Steps는 이전 단계만 허용하므로 읽기 전용 설명에서 명시적으로 선택하는 descriptor.navigationMode=free를 공통 계약과 Web·Native에 추가했다. 기본 linear 및 handler 없는 표시 전용은 보존한다. 이는 checkout 소스에 구현됐으며 패키지 게시·공개 배포는 하지 않았다.

확인: 포트폴리오 개발용 타입 검사, Steps 계약 20개·Web 관련 2개·Native 관련 1개 테스트 통과. 실제 브라우저에서 설계 5개·운영 4개 단계 자유 이동과 한 절만 표시, 이전 단계 이동 및 390px 가로 넘침 없음을 확인했다. Native는 mock 기반 동작 테스트이며 실기기 QA를 뜻하지 않는다.


## 2026-10-19 전체 화면 최종 검토

소개·구조·설계·운영·QA·제품·발전 이력·연락의 8개 탭, 설계 5단계·운영 4단계, 발전 이력 8주제 72항목과 상세 계약을 검토했다. 앱·웹 계약 6개, 서버 계약 6개, 지침 영역 8개는 각각 펼쳐 읽었다. 이번에는 전체 Git 이력을 새로 추출하지 않았으며 기존 `EVOLUTION_HISTORY_SOURCES.md`의 근거와 현재 화면·제품 카탈로그·폴더 구조를 대조했다.

- 개인 서비스 7개와 사이트 포함 apps 저장소 8개의 집계 차이를 명시했다.
- 태그라운드 카드에도 Spint로 제품 방향을 흡수한 사실을 반영했다. 코드 전체 이식으로 표현하지 않았다.
- QA의 반복 설명, 설계·제품에 그대로 반복되던 Hubble 결과, 연락의 반복 질문을 정리했다. 단계 선택 방식과 3개 노드의 개선 도식에 맞게 안내를 수정했다.
- 지침 링크를 실제 운영의 개선 단계로 연결했다. 같은 탭 내 해시 진입도 해당 단계·펼침 상태를 초기화해 `#guidance`, `#marketing`, `#discontinued` 목적지를 보장한다.
- 비행중·Utilverse 정책·지원 카드를 추가했다. 정책 주소는 기존 생성 projection을 소비하며 생성물은 수정하지 않았다.
- 발전 이력의 특정 미배포 화면에 종속된 문구와 측정 근거 없이 개선량을 암시하던 운영 소개를 구현 범위의 설명으로 바꿨다.

확인: 1200px 데스크톱에서 전체 탭·단계·이력 주제 화면을 확인하고 390px 모바일에서 8개 탭, 설계·운영 단계, 이력 주제 전환의 가로 넘침과 이미지 누락을 검사했다. 상세 계약 12개와 지침 8개도 개별 펼침으로 확인했다. 공개 스토어·제품 웹·정책·Storybook 주소 39개가 HTTP 200을 반환했다. 응답 성공은 스토어의 기기별 설치 가능 여부나 제품 기능 검증을 뜻하지 않는다. 변경 범위 `pnpm typecheck`와 `git diff --check`를 통과했다. 타입 검사는 현재 Node 26.11.1에서 실행해 저장소의 Node 24.20.0 지정 경고가 있었다.

로컬 HJM 소스 연결 기준의 확인이다. 설치 패키지의 기존 `Card.badges`·새 Steps 계약 호환성과 게시·공개 배포는 이번 화면 검토로 확인하지 않았다. 하단 이전·다음 단계 버튼은 재도입하지 않았다.


## 2026-10-19 실제 모듈 기반 시스템 아키텍처

설계 탭은 개발 방법보다 모듈 책임·의존·데이터 흐름을 먼저 보여주도록 5단계로 재편했다. 전체 → 앱·웹 → 서버 → 공용 기반 → 실제 흐름을 유지하고, 각 단계에 도식과 역할·연결 계약·분리 이유를 둔다. 총 7개 도식이다. 개발 절차와 모듈 지침 카드는 운영의 개선 단계로 이동했다.

확인한 원본:

- 포트폴리오 루트 `portfolio.json`의 modules 등록: HJM, App Release Hub, qa-framework.
- HJM `module.contract.json`: design-contracts / react / react-native 공개 진입점.
- Release Hub `module.contract.json`, `README.md`: 앱 설정, 신규 등록 CLI, 공용 release workflow, 정적 policy projection. 상시 제품 서버·DB로 그리지 않는다.
- ExploreQA `module.contract.json`, `README.md`, `exploreqa/jev.py`: 제품 provider, runner, control-host의 observe·act·finding, JEV 판정.
- 번뚝 `apps/web/package.json`, `apps/mobile/package.json`, `packages/app-core/src/index.ts`, `packages/core/src/index.ts`, `packages/bridge/src/index.ts`: 실제 공용 패키지 소비와 역할.
- 번뚝 `apps/server/src/app.module.ts`, `worker.ts`, `reviewer.ts`, `ai/ai.module.ts`, `ai/ai.controller.ts`, `ai/generation-jobs.ts`, `ai/review/review.processor.ts`: API·worker·reviewer 실행 구분과 생성·후속 검수 경로.

특히 최초 생성은 API의 AI 스트림이며 BullMQ로 전달되는 작업과 같지 않다. 생성 후 검수는 별도 2D·3D 큐와 reviewer가 수행한다. GenerationJobStore의 Redis 기록과 Creations의 영속 저장도 분리해 표시한다. 연결 종료 뒤 이어받기는 API 프로세스 재시작에 대한 내구성 보장으로 표현하지 않는다. 다른 제품 전체에 번뚝 패키지·실행 구성을 일반화하지 않는다.

검증: 로컬 소스 연결 타입 검사 통과. 1200px·390px에서 5단계 전환과 총 7개 SVG 렌더링, 페이지 넘침 없음, 도식 라벨의 상자 너비 초과 없음 확인. 생성 실행·ExploreQA 실행·공개 배포는 수행하지 않았다.


## 2026-10-19 공통 아키텍처로 범위 수정

사용자 요청은 특정 제품 사례가 아니라 전체 공통 설계였다. 앞 절의 번뚝 중심 설명을 현재 설계 화면에서 제거하고 5단계 모두 공통 책임·계약으로 교체했다. 현재 화면은 전체 → 앱·웹 → 서버 → 공용 기반 → 요청·결과다.

앱·웹은 플랫폼 렌더러, HJM 구성, 제품 코어·화면 모델, 업무·전송 계약, API client·플랫폼 어댑터를 표현한다. 서버는 API·업무 서비스·DB와 선택적인 Redis 캐시·큐·워커·외부 어댑터를 연결한다. 마지막 도식은 동기 결과와 선택적 비동기 처리의 공통 요청·결과 흐름이다. 제품 전용 클래스·API·패키지·검수 파이프라인은 제거했다. 공용 모듈 HJM·Release Hub·ExploreQA는 유지한다.

근거는 중앙 WEB_NATIVE_REFERENCE_ARCHITECTURE, BACKGROUND_JOB_POLICY, SERVER_CACHE_POLICY의 역할·계약 경계다. 패키지 수나 물리 배치를 전 제품에 강제하는 그림이 아니며 제품별 채택 완료를 주장하지 않는다. 상세 펼침의 제품별 구현 예시도 선택 구성 기준으로 바꿨다.

확인: 타입 검사 통과. 1200px·390px에서 5단계 및 펼침 내용을 확인했으며 특정 제품 이름·생성 전용 클래스·2D/3D 검수 문구가 남지 않았다. 페이지 가로 넘침 없음. 앱·웹 도식의 긴 영역 제목은 720px 그룹 안에 표시되며 240px 노드 라벨은 너비를 초과하지 않는다. 공개 배포는 수행하지 않았다.

## 발전 이력 갱신 (2026-10-21)

최근 구현을 선택 대조해 6개 전환점을 추가하고 8주제 78개 항목으로 갱신했다. 색상·버튼 변경을 낱개로 나열하지 않고 공통 API, 카드 합성 경계, 편지 페이지, 사진 입력 복구, DB 기준선, 네이티브 의존성 경계로 묶었다. 주제별 최신순과 결과·근거 펼침 구조는 유지한다. 검토 범위와 원본은 EVOLUTION_HISTORY_SOURCES.md의 같은 날짜 절을 따른다.
