(() => {
  "use strict";
  const state={items:[],stats:{},candidates:[],demotionCandidates:[],demotionDeferred:[],protectionItems:[],rankHistory:[],rules:null,page:1,totalPages:1,selected:new Set(),activeId:null,query:"",rank:"",sort:"default",limit:10,longPress:null,currentAdmin:null,logPage:1,logTotalPages:1,promotionLoaded:false,promotionLoading:false,demotionLoaded:false,demotionLoading:false,protectionLoaded:false,protectionLoading:false};
  const $=s=>document.querySelector(s);
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const fmt=n=>window.EZPKVehiclePower?.formatCombatPower(n)??"-";
  const industry=v=>window.EZPKVehiclePower?.formatIndustryLevel(v)??"-";
  const vehicle=(m,vehicleNumber=1)=>window.EZPKVehiclePower?.formatMember(m,vehicleNumber,{maximumFractionDigits:1,mMaximumFractionDigits:0})??"-";
  const date=v=>v?new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(new Date(v)):"-";
  const dateOnly=v=>v?String(v).slice(0,10).replaceAll("-","."):"-";
  const remainingDays=v=>{const n=Math.ceil((new Date(v).getTime()-Date.now())/86400000);return Number.isFinite(n)?`D-${Math.max(0,n)}`:'-'};
  async function api(path,options={}){
    const res=await fetch(path,{credentials:"include",headers:{accept:"application/json",...(options.body?{"content-type":"application/json"}:{})},...options});
    const body=await res.json().catch(()=>null);
    if(!res.ok||!body?.ok){const e=new Error(body?.code||"REQUEST_FAILED");e.code=body?.code;e.payload=body;throw e}
    return body.data;
  }
  function params(){
    const p=new URLSearchParams({page:String(state.page),limit:String(state.limit),sort:state.sort});
    if(state.query)p.set("q",state.query);
    if(state.rank)p.set("rank",state.rank);
    return p;
  }
  async function load(reset=false){
    if(reset)state.page=1;
    const data=await api(`/api/admin/members?${params()}`);
    state.items=data.items||[];state.stats={...(data.stats||{})};state.totalPages=Math.max(1,data.pagination?.totalPages||1);
    if(state.promotionLoaded){state.stats.promotion=state.candidates.length;state.stats.promotionReviewable=state.candidates.filter(x=>x.promotion?.review?.status==='REVIEWABLE').length}
    if(state.demotionLoaded){state.stats.demotion=state.demotionCandidates.length;state.stats.demotionReviewable=state.demotionCandidates.filter(x=>x.maintenance?.reviewEligible).length}
    render();syncShared();
  }
  async function loadPromotionCandidates(force=false){
    if(state.promotionLoading)return;
    if(state.promotionLoaded&&!force){renderCandidates();return}
    state.promotionLoading=true;const box=$('#promotionCandidateListV367');if(box)box.innerHTML='<div class="review-loading" role="status"><span></span><strong>승급 검토 정보를 계산하고 있습니다.</strong><small>연맹원 목록은 계속 사용할 수 있습니다.</small></div>';
    try{const c=await api('/api/admin/promotion-candidates');state.candidates=c.items||[];state.promotionLoaded=true;state.stats.promotion=c.counts?.total||0;state.stats.promotionReviewable=c.counts?.reviewable||0;renderCandidates()}catch(_){state.promotionLoaded=false;if(box)box.innerHTML='<p class="help review-error">승급 검토 정보를 불러오지 못했습니다. 새로고침을 눌러 다시 시도해 주세요.</p>'}finally{state.promotionLoading=false;renderStats()}
  }
  async function loadDemotionCandidates(force=false){
    if(state.demotionLoading)return;
    if(state.demotionLoaded&&!force){renderDemotionCandidates();return}
    state.demotionLoading=true;const box=$('#demotionCandidateListV371');if(box)box.innerHTML='<div class="review-loading" role="status"><span></span><strong>강등 검토 정보를 계산하고 있습니다.</strong><small>최근 30일 활동과 보호 상태를 확인하는 중입니다.</small></div>';
    try{const d=await api('/api/admin/demotion-candidates');state.demotionCandidates=d.items||[];state.demotionDeferred=d.deferred||[];state.demotionLoaded=true;state.stats.demotion=d.counts?.total||0;state.stats.demotionReviewable=d.counts?.reviewable||0;state.stats.newProtection=d.counts?.newProtection??state.stats.newProtection??0;renderDemotionCandidates()}catch(_){state.demotionLoaded=false;if(box)box.innerHTML='<p class="help review-error">강등 검토 정보를 불러오지 못했습니다. 새로고침을 눌러 다시 시도해 주세요.</p>'}finally{state.demotionLoading=false;renderStats()}
  }
  async function loadNewProtection(force=false){
    if(state.protectionLoading)return;
    if(state.protectionLoaded&&!force){renderNewProtection();return}
    state.protectionLoading=true;const box=$('#newProtectionListV436');if(box)box.innerHTML='<div class="review-loading" role="status"><span></span><strong>신규 보호 인원을 확인하고 있습니다.</strong></div>';
    try{const d=await api('/api/admin/new-member-protection');state.protectionItems=d.items||[];state.protectionLoaded=true;state.stats.newProtection=d.counts?.total||state.protectionItems.length;renderNewProtection()}catch(_){state.protectionLoaded=false;if(box)box.innerHTML='<p class="help review-error">신규 보호 인원을 불러오지 못했습니다.</p>'}finally{state.protectionLoading=false;renderStats()}
  }
  async function refreshLoadedReviews(){const tasks=[];if(state.promotionLoaded)tasks.push(loadPromotionCandidates(true));if(state.demotionLoaded)tasks.push(loadDemotionCandidates(true));if(state.protectionLoaded)tasks.push(loadNewProtection(true));await Promise.all(tasks)}
  function invalidateReviews(){state.promotionLoaded=false;state.demotionLoaded=false;state.protectionLoaded=false;state.candidates=[];state.demotionCandidates=[];state.demotionDeferred=[];state.protectionItems=[]}
  function parseCreateAccounts(){
    return $("#memberCreateAccountsV343").value.split(/\r?\n/).map((line,index)=>{
      const separator=line.indexOf("/");
      if(separator<0)return line.trim()?{error:index+1}:null;
      const loginId=line.slice(0,separator).trim().toLowerCase();
      const nickname=line.slice(separator+1).trim();
      return loginId&&nickname?{loginId,nickname}:{error:index+1};
    }).filter(Boolean);
  }
  async function createMembers(){
    const status=$("#memberCreateStatusV343"),button=$("#memberCreateSubmitV343");
    const parsed=parseCreateAccounts(),invalid=parsed.find(item=>item.error);
    const temporaryPassword=$("#memberCreatePasswordV343").value;
    if(invalid){status.textContent=`${invalid.error}번째 줄의 형식을 확인해 주세요.`;return}
    if(!parsed.length){status.textContent="생성할 계정을 입력해 주세요.";return}
    if(temporaryPassword.length<6||/\s/.test(temporaryPassword)){status.textContent="임시 비밀번호는 공백 없이 6자 이상 입력해 주세요.";return}
    if(!confirm(`${parsed.length}개의 R1 활성 계정을 생성할까요?`))return;
    try{
      button.disabled=true;status.textContent="계정을 생성하고 있습니다.";
      const data=await api("/api/admin/members/create-bulk",{method:"POST",body:JSON.stringify({accounts:parsed,temporaryPassword})});
      status.textContent=`${data.created}개 계정을 생성했습니다.`;
      $("#memberCreateAccountsV343").value="";$("#memberCreatePasswordV343").value="";
      invalidateReviews();await load(true);
    }catch(error){
      const messages={VALIDATION_ERROR:"입력값을 다시 확인해 주세요.",DUPLICATE_LOGIN_ID_IN_REQUEST:"입력 목록에 중복 로그인 ID가 있습니다.",DUPLICATE_NICKNAME_IN_REQUEST:"입력 목록에 중복 닉네임이 있습니다.",LOGIN_ID_RESERVED:"관리자 전용 로그인 ID는 사용할 수 없습니다.",LOGIN_ID_TAKEN:`이미 사용 중인 로그인 ID입니다${error.payload?.value?`: ${error.payload.value}`:"."}`,NICKNAME_TAKEN:`이미 사용 중인 닉네임입니다${error.payload?.value?`: ${error.payload.value}`:"."}`,ACCOUNT_DUPLICATE:"기존 계정과 중복되는 정보가 있습니다."};
      status.textContent=messages[error.code]||"계정 생성에 실패했습니다.";
    }finally{button.disabled=false}
  }
  function syncShared(){
    if(typeof window.membersData!=="undefined"){
      window.membersData={lastUpdated:new Date().toISOString().slice(0,10),members:state.items.map(m=>window.normalizeMember?window.normalizeMember(m):m)};
    }
    window.dispatchEvent(new CustomEvent("ezpk-admin-members-updated",{detail:{members:state.items}}));
  }
  function renderStats(){document.querySelectorAll("[data-stat]").forEach(el=>{const key=el.dataset.stat;if((key==='promotion'&&!state.promotionLoaded)||(key==='demotion'&&!state.demotionLoaded)){el.textContent='—';return}const value=Number(state.stats[key]??0);el.textContent=Number.isFinite(value)?Math.max(0,Math.floor(value)).toLocaleString("ko-KR"):"0"})}
  function reviewProgress(day,total){const d=Math.max(0,Number(day||0)),t=Math.max(1,Number(total||1)),pct=Math.max(0,Math.min(100,Math.round(d/t*100)));return `<div class="review-progress" aria-label="${d}/${t}"><span style="width:${pct}%"></span></div>`}
  function activityDetail(a){const i=a?.items||{},required=Number(a?.required||2),completed=Number(a?.completed||0),need=Math.max(0,required-completed);const metric=(label,item,value)=>`<div class="review-condition ${item?.passed?'passed':'failed'}"><span class="review-condition-icon">${item?.passed?'✓':'✕'}</span><span><strong>${label}</strong><small>${esc(value)}</small></span></div>`;const c=i.adminConfirmation||{};const checked=c.passed?[`로그인 ${c.checkedLogin?'✓':'–'}`,`이벤트 ${c.checkedEvent?'✓':'–'}`,`연맹 활동 ${c.checkedAlliance?'✓':'–'}`].join(' · '):'운영진 확인 없음';const adminMeta=c.passed?`<div class="review-admin-meta"><span>${esc(checked)}</span>${c.confirmedBy?`<span>확인자 ${esc(c.confirmedBy)} · ${date(c.confirmedAt)}</span>`:''}${c.memo?`<span>메모 · ${esc(c.memo)}</span>`:''}</div>`:'';return `<section class="review-detail-section"><div class="review-detail-title"><strong>활동 조건</strong><span>${completed} / 4 달성 · 필요 ${required}개${need?` · ${need}개 추가 필요`:''}</span></div><div class="review-condition-grid">${metric('투표 참여',i.vote,`${Number(i.vote?.count||0)} / ${Number(i.vote?.required||1)}`)}${metric('사이트 방문',i.visit,`${Number(i.visit?.count||0)} / ${Number(i.visit?.required||2)}일`)}${metric('스펙 업데이트',i.specUpdate,`${Number(i.specUpdate?.count||0)} / ${Number(i.specUpdate?.required||1)}`)}${metric('운영진 활동 확인',c,c.passed?'확인 완료':'미확인')}</div>${adminMeta}</section>`}
  function promotionReason(p,a){const status=p?.review?.status,need=Math.max(0,Number(a?.required||2)-Number(a?.completed||0));if(status==='REVIEWABLE')return {cls:'success',text:'승급 활동 조건을 충족하여 지금 검토할 수 있습니다.'};if(status==='HOLD')return {cls:'missing',text:'14일 승급 기회가 종료될 때까지 활동 조건을 충족하지 못했습니다.'};if(status==='WAIT_MAINTENANCE')return {cls:'pending',text:'최근 30일 등급 유지 조건을 다시 충족하면 승급 기회가 열립니다.'};return {cls:'progress',text:need?`활동 조건 ${need}개를 추가로 충족하면 승급 검토가 가능합니다.`:'승급 검토 조건을 확인하고 있습니다.'}}
  function demotionReason(s,a){const need=Math.max(0,Number(a?.required||2)-Number(a?.completed||0)),left=Math.max(0,Number(s?.cycle?.totalDays||30)-Number(s?.cycle?.day||0));if(s?.reviewEligible)return {cls:'missing',text:'30일 유지 조건이 미충족되어 강등 검토가 가능합니다.'};if(s?.maintained)return {cls:'success',text:'최근 30일 등급 유지 조건을 충족했습니다.'};return {cls:'progress',text:`유지 조건 ${need}개 부족 · 검토일까지 ${left}일 남음`}}
  function promotionReviewLabel(p){const s=p?.review?.status,day=Number(p?.review?.day||0);if(s==='REVIEWABLE')return {text:'검토 가능',cls:'reviewable'};if(s==='HOLD')return {text:'활동 미달',cls:'hold'};if(s==='WAIT_MAINTENANCE')return {text:'유지 확인 중',cls:'waiting'};return {text:`${Math.max(1,day)}/14`,cls:'progress'}}
  function renderCandidates(){
    const box=$('#promotionCandidateListV367');if(!box||!state.promotionLoaded)return;
    const reviewable=state.candidates.filter(x=>x.promotion?.review?.status==='REVIEWABLE').length;
    $('#promotionCandidateSummaryV367').textContent=`전체 ${state.candidates.length}명 · 검토 가능 ${reviewable}명`;
    box.innerHTML=state.candidates.length?state.candidates.map(m=>{const p=m.promotion,label=promotionReviewLabel(p),a=p.reviewActivity||p.cycleActivity||p.activity||{},i=a.items||{},reason=promotionReason(p,a),day=Number(p.review?.day||0),total=Number(p.review?.totalDays||14);return `<article class="promotion-candidate rank-review-card" data-id="${m.id}"><div class="rank-review-head"><button class="v188-open secondary" type="button"><span class="promotion-candidate-info"><strong>${esc(m.nickname)}</strong><small>${esc(p.currentRank)} → ${esc(p.targetRank)}</small></span></button><span class="review-cycle-badge ${label.cls}">${esc(label.text)}</span><div class="promotion-candidate-actions"><button class="secondary activity-confirm" type="button">${i.adminConfirmation?.passed?'활동 확인 갱신':'활동 확인'}</button>${i.adminConfirmation?.passed?'<button class="secondary activity-revoke" type="button">확인 취소</button>':''}<button class="primary promote-member" type="button" ${p.review?.status!=='REVIEWABLE'?'disabled':''}>${esc(p.targetRank)}로 승급</button></div></div><div class="review-cycle-line"><span>승급 기회 ${day||0}/${total}</span>${reviewProgress(day,total)}</div><details class="rank-review-details"><summary>판정 상세 보기</summary><div class="rank-review-detail-body"><section class="review-detail-section"><div class="review-detail-title"><strong>승급 스펙 자격</strong><span class="condition-pass">✓ ${esc(p.targetRank)} 자격 획득 완료</span></div><p class="review-qualified-at">최초 달성 ${dateOnly(p.review?.specQualifiedAt)}</p><div class="review-reference-grid"><span><small>현재 산업 · 참고</small><strong>${esc(industry(p.industry.current))}</strong><em>기준 ${esc(p.industry.required)}</em></span><span><small>현재 #1 · 참고</small><strong>${esc(promotionPowerText(m.vehicle1PowerValue,m.vehicle1PowerUnit,m.vehicle1PowerNormalized))}</strong><em>기준 ${esc(promotionPowerText(p.vehicle1.requiredValue,p.vehicle1.requiredUnit,p.vehicle1.requiredNormalized))}</em></span></div></section>${activityDetail(a)}<p class="review-reason ${reason.cls}">${esc(reason.text)}</p></div></details></article>`}).join(''):'<p class="help">현재 승급 검토 대상이 없습니다.</p>';
    box.querySelectorAll('.v188-open').forEach(b=>b.onclick=()=>openDetail(Number(b.closest('[data-id]').dataset.id)));
    box.querySelectorAll('.promote-member').forEach(b=>b.onclick=()=>promoteMember(Number(b.closest('[data-id]').dataset.id),b));
    box.querySelectorAll('.activity-confirm').forEach(b=>b.onclick=()=>openActivityConfirm(Number(b.closest('[data-id]').dataset.id)));
    box.querySelectorAll('.activity-revoke').forEach(b=>b.onclick=()=>revokeActivityConfirm(Number(b.closest('[data-id]').dataset.id)));
  }
  function candidateById(id){return state.candidates.find(x=>x.id===id)||state.demotionCandidates.find(x=>x.id===id)||state.demotionDeferred.find(x=>x.id===id)}
  function adminActivity(m){return m.promotion?.reviewActivity||m.promotion?.cycleActivity||m.promotion?.activity||m.maintenance?.reviewActivity||m.maintenance?.activity}
  function renderDemotionCandidates(){
    const box=$('#demotionCandidateListV371');if(!box||!state.demotionLoaded)return;
    const reviewable=state.demotionCandidates.filter(x=>x.maintenance?.reviewEligible).length;
    $('#demotionCandidateSummaryV371').textContent=`전체 ${state.demotionCandidates.length}명 · 검토 가능 ${reviewable}명`;
    const row=m=>{const s=m.maintenance,a=s.reviewActivity||s.activity||{},i=a.items||{},reason=demotionReason(s,a),label=s.reviewEligible?{text:'검토 가능',cls:'demotion-reviewable'}:{text:`${Math.max(1,Number(s.cycle?.day||1))}/30`,cls:'progress'},day=Math.max(1,Number(s.cycle?.day||1));return `<article class="promotion-candidate demotion-candidate rank-review-card" data-id="${m.id}"><div class="rank-review-head"><button class="v188-open secondary" type="button"><span class="promotion-candidate-info"><strong>${esc(m.nickname)}</strong><small>${esc(s.currentRank)} → ${esc(s.targetRank)}</small></span></button><span class="review-cycle-badge ${label.cls}">${esc(label.text)}</span><div class="promotion-candidate-actions"><button class="secondary activity-confirm" type="button">${i.adminConfirmation?.passed?'활동 확인 갱신':'활동 확인'}</button>${i.adminConfirmation?.passed?'<button class="secondary activity-revoke" type="button">확인 취소</button>':''}<button class="secondary demotion-exclude" type="button">강등 제외</button><button class="danger demote-member" type="button" ${!s.reviewEligible?'disabled':''}>${esc(s.targetRank)}로 강등</button></div></div><div class="review-cycle-line"><span>등급 유지 ${day}/30</span>${reviewProgress(day,30)}</div><details class="rank-review-details"><summary>판정 상세 보기</summary><div class="rank-review-detail-body">${activityDetail(a)}<section class="review-detail-section"><div class="review-detail-title"><strong>검토 주기</strong><span>${day}/30</span></div><div class="review-reference-grid"><span><small>주기 시작</small><strong>${dateOnly(s.cycle?.startedOn)}</strong></span><span><small>검토 기준일</small><strong>${dateOnly(s.cycle?.dueOn)}</strong></span></div></section><p class="review-reason ${reason.cls}">${esc(reason.text)}</p></div></details></article>`};
    box.innerHTML=state.demotionCandidates.length?state.demotionCandidates.map(row).join(''):'<p class="help">현재 강등 검토 대상이 없습니다.</p>';
    const deferred=$('#demotionDeferredListV371');$('#demotionDeferredCountV371').textContent=state.demotionDeferred.length;
    deferred.innerHTML=state.demotionDeferred.length?state.demotionDeferred.map(m=>{const s=m.maintenance,p=s.protection;if(p?.type==='new_member')return `<article class="promotion-candidate protection-row" data-id="${m.id}"><span class="promotion-candidate-info"><strong>${esc(m.nickname)}</strong><small>${esc(m.memberRank)} · 🛡 신규 보호</small></span><span class="review-cycle-badge protected">${Math.max(1,Number(p.day||1))}/10</span><span class="promotion-target">보호 종료 ${dateOnly(p.until)}</span></article>`;const why=s.exclusion?.active?'관리자 제외 중':p?.type==='demotion'?'기존 강등 보호':'기존 승급 보호',until=s.exclusion?.until||p?.until;return `<article class="promotion-candidate" data-id="${m.id}"><span class="promotion-candidate-info"><strong>${esc(m.nickname)}</strong><small>${esc(m.memberRank)}</small></span><span class="promotion-target">${why}${until?` · ${dateOnly(until)}`:''}</span><div class="promotion-candidate-actions">${s.exclusion?.active?'<button class="secondary exclusion-revoke" type="button">제외 해제</button>':''}</div></article>`}).join(''):'<p class="help">보호 또는 제외 중인 연맹원이 없습니다.</p>';
    box.querySelectorAll('.v188-open').forEach(b=>b.onclick=()=>openDetail(Number(b.closest('[data-id]').dataset.id)));
    box.querySelectorAll('.activity-confirm').forEach(b=>b.onclick=()=>openActivityConfirm(Number(b.closest('[data-id]').dataset.id)));
    box.querySelectorAll('.activity-revoke').forEach(b=>b.onclick=()=>revokeActivityConfirm(Number(b.closest('[data-id]').dataset.id)));
    box.querySelectorAll('.demotion-exclude').forEach(b=>b.onclick=()=>openDemotionExclusion(Number(b.closest('[data-id]').dataset.id)));
    box.querySelectorAll('.demote-member').forEach(b=>b.onclick=()=>openDemotionConfirm(Number(b.closest('[data-id]').dataset.id)));
    deferred.querySelectorAll('.exclusion-revoke').forEach(b=>b.onclick=()=>revokeDemotionExclusion(Number(b.closest('[data-id]').dataset.id)));
  }
  function renderNewProtection(){const box=$('#newProtectionListV436');if(!box||!state.protectionLoaded)return;$('#newProtectionSummaryV436').textContent=`현재 ${state.protectionItems.length}명`;box.innerHTML=state.protectionItems.length?state.protectionItems.map(m=>{const p=m.newMemberProtection||{},day=Math.max(1,Number(p.day||1));return `<article class="promotion-candidate protection-row" data-id="${m.id}"><button class="v188-open secondary" type="button"><span class="promotion-candidate-info"><strong>${esc(m.nickname)}</strong><small>${esc(m.memberRank)} · 🛡 신규 보호</small></span></button><span class="review-cycle-badge protected">${day}/10</span><span class="promotion-target">보호 종료 ${dateOnly(p.until)}</span></article>`}).join(''):'<p class="help">현재 신규 보호 중인 연맹원이 없습니다.</p>';box.querySelectorAll('.v188-open').forEach(b=>b.onclick=()=>openDetail(Number(b.closest('[data-id]').dataset.id)))}
  async function loadRankHistory(){try{const d=await api('/api/admin/rank-change-history?limit=30');state.rankHistory=d.items||[];$('#rankChangeHistoryV371').innerHTML=state.rankHistory.length?state.rankHistory.map(x=>`<article class="rank-history-row"><strong>${esc(x.nickname)} · ${esc(x.fromRank)} → ${esc(x.toRank)}</strong><span>${x.type==='promotion'?'승급':x.type==='demotion'?'강등':'관리자 변경'} · ${date(x.createdAt)} · 처리자 ${esc(x.changedBy||'-')}</span>${x.reason?`<small>${esc(x.reason)}</small>`:''}</article>`).join(''):'<p class="help">처리 이력이 없습니다.</p>'}catch(_){$('#rankChangeHistoryV371').innerHTML='<p class="help">이력을 불러오지 못했습니다.</p>'}}
  let activityConfirmMemberId=null,activityConfirmInitial='';
  function activityConfirmSnapshot(){return JSON.stringify([$('#activityCheckedLoginV369').checked,$('#activityCheckedEventV369').checked,$('#activityCheckedAllianceV369').checked,$('#activityConfirmMemoV369').value])}
  function updateActivityConfirmState(){const checked=['#activityCheckedLoginV369','#activityCheckedEventV369','#activityCheckedAllianceV369'].some(s=>$(s).checked);$('#activityConfirmSubmitV370').disabled=!checked;document.querySelectorAll('.activity-confirm-options label').forEach(label=>label.classList.toggle('selected',label.querySelector('input').checked))}
  function openActivityConfirm(id){const m=candidateById(id);if(!m)return;const c=adminActivity(m).items.adminConfirmation;activityConfirmMemberId=id;$('#activityConfirmMemberV369').textContent=m.nickname;$('#activityCheckedLoginV369').checked=Boolean(c.checkedLogin);$('#activityCheckedEventV369').checked=Boolean(c.checkedEvent);$('#activityCheckedAllianceV369').checked=Boolean(c.checkedAlliance);$('#activityConfirmMemoV369').value=String(c.memo||'').slice(0,100);$('#activityConfirmCountV370').textContent=`${$('#activityConfirmMemoV369').value.length} / 100`;$('#activityConfirmStatusV369').textContent=c.passed&&c.confirmedBy?`확인자 ${c.confirmedBy} · ${date(c.confirmedAt)} · 승급 14일·등급 유지 30일 유효`:'';updateActivityConfirmState();activityConfirmInitial=activityConfirmSnapshot();$('#activityConfirmDialogV369').showModal()}
  function closeActivityConfirm(){if(activityConfirmSnapshot()!==activityConfirmInitial&&!confirm('입력한 내용을 취소할까요?'))return;$('#activityConfirmDialogV369').close()}
  async function submitActivityConfirm(e){e.preventDefault();const button=$('#activityConfirmSubmitV370'),payload={checkedLogin:$('#activityCheckedLoginV369').checked,checkedEvent:$('#activityCheckedEventV369').checked,checkedAlliance:$('#activityCheckedAllianceV369').checked,memo:$('#activityConfirmMemoV369').value.trim().slice(0,100)};if(!payload.checkedLogin&&!payload.checkedEvent&&!payload.checkedAlliance){$('#activityConfirmStatusV369').textContent='한 개 이상의 확인 항목을 선택해 주세요.';return}button.disabled=true;button.textContent='확인 중…';try{await api(`/api/admin/members/${activityConfirmMemberId}/activity-confirmation`,{method:'POST',body:JSON.stringify(payload)});$('#activityConfirmDialogV369').close();await refreshLoadedReviews()}catch(_){$('#activityConfirmStatusV369').textContent='활동 확인을 저장하지 못했습니다.'}finally{button.textContent='활동 확인 완료';updateActivityConfirmState()}}
  async function revokeActivityConfirm(id){if(!confirm('이 연맹원의 운영진 활동 확인을 취소할까요?'))return;await api(`/api/admin/members/${id}/activity-confirmation`,{method:'DELETE'});await refreshLoadedReviews()}
  function promotionPowerText(value,unit,normalized){const u=unit==='M'||unit==='G'?unit:'G',v=Number(value);if(Number.isFinite(v)&&v>0)return `${Number(v.toFixed(2))}${u}`;const n=Number(normalized);return Number.isFinite(n)&&n>0?`${Number((n/1000).toFixed(2))}G`:'-'}
  async function promoteMember(id,button){const m=state.candidates.find(x=>x.id===id);if(!m)return;const p=m.promotion;if(!confirm(`${m.nickname} 연맹원을 ${p.targetRank}로 승급할까요?\n\nIND ${p.industry.current} / ${p.industry.required}\n1번 차량 ${vehicle(m,1)} / ${promotionPowerText(p.vehicle1.requiredValue,p.vehicle1.requiredUnit,p.vehicle1.requiredNormalized)}\n\n확인하면 D1에 즉시 반영됩니다.`))return;button.disabled=true;try{await api(`/api/admin/members/${id}/promote`,{method:'POST',body:'{}'});alert(`${m.nickname} 연맹원을 ${p.targetRank}로 승급했습니다.`);await load(true);state.demotionLoaded=false;state.protectionLoaded=false;await loadPromotionCandidates(true)}catch(e){alert(e.code==='PROMOTION_STATE_CHANGED'?'정보가 변경되었습니다. 새로고침 후 다시 시도해 주세요.':'최신 승급 조건을 충족하지 않아 처리하지 못했습니다.');await load(true);state.demotionLoaded=false;state.protectionLoaded=false;await loadPromotionCandidates(true)}finally{button.disabled=false}}
  let demotionMemberId=null,exclusionMemberId=null;
  function updateDemotionSubmit(){const value=$('#demotionReasonV371').value.trim();$('#demotionReasonCountV371').textContent=`${$('#demotionReasonV371').value.length} / 100`;$('#demotionConfirmSubmitV371').disabled=!value}
  function openDemotionConfirm(id){const m=state.demotionCandidates.find(x=>x.id===id);if(!m)return;demotionMemberId=id;const a=m.maintenance.activity,i=a.items;$('#demotionConfirmMemberV371').textContent=m.nickname;$('#demotionConfirmRouteV371').textContent=`${m.maintenance.currentRank}에서 ${m.maintenance.targetRank}로 변경합니다.`;$('#demotionConfirmActivityV371').innerHTML=`<strong>최근 30일 활동 ${a.completed} / 4</strong><span>투표 ${i.vote.count}회 · 사이트 방문 ${i.visit.count}일 · 본인 스펙 ${i.specUpdate.count}회 · 운영진 ${i.adminConfirmation.passed?'확인':'미확인'}</span>`;$('#demotionReasonV371').value='';$('#demotionConfirmStatusV371').textContent='';updateDemotionSubmit();$('#demotionConfirmDialogV371').showModal()}
  async function submitDemotion(e){e.preventDefault();const reason=$('#demotionReasonV371').value.trim().slice(0,100),button=$('#demotionConfirmSubmitV371');if(!reason)return;button.disabled=true;button.textContent='처리 중…';try{await api(`/api/admin/members/${demotionMemberId}/demote`,{method:'POST',body:JSON.stringify({reason})});$('#demotionConfirmDialogV371').close();await load(true);state.promotionLoaded=false;state.protectionLoaded=false;await loadDemotionCandidates(true);await loadRankHistory()}catch(err){$('#demotionConfirmStatusV371').textContent=err.code==='DEMOTION_STATE_CHANGED'?'활동·등급·보호 상태가 변경되었습니다. 새로고침 후 다시 확인해 주세요.':'강등을 처리하지 못했습니다.';await loadDemotionCandidates(true)}finally{button.textContent='강등 확정';updateDemotionSubmit()}}
  function updateExclusionSubmit(){const reason=$('#demotionExclusionReasonV371').value.trim(),until=$('#demotionExclusionUntilV371').value;$('#demotionExclusionReasonCountV371').textContent=`${$('#demotionExclusionReasonV371').value.length} / 100`;$('#demotionExclusionSubmitV371').disabled=!reason||!until}
  function openDemotionExclusion(id){const m=state.demotionCandidates.find(x=>x.id===id);if(!m)return;exclusionMemberId=id;$('#demotionExclusionMemberV371').textContent=m.nickname;$('#demotionExclusionUntilV371').min=new Date().toISOString().slice(0,10);$('#demotionExclusionUntilV371').value='';$('#demotionExclusionReasonV371').value='';$('#demotionExclusionStatusV371').textContent='';updateExclusionSubmit();$('#demotionExclusionDialogV371').showModal()}
  async function submitDemotionExclusion(e){e.preventDefault();const button=$('#demotionExclusionSubmitV371'),payload={excludedUntil:$('#demotionExclusionUntilV371').value,reason:$('#demotionExclusionReasonV371').value.trim().slice(0,100)};button.disabled=true;button.textContent='적용 중…';try{await api(`/api/admin/members/${exclusionMemberId}/demotion-exclusion`,{method:'POST',body:JSON.stringify(payload)});$('#demotionExclusionDialogV371').close();await loadDemotionCandidates(true)}catch(_){$('#demotionExclusionStatusV371').textContent='제외 설정을 저장하지 못했습니다.'}finally{button.textContent='제외 적용';updateExclusionSubmit()}}
  async function revokeDemotionExclusion(id){if(!confirm('강등 검토 제외를 해제할까요?'))return;await api(`/api/admin/members/${id}/demotion-exclusion`,{method:'DELETE'});await loadDemotionCandidates(true)}
  function promotionRuleForm(rank){const value=Number($(`#promotion${rank}VehicleV367`).value),unit=$(`#promotion${rank}VehicleUnitV434`).value;return {industryLevel:Number($(`#promotion${rank}IndustryV367`).value),vehicle1PowerValue:value,vehicle1PowerUnit:unit,vehicle1PowerNormalized:value*(unit==='G'?1000:1)}}
  function updatePromotionRulePreview(rank){const input=$(`#promotion${rank}VehicleV367`),unit=$(`#promotion${rank}VehicleUnitV434`),preview=$(`#promotion${rank}PreviewV434`),value=Number(input?.value);if(preview)preview.textContent=`연맹원 표시: 필요 ${Number.isFinite(value)&&value>0?promotionPowerText(value,unit?.value):'-'}`}
  async function loadPromotionRules(){const d=await api('/api/admin/promotion-rules');state.rules=d.rules;['R2','R3'].forEach(rank=>{const rule=d.rules[rank],unit=rule.vehicle1PowerUnit==='M'?'M':'G',value=Number(rule.vehicle1PowerValue);$(`#promotion${rank}IndustryV367`).innerHTML=Array.from({length:10},(_,i)=>10-i).map(n=>`<option value="${n}">I${n}</option>`).join('');$(`#promotion${rank}IndustryV367`).value=rule.industryLevel;$(`#promotion${rank}VehicleUnitV434`).value=unit;$(`#promotion${rank}VehicleV367`).value=Number.isFinite(value)&&value>0?value:(unit==='M'?rule.vehicle1PowerNormalized:rule.vehicle1PowerNormalized/1000);updatePromotionRulePreview(rank);[$(`#promotion${rank}VehicleV367`),$(`#promotion${rank}VehicleUnitV434`)].forEach(el=>{if(el&&!el.dataset.v434Bound){el.dataset.v434Bound='true';el.addEventListener(el.tagName==='SELECT'?'change':'input',()=>updatePromotionRulePreview(rank))}})});document.querySelectorAll('#promotionSettingsV367 select,#promotionSettingsV367 input,#promotionRulesSaveV367').forEach(x=>x.disabled=!d.editable)}
  async function savePromotionRules(){const rules={R2:promotionRuleForm('R2'),R3:promotionRuleForm('R3')};if(!confirm('승급 조건을 저장할까요?\n\n승급 검토 대상과 마이페이지 달성 상태가 다시 계산되며 기존 등급은 변경되지 않습니다.'))return;try{await api('/api/admin/promotion-rules',{method:'PUT',body:JSON.stringify(rules)});$('#promotionRulesStatusV367').textContent='승급 조건을 저장했습니다.';await loadPromotionRules();state.promotionLoaded=false;await loadPromotionCandidates(true)}catch(e){$('#promotionRulesStatusV367').textContent=e.code==='INVALID_PROMOTION_RULES'?'R3 조건은 R2보다 낮을 수 없습니다.':'저장하지 못했습니다.'}}
  function roleBadge(m){const level=m.adminLevel||(m.role==="admin"?"super":null);return level?`<span class="admin-role-badge ${level}">${level==="super"?"최고관리자":"부관리자"}</span>`:""}
  function protectionBadge(m){const p=m.newMemberProtection;if(!p?.active)return '';return `<span class="new-protection-badge" title="보호 종료 ${dateOnly(p.until)}">🛡 신규 보호 ${Math.max(1,Number(p.day||1))}/10</span>`}
  function row(m){
    const checked=state.selected.has(m.id)?"checked":"";
    return `<tr data-id="${m.id}" class="${state.activeId===m.id?"active":""}">
      <td><input class="v188-select" type="checkbox" ${checked}></td>
      <td><button class="v188-open" type="button">${esc(m.nickname)}</button>${roleBadge(m)}${protectionBadge(m)}</td>
      <td>${esc(m.memberRank)}</td><td><b class="spec-value">${esc(industry(m.industryLevel))}</b></td>
      <td><b class="spec-value">${fmt(m.power)}</b></td><td><b class="spec-value">${esc(vehicle(m,1))}</b></td><td><b class="spec-value">${esc(vehicle(m,2))}</b></td></tr>`;
  }
  function card(m){
    const selected=state.selected.has(m.id)?"selected":"";
    return `<article class="v188-member-card ${selected}" data-id="${m.id}" tabindex="0" aria-label="${esc(m.nickname)} 상세 열기">
      <div class="v188-card-top"><strong>${esc(m.nickname)}${roleBadge(m)}${protectionBadge(m)}</strong><span>${esc(m.memberRank)} · <b class="spec-value">${esc(industry(m.industryLevel))}</b></span></div>
      <div class="v188-card-grid"><span>CP<b class="spec-value">${fmt(m.power)}</b></span><span>#1<b class="spec-value">${esc(vehicle(m,1))}</b></span><span>#2<b class="spec-value">${esc(vehicle(m,2))}</b></span></div>
      <i class="v188-card-check">✓</i>
    </article>`;
  }
  function render(){
    renderStats();
    $("#memberRowsV188").innerHTML=state.items.map(row).join("");
    $("#memberCardsV188").innerHTML=state.items.map(card).join("");
    $("#memberPageV188").textContent=`${state.page} / ${state.totalPages}`;
    $("#memberPrevV188").disabled=state.page<=1;$("#memberNextV188").disabled=state.page>=state.totalPages;
    bindRows();updateBulk();
  }
  function bindRows(){
    document.querySelectorAll("#memberRowsV188 tr").forEach(tr=>{
      const id=Number(tr.dataset.id);
      tr.querySelector(".v188-open").onclick=()=>openDetail(id);
      tr.querySelector(".v188-select").onchange=e=>toggle(id,e.target.checked);
    });
    document.querySelectorAll(".v188-member-card").forEach(card=>{
      const id=Number(card.dataset.id);
      let timer=null,moved=false;
      const start=()=>{moved=false;timer=setTimeout(()=>{toggle(id,!state.selected.has(id));navigator.vibrate?.(30)},650)};
      const cancel=()=>{clearTimeout(timer);timer=null};
      card.addEventListener("touchstart",start,{passive:true});
      card.addEventListener("touchmove",()=>{moved=true;cancel()},{passive:true});
      card.addEventListener("touchend",()=>{const had=timer;cancel();if(had&&!moved&&!state.selected.size)openDetail(id)});
      card.addEventListener("mousedown",start);card.addEventListener("mouseup",()=>{const had=timer;cancel();if(had&&!state.selected.size)openDetail(id)});card.addEventListener("mouseleave",cancel);
      card.addEventListener("keydown",e=>{if(e.key==="Enter")openDetail(id)});
    });
  }
  function toggle(id,on){on?state.selected.add(id):state.selected.delete(id);render()}
  function updateBulk(){
    $("#memberSelectedCountV188").textContent=state.selected.size;
    $("#memberBulkBarV188").hidden=!state.selected.size;
    $("#memberSelectAllV188").checked=state.items.length>0&&state.items.every(m=>state.selected.has(m.id));
  }
  function rankOptions(m){
    return ["R5","R4","R3","R2","R1"].map(v=>`<option ${v===m.memberRank?"selected":""}>${v}</option>`).join("");
  }
  function industryOptions(current){
    return `<option value="">선택하세요</option>`+["I10","I9","I8","I7","I6","I5","I4","I3","I2","I1"].map(v=>`<option ${v===current?"selected":""}>${v}</option>`).join("");
  }
  function classOptions(current){
    const labels={fighter:"전사",shooter:"사수",rider:"기병"};
    return `<option value="">선택 안 함</option>`+["fighter","shooter","rider"].map(v=>`<option value="${v}" ${v===current?"selected":""}>${labels[v]}</option>`).join("");
  }
  function nullableValue(v){return v==null?"":String(v)}
  function dirty(section){window.markAdminDirty?.(`member:${section}`)}
  function clean(section){window.clearAdminDirty?.(`member:${section}`)}
  function memberDirty(section){return window.hasAdminDirty?.(`member:${section}`)===true}
  function anyMemberDirty(){return ["profile","specs","memo"].some(memberDirty)}
  function clearMemberDirty(){["profile","specs","memo"].forEach(clean)}
  function detailHtml(m,history){
    const historyHtml=(history||[]).length?(history||[]).map(h=>`<li><time>${date(h.changed_at)}</time><span>${esc(h.old_nickname)} → <b>${esc(h.new_nickname)}</b></span></li>`).join(""):"<li>변경 이력이 없습니다.</li>";
    const level=m.adminLevel||(m.role==="admin"?"super":null);
    const isSuper=state.currentAdmin?.adminLevel==="super";
    const adminLocked=(level==="super"||(!isSuper&&m.role==="admin"))?"disabled":"";
    const permissionHtml=level==="super"?`<div class="admin-permission-box"><label>관리 권한<input value="최고관리자" disabled></label><small class="admin-permission-help">최고관리자 권한은 변경할 수 없습니다.</small></div>`:`<div class="admin-permission-box"><label>관리 권한<select name="adminLevel" ${isSuper?"":"disabled"}><option value="member" ${!level?"selected":""}>일반 연맹원</option><option value="sub" ${level==="sub"?"selected":""}>부관리자</option></select></label><small class="admin-permission-help">${isSuper?"최고관리자만 부관리자를 임명하거나 해제할 수 있습니다.":"관리자 권한은 최고관리자만 변경할 수 있습니다."}</small></div>`;
    return `<div class="v188-detail-head"><button id="memberDetailBackV188" class="secondary" type="button">← 목록</button><div><h2>${esc(m.nickname)}</h2><p>${esc(m.memberRank)} · <b class="spec-value">${esc(industry(m.industryLevel))}</b> · <b class="spec-value">${fmt(m.power)}</b></p></div></div>
    <form id="memberDetailFormV188" class="v188-detail-form">
      <details open><summary>기본 프로필</summary><div class="v188-detail-grid">
        <label>로그인 ID<input value="${esc(m.loginId)}" disabled></label>
        <label>닉네임<input name="nickname" value="${esc(m.nickname)}"></label>
        <label>연맹원 등급<select name="memberRank" ${adminLocked}>${rankOptions(m)}</select></label>
        <label>연맹원 상태<select name="status" ${adminLocked}>${[["active","활성"],["suspended","정지"],["left","탈퇴"]].map(([v,l])=>`<option ${v===m.status?"selected":""} value="${v}">${l}</option>`).join("")}</select></label>
        <label>가입일<input value="${date(m.createdAt)}" disabled></label>
        <label>최근 로그인<input value="${date(m.lastLoginAt)}" disabled></label>
        <label>가입 승인<input value="${esc(m.approvalStatus||"approved")}" disabled></label>
        ${permissionHtml}
      </div></details>
      <details open><summary>세부 스펙</summary><div class="v188-detail-grid">
        <label>산업 레벨<select name="industryLevel">${industryOptions(m.industryLevel)}</select></label>
        <label class="v188-power-field">전투력(CP)<input name="power" inputmode="numeric" value="${m.power==null?"":Number(m.power).toLocaleString("ko-KR")}"><small>숫자만 입력하면 자동으로 쉼표가 표시됩니다.</small></label>
        <label>1번 차량 병종<select name="vehicle1Class">${classOptions(m.vehicle1Class)}</select></label>
        <label>1번 차량 파워<input name="vehicle1PowerValue" inputmode="decimal" value="${nullableValue(m.vehicle1PowerValue)}" placeholder="예: 520.5"></label>
        <label>1번 차량 단위<select name="vehicle1PowerUnit"><option value="">선택 안 함</option><option ${m.vehicle1PowerUnit==="M"?"selected":""}>M</option><option ${m.vehicle1PowerUnit==="G"?"selected":""}>G</option></select></label>
        <label>2번 차량 병종<select name="vehicle2Class">${classOptions(m.vehicle2Class)}</select></label>
        <label>2번 차량 파워<input name="vehicle2PowerValue" inputmode="decimal" value="${nullableValue(m.vehicle2PowerValue)}" placeholder="예: 410.2"></label>
        <label>2번 차량 단위<select name="vehicle2PowerUnit"><option value="">선택 안 함</option><option ${m.vehicle2PowerUnit==="M"?"selected":""}>M</option><option ${m.vehicle2PowerUnit==="G"?"selected":""}>G</option></select></label>
        <label>시즌전 참여<select name="seasonWarAvailable"><option value="">선택 안 함</option><option value="1" ${m.seasonWarAvailable===true?"selected":""}>가능</option><option value="0" ${m.seasonWarAvailable===false?"selected":""}>불가능</option></select></label>
        <label>BGB 가능 시간<select name="bgbAvailableHour"><option value="">선택 안 함</option>${Array.from({length:24},(_,h)=>`<option value="${h}" ${Number(m.bgbAvailableHour)===h?"selected":""}>${String(h).padStart(2,"0")}:00</option>`).join("")}</select></label>
        <label>Discord<input name="discord" value="${esc(m.discord||"")}" maxlength="100"></label>
        <label>Telegram<input name="telegram" value="${esc(m.telegram||"")}" maxlength="100"></label>
      </div><div class="v188-spec-actions"><button id="memberSpecsSaveV228" class="primary" type="button">세부 스펙 저장</button><button id="memberSpecsResetV228" class="danger" type="button">세부 스펙 초기화</button></div></details>
      <details><summary>닉네임 변경 이력</summary><ul class="v188-history">${historyHtml}</ul></details>
      <details><summary>관리자 메모</summary><textarea name="adminMemo" maxlength="1000" rows="6">${esc(m.adminMemo||"")}</textarea><button id="memberMemoSaveV188" class="secondary" type="button">메모 저장</button></details>
      <div class="v188-detail-actions"><button class="primary" type="submit">기본 프로필 저장</button><button id="memberResetPasswordV188" class="secondary" type="button">비밀번호 초기화</button><button id="memberDeleteV188" class="danger" type="button">연맹원 삭제</button></div>
    </form>`;
  }
  function setDetailMode(open){
    const manager=$("#memberManagerV188")||document.querySelector(".v188-member-manager");
    $("#memberDetailV188")?.classList.toggle("open",open);
    manager?.classList.toggle("detail-active",open);
    if(!open)state.activeId=null;
  }
  async function openDetail(id){
    state.activeId=id;
    const data=await api(`/api/admin/members/${id}`);
    $("#memberDetailV188").innerHTML=detailHtml(data.member,data.nicknameHistory);
    setDetailMode(true);
    bindDetail(data.member);
  }
  function specPayload(f){
    const power=String(f.power.value||"").replace(/,/g,"").trim();
    return {
      power:power?Number(power):null,
      industryLevel:f.industryLevel.value,
      vehicle1Class:f.vehicle1Class.value||null,
      vehicle1PowerValue:f.vehicle1PowerValue.value||null,
      vehicle1PowerUnit:f.vehicle1PowerUnit.value||null,
      vehicle2Class:f.vehicle2Class.value||null,
      vehicle2PowerValue:f.vehicle2PowerValue.value||null,
      vehicle2PowerUnit:f.vehicle2PowerUnit.value||null,
      seasonWarAvailable:f.seasonWarAvailable.value===""?null:f.seasonWarAvailable.value==="1",
      bgbAvailableHour:f.bgbAvailableHour.value===""?null:Number(f.bgbAvailableHour.value),
      discord:f.discord.value.trim()||null,
      telegram:f.telegram.value.trim()||null
    };
  }
  function bindDetail(member){
    $("#memberDetailBackV188").onclick=()=>{if(anyMemberDirty()&&!confirm("저장하지 않은 변경사항이 있습니다. 상세 화면을 닫을까요?"))return;clearMemberDirty();setDetailMode(false);render()};
    const form=$("#memberDetailFormV188");
    [form.nickname,form.memberRank,form.status,form.adminLevel].filter(Boolean).forEach(el=>el.addEventListener(el.tagName==="SELECT"?"change":"input",()=>dirty("profile")));
    [form.industryLevel,form.power,form.vehicle1Class,form.vehicle1PowerValue,form.vehicle1PowerUnit,form.vehicle2Class,form.vehicle2PowerValue,form.vehicle2PowerUnit,form.seasonWarAvailable,form.bgbAvailableHour,form.discord,form.telegram].filter(Boolean).forEach(el=>el.addEventListener(el.tagName==="SELECT"?"change":"input",()=>dirty("specs")));
    form.adminMemo.addEventListener("input",()=>dirty("memo"));
    form.power.addEventListener("input",e=>{const digits=e.target.value.replace(/\D/g,"");e.target.value=digits?Number(digits).toLocaleString("ko-KR"):""});
    form.onsubmit=async e=>{
      e.preventDefault();
      const f=e.currentTarget;
      const submit=f.querySelector('button[type="submit"]');
      const nextAdminLevel=f.adminLevel&&state.currentAdmin?.adminLevel==="super"?f.adminLevel.value:undefined;
      const currentAdminLevel=member.adminLevel||"member";
      if(nextAdminLevel!==undefined&&nextAdminLevel!==currentAdminLevel){
        const confirmed=confirm(nextAdminLevel==="sub"?`${member.nickname} 연맹원을 부관리자로 임명하시겠습니까?`:`${member.nickname} 연맹원의 부관리자 권한을 해제하시겠습니까?`);
        if(!confirmed)return;
      }
      try{
        if(submit)submit.disabled=true;
        await api(`/api/admin/members/${member.id}`,{method:"PUT",body:JSON.stringify({
          nickname:f.nickname.value,
          memberRank:f.memberRank.value,
          status:f.status.value,
          ...(nextAdminLevel!==undefined?{adminLevel:nextAdminLevel}:{})
        })});
        clean("profile");
        alert(nextAdminLevel!==undefined&&nextAdminLevel!==currentAdminLevel?(nextAdminLevel==="sub"?"기본 프로필을 저장하고 부관리자로 임명했습니다.":"기본 프로필을 저장하고 부관리자 권한을 해제했습니다."):"기본 프로필이 저장되었습니다.");
        invalidateReviews();await load();
        if(!anyMemberDirty())await openDetail(member.id);
      }catch(error){
        console.error("[MEMBER_PROFILE_SAVE_FAILED]",error);
        const messages={SUB_ADMIN_LIMIT_REACHED:"부관리자는 최대 2명까지 임명할 수 있습니다. 기존 부관리자를 먼저 해임해 주세요.",SUPER_ADMIN_REQUIRED:"최고관리자만 부관리자를 임명하거나 해제할 수 있습니다.",PRIMARY_ADMIN_PROTECTED:"최고관리자 권한은 변경할 수 없습니다.",ADMIN_ACCOUNT_PROTECTED:"해당 관리자 계정은 수정할 수 없습니다.",NICKNAME_TAKEN:"이미 사용 중인 닉네임입니다.",VALIDATION_ERROR:"입력값을 다시 확인해 주세요."};
        alert(messages[error.code]||"기본 프로필 저장에 실패했습니다.");
      }finally{if(submit)submit.disabled=false;}
    };
    $("#memberSpecsSaveV228").onclick=async()=>{
      await api(`/api/admin/members/${member.id}/specs`,{method:"PUT",body:JSON.stringify(specPayload(form))});
      clean("specs");alert("세부 스펙이 저장되었습니다.");state.promotionLoaded=false;await load();if(!anyMemberDirty())await openDetail(member.id);
    };
    $("#memberSpecsResetV228").onclick=async()=>{
      if(!confirm(`${member.nickname} 연맹원의 세부 스펙 전체를 초기화할까요?`))return;
      await api(`/api/admin/members/${member.id}/specs`,{method:"DELETE",body:null});
      clean("specs");alert("세부 스펙이 초기화되었습니다.");state.promotionLoaded=false;await load();if(!anyMemberDirty())await openDetail(member.id);
    };
    $("#memberMemoSaveV188").onclick=async()=>{const memo=form.adminMemo.value;await api(`/api/admin/members/${member.id}/memo`,{method:"PUT",body:JSON.stringify({memo})});clean("memo");alert("메모가 저장되었습니다.")};
    $("#memberResetPasswordV188").onclick=async()=>{if(!confirm("임시 비밀번호를 발급할까요?"))return;const d=await api(`/api/admin/members/${member.id}/reset-password`,{method:"POST",body:"{}"});prompt("임시 비밀번호",d.temporaryPassword)};
    $("#memberDeleteV188").onclick=async()=>{if(!confirm(`${member.nickname} 연맹원을 삭제할까요?`))return;await api(`/api/admin/members/${member.id}`,{method:"DELETE",body:null});clearMemberDirty();setDetailMode(false);invalidateReviews();await load(true)};
  }
  function bulkOptions(){
    const field=$("#memberBulkFieldV188").value;
    const values=field==="memberRank"?["R1","R2","R3","R4"]:["active","suspended","left"];
    $("#memberBulkValueV188").innerHTML=values.map(v=>`<option>${v}</option>`).join("");
  }
  async function applyBulk(){
    if(!state.selected.size)return;
    const field=$("#memberBulkFieldV188").value,value=$("#memberBulkValueV188").value;
    if(!confirm(`선택한 ${state.selected.size}명의 정보를 ${value}(으)로 변경할까요?`))return;
    await api("/api/admin/members/bulk",{method:"POST",body:JSON.stringify({memberIds:[...state.selected],field,value})});
    state.selected.clear();invalidateReviews();await load();
  }
  function exportExcel(){
    if(!window.XLSX)return alert("Excel 라이브러리를 불러오지 못했습니다.");
    const rows=(state.selected.size?state.items.filter(m=>state.selected.has(m.id)):state.items).map(m=>({
      Nickname:m.nickname,Rank:m.memberRank,Industry:m.industryLevel,Power:m.power,
      "Vehicle 1 Class":m.vehicle1Class||"","Vehicle 1 Power":m.vehicle1PowerValue??"","Vehicle 1 Unit":m.vehicle1PowerUnit||"",
      "Vehicle 2 Class":m.vehicle2Class||"","Vehicle 2 Power":m.vehicle2PowerValue??"","Vehicle 2 Unit":m.vehicle2PowerUnit||"",
      "Season War":m.seasonWarAvailable==null?"":m.seasonWarAvailable?"Yes":"No","BGB Hour":m.bgbAvailableHour??"",
      "Login ID":m.loginId,Status:m.status,"Approval":m.approvalStatus,"Joined":m.createdAt,"Last Login":m.lastLoginAt||""
    }));
    const wb=XLSX.utils.book_new(),ws=XLSX.utils.json_to_sheet(rows);XLSX.utils.book_append_sheet(wb,ws,"Members");XLSX.writeFile(wb,`EZPK_Members_${new Date().toISOString().slice(0,10)}.xlsx`);
  }
  function logLabel(v){return ({admin_permission:"관리자 권한",member:"연맹원",event:"이벤트",vote:"투표",alliance_layout:"연맹 배치",bgb:"BGB",capital_war:"수도전",season:"시즌",migration:"이민 신청",request:"요청",account:"계정"})[v]||v||"-"}
  async function loadLogs(){if(state.currentAdmin?.adminLevel!=="super")return;const p=new URLSearchParams({page:String(state.logPage),limit:"30"});const q=$("#adminLogSearchV299")?.value.trim();const c=$("#adminLogCategoryV299")?.value;const actorLevel=$("#adminLogActorLevelV310")?.value;const result=$("#adminLogResultV310")?.value;const dateFrom=$("#adminLogDateFromV310")?.value;const dateTo=$("#adminLogDateToV310")?.value;if(q)p.set("q",q);if(c)p.set("category",c);if(actorLevel)p.set("actorLevel",actorLevel);if(result)p.set("result",result);if(dateFrom)p.set("dateFrom",dateFrom);if(dateTo)p.set("dateTo",dateTo);const d=await api(`/api/admin/logs?${p}`);state.logTotalPages=Math.max(1,d.pagination?.totalPages||1);if(state.logPage>state.logTotalPages){state.logPage=state.logTotalPages;return loadLogs()}const rows=d.items||[];$("#adminLogRowsV299").innerHTML=rows.map(x=>`<tr><td>${date(x.created_at)}</td><td>${esc(x.actor_nickname)} ${x.actor_admin_level==="super"?"[최고]":"[부]"}</td><td>${esc(logLabel(x.category))}</td><td>${esc(x.action)}</td><td>${esc(x.target_name||"-")}</td><td>${esc(x.result)}</td></tr>`).join("")||`<tr><td colspan="6">조건에 맞는 기록이 없습니다.</td></tr>`;$("#adminLogCardsV299").innerHTML=rows.map(x=>`<article class="admin-log-card"><strong>${esc(x.action)}</strong><small>${date(x.created_at)}</small><span>처리자 ${esc(x.actor_nickname)} · ${x.actor_admin_level==="super"?"최고관리자":"부관리자"}</span><span>대상 ${esc(x.target_name||"-")}</span><span>${esc(logLabel(x.category))} · ${esc(x.result)}</span></article>`).join("");$("#adminLogPageV299").textContent=`${state.logPage} / ${state.logTotalPages}`;$("#adminLogPrevV299").disabled=state.logPage<=1;$("#adminLogNextV299").disabled=state.logPage>=state.logTotalPages;}
  function init(){
    if(!$("#memberRowsV188"))return;
    $("#memberCreateSubmitV343").onclick=createMembers;
    $('#activityConfirmFormV369').onsubmit=submitActivityConfirm;$('#activityConfirmCancelV369').onclick=closeActivityConfirm;$('#activityConfirmCloseV370').onclick=closeActivityConfirm;['#activityCheckedLoginV369','#activityCheckedEventV369','#activityCheckedAllianceV369'].forEach(s=>$(s).onchange=updateActivityConfirmState);$('#activityConfirmMemoV369').oninput=e=>$('#activityConfirmCountV370').textContent=`${e.target.value.length} / 100`;$('#activityConfirmDialogV369').addEventListener('cancel',e=>{e.preventDefault();closeActivityConfirm()});
    $('#demotionConfirmFormV371').onsubmit=submitDemotion;$('#demotionConfirmCancelV371').onclick=()=>$('#demotionConfirmDialogV371').close();$('#demotionConfirmCloseV371').onclick=()=>$('#demotionConfirmDialogV371').close();$('#demotionReasonV371').oninput=updateDemotionSubmit;
    $('#demotionExclusionFormV371').onsubmit=submitDemotionExclusion;$('#demotionExclusionCancelV371').onclick=()=>$('#demotionExclusionDialogV371').close();$('#demotionExclusionCloseV371').onclick=()=>$('#demotionExclusionDialogV371').close();$('#demotionExclusionReasonV371').oninput=updateExclusionSubmit;$('#demotionExclusionUntilV371').onchange=updateExclusionSubmit;
    $("#promotionCandidatesOpenV367").onclick=async()=>{$('.v188-member-manager').classList.remove('demotion-mode','protection-mode');$('.v188-member-manager').classList.add('promotion-mode');$('#demotionCandidatesV371').hidden=true;$('#newProtectionV436').hidden=true;$('#promotionCandidatesV367').hidden=false;await loadPromotionCandidates()};
    $("#promotionCandidatesBackV367").onclick=()=>{$('.v188-member-manager').classList.remove('promotion-mode');$('#promotionCandidatesV367').hidden=true};
    $("#promotionCandidatesRefreshV367").onclick=()=>loadPromotionCandidates(true);
    $('#demotionCandidatesOpenV371').onclick=async()=>{$('.v188-member-manager').classList.remove('promotion-mode','protection-mode');$('.v188-member-manager').classList.add('demotion-mode');$('#promotionCandidatesV367').hidden=true;$('#newProtectionV436').hidden=true;$('#demotionCandidatesV371').hidden=false;await loadDemotionCandidates();await loadRankHistory()};
    $('#demotionCandidatesBackV371').onclick=()=>{$('.v188-member-manager').classList.remove('demotion-mode');$('#demotionCandidatesV371').hidden=true};
    $('#demotionCandidatesRefreshV371').onclick=async()=>{await loadDemotionCandidates(true);await loadRankHistory()};
    $('#newProtectionOpenV436').onclick=async()=>{$('.v188-member-manager').classList.remove('promotion-mode','demotion-mode');$('.v188-member-manager').classList.add('protection-mode');$('#promotionCandidatesV367').hidden=true;$('#demotionCandidatesV371').hidden=true;$('#newProtectionV436').hidden=false;await loadNewProtection()};
    $('#newProtectionBackV436').onclick=()=>{$('.v188-member-manager').classList.remove('protection-mode');$('#newProtectionV436').hidden=true};
    $('#newProtectionRefreshV436').onclick=()=>loadNewProtection(true);
    ['#newProtectionOpenV436','#promotionCandidatesOpenV367','#demotionCandidatesOpenV371'].forEach(s=>{const el=$(s);el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}}});
    $("#promotionRulesSaveV367").onclick=savePromotionRules;
    $("#memberSearchV188").oninput=e=>{clearTimeout(init.t);init.t=setTimeout(()=>{state.query=e.target.value.trim();load(true)},250)};
    $("#memberRankV188").onchange=e=>{state.rank=e.target.value;load(true)};
    $("#memberSortV188").onchange=e=>{state.sort=e.target.value;load(true)};
    $("#memberLimitV188").onchange=e=>{state.limit=Math.max(10,Number(e.target.value)||10);load(true)};
    $("#memberRefreshV188").onclick=()=>{state.sort="default";$("#memberSortV188").value="default";load(true)};
    $("#memberExportV188").onclick=exportExcel;
    $("#memberPrevV188").onclick=()=>{if(state.page>1){state.page--;load()}};
    $("#memberNextV188").onclick=()=>{if(state.page<state.totalPages){state.page++;load()}};
    $("#memberSelectAllV188").onchange=e=>{state.items.forEach(m=>e.target.checked?state.selected.add(m.id):state.selected.delete(m.id));render()};
    $("#memberBulkFieldV188").onchange=bulkOptions;$("#memberBulkApplyV188").onclick=applyBulk;
    $("#memberBulkCancelV188").onclick=()=>{state.selected.clear();render()};bulkOptions();
    const startForAdmin=member=>{if(!member)return;state.currentAdmin=member;const level=state.currentAdmin?.adminLevel||(state.currentAdmin?.role==="admin"?"super":null);state.currentAdmin.adminLevel=level;load(true);loadPromotionRules();if(level==="super")loadLogs()};
    window.addEventListener("ezpk-admin-ready",e=>startForAdmin(e.detail?.member||null));
    const bootstrapState=window.EZPKAdminBootstrap?.getState?.();if(bootstrapState?.ready&&bootstrapState?.member)startForAdmin(bootstrapState.member);
    $("#adminLogRefreshV299").onclick=()=>loadLogs();["#adminLogCategoryV299","#adminLogActorLevelV310","#adminLogResultV310","#adminLogDateFromV310","#adminLogDateToV310"].forEach(selector=>{const el=$(selector);if(el)el.onchange=()=>{state.logPage=1;loadLogs()}});$("#adminLogSearchV299").oninput=()=>{clearTimeout(init.lt);init.lt=setTimeout(()=>{state.logPage=1;loadLogs()},250)};$("#adminLogPrevV299").onclick=()=>{if(state.logPage>1){state.logPage--;loadLogs()}};$("#adminLogNextV299").onclick=()=>{if(state.logPage<state.logTotalPages){state.logPage++;loadLogs()}};
  }
  window.EZPKMemberManagerV188={load,renderFromShared:()=>{}};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
