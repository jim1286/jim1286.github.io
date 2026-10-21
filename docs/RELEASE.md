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

## 1.2.0 아이콘 최신화 공개 배포 — 2026-10-21

현재 앱 설정 원본에 맞춘 7개 아이콘 중 공개 사이트에 남아 있던 번뚝·다에리·Spint·선택의창·비행중
5개 이미지를 갱신했다. 관련 원본 경로와 공개 반영 확인 기준은 [앱 자산 안내](APP_ASSETS.md)를 따른다.
개발 체크아웃의 미커밋 화면·테마 변경은 보존하고 배포 소스에 포함하지 않았다.

mac-ci의 clean main에서 버전을 1.2.0으로 준비하고 Node 24.20.0·pnpm 11.24.0과 게시 HJM 1.37.2로
빌드했다. source는 `4f22b83b875d9a8dca8f6f187829c85e8d83a073`이며 정적 artifact 137개 파일을 검증했다.
mac-ci에서 기존 SSH 관리 경로와 publisher로 게시했고, 공개 137개 경로의 HTTP 200·SHA-256이
artifact manifest와 일치한다. 사이트 아이콘 7개도 현재 제품 원본과 일치한다.

- Release: `/srv/portfolio-site/releases/4f22b83b875d9a8dca8f6f187829c85e8d83a073-963b6bbe4a56`
- 전송 archive SHA-256: `28c1722948d95506577ccab12d34f99c1c7d47be727a809dd143713020338c0d`
- 이전 정상 배포는 publisher의 previous 참조로 보존했다. 앱·서버·DB 배포는 이번 정적 게시에 포함하지 않는다.

## 자체 도메인 운영 — 2026-10-09

현재 기본 공개 origin은 https://jmstudioapps.com, www는 메인으로 308 이동한다.
사용자의 도메인·독립 배포 요청으로 기존 VPS Caddy의 정적 게시로 전환하며 GitHub Pages는 이전 주소 호환용으로 유지한다.
[실행서](../deploy/static-site/README.md)와 [QA](qa/2026-10-09-owned-domain-deployment.md)를 따른다.
아래 GitHub 게시 설정·명령·SHA는 당시 이력이다. 제품 버전·자동 CI trigger는 바꾸지 않는다.
현재 `pnpm run deploy`는 이미 검사한 artifact와 exact source SHA를 받는 VPS publisher다.

## gh-pages 이력 main 통합 — 2026-10-09

사용자의 병합 요청으로 원격 `gh-pages`의 `4dba815796129b946b0aa05ed97b927141ca94f8`까지의
이력을 main의 두 번째 parent로 연결하고 25개 게시 파일을 `.published/gh-pages-20261008/`에
동일 blob으로 보존했다. 루트의 개발용 `index.html`을 빌드 결과로 덮어쓰는 대안은 Vite 개발·
빌드를 깨뜨리므로 배제했다. 이 디렉터리는 이전 게시 산출물 보관용이며 현재 Pages 게시 경로가 아니다.
검사·보관 결과는 [통합 QA](qa/2026-10-09-gh-pages-main-merge.md)에 있다.

이날 GitHub API의 실제 게시 설정은 `main` + `/`, `build_type: legacy`였다. 아래 10-08의
`gh-pages` 배포 기록은 당시 이력이며 현재 설정의 증거가 아니다. 기존 `package.json#scripts.deploy`
에는 `gh-pages -d dist`가 남아 있으므로 다음 운영 배포 전에 mac-ci delivery가 main 기반 게시
방식과 현재 설정을 연결해야 한다. 이 Git 병합을 새 웹 배포·공개 화면 검증으로 보고하지 않는다.

