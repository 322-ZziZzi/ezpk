(function(){'use strict';const $=s=>document.querySelector(s);if(!$('#accountsPanel'))return;
const TEMPLATE=`ACCOUNT REGISTRATION

Server:
Industry Level:
VIP:
Total CP:

1st Troop Type: Fighter / Shooter / Rider
1st Troop CP:
1st Troop Resonance: 1~10

2nd Troop Type: Fighter / Shooter / Rider
2nd Troop CP:
2nd Troop Resonance: 1~10

Frost Pet Level:
Titan Pet Level:
Shelter Skins:

Desired Price:
Negotiable: Y / N
Email Change Available: Y / N

Contact Type: Discord / In-game DM
Contact ID:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📢 ACCOUNT LISTING OPTIONS

🆓 Standard Listing
Price: FREE

• Standard listing
• Normal display
• Listed in chronological order

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⭐ Premium Listing

7 Days  — $5
15 Days — $8
30 Days — $10 ⭐ Best Value

Benefits

✔ Premium Badge
✔ Gold Border
✔ Priority Placement
✔ Premium Detail Page
✔ Automatic Expiration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Premium listings are displayed before standard listings while active.
After expiration, they automatically return to a standard listing.`;
const fields=[['server','Server'],['industryLevel','Industry Level'],['vip','VIP'],['totalCp','Total CP'],['troop1Type','1st Troop Type'],['troop1Cp','1st Troop CP'],['troop1Resonance','1st Troop Resonance'],['troop2Type','2nd Troop Type'],['troop2Cp','2nd Troop CP'],['troop2Resonance','2nd Troop Resonance'],['frostPetLevel','Frost Pet Level'],['titanPetLevel','Titan Pet Level'],['shelterSkins','Shelter Skins'],['desiredPrice','Desired Price'],['negotiable','Negotiable'],['emailChangeAvailable','Email Change Available'],['contactType','Contact Type'],['contactId','Contact ID']];let state={lastNumber:0,accounts:[]},sha='';
function esc(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}function normYes(v){let x=String(v).trim().toLowerCase();if(['y','yes','예','네','가능','oui','sim','có','نعم','はい','ใช่','是'].includes(x))return'Y';if(['n','no','아니오','불가','non','não','không','لا','いいえ','ไม่','否'].includes(x))return'N';return String(v).trim().toUpperCase().startsWith('Y')?'Y':String(v).trim().toUpperCase().startsWith('N')?'N':String(v).trim()}function normalize(k,v){v=String(v||'').trim();if(k==='server')return v.replace(/^#/,'').replace(/server\s*/i,'').trim();if(k==='industryLevel'){let m=v.match(/\d+/);return m?'i'+m[0]:v}if(k==='vip'){let m=v.match(/\d+/);return m?m[0]:v}if(k==='frostPetLevel'||k==='titanPetLevel')return v.replace(/^(lv\.?|level)\s*/i,'');if(k==='negotiable'||k==='emailChangeAvailable')return normYes(v);if(k==='troop1Type'||k==='troop2Type'){let map={전사:'Fighter',사수:'Shooter',기병:'Rider',파이터:'Fighter',슈터:'Shooter',라이더:'Rider'};return map[v]||v}return v}
function toLocalInput(v){if(!v)return'';let d=new Date(v);if(isNaN(d))return'';d=new Date(d.getTime()-d.getTimezoneOffset()*60000);return d.toISOString().slice(0,16)}function premiumActive(a){return a?.premium===true&&a.premiumExpiresAt&&new Date(a.premiumExpiresAt).getTime()>Date.now()}function renderFields(){ $('#accountFields').innerHTML=fields.map(([k,l])=>`<label>${l}<input data-account-field="${k}" value=""></label>`).join('')+`<section class="premium-admin-controls"><label class="premium-check"><input id="accountPremium" type="checkbox"><span>Premium 활성화</span></label><label>Premium 기간<select id="premiumDuration"><option value="7">7일</option><option value="15">15일</option><option value="30">30일</option></select></label><label>Premium 만료일<input id="premiumExpiresAt" type="datetime-local"></label><p>기간 선택 시 현재 시각부터 만료일이 자동 계산됩니다.</p></section>`;let check=$('#accountPremium'),duration=$('#premiumDuration'),expiry=$('#premiumExpiresAt');let update=()=>{if(!check.checked){expiry.value='';return}let d=new Date();d.setDate(d.getDate()+Number(duration.value||7));expiry.value=toLocalInput(d)};check.onchange=()=>{if(check.checked&&!expiry.value)update();if(!check.checked)expiry.value=''};duration.onchange=update}function getForm(){let o={};fields.forEach(([k])=>o[k]=normalize(k,$(`[data-account-field="${k}"]`).value));o.premium=$('#accountPremium').checked;o.premiumDurationDays=o.premium?Number($('#premiumDuration').value||7):0;o.premiumStartedAt=o.premium?new Date().toISOString():'';o.premiumExpiresAt=o.premium&&$('#premiumExpiresAt').value?new Date($('#premiumExpiresAt').value).toISOString():'';return o}function setForm(o){fields.forEach(([k])=>{let e=$(`[data-account-field="${k}"]`);if(e)e.value=o[k]||''});$('#accountPremium').checked=premiumActive(o);$('#premiumDuration').value=String([7,15,30].includes(Number(o.premiumDurationDays))?Number(o.premiumDurationDays):7);$('#premiumExpiresAt').value=premiumActive(o)?toLocalInput(o.premiumExpiresAt):''}
function parse(){let aliases={};fields.forEach(([k,l])=>aliases[l.toLowerCase()]=k);let out={};$('#accountTemplateInput').value.split(/\r?\n/).forEach(line=>{line=line.replace(/^\s*[\p{Extended_Pictographic}\uFE0F\s]+/u,'').trim();let m=line.match(/^([^:：]+)\s*[:：]\s*(.*)$/);if(!m)return;let k=aliases[m[1].trim().toLowerCase()];if(k)out[k]=normalize(k,m[2])});setForm(out);$('#accountParseStatus').textContent=Object.keys(out).length?`${Object.keys(out).length}개 항목을 불러왔습니다.`:'인식된 항목이 없습니다.'}
function renderList(){let e=$('#accountAdminList');if(!state.accounts.length){e.innerHTML='<p class="help">등록된 계정이 없습니다.</p>';return}e.innerHTML=[...state.accounts].sort((a,b)=>Number(premiumActive(b))-Number(premiumActive(a))||b.accountNumber-a.accountNumber).map(a=>{let active=premiumActive(a),expired=a.premium===true&&!active,expiry=a.premiumExpiresAt?new Date(a.premiumExpiresAt).toLocaleString('ko-KR'):'-';return `<article class="account-admin-item${active?' premium-admin-item':''}"><strong>ACCOUNT #${String(a.accountNumber).padStart(3,'0')}</strong><span class="account-admin-summary">Server ${esc(a.server)} · ${esc(a.industryLevel)} · VIP ${esc(a.vip)} · ${esc(a.totalCp)} · ${esc(a.desiredPrice)} ${active?`<b class="premium-status active">PREMIUM · ${esc(expiry)} 만료</b>`:expired?`<b class="premium-status expired">PREMIUM 만료 · ${esc(expiry)}</b>`:''}</span><div class="account-admin-actions"><button data-edit="${a.accountNumber}">EDIT</button><button class="danger" data-delete="${a.accountNumber}">DELETE</button></div></article>`}).join('');e.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{let a=state.accounts.find(x=>x.accountNumber===Number(b.dataset.edit));if(a){setForm(a);$('#registerAccount').dataset.edit=a.accountNumber;$('#registerAccount').textContent='UPDATE ACCOUNT';scrollTo({top:$('#accountsPanel').offsetTop,behavior:'smooth'})}});e.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{let n=Number(b.dataset.delete);if(confirm(`ACCOUNT #${String(n).padStart(3,'0')}을 삭제할까요? 계정번호는 재사용되지 않습니다.`)){state.accounts=state.accounts.filter(x=>x.accountNumber!==n);renderList()}})}
function cfg(){return{owner:$('#owner').value.trim(),repo:$('#repo').value.trim(),branch:$('#branch').value.trim()||'main',token:$('#token').value.trim()}}function decode(b64){let bin=atob(b64.replace(/\n/g,''));return new TextDecoder().decode(Uint8Array.from(bin,c=>c.charCodeAt(0)))}function encode(s){let bytes=new TextEncoder().encode(s),bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin)}async function ghGet(){let c=cfg();if(!c.token)throw Error('GitHub Token을 입력하세요.');let r=await fetch(`https://api.github.com/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/data/accounts.json?ref=${encodeURIComponent(c.branch)}`,{headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${c.token}`,'X-GitHub-Api-Version':'2022-11-28'}});if(r.status===404)return{sha:'',data:{lastNumber:0,accounts:[]}};if(!r.ok)throw Error(`Accounts GitHub 불러오기 실패 (${r.status})`);let j=await r.json();return{sha:j.sha,data:JSON.parse(decode(j.content))}}async function ghPut(){let c=cfg();if(!c.token)throw Error('GitHub Token을 입력하세요.');const latest=await ghGet();sha=latest.sha;const url=`https://api.github.com/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/data/accounts.json`;const makeBody=()=>{let body={message:`Update EZPK accounts ${new Date().toISOString().slice(0,10)}`,content:encode(JSON.stringify(state,null,2)),branch:c.branch};if(sha)body.sha=sha;return body};let r=await fetch(url,{method:'PUT',headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${c.token}`,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},body:JSON.stringify(makeBody())});if(r.status===409||r.status===422){const retry=await ghGet();sha=retry.sha;r=await fetch(url,{method:'PUT',headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${c.token}`,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},body:JSON.stringify(makeBody())})}if(!r.ok){let detail='';try{let j=await r.json();detail=j.message||JSON.stringify(j)}catch(e){detail=await r.text()}throw Error(`Accounts GitHub 저장 실패 (${r.status})${detail?`: ${detail}`:''}`)}let saved=await r.json();sha=saved.content&&saved.content.sha?saved.content.sha:sha;return saved}
async function loadLocal(){try{let r=await fetch('../data/accounts.json?v='+Date.now(),{cache:'no-store'});if(r.ok)state=await r.json()}catch(e){}state.lastNumber=Number(state.lastNumber||0);state.accounts=Array.isArray(state.accounts)?state.accounts:[];renderList()}
renderFields();$('#accountTemplateInput').value=TEMPLATE;loadLocal();$('#copyAccountTemplate').onclick=async()=>{await navigator.clipboard.writeText(TEMPLATE);$('#templateActionStatus').textContent='양식을 클립보드에 복사했습니다.'};$('#downloadAccountTemplate').onclick=()=>{let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([TEMPLATE],{type:'text/plain;charset=utf-8'}));a.download='EZPK-Account-Registration-Template.txt';a.click();URL.revokeObjectURL(a.href);$('#templateActionStatus').textContent='TXT 양식을 다운로드했습니다.'};$('#parseAccountTemplate').onclick=parse;$('#resetAccountForm').onclick=()=>{setForm({});delete $('#registerAccount').dataset.edit;$('#registerAccount').textContent='REGISTER ACCOUNT';$('#accountTemplateInput').value=TEMPLATE};$('#registerAccount').onclick=()=>{let o=getForm(),edit=Number($('#registerAccount').dataset.edit||0);if(!o.server||!o.desiredPrice||!o.contactId){$('#accountParseStatus').textContent='Server, Desired Price, Contact ID는 필수입니다.';return}if(edit){let i=state.accounts.findIndex(a=>a.accountNumber===edit);if(i>=0){let prev=state.accounts[i];if(o.premium&&prev.premiumExpiresAt===o.premiumExpiresAt)o.premiumStartedAt=prev.premiumStartedAt||o.premiumStartedAt;state.accounts[i]={...prev,...o}}}else{state.lastNumber+=1;state.accounts.push({...o,accountNumber:state.lastNumber,postedDate:new Date().toISOString()})}setForm({});delete $('#registerAccount').dataset.edit;$('#registerAccount').textContent='REGISTER ACCOUNT';$('#accountTemplateInput').value=TEMPLATE;$('#accountParseStatus').textContent='계정 정보를 목록에 반영했습니다. 모든 변경사항 저장을 눌러 GitHub에 저장하세요.';renderList()};$('#downloadAccountsJson').onclick=()=>{let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download='accounts.json';a.click();URL.revokeObjectURL(a.href)};
$('#loadGithub').addEventListener('click',async()=>{try{let r=await ghGet();sha=r.sha;state=r.data;renderList()}catch(e){console.error(e);setTimeout(()=>alert(e.message),50)}},true);$('#saveAllGithub').addEventListener('click',async()=>{try{await new Promise(r=>setTimeout(r,50));await ghPut()}catch(e){console.error(e);setTimeout(()=>alert(e.message),50)}},true);
})();