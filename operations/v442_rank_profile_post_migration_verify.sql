-- EZPK v442 post-migration READ-ONLY verification
SELECT 'V442_SCHEMA' section,
  (SELECT value FROM settings WHERE key='member_db_schema_version') schema_version,
  (SELECT value FROM settings WHERE key='rank_notice_state_v1_started_on') notice_state_started_on;

SELECT 'V442_NOTICE_TABLE' section,
  COUNT(*) table_exists
FROM sqlite_master WHERE type='table' AND name='member_rank_notice_states';

SELECT 'V442_BACKFILL' section,
  COUNT(*) legacy_dismissals_missing_notice_state
FROM member_rank_history_events h
WHERE h.dismissed_at IS NOT NULL
  AND NOT EXISTS(SELECT 1 FROM member_rank_notice_states n WHERE n.member_id=h.member_id AND n.history_event_id=h.id);

SELECT 'V442_NOTICE_ORPHANS' section,
  COUNT(*) orphan_notice_rows
FROM member_rank_notice_states n
LEFT JOIN member_rank_history_events h ON h.id=n.history_event_id
WHERE h.id IS NULL;

SELECT 'V442_NOTICE_MEMBER_MATCH' section,
  COUNT(*) notice_member_mismatches
FROM member_rank_notice_states n
JOIN member_rank_history_events h ON h.id=n.history_event_id
WHERE n.member_id<>h.member_id;

SELECT 'V442_FINAL_SENTINELS' section,
  (SELECT COUNT(*) FROM member_rank_history_events h WHERE h.dismissed_at IS NOT NULL AND NOT EXISTS(SELECT 1 FROM member_rank_notice_states n WHERE n.member_id=h.member_id AND n.history_event_id=h.id)) legacy_dismissal_backfill_misses,
  (SELECT COUNT(*) FROM member_rank_notice_states n LEFT JOIN member_rank_history_events h ON h.id=n.history_event_id WHERE h.id IS NULL) orphan_notice_rows,
  (SELECT COUNT(*) FROM member_rank_notice_states n JOIN member_rank_history_events h ON h.id=n.history_event_id WHERE n.member_id<>h.member_id) notice_member_mismatches;
