# V314 수도전 현재 노출 원본 직접 불러오기 수정

- 공개 수도전 페이지가 실제로 호출하는 `/data/capital-war.json`을 최우선 조회
- 관리자 D1 API 및 회원 콘텐츠 API를 순차 fallback
- `data/content/result` wrapper와 문자열 JSON을 반복 해제
- `published.teams`, `teams`, `draft.teams` 및 중첩 팀 구조 자동 탐색
- 실패 시 각 데이터 원본에서 발견된 명단 수를 안내하여 원인 확인 가능
- 관리자 스크립트 캐시 버전 v3140 적용
- D1 마이그레이션 불필요
