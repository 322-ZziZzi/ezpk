# V313 수도전 D1 노출 명단 실제 복원 수정

- 관리자 권한 API(`/api/admin/content`)를 통해 `strategy_content`의 수도전 D1 원본을 직접 조회
- `published.teams`, 구형 `teams`, 구형 `draft.teams` 순서로 복원 가능한 명단 탐색
- 현재 회원 목록에 없는 닉네임도 삭제하지 않고 노출 당시 문자열 그대로 복원
- Unicode NFKC, 대소문자, 공백 정규화로 현재 회원 닉네임과 재연결
- 관리자 JS 캐시 버전을 `v=3130`으로 변경하여 배포 후 이전 스크립트 캐시 방지
- D1 스키마 변경 및 마이그레이션 없음
