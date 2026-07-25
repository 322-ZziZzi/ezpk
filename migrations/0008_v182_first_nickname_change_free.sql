-- EZPK v182
-- Allow the first member-initiated nickname change immediately.
-- Apply the 7-day cooldown only from the second change onward.

ALTER TABLE members
  ADD COLUMN nickname_change_count INTEGER NOT NULL DEFAULT 0
  CHECK (nickname_change_count >= 0);

-- Preserve the real count for accounts that already changed nicknames.
UPDATE members
SET nickname_change_count = (
  SELECT COUNT(*)
  FROM member_nickname_history AS h
  WHERE h.member_id = members.id
);

INSERT INTO settings (key, value, updated_at, updated_by)
VALUES ('member_db_schema_version', '3.2-v182', CURRENT_TIMESTAMP, 'migration')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP,
  updated_by = 'migration';
