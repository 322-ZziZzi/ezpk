const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

// v17: initialize the login gate before the rest of the admin manager.
// This keeps login functional even if a later manager feature raises an error.
window.EZPK_ADMIN_PASSWORD='';
let adminSessionLoading=false;
let adminSessionReady=false;
let adminSessionPendingState=null;
async function verifyAdminSession(event){
  const incomingState=event?.detail||null;
  if(adminSessionLoading){
    if(incomingState)adminSessionPendingState=incomingState;
    return false;
  }
  adminSessionLoading=true;
  const status=document.getElementById('loginStatus');
  try{
    let state=incomingState;
    if(!state&&window.EZPKSharedHeader){
      const current=window.EZPKSharedHeader.getAuthState?.();
      if(current&&current.member)state=current;
      else state=await window.EZPKSharedHeader.refreshAuth?.();
    }
    if(!state){
      const controller=typeof AbortController==='function'?new AbortController():null;
      const timeoutId=controller?setTimeout(()=>controller.abort(),7000):null;
      try{
        const response=await fetch('/api/auth/me',{credentials:'include',headers:{accept:'application/json'},cache:'no-store',signal:controller?.signal});
        const payload=await response.json().catch(()=>null);
        state={authenticated:Boolean(response.ok&&payload?.ok&&payload?.data?.authenticated),member:payload?.data?.member||null};
      }finally{if(timeoutId)clearTimeout(timeoutId);}
    }
    const member=state?.member;
    const role=String(member?.role||'').toLowerCase();
    const rank=String(member?.memberRank||member?.member_rank||'').toUpperCase();
    const statusValue=String(member?.status||'').toLowerCase();
    if(state?.authenticated&&role==='admin'&&rank==='R5'&&statusValue==='active'){
      document.getElementById('adminLogin').hidden=true;
      document.getElementById('adminApp').hidden=false;
      document.body.classList.add('admin-unlocked');
      if(!adminSessionReady){
        adminSessionReady=true;
        window.dispatchEvent(new CustomEvent('ezpk-admin-ready',{detail:{member}}));
        // Authentication and admin-data loading are intentionally separated.
        // A temporary members/events API failure must never be reported as a
        // session failure or send an already authenticated R5 back to login.
        Promise.resolve().then(async()=>{
          try{
            await loadLocal();
          }catch(dataError){
            console.error('[EZPK Admin] data load failed',dataError);
            const message='관리자 로그인은 완료되었지만 운영 데이터를 불러오지 못했습니다. 페이지를 새로고침해 주세요.';
            if(window.showGlobalToast)window.showGlobalToast(message);
            else if(status){status.textContent=message;}
            window.dispatchEvent(new CustomEvent('ezpk-admin-data-error',{detail:{error:dataError}}));
          }
        });
      }
      return true;
    }
    adminSessionReady=false;
    document.getElementById('adminLogin').hidden=false;
    document.getElementById('adminApp').hidden=true;
    document.body.classList.remove('admin-unlocked');
    if(status)status.textContent='R5 관리자 로그인이 필요합니다.';
    return false;
  }catch(error){
    adminSessionReady=false;
    document.getElementById('adminLogin').hidden=false;
    document.getElementById('adminApp').hidden=true;
    document.body.classList.remove('admin-unlocked');
    if(status)status.textContent='관리자 세션을 확인하지 못했습니다. 다시 로그인해 주세요.';
    return false;
  }finally{
    adminSessionLoading=false;
    if(adminSessionPendingState){
      const pending=adminSessionPendingState;
      adminSessionPendingState=null;
      queueMicrotask(()=>verifyAdminSession({detail:pending}));
    }
  }
}
function initAdminLoginGate(){
  document.getElementById('adminLoginButton')?.addEventListener('click',()=>{
    if(window.EZPKSharedHeader?.openLogin)window.EZPKSharedHeader.openLogin();
    else window.location.href='../';
  });
  document.getElementById('adminLogout')?.addEventListener('click',async()=>{
    await fetch('/api/auth/logout',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:'{}'}).catch(()=>{});
    location.reload();
  });
  window.addEventListener('ezpk-auth-ready',verifyAdminSession);
  window.addEventListener('ezpk-auth-change',verifyAdminSession);
  window.addEventListener('pageshow',()=>verifyAdminSession());
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible')verifyAdminSession();
  });
  setTimeout(()=>verifyAdminSession(),0);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAdminLoginGate,{once:true});
else initAdminLoginGate();

