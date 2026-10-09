# 도메인 이전 영향 조사 — 2026-10-09

## 1. 판정

새 포트폴리오 https://jmstudioapps.com 은 공개 통과, www는 path/query를 유지해 308 이동한다.
중앙 정책 https://policies.jmstudioapps.com 의 4앱·12문서도 재검증을 통과했다.
확인한 이력서·포트폴리오 HTML 5개와 최종 PDF 7개는 이전 웹/정책 도메인 링크를 포함하지 않아
이번 도메인 변경의 직접 영향이 없다. 이 판정은 링크/본문 domain 검사이며 문서 내용·레이아웃·모든 스토어의 현재 공개 상태 전체 QA를 뜻하지 않는다.

## 2. 조사 범위

- checkout이 존재하는 독립 저장소 11개 + meta root 총 12개에서 Git tracked 텍스트를 검색했다.
- 패키지·생성 build·node_modules·.git·과거 .published HTML 덤프는 runtime source 조사에서 제외했다.
- 검색 문자열은 기존 github.io 웹 origin과 기존 중앙 Sites origin이다. github.com 저장소 링크는 웹 도메인 이전 대상이 아니다.
- 후속 갱신에서 workspace의 `.env*`/`.dev.vars` 29개도 공개 URL 필드만 검사했다.
  이전 두 origin을 가진 값은 0개였고 비밀값을 출력/수정하지 않았다. inventory 임시 파일은 제거했다.
- 이력서 폴더의 현재 root 및 output 문서 24개: HTML href/src·본문, PDF 본문과 /Annots URI를 검사했다.
  숨김 작업 디렉터리·tmp·assets 원본/백업은 최종 제출본 조사에서 제외했다.
- 최초 공개 스토어 3개 Play 페이지의 web read는 실패했다. 사용자의 후속 "영향 있는곳들 다 갱신" 요청으로
  App Store Connect API·로그인 콘솔 및 GitHub API를 추가 조사했다. 외부 등록값·저장 결과는 §7에 구분한다.
  로컬 config와 과거 감사만으로 현재 등록값을 확정하지 않는다. 이미 제출한 외부 사본은 조사 범위 밖이다.

## 3. 소비자별 영향과 조치

| 위치/소비자 | 확인한 영향 | 조치·상태 |
| --- | --- | --- |
| Portfolio index.html/package homepage/locale entry | canonical·OG·대표 URL | jmstudioapps.com으로 변경, root 및 /ko-KR/의 실제 화면·27파일 bytes 확인 |
| Portfolio 정책 projection/snapshot | 중앙 4앱 privacy/delete/support URL | 새 policies origin으로 동기화되어 실제 새 포트폴리오에서 제공. app-owned BurnTok/Diairy/Spint URL 유지 |
| Hub config/portfolio.json operator.marketingUrl | 신규/상속 마케팅 URL의 원천 | jmstudioapps.com으로 변경. store 콘솔 저장값 변경 증거는 아님 |
| Hub .dev.vars.example + 로컬 .dev.vars의 2개 공개 origin 필드 | 기본 preflight가 과거 Sites로 갈 수 있음 | 새 policies origin으로 정정, 비밀 필드/권한 보존. origin 인자 없는 전체 preflight pass |
| root AGENTS·DP·웹 배포 지침·apps 안내, Portfolio AGENTS·RELEASE·배포 실행서 | 이전 hosting/명령을 따라 잘못 배포할 수 있음 | 자체 도메인·고정 artifact·SSH·공개 검증·이전 URL 소비 조사 규칙 반영 |
| jim1286.github.io 이전 공개 주소 | main /에서 build 전 Vite HTML이 노출돼 실제 페이지가 깨져 있었음 | main /docs로 provider source 변경, .nojekyll 이동 안내 게시. path/query/hash를 보존하는 HTML/JS 안내이며 HTTP 서버 redirect는 아님. 최종 공개 결과는 배포 QA 참조 |
| Spint mobile fixtureApi.ts:60 | 개발 fixture에 /privacy/spint의 옛 Sites URL | 앱 서버 privacy URL로 수정, mobile typecheck·HTTPS 200 확인. main `668bcb6` push 검증. native/OTA 릴리스 범위 아님 |
| lib/privacy-publication-finalize.ts:14 및 Sites handoff/이전 운영서 | 고정 Sites origin/project identity | 과거 evidence와 같은 identity를 보존. 새 도메인 게시 증거로 재사용 금지. 신규 onboarding은 현재 portfolio origin |
| Unairplane RELEASE/옛 operation/research·marketing 감사 | 당시 공개 URL 인용 | 역사 기록을 유지. 새 기본 운영 절차는 현재 지침을 따름 |
| App Store·Google Play의 developer/marketing/privacy/support/delete URL | 과거 URL이 등록돼 있을 수 있음 | 실제 등록값 확인·URL 저장 결과와 provider 제약은 §7. config 변경을 콘솔/공개 변경으로 보고하지 않음 |
| GitHub 프로필·프로필 README·저장소 website | 기존 github.io 대표 링크 | `jim1286` blog·README Portfolio·profile repo homepage·portfolio repo homepage를 새 root로 저장/재조회. 별도 Storybook 유지 |
| Instagram·Threads·LinkedIn·채용 프로필·공유글 | 기존 github.io/Sites 링크가 외부에 존재할 수 있음 | §7의 실제 프로필 확인 결과를 따름. 신규 게시물/메시지/댓글은 이번 URL 갱신 범위가 아님 |
| README 저장소 remote·카탈로그 identity·GitHub 소스 링크·별도 Storybook | domain 문자열이 같아도 실제 제품 웹/정책 목적지가 아님 | 일괄 치환 제외. GitHub 계정·저장소 및 별도 project pages는 유지 |
| 기존 Sites | 소유 계정 접근 실패 | 구버전 링크를 위해 유지. current body/redirect/종료는 소유 계정 확보 후 검증 |

