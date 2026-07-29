(()=>{
const TEAM_META={attack:{label:'공격팀',ratio:.55},defense:{label:'방어팀',ratio:.25},support:{label:'지원팀',ratio:.20}};
let mobileOpenTeam='attack',voteImportSource=null;
let s6={lastUpdated:'',published:false,supportPriority:['defense','attack'],participants:[],teams:{attack:[],defense:[],support:[]}},s6Sha='';
const known=()=>new Map(membersData.members.map(m=>[m.nickname,m]));
function normalize(d){
  const names=new Set(membersData.members.map(m=>m.nickname)),o={lastUpdated:String(d?.lastUpdated||''),published:Boolean(d?.published),supportPriority:['defense','attack'],participants:[],teams:{attack:[],defense:[],support:[]}};
  o.participants=[...new Set(Array.isArray(d?.participants)?d.participants:[])].filter(n=>names.has(n));
  const used=new Set();
  for(const k in o.teams){
    o.teams[k]=[...new Set(Array.isArray(d?.teams?.[k])?d.teams[k]:[])]
      .filter(n=>names.has(n)&&o.participants.includes(n)&&!used.has(n));
    o.teams[k].forEach(n=>used.add(n));
  }
  return o;
}
function targets(n){let a=Math.floor(n*.55),d=Math.floor(n*.25),u=Math.floor(n*.20),left=n-a-d-u;const order=['attack','defense','support'];let vals={attack:a,defense:d,support:u};for(let i=0;i<left;i++)vals[order[i%3]]++;return vals}
function fmt(n){return Number(n||0).toLocaleString()}
function industryValue(m){return Number(m?.ind||String(m?.industryLevel||'').replace(/^I/i,''))||0}
function vehicle1Value(m){return window.EZPKVehiclePower?.normalized(m,1)??(Number(m?.vehicle1PowerNormalized||m?.vehicle1Power||0)||0)}
function vehiclePowerDisplay(value){return window.EZPKVehiclePower?.formatNormalized(value,{maximumFractionDigits:1,mMaximumFractionDigits:0})??fmt(value)}
function stats(k){const map=known(),list=s6.teams[k],total=list.reduce((v,n)=>v+(map.get(n)?.power||0),0),vehicle1=list.reduce((v,n)=>v+vehicle1Value(map.get(n)),0),industry=list.reduce((v,n)=>v+industryValue(map.get(n)),0);return{count:list.length,total,vehicle1,industrySum:industry,industryAvg:list.length?industry/list.length:0,avg:list.length?Math.round(total/list.length):0}}
function unassigned(){const assigned=new Set(Object.values(s6.teams).flat());return s6.participants.filter(n=>!assigned.has(n))}
function listStats(list){const map=known(),total=list.reduce((v,n)=>v+(map.get(n)?.power||0),0),vehicle1=list.reduce((v,n)=>v+vehicle1Value(map.get(n)),0),industry=list.reduce((v,n)=>v+industryValue(map.get(n)),0);return{count:list.length,total,vehicle1,industry}}
function deviationText(value,target){if(!target)return '0.0%';const p=(value/target-1)*100;return `${p>=0?'+':''}${p.toFixed(1)}%`}
function moveOptions(current){return `<option value="attack" ${current==='attack'?'selected':''}>공격팀</option><option value="defense" ${current==='defense'?'selected':''}>방어팀</option><option value="support" ${current==='support'?'selected':''}>지원팀</option><option value="none" ${current==='none'?'selected':''}>미배정</option>`}
function memberRow(n,current){const mm=known().get(n);return `<label><span><b>${esc(n)}</b><small>${fmt(mm?.power||0)}</small></span><select data-s6-move="${esc(n)}">${moveOptions(current)}</select></label>`}
function render(){
  if(!document.querySelector('#season6Panel'))return;
  $('#s6LastUpdated').value=s6.lastUpdated||'';s6.published=true;
  const q=$('#s6Search').value.trim().toLowerCase(),ps=new Set(s6.participants);
  $('#s6ParticipantList').innerHTML=membersData.members.filter(m=>m.nickname.toLowerCase().includes(q)).sort((a,b)=>b.power-a.power).map(m=>`<label class="s6-person"><input type="checkbox" data-s6-participant="${esc(m.nickname)}" ${ps.has(m.nickname)?'checked':''}><span><b>${esc(m.nickname)}</b><small>${m.rank} · ${fmt(m.power)}</small></span></label>`).join('');
  $$('[data-s6-participant]').forEach(x=>x.onchange=()=>{const n=x.dataset.s6Participant;if(x.checked&&!s6.participants.includes(n))s6.participants.push(n);if(!x.checked){s6.participants=s6.participants.filter(v=>v!==n);for(const k in s6.teams)s6.teams[k]=s6.teams[k].filter(v=>v!==n)}render()});

  const allStats=listStats(s6.participants),noneList=unassigned(),noneStats=listStats(noneList);
  $('#s6Summary').innerHTML=`
    <article class="s6-summary-total"><span>전체 인원</span><b>${allStats.count}</b></article>
    ${Object.entries(TEAM_META).map(([k,m])=>{const st=stats(k);return `<article class="s6-summary-${k}"><span>${m.label}</span><b>${st.count}</b></article>`}).join('')}
    <article class="s6-summary-none"><span>미배정</span><b>${noneStats.count}</b></article>`;

  const statsContent=document.querySelector('#s6StatsContent');
  if(statsContent){
    statsContent.innerHTML=`
      <article class="s6-stat-card s6-stat-total"><h4>전체</h4><dl><div><dt>참가 인원</dt><dd>${allStats.count}명</dd></div><div><dt>총 전투력</dt><dd>${fmt(allStats.total)}</dd></div><div><dt>1번 차량 전투력</dt><dd>${vehiclePowerDisplay(allStats.vehicle1)}</dd></div><div><dt>산업 합계</dt><dd>${allStats.industry.toFixed(1)}</dd></div></dl></article>
      ${Object.entries(TEAM_META).map(([k,m])=>{const st=stats(k);return `<article class="s6-stat-card s6-stat-${k}"><h4>${m.label}</h4><dl><div><dt>인원</dt><dd>${st.count}명</dd></div><div><dt>총 전투력</dt><dd>${fmt(st.total)} <small>${deviationText(st.total,allStats.total*m.ratio)}</small></dd></div><div><dt>1번 차량 전투력</dt><dd>${vehiclePowerDisplay(st.vehicle1)} <small>${deviationText(st.vehicle1,allStats.vehicle1*m.ratio)}</small></dd></div><div><dt>산업 합계</dt><dd>${st.industrySum.toFixed(1)} <small>${deviationText(st.industrySum,allStats.industry*m.ratio)}</small></dd></div><div><dt>평균 산업</dt><dd>I${st.industryAvg.toFixed(1)}</dd></div></dl></article>`}).join('')}
      <article class="s6-stat-card s6-stat-none"><h4>미배정</h4><dl><div><dt>인원</dt><dd>${noneStats.count}명</dd></div><div><dt>총 전투력</dt><dd>${fmt(noneStats.total)}</dd></div><div><dt>1번 차량 전투력</dt><dd>${vehiclePowerDisplay(noneStats.vehicle1)}</dd></div><div><dt>산업 합계</dt><dd>${noneStats.industry.toFixed(1)}</dd></div></dl></article>`;
  }

  const teamCards=Object.entries(TEAM_META).map(([k,m])=>{const st=stats(k),open=mobileOpenTeam===k;return `<section class="s6-team-card s6-team-${k}${open?' is-mobile-open':''}"><button type="button" class="s6-team-toggle" data-s6-team-toggle="${k}" aria-expanded="${open}"><span><em>${m.label}</em><b>${st.count}명</b></span><i aria-hidden="true">⌄</i></button><div class="s6-team-body">${s6.teams[k].map(n=>memberRow(n,k)).join('')||'<p class="s6-empty">배정된 멤버가 없습니다.</p>'}</div></section>`}).join('');
  const unassignedCard=`<section class="s6-team-card s6-unassigned-card"><header><div><span>미배정 명단</span><b>${noneStats.count}명</b></div></header><p class="s6-unassigned-help">아직 팀이 지정되지 않은 인원입니다. 아래 선택 메뉴에서 바로 다른 팀으로 배정할 수 있습니다.</p><div>${noneList.map(n=>memberRow(n,'none')).join('')||'<p class="s6-empty">현재 미배정된 인원이 없습니다.</p>'}</div></section>`;
  $('#s6TeamGrid').innerHTML=teamCards+unassignedCard;

  $$('[data-s6-team-toggle]').forEach(btn=>btn.onclick=()=>{mobileOpenTeam=mobileOpenTeam===btn.dataset.s6TeamToggle?'':btn.dataset.s6TeamToggle;render()});
  $$('[data-s6-move]').forEach(sel=>sel.onchange=()=>{const n=sel.dataset.s6Move;for(const k in s6.teams)s6.teams[k]=s6.teams[k].filter(v=>v!==n);if(sel.value!=='none')s6.teams[sel.value].push(n);render()});
  renderVoteSource();
}

function ensureVoteModal(){
  let modal=document.querySelector('#s6VoteModal');
  if(modal)return modal;
  modal=document.createElement('div');
  modal.id='s6VoteModal';
  modal.className='s6-vote-modal';
  modal.hidden=true;
  modal.innerHTML=`<div class="s6-vote-modal-backdrop" data-s6-vote-close></div><section class="s6-vote-modal-card" role="dialog" aria-modal="true" aria-labelledby="s6VoteModalTitle"><h3 id="s6VoteModalTitle">투표 불러오기</h3><label>투표 선택<select id="s6VoteSelect"></select></label><div id="s6VoteOptions" class="s6-vote-options"></div><div class="s6-vote-modal-actions"><button id="s6VoteCancel" type="button">취소</button><button id="s6VoteApply" class="primary" type="button">불러오기</button></div></section>`;
  document.body.appendChild(modal);
  modal.querySelectorAll('[data-s6-vote-close],#s6VoteCancel').forEach(x=>x.onclick=closeVoteModal);
  return modal;
}
function closeVoteModal(){const modal=document.querySelector('#s6VoteModal');if(modal)modal.hidden=true;document.documentElement.style.overflow=''}
async function voteApi(url){const r=await fetch(url,{credentials:'include',cache:'no-store'}),p=await r.json().catch(()=>({}));if(!r.ok||!p.ok)throw new Error(p.error||'VOTE_LOAD_FAILED');return p.data}
function renderVoteSource(){const el=document.querySelector('#s6VoteSource');if(!el)return;if(!voteImportSource){el.hidden=true;el.innerHTML='';return}el.hidden=false;el.innerHTML=`현재 편성 기준 · <b>${esc(voteImportSource.title)}</b> · ${voteImportSource.options.map(esc).join(', ')} · <b>${voteImportSource.count}명</b>`}
async function openVoteImport(){
  const modal=ensureVoteModal(),select=modal.querySelector('#s6VoteSelect'),box=modal.querySelector('#s6VoteOptions'),apply=modal.querySelector('#s6VoteApply');
  modal.hidden=false;document.documentElement.style.overflow='hidden';select.innerHTML='<option>불러오는 중...</option>';box.innerHTML='';apply.disabled=true;
  try{
    const data=await voteApi('/api/admin/votes'),votes=data.votes||[];
    if(!votes.length){select.innerHTML='<option value="">불러올 투표가 없습니다.</option>';box.innerHTML='<div class="s6-vote-empty">불러올 투표가 없습니다.</div>';return}
    select.innerHTML=votes.map(v=>`<option value="${v.id}">${esc(v.title)} (${v.status==='active'?'진행 중':v.status==='ended'?'종료':'예정'})</option>`).join('');
    const loadOptions=async()=>{
      apply.disabled=true;box.innerHTML='<div class="s6-vote-empty">선택지를 불러오는 중...</div>';
      const result=await voteApi(`/api/admin/votes/${Number(select.value)}/results`);
      box.innerHTML=(result.options||[]).map(o=>`<label class="s6-vote-option"><input type="checkbox" value="${o.id}" data-label="${esc(o.label)}"><span><b>${esc(o.label)}</b>${o.description?` · ${esc(o.description)}`:''}</span><small>${o.members.length}명</small></label>`).join('')||'<div class="s6-vote-empty">선택지가 없습니다.</div>';
      modal.dataset.voteTitle=result.vote.title||'';modal._voteResult=result;apply.disabled=!(result.options||[]).length;
    };
    select.onchange=()=>loadOptions().catch(e=>{box.innerHTML='<div class="s6-vote-empty">선택지를 불러오지 못했습니다.</div>'});
    apply.onclick=()=>applyVoteImport(modal);
    await loadOptions();
  }catch(e){select.innerHTML='<option value="">불러오기 실패</option>';box.innerHTML='<div class="s6-vote-empty">VOTE 데이터를 불러오지 못했습니다.</div>'}
}
function applyVoteImport(modal){
  const chosen=[...modal.querySelectorAll('#s6VoteOptions input:checked')];
  if(!chosen.length)return alert('불러올 선택지를 하나 이상 선택하세요.');
  const result=modal._voteResult||{},ids=new Set(chosen.map(x=>Number(x.value))),names=new Set();
  for(const option of result.options||[])if(ids.has(Number(option.id)))for(const member of option.members||[])if(member.nickname)names.add(member.nickname);
  const valid=[...names].filter(n=>known().has(n));
  if(!valid.length)return alert('선택한 투표 결과에서 현재 회원과 일치하는 참가자를 찾지 못했습니다.');
  if(!confirm(`현재 참가 체크와 팀 배정을 초기화하고 ${valid.length}명을 불러오시겠습니까?`))return;
  s6.participants=valid;s6.teams={attack:[],defense:[],support:[]};
  voteImportSource={title:result.vote?.title||modal.dataset.voteTitle||'',options:chosen.map(x=>x.dataset.label||x.closest('label')?.querySelector('b')?.textContent||''),count:valid.length};
  closeVoteModal();render();renderVoteSource();alert(`${valid.length}명 불러오기 완료`);
}

function autoAssign(){
  if(!s6.participants.length){alert('참가자를 먼저 선택하세요.');return}
  const map=known(),members=s6.participants.map(n=>map.get(n)).filter(Boolean),missing=members.filter(m=>vehicle1Value(m)<=0);
  if(missing.length&&!confirm(`1번 차량 전투력이 입력되지 않은 참가자 ${missing.length}명은 0으로 계산됩니다. 계속하시겠습니까?`))return;
  const cap=targets(members.length),ratio={attack:.55,defense:.25,support:.20};
  const totals={power:members.reduce((v,m)=>v+Number(m.power||0),0),vehicle1:members.reduce((v,m)=>v+vehicle1Value(m),0),industry:members.reduce((v,m)=>v+industryValue(m),0)};
  const max={power:Math.max(1,...members.map(m=>Number(m.power||0))),vehicle1:Math.max(1,...members.map(vehicle1Value)),industry:Math.max(1,...members.map(industryValue))};
  const personal=m=>.40*(vehicle1Value(m)/max.vehicle1)+.25*(Number(m.power||0)/max.power)+.25*(industryValue(m)/max.industry);
  const sorted=[...members].sort((a,b)=>personal(b)-personal(a)||String(a.nickname).localeCompare(String(b.nickname)));
  const goal={},sums={attack:{count:0,power:0,vehicle1:0,industry:0},defense:{count:0,power:0,vehicle1:0,industry:0},support:{count:0,power:0,vehicle1:0,industry:0}};
  Object.keys(ratio).forEach(k=>goal[k]={count:cap[k],power:totals.power*ratio[k],vehicle1:totals.vehicle1*ratio[k],industry:totals.industry*ratio[k]});
  const dev=(v,t)=>t>0?Math.abs(v-t)/t:(v>0?1:0);s6.teams={attack:[],defense:[],support:[]};
  for(const m of sorted){const choices=Object.keys(cap).filter(k=>sums[k].count<cap[k]);let best=choices[0],score=Infinity;for(const k of choices){const c={count:sums[k].count+1,power:sums[k].power+Number(m.power||0),vehicle1:sums[k].vehicle1+vehicle1Value(m),industry:sums[k].industry+industryValue(m)};const v=.40*dev(c.vehicle1,goal[k].vehicle1)+.25*dev(c.power,goal[k].power)+.25*dev(c.industry,goal[k].industry)+.10*dev(c.count,goal[k].count);if(v<score){score=v;best=k}}s6.teams[best].push(m.nickname);sums[best].count++;sums[best].power+=Number(m.power||0);sums[best].vehicle1+=vehicle1Value(m);sums[best].industry+=industryValue(m)}
  render();
}
window.s6Manager={async loadLocal(){try{const r=await fetch('../data/season6-teams.json?v='+Date.now(),{cache:'no-store'});if(r.ok)s6=normalize(await r.json())}catch(e){}render()},async loadGithub(){const r=await githubGetFile('data/season6-teams.json');s6Sha=r.sha;s6=normalize(r.data);render()},async saveGithub(){s6.lastUpdated=$('#s6LastUpdated').value.trim()||todayKst();s6.published=true;if(!s6Sha){const r=await githubGetFile('data/season6-teams.json');s6Sha=r.sha}s6Sha=await githubPutFile('data/season6-teams.json',s6,s6Sha,`Update Season 6 teams ${s6.lastUpdated}`);render()},payload(){s6.lastUpdated=$('#s6LastUpdated').value.trim();s6.published=true;return s6},render};
$('#s6Search').oninput=render;$('#s6LoadVote').onclick=openVoteImport;$('#s6SelectAll').onclick=()=>{voteImportSource=null;s6.participants=membersData.members.map(m=>m.nickname);render()};$('#s6ClearParticipants').onclick=()=>{voteImportSource=null;s6.participants=[];s6.teams={attack:[],defense:[],support:[]};render()};$('#s6AutoAssign').onclick=autoAssign;$('#s6ResetTeams').onclick=()=>{if(confirm('시즌6 팀 배정을 초기화할까요?')){s6.teams={attack:[],defense:[],support:[]};render()}};$('#downloadSeason6Json').onclick=()=>downloadJson(s6Manager.payload(),'season6-teams.json');
const oldRenderAll=renderAll;renderAll=function(){oldRenderAll();render()};const oldLocal=loadLocal;loadLocal=async function(){await oldLocal();await s6Manager.loadLocal()};const oldGH=loadGithub;loadGithub=async function(){await oldGH();await s6Manager.loadGithub()};const oldSave=saveAllGithub;saveAllGithub=async function(){await oldSave();await s6Manager.saveGithub();setStatus('모든 데이터와 시즌6 팀 편성이 저장되었습니다.','ok')};
if(sessionStorage.getItem('ezpk-admin-auth')==='1')s6Manager.loadLocal();
})();
