---
schema: hjm.app-document/1
document: architecture
app_id: "portfolio-site"
display_name: "Portfolio Site"
status: draft
owner: "jimin"
reviewed: "2026-09-09"
version: "1.0.0"
---

# Portfolio Site 구조

단일 React/Vite 웹 runtime이다. 브라우저의 UI와 정적 asset이 `dist/`로 빌드되며 별도
제품 API·DB·background worker는 없다. 신규 앱의 Next.js 기본 선택을 이 기존 앱에 자동 적용하지 않는다.

## 모듈과 원천

| 경로 | 책임 | 경계 |
| --- | --- | --- |
| [src/App.tsx](../src/App.tsx) | 화면 조립 | 정책 URL을 하드코딩하지 않고 생성 함수 소비 |
| [src/siteData.ts](../src/siteData.ts) | 공개 앱 소개·링크 | 비밀·사용자 데이터 금지 |
| [src/policyLinks.generated.ts](../src/policyLinks.generated.ts) | 공개 정책 projection | 직접 수정 금지 |
| [docs/policy-source.snapshot.json](policy-source.snapshot.json) | 독립 checkout의 검증 입력 | 공개 값만 포함; 최신 Hub 상태 증명이 아님 |
| [sync-policy-links.mjs](../scripts/sync-policy-links.mjs) | source/snapshot 비교와 생성 | Hub 부재 시 source 검사는 실패 |

Hub와 site는 독립 저장소다. `HUB_CONFIG_DIR`로 다른 checkout 위치를 지정할 수 있다.
source synchronization은 공개 origin·path template·앱 ID만 복사한다. snapshot digest는
projection 무결성 비교에 사용하며 외부 승인·진위 보증은 아니다.

## 검사

`pnpm check`는 문서 링크·snapshot·lint·단위 검사·production build를 포함한다.
정책 sync 테스트는 임시 원본/출력으로 원본 부재·원본 drift·생성물 변조·잘못된 경로를 검증한다.
브라우저/기기별 UI, 외부 링크 가용성, 공개 배포 결과는 별도 확인 대상이다.

## 90. Acceptance criteria

| ID | 기준 | 검증 방법 | 상태 | Evidence ID |
| --- | --- | --- | --- | --- |
| ARCH-001 | runtime에서 순수 domain package 방향으로만 의존한다. | dependency boundary test와 architecture review | pending | EV-002 |

## 91. Evidence registry

| ID | 타입 | 위치 | 상태 | 소유자 | 캡처 시각 | digest |
| --- | --- | --- | --- | --- | --- | --- |
| EV-002 | ARCH-001 | automated-test | docs/evidence/planned/dependency-boundaries.md | — | — | planned | jimin |

<!-- hjm-contract-evidence
{
  "category": "architecture",
  "criteria": [
    {
      "id": "ARCH-001",
      "category": "architecture",
      "statement": "runtime에서 순수 domain package 방향으로만 의존한다.",
      "verification": "dependency boundary test와 architecture review",
      "status": "pending",
      "evidenceIds": [
        "EV-002"
      ]
    }
  ],
  "evidence": [
    {
      "id": "EV-002",
      "criterionIds": [
        "ARCH-001"
      ],
      "type": "automated-test",
      "location": "docs/evidence/planned/dependency-boundaries.md",
      "status": "planned",
      "owner": "jimin"
    }
  ]
}
-->
