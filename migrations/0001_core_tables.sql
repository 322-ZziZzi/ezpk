-- EZPK v179-1 free-plan migration: core member tables

CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login_id TEXT NOT NULL COLLATE NOCASE UNIQUE
    CHECK (
      length(login_id) BETWEEN 4 AND 20
      AND login_id = lower(login_id)
      AND login_id NOT GLOB '*[^a-z0-9]*'
    ),
  password_hash TEXT NOT NULL
    CHECK (length(password_hash) BETWEEN 32 AND 512),
  password_salt TEXT NOT NULL
    CHECK (length(password_salt) BETWEEN 16 AND 256),
  password_algorithm TEXT NOT NULL DEFAULT 'pbkdf2-sha256'
    CHECK (password_algorithm IN ('pbkdf2-sha256')),
  password_iterations INTEGER NOT NULL DEFAULT 10000
    CHECK (password_iterations >= 10000),
  nickname TEXT NOT NULL
    CHECK (length(trim(nickname)) BETWEEN 1 AND 64),
  power INTEGER NOT NULL
    CHECK (power > 0),
  industry_level TEXT NOT NULL
    CHECK (
      industry_level IN (
        'I1','I2','I3','I4','I5',
        'I6','I7','I8','I9','I10'
      )
    ),
  member_rank TEXT NOT NULL
    CHECK (member_rank IN ('R1','R2','R3','R4')),
  role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('member','admin')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','suspended','left')),
  must_change_password INTEGER NOT NULL DEFAULT 0
    CHECK (must_change_password IN (0,1)),
  nickname_updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TEXT,
  password_changed_at TEXT,
  CHECK (
    last_login_at IS NULL
    OR datetime(last_login_at) IS NOT NULL
  ),
  CHECK (
    password_changed_at IS NULL
    OR datetime(password_changed_at) IS NOT NULL
  )
);

CREATE TABLE IF NOT EXISTS member_specs (
  member_id INTEGER PRIMARY KEY,
  vehicle1_class TEXT
    CHECK (
      vehicle1_class IS NULL
      OR vehicle1_class IN ('fighter','shooter','rider')
    ),
  vehicle1_power_value REAL
    CHECK (
      vehicle1_power_value IS NULL
      OR vehicle1_power_value > 0
    ),
  vehicle1_power_unit TEXT
    CHECK (
      vehicle1_power_unit IS NULL
      OR vehicle1_power_unit IN ('M','G')
    ),
  vehicle1_power_normalized REAL
    CHECK (
      vehicle1_power_normalized IS NULL
      OR vehicle1_power_normalized > 0
    ),
  vehicle2_class TEXT
    CHECK (
      vehicle2_class IS NULL
      OR vehicle2_class IN ('fighter','shooter','rider')
    ),
  vehicle2_power_value REAL
    CHECK (
      vehicle2_power_value IS NULL
      OR vehicle2_power_value > 0
    ),
  vehicle2_power_unit TEXT
    CHECK (
      vehicle2_power_unit IS NULL
      OR vehicle2_power_unit IN ('M','G')
    ),
  vehicle2_power_normalized REAL
    CHECK (
      vehicle2_power_normalized IS NULL
      OR vehicle2_power_normalized > 0
    ),
  season_war_available INTEGER
    CHECK (
      season_war_available IS NULL
      OR season_war_available IN (0,1)
    ),
  bgb_available_hour INTEGER
    CHECK (
      bgb_available_hour IS NULL
      OR bgb_available_hour BETWEEN 0 AND 23
    ),
  discord TEXT
    CHECK (
      discord IS NULL
      OR length(trim(discord)) <= 100
    ),
  telegram TEXT
    CHECK (
      telegram IS NULL
      OR length(trim(telegram)) <= 100
    ),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id)
    REFERENCES members(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE
    CHECK (length(token_hash) BETWEEN 32 AND 256),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL
    CHECK (datetime(expires_at) IS NOT NULL),
  last_used_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    CHECK (datetime(last_used_at) IS NOT NULL),
  user_agent TEXT
    CHECK (
      user_agent IS NULL
      OR length(user_agent) <= 500
    ),
  ip_hash TEXT
    CHECK (
      ip_hash IS NULL
      OR length(ip_hash) <= 256
    ),
  FOREIGN KEY (member_id)
    REFERENCES members(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
