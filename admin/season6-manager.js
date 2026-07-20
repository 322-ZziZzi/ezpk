(()=>{
const TEAM_META={attack:{label:'공격팀',ratio:.55},defense:{label:'방어팀',ratio:.25},support:{label:'지원팀',ratio:.20}};
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
function stats(k){const map=known(),list=s6.teams[k],total=list.reduce((v,n)=>v+(map.get(n)?.power||0),0);return{count:list.length,total,avg:list.length?Math.round(total/list.length):0}}
function unassigned(){const assigned=new Set(Object.values(s6.teams).flat());return s6.participants.filter(n=>!assigned.has(n))}
function listStats(list){const map=known(),total=list.reduce((v,n)=>v+(map.get(n)?.power||0),0);return{count:list.length,total}}
function moveOptions(current){return `<option value="attack" ${current==='attack'?'selected':''}>공격팀</option><option value="defense" ${current==='defense'?'selected':''}>방어팀</option><option value="support" ${current==='support'?'selected':''}>지원팀</option><option value="none" ${current==='none'?'selected':''}>미배정</option>`}
function memberRow(n,current){const mm=known().get(n);return `<label><span><b>${esc(n)}</b><small>${fmt(mm?.power||0)}</small></span><select data-s6-move="${esc(n)}">${moveOptions(current)}</select></label>`}
function render(){
  if(!document.querySelector('#season6Panel'))return;
  $('#s6LastUpdated').value=s6.lastUpdated||'';s6.published=true;
  const q=$('#s6Search').value.trim().toLowerCase(),ps=new Set(s6.participants);
  $('#s6ParticipantList').innerHTML=membersData.members.filter(m=>m.nickname.toLowerCase().includes(q)).sort((a,b)=>b.power-a.power).map(m=>`<label class="s6-person"><input type="checkbox" data-s6-participant="${esc(m.nickname)}" ${ps.has(m.nickname)?'checked':''}><span><b>${esc(m.nickname)}</b><small>${m.rank} · ${fmt(m.power)}</small></span></label>`).join('');
  $$('[data-s6-participant]').forEach(x=>x.onchange=()=>{const n=x.dataset.s6Participant;if(x.checked&&!s6.participants.includes(n))s6.participants.push(n);if(!x.checked){s6.participants=s6.participants.filter(v=>v!==n);for(const k in s6.teams)s6.teams[k]=s6.teams[k].filter(v=>v!==n)}render()});

  const t=targets(s6.participants.length),allStats=listStats(s6.participants),noneList=unassigned(),noneStats=listStats(noneList);
  $('#s6Summary').innerHTML=`
    <article class="s6-summary-total"><span>전체 인원</span><b>${allStats.count}</b><small>총 전투력 ${fmt(allStats.total)}</small></article>
    ${Object.entries(TEAM_META).map(([k,m])=>{const st=stats(k);return `<article class="s6-summary-${k}"><span>${m.label}</span><b>${st.count} / ${t[k]}</b><small>전투력 ${fmt(st.total)}</small></article>`}).join('')}
    <article class="s6-summary-none"><span>미배정</span><b>${noneStats.count} / 0</b><small>전투력 ${fmt(noneStats.total)}</small></article>`;

  const teamCards=Object.entries(TEAM_META).map(([k,m])=>`<section class="s6-team-card s6-team-${k}"><header><div><span>${m.label}</span><b>${stats(k).count}명</b></div><small>총 전투력 ${fmt(stats(k).total)}</small></header><div>${s6.teams[k].map(n=>memberRow(n,k)).join('')||'<p class="s6-empty">배정된 멤버가 없습니다.</p>'}</div></section>`).join('');
  const unassignedCard=`<section class="s6-team-card s6-unassigned-card"><header><div><span>미배정 명단</span><b>${noneStats.count}명</b></div><small>총 전투력 ${fmt(noneStats.total)}</small></header><p class="s6-unassigned-help">아직 팀이 지정되지 않은 인원입니다. 아래 선택 메뉴에서 바로 다른 팀으로 배정할 수 있습니다.</p><div>${noneList.map(n=>memberRow(n,'none')).join('')||'<p class="s6-empty">현재 미배정된 인원이 없습니다.</p>'}</div></section>`;
  $('#s6TeamGrid').innerHTML=teamCards+unassignedCard;

  $$('[data-s6-move]').forEach(sel=>sel.onchange=()=>{const n=sel.dataset.s6Move;for(const k in s6.teams)s6.teams[k]=s6.teams[k].filter(v=>v!==n);if(sel.value!=='none')s6.teams[sel.value].push(n);render()});
}
function autoAssign(){if(!s6.participants.length){alert('참가자를 먼저 선택하세요.');return}const map=known(),sorted=s6.participants.map(n=>map.get(n)).filter(Boolean).sort((a,b)=>b.power-a.power),cap=targets(sorted.length),total=sorted.reduce((v,m)=>v+m.power,0),goal={attack:total*.55,defense:total*.25,support:total*.20};s6.teams={attack:[],defense:[],support:[]};const sums={attack:0,defense:0,support:0};for(const m of sorted){const available=Object.keys(cap).filter(k=>s6.teams[k].length<cap[k]);available.sort((x,y)=>(sums[x]/goal[x])-(sums[y]/goal[y]));const k=available[0];s6.teams[k].push(m.nickname);sums[k]+=m.power}render()}
window.s6Manager={async loadLocal(){try{const r=await fetch('../data/season6-teams.json?v='+Date.now(),{cache:'no-store'});if(r.ok)s6=normalize(await r.json())}catch(e){}render()},async loadGithub(){const r=await githubGetFile('data/season6-teams.json');s6Sha=r.sha;s6=normalize(r.data);render()},async saveGithub(){s6.lastUpdated=$('#s6LastUpdated').value.trim()||todayKst();s6.published=true;if(!s6Sha){const r=await githubGetFile('data/season6-teams.json');s6Sha=r.sha}s6Sha=await githubPutFile('data/season6-teams.json',s6,s6Sha,`Update Season 6 teams ${s6.lastUpdated}`);render()},payload(){s6.lastUpdated=$('#s6LastUpdated').value.trim();s6.published=true;return s6},render};
$('#s6Search').oninput=render;$('#s6SelectAll').onclick=()=>{s6.participants=membersData.members.map(m=>m.nickname);render()};$('#s6ClearParticipants').onclick=()=>{s6.participants=[];s6.teams={attack:[],defense:[],support:[]};render()};$('#s6AutoAssign').onclick=autoAssign;$('#s6ResetTeams').onclick=()=>{if(confirm('시즌6 팀 배정을 초기화할까요?')){s6.teams={attack:[],defense:[],support:[]};render()}};$('#downloadSeason6Json').onclick=()=>downloadJson(s6Manager.payload(),'season6-teams.json');
const oldRenderAll=renderAll;renderAll=function(){oldRenderAll();render()};const oldLocal=loadLocal;loadLocal=async function(){await oldLocal();await s6Manager.loadLocal()};const oldGH=loadGithub;loadGithub=async function(){await oldGH();await s6Manager.loadGithub()};const oldSave=saveAllGithub;saveAllGithub=async function(){await oldSave();await s6Manager.saveGithub();setStatus('모든 데이터와 시즌6 팀 편성이 저장되었습니다.','ok')};
if(sessionStorage.getItem('ezpk-admin-auth')==='1')s6Manager.loadLocal();
})();
