---
schema: hjm.app-document/1
document: release
app_id: "portfolio-site"
display_name: "Portfolio Site"
status: draft
owner: "jimin"
reviewed: "2026-09-09"
version: "1.0.0"
---

# Portfolio Site 검사·배포

## 실행 순서

저장소 루트에서 `.nvmrc`와 `packageManager`의 exact Node/pnpm을 사용한다.

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm run preview
```

| 단계 | 명령 | 의미 |
| --- | --- | --- |
| 독립 checkout/CI 품질 | `pnpm check` | local docs·snapshot·lint·단위 검사·production build |
| 원본 동기화 | `pnpm policy:sync` | 접근 가능한 Hub의 공개 값에서 snapshot과 TypeScript 생성 |
| 원본 비교 | `pnpm policy:check` | Hub 원본·snapshot·생성물 일치. Hub가 없으면 실패 |
| snapshot 비교 | `pnpm policy:check:snapshot` | 저장된 공개 snapshot·digest·생성물 비교. Hub 최신 상태는 미검사 |
| 배포 | `pnpm deploy` | 원본 비교·전체 check 후 `dist/`를 gh-pages로 게시 |

다른 Hub checkout을 쓰면 `HUB_CONFIG_DIR=/path/to/app-release-hub/config`를 명령에 전달한다.
정책 원본 변경이 의도된 것인지 리뷰한 후에만 sync를 실행하고 두 생성 산출물을 함께 반영한다.

## CI와 공개 배포

[quality.yml](../.github/workflows/quality.yml)은 PR/main에서 frozen install과 `pnpm check`를
실행한다. private Hub 접근을 가정하지 않으며 snapshot 검증이라는 범위를 출력한다.
배포 명령은 추가로 Hub 원본 검사를 요구한다. workflow는 자동 배포하지 않는다.

빌드 산출물은 `dist/`다. 공개 게시 후 개발자/앱/정책 링크를 확인한다. 문제가 있으면
이전 검증 source로 같은 배포 절차를 실행한다. 실제 gh-pages 게시 상태, branch protection,
서명된 artifact provenance와 복구 drill은 이번 문서/CI 추가만으로 검증 완료가 아니다.

## 2026-09-08 배포 정책 적용

[공통 정책](https://github.com/jim1286/app-portfolio/blob/main/docs/DEPLOYMENT_POLICY.md)과 [실행 지침](https://github.com/jim1286/app-portfolio/blob/main/docs/deployment/WEB_SERVER_DEPLOYMENT.md)을 따른다.

현행 수동 pnpm deploy를 유지한다. 검증한 source·빌드 산출물과 실제 gh-pages 게시 상태를 따로 기록한다. 이전 source 재빌드는 새 산출물이며 이전 bytes를 그대로 복구한 것으로 표시하지 않는다.

## 90. Acceptance criteria

| ID | 기준 | 검증 방법 | 상태 | Evidence ID |
| --- | --- | --- | --- | --- |
| RELEASE-001 | source와 artifact digest가 고정된 preview build에서 핵심 smoke를 통과한다. | 제품 RELEASE의 실제 배포 경로에서 build/source와 smoke evidence 확인 | pending | EV-007 |

## 91. Evidence registry

| ID | 타입 | 위치 | 상태 | 소유자 | 캡처 시각 | digest |
| --- | --- | --- | --- | --- | --- | --- |
| EV-007 | RELEASE-001 | build-log | docs/evidence/planned/release-smoke.md | — | — | planned | jimin |

<!-- hjm-contract-evidence
{
  "category": "release",
  "criteria": [
    {
      "id": "RELEASE-001",
      "category": "release",
      "statement": "source와 artifact digest가 고정된 preview build에서 핵심 smoke를 통과한다.",
      "verification": "제품 RELEASE의 실제 배포 경로에서 build/source와 smoke evidence 확인",
      "status": "pending",
      "evidenceIds": [
        "EV-007"
      ]
    }
  ],
  "evidence": [
    {
      "id": "EV-007",
      "criterionIds": [
        "RELEASE-001"
      ],
      "type": "build-log",
      "location": "docs/evidence/planned/release-smoke.md",
      "status": "planned",
      "owner": "jimin"
    }
  ]
}
-->
