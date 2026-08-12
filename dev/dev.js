const output = document.querySelector('#output');
const badge = document.querySelector('#responseBadge');
const requestMeta = document.querySelector('#requestMeta');
const dbStatus = document.querySelector('#dbStatus');
const authStatus = document.querySelector('#authStatus');
const latencyStatus = document.querySelector('#latencyStatus');
const lastRequestStatus = document.querySelector('#lastRequestStatus');
const profileRankMemberField = document.querySelector('#profileRankMemberField');
const profileRankAdminField = document.querySelector('#profileRankAdminField');
const profileMemberRank = document.querySelector('#profileMemberRank');
const devSiteLabel = document.querySelector('#devSiteLabel');
const joinCodeSection = document.querySelector('#joinCodeSection');
const joinCodeForm = document.querySelector('#joinCodeForm');
const joinCodeSite = document.querySelector('#joinCodeSite');
const joinCodeConfigured = document.querySelector('#joinCodeConfigured');
const joinCodeUpdatedAt = document.querySelector('#joinCodeUpdatedAt');
const joinCodeUpdatedBy = document.querySelector('#joinCodeUpdatedBy');
const newJoinCode = document.querySelector('#newJoinCode');
const confirmJoinCode = document.querySelector('#confirmJoinCode');
const showJoinCode = document.querySelector('#showJoinCode');
const joinCodeConfirmDialog = document.querySelector('#joinCodeConfirmDialog');
const joinCodeConfirmText = document.querySelector('#joinCodeConfirmText');
let currentMember = null;
let currentSite = {siteId:'ezpk1', displayName:'EZPK1'};

function applyMemberToDeveloperCenter(member) {
  currentMember = member || null;
  const isAdmin = member?.role === 'admin';

  if (profileRankMemberField) profileRankMemberField.hidden = isAdmin;
  if (profileRankAdminField) profileRankAdminField.hidden = !isAdmin;

  if (!isAdmin && profileMemberRank && member?.memberRank) {
    profileMemberRank.value = member.memberRank;
  }

  if (member) {
    authStatus.textContent = `${member.nickname} · ${member.memberRank} · ${member.role.toUpperCase()}`;
  } else {
    authStatus.textContent = '비로그인';
  }

  const isSuperAdmin = member?.role === 'admin' && member?.adminLevel === 'super';
  if (joinCodeSection) joinCodeSection.hidden = !isSuperAdmin;
  if (isSuperAdmin) loadJoinCodeMetadata().catch(() => {});
}

async function api(path, options = {}) {
  const started = performance.now();
  badge.className = 'badge';
  badge.textContent = '요청 중';
  requestMeta.textContent = `${options.method || 'GET'} ${path}`;
  output.textContent = '요청을 보내는 중입니다...';

  try {
    const response = await fetch(path, {
      credentials: 'include',
      ...options,
      headers: {
        ...(options.body ? {'Content-Type':'application/json'} : {}),
        ...(options.headers || {})
      }
    });
    const elapsed = Math.round(performance.now() - started);
    const contentType = response.headers.get('content-type') || '';
    const raw = await response.text();
    let body;
    try { body = JSON.parse(raw); } catch { body = {raw}; }

    badge.textContent = `${response.status} ${response.ok ? '성공' : '실패'}`;
    badge.className = `badge ${response.ok ? 'ok' : 'error'}`;
    requestMeta.textContent = `${options.method || 'GET'} ${path} · ${elapsed}ms · ${contentType || 'unknown'}`;
    latencyStatus.textContent = `${elapsed}ms`;
    lastRequestStatus.textContent = `${options.method || 'GET'} ${path}`;
    output.textContent = JSON.stringify({status: response.status, ok: response.ok, body}, null, 2);
    output.focus();
    return {response, body, elapsed};
  } catch (error) {
    const elapsed = Math.round(performance.now() - started);
    badge.textContent = '네트워크 오류';
    badge.className = 'badge error';
    requestMeta.textContent = `${options.method || 'GET'} ${path} · ${elapsed}ms`;
    output.textContent = String(error?.stack || error);
    latencyStatus.textContent = `${elapsed}ms`;
    throw error;
  }
}

