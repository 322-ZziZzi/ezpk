(()=>{
const $=s=>document.querySelector(s);let page=1,totalPages=1,loading=false,lastLoadError=null;const REQUEST_LOAD_RETRIES=2;
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
async function api(path,opt={}){const headers={...(opt.headers||{})};if(opt.body&&!headers['content-type'])headers['content-type']='application/json';const r=await fetch(path,{credentials:'include',...opt,headers});let j={};try{j=await r.json()}catch{}if(!r.ok||j.ok===false){const e=new Error(j.error||j.code||'REQUEST_FAILED');e.code=j.code;throw e}return j}
function fmt(v){try{return new Date(v).toLocaleString()}catch{return v||''}}
function memberRender(r){return `<article class="request-admin-item" data-kind="member" data-id="${r.id}"><div class="request-admin-meta"><div><span class="request-source-badge member">MEMBER</span><strong>#${r.id} · ${esc(r.title)}</strong><small>${esc(r.authorNickname)} · ${esc(fmt(r.createdAt))}</small></div><span class="request-admin-state ${r.answered?'answered':''}">${r.answered?'ANSWERED':'WAITING'}</span></div><p class="request-admin-message">${esc(r.message)}</p><label class="request-admin-reply-label">관리자 답변<textarea rows="3" maxlength="5000">${esc(r.answer||'')}</textarea></label><div class="request-admin-actions"><button type="button" class="primary save-request-reply">답변</button><button type="button" class="edit-request-admin">수정</button><button type="button" class="danger delete-request-admin">삭제</button></div><div class="request-item-status status"></div></article>`}
function migrationRender(r){const thread=(r.replies||[]).map(x=>`<div class="request-admin-thread-row ${x.authorType==='admin'?'admin':''}"><b>${x.authorType==='admin'?'ADMIN':esc(x.authorNickname)}</b><p>${esc(x.message)}</p><small>${esc(fmt(x.createdAt))}</small></div>`).join('');const del=r.canDelete?'<button type="button" class="danger delete-migration-inquiry">삭제</button>':'';const controls=r.status==='closed'?`<div class="request-admin-actions"><button type="button" class="reopen-migration-inquiry">재개</button>${del}</div>`:`<label class="request-admin-reply-label">추가 답변<textarea rows="3" maxlength="5000"></textarea></label><div class="request-admin-actions"><button type="button" class="primary save-migration-reply">답변</button><button type="button" class="close-migration-inquiry">문의 종료</button>${del}</div>`;return `<article class="request-admin-item" data-kind="migration" data-public-id="${esc(r.publicId||r.id)}"><div class="request-admin-meta"><div><span class="request-source-badge migration">MIGRATION · PRIVATE</span><strong>${esc(r.title)}</strong><small>${esc(r.authorNickname)} · ${esc(r.uidMasked||'')} · ${esc(fmt(r.createdAt))}</small></div><span class="request-admin-state ${r.status==='answered'?'answered':''}">${esc(String(r.status||'open').toUpperCase())}</span></div><p class="request-admin-private-note">🔒 작성자 본인과 연맹 운영진만 확인할 수 있는 비밀 문의입니다.</p><p class="request-admin-message">${esc(r.message)}</p><div class="request-admin-thread">${thread}</div>${controls}<div class="request-item-status status"></div></article>`}
function render(r){return r.requesterType==='MIGRATION_APPLICANT'?migrationRender(r):memberRender(r)}
async function load(p=1){
  page=p;
  const list=$('#requestAdminList'),status=$('#requestAdminStatus');
  if(!list||!status||loading)return;
  loading=true;lastLoadError=null;
  status.textContent='요청을 불러오는 중...';status.className='status';
  try{
    let j=null,lastError=null;
    for(let attempt=0;attempt<REQUEST_LOAD_RETRIES;attempt++){
      try{j=await api(`/api/admin/requests?page=${page}&limit=15&_=${Date.now()}`);lastError=null;break}
      catch(error){lastError=error;if(attempt+1<REQUEST_LOAD_RETRIES)await new Promise(resolve=>setTimeout(resolve,250))}
    }
    if(lastError)throw lastError;
    const d=j?.data||{};
    totalPages=Math.max(1,d.pagination?.totalPages||1);
    list.innerHTML=(d.items||[]).length?d.items.map(render).join(''):'<p class="help">등록된 요청이 없습니다.</p>';
    list.insertAdjacentHTML('beforeend',`<div class="request-admin-pagination"><button type="button" data-page="prev" ${page<=1?'disabled':''}>◀ 이전</button><strong>${page} / ${totalPages}</strong><button type="button" data-page="next" ${page>=totalPages?'disabled':''}>다음 ▶</button></div>`);
    const total=d.pagination?.total||0;
    status.textContent=d.partial?`총 ${total}개의 요청 · 일부 이민 문의를 불러오지 못했습니다.`:`총 ${total}개의 요청`;
    status.className=d.partial?'status warn':'status ok';
  }catch(e){
    lastLoadError=e;
    const code=e?.code||e?.message||'REQUEST_FAILED';
    const messages={ADMIN_MENU_FORBIDDEN:'요청 관리 권한이 없습니다.',FORBIDDEN:'관리자 권한을 확인할 수 없습니다.',UNAUTHORIZED:'로그인 세션을 다시 확인해 주세요.',INTERNAL_ERROR:'요청 데이터를 불러오는 중 서버 오류가 발생했습니다.'};
    status.textContent=messages[code]||code;status.className='status error';
  }finally{loading=false}
}
async function memberAction(card,type){const id=Number(card.dataset.id),st=card.querySelector('.request-item-status');try{if(type==='answer'){const answer=card.querySelector('textarea').value.trim();if(!answer)throw new Error('답변을 입력하세요.');await api(`/api/admin/requests/${id}/answer`,{method:'PUT',body:JSON.stringify({answer})})}else if(type==='edit'){const title=prompt('제목을 수정하세요.',card.querySelector('strong').textContent.replace(/^#\d+ · /,''));if(title===null)return;const message=prompt('내용을 수정하세요.',card.querySelector('.request-admin-message').textContent);if(message===null)return;await api(`/api/admin/requests/${id}`,{method:'PUT',body:JSON.stringify({title:title.trim(),message:message.trim()})})}else{if(!confirm(`#${id} 요청을 삭제하시겠습니까?`))return;await api(`/api/admin/requests/${id}`,{method:'DELETE'})}st.textContent='완료되었습니다.';st.className='request-item-status status ok';await load(page)}catch(e){st.textContent=e.message;st.className='request-item-status status error'}}
async function migrationAction(card,type){const id=card.dataset.publicId,st=card.querySelector('.request-item-status');try{if(type==='answer'){const ta=card.querySelector('.request-admin-reply-label textarea'),message=ta?.value.trim();if(!message)throw new Error('답변을 입력하세요.');await api(`/api/admin/migration-inquiries/${encodeURIComponent(id)}/replies`,{method:'POST',body:JSON.stringify({message})})}else if(type==='close'){await api(`/api/admin/migration-inquiries/${encodeURIComponent(id)}/close`,{method:'POST',body:'{}'})}else if(type==='reopen'){await api(`/api/admin/migration-inquiries/${encodeURIComponent(id)}/reopen`,{method:'POST',body:'{}'})}else if(type==='delete'){if(!confirm('이 이민 문의를 삭제하시겠습니까? 삭제 후 신청자와 관리자 요청 목록에서 숨겨집니다.'))return;await api(`/api/admin/migration-inquiries/${encodeURIComponent(id)}`,{method:'DELETE'})}await load(page)}catch(e){st.textContent=e.message;st.className='request-item-status status error'}}
function requestsPanelActive(){return $('#requestsPanel')?.classList.contains('active')}
function init(){
  $('#refreshRequests')?.addEventListener('click',()=>load(page));
  document.querySelector('[data-panel="requestsPanel"]')?.addEventListener('click',()=>load(1));
  $('#requestAdminList')?.addEventListener('click',e=>{const nav=e.target.closest('[data-page]');if(nav){if(nav.dataset.page==='prev'&&page>1)load(page-1);if(nav.dataset.page==='next'&&page<totalPages)load(page+1);return}const card=e.target.closest('.request-admin-item');if(!card)return;if(card.dataset.kind==='migration'){if(e.target.closest('.save-migration-reply'))migrationAction(card,'answer');else if(e.target.closest('.close-migration-inquiry'))migrationAction(card,'close');else if(e.target.closest('.reopen-migration-inquiry'))migrationAction(card,'reopen');else if(e.target.closest('.delete-migration-inquiry'))migrationAction(card,'delete');return}if(e.target.closest('.save-request-reply'))memberAction(card,'answer');else if(e.target.closest('.edit-request-admin'))memberAction(card,'edit');else if(e.target.closest('.delete-request-admin'))memberAction(card,'delete')});
  window.addEventListener('ezpk-admin-ready',()=>{if(requestsPanelActive()&&window.EZPKAdminAccess?.has?.('requests')!==false)load(1)});
  window.EZPKRequestAdmin={load,getState:()=>({page,totalPages,loading,error:lastLoadError?.code||lastLoadError?.message||null})};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
