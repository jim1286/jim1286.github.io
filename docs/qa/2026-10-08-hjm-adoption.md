# Portfolio Site HJM 1.16.0 도입·통합 QA

## 1. 최종 판정

로컬 도입·통합과 아래 명시한 Chromium UI 검증 통과. 새 사진, 전체 문구, 개발·마케팅 전략, 모바일 메뉴, HJ 표시 삭제를 반영했다. 원격 minor gate·merge·GitHub Pages 공개 배포는 부모 담당이며 이 리포트로 완료를 주장하지 않는다. 최종 실제 브라우저 확인: 2026-10-08 05:58 KST.

## 2. 대상과 통합 판단

- 제품: Portfolio Site, React/Vite 단일 정적 웹. 별도 native 앱·서버·계정·입력 기능 없음.
- 전용 worktree: `codex/portfolio-hjm-1.16-adoption-20261008`, 원격 baseline `c90c9af406ad5c7d1fa1edb7813e2fbb70b2e987`. 공유 원본 및 다른 worktree는 수정하지 않았다.
- HJM: 공식 npm contracts/React exact 1.16.0, tag `v1.16.0` → `4df598a608b1592f45ef8fc9eb4d7b55c589599f`. 중앙 sync가 세 tarball/integrity/tag를 확인한 후 설치했다.
- 공유 dirty20 중 i18n catalog·loader·registry·생성기·설계·CLAUDE 등 신규 기능을 흡수했다. 12개 수집 파일의 before/after hash가 일치한 안정 snapshot을 사용했다. 공유 old package/lock의 HJM1.14·옛 ESLint를 되살리지 않고 현재 baseline에 필요한 script delta만 반영했다. QA2개는 main과 동일해 중복 복사하지 않았다.
- 기존 feature/HJM 브랜치는 ancestry 또는 patch-equivalent로 통합됐다는 담당 A의 조사 결과를 반영했다. 열린 PR24의 TypeScript~7.0.2 delta는 pnpm으로 정상 lock 재생성해 포함했고 부모가 PR24를 실제 merge했다. 닫히고 원격 삭제된 React19.3/plugin5.2/hooks7.1 브랜치는 복원하지 않았다. gh-pages는 별도 배포 출력이다.
- 유효 변경 흡수와 모든 checkout clean은 다르다. 공유 dirty는 계속 보존한다.
- 부모 통합 체크포인트: source/version1.1.0 commit `1081292`, PR24 main ancestry merge `dbe9836`, patch-equivalent1.15 브랜치 ancestry merge `3e117e7`. 두 ancestry merge 뒤 source tree 변화0, frozen install/계약/문서 통과를 부모가 확인했다. PR26이 생성됐으며 공개 배포는 아직 별도다.
- 초기 도입 체크포인트의 6파일 source digest `9c471161e713a270b6a30b219735f38642700f49979361f2960c101274d0b19d`는 과거 증거다. 최종 UI 입력 24파일(`src/**/*.ts/tsx`, site.css, 사진/OG, package/lock/workspace, i18n.config, index/Vite, locale build, i18n tools)의 정렬된 경로+NUL+SHA256+newline manifest digest는 minor metadata 변경 전 `9e7bb1cc62eb2346015efd78249bb4e971283fb3e0d1417bbd68f25baba0cfb4`이다.

## 3. 환경과 범위

Node24.20.0, pnpm11.24.0, TypeScript7.0.2, Vite7.3.6, macOS, Chromium153.0.8010.12. production dist를 Python plain static HTTP 서버로 제공했다. Vite preview의 SPA fallback을 완료 증거로 쓰지 않았다. browser context는 로그인·저장 쿠키 없는 새 context다.

실제 UI 지원 언어는 ko-KR 하나다. 기존 page/product 키와 formatter 인자를 보존해 catalog/URL loader를 통합했고 새 문장·메뉴·접근 상태·전략·SEO를 같은 source에 넣었다. 사용자 HJ 삭제로 소비 없는 page003/page071 두 키를 제거해 최종146키다. 새 번역 언어·RTL 지원 완료는 주장하지 않는다.

OS 최대 접근성 글자와 그 최대값 모사 확대는 설계·추가 검증·후속·완료/릴리스 조건에서 제외했다. 이번 작업에서 실행하지 않았다.

## 4. 재현·변경과 수정

