-- EZPK v439 selective member restore R003: Batman(64) + EAGLE(99)
-- EAGLE source row is backup ID 99 (Zeusgoeswild), patched from authoritative member_update audit to final EAGLE state.
-- Sessions are intentionally NOT restored.
PRAGMA foreign_keys=ON;

-- members: 2 row(s), cascade depth 0
INSERT INTO "members" ("id","login_id","password_hash","password_salt","password_algorithm","password_iterations","nickname","power","industry_level","member_rank","role","status","must_change_password","nickname_updated_at","created_at","updated_at","last_login_at","password_changed_at","nickname_change_count","approval_status","admin_level") VALUES(64,'batman','0dc7cd98cd59ab66df85ef7587b21dd085e32e2d1227ebd9ff4d456ef140784f','8abe0afa2c216101a53c780f49bfc96e','pbkdf2-sha256',10000,'Batman',790321627,'I6','R1','member','active',0,'2026-07-28 14:22:01','2026-07-28 14:22:01','2026-07-28 14:28:54',NULL,'2026-07-28 14:22:01',0,'approved',NULL);
INSERT INTO "members" ("id","login_id","password_hash","password_salt","password_algorithm","password_iterations","nickname","power","industry_level","member_rank","role","status","must_change_password","nickname_updated_at","created_at","updated_at","last_login_at","password_changed_at","nickname_change_count","approval_status","admin_level") VALUES(99,'eagle','665489c35ae564a0790ed9608d4493fc086fab429e55e920e5ebc9a1a8b3b769','470c60712b4cb569ee029864f9f6efab','pbkdf2-sha256',10000,'EAGLE',950000000,'I10','R3','member','active',0,'2026-08-18 04:02:07','2026-08-18 04:02:07','2026-08-20 13:41:06',NULL,'2026-08-18 04:02:07',0,'approved',NULL);

-- alliance_layout_positions: 8 row(s), cascade depth 1
INSERT INTO "alliance_layout_positions" ("id","layout_version_id","member_id","placement_rank","grid_row","grid_col","is_locked","created_at","updated_at") VALUES(136,2,64,58,8,4,0,'2026-08-01 23:58:35','2026-08-01 23:58:35');
INSERT INTO "alliance_layout_positions" ("id","layout_version_id","member_id","placement_rank","grid_row","grid_col","is_locked","created_at","updated_at") VALUES(370,3,64,58,8,4,0,'2026-08-02 02:00:45','2026-08-02 02:00:45');
INSERT INTO "alliance_layout_positions" ("id","layout_version_id","member_id","placement_rank","grid_row","grid_col","is_locked","created_at","updated_at") VALUES(526,4,64,58,8,4,0,'2026-08-02 02:04:55','2026-08-02 02:04:55');
INSERT INTO "alliance_layout_positions" ("id","layout_version_id","member_id","placement_rank","grid_row","grid_col","is_locked","created_at","updated_at") VALUES(682,5,64,58,8,4,0,'2026-08-02 03:04:01','2026-08-02 03:04:01');
INSERT INTO "alliance_layout_positions" ("id","layout_version_id","member_id","placement_rank","grid_row","grid_col","is_locked","created_at","updated_at") VALUES(998,6,64,59,8,3,0,'2026-08-02 10:54:40','2026-08-02 10:54:40');
INSERT INTO "alliance_layout_positions" ("id","layout_version_id","member_id","placement_rank","grid_row","grid_col","is_locked","created_at","updated_at") VALUES(1155,7,64,59,8,3,0,'2026-08-02 11:30:46','2026-08-02 11:30:46');
INSERT INTO "alliance_layout_positions" ("id","layout_version_id","member_id","placement_rank","grid_row","grid_col","is_locked","created_at","updated_at") VALUES(1235,1,64,61,8,1,0,'2026-08-10 01:14:03','2026-08-10 01:14:03');
INSERT INTO "alliance_layout_positions" ("id","layout_version_id","member_id","placement_rank","grid_row","grid_col","is_locked","created_at","updated_at") VALUES(1319,8,64,61,8,1,0,'2026-08-10 01:14:08','2026-08-10 01:14:08');

-- member_activity_logs: 2 row(s), cascade depth 1
INSERT INTO "member_activity_logs" ("id","member_id","activity_type","source","changed_fields","created_at") VALUES(146,99,'specs_update','member','["bgbAvailableHour"]','2026-08-18 04:04:12');
INSERT INTO "member_activity_logs" ("id","member_id","activity_type","source","changed_fields","created_at") VALUES(145,99,'specs_update','member','["power","industryLevel","vehicle1Class","vehicle1Power","vehicle2Class","vehicle2Power","seasonWarAvailable"]','2026-08-18 04:03:33');

