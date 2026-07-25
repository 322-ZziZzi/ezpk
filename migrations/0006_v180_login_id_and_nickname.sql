-- EZPK v180
-- Expand login IDs to lowercase letters, digits, underscore, hyphen, and dot.
-- Login IDs must be 4–32 characters and must start/end with a letter or digit.
-- Nicknames continue to allow Unicode, spaces, emoji, and special symbols (1–64 chars).

PRAGMA foreign_keys = OFF;

DROP VIEW IF EXISTS public_members;
DROP VIEW IF EXISTS admin_member_overview;

DROP TRIGGER IF EXISTS trg_members_updated_at;

CREATE TABLE members_v180 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  login_id TEXT NOT NULL COLLATE NOCASE UNIQUE
    CHECK (
      length(login_id) BETWEEN 4 AND 32
      AND login_id = lower(login_id)
      AND login_id NOT GLOB '*[^a-z0-9._-]*'
      AND substr(login_id, 1, 1) GLOB '[a-z0-9]'
      AND substr(login_id, -1, 1) GLOB '[a-z0-9]'
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

INSERT INTO members_v180 (
  id,
  login_id,
  password_hash,
  password_salt,
  password_algorithm,
  password_iterations,
  nickname,
  power,
  industry_level,
  member_rank,
  role,
  status,
  must_change_password,
  nickname_updated_at,
  created_at,
  updated_at,
  last_login_at,
  password_changed_at
)
SELECT
  id,
  login_id,
  password_hash,
  password_salt,
  password_algorithm,
  password_iterations,
  nickname,
  power,
  industry_level,
  member_rank,
  role,
  status,
  must_change_password,
  nickname_updated_at,
  created_at,
  updated_at,
  last_login_at,
  password_changed_at
FROM members;

DROP TABLE members;
ALTER TABLE members_v180 RENAME TO members;

CREATE TRIGGER IF NOT EXISTS trg_members_updated_at
AFTER UPDATE ON members
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE members
  SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;

CREATE INDEX IF NOT EXISTS idx_members_status
  ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_role_status
  ON members(role, status);
CREATE INDEX IF NOT EXISTS idx_members_nickname
  ON members(nickname COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_members_status_rank
  ON members(status, member_rank);
CREATE INDEX IF NOT EXISTS idx_members_status_industry
  ON members(status, industry_level);
CREATE INDEX IF NOT EXISTS idx_members_status_power
  ON members(status, power DESC);
CREATE INDEX IF NOT EXISTS idx_members_created_at
  ON members(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_members_last_login
  ON members(last_login_at DESC);
CREATE INDEX IF NOT EXISTS idx_members_nickname_updated
  ON members(nickname_updated_at);

CREATE VIEW public_members AS
SELECT
  m.id,
  m.nickname,
  m.power,
  m.industry_level,
  m.member_rank,
  m.created_at AS joined_at,
  m.updated_at AS basic_updated_at,
  s.vehicle1_class,
  s.vehicle1_power_value,
  s.vehicle1_power_unit,
  s.vehicle1_power_normalized,
  s.vehicle2_class,
  s.vehicle2_power_value,
  s.vehicle2_power_unit,
  s.vehicle2_power_normalized,
  s.season_war_available,
  s.bgb_available_hour,
  s.updated_at AS spec_updated_at,
  CASE
    WHEN
      s.vehicle1_class IS NOT NULL
      AND s.vehicle1_power_value IS NOT NULL
      AND s.vehicle1_power_unit IS NOT NULL
      AND s.vehicle2_class IS NOT NULL
      AND s.vehicle2_power_value IS NOT NULL
      AND s.vehicle2_power_unit IS NOT NULL
      AND s.season_war_available IS NOT NULL
      AND s.bgb_available_hour IS NOT NULL
    THEN 1
    ELSE 0
  END AS spec_completed
FROM members AS m
LEFT JOIN member_specs AS s
  ON s.member_id = m.id
WHERE m.status = 'active';

CREATE VIEW admin_member_overview AS
SELECT
  m.id,
  m.login_id,
  m.nickname,
  m.power,
  m.industry_level,
  m.member_rank,
  m.role,
  m.status,
  m.must_change_password,
  m.nickname_updated_at,
  m.created_at,
  m.updated_at,
  m.last_login_at,
  m.password_changed_at,
  s.vehicle1_class,
  s.vehicle1_power_value,
  s.vehicle1_power_unit,
  s.vehicle1_power_normalized,
  s.vehicle2_class,
  s.vehicle2_power_value,
  s.vehicle2_power_unit,
  s.vehicle2_power_normalized,
  s.season_war_available,
  s.bgb_available_hour,
  s.discord,
  s.telegram,
  s.created_at AS spec_created_at,
  s.updated_at AS spec_updated_at,
  CASE
    WHEN
      s.vehicle1_class IS NOT NULL
      AND s.vehicle1_power_value IS NOT NULL
      AND s.vehicle1_power_unit IS NOT NULL
      AND s.vehicle2_class IS NOT NULL
      AND s.vehicle2_power_value IS NOT NULL
      AND s.vehicle2_power_unit IS NOT NULL
      AND s.season_war_available IS NOT NULL
      AND s.bgb_available_hour IS NOT NULL
    THEN 1
    ELSE 0
  END AS spec_completed
FROM members AS m
LEFT JOIN member_specs AS s
  ON s.member_id = m.id;

INSERT INTO settings (key, value, updated_at, updated_by)
VALUES ('member_db_schema_version', '3.0-v180', CURRENT_TIMESTAMP, 'migration')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP,
  updated_by = 'migration';

PRAGMA foreign_keys = ON;
