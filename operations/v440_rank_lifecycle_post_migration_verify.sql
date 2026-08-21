-- EZPK v440 / 4.4.0 post-migration READ-ONLY verification.
-- SELECT only. No mutation statements.

SELECT 'V440_SCHEMA' AS section,
       (SELECT value FROM settings WHERE key='member_db_schema_version') AS schema_version,
       (SELECT value FROM settings WHERE key='rank_review_system_v2_started_on') AS v2_started_on;

SELECT 'V440_TABLES' AS section,
       SUM(CASE WHEN name='member_rank_spec_qualifications' THEN 1 ELSE 0 END) AS qualification_table,
       SUM(CASE WHEN name='member_rank_history_events' THEN 1 ELSE 0 END) AS history_table
FROM sqlite_master
WHERE type='table' AND name IN ('member_rank_spec_qualifications','member_rank_history_events');

SELECT 'V440_R1_SEMANTICS' AS section,
       COUNT(*) AS active_r1_states,
       SUM(CASE WHEN rr.maintenance_cycle_started_on IS NOT NULL THEN 1 ELSE 0 END) AS r1_maintenance_cycles,
       SUM(CASE WHEN rr.promotion_unlock_after_maintenance<>0 THEN 1 ELSE 0 END) AS r1_maintenance_unlock_gates,
       SUM(CASE WHEN rr.promotion_reentry_required=1 THEN 1 ELSE 0 END) AS r1_reentry_gates
FROM members m
JOIN member_rank_review_states rr ON rr.member_id=m.id
WHERE m.status='active' AND COALESCE(m.approval_status,'approved')='approved' AND m.member_rank='R1';

SELECT 'V440_QUALIFICATIONS' AS section,target_rank,qualification_source,COUNT(*) AS rows
FROM member_rank_spec_qualifications
GROUP BY target_rank,qualification_source
ORDER BY target_rank,qualification_source;

SELECT 'V440_QUALIFICATION_DELETE_DURABILITY' AS section,
       COUNT(*) AS member_fk_rows,
       SUM(CASE WHEN upper(COALESCE(on_delete,''))='CASCADE' THEN 1 ELSE 0 END) AS cascade_fk_rows
FROM pragma_foreign_key_list('member_rank_spec_qualifications');

SELECT 'V440_QUALIFICATION_STATE_LINK' AS section,COUNT(*) AS missing_permanent_rows
FROM member_rank_review_states rr
WHERE rr.spec_qualified_at IS NOT NULL
  AND rr.promotion_target_rank IN ('R2','R3')
  AND NOT EXISTS (
    SELECT 1 FROM member_rank_spec_qualifications q
    WHERE q.member_id=rr.member_id AND q.target_rank=rr.promotion_target_rank
  );

SELECT 'V440_R2_R3_CYCLE_COVERAGE' AS section,COUNT(*) AS missing_cycle_after_protection
FROM members m
JOIN member_rank_review_states rr ON rr.member_id=m.id
WHERE m.status='active' AND COALESCE(m.approval_status,'approved')='approved'
  AND m.member_rank IN ('R2','R3')
  AND rr.maintenance_cycle_started_on IS NULL
  AND date('now','+9 hours')>COALESCE(rr.new_member_protection_until,date(m.created_at,'+9 hours','+9 days'));

SELECT 'V440_HISTORY' AS section,event_type,snapshot_quality,COUNT(*) AS events
FROM member_rank_history_events
GROUP BY event_type,snapshot_quality
ORDER BY event_type,snapshot_quality;

SELECT 'V440_LEGACY_HISTORY_BACKFILL' AS section,
       (SELECT COUNT(*) FROM member_rank_changes) AS legacy_rows,
       (SELECT COUNT(*) FROM member_rank_history_events WHERE legacy_change_id IS NOT NULL) AS backfilled_rows,
       (SELECT COUNT(*) FROM member_rank_history_events WHERE legacy_change_id IS NOT NULL AND snapshot_quality<>'LEGACY_PARTIAL') AS wrongly_full_rows;

SELECT 'V440_LEGACY_PUBLIC_PRIVACY' AS section,
       COUNT(*) AS legacy_rows_with_public_activity_snapshot
FROM member_rank_history_events
WHERE legacy_change_id IS NOT NULL AND public_activity_snapshot IS NOT NULL;

SELECT 'V440_HISTORY_JSON' AS section,
       SUM(CASE WHEN rule_snapshot IS NOT NULL AND json_valid(rule_snapshot)=0 THEN 1 ELSE 0 END) AS invalid_rule_json,
       SUM(CASE WHEN spec_snapshot IS NOT NULL AND json_valid(spec_snapshot)=0 THEN 1 ELSE 0 END) AS invalid_spec_json,
       SUM(CASE WHEN cycle_snapshot IS NOT NULL AND json_valid(cycle_snapshot)=0 THEN 1 ELSE 0 END) AS invalid_cycle_json,
       SUM(CASE WHEN public_activity_snapshot IS NOT NULL AND json_valid(public_activity_snapshot)=0 THEN 1 ELSE 0 END) AS invalid_public_activity_json,
       SUM(CASE WHEN private_audit_snapshot IS NOT NULL AND json_valid(private_audit_snapshot)=0 THEN 1 ELSE 0 END) AS invalid_private_audit_json
FROM member_rank_history_events;

SELECT 'V440_FINAL_SENTINELS' AS section,
       (SELECT COUNT(*) FROM members m JOIN member_rank_review_states rr ON rr.member_id=m.id WHERE m.member_rank='R1' AND rr.maintenance_cycle_started_on IS NOT NULL) AS r1_maintenance_cycles,
       (SELECT COUNT(*) FROM member_rank_review_states rr WHERE rr.spec_qualified_at IS NOT NULL AND rr.promotion_target_rank IN ('R2','R3') AND NOT EXISTS (SELECT 1 FROM member_rank_spec_qualifications q WHERE q.member_id=rr.member_id AND q.target_rank=rr.promotion_target_rank)) AS qualification_link_misses,
       (SELECT COUNT(*) FROM members m JOIN member_rank_review_states rr ON rr.member_id=m.id WHERE m.status='active' AND COALESCE(m.approval_status,'approved')='approved' AND m.member_rank IN ('R2','R3') AND rr.maintenance_cycle_started_on IS NULL AND date('now','+9 hours')>COALESCE(rr.new_member_protection_until,date(m.created_at,'+9 hours','+9 days'))) AS missing_r2_r3_cycles,
       (SELECT COUNT(*) FROM member_rank_history_events WHERE legacy_change_id IS NOT NULL AND snapshot_quality<>'LEGACY_PARTIAL') AS invalid_legacy_quality,
       (SELECT COUNT(*) FROM member_rank_history_events WHERE legacy_change_id IS NOT NULL AND public_activity_snapshot IS NOT NULL) AS legacy_public_snapshot_leaks,
       (SELECT COUNT(*) FROM pragma_foreign_key_list('member_rank_spec_qualifications')) AS qualification_member_fk_rows,
       (SELECT COUNT(*) FROM pragma_foreign_key_list('member_rank_spec_qualifications') WHERE upper(COALESCE(on_delete,''))='CASCADE') AS qualification_cascade_fk_rows;
