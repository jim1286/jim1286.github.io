# 황지민 · 공식 개발자 사이트

[jim1286.github.io](https://jim1286.github.io/)에 배포되는 독립 개발자·앱 포트폴리오
사이트입니다. 앱 스토어의 개발자/마케팅 웹사이트와 앱별 개인정보처리방침·계정 삭제·지원
문서의 공식 진입점으로 사용합니다.

## 공개 정보의 기준

- 앱 identity와 저장소: `app-portfolio/portfolio.json`
- 버전, 스토어 상태와 URL: App Release Hub의 release profile 및 store binding
- 앱 설명: 각 앱 저장소의 최신 README
- 개인정보처리방침과 지원 문서: `hjm-app-policies.jimin1286.chatgpt.site`

정책 본문은 이 저장소에 복제하지 않습니다. 이 사이트는 정책 사이트의 앱별 공식 문서로
연결하며, 정책의 개정과 배포는 App Release Hub가 관리합니다.

## 개발

```bash
npm ci
npm run dev
npm run lint
npm run build
```

## 배포

`main` 브랜치를 push한 뒤 `npm run deploy`로 빌드 결과를 `gh-pages` 브랜치에 배포합니다.