function jsonPost(path, data, method='POST') {
  return api(path, {method, body: JSON.stringify(data)});
}

function formObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function numberOrNull(value) {
  return value === '' ? null : Number(value);
}

function applySiteContext(data = {}) {
  currentSite = {
    siteId: data.siteId || 'ezpk1',
    displayName: data.displayName || (data.siteId === 'ezpk2' ? 'EZPK2' : 'EZPK1'),
  };
  if (devSiteLabel) devSiteLabel.textContent = `${currentSite.displayName} DEV`;
  if (joinCodeSite) joinCodeSite.textContent = currentSite.displayName;
}

function renderJoinCodeMetadata(data = {}) {
  applySiteContext(data);
  if (joinCodeConfigured) joinCodeConfigured.textContent = data.configured ? '설정됨' : '미설정';
  if (joinCodeUpdatedAt) joinCodeUpdatedAt.textContent = data.updatedAt || '-';
  if (joinCodeUpdatedBy) joinCodeUpdatedBy.textContent = data.updatedBy || '-';
}

async function loadJoinCodeMetadata() {
  if (!currentMember || currentMember.role !== 'admin' || currentMember.adminLevel !== 'super') return;
  const result = await api('/api/dev/alliance-join-code');
  if (result.response.ok) renderJoinCodeMetadata(result.body?.data || {});
}

function confirmJoinCodeChange() {
  const message = `${currentSite.displayName} 가입 코드를 변경합니다. 변경 즉시 이전 가입 코드는 신규 회원가입에 사용할 수 없습니다.`;
  if (joinCodeConfirmText) joinCodeConfirmText.textContent = message;
  if (!joinCodeConfirmDialog || typeof joinCodeConfirmDialog.showModal !== 'function') {
    return Promise.resolve(window.confirm(message));
  }
  return new Promise(resolve => {
    const onClose = () => {
      joinCodeConfirmDialog.removeEventListener('close', onClose);
      resolve(joinCodeConfirmDialog.returnValue === 'confirm');
    };
    joinCodeConfirmDialog.addEventListener('close', onClose);
    joinCodeConfirmDialog.showModal();
  });
}

async function quickCheck() {
  const site = await api('/api/site-context');
  if (site.response.ok) applySiteContext(site.body?.data || {});
  const db = await api('/api/db-test');
  dbStatus.textContent = db.response.ok ? '정상' : '오류';
  const auth = await api('/api/auth/me');
  const authenticated = Boolean(auth.body?.data?.authenticated);
  applyMemberToDeveloperCenter(authenticated ? auth.body.data.member : null);
}

document.querySelector('#runQuickCheck').addEventListener('click', quickCheck);
document.querySelector('#clearOutput').addEventListener('click', () => {
  output.textContent = '결과가 지워졌습니다.';
  badge.textContent = '대기';
  badge.className = 'badge';
  requestMeta.textContent = '아직 실행된 요청이 없습니다.';
});

document.querySelectorAll('[data-action]').forEach(button => {
  button.addEventListener('click', async () => {
    const action = button.dataset.action;
    if (action === 'db-test') {
      const result = await api('/api/db-test');
      dbStatus.textContent = result.response.ok ? '정상' : '오류';
    }
    if (action === 'auth-me') {
      const result = await api('/api/auth/me');
      applyMemberToDeveloperCenter(result.body?.data?.authenticated ? result.body.data.member : null);
    }
    if (action === 'member-me') await api('/api/member/me');
    if (action === 'logout') {
      await api('/api/auth/logout', {method:'POST', body:'{}'});
      applyMemberToDeveloperCenter(null);
    }
  });
});

document.querySelector('#adminForm').addEventListener('submit', async event => {
  event.preventDefault();
  const data = formObject(event.currentTarget);
  const result = await jsonPost('/api/setup/admin', data);
  if (result.response.ok) applyMemberToDeveloperCenter(result.body?.data?.member || null);
});