## 4. 이력서·포트폴리오 제출본

PDF URI 78개를 읽었고 이전 github.io/Sites origin 및 새 root/policies origin 직접 링크는 0개였다.
GitHub 계정·저장소, 이메일·App Store·Play 링크는 도메인 이전으로 바뀌지 않는다. 문서를 수정/재생성하지 않았다.
새 포트폴리오 주소를 연락처에 추가하는 것은 선택 사항이며 현재 제출본이 깨져서 필요한 수정은 아니다.

| PDF | 페이지 | URI 개수 | 이전 domain 링크 |
| --- | --- | --- | --- |
| `output/pdf/황지민_이력서.pdf` | 2 | 14 | 0 |
| `output/pdf/황지민_이력서_Physical_AI_인턴.pdf` | 2 | 2 | 0 |
| `output/pdf/황지민_토스플레이스_FE_Platform_Engineer.pdf` | 2 | 5 | 0 |
| `output/pdf/황지민_토스플레이스_Frontend_Developer.pdf` | 2 | 9 | 0 |
| `output/pdf/황지민_포트폴리오.pdf` | 8 | 17 | 0 |
| `황지민_이력서.pdf` | 2 | 14 | 0 |
| `황지민_포트폴리오.pdf` | 8 | 17 | 0 |

HTML: root의 황지민_이력서/포트폴리오, output/tommoro Physical AI 이력서,
output/pdf의 토스플레이스 Frontend Developer·FE Platform Engineer를 확인했다.
PDF QR코드·이미지 속 URL은 별도 decode하지 않았다. 이미 외부에 제출한 버전과 사용자 홈 다른 폴더 전체를 전수 조사한 것은 아니다.

## 5. 원천별 남은 링크 목록

현재 source 검색에 남는 예전 URL은 대부분 역사 기록이며 실제 runtime fixture/legacy identity와 구분한다.
다음은 line 단위 원문 덤프 대신 파일별 목록이다. 조사 당시 목록이며 이후 지침 정정과 다를 수 있다.

- `./research/2026-10-02/choosewindow-android-public.md`
- `./research/2026-10-02/final-source-check.md`
- `./research/2026-10-02/public-product-verification.md`
- `./research/2026-10-02/validation.md`
- `./research/2026-10-03/design-current-project.md`
- `./research/2026-10-04/prior-2026-10-03/design-current-project.md`
- `./research/2026-10-05/prior-2026-10-04/prior-2026-10-03/design-current-project.md`
- `./research/2026-10-06/prior-2026-10-05/prior-2026-10-04/prior-2026-10-03/design-current-project.md`
- `./research/2026-10-07/prior-2026-10-06/prior-2026-10-05/prior-2026-10-04/prior-2026-10-03/design-current-project.md`
- `apps/spint/apps/mobile/src/lib/fixture/fixtureApi.ts`
- `apps/unairplane/docs/RELEASE.md`
- `apps/unairplane/docs/qa/2026-10-08-ad-placements.md`
- `apps/unairplane/docs/qa/2026-10-08-flight-lookup.md`
- `control-plane/app-release-hub/docs/governance/POLICY_SITE_DEPLOYMENT.md`
- `control-plane/app-release-hub/docs/operations/UNAIRPLANE_UIUX_2026-09-28.md`
- `control-plane/app-release-hub/lib/privacy-publication-finalize.ts`
- `control-plane/app-release-hub/marketing/operations/2026-09/2026-09-01.md`
- `packages/hjm-design-system/docs/qa/2026-10-07-experiment-promotion-release.md`

