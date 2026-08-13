import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const failures=[];
const read=(...parts)=>fs.readFileSync(path.join(root,...parts),'utf8');
const must=(text,value,label)=>{if(!text.includes(value))failures.push(`${label}: ${value}`)};
const LANGS=['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id'];

const pkg=JSON.parse(read('package.json'));
if(pkg.version!=='4.1.3')failures.push(`package version must be 4.1.3, got ${pkg.version}`);
if(pkg.scripts?.predeploy!=='node scripts/v413-deploy-guard.mjs')failures.push('predeploy must use v413 guard');
const lock=JSON.parse(read('package-lock.json'));
if(lock.version!=='4.1.3'||lock.packages?.['']?.version!=='4.1.3')failures.push('package-lock root version must be 4.1.3');

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
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  if(['node_modules','.wrangler','.git'].includes(entry.name))continue;
  const full=path.join(dir,entry.name);
  if(entry.isDirectory())walk(full); else if(entry.isFile()&&entry.name==='index.html')htmlFiles.push(full);
}}
walk(root);
if(htmlFiles.length!==27)failures.push(`expected 27 index.html pages, found ${htmlFiles.length}`);
for(const file of htmlFiles){const text=fs.readFileSync(file,'utf8');const rel=path.relative(root,file);must(text,'data-ezpk-theme-bootstrap',`missing theme bootstrap ${rel}`);must(text,'/ezpk-theme.css?v=4070',`missing preserved theme stylesheet ${rel}`);}
const sharedHeaderPages=htmlFiles.filter(file=>fs.readFileSync(file,'utf8').includes('shared-header.js?v='));
if(sharedHeaderPages.length!==24)failures.push(`expected 24 shared-header pages, found ${sharedHeaderPages.length}`);
for(const file of sharedHeaderPages){const text=fs.readFileSync(file,'utf8');if(!text.includes('shared-header.js?v=4130'))failures.push(`shared-header cache must be v4130: ${path.relative(root,file)}`);}

const header=read('shared-header.js');
for(const code of LANGS) must(header,`data-l="${code}"`,`shared language selector missing ${code}`);
for(const value of [
  "const USER_LANGUAGE_KEY='ezpk-lang-user-v6'","const AUTO_LANGUAGE_KEY='ezpk-lang-auto-v6'","const LANGUAGE_COOKIE='ezpk_lang'",
  'navigator.languages','Domain=.ezpk322.com','SameSite=Lax','function normalizeLocaleCandidate','function detectBrowserLanguage()',
  "if (raw==='zh'||raw==='zh-cn'||raw.startsWith('zh-hans')) return '';", "document.documentElement.dir=lang==='ar'?'rtl':'ltr'",
  "const SUPPORTED_LANGS=Object.freeze(['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id'])"
]) must(header,value,'shared i18n resolver contract missing');
if(!header.includes("else if (!isAdminContext)"))failures.push('admin context must not overwrite public auto-language storage');

const rootHtml=read('index.html');
if(rootHtml.includes('id="immigration"')||rootHtml.includes('class="immigration-section"'))failures.push('EZPK1 home still exposes former migration entry section');

const gateway=read('gateway','index.html');
for(const value of ['/gateway/gateway.css?v=4130','/shared-migration-entry.js?v=4130','/gateway/gateway.js?v=4130','id="gatewayMigrationEntry"','id="gatewayAllianceCards"','class="gateway-mobile-tabs"','href="https://ezpk1.ezpk322.com/migration/"']) must(gateway,value,'gateway v413 HTML contract missing');
for(const code of LANGS) must(gateway,`data-lang="${code}"`,`gateway language selector missing ${code}`);
const migrationPos=gateway.indexOf('id="gatewayMigrationEntry"'), headingPos=gateway.indexOf('class="gateway-heading"'), gridPos=gateway.indexOf('id="gatewayAllianceCards"');
if(!(migrationPos>=0&&headingPos>migrationPos&&gridPos>headingPos))failures.push('gateway order must remain migration -> heading -> alliance cards');

const gatewayCss=read('gateway','gateway.css');
for(const value of [
  '.gateway-migration-section{width:100%;padding:0 0 100px',
  '.gateway-heading{width:min(760px,100%);margin:0 auto 26px;padding:0',
  '.gateway-heading p{width:min(680px,100%);margin:10px auto 0',
  '.gateway-grid{display:grid;width:100%;padding:0',
  '.gateway-migration-section{padding:0 0 80px}',
  '.gateway-heading{margin-bottom:22px}', '.gateway-heading p{margin-top:12px', '.gateway-grid{grid-template-columns:1fr;gap:12px}',
  '.gateway-mobile-tabs{display:none}', 'position:sticky;top:68px', '#gatewayMigrationEntry,#gatewayAllianceCards{scroll-margin-top:142px}',
  '@media(prefers-reduced-motion:reduce)'
]) must(gatewayCss,value,'gateway responsive spacing/nav contract missing');

