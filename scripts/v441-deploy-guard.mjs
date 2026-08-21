import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const failures=[];
const fail=s=>failures.push(s);
const read=(...p)=>fs.readFileSync(path.join(root,...p),'utf8');
const must=(t,v,l)=>{if(!t.includes(v))fail(`${l}: missing ${v}`)};
const LANGS=['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id'];

const pkg=JSON.parse(read('package.json'));
const lock=JSON.parse(read('package-lock.json'));
if(pkg.version!=='4.4.1')fail(`package version ${pkg.version}`);
if(lock.version!=='4.4.1'||lock.packages?.['']?.version!=='4.4.1')fail('package-lock root version not 4.4.1');
if(pkg.scripts?.predeploy!=='node scripts/v441-deploy-guard.mjs')fail('predeploy not v441 guard');
if(pkg.scripts?.['migrate:ezpk2:list']||pkg.scripts?.['migrate:ezpk2:remote'])fail('package scripts must not operate EZPK2 D1');

// Preserve v439 single-alliance / migration intake authority.
const config=read('wrangler.jsonc');
for(const token of ['"SITE_MODE": "SINGLE"','"EZPK2_STATUS": "ARCHIVED"','"EZPK1_MIGRATION_INTAKE": "ENABLED"','"EZPK2_MIGRATION_INTAKE": "DISABLED"','"database_name": "ezpk-members"','"database_id": "aaa29a3a-a221-47e3-a30f-9b4c624dcb56"','"pattern": "ezpk322.com"','"pattern": "ezpk1.ezpk322.com"','"pattern": "ezpk2.ezpk322.com"'])must(config,token,'single-alliance config');
if(config.includes('"binding": "EZPK2_DB"')||config.includes('"database_name": "ezpk2-members"')||config.includes('7203fea0-0dd3-4332-9c11-44273355a4bb'))fail('production config must not bind EZPK2 D1');
const worker=read('worker.js');
for(const token of ['const DEFAULT_SITE_MODE = "SINGLE";','const DEFAULT_EZPK2_STATUS = "ARCHIVED";','const DEFAULT_EZPK1_MIGRATION_INTAKE = true;','return jsonError("ALLIANCE_ARCHIVED", 410','peerDb: null'])must(worker,token,'single-alliance worker');
if(worker.includes('NICKNAME_TAKEN_OTHER_ALLIANCE')||worker.includes('peerNicknameDuplicate')||worker.includes('env.EZPK2_DB'))fail('cross-alliance backend code reintroduced');
const home=read('index.html'),entry=read('shared-migration-entry.js'),homeAuth=read('home-v319.js');
if(home.indexOf('id="homeMigrationEntry"')<0||home.indexOf('id="homeMigrationEntry"')>home.indexOf('class="home-member-content"'))fail('guest migration block order regressed');
for(const token of ["status:'MIGRATION OPEN'","button:'APPLY FOR MIGRATION'","status:'이민 모집 중'","button:'이민 신청하기'"])must(entry,token,'open migration entry');
must(homeAuth,"document.querySelectorAll('[data-home-migration]').forEach(function (element) { element.hidden = !anonymous; });",'signed-in migration hide');
for(const key of ['migration:cycle:verify','migration:cycle:reset'])if(!pkg.scripts?.[key])fail(`migration-cycle tool missing ${key}`);

// Migration lineage.
const migrationFiles=fs.readdirSync(path.join(root,'migrations')).filter(f=>f.endsWith('.sql')).sort();
if(migrationFiles.length!==32)fail(`migration count ${migrationFiles.length}, expected 32`);
if(migrationFiles.at(-1)!=='0033_v440_rank_lifecycle_integrity.sql')fail(`latest migration ${migrationFiles.at(-1)||'none'}`);
const migration=read('migrations','0033_v440_rank_lifecycle_integrity.sql');
for(const token of [
 'ADD COLUMN promotion_reentry_required INTEGER NOT NULL DEFAULT 0',
 'ADD COLUMN promotion_reentry_started_on TEXT',
 'CREATE TABLE IF NOT EXISTS member_rank_spec_qualifications',
 'UNIQUE(member_id,target_rank)',
 'CREATE TABLE IF NOT EXISTS member_rank_history_events',
 "event_type TEXT NOT NULL CHECK(event_type IN (",
 "'PROMOTION','DEMOTION','MANUAL_ADJUSTMENT','CORRECTION','RESTORE'",
 'public_activity_snapshot TEXT',
 'private_audit_snapshot TEXT',
 "'LEGACY_V435_PERSISTED'",
 "'BASELINE_CURRENT_SPEC'",
 "promotion_reentry_required=CASE WHEN promotion_unlock_after_maintenance=1 THEN 1 ELSE promotion_reentry_required END",
 'maintenance_cycle_started_on=NULL',
 "'LEGACY_PARTIAL'",
 "VALUES('member_db_schema_version','5.5-v440'"
])must(migration,token,'v440 migration');
const qualificationDef=migration.slice(migration.indexOf('CREATE TABLE IF NOT EXISTS member_rank_spec_qualifications'),migration.indexOf('CREATE INDEX IF NOT EXISTS idx_rank_spec_qualification_target'));
if(qualificationDef.includes('REFERENCES members')||qualificationDef.includes('ON DELETE CASCADE'))fail('permanent qualification must survive member deletion');
const historyDef=migration.slice(migration.indexOf('CREATE TABLE IF NOT EXISTS member_rank_history_events'),migration.indexOf('CREATE INDEX IF NOT EXISTS idx_rank_history_member_created'));
if(historyDef.includes('REFERENCES members')||historyDef.includes('ON DELETE CASCADE'))fail('immutable history must not cascade with member deletion');