## 6. 보관과 후속

임시 검색/URI JSON·공개 응답·로그는 이 기록에 요약하고 제거한다. 제출 PDF/HTML·credential 원본·
역사 evidence는 그대로 보존한다. 본 조사는 새 DNS/public bytes 검사와 별개다.
[실제 배포 QA](2026-10-09-owned-domain-deployment.md)를 함께 읽는다.

## 7. 사용자 승인에 따른 실제 소비자 갱신

2026-10-09 후속 요청은 현재 소비 링크의 실제 갱신을 승인한다. 확인·저장은 10월 10일 KST까지 이어졌다. URL 필드만 변경하고
다른 세션의 마케팅/로컬 DB 작업·기존 심사·앱 버전·별도 서비스/저장소 링크는 보존한다.

### GitHub

2026-10-09 23:27~23:29 KST에 `gh api` 저장 후 별도 GET으로 읽었다.

- 사용자 `jim1286.blog`: `https://jim1286.github.io/` → `https://jmstudioapps.com/`.
- `jim1286/jim1286.github.io.homepage`: 같은 변경.
- `jim1286/jim1286.homepage`: 같은 변경.
- `jim1286/jim1286` main README의 Portfolio 링크: 같은 변경.
  remote commit `39e779f4ba450954427673c6087af9c87337643d`, content GET exact 일치.
- 계정 저장소 homepage를 조회한 결과 남는 GitHub Pages 링크는 HJM Storybook
  `https://jim1286.github.io/hjm-design-system/`뿐이며 별도 서비스이므로 유지한다.

### App Store Connect

2026-10-09 23:25~23:33 KST, 저장된 Hub Keychain credential을 메모리 안에서 사용해 API를 읽었다.
비밀값을 로그/파일에 쓰지 않았다. 현재 계정의 6개 앱 및 모든 appInfo locale(현재 모두 ko),
배포/심사 버전 localization의 URL 필드를 읽었다. Taground record는 이 계정 목록에 없다.
기존 릴리스 이력의 READY_FOR_SALE 표시는 최신 버전의 공개 여부와 분리했다.

| 앱/버전 | privacy/choices | support/marketing | 결과 |
| --- | --- | --- | --- |
| 번뚝 1.6.0 및 심사 대기 1.6.1 | 앱 전용 주소 | 앱 전용 주소 | 이전 domain 없음, 유지 |
| Diairy 1.6.0 | 앱 전용 주소 | 앱 전용 지원 주소, marketing 없음 | 이전 domain 없음, 유지 |
| Spint 1.0.4 및 심사 버전 1.1.0 | 앱 전용 주소 | 앱 전용 지원 주소, marketing 없음 | 이전 domain 없음, 유지 |
| 비행중 심사 대기 1.1.0 | 새 central privacy/delete | 새 central support, marketing 없음 | 3 URL PATCH 200 + 별도 GET 일치 |
| 비행중 출시 1.0.14 | 옛 central privacy/delete | 옛 central support | 출시 resource PATCH 409, 미변경 |
| 선택의창 출시 1.3.3 | 옛 central privacy | 옛 central support·github.io marketing | PATCH 409, 미변경 |
| 야잘알 출시 1.21.8 | 기존 Flycricket privacy | 옛 central support·github.io marketing | PATCH 409, 미변경 |

비행중의 저장 대상은 appInfo localization `aacbbc8e-1267-4188-85df-88440297f571`과
version localization `4efb08d0-bd94-4b7e-b8a2-ff10e3c1f8d0`이다. 저장 후 appInfo와 version을
재조회했고 `WAITING_FOR_REVIEW`, 1.1.0을 유지했다. 취소/재제출/새 binary/출시를 실행하지 않았다.
출시 버전까지 공개 적용됐다는 뜻이 아니다.

