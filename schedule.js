(() => {
  const grid = document.getElementById('eventScheduleGrid');
  const empty = document.getElementById('eventScheduleEmpty');
  if (!grid) return;
  let scheduleData = { events: [] };
  let timer = null;
  const SERVER_OFFSET_HOURS = -2;
  const pad = n => String(n).padStart(2, '0');
  function parseTime(value) {
    if (!value) return null;
    const hasZone = /(?:Z|[+-]\d{2}:\d{2})$/.test(value);
    const normalized = hasZone ? value : `${value.length === 16 ? value + ':00' : value}-02:00`;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  function formatServerTime(date) {
    if (!date) return '-';
    const shifted = new Date(date.getTime() + SERVER_OFFSET_HOURS * 60 * 60 * 1000);
    return `${pad(shifted.getUTCMonth() + 1)}/${pad(shifted.getUTCDate())} ${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}`;
  }
  function countdown(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(total / 86400), hours = Math.floor((total % 86400) / 3600), minutes = Math.floor((total % 3600) / 60), seconds = total % 60;
    return days > 0 ? `${days}D ${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
  function stateOf(event,now){const start=parseTime(event.start),end=parseTime(event.end);if(!start||!end)return{state:'invalid',start,end};if(now<start)return{state:'upcoming',start,end};if(now<end)return{state:'live',start,end};return{state:'finished',start,end};}
  function render(){
    const now=new Date();
    const events=(scheduleData.events||[]).filter(e=>e&&e.enabled&&e.title&&e.start&&e.end).slice(0,9);
    empty.hidden=events.length>0;
    grid.innerHTML=events.map((event,index)=>{const info=stateOf(event,now);let badge='UPCOMING',timerText='',timerLabel='START IN';if(info.state==='upcoming')timerText=countdown(info.start-now);if(info.state==='live'){badge='LIVE';timerLabel='';timerText='● LIVE';}if(info.state==='finished'){badge='FINISHED';timerLabel='';timerText='FINISHED';}return `<article class="event-card event-${info.state}" style="--event-index:${index}"><div class="event-card-top"><span class="event-number">${pad(index+1)}</span><span class="event-status">${badge}</span></div><h3>${escapeHtml(event.title)}</h3><div class="event-countdown">${timerLabel?`<small>${timerLabel}</small>`:''}<strong>${timerText}</strong></div><time><small>START</small><strong>${formatServerTime(info.start)}</strong></time></article>`;}).join('');
  }
  fetch(`data/events.json?v=${Date.now()}`,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Schedule data unavailable');return r.json();}).then(data=>{scheduleData=data||{events:[]};render();timer=window.setInterval(render,1000);}).catch(()=>{empty.hidden=false;empty.textContent='No scheduled events.';});
  window.addEventListener('beforeunload',()=>timer&&clearInterval(timer),{once:true});
})();