document.querySelector('#signupForm').addEventListener('submit', async event => {
  event.preventDefault();
  const data = formObject(event.currentTarget);
  data.power = Number(data.power);
  const result = await jsonPost('/api/auth/signup', data);
  if (result.response.ok) applyMemberToDeveloperCenter(result.body?.data?.member || null);
});

document.querySelector('#loginForm').addEventListener('submit', async event => {
  event.preventDefault();
  const result = await jsonPost('/api/auth/login', formObject(event.currentTarget));
  if (result.response.ok) applyMemberToDeveloperCenter(result.body?.data?.member || null);
});

document.querySelector('#profileForm').addEventListener('submit', async event => {
  event.preventDefault();
  const data = formObject(event.currentTarget);
  data.power = Number(data.power);

  if (currentMember?.role === 'admin') {
    delete data.memberRank;
  }

  const result = await jsonPost('/api/member/profile', data, 'PUT');
  if (result.response.ok) {
    const auth = await api('/api/auth/me');
    applyMemberToDeveloperCenter(
      auth.body?.data?.authenticated ? auth.body.data.member : null,
    );
  }
});

document.querySelector('#nicknameForm').addEventListener('submit', event => {
  event.preventDefault();
  jsonPost('/api/member/nickname', formObject(event.currentTarget), 'PUT');
});

document.querySelector('#specsForm').addEventListener('submit', event => {
  event.preventDefault();
  const data = formObject(event.currentTarget);
  data.vehicle1PowerValue = numberOrNull(data.vehicle1PowerValue);
  data.vehicle2PowerValue = numberOrNull(data.vehicle2PowerValue);
  data.seasonWarAvailable = data.seasonWarAvailable === 'true';
  data.bgbAvailableHour = numberOrNull(data.bgbAvailableHour);
  jsonPost('/api/member/specs', data, 'PUT');
});

document.querySelector('#passwordForm').addEventListener('submit', event => {
  event.preventDefault();
  jsonPost('/api/member/password', formObject(event.currentTarget), 'PUT');
});

document.querySelector('#membersForm').addEventListener('submit', event => {
  event.preventDefault();
  const data = formObject(event.currentTarget);
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key,value]) => { if (value !== '') params.set(key,value); });
  api(`/api/members?${params.toString()}`);
});

if (showJoinCode) {
  showJoinCode.addEventListener('change', () => {
    const type = showJoinCode.checked ? 'text' : 'password';
    if (newJoinCode) newJoinCode.type = type;
    if (confirmJoinCode) confirmJoinCode.type = type;
  });
}

if (joinCodeForm) {
  joinCodeForm.addEventListener('submit', async event => {
    event.preventDefault();
    const data = formObject(joinCodeForm);
    data.newCode = String(data.newCode || '').trim();
    data.confirmCode = String(data.confirmCode || '').trim();
    if (!/^[A-Za-z0-9_-]{6,32}$/.test(data.newCode)) {
      output.textContent = '가입 코드는 6~32자의 영문 대소문자, 숫자, _ , - 만 사용할 수 있습니다.';
      badge.textContent = '입력 확인';
      badge.className = 'badge error';
      return;
    }
    if (data.newCode !== data.confirmCode) {
      output.textContent = '새 가입 코드와 확인 값이 일치하지 않습니다.';
      badge.textContent = '입력 확인';
      badge.className = 'badge error';
      return;
    }
    if (!await confirmJoinCodeChange()) return;
    const result = await jsonPost('/api/dev/alliance-join-code', data, 'PUT');
    if (result.response.ok) {
      renderJoinCodeMetadata(result.body?.data || {});
      joinCodeForm.reset();
      if (newJoinCode) newJoinCode.type = 'password';
      if (confirmJoinCode) confirmJoinCode.type = 'password';
    }
  });
}

quickCheck().catch(() => {});
