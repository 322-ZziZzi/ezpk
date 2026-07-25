(function () {
  'use strict';

  const header = document.querySelector('[data-shared-header]');
  if (!header) return;

  const base = header.dataset.base || '.';
  const homeHref = header.dataset.homeHref || `${base}/`;
  const activeMenu = header.dataset.activeMenu || '';

  const NAV_LABELS = {
    ko: { home:'홈', seasonUpcoming:'시즌 6 (준비중)', seasonArchive:'시즌 5 (종료)', members:'멤버', bgb:'BGB', tip:'팁', request:'요청 게시판', accounts:'계정', game:'🎮 미니게임', logo:'로고' },
    en: { home:'HOME', seasonUpcoming:'SEASON 6 (COMING SOON)', seasonArchive:'SEASON 5 (ENDED)', members:'MEMBERS', bgb:'BGB', tip:'TIP', request:'REQUEST', accounts:'ACCOUNTS', game:'🎮 MINI GAME', logo:'LOGO' },
    pt: { home:'INÍCIO', seasonUpcoming:'TEMPORADA 6 (EM BREVE)', seasonArchive:'TEMPORADA 5 (ENCERRADA)', members:'MEMBROS', bgb:'BGB', tip:'DICAS', request:'SOLICITAÇÕES', accounts:'CONTAS', game:'🎮 MINI GAME', logo:'LOGO' },
    vi: { home:'TRANG CHỦ', seasonUpcoming:'MÙA 6 (SẮP RA MẮT)', seasonArchive:'MÙA 5 (ĐÃ KẾT THÚC)', members:'THÀNH VIÊN', bgb:'BGB', tip:'MẸO', request:'YÊU CẦU', accounts:'TÀI KHOẢN', game:'🎮 MINI GAME', logo:'LOGO' },
    ar: { home:'الرئيسية', seasonUpcoming:'الموسم 6 (قريبًا)', seasonArchive:'الموسم 5 (انتهى)', members:'الأعضاء', bgb:'BGB', tip:'نصائح', request:'الطلبات', accounts:'الحسابات', game:'🎮 الألعاب المصغرة', logo:'الشعار' },
    ja: { home:'ホーム', seasonUpcoming:'シーズン6（準備中）', seasonArchive:'シーズン5（終了）', members:'メンバー', bgb:'BGB', tip:'ヒント', request:'リクエスト', accounts:'アカウント', game:'🎮 ミニゲーム', logo:'ロゴ' },
    th: { home:'หน้าแรก', seasonUpcoming:'ซีซัน 6 (เร็ว ๆ นี้)', seasonArchive:'ซีซัน 5 (สิ้นสุดแล้ว)', members:'สมาชิก', bgb:'BGB', tip:'เคล็ดลับ', request:'คำขอ', accounts:'บัญชี', game:'🎮 มินิเกม', logo:'โลโก้' },
    'zh-tw': { home:'首頁', seasonUpcoming:'第 6 賽季（準備中）', seasonArchive:'第 5 賽季（已結束）', members:'成員名單', bgb:'BGB', tip:'提示', request:'留言板', accounts:'帳號', game:'🎮 小遊戲', logo:'標誌' }
  };

  const ACCOUNT_LABELS = {
    ko: { login:'로그인', signup:'회원가입', account:'계정', member:'멤버', administrator:'관리자', admin:'관리자', myPage:'마이페이지', logout:'로그아웃', unavailable:'다음 버전에서 제공됩니다.', loading:'확인 중' },
    en: { login:'LOGIN', signup:'SIGN UP', account:'ACCOUNT', member:'MEMBER', administrator:'ADMINISTRATOR', admin:'ADMIN', myPage:'MY PAGE', logout:'LOGOUT', unavailable:'Available in the next version.', loading:'CHECKING' },
    pt: { login:'ENTRAR', signup:'CADASTRAR', account:'CONTA', member:'MEMBRO', administrator:'ADMINISTRADOR', admin:'ADMIN', myPage:'MINHA PÁGINA', logout:'SAIR', unavailable:'Disponível na próxima versão.', loading:'VERIFICANDO' },
    vi: { login:'ĐĂNG NHẬP', signup:'ĐĂNG KÝ', account:'TÀI KHOẢN', member:'THÀNH VIÊN', administrator:'QUẢN TRỊ VIÊN', admin:'QUẢN TRỊ', myPage:'TRANG CỦA TÔI', logout:'ĐĂNG XUẤT', unavailable:'Sẽ có trong phiên bản tiếp theo.', loading:'ĐANG KIỂM TRA' },
    ar: { login:'تسجيل الدخول', signup:'إنشاء حساب', account:'الحساب', member:'عضو', administrator:'مسؤول', admin:'الإدارة', myPage:'صفحتي', logout:'تسجيل الخروج', unavailable:'متاح في الإصدار القادم.', loading:'جارٍ التحقق' },
    ja: { login:'ログイン', signup:'新規登録', account:'アカウント', member:'メンバー', administrator:'管理者', admin:'管理', myPage:'マイページ', logout:'ログアウト', unavailable:'次のバージョンで提供されます。', loading:'確認中' },
    th: { login:'เข้าสู่ระบบ', signup:'สมัครสมาชิก', account:'บัญชี', member:'สมาชิก', administrator:'ผู้ดูแลระบบ', admin:'ผู้ดูแล', myPage:'หน้าของฉัน', logout:'ออกจากระบบ', unavailable:'พร้อมใช้งานในเวอร์ชันถัดไป', loading:'กำลังตรวจสอบ' },
    'zh-tw': { login:'登入', signup:'註冊', account:'帳號', member:'成員', administrator:'管理員', admin:'管理', myPage:'我的頁面', logout:'登出', unavailable:'將於下一版本提供。', loading:'確認中' }
  };

  const menuItems = [
    { key: 'home', href: homeHref },
    { key: 'seasonUpcoming', href: `${base}/season6/` },
    { key: 'seasonArchive', href: `${base}/season5/` },
    { key: 'members', href: `${base}/members/` },
    { key: 'bgb', href: `${base}/bgb/` },
    { key: 'tip', href: `${base}/tip/` },
    { key: 'request', href: `${base}/request/` },
    { key: 'accounts', href: `${base}/accounts/` },
    { key: 'game', href: `${base}/game/` },
    { key: 'logo', href: `${base}/logo/` }
  ];

  const menuHtml = menuItems.map(function (item) {
    const isActive = item.key === activeMenu;
    const classes = [item.key === 'bgb' ? 'nav-bgb' : '', item.key === 'accounts' ? 'nav-account-shine' : '', isActive ? 'active' : '']
      .filter(Boolean)
      .join(' ');
    const attrs = [
      `href="${item.href}"`,
      `data-menu="${item.key}"`,
      `data-nav-key="${item.key}"`,
      classes ? `class="${classes}"` : '',
      isActive ? 'aria-current="page"' : ''
    ].filter(Boolean).join(' ');
    return `<a ${attrs}></a>`;
  }).join('');

  header.innerHTML = `
    <a href="${homeHref}" class="brand">★ <span><b>322 EZPK</b><small>ALLIANCE PORTAL</small></span></a>
    <nav id="nav">
      <div class="mobile-account-slot" id="mobileAccountSlot" aria-live="polite"></div>
      ${menuHtml}
    </nav>
    <div class="header-account" id="desktopAccount" aria-live="polite">
      <span class="account-loading" data-account-label="loading"></span>
    </div>
    <div class="lang">
      <button id="langBtn" type="button" aria-haspopup="true" aria-expanded="false">
        <span class="mobile-language-icon" aria-hidden="true">🌐</span>
        <span class="desktop-language-label"><span id="flag"></span><span id="lname"></span> ▾</span>
      </button>
      <div id="langMenu" hidden>
        <button type="button" data-l="ko">🇰🇷 한국어</button>
        <button type="button" data-l="en">🇺🇸 English</button>
        <button type="button" data-l="pt">🇧🇷 Português</button>
        <button type="button" data-l="vi">🇻🇳 Tiếng Việt</button>
        <button type="button" data-l="ar">🇸🇦 العربية</button>
        <button type="button" data-l="ja">🇯🇵 日本語</button>
        <button type="button" data-l="th">🇹🇭 ไทย</button>
        <button type="button" data-l="zh-tw">🇹🇼 繁體中文</button>
      </div>
    </div>
    <button id="menuBtn" type="button" aria-label="Menu" aria-expanded="false">☰</button>`;

  const META = {
    ko:['🇰🇷','한국어'], en:['🇺🇸','English'], pt:['🇧🇷','Português'], vi:['🇻🇳','Tiếng Việt'],
    ar:['🇸🇦','العربية'], ja:['🇯🇵','日本語'], th:['🇹🇭','ไทย'], 'zh-tw':['🇹🇼','繁體中文']
  };
  const STORAGE_KEY='ezpk-lang-v5';
  const SUPPORTED_LANGS=Object.freeze(['ko','en','pt','vi','ar','ja','th','zh-tw']);
  let authState = { authenticated:false, member:null };
  let authLoaded = false;

  function normalizeLanguage(lang) { return SUPPORTED_LANGS.includes(lang) ? lang : 'en'; }
  function currentLanguage() { return normalizeLanguage(localStorage.getItem(STORAGE_KEY) || 'en'); }
  function accountLabels() { return ACCOUNT_LABELS[currentLanguage()] || ACCOUNT_LABELS.en; }

  function renderNavLabels(lang) {
    const labels = NAV_LABELS[lang] || NAV_LABELS.en;
    header.querySelectorAll('[data-nav-key]').forEach(function (link) {
      const key = link.dataset.navKey;
      link.textContent = labels[key] || NAV_LABELS.en[key] || key;
    });
  }

  function applyLanguage(lang, emit=true) {
    lang=normalizeLanguage(lang);
    renderNavLabels(lang);
    const meta=META[lang];
    header.querySelector('#flag').textContent=meta[0];
    header.querySelector('#lname').textContent=meta[1];
    document.documentElement.lang=lang==='zh-tw'?'zh-Hant':lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    document.body.classList.toggle('rtl',lang==='ar');
    localStorage.setItem(STORAGE_KEY,lang);
    renderAccount();
    if (emit) window.dispatchEvent(new CustomEvent('ezpk-language-change',{detail:{lang}}));
  }

  function safeText(value) {
    return String(value ?? '').replace(/[&<>"']/g, function (char) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[char];
    });
  }

  function unavailable(event) {
    event.preventDefault();
    window.dispatchEvent(new CustomEvent('ezpk-account-action', { detail: { action:event.currentTarget.dataset.accountAction } }));
    alert(accountLabels().unavailable);
  }

  async function logout(event) {
    event.preventDefault();
    try {
      await fetch('/api/auth/logout', {
        method:'POST',
        credentials:'include',
        headers:{'content-type':'application/json'},
        body:'{}'
      });
    } catch (_) {
      // The local UI still clears even when the network is temporarily unavailable.
    }
    authState = { authenticated:false, member:null };
    authLoaded = true;
    renderAccount();
    closeMenus();
    window.dispatchEvent(new CustomEvent('ezpk-auth-change', { detail:authState }));
  }

  function accountMarkup(mobile) {
    const labels = accountLabels();
    if (!authLoaded) {
      return `<span class="account-loading">${safeText(labels.loading)}</span>`;
    }

    if (!authState.authenticated || !authState.member) {
      if (mobile) {
        return `
          <div class="mobile-account-heading">${safeText(labels.account)}</div>
          <button type="button" class="mobile-account-action" data-account-action="login">${safeText(labels.login)}</button>
          <button type="button" class="mobile-account-action mobile-account-primary" data-account-action="signup">${safeText(labels.signup)}</button>
          <div class="mobile-account-divider"></div>`;
      }
      return `
        <button type="button" class="account-button account-login" data-account-action="login">${safeText(labels.login)}</button>
        <button type="button" class="account-button account-signup" data-account-action="signup">${safeText(labels.signup)}</button>`;
    }

    const member = authState.member;
    const isAdmin = member.role === 'admin';
    const roleLabel = isAdmin ? labels.administrator : labels.member;
    const dropdownItems = `
      ${isAdmin ? `<button type="button" data-account-action="admin">${safeText(labels.admin)}</button>` : ''}
      <button type="button" data-account-action="mypage">${safeText(labels.myPage)}</button>
      <button type="button" data-account-action="logout">${safeText(labels.logout)}</button>`;

    if (mobile) {
      return `
        <div class="mobile-account-profile">
          <strong title="${safeText(member.nickname)}">${safeText(member.nickname)}</strong>
          <span class="${isAdmin ? 'rank-r5' : ''}">${safeText(member.memberRank)} · ${safeText(roleLabel)}</span>
        </div>
        <div class="mobile-account-actions">${dropdownItems}</div>
        <div class="mobile-account-divider"></div>`;
    }

    return `
      <div class="account-member">
        <button type="button" class="account-member-trigger" aria-expanded="false">
          <span class="account-member-name" title="${safeText(member.nickname)}">${safeText(member.nickname)}</span>
          <span class="account-rank ${isAdmin ? 'rank-r5' : ''}">${safeText(member.memberRank)}</span>
          <span aria-hidden="true">▾</span>
        </button>
        <div class="account-menu" hidden>
          <div class="account-menu-profile">
            <strong>${safeText(member.nickname)}</strong>
            <span class="${isAdmin ? 'rank-r5' : ''}">${safeText(member.memberRank)} · ${safeText(roleLabel)}</span>
          </div>
          ${dropdownItems}
        </div>
      </div>`;
  }

  function bindAccountEvents(container) {
    container.querySelectorAll('[data-account-action]').forEach(function (button) {
      if (button.dataset.accountAction === 'logout') button.addEventListener('click', logout);
      else button.addEventListener('click', unavailable);
    });

    const trigger = container.querySelector('.account-member-trigger');
    const menu = container.querySelector('.account-menu');
    if (trigger && menu) {
      trigger.addEventListener('click', function (event) {
        event.stopPropagation();
        const nextHidden = !menu.hidden ? true : false;
        menu.hidden = nextHidden;
        trigger.setAttribute('aria-expanded', String(!nextHidden));
      });
    }
  }

  function renderAccount() {
    const desktop = header.querySelector('#desktopAccount');
    const mobile = header.querySelector('#mobileAccountSlot');
    desktop.innerHTML = accountMarkup(false);
    mobile.innerHTML = accountMarkup(true);
    bindAccountEvents(desktop);
    bindAccountEvents(mobile);
  }

  async function loadAuth() {
    try {
      const response = await fetch('/api/auth/me', {
        method:'GET',
        credentials:'include',
        headers:{'accept':'application/json'}
      });
      const payload = await response.json();
      authState = payload?.ok && payload?.data?.authenticated
        ? { authenticated:true, member:payload.data.member }
        : { authenticated:false, member:null };
    } catch (_) {
      authState = { authenticated:false, member:null };
    }
    authLoaded = true;
    renderAccount();
    window.dispatchEvent(new CustomEvent('ezpk-auth-ready', { detail:authState }));
  }

  function closeMenus() {
    const langMenu = header.querySelector('#langMenu');
    const nav = header.querySelector('#nav');
    const menuBtn = header.querySelector('#menuBtn');
    if (langMenu) langMenu.hidden = true;
    if (nav) nav.classList.remove('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded','false');
    header.querySelectorAll('.account-menu').forEach(function (menu) { menu.hidden = true; });
    header.querySelectorAll('.account-member-trigger').forEach(function (button) { button.setAttribute('aria-expanded','false'); });
  }

  const initialLang = currentLanguage();
  applyLanguage(initialLang,false);

  const langBtn=header.querySelector('#langBtn');
  const langMenu=header.querySelector('#langMenu');
  langBtn.addEventListener('click',function(e){
    e.stopPropagation();
    const willOpen = langMenu.hidden;
    closeMenus();
    langMenu.hidden=!willOpen;
    langBtn.setAttribute('aria-expanded', String(willOpen));
  });
  header.querySelectorAll('#langMenu [data-l]').forEach(function (button) {
    button.addEventListener('click', function () {
      langMenu.hidden=true;
      langBtn.setAttribute('aria-expanded','false');
      applyLanguage(button.dataset.l,true);
    });
  });

  const menuBtn=header.querySelector('#menuBtn');
  const nav=header.querySelector('#nav');
  menuBtn.addEventListener('click',function(e){
    e.stopPropagation();
    const willOpen = !nav.classList.contains('open');
    closeMenus();
    nav.classList.toggle('open', willOpen);
    menuBtn.setAttribute('aria-expanded',String(willOpen));
  });
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded','false');
    });
  });

  document.addEventListener('click',function(e){
    if (!header.contains(e.target)) closeMenus();
    else if (!header.querySelector('.lang').contains(e.target)) {
      langMenu.hidden=true;
      langBtn.setAttribute('aria-expanded','false');
    }
  });
  window.addEventListener('storage',function(e){if(e.key===STORAGE_KEY)applyLanguage(e.newValue,false)});

  window.EZPKLanguage={key:STORAGE_KEY,supported:SUPPORTED_LANGS,normalize:normalizeLanguage,get:currentLanguage,set:(lang)=>applyLanguage(lang,true)};
  window.EZPKSharedHeader = {
    renderNavLabels,
    applyLanguage,
    refreshAuth:loadAuth,
    getAuthState:function () { return authState; }
  };

  loadAuth();
})();
