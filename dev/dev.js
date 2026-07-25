const output = document.querySelector('#output');
const badge = document.querySelector('#responseBadge');
const requestMeta = document.querySelector('#requestMeta');
const dbStatus = document.querySelector('#dbStatus');
const authStatus = document.querySelector('#authStatus');
const latencyStatus = document.querySelector('#latencyStatus');
const lastRequestStatus = document.querySelector('#lastRequestStatus');

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

async function quickCheck() {
  const db = await api('/api/db-test');
  dbStatus.textContent = db.response.ok ? '정상' : '오류';
  const auth = await api('/api/auth/me');
  const authenticated = Boolean(auth.body?.data?.authenticated);
  authStatus.textContent = authenticated ? `${auth.body.data.member.nickname} 로그인` : '비로그인';
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
      authStatus.textContent = result.body?.data?.authenticated ? `${result.body.data.member.nickname} 로그인` : '비로그인';
    }
    if (action === 'member-me') await api('/api/member/me');
    if (action === 'logout') {
      await api('/api/auth/logout', {method:'POST', body:'{}'});
      authStatus.textContent = '비로그인';
    }
  });
});

document.querySelector('#adminForm').addEventListener('submit', async event => {
  event.preventDefault();
  const data = formObject(event.currentTarget);
  data.power = Number(data.power);
  const result = await jsonPost('/api/setup/admin', data);
  if (result.response.ok) authStatus.textContent = `${result.body?.data?.member?.nickname || '관리자'} 로그인`;
});

document.querySelector('#signupForm').addEventListener('submit', async event => {
  event.preventDefault();
  const data = formObject(event.currentTarget);
  data.power = Number(data.power);
  const result = await jsonPost('/api/auth/signup', data);
  if (result.response.ok) authStatus.textContent = `${result.body?.data?.member?.nickname || '회원'} 로그인`;
});

document.querySelector('#loginForm').addEventListener('submit', async event => {
  event.preventDefault();
  const result = await jsonPost('/api/auth/login', formObject(event.currentTarget));
  if (result.response.ok) authStatus.textContent = `${result.body?.data?.member?.nickname || '회원'} 로그인`;
});

document.querySelector('#profileForm').addEventListener('submit', event => {
  event.preventDefault();
  const data = formObject(event.currentTarget);
  data.power = Number(data.power);
  jsonPost('/api/member/profile', data, 'PUT');
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

quickCheck().catch(() => {});
