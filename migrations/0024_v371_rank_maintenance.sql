-- EZPK v371: rank maintenance, demotion review, exclusions and change history
CREATE TABLE IF NOT EXISTS member_rank_changes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  change_type TEXT NOT NULL CHECK(change_type IN ('promotion','demotion','manual','restoration')),
  from_rank TEXT NOT NULL,
  to_rank TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  activity_snapshot TEXT,
  changed_by_member_id INTEGER NOT NULL,
  protection_until TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY(changed_by_member_id) REFERENCES members(id)
);
CREATE INDEX IF NOT EXISTS idx_member_rank_changes_member ON member_rank_changes(member_id,created_at DESC);

CREATE TABLE IF NOT EXISTS member_demotion_exclusions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  excluded_until TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_by_member_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TEXT,
  revoked_by_member_id INTEGER,
  FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY(created_by_member_id) REFERENCES members(id),
  FOREIGN KEY(revoked_by_member_id) REFERENCES members(id)
);
CREATE INDEX IF NOT EXISTS idx_member_demotion_exclusions_member ON member_demotion_exclusions(member_id,excluded_until DESC);

INSERT INTO settings(key,value,updated_at,updated_by) VALUES('member_db_schema_version','5.3-v371',CURRENT_TIMESTAMP,'migration')
ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP,updated_by='migration';
