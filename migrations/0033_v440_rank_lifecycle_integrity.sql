-- EZPK v440 / 4.4.0
-- Rank Lifecycle Integrity & Immutable History
--
-- Policy changes:
-- 1) Permanent target-rank spec qualification (R2/R3) survives rule/rank changes.
-- 2) R1 has no rank-maintenance cycle. Legacy R1 maintenance state is retired.
-- 3) R1 anti-bounce is represented as promotion re-entry, not maintenance.
-- 4) Immutable rank history survives member deletion and keeps public/private snapshots separate.
-- 5) Existing v435 qualification dates and in-flight promotion cycles are preserved.

ALTER TABLE member_rank_review_states
  ADD COLUMN promotion_reentry_required INTEGER NOT NULL DEFAULT 0
  CHECK(promotion_reentry_required IN (0,1));

ALTER TABLE member_rank_review_states
  ADD COLUMN promotion_reentry_started_on TEXT;

CREATE TABLE IF NOT EXISTS member_rank_spec_qualifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  target_rank TEXT NOT NULL CHECK(target_rank IN ('R2','R3')),
  qualified_at TEXT NOT NULL,
  rule_snapshot TEXT NOT NULL,
  spec_snapshot TEXT NOT NULL,
  qualification_source TEXT NOT NULL CHECK(qualification_source IN (
    'LEGACY_V435_PERSISTED',
    'BASELINE_CURRENT_SPEC',
    'LIVE_SPEC_QUALIFICATION',
    'RESTORE'
  )),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Deliberately no FK to members: permanent qualification must survive
  -- accidental member-row deletion and can relink if that exact AUTOINCREMENT id is restored.
  UNIQUE(member_id,target_rank)
);
CREATE INDEX IF NOT EXISTS idx_rank_spec_qualification_target
  ON member_rank_spec_qualifications(target_rank,qualified_at);

CREATE TABLE IF NOT EXISTS member_rank_history_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_key TEXT NOT NULL UNIQUE,
  legacy_change_id INTEGER UNIQUE,
  member_id INTEGER NOT NULL,
  member_login_id_snapshot TEXT,
  member_nickname_snapshot TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK(event_type IN (
    'PROMOTION','DEMOTION','MANUAL_ADJUSTMENT','CORRECTION','RESTORE'
  )),
  from_rank TEXT NOT NULL,
  to_rank TEXT NOT NULL,
  reason_code TEXT NOT NULL,
  public_note TEXT,
  internal_note TEXT,
  decision_source TEXT NOT NULL,
  rule_snapshot TEXT,
  spec_snapshot TEXT,
  cycle_snapshot TEXT,
  public_activity_snapshot TEXT,
  private_audit_snapshot TEXT,
  changed_by_member_id INTEGER,
  changed_by_nickname_snapshot TEXT,
  snapshot_quality TEXT NOT NULL DEFAULT 'FULL' CHECK(snapshot_quality IN ('FULL','LEGACY_PARTIAL')),
  dismissed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_rank_history_member_created
  ON member_rank_history_events(member_id,created_at DESC,id DESC);
CREATE INDEX IF NOT EXISTS idx_rank_history_created
  ON member_rank_history_events(created_at DESC,id DESC);
CREATE INDEX IF NOT EXISTS idx_rank_history_event_type
  ON member_rank_history_events(event_type,created_at DESC);

-- Preserve the exact v435 qualification dates first. These are authoritative for
-- the currently persisted promotion target and must not be rewritten to v440 activation time.
INSERT OR IGNORE INTO member_rank_spec_qualifications(
  member_id,target_rank,qualified_at,rule_snapshot,spec_snapshot,qualification_source
)
SELECT
  rr.member_id,
  rr.promotion_target_rank,
  rr.spec_qualified_at,
  COALESCE(rr.promotion_rule_fingerprint,'{}'),
  json_object(
    'industryLevel',m.industry_level,
    'vehicle1PowerValue',s.vehicle1_power_value,
    'vehicle1PowerUnit',s.vehicle1_power_unit,
    'vehicle1PowerNormalized',s.vehicle1_power_normalized
  ),
  'LEGACY_V435_PERSISTED'
FROM member_rank_review_states rr
JOIN members m ON m.id=rr.member_id
LEFT JOIN member_specs s ON s.member_id=m.id
WHERE rr.spec_qualified_at IS NOT NULL
  AND rr.promotion_target_rank IN ('R2','R3');

