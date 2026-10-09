# QA 리포트 — 포트폴리오 자체 도메인 이전

## 1. 최종 판정

검사·게시 진행 중. 공개 확인 뒤 이 문서의 판정을 갱신한다.

## 2. 대상과 이력

2026-10-09 KST, 개발 Mac Codex, portfolio-site main 시작 SHA 96433af0167f6b097c42df53664792faae36c721.
사용자가 jmstudioapps.com 포트폴리오 + www redirect 및 같은 VPS 정적 게시 제안에 “ㅇㅇ 그렇게 하자”라고 승인했다.
이번 직접 배포는 앞선 직접 배포 후속이다. 제품 version 1.1.0 유지, native·DB·스토어 변경 없음.

## 3. 환경과 범위

Node 24.20.0, pnpm 11.24.0, Vite 정적 web 한 표면. 기존 OVH VPS Caddy 2.6.2.
기존 정책·BurnTok 서비스 및 공유 host lock 확인. UI 구조·테마·최대 글자 조건 변경/검사 없음.

## 4. 확인 결과와 수정

기존 source index를 GitHub Pages main 루트로 제공하면 미치환 metadata와 source entry가 노출될 수 있었다.
VPS는 실제 dist만 제공하며 canonical/OG를 자체 도메인으로, locale entry는 해당 locale canonical로 맞춘다.
manifest closure/hash·미등록404·원자 교체와 실패 복구를 추가한다.

## 5. 검사 결과

진행 중. pnpm check와 후보/공개 검증 뒤 기록한다.

## 6. 남은 범위

GitHub Pages 이전 주소는 유지하되 별도 재게시/redirect 설정은 이번 범위에 포함하지 않는다.
실제 운영 rollback drill은 미실행. 기존 스토어 marketing URL은 별도 등록값 전환 조건으로 남긴다.

## 7. 보관 처리

새 branch/worktree 없음. source·배포 도구·fixture·운영 release/manifest는 보존하고 로컬 export와 raw 로그/캡처는
최종 결과를 요약한 뒤 제거한다. 기존 GitHub 운영 branch·과거 게시 산출물·다른 서비스는 유지한다.
