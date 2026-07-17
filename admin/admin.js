const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

// v17: initialize the login gate before the rest of the admin manager.
// This keeps login functional even if a later manager feature raises an error.
const ADMIN_PASSWORD='322ezpk';
function showAdminApp(){
  sessionStorage.setItem('ezpk-admin-auth','1');
  const login=document.getElementById('adminLogin');
  const app=document.getElementById('adminApp');
  if(login) login.hidden=true;
  if(app) app.hidden=false;
  document.body.classList.add('admin-unlocked');
}
function showAdminLogin(){
  sessionStorage.removeItem('ezpk-admin-auth');
  const login=document.getElementById('adminLogin');
  const app=document.getElementById('adminApp');
  if(app) app.hidden=true;
  if(login) login.hidden=false;
  document.body.classList.remove('admin-unlocked');
  const input=document.getElementById('adminPassword');
  const status=document.getElementById('loginStatus');
  if(input) input.value='';
  if(status) status.textContent='';
  setTimeout(()=>input?.focus(),0);
}
function initAdminLoginGate(){
  const form=document.getElementById('adminLoginForm');
  const input=document.getElementById('adminPassword');
  const status=document.getElementById('loginStatus');
  const logout=document.getElementById('adminLogout');
  if(!form||!input) return;
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(input.value.trim()===ADMIN_PASSWORD){
      if(status) status.textContent='';
      showAdminApp();
      // Initialize manager data only after successful login.
      try{ restoreToken(); }catch(_e){}
      if(typeof loadLocal==='function') loadLocal().catch(e=>setStatus(e.message,'error'));
    }else{
      if(status) status.textContent='비밀번호가 올바르지 않습니다.';
      input.focus();
      input.select();
    }
  });
  logout?.addEventListener('click',showAdminLogin);
  if(sessionStorage.getItem('ezpk-admin-auth')==='1'){
    showAdminApp();
  }else{
    showAdminLogin();
  }
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initAdminLoginGate,{once:true});
else initAdminLoginGate();
const LOCATIONS=[['R1','REFINERY 1'],['R2','REFINERY 2'],['R3','REFINERY 3'],['R4','REFINERY 4'],['R5','REFINERY 5'],['R6','REFINERY 6'],['M1','MILITARY BASE 1'],['M2','MILITARY BASE 2'],['H1','HOSPITAL 1'],['H2','HOSPITAL 2'],['CENTER','ALLOY FACTORY']];
const TEAM_KEYS=['A','B'];
let membersData={lastUpdated:'',members:[]},bgbData=blankBgb(),eventsData=blankEvents(),memberSha='',bgbSha='',eventsSha='',selectedTeam='A',selectedLocation='R1';
function blankLocations(){return Object.fromEntries(LOCATIONS.map(([c])=>[c,[]]))}
function blankBgb(){return{lastUpdated:'',teams:{A:{members:[],locations:blankLocations()},B:{members:[],locations:blankLocations()}}}}
function blankEvents(){return{lastUpdated:'',timezone:'Asia/Seoul',events:Array.from({length:9},()=>({title:'',start:'',end:'',enabled:false}))}}
function normalizeEvents(d){const out=blankEvents();out.lastUpdated=String(d?.lastUpdated||'');out.timezone='Asia/Seoul';const list=Array.isArray(d?.events)?d.events:[];for(let i=0;i<9;i++){const e=list[i]||{};out.events[i]={title:String(e.title||'').slice(0,60),start:String(e.start||''),end:String(e.end||''),enabled:Boolean(e.enabled)}}return out}
function isoToLocalInput(value){if(!value)return'';const m=String(value).match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);return m?m[1]:''}
function localInputToKst(value){return value?`${value}:00+09:00`:''}
function cfg(){return{owner:$('#owner').value.trim(),repo:$('#repo').value.trim(),branch:$('#branch').value.trim()||'main',token:$('#token').value.trim()}}
function setStatus(msg,type=''){const e=$('#status');e.textContent=msg;e.className='status '+type}
function normalizeMember(m){return{rank:String(m.rank||m.Rank||'R1').toUpperCase(),nickname:String(m.nickname||m.Nickname||'').trim(),ind:Number(m.ind??m.IND??m['Shelter Level']??0),power:Number(String(m.power??m['Combat Power']??0).replaceAll(',',''))}}
function uniqKnown(list){const known=new Set(membersData.members.map(m=>m.nickname));return [...new Set((Array.isArray(list)?list:[]).map(String))].filter(n=>known.has(n))}
function normalizeBgb(d){const out=blankBgb();out.lastUpdated=String(d?.lastUpdated||'');if(d?.teams){TEAM_KEYS.forEach(t=>{out.teams[t].members=uniqKnown(d.teams?.[t]?.members);LOCATIONS.forEach(([c])=>out.teams[t].locations[c]=uniqKnown(d.teams?.[t]?.locations?.[c]).filter(n=>out.teams[t].members.includes(n)))})}else if(d?.locations){out.teams.A.members=uniqKnown(Object.values(d.locations).flat());LOCATIONS.forEach(([c])=>out.teams.A.locations[c]=uniqKnown(d.locations[c]))}return out}
function rememberToken(){const key='ezpk-admin-token';if($('#rememberToken').checked)localStorage.setItem(key,$('#token').value.trim());else localStorage.removeItem(key)}
function restoreToken(){const token=localStorage.getItem('ezpk-admin-token');if(token){$('#token').value=token;$('#rememberToken').checked=true}}
async function loadLocal(){const [mr,br,er]=await Promise.all([fetch('../data/members.json?v='+Date.now(),{cache:'no-store'}),fetch('../data/bgb.json?v='+Date.now(),{cache:'no-store'}),fetch('../data/events.json?v='+Date.now(),{cache:'no-store'})]);if(!mr.ok||!br.ok||!er.ok)throw new Error('현재 홈페이지 데이터를 불러오지 못했습니다.');membersData=await mr.json();membersData.members=(membersData.members||[]).map(normalizeMember);bgbData=normalizeBgb(await br.json());eventsData=normalizeEvents(await er.json());syncInputs();renderAll()}
function syncInputs(){$('#lastUpdated').value=membersData.lastUpdated||'';$('#bgbLastUpdated').value=bgbData.lastUpdated||'';$('#eventsLastUpdated').value=eventsData.lastUpdated||''}
function filteredMembers(){const q=$('#search').value.trim().toLowerCase(),rank=$('#rank').value;return membersData.members.map((m,i)=>({...m,_i:i})).filter(m=>(rank==='ALL'||m.rank===rank)&&m.nickname.toLowerCase().includes(q))}
function replaceNicknameEverywhere(oldName,newName){TEAM_KEYS.forEach(t=>{const team=bgbData.teams[t];team.members=team.members.map(n=>n===oldName?newName:n);for(const c in team.locations)team.locations[c]=team.locations[c].map(n=>n===oldName?newName:n)})}
function removeNicknameEverywhere(name){TEAM_KEYS.forEach(t=>{const team=bgbData.teams[t];team.members=team.members.filter(n=>n!==name);for(const c in team.locations)team.locations[c]=team.locations[c].filter(n=>n!==name)})}
function renderMembers(){const list=filteredMembers();$('#count').textContent=`표시 ${list.length}명 / 전체 ${membersData.members.length}명`;$('#memberRows').innerHTML=list.map(m=>`<tr data-i="${m._i}"><td class="rank-cell"><select data-f="rank">${['R5','R4','R3','R2','R1'].map(r=>`<option ${r===m.rank?'selected':''}>${r}</option>`).join('')}</select></td><td><input data-f="nickname" value="${esc(m.nickname)}"></td><td class="ind-cell"><input data-f="ind" type="number" min="0" value="${m.ind}"></td><td class="power-cell"><input data-f="power" inputmode="numeric" value="${m.power}"></td><td><button class="remove">삭제</button></td></tr>`).join('');$$('#memberRows tr').forEach(tr=>{const i=Number(tr.dataset.i);tr.querySelectorAll('[data-f]').forEach(el=>el.onchange=()=>{const f=el.dataset.f,old=membersData.members[i][f],val=(f==='ind'||f==='power')?Number(String(el.value).replaceAll(',','')):el.value.trim();membersData.members[i][f]=val;if(f==='nickname'&&old!==val)replaceNicknameEverywhere(old,val);tr.classList.add('dirty');renderBgbAll()});tr.querySelector('.remove').onclick=()=>{const name=membersData.members[i].nickname;if(confirm(`${name} 멤버를 삭제할까요?`)){membersData.members.splice(i,1);removeNicknameEverywhere(name);renderAll()}}})}
function currentTeam(){return bgbData.teams[selectedTeam]}
function otherTeam(){return bgbData.teams[selectedTeam==='A'?'B':'A']}
function lineupVisibleMembers(){const q=$('#lineupSearch').value.trim().toLowerCase(),rank=$('#lineupRank').value,sort=$('#lineupSort').value;const list=membersData.members.filter(m=>(rank==='ALL'||m.rank===rank)&&m.nickname.toLowerCase().includes(q));if(sort==='ind-desc')list.sort((a,b)=>b.ind-a.ind||b.power-a.power);else if(sort==='name-asc')list.sort((a,b)=>a.nickname.localeCompare(b.nickname));else list.sort((a,b)=>b.power-a.power);return list}

