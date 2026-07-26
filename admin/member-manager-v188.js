(() => {
  "use strict";
  const state={items:[],stats:{},page:1,totalPages:1,selected:new Set(),activeId:null,query:"",rank:"",industry:"",sort:"created_desc",limit:10,longPress:null};
  const $=s=>document.querySelector(s);
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  const fmt=n=>Number(n||0).toLocaleString("ko-KR");
  const vehicle=m=>m.vehicle1PowerValue==null?"-":`${Number(m.vehicle1PowerValue).toLocaleString("ko-KR",{maximumFractionDigits:2})}${m.vehicle1PowerUnit||""}`;
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
    if(state.industry)p.set("industry",state.industry);
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
  function renderStats(){document.querySelectorAll("[data-stat]").forEach(el=>el.textContent=fmt(state.stats[el.dataset.stat]||0))}
  function row(m){
    const checked=state.selected.has(m.id)?"checked":"";
    return `<tr data-id="${m.id}" class="${state.activeId===m.id?"active":""}">
      <td><input class="v188-select" type="checkbox" ${checked}></td>
      <td><button class="v188-open" type="button">${esc(m.nickname)}</button></td>
      <td>${esc(m.memberRank)}</td><td>${esc(m.industryLevel)}</td>
      <td>${fmt(m.power)}</td><td>${esc(vehicle(m))}</td></tr>`;
  }
  function card(m){
    const selected=state.selected.has(m.id)?"selected":"";
    return `<article class="v188-member-card ${selected}" data-id="${m.id}" tabindex="0" aria-label="${esc(m.nickname)} 상세 열기">
      <div class="v188-card-top"><strong>${esc(m.nickname)}</strong><span>${esc(m.memberRank)} · ${esc(m.industryLevel)}</span></div>
      <div class="v188-card-grid"><span>전투력<b>${fmt(m.power)}</b></span><span>1번 차량 파워<b>${esc(vehicle(m))}</b></span></div>
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
  function detailHtml(m,history){
    const historyHtml=(history||[]).length?(history||[]).map(h=>`<li><time>${date(h.changed_at)}</time><span>${esc(h.old_nickname)} → <b>${esc(h.new_nickname)}</b></span></li>`).join(""):"<li>변경 이력이 없습니다.</li>";
    return `<div class="v188-detail-head"><button id="memberDetailBackV188" type="button">← 목록</button><div><h2>${esc(m.nickname)}</h2><p>${esc(m.memberRank)} · ${esc(m.industryLevel)} · ${fmt(m.power)}</p></div></div>
    <form id="memberDetailFormV188" class="v188-detail-form">
      <details open><summary>기본 프로필</summary><div class="v188-detail-grid">
        <label>닉네임<input name="nickname" value="${esc(m.nickname)}"></label>
        <label>로그인 ID<input value="${esc(m.loginId)}" disabled></label>
        <label>등급<select name="memberRank">${["R5","R4","R3","R2","R1"].map(v=>`<option ${v===m.memberRank?"selected":""}>${v}</option>`).join("")}</select></label>
        <label>산업<select name="industryLevel">${["I10","I9","I8","I7","I6","I5","I4","I3","I2","I1"].map(v=>`<option ${v===m.industryLevel?"selected":""}>${v}</option>`).join("")}</select></label>
        <label>전투력<input name="power" type="number" min="1" value="${m.power}"></label>
        <label>상태<select name="status">${["active","suspended","left"].map(v=>`<option ${v===m.status?"selected":""} value="${v}">${v}</option>`).join("")}</select></label>
        <label>가입 승인<input value="${esc(m.approvalStatus||"approved")}" disabled></label>
      </div></details>
      <details><summary>세부 스펙</summary><div class="v188-info-grid">
        <span>1번 차량<b>${esc(m.vehicle1Class||"-")} · ${esc(vehicle(m))}</b></span>
        <span>2번 차량<b>${esc(m.vehicle2Class||"-")} · ${m.vehicle2PowerValue==null?"-":esc(`${m.vehicle2PowerValue}${m.vehicle2PowerUnit||""}`)}</b></span>
        <span>Season War<b>${m.seasonWarAvailable==null?"-":m.seasonWarAvailable?"가능":"불가능"}</b></span>
        <span>BGB<b>${m.bgbAvailableHour==null?"-":String(m.bgbAvailableHour).padStart(2,"0")+":00"}</b></span>
        <span>Discord<b>${esc(m.discord||"-")}</b></span><span>Telegram<b>${esc(m.telegram||"-")}</b></span>
      </div></details>
      <details><summary>계정 정보</summary><div class="v188-info-grid">
        <span>가입일<b>${date(m.createdAt)}</b></span><span>최근 로그인<b>${date(m.lastLoginAt)}</b></span>
        <span>비밀번호 변경<b>${date(m.passwordChangedAt)}</b></span><span>닉네임 변경 횟수<b>${m.nicknameChangeCount||0}</b></span>
      </div></details>
      <details><summary>닉네임 변경 이력</summary><ul class="v188-history">${historyHtml}</ul></details>
      <details><summary>관리자 메모</summary><textarea name="adminMemo" maxlength="1000" rows="6">${esc(m.adminMemo||"")}</textarea><button id="memberMemoSaveV188" class="secondary" type="button">메모 저장</button></details>
      <div class="v188-detail-actions"><button class="primary" type="submit">회원 정보 저장</button><button id="memberResetPasswordV188" class="secondary" type="button">비밀번호 초기화</button><button id="memberDeleteV188" class="danger" type="button">회원 삭제</button></div>
    </form>`;
  }
  async function openDetail(id){
    state.activeId=id;
    const data=await api(`/api/admin/members/${id}`);
    $("#memberDetailV188").innerHTML=detailHtml(data.member,data.nicknameHistory);
    $("#memberDetailV188").classList.add("open");
    bindDetail(data.member);
  }
  function bindDetail(member){
    $("#memberDetailBackV188").onclick=()=>$("#memberDetailV188").classList.remove("open");
    $("#memberDetailFormV188").onsubmit=async e=>{
      e.preventDefault();const f=e.currentTarget;
      await api(`/api/admin/members/${member.id}`,{method:"PUT",body:JSON.stringify({nickname:f.nickname.value,power:Number(f.power.value),industryLevel:f.industryLevel.value,memberRank:f.memberRank.value,status:f.status.value})});
      alert("저장되었습니다.");await load();await openDetail(member.id);
    };
    $("#memberMemoSaveV188").onclick=async()=>{const memo=$("#memberDetailFormV188").adminMemo.value;await api(`/api/admin/members/${member.id}/memo`,{method:"PUT",body:JSON.stringify({memo})});alert("메모가 저장되었습니다.")};
    $("#memberResetPasswordV188").onclick=async()=>{if(!confirm("임시 비밀번호를 발급할까요?"))return;const d=await api(`/api/admin/members/${member.id}/reset-password`,{method:"POST",body:"{}"});prompt("임시 비밀번호",d.temporaryPassword)};
    $("#memberDeleteV188").onclick=async()=>{if(!confirm(`${member.nickname} 회원을 삭제할까요?`))return;await api(`/api/admin/members/${member.id}`,{method:"DELETE",body:null});$("#memberDetailV188").classList.remove("open");await load(true)};
  }
  function bulkOptions(){
    const field=$("#memberBulkFieldV188").value;
    const values=field==="memberRank"?["R1","R2","R3","R4","R5"]:field==="industryLevel"?["I1","I2","I3","I4","I5","I6","I7","I8","I9","I10"]:["active","suspended","left"];
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
  function init(){
    if(!$("#memberRowsV188"))return;
    $("#memberSearchV188").oninput=e=>{clearTimeout(init.t);init.t=setTimeout(()=>{state.query=e.target.value.trim();load(true)},250)};
    $("#memberRankV188").onchange=e=>{state.rank=e.target.value;load(true)};
    $("#memberIndustryV188").onchange=e=>{state.industry=e.target.value;load(true)};
    $("#memberSortV188").onchange=e=>{state.sort=e.target.value;load(true)};
    $("#memberLimitV188").onchange=e=>{state.limit=Math.max(10,Number(e.target.value)||10);load(true)};
    $("#memberRefreshV188").onclick=()=>load();
    $("#memberExportV188").onclick=exportExcel;
    $("#memberPrevV188").onclick=()=>{if(state.page>1){state.page--;load()}};
    $("#memberNextV188").onclick=()=>{if(state.page<state.totalPages){state.page++;load()}};
    $("#memberSelectAllV188").onchange=e=>{state.items.forEach(m=>e.target.checked?state.selected.add(m.id):state.selected.delete(m.id));render()};
    $("#memberBulkFieldV188").onchange=bulkOptions;$("#memberBulkApplyV188").onclick=applyBulk;
    $("#memberBulkCancelV188").onclick=()=>{state.selected.clear();render()};bulkOptions();
    window.addEventListener("ezpk-admin-ready",()=>load(true));
  }
  window.EZPKMemberManagerV188={load,renderFromShared:()=>{}};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();