- 공개 LandingScreen은 없다. 설치된 [소개 지침](https://github.com/jim1286/hjm-design-system/blob/4df598a608b1592f45ef8fc9eb4d7b55c589599f/packages/design-contracts/docs/usage/screens/landing.md)의 소개 → 제품 정보 → 행동 구조를 ScreenLayout/Section/Grid/Card로 구성했다. 제품에 없는 입력 체험·FAQ를 만들거나 데이터용 OverviewScreen을 억지로 넣지 않았다.
- Heading/Text/Statistic/Badge/Tag/Link/SkipNav/Asset/Collapsible와 공개 defineHjmDesignProfile·brandPalette를 사용한다. 종이/숲/라임/주황은 제품 소유이며 private recipe CSS 우회는 제거했다. 기존 light editorial은 두 OS 색상 환경에서 유지한다.
- 390px 첫 화면에서 sticky header212px가 본문을 줄였다. 단일 공개 Collapsible의 mobile disclosure/desktop inline으로 기본84px가 됐다. 320px 고정 메뉴140px가 이름을 두 줄로 나눠 제품 wrapper만 clamp(108px,35vw,140px)로 바꿨다. 320/390에서 한 줄 이름·닫힘/열림·횡넘침 없음 확인.
- 모바일 앵커 선택 후 숨겨진 링크에 초점을 남기거나 header로 되돌리면 읽기 순서가 어긋난다. 목적지 section tabIndex=-1에 native hash 처리 후 focus(preventScroll)를 둔다. 다음 Tab은 해당 구역 링크, 단순 Escape/trigger 닫기는 trigger 초점 유지.
- 실제 종이 muted #65736b/#f4f2ea는 4.44:1이었다. 공개 semantic textMuted/textSub만 #627068로 보정했다. 실제 main의170 text nodes에서 최저4.64:1, small4.5/large3 기준 미달0(이 수치는 HJ 삭제 직전 동일 ink/layout 측정)이다. 이미지·모든 상태의 포괄 WCAG 인증은 아니다.
- 새 사용자 첨부 JPEG를 부모가 원본 그대로 public/profile.jpg에 복사했다. SHA256 `0c9cb2865dddba5f3ec6ec7573c4a39b4497e7ef53bd7e6f0f0cc53b0642f795`, 912×732. height:auto로 원본 프레임·얼굴·어깨를 보존하며 320/390/1440에서 실제 렌더 확인.
- 사용자 “HJ 이거 다 없애” 요청으로 header/footer 이니셜 mark·CSS·alias·obsolete catalog2키를 제거했다. 실제 이름/패키지 식별자는 유지한다. 부모가 ImageGen으로 OG의 원형 HJ만 제거하고 그림을 검토했다. OG1731×909, SHA256 `71c2f8ac924b2a01bf08abbff9b44a166668f312eac363e4c07229bf3d048e6e`; URL/이미지 경로 보존, 메타 크기 일치.
- 전체 소개/메뉴/앱 설명/스토어 CTA/개발자/문의 문구를 승인한 catalog로 수정했다. 앱 이름·출시 상태·주소·기술 stack·formatter API는 유지한다. title/description/OG/Twitter는 source catalog3키를 Vite HTML 변환으로 공유하며 현재 본문 소개와 일치한다.
- 앱 소개 다음 “제품을 만들고 알리는 방식”을 추가했다. 개발7단계/마케팅5단계 및 검색형·발견형 선택 분기를 HJM Card2/Grid/Surface와 의미 있는 ordered list/장식 화살표로 표현한다. 운영 방향이며 성과·자동계측·SNS 실행 완료 주장 없음. 크게 보기 두 링크는 동일 탭 standalone HTML로 이동한다. [도식 원천·재생성](../diagrams/README.md)은 담당 A의 JSON/HTML 산출물을 보존한다.
- Taground는 중앙 archived/checkout absent tombstone 및 [삭제 기록](https://github.com/jim1286/app-portfolio/blob/main/docs/audits/2026-09-26/taground-retirement.md)의 이력 카드다. 주 상태/Source 자리는 보관 중이며 statusTone도 archived. 원래 GitHub 주소는 데이터로 보존한다.
- 익명 Source 클릭은 yajalal/choose_window/BurnTok/unairplane 모두 GitHub Page not found. owner gh metadata는 네 곳 isPrivate:true였다. 공개 방문자용 Source는 소스 코드 비공개 상태로 교체하고 original githubUrl/sourceAccess를 보존한다. 인증 API 접근을 공개 접근으로 세지 않았다.
- 기존 BurnTok 정책3주소는 실제 Not found였다. app-owned 정책을 중앙 origin으로 잘못 투영한 generator가 원인이다. 부모가 Hub canonical publication/URL을 사용하도록 수정하고 retired fallback 및 민감정보 비노출/실패 닫힘 회귀를 추가했다. 생성물을 수동 교체하지 않았다. 아래 실제 버튼 클릭으로 수정3문서 확인.
- /ko-KR/은 GitHub Pages용 실제 dist/ko-KR/index.html을 생성한다. root absolute assets/도메인/OG URL을 보존한다. 초기 lang/dir 및 직접 진입·reload·공유 hash를 static 서버에서 확인했다.
- 초기 기본 Node26.9 pnpm materialize는 기존1.15 frozen 설치였고 manifest/lock 변경 없음. 1.15에 없는 font-role 및 Badge soft 선택은 1.16 공개 API/filled로 수정했다. 최종 검사는 exact Node24.
- 냉각 정책의 최초1.16 lock 실패 후 공식 tag/tarball 검증 근거로 두 exact 패키지만 예외 추가했다. 최종1.15 예외는 prune됐고 namespace 예외·수동 lock 수정 없음.
- 통합 중 doc metadata와 contract reviewed/version3개 불일치를 발견했다. 부모가 계약·문서1.1.0/2026-10-08을 정렬하고 contract/design check를 재실행해 governance-scaffold 통과했다.

## 5. 검사 결과

| 검사 | 결과와 실제 범위 |
| --- | --- |
| frozen 설치 | contracts/react1.16, TS7.0.2 실제 설치; ignore-scripts |
| 최종 pnpm check | 통과: 문서36, i18n146+추가언어 projection fixture1, 정책 snapshot, policy 회귀8, TS7, Vite1829 modules, static locale1 |
| contract/design | 부모 최종 재확인 통과, governance-scaffold; 구현 acceptance 승격 아님 |
| main6조건 | 320×740/390×844/1440×1000 × OS light/dark 모두15카드·이미지0오류·main1/h1 1·횡넘침0·runtime오류0·기본 header84 |
| 키보드/상태 | SkipNav→main→hero CTA, 메뉴 Space/Enter·Escape, 5구역 앵커·닫힘·구역 focus/다음 Tab 확인 |
| 정적 locale | / 및 /ko-KR/ 직접200·reload200·ko-KR/ltr; /ko-KR/#posli 실제 구역 이동 |
| 익명 외부 링크15개 | GitHub profile1, AppStore4/Play2, BurnTok웹1, 정책7의 실제 새탭 목적지/제목·본문 확인 |
| 정책 교정3개 | /legal/privacy “번뚝 개인정보처리방침”, /legal/account-deletion “번뚝 계정 삭제 안내”, /legal/ “번뚝 정책 문서” |
| 정상 redirect | AppStore id6749580205/6759096524/6810606625/6806942992 동일 상품(쿼리 제거·slug 추가); BurnTok /→/login. URL 완전 일치 harness 실패와 실제 목적지 정상 동작 구분 |
| reduced motion/메일 | reduced 환경 scroll-behavior:auto; mailto:jimin1286@gmail.com. OS 메일 앱 실행/발송은 하지 않음 |
| standalone8조건 | 2도식 × 390/1440 × light/dark: langko, SVG title/desc 관계, 글로벌 횡넘침0, theme toggle, 실제 SVG 다운로드/본문 복귀, runtime오류0 |
| SVG export | 개발16379B/마케팅16348B, diagram.svg 다운로드 failure:null, SVG 및 한글 제목 포함. PNG/JPEG/WebP/clipboard 실제 동작 미실행 |
| 시각 검토 | 7구역+모바일 열린 메뉴 비교시트 및 실제 scroll frames를 합친 전체문서로15카드/사진/전략/하단 확인. DOM 스타일 변경 없는 실제 캡처 |

최종 관찰 artifact: JS index-CPOpsJi1.js331.53kB/gzip106.59, CSS index-DgCZAD7g.css152.62kB/gzip21.39. dist/index.html SHA256 `e6fb5250932da1d2f7ad73c8fef11e903a213e18acf2a8848a996ec1d550b611`, locale HTML `889cce50db0c56fa0e80fdd95c9a70215046249c2e2befd93316cf5e2da9a82b`. minor metadata 후 부모 최종 gate/배포 artifact와 구분한다.

## 6. 미확인 경계와 다음 담당

Safari/Firefox, 실제 VoiceOver/스크린리더 및 native 기기는 미실행이다. 새 번역·RTL·계측/캠페인 성과·메일 발송·로그인 제품 내부 동작은 이번 범위가 아니다. 제품에 없는 error/empty/input 상태를 추가해 검사 수를 늘리지 않았다. 최대 글자 조건은 후속에도 없다.

부모가 제품 minor1.1.0을 반영했고 최종 version gate·PR26 merge·gh-pages publish·공개 root/locale/asset 확인을 진행한다. 로컬 plain-static 200과 실제 공개 도메인은 다르다. 기존 governance registry pending/planned는 보존한다. snapshot 검사는 Hub 최신성 증거가 아니며 부모가 별도로 source-verified 확인했다.

## 7. 보관 처리

현재 본 작업 raw images만 /tmp/portfolio-hjm-1.16-qa-c-20261008에 최종 검토용으로 남긴다. 최종 비교시트는 *-final-sheet.png, 전체문서는 *-final-whole.png이며 HJ가 있는 앞선 캡처와 구분한다. 부모의 마지막 실제 시각 검토가 끝나면 이 raw PNG/임시 출력·자체 static 서버를 정리한다. 최종 결과는 이 단일 리포트에 남기고 도식 HTML/JSON, 제품 자산·재사용 코드·계약 evidence·다른 세션 출력은 보존한다. 배포에 사용할 dist 정리는 부모와 조율한다.
