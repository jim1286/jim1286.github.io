# Git 이력 재조사 — 2026-10-19

접근 가능한 13개 저장소의 **5,044개 고유 커밋**(저장소별 SHA 기준)을 조사 대상으로 고정했다. 12개 로컬 저장소의 원격 branch와 tag를 갱신하고 모든 로컬 ref에서 도달 가능한 이력을 추출했다. 모펀은 clone 없이 GitHub API로 main과 보관 branch를 확인했다.

## 확인의 의미와 한계

- 전수: 커밋 메타데이터·변경 파일·텍스트 diff를 도구로 추출·해시·분류했다. merge는 첫 부모 대비 변경을 사용하며 다른 부모의 커밋도 ref 도달 이력에 포함된다. 바이너리는 변경 사실을 식별했으며 이미지·영상 내용 전체를 시각 검수하지 않았다.
- 수동 검토: 큰 구조 변경 후보의 파일·선택한 구현 구간·설계 기록을 대조해 공개 항목을 작성했다. 전체 패치의 모든 줄을 사람이 의미 검토했거나 모든 코드를 실행·검증했다는 뜻은 아니다.
- 커밋별 표의 `diff-extracted-and-classified`와 `selected-source-reviewed`를 구분한다. `grouped-source-change`는 원문 정독 완료나 사소한 변경 판정이 아니라, 파일/diff 분류에 포함된 소스 변경이다.
- GitHub가 모펀에서 생략한 텍스트 patch 25개는 해당 전후 blob에서 재구성했다. 잠금 파일과 테스트의 큰 diff도 제외하지 않았다.
- Taground 원격은 404이며 과거 보관 경로에도 checkout이 없다. 삭제된 Git 원문은 복구하지 못했다. 사용자가 확인한 Spint 흡수 관계와 중앙 종료 기록을 함께 사용하고 소스 이식 사실로 확대하지 않았다.
- 접근되지 않는 삭제 이력·서버 내부 ref·만료 reflog·모든 과거 대화는 포함하지 않는다. 조사 시점 이후 커밋도 별개다.

## 저장소별 범위

| 저장소 | 커밋 수 |
| --- | ---: |
| app-release-hub | 456 |
| burntok | 653 |
| choose-window | 204 |
| diairy | 498 |
| hjm-design-system | 578 |
| mofun | 85 |
| portfolio | 492 |
| portfolio-site | 160 |
| qa-framework | 219 |
| spint | 355 |
| unairplane | 236 |
| utilverse | 309 |
| yajalal | 799 |

## 분류 집계

| 분류 | 수 |
| --- | ---: |
| asset-change | 12 |
| dependency-or-repeated-adoption | 466 |
| documentation-or-evidence | 881 |
| existing-milestone-evidence | 43 |
| grouped-source-change | 3208 |
| merge-history | 287 |
| no-file-change | 6 |
| release-operation-receipt | 55 |
| selected-evidence | 86 |

브랜치·태그: [refs.txt](refs.txt). 커밋별 목록: [commits.csv](commits.csv). 이 표는 사이트의 런타임 데이터로 내보내지 않는다. 원본 patch·다운로드 응답은 별도 공개하지 않는다.

## 새 공개 항목의 선택 근거