// v279: card navigation for desktop and accordion navigation for mobile.
function initAdminCardNavigation(){
  const navigation=document.querySelector('.admin-card-navigation');
  if(!navigation)return;
  const cards=[...navigation.querySelectorAll('.admin-nav-card')];
  const menuButtons=[...navigation.querySelectorAll('[data-panel]')];
  const panels=[...document.querySelectorAll('.admin-panel')];

  const setGroupOpen=(card,open)=>{
    card.classList.toggle('open',open);
    card.querySelector('.admin-nav-card-toggle')?.setAttribute('aria-expanded',String(open));
  };

  const activatePanel=panelId=>{
    menuButtons.forEach(button=>button.classList.toggle('active',button.dataset.panel===panelId));
    panels.forEach(panel=>panel.classList.toggle('active',panel.id===panelId));
    const activeButton=menuButtons.find(button=>button.dataset.panel===panelId);
    const activeCard=activeButton?.closest('.admin-nav-card');
    if(window.innerWidth<=760&&activeCard){
      cards.forEach(card=>setGroupOpen(card,card===activeCard));
    }
  };

  menuButtons.forEach(button=>button.addEventListener('click',()=>activatePanel(button.dataset.panel)));
  cards.forEach(card=>card.querySelector('.admin-nav-card-toggle')?.addEventListener('click',()=>{
    if(window.innerWidth>760)return;
    const willOpen=!card.classList.contains('open');
    cards.forEach(item=>setGroupOpen(item,item===card&&willOpen));
  }));

  window.addEventListener('resize',()=>{
    if(window.innerWidth>760)cards.forEach(card=>setGroupOpen(card,true));
    else{
      const activeCard=navigation.querySelector('[data-panel].active')?.closest('.admin-nav-card');
      cards.forEach(card=>setGroupOpen(card,card===activeCard));
    }
  });

  if(window.innerWidth>760)cards.forEach(card=>setGroupOpen(card,true));
  else{
    const activeCard=navigation.querySelector('[data-panel].active')?.closest('.admin-nav-card');
    cards.forEach(card=>setGroupOpen(card,card===activeCard));
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAdminCardNavigation,{once:true});
else initAdminCardNavigation();

const LOCATIONS=[['R1','REFINERY 1'],['R2','REFINERY 2'],['R3','REFINERY 3'],['R4','REFINERY 4'],['R5','REFINERY 5'],['R6','REFINERY 6'],['M1','MILITARY BASE 1'],['M2','MILITARY BASE 2'],['H1','HOSPITAL 1'],['H2','HOSPITAL 2'],['CENTER','ALLOY FACTORY']];
const TEAM_KEYS=['A','B'];
let membersData={lastUpdated:'',members:[]},bgbData=blankBgb(),eventsData=blankEvents(),memberSha='',bgbSha='',eventsSha='',selectedTeam='A',selectedLocation='R1';
function blankLocations(){return Object.fromEntries(LOCATIONS.map(([c])=>[c,[]]))}
function blankBgb(){return{lastUpdated:'',teams:{A:{members:[],locations:blankLocations()},B:{members:[],locations:blankLocations()}}}}
function blankEvents(){return{lastUpdated:'',timezone:'UTC-02:00',timezoneLabel:'ST',events:Array.from({length:9},()=>({title:'',start:'',end:'',enabled:false,important:false}))}}
function normalizeEvents(d){const out=blankEvents();out.lastUpdated=String(d?.lastUpdated||'');const list=Array.isArray(d?.events)?d.events:[];for(let i=0;i<9;i++){const e=list[i]||{};out.events[i]={title:String(e.title||'').slice(0,60),start:String(e.start||''),end:String(e.end||''),enabled:Boolean(e.enabled),important:Boolean(e.important)}}return out}
function parseEventDate(value){if(!value)return null;const hasZone=/(?:Z|[+-]\d{2}:\d{2})$/.test(value);const normalized=hasZone?value:`${value.length===16?value+':00':value}-02:00`;const d=new Date(normalized);return Number.isNaN(d.getTime())?null:d}
function isoToServerParts(value){const d=parseEventDate(value);if(!d)return{date:'',time:''};const st=new Date(d.getTime()-2*60*60*1000),pad=n=>String(n).padStart(2,'0');return{date:`${st.getUTCFullYear()}-${pad(st.getUTCMonth()+1)}-${pad(st.getUTCDate())}`,time:`${pad(st.getUTCHours())}:${pad(st.getUTCMinutes())}`}}
function isValid24HourTime(value){return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value||''))}
function formatTimeDigits(value){const digits=String(value||'').replace(/\D/g,'').slice(0,4);if(digits.length<=2)return digits;return `${digits.slice(0,2)}:${digits.slice(2)}`}
function serverPartsToIso(date,time){if(!date||!isValid24HourTime(time))return'';return `${date}T${time}:00-02:00`}
function updateEventDateTime(i,prefix,field,value){
  const e=eventsData.events[i];
  const dateKey=`_${prefix}Date`,timeKey=`_${prefix}Time`;
  const parsed=isoToServerParts(e[prefix]);
  if(e[dateKey]===undefined)e[dateKey]=parsed.date;
  if(e[timeKey]===undefined)e[timeKey]=parsed.time;
  if(field==='date')e[dateKey]=value;
  if(field==='time')e[timeKey]=value;
  e[prefix]=serverPartsToIso(e[dateKey],e[timeKey]);
}
function syncEventsFromForm(){
  $$('#eventAdminGrid [data-event-i]').forEach(card=>{
    const i=Number(card.dataset.eventI),e=eventsData.events[i];
    if(!e)return;
    const get=f=>card.querySelector(`[data-event-f="${f}"]`);
    const enabled=get('enabled'),important=get('important'),title=get('title'),startDate=get('startDate'),startTime=get('startTime'),endDate=get('endDate'),endTime=get('endTime');
    if(enabled)e.enabled=enabled.checked;
    if(important)e.important=important.checked;
    if(title)e.title=title.value.trim();
    const sd=startDate?.value||'',st=formatTimeDigits(startTime?.value||''),ed=endDate?.value||'',et=formatTimeDigits(endTime?.value||'');
    if(startTime){startTime.value=st;startTime.classList.toggle('invalid',Boolean(st)&&!isValid24HourTime(st));}
    if(endTime){endTime.value=et;endTime.classList.toggle('invalid',Boolean(et)&&!isValid24HourTime(et));}
    e._startDate=sd;e._startTime=st;e._endDate=ed;e._endTime=et;
    e.start=serverPartsToIso(sd,st);
    e.end=serverPartsToIso(ed,et);
  });
}
function adminErrorMessage(error){
  const code=String(error?.message||error||'');
  const map={FORBIDDEN:'관리자 권한이 없습니다.',UNAUTHORIZED:'로그인 세션이 만료되었습니다.',GITHUB_NOT_CONFIGURED:'Cloudflare GitHub 환경변수가 설정되지 않았습니다.',GITHUB_READ_FAILED:'GitHub 운영 데이터를 불러오지 못했습니다.',GITHUB_WRITE_FAILED:'GitHub 운영 데이터를 저장하지 못했습니다.',CONTENT_PATH_NOT_ALLOWED:'허용되지 않은 운영 데이터 경로입니다.',INVALID_JSON_CONTENT:'저장할 JSON 데이터 형식이 올바르지 않습니다.',INVALID_EVENT_TIME:'이벤트 시작·종료시간을 확인해 주세요.',EVENTS_API_FAILED:'이벤트 API 처리에 실패했습니다.',EVENTS_LOAD_FAILED:'이벤트 데이터를 불러오지 못했습니다.'};
  return map[code]||code||'알 수 없는 오류가 발생했습니다.';
}
function showAdminToast(message,type='ok'){
  let toast=document.getElementById('adminToast');
  if(!toast){toast=document.createElement('div');toast.id='adminToast';toast.className='admin-toast';toast.setAttribute('role','status');document.body.appendChild(toast)}
  toast.textContent=message;toast.className=`admin-toast ${type==='error'?'error':''}`;
  clearTimeout(showAdminToast.timer);showAdminToast.timer=setTimeout(()=>toast.remove(),2200);
}
async function withAdminButton(button,busyText,task){
  const oldText=button.textContent;button.disabled=true;button.textContent=busyText;
  try{return await task()}finally{button.disabled=false;button.textContent=oldText}
}
const adminDirtySections=new Set();
function syncAdminDirty(){window.ezpkAdminDirty=adminDirtySections.size>0}
function markAdminDirty(section='general'){adminDirtySections.add(String(section||'general'));syncAdminDirty()}
function clearAdminDirty(section){if(section)adminDirtySections.delete(String(section));else adminDirtySections.clear();syncAdminDirty()}
function hasAdminDirty(section){return section?adminDirtySections.has(String(section)):adminDirtySections.size>0}
window.ezpkAdminDirty=false;
window.markAdminDirty=markAdminDirty;
window.clearAdminDirty=clearAdminDirty;
window.hasAdminDirty=hasAdminDirty;

