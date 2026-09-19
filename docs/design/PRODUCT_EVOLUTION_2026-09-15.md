# Portfolio Site 디자인·기능 발전 목록

기준일: 2026-09-15 · 범위: 현재 checkout 소스 감사

## 실제 표면과 변경 경계

- React/Vite 단일 웹 제품이다. `src/App.tsx:2`부터 HJM Provider/Container/Stack/Text/Icon을 실제 import하고 제품 CSS와 함께 사용한다.
- [AGENTS](../../AGENTS.md), [PRODUCT](../PRODUCT.md), [ARCHITECTURE](../ARCHITECTURE.md), [DESIGN](../DESIGN.md), [라이브러리 정책](../LIBRARY_POLICY.md)를 기준으로 조사했다.
- HJM 1.1.1 manifest 변경과 contract/catalog projection, lockfile은 착수 전부터 dirty였다. 이번 구현은 원래 깨끗했던 `src/App.tsx`, `src/siteData.ts`, `src/styles/site.css`와 이 새 문서로 한정한다.
- 정책 URL 생성물과 Hub snapshot은 직접 수정하지 않는다. 사이트 배포·공식 스토어 상태 확인은 이 작업 범위에 포함되지 않는다.
- P1=방문자가 사실을 잘못 이해할 수 있는 문제, P2=접근성·공통화 개선이다.

## 공통 디자인 시스템에 환류할 항목

### PF-DS-01 · P2 · 기존 Link의 외부 링크·목적 설명 recipe

- **근거:** `src/App.tsx:22`의 ExternalLink는 모든 링크를 새 탭으로 열고 generic ReactNode를 렌더한다. 카드에는 App Store/Google Play/Source가 반복되며 공식 문서에도 같은 이름의 지원·개인정보 링크가 반복된다.
- **제안:** 기존 HJM Link의 외부 이동 표시·새 탭 안내·focus recipe를 적용 검토하고, 앱 이름과 이동 목적이 접근성 이름에 포함되도록 제품 wrapper에서 조합한다. 아이콘을 링크 의미의 유일한 단서로 사용하지 않는다. 현재 `rel=noreferrer`는 유지한다.
- **영향 표면:** 웹 앱 카드·공식 문서·개발자 링크.
- **완료 기준:** 링크 목록 탐색에서 어느 앱의 어느 목적지인지 구분된다. 키보드 focus·새 탭 동작·외부 아이콘 중복 낭독, 320px/200% 확대를 브라우저에서 확인한다. 새 Link primitive는 만들지 않는다.
- **상태:** 설계 후보, 미구현.

### PF-DS-02 · P2 · 브랜드 CSS와 HJM 상태/타이포 토큰 경계

- **근거:** `src/styles/site.css:1`은 자체 palette, `:85`는 11px 보조문구, `:160`은 9px+nowrap 상태 label을 정의한다. `src/App.tsx`는 일부 foundation만 사용하고 status는 일반 span이다.
- **제안:** 기존 Badge와 Text로 상태·본문 의미를 연결하되 forest/lime 브랜드와 hero 구성은 제품에 남긴다. 긴 한국어 상태명·버전 표기는 wrap 가능한 조합으로 하고 작은 글자의 크기·대비를 실제로 검증한다. token 개수를 늘리는 것보다 반복 역할을 먼저 매핑한다.
- **영향 표면:** 웹 카드 상태·기술 태그·공식 문서 목록.
- **완료 기준:** light/system-dark 조건 모두 의도한 제품 palette와 focus가 유지되고 320px/200% 확대에서 상태명·앱명·링크가 잘리지 않는다. 기존 HJM beta 컴포넌트 채택과 foundation 전체 준수를 구분한다.
- **상태:** 설계 후보, 미구현.

## 제품 설계·기능 항목

### PF-PROD-01 · P1 · 표시 데이터에서 현황 집계

- **조사 당시 근거:** `src/App.tsx` hero가 관리 앱 05·스토어 공개 앱 02·지원 플랫폼 02를 하드코딩하고 하단에는 iOS/Android/Web 세 종류를 표시했다. `src/siteData.ts:19`의 실제 소개 목록과 숫자 사이에 연결이 없었다.
- **변경:** `src/siteData.ts`의 `portfolioSummary`가 소개 앱 수, iOS/Android URL을 가진 앱 수, 연결된 스토어 플랫폼을 파생한다. hero는 같은 집계를 렌더하고 하단 플랫폼도 같은 배열에서 표시한다.
- **설계 이유:** URL 유무는 현재 공개 출시 상태를 증명하지 않는다. 따라서 `소개 중인 앱 / 스토어 링크가 있는 앱 / 스토어 연결 플랫폼`으로 표기한다. 카탈로그의 모든 제품을 자동 공개 소개 목록에 넣거나 로컬 버전을 스토어 버전으로 추정하지 않는다.
- **영향 표면:** 웹 hero 현황·플랫폼 목록. 공개 정책 및 기존 앱 카드의 상태/버전은 변경하지 않는다.
- **완료 기준:** 앱 배열 또는 스토어 URL 변경 시 집계와 플랫폼 목록이 같이 변경되고, 같은 앱의 iOS+Android 링크는 앱 수에서 한 번만 센다. lint/typecheck/build와 브라우저에서 현재 05/02/02·iOS/Android를 확인한다.
- **상태:** 소스 구현 완료. 검증 결과는 아래 기록 참조. 배포 미실행.

