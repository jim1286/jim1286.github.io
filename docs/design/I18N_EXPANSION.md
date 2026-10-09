# 다국어 확장 설계 적용

2026-10-04 · 제품 소스 적용 기록. 이 문서는 번역 검토·기기 QA·운영 배포 완료를 의미하지 않는다.

## 원본과 소비

원본 등록부는 `i18n.config.json`다. 문구 형식은 TS page/product source 100 keys다. 2026-10-04 사용자 요청으로 메뉴만 통일하는 범위를 넘어 등록부·로더·소비 코드·검사 연결을 적용했다. 독립 제품의 기존 메시지 형식을 유지하기 위해 새로운 공용 런타임/번역 엔진을 도입하지 않았다.

페이지·접근성·제품 소개 문구를 src/i18n/ko.ts로 분리했다. URL 첫 segment와 registry가 loader·HTML lang/dir를 결정하며 기본 / 경로는 한국어를 유지한다.

공식 정책 URL/출시 사실은 siteData와 Hub 생성물 소유다. 설명 문구만 catalog로 옮겼고 공개 링크와 배포 경로는 변경하지 않았다. 새 locale URL을 공개할 때 호스팅의 직접 URL fallback도 확인해야 한다.

## 언어를 추가하는 순서

1. 등록부에 tag·자국어 이름·방향과 필요한 명시 연결값을 추가한다.
2. source와 같은 키/인자의 메시지를 추가한다. 초안 등록은 번역 품질 승인이나 스토어 지원을 뜻하지 않는다.
3. 제품 루트에서 `pnpm i18n:generate`로 정적 loader·타입·계약을 갱신한다.
4. `pnpm i18n:check`와 소비 runtime의 타입·빌드·회귀 검사를 실행한다. 생성물 drift는 check에서 실패한다.
5. 기존 앱 바이너리의 미지원 locale 저장/읽기를 확인한 뒤 새 언어 노출·서버·바이너리 배포 순서를 정한다. 생성만으로 공개 API enum 호환성을 보장하지 않는다.

정확한 저장값 검증과 기기/브라우저 언어 matching은 분리한다. 다른 언어 공유 URL이나 OS 설정을 읽는 것만으로 계정 선호를 저장하지 않는다. 기존 실패 재시도·draft guard는 유지한다. 다중 언어 선택 UI는 현재 언어 한 줄 → 목록(웹 Select, Native ListRow/Sheet)을 사용한다. 단일 언어 제품에는 작동하지 않는 선택기를 만들지 않는다.

## 검증 경계

등록부 확장 fixture가 새 locale의 loader·타입·선택 메타데이터·계약 투영을 검사한다. 실제 번역·RTL·긴 문자열·OS 설정 변경은 기기/브라우저에서 별도 확인한다. 이번 작업은 source 변경이며 커밋·push·운영 배포를 수행하지 않았다.

전체 전수 적용·검증 결과는 포트폴리오 루트 `docs/design/I18N_ADOPTION.md`에서 추적한다. 기존 사용자/도메인 데이터, 실제 제공하지 않는 표면, 스토어 언어와 법률 문서를 UI catalog의 적용 수로 세지 않는다.

## 2026-10-04 로컬 실행 결과

`i18n:check`(100 source keys 및 생성 fixture), 계약·문서 검사와 전체 `pnpm check`(문서·정책·lint·4개 테스트·Vite build)를 통과했다.

번들 생성은 스토어용 네이티브 빌드·설치·기기 언어 전환 검증을 뜻하지 않는다.

## 2026-10-08 HJM 도입과 통합

공유 checkout의 진행 중 등록부·loader·100개 page/product 키를 전용 worktree에
흡수했다. 복사 대상 12개 파일의 수집 전후 hash가 같음을 확인했고 공유 원본은 수정하지
않았다. 원래 키와 formatter 인자를 유지하며, JSX에서 문장 조각을 이어 붙이지 않도록
완성 문장 7개와 모바일 메뉴·비공개 저장소 문구를 추가했다. 후속 사용자 요청으로
전략36키·SEO3키를 같은 source에 추가했고 HJ 이니셜의 소비 없는 2키를 제거해
최종146 source keys다. 나머지 원래 키와 formatter 인자는 보존한다.
`copy.ts`는 이 catalog의 의미별 alias이며 별도의 문구 원본이 아니다.

현재 등록된 UI 언어는 `ko-KR` 하나다. 새로운 번역·RTL·추가 지원 언어를 출시한 것으로
세지 않는다. 추가 언어 fixture는 loader/type/metadata/contract 투영만 검사한다.

GitHub Pages에는 Vite preview의 SPA fallback이 없으므로 빌드 후 등록 언어별 실제
`dist/<locale>/index.html`을 만든다. 기존 root absolute assets와 SEO 원문을 유지하고
초기 `lang/dir`만 locale metadata로 연결한다. plain 정적 HTTP 서버에서 `/ko-KR/`
당시 직접 진입·새로고침·`/#posli` 공유 링크가 200과 실제 구역 이동으로 동작함을 확인했다.
2026-10-09 사용자 요청으로 캐릭터 진입점을 제거했으므로 이 검증은 과거 이력이다. 현행 앱 소개는 `/#apps`다.
공개 도메인 배포 검증은 이 로컬 증거와 구분한다.

검사·원본 통합 판단·브라우저 범위는 [도입 QA](../qa/2026-10-08-hjm-adoption.md)에 보존한다.
