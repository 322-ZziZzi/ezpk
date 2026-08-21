import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(...p)=>fs.readFileSync(path.join(root,...p),'utf8');
const failures=[];
const ok=(name,cond)=>{if(!cond)failures.push(name);else console.log(`PASS ${name}`)};
const worker=read('worker.js');
const migration=read('migrations','0033_v440_rank_lifecycle_integrity.sql');
const my=read('my','my.js');
const myHtml=read('my','index.html');
const admin=read('admin','member-manager-v188.js');

ok('migration_permanent_qualification_table',migration.includes('CREATE TABLE IF NOT EXISTS member_rank_spec_qualifications'));
const qualificationDef=migration.slice(migration.indexOf('CREATE TABLE IF NOT EXISTS member_rank_spec_qualifications'),migration.indexOf('CREATE INDEX IF NOT EXISTS idx_rank_spec_qualification_target'));
ok('qualification_survives_member_delete',!qualificationDef.includes('REFERENCES members')&&!qualificationDef.includes('ON DELETE CASCADE'));
ok('migration_immutable_history_table',migration.includes('CREATE TABLE IF NOT EXISTS member_rank_history_events'));
const historyDef=migration.slice(migration.indexOf('CREATE TABLE IF NOT EXISTS member_rank_history_events'),migration.indexOf('CREATE INDEX IF NOT EXISTS idx_rank_history_member_created'));
ok('history_has_no_member_fk_or_delete_cascade',!historyDef.includes('REFERENCES members')&&!historyDef.includes('ON DELETE CASCADE'));
ok('history_supports_r4_r5_without_rank_check',!historyDef.includes("from_rank TEXT NOT NULL CHECK")&&!historyDef.includes("to_rank TEXT NOT NULL CHECK"));
ok('r1_reentry_columns',migration.includes('promotion_reentry_required')&&migration.includes('promotion_reentry_started_on'));
ok('r1_maintenance_retired',migration.includes("WHERE member_id IN (SELECT id FROM members WHERE member_rank='R1')")&&migration.includes('maintenance_cycle_started_on=NULL'));
ok('legacy_qualification_dates_preserved',migration.includes("'LEGACY_V435_PERSISTED'")&&migration.includes('rr.spec_qualified_at'));
ok('baseline_qualification_is_activation_not_fake_history',migration.includes("'BASELINE_CURRENT_SPEC'")&&migration.includes("date('now','+9 hours')"));
ok('legacy_history_marked_partial',migration.includes("'LEGACY_PARTIAL'"));
ok('public_private_history_snapshots_split',migration.includes('public_activity_snapshot TEXT')&&migration.includes('private_audit_snapshot TEXT'));

ok('rolling_activity_uses_kst_between',/async function memberActivityStatus\([\s\S]*?return memberActivityStatusBetween\(db,memberId,startOn,today,includePrivate\);/.test(worker));
ok('maintenance_only_r2_r3',worker.includes("if(!['R2','R3'].includes(row?.member_rank))return null;"));
ok('promotion_hold_decoupled_from_maintenance',worker.includes('let holdRecovery=null;')&&worker.includes('hasRankReviewActivityEvidenceAfter(db,row.id,state.promotion_hold_started_at)'));
ok('r1_reentry_uses_rolling30_and_fresh_activity',worker.includes("row.member_rank==='R1'&&Number(state.promotion_reentry_required||0)===1")&&worker.includes('recoveryActivity.eligible&&fresh'));
ok('permanent_qualification_authority',worker.includes('async function ensureRankSpecQualification')&&worker.includes('member_rank_spec_qualifications'));
ok('rule_change_preserves_earned_qualification',worker.includes('Existing permanent qualification and in-flight cycle state are intentionally preserved.'));
ok('maintenance_fixed_cycle_and_recovery_split',worker.includes('cycleActivity,failedCycleActivity,recoveryActivity')&&worker.includes("status==='REVIEWABLE'&&!recoveryActivity.eligible"));
ok('promotion_commit_uses_qualification_and_reviewable',worker.includes("EXISTS(SELECT 1 FROM member_rank_spec_qualifications q")&&worker.includes("rr.promotion_status='REVIEWABLE'"));
const promoteBlock=worker.slice(worker.indexOf('async function handleAdminMemberPromote'),worker.indexOf('async function handleAdminActivityConfirm'));
ok('promotion_commit_does_not_recheck_current_specs',!promoteBlock.includes('industry_level>=')&&!promoteBlock.includes('vehicle1_power_normalized>='));
ok('rank_mutations_use_transactional_batch',promoteBlock.includes('env.DB.batch([update,history,reset])')&&worker.includes("env.DB.batch([update,history,reset])"));
ok('new_rank_history_member_api',worker.includes('GET /api/member/rank-history')&&worker.includes('async function handleMemberRankHistory'));
ok('member_history_excludes_private_snapshot',/SELECT id,event_type,from_rank,to_rank,reason_code,public_note,decision_source,rule_snapshot,spec_snapshot,cycle_snapshot,public_activity_snapshot,snapshot_quality,created_at FROM member_rank_history_events/.test(worker));
ok('legacy_member_rank_changes_no_new_writes',!worker.includes('INSERT INTO member_rank_changes'));

ok('my_page_permanent_qualification_ui',myHtml.includes('promotionQualificationV440')&&my.includes('promotionQualificationBodyV440'));
ok('my_page_fixed_cycle_meta',myHtml.includes('promotionCycleMetaV440')&&myHtml.includes('maintenanceCycleMetaV440'));
ok('my_page_rank_history_ui',myHtml.includes('rankHistoryCardV440')&&my.includes("'/api/member/rank-history?limit=100'"));
ok('my_page_kst_d_day',my.includes('function kstDayDiff')&&my.includes("timeZone:'Asia/Seoul'"));
ok('my_page_14_languages_lifecycle', ['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id'].every(x=>my.includes(x==='zh-tw'?"'zh-tw':":`${x}:`)));
ok('admin_reentry_status',admin.includes("WAIT_REENTRY")&&admin.includes('재승급 대기'));
ok('admin_history_new_event_types',admin.includes('MANUAL_ADJUSTMENT')&&admin.includes('CORRECTION')&&admin.includes('RESTORE'));
ok('admin_fixed_maintenance_copy',admin.includes('현재 30일 등급 유지 주기 조건을 충족했습니다.'));

if(failures.length){console.error(`v440 rank lifecycle smoke FAILED (${failures.length})`);for(const f of failures)console.error(`- ${f}`);process.exit(1)}
console.log('v440 rank lifecycle smoke PASS');
