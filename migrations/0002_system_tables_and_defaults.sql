-- EZPK v179-1 free-plan migration: settings, history, and admin logs

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY
    CHECK (length(trim(key)) BETWEEN 1 AND 100),
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT
    CHECK (
      updated_by IS NULL
      OR length(trim(updated_by)) BETWEEN 1 AND 100
    )
);

INSERT OR IGNORE INTO settings (key, value, updated_at, updated_by)
VALUES
  ('alliance_join_code','00322',CURRENT_TIMESTAMP,'system'),
  ('member_signup_enabled','1',CURRENT_TIMESTAMP,'system'),
  ('nickname_change_days','7',CURRENT_TIMESTAMP,'system'),
  ('session_duration_days','30',CURRENT_TIMESTAMP,'system'),
  ('primary_admin_login_id','ezpk_admin',CURRENT_TIMESTAMP,'system'),
  ('member_db_schema_version','2.1-free',CURRENT_TIMESTAMP,'system');

CREATE TABLE IF NOT EXISTS member_nickname_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  old_nickname TEXT NOT NULL
    CHECK (length(trim(old_nickname)) BETWEEN 1 AND 64),
  new_nickname TEXT NOT NULL
    CHECK (length(trim(new_nickname)) BETWEEN 1 AND 64),
  changed_by TEXT NOT NULL
    CHECK (changed_by IN ('member','admin')),
  changed_by_member_id INTEGER,
  changed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id)
    REFERENCES members(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (changed_by_member_id)
    REFERENCES members(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS admin_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_member_id INTEGER,
  admin_login_id_snapshot TEXT NOT NULL
    CHECK (
      length(trim(admin_login_id_snapshot)) BETWEEN 1 AND 100
    ),
  action TEXT NOT NULL
    CHECK (
      action IN (
        'member_update',
        'nickname_update',
        'temporary_password_issued',
        'member_activated',
        'member_suspended',
        'member_left',
        'member_deleted',
        'join_code_changed',
        'signup_enabled',
        'signup_disabled',
        'admin_role_granted',
        'admin_role_revoked'
      )
    ),
  target_member_id INTEGER,
  target_login_id_snapshot TEXT,
  target_nickname_snapshot TEXT,
  details TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_member_id)
    REFERENCES members(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  FOREIGN KEY (target_member_id)
    REFERENCES members(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);