function normalizeMember(m){return{id:Number(m.id||0),rank:String(m.memberRank||m.rank||m.Rank||'R1').toUpperCase(),nickname:String(m.nickname||m.Nickname||'').trim(),ind:Number(String(m.industryLevel||m.ind||m.IND||m['Shelter Level']||0).replace(/^I/i,'')),power:Number(String(m.power??m['Combat Power']??0).replaceAll(',','')),vehicle1PowerNormalized:Number(m.vehicle1PowerNormalized||0),vehicle1PowerValue:m.vehicle1PowerValue??null,vehicle1PowerUnit:m.vehicle1PowerUnit||'',vehicle2PowerNormalized:Number(m.vehicle2PowerNormalized||0),vehicle2PowerValue:m.vehicle2PowerValue??null,vehicle2PowerUnit:m.vehicle2PowerUnit||'',status:m.status||'active',raw:m}}
function compareVehiclePriority(a,b){const first=window.EZPKVehiclePower?.compareMembers(b,a,1)||0;if(first)return first;const second=window.EZPKVehiclePower?.compareMembers(b,a,2)||0;if(second)return second;return b.power-a.power||b.ind-a.ind||a.nickname.localeCompare(b.nickname)}
function uniqKnown(list){const known=new Set(membersData.members.map(m=>m.nickname));return [...new Set((Array.isArray(list)?list:[]).map(String))].filter(n=>known.has(n))}
function normalizeBgb(d){const out=blankBgb();out.lastUpdated=String(d?.lastUpdated||'');if(d?.teams){TEAM_KEYS.forEach(t=>{out.teams[t].members=uniqKnown(d.teams?.[t]?.members);LOCATIONS.forEach(([c])=>out.teams[t].locations[c]=uniqKnown(d.teams?.[t]?.locations?.[c]).filter(n=>out.teams[t].members.includes(n)))})}else if(d?.locations){out.teams.A.members=uniqKnown(Object.values(d.locations).flat());LOCATIONS.forEach(([c])=>out.teams.A.locations[c]=uniqKnown(d.locations[c]))}return out}
async function fetchAllAdminMembers(){
  let page=1,totalPages=1,items=[];
  do{
    const response=await fetch(`/api/admin/members?page=${page}&limit=100&sort=power_desc`,{credentials:'include',cache:'no-store',headers:{accept:'application/json'}});
    const payload=await response.json().catch(()=>null);
    if(!response.ok||!payload?.ok)throw new Error(payload?.code||'관리자 회원 데이터를 불러오지 못했습니다.');
    items.push(...(payload.data.items||[]));
    totalPages=Math.max(1,Number(payload.data.pagination?.totalPages||1));
    page+=1;
  }while(page<=totalPages);
  return items;
}
async function loadLocal(){
  const [adminMembers,br,er]=await Promise.all([
    fetchAllAdminMembers(),
    fetch('../data/bgb.json?v='+Date.now(),{cache:'no-store'}),
    fetch('/api/admin/events',{credentials:'include',cache:'no-store',headers:{accept:'application/json'}})
  ]);
  if(!br.ok||!er.ok)throw new Error('현재 홈페이지 운영 데이터를 불러오지 못했습니다.');
  membersData={lastUpdated:new Date().toISOString().slice(0,10),members:adminMembers.filter(m=>m.status==='active'&&(m.approvalStatus||'approved')==='approved').map(normalizeMember)};
  bgbData=normalizeBgb(await br.json());
  const eventPayload=await er.json();
  if(!eventPayload?.ok)throw new Error(eventPayload?.code||'EVENTS_LOAD_FAILED');
  eventsData=normalizeEvents(eventPayload.data);
  syncInputs();
  renderAll();
  window.dispatchEvent(new CustomEvent('ezpk-admin-members-updated',{detail:{members:adminMembers}}));
}
function syncInputs(){$('#lastUpdated').value=membersData.lastUpdated||'';$('#bgbLastUpdated').value=bgbData.lastUpdated||'';$('#eventsLastUpdated').value=eventsData.lastUpdated||''}
function filteredMembers(){const q=$('#search').value.trim().toLowerCase(),rank=$('#rank').value;return membersData.members.map((m,i)=>({...m,_i:i})).filter(m=>(rank==='ALL'||m.rank===rank)&&m.nickname.toLowerCase().includes(q))}
function replaceNicknameEverywhere(oldName,newName){TEAM_KEYS.forEach(t=>{const team=bgbData.teams[t];team.members=team.members.map(n=>n===oldName?newName:n);for(const c in team.locations)team.locations[c]=team.locations[c].map(n=>n===oldName?newName:n)})}
function removeNicknameEverywhere(name){TEAM_KEYS.forEach(t=>{const team=bgbData.teams[t];team.members=team.members.filter(n=>n!==name);for(const c in team.locations)team.locations[c]=team.locations[c].filter(n=>n!==name)})}
function renderMembers(){window.EZPKMemberManagerV188?.renderFromShared?.(membersData.members)}
function currentTeam(){return bgbData.teams[selectedTeam]}
function otherTeam(){return bgbData.teams[selectedTeam==='A'?'B':'A']}
function lineupVisibleMembers(){const q=$('#lineupSearch').value.trim().toLowerCase(),rank=$('#lineupRank').value,sort=$('#lineupSort').value;const list=membersData.members.filter(m=>(rank==='ALL'||m.rank===rank)&&m.nickname.toLowerCase().includes(q));if(sort==='ind-desc')list.sort((a,b)=>b.ind-a.ind||b.power-a.power);else if(sort==='name-asc')list.sort((a,b)=>a.nickname.localeCompare(b.nickname));else list.sort((a,b)=>b.power-a.power);return list}

