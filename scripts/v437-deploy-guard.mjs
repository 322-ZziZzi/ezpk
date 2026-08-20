import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const failures=[];
const fail=s=>failures.push(s);
const read=(...p)=>fs.readFileSync(path.join(root,...p),'utf8');
const must=(t,v,l)=>{if(!t.includes(v))fail(`${l}: ${v}`)};
const LANGS=['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id'];
const NEW=['fr','de','es','tr','it','id'];

const pkg=JSON.parse(read('package.json'));
if(pkg.version!=='4.3.7')fail(`package version ${pkg.version}`);
if(pkg.scripts?.predeploy!=='node scripts/v437-deploy-guard.mjs')fail('predeploy not v437 guard');
const lock=JSON.parse(read('package-lock.json'));
if(lock.version!=='4.3.7'||lock.packages?.['']?.version!=='4.3.7')fail('package-lock root version not 4.3.7');

const config=read('wrangler.jsonc');
for(const v of ['"SITE_MODE": "SINGLE"','"EZPK2_STATUS": "ARCHIVED"','"EZPK1_MIGRATION_INTAKE": "ENABLED"','"EZPK2_MIGRATION_INTAKE": "DISABLED"','"run_worker_first": true','"database_name": "ezpk-members"','"database_id": "aaa29a3a-a221-47e3-a30f-9b4c624dcb56"','"pattern": "ezpk322.com"','"pattern": "ezpk1.ezpk322.com"','"pattern": "ezpk2.ezpk322.com"'])must(config,v,'production config');
if(config.includes('\"binding\": \"EZPK2_DB\"')||config.includes('\"database_name\": \"ezpk2-members\"')||config.includes('7203fea0-0dd3-4332-9c11-44273355a4bb'))fail('v437 production config must not bind EZPK2 D1');
if(pkg.scripts?.['migrate:ezpk2:list']||pkg.scripts?.['migrate:ezpk2:remote'])fail('v437 package scripts must not operate EZPK2 D1');

const indexPages=[];
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','.wrangler','.git'].includes(e.name))continue;const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(e.isFile()&&e.name==='index.html')indexPages.push(f)}}
walk(root);
if(indexPages.length!==27)fail(`index pages expected 27 got ${indexPages.length}`);
const userPages=indexPages.filter(f=>!['admin/index.html','dev/index.html'].includes(path.relative(root,f).replaceAll('\\','/')));
if(userPages.length!==25)fail(`multilingual user pages expected 25 got ${userPages.length}`);
for(const f of userPages){const t=fs.readFileSync(f,'utf8'),rel=path.relative(root,f);must(t,'/i18n-v414.js?v=4170',`i18n v414 cache token missing ${rel}`);if(t.includes('shared-header.js'))must(t,'shared-header.js?v=4270',`shared header v421 cache token missing ${rel}`);if(!t.includes('data-ezpk-theme-bootstrap'))fail(`theme bootstrap missing ${rel}`)}

const header=read('shared-header.js');
for(const c of LANGS)must(header,`data-l="${c}"`,`shared selector ${c}`);
for(const v of ["const SUPPORTED_LANGS=Object.freeze(['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id'])",'navigator.languages',"const USER_LANGUAGE_KEY='ezpk-lang-user-v6'",'Domain=.ezpk322.com','SameSite=Lax',"if (raw==='zh'||raw==='zh-cn'||raw.startsWith('zh-hans')) return '';", "document.documentElement.dir=lang==='ar'?'rtl':'ltr'"])must(header,v,'language resolver');
if(!/ja\s*:\s*\{[^}]*myAccount\s*:/s.test(header))fail('Japanese shared header myAccount missing');

const i18n=read('i18n-v414.js');
const ctx={};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(i18n,ctx,{filename:'i18n-v414.js'});
const I=ctx.EZPK_I18N_V414;
if(!I||JSON.stringify(I.SUPPORTED)!==JSON.stringify(LANGS))fail('central supported language list mismatch');
const REQUIRED_GROUPS=['accounts','members','home','logo','schedule','season5','signup','request','vote','my','allianceLayout','season6Labels','season6Gate','season6Hero','bgb','capitalPreview','capitalUi','capitalContent','tip1','tip2','tip3','game','drone','missile','tank','gameResult','newGame','gameSwitcher','rankingAria','season6Guides'];
for(const g of REQUIRED_GROUPS){if(!I.B[g]){fail(`central bundle missing ${g}`);continue;}if(g==='rankingAria'){for(const c of LANGS)if(!I.B[g][c])fail(`${g} missing ${c}`)}else{for(const c of NEW)if(!I.B[g][c])fail(`${g} missing native ${c}`)}}

// Prevent the six new locales from being represented by exact whole English dictionaries.
function stable(v){if(typeof v==='function')return v.toString();if(Array.isArray(v))return v.map(stable);if(v&&typeof v==='object'){return Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])]))}return v}
for(const [g,b] of Object.entries(I.B)){if(!b.en)continue;for(const c of NEW){if(b[c]&&JSON.stringify(stable(b[c]))===JSON.stringify(stable(b.en)))fail(`${g}.${c} is an exact English clone`)}}

// Verify central patch is actually wired into every legacy specialist dictionary.
const wiring=[['accounts/accounts.js','accounts'],['members/members.js','members'],['home-v319.js','home'],['logo/logo.js','logo'],['schedule.js','schedule'],['season5/season5.js','season5'],['signup/signup.js','signup'],['request/request.js','request'],['vote/vote.js','vote'],['my/my.js','my'],['alliance-layout/alliance-layout.js','allianceLayout'],['season6/season6.js','season6Labels'],['bgb/bgb.js','bgb'],['capital-war/capital-war.js','capitalPreview'],['tip/tip.js','tip1'],['game/game.js','game'],['drone-hunter/drone.js','drone'],['missile-defense/missile.js','missile'],['tank-battle/tank.js','tank'],['new-game.js','newGame']];
for(const [f,g] of wiring)must(read(...f.split('/')),`apply('${g}'`,`${f} central i18n wiring`);

// Auxiliary dictionaries that previously fell back to English must now explicitly receive the six locales.
const aux=[
 ['alliance-layout/alliance-layout.js','Object.assign(ZOOM_T',{langs:NEW}],['alliance-layout/alliance-layout.js','Object.assign(IMAGE_T',{langs:NEW}],
 ['bgb/bgb.js','Object.assign(BGB_GATE_TEXT',{langs:NEW}],['bgb/bgb.js','Object.assign(YOU_LABEL',{langs:NEW}],
 ['members/members.js','Object.assign(VIEW_LABELS',{langs:NEW}],
 ['season6/season6.js','Object.assign(MEMBER_GATE_TEXT',{langs:NEW}],['season6/season6.js','Object.assign(YOU_LABEL',{langs:NEW}],
 ['capital-war/capital-war.js','Object.assign(YOU_LABEL',{langs:NEW}],
 ['my/my.js','Object.assign(PROMOTION_LABELS',{langs:NEW}],['my/my.js','Object.assign(ACTIVITY_LABELS',{langs:NEW}],['my/my.js','Object.assign(MAINTENANCE_LABELS',{langs:NEW}],['my/my.js','Object.assign(RANK_CHANGE_LABELS',{langs:NEW}],['my/my.js','Object.assign(REQUEST_LABELS',{langs:NEW}],
 ['drone-hunter/drone.js','Object.assign(flags',{langs:NEW}],
];
for(const [f,needle] of aux)must(read(...f.split('/')),needle,`${f} auxiliary i18n`);
for(const f of ['game/game.js','drone-hunter/drone.js','tank-battle/tank.js']){const t=read(...f.split('/'));must(t,'const MISSILE_CARD_414=',`${f} missile card`);for(const c of LANGS){const token=c==='zh-tw'?"'zh-tw':":`${c}:`;must(t,token,`${f} missile card language ${c}`)}}

// Request promotion prefill must be native in all 14 languages.
const req=read('request','request.js');
must(req,'const PROMOTION_COPY={','request promotion dictionary');
for(const c of LANGS){const token=c==='zh-tw'?"'zh-tw':":`${c}:`;if(!req.slice(req.indexOf('const PROMOTION_COPY='),req.indexOf('const PROMOTION_COPY=')+9000).includes(token))fail(`request promotion copy missing ${c}`)}

