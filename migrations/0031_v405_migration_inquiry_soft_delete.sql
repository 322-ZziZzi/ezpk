-- EZPK v405: super-admin soft deletion for migration inquiries.
-- Keeps inquiry/reply records for audit while hiding deleted threads from
-- applicants and normal admin request views. Deletion also closes the thread
-- so a new inquiry may be created for the same migration application.

ALTER TABLE migration_inquiries ADD COLUMN deleted_at TEXT;
ALTER TABLE migration_inquiries ADD COLUMN deleted_by_member_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_migration_inquiries_active_application_created
  ON migration_inquiries(application_id, created_at DESC, id DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_migration_inquiries_active_status_created
  ON migration_inquiries(status, created_at DESC, id DESC)
  WHERE deleted_at IS NULL;

INSERT INTO settings(key,value,updated_at,updated_by)
VALUES('member_db_schema_version','5.3-v405',CURRENT_TIMESTAMP,'migration')
ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP,updated_by='migration';
