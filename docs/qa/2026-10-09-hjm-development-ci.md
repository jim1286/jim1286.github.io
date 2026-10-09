# QA 리포트 — HJM 개발 후보 CI

검토일: 2026-10-09 · 판정: 부분 확인

## 1. 최종 판정

선택형 HJM 후보 workflow와 앱별 게시 버전을 보존하는 검사기를 로컬 반영했다. 원격 CI·제품 호환성은 미확인이다.

## 2. 대상과 이력

portfolio-site, main `785b1da5bf0e6cc3aae8e692c1bfde37868e6105`에 이번 미커밋 도구 변경 포함. Codex, 2026-10-09 Asia/Seoul.
`tools/app-standard-core.mjs`, `tools/hjm-preview.mjs`, `.github/workflows/hjm-preview.yml`이 대상이다. 포트폴리오 사이트의 기존 QA 안내 변경은 보존했고 누락 release helper 두 개를 추가했다.

## 3. 환경과 범위

macOS/Node 24.20.0. 실제 앱 설치·빌드·기기·운영 API는 실행하지 않았다. HJM 선택 버전은 1.14.0이다.

## 4. 확인 결과와 수정

중앙 HJM 버전 강제를 앱 release record 기준으로 바꿨다. 미게시 SHA 후보는 수동 workflow에서
fast(프론트엔드 타입·테스트) 또는 full(전체 타입·테스트·빌드)로 검사한다. 후보는 배포 승인이 아니다.
기존 정책 미준수는 개발 도구 선택 갱신을 막지 않지만 정식 conformance 결과에는 계속 남는다.

## 5. 검사 결과

- `node tools/hjm-preview.mjs baseline .`: 1.14.0 release/catalog identity 확인.
- 중앙 `sync-standard --only` 재실행: 갱신 0건.
- workflow YAML 파싱: 수동 트리거·fast 기본·HJM 전체 SHA 입력·배포 단계 없음 확인.
- 공통 도구 회귀: 77개 중 75 통과·기존 meta 링크 검사 1 실패·기존 1 skip. 제품 자체 테스트 결과가 아니다.

## 6. 미확인 범위

commit/push·GitHub 후보 실행·실제 제품 타입/테스트/빌드·기기 QA·배포 미실행.
workflow가 기본 브랜치에 반영된 뒤 대상 HJM SHA로 실행해야 실제 소비 호환성을 판단할 수 있다.

## 7. 보관 처리

공통 회귀 fixture와 도구 소스는 보존했다. 제품에서 원시 QA 산출물을 생성하지 않았다.
중앙 상세 보고서는 app-portfolio의 `docs/qa/2026-10-09-hjm-development-ci.md`에 있다.


## 생산성 8개 개선 후속

2026-10-09, 현재 checkout의 미커밋 변경 포함. Node 24.20.0 / pnpm 11.24.0.
중앙 개발 도구를 갱신했다. 직접 검사와 전체 계약 검사를 분리하고, runtime 선택과 로컬 compatible-major를
허용하며, CI exact pin과 정식 HJM 무결성은 유지한다. 문서 변경 범위 검사와 workflow 의미 검사도 반영했다.
중앙 관련 회귀 80 통과/1 기존 skip, HJM 전체 ci:check 성공. 제품 runtime 검사는 실행하지 않았다.
선택의창의 기존 credential 처리 변경은 보존했다. 이 기록은 제품 배포·UI·기기 검증 완료가 아니다.
원시 도구 로그는 중앙 QA 리포트에 결과를 정리한 뒤 제거한다. 패키지 버전·lockfile을 바꾸지 않았다.

## 리뷰 후속과 반영 (2026-10-09 Claude)

위 기록은 뒤처진 로컬 checkout 기준이다. 반영은 이 저장소 `origin/main` 위에서 중앙 `app-portfolio`
`1eb90cd`의 도구를 `sync-standard --only`로 다시 투영해 만들었다. 이 시점 앱이 선택한 HJM은 1.16.0이며
이번 반영은 그 버전·lockfile·제품 소스를 바꾸지 않는다.

리뷰 수정: 중앙이 커밋한 버전이 아닌 도구 수정·생성 stub은 실패로 되돌렸다. 품질 gate와 후보 workflow의
필수 단계 앞 추가 단계·의존 job 우회·env 추가를 거부한다. runtime binding 앱의 fast 후보가 build를
돌리지 않는다. 후보 workflow는 `app/.nvmrc`로 Node를 읽는다. 앱 자체 `tools/check-app-contract.mjs`는
반영 worktree에서 ready였다. 원격 후보 실행·제품 build·기기 QA는 이번 범위가 아니다.
상세는 중앙 `docs/qa/2026-10-09-hjm-development-ci.md` §9에 있다.