-- v440 activation baseline: current observed specs can establish a permanent R2
-- qualification, regardless of current R1/R2/R3 rank. This does not invent a
-- historical date; qualified_at is explicitly the v440 activation date.
INSERT OR IGNORE INTO member_rank_spec_qualifications(
  member_id,target_rank,qualified_at,rule_snapshot,spec_snapshot,qualification_source
)
SELECT
  m.id,
  'R2',
  date('now','+9 hours'),
  json_object(
    'target','R2',
    'industryLevel',COALESCE(CAST(json_extract((SELECT value FROM settings WHERE key='promotion_rules_v1'),'$.R2.industryLevel') AS INTEGER),7),
    'vehicle1PowerNormalized',COALESCE(CAST(json_extract((SELECT value FROM settings WHERE key='promotion_rules_v1'),'$.R2.vehicle1PowerNormalized') AS REAL),1300)
  ),
  json_object(
    'industryLevel',m.industry_level,
    'vehicle1PowerValue',s.vehicle1_power_value,
    'vehicle1PowerUnit',s.vehicle1_power_unit,
    'vehicle1PowerNormalized',s.vehicle1_power_normalized
  ),
  'BASELINE_CURRENT_SPEC'
FROM members m
JOIN member_specs s ON s.member_id=m.id
WHERE m.status='active'
  AND COALESCE(m.approval_status,'approved')='approved'
  AND m.member_rank IN ('R1','R2','R3')
  AND CAST(REPLACE(UPPER(COALESCE(m.industry_level,'')),'I','') AS INTEGER)
      >= COALESCE(CAST(json_extract((SELECT value FROM settings WHERE key='promotion_rules_v1'),'$.R2.industryLevel') AS INTEGER),7)
  AND COALESCE(s.vehicle1_power_normalized,0)
      >= COALESCE(CAST(json_extract((SELECT value FROM settings WHERE key='promotion_rules_v1'),'$.R2.vehicle1PowerNormalized') AS REAL),1300);

-- Same activation baseline for R3 target qualification.
INSERT OR IGNORE INTO member_rank_spec_qualifications(
  member_id,target_rank,qualified_at,rule_snapshot,spec_snapshot,qualification_source
)
SELECT
  m.id,
  'R3',
  date('now','+9 hours'),
  json_object(
    'target','R3',
    'industryLevel',COALESCE(CAST(json_extract((SELECT value FROM settings WHERE key='promotion_rules_v1'),'$.R3.industryLevel') AS INTEGER),9),
    'vehicle1PowerNormalized',COALESCE(CAST(json_extract((SELECT value FROM settings WHERE key='promotion_rules_v1'),'$.R3.vehicle1PowerNormalized') AS REAL),2000)
  ),
  json_object(
    'industryLevel',m.industry_level,
    'vehicle1PowerValue',s.vehicle1_power_value,
    'vehicle1PowerUnit',s.vehicle1_power_unit,
    'vehicle1PowerNormalized',s.vehicle1_power_normalized
  ),
  'BASELINE_CURRENT_SPEC'
FROM members m
JOIN member_specs s ON s.member_id=m.id
WHERE m.status='active'
  AND COALESCE(m.approval_status,'approved')='approved'
  AND m.member_rank IN ('R1','R2','R3')
  AND CAST(REPLACE(UPPER(COALESCE(m.industry_level,'')),'I','') AS INTEGER)
      >= COALESCE(CAST(json_extract((SELECT value FROM settings WHERE key='promotion_rules_v1'),'$.R3.industryLevel') AS INTEGER),9)
  AND COALESCE(s.vehicle1_power_normalized,0)
      >= COALESCE(CAST(json_extract((SELECT value FROM settings WHERE key='promotion_rules_v1'),'$.R3.vehicle1PowerNormalized') AS REAL),2000);

