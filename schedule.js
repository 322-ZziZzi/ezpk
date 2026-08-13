(() => {
  const grid = document.getElementById('eventScheduleGrid');
  const empty = document.getElementById('eventScheduleEmpty');
  const section = document.querySelector('.schedule-section');
  const toggle = document.getElementById('eventScheduleToggle');
  if (!grid || !section) return;

  const COPY = {
    ko:{showAll:'전체 일정 보기',showLess:'일정 접기',live:'진행 중',soon:'곧 시작',day:'일',hour:'시간',minute:'분'},
    en:{showAll:'VIEW ALL EVENTS',showLess:'SHOW LESS',live:'LIVE NOW',soon:'STARTING SOON',day:'D',hour:'H',minute:'M'},
    pt:{showAll:'VER TODOS OS EVENTOS',showLess:'MOSTRAR MENOS',live:'AO VIVO',soon:'COMEÇA EM BREVE',day:'D',hour:'H',minute:'MIN'},
    vi:{showAll:'XEM TẤT CẢ SỰ KIỆN',showLess:'THU GỌN',live:'ĐANG DIỄN RA',soon:'SẮP BẮT ĐẦU',day:'N',hour:'GIỜ',minute:'PHÚT'},
    ar:{showAll:'عرض جميع الفعاليات',showLess:'عرض أقل',live:'مباشر الآن',soon:'يبدأ قريبًا',day:'ي',hour:'س',minute:'د'},
    ja:{showAll:'すべての予定を見る',showLess:'折りたたむ',live:'進行中',soon:'まもなく開始',day:'日',hour:'時間',minute:'分'},
    th:{showAll:'ดูกิจกรรมทั้งหมด',showLess:'ย่อรายการ',live:'กำลังดำเนินอยู่',soon:'กำลังจะเริ่ม',day:'วัน',hour:'ชม.',minute:'นาที'},
    'zh-tw':{showAll:'查看全部活動',showLess:'收合行程',live:'進行中',soon:'即將開始',day:'天',hour:'小時',minute:'分鐘'}
  };
window.EZPK_I18N_V414?.apply('schedule',COPY);
  const fallback = {
    scheduleUpcoming:'UPCOMING',scheduleStartIn:'START IN',scheduleLive:'LIVE',
    scheduleFinished:'FINISHED',scheduleStart:'START',scheduleImportant:'IMPORTANT'
  };
  const mobileQuery = window.matchMedia('(max-width:760px)');
  const SERVER_OFFSET_HOURS = -2;
  const pad = value => String(value).padStart(2, '0');
  let scheduleData = { events:[] };
  let timer = null;
  let requestId = 0;
  let expanded = false;
  let loadState = 'idle';

  function language() {
    const code = window.EZPKLanguage?.get?.() || 'en';
    return COPY[code] ? code : 'en';
  }
  function currentUi() {
    const code = language();
    return (window.EZPK_DATA && window.EZPK_DATA[code] && window.EZPK_DATA[code].ui) || fallback;
  }
  function parseTime(value) {
    if (!value) return null;
    const hasZone = /(?:Z|[+-]\d{2}:\d{2})$/.test(value);
    const normalized = hasZone ? value : `${value.length === 16 ? value + ':00' : value}-02:00`;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  function formatServerTime(date) {
    if (!date) return '-';
    const shifted = new Date(date.getTime() + SERVER_OFFSET_HOURS * 3600000);
    return `${pad(shifted.getUTCMonth() + 1)}/${pad(shifted.getUTCDate())} ${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())} ST`;
  }
  function countdown(ms) {
    const copy = COPY[language()];
    const totalMinutes = Math.max(0,Math.ceil(ms / 60000));
    if (totalMinutes <= 5) return copy.soon;
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    if (days) return `${days}${copy.day}${hours ? ` ${hours}${copy.hour}` : ''}`;
    if (hours) return `${hours}${copy.hour}${minutes ? ` ${minutes}${copy.minute}` : ''}`;
    return `${minutes}${copy.minute}`;
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }
  function stateOf(event,now) {
    const start = parseTime(event.start), end = parseTime(event.end);
    if (!start || !end) return {state:'invalid',start,end};
    if (now < start) return {state:'upcoming',start,end};
    if (now < end) return {state:'live',start,end};
    return {state:'finished',start,end};
  }
  function activeEvents() {
    const now = new Date();
    return (scheduleData.events || [])
      .filter(event => event && event.enabled && event.title && event.start && event.end)
      .map(event => ({event:{...event,important:Boolean(event.important)},info:stateOf(event,now)}))
      .filter(item => item.info.state === 'upcoming' || item.info.state === 'live')
      .sort((a,b) => {
        const statePriority = {live:0,upcoming:1};
        const stateDiff = statePriority[a.info.state] - statePriority[b.info.state];
        if (stateDiff) return stateDiff;
        const importance = Number(b.event.important) - Number(a.event.important);
        return importance || a.info.start - b.info.start;
      })
      .slice(0,9);
  }
  function hideSchedule() {
    grid.innerHTML = '';
    section.hidden = true;
    if (empty) empty.hidden = true;
    if (toggle) toggle.hidden = true;
  }
  function syncToggle(total) {
    if (!toggle) return;
    const shouldShow = total > 2;
    toggle.hidden = !shouldShow;
    toggle.textContent = expanded ? COPY[language()].showLess : `${COPY[language()].showAll} (${total})`;
    toggle.setAttribute('aria-expanded',String(expanded));
  }
  function render() {
    if (loadState !== 'ready') { hideSchedule(); return; }
    const ui = currentUi();
    const copy = COPY[language()];
    const events = activeEvents();
    if (!events.length) {
      hideSchedule();
      return;
    }
    section.hidden = false;
    if (empty) empty.hidden = true;
    const visible = !expanded ? events.slice(0,2) : events;
    grid.innerHTML = visible.map(({event,info}) => {
      const badge = info.state === 'live' ? (ui.scheduleLive || fallback.scheduleLive) : (ui.scheduleUpcoming || fallback.scheduleUpcoming);
      const remaining = info.start - new Date();
      const timerText = info.state === 'live' ? copy.live : countdown(remaining);
      const importantBadge = event.important ? `<span class="event-badge event-important-badge">${escapeHtml(ui.scheduleImportant || fallback.scheduleImportant)}</span>` : '';
      const soonClass = info.state === 'upcoming' && remaining <= 1800000 ? ' event-soon' : '';
      return `<article class="event-card event-${info.state}${event.important ? ' event-important' : ''}${soonClass}" data-state="${info.state}" data-start="${info.start.getTime()}" data-end="${info.end.getTime()}"><div class="event-card-top"><div class="event-badges"><span class="event-badge event-status"><i aria-hidden="true"></i>${escapeHtml(badge)}</span>${importantBadge}</div><strong class="event-remaining">${escapeHtml(timerText)}</strong></div><h3 title="${escapeHtml(event.title)}">${escapeHtml(event.title)}</h3><time><span>${escapeHtml(ui.scheduleStart || fallback.scheduleStart)}</span><strong>${formatServerTime(info.start)}</strong></time></article>`;
    }).join('');
    syncToggle(events.length);
  }
  function tick() {
    const now = Date.now();
    let needsRender = false;
    grid.querySelectorAll('.event-card').forEach(card => {
      const start = Number(card.dataset.start), end = Number(card.dataset.end);
      const nextState = now < start ? 'upcoming' : now < end ? 'live' : 'finished';
      if (nextState !== card.dataset.state) { needsRender = true; return; }
      if (nextState === 'upcoming') {
        const remaining = start - now;
        card.classList.toggle('event-soon',remaining <= 1800000);
        const value = card.querySelector('.event-remaining');
        if (value) value.textContent = countdown(start - now);
      }
    });
    if (needsRender) render();
  }
  function stopTimer() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }
  function clearSchedule() {
    requestId += 1;
    stopTimer();
    loadState = 'idle';
    scheduleData = {events:[]};
    grid.innerHTML = '';
    section.hidden = true;
    if (empty) empty.hidden = true;
    if (toggle) toggle.hidden = true;
  }
  async function loadSchedule() {
    const ownRequest = ++requestId;
    stopTimer();
    expanded = false;
    loadState = 'loading';
    hideSchedule();
    try {
      const response = await fetch('/api/events',{credentials:'include',cache:'no-store',headers:{accept:'application/json'}});
      const payload = await response.json().catch(() => null);
      if (ownRequest !== requestId) return;
      if (!response.ok || !payload?.ok) throw new Error(payload?.code || 'Schedule data unavailable');
      scheduleData = payload.data || {events:[]};
      loadState = 'ready';
      render();
      timer = window.setInterval(tick,30000);
    } catch (_) {
      if (ownRequest !== requestId) return;
      loadState = 'error';
      hideSchedule();
    }
  }
  function applyAuth(state) {
    const active = Boolean(state && state.authenticated && state.member && state.member.status === 'active');
    if (active) loadSchedule();
    else clearSchedule();
  }

  if (toggle) toggle.addEventListener('click',() => { expanded = !expanded; render(); });
  const onViewportChange = () => { expanded = false; render(); };
  if (mobileQuery.addEventListener) mobileQuery.addEventListener('change',onViewportChange);
  else mobileQuery.addListener(onViewportChange);
  window.addEventListener('ezpk-auth-ready',event => applyAuth(event.detail));
  window.addEventListener('ezpk-auth-change',event => applyAuth(event.detail));
  window.addEventListener('ezpk-language-change',render);
  window.addEventListener('beforeunload',clearSchedule,{once:true});
  if (window.EZPKMemberAuth) {
    const state = window.EZPKMemberAuth.getState();
    if (state.loaded) applyAuth(state);
  }
})();
