(function(){'use strict';
const I18N={
ko:{title:'투표',lead:'진행 중인 투표에 참여하고 의견을 선택하세요.',empty:'현재 진행 중인 투표가 없습니다.',login:'로그인 후 투표할 수 있습니다.',single:'단일 선택',multiple:'복수 선택',saved:'선택이 저장되었습니다.',updated:'선택이 변경되었습니다.',ended:'종료',active:'진행 중',endedMessage:'투표가 종료되었습니다.',day:'일',hour:'시간',minute:'분'},
en:{title:'VOTE',lead:'Join the active vote and select your response.',empty:'There are no active votes at the moment.',login:'Please log in to vote.',single:'Single choice',multiple:'Multiple choice',saved:'Your choice has been saved.',updated:'Your choice has been updated.',ended:'Ended',active:'Active',endedMessage:'The vote has ended.',day:'d',hour:'h',minute:'m'},
pt:{title:'VOTAÇÃO',lead:'Participe da votação em andamento e escolha sua resposta.',empty:'Não há nenhuma votação em andamento no momento.',login:'Entre para votar.',single:'Escolha única',multiple:'Múltipla escolha',saved:'Sua escolha foi salva.',updated:'Sua escolha foi atualizada.',ended:'Encerrada',active:'Em andamento',endedMessage:'A votação foi encerrada.',day:'d',hour:'h',minute:'m'},
vi:{title:'BÌNH CHỌN',lead:'Tham gia cuộc bình chọn đang diễn ra và chọn ý kiến của bạn.',empty:'Hiện không có cuộc bình chọn nào đang diễn ra.',login:'Vui lòng đăng nhập để bình chọn.',single:'Chọn một',multiple:'Chọn nhiều',saved:'Lựa chọn đã được lưu.',updated:'Lựa chọn đã được cập nhật.',ended:'Đã kết thúc',active:'Đang diễn ra',endedMessage:'Cuộc bình chọn đã kết thúc.',day:'ngày',hour:'giờ',minute:'phút'},
ar:{title:'التصويت',lead:'شارك في التصويت الجاري واختر إجابتك.',empty:'لا يوجد تصويت جارٍ حاليًا.',login:'يرجى تسجيل الدخول للتصويت.',single:'اختيار واحد',multiple:'اختيارات متعددة',saved:'تم حفظ اختيارك.',updated:'تم تحديث اختيارك.',ended:'منتهٍ',active:'جارٍ',endedMessage:'انتهى التصويت.',day:'يوم',hour:'ساعة',minute:'دقيقة'},
ja:{title:'投票',lead:'進行中の投票に参加して回答を選択してください。',empty:'現在進行中の投票はありません。',login:'投票するにはログインしてください。',single:'単一選択',multiple:'複数選択',saved:'選択を保存しました。',updated:'選択を変更しました。',ended:'終了',active:'進行中',endedMessage:'投票は終了しました。',day:'日',hour:'時間',minute:'分'},
th:{title:'โหวต',lead:'เข้าร่วมการโหวตที่กำลังดำเนินอยู่และเลือกคำตอบของคุณ',empty:'ขณะนี้ไม่มีการโหวตที่กำลังดำเนินอยู่',login:'กรุณาเข้าสู่ระบบเพื่อโหวต',single:'เลือกหนึ่งข้อ',multiple:'เลือกได้หลายข้อ',saved:'บันทึกตัวเลือกแล้ว',updated:'อัปเดตตัวเลือกแล้ว',ended:'สิ้นสุด',active:'กำลังดำเนินอยู่',endedMessage:'การโหวตสิ้นสุดแล้ว',day:'วัน',hour:'ชั่วโมง',minute:'นาที'},
'zh-tw':{title:'投票',lead:'參與進行中的投票並選擇您的意見。',empty:'目前沒有進行中的投票。',login:'請先登入再投票。',single:'單選',multiple:'複選',saved:'已儲存您的選擇。',updated:'已更新您的選擇。',ended:'已結束',active:'進行中',endedMessage:'投票已結束。',day:'天',hour:'小時',minute:'分鐘'}
};
let lang=localStorage.getItem('ezpk-lang')||'ko', current=[], countdownTimer=null;
const t=()=>I18N[lang]||I18N.ko;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function applyText(){
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  const title=document.getElementById('votePageTitle'),lead=document.getElementById('votePageLead');
  if(title)title.textContent=t().title;
  if(lead)lead.textContent=t().lead;
  const e=document.getElementById('voteEmpty');if(e)e.textContent=t().empty;
}
function isEnded(v){return Boolean(v.endsAt)&&new Date(v.endsAt).getTime()<=Date.now()}
function formatRemaining(endsAt){
  const diff=Math.max(0,new Date(endsAt).getTime()-Date.now());
  const totalMinutes=Math.ceil(diff/60000);
  const days=Math.floor(totalMinutes/1440);
  const hours=Math.floor((totalMinutes%1440)/60);
  const minutes=totalMinutes%60;
  const pad=n=>String(n).padStart(2,'0');
  if(lang==='en'||lang==='pt')return `${days}${t().day} ${hours}${t().hour} ${pad(minutes)}${t().minute}`;
  return `${days}${t().day} ${hours}${t().hour} ${pad(minutes)}${t().minute}`;
}
async function load(){
  applyText();
  if(countdownTimer){clearInterval(countdownTimer);countdownTimer=null}
  const app=document.getElementById('voteApp'),section=document.querySelector('.home-vote-section');
  if(!app)return;
  try{
    const r=await fetch('/api/votes/active',{credentials:'include',cache:'no-store'});
    const p=await r.json();
    if(!r.ok||!p.ok)throw new Error(p.error||'LOAD_FAILED');
    current=p.data?.votes||[];
    if(!current.length){app.innerHTML='';if(section)section.hidden=true;return}
    if(section)section.hidden=false;
    render(app,current,p.data?.authenticated);
  }catch(e){app.innerHTML='';if(section)section.hidden=true;console.error('[VOTE] active vote load failed',e)}
}
function render(app,votes,authenticated){
  if(!votes.length){app.innerHTML='';return}
  app.innerHTML=votes.map(v=>{
    const selected=new Set(v.myAnswers||[]),ended=isEnded(v),cls=v.options.length===2?'vote-options two':'vote-options';
    return `<article class="vote-card ${ended?'is-ended':''}" data-vote-id="${v.id}" data-type="${v.voteType}" data-ends-at="${esc(v.endsAt||'')}">
      <div class="vote-card-heading"><h2>${esc(v.title)}</h2>${v.description?`<p class="vote-description">${esc(v.description)}</p>`:''}</div>
      <div class="vote-meta"><span class="vote-type">${v.voteType==='multiple'?t().multiple:t().single}</span><span class="vote-status-badge ${ended?'ended':'active'}">${ended?t().ended:t().active}</span></div>
      <div class="${cls}">${v.options.map(o=>`<button class="vote-option ${selected.has(o.id)?'selected':''}" data-option-id="${o.id}" ${(authenticated&&!ended)?'':'disabled'}><strong>${esc(o.label)}</strong>${o.description?`<span>${esc(o.description)}</span>`:''}</button>`).join('')}</div>
      <div class="vote-save-state">${authenticated?'':esc(t().login)}</div>
      ${v.showResults?resultHtml(v):''}
      ${v.endsAt?`<div class="vote-countdown" aria-live="polite">${ended?esc(t().endedMessage):esc(formatRemaining(v.endsAt))}</div>`:''}
    </article>`
  }).join('');
  app.querySelectorAll('.vote-option').forEach(b=>b.addEventListener('click',onChoose));
  updateCountdowns();
  countdownTimer=setInterval(updateCountdowns,1000);
}
function resultHtml(v){
  const total=Math.max(1,Number(v.totalVoters||0));
  return `<div class="vote-results">${v.options.map(o=>{
    const n=Number(o.votes||0),pct=Math.round(n/total*100);
    return `<div class="vote-result-row"><span>${esc(o.label)} ${esc(o.description||'')}</span><strong>${pct}%</strong><div class="vote-result-bar"><i style="width:${pct}%"></i></div></div>`
  }).join('')}</div>`
}
function updateCountdowns(){
  document.querySelectorAll('.vote-card[data-ends-at]').forEach(card=>{
    const endsAt=card.dataset.endsAt;if(!endsAt)return;
    const ended=new Date(endsAt).getTime()<=Date.now();
    const badge=card.querySelector('.vote-status-badge'),countdown=card.querySelector('.vote-countdown');
    if(ended){
      card.classList.add('is-ended');
      card.querySelectorAll('.vote-option').forEach(x=>x.disabled=true);
      if(badge){badge.classList.remove('active');badge.classList.add('ended');badge.textContent=t().ended}
      if(countdown)countdown.textContent=t().endedMessage;
    }else{
      if(badge){badge.classList.remove('ended');badge.classList.add('active');badge.textContent=t().active}
      if(countdown)countdown.textContent=formatRemaining(endsAt);
    }
  })
}
async function onChoose(e){
  const card=e.currentTarget.closest('[data-vote-id]');
  if(card.classList.contains('is-ended'))return;
  const type=card.dataset.type,id=Number(card.dataset.voteId),optionId=Number(e.currentTarget.dataset.optionId);
  let selected=[...card.querySelectorAll('.vote-option.selected')].map(x=>Number(x.dataset.optionId));
  const had=selected.length>0;
  if(type==='single')selected=[optionId];else selected=selected.includes(optionId)?selected.filter(x=>x!==optionId):[...selected,optionId];
  card.querySelectorAll('.vote-option').forEach(x=>x.disabled=true);
  const state=card.querySelector('.vote-save-state');state.textContent='...';
  try{
    const r=await fetch(`/api/votes/${id}/respond`,{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({voteAnswers:selected})});
    const p=await r.json();if(!r.ok||!p.ok)throw new Error(p.error||'SAVE_FAILED');
    card.querySelectorAll('.vote-option').forEach(x=>x.classList.toggle('selected',selected.includes(Number(x.dataset.optionId))));
    state.textContent=had?t().updated:t().saved;
  }catch(err){state.textContent=t().login}
  finally{if(!card.classList.contains('is-ended'))card.querySelectorAll('.vote-option').forEach(x=>x.disabled=false)}
}
window.addEventListener('ezpk-language-change',e=>{lang=e.detail?.lang||localStorage.getItem('ezpk-lang')||'ko';load()});
document.addEventListener('DOMContentLoaded',load);
})();
