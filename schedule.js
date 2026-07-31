(() => {
  const grid = document.getElementById('eventScheduleGrid');
  const empty = document.getElementById('eventScheduleEmpty');
  const section = document.querySelector('.schedule-section');
  if (!grid || !section) return;

  let scheduleData = { events: [] };
  let timer = null;
  let requestId = 0;
  const SERVER_OFFSET_HOURS = -2;
  const pad = n => String(n).padStart(2, '0');
  const fallback = {
    scheduleEmpty:'No scheduled events.', scheduleUpcoming:'UPCOMING',
    scheduleStartIn:'START IN', scheduleLive:'LIVE',
    scheduleFinished:'FINISHED', scheduleStart:'START', scheduleImportant:'IMPORTANT'
  };

  function currentUi() {
    const code = localStorage.getItem('ezpk-lang-v5') || 'en';
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
    const shifted = new Date(date.getTime() + SERVER_OFFSET_HOURS * 60 * 60 * 1000);
    return `${pad(shifted.getUTCMonth() + 1)}/${pad(shifted.getUTCDate())} ${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())} ST`;
  }
  function countdown(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(total / 86400), hours = Math.floor((total % 86400) / 3600), minutes = Math.floor((total % 3600) / 60), seconds = total % 60;
    return days > 0 ? `${days}D ${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }
  function stateOf(event, now) {
    const start = parseTime(event.start), end = parseTime(event.end);
    if (!start || !end) return { state:'invalid', start, end };
    if (now < start) return { state:'upcoming', start, end };
    if (now < end) return { state:'live', start, end };
    return { state:'finished', start, end };
  }
  function clearSchedule() {
    requestId += 1;
    scheduleData = { events: [] };
    grid.innerHTML = '';
    section.hidden = true;
    if (empty) empty.hidden = true;
    if (timer) window.clearInterval(timer);
    timer = null;
  }
  function render() {
    const ui = currentUi();
    const now = new Date();
    const events = (scheduleData.events || [])
      .filter(e => e && e.enabled && e.title && e.start && e.end)
      .map(event => ({ event:{...event, important:Boolean(event.important)}, info:stateOf(event, now) }))
      .filter(item => item.info.state === 'upcoming' || item.info.state === 'live')
      .sort((a, b) => {
        const importance = Number(b.event.important) - Number(a.event.important);
        if (importance) return importance;
        const statePriority = { live:0, upcoming:1 };
        const stateDiff = (statePriority[a.info.state] ?? 9) - (statePriority[b.info.state] ?? 9);
        if (stateDiff) return stateDiff;
        return a.info.start - b.info.start;
      })
      .slice(0, 9);

    if (!events.length) {
      grid.innerHTML = '';
      section.hidden = true;
      if (empty) empty.hidden = true;
      return;
    }
    section.hidden = false;
    if (empty) empty.hidden = true;
    grid.innerHTML = events.map(({event, info}, index) => {
      let badge = ui.scheduleUpcoming || fallback.scheduleUpcoming;
      let timerText = '', timerLabel = ui.scheduleStartIn || fallback.scheduleStartIn;
      if (info.state === 'upcoming') timerText = countdown(info.start - now);
      if (info.state === 'live') { badge = ui.scheduleLive || fallback.scheduleLive; timerLabel = ''; timerText = `● ${badge}`; }
      const importantBadge = event.important ? `<span class="event-badge event-important-badge">${escapeHtml(ui.scheduleImportant || fallback.scheduleImportant)}</span>` : '';
      return `<article class="event-card event-${info.state}${event.important ? ' event-important' : ''}" style="--event-index:${index}"><div class="event-card-top"><span class="event-number">${pad(index + 1)}</span><div class="event-badges">${importantBadge}<span class="event-badge event-status">${escapeHtml(badge)}</span></div></div><h3>${escapeHtml(event.title)}</h3><div class="event-countdown">${timerLabel ? `<small>${escapeHtml(timerLabel)}</small>` : ''}<strong>${escapeHtml(timerText)}</strong></div><time><small>${escapeHtml(ui.scheduleStart || fallback.scheduleStart)}</small><strong>${formatServerTime(info.start)}</strong></time></article>`;
    }).join('');
  }
  async function loadSchedule() {
    const ownRequest = ++requestId;
    if (timer) window.clearInterval(timer);
    timer = null;
    try {
      const response = await fetch('/api/events', { credentials:'include', cache:'no-store', headers:{accept:'application/json'} });
      const payload = await response.json().catch(() => null);
      if (ownRequest !== requestId) return;
      if (!response.ok || !payload?.ok) throw new Error(payload?.code || 'Schedule data unavailable');
      scheduleData = payload.data || { events: [] };
      render();
      timer = window.setInterval(render, 1000);
    } catch (_) {
      if (ownRequest === requestId) clearSchedule();
    }
  }
  function applyAuth(state) {
    const active = Boolean(state && state.authenticated && state.member && state.member.status === 'active');
    if (active) loadSchedule();
    else clearSchedule();
  }

  window.addEventListener('ezpk-auth-ready', event => applyAuth(event.detail));
  window.addEventListener('ezpk-auth-change', event => applyAuth(event.detail));
  window.addEventListener('ezpk-language-change', render);
  window.addEventListener('beforeunload', clearSchedule, { once:true });
  if (window.EZPKMemberAuth) {
    const state = window.EZPKMemberAuth.getState();
    if (state.loaded) applyAuth(state);
  }
})();