// v440 lifecycle backend.
for(const token of [
 "if(!['R2','R3'].includes(row?.member_rank))return null;",
 'return memberActivityStatusBetween(db,memberId,startOn,today,includePrivate);',
 'async function ensureRankSpecQualification',
 'member_rank_spec_qualifications',
 "row.member_rank==='R1'&&Number(state.promotion_reentry_required||0)===1",
 'let holdRecovery=null;',
 'cycleActivity,failedCycleActivity,recoveryActivity',
 "status==='REVIEWABLE'&&!recoveryActivity.eligible",
 'GET /api/member/rank-history',
 'async function handleMemberRankHistory',
 'member_rank_history_events',
 "reasonCode:'PROMOTION_REQUIREMENTS_MET'",
 "reasonCode:'MAINTENANCE_ACTIVITY_FAILED'",
 'env.DB.batch([update,history,reset])'
])must(worker,token,'v440 lifecycle worker');
if(worker.includes('INSERT INTO member_rank_changes'))fail('v440 runtime must not write legacy member_rank_changes');
const promote=worker.slice(worker.indexOf('async function handleAdminMemberPromote'),worker.indexOf('async function handleAdminActivityConfirm'));
for(const token of ['EXISTS(SELECT 1 FROM member_rank_spec_qualifications q',"rr.promotion_status='REVIEWABLE'",'env.DB.batch([update,history,reset])'])must(promote,token,'promotion commit authority');
if(promote.includes('industry_level>=')||promote.includes('vehicle1_power_normalized>='))fail('promotion commit must not recheck current specs');
const memberHistorySelect='SELECT id,event_type,from_rank,to_rank,reason_code,public_note,decision_source,rule_snapshot,spec_snapshot,cycle_snapshot,public_activity_snapshot,snapshot_quality,created_at FROM member_rank_history_events';
must(worker,memberHistorySelect,'public history projection');

// My Page v440 UI.
const myHtml=read('my','index.html'),my=read('my','my.js'),myCss=read('my','my.css');
for(const token of ['my.css?v=4410','my.js?v=4400','rankHistoryCardV440','promotionQualificationV440','promotionCycleMetaV440','maintenanceCycleMetaV440','maintenanceRecoveryV440'])must(myHtml,token,'v440 My Page HTML/cache');
for(const token of ['function kstDayDiff','function renderRankHistory','/api/member/rank-history?limit=100','promotionActivitySource','holdRecovery','state.recoveryActivity','newMemberProtect'])must(my,token,'v440 My Page behavior');
for(const token of ['.rank-cycle-meta','.rank-qualification-banner','.maintenance-recovery','.rank-history-card','.rank-history-event'])must(myCss,token,'v440 My Page CSS');
for(const token of [
 '.promotion-condition-values>span:first-child small{color:#93c5fd}',
 '.promotion-condition-values>span:first-child strong.progress,',
 '.promotion-condition-values>span:first-child strong.failed{color:#93c5fd}',
 '.promotion-condition-values>span:first-child strong.passed,',
 '.promotion-condition.is-complete .promotion-condition-values>span:first-child small{color:#4ade80}',
 '.promotion-condition-values>span:last-child small,',
 '.promotion-condition-values>span:last-child .required-value{color:#fcd34d}'
])must(myCss,token,'v441 promotion spec colors');

for(const code of LANGS){const token=code==='zh-tw'?"'zh-tw':":`${code}:`;must(my,token,`v440 My Page locale ${code}`)}

// Admin v440 UI and R1 exclusion.
const adminHtml=read('admin','index.html'),admin=read('admin','member-manager-v188.js');
for(const token of ['member-manager-v188.css?v=4400','member-manager-v188.js?v=4400','등급 변경 이력'])must(adminHtml,token,'v440 Admin HTML/cache');
for(const token of ['WAIT_REENTRY','재승급 대기','MANUAL_ADJUSTMENT','CORRECTION','RESTORE','현재 30일 등급 유지 주기 조건을 충족했습니다.'])must(admin,token,'v440 Admin lifecycle/history');
must(worker,"m.member_rank IN ('R2','R3') AND m.status='active'",'demotion candidates exclude R1');

// Broad HTML/i18n structural regression guard.
const pages=[];
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','.wrangler','.git'].includes(e.name))continue;const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(e.isFile()&&e.name==='index.html')pages.push(f)}}
walk(root);
if(pages.length!==27)fail(`index pages expected 27 got ${pages.length}`);
const userPages=pages.filter(f=>!['admin/index.html','dev/index.html'].includes(path.relative(root,f).replaceAll('\\','/')));
if(userPages.length!==25)fail(`user pages expected 25 got ${userPages.length}`);
for(const f of userPages){const t=fs.readFileSync(f,'utf8'),rel=path.relative(root,f);if(!t.includes('/i18n-v414.js?v=4170'))fail(`i18n cache missing ${rel}`)}

if(failures.length){console.error(`EZPK v441 deployment preflight FAILED (${failures.length})`);for(const f of failures)console.error('- '+f);process.exit(1)}
console.log('EZPK v441 deployment preflight PASS: v440 Rank Lifecycle Integrity & History is preserved; promotion spec current/required color clarity is enforced; no new D1 migration is introduced.');
