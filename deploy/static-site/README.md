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
pnpm build
pnpm run deploy:prepare /absolute/empty/artifact <exact-main-source-sha>
pnpm run deploy:verify /absolute/empty/artifact <exact-main-source-sha>
pnpm run deploy /absolute/empty/artifact ubuntu@51.79.240.56 /absolute/ssh-key-file <exact-main-source-sha>
```

2026-10-17 정책 대조에서 반복 배포에 전체 검사가 묶여 있어 `pnpm check`를 빌드로 교체했다.
빌드는 언어/정책 입력 정합성·타입·번들·locale 페이지를 만들며 테스트를 실행하지 않는다. 변경한 동작의
검사는 개발 때 선택하고 같은 소스·범위의 성공을 재사용한다.

Hub 원본 비교는 접근 가능한 Hub checkout에서 실행한다. 독립 환경의 build는 공개 snapshot만
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

기존 jim1286.github.io는 main /docs의 작은 이동 안내를 게시한다. main /의 Vite source를 제공하던 설정은
미치환 문구와 미빌드 JS로 실제 화면이 깨져 있었으므로 /docs로 고쳤다. docs/.nojekyll로 문서 빌드 간섭을 피한다.
JavaScript는 path/query/hash를 보존하며 새 도메인으로 이동하고, JS 미실행 시 meta refresh와 링크를 제공한다.
GitHub 응답은 HTTP 200 안내(알 수 없는 경로는 404 안내)이며 서버 301/308이 아니다. 새 기본 deploy는 VPS publisher다.
과거 .published 산출물·main의 Git 이력은 유지하며 운영용 branch를 새로 만들지 않는다.
결과: [QA 리포트](../../docs/qa/2026-10-09-owned-domain-deployment.md).

## 무인 게시 — 비공개 Hub와 격리 runner (2026-10-30)

사용자가 개발 Mac 없이 키 등록부터 일별 예약 실행까지 완료하도록 요청해 기존 publisher를 비공개
`jim1286/app-release-hub`의 `.github/workflows/portfolio-site-deploy.yml`에 연결했다. 공개 사이트 저장소에는
self-hosted runner를 등록하지 않는다. Hub의 기존 `[self-hosted, linux-vm]` runner가 mac-ci의 기존
admission/slot과 호스트 전환을 거쳐 실행하며, 진행 중인 native 배포를 중단하지 않는다.

키 원본은 mac-dev의 `HJM-Credentials/apps/diairy/ovh/ovh_airy_ed25519`다. 파일 MANIFEST의 `hosts`는
`mac-dev`로 유지하고 소비자에 Hub의 `portfolio-site` 환경 secret을 등록한다. mac-dev에서 다음 두 secret을
파일/stdin으로 직접 등록하며 값은 출력하지 않는다. operator 홈이나 LLM을 거쳐 전달하지 않는다.

- `PORTFOLIO_SITE_SSH_KEY`: 원본 SSH 개인키
- `PORTFOLIO_SITE_KNOWN_HOSTS`: 기존 접속에서 검증한 서버의 known_hosts 행. keyscan 결과를 자동 신뢰하지 않는다.

Actions는 게시 단계에만 이 비밀을 주입한다. 개인키와 pinned known_hosts는 격리 runner의
`$RUNNER_TEMP/portfolio-ssh-<run-id>-<attempt>/`에 0700 디렉터리·0600 파일로 쓰고 성공·실패 모두 정리한다.
호스트의 `ci-runner`와 operator 분리는 유지하며, 실제 Linux job 계정은 실행 로그의 `runner-user`로 확인한다.
이 방식은 사용자 터미널의 sudo 인증이나 개발 Mac의 SSH agent·온라인 상태에 의존하지 않는다.

```sh
gh workflow run portfolio-site-deploy.yml --repo jim1286/app-release-hub --ref main -f source_sha=<exact-site-main-sha>
```

동일 source의 기존 실행이 있는지 먼저 확인한다. run 제목은 `Portfolio site <source-sha>`이며
반환/조회한 정확한 run ID를 추적한다. dispatch 결과가 불명확하면 생성된 run을 조회하고 중복 제출하지 않는다.
workflow는 사이트의 정확한 40자리 SHA를 checkout하고 `origin/main`에 포함되는지 확인한 뒤 lockfile 고정 설치와
기존 build·artifact 준비·검증을 실행한다. 앱 버전은 올리지 않는다. manifest와 public을 Actions artifact로 30일
보존하고 ID·digest·source·manifest SHA를 실행 요약에 남긴다. 공개에는 public 파일만 올린다.

기존 publisher가 동일 SHA·manifest·파일 bytes의 artifact가 current인지 읽기 전용으로 먼저 확인한다.
일치하면 재업로드·재전환을 생략하고 공개 검증을 재개한다. 같은 release가 존재하지만 current가 다르면 자동
재게시하지 않고 상태 확인을 요구한다. 다른 artifact면 기존 VPS lock·후보 검증·원자 교체·previous 보존을 따른다.
SSH는 `BatchMode=yes`, `IdentitiesOnly=yes`, `StrictHostKeyChecking=yes`와 전용 `UserKnownHostsFile`을 사용한다.

`node scripts/verify-static-site-public.mjs ARTIFACT SOURCE_SHA`는 모든 공개 파일의 HTTPS status·bytes·hash,
www의 경로/query 보존 308, 비공개·누락 경로 404를 확인한다. workflow 성공과 공개 확인은 이 단계가 끝나야
완료다. timeout이나 부분 성공 뒤에는 기존 run·artifact·provider 상태를 확인한 다음 미완료 단계만 진행한다.

일별 09:00 heartbeat는 operator의 기존 main에서 데이터·문서를 수정하고 해당 source를 push한 뒤 위 workflow를
명시 dispatch하고 정확한 run ID와 결과를 기록한다. 운영 키를 읽거나 sudo를 실행하지 않는다. 08:30 수집은
로컬 Aside CLI와 승인된 계정 Insights를 사용하며, 실제 계정 전환·복원은 공유 브라우저 담당과 조율한다.

## 이전 인증 방식의 이력

2026-10-21에는 개발 Mac의 전용 SSH agent를 `ssh -A mac-ci`로 전달하고 공개키만 publisher의 key-file 인수로
지정했다. 10/30 사용자의 전체 자격증명 이전 후 operator의 읽기 전용 접속은 성공했지만, MANIFEST의 키 허용
호스트가 `mac-dev`여서 색인 기반 정리 시 operator 사본과 빈 디렉터리가 제거됐다. 원인은 파일의 분실이 아니라
등록된 소비자/호스트와 실제 사용 경로의 불일치였다. 현재 경로는 위 Actions 환경 비밀 주입이며, operator로
키를 재복사하거나 전역 passwordless sudo를 추가해 해결하지 않는다. 과거 접속 성공은 현재 공개 배포 증거가 아니다.