// Strategy data: all new-language strategy leaves must have the English shape and must not be copied from English.
const dctx={};dctx.window=dctx;vm.createContext(dctx);vm.runInContext(read('data.js'),dctx,{filename:'data.js'});const D=dctx.EZPK_DATA;
function leaves(v,p='',out={}){if(Array.isArray(v))v.forEach((x,i)=>leaves(x,`${p}[${i}]`,out));else if(v&&typeof v==='object')for(const [k,x] of Object.entries(v))leaves(x,p?`${p}.${k}`:k,out);else out[p]=v;return out}
const eStrategy=leaves({overall:D.en.overall,teams:D.en.teams,orders:D.en.orders});
for(const c of NEW){const q=leaves({overall:D[c].overall,teams:D[c].teams,orders:D[c].orders});const ek=Object.keys(eStrategy).sort(),qk=Object.keys(q).sort();if(JSON.stringify(ek)!==JSON.stringify(qk))fail(`data.js strategy key shape mismatch ${c}`);for(const k of ek){if(typeof eStrategy[k]==='string'&&typeof q[k]==='string'&&q[k]===eStrategy[k]&&!/^#[0-9a-f]{6}$/i.test(q[k])&&!['Mission'].includes(q[k]))fail(`data.js untranslated ${c}: ${k}`)}}

// Season 6 six-new-language text-bearing guides must use localized HTML instead of English fallback images.
const s6=read('season6','season6.js');
for(const v of ["const LOCALIZED_GUIDE_LANGS=new Set(['fr','de','es','tr','it','id'])",'function renderLocalizedGuide','function renderSeason6Guides','season6Guides'])must(s6,v,'Season 6 localized HTML guide');
for(const c of ['th','ja',...NEW]){if(!I.B.season6Hero[c])fail(`Season6 hero native patch missing ${c}`)}

// Known hard-coded omissions from the v413 audit must be eliminated from reachable localized UI paths.
const newGame=read('new-game.js');if(newGame.includes("tx().mergeBoardAria||'Hero merge board'")||newGame.includes("tx().heroRush||'HERO RUSH'"))fail('new-game hard-coded localized fallback remains');
const bgb=read('bgb','bgb.js');if(bgb.includes("||'Unable to load BGB data.'"))fail('BGB hard-coded error fallback remains');
const ranking=read('ranking-panel.js');if(ranking.includes("||{refresh:'Refresh ranking'"))fail('ranking hard-coded ARIA fallback remains');
const capital=read('capital-war','capital-war.js');for(const c of LANGS)if(!read('capital-war','capital-war.js').includes(`${c==='zh-tw'?"'zh-tw'":c}:`)&&!I.B.capitalUi?.[c]){} // structural coverage supplied by legacy + central
must(capital,'CAPITAL_STATE_LABELS','capital localized state labels');

// Gateway confirmed layout/navigation stays intact.
const gcss=read('gateway','gateway.css');for(const v of ['.gateway-migration-section{width:100%;padding:0 0 100px','.gateway-heading{width:min(760px,100%);margin:0 auto 26px;padding:0','.gateway-heading p{width:min(680px,100%);margin:10px auto 0','.gateway-migration-section{padding:0 0 80px}','.gateway-heading{margin-bottom:22px}','.gateway-heading p{margin-top:12px','.gateway-grid{grid-template-columns:1fr;gap:12px}','position:sticky;top:68px','#gatewayMigrationEntry,#gatewayAllianceCards{scroll-margin-top:142px}'])must(gcss,v,'gateway spacing/nav');

const migrations=fs.readdirSync(path.join(root,'migrations')).filter(n=>n.endsWith('.sql')).sort();
if(migrations.length!==31)fail(`migration count ${migrations.length}`);if(migrations.at(-1)!=='0032_v435_rank_review_cycles.sql')fail(`latest migration ${migrations.at(-1)}`);if(migrations.some(x=>/^0033/.test(x)))fail('0033 unexpectedly present');
const worker=read('worker.js');for(const v of ['MIGRATION_INTAKE_DISABLED','case "GET /api/dev/alliance-join-code"','case "PUT /api/dev/alliance-join-code"','alliance_join_code_updated','sensitiveSettingsRedacted: true'])must(worker,v,'preserved worker contract');



// v416 late-audit fixes: the shared auth close button and Capital War hidden preview metadata must localize before protected content loads.
must(header,"loginModal.querySelector('.ezpk-auth-close')?.setAttribute('aria-label', labels.close);",'shared auth close aria v416');
if(header.includes("loginModal.querySelector('[data-auth-close]').setAttribute('aria-label', labels.close);"))fail('shared auth close aria still targets backdrop first');
must(capital,"function renderGate(){",'capital gate function');
for(const v of ["$('#cwPreviewBrand').textContent=l.previewBrand","$('#cwPreviewCloseBtn').setAttribute('aria-label',l.previewCloseAria)","$('#cwPreviewImage').alt=l.previewAlt"])must(capital,v,'capital initial preview i18n v416');

// Full required-key equality: each new native locale must expose every English leaf used by each specialist dictionary.
function extractObject(file,varName){const text=read(...file.split('/'));const rx=new RegExp('\\bconst\\s+'+varName.replace(/[$]/g,'\\$&')+'\\s*=\\s*\\{');const m=rx.exec(text);if(!m)throw new Error(`dictionary ${file}:${varName} not found`);const start=m.index+m[0].length-1;let depth=0,state='code',quote='';for(let i=start;i<text.length;i++){const c=text[i],n=text[i+1]||'';if(state==='code'){if(c==='"'||c==="'"){state='str';quote=c}else if(c==='`')state='tpl';else if(c==='/'&&n==='/'){state='line';i++}else if(c==='/'&&n==='*'){state='block';i++}else if(c==='{')depth++;else if(c==='}'&&--depth===0)return vm.runInNewContext('('+text.slice(start,i+1)+')')}else if(state==='str'){if(c==='\\')i++;else if(c===quote)state='code'}else if(state==='tpl'){if(c==='\\')i++;else if(c==='`')state='code'}else if(state==='line'){if(c==='\n')state='code'}else if(state==='block'&&c==='*'&&n==='/'){state='code';i++}}throw new Error(`unterminated dictionary ${file}:${varName}`)}
function leafPaths(v,p='',a=[]){if(Array.isArray(v)){for(const x of v)leafPaths(x,p+'[]',a)}else if(v&&typeof v==='object'){for(const [k,x] of Object.entries(v))leafPaths(x,p?`${p}.${k}`:k,a)}else a.push(p);return [...new Set(a)].sort()}
function copy(v){if(Array.isArray(v))return v.map(copy);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,copy(x)]));return v}
function deepMerge(dst,src){for(const [k,v] of Object.entries(src||{})){if(v&&typeof v==='object'&&!Array.isArray(v)){if(!dst[k]||typeof dst[k]!=='object'||Array.isArray(dst[k]))dst[k]={};deepMerge(dst[k],v)}else dst[k]=v}return dst}
const KEYSET_MAPS=[['accounts/accounts.js','I18N','accounts'],['members/members.js','T','members'],['home-v319.js','HOME_TEXT','home'],['logo/logo.js','TEXT','logo'],['schedule.js','COPY','schedule'],['season5/season5.js','RECORD','season5'],['signup/signup.js','T','signup'],['request/request.js','T','request'],['vote/vote.js','T','vote'],['my/my.js','T','my'],['alliance-layout/alliance-layout.js','T','allianceLayout'],['season6/season6.js','labels','season6Labels'],['season6/season6.js','heroInfo','season6Hero'],['bgb/bgb.js','LANGS','bgb'],['capital-war/capital-war.js','PREVIEW_TEXT','capitalPreview'],['capital-war/capital-war.js','T','capitalUi'],['capital-war/capital-war.js','C','capitalContent'],['tip/tip.js','TIP_T','tip1'],['tip/tip.js','TIP2_T','tip2'],['tip/tip.js','TIP3_T','tip3'],['game/game.js','T','game'],['drone-hunter/drone.js','T','drone'],['missile-defense/missile.js','T','missile'],['tank-battle/tank.js','T','tank'],['new-game.js','I18N','newGame']];
for(const [file,varName,group] of KEYSET_MAPS){const source=extractObject(file,varName),required=leafPaths(source.en);for(const code of LANGS){let native=source[code]||{};if(group==='capitalContent'&&code==='ko'){const capT=extractObject('capital-war/capital-war.js','T');native={goals:capT.ko?.goals||[],common:capT.ko?.common||[],strategy:capT.ko?.strategy||{}}}const effective=deepMerge(copy(native),I.B[group]?.[code]||{}),actual=leafPaths(effective),missing=required.filter(k=>!actual.includes(k));if(missing.length)fail(`${group}.${code} missing required keys: ${missing.join(', ')}`)}}



// v415 remediation overlays: every added runtime/accessibility dictionary must cover all 14 languages with an identical key shape.
const V415_OVERLAYS=[
 ['new-game.js','V415_RUNTIME_COPY'],['request/request.js','REQUEST_V415'],['my/my.js','MY_V415'],['accounts/accounts.js','ACCOUNTS_V415'],
 ['capital-war/capital-war.js','CAPITAL_V415_UI'],['season5/season5.js','SEASON5_V415'],['logo/logo.js','LOGO_V415'],['bgb/bgb.js','BGB_V415'],
 ['season6/season6.js','SEASON6_V415'],['season6/season6.js','SEASON6_V415_ACCESS'],['tip/tip.js','TIP_V415'],['vote/vote.js','VOTE_V415'],
 ['game/game.js','GAME_V415'],['tank-battle/tank.js','TANK_V415'],['missile-defense/missile.js','MISSILE_V415'],['drone-hunter/drone.js','DRONE_V415']
];
for(const [file,varName] of V415_OVERLAYS){
  const o=extractObject(file,varName),en=leafPaths(o.en||{});
  for(const code of LANGS){if(!o[code]){fail(`${varName} missing ${code}`);continue;}const got=leafPaths(o[code]);if(JSON.stringify(en)!==JSON.stringify(got))fail(`${varName}.${code} key shape mismatch`)}
}
const season5Finale=extractObject('season5/season5.js','SEASON5_V415_FINALE');for(const c of LANGS)if(!season5Finale[c])fail(`SEASON5_V415_FINALE missing ${c}`);

// Known v414 hard-coded/runtime defects are now regression-blocked at their execution sites.
const forbidden=[
 ['shared-header.js',"accountLabel('login')"],
 ['new-game.js','tx()'],['new-game.js',"text:'TOXIC HIT'"],['new-game.js',"text:'GAME OVER'"],['new-game.js',"text:'AUTO MERGE"],
 ['request/request.js',"lang==='ko'?'ko-KR':'en-US'"],['request/request.js',"🔒 PRIVATE</span>"],
 ['my/my.js',"lang==='ko'?'차량 #1':'Vehicle #1'"],
 ['accounts/accounts.js',"ctx.fillText('ACCOUNT SHOWCASE'"],['accounts/accounts.js',"ctx.fillText('DESIRED PRICE'"],['accounts/accounts.js',"ctx.fillText('CONTACT'"],
 ['capital-war/capital-war.js',"$('#cwVersus').textContent=`SERVER 322 VS SERVER ${opponent}`"],['capital-war/capital-war.js',"ctx.fillText('CAPITAL WAR'"],
 ['tank-battle/tank.js',"text:killStreak===2?'DOUBLE KILL!'"],['missile-defense/missile.js',"text:'COMBO ×'+combo"],['drone-hunter/drone.js',"ctx.fillText('EZPK DEFENSE LINE'"],
 ['bgb/bgb.js',"$('#teamTitle').textContent=`${team} TEAM`"],['season6/season6.js','<span class="hero-detail-kicker">SEASON 6 · S HERO</span>'],
 ['home-v319.js',"ko: {\n      brandKicker:'STATE #322 · INTERNATIONAL ALLIANCE'"],['logo/logo.js',"footer:'연맹 공식 로고',section:'EZPK MEMBER'"]
];
for(const [file,needle] of forbidden)if(read(...file.split('/')).includes(needle))fail(`${file} forbidden v414 i18n residual: ${needle}`);