function selectedLineupMembers(){return currentTeam().members.map(n=>membersData.members.find(m=>m.nickname===n)).filter(Boolean).sort(compareVehiclePriority)}
function hasGeneratedAssignments(team=currentTeam()){return LOCATIONS.some(([code])=>(team.locations[code]||[]).length>0)}
function clearAssignmentsForCurrentTeam(){currentTeam().locations=blankLocations();$('#autoSummary').innerHTML=''}
function renderFinalPreview(){const list=selectedLineupMembers();$('#previewCount').textContent=`${list.length} / 20`;$('#previewCount').classList.toggle('complete',list.length===20);$('#finalLineupPreview').innerHTML=list.length?list.map((m,i)=>`<article class="preview-member"><span class="preview-no">${String(i+1).padStart(2,'0')}</span><span><strong>${esc(m.nickname)}</strong><small>${m.rank} · <b class="spec-value">${specIndustry(m.ind)}</b> · CP <b class="spec-value">${specCP(m.power)}</b></small></span></article>`).join(''):'<div class="preview-empty">FINAL LINEUP에 사용할 멤버를 선택하세요. 선택된 멤버는 아직 어떤 위치에도 배정되지 않습니다.</div>'}
function renderTeamTabs(){$$('#bgbTeamTabs button').forEach(b=>b.classList.toggle('active',b.dataset.team===selectedTeam));$('#activeTeamChip').textContent=`${selectedTeam} TEAM`}
function renderLineup(){const team=currentTeam(),other=otherTeam(),list=lineupVisibleMembers();$('#lineupCount').textContent=`${team.members.length} / 20`;$('#lineupCount').classList.toggle('complete',team.members.length===20);$('#lineupMembers').innerHTML=list.map(m=>{const checked=team.members.includes(m.nickname),locked=other.members.includes(m.nickname)&&!checked;return `<label class="lineup-check ${locked?'locked':''}"><input type="checkbox" value="${esc(m.nickname)}" ${checked?'checked':''} ${locked?'disabled':''}><span><strong>${esc(m.nickname)}</strong><small>${m.rank} · <b class="spec-value">${specIndustry(m.ind)}</b> · CP <b class="spec-value">${specCP(m.power)}</b></small></span>${locked?`<em>${selectedTeam==='A'?'B':'A'} TEAM</em>`:''}</label>`}).join('');$$('#lineupMembers input').forEach(cb=>cb.onchange=()=>{const team=currentTeam();if(cb.checked&&team.members.length>=20){cb.checked=false;alert('최종 참전 멤버는 20명까지만 선택할 수 있습니다.');return}if(cb.checked)team.members.push(cb.value);else team.members=team.members.filter(n=>n!==cb.value);team.members=[...new Set(team.members)];clearAssignmentsForCurrentTeam();renderBgbAll()})}
function renderLocationButtons(){const team=currentTeam();$('#locationButtons').innerHTML=LOCATIONS.map(([code,name])=>`<button data-code="${code}" class="${code===selectedLocation?'active':''}"><span><b>${code}</b><small>${name}</small></span><em>${(team.locations[code]||[]).length}</em></button>`).join('');$$('#locationButtons button').forEach(b=>b.onclick=()=>{if(!hasGeneratedAssignments()){return}selectedLocation=b.dataset.code;renderLocationButtons();renderAssignments()})}
function assignmentVisibleMembers(){const q=$('#assignmentSearch').value.trim().toLowerCase();return currentTeam().members.map(n=>membersData.members.find(m=>m.nickname===n)).filter(Boolean).filter(m=>m.nickname.toLowerCase().includes(q)).sort(compareVehiclePriority)}
function renderAssignments(){const [,name]=LOCATIONS.find(x=>x[0]===selectedLocation)||['R1','REFINERY 1'];$('#selectedLocation').textContent=selectedLocation;$('#selectedLocationName').textContent=name;const team=currentTeam(),assigned=team.locations[selectedLocation]||[];const generated=hasGeneratedAssignments(team);$('#assignmentCount').textContent=`${assigned.length}명 배정`;const section=document.querySelector('.location-manager-section');section?.classList.toggle('locked',!generated);if(team.members.length!==20){$('#assignmentMembers').innerHTML='<div class="empty-admin">먼저 FINAL LINEUP에서 최종 참전 멤버 20명을 선택하세요.</div>';return}if(!generated){$('#assignmentMembers').innerHTML='<div class="empty-admin">FINAL LINEUP PREVIEW를 확인한 뒤 자동 배정을 실행하세요. 자동 배정 전에는 어떤 멤버도 R1~CENTER에 표시되지 않습니다.</div>';return}const list=assignmentVisibleMembers();$('#assignmentMembers').innerHTML=list.map(m=>`<label class="member-check"><input type="checkbox" value="${esc(m.nickname)}" ${assigned.includes(m.nickname)?'checked':''}><span><strong>${esc(m.nickname)}</strong><small>${m.rank} · <b class="spec-value">${specIndustry(m.ind)}</b> · CP <b class="spec-value">${specCP(m.power)}</b></small></span></label>`).join('');$$('#assignmentMembers input').forEach(cb=>cb.onchange=()=>{const set=new Set(currentTeam().locations[selectedLocation]||[]);cb.checked?set.add(cb.value):set.delete(cb.value);currentTeam().locations[selectedLocation]=[...set];renderLocationButtons();$('#assignmentCount').textContent=`${set.size}명 배정`})}
function specIndustry(value){return window.EZPKVehiclePower?.formatIndustryLevel(value)||'-'}
function specCP(value){return window.EZPKVehiclePower?.formatCombatPower(value)||'-'}
function powerOf(name){return membersData.members.find(m=>m.nickname===name)?.power||0}
function assignRefineries(sorted){const codes=['R1','R2','R3','R4','R5','R6'],caps=[4,4,3,3,3,3],groups=codes.map((code,i)=>({code,cap:caps[i],names:[],total:0}));for(const m of sorted){const choices=groups.filter(g=>g.names.length<g.cap).sort((a,b)=>a.total-b.total||a.names.length-b.names.length||codes.indexOf(a.code)-codes.indexOf(b.code));choices[0].names.push(m.nickname);choices[0].total+=m.power}return Object.fromEntries(groups.map(g=>[g.code,g.names]))}
function assignMh(sorted){
  // Fixed BGB secondary assignments based on combat-power ranking (1-based ranks).
  // M1 leader: 4th. M2 leader: 7th. Rankings 15-20 are excluded from M/H assignments.
  // The 4th and 7th ranked members are not assigned to H1/H2.
  return {
    M1:[3,9,14].map(i=>sorted[i].nickname),    // 4th,10th,15th
    M2:[4,8,13].map(i=>sorted[i].nickname),    // 5th,9th,14th
    H1:[5,7,12].map(i=>sorted[i].nickname),    // 6th,8th,13th
    H2:[6,10,11].map(i=>sorted[i].nickname)    // 7th,11th,12th
  };
}
function autoAssign(){const team=currentTeam();if(team.members.length!==20){alert(`${selectedTeam} TEAM 최종 참전 멤버를 정확히 20명 선택해야 합니다.`);return}const sorted=team.members.map(n=>membersData.members.find(m=>m.nickname===n)).filter(Boolean).sort(compareVehiclePriority);if(sorted.length!==20){alert('멤버 데이터가 올바르지 않습니다. Member Manager를 확인하세요.');return}const r=assignRefineries(sorted),mh=assignMh(sorted);Object.assign(team.locations,r,mh,{CENTER:[0,1,2,3,4,5,6].map(i=>sorted[i].nickname)});const totals=code=>(team.locations[code]||[]).reduce((s,n)=>s+powerOf(n),0);$('#autoSummary').innerHTML=`<strong>${selectedTeam} TEAM 자동 배정 완료</strong><span>R1~R6 전투력 범위: ${Math.min(...['R1','R2','R3','R4','R5','R6'].map(totals)).toLocaleString()} ~ ${Math.max(...['R1','R2','R3','R4','R5','R6'].map(totals)).toLocaleString()}</span><span>M1 4·10·15위 · M2 5·9·14위 · H1 6·8·13위 · H2 7·11·12위 · CENTER 1~7위</span>`;renderLocationButtons();renderAssignments()}
function renderBgbAll(){renderTeamTabs();renderLineup();renderFinalPreview();renderLocationButtons();renderAssignments()}
function renderEvents(){
  const grid=$('#eventAdminGrid');
  if(!grid)return;
  grid.innerHTML=eventsData.events.map((e,i)=>{
    const sp=isoToServerParts(e.start),ep=isoToServerParts(e.end);
    return `<article class="event-admin-card ${e.enabled?'enabled':''} ${e.important?'important':''}" data-event-i="${i}">
      <div class="event-admin-card-head"><strong>EVENT ${i+1}</strong><div class="event-admin-toggles"><label class="important-toggle"><input data-event-f="important" type="checkbox" ${e.important?'checked':''}> 중요 이벤트</label><label><input data-event-f="enabled" type="checkbox" ${e.enabled?'checked':''}> 활성화</label></div></div>
      <div class="event-admin-fields">
        <label>이벤트명<input data-event-f="title" type="text" maxlength="60" value="${esc(e.title)}" placeholder="예: BGB"></label>
        <div class="event-datetime-group"><span>시작 날짜·시간 (ST)</span><div class="event-date-time-row"><input data-event-f="startDate" type="date" value="${sp.date}"><input class="event-time-24h" data-event-f="startTime" type="text" inputmode="numeric" autocomplete="off" maxlength="5" value="${sp.time}" placeholder="19:00" aria-label="시작 시간 24시간 형식"></div></div>
        <div class="event-datetime-group"><span>종료 날짜·시간 (ST)</span><div class="event-date-time-row"><input data-event-f="endDate" type="date" value="${ep.date}"><input class="event-time-24h" data-event-f="endTime" type="text" inputmode="numeric" autocomplete="off" maxlength="5" value="${ep.time}" placeholder="19:50" aria-label="종료 시간 24시간 형식"></div></div>
      </div>
      <p class="event-time-note">게임 내 서버시간과 동일한 24시간 형식으로 입력하세요. 예: 19:00 / 자정: 00:00. 연맹원에게는 시작시간만 표시되며 종료시간 이후 자동으로 FINISHED가 됩니다.</p>
    </article>`
  }).join('');
  $$('#eventAdminGrid [data-event-f]').forEach(el=>{
    const commit=()=>{
      const card=el.closest('[data-event-i]'),i=Number(card.dataset.eventI),f=el.dataset.eventF;
      if(f==='enabled')eventsData.events[i].enabled=el.checked;
      else if(f==='important')eventsData.events[i].important=el.checked;
      else if(f==='title')eventsData.events[i].title=el.value.trim();
      else if(f==='startDate')updateEventDateTime(i,'start','date',el.value);
      else if(f==='endDate')updateEventDateTime(i,'end','date',el.value);
      else if(f==='startTime'||f==='endTime'){
        const normalized=formatTimeDigits(el.value);
        el.value=normalized;
        el.classList.toggle('invalid',Boolean(normalized)&&!isValid24HourTime(normalized));
        if(!isValid24HourTime(normalized))return;
        updateEventDateTime(i,f==='startTime'?'start':'end','time',normalized);
      }
      card.classList.toggle('enabled',eventsData.events[i].enabled);
      card.classList.toggle('important',eventsData.events[i].important)
    };
    if(el.classList.contains('event-time-24h')){
      el.addEventListener('input',()=>{el.value=formatTimeDigits(el.value);el.classList.remove('invalid')});
      el.addEventListener('blur',commit);
      el.addEventListener('change',commit);
    }else el.addEventListener('change',commit);
  })
}
function renderAll(){renderMembers();renderBgbAll();renderEvents()}
function membersPayload(){return{lastUpdated:$('#lastUpdated').value.trim(),members:membersData.members.map(normalizeMember)}}
function bgbPayload(){const out=blankBgb();out.lastUpdated=$('#bgbLastUpdated').value.trim();TEAM_KEYS.forEach(t=>{out.teams[t].members=[...bgbData.teams[t].members];LOCATIONS.forEach(([c])=>out.teams[t].locations[c]=[...bgbData.teams[t].locations[c]])});return out}
function eventsPayload(){syncEventsFromForm();const out=blankEvents();out.lastUpdated=$('#eventsLastUpdated').value.trim();out.events=eventsData.events.slice(0,9).map(e=>({title:String(e.title||'').trim(),start:String(e.start||''),end:String(e.end||''),enabled:Boolean(e.enabled),important:Boolean(e.important)}));return out}
function todayKst(){const d=new Date(Date.now()-2*60*60*1000),p=n=>String(n).padStart(2,'0');return `${d.getUTCFullYear()}.${p(d.getUTCMonth()+1)}.${p(d.getUTCDate())}`}
async function adminContentRequest(path,options={}){
  const method=options.method||'GET';
  const url=method==='GET'?`/api/admin/content?path=${encodeURIComponent(path)}`:'/api/admin/content';
  const response=await fetch(url,{method,credentials:'include',cache:'no-store',headers:{accept:'application/json',...(method==='PUT'?{'content-type':'application/json'}:{})},body:method==='PUT'?JSON.stringify({path,content:options.content,message:options.message}):undefined});
  const payload=await response.json().catch(()=>null);
  if(!response.ok||!payload?.ok)throw new Error(payload?.code||'WORKER_API_FAILED');
  return payload.data||{};
}
async function githubGetFile(path){const data=await adminContentRequest(path);return{sha:data.sha||'',data:data.content}}
async function githubPutFile(path,payload,sha,message){const data=await adminContentRequest(path,{method:'PUT',content:payload,message});return data.sha||sha||''}
async function eventApiRequest(options={}){
  const method=options.method||'GET';
  const response=await fetch('/api/admin/events',{method,credentials:'include',cache:'no-store',headers:{accept:'application/json',...(method==='PUT'?{'content-type':'application/json'}:{})},body:method==='PUT'?JSON.stringify(options.payload):undefined});
  const payload=await response.json().catch(()=>null);
  if(!response.ok||!payload?.ok)throw new Error(payload?.code||'EVENTS_API_FAILED');
  return payload.data;
}
async function loadBgbData({refreshMembers=false}={}){
  let adminMembers=null;
  if(refreshMembers)adminMembers=await fetchAllAdminMembers();
  const b=await githubGetFile('data/bgb.json');
  bgbSha=b.sha;
  if(adminMembers){
    membersData={lastUpdated:new Date().toISOString().slice(0,10),members:adminMembers.filter(m=>m.status==='active'&&(m.approvalStatus||'approved')==='approved').map(normalizeMember)};
    window.dispatchEvent(new CustomEvent('ezpk-admin-members-updated',{detail:{members:adminMembers}}));
  }
  bgbData=normalizeBgb(b.data);
  syncInputs();
  renderMembers();
  renderBgbAll();
  clearAdminDirty('bgb');
}
async function loadEventsData(){
  eventsData=normalizeEvents(await eventApiRequest());
  syncInputs();
  renderEvents();
  clearAdminDirty('events');
}
function validateBgbPayload(bp){
  TEAM_KEYS.forEach(t=>{
    if(bp.teams[t].members.length!==0&&bp.teams[t].members.length!==20)throw new Error(`${t} TEAM은 정확히 20명이어야 저장할 수 있습니다.`);
  });
}
function validateEventsPayload(ep){
  ep.events.forEach((e,i)=>{
    if(!e.enabled)return;
    if(!e.title||!e.start||!e.end)throw new Error(`EVENT ${i+1}: 활성화된 이벤트는 이벤트명, 시작시간, 종료시간이 모두 필요합니다.`);
    const startDate=parseEventDate(e.start),endDate=parseEventDate(e.end);
    if(!startDate||!endDate)throw new Error(`EVENT ${i+1}: 시간을 정확히 입력해 주세요.`);
    if(endDate<=startDate)throw new Error(`EVENT ${i+1}: 종료시간은 시작시간보다 늦어야 합니다.`);
  });
}
async function saveBgbData(){
  if(!bgbSha){const b=await githubGetFile('data/bgb.json');bgbSha=b.sha}
  const bp=bgbPayload();
  if(!bp.lastUpdated)bp.lastUpdated=todayKst();
  validateBgbPayload(bp);
  bgbSha=await githubPutFile('data/bgb.json',bp,bgbSha,`Update EZPK BGB teams ${bp.lastUpdated}`);
  bgbData=normalizeBgb(bp);
  syncInputs();
  renderBgbAll();
  clearAdminDirty('bgb');
}
async function saveEventsData(){
  const ep=eventsPayload();
  if(!ep.lastUpdated)ep.lastUpdated=todayKst();
  validateEventsPayload(ep);
  eventsData=normalizeEvents(await eventApiRequest({method:'PUT',payload:ep}));
  syncInputs();
  renderEvents();
  clearAdminDirty('events');
}
function exportExcel(){if(!window.XLSX){alert('Excel 라이브러리를 불러오지 못했습니다.');return}const rows=membersData.members.map((m,i)=>({No:i+1,Rank:m.rank,Nickname:m.nickname,IND:m.ind,'Combat Power':m.power}));const ws=XLSX.utils.json_to_sheet(rows),wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'EZPK Members');XLSX.writeFile(wb,`EZPK_Member_List_${($('#lastUpdated').value||'backup').replaceAll('.','-')}.xlsx`)}
function importExcel(){alert('Excel 가져오기는 v188에서 제거되었습니다.')} 
function downloadJson(obj,name){const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)}
// v279: panel switching is handled by initAdminCardNavigation().
$$('#bgbTeamTabs button').forEach(btn=>btn.onclick=()=>{selectedTeam=btn.dataset.team;selectedLocation='R1';$('#autoSummary').innerHTML='';renderBgbAll()});
$('#search')&&($('#search').oninput=renderMembers);$('#rank')&&($('#rank').onchange=renderMembers);$('#lineupSearch').oninput=renderLineup;$('#lineupRank').onchange=renderLineup;$('#lineupSort').onchange=renderLineup;$('#assignmentSearch').oninput=renderAssignments;
$('#addMember')&&($('#addMember').onclick=()=>{});
$('#exportExcel')&&($('#exportExcel').onclick=exportExcel);
$('#downloadJson')&&($('#downloadJson').onclick=()=>{});$('#downloadBgbJson').onclick=()=>downloadJson(bgbPayload(),'bgb.json');
$('#autoAssign').onclick=()=>{if(currentTeam().members.length===20){autoAssign();markAdminDirty('bgb')}else autoAssign()};$('#clearTeam').onclick=()=>{if(confirm(`${selectedTeam} TEAM 명단과 모든 위치 배정을 초기화할까요?`)){currentTeam().members=[];currentTeam().locations=blankLocations();$('#autoSummary').innerHTML='';renderBgbAll();markAdminDirty('bgb')}};
$('#selectAllVisible').onclick=()=>{if(!hasGeneratedAssignments())return;const set=new Set(currentTeam().locations[selectedLocation]);assignmentVisibleMembers().forEach(m=>set.add(m.nickname));currentTeam().locations[selectedLocation]=[...set];renderLocationButtons();renderAssignments();markAdminDirty('bgb')};
$('#clearLocation').onclick=()=>{if(!hasGeneratedAssignments())return;currentTeam().locations[selectedLocation]=[];renderLocationButtons();renderAssignments();markAdminDirty('bgb')};
$('#downloadEventsJson').onclick=()=>downloadJson(eventsPayload(),'events.json');
$('#clearFinishedEvents').onclick=()=>{const now=Date.now();eventsData.events.forEach(e=>{if(e.enabled&&e.end&&parseEventDate(e.end)?.getTime()<=now)e.enabled=false});renderEvents();markAdminDirty('events')};
$('#refreshBgb').onclick=async()=>{
  const button=$('#refreshBgb');
  if(hasAdminDirty('bgb')&&!confirm('저장하지 않은 BGB 변경사항이 있습니다. 새로고침할까요?'))return;
  await withAdminButton(button,'불러오는 중...',async()=>{
    try{await loadBgbData({refreshMembers:true});showAdminToast('BGB 새로고침 완료 ✓')}
    catch(e){showAdminToast(adminErrorMessage(e),'error')}
  });
};
$('#saveBgb').onclick=async()=>{
  const button=$('#saveBgb');
  await withAdminButton(button,'저장 중...',async()=>{
    try{await saveBgbData();showAdminToast('BGB 저장 완료 ✓')}
    catch(e){showAdminToast(adminErrorMessage(e),'error')}
  });
};
$('#refreshEvents').onclick=async()=>{
  const button=$('#refreshEvents');
  if(hasAdminDirty('events')&&!confirm('저장하지 않은 이벤트 변경사항이 있습니다. 새로고침할까요?'))return;
  await withAdminButton(button,'불러오는 중...',async()=>{
    try{await loadEventsData();showAdminToast('이벤트 새로고침 완료 ✓')}
    catch(e){showAdminToast(adminErrorMessage(e),'error')}
  });
};
$('#saveEvents').onclick=async()=>{
  const button=$('#saveEvents');
  await withAdminButton(button,'저장 중...',async()=>{
    try{await saveEventsData();showAdminToast('이벤트 저장 완료 ✓')}
    catch(e){showAdminToast(adminErrorMessage(e),'error')}
  });
};
function adminPersistedSection(target){
  if(!target?.closest)return '';
  if(target.closest('#eventsPanel'))return 'events';
  if(target.closest('#bgbPanel')){
    if(target.closest('#lineupSearch,#lineupRank,#lineupSort,#assignmentSearch'))return '';
    return 'bgb';
  }
  return '';
}
document.addEventListener('input',event=>{const section=adminPersistedSection(event.target);if(section)markAdminDirty(section)});
document.addEventListener('change',event=>{const section=adminPersistedSection(event.target);if(section)markAdminDirty(section)});
window.addEventListener('beforeunload',event=>{if(!window.ezpkAdminDirty)return;event.preventDefault();event.returnValue=''});

