# 모든 소스 브랜치 main 통합 — 2026-10-07

## 범위와 근거

사용자가 모든 저장소의 모든 브랜치를 main에 병합하도록 요청했다. 공유 checkout의 미커밋 작업은 보존하고 별도 main checkout에서 통합했다. 자동 앱 배포·스토어 릴리스를 시작하지 않도록 최종 통합 커밋은 `[skip ci]`를 사용한다. 원격 CI 실행·운영 공개 완료를 뜻하지 않는다.

- 저장소: `apps/portfolio-site`
- 시작 로컬 main: `785b1da5bf0e6cc3aae8e692c1bfde37868e6105`
- 동기화 원격 main: `3575cf4f37928c09a0017dab5a91a4faf0d870a5`

## 브랜치 판정

| 브랜치 | 확인 SHA | 처리 |
| --- | --- | --- |
| `chore/remove-lint-format` | `2bb9cb84e4d2e1eb1223dbcb5376f63aa5ee84a9` | main ancestry 확인 |
| `claude/hjm-1.13.1-portfolio-site` | `a24977a6c44887b01f581f03601669013b378f2f` | main ancestry 확인 |
| `codex/hjm-1.8.0-adoption-20260929` | `40b4306c19ec0e91a607314fab3f68c1bf10870a` | main ancestry 확인 |
| `codex/hjm-portfolio-1.11` | `74a1a9e4081d9e09e0817c431d8dcf0125ea9f4c` | main ancestry 확인 |
| `codex/posli-link-hub` | `918848440f1b7815c18db5c1f908e13673f90cca` | main ancestry 확인 |
| `gh-pages` | `0f3e1070821309a2da0eb2f2c5ac63cadc52b259` | 배포 출력 — 소스 병합 대상 제외 |

## 충돌 처리

동일 패치는 `git cherry`의 동치 결과를 근거로 트리를 변경하지 않고 ancestry를 연결했다. 과거 HJM release/catalog 숫자는 게시가 확인된 1.14.0을 유지했다. 최신 main에 이미 흡수된 기능은 후속 수정과 삭제 결정을 유지한다. 브랜치 삭제는 하지 않았다.

## 검사와 한계

통합 후보의 검사는 아래 실행 결과로 갱신한다. 앱 기기 QA·스토어 릴리스·운영 배포는 이번 범위에서 수행하지 않는다. 공유 snapshot에서 수행한 HJM 1.14 검사와 이 통합 checkout 검사는 서로 다른 증거다.

## 보존

이 작업의 결과·명령·실패·미확인 범위는 이 보고서에 남긴다. 원시 검사 로그는 검사 완료 후 SHA-256 요약을 남기고 제거한다. 재사용 도구·제품 fixture·branch inventory는 보존한다.

## 통합 후보 실행 결과

| 명령/검사 | exit | 시간(초) | 로그 SHA-256 |
| --- | ---: | ---: | --- |
| `pnpm install --lockfile-only --ignore-scripts` (lock) | 0 | 3.1 | `d8205f1b76576e51b7129008484c3f418966b5672c1274c0c22fced0b66321b7` |
| `pnpm install --frozen-lockfile --ignore-scripts` (install) | 0 | 2.3 | `4f5c43ca0138dd44bf68ae6fc1067fda6dfb1e326a63acc08defdbfb50afb009` |
| `pnpm contract:check` (contract) | 0 | 0.4 | `9f478623d4211d6ea2dcf1ae14ec7ab8eddbcc8da177526394ffbce4a7d128c3` |
| `pnpm design:check` (design) | 0 | 0.4 | `962433cc71a37148012a31831a04295ada7a25e79796cd24d5797a22019e8c61` |
| `pnpm docs:check` (docs) | 0 | 0.4 | `c3eb710db6853e587e38bd12edc34d21064a9db1e24d789aacccb4ada8bedc43` |
| `pnpm typecheck` (typecheck) | 0 | 1.9 | `5cfb036289d819b2a87e947d65f4532031dd37753f3cf2def0f77d398eea1737` |
| `pnpm test` (test) | 0 | 0.4 | `761e46c6780fb5d14a2547ae16cff5f2ae590237c5a2469463c53e9163d402c4` |
| `pnpm build` (build) | 0 | 3.7 | `3b346ad7ad90db18d78bed747bd475756e92e97a57e4eb10b92ab1b4a93bc363` |

초기 실패와 재검사를 함께 보존한다. 의존 패키지 dist·Prisma client 생성 누락은 준비 후 재검사했고, 실제 수정과 남은 범위는 아래에 기록한다.

- production Vite build를 Chromium으로 1440×1000, 390×844 및 light/dark 4조건에서 열었다. 전체 페이지와 Posli 영역을 한 장에 모아 검토했다. 모든 조건에서 카드 4개, overflow 0, pageerror 0, broken image 0. 링크의 제공자 주소·accessible label·새 창 rel을 확인했다. 링크 대상 계정 조작과 운영 게시 확인은 하지 않았다.
- Screenshot/contact sheet SHA-256:
  - `posli-desktop-dark-full.png`: `be4420e32f2775a9d1313bc9705bc79211c68e3a5c227d8e83944c264c717729`
  - `posli-desktop-dark.png`: `8b40440c9637f87a638fe8b2300f7e98601595726c38ad15d9179f77537c336f`
  - `posli-desktop-light-full.png`: `be4420e32f2775a9d1313bc9705bc79211c68e3a5c227d8e83944c264c717729`
  - `posli-desktop-light.png`: `8b40440c9637f87a638fe8b2300f7e98601595726c38ad15d9179f77537c336f`
  - `posli-mobile-dark-full.png`: `6771a0fcd18016732ea31b9b7c18300fca0e6b59fd0f19bfec1c49eb16e53ec5`
  - `posli-mobile-dark.png`: `5821ba85e7081b4b786b23f93ceb7a446d45d4061edb1bc3381e92f99bec27fe`
  - `posli-mobile-light-full.png`: `6771a0fcd18016732ea31b9b7c18300fca0e6b59fd0f19bfec1c49eb16e53ec5`
  - `posli-mobile-light.png`: `5821ba85e7081b4b786b23f93ceb7a446d45d4061edb1bc3381e92f99bec27fe`
  - `posli-contact-sheet.jpg`: `005afc68ebb5579354aa11c51f512f3428f1f3ad2d69c2b7b36126933a6fab6c`
