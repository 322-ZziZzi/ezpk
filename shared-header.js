(function () {
  'use strict';

  const header = document.querySelector('[data-shared-header]');
  if (!header) return;

  const base = header.dataset.base || '.';
  const homeHref = header.dataset.homeHref || `${base}/`;
  const activeMenu = header.dataset.activeMenu || '';

  const menuItems = [
    { key: 'home', href: homeHref, translation: 'navHome' },
    { key: 'season7', href: `${base}/season7/`, translation: 'navSeason7' },
    { key: 'season6', href: `${base}/season6/`, translation: 'navSeason6' },
    { key: 'members', href: `${base}/members/`, translation: 'navMember' },
    { key: 'bgb', href: `${base}/bgb/`, label: 'BGB' },
    { key: 'tip', href: `${base}/tip/`, translation: 'navTip' },
    { key: 'request', href: `${base}/request/`, translation: 'navRequest' },
    { key: 'game', href: `${base}/game/`, translation: 'navGame' },
    { key: 'logo', href: `${base}/logo/`, translation: 'navLogo' }
  ];

  const menuHtml = menuItems.map(function (item) {
    const isActive = item.key === activeMenu;
    const classes = [item.key === 'bgb' ? 'nav-bgb' : '', isActive ? 'active' : '']
      .filter(Boolean)
      .join(' ');
    const attrs = [
      `href="${item.href}"`,
      `data-menu="${item.key}"`,
      item.translation ? `data-k="${item.translation}"` : '',
      classes ? `class="${classes}"` : '',
      isActive ? 'aria-current="page"' : ''
    ].filter(Boolean).join(' ');
    return `<a ${attrs}>${item.label || ''}</a>`;
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

})();
