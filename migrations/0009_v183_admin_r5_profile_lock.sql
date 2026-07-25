-- EZPK v183
-- Repair any administrator rank lowered by an older profile form.
-- The Worker now permanently preserves R5 for role='admin'.

UPDATE members
SET member_rank = 'R5'
WHERE role = 'admin'
  AND member_rank <> 'R5';

INSERT INTO settings (key, value, updated_at, updated_by)
VALUES ('member_db_schema_version', '3.3-v183', CURRENT_TIMESTAMP, 'migration')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP,
  updated_by = 'migration';
