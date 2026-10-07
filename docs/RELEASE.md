---
schema: hjm.app-document/1
document: release
app_id: "portfolio-site"
display_name: "Portfolio Site"
status: draft
owner: "jimin"
reviewed: "2026-10-08"
version: "1.1.0"
---

# Portfolio Site 검사·배포

## 1.1.0 릴리스 후보 — 2026-10-08

HJM 1.16의 공개 화면·구성·컴포넌트 계약을 전면 적용하고 공유 i18n 작업을 통합했다.
소개 문구·사용자 지정 사진·개발/마케팅 전략 도식을 반영하고 HJ 이니셜을 제거했다.
정책 게시 소유권을 보존해 BurnTok 법률 링크의 404를 수정했다. 화면과 정보 구조의 변경으로
제품 버전은 1.0.0에서 다음 minor인 1.1.0으로 올리며 계약 문서 버전도 함께 맞춘다.
서버·모바일 표면이 없는 제품이므로 가상의 앱/서버 버전은 추가하지 않는다.

TypeScript 7 변경은 [PR #24](https://github.com/jim1286/jim1286.github.io/pull/24)로
main `5e8dcddffa8985cadd530ec83d2481ccc67ac447`에 실제 병합됐다. 1.15 소비 브랜치의
`8867b7e`는 main에 patch-equivalent이며 폐쇄·삭제된 의존성 제안은 되살리지 않는다.
공유 checkout의 미커밋 i18n은 제품 원천·로더·검사를 선택 통합했고 다른 세션의 원본 파일은
삭제하지 않았다. 화면·도식·외부 링크 검증은 [제품 QA](qa/2026-10-08-hjm-adoption.md)에 기록한다.
원격 릴리스 CI와 공개 배포 결과는 실제 완료 후 별도로 기록한다.

## 실행 순서

저장소 루트에서 `.nvmrc`와 `packageManager`의 exact Node/pnpm을 사용한다.

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm run preview
```

| 단계 | 명령 | 의미 |
| --- | --- | --- |
| 독립 checkout/CI 품질 | `pnpm check` | local docs·snapshot·단위 검사·production build |
| 원본 동기화 | `pnpm policy:sync` | 접근 가능한 Hub의 공개 값에서 snapshot과 TypeScript 생성 |
| 원본 비교 | `pnpm policy:check` | Hub 원본·snapshot·생성물 일치. Hub가 없으면 실패 |
| snapshot 비교 | `pnpm policy:check:snapshot` | 저장된 공개 snapshot·digest·생성물 비교. Hub 최신 상태는 미검사 |
| 배포 | `pnpm deploy` | 원본 비교·전체 check 후 `dist/`를 gh-pages로 게시 |

다른 Hub checkout을 쓰면 `HUB_CONFIG_DIR=/path/to/app-release-hub/config`를 명령에 전달한다.
정책 원본 변경이 의도된 것인지 리뷰한 후에만 sync를 실행하고 두 생성 산출물을 함께 반영한다.

2026-10-08 실제 링크 QA에서 BurnTok의 app-owned 정책을 공용 사이트 주소로 생성해 404가
나는 결함을 확인했다. snapshot schema 2는 제품별 게시 소유권과 정확한 공개 URL을 digest에
포함한다. `app.json`의 `store.*Url`을 우선하고 app-owned의 누락은 오류로 처리한다. 보관된
제품은 Hub와 같은 `retired.json` binding을 사용해 남아 있는 정책 문서를 유지한다.
프로필 전체를 복사하는 대안은 심사 자격증명이 공개 생성물에 섞일 수 있어 배제하고 공개 URL과
게시 소유권만 투영한다. 기존 schema 1 snapshot은 검증된 Hub 원본으로 다시 생성한다.

## CI와 공개 배포

[app-standard.yml](../.github/workflows/app-standard.yml)은 `app.contract.json`의
`qualityGate.trigger: version-bump`와 `releaseVersions: [{ path: "package.json", kind: "web" }]`에서
중앙 `sync-standard`가 생성한다. 2026-10-01 사용자의 버전 상승 때만 CI 실행 결정과
2026-10-08 기존 CI 정합성 수정 요청에 따라 일반 PR·소스 push는 자동 품질 검사를 시작하지 않는다.
main의 `package.json` 변경만 가벼운 release-intent가 이전 push와 현재 제품 버전을 비교하며,
버전이 증가한 경우 frozen install·공통 계약·문서·타입·테스트·빌드를 새로 실행한다. 의존성이나
설정만 바뀌고 제품 버전이 같으면 품질 job은 건너뛴다. 명시적 `workflow_dispatch` 진단은 main에서 가능하다.
버전 상승 때 이전 성공 검사를 이어받는 대안은 현재 릴리스 후보를 검사하지 않으므로 사용하지 않는다.
제품 minor 버전 상승은 최종 QA·통합 후 별도로 수행하며 이 설정 변경 자체는 버전을 올리지 않는다.

2026-10-06 사용자 결정으로 lint·format 검사는 제거했다. private Hub 접근을 가정하지 않으며
snapshot 검증의 범위를 유지한다. 배포 명령은 추가로 Hub 원본 검사를 요구하고, workflow는 자동 배포하지 않는다.

빌드 산출물은 `dist/`다. 공개 게시 후 개발자/앱/정책 링크를 확인한다. 문제가 있으면
이전 검증 source로 같은 배포 절차를 실행한다. 실제 gh-pages 게시 상태, branch protection,
서명된 artifact provenance와 복구 drill은 이번 문서/CI 추가만으로 검증 완료가 아니다.

## 웹 업데이트·캐시·복구

이 제품은 단일 정적 웹이며 모바일 updater나 앱 서버는 없다. 2026-10-08 사용자의 전체
OTA 연결 요청은 이 제품에서는 검증된 `dist/`의 GitHub Pages 게시와 브라우저 재조회로
이행한다. 네이티브 EAS Update나 새 Service Worker를 설치하는 대안은 이 runtime에
필요하지 않으므로 사용하지 않는다. 현재 소스에도 Service Worker 등록은 없다.

GitHub Pages는 `gh-pages`의 루트를 공개한다. Vite가 생성한 JS/CSS는 내용 hash 파일명으로
구분하고, HTML과 `public/`의 고정 이름 자산은 호스트의 실제 캐시 정책을 따른다.
2026-10-08 배포 전 공개 루트 응답은 `Cache-Control: max-age=600` 및 ETag를 반환했다.
이 호스트에서 임의의 no-cache/immutable 헤더를 설정했다고 주장하지 않는다. 게시 뒤
일반 URL의 HTML·참조 자산·프로필 사진이 새 산출물과 일치하는지 확인하고, 아직 이전
응답이면 전파·캐시 만료 후 재확인한다. 기존에 열린 탭을 강제로 다시 로드하지 않는다.

배포 기록에는 source SHA, 제품 버전, 게시 전·후 `gh-pages` SHA, Pages build 상태와
공개 `/`·`/ko-KR/` 직접 진입/새로고침 결과를 남긴다. 게시 CLI 성공만으로 공개를 판정하지 않는다.
복구는 마지막 정상 `gh-pages` commit을 별도 임시 디렉터리에 체크아웃해 그 검증된 정적
산출물을 기존 publisher로 다시 게시한다. source를 다시 빌드했다면 새 artifact로 구분한다.
Git history를 reset/force-push하는 대안은 복구 이력을 지우므로 사용하지 않는다.
실제 복구 리허설이 없으면 복구 절차 문서화와 복구 검증 완료를 구분한다.

## 2026-09-08 배포 정책 적용

[공통 정책](https://github.com/jim1286/app-portfolio/blob/main/docs/DEPLOYMENT_POLICY.md)과 [실행 지침](https://github.com/jim1286/app-portfolio/blob/main/docs/deployment/WEB_SERVER_DEPLOYMENT.md)을 따른다.

현행 수동 pnpm deploy를 유지한다. 검증한 source·빌드 산출물과 실제 gh-pages 게시 상태를 따로 기록한다. 이전 source 재빌드는 새 산출물이며 이전 bytes를 그대로 복구한 것으로 표시하지 않는다.

## 90. Acceptance criteria

| ID | 기준 | 검증 방법 | 상태 | Evidence ID |
| --- | --- | --- | --- | --- |
| RELEASE-001 | source와 artifact digest가 고정된 preview build에서 핵심 smoke를 통과한다. | 제품 RELEASE의 실제 배포 경로에서 build/source와 smoke evidence 확인 | pending | EV-007 |

## 91. Evidence registry

| ID | 기준 | 타입 | 위치 | 캡처 시각 | digest | 상태 | 소유자 |
| --- | --- | --- | --- | --- | --- | --- | --- |
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