-- member_daily_visits: 1 row(s), cascade depth 1
INSERT INTO "member_daily_visits" ("member_id","visit_date","first_seen_at") VALUES(99,'2026-08-18','2026-08-18 04:02:08');

-- member_nickname_history: 1 row(s), cascade depth 1
INSERT INTO "member_nickname_history" ("id","member_id","old_nickname","new_nickname","changed_by","changed_by_member_id","changed_at") VALUES(31,99,'EAGLE','Zeusgoeswild','admin',1,'2026-08-20 10:31:05');

-- member_rank_changes: 1 row(s), cascade depth 1
INSERT INTO "member_rank_changes" ("id","member_id","change_type","from_rank","to_rank","reason","activity_snapshot","changed_by_member_id","protection_until","created_at","dismissed_at") VALUES(23,99,'manual','R1','R3','관리자 직접 변경',NULL,1,NULL,'2026-08-20 10:31:05',NULL);

-- member_rank_review_states: 2 row(s), cascade depth 1
INSERT INTO "member_rank_review_states" ("member_id","rank_snapshot","promotion_target_rank","spec_qualified_at","promotion_cycle_started_on","promotion_activity_qualified_at","promotion_status","promotion_hold_started_at","promotion_rule_fingerprint","maintenance_cycle_started_on","maintenance_status","maintenance_reviewable_at","maintenance_last_completed_on","maintenance_verified_at","new_member_protection_until","promotion_unlock_after_maintenance","last_evaluated_at","updated_at") VALUES(64,'R1','R2',NULL,NULL,NULL,NULL,NULL,'{"target":"R2","industryLevel":7,"vehicle1PowerNormalized":1300}','2026-08-17','ACTIVE',NULL,NULL,NULL,'2026-08-06',0,'2026-08-20 10:39:45','2026-08-20 10:39:45');
INSERT INTO "member_rank_review_states" ("member_id","rank_snapshot","promotion_target_rank","spec_qualified_at","promotion_cycle_started_on","promotion_activity_qualified_at","promotion_status","promotion_hold_started_at","promotion_rule_fingerprint","maintenance_cycle_started_on","maintenance_status","maintenance_reviewable_at","maintenance_last_completed_on","maintenance_verified_at","new_member_protection_until","promotion_unlock_after_maintenance","last_evaluated_at","updated_at") VALUES(99,'R3',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'ACTIVE',NULL,NULL,NULL,'2026-08-27',0,'2026-08-20 10:31:05','2026-08-20 10:31:05');

-- member_specs: 2 row(s), cascade depth 1
INSERT INTO "member_specs" ("member_id","vehicle1_class","vehicle1_power_value","vehicle1_power_unit","vehicle1_power_normalized","vehicle2_class","vehicle2_power_value","vehicle2_power_unit","vehicle2_power_normalized","season_war_available","bgb_available_hour","discord","telegram","created_at","updated_at","profile_specs_registered","member_self_updated_at") VALUES(64,'shooter',1.1,'G',1100,'fighter',270.2,'M',270.2,1,10,'batmannnn007','@Qasim_Aly','2026-07-28 14:22:01','2026-07-28 14:28:54',1,NULL);
INSERT INTO "member_specs" ("member_id","vehicle1_class","vehicle1_power_value","vehicle1_power_unit","vehicle1_power_normalized","vehicle2_class","vehicle2_power_value","vehicle2_power_unit","vehicle2_power_normalized","season_war_available","bgb_available_hour","discord","telegram","created_at","updated_at","profile_specs_registered","member_self_updated_at") VALUES(99,'fighter',3.55,'G',3550,'shooter',1.2,'G',1200,1,23,NULL,NULL,'2026-08-18 04:02:07','2026-08-18 04:04:14',1,'2026-08-18 04:04:12');

-- vote_responses: 1 row(s), cascade depth 1
INSERT INTO "vote_responses" ("id","vote_id","member_id","created_at","updated_at") VALUES(56,2,64,'2026-07-28 14:30:15','2026-07-28 14:30:20');

-- vote_response_options: 1 row(s), cascade depth 2
INSERT INTO "vote_response_options" ("response_id","option_id") VALUES(56,3);

-- Recreate EAGLE post-backup nickname transition recorded by admin audit
INSERT INTO "member_nickname_history" ("member_id","old_nickname","new_nickname","changed_by","changed_by_member_id","changed_at") VALUES(99,'Zeusgoeswild','EAGLE','admin',1,'2026-08-20 13:41:06');

-- Old sessions intentionally omitted; fresh login sessions required.
