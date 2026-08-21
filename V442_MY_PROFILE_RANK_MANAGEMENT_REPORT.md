# EZPK v442 My Profile Rank Management Consolidation Report

## Member My Page
- Full member-facing rank history list is hidden/removed.
- `판정 상세` and `전체 이력 보기` are not exposed to members.
- Basic Profile becomes the default-open section.
- Current rank and one latest rank-change summary are displayed as status information, not a disabled form field.
- Promotion and maintenance cards are nested inside Basic Profile.
- Promotion spec current/required values remain immediately visible.
- Promotion activity details and cycle metadata are collapsed by default.
- Maintenance summary/status remains visible; cycle/activity/protection/recovery details are collapsed by default.

## Rank-specific rendering
- R1: R1→R2 promotion only.
- R2: R2→R3 promotion + R2 maintenance.
- R3: R3 maintenance only.
- R4/R5: automatic rank-management area hidden.

## Member API privacy / payload reduction
- `/api/member/me`: `rankHistoryRecent` removed; minimal `latestRankChange` added.
- `/api/member/rank-history`: retired from member routes.
- Admin full immutable history endpoint remains unchanged.

## Immutable history correction
- Adds `member_rank_notice_states`.
- Existing legacy `dismissed_at` values are backfilled into notice state.
- Runtime notice dismissal uses INSERT into notice state and never UPDATEs `member_rank_history_events`.
- Legacy history `dismissed_at` column is retained as frozen compatibility data; no v442 runtime writes it.

## Non-changes
- Promotion qualification logic unchanged.
- 14/30-day lifecycle calculation unchanged.
- Permanent qualification unchanged.
- Admin full history unchanged.
- v441 blue/green/gold promotion spec colors preserved.
- EZPK1 single-alliance and migration intake policy unchanged.
