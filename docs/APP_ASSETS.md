# 앱 아이콘과 소개 원천

검토일: 2026-10-21

GitHub 프로필에 이 사이트의 `public/apps`를 복사했지만, 네 앱의 현재 launcher 원본과
모두 달랐다. 사이트에 있던 파일을 최신이라고 보는 대신 각 앱의 설정이 가리키는 원본을
직접 확인한다. `scripts/sync-app-icons.mjs`가 그 경로와 SHA-256을
`public/apps/sources.json`에 기록하며 이미지를 바이트 그대로 복사한다.

```bash
node scripts/sync-app-icons.mjs --write  # 현재 제품 설정의 원본 검토 후 동기화
node scripts/sync-app-icons.mjs         # 사이트 snapshot + 접근 가능한 제품 원본 비교
```

독립 checkout에서는 snapshot 바이트만 확인하며 제품 원본의 최신 상태를 검증한 것으로
보고하지 않는다. 앱이 icon 경로를 바꾸면 `apps/mobile/app.json`·`app.config.ts`의 일반·iOS 설정과 스크립트의 경로를 함께 검토한다.
2026-10-21 비행중의 이전 폴더와 다에리 v4 참조가 남아 동기화가 실패한 원인을 수정했다.
현재 다에리는 v5 참새 아이콘을 사용하며 비행중은 `apps/mobile/assets/release-hub`를 사용한다.
제품 설정의 개발 후보 아이콘을 복사한 사실과 스토어에 공개된 아이콘은 구분한다.
이력서·공통 포트폴리오 자산도 같은 제품 원본에서 만들며 해당 폴더의
`공통원본/문서_편집규격.md`와 `기본지원자료/시각자료/앱아이콘/sources.json`을 따른다.
Taground는 보관된 제품 이미지이므로 현행 앱 아이콘 동기화 대상에서 제외한다.
과거 게시 산출물인 `.published/`의 이미지도 이력 원본으로 보존한다.

제품 이름·소개는 앱 README와 실제 제품 계약에서 확인하고, 공개 스토어는 Apple lookup과
실제 Google Play 페이지를 확인한다. 2026-10-09 Diairy·Spint의 App Store 레코드를 확인해
목록에 추가했으며 Utilverse는 catalog의 incubating에 맞춰 개발 중으로 표시했다.
Spint Android 페이지는 404였으므로 확인되지 않은 스토어 이동 버튼은 제공하지 않는다.
같은 제품 이름을 한국어/영어 슬롯에 반복하는 라틴 이름은 카드 제목에서 한 번만 표시한다.

Diairy는 자체 도메인에서 법률 문서를 제공하므로 중앙 Site 전용 `policy.json`이 없다.
정책 투영기는 Hub의 `store.policyPublication=app-owned`도 포함하며 공개 URL 세 필드만
투영한다. 원본 app profile을 복사하는 대안은 심사 자격증명이 섞일 수 있어 사용하지 않는다.

이번 변경은 웹 표면의 제품 정보와 정적 자산만 바꾸며 제품 앱·서버·공용 계약은 변경하지 않는다.
사이트의 개발자 사진은 사용자가 새로 지정한 사진과 같은 인물·구도의 기존 원본이다.
프로필과 사이트의 검증·배포 범위는 [QA 리포트](qa/2026-10-09-profile-products-refresh.md)에 기록한다.

2026-10-18 Flutter 정리: 선택의창과 오늘야구 아이콘 원본을 현재 Expo app config가 사용하는 자산으로 변경했다. 공개 사이트 배포는 별도다.
