# QA — e2e·통합 및 CI 최소화

## 1. 최종 판정

CI 생성·범위 판정 관련 검사 통과, 실제 GitHub CI는 미실행. 기록 2026-10-12T10:26:41+09:00.

## 2. 대상과 이력

portfolio-site, main, HEAD `ba283164e7cd642ed01f53a4698dd3a7fdf647b9` + 미커밋 변경. Codex. 이번 작업에 한해 사용자 승인으로 개발 Mac에서 CI 수정. 기존 공유 dirty 변경 보존, commit/push/version 변경 없음.

## 3. 환경과 범위

개발 Mac Node v24.20.0, 합성 Git/workflow/runtime fixture로 변경 경계만 검증. 실제 앱 전체·기기·운영 API·스토어 검증은 미실행.

## 4. 변경 결과

CI 판정은 해당 workflow의 이전 성공 first-parent SHA와 비교한다. 변경 경로가 단일 runtime 내부이면 그 표면과 workspace 의존 패키지만 검사한다. 공유 패키지·lockfile·tools·모르는 경로는 전체 표면 검사, 이전 성공 이력/판정 실패 및 manual dispatch도 전체 검사다. 문서/엄격한 version-only manifest는 검증된 이전 결과를 승계하고 현재 계약 검사는 유지한다.

범위 판정은 release-intent에서 한 번만 수행하며, GitHub 이력 조회는 최대 50회→100개 이력 목록 1회로 변경. metadata-only release의 무거운 test job은 runner를 배정받기 전에 생략한다. worker/서명/버전/배포 대상은 변경하지 않았다. 중앙 generator와 8개 소비 projection을 함께 수정했다.

root Vite runtime은 source 변경 시 검사한다. 문서/엄격한 package.version-only 후보는 성공 이력에서 테스트를 승계한다. 별도 e2e/DOM harness는 추가하지 않았다.

## 5. 검사 결과

중앙 ci-change-scope/release-quality 12건, runtime-bindings 관련 5건, 생성 workflow 1건 및 generated design checker 3건 통과. 8개 canonical workflow와 번뚝 product gate·야잘알 server-test YAML parse/참조 검사 통과. 앱 전체 검사는 실행하지 않았다.

## 6. 미확인 범위

실제 GitHub 실행/소요 시간·전체 테스트·배포 미확인. 현재 변경은 main 미커밋 상태이며 push하지 않았다. 새 실행에서 scope 및 소요 시간을 확인해야 한다.

## 7. 보관 처리

근거와 실행 결과는 이 리포트에 보존. 이번 raw log/JSON/임시 fixture는 제거하며 기존 다른 작업 원본은 보존. 모든 앱에 main worktree 1개만 존재하고 새 branch/worktree 생성 없음.

## 추가 지시 반영 — 자동 CI 최소 조건

2026-10-12 “필수조건들만 남기고” 지시로 canonical 자동 gate를 source/의존성 사전 검사와
변경 runtime 타입 검사로 축소했다. 전체 unit·통합·E2E·문서·디자인 감사는 manual이며 실제
배포 artifact build·identity/readiness는 유지한다. source/installed dependency 검사 통과,
workflow YAML/dependency 검증 통과. 전체 테스트·실제 CI 시간·배포/공개 미실행.
모바일 Hub의 반복 CI 제거는 새 불변 tag 게시·caller 채택 이후 적용된다. 현재 local main
미커밋이며 archived taground/mofun은 checkout이 없어 새 배포 경로를 만들지 않았다.

## 배포 흐름 후속 개편 (2026-10-12)

전체 배포 조사에 따라 canonical source/scope/helper를 갱신했다. 서버·웹은 품질 완료 이벤트와
원래 push 범위 receipt로 연결하고 polling을 제거했다(해당 workflow가 있는 제품만).
8개 canonical gate dry-run drift 0, root 관련 검사 통과. 이번 변경은 로컬 미커밋이고
원격 CI·배포·시간 절감 실측은 미실행이다. 전체 조사·제품별 실패·검증·반영 조건은
[공통 개편 QA](https://github.com/jim1286/app-portfolio/blob/main/docs/qa/2026-10-12-deployment-flow-redesign.md)를 따른다.