-- Retire R1 maintenance semantics. Preserve the old anti-bounce intent in a
-- separately named promotion re-entry gate before clearing the maintenance gate.
UPDATE member_rank_review_states
SET
  promotion_reentry_required=CASE WHEN promotion_unlock_after_maintenance=1 THEN 1 ELSE promotion_reentry_required END,
  promotion_reentry_started_on=CASE
    WHEN promotion_unlock_after_maintenance=1 THEN COALESCE(maintenance_cycle_started_on,date(updated_at,'+9 hours'),date('now','+9 hours'))
    ELSE promotion_reentry_started_on
  END,
  maintenance_cycle_started_on=NULL,
  maintenance_status='ACTIVE',
  maintenance_reviewable_at=NULL,
  maintenance_last_completed_on=NULL,
  maintenance_verified_at=NULL,
  promotion_unlock_after_maintenance=0,
  promotion_status=CASE WHEN promotion_status='WAIT_MAINTENANCE' THEN NULL ELSE promotion_status END,
  updated_at=CURRENT_TIMESTAMP
WHERE member_id IN (SELECT id FROM members WHERE member_rank='R1');

-- Materialize a missing R2/R3 maintenance cycle after new-member protection.
-- The live R006 preflight found one such row; this rule is data-driven rather than ID-specific.
UPDATE member_rank_review_states
SET
  maintenance_cycle_started_on=MAX(
    COALESCE((SELECT value FROM settings WHERE key='rank_review_system_v1_started_on'),date('now','+9 hours')),
    date(new_member_protection_until,'+1 day')
  ),
  maintenance_status='ACTIVE',
  maintenance_reviewable_at=NULL,
  updated_at=CURRENT_TIMESTAMP
WHERE maintenance_cycle_started_on IS NULL
  AND member_id IN (
    SELECT m.id
    FROM members m
    WHERE m.member_rank IN ('R2','R3')
      AND m.status='active'
      AND COALESCE(m.approval_status,'approved')='approved'
  )
  AND new_member_protection_until IS NOT NULL
  AND date('now','+9 hours')>new_member_protection_until;

-- Backfill the surviving legacy rank-change rows without pretending that
-- missing historical decision data is exact. Free-form legacy reason/snapshot
-- data stays private; member-facing history receives reason codes instead.
INSERT OR IGNORE INTO member_rank_history_events(
  event_key,legacy_change_id,member_id,member_login_id_snapshot,member_nickname_snapshot,
  event_type,from_rank,to_rank,reason_code,public_note,internal_note,decision_source,
  rule_snapshot,spec_snapshot,cycle_snapshot,public_activity_snapshot,private_audit_snapshot,
  changed_by_member_id,changed_by_nickname_snapshot,snapshot_quality,dismissed_at,created_at
)
SELECT
  'legacy-v371-'||h.id,
  h.id,
  h.member_id,
  m.login_id,
  COALESCE(m.nickname,'Member #'||h.member_id),
  CASE h.change_type
    WHEN 'promotion' THEN 'PROMOTION'
    WHEN 'demotion' THEN 'DEMOTION'
    WHEN 'restoration' THEN 'RESTORE'
    ELSE 'MANUAL_ADJUSTMENT'
  END,
  h.from_rank,
  h.to_rank,
  CASE h.change_type
    WHEN 'promotion' THEN 'PROMOTION_REQUIREMENTS_MET'
    WHEN 'demotion' THEN 'MAINTENANCE_ACTIVITY_FAILED'
    WHEN 'restoration' THEN 'DATA_RESTORE'
    ELSE 'ADMIN_MANUAL_ADJUSTMENT'
  END,
  NULL,
  NULLIF(h.reason,''),
  CASE h.change_type
    WHEN 'promotion' THEN 'admin_review'
    WHEN 'demotion' THEN 'admin_review'
    WHEN 'restoration' THEN 'restore'
    ELSE 'admin_manual'
  END,
  NULL,
  NULL,
  NULL,
  NULL,
  CASE WHEN h.activity_snapshot IS NULL OR TRIM(h.activity_snapshot)='' THEN NULL ELSE h.activity_snapshot END,
  h.changed_by_member_id,
  a.nickname,
  'LEGACY_PARTIAL',
  h.dismissed_at,
  h.created_at
FROM member_rank_changes h
LEFT JOIN members m ON m.id=h.member_id
LEFT JOIN members a ON a.id=h.changed_by_member_id;

INSERT INTO settings(key,value,updated_at,updated_by)
VALUES('rank_review_system_v2_started_on',date('now','+9 hours'),CURRENT_TIMESTAMP,'migration')
ON CONFLICT(key) DO NOTHING;

INSERT INTO settings(key,value,updated_at,updated_by)
VALUES('member_db_schema_version','5.5-v440',CURRENT_TIMESTAMP,'migration')
ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP,updated_by='migration';
