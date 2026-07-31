(() => {
  const grid = document.getElementById('eventScheduleGrid');
  const empty = document.getElementById('eventScheduleEmpty');
  const section = document.querySelector('.schedule-section');
  const toggle = document.getElementById('eventScheduleToggle');
  if (!grid || !section) return;

  const COPY = {
    ko:{loading:'일정을 불러오는 중입니다.',empty:'예정된 일정이 없습니다.',error:'일정을 불러오지 못했습니다.',showAll:'전체 일정 보기',showLess:'일정 접기',local:'내 시간'},
    en:{loading:'Loading schedule…',empty:'No scheduled events.',error:'Unable to load the schedule.',showAll:'VIEW ALL EVENTS',showLess:'SHOW LESS',local:'MY TIME'},
    pt:{loading:'Carregando agenda…',empty:'Nenhum evento agendado.',error:'Não foi possível carregar a agenda.',showAll:'VER TODOS OS EVENTOS',showLess:'MOSTRAR MENOS',local:'MEU HORÁRIO'},
    vi:{loading:'Đang tải lịch…',empty:'Không có sự kiện sắp tới.',error:'Không thể tải lịch.',showAll:'XEM TẤT CẢ SỰ KIỆN',showLess:'THU GỌN',local:'GIỜ CỦA TÔI'},
    ar:{loading:'جارٍ تحميل الجدول…',empty:'لا توجد فعاليات مجدولة.',error:'تعذر تحميل الجدول.',showAll:'عرض جميع الفعاليات',showLess:'عرض أقل',local:'توقيتي'},
    ja:{loading:'予定を読み込んでいます…',empty:'予定されているイベントはありません。',error:'予定を読み込めませんでした。',showAll:'すべての予定を見る',showLess:'折りたたむ',local:'現地時間'},
    th:{loading:'กำลังโหลดกำหนดการ…',empty:'ไม่มีกิจกรรมที่กำหนดไว้',error:'ไม่สามารถโหลดกำหนดการได้',showAll:'ดูกิจกรรมทั้งหมด',showLess:'ย่อรายการ',local:'เวลาของฉัน'},
    'zh-tw':{loading:'正在載入行程…',empty:'目前沒有預定活動。',error:'無法載入行程。',showAll:'查看全部活動',showLess:'收合行程',local:'我的時間'}
  };
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
    const code = localStorage.getItem('ezpk-lang-v5') || 'en';
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
  function formatLocalTime(date) {
    if (!date) return '-';
    const locale = language() === 'zh-tw' ? 'zh-TW' : language();
    try {
      return new Intl.DateTimeFormat(locale,{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(date);
    } catch (_) {
      return `${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
  }
  function countdown(ms) {
    const total = Math.max(0,Math.floor(ms / 1000));
    const days = Math.floor(total / 86400), hours = Math.floor((total % 86400) / 3600), minutes = Math.floor((total % 3600) / 60), seconds = total % 60;
    return days > 0 ? `${days}D ${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
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
  function showStatus(kind) {
    const copy = COPY[language()];
    section.hidden = false;
    grid.innerHTML = '';
    if (empty) {
      empty.hidden = false;
      empty.classList.toggle('schedule-loading',kind === 'loading');
      empty.textContent = copy[kind] || copy.error;
    }
    if (toggle) toggle.hidden = true;
  }
  function syncToggle(total) {
    if (!toggle) return;
    const shouldShow = mobileQuery.matches && total > 2;
    toggle.hidden = !shouldShow;
    toggle.textContent = expanded ? COPY[language()].showLess : `${COPY[language()].showAll} (${total})`;
    toggle.setAttribute('aria-expanded',String(expanded));
  }
  function render() {
    if (loadState !== 'ready') {
      if (loadState === 'loading' || loadState === 'error') showStatus(loadState);
      return;
    }
    const ui = currentUi();
    const copy = COPY[language()];
    const events = activeEvents();
    if (!events.length) {
      showStatus('empty');
      return;
    }
    section.hidden = false;
    if (empty) empty.hidden = true;
    const visible = mobileQuery.matches && !expanded ? events.slice(0,2) : events;
    grid.innerHTML = visible.map(({event,info},index) => {
      const badge = info.state === 'live' ? (ui.scheduleLive || fallback.scheduleLive) : (ui.scheduleUpcoming || fallback.scheduleUpcoming);
      const timerLabel = info.state === 'live' ? '' : (ui.scheduleStartIn || fallback.scheduleStartIn);
      const timerText = info.state === 'live' ? `● ${badge}` : countdown(info.start - new Date());
      const importantBadge = event.important ? `<span class="event-badge event-important-badge">${escapeHtml(ui.scheduleImportant || fallback.scheduleImportant)}</span>` : '';
      return `<article class="event-card event-${info.state}${event.important ? ' event-important' : ''}" data-state="${info.state}" data-start="${info.start.getTime()}" data-end="${info.end.getTime()}"><div class="event-card-top"><span class="event-number">${pad(index + 1)}</span><div class="event-badges">${importantBadge}<span class="event-badge event-status">${escapeHtml(badge)}</span></div></div><h3 title="${escapeHtml(event.title)}">${escapeHtml(event.title)}</h3><div class="event-countdown">${timerLabel ? `<small>${escapeHtml(timerLabel)}</small>` : ''}<strong>${escapeHtml(timerText)}</strong></div><time><small>${escapeHtml(ui.scheduleStart || fallback.scheduleStart)}</small><strong>${formatServerTime(info.start)}</strong><small class="event-local-label">${escapeHtml(copy.local)}</small><strong class="event-local-time">${escapeHtml(formatLocalTime(info.start))}</strong></time></article>`;
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
        const value = card.querySelector('.event-countdown strong');
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
    showStatus('loading');
    try {
      const response = await fetch('/api/events',{credentials:'include',cache:'no-store',headers:{accept:'application/json'}});
      const payload = await response.json().catch(() => null);
      if (ownRequest !== requestId) return;
      if (!response.ok || !payload?.ok) throw new Error(payload?.code || 'Schedule data unavailable');
      scheduleData = payload.data || {events:[]};
      loadState = 'ready';
      render();
      timer = window.setInterval(tick,1000);
    } catch (_) {
      if (ownRequest !== requestId) return;
      loadState = 'error';
      showStatus('error');
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
