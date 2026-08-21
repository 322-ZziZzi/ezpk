import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const read=(...p)=>fs.readFileSync(path.join(root,...p),'utf8');
const failures=[];
const fail=m=>failures.push(m);
const must=(text,token,label)=>{if(!text.includes(token))fail(`${label}: missing ${token}`)};
const pkg=JSON.parse(read('package.json')),lock=JSON.parse(read('package-lock.json'));
if(pkg.version!=='4.4.2')fail('package version not 4.4.2');
if(lock.version!=='4.4.2'||lock.packages?.['']?.version!=='4.4.2')fail('package-lock root version not 4.4.2');
if(pkg.scripts?.predeploy!=='node scripts/v442-deploy-guard.mjs')fail('predeploy not v442 guard');

const config=read('wrangler.jsonc');
for(const token of ['"SITE_MODE": "SINGLE"','"EZPK2_STATUS": "ARCHIVED"','"EZPK1_MIGRATION_INTAKE": "ENABLED"','"EZPK2_MIGRATION_INTAKE": "DISABLED"','"database_name": "ezpk-members"'])must(config,token,'single-alliance config');
if(config.includes('"binding": "EZPK2_DB"')||config.includes('"database_name": "ezpk2-members"'))fail('EZPK2 D1 binding reintroduced');

const worker=read('worker.js');
for(const token of [
 "if(!['R2','R3'].includes(row?.member_rank))return null;",
 'return memberActivityStatusBetween(db,memberId,startOn,today,includePrivate);',
 'async function ensureRankSpecQualification',
 'member_rank_spec_qualifications',
 "row.member_rank==='R1'&&Number(state.promotion_reentry_required||0)===1",
 'cycleActivity,failedCycleActivity,recoveryActivity',
 "rr.promotion_status='REVIEWABLE'",
 'member_rank_history_events',
 'async function memberRankLatestChange',
 'latestRankChange:await memberRankLatestChange',
 'member_rank_notice_states',
 'INSERT OR IGNORE INTO member_rank_notice_states(member_id,history_event_id,dismissed_at)'
])must(worker,token,'v442 worker');
if(worker.includes('case "GET /api/member/rank-history"'))fail('member full rank-history route must be retired');
if(worker.includes('rankHistoryRecent:await memberRankHistoryList'))fail('member/me must not return rankHistoryRecent');
if(worker.includes('UPDATE member_rank_history_events SET dismissed_at'))fail('immutable history must not be updated for notice dismissal');
if(worker.includes('INSERT INTO member_rank_changes'))fail('legacy rank-change writes reintroduced');
for(const token of ['async function handleAdminRankChangeHistory','SELECT * FROM member_rank_history_events ORDER BY created_at DESC,id DESC LIMIT ?'])must(worker,token,'admin full history');

const migrations=fs.readdirSync(path.join(root,'migrations')).filter(x=>x.endsWith('.sql')).sort();
if(migrations.length!==33)fail(`migration count ${migrations.length}, expected 33`);
if(migrations.at(-1)!=='0034_v442_rank_notice_state.sql')fail(`latest migration ${migrations.at(-1)||'none'}`);
const m33=read('migrations','0033_v440_rank_lifecycle_integrity.sql'),m34=read('migrations','0034_v442_rank_notice_state.sql');
for(const token of ['CREATE TABLE IF NOT EXISTS member_rank_spec_qualifications','CREATE TABLE IF NOT EXISTS member_rank_history_events',"VALUES('member_db_schema_version','5.5-v440'"])must(m33,token,'v440 lineage');
for(const token of ['CREATE TABLE IF NOT EXISTS member_rank_notice_states','PRIMARY KEY(member_id,history_event_id)','FROM member_rank_history_events','WHERE dismissed_at IS NOT NULL',"VALUES('member_db_schema_version','5.6-v442'"])must(m34,token,'v442 migration');
if(/UPDATE\s+member_rank_history_events/i.test(m34))fail('v442 migration must not mutate history rows');

const html=read('my','index.html'),my=read('my','my.js'),css=read('my','my.css');
for(const token of ['my.css?v=4420','my.js?v=4420','profile-rank-overview-v442','profileRankLatestV442','profileRankManagementV442','promotionDetailsV442','maintenanceDetailsV442'])must(html,token,'v442 My Page HTML');
if(html.includes('rankHistoryCardV440')||html.includes('rankHistoryMoreV440')||html.includes('rankHistoryRecentV440')||html.includes('rankHistoryAllV440'))fail('member full rank-history UI remains');
if(!html.includes('<article class="accordion-item is-open" data-section="profile">'))fail('Basic Profile is not default-open in HTML');
for(const token of ['PROFILE_RANK_LABELS','renderProfileRankOverview(memberData.latestRankChange)','const initialSection = requestedSection === "specs" ? "specs" : "profile"','profileRankManagementV442'])must(my,token,'v442 My Page JS');
if(my.includes('/api/member/rank-history')||my.includes('function renderRankHistory')||my.includes('toggleRankHistory'))fail('member full rank-history behavior remains');
for(const code of ['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id']){const token=code==='zh-tw'?"'zh-tw':":`${code}:`;must(my,token,`locale ${code}`)}
for(const token of ['.profile-rank-overview-v442','.profile-rank-management-v442','.rank-management-subcard-v442','.rank-management-details-v442','.promotion-condition-values>span:first-child small{color:#93c5fd}','color:#4ade80','.promotion-condition-values>span:last-child .required-value{color:#fcd34d}'])must(css,token,'v442 My Page CSS');

const adminHtml=read('admin','index.html'),admin=read('admin','member-manager-v188.js');
for(const token of ['등급 변경 이력','MANUAL_ADJUSTMENT','CORRECTION','RESTORE']){if(!(adminHtml+admin).includes(token))fail(`admin history regression: ${token}`)}

if(failures.length){console.error(`EZPK v442 deployment preflight FAILED (${failures.length})`);for(const f of failures)console.error('- '+f);process.exit(1)}
console.log('EZPK v442 deployment preflight PASS: Basic Profile rank management is consolidated, member full history is retired, immutable history notice-state is separated, v441 colors and v440 lifecycle rules are preserved.');
