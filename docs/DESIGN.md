---
schema: hjm.app-document/1
document: design
app_id: "portfolio-site"
display_name: "Portfolio Site"
status: draft
owner: "jimin"
reviewed: "2026-09-09"
version: "1.0.0"
---

# Portfolio Site 화면 지침

개발자와 앱의 핵심 정보를 읽고 목적에 맞는 공식 링크로 이동할 수 있게 한다.
디자인 구현 원천은 [App.tsx](../src/App.tsx)와 [site.css](../src/styles/site.css)다.

- 앱 카드에는 이름·요약·상태·플랫폼과 이동 목적을 명확히 표시한다.
- 저장소, 스토어, 개인정보, 지원 링크를 의미가 드러나는 이름으로 구분한다.
- 키보드 접근·초점 표시·대체 텍스트와 읽기 순서를 유지한다.
- 좁은 화면, 큰 글자, 긴 한국어/영문 이름에서 겹침과 잘림을 확인한다.
- 실제 배포 상태가 확인되지 않은 앱을 공개 출시 상태로 표시하지 않는다.

## 이관·검증 현황

2026-09-09에 HJM Provider와 Container·Stack·Text·Icon을 실제 화면에 연결했다.
[빌드 후 Chromium 관찰](evidence/verified/hjm-browser-20260909/index.md) 여섯 조건은 통과했지만
기존 브랜드 CSS의 토큰 이관과 전체 의미·접근성 준수는 아직 진행 중이다. 접근성 자동 검사,
브라우저별 screenshot, 큰 글자/키보드·screen reader evidence는 아직 공통 registry로
규격화되지 않았다. `pnpm check` 성공을 해당 UI 검증 완료로 대체하지 않는다.

## 90. Acceptance criteria

| ID | 기준 | 검증 방법 | 상태 | Evidence ID |
| --- | --- | --- | --- | --- |
| DESIGN-001 | Portfolio Site의 실제 frontend에서 기본·오류·빈 상태와 접근성, HJM foundation 의미 계약을 검증한다. | light/dark와 큰 글자를 포함한 parity review | pending | EV-003, EV-008, EV-009, EV-010, EV-011, EV-012 |

## 91. Evidence registry

| ID | 타입 | 위치 | 상태 | 소유자 | 캡처 시각 | digest |
| --- | --- | --- | --- | --- | --- | --- |
| EV-003 | DESIGN-001 | review | docs/evidence/planned/design-parity.md | — | — | planned | jimin |
| EV-008 | DESIGN-001 | automated-test | docs/evidence/planned/design-system-provider-boundary.md | — | — | planned | jimin |
| EV-009 | DESIGN-001 | automated-test | docs/evidence/planned/text-foundation.md | — | — | planned | jimin |
| EV-010 | DESIGN-001 | automated-test | docs/evidence/planned/icon-foundation.md | — | — | planned | jimin |
| EV-011 | DESIGN-001 | automated-test | docs/evidence/planned/stack-foundation.md | — | — | planned | jimin |
| EV-012 | DESIGN-001 | automated-test | docs/evidence/planned/container-foundation.md | — | — | planned | jimin |

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
        "EV-012"
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
    }
  ]
}
-->