출시 resource는 `ENTITY_ERROR.ATTRIBUTE.INVALID.INVALID_STATE` / `STATE_ERROR`로 거부됐다.
선택의창과 야잘알 콘솔 `/apps/<app-id>/distribution/privacy`도
"개인정보 처리방침을 변경하려면 새로운 앱 버전을 생성하십시오"를 표시하고,
버전 화면의 지원/마케팅 입력은 disabled였다. 이 제약을 새 버전 생성이나 심사 취소로 우회하지 않는다.
다음 delivery에서 최신 버전을 기준으로 아래 필드를 반영하고 저장/실제 공개를 따로 확인해야 한다.

| 앱 | privacyPolicyUrl | privacyChoicesUrl | supportUrl | marketingUrl |
| --- | --- | --- | --- | --- |
| 선택의창 | https://policies.jmstudioapps.com/privacy/choose-window | 기존 미설정 유지 | https://policies.jmstudioapps.com/support/choose-window | https://jmstudioapps.com/ |
| 야잘알 | https://policies.jmstudioapps.com/privacy/yajalal | 기존 미설정 유지 | https://policies.jmstudioapps.com/support/yajalal | https://jmstudioapps.com/ |
| 비행중 | https://policies.jmstudioapps.com/privacy/unairplane | https://policies.jmstudioapps.com/privacy/unairplane/delete-account | https://policies.jmstudioapps.com/support/unairplane | 기존 미설정 유지 |

