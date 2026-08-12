import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const failures=[];
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),'utf8');
const must=(text,value,label)=>{if(!text.includes(value))failures.push(`${label}: ${value}`)};

const pkg=JSON.parse(read('package.json'));
if(pkg.version!=='4.1.2')failures.push(`package version must be 4.1.2, got ${pkg.version}`);
if(pkg.scripts?.predeploy!=='node scripts/v412-deploy-guard.mjs')failures.push('predeploy must use v411 guard');
const lock=JSON.parse(read('package-lock.json'));
if(lock.version!=='4.1.2'||lock.packages?.['']?.version!=='4.1.2')failures.push('package-lock root version must be 4.1.2');

const config=read('wrangler.jsonc');
for(const value of [
  '"SITE_MODE": "DUAL"','"EZPK2_STATUS": "ACTIVE"',
  '"EZPK1_MIGRATION_INTAKE": "ENABLED"','"EZPK2_MIGRATION_INTAKE": "DISABLED"',
  '"run_worker_first": true','"binding": "DB"','"database_name": "ezpk-members"',
  '"database_id": "aaa29a3a-a221-47e3-a30f-9b4c624dcb56"','"binding": "EZPK2_DB"',
  '"database_name": "ezpk2-members"','"database_id": "7203fea0-0dd3-4332-9c11-44273355a4bb"',
  '"pattern": "ezpk322.com"','"pattern": "ezpk1.ezpk322.com"','"pattern": "ezpk2.ezpk322.com"'
]) must(config,value,'missing production config');

const htmlFiles=[];
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(['node_modules','.wrangler','.git'].includes(entry.name))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())walk(full);
    else if(entry.isFile()&&entry.name==='index.html')htmlFiles.push(full);
  }
}
walk(root);
if(htmlFiles.length!==27)failures.push(`expected 27 index.html pages, found ${htmlFiles.length}`);
for(const file of htmlFiles){
  const text=fs.readFileSync(file,'utf8');
  const rel=path.relative(root,file);
  must(text,'data-ezpk-theme-bootstrap',`missing theme bootstrap ${rel}`);
  must(text,'/ezpk-theme.css?v=4070',`missing preserved v407 theme stylesheet ${rel}`);
}
const sharedHeaderPages=htmlFiles.filter(file=>fs.readFileSync(file,'utf8').includes('shared-header.js?v='));
if(sharedHeaderPages.length!==24)failures.push(`expected 24 shared-header pages, found ${sharedHeaderPages.length}`);
for(const file of sharedHeaderPages){
  const text=fs.readFileSync(file,'utf8');
  if(!text.includes('shared-header.js?v=4080'))failures.push(`shared-header cache must preserve v4080: ${path.relative(root,file)}`);
}

const rootHtml=read('index.html');
if(rootHtml.includes('id="immigration"')||rootHtml.includes('class="immigration-section"'))failures.push('EZPK1 home still exposes the former migration entry section');

const gateway=read('gateway','index.html');
must(gateway,'data-theme-context="gateway"','gateway neutral context missing');
must(gateway,'/gateway/gateway.css?v=4120','gateway CSS cache missing');
must(gateway,'/shared-migration-entry.js?v=4100','gateway shared migration component cache missing');
must(gateway,'/gateway/gateway.js?v=4100','gateway JS cache missing');
must(gateway,'id="gatewayMigrationEntry"','gateway migration entry missing');
must(gateway,'href="https://ezpk1.ezpk322.com/migration/"','gateway migration target must be EZPK1');
const migrationPos=gateway.indexOf('id="gatewayMigrationEntry"');
const headingPos=gateway.indexOf('class="gateway-heading"');
const gridPos=gateway.indexOf('class="gateway-grid"');
if(!(migrationPos>=0&&headingPos>migrationPos&&gridPos>headingPos))failures.push('gateway order must be migration entry -> Choose Your Alliance -> alliance grid');

const gatewayCss=read('gateway','gateway.css');
for(const value of [
  'margin:0 auto 26px;padding:0;text-align:center','margin:10px auto 0','.gateway-grid{display:grid;width:100%;padding:0',
  '.gateway-migration-section{width:100%;padding:0 0 100px',
  'width:100%;max-width:none;box-sizing:border-box;padding:34px 40px',
  'font-size:clamp(30px,3vw,42px)',
  'margin:0 0 18px;color:#aeb8c7;font-size:16px;line-height:1.6;white-space:pre-line',
  '.gateway-migration-section .immigration-button{min-height:46px}',
  '.gateway-migration-section .immigration-process{margin-top:18px;padding-top:14px;font-size:13px}',
  'min-height:278px','padding:34px 0 48px','min-height:220px',
  '@media(max-width:760px)',
  '.gateway-migration-section{padding:0 0 100px}',
  '.gateway-heading{margin-bottom:22px}',
  '.gateway-heading p{margin-top:12px',
  '.gateway-grid{grid-template-columns:1fr;gap:12px}'
]) must(gatewayCss,value,'gateway v411 spacing contract missing');

const gatewayJs=read('gateway','gateway.js');
must(gatewayJs,"ko:{title:'연맹 선택'",'Gateway Korean heading must be 연맹 선택');
if(gatewayJs.includes("ko:{title:'연맹을 선택해 주세요'"))failures.push('obsolete Korean Gateway heading remains');

