# 발전 이력의 근거와 조사 범위

## 2026-10-22 일일 갱신 — 기존 주제 보강

새 항목을 늘리지 않고 복구·공용 데이터 표현 항목을10/21 근거로 보강했다.
Spint `ade5380c`의 backup.py/pull-backup.py 및 `b6300db8`의 실행 기록,
다에리 `8a853b4c`의 RELEASE 기록, 오늘야구 `7987f3e4`의 배포·암호화 백업 구현과
`4b127550`의 SERVER_OPERATIONS 기록을 대조했다. 격리 복원과 운영 DB 전환은 구분하며
이번 갱신에서 DB 복원이나 운영 상태 조회를 재실행하지 않았다.
공용 차트는 HJM `94cfb138`의 null 보존·선택적 누락 연결과 게시 `88f0a7ae`(1.39.0),
포트폴리오 `3005a84`·`28f95e2`의 실제 채택·기존 공개 검증을 근거로 보강했다.
Utilverse `c247a8f`의 Google native bridge·삭제 조정과 ADR-0080을 대조해 기존 인증 항목을 보강했다.
ExploreQA `927ecd2`의 Tauri 셸·엔진 소유 수명과 DESKTOP_APP의 macOS 개발 확인을 대조해 기존 QA 항목을 보강했다.
실제 제공자 로그인·Windows 설치·공개 서명은 이 소스 검사로 완료 처리하지 않았다.
나머지 신규 커밋은 작은 수정·반복 버전/배포/제출 기록 또는 기존 주제의 범위로 선별했다.
저장소별 확인 SHA·접근 실패·보류 후보는 중앙 research/2026-10-22의 일일 게시 기록에 남긴다.

## 2026-10-21 갱신 — 최근 구현의 선택 검토

기존 72개에 주요 변경 6개를 더해 78개로 정리했다. 10월 19일 이후 현재 로컬 checkout의 최근 커밋에서 후보를 고르고 아래 원본의 구현·설계 기록을 대조했다. 전체 ref·모든 diff를 다시 전수 조사하거나 운영·스토어·기기 상태를 새로 검증한 작업은 아니다. 기존 2026-10-19 전수 추출 범위와 구분한다.

| 항목 | 원본 | 확인 범위 |
| --- | --- | --- |
| 선택 표시·표면 | HJM `035799a5` — component-recipes.ts, colors.ts, 각 렌더러 | solid 탭·brand 선택과 기본 표면의 계약 |
| 카드 곁그림·보조 정보 | HJM `035799a5` changeset / Diairy `e2193ed` DESIGN | CompositionLayout 슬롯과 제품 채택 |
| 편지 전체 페이지 | Diairy `e2193ed` LetterPageLayout·reply 경로 | 상단 배경·스크롤·답장 경로 |
| 탑승권 사진 입력 | Unairplane `79cba8c` BoardingPassScannerScreen | 카메라/보관함·취소/오류 때 이전 결과 보존 |
| DB baseline 통합 | Spint `c7010b4` docs/design/SERVER.md §16 | 설계 기록과 migration diff. DB 상태를 새로 조회하지 않음 |
| 네이티브 의존성 경계 | Diairy `3d617ac`, Utilverse `05f7f1e`, Choose Window `7b412ed` | 공개 export·반사 생성자 보존 설정. 새 바이너리·기기 실행 미검증 |

## 최신 확장 — Git 전체 ref 조사

2026-10-19 후속 요청으로 **72개 주요 항목 / 8개 주제**로 확장했다. 기존 36개에 36개를 더했으며 삭제 복구·위젯·Expo 이관의 근거도 보강했다. 13개 저장소의 5,044개 커밋을 추출·분류한 범위와 수동 검토의 차이는 [Git 조사 기록](history-audit/README.md)에 적었다. Taground는 사용자 설명에 따라 Spint 흡수 관계로 정리하되 실제 코드 이식과 구분한다. 모펀 원격 보관 저장소도 이번에는 확인했다.

## 최초 36개 작성 당시 범위

2026-10-19: 작은 개발 수정 대신 큰 구조·설계 변경을 주제별로 보여 달라는 요청에 따라 36개 항목을 다섯 주제로 묶었다. 모든 항목을 한 긴 연표에 쌓지 않고 주제별 탭에서 선택한다.

## 조사 범위

