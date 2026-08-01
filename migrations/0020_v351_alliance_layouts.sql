-- EZPK v351: administrator alliance layout drafts and immutable publications

ALTER TABLE admin_menu_permissions ADD COLUMN alliance_layout INTEGER NOT NULL DEFAULT 1 CHECK (alliance_layout IN (0,1));

CREATE TABLE IF NOT EXISTS alliance_layout_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  layout_type TEXT NOT NULL CHECK (layout_type IN ('draft','published')),
  direction TEXT NOT NULL CHECK (direction IN ('top','bottom','left','right')),
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision > 0),
  target_count INTEGER NOT NULL DEFAULT 0 CHECK (target_count >= 0),
  placed_count INTEGER NOT NULL DEFAULT 0 CHECK (placed_count >= 0),
  unplaced_count INTEGER NOT NULL DEFAULT 0 CHECK (unplaced_count >= 0),
  missing_specs_count INTEGER NOT NULL DEFAULT 0 CHECK (missing_specs_count >= 0),
  created_by_member_id INTEGER,
  updated_by_member_id INTEGER,
  published_by_member_id INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT,
  FOREIGN KEY (created_by_member_id) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by_member_id) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (published_by_member_id) REFERENCES members(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_alliance_layout_single_draft
  ON alliance_layout_versions(layout_type) WHERE layout_type='draft';
CREATE INDEX IF NOT EXISTS idx_alliance_layout_published
  ON alliance_layout_versions(layout_type,published_at DESC,id DESC);

CREATE TABLE IF NOT EXISTS alliance_layout_positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  layout_version_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  placement_rank INTEGER NOT NULL CHECK (placement_rank BETWEEN 1 AND 100),
  grid_row INTEGER NOT NULL CHECK (grid_row BETWEEN 0 AND 9),
  grid_col INTEGER NOT NULL CHECK (grid_col BETWEEN 0 AND 10),
  is_locked INTEGER NOT NULL DEFAULT 0 CHECK (is_locked IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (layout_version_id) REFERENCES alliance_layout_versions(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  UNIQUE(layout_version_id,member_id),
  UNIQUE(layout_version_id,placement_rank),
  UNIQUE(layout_version_id,grid_row,grid_col)
);

CREATE INDEX IF NOT EXISTS idx_alliance_layout_positions_member
  ON alliance_layout_positions(member_id);
