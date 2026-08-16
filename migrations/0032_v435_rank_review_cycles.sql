-- EZPK v435: rank review cycle state for promotion, maintenance/demotion, and new-member protection.
CREATE TABLE IF NOT EXISTS member_rank_review_states (
  member_id INTEGER PRIMARY KEY,
  rank_snapshot TEXT NOT NULL,
  promotion_target_rank TEXT,
  spec_qualified_at TEXT,
  promotion_cycle_started_on TEXT,
  promotion_activity_qualified_at TEXT,
  promotion_status TEXT CHECK(promotion_status IN ('IN_PROGRESS','REVIEWABLE','HOLD','WAIT_MAINTENANCE')),
  promotion_hold_started_at TEXT,
  promotion_rule_fingerprint TEXT,
  maintenance_cycle_started_on TEXT,
  maintenance_status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(maintenance_status IN ('ACTIVE','REVIEWABLE')),
  maintenance_reviewable_at TEXT,
  maintenance_last_completed_on TEXT,
  maintenance_verified_at TEXT,
  new_member_protection_until TEXT,
  promotion_unlock_after_maintenance INTEGER NOT NULL DEFAULT 0 CHECK(promotion_unlock_after_maintenance IN (0,1)),
  last_evaluated_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_member_rank_review_promotion
  ON member_rank_review_states(promotion_status,promotion_target_rank);
CREATE INDEX IF NOT EXISTS idx_member_rank_review_maintenance
  ON member_rank_review_states(maintenance_status,maintenance_cycle_started_on);

INSERT INTO settings(key,value,updated_at,updated_by)
VALUES('rank_review_system_v1_started_on',date('now','+9 hours'),CURRENT_TIMESTAMP,'migration')
ON CONFLICT(key) DO NOTHING;

INSERT INTO settings(key,value,updated_at,updated_by)
VALUES('member_db_schema_version','5.4-v435',CURRENT_TIMESTAMP,'migration')
ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP,updated_by='migration';
