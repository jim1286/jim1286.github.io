---
schema: hjm.app-document/1
document: architecture
app_id: "portfolio-site"
display_name: "Portfolio Site"
status: draft
owner: "jimin"
reviewed: "2026-10-08"
version: "1.1.0"
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
source synchronization은 공개 origin·path template·앱 ID와 게시 소유권·정확한 공개 정책 URL만 복사한다. snapshot digest는
projection 무결성 비교에 사용하며 외부 승인·진위 보증은 아니다.

## 문구·전략 도식

2026-10-08 공유 i18n 작업을 통합해 `src/i18n/ko.ts`를 표시 문구의 원천으로 유지한다.
`src/copy.ts`는 화면용 의미 별칭이며 독립 문구 사본이 아니다. 현재 지원 언어는 한국어 하나다.
정적 `/ko-KR/` 진입 파일은 빌드 뒤 생성한다.

사용자가 개발·마케팅 전략 도식을 요청해 `src/StrategySection.tsx`에 공통 UI 기반 흐름을 넣었다.
확대·내보내기용 HTML은 [도식 원천과 재생성 안내](diagrams/README.md)의 JSON으로 생성한다.
작은 화면에서 큰 SVG를 축소하는 대신 본문은 순서 목록을 사용한다.
정책 snapshot schema 2와 계약 문서 버전 1.1.0은 이번 원천·화면·운영 변경을 함께 기록하며
심사 자격증명이 있는 Hub 전체 프로필을 공개 데이터로 복사하지 않는다.

## 공개 호스트

2026-10-09 사용자 요청으로 jmstudioapps.com을 대표 origin으로 사용한다. Node runtime 서버 없이 Vite dist를
기존 VPS Caddy가 제공하며 www는 대표 origin으로 이동한다. 공개 정적 파일과 비공개 배포 manifest를 분리하고
source·archive/file digest를 검증해 원자 승격한다. 기존 Pages source/built artifact 설정 불일치를 유지하는
도메인 별칭 대신 직접 게시 경로를 택했다. [배포 실행서](../deploy/static-site/README.md)를 따른다.

## 검사

`pnpm check`는 i18n·문서 링크·snapshot·단위 검사·production build를 포함한다.
정책 sync 테스트는 임시 원본/출력으로 원본 부재·원본 drift·생성물 변조·잘못된 경로를 검증한다.
브라우저/기기별 UI, 외부 링크 가용성, 공개 배포 결과는 별도 확인 대상이다.

## 90. Acceptance criteria

| ID | 기준 | 검증 방법 | 상태 | Evidence ID |
| --- | --- | --- | --- | --- |
| ARCH-001 | runtime에서 순수 domain package 방향으로만 의존한다. | dependency boundary test와 architecture review | pending | EV-002 |

## 91. Evidence registry

| ID | 기준 | 타입 | 위치 | 캡처 시각 | digest | 상태 | 소유자 |
| --- | --- | --- | --- | --- | --- | --- | --- |
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


다국어 등록부·로더·소비 경계와 언어 추가 절차는 [다국어 확장 설계 적용](design/I18N_EXPANSION.md)을 따른다.
