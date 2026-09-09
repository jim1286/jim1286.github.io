# Portfolio Site 라이브러리 적용 정책

기준: 2026-09-08. [포트폴리오 공통 정책](https://github.com/jim1286/app-portfolio/blob/main/docs/LIBRARY_POLICY.md)과
[Query 정책](https://github.com/jim1286/app-portfolio/blob/main/docs/libraries/TANSTACK_QUERY_POLICY.md)을 이 저장소에도 적용한다.
라이브러리 선택은 제품의 framework·runtime 경계 안에서 하며, 모듈마다 별도 원칙을 복제하지 않는다.
중앙 변경을 아직 게시하지 않은 로컬 적용에서는 함께 둔 `app-portfolio` checkout의 같은 경로를 원문으로 읽는다. GitHub 링크는 게시 후 소비 경로이며 원격 반영 완료를 뜻하지 않는다.

웹 renderer와 빌드 도구가 주 범위다. TanStack Query runtime은 없다. 소개 콘텐츠를 원격 캐시 라이브러리로 감싸지 않는다. UI 패키지와 도메인 콘텐츠는 분리하며 배포는 RELEASE 문서의 수동 경로를 따른다.

대표 구현의 실제 진입 파일·수정 근거·동작 검사·미검증 범위는 [2026-09-08 구현 경계 조사표](https://github.com/jim1286/app-portfolio/blob/main/docs/audits/2026-09-08/LIBRARY_BOUNDARIES.md)의 이 저장소 행을 따른다. manifest와 lock의 전체 위치·직접 선언은 같은 감사의 `library-inventory.json`이 기록한다.

## 의존성 및 변경 계약

- 실제 버전은 각 manifest와 lockfile이 원문이다. 중앙 [등록부](https://github.com/jim1286/app-portfolio/blob/main/docs/library-policy.json)의 `portfolio-site` 항목은 채택한 라이브러리·허용 버전 계열·Query 소스 소유권을 기록한다.
- 적용 분류: `framework`, `toolchain`, `ui`.
- manifest 추가·이동·삭제는 중앙 `repositories.portfolio-site.manifests`와 실제 패키지 소비 관계를 함께 갱신한다. 빈 manifest도 등록한다.
- 새 라이브러리·다른 major 계열·Git/path source 변경은 사용 목적, 기존 기능 중복, renderer/서버 경계, 제거 방법과 관련 검증을 기록한 뒤 중앙 등록부도 갱신한다.
- HTTP는 runtime별 공용 transport, runtime 입력은 소유 schema, 비밀은 secure adapter, UI 로컬 상태는 화면/도메인 owner를 사용한다. 별도 캐시·HTTP client·schema를 화면에서 임의로 만들지 않는다.
- 버전 숫자를 맞추기 위한 framework 호환성 무시나 불필요한 패키지 추가는 하지 않는다. peer·SDK·빌드 도구는 해당 호환성 계약을 우선한다.

## 검사와 증거

포트폴리오 루트에서 다음을 실행한다. 독립 checkout의 설치·제품 검사는 해당 저장소의 기존 명령을 사용한다.

```bash
npm ci --ignore-scripts --prefix scripts/library-policy-tools
node scripts/check-library-policies.mjs --module portfolio-site
```

중앙 검사는 direct manifest 경로·등록·버전 계열·근거 파일 존재와 등록된 Query key factory/생성 위치를 검사한다. 문서 내용의 정확성이나 모든 간접 호출까지 증명하지 않는다.
API 요청의 모든 입력, 계정 격리, persistence race, 실기기 동작은 해당 행동 테스트와 QA로 확인한다.
이 문서와 정적 검사 통과만으로 전체 library API의 런타임 검증이나 원격 required gate 설치를 주장하지 않는다.

## 공통 계약 도구 연결 — 2026-09-09

`yaml`은 중앙 검사기가 runtime별 pnpm/pub lockfile을 구조적으로 읽기 위한 개발 전용 의존성이다.
본문 문자열 검색으로 다른 importer의 버전을 오인하지 않도록 도입했다. 앱 bundle에서 import하지 않는다.
Flutter 제품의 루트 package.json은 이 검사 도구만 설치하며 실제 앱은 pubspec.yaml 계약을 유지한다.

HJM contracts와 React renderer는 공통 UI 계약 및 foundation 적용을 위해 exact 버전으로 채택한다. 기존 화면의 foundation 이관·시각 evidence는 별도 pending 기준으로 추적하며 설치만으로 디자인 준수를 주장하지 않는다.
