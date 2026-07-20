(function () {
  'use strict';

  const header = document.querySelector('[data-shared-header]');
  if (!header) return;

  const base = header.dataset.base || '.';
  const homeHref = header.dataset.homeHref || `${base}/`;
  const activeMenu = header.dataset.activeMenu || '';

  const NAV_LABELS = {
    ko: { home:'홈', seasonUpcoming:'시즌 6 (준비중)', seasonArchive:'시즌 5 (종료)', members:'멤버', bgb:'BGB', tip:'팁', request:'요청 게시판', game:'🎮 미니게임', logo:'로고' },
    en: { home:'HOME', seasonUpcoming:'SEASON 6 (COMING SOON)', seasonArchive:'SEASON 5 (ENDED)', members:'MEMBERS', bgb:'BGB', tip:'TIP', request:'REQUEST', game:'🎮 MINI GAME', logo:'LOGO' },
    pt: { home:'INÍCIO', seasonUpcoming:'TEMPORADA 6 (EM BREVE)', seasonArchive:'TEMPORADA 5 (ENCERRADA)', members:'MEMBROS', bgb:'BGB', tip:'DICAS', request:'SOLICITAÇÕES', game:'🎮 MINI GAME', logo:'LOGO' },
    vi: { home:'TRANG CHỦ', seasonUpcoming:'MÙA 6 (SẮP RA MẮT)', seasonArchive:'MÙA 5 (ĐÃ KẾT THÚC)', members:'THÀNH VIÊN', bgb:'BGB', tip:'MẸO', request:'YÊU CẦU', game:'🎮 MINI GAME', logo:'LOGO' },
    ar: { home:'الرئيسية', seasonUpcoming:'الموسم 6 (قريبًا)', seasonArchive:'الموسم 5 (انتهى)', members:'الأعضاء', bgb:'BGB', tip:'نصائح', request:'الطلبات', game:'🎮 الألعاب المصغرة', logo:'الشعار' },
    ja: { home:'ホーム', seasonUpcoming:'シーズン6（準備中）', seasonArchive:'シーズン5（終了）', members:'メンバー', bgb:'BGB', tip:'ヒント', request:'リクエスト', game:'🎮 ミニゲーム', logo:'ロゴ' },
    th: { home:'หน้าแรก', seasonUpcoming:'ซีซัน 6 (เร็ว ๆ นี้)', seasonArchive:'ซีซัน 5 (สิ้นสุดแล้ว)', members:'สมาชิก', bgb:'BGB', tip:'เคล็ดลับ', request:'คำขอ', game:'🎮 มินิเกม', logo:'โลโก้' },
    'zh-tw': { home:'首頁', seasonUpcoming:'第 6 賽季（準備中）', seasonArchive:'第 5 賽季（已結束）', members:'成員名單', bgb:'BGB', tip:'提示', request:'留言板', game:'🎮 小遊戲', logo:'標誌' }
  };

  const menuItems = [
    { key: 'home', href: homeHref },
    { key: 'seasonUpcoming', href: `${base}/season6/` },
    { key: 'seasonArchive', href: `${base}/season5/` },
    { key: 'members', href: `${base}/members/` },
    { key: 'bgb', href: `${base}/bgb/` },
    { key: 'tip', href: `${base}/tip/` },
    { key: 'request', href: `${base}/request/` },
    { key: 'game', href: `${base}/game/` },
    { key: 'logo', href: `${base}/logo/` }
  ];

  const menuHtml = menuItems.map(function (item) {
    const isActive = item.key === activeMenu;
    const classes = [item.key === 'bgb' ? 'nav-bgb' : '', isActive ? 'active' : '']
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
    <button id="menuBtn" type="button" aria-label="Menu" aria-expanded="false">☰</button>
    <nav id="nav">${menuHtml}</nav>
    <div class="lang">
      <button id="langBtn" type="button"><span id="flag"></span><span id="lname"></span> ▾</button>
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
    </div>`;

  function renderNavLabels(lang) {
    const labels = NAV_LABELS[lang] || NAV_LABELS.en;
    header.querySelectorAll('[data-nav-key]').forEach(function (link) {
      const key = link.dataset.navKey;
      link.textContent = labels[key] || NAV_LABELS.en[key] || key;
    });
  }

  const initialLang = localStorage.getItem('ezpk-lang-v5') || 'en';
  renderNavLabels(initialLang);

  header.querySelectorAll('#langMenu [data-l]').forEach(function (button) {
    button.addEventListener('click', function () {
      renderNavLabels(button.dataset.l);
    });
  });

  window.EZPKSharedHeader = { renderNavLabels };
})();
