# 자체 도메인 정적 사이트 배포

2026-10-09 사용자가 jmstudioapps.com을 포트폴리오로, www를 메인 주소 redirect로 사용하도록 승인했다.
이번 이관은 앞선 정책 사이트 직접 배포의 후속 승인으로 개발 Mac Codex가 수행한다. 이후 기본 delivery는 mac-ci다.
도메인 별칭만 GitHub Pages에 연결하는 대안은 기존 게시 설정 불일치를 유지하므로, 검증된 dist를 기존 VPS에 직접 게시한다.
앱 버전·CI 버전 트리거·다른 앱 DNS/컨테이너/DB는 바꾸지 않는다. 사이트 소스는 main이며 새 branch/worktree를 만들지 않는다.

## 운영 주소와 권한

- https://jmstudioapps.com/ 및 /ko-KR/: 정적 포트폴리오
- https://www.jmstudioapps.com/: 메인으로 308, path/query 보존
- OVH DNS apex/www A 51.79.240.56 TTL300
- 서버: 기존 ubuntu@51.79.240.56, Caddy. /etc/caddy/conf.d/portfolio-site.caddy
- 파일: /srv/portfolio-site/releases/<source-sha>-<manifest-prefix>/public, current/previous symlink
- SSH 관리 권한 및 기존 known_hosts가 필요하다. 키 원문은 소스/로그에 넣지 않는다. 특정 ChatGPT 계정·Codex 실행은 필요 없다.
- 정책 사이트 /srv/app-policies와 분리하며 기존 /opt/burntok/deploy.lock만 공유한다.

## 재현과 게시

.nvmrc Node 24.20.0 및 packageManager pnpm 11.24.0을 사용한다. 저장소 루트에서 실행한다.
공유 checkout의 관련 tracked 소스는 지정 SHA와 같아야 한다. 새/비어 있는 저장소 밖 절대 artifact 경로를 사용한다.

```sh
pnpm install --frozen-lockfile
pnpm run policy:check
pnpm check
pnpm run deploy:prepare /absolute/empty/artifact <exact-main-source-sha>
pnpm run deploy:verify /absolute/empty/artifact <exact-main-source-sha>
pnpm run deploy /absolute/empty/artifact ubuntu@51.79.240.56 /absolute/ssh-key-file <exact-main-source-sha>
```

Hub 원본 비교는 접근 가능한 Hub checkout에서 실행한다. 독립 환경의 pnpm check는 공개 snapshot만
검사하므로 최신 Hub 원본 증명이 아니며, 원본 접근이 없으면 검증된 snapshot provenance를 먼저 확인한다.
배포 명령은 이미 검사한 artifact만 게시하며 내부에서 다른 source를 재빌드하지 않는다.

artifact는 manifest(source SHA·origin·정렬된 file/path/byte/hash)와 public만 포함한다. manifest는 web root 밖이다.
전송 archive hash와 서버 설치 closure/hash를 다시 검증하고 admin off loopback 18085 후보에서 모든 파일의
status/bytes와 미등록 404를 확인한다. 후보를 종료한 뒤 current 원자 교체·snippet validate/reload를 수행하고,
실패하면 이전 current/snippet을 복구한다. HTML은 no-cache, content hash assets는 1년 immutable,
나머지는 300초다. 실제 locale 파일을 제공하고 임의 URL에 SPA fallback을 하지 않는다.

## 공개 검증·복구·이전 주소

DNS/TLS 준비 뒤 각 manifest path의 공개 status/hash, root 및 /ko-KR/의 실제 화면과 JS/CSS·사진·도식·정책 링크,
www의 308 및 path/query, 기존 정책/번뚝 readiness를 확인한다. publisher 성공만으로 완료를 판정하지 않는다.
서버 source.sha·manifest·archive.sha256·deployed.at·edge.caddy를 게시 identity/복구용으로 보존한다.

후속 배포에서는 previous symlink와 해당 release의 edge.caddy를 host lock 안에서 current/snippet에 복구한 뒤
validate·reload·공개 검증한다. 첫 배포는 previous가 없으므로 문제 시 새 snippet을 제거하고 기존 GitHub URL을
유지한다. 실제 rollback drill이 없으면 절차와 리허설을 구분한다.

기존 jim1286.github.io의 Pages 설정·운영 branch·공개 산출물은 유지한다. GitHub Pages는 과거 주소 호환용이고
새 기본 deploy 명령은 VPS publisher다. 옛 주소에서 제공되는 내용의 최신화를 이번 도메인 게시와 혼동하지 않는다.
결과: [QA 리포트](../../docs/qa/2026-10-09-owned-domain-deployment.md).
