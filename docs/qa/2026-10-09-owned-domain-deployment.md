# QA 리포트 — 포트폴리오 자체 도메인 이전

## 1. 최종 판정

자체 도메인 공개 통과. DNS/TLS·root/한국어 화면·www 이동·27파일 status/bytes/cache·미등록404·기존 서비스 smoke를 확인했다. GitHub 이전 주소도 이동 안내 게시를 확인했다.

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

- 지정 Node 24.20.0 / pnpm 11.24.0의 pnpm check exit 0. 문서·i18n·snapshot·12tests·TypeScript·Vite build 통과.
- 캐시 설정 후 artifact 3tests와 bash -n 통과. 첫 배포에서 Caddy가 조건 없는 cache header를 뒤에 적용해 HTML이 max-age=300이 되는 것을 관측했다. 서로 겹치지 않는 matcher로 수정하고 후보의 모든 파일 cache 계약을 검증한 뒤 새 source로 재게시했다.
- 현재 운영 source `1996ea1419ae282458937a0ee8d0b2f53f21c851`, release `/srv/portfolio-site/releases/1996ea1419ae282458937a0ee8d0b2f53f21c851-1080046dcea3`.
- manifest SHA-256 `1080046dcea3ccfb4049f98489c498910cd847d9ef56cf9217f58226b62f7e74`, archive SHA-256 `cc4a3f0e1cc8887b48b432f1cba1e052b6c805b189eba408e9439dab887cd613`.
- 이전 release caefba364db6870592137c73f344bfcda577cd7b-a6839b80290b를 previous에 보존. root 소유 release와 source/hash/edge/deployed.at 기록 일치, Caddy active.
- OVH apex/www A 51.79.240.56 TTL300 저장, authoritative dig 일치. 정책/다른 앱 DNS 불변. Aside의 저장 후 row 확인 보고와 캡처를 확인했고, 후속 독립 readback은 Aside 재시작 뒤 기존 탭/로그인 세션이 없어 재현되지 않았다. DNS 결과와 실제 HTTPS로 외부 상태를 확인했다.
- root TLS CN jmstudioapps.com, 유효기간 2026-10-09~2027-01-07. www HTTPS 308 location `https://jmstudioapps.com/ko-KR/?from=www`, 인증서 우회 없음.
- 후보 27파일 hash/status/nosniff/cache 및 3음성404 통과. 공개 curl로 27파일 digest/cache 일치. 처음 Python SSL 핸드셰이크는 timeout이 났으며 동일 public 대상 curl 인증서 검증으로 재검사해 전체 통과했다.
- 실제 in-app browser root 및 /ko-KR/ 진입과 #legal 이동, 사진·앱/정책 링크 표시 확인. 별도 디자인·테마 변경 없음.
- 기존 정책 root 200, 전체 12문서 기본 preflight pass. 최신 immutable passing `~/.local/share/app-release-hub/artifacts/privacy-preflight/passing/3be57e90e4a7f62670fb5a58dfc2ed49e3222f2987d5af3a5cc4894e465fe875.json` 보존.
- BurnTok API readiness database/redis up, 기존 revision a598cca 유지. 앱 컨테이너/DB 교체 없음.
- macOS tar의 provenance xattr 경고는 archive 검증·설치 파일 SHA·공개 bytes가 모두 일치해 payload 영향 없음.


## 6. 남은 범위

GitHub 이전 주소가 빌드 전 source를 제공하는 것을 확인해 main /docs 이동 안내로 provider 설정을 정정했다.
source 5d1b618의 Pages build와 공개 안내는 따로 검증하며 server 301/308로 보고하지 않는다.
실제 운영 rollback drill은 미실행. 기존 스토어 marketing URL은 별도 등록값 전환 조건으로 남긴다.

## 7. 보관 처리

새 branch/worktree 없음. source·배포 도구·fixture·운영 release/manifest는 보존하고 로컬 export와 raw 로그/캡처는
최종 결과를 요약한 뒤 제거한다. 기존 GitHub 운영 branch·과거 게시 산출물·다른 서비스는 유지한다.

소비자·이력서 영향 및 미확인 외부 등록값: [영향 조사](2026-10-09-domain-migration-impact.md).

GitHub Pages API는 main /docs, build_type legacy로 확인했고 Pages build commit
5d1b618f2151872b639203911b2fb0236cdecb1a 상태 built/error null을 확인했다. 설정 저장만으로 이전
root build가 남아 있어 명시적 Pages rebuild를 요청했다. 이후 root 및 /ko-KR/의 공개 HTML은
커밋된 이동 안내와 일치한다(진단 query 포함 요청). 실제 브라우저에서 `https://jim1286.github.io/ko-KR/?from=old#legal` 진입 후 최종 `https://jmstudioapps.com/ko-KR/?from=old#legal`과 정상 화면을 확인했다.

지침 검사: root check-doc-links 393문서/finding0, check-policy-consistency 83문서 ready.
Portfolio 문서 링크 48문서 ready. 루트 AGENTS의 다른 세션 로컬 DB 변경은 분리 보존했고
이번 도메인 지침 hunk만 stage했다. 운영 release는 기능 source 1996ea1이며 후속 docs/호환 안내
커밋은 사이트 본문 artifact를 바꾸지 않는다.
