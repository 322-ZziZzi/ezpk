-- v394 Super-admin migration Excel import
-- Import provenance is stored on each application, while batch-level audit and idempotency
-- are stored separately. Existing public-form rows retain the default source.

CREATE TABLE IF NOT EXISTS migration_import_batches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idempotency_key TEXT NOT NULL UNIQUE,
  template_version TEXT NOT NULL,
  original_file_name TEXT NOT NULL,
  file_sha256 TEXT NOT NULL,
  actor_member_id INTEGER NOT NULL,
  actor_nickname TEXT NOT NULL,
  total_rows INTEGER NOT NULL DEFAULT 0 CHECK (total_rows >= 0),
  ready_rows INTEGER NOT NULL DEFAULT 0 CHECK (ready_rows >= 0),
  imported_rows INTEGER NOT NULL DEFAULT 0 CHECK (imported_rows >= 0),
  skipped_rows INTEGER NOT NULL DEFAULT 0 CHECK (skipped_rows >= 0),
  failed_rows INTEGER NOT NULL DEFAULT 0 CHECK (failed_rows >= 0),
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing','committed','partial','failed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  committed_at TEXT,
  FOREIGN KEY (actor_member_id) REFERENCES members(id) ON DELETE RESTRICT
);

ALTER TABLE migration_applications
  ADD COLUMN source TEXT NOT NULL DEFAULT 'public_form'
  CHECK (source IN ('public_form','admin_excel_import'));

ALTER TABLE migration_applications
  ADD COLUMN import_batch_id INTEGER REFERENCES migration_import_batches(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_migration_applications_import_batch
  ON migration_applications(import_batch_id)
  WHERE import_batch_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_migration_import_batches_created
  ON migration_import_batches(created_at DESC, id DESC);
