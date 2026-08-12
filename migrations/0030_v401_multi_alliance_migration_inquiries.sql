-- EZPK v401: migration-applicant inquiry sessions and threaded inquiries.
-- This migration is additive-only so it can be applied independently to EZPK1
-- and to the new EZPK2 D1 database.

CREATE TABLE IF NOT EXISTS migration_inquiry_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE CHECK(length(token_hash) BETWEEN 32 AND 256),
  uid_hash TEXT NOT NULL CHECK(length(uid_hash) BETWEEN 32 AND 256),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_used_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL CHECK(datetime(expires_at) IS NOT NULL),
  user_agent TEXT CHECK(user_agent IS NULL OR length(user_agent) <= 500),
  FOREIGN KEY(application_id) REFERENCES migration_applications(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_migration_inquiry_sessions_application
  ON migration_inquiry_sessions(application_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_migration_inquiry_sessions_expires
  ON migration_inquiry_sessions(expires_at);

CREATE TABLE IF NOT EXISTS migration_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  public_id TEXT NOT NULL UNIQUE CHECK(length(public_id) BETWEEN 24 AND 80),
  application_id INTEGER NOT NULL,
  requester_name_snapshot TEXT NOT NULL CHECK(length(trim(requester_name_snapshot)) BETWEEN 1 AND 64),
  title TEXT NOT NULL CHECK(length(trim(title)) BETWEEN 1 AND 120),
  message TEXT NOT NULL CHECK(length(trim(message)) BETWEEN 1 AND 3000),
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','answered','closed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at TEXT,
  FOREIGN KEY(application_id) REFERENCES migration_applications(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_migration_inquiries_one_open
  ON migration_inquiries(application_id)
  WHERE status IN ('open','answered');
CREATE INDEX IF NOT EXISTS idx_migration_inquiries_application_created
  ON migration_inquiries(application_id, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_migration_inquiries_status_created
  ON migration_inquiries(status, created_at DESC, id DESC);

CREATE TABLE IF NOT EXISTS migration_inquiry_replies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inquiry_id INTEGER NOT NULL,
  author_type TEXT NOT NULL CHECK(author_type IN ('applicant','admin')),
  admin_member_id INTEGER,
  author_nickname_snapshot TEXT NOT NULL CHECK(length(trim(author_nickname_snapshot)) BETWEEN 1 AND 64),
  message TEXT NOT NULL CHECK(length(trim(message)) BETWEEN 1 AND 5000),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(inquiry_id) REFERENCES migration_inquiries(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(admin_member_id) REFERENCES members(id) ON UPDATE CASCADE ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_migration_inquiry_replies_thread
  ON migration_inquiry_replies(inquiry_id, created_at ASC, id ASC);

INSERT INTO settings(key,value,updated_at,updated_by)
VALUES('member_db_schema_version','5.2-v401',CURRENT_TIMESTAMP,'migration')
ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP,updated_by='migration';
