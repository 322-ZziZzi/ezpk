(()=>{
const TEAM_META={attack:{label:'공격팀',ratio:.55},defense:{label:'방어팀',ratio:.25},support:{label:'지원팀',ratio:.20}};
let s7={lastUpdated:'',published:false,supportPriority:['defense','attack'],participants:[],teams:{attack:[],defense:[],support:[]}},s7Sha='';
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
function stats(k){const map=known(),list=s7.teams[k],total=list.reduce((v,n)=>v+(map.get(n)?.power||0),0);return{count:list.length,total,avg:list.length?Math.round(total/list.length):0}}
function unassigned(){const assigned=new Set(Object.values(s7.teams).flat());return s7.participants.filter(n=>!assigned.has(n))}
function listStats(list){const map=known(),total=list.reduce((v,n)=>v+(map.get(n)?.power||0),0);return{count:list.length,total}}
function moveOptions(current){return `<option value="attack" ${current==='attack'?'selected':''}>공격팀</option><option value="defense" ${current==='defense'?'selected':''}>방어팀</option><option value="support" ${current==='support'?'selected':''}>지원팀</option><option value="none" ${current==='none'?'selected':''}>미배정</option>`}
function memberRow(n,current){const mm=known().get(n);return `<label><span><b>${esc(n)}</b><small>${fmt(mm?.power||0)}</small></span><select data-s7-move="${esc(n)}">${moveOptions(current)}</select></label>`}
function render(){
  if(!document.querySelector('#season7Panel'))return;
  $('#s7LastUpdated').value=s7.lastUpdated||'';s7.published=true;
  const q=$('#s7Search').value.trim().toLowerCase(),ps=new Set(s7.participants);
  $('#s7ParticipantList').innerHTML=membersData.members.filter(m=>m.nickname.toLowerCase().includes(q)).sort((a,b)=>b.power-a.power).map(m=>`<label class="s7-person"><input type="checkbox" data-s7-participant="${esc(m.nickname)}" ${ps.has(m.nickname)?'checked':''}><span><b>${esc(m.nickname)}</b><small>${m.rank} · ${fmt(m.power)}</small></span></label>`).join('');
  $$('[data-s7-participant]').forEach(x=>x.onchange=()=>{const n=x.dataset.s7Participant;if(x.checked&&!s7.participants.includes(n))s7.participants.push(n);if(!x.checked){s7.participants=s7.participants.filter(v=>v!==n);for(const k in s7.teams)s7.teams[k]=s7.teams[k].filter(v=>v!==n)}render()});

  const t=targets(s7.participants.length),allStats=listStats(s7.participants),noneList=unassigned(),noneStats=listStats(noneList);
  $('#s7Summary').innerHTML=`
    <article class="s7-summary-total"><span>전체 인원</span><b>${allStats.count}</b><small>총 전투력 ${fmt(allStats.total)}</small></article>
    ${Object.entries(TEAM_META).map(([k,m])=>{const st=stats(k);return `<article class="s7-summary-${k}"><span>${m.label}</span><b>${st.count} / ${t[k]}</b><small>전투력 ${fmt(st.total)}</small></article>`}).join('')}
    <article class="s7-summary-none"><span>미배정</span><b>${noneStats.count} / 0</b><small>전투력 ${fmt(noneStats.total)}</small></article>`;

  const teamCards=Object.entries(TEAM_META).map(([k,m])=>`<section class="s7-team-card s7-team-${k}"><header><div><span>${m.label}</span><b>${stats(k).count}명</b></div><small>총 전투력 ${fmt(stats(k).total)}</small></header><div>${s7.teams[k].map(n=>memberRow(n,k)).join('')||'<p class="s7-empty">배정된 멤버가 없습니다.</p>'}</div></section>`).join('');
  const unassignedCard=`<section class="s7-team-card s7-unassigned-card"><header><div><span>미배정 명단</span><b>${noneStats.count}명</b></div><small>총 전투력 ${fmt(noneStats.total)}</small></header><p class="s7-unassigned-help">아직 팀이 지정되지 않은 인원입니다. 아래 선택 메뉴에서 바로 다른 팀으로 배정할 수 있습니다.</p><div>${noneList.map(n=>memberRow(n,'none')).join('')||'<p class="s7-empty">현재 미배정된 인원이 없습니다.</p>'}</div></section>`;
  $('#s7TeamGrid').innerHTML=teamCards+unassignedCard;

  $$('[data-s7-move]').forEach(sel=>sel.onchange=()=>{const n=sel.dataset.s7Move;for(const k in s7.teams)s7.teams[k]=s7.teams[k].filter(v=>v!==n);if(sel.value!=='none')s7.teams[sel.value].push(n);render()});
}
function autoAssign(){if(!s7.participants.length){alert('참가자를 먼저 선택하세요.');return}const map=known(),sorted=s7.participants.map(n=>map.get(n)).filter(Boolean).sort((a,b)=>b.power-a.power),cap=targets(sorted.length),total=sorted.reduce((v,m)=>v+m.power,0),goal={attack:total*.55,defense:total*.25,support:total*.20};s7.teams={attack:[],defense:[],support:[]};const sums={attack:0,defense:0,support:0};for(const m of sorted){const available=Object.keys(cap).filter(k=>s7.teams[k].length<cap[k]);available.sort((x,y)=>(sums[x]/goal[x])-(sums[y]/goal[y]));const k=available[0];s7.teams[k].push(m.nickname);sums[k]+=m.power}render()}
window.s7Manager={async loadLocal(){try{const r=await fetch('../data/season7-teams.json?v='+Date.now(),{cache:'no-store'});if(r.ok)s7=normalize(await r.json())}catch(e){}render()},async loadGithub(){const r=await githubGetFile('data/season7-teams.json');s7Sha=r.sha;s7=normalize(r.data);render()},async saveGithub(){s7.lastUpdated=$('#s7LastUpdated').value.trim()||todayKst();s7.published=true;if(!s7Sha){const r=await githubGetFile('data/season7-teams.json');s7Sha=r.sha}s7Sha=await githubPutFile('data/season7-teams.json',s7,s7Sha,`Update Season 7 teams ${s7.lastUpdated}`);render()},payload(){s7.lastUpdated=$('#s7LastUpdated').value.trim();s7.published=true;return s7},render};
$('#s7Search').oninput=render;$('#s7SelectAll').onclick=()=>{s7.participants=membersData.members.map(m=>m.nickname);render()};$('#s7ClearParticipants').onclick=()=>{s7.participants=[];s7.teams={attack:[],defense:[],support:[]};render()};$('#s7AutoAssign').onclick=autoAssign;$('#s7ResetTeams').onclick=()=>{if(confirm('시즌7 팀 배정을 초기화할까요?')){s7.teams={attack:[],defense:[],support:[]};render()}};$('#downloadSeason7Json').onclick=()=>downloadJson(s7Manager.payload(),'season7-teams.json');
const oldRenderAll=renderAll;renderAll=function(){oldRenderAll();render()};const oldLocal=loadLocal;loadLocal=async function(){await oldLocal();await s7Manager.loadLocal()};const oldGH=loadGithub;loadGithub=async function(){await oldGH();await s7Manager.loadGithub()};const oldSave=saveAllGithub;saveAllGithub=async function(){await oldSave();await s7Manager.saveGithub();setStatus('모든 데이터와 시즌7 팀 편성이 저장되었습니다.','ok')};
if(sessionStorage.getItem('ezpk-admin-auth')==='1')s7Manager.loadLocal();
})();
