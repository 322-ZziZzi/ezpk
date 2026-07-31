-- v310 Stage 3: one-row-per-sub-admin menu permission storage
CREATE TABLE IF NOT EXISTS admin_menu_permissions (
  member_id INTEGER PRIMARY KEY,
  members INTEGER NOT NULL DEFAULT 1 CHECK (members IN (0,1)),
  events INTEGER NOT NULL DEFAULT 1 CHECK (events IN (0,1)),
  vote INTEGER NOT NULL DEFAULT 1 CHECK (vote IN (0,1)),
  bgb INTEGER NOT NULL DEFAULT 1 CHECK (bgb IN (0,1)),
  capital_war INTEGER NOT NULL DEFAULT 1 CHECK (capital_war IN (0,1)),
  season INTEGER NOT NULL DEFAULT 1 CHECK (season IN (0,1)),
  requests INTEGER NOT NULL DEFAULT 1 CHECK (requests IN (0,1)),
  accounts INTEGER NOT NULL DEFAULT 1 CHECK (accounts IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);
