(function () {
  'use strict';

  // v255: Normalize the public host before authentication. Secure __Host-
  // cookies are bound to the exact host, so www/http variants must converge on
  // https://ezpk322.com. Preview, localhost, and workers.dev hosts are left alone.
  const currentHost = String(window.location.hostname || '').toLowerCase();
  const isTranslationProxy = currentHost.endsWith('.translate.goog')
    || currentHost === 'translate.goog'
    || currentHost.endsWith('.translate.googleusercontent.com')
    || currentHost === 'translate.googleusercontent.com';
  const isCanonicalHost = currentHost === 'ezpk322.com';
  const isWwwHost = currentHost === 'www.ezpk322.com';
  const needsHttps = (isCanonicalHost || isWwwHost) && window.location.protocol !== 'https:';
  if (isTranslationProxy || isWwwHost || needsHttps) {
    const canonical = new URL(window.location.href);
    canonical.protocol = 'https:';
    canonical.hostname = 'ezpk322.com';
    canonical.port = '';
    ['_x_tr_sl', '_x_tr_tl', '_x_tr_hl', '_x_tr_pto'].forEach(function (key) {
      canonical.searchParams.delete(key);
    });
    window.location.replace(canonical.toString());
    return;
  }

  // v255: In-app browsers frequently isolate or discard secure session cookies.
  // Detect common embedded browsers and explain how to reopen the exact page in
  // Chrome/Safari. The user may continue, but the warning remains available for
  // every new browser session.
  const ua = String(navigator.userAgent || '');
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isStandalone = Boolean(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
    || Boolean(navigator.standalone);
  const inAppPatterns = [
    /FBAN|FBAV|FB_IAB/i,
    /Instagram/i,
    /KAKAOTALK/i,
    /Line\//i,
    /NAVER\(inapp/i,
    /DaumApps/i,
    /Twitter/i,
    /Discord/i,
    /Telegram/i,
    /Snapchat/i,
    /TikTok/i,
    /wv\).*Version\//i,
    /; wv\)/i
  ];
  const isInAppBrowser = !isStandalone && inAppPatterns.some(function (pattern) { return pattern.test(ua); });

  function canonicalPublicUrl() {
    const target = new URL(window.location.href);
    if (target.hostname === 'www.ezpk322.com' || target.hostname.endsWith('.translate.goog')
      || target.hostname.endsWith('.translate.googleusercontent.com')) {
      target.hostname = 'ezpk322.com';
    }
    if (target.hostname === 'ezpk322.com') {
      target.protocol = 'https:';
      target.port = '';
    }
    ['_x_tr_sl', '_x_tr_tl', '_x_tr_hl', '_x_tr_pto'].forEach(function (key) {
      target.searchParams.delete(key);
    });
    return target.toString();
  }

  function inAppCopy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      const input = document.createElement('textarea');
      input.value = text;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
      } catch (error) { reject(error); }
      input.remove();
    });
  }

  function showInAppBrowserGuide() {
    if (!isInAppBrowser || document.getElementById('ezpkInAppGuide')) return;
    let lang = 'en';
    try { lang = localStorage.getItem('ezpk-lang-v5') || 'en'; } catch (_) {}
    const copyByLang = {
      ko:{title:'외부 브라우저에서 열어주세요',lead:'현재 앱 내부 브라우저에서는 로그인 세션이 유지되지 않을 수 있습니다.',steps:isIOS?'아래 주소를 복사한 뒤 Safari 또는 Chrome 주소창에 붙여 넣어 주세요.':'아래 버튼으로 Chrome을 열거나 주소를 복사해 Chrome 주소창에 붙여 넣어 주세요.',open:'외부 브라우저로 열기',copy:'주소 복사',continue:'현재 브라우저에서 계속',copied:'주소가 복사되었습니다.'},
      en:{title:'Open in an external browser',lead:'This in-app browser may not preserve your login session.',steps:isIOS?'Copy the address below and paste it into Safari or Chrome.':'Open Chrome below, or copy the address and paste it into Chrome.',open:'Open external browser',copy:'Copy address',continue:'Continue here',copied:'Address copied.'},
      pt:{title:'Abra em um navegador externo',lead:'Este navegador interno pode não manter sua sessão de login.',steps:'Copie o endereço abaixo e abra-o no Chrome ou Safari.',open:'Abrir navegador externo',copy:'Copiar endereço',continue:'Continuar aqui',copied:'Endereço copiado.'},
      vi:{title:'Mở bằng trình duyệt bên ngoài',lead:'Trình duyệt trong ứng dụng có thể không giữ phiên đăng nhập.',steps:'Sao chép địa chỉ bên dưới và mở bằng Chrome hoặc Safari.',open:'Mở trình duyệt ngoài',copy:'Sao chép địa chỉ',continue:'Tiếp tục tại đây',copied:'Đã sao chép địa chỉ.'},
      ar:{title:'افتح في متصفح خارجي',lead:'قد لا يحتفظ المتصفح داخل التطبيق بجلسة تسجيل الدخول.',steps:'انسخ العنوان أدناه وافتحه في Chrome أو Safari.',open:'فتح متصفح خارجي',copy:'نسخ العنوان',continue:'المتابعة هنا',copied:'تم نسخ العنوان.'},
      ja:{title:'外部ブラウザで開いてください',lead:'アプリ内ブラウザではログイン状態が維持されない場合があります。',steps:'下のアドレスをコピーしてSafariまたはChromeで開いてください。',open:'外部ブラウザで開く',copy:'アドレスをコピー',continue:'このまま続ける',copied:'アドレスをコピーしました。'},
      th:{title:'เปิดด้วยเบราว์เซอร์ภายนอก',lead:'เบราว์เซอร์ในแอปอาจไม่เก็บสถานะการเข้าสู่ระบบ',steps:'คัดลอกที่อยู่ด้านล่างแล้วเปิดด้วย Chrome หรือ Safari',open:'เปิดเบราว์เซอร์ภายนอก',copy:'คัดลอกที่อยู่',continue:'ใช้งานต่อที่นี่',copied:'คัดลอกที่อยู่แล้ว'},
      'zh-tw':{title:'請使用外部瀏覽器開啟',lead:'應用程式內建瀏覽器可能無法保留登入狀態。',steps:'請複製下方網址並使用 Safari 或 Chrome 開啟。',open:'使用外部瀏覽器開啟',copy:'複製網址',continue:'繼續使用目前瀏覽器',copied:'網址已複製。'}
    };
    const t = copyByLang[lang] || copyByLang.en;
    const url = canonicalPublicUrl();
    const overlay = document.createElement('div');
    overlay.id = 'ezpkInAppGuide';
    overlay.innerHTML = '<div class="ezpk-inapp-card" role="dialog" aria-modal="true" aria-labelledby="ezpkInAppTitle">'
      + '<div class="ezpk-inapp-icon" aria-hidden="true">↗</div>'
      + '<h2 id="ezpkInAppTitle"></h2><p class="ezpk-inapp-lead"></p><p class="ezpk-inapp-steps"></p>'
      + '<div class="ezpk-inapp-url"></div><div class="ezpk-inapp-actions">'
      + '<button type="button" data-inapp-open></button><button type="button" data-inapp-copy></button>'
      + '<button type="button" class="ezpk-inapp-continue" data-inapp-close></button></div>'
      + '<p class="ezpk-inapp-status" aria-live="polite"></p></div>';
    const style = document.createElement('style');
    style.textContent = '#ezpkInAppGuide{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:20px;background:rgba(4,8,16,.82);backdrop-filter:blur(8px)}.ezpk-inapp-card{width:min(440px,100%);box-sizing:border-box;padding:26px 22px 20px;border:1px solid rgba(212,175,55,.55);border-radius:18px;background:#101722;color:#f7f4ea;box-shadow:0 24px 70px rgba(0,0,0,.48);text-align:center}.ezpk-inapp-icon{width:48px;height:48px;margin:0 auto 12px;display:grid;place-items:center;border-radius:50%;background:rgba(212,175,55,.13);color:#e8c85a;font-size:25px}.ezpk-inapp-card h2{margin:0 0 10px;font-size:21px}.ezpk-inapp-card p{margin:7px 0;line-height:1.55}.ezpk-inapp-lead{color:#fff}.ezpk-inapp-steps{color:#c7ced9;font-size:14px}.ezpk-inapp-url{margin:15px 0;padding:10px 12px;border-radius:10px;background:#080d14;color:#d8dee8;font-size:12px;word-break:break-all;text-align:left}.ezpk-inapp-actions{display:grid;gap:9px}.ezpk-inapp-actions button{min-height:45px;border:0;border-radius:10px;font-weight:800;cursor:pointer}.ezpk-inapp-actions [data-inapp-open]{background:#d7b84a;color:#111}.ezpk-inapp-actions [data-inapp-copy]{background:#273346;color:#fff}.ezpk-inapp-actions .ezpk-inapp-continue{background:transparent;color:#aeb7c5;border:1px solid #344156}.ezpk-inapp-status{min-height:20px;color:#e8c85a;font-size:13px}';
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    overlay.querySelector('#ezpkInAppTitle').textContent = t.title;
    overlay.querySelector('.ezpk-inapp-lead').textContent = t.lead;
    overlay.querySelector('.ezpk-inapp-steps').textContent = t.steps;
    overlay.querySelector('.ezpk-inapp-url').textContent = url;
    overlay.querySelector('[data-inapp-open]').textContent = t.open;
    overlay.querySelector('[data-inapp-copy]').textContent = t.copy;
    overlay.querySelector('[data-inapp-close]').textContent = t.continue;
    const status = overlay.querySelector('.ezpk-inapp-status');
    overlay.querySelector('[data-inapp-copy]').addEventListener('click', function () {
      inAppCopy(url).then(function () { status.textContent = t.copied; }).catch(function () { status.textContent = url; });
    });
    overlay.querySelector('[data-inapp-open]').addEventListener('click', function () {
      if (isAndroid) {
        const parsed = new URL(url);
        const intentPath = parsed.host + parsed.pathname + parsed.search + parsed.hash;
        window.location.href = 'intent://' + intentPath + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + encodeURIComponent(url) + ';end';
      } else {
        inAppCopy(url).finally(function () {
          status.textContent = t.copied;
          window.open(url, '_blank', 'noopener,noreferrer');
        });
      }
    });
    overlay.querySelector('[data-inapp-close]').addEventListener('click', function () { overlay.remove(); style.remove(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showInAppBrowserGuide, { once:true });
  else showInAppBrowserGuide();

  const header = document.querySelector('[data-shared-header]');
  if (!header) return;
  const isAdminContext = header.dataset.adminContext === 'true';

  const base = header.dataset.base || '.';
  const homeHref = header.dataset.homeHref || `${base}/`;
  const activeMenu = header.dataset.activeMenu || '';
  const SHOW_SEASON_5_MENU = false; // v239: preserve Season 5 page/data, hide menu for all users

  const NAV_LABELS = {
    ko: { home:'홈', vote:'투표', capitalWar:'수도전', seasonUpcoming:'시즌 6 (준비중)', seasonArchive:'시즌 5 (종료)', members:'멤버', bgb:'BGB', tip:'팁', request:'요청 게시판', accounts:'계정 마켓', game:'🎮 미니게임', logo:'로고' },
    en: { home:'HOME', vote:'VOTE', capitalWar:'CAPITAL WAR', seasonUpcoming:'SEASON 6 (COMING SOON)', seasonArchive:'SEASON 5 (ENDED)', members:'MEMBERS', bgb:'BGB', tip:'TIP', request:'REQUEST', accounts:'ACCOUNT MARKET', game:'🎮 MINI GAME', logo:'LOGO' },
    pt: { home:'INÍCIO', vote:'VOTAÇÃO', capitalWar:'GUERRA DA CAPITAL', seasonUpcoming:'TEMPORADA 6 (EM BREVE)', seasonArchive:'TEMPORADA 5 (ENCERRADA)', members:'MEMBROS', bgb:'BGB', tip:'DICAS', request:'SOLICITAÇÕES', accounts:'MERCADO DE CONTAS', game:'🎮 MINI GAME', logo:'LOGO' },
    vi: { home:'TRANG CHỦ', vote:'BÌNH CHỌN', capitalWar:'CHIẾN TRANH THỦ ĐÔ', seasonUpcoming:'MÙA 6 (SẮP RA MẮT)', seasonArchive:'MÙA 5 (ĐÃ KẾT THÚC)', members:'THÀNH VIÊN', bgb:'BGB', tip:'MẸO', request:'YÊU CẦU', accounts:'CHỢ TÀI KHOẢN', game:'🎮 MINI GAME', logo:'LOGO' },
    ar: { home:'الرئيسية', vote:'التصويت', capitalWar:'حرب العاصمة', seasonUpcoming:'الموسم 6 (قريبًا)', seasonArchive:'الموسم 5 (انتهى)', members:'الأعضاء', bgb:'BGB', tip:'نصائح', request:'الطلبات', accounts:'سوق الحسابات', game:'🎮 الألعاب المصغرة', logo:'الشعار' },
    ja: { home:'ホーム', vote:'投票', capitalWar:'首都戦', seasonUpcoming:'シーズン6（準備中）', seasonArchive:'シーズン5（終了）', members:'メンバー', bgb:'BGB', tip:'ヒント', request:'リクエスト', accounts:'アカウントマーケット', game:'🎮 ミニゲーム', logo:'ロゴ' },
    th: { home:'หน้าแรก', vote:'โหวต', capitalWar:'สงครามเมืองหลวง', seasonUpcoming:'ซีซัน 6 (เร็ว ๆ นี้)', seasonArchive:'ซีซัน 5 (สิ้นสุดแล้ว)', members:'สมาชิก', bgb:'BGB', tip:'เคล็ดลับ', request:'คำขอ', accounts:'ตลาดบัญชี', game:'🎮 มินิเกม', logo:'โลโก้' },
    'zh-tw': { home:'首頁', vote:'投票', capitalWar:'首都戰', seasonUpcoming:'第 6 賽季（準備中）', seasonArchive:'第 5 賽季（已結束）', members:'成員名單', bgb:'BGB', tip:'攻略', request:'留言板', accounts:'帳號市集', game:'🎮 小遊戲', logo:'標誌' }
  };

  const ACCOUNT_LABELS = {
    ko: {
      login:'로그인', signup:'회원가입', account:'계정', member:'멤버',
      administrator:'관리자', admin:'관리자', myPage:'마이페이지', logout:'로그아웃',
      loading:'확인 중', loginId:'아이디', password:'비밀번호',
      noAccount:'계정이 없으신가요?', loginSuccess:'로그인되었습니다.',
      logoutSuccess:'로그아웃되었습니다.',
      invalidLogin:'아이디 또는 비밀번호가 올바르지 않습니다.',
      suspended:'정지된 계정입니다.', left:'탈퇴 처리된 계정입니다.',
      sessionExpired:'세션이 만료되었습니다. 다시 로그인해 주세요.',
      sessionNotSaved:'로그인 세션을 확인하지 못했습니다. ezpk322.com으로 직접 접속한 뒤 다시 로그인해 주세요.',
      requestFailed:'요청을 처리하지 못했습니다.',
      close:'닫기', showPassword:'비밀번호 보기', hidePassword:'비밀번호 숨기기',
      adminComing:'관리자 페이지는 다음 버전에서 제공됩니다.'
    },
    en: {
      login:'LOGIN', signup:'SIGN UP', account:'ACCOUNT', member:'MEMBER',
      administrator:'ADMINISTRATOR', admin:'ADMIN', myPage:'MY PAGE', logout:'LOGOUT',
      loading:'CHECKING', loginId:'Login ID', password:'Password',
      noAccount:'Do not have an account?', loginSuccess:'Logged in successfully.',
      logoutSuccess:'Logged out successfully.',
      invalidLogin:'Invalid login ID or password.',
      suspended:'This account is suspended.', left:'This account has been closed.',
      sessionExpired:'Your session has expired. Please log in again.',
      sessionNotSaved:'The login session could not be verified. Open ezpk322.com directly and log in again.',
      requestFailed:'The request could not be completed.',
      close:'Close', showPassword:'Show password', hidePassword:'Hide password',
      adminComing:'The Admin page will be available in the next version.'
    },
    pt: {
      login:'ENTRAR', signup:'CADASTRAR', account:'CONTA', member:'MEMBRO',
      administrator:'ADMINISTRADOR', admin:'ADMIN', myPage:'MINHA PÁGINA', logout:'SAIR',
      loading:'VERIFICANDO', loginId:'ID de login', password:'Senha',
      noAccount:'Ainda não tem uma conta?', loginSuccess:'Login realizado.',
      logoutSuccess:'Sessão encerrada.',
      invalidLogin:'ID de login ou senha inválidos.',
      suspended:'Esta conta está suspensa.', left:'Esta conta foi encerrada.',
      sessionExpired:'Sua sessão expirou. Entre novamente.',
      sessionNotSaved:'Não foi possível verificar a sessão. Acesse ezpk322.com diretamente e entre novamente.',
      requestFailed:'Não foi possível concluir a solicitação.',
      close:'Fechar', showPassword:'Mostrar senha', hidePassword:'Ocultar senha',
      adminComing:'A página de administração estará disponível na próxima versão.'
    },
    vi: {
      login:'ĐĂNG NHẬP', signup:'ĐĂNG KÝ', account:'TÀI KHOẢN', member:'THÀNH VIÊN',
      administrator:'QUẢN TRỊ VIÊN', admin:'QUẢN TRỊ', myPage:'TRANG CỦA TÔI', logout:'ĐĂNG XUẤT',
      loading:'ĐANG KIỂM TRA', loginId:'ID đăng nhập', password:'Mật khẩu',
      noAccount:'Chưa có tài khoản?', loginSuccess:'Đăng nhập thành công.',
      logoutSuccess:'Đã đăng xuất.',
      invalidLogin:'ID đăng nhập hoặc mật khẩu không đúng.',
      suspended:'Tài khoản này đã bị đình chỉ.', left:'Tài khoản này đã đóng.',
      sessionExpired:'Phiên đã hết hạn. Vui lòng đăng nhập lại.',
      sessionNotSaved:'Không thể xác minh phiên đăng nhập. Hãy mở trực tiếp ezpk322.com và đăng nhập lại.',
      requestFailed:'Không thể xử lý yêu cầu.',
      close:'Đóng', showPassword:'Hiện mật khẩu', hidePassword:'Ẩn mật khẩu',
      adminComing:'Trang quản trị sẽ có trong phiên bản tiếp theo.'
    },
    ar: {
      login:'تسجيل الدخول', signup:'إنشاء حساب', account:'الحساب', member:'عضو',
      administrator:'مسؤول', admin:'الإدارة', myPage:'صفحتي', logout:'تسجيل الخروج',
      loading:'جارٍ التحقق', loginId:'معرّف الدخول', password:'كلمة المرور',
      noAccount:'ليس لديك حساب؟', loginSuccess:'تم تسجيل الدخول.',
      logoutSuccess:'تم تسجيل الخروج.',
      invalidLogin:'معرّف تسجيل الدخول أو كلمة المرور غير صحيحة.',
      suspended:'هذا الحساب موقوف.', left:'تم إغلاق هذا الحساب.',
      sessionExpired:'انتهت الجلسة. يرجى تسجيل الدخول مجددًا.',
      sessionNotSaved:'تعذر التحقق من جلسة الدخول. افتح ezpk322.com مباشرة ثم سجّل الدخول مجددًا.',
      requestFailed:'تعذر تنفيذ الطلب.',
      close:'إغلاق', showPassword:'إظهار كلمة المرور', hidePassword:'إخفاء كلمة المرور',
      adminComing:'ستتوفر صفحة الإدارة في الإصدار القادم.'
    },
    ja: {
      login:'ログイン', signup:'新規登録', account:'アカウント', member:'メンバー',
      administrator:'管理者', admin:'管理', myPage:'マイページ', logout:'ログアウト',
      loading:'確認中', loginId:'ログインID', password:'パスワード',
      noAccount:'アカウントをお持ちでないですか？', loginSuccess:'ログインしました。',
      logoutSuccess:'ログアウトしました。',
      invalidLogin:'ログインIDまたはパスワードが正しくありません。',
      suspended:'このアカウントは停止されています。', left:'このアカウントは退会済みです。',
      sessionExpired:'セッションの有効期限が切れました。再度ログインしてください。',
      sessionNotSaved:'ログインセッションを確認できませんでした。ezpk322.comを直接開いて再度ログインしてください。',
      requestFailed:'リクエストを処理できませんでした。',
      close:'閉じる', showPassword:'パスワードを表示', hidePassword:'パスワードを隠す',
      adminComing:'管理ページは次のバージョンで提供されます。'
    },
    th: {
      login:'เข้าสู่ระบบ', signup:'สมัครสมาชิก', account:'บัญชี', member:'สมาชิก',
      administrator:'ผู้ดูแลระบบ', admin:'ผู้ดูแล', myPage:'หน้าของฉัน', logout:'ออกจากระบบ',
      loading:'กำลังตรวจสอบ', loginId:'ไอดีเข้าสู่ระบบ', password:'รหัสผ่าน',
      noAccount:'ยังไม่มีบัญชีใช่ไหม?', loginSuccess:'เข้าสู่ระบบแล้ว',
      logoutSuccess:'ออกจากระบบแล้ว',
      invalidLogin:'รหัสเข้าสู่ระบบหรือรหัสผ่านไม่ถูกต้อง',
      suspended:'บัญชีนี้ถูกระงับ', left:'บัญชีนี้ถูกปิดแล้ว',
      sessionExpired:'เซสชันหมดอายุ โปรดเข้าสู่ระบบอีกครั้ง',
      sessionNotSaved:'ไม่สามารถตรวจสอบเซสชันได้ โปรดเปิด ezpk322.com โดยตรงแล้วเข้าสู่ระบบอีกครั้ง',
      requestFailed:'ไม่สามารถดำเนินการได้',
      close:'ปิด', showPassword:'แสดงรหัสผ่าน', hidePassword:'ซ่อนรหัสผ่าน',
      adminComing:'หน้าผู้ดูแลจะพร้อมใช้งานในเวอร์ชันถัดไป'
    },
    'zh-tw': {
      login:'登入', signup:'註冊', account:'帳號', member:'成員',
      administrator:'管理員', admin:'管理', myPage:'我的頁面', logout:'登出',
      loading:'確認中', loginId:'登入 ID', password:'密碼',
      noAccount:'還沒有帳號嗎？', loginSuccess:'登入成功。',
      logoutSuccess:'已登出。',
      invalidLogin:'登入 ID 或密碼不正確。',
      suspended:'此帳號已停權。', left:'此帳號已關閉。',
      sessionExpired:'工作階段已過期，請重新登入。',
      sessionNotSaved:'無法確認登入工作階段。請直接開啟 ezpk322.com 後重新登入。',
      requestFailed:'無法完成要求。',
      close:'關閉', showPassword:'顯示密碼', hidePassword:'隱藏密碼',
      adminComing:'管理頁面將於下一版本提供。'
    }
  };

  const menuItems = [
    { key: 'home', href: homeHref },
    { key: 'vote', href: `${base}/vote/` },
    { key: 'capitalWar', href: `${base}/capital-war/` },
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
      isActive ? 'aria-current="page"' : '',
      (item.key === 'bgb' || item.key === 'seasonUpcoming' || item.key === 'capitalWar' || (item.key === 'seasonArchive' && !SHOW_SEASON_5_MENU)) ? 'hidden' : ''
    ].filter(Boolean).join(' ');
    return `<a ${attrs}></a>`;
  }).join('');

  header.innerHTML = `
    <a href="${homeHref}" class="brand${isAdminContext ? ' admin-context-brand' : ''}">${isAdminContext ? '' : '★ '}<span><b>${isAdminContext ? 'EZPK ADMIN' : '322 EZPK'}</b>${isAdminContext ? '' : '<small>ALLIANCE PORTAL</small>'}</span></a>
    <nav id="nav">
      <div class="desktop-nav-items" id="desktopNavItems">${menuHtml}</div>
      <div class="nav-more" id="navMore" hidden>
        <button id="navMoreButton" type="button" aria-haspopup="true" aria-expanded="false"></button>
        <div id="navMoreMenu" hidden></div>
      </div>
    </nav>
    <div class="header-account" id="desktopAccount" aria-live="polite">
      <span class="account-loading" data-account-label="loading"></span>
    </div>
    ${isAdminContext ? '' : `<div class="lang">
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
    </div>`}
    <button id="menuBtn" class="ezpk-menu-discovery-cue" type="button" aria-label="Menu" aria-expanded="false">☰</button>`;

  document.body.insertAdjacentHTML('beforeend', `
    <aside class="ezpk-mobile-drawer" id="ezpkMobileDrawer" aria-hidden="true">
      <div class="ezpk-mobile-drawer-scroll" id="ezpkMobileDrawerScroll">
        <section class="mobile-account-slot" id="mobileDrawerAccount" aria-live="polite"></section>
        <nav class="mobile-menu-list${isAdminContext ? ' admin-mobile-navigation-host' : ''}" id="mobileDrawerItems">${isAdminContext ? '' : menuHtml}</nav>
      </div>
    </aside>
    <div class="ezpk-auth-modal" id="ezpkLoginModal" hidden>
      <div class="ezpk-auth-backdrop" data-auth-close></div>
      <section class="ezpk-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="ezpkLoginTitle">
        <button class="ezpk-auth-close" type="button" data-auth-close aria-label="Close">×</button>
        <p class="ezpk-auth-eyebrow">EZPK MEMBER</p>
        <h2 id="ezpkLoginTitle"></h2>
        <form id="ezpkLoginForm" novalidate>
          <label>
            <span data-auth-text="loginId"></span>
            <input name="loginId" type="text" minlength="4" maxlength="32"
              autocomplete="username" autocapitalize="none" spellcheck="false" required>
          </label>
          <label>
            <span data-auth-text="password"></span>
            <div class="ezpk-password-field">
              <input name="password" type="password" minlength="8" maxlength="128"
                autocomplete="current-password" required>
              <button type="button" class="ezpk-password-toggle" data-password-toggle></button>
            </div>
          </label>
          <p class="ezpk-auth-error" id="ezpkLoginError" role="alert" hidden></p>
          <button class="ezpk-auth-submit" type="submit"></button>
        </form>
        <div class="ezpk-auth-switch">
          <span data-auth-text="noAccount"></span>
          <a href="${base}/signup/" data-auth-text="signup"></a>
        </div>
      </section>
    </div>
    <div class="ezpk-global-toast" id="ezpkGlobalToast" role="status" aria-live="polite" hidden></div>
  `);

  const META = {
    ko:['🇰🇷','한국어'], en:['🇺🇸','English'], pt:['🇧🇷','Português'], vi:['🇻🇳','Tiếng Việt'],
    ar:['🇸🇦','العربية'], ja:['🇯🇵','日本語'], th:['🇹🇭','ไทย'], 'zh-tw':['🇹🇼','繁體中文']
  };
  const STORAGE_KEY='ezpk-lang-v5';
  const SUPPORTED_LANGS=Object.freeze(['ko','en','pt','vi','ar','ja','th','zh-tw']);
  let authState = { authenticated:false, member:null };
  let authLoaded = false;
  let strategyAccess = { loaded:false, bgbLocked:false, season6Locked:false, capitalWarLocked:true };

  function activeMemberSignedIn() {
    return Boolean(authLoaded && authState.authenticated && authState.member && authState.member.status === 'active');
  }

  function syncMobileMenuDiscoveryCue() {
    const button = header.querySelector('#menuBtn');
    if (!button) return;
    // v248: keep the mobile menu discoverability cue visible for every user.
    // CSS limits the effect to mobile viewports, regardless of login or prior use.
    button.classList.add('ezpk-menu-discovery-cue');
  }

  function applyStrategyMenuVisibility() {
    const memberCanSeeAll = activeMemberSignedIn();
    document.querySelectorAll('[data-menu="bgb"]').forEach(function (link) {
      link.hidden = !strategyAccess.loaded || Boolean(strategyAccess.bgbLocked && !memberCanSeeAll);
    });
    document.querySelectorAll('[data-menu="seasonUpcoming"]').forEach(function (link) {
      link.hidden = !strategyAccess.loaded || Boolean(strategyAccess.season6Locked && !memberCanSeeAll);
    });
    document.querySelectorAll('[data-menu="capitalWar"]').forEach(function (link) {
      link.hidden = !memberCanSeeAll;
    });
    document.querySelectorAll('[data-menu="seasonArchive"]').forEach(function (link) {
      link.hidden = !SHOW_SEASON_5_MENU;
    });
    requestAnimationFrame(updateResponsiveNavigation);
  }

  async function loadStrategyAccess() {
    try {
      const response = await fetch('/api/public/strategy-access?v=' + Date.now(), {
        method:'GET', credentials:'include', headers:{accept:'application/json'}, cache:'no-store'
      });
      const payload = await response.json();
      if (response.ok && payload?.ok) {
        strategyAccess = {
          loaded:true,
          bgbLocked:Boolean(payload.data?.bgbLocked),
          season6Locked:Boolean(payload.data?.season6Locked),
          capitalWarLocked:true
        };
      }
    } catch (_) {
      strategyAccess.loaded = false;
    }
    applyStrategyMenuVisibility();
  }

  function normalizeLanguage(lang) { return SUPPORTED_LANGS.includes(lang) ? lang : 'en'; }
  function currentLanguage() { return normalizeLanguage(localStorage.getItem(STORAGE_KEY) || 'en'); }
  function accountLabels() { return ACCOUNT_LABELS[currentLanguage()] || ACCOUNT_LABELS.en; }

  function renderNavLabels(lang) {
    const labels = NAV_LABELS[lang] || NAV_LABELS.en;
    document.querySelectorAll('[data-nav-key]').forEach(function (link) {
      const key = link.dataset.navKey;
      link.textContent = labels[key] || NAV_LABELS.en[key] || key;
    });
    const moreButton = header.querySelector('#navMoreButton');
    if (moreButton) {
      const moreLabels = {ko:'더보기',en:'MORE',pt:'MAIS',vi:'THÊM',ar:'المزيد',ja:'その他',th:'เพิ่มเติม','zh-tw':'更多'};
      moreButton.textContent = `${moreLabels[lang] || moreLabels.en} ▾`;
    }
    requestAnimationFrame(updateResponsiveNavigation);
  }


  const responsiveNav = header.querySelector('#nav');
  const desktopNavItems = header.querySelector('#desktopNavItems');
  const navMore = header.querySelector('#navMore');
  const navMoreButton = header.querySelector('#navMoreButton');
  const navMoreMenu = header.querySelector('#navMoreMenu');
  const navOrder = new Map(menuItems.map((item,index)=>[item.key,index]));

  function closeMoreMenu() {
    if (!navMoreButton || !navMoreMenu) return;
    navMoreMenu.hidden = true;
    navMoreButton.setAttribute('aria-expanded','false');
  }

  function restoreMoreLinks() {
    if (!desktopNavItems || !navMoreMenu) return;
    [...navMoreMenu.querySelectorAll('a[data-nav-key]')]
      .sort((a,b)=>(navOrder.get(a.dataset.navKey) ?? 999)-(navOrder.get(b.dataset.navKey) ?? 999))
      .forEach(link=>desktopNavItems.appendChild(link));
  }

  function updateResponsiveNavigation() {
    if (!responsiveNav || !desktopNavItems || !navMore || !navMoreMenu) return;
    restoreMoreLinks();
    closeMoreMenu();

    if (window.innerWidth <= 900) {
      navMore.hidden = true;
      return;
    }

    navMore.hidden = false;
    navMore.style.visibility = 'hidden';
    const available = Math.max(0, responsiveNav.clientWidth - navMore.offsetWidth - 8);
    const links = [...desktopNavItems.querySelectorAll('a[data-nav-key]')];

    while (links.length && desktopNavItems.scrollWidth > available) {
      navMoreMenu.prepend(links.pop());
    }

    const hasOverflow = navMoreMenu.children.length > 0;
    navMore.hidden = !hasOverflow;
    navMore.style.visibility = '';
    navMore.classList.toggle('active', Boolean(navMoreMenu.querySelector('.active,[aria-current="page"]')));
  }

  navMoreButton?.addEventListener('click', function(event) {
    event.stopPropagation();
    const willOpen = navMoreMenu.hidden;
    navMoreMenu.hidden = !willOpen;
    navMoreButton.setAttribute('aria-expanded', String(willOpen));
  });
  window.addEventListener('resize', updateResponsiveNavigation);

  function applyLanguage(lang, emit=true) {
    lang=normalizeLanguage(lang);
    renderNavLabels(lang);
    const meta=META[lang];
    const flagElement=header.querySelector('#flag');
    const languageNameElement=header.querySelector('#lname');
    if(flagElement)flagElement.textContent=meta[0];
    if(languageNameElement)languageNameElement.textContent=meta[1];
    document.documentElement.lang=lang==='zh-tw'?'zh-Hant':lang;
    document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    document.body.classList.toggle('rtl',lang==='ar');
    if(!isAdminContext)localStorage.setItem(STORAGE_KEY,lang);
    renderAccount();
    updateAuthModalLabels();
    if (emit) window.dispatchEvent(new CustomEvent('ezpk-language-change',{detail:{lang}}));
  }

  function safeText(value) {
    return String(value ?? '').replace(/[&<>"']/g, function (char) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[char];
    });
  }

  const loginModal = document.querySelector('#ezpkLoginModal');
  const loginForm = document.querySelector('#ezpkLoginForm');
  const loginError = document.querySelector('#ezpkLoginError');
  const globalToast = document.querySelector('#ezpkGlobalToast');

  function showGlobalToast(message, type='success') {
    globalToast.textContent = message;
    globalToast.className = `ezpk-global-toast ${type}`;
    globalToast.hidden = false;
    clearTimeout(showGlobalToast.timer);
    showGlobalToast.timer = setTimeout(function () {
      globalToast.hidden = true;
    }, 3000);
  }

  function updateAuthModalLabels() {
    const labels = accountLabels();
    document.querySelector('#ezpkLoginTitle').textContent = labels.login;
    loginForm.querySelector('.ezpk-auth-submit').textContent = labels.login;
    loginModal.querySelectorAll('[data-auth-text]').forEach(function (element) {
      const key = element.dataset.authText;
      element.textContent = labels[key] || key;
    });
    const toggle = loginForm.querySelector('[data-password-toggle]');
    const password = loginForm.elements.password;
    toggle.textContent = password.type === 'password' ? '◉' : '×';
    toggle.setAttribute('aria-label', password.type === 'password' ? labels.showPassword : labels.hidePassword);
    loginModal.querySelector('[data-auth-close]').setAttribute('aria-label', labels.close);
  }

  function openLogin(event) {
    if (event) event.preventDefault();
    closeMenus();
    updateAuthModalLabels();
    loginError.hidden = true;
    loginError.textContent = '';
    loginModal.hidden = false;
    document.body.classList.add('auth-modal-open');
    setTimeout(function () { loginForm.elements.loginId.focus(); }, 0);
  }

  function closeLogin() {
    loginModal.hidden = true;
    document.body.classList.remove('auth-modal-open');
    loginForm.reset();
    loginForm.elements.password.type = 'password';
    loginError.hidden = true;
    updateAuthModalLabels();
  }

  function goToSignup(event) {
    event.preventDefault();
    window.location.href = `${base}/signup/`;
  }

  function goToAdmin(event) {
    event.preventDefault();
    window.location.href = `${base}/admin/`;
  }

  async function logout(event) {
    event.preventDefault();
    try {
      const response = await fetch('/api/auth/logout', {
        method:'POST',
        credentials:'include',
        cache:'no-store',
        headers:{'content-type':'application/json','accept':'application/json'},
        body:'{}'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      // v263: Only switch the UI to logged-out after the server session is
      // actually gone. This prevents the member page from showing the wrong
      // list when a logout request fails or the cookie has not cleared yet.
      const verifiedState = await fetchVerifiedAuth(3);
      if (verifiedState.authenticated) throw new Error('LOGOUT_NOT_VERIFIED');

      authState = { authenticated:false, member:null };
      authLoaded = true;
      renderAccount();
      closeMenus();
      showGlobalToast(accountLabels().logoutSuccess);
      window.dispatchEvent(new CustomEvent('ezpk-auth-change', { detail:authState }));
    } catch (_) {
      showGlobalToast(accountLabels().requestFailed);
    }
  }

  function accountMarkup(mobile) {
    const labels = accountLabels();
    if (!authLoaded) {
      return `<span class="account-loading">${safeText(labels.loading)}</span>`;
    }

    if (!authState.authenticated || !authState.member) {
      if (mobile) {
        return `
          <div class="mobile-account-actions mobile-account-actions--guest">
            <button type="button" data-account-action="login">${safeText(labels.login)}</button>
            <button type="button" class="mobile-account-signup" data-account-action="signup">${safeText(labels.signup)}</button>
          </div>
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
      ${isAdminContext ? `<button type="button" data-account-action="home">${safeText((NAV_LABELS[isAdminContext ? 'ko' : currentLanguage()] || NAV_LABELS.ko).home)}</button>` : ''}
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
          <span class="account-member-name" title="${safeText(member.nickname)}">${safeText(isAdminContext ? labels.admin : member.nickname)}</span>
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

  function goHome(event) {
    event.preventDefault();
    window.location.href = header.dataset.homeHref || `${base}/`;
  }

  function goToMyPage(event) {
    event.preventDefault();
    window.location.href = `${base}/my/`;
  }

  function bindAccountEvents(container) {
    container.querySelectorAll('[data-account-action]').forEach(function (button) {
      const action = button.dataset.accountAction;
      if (action === 'home') button.addEventListener('click', goHome);
      else if (action === 'logout') button.addEventListener('click', logout);
      else if (action === 'mypage') button.addEventListener('click', goToMyPage);
      else if (action === 'login') button.addEventListener('click', openLogin);
      else if (action === 'signup') button.addEventListener('click', goToSignup);
      else if (action === 'admin') button.addEventListener('click', goToAdmin);
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
    const mobile = document.querySelector('#mobileDrawerAccount');
    desktop.innerHTML = accountMarkup(false);
    mobile.innerHTML = accountMarkup(true);
    bindAccountEvents(desktop);
    bindAccountEvents(mobile);
    applyStrategyMenuVisibility();
    syncMobileMenuDiscoveryCue();
    if (mobileDrawer && mobileDrawer.classList.contains('open')) resetMobileDrawerScroll();
  }

  window.EZPKMemberAuth = {
    getState: function () { return { loaded:authLoaded, authenticated:authState.authenticated, member:authState.member }; },
    openLogin: function () { openLogin(); },
    goToSignup: function () { window.location.href = `${base}/signup/`; },
    isActive: function () { return Boolean(authLoaded && authState.authenticated && authState.member && authState.member.status === 'active'); }
  };

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  async function fetchVerifiedAuth(attempts) {
    const total = Math.max(1, Number(attempts) || 1);
    for (let attempt = 0; attempt < total; attempt += 1) {
      const controller = typeof AbortController === 'function' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(function () { controller.abort(); }, 7000) : null;
      try {
        const response = await fetch('/api/auth/me', {
          method:'GET',
          credentials:'include',
          cache:'no-store',
          headers:{'accept':'application/json'},
          signal:controller ? controller.signal : undefined
        });
        const payload = await response.json().catch(function () { return null; });
        if (response.ok && payload?.ok) {
          if (payload?.data?.authenticated && payload?.data?.member) {
            return { authenticated:true, member:payload.data.member };
          }
          // A login cookie can take a brief moment to become visible to the
          // following /api/auth/me request. Keep retrying when the caller
          // explicitly requested verification attempts; startup still uses
          // one attempt so the header never remains stuck on "확인 중".
          if (attempt === total - 1) {
            return { authenticated:false, member:null };
          }
        }
      } catch (_) {
        // Never leave the account area stuck on "확인 중".
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
      if (attempt < total - 1) await wait(250 * (attempt + 1));
    }
    return { authenticated:false, member:null };
  }

  let authLoadPromise = null;
  async function loadAuth() {
    if (authLoadPromise) return authLoadPromise;
    authLoadPromise = (async function () {
      try {
        authState = await fetchVerifiedAuth(1);
      } finally {
        authLoaded = true;
        try {
          renderAccount();
        } catch (renderError) {
          console.error('[EZPK Header] account render failed', renderError);
          const desktop = header.querySelector('#desktopAccount');
          const mobile = document.querySelector('#mobileDrawerAccount');
          if (desktop) desktop.innerHTML = '<button type="button" class="account-button account-login" data-account-action="login">로그인</button>';
          if (mobile) mobile.innerHTML = '<div class="mobile-account-actions mobile-account-actions--guest"><button type="button" data-account-action="login">로그인</button></div><div class="mobile-account-divider"></div>';
          if (desktop) bindAccountEvents(desktop);
          if (mobile) bindAccountEvents(mobile);
        }
        window.dispatchEvent(new CustomEvent('ezpk-auth-ready', { detail:authState }));
        authLoadPromise = null;
      }
      return authState;
    })();
    return authLoadPromise;
  }

  // v290: Start authentication before optional navigation/language bindings.
  // The administrator account area must not remain on "확인 중" when a
  // later, non-authentication UI initializer fails.
  loadAuth();

  function closeMenus() {
    const langMenu = header.querySelector('#langMenu');
    const nav = header.querySelector('#nav');
    const drawer = document.querySelector('#ezpkMobileDrawer');
    const menuBtn = header.querySelector('#menuBtn');
    if (langMenu) langMenu.hidden = true;
    if (nav) nav.classList.remove('open');
    if (drawer) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden','true');
    }
    document.body.classList.remove('ezpk-mobile-menu-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded','false');
    header.querySelectorAll('.account-menu').forEach(function (menu) { menu.hidden = true; });
    header.querySelectorAll('.account-member-trigger').forEach(function (button) { button.setAttribute('aria-expanded','false'); });
  }

  loginModal.querySelectorAll('[data-auth-close]').forEach(function (element) {
    element.addEventListener('click', closeLogin);
  });

  loginForm.querySelector('[data-password-toggle]').addEventListener('click', function () {
    const password = loginForm.elements.password;
    password.type = password.type === 'password' ? 'text' : 'password';
    updateAuthModalLabels();
  });

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const submit = loginForm.querySelector('.ezpk-auth-submit');
    loginError.hidden = true;
    submit.disabled = true;

    try {
      const response = await fetch('/api/auth/login', {
        method:'POST',
        credentials:'include',
        headers:{'content-type':'application/json','accept':'application/json'},
        body:JSON.stringify({
          loginId:loginForm.elements.loginId.value,
          password:loginForm.elements.password.value
        })
      });

      let payload = null;
      try { payload = await response.json(); } catch (_) {}

      if (!response.ok || !payload?.ok) {
        const code = payload?.code || 'REQUEST_FAILED';
        const labels = accountLabels();
        const message = code === 'ACCOUNT_SUSPENDED'
          ? labels.suspended
          : code === 'ACCOUNT_LEFT'
            ? labels.left
            : code === 'INVALID_LOGIN'
              ? labels.invalidLogin
              : labels.requestFailed;
        loginError.textContent = message;
        loginError.hidden = false;
        return;
      }

      // v254: A successful password response is not enough. Confirm that the
      // browser actually stored and returned the secure session cookie before
      // presenting the user as logged in. A short retry covers propagation
      // delays on mobile and translated DOM environments.
      const verifiedState = await fetchVerifiedAuth(3);
      const expectedLoginId = String(payload?.data?.member?.loginId || '').trim().toLowerCase();
      const verifiedLoginId = String(verifiedState?.member?.loginId || '').trim().toLowerCase();
      if (!verifiedState.authenticated || !verifiedState.member
        || (expectedLoginId && verifiedLoginId !== expectedLoginId)) {
        authState = { authenticated:false, member:null };
        authLoaded = true;
        renderAccount();
        loginError.textContent = accountLabels().sessionNotSaved || accountLabels().sessionExpired;
        loginError.hidden = false;
        return;
      }

      authState = verifiedState;
      authLoaded = true;
      renderAccount();
      closeLogin();
      showGlobalToast(accountLabels().loginSuccess);
      window.dispatchEvent(new CustomEvent('ezpk-auth-change', { detail:authState }));
    } catch (_) {
      loginError.textContent = accountLabels().requestFailed;
      loginError.hidden = false;
    } finally {
      submit.disabled = false;
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !loginModal.hidden) closeLogin();
  });

  window.addEventListener('ezpk-open-login', openLogin);

  document.addEventListener('click', function (event) {
    if (navMore && !navMore.contains(event.target)) closeMoreMenu();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMoreMenu();
  });
  requestAnimationFrame(updateResponsiveNavigation);

  const mobileDrawer = document.querySelector('#ezpkMobileDrawer');
  const mobileDrawerScroll = document.querySelector('#ezpkMobileDrawerScroll');

  function syncMobileDrawerMetrics() {
    if (window.innerWidth > 900) return;
    const rect = header.getBoundingClientRect();
    const headerBottom = Math.max(0, Math.round(rect.bottom));
    document.documentElement.style.setProperty('--ezpk-mobile-header-height', `${headerBottom}px`);
  }

  function resetMobileDrawerScroll() {
    if (!mobileDrawerScroll) return;
    mobileDrawerScroll.scrollTop = 0;
    requestAnimationFrame(function () {
      mobileDrawerScroll.scrollTop = 0;
      requestAnimationFrame(function () { mobileDrawerScroll.scrollTop = 0; });
    });
  }

  function setMobileMenuOpen(open) {
    const next = Boolean(open);
    document.body.classList.toggle('ezpk-mobile-menu-open', next);
    if (!mobileDrawer) return;
    mobileDrawer.classList.toggle('open', next);
    mobileDrawer.setAttribute('aria-hidden', String(!next));
    if (next) {
      syncMobileDrawerMetrics();
      resetMobileDrawerScroll();
    }
  }

  syncMobileDrawerMetrics();
  window.addEventListener('resize', syncMobileDrawerMetrics, { passive:true });
  window.addEventListener('orientationchange', function () {
    requestAnimationFrame(syncMobileDrawerMetrics);
  });

  const initialLang = isAdminContext ? 'ko' : currentLanguage();
  applyLanguage(initialLang,false);

  const langBtn=header.querySelector('#langBtn');
  const langMenu=header.querySelector('#langMenu');
  if(langBtn&&langMenu){
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
  }

  const menuBtn=header.querySelector('#menuBtn');
  const nav=header.querySelector('#nav');
  menuBtn.addEventListener('click',function(e){
    e.stopPropagation();
    const willOpen = !mobileDrawer.classList.contains('open');
    closeMenus();
    setMobileMenuOpen(willOpen);
    menuBtn.setAttribute('aria-expanded',String(willOpen));
  });
  mobileDrawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setMobileMenuOpen(false);
      menuBtn.setAttribute('aria-expanded','false');
    });
  });

  document.addEventListener('click',function(e){
    if (!header.contains(e.target) && !mobileDrawer.contains(e.target)) closeMenus();
    else {
      const languageArea=header.querySelector('.lang');
      if(languageArea&&langMenu&&langBtn&&!languageArea.contains(e.target)){
        langMenu.hidden=true;
        langBtn.setAttribute('aria-expanded','false');
      }
    }
  });
  window.addEventListener('storage',function(e){if(e.key===STORAGE_KEY)applyLanguage(e.newValue,false)});

  window.EZPKLanguage={key:STORAGE_KEY,supported:SUPPORTED_LANGS,normalize:normalizeLanguage,get:currentLanguage,set:(lang)=>applyLanguage(lang,true)};
  window.EZPKSharedHeader = {
    renderNavLabels,
    applyLanguage,
    refreshAuth:loadAuth,
    openLogin:openLogin,
    getAuthState:function () { return authState; }
  };

  loadStrategyAccess();
  window.addEventListener('ezpk-auth-refresh', loadAuth);
})();