const devHtml=read('dev','index.html');
for(const value of [
  'id="devSiteLabel"','id="joinCodeSection"','id="joinCodeForm"','id="joinCodeConfirmDialog"',
  'minlength="6" maxlength="32"','dev.css?v=4100','dev.js?v=4100'
]) must(devHtml,value,'DEV join-code management UI missing');
if(devHtml.includes('value="00322"'))failures.push('DEV must not expose a plaintext default alliance join code');

const devJs=read('dev','dev.js');
for(const value of [
  "api('/api/dev/alliance-join-code')",
  "jsonPost('/api/dev/alliance-join-code', data, 'PUT')",
  "member?.adminLevel === 'super'",
  '/^[A-Za-z0-9_-]{6,32}$/'
]) must(devJs,value,'DEV join-code client contract missing');

const sharedMigration=read('shared-migration-entry.js');
for(const value of [
  "body:'322서버에서 새로운 시작을 준비해보세요.\\n신청서를 검토한 후 운영진이 개별적으로 안내드립니다.'",
  "body:'Prepare for a new beginning in State #322.\\nOur leadership team will review your application and contact you individually.'",
  "link.href='https://ezpk1.ezpk322.com/migration/'"
]) must(sharedMigration,value,'shared Gateway migration copy/target missing');
for(const forbidden of ['322 서버에서 EZPK와 함께 새로운 시즌을 준비하세요.','Prepare for a new season with EZPK in State #322.']){
  if(sharedMigration.includes(forbidden))failures.push(`obsolete EZPK-centric migration copy remains: ${forbidden}`);
}

const migrationHtml=read('migration','index.html');
for(const value of ['shared-header.js?v=4080','migration.css?v=4080','migration.js?v=4080','id="migrationDisabled"','id="migrationDisabledStatusArea"','id="migrationEzpk2Link"']) must(migrationHtml,value,'preserved v408 migration HTML contract missing');
if(!/id="migrationEzpk2Link"[^>]*hidden[^>]*aria-hidden="true"/.test(migrationHtml))failures.push('EZPK2 migration CTA link must remain hidden');
const migrationJs=read('migration','migration.js');
for(const value of [
  "heroTitle:'이민 신청'","eligibilityKicker:'MEMBERSHIP'","eligibilityTitle:'EZPK1 연맹 가입 조건'",
  "eligibilityBody:'원활한 연맹 운영을 위해 아래 가입 기준을 적용하고 있습니다.'",
  "ezpk2CtaBody:'보다 자유로운 플레이를 원하시거나 EZPK1 가입 기준에 해당하지 않는 경우 EZPK2로 가입하실 수 있습니다.'",
  "let migrationIntakeEnabled=currentSiteId!=='ezpk2'","fetch('/api/site-context'","ezpk2Link.hidden=true"
]) must(migrationJs,value,'preserved EZPK1/EZPK2 migration intake contract missing');

const header=read('shared-header.js');
for(const value of ['function migrationIntakeAvailable()','migrationIntakeEnabled','const migrationKeys = !authenticatedAccount && migrationIntakeAvailable()']) must(header,value,'shared-header migration gate missing');
const worker=read('worker.js');
for(const value of [
  'const DEFAULT_EZPK1_MIGRATION_INTAKE = true;','const DEFAULT_EZPK2_MIGRATION_INTAKE = false;',
  'function migrationIntakeEnabled(env, siteId = "ezpk1")','migrationIntakeEnabled: migrationIntakeEnabled(env, siteId)','MIGRATION_INTAKE_DISABLED'
]) must(worker,value,'worker migration gate missing');
if((worker.match(/MIGRATION_INTAKE_DISABLED/g)||[]).length<2)failures.push('server-side migration intake gate must remain on public create and admin import commit');

for(const value of [
  'case "GET /api/dev/alliance-join-code"',
  'case "PUT /api/dev/alliance-join-code"',
  'async function handleAllianceJoinCodeGet',
  'async function handleAllianceJoinCodeUpdate',
  'ALLIANCE_JOIN_CODE_PATTERN = /^[A-Za-z0-9_-]{6,32}$/',
  'ALLIANCE_JOIN_CODE_RATE_LIMIT_PER_MINUTE = 5',
  'alliance_join_code_updated',
  'previousCodeInvalidatedImmediately: true',
  'sensitiveSettingsRedacted: true'
]) must(worker,value,'v410 join-code/security worker contract missing');
if(worker.includes('SELECT key, value FROM settings ORDER BY key'))failures.push('/api/db-test still exposes settings values');

const migrations=fs.readdirSync(path.join(root,'migrations')).filter(n=>n.endsWith('.sql')).sort();
if(migrations.length!==30)failures.push(`expected 30 migrations through 0031, found ${migrations.length}`);
if(migrations.at(-1)!=='0031_v405_migration_inquiry_soft_delete.sql')failures.push(`unexpected latest migration: ${migrations.at(-1)}`);

if(failures.length){
  console.error('EZPK v412 deployment preflight FAILED.');
  for(const f of failures)console.error(`- ${f}`);
  process.exit(1);
}
console.log('EZPK v412 deployment preflight PASS: Gateway desktop rhythm is migration-to-heading 100px, title-to-description 10px, description-to-grid 26px; mobile rhythm is migration-to-heading 100px, title-to-description 12px, description-to-grid 22px, card gap 12px; corrected width alignment and v410 security/join-code contracts are preserved; the 30-migration DB baseline is unchanged.');
