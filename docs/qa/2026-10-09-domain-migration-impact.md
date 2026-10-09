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
- 이력서 폴더의 현재 root 및 output 문서 24개: HTML href/src·본문, PDF 본문과 /Annots URI를 검사했다.
  숨김 작업 디렉터리·tmp·assets 원본/백업은 최종 제출본 조사에서 제외했다.
- 공개 스토어 3개 Play 페이지의 web read는 실패했다. 콘솔 등록값·외부 프로필·이미 제출한 파일/외부 사본은 미확인이다.
  로컬 config와 과거 감사만으로 현재 등록값을 확정하지 않는다.

## 3. 소비자별 영향과 조치

| 위치/소비자 | 확인한 영향 | 조치·상태 |
| --- | --- | --- |
| Portfolio index.html/package homepage/locale entry | canonical·OG·대표 URL | jmstudioapps.com으로 변경, root 및 /ko-KR/의 실제 화면·27파일 bytes 확인 |
| Portfolio 정책 projection/snapshot | 중앙 4앱 privacy/delete/support URL | 새 policies origin으로 동기화되어 실제 새 포트폴리오에서 제공. app-owned BurnTok/Diairy/Spint URL 유지 |
| Hub config/portfolio.json operator.marketingUrl | 신규/상속 마케팅 URL의 원천 | jmstudioapps.com으로 변경. store 콘솔 저장값 변경 증거는 아님 |
| Hub .dev.vars.example + 로컬 .dev.vars의 2개 공개 origin 필드 | 기본 preflight가 과거 Sites로 갈 수 있음 | 새 policies origin으로 정정, 비밀 필드/권한 보존. origin 인자 없는 전체 preflight pass |
| root AGENTS·DP·웹 배포 지침·apps 안내, Portfolio AGENTS·RELEASE·배포 실행서 | 이전 hosting/명령을 따라 잘못 배포할 수 있음 | 자체 도메인·고정 artifact·SSH·공개 검증·이전 URL 소비 조사 규칙 반영 |
| jim1286.github.io 이전 공개 주소 | main /에서 build 전 Vite HTML이 노출돼 실제 페이지가 깨져 있었음 | main /docs로 provider source 변경, .nojekyll 이동 안내 게시. path/query/hash를 보존하는 HTML/JS 안내이며 HTTP 서버 redirect는 아님. 최종 공개 결과는 배포 QA 참조 |
| Spint mobile fixtureApi.ts:60 | 개발 fixture에 /privacy/spint의 옛 Sites URL | 운영 app-owned 목적지는 api.spint.jmstudioapps.com. 개발 fixture 수정은 별도 제품 작업; 이번에는 목록만 작성 |
| lib/privacy-publication-finalize.ts:14 및 Sites handoff/이전 운영서 | 고정 Sites origin/project identity | 과거 evidence와 같은 identity를 보존. 새 도메인 게시 증거로 재사용 금지. 신규 onboarding은 현재 portfolio origin |
| Unairplane RELEASE/옛 operation/research·marketing 감사 | 당시 공개 URL 인용 | 역사 기록을 유지. 새 기본 운영 절차는 현재 지침을 따름 |
| App Store·Google Play의 developer/marketing/privacy/support/delete URL | 과거 URL이 등록돼 있을 수 있음 | 현재 console 등록값은 미확인. 다음 delivery에서 앱별 5종 URL을 읽고 새 목적지·실제응답과 대조해 전환 |
| Instagram·Threads·LinkedIn·채용 프로필·공유글 | 기존 github.io/Sites 링크가 외부에 존재할 수 있음 | 현재 외부 등록값 미확인. 대표 website는 새 root 권장. 메시지/프로필 변경은 수행하지 않음 |
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
역사 evidence는 그대로 보존한다. 본 조사는 새 DNS/public bytes 검사와 별개이며 스토어·외부 프로필의
현재 등록값 대조를 완료로 보고하지 않는다. [실제 배포 QA](2026-10-09-owned-domain-deployment.md)를 함께 읽는다.