로컬에 남아 있는 중앙 저장소와 등록된 11개 독립 저장소의 HEAD 도달 가능 커밋 4,774개를 목록화했다. 설계·결정·변경 기록 경로 456개를 별도로 추렸고 주제에 맞는 결정문·적용 기록과 선택한 커밋의 변경 범위를 확인했다. 모든 커밋 diff나 모든 문서를 정독한 전수 구현 감사는 아니다. Git 추적 Markdown 전체 경로 수는 아래에 남긴다. 제목 목록의 확인을 본문 검증으로 세지 않는다.

Taground·모펀은 카탈로그상 archived/absent이며 로컬 전체 이력을 열람하지 못했다. 중앙에 남은 과거 적용 기록만 참고했다. 원격 브랜치·삭제된 기록·모든 대화·실제 운영 상태는 이번 조사에 포함하지 않았다. 따라서 복원 가능한 큰 작업을 확장한 기록이며, 모든 과거 작업을 빠짐없이 복원했다고 주장하지 않는다.

| 저장소 | 조사 시 HEAD | 커밋 수 | 추적 Markdown 경로 수 |
| --- | --- | ---: | ---: |
| portfolio | `e7a0f7693146e384a8aeb7a1b3403caa08375008` | 481 | 449 |
| burntok | `397ece657de8085221f4100e819c67a6964c23bc` | 603 | 444 |
| choose-window | `92752ef6bfd4e36895d1e52868497f1bb923e1cd` | 203 | 48 |
| portfolio-site | `2a33971d8e5dfa74d744ad9c5764687a9094615d` | 160 | 51 |
| unairplane | `b6d48f71ac59f220b29303b03cc6cdab2a5ca03c` | 236 | 83 |
| yajalal | `a82a61cd9aa78f8691ee55d7cad33c7bcdb33ecf` | 787 | 150 |
| spint | `4f2db1a8025bae9aee57ac8e6a77ecf12b4cabfe` | 335 | 124 |
| diairy | `1c17eac97a6d71a914058b884172351f0d6461c0` | 480 | 299 |
| utilverse | `c5a42b9b209a0bcaaac65e089723b0d650dfaf1b` | 288 | 148 |
| hjm-design-system | `94caa4ed52c161fe6f545b6b4a16ccc7806a9b4d` | 575 | 668 |
| app-release-hub | `5be34807402e3dff3e28b6bdb66863bfe27aec7f` | 407 | 335 |
| qa-framework | `527ea4f61e608a6312bf5d1840c7b614a5379d34` | 219 | 90 |

## 추가 항목과 원본

공개 화면에는 문서명·짧은 커밋 식별자만 표시한다. 아래 경로는 포트폴리오 루트 기준이며 `경로@SHA`는 해당 독립 저장소의 Git 기록이다.

