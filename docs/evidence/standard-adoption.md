# 공통 계약 이관 검증

2026-09-09 · [이관 결정](../decisions/ADR-0900-common-standard-adoption.md)

## 결과와 실행 명령

작업 트리와 격리 소스 복사본에서 `pnpm standard:check`가 각각 종료 코드 **0**으로 완료됐다.
중앙 계약 stage는 **governance-scaffold**다. 이 기록만으로 planned 제품 acceptance와 foundation
증빙을 verified로 바꾸지 않았다.

| runtime | 실행 위치 | 실제 framework | 필수 검사 |
| --- | --- | --- | --- |
| web | `.` | vite 7.3.6 | lint: `pnpm run lint`<br>typecheck: `pnpm run typecheck`<br>test: `pnpm run test`<br>build: `pnpm run build` |

Node 24.20.0 / pnpm 11.24.0, Flutter runtime은 3.44.3으로 실행했다.
격리 복사본은 Git 추적 파일과 비무시 소스를 복사하고 `.git`, node_modules, 개발자 환경 파일,
기존 빌드·생성 코드를 제외했다. `CI=1 pnpm install --frozen-lockfile` 후
`CI=1 pnpm standard:check`를 실행했다. Yajalal은 modules/server의 별도 frozen install도 수행했다.
전역 패키지 캐시·SDK를 재사용한 로컬 검증이며 GitHub 원격 실행 결과가 아니다.

준비 명령과 Flutter fixture는 계약에 선언했다. 기존 실제 환경 파일은 보존한다.
최종 실행기의 도구 버전 사전 검증과 fixture 덮어쓰기 거절은 중앙 회귀 테스트로 확인했고,
JS·Flutter 대표 앱에서 역할별 명령으로 다시 실행했다.

## 로그와 한계

- 전체 작업 트리 로그: `/tmp/adoption-quality-portfolio-site.log`
- 격리 소스 실행 로그: `/tmp/adoption-clean-portfolio-site.log`
- 격리 로그 SHA-256: `038d87dbb60b9bd928988616595711540acce28b5f45f66d23d012e777c1f7c3`
- Expo export 또는 웹·서버 빌드는 서명·스토어 제출·운영 배포를 뜻하지 않는다.
- 기존 제품 CI는 유지하고 `.github/workflows/app-standard.yml`을 추가했다.
- 실기기, 실제 provider, 운영 DB, 디자인 parity, 원격 required gate, 스토어 심사는 미검증이다.
- 커밋·푸시·배포는 수행하지 않았다. 임시 로그 경로는 영구 보관소가 아니다.
