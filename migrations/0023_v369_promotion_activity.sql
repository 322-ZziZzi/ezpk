-- EZPK v369: promotion activity evidence and member-owned spec timestamp
ALTER TABLE member_specs ADD COLUMN member_self_updated_at TEXT;

CREATE TABLE IF NOT EXISTS member_daily_visits (
  member_id INTEGER NOT NULL,
  visit_date TEXT NOT NULL,
  first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(member_id,visit_date),
  FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_member_daily_visits_date ON member_daily_visits(visit_date,member_id);

CREATE TABLE IF NOT EXISTS member_activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  activity_type TEXT NOT NULL CHECK(activity_type IN ('specs_update')),
  source TEXT NOT NULL DEFAULT 'member' CHECK(source IN ('member','admin')),
  changed_fields TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_member_activity_recent ON member_activity_logs(member_id,activity_type,created_at DESC);

CREATE TABLE IF NOT EXISTS member_activity_confirmations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  confirmed_by_member_id INTEGER NOT NULL,
  checked_login INTEGER NOT NULL DEFAULT 0 CHECK(checked_login IN (0,1)),
  checked_event INTEGER NOT NULL DEFAULT 0 CHECK(checked_event IN (0,1)),
  checked_alliance INTEGER NOT NULL DEFAULT 0 CHECK(checked_alliance IN (0,1)),
  memo TEXT NOT NULL DEFAULT '',
  confirmed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TEXT,
  revoked_by_member_id INTEGER,
  FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY(confirmed_by_member_id) REFERENCES members(id),
  FOREIGN KEY(revoked_by_member_id) REFERENCES members(id)
);
CREATE INDEX IF NOT EXISTS idx_member_activity_confirmation_recent ON member_activity_confirmations(member_id,confirmed_at DESC);

INSERT INTO settings(key,value,updated_at,updated_by) VALUES('member_db_schema_version','5.2-v369',CURRENT_TIMESTAMP,'migration')
ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP,updated_by='migration';