### PF-PROD-02 · P1 · 수동 출시 상태의 확인 근거와 갱신

- **근거:** `src/siteData.ts:27`, `:42`, `:80` 등에 상태와 버전이 하나의 문자열로 저장된다. [PRODUCT](../PRODUCT.md)는 스토어 검증 날짜·근거 registry를 미이관으로 기록한다.
- **현재 동작:** URL·버전 문자열이 오래되어도 빌드가 통과한다. 로컬 저장소 버전과 다르다는 이유만으로 실제 스토어 표시가 틀렸다고 단정할 수는 없다.
- **제안:** 앱별 표시 상태를 개발/스토어별 확인 상태로 분리하고 `verifiedAt`, 공개 확인 URL, 확인된 store version을 저장한다. 미확인 버전은 출시 주장에 사용하지 않는다. 초기에는 정적 데이터+리뷰 절차로 충분하며 계정 API나 주기적 크롤러를 도입하지 않는다.
- **영향 표면:** 웹 앱 카드·표시 데이터. 정책 링크는 Hub 생성 계약을 유지한다.
- **완료 기준:** iOS만 공개/Android 대기, 양쪽 공개, 개발 중, 확인 오래됨을 독립 표현한다. 실제 공개 스토어 페이지 근거를 기록한 뒤 표시를 갱신하며 소스·빌드·배포·스토어 사실을 분리한다.
- **상태:** 설계 후보, 외부 스토어 검증 및 구현 미실행.

## 검증 기록

- Git 상태, manifest, HJM import와 실제 UI, 제품 데이터·정책 생성 경계를 읽었다.
- PF-PROD-01과 아래 간격·버튼 보정을 구현했다. 다른 후보는 설계 상태다. generated 정책 파일·표준 projection·기존 dependency diff를 수정하지 않았다.
- Node 24.20.0 / pnpm 11.24.0에서 `pnpm check` 통과: 문서 링크 25개 Markdown, policy snapshot, ESLint, 기존 정책 테스트 4개, TypeScript·Vite production build. snapshot은 현재 Hub와 비교한 결과가 아니다.
- Codex in-app browser의 로컬 개발 서버에서 1280px/320px를 확인했다. 현황은 05/02/02·iOS/Android이며 CTA는 `#apps`로 이동한다. 실제 배포와 외부 링크 가용성·스토어 공개 확인은 미실행이다.

## 추가 반영: 넓은 간격·버튼 UI

사용자가 전반적인 간격과 버튼 UI를 지적한 뒤 소스와 브라우저를 대조했다.

- **원인:** 제품 CSS의 hero 최소 790px·section 상하 120px·heading 아래 60px·card 최소 510~540px가 본문을 밀었다. HJM 공통 spacing 값의 영향과 구분한다.
- **수정:** hero 최소 680px(1280px 화면에서 실제 약 686px), section 80px/모바일 56px, heading 아래 36px/모바일 28px로 줄였다. 카드의 강제 최소 높이를 제거하고 grid stretch로 같은 행 정렬을 유지했다.
- **버튼:** 최소 48px·실제 50px 높이, 8px 내부 icon gap·8px radius로 정돈했다. primary CTA의 HJM Icon 기본 secondary tone은 시스템 다크 모드에서 lime 배경에 밝게 표시됐다. 공개 className으로 제품 버튼의 currentColor를 상속해 글자·아이콘이 모두 `rgb(11,36,26)`가 되게 했다. focus-visible outline과 큰 글자에 따라 늘어나는 높이를 유지한다.
- **표면 색:** product paper/ink를 site-shell에 명시해 시스템 테마의 중립 표면색이 브랜드 카드 영역에 섞이지 않게 했다. HJM 내부 token·컴포넌트 파일을 앱에서 수정하지 않았다.
- **브라우저 확인:** 320px에서 document scrollWidth=320, 두 CTA 모두 높이 50px, 카드 폭 279px 대비 scrollWidth 278px로 가로 넘침 없음. 현황 label·수치·플랫폼이 잘리지 않았다. 모든 브라우저·200% 확대·스크린리더 전체 준수를 검증한 기록은 아니다.
