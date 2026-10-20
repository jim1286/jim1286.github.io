# 포트폴리오 도식

2026-10-19 앱·웹·서버 지침과 실제 코드 대조 결과를 반영했다. 도식은 공통 책임과 개발 경로를 설명하며 제품별 실행·배포 완료를 주장하지 않는다.

## 현재 원본과 표시 위치

- 문구 정본: `src/i18n/ko.ts`.
- 설계 단계: `src/SystemArchitecture.tsx`와 `src/ArchitectureDiagram.tsx`.
- 앱·웹·서버 상세: `src/ClientContracts.tsx`, `src/ServerContracts.tsx`.
- 개발·지침·HJM·마케팅 흐름: `src/FlowDiagram.tsx`, `src/WorkflowMap.tsx`.
- 운영·QA 흐름: `src/App.tsx`의 QaFlow와 ReadingFlow.

설계는 특정 제품의 폴더 구성을 공통 규칙으로 강제하지 않는다. DB·캐시·큐·worker는 선택 구성이고 실제 source/dist 소비·환경 주입·검사 설정은 제품 지침에서 확인한다. 일반 기능 수정에 배포·전체 회귀·ExploreQA를 자동 연결하지 않는다.

## 독립 도식 파일

`public/diagrams`의 workflow·development-strategy·guidelines·portfolio-workflows·design-system·shared-contracts HTML/SVG를 같은 문구 기준으로 갱신했다. HTML은 스크롤·SVG 다운로드·인쇄가 가능한 독립 문서다. 짧은 도식과 상세 설명을 함께 제공한다. shared-contracts는 독립 책임 목록이며 모든 항목을 실행하는 순서도가 아니다.

이 파일들은 게시용 스냅샷이다. 대응하는 문구나 흐름을 바꾸면 라이브 도식과 함께 갱신하고 브라우저에서 확인한다. 기존 workflow JSON과 나머지 정적 도식은 이전 제작 자료이며 현재 앱·웹·서버 개발 흐름의 정본이 아니다. 폐기한 Archify 스킬을 설치하거나 실행할 필요가 없다.

운영의 네 단계는 대상·산출물 고정, 실제 실행·관측, 중복 없는 재개·복구, 요청된 릴리스 반영으로 연결한다. QA는 영향 범위·검사 환경 선택 후 판정하며 실패할 때만 수정·재확인으로 돌아간다. 통과·실패·부분 확인·검증 불가와 운영 적용 상태는 구분한다.
