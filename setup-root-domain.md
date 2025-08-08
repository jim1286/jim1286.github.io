# GitHub Pages 루트 도메인 설정 가이드

`https://jim1286.github.io/app-ads.txt`에서 접근하려면:

## 방법 1: jim1286.github.io 저장소 생성 (권장)
1. GitHub에서 새 저장소 생성: `jim1286.github.io`
2. 저장소는 **public**으로 설정
3. `app-ads.txt` 파일을 루트에 업로드 (내용: `google.com, pub-4324172448109070, DIRECT, f08c47fec0942fa0`)
4. GitHub Pages를 활성화 (Settings → Pages → Source: Deploy from a branch → main)

## 현재 파일 위치
- 로컬: `/Users/jimin/Desktop/portfolio/public/app-ads.txt`
- 내용: `google.com, pub-4324172448109070, DIRECT, f08c47fec0942fa0`

## 확인
- 포트폴리오: `https://jim1286.github.io/portfolio/` (유지됨)
- app-ads.txt: `https://jim1286.github.io/app-ads.txt` (새로 생성됨)