| 주제 | 날짜 | 항목 | Git·문서 근거 |
| --- | --- | --- | --- |
| design | 2026-08-22 | 디자인 계약과 웹·네이티브 렌더러를 분리 | hjm-design-system `54bcd560` · hjm-design-system `b3733f0a` |
| design | 2026-10-07 | 브랜드와 테마를 공통 구조에 주입하는 체계로 확장 | hjm-design-system `924b23af` · hjm-design-system `ca12e8a2` · hjm-design-system `0a7ddfcb` · hjm-design-system `e6a9ab42` |
| design | 2026-10-14 | 차트·데이터 테이블을 공용 표현 계약으로 승격 | hjm-design-system `fb292ccc` · hjm-design-system `20af3bd7` · yajalal `445f6db1` |
| design | 2026-10-17 | 사용 지침과 실행 예제를 공개 API에 맞춰 연결 | hjm-design-system `def53111` · hjm-design-system `10d40474` · hjm-design-system `312b4061` |
| design | 2026-10-18 | 실제 제품 채택에서 드러난 부족함을 공용 API로 환류 | hjm-design-system `1006160f` · hjm-design-system `784d15b9` |
| clients | 2026-02-06 | 경로와 이동 시각으로 햇빛 노출을 구간별 계산 | choose-window `990ab2d2` · choose-window `a4691952` |
| clients | 2026-09-27 | 검색·경로 선택·창가 추천을 하나의 판단 흐름으로 재설계 | choose-window `0a79c424` · choose-window `aabcd59f` · choose-window `d4a4e9cf` |
| clients | 2026-09-26 | Taground의 제품 흐름을 Spint로 흡수·집중 | record `docs/audits/2026-09-26/taground-retirement.md` · user `2026-10-19 Taground의 Spint 흡수 관계 확인` |
| clients | 2026-10-13 | 공간 셀을 동네의 들판 탐색 경험으로 발전 | spint `83828881` · spint `bac91260` · spint `aee60d69` · spint `7d7cb83d` |
| clients | 2026-10-01 | 로컬 생활 도구를 복구·파일·권한 경계로 구성 | utilverse `300c7155` · utilverse `30834fcd` · utilverse `7d2299bb` · utilverse `c357bcba` |
| clients | 2026-10-05 | 손글씨를 편지에 쓰는 개인 서체로 연결 | diairy `a0a95956` · diairy `0539254c` |
| data | 2026-09-07 | 편지 여정을 서버 상태와 비동기 이벤트로 모델링 | diairy `d402194d` · diairy `8864b2e7` · diairy `b95cef79` |
| data | 2026-08-29 | 라이브 경기 데이터를 한 버전의 스냅샷으로 발행 | yajalal `0c5a06cb` |
| data | 2026-08-21 | 알림 감지와 실제 발송 사이에 내구성 기록 도입 | yajalal `d8635642` · yajalal `2a179566` · yajalal `3371e490` |
| data | 2026-10-16 | 선수 기록을 이력·등록·거래 단위로 확장 | yajalal `5d89b2af` · yajalal `583d9d2a` · yajalal `ab1bc0a7` |
| data | 2026-10-02 | 실시간 대화를 커서 복구와 회원별 가시성에 연결 | utilverse `2f25320c` |
| safety | 2026-10-02 | 콘텐츠 신고를 버전·운영 판단·이의 제기로 연결 | utilverse `1e430b1c` · utilverse `d3b5cdcc` · utilverse `83d2e5ed` |
| data | 2026-09-25 | 금융 계산과 정산을 불변 원장·예약·대사로 분리 | mofun `160c4e87` · mofun `698cdb00` |
| safety | 2026-09-19 | 기능 제공 가능 여부를 근거 레코드로 판정 | mofun `41969cce` |
| ai | 2026-08-07 | 대화를 기획 버전과 생성 작업으로 연결 | burntok `0499ddb7` · burntok `bd285f07` |
| ai | 2026-09-29 | 생성 코드를 실행해 측정하는 별도 검수 과정 도입 | burntok `bf891567` · burntok `97221d37` · burntok `674b2626` |
| ai | 2026-10-12 | 반복되는 생성 유형을 구성 가능한 키트 등록부로 축적 | burntok `54891e8c` · burntok `25c58981` · burntok `fc9840a0` |
| ai | 2026-10-02 | 생성 콘텐츠의 파일 접근을 호스트 권한으로 중개 | burntok `bef3e7e7` |
| ops | 2026-10-09 | 플랫폼별 실행 경로와 불변 배포 의도 기록 | app-release-hub `9618fe9c` |
| ops | 2026-10-14 | 자동 품질 게이트를 덜고 배포 순서만 유지 | portfolio `ab1c1539` · portfolio `ab7a004e` · app-release-hub `bdd30033` |
| ops | 2026-09-10 | 정책 원문과 제품의 공개 링크를 한 소유 경로로 연결 | portfolio-site `180088f1` · app-release-hub `3c7466f7` |
| quality | 2026-10-12 | 소스 개발 피드백과 게시 패키지 릴리스를 분리 | hjm-design-system `957cf07f` · portfolio `ec88239a` · portfolio `5a9c6970` |
| quality | 2026-09-09 | 제품과 공용 모듈의 계약·책임·소비 관계를 등록 | portfolio `c54b18a0` · hjm-design-system `3aadcc30` · qa-framework `75b27d5c` |
| quality | 2026-10-17 | 지침을 공통 규칙·작업 순서·영역별 정본으로 분리 | portfolio `f20adb34` · portfolio `04a4da37` · portfolio `66c92734` |
| quality | 2026-09-28 | QA가 실행 환경을 만들지 않고 기존 URL·기기에 연결 | qa-framework `deecc28b` · qa-framework `ddd66f22` · burntok `313657d6` · yajalal `6f68235d` |
| quality | 2026-09-26 | 탐색 발견과 증거 판정·사람 검토를 분리 | qa-framework `b2c61915` · qa-framework `438f18a0` · qa-framework `bc7481e7` |
| safety | 2026-09-09 | 비밀값 원본과 개발·빌드 주입 경계를 분리 | portfolio `5ccd701a` |
| marketing | 2026-10-09 | 마케팅 제작·검수·게시를 별도 작업 공간으로 구성 | app-release-hub `735439b9` · app-release-hub `b81e2b85` |
| clients | 2026-09-26 | 실행 가능한 콘텐츠를 스와이프 피드로 탐색 | burntok `679fb703` · burntok `d2f9fb8d` |
| data | 2026-05-19 | 예상 라인업·라이브 대결을 계산 서비스와 화면에 연결 | yajalal `158f002a` · yajalal `f3ee83ba` |
| quality | 2026-08-12 | 브라우저와 네이티브를 공통 관측·제어 계약에 연결 | qa-framework `44f71015` · qa-framework `1753a074` |

