---
schema: hjm.app-document/1
document: adr
app_id: "portfolio-site"
display_name: "Portfolio Site"
status: accepted
owner: "jimin"
reviewed: "2026-09-23"
version: "1.0.0"
adr_id: ADR-1400
decision_date: "2026-09-23"
supersedes: none
---

# ADR-1400: HJM link 채택

2026-09-23 전체 React/RN 감사에서 발견한 중복 UI 동작과 beta 선언 누락을 정리한다.
HJM 1.4.0의 link를 채택해 접근성·환경·레이아웃 계약을 공유한다.
제품별 별도 renderer 복제는 공통 수정이 전파되지 않아 채택하지 않는다.
브랜드 자산과 도메인 동작은 제품에 유지하고, 웹·앱이 함께 있으면 양쪽을 검증한다.

타입 검사·기존 회귀 검사와 별도로 실제 화면에서 큰 글자, 포커스, 오류/disabled 상태를 확인한다.
채택 결정은 beta 안정성 승격이나 제품 출시 증거가 아니다. 실제 기기 검증 전 evidence는 planned로 유지한다.
회귀 시 기존 제품 흐름으로 복구하고 본 결정을 갱신한다.

## Contract binding

<!-- hjm-contract-binding
{
  "kind": "optional-beta-adoption",
  "componentId": "link",
  "evidenceIds": [
    "EV-1400"
  ]
}
-->
