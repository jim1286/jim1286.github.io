---
schema: hjm.app-document/1
document: product
app_id: "portfolio-site"
display_name: "Portfolio Site"
status: draft
owner: "jimin"
reviewed: "2026-10-09"
version: "1.1.0"
---

# Portfolio Site 제품 계약과 이관 현황

공식 개발자 소개, 앱별 소개와 스토어·정책·지원 링크의 공개 진입점을 제공한다.
앱 기능을 실행하거나 계정을 관리하는 제품 서버는 제공하지 않는다.

2026-10-18 사용자 요청으로 현재 운영·개발 중인 앱 7개와 개발 중단 프로젝트를 분리했다. 모펀·태그라운드는 앱 목록 아래의 별도 영역에 보존하며 상단 앱 수에서 제외한다. 오늘야구 아이콘은 Expo 제품의 현재 브랜드 원본을 사용한다. 스토어 공개 상태는 이번 변경에서 새로 판정하지 않았다.

## 현재 화면 구성 (2026-10-21)

소개 → 구조 → 설계 → 제품 → 성과 → 발전 이력 → 연락의 7개 탭이다. 설계 탭은 드릴다운 아키텍처 하나로 탐색한다
(`src/architecture`). 공통 구조에서 개발·배포 Mac, 공통 개발 규격, 앱 목록과 앱별 구조, 코드 구조 5개 관점으로
들어가며 각 화면은 `#design/arch/<view>` 주소를 가진다. 탐색 방식이 둘로 겹친다는 사용자 판단으로 설계 5단계
Steps를 없애고, 운영·QA 탭도 없앴다. 배포·관측·복구 흐름은 배포 Mac 화면과 겹쳐 삭제했고, 작업 지침(`guide`)과
QA(`qa`)는 개발 Mac 아래, 마케팅 사례(`marketing`)는 공통 구조 아래 화면으로 옮겼다. 예전 `#operations`·`#workflow`·
`#strategy`는 배포 Mac, `#guidance`는 작업 지침, `#marketing`은 마케팅, `#qa`는 QA 화면으로 연다.
모든 화면은 같은 노드 도식으로 그린다. 코드 구조·작업 지침·QA·마케팅은 기존 도식의 박스·경로·문구 키를
`src/architecture/legacyViews.ts`에서 그대로 옮겨 노드 지도로 렌더링한다(2026-10-21 사용자 요청). 운영 호스트의
세부 이름과 계정 정보는 역할 단위로 줄여 공개한다.

개인 서비스 7개 집계에는 포트폴리오 사이트와 종료 제품이 포함되지 않는다. 구조의 apps 저장소 8개에는 이 사이트가 포함된다. 태그라운드는 제품 방향을 Spint로 흡수한 이전 제품이며 코드 전체를 이식했다고 주장하지 않는다. 연락 탭은 개인 서비스 7개의 공식 정책·지원 링크를 제공한다.

아래 개편 기록은 당시 구성의 이력이며 현재 탐색 구조는 이 절을 따른다.

## 2026-10-19 역할·설계·관리·결과 중심 개편

방문자가 무엇을 만들고 어떤 설계와 관리를 했는지 연결해 읽도록 소개 → 제품과 결과 → 설계 → 운영과 개선 → 연락의 5개 장으로 개편했다. 업무 프로젝트는 해결할 문제·맡은 일과 설계·확인한 결과를 나란히 보여준다. 개인 서비스는 사용 장면·설계 경계·공개 링크를 함께 제공하며 종료 제품은 별도 펼침으로 보존한다.

설계 장에는 핵심 판단을 먼저 제시하고 HJM·앱/웹·서버 계약 도식은 상세 펼침에 둔다. 운영 장에는 개발·검증·배포, 작업 지침 지도와 마케팅 사례를 연결한다. 과거 #guidelines는 설계, #marketing은 운영으로 연결한다. 각 장 끝에 다음 읽기 링크를 둔다. 기존 7탭 구성은 아래의 과거 기록이다.

## 2026-10-18 개발자 포트폴리오 개편

한 페이지에 정보가 몰려 읽기 어렵다는 사용자 요청으로 소개·앱 프로젝트·개발 흐름·디자인 시스템·지침 구조·마케팅 전략·지원의 7개 주제 탭으로 나눴다. 기존 `#apps`, `#discontinued`, `#strategy`, `#legal`, `#developer` 링크는 관련 탭으로 연결한다.

공통 이력서·포트폴리오(2026-10-12)의 확인된 Hubble·ExploreQA 경험과 AI 협업 내용을 편집했다. 이력서 원본·내부 근거·전화번호·비공개 인적정보는 게시하지 않는다. 회사 AI 모듈 개발과 제품 연동의 기여 경계를 유지한다. 디자인·지침은 현재 중앙 AGENTS와 HJM 선택·브랜드 경계 및 문서 체계 지도를 대조했다. 마케팅은 중앙 정책과 Hub `marketing/GUIDE.md`의 현재 일상툰·앱 소개툰 운영을 설명하며 중단된 릴스 제작과 미측정 성과를 주장하지 않는다.

도식 편집 원본은 `docs/diagrams/`에 있으며 게시 HTML과 SVG 미리보기는 `public/diagrams/`에 둔다. Archify 2.11 renderer로 생성한 도식이며 HTML은 테마·내보내기를 제공한다. SVG는 같은 도식의 geometry와 CSS를 담은 light 미리보기다. 이전 두 전략 HTML은 기존 외부 링크를 위해 보존한다.