| 주제 | 날짜 | 항목 | 근거 |
| --- | --- | --- | --- |
| design | 2026-10-18 | 카탈로그를 공개 구성의 단일 등록부로 통합 | `packages/hjm-design-system@bb640b7e` — HJM bb640b7e · 845c8edf. |
| design | 2026-10-17 | 웹·네이티브의 공통 화면을 같은 기준으로 비교 | `packages/hjm-design-system@d0ffb038` — HJM d0ffb038 · 4004b6a2 · 2d3aba5d · 4e87ebc9. |
| clients | 2026-10-18 | 기존 Flutter 제품을 Expo 중심으로 전환 | `apps/choose-window@13460b94` — 선택의창 13460b94 · Flutter 레거시 기록. 이후 실행 지원 퇴역 이력과 연결됩니다. |
| clients | 2026-10-04 | 언어 등록부에서 앱·웹·서버의 문구 경로 연결 | `docs/design/I18N_ADOPTION.md` — 다국어 확장 적용 기록. 과거 Flutter 적용과 현재 Expo 경로를 구분합니다. |
| clients | 2026-10-03 | 제안·투표 중심 흐름을 하나의 대화방으로 단순화 | `apps/utilverse/docs/decisions/ADR-0070-single-chat-room-instagram-dm.md` — ADR-0070 · 소스 반영 기록. 실제 기기 수용 확인은 별도입니다. |
| clients | 2026-09-28 | 웹·앱을 구름 우체국이라는 하나의 경험으로 재설계 | `apps/diairy@536be486` — 다에리 536be486 · ADR-0009. |
| clients | 2026-09-09 | 편지 계약과 자산·계정을 웹·앱에서 공유 | `apps/diairy@4c34e783` — 다에리 4c34e783 · 9e2d36c5. |
| clients | 2026-09-03 | 연결이 끊겨도 이어지는 비행 도메인과 지도 | `apps/unairplane/docs/decisions/ADR-0004-bundled-coastline-route-map.md` — ADR-0003 이륙 기준 비행 · ADR-0004 번들 지도. |
| clients | 2026-09-03 | 앱과 위젯을 공유 스냅샷 계약으로 연결 | `apps/unairplane@0080a37d` — 비행중 0080a37d · ADR-0001. |
| clients | 2026-08-07 | 웹·앱 개발을 공유 패키지 기반으로 구성 | `apps/burntok@7cbad9ae` — 번뚝 7cbad9ae · 모바일 Expo 경로 기록 351e7440. |
| data | 2026-10-17 | 백업 복구 뒤 삭제 정보가 되살아나지 않도록 기록 | `apps/diairy@e380a9fb` — 다에리 e380a9fb. |
| data | 2026-10-08 | 항공편 검색을 출처 검증과 개인정보 경계로 설계 | `apps/unairplane/docs/decisions/ADR-0006-grounded-flight-lookup.md` — ADR-0006 · 2026-10-08 서버 운영 확인 / native 화면 검증 전. |
| data | 2026-10-03 | 생성 콘텐츠와 호스트 앱을 실행 브리지로 분리 | `apps/burntok@8cf3a88a` — 번뚝 8cf3a88a · 040f8bf6. |
| data | 2026-10-02 | 작성 내용과 불확실한 전송 의도를 함께 복구 | `apps/utilverse/docs/decisions/ADR-0039-durable-chat-and-comment-composition.md` — ADR-0039 · 후속 수정·삭제·신고 복구 ADR-0064. |
| data | 2026-10-01 | 계정 삭제를 DB 정리와 외부 제공자 작업으로 분리 | `apps/utilverse/docs/decisions/ADR-0027-account-deletion-http-and-provider-jobs.md` — ADR-0027 계정 삭제 HTTP와 제공자 작업. |
| data | 2026-10-01 | 투표 마감을 DB 트랜잭션과 내구성 워커로 묶음 | `apps/utilverse/docs/decisions/ADR-0029-recurring-cycle-calendar-and-db-worker.md` — ADR-0029 · 후속 제품 변경 ADR-0070. |
| data | 2026-09-30 | 네이티브 인증 시도와 회원 세션의 수명 분리 | `apps/utilverse@6b19b878` — 6b19b878 · ADR-0005 · ADR-0006. |
| data | 2026-09-29 | 콘텐츠 생성을 독립 작업으로 분리 | `apps/burntok@65a33539` — 번뚝 65a33539. |
| data | 2026-09-27 | 기기 기반 신원에서 회원 기반 콘텐츠 관리로 전환 | `apps/spint@7fe24399` — Spint 7fe24399 · ADR-0008 → ADR-0009. |
| data | 2026-09-04 | 공간 데이터와 집계 워커의 책임 분리 | `apps/spint@9f856978` — Spint 9f856978 · ADR-0005. |
| data | 2026-04-27 | AI 응답 경로를 모듈화하고 검증 연결 | `apps/yajalal@9e16a0ca` — 오늘야구 9e16a0ca. |
| data | 2026-04-21 | 데이터 수집을 동시성·부분 실패·브라우저 격리로 재설계 | `apps/yajalal@38ca452f` — 오늘야구 eb00d8c0 · 7582836d · 38ca452f. |
| ops | 2026-10-17 | 배포 의도와 제품별 실행 큐를 명시 | `.@d6ed9f69` — 중앙 저장소 d6ed9f69. |
| ops | 2026-10-09 | 개발 Mac과 배포 Mac의 실행 책임 분리 | `docs/ci/DEV_MAC_CI_RETIRED.md` — 개발 Mac CI 철거 기록 · 호스트 역할 설계. |
| ops | 2026-10-09 | 정적 산출물로 사이트 게시 환경 독립 | `control-plane/app-release-hub@0887f68e` — Release Hub 0887f68e · 포트폴리오 정적 사이트 실행서. |
| ops | 2026-10-08 | OTA를 바이너리 호환성과 복구 조건에 연결 | `docs/design/OTA_ADOPTION.md` — OTA 적용 기록 · 다에리 8245dcab. |
| ops | 2026-09-26 | 네이티브 빌드와 스토어 제출을 별도 단계로 분리 | `control-plane/app-release-hub@04bc2537` — Release Hub 04bc2537. |
| ops | 2026-09-03 | 대시보드·DB·로컬 워커를 걷어내고 CLI·CI로 집중 | `control-plane/app-release-hub@9118ac30` — Release Hub 9118ac30 · 선행 CLI 전환 71303c2e. |
| quality | 2026-10-04 | 분석 이벤트를 제품 계약과 플랫폼 연결로 관리 | `.@ec3b1276` — 중앙 저장소 ec3b1276 · 분석 참조 설계. |
| quality | 2026-09-28 | 공통 QA 엔진과 제품별 실행 훅을 분리 | `tooling/qa-framework@72824e55` — ExploreQA 72824e55 · 782c9041 · 5536c5e0. |

