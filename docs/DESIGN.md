---
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

개발자와 앱의 핵심 정보를 읽고 목적에 맞는 공식 링크로 이동할 수 있게 한다.
디자인 구현 원천은 [App.tsx](../src/App.tsx)와 [site.css](../src/styles/site.css)다.

- 앱 카드에는 이름·요약·상태·플랫폼과 이동 목적을 명확히 표시한다.
- 저장소, 스토어, 개인정보, 지원 링크를 의미가 드러나는 이름으로 구분한다.
- 키보드 접근·초점 표시·대체 텍스트와 읽기 순서를 유지한다.
- 기본 좁은 화면, 긴 한국어/영문 이름에서 겹침과 잘림을 확인한다. 최대 글자 및 그 최대값 모사 확대는 사용자 지시로 범위에서 제외한다.
- 실제 배포 상태가 확인되지 않은 앱을 공개 출시 상태로 표시하지 않는다.

## 포슬이 앱 카드 진입점

소셜 소개에서 들어온 사람은 첫 화면에서 포슬이 승인 그림, 앱별 한 문장 설명, 확인된 플랫폼 링크를 함께 본다. 2026-09-28 사용자가 질문을 연속해서 던지는 말투를 줄이라고 한 뒤, 네 카드 모두 질문이던 초안을 제품 행동을 설명하는 문장으로 바꿨다. 영상이 없는 이 페이지에 있던 영상 콘셉트 고지도 제거하고, 영상 고지는 각 영상 게시물에 둔다. 기존 개발자 포트폴리오의 상세 카드와 공식 문서 링크는 아래에 유지한다. `/#posli` 직접 진입은 React가 화면을 만든 뒤 해당 구역으로 즉시 이동한다. 모바일 390px·데스크톱 1440px에서 실제 렌더를 확인했고, 버튼은 플랫폼별로 구분되며 가로 넘침이 없었다. 검토 중 HJM 중립 링크 토큰이 어두운 버튼 안에서도 진한 글자를 만든 것을 발견해 버튼 영역의 `--hjm-color-text-body`를 밝게 지정했다. 이 국소 오버라이드는 HJM Link 컴포넌트를 유지하면서 읽을 수 있는 대비를 확보하기 위한 것이다.

## 이관·검증 현황

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
