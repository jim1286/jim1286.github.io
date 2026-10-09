# Portfolio Site QA 결과 색인

검토일: 2026-10-09 · [QA 실행 안내](../QA.md) · [작성 템플릿](../templates/QA_REPORT.md)

2026-10-09 사용자 요청으로 최종 결과를 작업별 Markdown 리포트와 이 색인으로 통일했다. 링크된 판정은 각 기록의 실행 시점·대상·범위에만 유효하며, 이 색인이 현재 제품 통과를 뜻하지 않는다. 과거 폴더별 기록은 작업별 파일로 통합했고 기존 판정과 한계를 보존했다.

## 작업별 리포트

| 작업 | 리포트 |
| 포트폴리오 자체 도메인 이전 | [2026-10-09-owned-domain-deployment](2026-10-09-owned-domain-deployment.md) |
| 자체 도메인 정책 링크 동기화 | [2026-10-09-policy-domain-links](2026-10-09-policy-domain-links.md) |
| --- | --- |
| 프로필·제품 정보 최신화와 마케팅 사례 통합 | [2026-10-09-profile-products-refresh](2026-10-09-profile-products-refresh.md) |
| gh-pages 게시 이력 main 통합 | [2026-10-09-gh-pages-main-merge](2026-10-09-gh-pages-main-merge.md) |
| QA 리포트 — HJM 개발 후보 CI | [2026-10-09-hjm-development-ci](2026-10-09-hjm-development-ci.md) |
| Portfolio Site HJM 1.16.0 도입·통합 QA | [2026-10-08-hjm-adoption](2026-10-08-hjm-adoption.md) |
| Main tooling integration | [2026-10-07-main-tooling-integration](2026-10-07-main-tooling-integration.md) |
| HJM 1.15.0 소비 적용 — Portfolio Site | [2026-10-07-hjm-1-15-upgrade](2026-10-07-hjm-1-15-upgrade.md) |
| HJM 1.14.0 consumer upgrade | [2026-10-07-hjm-1-14-upgrade](2026-10-07-hjm-1-14-upgrade.md) |
| 모든 소스 브랜치 main 통합 — 2026-10-07 | [2026-10-07-all-branches-main](2026-10-07-all-branches-main.md) |
| QA 리포트 — HJM 1.13.0 반영 | [2026-10-06-hjm-1.13-adoption](2026-10-06-hjm-1.13-adoption.md) |
| QA 리포트 — QA 자료 통일 | [2026-10-09-qa-document-unification](2026-10-09-qa-document-unification.md) |

## 별도 자료와 보관 경계

계약 증거는 `docs/evidence/`, 재사용 검사 도구와 회귀 fixture는 `tools/qa/` 및 runtime 테스트 소스에 둔다. 제품 디자인 문서·과거 작업 기록은 설계·이력 자료이며 새로운 QA 완료 근거로 재사용하지 않는다. 자세한 실행·보관 기준은 [QA 안내](../QA.md)를 따른다.
