(()=>{
'use strict';

const TEAMS=['capital','tower','mobile','support'];
const META={
  capital:{label:'수도조',w:{v1:.40,v2:.35,ind:.15,power:.10}},
  tower:{label:'포탑 집결조',w:{v1:.40,v2:.30,ind:.20,power:.10}},
  mobile:{label:'기동대',w:{v1:.60,v2:.05,ind:.20,power:.15}},
  support:{label:'지원조',w:null}
};
let selectedRule='capital',selectedResult='capital',participantSort='vehicle1-desc',sha='',loaded=false,voteSource=null;
let restoredPublishedNames=new Set();
let cw=blank();

function blank(){
  return{
    version:2,
    lastUpdated:'',
    settings:{opponentServer:'320',eventTitle:'Capital Clash',targets:{capital:8,tower:6,mobile:20}},
    draft:{participants:[],fixedTeams:{},teams:{capital:[],tower:[],mobile:[],support:[]}},
    published:{publishedAt:'',lastUpdated:'',teams:{capital:[],tower:[],mobile:[],support:[]}}
  };
}

const map=()=>new Map(membersData.members.map(m=>[m.nickname,m]));
const uniq=a=>[...new Set(Array.isArray(a)?a.map(String):[])];

function normalize(d){
  const o=blank(),names=new Set(membersData.members.map(m=>m.nickname));
  Object.assign(o.settings,d?.settings||{});
  o.settings.targets={...o.settings.targets,...(d?.settings?.targets||{})};
  o.lastUpdated=String(d?.lastUpdated||'');
  o.draft.participants=uniq(d?.draft?.participants).filter(n=>names.has(n));
  o.draft.fixedTeams={};
  for(const [n,k] of Object.entries(d?.draft?.fixedTeams||{})){
    if(names.has(n)&&['auto',...TEAMS,'exclude'].includes(k))o.draft.fixedTeams[n]=k;
  }
  const used=new Set();
  for(const k of TEAMS){
    // Keep valid saved assignments even when the participant checkbox is currently off.
    // Duplicate assignments are resolved by retaining the first valid team in TEAMS order.
    o.draft.teams[k]=uniq(d?.draft?.teams?.[k]).filter(n=>names.has(n)&&!used.has(n));
    o.draft.teams[k].forEach(n=>used.add(n));
    o.published.teams[k]=uniq(d?.published?.teams?.[k]).filter(n=>names.has(n));
  }
  o.published.publishedAt=String(d?.published?.publishedAt||'');
  o.published.lastUpdated=String(d?.published?.lastUpdated||'');
  return o;
}

function v(m,n){return window.EZPKVehiclePower?.normalized(m,n)||Number(m?.[`vehicle${n}PowerNormalized`]||0)||0;}
function ind(m){return Number(m?.ind||m?.industryLevel||0)||0;}
function power(m){return Number(m?.power||0)||0;}
function fvp(x){return window.EZPKVehiclePower?.formatNormalized(x,{maximumFractionDigits:1,mMaximumFractionDigits:0})||'-';}
function fcp(x){return window.EZPKVehiclePower?.formatCombatPower(x)||'-';}
function find(x){return window.EZPKVehiclePower?.formatIndustryLevel(x)||'-';}
function memberMeta(n){const m=map().get(n);return `${find(ind(m))} • ${fvp(v(m,1))} • ${fvp(v(m,2))} • CP ${fcp(power(m))}`;}

function targets(){
  const n=cw.draft.participants.length,t=cw.settings.targets||{};
  const capital=Math.max(0,Number(t.capital||0));
  const tower=Math.max(0,Number(t.tower||0));
  const mobile=Math.max(0,Number(t.mobile||0));
  return{capital,tower,mobile,support:Math.max(0,n-capital-tower-mobile)};
}

function removeEverywhere(n){
  for(const k of TEAMS)cw.draft.teams[k]=(cw.draft.teams[k]||[]).filter(x=>x!==n);
}

function assignedTeamOf(n){
  for(const k of TEAMS){
    if((cw.draft.teams[k]||[]).includes(n))return k;
  }
  return '';
}

function displayedTeamOf(n){
  const assigned=assignedTeamOf(n);
  if(assigned)return assigned;
  const fixed=cw.draft.fixedTeams[n];
  return [...TEAMS,'exclude'].includes(fixed)?fixed:'auto';
}

function setMemberTeam(n,k,{ensureParticipant=true,syncFixed=true}={}){
  removeEverywhere(n);
  if(TEAMS.includes(k)){
    if(ensureParticipant&&!cw.draft.participants.includes(n))cw.draft.participants.push(n);
    cw.draft.teams[k].push(n);
    if(syncFixed)cw.draft.fixedTeams[n]=k;
    return k;
  }
  if(syncFixed)cw.draft.fixedTeams[n]='auto';
  return '';
}

function normalizeDraftTeams(){
  const valid=new Set([...membersData.members.map(m=>m.nickname),...restoredPublishedNames]);
  const used=new Set();
  for(const k of TEAMS){
    cw.draft.teams[k]=uniq(cw.draft.teams[k]).filter(n=>valid.has(n)&&!used.has(n));
    cw.draft.teams[k].forEach(n=>used.add(n));
  }
}

function unassignedNonParticipantCount(){
  const participants=new Set(cw.draft.participants);
  return membersData.members.filter(m=>
    !participants.has(m.nickname)&&
    !assignedTeamOf(m.nickname)&&
    cw.draft.fixedTeams[m.nickname]!=='exclude'
  ).length;
}

function assignOne(n,k){
  if(!TEAMS.includes(k)){
    alert('개별 편성할 팀을 먼저 선택하세요.');
    return;
  }
  setMemberTeam(n,k,{ensureParticipant:true,syncFixed:true});
  selectedResult=k;
  render();
}

function renderRules(){
  const box=document.querySelector('#cwRuleContent');
  if(!box)return;
  document.querySelectorAll('[data-cw-rule]').forEach(b=>{
    const on=b.dataset.cwRule===selectedRule;
    b.classList.toggle('active',on);
    b.setAttribute('aria-selected',String(on));
  });
  const meta=META[selectedRule];
  if(!meta.w){
    box.innerHTML='<h4>지원조</h4><p>수도조, 포탑 집결조, 기동대 배정 후 남은 참가자를 자동 배정합니다.</p>';
    return;
  }
  box.innerHTML=`<h4>${meta.label}</h4><dl>${[['1번 차량 파워',meta.w.v1],['2번 차량 파워',meta.w.v2],['산업 레벨',meta.w.ind],['전투력',meta.w.power]].map(([l,x])=>`<div><dt>${l}</dt><dd>${Math.round(x*100)}%</dd></div>`).join('')}</dl>`;
}

function compareMissingLast(a,b){
  const av=Number(a)||0,bv=Number(b)||0;
  if(av<=0&&bv<=0)return 0;
  if(av<=0)return 1;
  if(bv<=0)return -1;
  return bv-av;
}

function rankValue(m){
  const rank=String(m?.rank||m?.memberRank||'R1').toUpperCase();
  return ({R5:5,R4:4,R3:3,R2:2,R1:1})[rank]||0;
}

function participantComparator(a,b){
  if(participantSort==='assignment-order'){
    const teamOrder=n=>{
      const team=assignedTeamOf(n);
      const index=TEAMS.indexOf(team);
      return index>=0?index:TEAMS.length;
    };
    return teamOrder(a.nickname)-teamOrder(b.nickname)||compareMissingLast(v(a,1),v(b,1))||a.nickname.localeCompare(b.nickname);
  }
  if(participantSort==='nonparticipant-first'){
    const ap=cw.draft.participants.includes(a.nickname)?1:0;
    const bp=cw.draft.participants.includes(b.nickname)?1:0;
    return ap-bp||compareMissingLast(v(a,1),v(b,1))||a.nickname.localeCompare(b.nickname);
  }
  if(participantSort==='vehicle2-desc'){
    return compareMissingLast(v(a,2),v(b,2))||compareMissingLast(v(a,1),v(b,1))||a.nickname.localeCompare(b.nickname);
  }
  if(participantSort==='industry-desc'){
    return compareMissingLast(ind(a),ind(b))||compareMissingLast(v(a,1),v(b,1))||a.nickname.localeCompare(b.nickname);
  }
  if(participantSort==='rank-desc'){
    return rankValue(b)-rankValue(a)||compareMissingLast(v(a,1),v(b,1))||a.nickname.localeCompare(b.nickname);
  }
  return compareMissingLast(v(a,1),v(b,1))||a.nickname.localeCompare(b.nickname);
}

function participantRows(){
  const q=(document.querySelector('#cwSearch')?.value||'').trim().toLowerCase();
  const ps=new Set(cw.draft.participants);
  return membersData.members
    .filter(m=>m.nickname.toLowerCase().includes(q))
    .sort(participantComparator)
    .map(m=>{
      const current=displayedTeamOf(m.nickname);
      return `<tr>
        <td><b>${esc(m.nickname)}</b></td>
        <td><b class="spec-value">${find(ind(m))}</b></td>
        <td><b class="spec-value">${fvp(v(m,1))}</b></td>
        <td><b class="spec-value">${fvp(v(m,2))}</b></td>
        <td><input type="checkbox" data-cw-participant="${esc(m.nickname)}" ${ps.has(m.nickname)?'checked':''}></td>
        <td><div class="cw-fixed-control"><select data-cw-fixed="${esc(m.nickname)}">
          <option value="auto" ${current==='auto'?'selected':''}>미배정</option>
          <option value="capital" ${current==='capital'?'selected':''}>수도조</option>
          <option value="tower" ${current==='tower'?'selected':''}>포탑 집결조</option>
          <option value="mobile" ${current==='mobile'?'selected':''}>기동대</option>
          <option value="support" ${current==='support'?'selected':''}>지원조</option>
          <option value="exclude" ${current==='exclude'?'selected':''}>제외</option>
        </select><button type="button" class="cw-add-one" data-cw-add="${esc(m.nickname)}" aria-label="${esc(m.nickname)} 개별 편성">+</button></div></td>
      </tr>`;
    }).join('');
}

function render(){
  if(!document.querySelector('#capitalWarPanel')||!loaded)return;
  document.querySelector('#cwOpponentServer').value=cw.settings.opponentServer||'320';
  document.querySelector('#cwEventTitle').value=cw.settings.eventTitle||'Capital Clash';
  for(const k of ['capital','tower','mobile'])document.querySelector(`#cwTarget-${k}`).value=Number(cw.settings.targets[k]||0);
  document.querySelector('#cwTarget-support').value=targets().support;
  normalizeDraftTeams();
  const t=targets();
  document.querySelector('#cwSummary').innerHTML=`<article><span>참가자</span><b>${cw.draft.participants.length}</b></article>${TEAMS.map(k=>`<article class="cw-sum-${k}"><span>${META[k].label}</span><b>${(cw.draft.teams[k]||[]).length} / ${t[k]}</b></article>`).join('')}<article class="cw-sum-unassigned"><span>미배정</span><b>${unassignedNonParticipantCount()}</b></article>`;
  renderRules();
  document.querySelector('#cwParticipantBody').innerHTML=participantRows()||'<tr><td colspan="6">표시할 연맹원이 없습니다.</td></tr>';

  document.querySelectorAll('[data-cw-participant]').forEach(x=>x.onchange=()=>{
    const n=x.dataset.cwParticipant;
    if(x.checked){
      if(!cw.draft.participants.includes(n))cw.draft.participants.push(n);
    }else{
      cw.draft.participants=cw.draft.participants.filter(v=>v!==n);
      removeEverywhere(n);
      if(cw.draft.fixedTeams[n]!=='exclude')cw.draft.fixedTeams[n]='auto';
    }
    render();
  });

  document.querySelectorAll('[data-cw-fixed]').forEach(x=>x.onchange=()=>{
    const n=x.dataset.cwFixed,k=x.value;
    cw.draft.fixedTeams[n]=k;
    if(k==='exclude'){
      cw.draft.participants=cw.draft.participants.filter(v=>v!==n);
      removeEverywhere(n);
      render();
    }
    // For normal team choices, keep the selected value visible until the + button is pressed.
  });

  document.querySelectorAll('[data-cw-add]').forEach(b=>b.onclick=()=>{
    const n=b.dataset.cwAdd;
    const select=document.querySelector(`[data-cw-fixed="${CSS.escape(n)}"]`);
    assignOne(n,select?.value||'auto');
  });

  document.querySelectorAll('[data-cw-result]').forEach(b=>{
    const on=b.dataset.cwResult===selectedResult;
    b.classList.toggle('active',on);
    b.setAttribute('aria-selected',String(on));
  });

  const list=cw.draft.teams[selectedResult]||[];
  document.querySelector('#cwResultList').innerHTML=list.length
    ?list.map(n=>`<label><span><b>${esc(n)}</b><small>${esc(memberMeta(n))}</small></span><select data-cw-move="${esc(n)}">${TEAMS.map(k=>`<option value="${k}" ${k===selectedResult?'selected':''}>${META[k].label}</option>`).join('')}<option value="none">미배정</option></select></label>`).join('')
    :'<p class="s6-empty">배정된 멤버가 없습니다.</p>';

  document.querySelectorAll('[data-cw-move]').forEach(x=>x.onchange=()=>{
    const n=x.dataset.cwMove;
    setMemberTeam(n,x.value==='none'?'':x.value,{ensureParticipant:true,syncFixed:true});
    render();
  });

  const src=document.querySelector('#cwVoteSource');
  if(voteSource){
    src.hidden=false;
    src.innerHTML=`현재 참가 기준 · <b>${esc(voteSource.title)}</b> · ${voteSource.count}명`;
  }else src.hidden=true;
  document.querySelector('#cwPublishStatus').textContent=cw.published?.publishedAt?`마지막 노출: ${cw.published.lastUpdated||cw.published.publishedAt}`:'아직 노출되지 않았습니다.';
}

function syncSettings(){
  cw.settings.opponentServer=document.querySelector('#cwOpponentServer').value.trim()||'320';
  cw.settings.eventTitle=document.querySelector('#cwEventTitle').value.trim()||'Capital Clash';
  for(const k of ['capital','tower','mobile'])cw.settings.targets[k]=Math.max(0,Number(document.querySelector(`#cwTarget-${k}`).value||0));
}

function normalizeRange(values,x){
  const min=Math.min(...values),max=Math.max(...values);
  return max===min?(max>0?1:0):(x-min)/(max-min);
}

function scoreMembers(list,k){
  const w=META[k].w,vals={v1:list.map(m=>v(m,1)),v2:list.map(m=>v(m,2)),ind:list.map(ind),power:list.map(power)};
  return [...list].sort((a,b)=>{
    const s=m=>w.v1*normalizeRange(vals.v1,v(m,1))+w.v2*normalizeRange(vals.v2,v(m,2))+w.ind*normalizeRange(vals.ind,ind(m))+w.power*normalizeRange(vals.power,power(m));
    return s(b)-s(a)||power(b)-power(a)||a.nickname.localeCompare(b.nickname);
  });
}

function autoAssign(){
  syncSettings();
  const mm=map();
  const eligible=cw.draft.participants.filter(n=>mm.has(n)&&cw.draft.fixedTeams[n]!=='exclude');
  cw.draft.teams={capital:[],tower:[],mobile:[],support:[]};
  const remaining=new Set(eligible);

  for(const [n,k] of Object.entries(cw.draft.fixedTeams)){
    if(!remaining.has(n)||!TEAMS.includes(k))continue;
    cw.draft.teams[k].push(n);
    remaining.delete(n);
  }

  const t=targets();
  for(const k of ['capital','tower','mobile']){
    const need=Math.max(0,t[k]-cw.draft.teams[k].length);
    const candidates=[...remaining].map(n=>mm.get(n)).filter(Boolean);
    for(const m of scoreMembers(candidates,k).slice(0,need)){
      cw.draft.teams[k].push(m.nickname);
      remaining.delete(m.nickname);
    }
  }
  cw.draft.teams.support.push(...remaining);
  normalizeDraftTeams();
  render();
}

async function api(url){
  const r=await fetch(url,{credentials:'include',cache:'no-store'}),p=await r.json().catch(()=>({}));
  if(!r.ok||!p.ok)throw new Error(p.code||p.error||'REQUEST_FAILED');
  return p.data;
}

async function openVote(){
  let modal=document.querySelector('#cwVoteModal');
  if(!modal){
    modal=document.createElement('div');
    modal.id='cwVoteModal';modal.className='s6-vote-modal';modal.hidden=true;
    modal.innerHTML='<div class="s6-vote-modal-backdrop" data-cw-vote-close></div><section class="s6-vote-modal-card"><h3>투표 불러오기</h3><label>투표 선택<select id="cwVoteSelect"></select></label><div id="cwVoteOptions" class="s6-vote-options"></div><div class="s6-vote-modal-actions"><button data-cw-vote-close>취소</button><button id="cwVoteApply" class="primary">불러오기</button></div></section>';
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-cw-vote-close]').forEach(x=>x.onclick=()=>{modal.hidden=true;});
  }
  modal.hidden=false;
  const sel=modal.querySelector('#cwVoteSelect'),box=modal.querySelector('#cwVoteOptions');
  const votes=(await api('/api/admin/votes')).votes||[];
  sel.innerHTML=votes.map(x=>`<option value="${x.id}">${esc(x.title)}</option>`).join('');
  const load=async()=>{
    const r=await api(`/api/admin/votes/${Number(sel.value)}/results`);
    modal._r=r;
    box.innerHTML=(r.options||[]).map(o=>`<label class="s6-vote-option"><input type="checkbox" value="${o.id}"><span><b>${esc(o.label)}</b></span><small>${o.members.length}명</small></label>`).join('');
  };
  sel.onchange=load;
  document.querySelector('#cwVoteApply').onclick=()=>{
    const ids=new Set([...box.querySelectorAll('input:checked')].map(x=>Number(x.value))),names=new Set();
    for(const o of modal._r?.options||[])if(ids.has(Number(o.id)))for(const m of o.members||[])if(map().has(m.nickname))names.add(m.nickname);
    if(!names.size)return alert('참가자를 선택하세요.');
    cw.draft.participants=[...names];
    cw.draft.teams={capital:[],tower:[],mobile:[],support:[]};
    voteSource={title:modal._r.vote?.title||'',count:names.size};
    modal.hidden=true;
    render();
  };
  await load();
}

async function load(){
  try{
    const r=await githubGetFile('data/capital-war.json');sha=r.sha;cw=normalize(r.data);
  }catch(e){
    const r=await fetch('../data/capital-war.json?v='+Date.now(),{cache:'no-store'});cw=normalize(await r.json());
  }
  loaded=true;render();
}

async function loadPublishedIntoDraft(){
  const button=document.querySelector('#cwLoadPublished');
  const originalText=button?.textContent||'현재 노출 명단 불러오기';
  if(button){button.disabled=true;button.textContent='현재 노출 명단 확인 중...';}

  const parseMaybeJson=value=>{
    let current=value;
    for(let i=0;i<4;i++){
      if(typeof current!=='string')break;
      const text=current.trim();
      if(!text)break;
      try{current=JSON.parse(text);}catch(_){break;}
    }
    return current;
  };

  const unwrapContent=value=>{
    let current=parseMaybeJson(value);
    for(let i=0;i<6;i++){
      if(!current||typeof current!=='object'||Array.isArray(current))break;
      if(current.published||current.draft||current.teams)break;
      const next=current?.data?.content??current?.data??current?.content??current?.result??null;
      if(next===null||next===current)break;
      current=parseMaybeJson(next);
    }
    return current;
  };

  const hasRoster=teams=>teams&&typeof teams==='object'&&TEAMS.some(key=>Array.isArray(teams[key])&&teams[key].length>0);
  const locateRoster=root=>{
    const source=unwrapContent(root);
    const direct=[
      {teams:source?.published?.teams,kind:'published.teams'},
      {teams:source?.teams,kind:'teams'},
      {teams:source?.draft?.teams,kind:'draft.teams'}
    ].find(item=>hasRoster(item.teams));
    if(direct)return{source,teams:direct.teams,kind:direct.kind};

    // 이전 버전이나 API wrapper가 한 단계 이상 중첩된 경우에도 팀 객체를 찾는다.
    const queue=[source],seen=new Set();
    while(queue.length){
      const node=queue.shift();
      if(!node||typeof node!=='object'||seen.has(node))continue;
      seen.add(node);
      if(hasRoster(node))return{source,teams:node,kind:'nested teams'};
      for(const [key,value] of Object.entries(node)){
        if(key==='published'&&hasRoster(value?.teams))return{source,teams:value.teams,kind:'nested published.teams'};
        if(key==='draft'&&hasRoster(value?.teams))return{source,teams:value.teams,kind:'nested draft.teams'};
        if(value&&typeof value==='object')queue.push(value);
        else if(typeof value==='string'&&/^[\[{]/.test(value.trim()))queue.push(parseMaybeJson(value));
      }
    }
    return{source,teams:null,kind:''};
  };

  const requestJson=async(url)=>{
    const response=await fetch(url,{method:'GET',credentials:'include',cache:'no-store',headers:{accept:'application/json'}});
    const text=await response.text();
    let payload=null;
    try{payload=JSON.parse(text);}catch(_){payload=text;}
    if(!response.ok)throw new Error(`${response.status}:${payload?.code||payload?.error||'REQUEST_FAILED'}`);
    return payload;
  };

  try{
    const attempts=[];
    const loaders=[
      // 공개 수도전 페이지가 실제로 읽는 주소를 가장 먼저 사용한다.
      ['공개 수도전 데이터',async()=>requestJson('/data/capital-war.json?restore='+Date.now())],
      ['관리자 D1 데이터',async()=>{
        const adminData=await githubGetFile('data/capital-war.json');
        if(adminData?.sha)sha=adminData.sha;
        return adminData?.data;
      }],
      ['회원 콘텐츠 데이터',async()=>requestJson('/api/member/content?path='+encodeURIComponent('data/capital-war.json')+'&restore='+Date.now())]
    ];

    let found=null;
    for(const [label,loader] of loaders){
      try{
        const payload=await loader();
        const located=locateRoster(payload);
        const count=located.teams?TEAMS.reduce((sum,key)=>sum+(Array.isArray(located.teams[key])?located.teams[key].length:0),0):0;
        attempts.push(`${label}: ${count}명${located.kind?` (${located.kind})`:''}`);
        if(count>0){found={...located,label,count};break;}
      }catch(error){
        attempts.push(`${label}: 실패 (${error?.message||'UNKNOWN'})`);
      }
    }

    if(!found){
      console.error('Capital War restore sources contained no roster',attempts);
      alert(`현재 노출 명단을 찾지 못했습니다.\n\n확인 결과\n- ${attempts.join('\n- ')}\n\n공개 페이지에 명단이 계속 보인다면 이 확인 결과를 알려주세요.`);
      return;
    }

    const source=found.source||{};
    const rawTeams=found.teams;
    const canonical=value=>String(value??'').normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase();
    const currentByCanonical=new Map();
    for(const member of membersData.members||[]){
      const key=canonical(member.nickname);
      if(key&&!currentByCanonical.has(key))currentByCanonical.set(key,member.nickname);
    }

    const publishedTeams={};
    const used=new Set();
    const unmatched=[];
    for(const key of TEAMS){
      publishedTeams[key]=[];
      for(const storedValue of uniq(rawTeams[key])){
        const storedName=String(storedValue??'').trim();
        if(!storedName)continue;
        const matched=currentByCanonical.get(canonical(storedName))||storedName;
        const duplicateKey=canonical(matched);
        if(!duplicateKey||used.has(duplicateKey))continue;
        used.add(duplicateKey);
        publishedTeams[key].push(matched);
        if(!currentByCanonical.has(canonical(storedName)))unmatched.push(storedName);
      }
    }

    const publishedNames=TEAMS.flatMap(key=>publishedTeams[key]);
    if(!publishedNames.length)throw new Error('PUBLISHED_ROSTER_EMPTY_AFTER_PARSE');

    const currentAssigned=TEAMS.reduce((sum,key)=>sum+(cw.draft.teams[key]||[]).length,0);
    const warning=currentAssigned||cw.draft.participants.length
      ?`현재 편집 중인 목록을 현재 노출 명단 ${publishedNames.length}명으로 교체할까요?\n\n불러오기 원본: ${found.label}`
      :`현재 노출 중인 수도전 명단 ${publishedNames.length}명을 불러올까요?\n\n불러오기 원본: ${found.label}`;
    if(!confirm(warning))return;

    restoredPublishedNames=new Set(publishedNames);
    cw.published={
      publishedAt:String(source?.published?.publishedAt||''),
      lastUpdated:String(source?.published?.lastUpdated||source?.lastUpdated||''),
      teams:Object.fromEntries(TEAMS.map(key=>[key,[...publishedTeams[key]]]))
    };
    cw.draft.participants=[...publishedNames];
    cw.draft.teams=Object.fromEntries(TEAMS.map(key=>[key,[...publishedTeams[key]]]));
    cw.draft.fixedTeams={};
    for(const key of TEAMS)for(const nickname of cw.draft.teams[key])cw.draft.fixedTeams[nickname]=key;
    voteSource=null;
    normalizeDraftTeams();
    render();

    const unmatchedCount=uniq(unmatched).length;
    const suffix=unmatchedCount?` 현재 회원 목록에 없는 ${unmatchedCount}명도 닉네임 그대로 복원했습니다.`:'';
    showAdminToast(`현재 노출 명단 ${publishedNames.length}명을 불러왔습니다. 저장 버튼을 눌러 확정하세요.${suffix}`);
  }catch(error){
    console.error('Capital War published roster restore failed',error);
    alert(`현재 노출 명단 불러오기에 실패했습니다. (${error?.message||'UNKNOWN_ERROR'})`);
  }finally{
    if(button){button.disabled=false;button.textContent=originalText;}
  }
}

async function save(expose=false){
  syncSettings();
  normalizeDraftTeams();
  cw.lastUpdated=todayKst();
  if(expose)cw.published={publishedAt:new Date().toISOString(),lastUpdated:cw.lastUpdated,teams:Object.fromEntries(TEAMS.map(k=>[k,[...(cw.draft.teams[k]||[])]]))};
  if(!sha){const r=await githubGetFile('data/capital-war.json');sha=r.sha;}
  sha=await githubPutFile('data/capital-war.json',cw,sha,`${expose?'Publish':'Save'} Capital War ${cw.lastUpdated}`);
  render();
  showAdminToast(expose?'수도전 노출 완료 ✓':'수도전 저장 완료 ✓');
}

function bind(){
  document.querySelectorAll('[data-cw-rule]').forEach(b=>b.onclick=()=>{selectedRule=b.dataset.cwRule;renderRules();});
  document.querySelectorAll('[data-cw-result]').forEach(b=>b.onclick=()=>{selectedResult=b.dataset.cwResult;render();});
  document.querySelector('#cwSearch').oninput=render;
  document.querySelector('#cwParticipantSort').onchange=e=>{participantSort=e.target.value;render();};
  document.querySelector('#cwLoadVote').onclick=()=>openVote().catch(()=>alert('투표를 불러오지 못했습니다.'));
  document.querySelector('#cwLoadPublished').onclick=()=>loadPublishedIntoDraft();
  document.querySelector('#cwSelectAll').onclick=()=>{voteSource=null;cw.draft.participants=membersData.members.map(m=>m.nickname);render();};
  document.querySelector('#cwClearAll').onclick=()=>{voteSource=null;cw.draft.participants=[];cw.draft.teams={capital:[],tower:[],mobile:[],support:[]};render();};
  document.querySelector('#cwAutoAssign').onclick=autoAssign;
  document.querySelector('#cwReset').onclick=()=>{if(confirm('현재 팀 배정을 초기화할까요?')){cw.draft.teams={capital:[],tower:[],mobile:[],support:[]};render();}};
  document.querySelector('#cwSave').onclick=()=>save(false).catch(e=>alert(adminErrorMessage(e)));
  document.querySelector('#cwPublish').onclick=()=>save(true).catch(e=>alert(adminErrorMessage(e)));
  document.querySelectorAll('#capitalWarPanel input').forEach(x=>x.onchange=()=>{syncSettings();render();});
}

window.addEventListener('ezpk-admin-ready',()=>load().then(bind));
window.addEventListener('ezpk-admin-members-updated',()=>{if(loaded){cw=normalize(cw);render();}else load().then(bind);});
if(document.readyState!=='loading')setTimeout(()=>{if(document.querySelector('#adminApp')&&!loaded)load().then(bind).catch(()=>{});},500);
})();
