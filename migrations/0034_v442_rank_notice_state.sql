-- EZPK v442 / 4.4.2
-- My Profile Rank Management Consolidation & Immutable History Notice-State Split
--
-- No promotion/maintenance qualification rule changes.
-- member_rank_history_events remains the immutable audit/history authority.
-- Dismissal is moved to a separate mutable member_rank_notice_states table.

CREATE TABLE IF NOT EXISTS member_rank_notice_states (
  member_id INTEGER NOT NULL,
  history_event_id INTEGER NOT NULL,
  dismissed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(member_id,history_event_id)
);
CREATE INDEX IF NOT EXISTS idx_rank_notice_history_event
  ON member_rank_notice_states(history_event_id);
CREATE INDEX IF NOT EXISTS idx_rank_notice_dismissed
  ON member_rank_notice_states(member_id,dismissed_at DESC);

-- Preserve all dismissals recorded before v442 without modifying the immutable
-- history rows themselves. The legacy dismissed_at column becomes frozen data.
INSERT OR IGNORE INTO member_rank_notice_states(member_id,history_event_id,dismissed_at,created_at)
SELECT member_id,id,dismissed_at,dismissed_at
FROM member_rank_history_events
WHERE dismissed_at IS NOT NULL;

INSERT INTO settings(key,value,updated_at,updated_by)
VALUES('rank_notice_state_v1_started_on',date('now','+9 hours'),CURRENT_TIMESTAMP,'migration')
ON CONFLICT(key) DO NOTHING;

INSERT INTO settings(key,value,updated_at,updated_by)
VALUES('member_db_schema_version','5.6-v442',CURRENT_TIMESTAMP,'migration')
ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP,updated_by='migration';
