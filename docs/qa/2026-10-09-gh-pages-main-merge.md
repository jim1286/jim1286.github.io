# QA 리포트 — gh-pages 이력 main 통합

## 1. 최종 판정

통과(Git 병합·보존 범위). 2026-10-09 KST, Codex. `gh-pages`의 전체 이력을 main의 두 번째
parent로 연결하고 게시 파일 25개를 `.published/gh-pages-20261008/`에 원래 Git blob 그대로
통합했다. 개발 소스·manifest·lockfile·루트 HTML은 그대로 유지했다. 원격 main 확인 후
기존 SHA를 조건으로 `gh-pages`를 삭제한다. 현재 공개 사이트의 정상 동작·새 배포는 미검증이다.

## 2. 대상과 이력

- 저장소: `jim1286/jim1286.github.io` / `apps/portfolio-site`.
- 시작 main: `e9b9c2519c795ef64510227202dbd7f057bf9d60`, clean working tree.
- 병합 대상: `4dba815796129b946b0aa05ed97b927141ca94f8`, 원격 `gh-pages`.
- 두 ref 사이에 공통 조상이 없어 unrelated-history subtree 통합을 수행했다.
- `git merge --allow-unrelated-histories -s ours --no-commit --no-ff`로 두 parent를 준비하고
  `git read-tree --prefix=.published/gh-pages-20261008/ -u origin/gh-pages`로 모든 incoming 파일을
  실제 main tree에 포함했다. 이력만 연결하고 내용을 버리는 병합이 아니다.

## 3. 환경과 검증 범위

개발 Mac에서 Git 이력·tree·blob·원격 heads와 GitHub PR/Pages 설정을 확인했다.
새 checkout·branch·worktree·앱 버전 상승은 없다. 서버·Vite 프로세스·의존성 설치를 변경하지 않았다.
빌드 산출물은 기존 10-08 게시 bytes이며 이번 작업에서 다시 빌드한 결과가 아니다.

## 4. 확인 결과와 변경 근거

`gh-pages`에는 compiled `index.html`, locale HTML, hash JS/CSS와 이미지가 있다. 이를 루트에
합치면 main의 Vite HTML entry와 충돌한다. 모든 파일을 숨김 보관 경로로 옮겨 Git의 기존 blob과
history를 유지했다. 산출물은 이미 공개된 이전 배포 파일이며 일반 원시 QA 출력으로 삭제하지 않는다.
README·RELEASE·QA 색인에는 현재 경로와 남은 delivery 작업을 기록했다.

현재 GitHub Pages 설정은 API에서 `source.branch: main`, `source.path: /`, `build_type: legacy`다.
기존 deploy script는 `gh-pages -d dist`이므로 source 설정과 publisher가 다르다. 별도 delivery
수정 없이 이 명령을 다시 쓰면 `gh-pages`가 재생성될 수 있다. 다음 운영 배포 전에 mac-ci에서
main 게시 방식과 publisher를 맞춘다. Git 병합 요청을 운영 배포 실행 지시로 확대하지 않았다.

## 5. 검사 결과

- incoming 25개 파일의 mode·Git blob을 prefix 아래 25개 파일과 일대일 대조한다.
- 병합 전 main의 모든 파일 중 README·RELEASE·QA 색인 외에는 mode/blob 변경이 없어야 한다.
- 두 원래 SHA가 병합 commit의 정확한 parent인지, incoming이 main ancestor인지 확인한다.
- 변경 문서의 local 링크와 `git diff --cached --check`를 확인한다.
- 원격 main에 병합 commit이 있는지와 `gh-pages` 삭제 후 heads 목록을 확인한다.
- 원격 PR 재조회: 현재 운영·보관 저장소 13개에서 열린 PR 0개.

코드·빌드 입력이 바뀌지 않아 native/build/전체 제품 검사를 재실행하지 않았다. Git tree/blob
검사는 웹 화면 QA나 현재 Pages 공개 상태를 증명하지 않는다.

## 6. 미확인 범위와 후속

main 기반 게시 경로 연결, legacy publisher 제거, 새 artifact 배포, 공개 URL·locale·asset 수신
검증은 mac-ci delivery 작업이다. 현행 버전 상승·QA·배포 경계를 유지하며 이 병합에서 버전이나
workflow·Pages 설정을 바꾸지 않았다. 작업 완료 범위는 요청한 branch 병합·원격 정리다.

## 7. 보관과 복구

기존 게시 이력은 main에서 도달 가능하고 모든 published blob이 새 prefix에 있다.
원래 tip도 다음 local recovery ref로 보존했다.

```text
refs/archive/gh-pages-merge-20261009/original-main
refs/archive/gh-pages-merge-20261009/original-gh-pages
```

복구 필요 시 `git show <원래 SHA>:<파일>` 또는 저장소 밖으로 `git archive <원래 SHA>`를
추출한다. 공유 main을 reset하거나 자동으로 운영 사이트에 게시하지 않는다.
비교용 임시 tree 상태 JSON은 검사 결과를 본 기록에 반영한 뒤 제거했다.