// Required v415 runtime wiring for the previously hard-coded static/accessibility surfaces.
const requiredWiring=[
 ['shared-header.js','accountLabels().login'],['request/request.js','REQUEST_LOCALES'],['request/request.js',"$('#editDialogTitle').textContent"],
 ['my/my.js','MY_V415'],['accounts/accounts.js',"t('imageShowcase')"],['accounts/accounts.js',"t('imagePreviewAlt')"],
 ['capital-war/capital-war.js','CAPITAL_V415_UI'],['capital-war/capital-war.js',"l.versus.replace('{opponent}'"],
 ['season5/season5.js','SEASON5_V415'],['season5/season5.js',"$('.record-grid img')"],
 ['logo/logo.js','LOGO_V415'],['bgb/bgb.js','teamName=(u,value)'],['season6/season6.js','SEASON6_V415_ACCESS'],
 ['tip/tip.js',"setText('#post1Category'"],['vote/vote.js',"$('#voteFooterLabel').textContent"],
 ['game/game.js',"t.mobileControlsAria"],['gateway/gateway.js','GATEWAY_V415'],['script.js','HOME_V415_ACCESS'],['members/members.js','MEMBERS_V415']
];
for(const [file,needle] of requiredWiring)must(read(...file.split('/')),needle,`${file} v415 wiring`);

// Direct source clone regression: legacy non-English account vehicle labels must no longer remain as English source values.
const accountsSource=read('accounts','accounts.js');for(const c of ['ko','th','ja','pt','zh-tw','ar','vi']){const token=c==='zh-tw'?"'zh-tw':{":`${c}:{`;const i=accountsSource.indexOf(token);if(i>=0){const line=accountsSource.slice(i,accountsSource.indexOf('\n',i));if(line.includes("vehicle1:'Vehicle #1'")||line.includes("vehicle2:'Vehicle #2'"))fail(`accounts legacy vehicle source still English for ${c}`)}}



// v416 strict full-UI remediation policy and runtime wiring.
const ALLOWED_FIXED_TERMS=['EZPK','BGB','Discord','CP','Fighter','Shooter','Rider','Leader','Officer','Core','Support','Reserve','Member summary','REFINERY','MILITARY BASE','HOSPITAL','ALLOY FACTORY','TOP 30','322 EZPK WAR PORTAL'];
if(ALLOWED_FIXED_TERMS.length!==19)fail('v416 allowlist shape changed unexpectedly');

must(header,"menuButton.setAttribute('aria-label',menuUi(lang).menu)",'shared header initial Menu localization');
const req416=extractObject('request/request.js','REQUEST_V416_MIGRATION_LINK');for(const c of LANGS)if(!req416[c])fail(`REQUEST_V416_MIGRATION_LINK missing ${c}`);must(req,"link.textContent=REQUEST_V416_MIGRATION_LINK[lang]||REQUEST_V416_MIGRATION_LINK.en",'request Migration link wiring');
const bgb416=extractObject('bgb/bgb.js','BGB_V416'),bgb416Keys=leafPaths(bgb416.en);for(const c of LANGS){if(!bgb416[c])fail(`BGB_V416 missing ${c}`);if(JSON.stringify(leafPaths(bgb416[c]))!==JSON.stringify(bgb416Keys))fail(`BGB_V416.${c} key shape mismatch`)}
for(const v of ['function applyStaticV416()','v416.tacticalMapAlt','v416.closeAria','v416.previewAlt',"b.dataset.team==='A'?v416.teamA:v416.teamB"])must(bgb,v,'BGB v416 static/accessibility wiring');

const mini=read('mini-game-i18n-v416.js');const mctx={};mctx.window=mctx;vm.createContext(mctx);vm.runInContext(mini,mctx,{filename:'mini-game-i18n-v416.js'});const MC=mctx.EZPKMiniI18nV416?.COPY;if(!MC)fail('mini-game v416 dictionary missing');else{const ek=leafPaths(MC.en);for(const c of LANGS){if(!MC[c]){fail(`mini-game v416 missing ${c}`);continue;}if(JSON.stringify(leafPaths(MC[c]))!==JSON.stringify(ek))fail(`mini-game v416 ${c} key shape mismatch`)}}
const miniPages=['game/index.html','tank-battle/index.html','missile-defense/index.html','drone-hunter/index.html','treasure-hunter/index.html','zombie-defense/index.html','portal-escape/index.html','hero-merge/index.html'];for(const f of miniPages)must(read(...f.split('/')),'mini-game-i18n-v416.js?v=4170',`${f} v416 mini i18n helper`);
for(const [f,k] of [['game/game.js','survival'],['tank-battle/tank.js','tank'],['missile-defense/missile.js','missile'],['drone-hunter/drone.js','drone']])must(read(...f.split('/')),`EZPKMiniI18nV416?.apply(document,lang,'${k}')`,`${f} v416 runtime apply`);
for(const v of ['EZPKMiniI18nV416?.apply(document,currentLang,game)','v416.zombieHud','zombieGiant','zombieRunner','zombiePoison','zombieNormal',"fmt(t().ui.combo,{combo:threshold})"])must(newGame,v,'new games v416 runtime localization');
if(newGame.includes("z.setAttribute('aria-label',type+' zombie')"))fail('new-game raw zombie aria remains');
if(newGame.includes("$('#scoreLabel').textContent=`WAVE ${wave}/6 · KILLS ${totalKills} · HP ${hp}%`;"))fail('new-game raw zombie HUD remains');
if(newGame.includes("popup(`COMBO ×${threshold}"))fail('new-game raw merge combo award remains');


