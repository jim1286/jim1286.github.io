# ADR-0900 — 공통 개발 계약 채택

상태: accepted · 결정일: 2026-09-09 · 소유자: jimin

## 배경과 결정

사용자의 전체 제품 표준 이관 요청에 따라 `portfolio-default-v1` 계약을 채택한다.
기존 제품이라는 이유로 검사에서 제외하지 않으며 실제 framework·source root·lockfile·검사 명령을
`app.contract.json`의 `runtime-bindings-v1`로 연결한다. 새 framework를 생성하거나 기존 제품을
가상의 Expo/Next.js 구조로 선언하지 않는다.

| Runtime | Framework | Source root | Lockfile |
| --- | --- | --- | --- |
| web | vite | `.` | `pnpm-lock.yaml` |

## 공통 통제

- Node·pnpm 고정, 실제 importer/version/integrity 대조, manifest·entrypoint 소유 경계 검증.
- 중앙 HJM release record·catalog·foundation evidence 계약. Flutter는 Dart adapter source와 의미 대응 검증을 요구한다.
- canonical 4문서와 acceptance/evidence를 연결하며 계획을 verified로 바꾸지 않는다.
- `pnpm standard:check`는 계약·문서 검사 후 각 runtime의 준비·lint·typecheck·test·build를 실패 전파 방식으로 실행한다.
- 기존 제품 검사·배포 workflow를 유지하고 `.github/workflows/app-standard.yml`을 추가한다.

## 검증과 한계

현재 채택 stage는 governance-scaffold다. 공통 계약 검사·실행 결과는
[이관 검증 기록](../evidence/standard-adoption.md)에 기록한다. 디자인 parity, 실기기, provider,
스토어, 운영 DB 시나리오와 외부 required merge authority는 별도 검증 대상이다.
기존 test suite가 환경별로 제외하는 통합 테스트는 실행한 것으로 주장하지 않는다.

## 변경과 복구

framework/path/check 변경은 계약과 manifest·lock·문서·workflow를 함께 변경한다.
중앙 소유 파일은 중앙 `sync-standard`로 갱신한다. 오류가 나도 기존 제품 코드·계정·데이터를
되돌리거나 검사 제외 profile을 도입하지 않는다. 독립 저장소의 원격 CI 적용에는 별도 commit/push가 필요하다.