function selectedLineupMembers(){return currentTeam().members.map(n=>membersData.members.find(m=>m.nickname===n)).filter(Boolean).sort((a,b)=>b.power-a.power||b.ind-a.ind||a.nickname.localeCompare(b.nickname))}
function hasGeneratedAssignments(team=currentTeam()){return LOCATIONS.some(([code])=>(team.locations[code]||[]).length>0)}
function clearAssignmentsForCurrentTeam(){currentTeam().locations=blankLocations();$('#autoSummary').innerHTML=''}
function renderFinalPreview(){const list=selectedLineupMembers();$('#previewCount').textContent=`${list.length} / 20`;$('#previewCount').classList.toggle('complete',list.length===20);$('#finalLineupPreview').innerHTML=list.length?list.map((m,i)=>`<article class="preview-member"><span class="preview-no">${String(i+1).padStart(2,'0')}</span><span><strong>${esc(m.nickname)}</strong><small>${m.rank} · IND. ${m.ind} · ${Number(m.power).toLocaleString()}</small></span></article>`).join(''):'<div class="preview-empty">FINAL LINEUP에 사용할 멤버를 선택하세요. 선택된 멤버는 아직 어떤 위치에도 배정되지 않습니다.</div>'}
function renderTeamTabs(){$$('#bgbTeamTabs button').forEach(b=>b.classList.toggle('active',b.dataset.team===selectedTeam));$('#activeTeamChip').textContent=`${selectedTeam} TEAM`}
function renderLineup(){const team=currentTeam(),other=otherTeam(),list=lineupVisibleMembers();$('#lineupCount').textContent=`${team.members.length} / 20`;$('#lineupCount').classList.toggle('complete',team.members.length===20);$('#lineupMembers').innerHTML=list.map(m=>{const checked=team.members.includes(m.nickname),locked=other.members.includes(m.nickname)&&!checked;return `<label class="lineup-check ${locked?'locked':''}"><input type="checkbox" value="${esc(m.nickname)}" ${checked?'checked':''} ${locked?'disabled':''}><span><strong>${esc(m.nickname)}</strong><small>${m.rank} · IND. ${m.ind} · ${Number(m.power).toLocaleString()}</small></span>${locked?`<em>${selectedTeam==='A'?'B':'A'} TEAM</em>`:''}</label>`}).join('');$$('#lineupMembers input').forEach(cb=>cb.onchange=()=>{const team=currentTeam();if(cb.checked&&team.members.length>=20){cb.checked=false;alert('최종 참전 멤버는 20명까지만 선택할 수 있습니다.');return}if(cb.checked)team.members.push(cb.value);else team.members=team.members.filter(n=>n!==cb.value);team.members=[...new Set(team.members)];clearAssignmentsForCurrentTeam();renderBgbAll()})}
function renderLocationButtons(){const team=currentTeam();$('#locationButtons').innerHTML=LOCATIONS.map(([code,name])=>`<button data-code="${code}" class="${code===selectedLocation?'active':''}"><span><b>${code}</b><small>${name}</small></span><em>${(team.locations[code]||[]).length}</em></button>`).join('');$$('#locationButtons button').forEach(b=>b.onclick=()=>{if(!hasGeneratedAssignments()){return}selectedLocation=b.dataset.code;renderLocationButtons();renderAssignments()})}
function assignmentVisibleMembers(){const q=$('#assignmentSearch').value.trim().toLowerCase();return currentTeam().members.map(n=>membersData.members.find(m=>m.nickname===n)).filter(Boolean).filter(m=>m.nickname.toLowerCase().includes(q)).sort((a,b)=>b.power-a.power)}
function renderAssignments(){const [,name]=LOCATIONS.find(x=>x[0]===selectedLocation)||['R1','REFINERY 1'];$('#selectedLocation').textContent=selectedLocation;$('#selectedLocationName').textContent=name;const team=currentTeam(),assigned=team.locations[selectedLocation]||[];const generated=hasGeneratedAssignments(team);$('#assignmentCount').textContent=`${assigned.length}명 배정`;const section=document.querySelector('.location-manager-section');section?.classList.toggle('locked',!generated);if(team.members.length!==20){$('#assignmentMembers').innerHTML='<div class="empty-admin">먼저 FINAL LINEUP에서 최종 참전 멤버 20명을 선택하세요.</div>';return}if(!generated){$('#assignmentMembers').innerHTML='<div class="empty-admin">FINAL LINEUP PREVIEW를 확인한 뒤 전투력 균등 자동 배정을 실행하세요. 자동 배정 전에는 어떤 멤버도 R1~CENTER에 표시되지 않습니다.</div>';return}const list=assignmentVisibleMembers();$('#assignmentMembers').innerHTML=list.map(m=>`<label class="member-check"><input type="checkbox" value="${esc(m.nickname)}" ${assigned.includes(m.nickname)?'checked':''}><span><strong>${esc(m.nickname)}</strong><small>${m.rank} · IND. ${m.ind} · ${Number(m.power).toLocaleString()}</small></span></label>`).join('');$$('#assignmentMembers input').forEach(cb=>cb.onchange=()=>{const set=new Set(currentTeam().locations[selectedLocation]||[]);cb.checked?set.add(cb.value):set.delete(cb.value);currentTeam().locations[selectedLocation]=[...set];renderLocationButtons();$('#assignmentCount').textContent=`${set.size}명 배정`})}
function powerOf(name){return membersData.members.find(m=>m.nickname===name)?.power||0}
function assignRefineries(sorted){const codes=['R1','R2','R3','R4','R5','R6'],caps=[4,4,3,3,3,3],groups=codes.map((code,i)=>({code,cap:caps[i],names:[],total:0}));for(const m of sorted){const choices=groups.filter(g=>g.names.length<g.cap).sort((a,b)=>a.total-b.total||a.names.length-b.names.length||codes.indexOf(a.code)-codes.indexOf(b.code));choices[0].names.push(m.nickname);choices[0].total+=m.power}return Object.fromEntries(groups.map(g=>[g.code,g.names]))}
function assignMh(sorted){
  // Fixed BGB secondary assignments based on combat-power ranking (1-based ranks).
  // M1 leader: 4th. M2 leader: 7th. Rankings 15-20 are excluded from M/H assignments.
  // The 4th and 7th ranked members are not assigned to H1/H2.
  return {
    M1:[3,9,12].map(i=>sorted[i].nickname),    // 4th, 10th, 13th
    M2:[6,10,13].map(i=>sorted[i].nickname),   // 7th, 11th, 14th
    H1:[4,8,11].map(i=>sorted[i].nickname),    // 5th, 9th, 12th
    H2:[5,7,9].map(i=>sorted[i].nickname)      // 6th, 8th, 10th
  };
}
function autoAssign(){const team=currentTeam();if(team.members.length!==20){alert(`${selectedTeam} TEAM 최종 참전 멤버를 정확히 20명 선택해야 합니다.`);return}const sorted=team.members.map(n=>membersData.members.find(m=>m.nickname===n)).filter(Boolean).sort((a,b)=>b.power-a.power);if(sorted.length!==20){alert('멤버 데이터가 올바르지 않습니다. Member Manager를 확인하세요.');return}const r=assignRefineries(sorted),mh=assignMh(sorted);Object.assign(team.locations,r,mh,{CENTER:[0,1,2,4,5,7].map(i=>sorted[i].nickname)});const totals=code=>(team.locations[code]||[]).reduce((s,n)=>s+powerOf(n),0);$('#autoSummary').innerHTML=`<strong>${selectedTeam} TEAM 자동 배정 완료</strong><span>R1~R6 전투력 범위: ${Math.min(...['R1','R2','R3','R4','R5','R6'].map(totals)).toLocaleString()} ~ ${Math.max(...['R1','R2','R3','R4','R5','R6'].map(totals)).toLocaleString()}</span><span>M1 4·10·13위 · M2 7·11·14위 · H1 5·9·12위 · H2 6·8·10위 · CENTER 1·2·3·5·6·8위 · M/H 15~20위 제외</span>`;renderLocationButtons();renderAssignments()}
function renderBgbAll(){renderTeamTabs();renderLineup();renderFinalPreview();renderLocationButtons();renderAssignments()}
function renderEvents(){const grid=$('#eventAdminGrid');if(!grid)return;grid.innerHTML=eventsData.events.map((e,i)=>`<article class="event-admin-card ${e.enabled?'enabled':''}" data-event-i="${i}"><div class="event-admin-card-head"><strong>EVENT ${i+1}</strong><label><input data-event-f="enabled" type="checkbox" ${e.enabled?'checked':''}> 활성화</label></div><div class="event-admin-fields"><label>이벤트명<input data-event-f="title" type="text" maxlength="60" value="${esc(e.title)}" placeholder="예: BGB"></label><label>시작 날짜·시간 (KST)<input data-event-f="start" type="datetime-local" value="${isoToLocalInput(e.start)}"></label><label>종료 날짜·시간 (KST)<input data-event-f="end" type="datetime-local" value="${isoToLocalInput(e.end)}"></label></div><p class="event-time-note">연맹원에게는 시작시간만 표시됩니다. 종료시간 이후 자동으로 FINISHED가 됩니다.</p></article>`).join('');$$('#eventAdminGrid [data-event-f]').forEach(el=>el.onchange=()=>{const card=el.closest('[data-event-i]'),i=Number(card.dataset.eventI),f=el.dataset.eventF;eventsData.events[i][f]=f==='enabled'?el.checked:(f==='start'||f==='end'?localInputToKst(el.value):el.value.trim());card.classList.toggle('enabled',eventsData.events[i].enabled)})}
function renderAll(){renderMembers();renderBgbAll();renderEvents()}
function membersPayload(){return{lastUpdated:$('#lastUpdated').value.trim(),members:membersData.members.map(normalizeMember)}}
function bgbPayload(){const out=blankBgb();out.lastUpdated=$('#bgbLastUpdated').value.trim();TEAM_KEYS.forEach(t=>{out.teams[t].members=[...bgbData.teams[t].members];LOCATIONS.forEach(([c])=>out.teams[t].locations[c]=[...bgbData.teams[t].locations[c]])});return out}
function eventsPayload(){const out=blankEvents();out.lastUpdated=$('#eventsLastUpdated').value.trim();out.events=eventsData.events.slice(0,9).map(e=>({title:String(e.title||'').trim(),start:String(e.start||''),end:String(e.end||''),enabled:Boolean(e.enabled)}));return out}
function todayKst(){return new Date().toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).replace(/\. /g,'.').replace(/\.$/,'')}
function b64EncodeUnicode(str){const bytes=new TextEncoder().encode(str);let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin)}
function b64DecodeUnicode(b64){const bin=atob(b64.replace(/\n/g,''));return new TextDecoder().decode(Uint8Array.from(bin,c=>c.charCodeAt(0)))}
async function githubGetFile(path){const c=cfg();if(!c.token)throw new Error('GitHub Token을 입력하세요.');const url=`https://api.github.com/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${path}?ref=${encodeURIComponent(c.branch)}`;const r=await fetch(url,{headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${c.token}`,'X-GitHub-Api-Version':'2022-11-28'}});if(!r.ok)throw new Error(`GitHub 불러오기 실패: ${path} (${r.status})`);const j=await r.json();return{sha:j.sha,data:JSON.parse(b64DecodeUnicode(j.content))}}
async function githubPutFile(path,payload,sha,message){const c=cfg(),url=`https://api.github.com/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${path}`;const body={message,content:b64EncodeUnicode(JSON.stringify(payload,null,2)),branch:c.branch};if(sha)body.sha=sha;const r=await fetch(url,{method:'PUT',headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${c.token}`,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok){const err=await r.text();throw new Error(`GitHub 저장 실패: ${path} (${r.status}) ${err.slice(0,180)}`)}return(await r.json()).content.sha}
async function loadGithub(){rememberToken();const [m,b,e]=await Promise.all([githubGetFile('data/members.json'),githubGetFile('data/bgb.json'),githubGetFile('data/events.json')]);memberSha=m.sha;bgbSha=b.sha;eventsSha=e.sha;membersData=m.data;membersData.members=(membersData.members||[]).map(normalizeMember);bgbData=normalizeBgb(b.data);eventsData=normalizeEvents(e.data);syncInputs();renderAll()}
async function saveAllGithub(){rememberToken();if(!memberSha){const m=await githubGetFile('data/members.json');memberSha=m.sha}if(!bgbSha){const b=await githubGetFile('data/bgb.json');bgbSha=b.sha}if(!eventsSha){const e=await githubGetFile('data/events.json');eventsSha=e.sha}const date=todayKst(),mp=membersPayload(),bp=bgbPayload(),ep=eventsPayload();if(!mp.lastUpdated)mp.lastUpdated=date;if(!bp.lastUpdated)bp.lastUpdated=date;if(!ep.lastUpdated)ep.lastUpdated=date;TEAM_KEYS.forEach(t=>{if(bp.teams[t].members.length!==0&&bp.teams[t].members.length!==20)throw new Error(`${t} TEAM은 정확히 20명이어야 저장할 수 있습니다.`)});ep.events.forEach((e,i)=>{if(!e.enabled)return;if(!e.title||!e.start||!e.end)throw new Error(`EVENT ${i+1}: 활성화된 이벤트는 이벤트명, 시작시간, 종료시간이 모두 필요합니다.`);if(new Date(e.end)<=new Date(e.start))throw new Error(`EVENT ${i+1}: 종료시간은 시작시간보다 늦어야 합니다.`)});memberSha=await githubPutFile('data/members.json',mp,memberSha,`Update EZPK members ${mp.lastUpdated}`);bgbSha=await githubPutFile('data/bgb.json',bp,bgbSha,`Update EZPK BGB teams ${bp.lastUpdated}`);eventsSha=await githubPutFile('data/events.json',ep,eventsSha,`Update EZPK events ${ep.lastUpdated}`);membersData=mp;bgbData=normalizeBgb(bp);eventsData=normalizeEvents(ep);syncInputs();renderAll();setStatus('멤버 정보, BGB 편성, 이벤트 일정 저장 완료. GitHub Pages 반영까지 보통 1~3분 정도 걸립니다.','ok')}
function exportExcel(){if(!window.XLSX){alert('Excel 라이브러리를 불러오지 못했습니다.');return}const rows=membersData.members.map((m,i)=>({No:i+1,Rank:m.rank,Nickname:m.nickname,IND:m.ind,'Combat Power':m.power}));const ws=XLSX.utils.json_to_sheet(rows),wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'EZPK Members');XLSX.writeFile(wb,`EZPK_Member_List_${($('#lastUpdated').value||'backup').replaceAll('.','-')}.xlsx`)}
function importExcel(file){const reader=new FileReader();reader.onload=e=>{const wb=XLSX.read(e.target.result,{type:'array'}),rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:''}),members=rows.map(normalizeMember).filter(m=>m.nickname);if(!members.length){alert('유효한 멤버 데이터가 없습니다.');return}membersData.members=members;bgbData=normalizeBgb(bgbData);renderAll();setStatus(`Excel에서 ${members.length}명을 불러왔습니다. 모든 변경사항 저장을 눌러 GitHub에 반영하세요.`,'ok')};reader.readAsArrayBuffer(file)}
function downloadJson(obj,name){const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)}
$$('.admin-tabs button').forEach(btn=>btn.onclick=()=>{$$('.admin-tabs button').forEach(b=>b.classList.remove('active'));$$('.admin-panel').forEach(p=>p.classList.remove('active'));btn.classList.add('active');$('#'+btn.dataset.panel).classList.add('active')});
$$('#bgbTeamTabs button').forEach(btn=>btn.onclick=()=>{selectedTeam=btn.dataset.team;selectedLocation='R1';$('#autoSummary').innerHTML='';renderBgbAll()});
$('#search').oninput=renderMembers;$('#rank').onchange=renderMembers;$('#lineupSearch').oninput=renderLineup;$('#lineupRank').onchange=renderLineup;$('#lineupSort').onchange=renderLineup;$('#assignmentSearch').oninput=renderAssignments;
$('#addMember').onclick=()=>{membersData.members.unshift({rank:'R1',nickname:'New Member',ind:0,power:0});renderAll()};
$('#exportExcel').onclick=exportExcel;$('#importExcel').onclick=()=>$('#excelFile').click();$('#excelFile').onchange=e=>e.target.files[0]&&importExcel(e.target.files[0]);
$('#downloadJson').onclick=()=>downloadJson(membersPayload(),'members.json');$('#downloadBgbJson').onclick=()=>downloadJson(bgbPayload(),'bgb.json');
$('#autoAssign').onclick=autoAssign;$('#clearTeam').onclick=()=>{if(confirm(`${selectedTeam} TEAM 명단과 모든 위치 배정을 초기화할까요?`)){currentTeam().members=[];currentTeam().locations=blankLocations();$('#autoSummary').innerHTML='';renderBgbAll()}};
$('#selectAllVisible').onclick=()=>{if(!hasGeneratedAssignments())return;const set=new Set(currentTeam().locations[selectedLocation]);assignmentVisibleMembers().forEach(m=>set.add(m.nickname));currentTeam().locations[selectedLocation]=[...set];renderLocationButtons();renderAssignments()};
$('#clearLocation').onclick=()=>{if(!hasGeneratedAssignments())return;currentTeam().locations[selectedLocation]=[];renderLocationButtons();renderAssignments()};
$('#downloadEventsJson').onclick=()=>downloadJson(eventsPayload(),'events.json');
$('#clearFinishedEvents').onclick=()=>{const now=Date.now();eventsData.events.forEach(e=>{if(e.enabled&&e.end&&new Date(e.end).getTime()<=now)e.enabled=false});renderEvents()};
$('#loadGithub').onclick=async()=>{try{setStatus('GitHub에서 데이터를 불러오는 중...');await loadGithub();setStatus('GitHub 데이터 연결 완료.','ok')}catch(e){setStatus(e.message,'error')}};
$('#saveAllGithub').onclick=async()=>{try{setStatus('GitHub에 저장하는 중...');await saveAllGithub()}catch(e){setStatus(e.message,'error')}};

