-- EZPK v190-b: member-owned Request Board
CREATE TABLE IF NOT EXISTS member_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER,
  author_nickname_snapshot TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL CHECK(length(trim(title)) BETWEEN 1 AND 120),
  message TEXT NOT NULL CHECK(length(trim(message)) BETWEEN 1 AND 3000),
  admin_answer TEXT,
  answered_at TEXT,
  answered_by_member_id INTEGER,
  is_legacy INTEGER NOT NULL DEFAULT 0 CHECK(is_legacy IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(member_id) REFERENCES members(id) ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY(answered_by_member_id) REFERENCES members(id) ON UPDATE CASCADE ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_member_requests_created ON member_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_member_requests_member ON member_requests(member_id,created_at DESC);
INSERT INTO settings(key,value,updated_at,updated_by) VALUES('member_db_schema_version','5.0-v190-b',CURRENT_TIMESTAMP,'migration')
ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP,updated_by='migration';