2026-10-21 사용자 요청으로 제품 다음 성과 탭을 추가했다. 대상은 현재 7개 앱이며 모펀·태그라운드·포트폴리오 웹은 제외한다. 통합·앱별 활성 사용자·신규 사용자·예상 광고 수익과 실제 관측 추이, 주요 개선 이력을 HJM으로 표시한다. 설치 사용자와 수집 현황은 상세 펼침에 둔다. 집계·누락·출처 경계와 검증 상태는 [성과 자료](PERFORMANCE.md)를 따른다.

## 데이터 책임

| 내용 | 원천 | 갱신·검증 |
| --- | --- | --- |
| 앱 소개·표시 상태 | [siteData.ts](../src/siteData.ts) | 앱 저장소·공식 스토어의 공개 사실 대조 후 리뷰 |
| 정책·지원 경로 | App Release Hub 공개 policy projection | `policy:sync` 후 source/snapshot 검사 |
| 화면·이미지 | [App.tsx](../src/App.tsx), `public/` | 로컬 preview에서 링크·반응형 확인 |

정책 본문과 계정 삭제 처리는 외부 공식 사이트가 소유한다. 이 사이트에 입력 양식·추적·계정
기능을 추가하면 개인정보 흐름과 보존·삭제 책임을 설계한 뒤 구현한다.

## 개발자 포트폴리오와 마케팅 사례

2026-10-09 사용자 요청으로 캐릭터가 방문자에게 앱을 소개하던 구역·메뉴·이미지를 제거했다.
앱 소개는 `/#apps`의 제품 목록 하나로 제공한다. 이전 캐릭터 해시를 새로 노출하거나 별도
앱 소개 카드를 유지하지 않는다. Instagram·Threads 계정의 외부 링크는 이 코드 작업에서 변경하지 않는다.

포슬이는 마케팅 전략 안에서 설명하는 운영 사례다. 공통 캐릭터 브랜딩과 @posli.makes의
일상툰·앱 소개툰 운영, 릴스 제작·검수 방식을 설명한다. 별도 캐릭터 소개 화면이나 설치 유도
구역을 다시 만들지 않는다. 채널 편성·권한·제작 절차는 중앙 마케팅 GUIDE가 소유하며 이
포트폴리오는 현재 운영 방식을 요약한다. 게시 빈도·매출·설치 전환 성과는 주장하지 않는다.

## 작업 방식 소개

2026-10-08 사용자 요청으로 개발과 마케팅 전략을 단계별 도식으로 소개한다. 문제 정의,
구현·QA·개선과 검색·발견 경로의 차이를 설명하며 미확인 매출·전환율·자동 계측 성과를 넣지 않는다.
개발자 사진은 사용자가 지정한 원본 비율을 유지하고, 이름 대신 쓰이던 HJ 이니셜 표시는
화면과 공유 이미지에서 제거한다.

## 완료 조건과 현재 상태

- 구현 변경은 `pnpm check`를 통과해야 한다.
- 공개 URL 변경은 원본 비교와 실제 링크 확인을 포함한다.
- 표시 버전은 수동 데이터다. 스토어 검증 날짜·근거를 기록하는 별도 evidence registry는 미이관이다.
- 공통 v1 계약 이관은 완료했다. 구현 준수 및 required merge gate 설치는 별도 미완료이며 기존 QA는 제품 행동 검증으로 유지한다.

## 90. Acceptance criteria

| ID | 기준 | 검증 방법 | 상태 | Evidence ID |
| --- | --- | --- | --- | --- |
| PROD-001 | Portfolio Site의 PRODUCT에 기록된 핵심 사용자 여정을 완료하고 결과를 확인한다. | 대표 persona 5명의 moderated usability test | pending | EV-001 |

## 91. Evidence registry

| ID | 기준 | 타입 | 위치 | 캡처 시각 | digest | 상태 | 소유자 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| EV-001 | PROD-001 | report | docs/evidence/planned/product-usability.md | — | — | planned | jimin |

<!-- hjm-contract-evidence
{
  "category": "product",
  "criteria": [
    {
      "id": "PROD-001",
      "category": "product",
      "statement": "Portfolio Site의 PRODUCT에 기록된 핵심 사용자 여정을 완료하고 결과를 확인한다.",
      "verification": "대표 persona 5명의 moderated usability test",
      "status": "pending",
      "evidenceIds": [
        "EV-001"
      ]
    }
  ],
  "evidence": [
    {
      "id": "EV-001",
      "criterionIds": [
        "PROD-001"
      ],
      "type": "report",
      "location": "docs/evidence/planned/product-usability.md",
      "status": "planned",
      "owner": "jimin"
    }
  ]
}
-->

마케팅 탭의 dots 활용안은 조사 → 소재·편성 → 사람 검수 → 승인된 게시 → 반응 요약의 도입 구상으로 표시한다. 실제 예약·게시 자동화나 성과를 주장하지 않는다. 기능 참고: https://learn.chatgpt.com/docs/dots 및 /docs/dots/tasks-and-memory.
Utilverse 아이콘은 현재 mobile app.json이 참조하는 assets/images/icon.png 원본으로 교체했다. public/apps/sources.json에 출처와 SHA-256을 기록한다.

번뚝 Android 링크 누락은 siteData의 androidUrl을 보완했다. 2026-10-18 Google Play 공개 페이지에서 번뚝·IAHJM·설치 버튼을 확인했다: https://play.google.com/store/apps/details?id=app.burntok.mobile&hl=ko