## 1.1.0 공개 배포 — 2026-10-08

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
[PR #26](https://github.com/jim1286/jim1286.github.io/pull/26)은 main
`fa11db62d4f814cb7ab3d992c689afb9a723cdd2`로 병합됐다. 해당 커밋의 버전 상승 품질 검사
[37686418093](https://github.com/jim1286/jim1286.github.io/actions/runs/37686418093)가 성공한 뒤
동일한 clean source에서 `pnpm deploy`를 실행해 Hub 원본 비교와 전체 검사를 다시 통과했다.

게시 전 gh-pages는 `0f3e1070821309a2da0eb2f2c5ac63cadc52b259`, 게시 후는
`4dba815796129b946b0aa05ed97b927141ca94f8`이다. [Pages 실행
37686559888](https://github.com/jim1286/jim1286.github.io/actions/runs/37686559888)은 성공했고
provider의 built 상태를 확인했다. 2026-10-08 06:04 KST 일반 공개 URL 8개(루트·한국어 경로·
사진·OG·도식 2개·JS/CSS)의 HTTP 200 및 로컬 배포 산출물과 바이트 일치를 확인했다.
공개 호스트의 실제 캐시는 계속 max-age=600이며 캐시 정책을 변경한 것으로 기록하지 않는다.
실제 복구 리허설은 미실행이다.

## 현재 실행 순서 (2026-10-17 대조)

저장소 루트에서 `.nvmrc`와 `packageManager`의 exact Node/pnpm을 사용한다.
변경한 동작의 검사는 개발 단계에서 선택하며 `pnpm check` 전량 실행을 게시 조건으로 붙이지 않는다.

| 단계 | 명령 | 의미 |
| --- | --- | --- |
| 원본 동기화 | `pnpm policy:sync` | 의도한 Hub 공개 값 변경을 snapshot과 TypeScript에 투사 |
| 원본 비교 | `pnpm policy:check` | Hub 원본·snapshot·생성물 일치. Hub가 없으면 실패 |
| snapshot 비교 | `pnpm policy:check:snapshot` | 저장된 공개 snapshot·digest·생성물 비교. Hub 최신 상태는 미검사 |
| 정적 빌드 | `pnpm build` | 입력 정합성·타입·Vite 번들·locale 페이지. 테스트 실행 없음 |
| artifact 준비/검증 | `pnpm deploy:prepare` / `pnpm deploy:verify` | 새/빈 절대 output 경로와 exact source SHA를 인자로 받음 |
| 게시 | `pnpm deploy` | 검증된 artifact·SSH 대상·키 파일 경로·exact source SHA를 받는 VPS publisher |

실제 인자와 공개 확인·복구 순서는 [정적 사이트 실행서](../deploy/static-site/README.md)를 따른다.
다른 Hub checkout은 `HUB_CONFIG_DIR`로 지정한다. 정책 원본 변경을 확인한 뒤 sync하고 공개
snapshot과 생성물을 함께 반영한다. 프로필 전체나 심사 자격증명은 공개 생성물에 복사하지 않는다.
app-owned 정책의 정확한 URL과 보관된 제품의 정책 링크를 유지한다.

## CI와 공개 배포

2026-10-14 최소화 지시에 따라 별도 품질 workflow는 없다. 삭제된 `app-standard.yml`이나
과거 `qualityGate.trigger`를 복원하지 않는다. 정적 사이트 게시에 앱 버전 상승을 임의로 붙이지 않는다.
빌드 입력의 언어/정책 정합성은 유지하되 i18n 생성기 단위 테스트를 빌드마다 실행하던 연결은
2026-10-17에 제거했다. 검사 도구는 변경 범위 또는 명시적으로 선택한 전체 감사에서 사용한다.

빌드 산출물은 `dist/`이며 공개 게시 대상은 준비한 artifact의 `public/`이다. 게시 전후 파일 집합·
bytes/hash와 source를 구분하고 공개 URL·정책 링크를 확인한다. publisher 성공만으로 공개를 판정하지 않는다.

## 웹 업데이트·캐시·복구

현재 공개는 VPS Caddy의 정적 artifact 교체다. GitHub Pages는 옛 주소의 이동 안내를 유지하는
호환 계층이며 제품의 새 `dist` 배포 대상이 아니다. 모바일 updater나 새 Service Worker를 추가하지 않는다.
현재 Caddy 템플릿은 HTML no-cache, 내용 hash assets 1년 immutable, 나머지 300초를 설정한다.
이는 소스 설정이며 이번 감사에서 운영 헤더를 새로 확인한 결과는 아니다.

배포 기록에는 source SHA·manifest/hash·공개 확인 결과를 남긴다. 복구는 실행서의 host lock 아래
기존 previous artifact와 edge snippet을 원자 복원하는 경로다. 소스를 다시 빌드하면 새 artifact로 구분한다.
과거 gh-pages SHA와 HTTP 결과는 위 날짜별 역사 기록이며 현재 반복 게시/복구 명령으로 사용하지 않는다.
실제 복구 리허설과 절차 문서화를 구분한다.

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

## 1.2.1 HJM 및 기본 테마 반영 준비 — 2026-10-21

사용자가 HJM 1.38.0 전사 적용 후 순차 배포를 승인했다. 이전 1.2.0 아이콘 공개 배포 뒤의
게시 HJM 1.38.0과 현재 화면·기본 테마 소스를 포함하는 patch다. 정적 artifact의 source와
파일 hash를 고정해 검증하며 실제 게시와 공개 화면 확인은 별도 단계다.
