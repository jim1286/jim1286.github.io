---
schema: hjm.app-document/1
document: product
app_id: "portfolio-site"
display_name: "Portfolio Site"
status: draft
owner: "jimin"
reviewed: "2026-09-09"
version: "1.0.0"
---

# Portfolio Site 제품 계약과 이관 현황

공식 개발자 소개, 앱별 소개와 스토어·정책·지원 링크의 공개 진입점을 제공한다.
앱 기능을 실행하거나 계정을 관리하는 제품 서버는 제공하지 않는다.

## 데이터 책임

| 내용 | 원천 | 갱신·검증 |
| --- | --- | --- |
| 앱 소개·표시 상태 | [siteData.ts](../src/siteData.ts) | 앱 저장소·공식 스토어의 공개 사실 대조 후 리뷰 |
| 정책·지원 경로 | App Release Hub 공개 policy projection | `policy:sync` 후 source/snapshot 검사 |
| 화면·이미지 | [App.tsx](../src/App.tsx), `public/` | 로컬 preview에서 링크·반응형 확인 |

정책 본문과 계정 삭제 처리는 외부 공식 사이트가 소유한다. 이 사이트에 입력 양식·추적·계정
기능을 추가하면 개인정보 흐름과 보존·삭제 책임을 설계한 뒤 구현한다.

## 완료 조건과 현재 상태

- 구현 변경은 `pnpm check`를 통과해야 한다.
- 공개 URL 변경은 원본 비교와 실제 링크 확인을 포함한다.
- 표시 버전은 수동 데이터다. 스토어 검증 날짜·근거를 기록하는 별도 evidence registry는 미이관이다.
- 공통 v1 계약 이관은 완료했다. 구현 준수 및 required merge gate 설치는 별도 미완료이며 기존 QA는 제품 행동 검증으로 유지한다.

## 90. Acceptance criteria

| ID | 기준 | 검증 방법 | 상태 | Evidence ID |
| --- | --- | --- | --- | --- |
| PROD-001 | Portfolio Site의 PRODUCT에 기록된 핵심 사용자 여정을 완료하고 결과를 확인한다. | 대표 persona 5명의 moderated usability test | pending | EV-001 |

## 91. Evidence registry

| ID | 타입 | 위치 | 상태 | 소유자 | 캡처 시각 | digest |
| --- | --- | --- | --- | --- | --- | --- |
| EV-001 | PROD-001 | report | docs/evidence/planned/product-usability.md | — | — | planned | jimin |

<!-- hjm-contract-evidence
{
  "category": "product",
  "criteria": [
    {
      "id": "PROD-001",
      "category": "product",
      "statement": "Portfolio Site의 PRODUCT에 기록된 핵심 사용자 여정을 완료하고 결과를 확인한다.",
      "verification": "대표 persona 5명의 moderated usability test",
      "status": "pending",
      "evidenceIds": [
        "EV-001"
      ]
    }
  ],
  "evidence": [
    {
      "id": "EV-001",
      "criterionIds": [
        "PROD-001"
      ],
      "type": "report",
      "location": "docs/evidence/planned/product-usability.md",
      "status": "planned",
      "owner": "jimin"
    }
  ]
}
-->
