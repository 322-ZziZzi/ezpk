(() => {
  "use strict";
  const state={items:[],stats:{},page:1,totalPages:1,selected:new Set(),activeId:null,query:"",rank:"",sort:"default",limit:10,longPress:null,currentAdmin:null,logPage:1,logTotalPages:1};
  const $=s=>document.querySelector(s);
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const fmt=n=>window.EZPKVehiclePower?.formatCombatPower(n)??"-";
  const industry=v=>window.EZPKVehiclePower?.formatIndustryLevel(v)??"-";
  const vehicle=(m,vehicleNumber=1)=>window.EZPKVehiclePower?.formatMember(m,vehicleNumber,{maximumFractionDigits:1,mMaximumFractionDigits:0})??"-";
  const date=v=>v?new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(new Date(v)):"-";
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
    state.items=data.items||[];state.stats=data.stats||{};state.totalPages=Math.max(1,data.pagination?.totalPages||1);
    render();
    syncShared();
  }
  function syncShared(){
    if(typeof window.membersData!=="undefined"){
      window.membersData={lastUpdated:new Date().toISOString().slice(0,10),members:state.items.map(m=>window.normalizeMember?window.normalizeMember(m):m)};
    }
    window.dispatchEvent(new CustomEvent("ezpk-admin-members-updated",{detail:{members:state.items}}));
  }
  function renderStats(){document.querySelectorAll("[data-stat]").forEach(el=>{const value=Number(state.stats[el.dataset.stat]||0);el.textContent=Number.isFinite(value)?Math.max(0,Math.floor(value)).toLocaleString("ko-KR"):"0"})}
  function roleBadge(m){const level=m.adminLevel||(m.role==="admin"?"super":null);return level?`<span class="admin-role-badge ${level}">${level==="super"?"최고관리자":"부관리자"}</span>`:""}
  function row(m){
    const checked=state.selected.has(m.id)?"checked":"";
    return `<tr data-id="${m.id}" class="${state.activeId===m.id?"active":""}">
      <td><input class="v188-select" type="checkbox" ${checked}></td>
      <td><button class="v188-open" type="button">${esc(m.nickname)}</button>${roleBadge(m)}</td>
      <td>${esc(m.memberRank)}</td><td><b class="spec-value">${esc(industry(m.industryLevel))}</b></td>
      <td><b class="spec-value">${fmt(m.power)}</b></td><td><b class="spec-value">${esc(vehicle(m,1))}</b></td><td><b class="spec-value">${esc(vehicle(m,2))}</b></td></tr>`;
  }
  function card(m){
    const selected=state.selected.has(m.id)?"selected":"";
    return `<article class="v188-member-card ${selected}" data-id="${m.id}" tabindex="0" aria-label="${esc(m.nickname)} 상세 열기">
      <div class="v188-card-top"><strong>${esc(m.nickname)}${roleBadge(m)}</strong><span>${esc(m.memberRank)} · <b class="spec-value">${esc(industry(m.industryLevel))}</b></span></div>
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
    const permissionHtml=level==="super"?`<div class="admin-permission-box"><label>관리 권한<input value="최고관리자" disabled></label><small class="admin-permission-help">최고관리자 권한은 변경할 수 없습니다.</small></div>`:`<div class="admin-permission-box"><label>관리 권한<select name="adminLevel" ${isSuper?"":"disabled"}><option value="member" ${!level?"selected":""}>일반 회원</option><option value="sub" ${level==="sub"?"selected":""}>부관리자</option></select></label><small class="admin-permission-help">${isSuper?"최고관리자만 부관리자를 임명하거나 해제할 수 있습니다.":"관리자 권한은 최고관리자만 변경할 수 있습니다."}</small></div>`;
    return `<div class="v188-detail-head"><button id="memberDetailBackV188" class="secondary" type="button">← 목록</button><div><h2>${esc(m.nickname)}</h2><p>${esc(m.memberRank)} · <b class="spec-value">${esc(industry(m.industryLevel))}</b> · <b class="spec-value">${fmt(m.power)}</b></p></div></div>
    <form id="memberDetailFormV188" class="v188-detail-form">
      <details open><summary>기본 프로필</summary><div class="v188-detail-grid">
        <label>로그인 ID<input value="${esc(m.loginId)}" disabled></label>
        <label>닉네임<input name="nickname" value="${esc(m.nickname)}"></label>
        <label>회원 등급<select name="memberRank" ${adminLocked}>${rankOptions(m)}</select></label>
        <label>회원 상태<select name="status" ${adminLocked}>${[["active","활성"],["suspended","정지"],["left","탈퇴"]].map(([v,l])=>`<option ${v===m.status?"selected":""} value="${v}">${l}</option>`).join("")}</select></label>
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
      <div class="v188-detail-actions"><button class="primary" type="submit">기본 프로필 저장</button><button id="memberResetPasswordV188" class="secondary" type="button">비밀번호 초기화</button><button id="memberDeleteV188" class="danger" type="button">회원 삭제</button></div>
    </form>`;
  }
  async function openDetail(id){
    state.activeId=id;
    const data=await api(`/api/admin/members/${id}`);
    $("#memberDetailV188").innerHTML=detailHtml(data.member,data.nicknameHistory);
    $("#memberDetailV188").classList.add("open");
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
    $("#memberDetailBackV188").onclick=()=>{if(anyMemberDirty()&&!confirm("저장하지 않은 변경사항이 있습니다. 상세 화면을 닫을까요?"))return;clearMemberDirty();$("#memberDetailV188").classList.remove("open")};
    const form=$("#memberDetailFormV188");
    [form.nickname,form.memberRank,form.status,form.adminLevel].filter(Boolean).forEach(el=>el.addEventListener(el.tagName==="SELECT"?"change":"input",()=>dirty("profile")));
    [form.industryLevel,form.power,form.vehicle1Class,form.vehicle1PowerValue,form.vehicle1PowerUnit,form.vehicle2Class,form.vehicle2PowerValue,form.vehicle2PowerUnit,form.seasonWarAvailable,form.bgbAvailableHour,form.discord,form.telegram].filter(Boolean).forEach(el=>el.addEventListener(el.tagName==="SELECT"?"change":"input",()=>dirty("specs")));
    form.adminMemo.addEventListener("input",()=>dirty("memo"));
    form.power.addEventListener("input",e=>{const digits=e.target.value.replace(/\D/g,"");e.target.value=digits?Number(digits).toLocaleString("ko-KR"):""});
    form.onsubmit=async e=>{
      e.preventDefault();const f=e.currentTarget;
      await api(`/api/admin/members/${member.id}`,{method:"PUT",body:JSON.stringify({nickname:f.nickname.value,memberRank:f.memberRank.value,status:f.status.value})});
      if(f.adminLevel&&state.currentAdmin?.adminLevel==="super"){const next=f.adminLevel.value;const current=member.adminLevel||"member";if(next!==current){if(!confirm(next==="sub"?`${member.nickname} 회원을 부관리자로 임명하시겠습니까?`:`${member.nickname} 회원의 부관리자 권한을 해제하시겠습니까?`))return;await api(`/api/admin/members/${member.id}/permissions`,{method:"PUT",body:JSON.stringify({adminLevel:next})});}}
      clean("profile");alert("기본 프로필이 저장되었습니다.");await load();if(!anyMemberDirty())await openDetail(member.id);
    };
    $("#memberSpecsSaveV228").onclick=async()=>{
      await api(`/api/admin/members/${member.id}/specs`,{method:"PUT",body:JSON.stringify(specPayload(form))});
      clean("specs");alert("세부 스펙이 저장되었습니다.");await load();if(!anyMemberDirty())await openDetail(member.id);
    };
    $("#memberSpecsResetV228").onclick=async()=>{
      if(!confirm(`${member.nickname} 회원의 세부 스펙 전체를 초기화할까요?`))return;
      await api(`/api/admin/members/${member.id}/specs`,{method:"DELETE",body:null});
      clean("specs");alert("세부 스펙이 초기화되었습니다.");await load();if(!anyMemberDirty())await openDetail(member.id);
    };
    $("#memberMemoSaveV188").onclick=async()=>{const memo=form.adminMemo.value;await api(`/api/admin/members/${member.id}/memo`,{method:"PUT",body:JSON.stringify({memo})});clean("memo");alert("메모가 저장되었습니다.")};
    $("#memberResetPasswordV188").onclick=async()=>{if(!confirm("임시 비밀번호를 발급할까요?"))return;const d=await api(`/api/admin/members/${member.id}/reset-password`,{method:"POST",body:"{}"});prompt("임시 비밀번호",d.temporaryPassword)};
    $("#memberDeleteV188").onclick=async()=>{if(!confirm(`${member.nickname} 회원을 삭제할까요?`))return;await api(`/api/admin/members/${member.id}`,{method:"DELETE",body:null});clearMemberDirty();$("#memberDetailV188").classList.remove("open");await load(true)};
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
    state.selected.clear();await load();
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
  function logLabel(v){return ({admin_permission:"관리자 권한",member:"회원",event:"이벤트",vote:"투표",bgb:"BGB",capital_war:"수도전",season:"시즌",request:"요청",account:"계정"})[v]||v||"-"}
  async function loadLogs(){if(state.currentAdmin?.adminLevel!=="super")return;const p=new URLSearchParams({page:String(state.logPage),limit:"30"});const q=$("#adminLogSearchV299")?.value.trim();const c=$("#adminLogCategoryV299")?.value;if(q)p.set("q",q);if(c)p.set("category",c);const d=await api(`/api/admin/logs?${p}`);state.logTotalPages=Math.max(1,d.pagination?.totalPages||1);const rows=d.items||[];$("#adminLogRowsV299").innerHTML=rows.map(x=>`<tr><td>${date(x.created_at)}</td><td>${esc(x.actor_nickname)} ${x.actor_admin_level==="super"?"[최고]":"[부]"}</td><td>${esc(logLabel(x.category))}</td><td>${esc(x.action)}</td><td>${esc(x.target_name||"-")}</td><td>${esc(x.result)}</td></tr>`).join("")||`<tr><td colspan="6">기록이 없습니다.</td></tr>`;$("#adminLogCardsV299").innerHTML=rows.map(x=>`<article class="admin-log-card"><strong>${esc(x.action)}</strong><small>${date(x.created_at)}</small><span>처리자 ${esc(x.actor_nickname)} · ${x.actor_admin_level==="super"?"최고관리자":"부관리자"}</span><span>대상 ${esc(x.target_name||"-")}</span><span>${esc(logLabel(x.category))} · ${esc(x.result)}</span></article>`).join("");$("#adminLogPageV299").textContent=`${state.logPage} / ${state.logTotalPages}`;$("#adminLogPrevV299").disabled=state.logPage<=1;$("#adminLogNextV299").disabled=state.logPage>=state.logTotalPages;}
  function showMemberMode(logMode){$("#memberListContentV299").hidden=logMode;$("#adminLogPanelV299").hidden=!logMode;$("#memberListTabV299").classList.toggle("active",!logMode);$("#adminLogTabV299").classList.toggle("active",logMode);if(logMode)loadLogs();}
  function init(){
    if(!$("#memberRowsV188"))return;
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
    window.addEventListener("ezpk-admin-ready",e=>{state.currentAdmin=e.detail?.member||null;const level=state.currentAdmin?.adminLevel||(state.currentAdmin?.role==="admin"?"super":null);state.currentAdmin.adminLevel=level;$("#adminLogTabV299").hidden=level!=="super";load(true)});
    $("#memberListTabV299").onclick=()=>showMemberMode(false);$("#adminLogTabV299").onclick=()=>showMemberMode(true);$("#adminLogRefreshV299").onclick=()=>loadLogs();$("#adminLogCategoryV299").onchange=()=>{state.logPage=1;loadLogs()};$("#adminLogSearchV299").oninput=()=>{clearTimeout(init.lt);init.lt=setTimeout(()=>{state.logPage=1;loadLogs()},250)};$("#adminLogPrevV299").onclick=()=>{if(state.logPage>1){state.logPage--;loadLogs()}};$("#adminLogNextV299").onclick=()=>{if(state.logPage<state.logTotalPages){state.logPage++;loadLogs()}};
  }
  window.EZPKMemberManagerV188={load,renderFromShared:()=>{}};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();