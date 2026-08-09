-- v386 Migration application system
ALTER TABLE admin_menu_permissions
  ADD COLUMN migration INTEGER NOT NULL DEFAULT 1 CHECK (migration IN (0,1));

CREATE TABLE IF NOT EXISTS migration_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_name TEXT NOT NULL CHECK (length(trim(player_name)) BETWEEN 1 AND 64),
  game_uid TEXT NOT NULL CHECK (length(game_uid) = 16 AND game_uid NOT GLOB '*[^0-9]*'),
  discord TEXT CHECK (discord IS NULL OR length(trim(discord)) <= 100),
  current_state TEXT NOT NULL CHECK (length(current_state) BETWEEN 1 AND 9 AND current_state NOT GLOB '*[^0-9]*'),
  current_alliance TEXT CHECK (current_alliance IS NULL OR length(trim(current_alliance)) <= 64),

  vehicle1_power_value REAL NOT NULL CHECK (vehicle1_power_value > 0),
  vehicle1_power_unit TEXT NOT NULL CHECK (vehicle1_power_unit IN ('M','G')),
  vehicle1_power_normalized REAL NOT NULL CHECK (vehicle1_power_normalized > 0),
  vehicle2_power_value REAL CHECK (vehicle2_power_value IS NULL OR vehicle2_power_value > 0),
  vehicle2_power_unit TEXT CHECK (vehicle2_power_unit IS NULL OR vehicle2_power_unit IN ('M','G')),
  vehicle2_power_normalized REAL CHECK (vehicle2_power_normalized IS NULL OR vehicle2_power_normalized > 0),
  industry_level INTEGER NOT NULL CHECK (industry_level BETWEEN 1 AND 10),
  spending_level INTEGER NOT NULL CHECK (spending_level BETWEEN 1 AND 10),
  migration_tier TEXT NOT NULL CHECK (migration_tier IN ('gray','blue','purple','gold')),

  migration_reason TEXT NOT NULL CHECK (length(trim(migration_reason)) BETWEEN 1 AND 2000),
  additional_notes TEXT CHECK (additional_notes IS NULL OR length(trim(additional_notes)) <= 2000),
  migration_group TEXT CHECK (migration_group IS NULL OR length(trim(migration_group)) <= 200),
  referrer TEXT CHECK (referrer IS NULL OR length(trim(referrer)) <= 64),

  application_status TEXT NOT NULL DEFAULT 'received'
    CHECK (application_status IN ('received','reviewing','approved','rejected')),
  contact_status TEXT NOT NULL DEFAULT 'not_contacted'
    CHECK (contact_status IN ('not_contacted','contacted')),
  admin_memo TEXT CHECK (admin_memo IS NULL OR length(admin_memo) <= 2000),
  rejection_reason TEXT CHECK (rejection_reason IS NULL OR length(trim(rejection_reason)) <= 2000),

  deleted_at TEXT,
  deleted_by_member_id INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CHECK ((vehicle2_power_value IS NULL AND vehicle2_power_unit IS NULL AND vehicle2_power_normalized IS NULL)
      OR (vehicle2_power_value IS NOT NULL AND vehicle2_power_unit IS NOT NULL AND vehicle2_power_normalized IS NOT NULL)),
  FOREIGN KEY (deleted_by_member_id) REFERENCES members(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_migration_applications_active_uid
  ON migration_applications(game_uid)
  WHERE deleted_at IS NULL AND application_status IN ('received','reviewing','approved');
CREATE INDEX IF NOT EXISTS idx_migration_applications_status_created
  ON migration_applications(application_status, created_at DESC, id DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_migration_applications_player
  ON migration_applications(player_name COLLATE NOCASE)
  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_migration_applications_deleted
  ON migration_applications(deleted_at DESC, id DESC)
  WHERE deleted_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS migration_tier_settings (
  tier_key TEXT PRIMARY KEY CHECK (tier_key IN ('gray','blue','purple','gold')),
  sort_order INTEGER NOT NULL,
  label_ko TEXT NOT NULL,
  label_en TEXT NOT NULL,
  min_power_normalized REAL,
  max_power_normalized REAL,
  power_range_visible INTEGER NOT NULL DEFAULT 0 CHECK (power_range_visible IN (0,1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO migration_tier_settings
  (tier_key,sort_order,label_ko,label_en,power_range_visible)
VALUES
  ('gray',1,'회색','Gray',0),
  ('blue',2,'파랑','Blue',0),
  ('purple',3,'보라','Purple',0),
  ('gold',4,'골드','Gold',0);

-- Temporary anti-abuse state: stores only a salted hash, never the raw IP address.
CREATE TABLE IF NOT EXISTS migration_rate_limits (
  key_hash TEXT PRIMARY KEY,
  window_started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  request_count INTEGER NOT NULL DEFAULT 1 CHECK (request_count >= 0),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_migration_rate_limits_updated
  ON migration_rate_limits(updated_at);
