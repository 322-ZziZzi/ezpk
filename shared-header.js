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
  const publicHosts = new Set(['ezpk322.com','ezpk1.ezpk322.com','ezpk2.ezpk322.com']);
  const isCanonicalHost = publicHosts.has(currentHost);
  const isWwwHost = currentHost === 'www.ezpk322.com';
  const needsHttps = (isCanonicalHost || isWwwHost) && window.location.protocol !== 'https:';
  if (isTranslationProxy || isWwwHost || needsHttps) {
    const canonical = new URL(window.location.href);
    canonical.protocol = 'https:';
    canonical.hostname = (isTranslationProxy || isWwwHost) ? 'ezpk322.com' : currentHost;
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
    if (publicHosts.has(target.hostname)) {
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
    style.textContent = '#ezpkInAppGuide{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:20px;background:var(--ezpk-overlay-bg,rgba(4,8,16,.82));backdrop-filter:blur(8px)}.ezpk-inapp-card{width:min(440px,100%);box-sizing:border-box;padding:26px 22px 20px;border:1px solid var(--ezpk-accent-border,rgba(212,175,55,.55));border-radius:18px;background:var(--ezpk-surface,#101722);color:var(--ezpk-text-primary,#f7f4ea);box-shadow:var(--ezpk-shadow-lg,0 24px 70px rgba(0,0,0,.48));text-align:center}.ezpk-inapp-icon{width:48px;height:48px;margin:0 auto 12px;display:grid;place-items:center;border-radius:50%;background:rgba(212,175,55,.13);color:#e8c85a;font-size:25px}.ezpk-inapp-card h2{margin:0 0 10px;font-size:21px}.ezpk-inapp-card p{margin:7px 0;line-height:1.55}.ezpk-inapp-lead{color:var(--ezpk-text-primary,#fff)}.ezpk-inapp-steps{color:var(--ezpk-text-secondary,#c7ced9);font-size:14px}.ezpk-inapp-url{margin:15px 0;padding:10px 12px;border-radius:10px;background:var(--ezpk-input-bg,#080d14);color:var(--ezpk-text-secondary,#d8dee8);font-size:12px;word-break:break-all;text-align:left}.ezpk-inapp-actions{display:grid;gap:9px}.ezpk-inapp-actions button{min-height:45px;border:0;border-radius:10px;font-weight:800;cursor:pointer}.ezpk-inapp-actions [data-inapp-open]{background:#d7b84a;color:#111}.ezpk-inapp-actions [data-inapp-copy]{background:var(--ezpk-secondary-bg,#273346);color:var(--ezpk-secondary-text,#fff)}.ezpk-inapp-actions .ezpk-inapp-continue{background:transparent;color:var(--ezpk-text-secondary,#aeb7c5);border:1px solid var(--ezpk-border-strong,#344156)}.ezpk-inapp-status{min-height:20px;color:#e8c85a;font-size:13px}';
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
  const allianceSiteId = currentHost === 'ezpk2.ezpk322.com' ? 'ezpk2' : 'ezpk1';
  const allianceDisplayName = allianceSiteId === 'ezpk2' ? 'EZPK2' : 'EZPK1';

  const base = header.dataset.base || '.';
  const homeHref = header.dataset.homeHref || `${base}/`;
  const activeMenu = header.dataset.activeMenu || '';
  const SHOW_SEASON_5_MENU = false; // v239: preserve Season 5 page/data, hide menu for all users

  const NAV_LABELS = {
    ko: { home:'홈', immigration:'이민 신청', vote:'투표', capitalWar:'수도전', seasonUpcoming:'시즌 6', seasonArchive:'시즌 5 (종료)', members:'멤버', bgb:'BGB', tip:'팁', request:'요청 게시판', allianceLayout:'연맹 배치도', accounts:'계정 마켓', game:'미니게임', logo:'로고' },
    en: { home:'HOME', immigration:'MIGRATION', vote:'VOTE', capitalWar:'CAPITAL WAR', seasonUpcoming:'SEASON 6', seasonArchive:'SEASON 5 (ENDED)', members:'MEMBERS', bgb:'BGB', tip:'TIPS', request:'REQUEST BOARD', allianceLayout:'ALLIANCE LAYOUT', accounts:'ACCOUNT MARKET', game:'MINI GAMES', logo:'LOGO' },
    pt: { home:'INÍCIO', immigration:'MIGRAÇÃO', vote:'VOTAÇÃO', capitalWar:'GUERRA DA CAPITAL', seasonUpcoming:'TEMPORADA 6', seasonArchive:'TEMPORADA 5 (ENCERRADA)', members:'MEMBROS', bgb:'BGB', tip:'DICAS', request:'SOLICITAÇÕES', allianceLayout:'MAPA DA ALIANÇA', accounts:'MERCADO DE CONTAS', game:'MINIJOGOS', logo:'LOGO' },
    vi: { home:'TRANG CHỦ', immigration:'ĐĂNG KÝ DI CƯ', vote:'BÌNH CHỌN', capitalWar:'CHIẾN TRANH THỦ ĐÔ', seasonUpcoming:'MÙA 6', seasonArchive:'MÙA 5 (ĐÃ KẾT THÚC)', members:'THÀNH VIÊN', bgb:'BGB', tip:'MẸO', request:'BẢNG YÊU CẦU', allianceLayout:'SƠ ĐỒ LIÊN MINH', accounts:'CHỢ TÀI KHOẢN', game:'TRÒ CHƠI NHỎ', logo:'LOGO' },
    ar: { home:'الرئيسية', immigration:'طلب الهجرة', vote:'التصويت', capitalWar:'حرب العاصمة', seasonUpcoming:'الموسم 6', seasonArchive:'الموسم 5 (انتهى)', members:'الأعضاء', bgb:'BGB', tip:'نصائح', request:'لوحة الطلبات', allianceLayout:'مخطط التحالف', accounts:'سوق الحسابات', game:'الألعاب المصغرة', logo:'الشعار' },
    ja: { home:'ホーム', immigration:'移民申請', vote:'投票', capitalWar:'首都戦', seasonUpcoming:'シーズン6', seasonArchive:'シーズン5（終了）', members:'メンバー', bgb:'BGB', tip:'ヒント', request:'リクエスト掲示板', allianceLayout:'同盟配置図', accounts:'アカウントマーケット', game:'ミニゲーム', logo:'ロゴ' },
    th: { home:'หน้าแรก', immigration:'สมัครย้ายเซิร์ฟเวอร์', vote:'โหวต', capitalWar:'สงครามเมืองหลวง', seasonUpcoming:'ซีซัน 6', seasonArchive:'ซีซัน 5 (สิ้นสุดแล้ว)', members:'สมาชิก', bgb:'BGB', tip:'เคล็ดลับ', request:'กระดานคำขอ', allianceLayout:'ผังพันธมิตร', accounts:'ตลาดบัญชี', game:'มินิเกม', logo:'โลโก้' },
    'zh-tw': { home:'首頁', immigration:'移民申請', vote:'投票', capitalWar:'首都戰', seasonUpcoming:'第 6 賽季', seasonArchive:'第 5 賽季（已結束）', members:'成員名單', bgb:'BGB', tip:'攻略', request:'留言板', allianceLayout:'聯盟配置圖', accounts:'帳號市集', game:'小遊戲', logo:'標誌' }
  };

  const MENU_UI = {
    ko:{more:'더보기',public:'공개',memberOnly:'연맹원 전용',activity:'연맹 활동',information:'정보·지원',other:'기타',comingSoon:'준비 중',locked:'로그인 필요',menu:'메뉴',closeMenu:'메뉴 닫기'},
    en:{more:'MORE',public:'PUBLIC',memberOnly:'MEMBERS ONLY',activity:'ALLIANCE ACTIVITY',information:'INFO & SUPPORT',other:'OTHER',comingSoon:'COMING SOON',locked:'LOGIN REQUIRED',menu:'MENU',closeMenu:'CLOSE MENU'},
    pt:{more:'MAIS',public:'PÚBLICO',memberOnly:'SÓ MEMBROS',activity:'ATIVIDADE DA ALIANÇA',information:'INFORMAÇÕES E SUPORTE',other:'OUTROS',comingSoon:'EM BREVE',locked:'LOGIN NECESSÁRIO',menu:'MENU',closeMenu:'FECHAR MENU'},
    vi:{more:'THÊM',public:'CÔNG KHAI',memberOnly:'CHỈ THÀNH VIÊN',activity:'HOẠT ĐỘNG LIÊN MINH',information:'THÔNG TIN & HỖ TRỢ',other:'KHÁC',comingSoon:'SẮP RA MẮT',locked:'CẦN ĐĂNG NHẬP',menu:'MENU',closeMenu:'ĐÓNG MENU'},
    ar:{more:'المزيد',public:'عام',memberOnly:'للأعضاء فقط',activity:'نشاط التحالف',information:'المعلومات والدعم',other:'أخرى',comingSoon:'قريبًا',locked:'يتطلب تسجيل الدخول',menu:'القائمة',closeMenu:'إغلاق القائمة'},
    ja:{more:'その他',public:'公開',memberOnly:'メンバー限定',activity:'同盟活動',information:'情報・サポート',other:'その他',comingSoon:'準備中',locked:'ログインが必要',menu:'メニュー',closeMenu:'メニューを閉じる'},
    th:{more:'เพิ่มเติม',public:'สาธารณะ',memberOnly:'เฉพาะสมาชิก',activity:'กิจกรรมพันธมิตร',information:'ข้อมูลและการสนับสนุน',other:'อื่น ๆ',comingSoon:'เร็ว ๆ นี้',locked:'ต้องเข้าสู่ระบบ',menu:'เมนู',closeMenu:'ปิดเมนู'},
    'zh-tw':{more:'更多',public:'公開',memberOnly:'成員專用',activity:'聯盟活動',information:'資訊與支援',other:'其他',comingSoon:'準備中',locked:'需要登入',menu:'選單',closeMenu:'關閉選單'}
  };

  const ALLIANCE_SELECT_LABELS={ko:'연맹 선택',en:'ALLIANCE SELECT',pt:'ESCOLHER ALIANÇA',vi:'CHỌN LIÊN MINH',ar:'اختيار التحالف',ja:'同盟選択',th:'เลือกพันธมิตร','zh-tw':'選擇聯盟'};

  const ACCOUNT_LABELS = {
    ko: {
      login:'로그인', signup:'회원가입', account:'계정', myAccount:'내 계정', member:'멤버',
      administrator:'관리자', admin:'관리자', myPage:'마이페이지', logout:'로그아웃',
      loading:'확인 중', loginId:'아이디', password:'비밀번호', loginSubtitle:'연맹원 계정으로 로그인하세요.',
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
      login:'LOGIN', signup:'SIGN UP', account:'ACCOUNT', myAccount:'MY ACCOUNT', member:'MEMBER',
      administrator:'ADMINISTRATOR', admin:'ADMIN', myPage:'MY PAGE', logout:'LOGOUT',
      loading:'CHECKING', loginId:'Login ID', password:'Password', loginSubtitle:'Sign in with your alliance member account.',
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
      login:'ENTRAR', signup:'CADASTRAR', account:'CONTA', myAccount:'MINHA CONTA', member:'MEMBRO',
      administrator:'ADMINISTRADOR', admin:'ADMIN', myPage:'MINHA PÁGINA', logout:'SAIR',
      loading:'VERIFICANDO', loginId:'ID de login', password:'Senha', loginSubtitle:'Entre com sua conta de membro da aliança.',
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
      login:'ĐĂNG NHẬP', signup:'ĐĂNG KÝ', account:'TÀI KHOẢN', myAccount:'TÀI KHOẢN CỦA TÔI', member:'THÀNH VIÊN',
      administrator:'QUẢN TRỊ VIÊN', admin:'QUẢN TRỊ', myPage:'TRANG CỦA TÔI', logout:'ĐĂNG XUẤT',
      loading:'ĐANG KIỂM TRA', loginId:'ID đăng nhập', password:'Mật khẩu', loginSubtitle:'Đăng nhập bằng tài khoản thành viên liên minh.',
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
      login:'تسجيل الدخول', signup:'إنشاء حساب', account:'الحساب', myAccount:'حسابي', member:'عضو',
      administrator:'مسؤول', admin:'الإدارة', myPage:'صفحتي', logout:'تسجيل الخروج',
      loading:'جارٍ التحقق', loginId:'معرّف الدخول', password:'كلمة المرور', loginSubtitle:'سجّل الدخول بحساب عضو التحالف.',
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
      loading:'確認中', loginId:'ログインID', password:'パスワード', loginSubtitle:'同盟メンバーアカウントでログインしてください。',
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
      login:'เข้าสู่ระบบ', signup:'สมัครสมาชิก', account:'บัญชี', myAccount:'บัญชีของฉัน', member:'สมาชิก',
      administrator:'ผู้ดูแลระบบ', admin:'ผู้ดูแล', myPage:'หน้าของฉัน', logout:'ออกจากระบบ',
      loading:'กำลังตรวจสอบ', loginId:'ไอดีเข้าสู่ระบบ', password:'รหัสผ่าน', loginSubtitle:'เข้าสู่ระบบด้วยบัญชีสมาชิกพันธมิตร',
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
      login:'登入', signup:'註冊', account:'帳號', myAccount:'我的帳號', member:'成員',
      administrator:'管理員', admin:'管理', myPage:'我的頁面', logout:'登出',
      loading:'確認中', loginId:'登入 ID', password:'密碼', loginSubtitle:'使用聯盟成員帳號登入。',
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

  const immigrationHref = `${base}/migration/`;
  const menuItems = [
    { key:'immigration', href:immigrationHref },
    { key:'seasonUpcoming', href:`${base}/season6/` },
    { key:'members', href:`${base}/members/` },
    { key:'tip', href:`${base}/tip/` },
    { key:'game', href:`${base}/game/` },
    { key:'accounts', href:`${base}/accounts/` },
    { key:'bgb', href:`${base}/bgb/` },
    { key:'capitalWar', href:`${base}/capital-war/` },
    { key:'vote', href:`${base}/vote/` },
    { key:'request', href:`${base}/request/` },
    { key:'allianceLayout', href:`${base}/alliance-layout/` },
    { key:'logo', href:`${base}/logo/` }
  ];
  const menuByKey = new Map(menuItems.map(item => [item.key,item]));

  header.innerHTML = `
    <a href="${homeHref}" class="brand${isAdminContext ? ' admin-context-brand' : ''}">${isAdminContext ? '' : '<span class="brand-mark" aria-hidden="true">★</span>'}<span><b>${isAdminContext ? `${allianceDisplayName} ADMIN` : `322 ${allianceDisplayName}`}</b>${isAdminContext ? '' : '<small>ALLIANCE PORTAL</small>'}</span></a>
    <nav id="nav">
      <div class="desktop-nav-items" id="desktopNavItems"></div>
      <div class="nav-more" id="navMore" hidden>
        <button id="navMoreButton" type="button" aria-haspopup="true" aria-expanded="false"></button>
        <div id="navMoreMenu" hidden></div>
      </div>
    </nav>
    <a id="allianceSelectorLink" class="alliance-selector-link" href="https://ezpk322.com/?select=1" hidden></a>
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
    <aside class="ezpk-mobile-drawer" id="ezpkMobileDrawer" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="ezpk-mobile-drawer-scroll" id="ezpkMobileDrawerScroll">
        <section class="mobile-account-slot" id="mobileDrawerAccount" aria-live="polite"></section>
        <nav class="mobile-menu-list${isAdminContext ? ' admin-mobile-navigation-host' : ''}" id="mobileDrawerItems"></nav>
      </div>
    </aside>
    <div class="ezpk-auth-modal" id="ezpkLoginModal" hidden>
      <div class="ezpk-auth-backdrop" data-auth-close></div>
      <section class="ezpk-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="ezpkLoginTitle" aria-describedby="ezpkLoginSubtitle">
        <button class="ezpk-auth-close" type="button" data-auth-close aria-label="Close">×</button>
        <h2 id="ezpkLoginTitle"></h2>
        <p class="ezpk-auth-subtitle" id="ezpkLoginSubtitle" data-auth-text="loginSubtitle"></p>
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
        ${isAdminContext ? '' : `<div class="ezpk-auth-switch">
          <span data-auth-text="noAccount"></span>
          <a href="${base}/signup/" data-auth-text="signup"></a>
        </div>`}
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
  let strategyAccess = { loaded:false, resolved:false, bgbLocked:false, season6Locked:false, capitalWarLocked:true };

  function activeMemberSignedIn() {
    return Boolean(authLoaded && authState.authenticated && authState.member && authState.member.status === 'active');
  }

  function migrationIntakeAvailable() {
    if (siteContext && typeof siteContext.migrationIntakeEnabled === 'boolean') return siteContext.migrationIntakeEnabled;
    return allianceSiteId !== 'ezpk2';
  }

  function syncMobileMenuDiscoveryCue() {
    const button = header.querySelector('#menuBtn');
    if (!button) return;
    // v248: keep the mobile menu discoverability cue visible for every user.
    // CSS limits the effect to mobile viewports, regardless of login or prior use.
    button.classList.add('ezpk-menu-discovery-cue');
  }

  function applyStrategyMenuVisibility() {
    renderNavigation(currentLanguage());
    requestAnimationFrame(updateResponsiveNavigation);
  }

  async function loadStrategyAccess() {
    let nextAccess = {
      loaded:false,
      resolved:true,
      bgbLocked:true,
      season6Locked:true,
      capitalWarLocked:true
    };
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timeoutId = setTimeout(function () {
      if (controller) controller.abort();
    }, 2500);
    try {
      const response = await fetch('/api/public/strategy-access?v=' + Date.now(), {
        method:'GET', credentials:'include', headers:{accept:'application/json'}, cache:'no-store',
        ...(controller ? { signal:controller.signal } : {})
      });
      const payload = await response.json();
      if (response.ok && payload?.ok) {
        nextAccess = {
          loaded:true,
          resolved:true,
          bgbLocked:Boolean(payload.data?.bgbLocked),
          season6Locked:Boolean(payload.data?.season6Locked),
          capitalWarLocked:true
        };
      }
    } catch (_) {
      // The conservative locked fallback above is rendered once after timeout.
    } finally {
      clearTimeout(timeoutId);
    }
    strategyAccess = nextAccess;
    applyStrategyMenuVisibility();
  }

  function normalizeLanguage(lang) { return SUPPORTED_LANGS.includes(lang) ? lang : 'en'; }
  function currentLanguage() { return normalizeLanguage(localStorage.getItem(STORAGE_KEY) || 'en'); }
  function accountLabels() { return ACCOUNT_LABELS[currentLanguage()] || ACCOUNT_LABELS.en; }

  function renderNavLabels(lang) {
    renderNavigation(lang);
  }


  const responsiveNav = header.querySelector('#nav');
  const desktopNavItems = header.querySelector('#desktopNavItems');
  const navMore = header.querySelector('#navMore');
  const navMoreButton = header.querySelector('#navMoreButton');
  const navMoreMenu = header.querySelector('#navMoreMenu');
  let navigationReady = false;
  const mobileDrawerItems = document.querySelector('#mobileDrawerItems');

  function menuUi(lang=currentLanguage()) { return MENU_UI[lang] || MENU_UI.en; }

  function syncAllianceSelectorControls() {
    const enabled = siteContext?.mode === 'DUAL';
    const label = ALLIANCE_SELECT_LABELS[currentLanguage()] || ALLIANCE_SELECT_LABELS.en;
    const desktopLink = header.querySelector('#allianceSelectorLink');
    if (desktopLink) { desktopLink.hidden = !enabled; desktopLink.textContent = label; }
    if (!mobileDrawerItems) return;
    mobileDrawerItems.querySelector('[data-mobile-alliance-selector]')?.remove();
    if (!enabled) return;
    mobileDrawerItems.insertAdjacentHTML('afterbegin', `<section class="nav-menu-group mobile-alliance-selector-group" data-mobile-alliance-selector><div class="nav-menu-group-items"><a href="https://ezpk322.com/?select=1" class="mobile-alliance-selector-link"><span class="nav-label">${safeText(label)}</span></a></div></section>`);
  }

  function navLinkMarkup(key, options={}) {
    const item = menuByKey.get(key);
    if (!item) return '';
    const labels = NAV_LABELS[currentLanguage()] || NAV_LABELS.en;
    const ui = menuUi();
    const active = key === activeMenu;
    const locked = Boolean(options.locked);
    const classes = [active?'active':'',locked?'is-locked':'',key==='immigration'?'nav-immigration':''].filter(Boolean).join(' ');
    const badge = key === 'seasonUpcoming' && options.comingSoon
      ? `<span class="nav-status-badge">${safeText(ui.comingSoon)}</span>` : '';
    const lock = locked ? `<span class="nav-lock" aria-hidden="true">🔒</span>` : '';
    return `<a href="${item.href}" data-menu="${key}" data-nav-key="${key}"${locked?' data-nav-locked="true"':''}${classes?` class="${classes}"`:''}${active?' aria-current="page"':''}><span class="nav-label">${safeText(labels[key] || key)}</span>${badge}${lock}</a>`;
  }

  function menuGroupMarkup(title, keys, options={}) {
    const links = keys.map(key=>navLinkMarkup(key, options[key] || {})).join('');
    return `<section class="nav-menu-group${options.className?` ${options.className}`:''}"><h2>${safeText(title)}</h2><div class="nav-menu-group-items">${links}</div></section>`;
  }

  function renderNavigation(lang=currentLanguage()) {
    if (isAdminContext) {
      navigationReady = false;
      if (navMore) navMore.hidden = true;
      return;
    }
    // v331: never paint the guest menu while an existing session is still
    // being verified. This prevents Immigration from flashing after a signed-in
    // member follows Vote or another protected navigation link.
    if (!authLoaded) {
      navigationReady = false;
      desktopNavItems.innerHTML = '';
      navMoreMenu.innerHTML = '';
      mobileDrawerItems.innerHTML = '';
      navMore.hidden = true;
      return;
    }
    const ui = menuUi(lang);
    const signedIn = activeMemberSignedIn();

    // v335: A guest navigation must be painted only once, after both auth and
    // Season 6 access are known. Rendering the other links first and inserting
    // Season 6 later caused the desktop and mobile menu order to visibly shift.
    if (!signedIn && !strategyAccess.resolved) {
      navigationReady = false;
      desktopNavItems.innerHTML = '';
      navMoreMenu.innerHTML = '';
      mobileDrawerItems.innerHTML = '';
      navMore.hidden = true;
      return;
    }

    const seasonLockedForGuest = !signedIn && strategyAccess.season6Locked;

    if (signedIn) {
      desktopNavItems.innerHTML = ['vote','bgb','capitalWar','members'].map(key=>navLinkMarkup(key)).join('');
      navMoreMenu.innerHTML = [
        menuGroupMarkup(ui.information,['seasonUpcoming','tip','request','allianceLayout'],{seasonUpcoming:{comingSoon:true}}),
        menuGroupMarkup(ui.other,['accounts','game','logo'])
      ].join('');
      mobileDrawerItems.innerHTML = [
        menuGroupMarkup(ui.activity,['vote','bgb','capitalWar','allianceLayout'],{className:'nav-activity-grid'}),
        menuGroupMarkup(ui.information,['seasonUpcoming','members','tip','request'],{seasonUpcoming:{comingSoon:true}}),
        menuGroupMarkup(ui.other,['accounts','game','logo'])
      ].join('');
    } else {
      const authenticatedAccount = Boolean(authState.authenticated);
      const migrationKeys = !authenticatedAccount && migrationIntakeAvailable() ? ['immigration'] : [];
      const guestPrimaryKeys = authenticatedAccount ? ['seasonUpcoming','members','tip'] : [...migrationKeys,'seasonUpcoming','members','tip'];
      const guestMobileKeys = authenticatedAccount ? ['seasonUpcoming','members','tip','game','accounts'] : [...migrationKeys,'seasonUpcoming','members','tip','game','accounts'];
      desktopNavItems.innerHTML = guestPrimaryKeys.map(key=>navLinkMarkup(key,{locked:key==='seasonUpcoming'&&seasonLockedForGuest,comingSoon:key==='seasonUpcoming'})).join('');
      navMoreMenu.innerHTML = [
        menuGroupMarkup(ui.public,['game','accounts']),
        menuGroupMarkup(ui.memberOnly,['allianceLayout','bgb','capitalWar','vote','request','logo'],{
          allianceLayout:{locked:true},bgb:{locked:true},capitalWar:{locked:true},vote:{locked:true},request:{locked:true},logo:{locked:true}
        })
      ].join('');
      mobileDrawerItems.innerHTML = [
        menuGroupMarkup('', guestMobileKeys,{
          seasonUpcoming:{locked:seasonLockedForGuest,comingSoon:true}
        }),
        menuGroupMarkup(ui.memberOnly,['allianceLayout','bgb','capitalWar','vote','request','logo'],{
          allianceLayout:{locked:true},bgb:{locked:true},capitalWar:{locked:true},vote:{locked:true},request:{locked:true},logo:{locked:true}
        })
      ].join('');
    }
    syncAllianceSelectorControls();
    navigationReady = true;
    navMore.hidden = window.innerWidth <= 1199;
    navMoreButton.textContent = `${ui.more} ▾`;
    navMore.classList.toggle('active',Boolean(navMoreMenu.querySelector('.active')));

    const mobileAccount = document.querySelector('#mobileDrawerAccount');
    const drawerScroll = document.querySelector('#ezpkMobileDrawerScroll');
    if (mobileAccount && drawerScroll && mobileDrawerItems) {
      if (signedIn) drawerScroll.insertBefore(mobileAccount,mobileDrawerItems);
      else drawerScroll.appendChild(mobileAccount);
    }
  }

  function closeMoreMenu() {
    if (!navMoreButton || !navMoreMenu) return;
    navMoreMenu.hidden = true;
    navMoreButton.setAttribute('aria-expanded','false');
  }

  function updateResponsiveNavigation() {
    if (!responsiveNav || !navMore) return;
    navMore.hidden = Boolean(isAdminContext || !navigationReady || window.innerWidth <= 1199);
  }

  navMoreButton?.addEventListener('click', function(event) {
    event.stopPropagation();
    const willOpen = navMoreMenu.hidden;
    navMoreMenu.hidden = !willOpen;
    navMoreButton.setAttribute('aria-expanded', String(willOpen));
  });
  window.addEventListener('resize', updateResponsiveNavigation);

  let siteContext={ migrationIntakeEnabled: allianceSiteId !== 'ezpk2' };
  async function loadSiteContext(){
    try{const response=await fetch('/api/site-context',{credentials:'include',cache:'no-store',headers:{accept:'application/json'}});const payload=await response.json();if(response.ok&&payload?.ok)siteContext=payload.data||siteContext;}catch(_){}
    syncAllianceSelectorControls();
    renderNavigation(currentLanguage());
    requestAnimationFrame(updateResponsiveNavigation);
  }

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
    syncAllianceSelectorControls();
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
  let pendingNavigation = '';
  let loginIntentAfterAuth = false;

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
    document.querySelector('#ezpkLoginTitle').textContent = isAdminContext ? '관리자 로그인' : labels.login;
    document.querySelector('#ezpkLoginSubtitle').textContent = isAdminContext
      ? '활성화된 R5 관리자 계정으로 로그인하세요.'
      : labels.loginSubtitle;
    loginForm.querySelector('.ezpk-auth-submit').textContent = labels.login;
    loginModal.querySelectorAll('[data-auth-text]').forEach(function (element) {
      const key = element.dataset.authText;
      if (isAdminContext && key === 'loginSubtitle') return;
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
    // v339: never paint the login dialog before the existing session has been
    // resolved. Active members bypass the dialog and continue directly.
    if (!authLoaded) {
      loginIntentAfterAuth = true;
      return;
    }
    if (activeMemberSignedIn()) {
      loginIntentAfterAuth = false;
      const returnTarget = pendingNavigation || sessionStorage.getItem('ezpk-auth-return') || '';
      pendingNavigation = '';
      sessionStorage.removeItem('ezpk-auth-return');
      if (returnTarget && returnTarget !== window.location.href) window.location.href = returnTarget;
      return;
    }
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
      window.location.href = 'https://ezpk322.com/';
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
            <button type="button" class="account-action-home${activeMenu==='home'?' is-current':''}" data-account-action="home">${safeText((NAV_LABELS[currentLanguage()] || NAV_LABELS.en).home)}</button>
            <button type="button" data-account-action="login">${safeText(labels.login)}</button>
            <button type="button" class="mobile-account-signup" data-account-action="signup">${safeText(labels.signup)}</button>
          </div>
          <div class="mobile-account-divider"></div>`;
      }
      return `
        <button type="button" class="account-button account-home${activeMenu==='home'?' is-current':''}" data-account-action="home">${safeText((NAV_LABELS[currentLanguage()] || NAV_LABELS.en).home)}</button>
        <button type="button" class="account-button account-login" data-account-action="login">${safeText(labels.login)}</button>
        <button type="button" class="account-button account-signup" data-account-action="signup">${safeText(labels.signup)}</button>`;
    }

    const member = authState.member;
    const isAdmin = member.role === 'admin';
    const adminLevel=member.adminLevel||member.admin_level||(isAdmin?'super':null);
    const roleLabel = isAdmin ? (isAdminContext?(adminLevel==='sub'?'부관리자':'최고관리자'):labels.administrator) : labels.member;
    const dropdownItems = `
      <button type="button" class="account-action-home${activeMenu==='home'?' is-current':''}" data-account-action="home">${safeText((NAV_LABELS[isAdminContext ? 'ko' : currentLanguage()] || NAV_LABELS.ko).home)}</button>
      ${isAdmin ? `<button type="button" class="account-action-admin" data-account-action="admin">${safeText(labels.admin)}</button>` : ''}
      <button type="button" class="account-action-mypage" data-account-action="mypage">${safeText(labels.myPage)}</button>
      <button type="button" class="account-action-logout" data-account-action="logout">${safeText(labels.logout)}</button>`;

    if (mobile) {
      return `
        <div class="mobile-account-profile${isAdmin ? ' is-admin' : ''}">
          <strong title="${safeText(member.nickname)}">${safeText(member.nickname)}</strong>
          <span class="${isAdmin ? 'rank-r5' : ''}">${safeText(member.memberRank)} · ${safeText(roleLabel)}</span>
        </div>
        <div class="mobile-account-actions">${dropdownItems}</div>
        <div class="mobile-account-divider"></div>`;
    }

    return `
      <div class="account-member">
        <button type="button" class="account-member-trigger" aria-expanded="false">
          <span class="account-member-name" title="${safeText(member.nickname)}">${safeText(isAdminContext ? (labels.myAccount || '내 계정') : member.nickname)}</span>
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

  let lastAccountRenderSignature = '';

  function accountRenderSignature() {
    const member = authState?.member || null;
    return JSON.stringify({
      loaded:Boolean(authLoaded),
      authenticated:Boolean(authState?.authenticated),
      language:currentLanguage(),
      adminContext:Boolean(isAdminContext),
      loginId:String(member?.loginId || ''),
      nickname:String(member?.nickname || ''),
      role:String(member?.role || ''),
      adminLevel:String(member?.adminLevel || member?.admin_level || ''),
      rank:String(member?.memberRank || member?.member_rank || ''),
      status:String(member?.status || '')
    });
  }

  function renderAccount(force=false) {
    const desktop = header.querySelector('#desktopAccount');
    const mobile = document.querySelector('#mobileDrawerAccount');
    const signature = accountRenderSignature();

    // v297: PC and mobile use the same desktopAccount profile trigger in the
    // header. Repeated auth/language refreshes with identical data must not
    // replace that live DOM, because replacement closes the open profile menu.
    if (!force && signature === lastAccountRenderSignature && desktop?.children.length) return;

    // v296: Authentication refreshes may finish immediately after the user
    // opens the administrator profile menu. Replacing the account markup used
    // to destroy the open dropdown and make it appear to close by itself.
    // Preserve the visible account-menu state across an auth re-render.
    const desktopMenuWasOpen = Boolean(desktop?.querySelector('.account-menu:not([hidden])'));

    desktop.innerHTML = accountMarkup(false);
    mobile.innerHTML = accountMarkup(true);
    bindAccountEvents(desktop);
    bindAccountEvents(mobile);

    lastAccountRenderSignature = signature;

    if (desktopMenuWasOpen) {
      const trigger = desktop.querySelector('.account-member-trigger');
      const menu = desktop.querySelector('.account-menu');
      if (trigger && menu) {
        menu.hidden = false;
        trigger.setAttribute('aria-expanded','true');
      }
    }

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
        const routeUrl=new URL(window.location.href);
        if(routeUrl.searchParams.get('route')==='1'){
          if(authState.authenticated){routeUrl.searchParams.delete('route');history.replaceState(null,'',routeUrl.pathname+routeUrl.search+routeUrl.hash);}
          else{try{await fetch('/api/routing/clear',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:'{}'});}catch(_){}window.location.replace('https://ezpk322.com/?select=1');return;}
        }
        if (loginIntentAfterAuth) {
          loginIntentAfterAuth = false;
          openLogin();
        }
        authLoadPromise = null;
      }
      return authState;
    })();
    return authLoadPromise;
  }

  // v290: Start authentication before optional navigation/language bindings.
  // The administrator account area must not remain on "확인 중" when a
  // later, non-authentication UI initializer fails.
  loadSiteContext();
  loadAuth();

  function closeMenus() {
    const langMenu = header.querySelector('#langMenu');
    const nav = header.querySelector('#nav');
    const drawer = document.querySelector('#ezpkMobileDrawer');
    const menuBtn = header.querySelector('#menuBtn');
    if (langMenu) langMenu.hidden = true;
    if (nav) nav.classList.remove('open');
    if (drawer?.classList.contains('open')) setMobileMenuOpen(false);
    else {
      document.body.classList.remove('ezpk-mobile-menu-open');
      if (menuBtn) {
        menuBtn.textContent='☰';
        menuBtn.setAttribute('aria-expanded','false');
        menuBtn.setAttribute('aria-label',menuUi().menu);
      }
    }
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
    submit.setAttribute('aria-busy','true');

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
      const returnTarget = pendingNavigation || sessionStorage.getItem('ezpk-auth-return') || '';
      pendingNavigation = '';
      sessionStorage.removeItem('ezpk-auth-return');
      if (returnTarget) window.location.href = returnTarget;
    } catch (_) {
      loginError.textContent = accountLabels().requestFailed;
      loginError.hidden = false;
    } finally {
      submit.disabled = false;
      submit.setAttribute('aria-busy','false');
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !loginModal.hidden) closeLogin();
  });

  window.addEventListener('ezpk-open-login', openLogin);

  document.addEventListener('click', function (event) {
    if (navMore && !navMore.contains(event.target)) closeMoreMenu();
  });
  document.addEventListener('click', function (event) {
    const lockedLink = event.target.closest('a[data-nav-locked="true"]');
    if (!lockedLink) return;
    event.preventDefault();
    pendingNavigation = lockedLink.href;
    sessionStorage.setItem('ezpk-auth-return',pendingNavigation);
    openLogin(event);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMoreMenu();
  });
  requestAnimationFrame(updateResponsiveNavigation);

  const mobileDrawer = document.querySelector('#ezpkMobileDrawer');
  const mobileDrawerScroll = document.querySelector('#ezpkMobileDrawerScroll');
  let mobileMenuHistoryActive = false;

  function syncMobileDrawerMetrics() {
    if ((isAdminContext && window.innerWidth > 900) || (!isAdminContext && window.innerWidth > 1199)) return;
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

  function setMobileMenuOpen(open, fromHistory=false) {
    const next = Boolean(open);
    document.body.classList.toggle('ezpk-mobile-menu-open', next);
    if (!mobileDrawer) return;
    mobileDrawer.classList.toggle('open', next);
    mobileDrawer.setAttribute('aria-hidden', String(!next));
    const button = header.querySelector('#menuBtn');
    if (button) {
      button.textContent = next ? '×' : '☰';
      button.setAttribute('aria-expanded',String(next));
      button.setAttribute('aria-label',next ? menuUi().closeMenu : menuUi().menu);
    }
    if (next) {
      syncMobileDrawerMetrics();
      resetMobileDrawerScroll();
      if (!mobileMenuHistoryActive) {
        history.pushState({ezpkMobileMenu:true},'',window.location.href);
        mobileMenuHistoryActive = true;
      }
      requestAnimationFrame(()=>mobileDrawer.querySelector('a,button')?.focus());
    } else {
      if (mobileMenuHistoryActive && !fromHistory) history.back();
      mobileMenuHistoryActive = false;
      if (!fromHistory) requestAnimationFrame(()=>button?.focus());
    }
  }

  syncMobileDrawerMetrics();
  window.addEventListener('resize', syncMobileDrawerMetrics, { passive:true });
  window.addEventListener('orientationchange', function () {
    requestAnimationFrame(syncMobileDrawerMetrics);
  });
  window.addEventListener('popstate', function () {
    if (mobileDrawer?.classList.contains('open')) setMobileMenuOpen(false,true);
  });

  const initialLang = isAdminContext ? 'ko' : currentLanguage();
  applyLanguage(initialLang,false);
  if (new URLSearchParams(window.location.search).get('login') === '1') {
    setTimeout(()=>openLogin(),0);
  }

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
  });
  mobileDrawer.addEventListener('click', function (event) {
    if (!event.target.closest('a')) return;
    // A real navigation must not call history.back(); doing so can win the
    // race against the clicked href and restore the previous guest menu.
    if (!event.target.closest('a[data-nav-locked="true"]')) setMobileMenuOpen(false,true);
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
  document.addEventListener('keydown',function(e){
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) setMobileMenuOpen(false);
    if (e.key === 'Tab' && mobileDrawer?.classList.contains('open')) {
      const focusable=[...mobileDrawer.querySelectorAll('a[href],button:not([disabled])')].filter(el=>!el.hidden&&el.getClientRects().length);
      if (!focusable.length) return;
      const first=focusable[0],last=focusable[focusable.length-1];
      if (e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
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
