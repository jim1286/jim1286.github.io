# QA 리포트 — 자체 도메인 정책 링크 동기화

## 최종 판정과 대상

2026-10-09 KST, Codex, main. source 동기화·원본 비교·전체 check 통과. 포트폴리오 공개 배포는 미수행.
Hub 중앙 정책이 https://policies.jmstudioapps.com 로 실제 게시된 뒤 Hub 원본에서 `pnpm policy:sync`로
생성물과 공개 snapshot을 갱신했다. 생성물을 직접 바꾸는 대안은 source digest를 깨므로 사용하지 않았다.
중앙 4앱은 새 origin, BurnTok·Diairy·Spint app-owned 목적지는 기존 제품 URL을 유지한다.

## 검사와 관측

- `pnpm policy:sync`, `pnpm policy:check`: source-synchronized / source-verified.
- `.nvmrc` Node 24.20.0와 pnpm 11.24.0으로 `pnpm check`: exit 0. 문서·snapshot·9개 정책 테스트·i18n·TypeScript·Vite build 통과.
- 첫 check는 기본 Node 26.11.0에서 engine 경고와 함께 통과했으나 정본 환경 검증이 아니어서 지정 Node로 다시 실행해 통과했다.
- 변경은 중앙 origin·URL·snapshot digest뿐이며 정책 본문과 제품 버전은 바꾸지 않았다. 화면·최대 글자 QA는 범위 밖이다.

## 남은 범위와 보관

`docs/RELEASE.md`의 2026-10-09 기록상 Pages는 main + / 게시로 바뀌었지만 기존 publisher는 gh-pages를
사용한다. 이 경로 정합성 작업은 delivery에서 완료한 뒤 최신 source를 게시해야 한다. 이번 정책 사이트
게시 성공을 포트폴리오 새 공개 배포의 증거로 사용하지 않는다. 기존 Sites 주소를 유지하므로 기존
포트폴리오 링크의 목적지를 제거하지 않았다.

브랜치·worktree를 만들지 않았고 기존 main 한 곳에서 지정 파일만 커밋했다. 기존 ignored dist는 제품의
반복 build 출력이며 원시 QA 캡처·임시 로그는 만들지 않았다. 정책 snapshot은 재현 가능한 공개 계약
입력이라 보존한다. source 저장소와 Pages의 기존 운영 브랜치/게시 산출물은 유지한다.
