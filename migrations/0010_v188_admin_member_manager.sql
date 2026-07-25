-- EZPK v188
-- Admin member manager: approval status and private administrator memo.

ALTER TABLE members
  ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'approved'
  CHECK (approval_status IN ('pending','approved','rejected'));

CREATE TABLE IF NOT EXISTS member_admin_memos (
  member_id INTEGER PRIMARY KEY,
  memo TEXT NOT NULL DEFAULT ''
    CHECK (length(memo) <= 1000),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by_member_id INTEGER,
  FOREIGN KEY (member_id) REFERENCES members(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (updated_by_member_id) REFERENCES members(id)
    ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_members_approval_status
  ON members(approval_status);

CREATE INDEX IF NOT EXISTS idx_admin_memos_updated_at
  ON member_admin_memos(updated_at DESC);

INSERT INTO settings (key, value, updated_at, updated_by)
VALUES ('member_db_schema_version', '4.0-v188', CURRENT_TIMESTAMP, 'migration')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP,
  updated_by = 'migration';
