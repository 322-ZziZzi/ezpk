-- EZPK v374: allow each member to permanently dismiss an individual rank-change notice
ALTER TABLE member_rank_changes ADD COLUMN dismissed_at TEXT;

CREATE INDEX IF NOT EXISTS idx_member_rank_changes_notice
ON member_rank_changes(member_id,dismissed_at,created_at DESC);
