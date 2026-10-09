# 전략 도식 산출물

문서 버전: 1.0
검토일: 2026-10-09

2026-10-08 사용자의 “마케팅 전략, 개발 전략도 도식화해서 넣어줘” 요청으로
만든 크게 보기·내보내기용 문서다. 개인 개발자의 운영 방향을 설명하며,
검증된 성과·자동 계측·모든 홍보 채널의 운영 완료를 주장하지 않는다.

| 원천 | 공개 생성물 |
| --- | --- |
| [마케팅 workflow](marketing-strategy.workflow.json) | [마케팅 HTML](../../public/diagrams/marketing-strategy.html) |
| [개발 workflow](development-strategy.workflow.json) | [개발 HTML](../../public/diagrams/development-strategy.html) |

앱 본문은 `src/i18n/ko.ts`의 `strategy*`, `development*`, `marketing*` 키를
사용한다. 이 JSON은 앱 runtime 문자열 모듈이 아니라 독립 문서의 편집 원천이다.
HTML은 JSON의 생성물이며 직접 디자인을 수정하지 않는다. 단계 이름과 설명을
바꾸면 본문의 i18n 키와 JSON을 함께 대조하고 두 HTML을 다시 생성한다.
2026-10-08에는 7개 개발 단계와 마케팅의 검색형/발견형 분기를 본문과 맞췄다.
노드의 짧은 보조 문구는 도식의 공간에 맞춘 요약이고, 하단에는 본문의 상세 설명을 둔다.

마케팅 흐름은 중앙 `docs/MARKETING_POLICY.md`의 §3 검색형·발견형,
§5 확인 가능한 반응과 피드백, §6 채널 선택을 따른다. 개발 흐름은 문제와 작은 핵심
범위를 정하고 HJM 토큰→컴포넌트→구성→화면에 제품의 브랜드를 연결한 뒤,
구현·실제 QA·배포·피드백·개선으로 이어진다. 최대 글자 조건은 포함하지 않는다.

2026-10-09에는 별도 캐릭터 랜딩을 제거하고 포슬이 브랜딩·일상툰·앱 소개툰 운영과
릴스 제작·검수를 마케팅 사례로 본문과 도식에 통합했다. 성과 수치나 릴스 게시 완료를 주장하지 않는다.

## 재생성

Archify 2.11 skill의 workflow renderer로 생성했다. skill은 제작 도구이며 제품
설치·runtime·CI의 필수 의존성이 아니다. npm 패키지나 전역 CLI를 추가하지 않는다.
도구가 없는 환경에서는 커밋된 HTML을 그대로 서비스한다.

Archify skill 디렉터리에서 아래 명령을 실행한다. `APP_ROOT`는 이 제품 checkout의
절대 경로로 지정한다. 같은 버전의 skill을 이용하면 재현할 수 있다.

```sh
APP_ROOT=/absolute/path/to/portfolio-site
node bin/archify.mjs doctor
node bin/archify.mjs render workflow "$APP_ROOT/docs/diagrams/marketing-strategy.workflow.json" "$APP_ROOT/public/diagrams/marketing-strategy.html"
node bin/archify.mjs render workflow "$APP_ROOT/docs/diagrams/development-strategy.workflow.json" "$APP_ROOT/public/diagrams/development-strategy.html"
```

기본 renderer의 고정 영문 범례는 agent/tool 도식용이라 이 문서의 의미와 맞지 않는다.
renderer를 fork하거나 앱 wrapper를 추가하는 대신 생성 후 언어·SVG 접근성 메타데이터와
범례 문구만 아래대로 투사한다. Archify의 CSS, 툴바, theme/export JavaScript는 그대로 둔다.
브랜드 색을 임의 CSS로 덮지 않고 원본의 다크·라이트 팔레트를 유지한다.

제품 루트에서 실행한다.

```sh
python3 - <<'PY'
from pathlib import Path
import re
root = Path.cwd()
descriptions = {
    'development-strategy': '문제 정의, 핵심 범위, 공통 디자인과 브랜드, 구현, 실제 QA, 배포와 피드백, 개선으로 이어지며 개선 후 문제를 다시 정합니다.',
    'marketing-strategy': '사용 문제와 대상을 정리하고 검색형 또는 발견형으로 핵심 가치를 전달합니다. 포슬이 캐릭터 브랜딩과 소셜 운영을 사례로 설명하고 반응을 확인해 제품과 설명을 개선합니다.',
}
labels = {'Legend': '흐름의 역할', 'User UI': '전달·사용', 'Agent logic': '설계·개선', 'Policy': '확인', 'Tool action': '실행', 'Context / trace': '반응·기록'}
for name, desc in descriptions.items():
    path = root / 'public/diagrams' / f'{name}.html'
    text = path.read_text()
    title = '개발 전략' if name.startswith('development') else '마케팅 전략'
    text = text.replace('<html lang="en"', '<html lang="ko"').replace(f'<title>{title} Diagram</title>', f'<title>{title} 도식</title>')
    text = re.sub(r'(<svg\b[^>]*?) aria-label="[^"]*"', r'\1 aria-labelledby="strategy-title strategy-description"', text, count=1)
    text = re.sub(r'(<svg\b[^>]*>)', r'\1\n        <title id="strategy-title">' + title + '</title>\n        <desc id="strategy-description">' + desc + '</desc>', text, count=1)
    for old, new in labels.items():
        text = text.replace('>' + old + '</text>', '>' + new + '</text>')
    text = text.replace('Workflow diagram &bull; Built with Archify', '운영 방향 도식 &bull; Built with Archify')
    path.write_text(text)
PY
```

메타 투사는 **렌더 직후 한 번만** 수행한다. 위 Python 명령만 반복 실행하지 않는다.
skill 디렉터리에서 각 원천의 schema/layout과 최종 HTML을 검사한다.

```sh
node bin/archify.mjs validate workflow "$APP_ROOT/docs/diagrams/marketing-strategy.workflow.json" --json
node bin/archify.mjs validate workflow "$APP_ROOT/docs/diagrams/development-strategy.workflow.json" --json
node bin/archify.mjs check "$APP_ROOT/public/diagrams/marketing-strategy.html"
node bin/archify.mjs check "$APP_ROOT/public/diagrams/development-strategy.html"
```

두 공개 HTML은 외부 서비스·추적 스크립트를 사용하지 않는다. Archify의 Google Fonts
참조는 비동기로 로드되며, 연결이 없어도 시스템 폰트로 표시된다. 브라우저 검수에서는
화면 배치·다크/라이트 전환·크게 보기 후 뒤로 가기·내보내기 메뉴와 실제 파일 출력을
확인한다. 정적 schema/layout 검사는 이 실제 브라우저 확인의 대체 증거가 아니다.