## 기존 여섯 항목

HJM 초기 계약·공개 API 확장·화면 구성 공통화, 중앙 baseline, 캐시/비동기 계약, Flutter 실행 지원 퇴역은 기존 docs/DESIGN.md의 근거를 유지한다. Expo 제품 이관과 Flutter 실행 지원 제거는 각각 제품 구현과 공통 운영 체계의 별개 변경으로 나눴다.

## 편집 기준

- 같은 구조 개선을 여러 제품에 반복 적용한 것은 공통 항목으로 묶는다. 버전 상승·작은 간격·문구·버튼 수정은 제외한다.
- 제안 문서만 있는 내용을 구현 완료로 올리지 않는다. 소스 커밋·당시 검사·운영 확인·스토어 공개는 서로 다르다.
- Utilverse 투표 워커는 후속 UI 제거를 함께 표시한다. Spint의 초기 탈퇴 보존안은 후속 콘텐츠 제거 결정으로 대체됐음을 명시한다.
- 현재 성능·전환율·오류 감소 수치는 자료 없이 추가하지 않는다. 이전 검사 기록은 이번 실행 결과로 세지 않는다.

## 이번 변경 확인

- `pnpm typecheck` 통과: 문구 등록부 843 keys 및 화면 타입.
- 390px / 1440px에서 다섯 주제 전환·표시 개수·가로 넘침 확인. 모바일 상세 펼침과 최신순 정렬 확인.
- 변경 경로의 공백 오류 검사 통과. 이번에는 production build·공개 배포를 실행하지 않았다. 기존 공유 Card.badges 게시 타입 문제는 이 콘텐츠 변경에서 수정하지 않았다.
- 4319 미리보기는 사용자의 검토를 위해 유지한다. 임시 조사 목록·확장 스크립트는 제거하고 근거는 이 문서에 보존한다.

## 2026-10-23 일일 갱신

전일 마지막 확인 SHA 이후의 독립 저장소 커밋·변경 경로를 대조하고 다음 공개 설명의 구현을 읽었다. 반복 버전 상승·작은 배치 수정·운영 영수증은 개별 항목으로 늘리지 않았다. 미커밋 작업은 근거로 사용하지 않았다.

- `imageflow` 신규: HJM `e47c49a5`의 웹 이미지 뷰어와 모달 초점 계약, Spint `d21f4d62`, Diairy `12079817`, Utilverse `2f5a9c34`의 사진 소비 흐름 및 `2ba59fc1`의 비동기 파일 쓰기 대기를 대조했다. HJM1.40.0 게시본과 그 이후 미게시 테마 작업을 구분했다.
- `versionedconsent` 신규: BurnTok `5d114c3c`·`69469a01`·`1cbb14d1`의 서버 정책 메타데이터·동의 버전 대조·문서 로딩과 Diairy `14ca18c7`의 버전별 보관 기간 안내를 확인했다. 실제 이용자의 열람이나 보관 기간 전환 효과는 주장하지 않는다.
- `strongselection` 보완: HJM `61a18ee6`의 선택형 시간 휠과 `f3c9fe93`·`88ba6e84`의 중립 선택 역할과 브랜드 실행 색 분리를 반영했다. 이 소스는1.40.0 게시 이후 커밋이므로 게시·모든 앱 채택 완료로 확대하지 않았다.
- `releaseintents` 보완: Hub `ef493bf2`의 앱 버전/자산 심사 분류와 `3cfdee9b`의 저장된 전달 결과 대조, Utilverse `da3d7ee0`·`13b665d9`의 소비를 확인했다. 제출 기록이 스토어 공개 완료를 뜻하지 않음을 유지한다.

확인 기준 SHA와 원격 접근 결과는 중앙 `research/2026-10-23/history-cursor.json`, 게시 결과는 같은 날짜 `portfolio-daily-publication.json`에 남긴다. 제품 스토어 릴리스·설정·운영 데이터 변경은 이 작업에서 실행하지 않는다.

## 2026-10-24 일일 갱신

