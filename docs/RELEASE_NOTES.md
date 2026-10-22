# 앱별 출시 노트

2026-10-22 사용자 요청으로 제품 다음에 독립 `#releases` 탭을 두고
`#releases/<app-id>`에서 앱별 버전 기록을 제공한다. 7개 활성 앱만 대상으로 한다.
HJM Tabs·TabPanel·Card·Badge·Stack·Text를 사용하며 별도 카드/탭 스타일을 만들지 않는다.

## 원본과 날짜

`src/releases/data.ts`는 각 제품의 실제 `app-vX.Y.Z` 또는 `app-vX.Y.Z+build` 태그에서
`.release-hub/app.json#releaseNotes` 문자열만 추출한 공개 snapshot이다. 현재 Hub의
current.version은 제품 버전과 다를 수 있어 버전 원천으로 사용하지 않았다. 각 버전의
태그·정확한 commit을 데이터에 보존한다. 날짜는 해당 source commit의 기록일이며
스토어 공개일이 아니다. 메타데이터에 출시 노트가 없는 과거 태그의 내용을 추측하지 않는다.
동일 버전의 Android repair/iOS rebuild 태그는 별도 제품 출시로 중복 표시하지 않는다.

## 공개 상태의 근거

10/21까지 제품 docs/RELEASE.md의 실제 제출·Console/API 확인 기록을 대조했다.
오늘야구2.2.0, 선택의창2.1.0, 다에리1.9.0은 양 스토어 심사/검토 기록이다.
번뚝1.7.0·비행중1.1.3의 Android completed는 공개 완료로 바꾸지 않고 트랙 제출로 표시한다.
Spint1.3.0 Android는 내부 테스트 제공 화면 기록(테스터 실제 설치 미확인),
Utilverse1.2.0 Android는 비공개 Alpha 검토 중이다. iOS 최신7개는 심사 대기 기록이다.
날짜가 지난 관측을 현재 실시간 상태로 표현하지 않는다. 운영 스토어 조회/변경·앱 릴리즈를
이 사이트 작업에서 실행하지 않았다. 과거 공개 확인은 오늘야구2.1.1 Android,
선택의창2.0.0 iOS, 비행중1.1.2 iOS의 명시 기록만 연결했다.
다른 버전의 태그/CI 완료만으로 스토어 공개를 주장하지 않는다.

## 확보 범위

- yajalal: 태그20개 확인, 출시 노트17개 확보. 원본 HEAD `ad2a0c02dcad52ae99089afea7516db6d90cecbe`. 노트 미확보 app-v1.19.5+65, app-v1.19.4+62, app-v1.19.2+59. 재빌드/repair 제외 0개.
- choose-window: 태그12개 확인, 출시 노트11개 확보. 원본 HEAD `62f591ed3ca29f75b182431c7b019672e748e126`. 노트 미확보 app-v1.1.7+13. 재빌드/repair 제외 0개.
- burntok: 태그17개 확인, 출시 노트16개 확보. 원본 HEAD `511afff07d58c0d314d910492f0df926a815aaad`. 노트 미확보 없음. 재빌드/repair 제외 1개.
- unairplane: 태그17개 확인, 출시 노트15개 확보. 원본 HEAD `e45756676fc5af67b38087d8c75f4cf24a30ec7c`. 노트 미확보 app-v1.0.2, app-v1.0.1. 재빌드/repair 제외 0개.
- diairy: 태그20개 확인, 출시 노트20개 확보. 원본 HEAD `298236a75b70841825792e583bbd2f2c4d7d0488`. 노트 미확보 없음. 재빌드/repair 제외 0개.
- spint: 태그9개 확인, 출시 노트8개 확보. 원본 HEAD `b6300db8a23fb7443dbb42deeef054b1c2813a6d`. 노트 미확보 없음. 재빌드/repair 제외 1개.
- utilverse: 태그6개 확인, 출시 노트4개 확보. 원본 HEAD `98b8bcab53de40cb20d80c38663ce85957999693`. 노트 미확보 없음. 재빌드/repair 제외 2개.