const gatewayJs=read('gateway','gateway.js');
for(const value of [
  "const SUPPORTED=['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id']",
  "ko:{title:'연맹 선택'", 'navigator.languages', "$('#gatewayMigrationEntry')", "$('#gatewayAllianceCards')", 'scrollIntoView', "behavior:reduced()?'auto':'smooth'"
]) must(gatewayJs,value,'gateway JS/i18n contract missing');
if(gatewayJs.includes('location.hash=')||gatewayJs.includes('history.pushState'))failures.push('mobile section tabs must not mutate URL/history');

const sharedMigration=read('shared-migration-entry.js');
for(const code of LANGS){const token=code==='zh-tw'?"'zh-tw':":`${code}:`;must(sharedMigration,token,`shared migration copy missing language ${code}`);}
for(const value of [
  "body:'322서버에서 새로운 시작을 준비해보세요.\\n신청서를 검토한 후 운영진이 개별적으로 안내드립니다.'",
  "link.href='https://ezpk1.ezpk322.com/migration/'"
]) must(sharedMigration,value,'shared migration copy/target missing');

const migrationHtml=read('migration','index.html');
for(const value of ['shared-header.js?v=4130','migration.css?v=4080','migration.js?v=4130','id="migrationDisabled"','id="migrationDisabledStatusArea"','id="migrationEzpk2Link"']) must(migrationHtml,value,'migration HTML contract missing');
const migrationJs=read('migration','migration.js');
for(const value of [
  "const LANGS=['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id']",
  "heroTitle:'이민 신청'","eligibilityTitle:'EZPK1 연맹 가입 조건'","let migrationIntakeEnabled=currentSiteId!=='ezpk2'"
]) must(migrationJs,value,'migration i18n/intake contract missing');
for(const code of ['fr','de','es','tr','it','id']) if(!migrationJs.includes(`${code}:{`))failures.push(`migration native dictionary missing ${code}`);

const dataJs=read('data.js');
for(const code of LANGS) if(!dataJs.includes(`"${code}":`))failures.push(`data.js top-level language missing ${code}`);

const inactive=read('inactive','inactive.js');
for(const value of ["const SUPPORTED=['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id']",'navigator.languages',"if(raw==='zh'||raw==='zh-cn'||raw.startsWith('zh-hans'))return''"]) must(inactive,value,'inactive 14-language/browser resolver missing');
for(const code of LANGS){const token=code==='zh-tw'?"'zh-tw':":`${code}:`;must(inactive,token,`inactive language missing ${code}`);}
if(!read('inactive','index.html').includes('inactive.js?v=4130'))failures.push('inactive cache must be v4130');

for(const [file,needle] of [
  ['alliance-layout/alliance-layout.js',"const SUPPORTED=['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id']"],
  ['capital-war/capital-war.js',"const LANGS=['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id']"],
  ['my/my.js','const LANGS = ["en","fr","de","ko","th","ja","pt","es","tr","zh-tw","it","ar","vi","id"]'],
  ['signup/signup.js','const SUPPORTED = ["en","fr","de","ko","th","ja","pt","es","tr","zh-tw","it","ar","vi","id"]']
]) must(read(...file.split('/')),needle,`page-local 14-language allowlist missing ${file}`);

const worker=read('worker.js');
for(const value of [
  'const DEFAULT_EZPK1_MIGRATION_INTAKE = true;','const DEFAULT_EZPK2_MIGRATION_INTAKE = false;',
  'MIGRATION_INTAKE_DISABLED','case "GET /api/dev/alliance-join-code"','case "PUT /api/dev/alliance-join-code"',
  'ALLIANCE_JOIN_CODE_PATTERN = /^[A-Za-z0-9_-]{6,32}$/','ALLIANCE_JOIN_CODE_RATE_LIMIT_PER_MINUTE = 5','alliance_join_code_updated','sensitiveSettingsRedacted: true'
]) must(worker,value,'preserved worker security/intake contract missing');
if(worker.includes('SELECT key, value FROM settings ORDER BY key'))failures.push('/api/db-test still exposes settings values');

const migrations=fs.readdirSync(path.join(root,'migrations')).filter(n=>n.endsWith('.sql')).sort();
if(migrations.length!==30)failures.push(`expected 30 migrations through 0031, found ${migrations.length}`);
if(migrations.at(-1)!=='0031_v405_migration_inquiry_soft_delete.sql')failures.push(`unexpected latest migration: ${migrations.at(-1)}`);

if(failures.length){console.error('EZPK v413 deployment preflight FAILED.');for(const f of failures)console.error(`- ${f}`);process.exit(1);}
console.log('EZPK v413 deployment preflight PASS: desktop Gateway 100/10/26, mobile Gateway 80/12/22/12 with sticky section tabs, 14-language shared/browser resolver coverage, preserved migration-intake and DEV security contracts, and unchanged 30-migration DB baseline.');