마지막 성공 cursor 이후 등록 저장소별 커밋 메타데이터·변경 경로를 대조했다. 미커밋 작업은 완료 근거에서 제외하고 작은 UI 수정·반복 패키지 채택·전달 영수증은 개별 항목으로 만들지 않았다.

- `privateroom`: BurnTok00f99305의 방·멤버·메시지 영속화와 웹/앱 소비, e660bb97의 편집/삭제·읽음 수,6afb52fb의 기록 비우기와 읽음 구분,9898b10b의 양방향 차단 가시성 적용을 선택 검토했다. docs/RELEASE.md의 웹/서버 배포 기록과 모바일 스토어 관측은 구분한다.
- `stepsrail`: HJMc54d768f의 Steps 공개 타입, 웹/네이티브 표현, 두 Storybook 예제를 대조했다. Focus Rail 기본 표현과 선택형 개요·세로 상세는 단일 cursor와 기존 이동 정책을 유지한다. 모든 소비 앱의 기기 QA 완료를 주장하지 않는다.
- `jobs` 보완: Diairy544f3583의 컨트롤러 일시 중지 후 실행 루프가 종료된 worker 복구 조건과 Redis 재현 테스트를 확인했다. 운영 처리량·효과는 측정하지 않았다.

정확한 확인 cursor와 공개 artifact 검증은 중앙 research/2026-10-24/history-cursor.json 및 portfolio-daily-publication.json에 남긴다. 기존 기록의 당시 검증 범위는 이 실행 결과로 재사용해 확대하지 않는다.

## 2026-10-26 일일 대조 — 10/25 구현

- `memberprofiles`(safety, 소스 기록일10/25): Spint `5bd8c6cb`·`631fdf3`·`2fbe4a5`, 다에리 `33a2ca61`·`68ac9c87`·`cd7a7b4`. Spint의 members service/repository·차단/가입 상태 테스트, 다에리의 profile-person 권한 판정·PersonPage/PersonScreen·사진 API를 대조했다. Spint의 공개 프로필 참조와 편지 ID 기반 다에리 경로를 같은 식별 방식이라고 합치지 않는다. 사진 편집·정원 배치의 작은 후속 수정은 이 항목에 묶었다.
- `sharedinteractions`(design, 소스 기록일10/25): HJM `1c4f4ea6`·`e8912382`·`a62157db`, 번뚝 `60194b09`, 선택의창 `54bc9d9`. 웹/네이티브 회원 행동·ProfileSummary.nameEdit·공통 설정·날짜 범위 계약과 관련 테스트 사례, 1.47.0 게시 산출물/제품 채택 커밋을 대조했다. 제품별 버전 상승·간격 보정·반복 배포를 별도 발전 항목으로 늘리지 않는다.
- 마지막 성공 cursor 이후 접근 가능한 독립 저장소의 main/tag를 갱신해 커밋 메타데이터와 변경 경로를 확인했다. 위 선택 항목의 구현을 읽었으며 전체 패치의 모든 줄/실기기·전수 회귀를 검증했다는 뜻은 아니다. Hub 소셜 작업 기록·파이프라인 보완은 기존 contentops 흐름, 나머지 세부 수정·릴리스 기록은 기존 주제의 후속 변경으로 분류했다. 원격 없는 보관 제품은 기존 이력을 유지했다.

## 2026-10-27 일일 대조 — 10/26 구현

- `baseballwidgetrefresh`: 오늘야구 `147bfef4`·`f89ddfcc`·`e5aa9d3f`. 서버와 앱의 공유 경기 투영, iOS 위젯 타임라인과 Android worker 경로, 위젯·잠금화면 표현 및 RELEASE 문서의 서버 운영 응답과 검사 범위를 대조했다. OS가 앱 종료 후 실제 호출한 시점과 실기기 갱신 지연은 미확인이다. 배포 반복과 작은 화면 보정은 묶었다.
- `sharedsharesheet`: HJM `2f2263a4`·`7e2e3372`. 웹·네이티브 ShareSheet, 제품 수신자/전송 경계, 시스템 공유 취소·종료 처리와 관련 테스트 소스, 게시 산출물을 대조했다. 공유 시트 종료를 전달 완료로 해석하지 않는다.
- 독립 저장소의 기준 SHA 이후 커밋 메타데이터·경로 및 선택한 구현을 확인했다. HJM 버전 채택과 배포 기록을 개별 발전으로 늘리지 않았다. 전체 패치 정독·모든 제품 실기기 검증을 뜻하지 않는다.