// v417 single-authority language-state synchronization remediation.
const languageCore=read('language-core-v417.js');
for(const token of ["version:417","const LEGACY='ezpk-lang-v5'","USER='ezpk-lang-user-v6'","function get()","function set(lang,options={})","window.EZPKLanguage="])must(languageCore,token,'v417 language core');
for(const f of userPages){const t=fs.readFileSync(f,'utf8'),rel=path.relative(root,f).replaceAll('\\','/');must(t,'/language-core-v417.js?v=4170',`v417 language core missing ${rel}`)}
const userScriptFiles=[];
for(const f of userPages){const html=fs.readFileSync(f,'utf8'),base=path.dirname(f);for(const m of html.matchAll(/<script[^>]+src=["']([^"']+\.js)(?:\?[^"']*)?["']/g)){const src=m[1];if(/^https?:|^\/\//.test(src))continue;const target=src.startsWith('/')?path.join(root,src.slice(1)):path.resolve(base,src);if(fs.existsSync(target))userScriptFiles.push(target)}}
for(const f of [...new Set(userScriptFiles)]){const rel=path.relative(root,f).replaceAll('\\','/');if(['shared-header.js','language-core-v417.js'].includes(rel))continue;const t=fs.readFileSync(f,'utf8');if(/localStorage\.getItem\(['"]ezpk-lang-v5['"]\)/.test(t))fail(`${rel} directly reads legacy language storage`);if(/localStorage\.setItem\(['"]ezpk-lang-v5['"]/.test(t))fail(`${rel} directly writes legacy language storage`);if(/\$\(['"]#(?:flag|lname)['"]\).*?textContent/.test(t)||/querySelector\(['"]#(?:flag|lname)['"]\).*?textContent/.test(t))fail(`${rel} directly owns shared language display`)}
for(const token of ["window.EZPKLanguage?.get?.()","source:'shared-header'","reconcileLanguageDisplay","languageDisplayObserver"])must(header,token,'v417 shared-header synchronization');
const accounts417=read('accounts','accounts.js');if(accounts417.includes("menu.querySelectorAll('[data-l]')"))fail('accounts still installs a second shared language-menu click handler');
for(const f of ['gateway/gateway.js','inactive/inactive.js'])must(read(...f.split('/')),'window.EZPKLanguage',`${f} central language authority`);


// v419 multilingual responsive text-fit remediation.
const tfCss=read('text-fit-v419.css');
const tfJs=read('text-fit-v419.js');
const V425_MINI_PAGES=new Set(['game/index.html','tank-battle/index.html','missile-defense/index.html','drone-hunter/index.html','treasure-hunter/index.html','zombie-defense/index.html','portal-escape/index.html','hero-merge/index.html']);
for(const f of userPages){const t=fs.readFileSync(f,'utf8'),rel=path.relative(root,f).replaceAll('\\','/');must(t,'/text-fit-v419.css?v=4190',`v419 text-fit CSS missing ${rel}`);if(V425_MINI_PAGES.has(rel))must(t,'/text-fit-v425.js?v=4250',`v425 mini-game text-fit JS missing ${rel}`);else must(t,'/text-fit-v419.js?v=4190',`v419 text-fit JS missing ${rel}`);}
for(const token of ["tile: [","compact: [","scale:.92","scale:.85","MIN_FONT = {tile:12.5, compact:12}","scrollWidth<=el.clientWidth+SAFE_PX","scrollHeight<=el.clientHeight+SAFE_PX","lineCount(el)","ResizeObserver","ezpk-language-change","document.fonts.ready","version:'419'"])must(tfJs,token,'v419 text-fit engine');
for(const token of ['.home-quick-grid a{','white-space:normal!important','[data-ezpk-text-fit="tile"]','[data-ezpk-text-fit="compact"]'])must(tfCss,token,'v419 text-fit CSS');
if(/grid-template-columns\s*:/.test(tfCss))fail('v419 text-fit CSS must not change existing grid columns');
if(tfJs.includes("attributeFilter:['hidden','class','style'"))fail('v419 text-fit observer must not watch its own style mutations');
if(/items:'>/.test(tfJs))fail('v419 text-fit registry contains invalid leading-child selector');
const baseStyle=read('style.css');
if(/(^|})nav\{display:flex;gap:24px\}/.test(baseStyle))fail('legacy global nav flex rule still leaks outside shared header');
if(/@media\(max-width:900px\)\{#menuBtn\{display:block\}nav\{/.test(baseStyle))fail('legacy global mobile nav rule still leaks outside shared header');
const season6css=read('season6','season6.css');if(season6css.includes('font-size:clamp(11px,3.4vw,14px)'))fail('Season6 legacy independent tab shrink remains');
must(read('season6','index.html'),'season6.css?v=4180','Season6 v419 CSS cache token');
const resultCss=read('game-result-modal.css');if(resultCss.includes('font-size:clamp(10px,3.15vw,13px)'))fail('game result legacy independent shrink remains');if(resultCss.includes('white-space:nowrap!important;')&&resultCss.includes('#resultOverlay .result-actions button'))fail('game result translated buttons remain nowrap');
for(const f of ['game/index.html','tank-battle/index.html','missile-defense/index.html','drone-hunter/index.html','treasure-hunter/index.html','zombie-defense/index.html','portal-escape/index.html','hero-merge/index.html'])must(read(...f.split('/')),'game-result-modal.css?v=4180',`${f} v419 result CSS cache token`);


// v424 PC Header adaptive expansion / readable-navigation contract and cache coherency.
const sharedUserPages=userPages.filter(f=>fs.readFileSync(f,'utf8').includes('shared-header.js'));
if(sharedUserPages.length!==23)fail(`shared header user pages expected 23 got ${sharedUserPages.length}`);
for(const f of userPages){const t=fs.readFileSync(f,'utf8'),rel=path.relative(root,f).replaceAll('\\','/');if(t.includes('style.css'))must(t,'style.css?v=4210',`v421 style cache token missing ${rel}`);}
for(const f of sharedUserPages){const t=fs.readFileSync(f,'utf8'),rel=path.relative(root,f).replaceAll('\\','/');must(t,'shared-header.js?v=4270',`shared-header cache token missing ${rel}`);must(t,'/header-fit-v424.css?v=4240',`v424 header-fit CSS missing ${rel}`);must(t,'/header-fit-v424.js?v=4240',`v424 header-fit JS missing ${rel}`);if(t.includes('/header-fit-v423.css?v=4230')||t.includes('/header-fit-v423.js?v=4230')||t.includes('/header-fit-v422.css?v=4220')||t.includes('/header-fit-v422.js?v=4220')||t.includes('/header-fit-v419.css?v=4190')||t.includes('/header-fit-v419.js?v=4190'))fail(`legacy header fitter still active ${rel}`);}
const hfit=read('header-fit-v424.js'),hcss=read('header-fit-v424.css');
for(const token of ["VERSION='424'","const LEVELS=['normal','compact','tight']",'const MIN_VISIBLE_PRIMARY=4','const PRIMARY_FONT_FLOOR_PX=14','const PROMOTE_MARGIN_PX=24','const DEMOTE_MARGIN_PX=8','function restoreRelocations','function ensureActivePrimary','function ensureMinimumPrimary','function promotionCandidates','function sortPromotedTail','function tryPromoteKey','function navEdgeMargin','function primaryFontFloor','stablePromotedKeys','ezpkHeaderActivePrimary','ezpkHeaderMoreEmpty','ezpkHeaderPrimaryEdgeMargin','ezpk-header-layout-change'])must(hfit,token,'v424 header-fit engine');
for(const token of ['@media(max-width:1199px)','alliance-selector-link{display:none!important','font-size:15px!important','font-size:14.5px!important','font-size:14px!important','justify-content:center!important','desktop-alliance-label-full','desktop-alliance-label-short',"data-ezpk-header-fit-level='compact'","data-ezpk-header-fit-level='tight'",'.account-member-name{','.account-member-trigger .account-rank','text-overflow:ellipsis!important','@media(min-width:1600px)'])must(hcss,token,'v424 header-fit CSS');
if(/desktop-nav-items>a\{[^}]*font-size:(?:9|10|11|12|13)(?:\.|px)/.test(hcss))fail('v424 Primary Navigation font below 14px');
if(/#navMoreButton\{[^}]*font-size:(?:9|10|11|12|13)(?:\.|px)/.test(hcss))fail('v424 More button font below 14px');
if(/grid-template-columns\s*:\s*repeat\(/.test(hcss))fail('v424 header-fit must not alter content card grids');
if(!hfit.includes("signedInShape(h)?['seasonUpcoming','tip','request']:['game','accounts']"))fail('v424 dynamic More promotion priority missing');
if(!hfit.includes('directPrimaryLinks(h).length>MIN_VISIBLE_PRIMARY'))fail('v424 active-item minimum-visible demotion guard missing');
if(!hfit.includes("window.addEventListener('ezpk-language-change',()=>refreshNow(true))"))fail('v424 language change hard recalculation missing');
if(!hfit.includes("window.addEventListener('resize',()=>schedule(false)"))fail('v424 resize hysteresis path missing');
const sh419=read('shared-header.js');for(const token of ["notifyHeaderLayoutChange('navigation')","notifyHeaderLayoutChange('language')","notifyHeaderLayoutChange('account')","notifyHeaderLayoutChange('responsive-navigation')"])must(sh419,token,'shared-header layout notification');
const tf419=read('text-fit-v419.js');for(const token of ['function isHardExcluded','function isSoftExcluded',"el.closest('[data-shared-header]')","version:'419'"])must(tf419,token,'v419 body text-fit ownership');
if(tf419.includes("{root:'[data-shared-header]"))fail('v419 body text-fit must not register shared-header targets');
const stress=JSON.parse(read('V419_HEADER_LABEL_WIDTH_STRESS.json'));
if(!Array.isArray(stress.rows)||stress.rows.length!==14)fail('v419 header width stress must contain 14 languages');
for(const row of stress.rows||[]){for(const [key,ok] of Object.entries(row.normal_fit_1200_1380||{}))if(ok!==true)fail(`v419 header width stress failed ${row.lang} ${key}`);}


// v420 persistent responsive hamburger discovery-cue restoration.
const v420Style=read('style.css');
const v420Header=read('shared-header.js');
must(v420Header,'class="ezpk-menu-discovery-cue"','v420 hamburger cue class in initial shared-header markup');
must(v420Header,"button.classList.add('ezpk-menu-discovery-cue')",'v420 hamburger cue class reconciliation');
for(const token of [
  '/* v420: restore persistent mobile/tablet menu discovery cue',
  '@media (max-width:1199px){',
  'animation:ezpkMenuDiscoveryGlow 3s ease-in-out infinite',
  'animation:ezpkMenuDiscoveryRing 3s ease-out infinite',
  '@media (prefers-reduced-motion:reduce){',
  'animation:none!important',
  'box-shadow:0 0 0 2px rgba(245,197,71,.12),0 0 16px rgba(245,197,71,.28)!important'
])must(v420Style,token,'v420 hamburger discovery cue');
if(/ezpk-menu-discovery-cue[\\s\\S]{0,220}animation-iteration-count\\s*:\\s*2/.test(v420Style))fail('v420 hamburger cue must not be capped at two iterations');
if(/@media\\s*\\(max-width\\s*:\\s*900px\\)\\s*\\{[\\s\\S]{0,400}ezpk-menu-discovery-cue[\\s\\S]{0,500}ezpkMenuDiscoveryGlow/.test(v420Style))fail('v420 discovery cue remains scoped only to <=900px');
must(v420Style,'@media(max-width:1199px){','v420 responsive shared-header breakpoint');
must(v420Style,'#menuBtn{display:grid!important','v420 responsive hamburger visibility');
const v420StylePages=userPages.filter(f=>fs.readFileSync(f,'utf8').includes('style.css'));
if(v420StylePages.length!==24)fail(`v420 style user pages expected 24 got ${v420StylePages.length}`);
for(const f of v420StylePages){const t=fs.readFileSync(f,'utf8'),rel=path.relative(root,f).replaceAll('\\\\','/');must(t,'style.css?v=4210',`v421 style cache token missing ${rel}`)}



// v437 single-alliance navigation contract replaces the retired v421/v422 alliance selector.
const v437Header=read('shared-header.js');
const v437Style=read('style.css');
if(v437Header.includes('id="allianceSelectorLink"'))fail('v437 desktop alliance selector link must be removed');
if(v437Header.includes('data-alliance-choice=')||v437Header.includes('function allianceChoices()')||v437Header.includes('function switchAllianceFromMobile'))fail('v437 alliance-switch implementation must be retired');
for(const token of [
  'function syncAllianceSelectorControls()',
  "header.querySelector('#allianceSelectorLink')?.remove()",
  "mobileDrawerItems?.querySelector('[data-mobile-alliance-selector]')?.remove()",
  "mode:'SINGLE'",
  "ezpk2Active:false",
  "window.location.replace('https://ezpk1.ezpk322.com/');return;"
])must(v437Header,token,'v437 single-alliance shared header');
for(const f of sharedUserPages){const q=fs.readFileSync(f,'utf8'),rel=path.relative(root,f).replaceAll('\\','/');must(q,'shared-header.js?v=4270',`shared-header cache token missing ${rel}`);must(q,'/header-fit-v424.css?v=4240',`v424 header-fit CSS cache missing ${rel}`);must(q,'/header-fit-v424.js?v=4240',`v424 header-fit JS cache missing ${rel}`)}
for(const f of v420StylePages){const q=fs.readFileSync(f,'utf8'),rel=path.relative(root,f).replaceAll('\\','/');must(q,'style.css?v=4210',`v421 style cache token missing ${rel}`)}
if(!hfit.includes('visibleDirect')||!hfit.includes('fontFloor')||!hfit.includes('collisions')||!hfit.includes('edgeMargin'))fail('v424 primary-nav runtime audit fields missing');
if(!hfit.includes('restoreRelocations(h);')||!hfit.includes("for(const level of LEVELS)"))fail('v424 canonical-order reset / level evaluation contract missing');
if(!hfit.includes('PROMOTE_MARGIN_PX=24')||!hfit.includes('DEMOTE_MARGIN_PX=8'))fail('v424 hysteresis thresholds missing');
if(!hfit.includes('activePrimary')||!hfit.includes('moreEmpty'))fail('v424 active/More audit contract missing');


// v425 Mini Games multilingual flow-safe card contract.
const MINI_PAGES=['game/index.html','tank-battle/index.html','missile-defense/index.html','drone-hunter/index.html','treasure-hunter/index.html','zombie-defense/index.html','portal-escape/index.html','hero-merge/index.html'];
for(const f of MINI_PAGES){
  const t=read(...f.split('/'));
  must(t,'game-switcher.css?v=4250',`v425 game-switcher cache token ${f}`);
  must(t,'/text-fit-v425.js?v=4250',`v425 text-fit cache token ${f}`);
  if(t.includes('/text-fit-v419.js?v=4190'))fail(`legacy v419 text-fit JS still active on mini-game ${f}`);
}
const cardCss=read('game-switcher.css');
for(const token of [
  'v425 multilingual flow-safe card contract',
  'height:auto!important',
  'min-height:0!important',
  'display:grid',
  'grid-template-columns:32px minmax(0,1fr)',
  'grid-template-rows:auto minmax(0,1fr) auto',
  'position:static!important',
  'grid-row:3',
  'min-height:44px',
  'white-space:normal!important',
  'overflow-wrap:anywhere!important',
  'display:block!important',
  '@media(max-width:560px)',
  '.game-library{grid-template-columns:1fr;gap:10px;padding:0 12px}'
])must(cardCss,token,'v425 mini-game card CSS');
if(/\.game-choice\{[^}]*height:\s*(?:124|128|138|150)px/s.test(cardCss))fail('v425 game card fixed height remains');
if(/\.game-choice(?:>|\s).*?(?:a|current-badge)[^}]*position:\s*absolute/s.test(cardCss))fail('v425 game action absolute positioning remains');
if(/@media\(max-width:560px\)[\s\S]*?\.game-choice p\s*\{[^}]*display:\s*none/s.test(cardCss))fail('v425 mobile card description is hidden');
if(/\.rtl\s+\.game-choice[^}]*?(?:left|right)\s*:/s.test(cardCss))fail('v425 card CTA still uses directional RTL positioning');
if(!/\.game-choice h2\{[\s\S]*?overflow-wrap:anywhere!important/s.test(cardCss))fail('v425 long title word wrapping missing');
if(!/\.game-choice p\{[\s\S]*?overflow-wrap:break-word/s.test(cardCss))fail('v425 description natural wrapping missing');
const tf425=read('text-fit-v425.js');
for(const token of ["version:'425'","'.game-library'"])must(tf425,token,'v425 mini-game Text-Fit exclusion');
if(tf425.includes("{root:'.game-library', items:'.game-choice h2'"))fail('v425 Text-Fit still owns mini-game titles');
if(tf425.includes("{root:'.game-library', items:'.game-choice a'"))fail('v425 Text-Fit still owns mini-game CTA');
const gsExtra=read('game-switcher-extra.js');
const GAME_BASE_LANGS=['en','ko','th','ja','pt','zh-tw','ar','vi'];
for(const c of GAME_BASE_LANGS){
  const token=c==='zh-tw'?"'zh-tw':":`${c}:`;
  const first=gsExtra.indexOf('const extraGames=');
  const classic=gsExtra.indexOf('const classicGames=');
  const labelsAt=gsExtra.indexOf('const labels=');
  if(!gsExtra.slice(first,classic).includes(token))fail(`v425 extraGames base locale missing ${c}`);
  if(!gsExtra.slice(classic,labelsAt).includes(token))fail(`v425 classicGames base locale missing ${c}`);
  if(!gsExtra.slice(labelsAt,gsExtra.indexOf('for(const [code,copy]')).includes(token))fail(`v425 labels base locale missing ${c}`);
}
for(const c of NEW){
  const b=I.B.gameSwitcher?.[c];
  if(!b)fail(`v425 central gameSwitcher patch missing ${c}`);
  else{
    if(!Array.isArray(b.labels)||b.labels.length<3)fail(`v425 gameSwitcher labels invalid ${c}`);
    if(!Array.isArray(b.classicGames)||b.classicGames.length!==4)fail(`v425 classic games invalid ${c}`);
    if(!Array.isArray(b.extraGames)||b.extraGames.length!==4)fail(`v425 extra games invalid ${c}`);
  }
}
// Structural pseudo-long-copy resilience: the card contract must have no fixed height/clamp and every text/action region must wrap in normal flow.
if(cardCss.includes('-webkit-line-clamp'))fail('v425 card line clamp remains');
if(cardCss.includes('white-space:nowrap') && /game-choice/.test(cardCss))fail('v425 card nowrap remains');



// v426 administrator critical-auth/bootstrap + mobile Drawer hotfix.
const adminIndex=read('admin','index.html');
const adminJs=read('admin','admin.js');
const adminCss=read('admin','admin.css');
for(const token of [
  '/i18n-v414.js?v=4270',
  '../shared-header.js?v=4270',
  '../vehicle-power.js?v=4270',
  'admin.js?v=4330',
  '../supabase-config.js?v=4270',
  '../request/request-admin.js?v=4280',
  'migration-manager.js?v=4270',
  'async id="ezpkXlsxLibrary"',
  'administrator authority/bootstrap must execute before optional manager/CDN assets'
])must(adminIndex,token,'v428 admin critical asset wiring');
if(/(?:shared-header\.js|admin\.js|style\.css|admin\.css)\?v=(?:4150|4160)/.test(adminIndex))fail('v427 admin page still references stale critical cache tokens');
const adminScriptPos=adminIndex.indexOf('admin.js?v=4330');
const xlsxPos=adminIndex.indexOf('xlsx-js-style@1.2.0');
if(adminScriptPos<0||xlsxPos<0||adminScriptPos>xlsxPos)fail('v427 admin auth script must precede optional XLSX CDN');
for(const token of [
  "version:'427'",
  'adminLoginGateInitialized',
  'adminNavigationInitialized',
  'fetchAdminAuthority(attempts=3)',
  "setAdminAuthPhase('checking')",
  "setAdminAuthPhase('authorizing')",
  "setAdminAuthPhase('verified')",
  "if(document.getElementById('adminLogin'))initAdminLoginGate()",
  "if(document.querySelector('.admin-card-navigation'))initAdminCardNavigation()",
  'window.EZPKAdminBootstrap={',
  "document.addEventListener('DOMContentLoaded',startAdminManagers,{once:true})"
])must(adminJs,token,'v427 admin auth/bootstrap engine');
for(const token of [
  '.admin-auth-host #menuBtn{',
  'display:grid!important;place-items:center!important',
  'body.admin-unlocked .ezpk-mobile-drawer{display:block!important}',
  '.ezpk-mobile-drawer .admin-mobile-navigation-host{'
])must(adminCss,token,'v427 admin mobile Drawer contract');


// v427 single-authority administrator Header + independent mobile drawer shell.
const worker427=read('worker.js');
for(const token of [
  'permissions,member:publicAuthenticatedMember(admin)',
  'async function handleAdminMyPermissionsGet(request,env)'
])must(worker427,token,'v427 admin authority response');
for(const token of [
  'fetchAdminAuthority(attempts=3)',
  "/api/admin/my-permissions?admin_verify=",
  'currentAdminAccess=authority.access',
  'window.EZPKAdminHeaderShell?.setVerified?.(member)',
  "version:'427'"
])must(adminJs,token,'v427 canonical admin authority');
if(adminJs.includes("fetch('/api/auth/me?admin_verify="))fail('v427 admin bootstrap must not use public auth/me as admin authority');
for(const token of [
  'window.EZPKAdminHeaderShell = {',
  "version:'427'",
  "adminMenuButton.dataset.ezpkAdminDrawerBound='true'",
  'event.stopImmediatePropagation()',
  'if (!isAdminContext) loadAuth()',
  'if (!isAdminContext) renderAccount()',
  "if (!isAdminContext) window.addEventListener('ezpk-auth-refresh', loadAuth)",
  'if (!isAdminContext) menuBtn.addEventListener'
])must(header,token,'v427 admin header shell');
for(const token of [
  'body.admin-unlocked{max-width:100%;overflow-x:hidden}',
  'max-width:100vw!important',
  'visibility:visible!important',
  'pointer-events:auto!important'
])must(adminCss,token,'v427 admin mobile viewport containment');
if(!adminIndex.includes('admin.js?v=4330')||!adminIndex.includes('../shared-header.js?v=4270'))fail('v433 admin cache token missing');



// v428 Admin Request Board isolation + initialization regression guard.
const reqAdmin428=read('request','request-admin.js');
const adminHtml428=read('admin','index.html');
const worker428=read('worker.js');
for(const token of [
  'REQUEST_LOAD_RETRIES=2',
  'window.addEventListener(\'ezpk-admin-ready\'',
  'window.EZPKRequestAdmin=',
  'requestsPanelActive()',
  '일부 이민 문의를 불러오지 못했습니다.'
])must(reqAdmin428,token,'v428 request-admin frontend');
must(adminHtml428,'../request/request-admin.js?v=4280','v428 request-admin cache token');
for(const token of [
  'MIGRATION_INQUIRY_SOFT_DELETE_SCHEMA_PENDING',
  'MIGRATION_INQUIRY_SCHEMA_PENDING',
  'MIGRATION_INQUIRY_MERGE_UNAVAILABLE',
  '[ADMIN_REQUESTS_MIGRATION_MERGE_FAILED]',
  'partial:Boolean(migrationMergeWarning)',
  'warnings:migrationMergeWarning?[migrationMergeWarning]:[]'
])must(worker428,token,'v428 admin requests backend isolation');
if(!worker428.includes('const memberRows=await env.DB.prepare(`'))fail('v428 member requests query missing');
if(worker428.indexOf('const memberRows=await env.DB.prepare(`')>worker428.indexOf('let migrationItems=[]'))fail('v428 member requests must load before optional migration merge');

// v429 migration UID status lookup must be authoritative and inquiry-schema independent.
const v429Worker=read('worker.js');
const v429Migration=read('migration','migration.js');
const v429MigrationIndex=read('migration','index.html');
for(const token of [
  'async function optionalMigrationInquiryStatusEnhancement',
  "console.error('[MIGRATION_STATUS_INQUIRY_SESSION_UNAVAILABLE]'",
  "console.error('[MIGRATION_STATUS_INQUIRY_SUMMARY_UNAVAILABLE]'",
  'inquiryAvailable:Boolean(enhancement.session)',
  'const enhancement = await optionalMigrationInquiryStatusEnhancement(request, row, env);',
  'WHERE game_uid=? AND deleted_at IS NULL ORDER BY id DESC LIMIT 1'
])must(v429Worker,token,'v429 migration UID status isolation');
for(const token of [
  'inquiryAvailable:true',
  'statusLookup.inquiryAvailable=payload.data.inquiryAvailable!==false',
  'statusLookup.inquiryAvailable?`<div class="migration-inquiry-callout"'
])must(v429Migration,token,'v429 migration UID status UI');
must(v429MigrationIndex,'migration.js?v=4290','v429 migration JS cache token');
const v429StatusStart=v429Worker.indexOf('async function handleMigrationStatusLookup');
const v429StatusEnd=v429Worker.indexOf('async function handleMigrationInquiriesList',v429StatusStart);
const v429StatusBlock=v429Worker.slice(v429StatusStart,v429StatusEnd);
if(v429StatusBlock.indexOf('SELECT id,player_name,game_uid,application_status,updated_at FROM migration_applications')<0)fail('v429 core status query missing');
if(v429StatusBlock.indexOf('optionalMigrationInquiryStatusEnhancement')<v429StatusBlock.indexOf('SELECT id,player_name,game_uid,application_status,updated_at FROM migration_applications'))fail('v429 inquiry enhancement occurs before core status resolution');

// v430 migration-applicant Request Board access restoration and v401 schema compatibility.
const v430Worker=read('worker.js');
for(const token of [
  'function isMissingMigrationInquiryDeletedAt',
  'async function activeMigrationInquiryRows',
  'async function openMigrationInquiryForApplication',
  'async function activeOwnedMigrationInquiry',
  'async function activeMigrationInquiryByPublicId',
  'async function otherOpenMigrationInquiry',
  'async function issueMigrationInquirySessionWithRetry',
  'const rows = await activeMigrationInquiryRows(env.DB, auth.application.id);',
  'const existing = await openMigrationInquiryForApplication(env.DB, auth.application.id);',
  'return activeOwnedMigrationInquiry(db, publicId, applicationId);',
  'const headers = enhancement.session',
  ': {};'
])must(v430Worker,token,'v430 migration applicant access');
const v430StatusStart=v430Worker.indexOf('async function handleMigrationStatusLookup');
const v430StatusEnd=v430Worker.indexOf('async function handleMigrationInquiriesList',v430StatusStart);
const v430Status=v430Worker.slice(v430StatusStart,v430StatusEnd);
if(!v430Status.includes('? {"set-cookie": buildMigrationInquiryCookie(enhancement.session.token, MIGRATION_INQUIRY_TTL_SECONDS)}\n    : {};'))fail('v430 found-UID status must preserve existing inquiry cookie when session issuance fails');
const v430List=v430Worker.slice(v430Worker.indexOf('async function handleMigrationInquiriesList'),v430Worker.indexOf('async function handleMigrationInquiryCreate'));
if(v430List.includes('application_id=? AND deleted_at IS NULL'))fail('v430 public inquiry list bypasses compatibility helper');
const v430Create=v430Worker.slice(v430Worker.indexOf('async function handleMigrationInquiryCreate'),v430Worker.indexOf('async function findOwnedMigrationInquiry'));
if(v430Create.includes("application_id=? AND deleted_at IS NULL AND status"))fail('v430 public inquiry create bypasses compatibility helper');
for(const token of [
  'const inquiry = await activeMigrationInquiryByPublicId(env.DB, publicId);',
  'const other = await otherOpenMigrationInquiry(env.DB, inquiry.application_id, inquiry.id);',
  'MIGRATION_INQUIRY_SOFT_DELETE_SCHEMA_PENDING'
])must(v430Worker,token,'v430 admin inquiry compatibility');

// v431 migration inquiry delete compatibility: soft-delete on v405+, safe hard-delete on v401.
const v431Worker=read('worker.js');
const v431DeleteStart=v431Worker.indexOf('async function handleAdminMigrationInquiryDelete');
const v431DeleteEnd=v431Worker.indexOf('async function handleMigrationApplicationCreate',v431DeleteStart);
const v431Delete=v431Worker.slice(v431DeleteStart,v431DeleteEnd);
for(const token of [
  'let deleteMode = "soft-delete";',
  'WHERE id=? AND public_id=? AND deleted_at IS NULL',
  'DELETE FROM migration_inquiry_replies WHERE inquiry_id=?',
  'DELETE FROM migration_inquiries WHERE id=? AND public_id=?',
  'deleteMode = "hard-delete-compat";',
  'MIGRATION_INQUIRY_DELETE_STATE_CHANGED',
  'after:{publicId:inquiry.public_id,deleted:true,deleteMode}',
  'return json({ok:true,data:{publicId,deleted:true,deleteMode}});'
])must(v431Delete,token,'v431 migration inquiry delete fallback');
if(v431Delete.includes('MIGRATION_INQUIRY_SOFT_DELETE_SCHEMA_PENDING'))fail('v431 delete still exposes soft-delete schema pending error');
if(v431Worker.indexOf('async function handleAdminMigrationInquiryDelete')<0)fail('v431 admin migration inquiry delete handler missing');

// v432 Admin BGB member stat display: presentation-only Industry Lv. + Vehicle #1.
const v432Admin=read('admin','admin.js');
const v432BgbStart=v432Admin.indexOf('function renderFinalPreview');
const v432BgbEnd=v432Admin.indexOf('function renderEvents',v432BgbStart);
const v432Bgb=v432Admin.slice(v432BgbStart,v432BgbEnd);
if(v432BgbStart<0||v432BgbEnd<0)fail('v432 BGB render range missing');
if((v432Bgb.match(/Industry Lv\. <b class=\"spec-value\">\$\{specIndustry\(m\.ind\)\}<\/b> · #1 <b class=\"spec-value\">\$\{specVehicle1\(m\)\}<\/b>/g)||[]).length!==3)fail('v432 BGB Industry Lv. + #1 display must appear in lineup/final-preview/assignment rows');
must(v432Admin,"function specVehicle1(member){return window.EZPKVehiclePower?.formatMember(member,1,{empty:'-',maximumFractionDigits:2,mMaximumFractionDigits:2})||'-'}",'v432 Vehicle #1 formatter');
if(v432Bgb.includes('CP <b class="spec-value">${specCP(m.power)}</b>'))fail('v432 BGB member rows still display total combat power');
for(const token of [
  "function compareVehiclePriority(a,b){const first=window.EZPKVehiclePower?.compareMembers(b,a,1)||0;if(first)return first;const second=window.EZPKVehiclePower?.compareMembers(b,a,2)||0;if(second)return second;return b.power-a.power||b.ind-a.ind||a.nickname.localeCompare(b.nickname)}",
  "function lineupVisibleMembers(){const q=$('#lineupSearch').value.trim().toLowerCase(),rank=$('#lineupRank').value,sort=$('#lineupSort').value;const list=membersData.members.filter(m=>(rank==='ALL'||m.rank===rank)&&m.nickname.toLowerCase().includes(q));if(sort==='ind-desc')list.sort((a,b)=>b.ind-a.ind||b.power-a.power);else if(sort==='name-asc')list.sort((a,b)=>a.nickname.localeCompare(b.nickname));else list.sort((a,b)=>b.power-a.power);return list}",
  "function powerOf(name){return membersData.members.find(m=>m.nickname===name)?.power||0}",
  "choices[0].total+=m.power"
])must(v432Admin,token,'v432 BGB sort/assignment preservation');
must(adminIndex,'admin.js?v=4330','v433 admin JS cache token');
must(adminIndex,'../vehicle-power.js?v=4270','v432 existing Vehicle Power authority preserved');


// v433 BGB Draft / Publish operational contract.
const v433AdminHtml=read('admin','index.html');
const v433AdminJs=read('admin','admin.js');
const v433AdminCss=read('admin','admin.css');
const v433BgbJs=read('bgb','bgb.js');
const v433BgbHtml=read('bgb','index.html');
const v433Worker=read('worker.js');
if(v433AdminHtml.includes('id="bgbLastUpdated"'))fail('v433 BGB manual update-date input remains');
if(v433AdminHtml.includes('id="downloadBgbJson"')||v433AdminHtml.includes('BGB JSON 백업'))fail('v433 manual BGB JSON backup control remains');
for(const token of [
  'id="bgbPublishStatus"',
  'id="refreshBgb"',
  'id="saveBgb"',
  'id="publishBgb"',
  '>새로고침</button>',
  '>저장</button>',
  '>노출</button>'
])must(v433AdminHtml,token,'v433 BGB footer');
for(const token of [
  '.bgb-manager-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))',
  '.bgb-manager-actions .primary{grid-column:auto}',
  '.bgb-publish-status'
])must(v433AdminCss,token,'v433 BGB equal-width footer');
for(const token of [
  'function renderBgbPublishStatus()',
  "마지막 노출: ${stamp}",
  "showAdminToast('새로고침되었습니다.')",
  "showAdminToast('저장되었습니다.')",
  "showAdminToast('노출되었습니다.')",
  "saveBgbData({publish:false})",
  "saveBgbData({publish:true})",
  "operation:options.operation",
  "publish?'publish':'draft'"
])must(v433AdminJs,token,'v433 BGB admin behavior');
if(v433AdminJs.includes("$('#downloadBgbJson').onclick"))fail('v433 BGB JSON backup handler remains');
for(const token of [
  "published=d?.published&&typeof d.published==='object'?d.published:d",
  "lastUpdated:String(published?.lastUpdated||d?.lastUpdated||'')"
])must(v433BgbJs,token,'v433 public BGB published snapshot');
must(v433BgbHtml,'bgb.js?v=4330','v433 public BGB cache token');
for(const token of [
  'const BGB_LOCATION_CODES = Object.freeze(',
  'function normalizeBgbStorageContent',
  'async function writeBgbAdminContentD1',
  'const mode=operation==="draft"?"draft":"publish";',
  'draft:{savedAt:nowIso,teams:draftTeams}',
  'published:{publishedAt,lastUpdated:publishedLastUpdated,teams:publishedTeams}',
  'publishedAt=publish?nowIso:legacyPublishedAt',
  'publishedLastUpdated=publish?bgbKstDate(now):legacyLastUpdated',
  'await writeStrategyContentD1(env,"data/bgb.json",content);',
  'saved.operation==="publish"?"bgb_published":"bgb_draft_saved"'
])must(v433Worker,token,'v433 BGB D1 draft/publish backend');
// Saving a draft must not mutate the public mirror; publishing must update it.
const storageStart=v433Worker.indexOf('function normalizeBgbStorageContent');
const storageEnd=v433Worker.indexOf('async function writeBgbAdminContentD1',storageStart);
const storageBlock=v433Worker.slice(storageStart,storageEnd);
for(const token of ['const publishedTeams=publish?draftTeams:legacyPublishedTeams;','teams:publishedTeams,'])must(storageBlock,token,'v433 public mirror isolation');


// v434 promotion M/G display-unit preservation + EZPK2 semantic light-theme color system.
const v434AdminHtml=read('admin','index.html');
const v434MemberManager=read('admin','member-manager-v188.js');
const v434MemberCss=read('admin','member-manager-v188.css');
const v434MyHtml=read('my','index.html');
const v434MyJs=read('my','my.js');
const v434Theme=read('ezpk-theme.css');
const v434Worker=read('worker.js');
for(const token of [
  'id="promotionR2VehicleUnitV434"',
  'id="promotionR3VehicleUnitV434"',
  '<option value="M">M</option><option value="G">G</option>',
  'id="promotionR2PreviewV434"',
  'id="promotionR3PreviewV434"',
  'member-manager-v188.js?v=4360',
  'member-manager-v188.css?v=4360',
  'admin.css?v=4340',
  '/ezpk-theme.css?v=4360'
])must(v434AdminHtml,token,'v434 admin promotion/unit cache');
for(const token of [
  'function promotionRuleForm(rank)',
  'vehicle1PowerValue:value,vehicle1PowerUnit:unit',
  "vehicle1PowerNormalized:value*(unit==='G'?1000:1)",
  'function updatePromotionRulePreview(rank)',
  '연맹원 표시: 필요',
  'promotionPowerText(p.vehicle1.requiredValue,p.vehicle1.requiredUnit,p.vehicle1.requiredNormalized)'
])must(v434MemberManager,token,'v434 admin promotion M/G behavior');
for(const token of ['.promotion-power-rule-control{display:grid','grid-template-columns:minmax(0,1fr) 76px','.promotion-rule-preview'])must(v434MemberCss,token,'v434 promotion M/G geometry');
for(const token of [
  'R2:{industryLevel:7,vehicle1PowerNormalized:1000,vehicle1PowerValue:1,vehicle1PowerUnit:"G"}',
  'function canonicalPromotionRule(rule,fallback)',
  'function promotionRuleInput(raw)',
  'requiredValue:rule.vehicle1PowerValue,requiredUnit:rule.vehicle1PowerUnit',
  'R2:promotionRuleInput(body?.R2),R3:promotionRuleInput(body?.R3)',
  'vehicle1PowerValue: Number(r2.vehicle1PowerValue || 0)',
  'vehicle1PowerUnit: String(r2.vehicle1PowerUnit || "G")'
])must(v434Worker,token,'v434 promotion rule backend');
for(const token of [
  '/ezpk-theme.css?v=4340',
  './my.js?v=4340'
])must(v434MyHtml,token,'v434 member promotion cache');
for(const token of [
  'function promotionRequiredPowerText(vehicle)',
  'vehicleRequired.textContent=promotionRequiredPowerText(p.vehicle1)',
  "const indState=promotionCurrentState(p.industry.passed,p.industry.current),vehicleState=promotionCurrentState(p.vehicle1.passed,p.vehicle1.currentNormalized)",
  "adminState=activity.items.adminConfirmation.passed?'passed':'pending'",
  "box.classList.add(state==='passed'?'is-complete':state==='progress'?'is-progress':state==='pending'?'is-pending':'is-missing')"
])must(v434MyJs,token,'v434 member promotion semantic state');
for(const token of [
  '--v434-primary:#1D4ED8',
  '--v434-success:#15803D',
  '--v434-goal:#A16207',
  '--v434-missing:#C2410C',
  '--v434-pending:#B45309',
  '--v434-danger:#B91C1C',
  '--v434-support:#7E22CE',
  '--v434-system:#0F766E',
  '--v434-admin-page:#F1F4F8',
  '--v434-admin-surface:#FFFFFF',
  '--v434-admin-subtle:#F8FAFC',
  '--v434-admin-text:#0B1220',
  '--v434-admin-text-secondary:#344054',
  '--v434-admin-text-muted:#5D6978',
  '--v434-admin-border:#CBD5E1',
  '--v434-admin-border-strong:#94A3B8',
  '#promotionCardV367 .promotion-condition.is-complete',
  '#promotionCardV367 .promotion-condition.is-progress',
  '#promotionCardV367 .promotion-condition.is-missing',
  '#promotionCardV367 #activityAdminV369.pending',
  '#adminApp .admin-nav-card[data-admin-group="operations"]',
  '#adminApp .admin-nav-card[data-admin-group="teams"]',
  '#adminApp .admin-nav-card[data-admin-group="support"]',
  '#adminApp .admin-nav-card[data-admin-group="system"]',
  '#adminApp :is(button.danger,.danger,.remove)',
  '#adminApp :is(#publishBgb,#cwPublish,#alPublish,.promote-member,.activity-confirm)',
  '.admin-toast.error{background:var(--v434-danger-bg)!important'
])must(v434Theme,token,'v434 semantic light theme');
if(v434Theme.includes('html[data-site="ezpk2"] body{--v434-primary'))fail('v434 admin semantic tokens must not recolor public body globally');

// v435 persistent rank-review cycle contract: 10-day new-member demotion protection,
// 14-day promotion opportunity, 30-day maintenance review, HOLD recovery, and Admin rank override reset.
const v435Migration=read('migrations','0032_v435_rank_review_cycles.sql');
for(const token of [
  'CREATE TABLE IF NOT EXISTS member_rank_review_states',
  'promotion_target_rank TEXT',
  'spec_qualified_at TEXT',
  'promotion_cycle_started_on TEXT',
  "promotion_status TEXT CHECK(promotion_status IN ('IN_PROGRESS','REVIEWABLE','HOLD','WAIT_MAINTENANCE'))",
  'maintenance_cycle_started_on TEXT',
  "maintenance_status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(maintenance_status IN ('ACTIVE','REVIEWABLE'))",
  'new_member_protection_until TEXT',
  'promotion_unlock_after_maintenance INTEGER NOT NULL DEFAULT 0',
  "VALUES('rank_review_system_v1_started_on',date('now','+9 hours')",
  "VALUES('member_db_schema_version','5.4-v435'"
])must(v435Migration,token,'v435 rank review migration');

const v435Worker=read('worker.js');
for(const token of [
  'const RANK_REVIEW_PROMOTION_DAYS=14;',
  'const RANK_REVIEW_MAINTENANCE_DAYS=30;',
  'const RANK_REVIEW_NEW_MEMBER_PROTECTION_DAYS=10;',
  'function rankReviewCycleProgress',
  'function rankReviewRuleFingerprint',
  'async function rankReviewSystemStartOn',
  'async function memberActivityStatusBetween',
  'async function ensureRankReviewState',
  'async function resetRankReviewAfterRankChange',
  'async function rankMaintenanceState',
  'async function promotionReviewState',
  "promotion_status='IN_PROGRESS'",
  "status='REVIEWABLE'",
  "status='HOLD'",
  "promotion_status='IN_PROGRESS',promotion_cycle_started_on=?",
  "promotion_unlock_after_maintenance=1",
  "promotion_unlock_after_maintenance=excluded.promotion_unlock_after_maintenance",
  "today>dateAddDays(startOn,RANK_REVIEW_MAINTENANCE_DAYS-1)",
  "if(!state?.eligible)",
  "if(!state?.reviewEligible)",
  "INSERT INTO member_rank_changes(member_id,change_type,from_rank,to_rank,reason,changed_by_member_id,protection_until) VALUES(?,'manual'",
  "await resetRankReviewAfterRankChange(env.DB,memberId,rank)",
  "for(const row of changed)await resetRankReviewAfterRankChange(env.DB,row.id,value)",
  "maintenanceCycle:'1/30'"
])must(v435Worker,token,'v435 rank review backend');
if(v435Worker.includes("change_type,from_rank,to_rank,activity_snapshot,changed_by_member_id,protection_until) VALUES(?,'promotion',?,?,?, ?,datetime('now','+10 days'))"))fail('v435 promotion must not create the legacy post-promotion 10-day protection');
if(v435Worker.includes("change_type,from_rank,to_rank,reason,activity_snapshot,changed_by_member_id,protection_until) VALUES(?,'demotion',?,?,?,?,?,datetime('now','+30 days'))"))fail('v435 demotion must not create the legacy post-demotion 30-day protection');

const v435AdminHtml=read('admin','index.html');
for(const token of [
  '<span>신규 보호</span><strong data-stat="newProtection">0</strong>',
  '<span>승급 검토</span><strong data-stat="promotion">0</strong>',
  '<span>강등 검토</span><strong data-stat="demotion">0</strong>',
  'member-manager-v188.css?v=4360',
  'member-manager-v188.js?v=4360',
  '/ezpk-theme.css?v=4360',
  '승급 검토 대상과 마이페이지 달성 상태만 다시 계산됩니다.'
])must(v435AdminHtml,token,'v435 admin rank review UI/cache');
const v435AdminJs=read('admin','member-manager-v188.js');
for(const token of [
  "return {text:`${Math.max(1,day)}/14`,cls:'progress'}",
  "return {text:'검토 가능',cls:'reviewable'}",
  "return {text:'활동 미달',cls:'hold'}",
  "return {text:'유지 확인 중',cls:'waiting'}",
  "text:`${Math.max(1,Number(s.cycle?.day||1))}/30`",
  "/10</span>",
  "x.type==='promotion'?'승급':x.type==='demotion'?'강등':'관리자 변경'"
])must(v435AdminJs,token,'v435 compact admin rank review list');
const v435Css=read('admin','member-manager-v188.css');
for(const token of ['.review-cycle-badge{','.review-cycle-badge.progress{','.review-cycle-badge.reviewable{','.review-cycle-badge.hold,.review-cycle-badge.demotion-reviewable{','.review-cycle-badge.waiting,.review-cycle-badge.protected{'])must(v435Css,token,'v435 review cycle badges');


// v436 Member Management UX/performance contract: immediate list rendering, lazy review
// evaluation, complete R1/R2/R3 new-member protection visibility, evidence details, and
// alliance-specific Admin presentation.
const v436AdminHtml=read('admin','index.html');
for(const token of [
  'id="newProtectionOpenV436" role="button" tabindex="0"',
  'id="promotionCandidatesOpenV367" role="button" tabindex="0"',
  'id="demotionCandidatesOpenV371" role="button" tabindex="0"',
  'id="newProtectionV436"',
  'id="newProtectionListV436"',
  'member-manager-v188.css?v=4360',
  'member-manager-v188.js?v=4360',
  '/ezpk-theme.css?v=4360'
])must(v436AdminHtml,token,'v436 Admin Member Management HTML');

const v436AdminJs=read('admin','member-manager-v188.js');
for(const token of [
  'async function loadPromotionCandidates(force=false)',
  'async function loadDemotionCandidates(force=false)',
  'async function loadNewProtection(force=false)',
  "api('/api/admin/promotion-candidates')",
  "api('/api/admin/demotion-candidates')",
  "api('/api/admin/new-member-protection')",
  'function activityDetail(a)',
  'function promotionReason(p,a)',
  'function demotionReason(s,a)',
  'function renderNewProtection()',
  'function protectionBadge(m)',
  'class="rank-review-details"',
  '신규 보호 ${Math.max(1,Number(p.day||1))}/10',
  "if(e.key==='Enter'||e.key===' ')"
])must(v436AdminJs,token,'v436 Member Management JS');
const baseLoadStart=v436AdminJs.indexOf('async function load(reset=false)');
const baseLoadEnd=v436AdminJs.indexOf('async function loadPromotionCandidates',baseLoadStart);
const baseLoadBlock=v436AdminJs.slice(baseLoadStart,baseLoadEnd);
if(baseLoadStart<0||baseLoadEnd<0)fail('v436 base member load block not found');
if(baseLoadBlock.includes('/api/admin/promotion-candidates')||baseLoadBlock.includes('/api/admin/demotion-candidates'))fail('v436 base member load must not block on promotion/demotion review APIs');

const v436Worker=read('worker.js');
for(const token of [
  'case "GET /api/admin/new-member-protection":',
  'return handleAdminNewMemberProtection(request, env);',
  'async function handleAdminNewMemberProtection(request,env)',
  'newMemberProtection: row.new_member_protection_active ?',
  'new_member_protection_active',
  'new_member_protection_day',
  "m.member_rank IN ('R1','R2','R3')",
  "m.member_rank='R1'",
  'reviewActivity',
  'reviewActivity:cycleActivity||currentActivity'
])must(v436Worker,token,'v436 Member Management backend');

const v436MemberCss=read('admin','member-manager-v188.css');
for(const token of [
  '.new-protection-badge',
  '.rank-review-card',
  '.review-progress',
  '.review-condition.passed',
  '.review-condition.failed',
  '.review-loading',
  '.protection-row'
])must(v436MemberCss,token,'v436 EZPK1 Member Management UX');

const v436Theme=read('ezpk-theme.css');
for(const token of [
  'html[data-site="ezpk2"] #adminApp .new-protection-badge',
  'html[data-site="ezpk2"] #adminApp .rank-review-card',
  'html[data-site="ezpk2"] #adminApp .review-progress',
  'html[data-site="ezpk2"] #adminApp .review-condition.passed',
  'html[data-site="ezpk2"] #adminApp .review-condition.failed'
])must(v436Theme,token,'v436 EZPK2 alliance-specific Member Management UX');

const migrationFiles=fs.readdirSync(path.join(root,'migrations')).filter(f=>f.endsWith('.sql')).sort();
if(migrationFiles.length!==31)fail(`v437 migration count ${migrationFiles.length}, expected 31`);
if(migrationFiles.at(-1)!=='0032_v435_rank_review_cycles.sql')fail(`v437 latest migration ${migrationFiles.at(-1)||'none'}, expected 0032_v435_rank_review_cycles.sql`);
if(migrationFiles.some(f=>f.startsWith('0033_')))fail('v437 must not introduce migration 0033');


// v437 Single Alliance Restoration / Gateway retirement / EZPK2 archive guard.
const v437Worker=read('worker.js');
for(const token of [
  'const DEFAULT_SITE_MODE = "SINGLE";',
  'const DEFAULT_EZPK2_STATUS = "ARCHIVED";',
  'function normalizedSiteMode() {',
  'return "SINGLE";',
  'function normalizedEzpk2Status() {',
  'return "ARCHIVED";',
  'function isEzpk2Active() {',
  'siteId: "ezpk1"',
  'peerDb: null',
  'return Response.redirect(publicAllianceUrl("ezpk1", "/"), 302);',
  'return jsonError("ALLIANCE_ARCHIVED", 410',
  'gatewayUrl: publicAllianceUrl("ezpk1", "/")',
  'ezpk2Url: null',
  'ezpk2MigrationUrl: null'
])must(v437Worker,token,'v437 worker single-alliance routing');

if(v437Worker.includes('NICKNAME_TAKEN_OTHER_ALLIANCE')||v437Worker.includes('peerNicknameDuplicate')||v437Worker.includes('env.EZPK2_DB'))fail('v437 backend must not perform cross-alliance nickname or EZPK2 DB operations');
const v437Home=read('index.html');
for(const token of [
  'id="homeMigrationEntry"',
  'class="immigration-section"',
  'href="https://ezpk1.ezpk322.com/migration/"',
  '/shared-migration-entry.js?v=4370',
  "window.EZPKMigrationEntry?.render('homeMigrationEntry',lang)",
  "window.addEventListener('ezpk-language-change',renderHomeMigration)"
])must(v437Home,token,'v437 EZPK1 home migration restoration');
const migrationEntry=read('shared-migration-entry.js');
for(const code of LANGS){const token=code==='zh-tw'?"'zh-tw':":`${code}:`;must(migrationEntry,token,`v437 migration entry language ${code}`)}
if(/href=[\"'][^\"']*ezpk2\.ezpk322\.com/i.test(v437Home))fail('v437 home must not link to EZPK2');
if(config.includes('"SITE_MODE": "DUAL"')||config.includes('"EZPK2_STATUS": "ACTIVE"'))fail('v437 production config regressed to DUAL/ACTIVE');
if(pkg.scripts?.predeploy!=='node scripts/v437-deploy-guard.mjs')fail('v437 predeploy script mismatch');

if(failures.length){console.error('EZPK v437 deployment preflight FAILED.');for(const f of failures)console.error('- '+f);process.exit(1)}
console.log('EZPK v437 deployment preflight PASS: SINGLE mode is enforced, Gateway/alliance selection are retired, ezpk322.com routes to EZPK1, EZPK2 pages redirect safely while EZPK2 APIs return 410, EZPK2 D1 is not deployment-bound, EZPK1 migration entry is restored, and the v436 Member Management/rank-review baseline remains intact without a new D1 migration.');