## 중복·후속 변경 처리

- HJM 버전 상승과 제품별 채택은 공통 확장·채택 환류 항목으로 모았다.
- 초기 RN 실험 제거와 10월 Expo 전환, Flutter 퇴역은 하나의 연속된 발전 과정으로 읽되 당시 실험을 현행 제품으로 표시하지 않는다.
- 삭제 복구는 다에리·Spint·번뚝·Utilverse의 구현으로 보강했다. 위젯은 스냅샷뿐 아니라 iOS·Android 연결 근거를 보강했다.
- 자동 품질 게이트 구축·측정은 이후 최소 CI로 대체된 흐름으로 묶었다. 제출 intent/result tag의 추가 55개 커밋은 개별 제품 성과로 세지 않는다.
- 모펀은 보관 제품의 계산·원장·승인 경계만 보여주며 현재 금융 서비스 제공이나 거래 승인을 주장하지 않는다.
- 작은 문구·간격·버튼 수정, 반복 게시·동기화, 동등 패치의 재병합은 개별 이력 항목으로 늘리지 않는다.

## 이번 화면 확인

- pnpm typecheck 통과: 한국어 1,065개 문구 키 및 화면 타입.
- 1440px / 390px에서 8개 주제의 표시 개수·최신순·가로 넘침, 모바일 상세 펼침을 확인했다. 72개 ID는 고유하다.
- 새 항목에 연결한 로컬 근거 커밋은 모두 각 저장소의 현재 HEAD 조상임을 확인했다. 모펀은 원격 보관 이력을 사용했다.
- 변경 경로의 git diff --check 통과. production build·공개 배포·전체 제품 회귀는 실행하지 않았다. 기존 Card.badges의 게시 패키지 타입 문제를 이번 콘텐츠 변경에서 우회하지 않았다.
- 기존 4319 미리보기는 사용자 검토용으로 유지한다. 새 서버·브랜치·clone·worktree는 만들지 않았다. 임시 다운로드·분석 파일은 제거하고 커밋 분류·ref·선별 근거만 이 폴더에 남긴다.