위 목적지는 변경 전에 HTTPS 200을 확인했다. Hub source 값은 이미 새 주소지만 일반 upload CI는
changelog만 올리므로 URL 반영을 추정하지 않는다. 별도 delivery URL 체크리스트로 인계한다.
Apple metadata 제약 참고: [Required, localizable, and editable properties](https://developer.apple.com/help/app-store-connect/reference/app-information/required-localizable-and-editable-properties/).
인계 문서는 Hub `docs/operations/DOMAIN_URL_MIGRATION_2026-10-09.md`이며
main `c424d7fea65bfbf0e393d65418e36afc5c77a929` push를 확인했다.

### 외부 프로필

- Instagram의 현재 앱 브랜드는 `@posli.makes`다. 로그인된 프로필 편집에서 website는
  빈 값이고 소개는 Threads 고정글을 가리킨다. 옛 domain은 없다. website 입력은 disabled이며
  "링크 수정은 모바일에서만 가능합니다"가 표시된다. 새로운 링크를 임의로 추가하지 않았다.
- Threads `@posli.makes`의 프로필 링크 목록은 비어 있다. root가 실제 링크 dialog를 확인했다.
  기존 app/store 링크와 이름·소개·공유글은 유지한다.
- LinkedIn Aside API는 `jim1286` 본인임을 확인했다. Aside 편집 탭이 로그인으로 이동해
  저장 로그인을 확인했지만 현재 REPL의 Password Manager global은 사용할 수 없었다.
  Chrome의 기존 세션을 사용해 본인 프로필·연락처·Featured를 직접 확인했다(2026-10-09 23:45~23:48 KST).
  연락처 website의 실제 safety/go 목적지는 `https://github.com/jim1286`이며,
  Featured는 2026.10 최신 이력서/포트폴리오 첨부 및 GitHub 링크다. 교체할 old web/policy URL 없음.
  옛 업로드 미디어 2개 자체의 파일 본문은 다운로드/재검사하지 않았다.
- 이 밖의 채용 프로필/외부 제출 사본 전체를 완료로 주장하지 않는다. 식별된 현재 서비스와
  접근 가능한 필드만 확인하며, 사용자 홈 전체나 인터넷 전체를 검색한 결과가 아니다.

### Google Play Console

로그인 계정의 developer ID `5132490318076124392`, 기존 앱 6개를 확인했다.
Taground record는 없다. 아래는 URL 필드 저장 후 새로고침/재조회한 값이다.
privacy·삭제 선언 저장, 검토 전송, 공개를 각각 구분한다.

| 앱 / console app ID | privacyPolicyUrl | 삭제 URL | 지원 website |
| --- | --- | --- | --- |
| 선택의창 / 4974784922658546569 | https://policies.jmstudioapps.com/privacy/choose-window | https://policies.jmstudioapps.com/privacy/choose-window/delete-account | https://policies.jmstudioapps.com/support/choose-window |
| 야잘알 / 4976441300559617706 | https://policies.jmstudioapps.com/privacy/yajalal | https://policies.jmstudioapps.com/privacy/yajalal/delete-account | https://jmstudioapps.com/ |
| 비행중 / 4976044955561345826 | https://policies.jmstudioapps.com/privacy/unairplane | https://policies.jmstudioapps.com/privacy/unairplane/delete-account | https://policies.jmstudioapps.com/support/unairplane |
| Diairy / 4972915573538369918 | https://airy.jmstudioapps.com/legal/privacy | https://airy.jmstudioapps.com/legal/account-deletion | https://airy.jmstudioapps.com/legal/ |
| Spint / 4975886030044538202 | https://api.spint.jmstudioapps.com/legal/privacy | https://api.spint.jmstudioapps.com/legal/account-deletion | https://api.spint.jmstudioapps.com/legal/ |
| 번뚝 / 4975768444822093325 | https://burntok.jmstudioapps.com/legal/privacy | https://burntok.jmstudioapps.com/legal/account-deletion | https://burntok.jmstudioapps.com/legal/ |

선택의창 support website는 `https://jim1286.github.io/`에서 전환됐다. 비행중·번뚝의
지원 website도 위 주소로 즉시 게시/재조회했다. 야잘알 지원 website는 이미 새 root였다.
개발자 계정 website도 새 root로 저장/재조회했다. root가 선택의창 store-settings의 실제
저장 후 website group을 독립적으로 읽었고 새 central support 값과 일치했다.
처음 data-safety 임시저장 후 옛 URL이 보였던 상태는 최종 양식 저장·새로고침 뒤 정정 확인했다.
번뚝도 계정 삭제·데이터 삭제 두 필드를 재조회해 앱 전용 account-deletion 주소 일치를 확인했다.

2026-10-10 00:03 KST, 세 앱의 게시 개요 및 앱 목록을 최종 재조회했다. 앱마다
제출 확인 dialog의 대상이 개인정보처리방침 URL **1건뿐**임을 확인한 뒤 정상 검토 전송했다.
다른 대기 변경을 함께 제출하거나 기존 심사를 취소/재제출하지 않았다.

| 앱 | 이번 전송 항목 | 최종 게시 개요 | 공개 판정 |
| --- | --- | --- | --- |
| 비행중 | 새 `/privacy/unairplane` URL 1건 | 검토 중, 사전 검사 진행 배너 없음 | 기존 production 유지, 새 privacy URL 공개는 아직 미확인 |
| 야잘알 | 새 `/privacy/yajalal` URL 1건 | 검토 중, 사전 검사 진행 배너 없음 | 기존 production 유지, 새 privacy URL 공개는 아직 미확인 |
| 선택의창 | 새 `/privacy/choose-window` URL 1건 | 검토 중, 사전 검사 진행 배너 없음 | 기존 production 유지, 새 privacy URL 공개는 아직 미확인 |

root도 선택의창의 최종 게시 개요 snapshot 및 캡처를 직접 확인했다. 검토 중인 유일한 행은
새 central privacy URL이었다. 지원 website의 저장/게시와 privacy 검토 승인·공개는 별개다.

### 검증과 종료 정리

- Spint mobile typecheck, Spint docs link 검사(114 문서)를 통과했다. native/OTA 게시를 실행하지 않았다.
- 문서 변경은 Portfolio Site의 docs link 검사(48 문서)와 변경 파일의 `git diff --check`를 통과했다.
  runtime 변경이 없는 이번 QA 보충 때문에 전체 build·native 검사를 반복하지 않는다.
- 루트와 대상 독립 저장소는 main에서 작업했다. 새 작업 브랜치·워크트리·clone은 만들지 않았다.
  종료 시 Portfolio Site·Hub·Spint의 worktree 등록은 각각 기존 main 하나뿐이었다.
- 다른 세션의 로컬 DB·마케팅·HJM 개발 설정 변경은 stage/commit/되돌리지 않는다.
  이전 Sites 원문·소유 계정 접근 및 외부 제출 사본은 확인되지 않았으며 옛 운영 기록은 보존한다.
- Aside의 이 작업 session `3IjORzEH8HTtpHuF`에 생성된 임시 캡처·파일 읽기 덤프는 결과를
  이 문서에 요약한 뒤 제거했다. 기존 로그인/사용자 탭과 다른 세션의 Gemini 작업은 보존했다.
  root가 따로 연 Apple·Chrome LinkedIn 탭과 env inventory 임시 파일은 정리했다.
