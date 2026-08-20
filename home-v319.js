(function () {
  'use strict';

  const HOME_TEXT = {
    ko: {
      brandKicker:'서버 #322 · 국제 연맹',
      brandHeadline:'함께 즐기고, 함께 성장하며, 전략적으로 움직입니다.',
      brandDescription:'연맹 활동에 필요한 일정, 투표, 팀 편성과 전략을 한곳에서 확인하세요.',
      login:'로그인', signup:'회원가입',
      featuresTitle:'게임에 필요한 정보를 한곳에서',
      featuresDescription:'복잡한 연맹 활동은 간편하게 확인하고, 게임에 더 집중할 수 있습니다.',
      featureScheduleTitle:'일정 · 투표', featureScheduleBody:'일정 확인 · 투표 참여',
      featureTeamTitle:'팀 편성', featureTeamBody:'내 팀 · 내 역할 확인',
      featureStrategyTitle:'전략 안내', featureStrategyBody:'전투 전략 · 행동 지침',
      quickTitle:'바로가기', quickSpecs:'내 스펙 수정', quickVote:'투표', quickBgb:'BGB', quickCapital:'수도전', quickLayout:'연맹 배치도',
      immigrationStatus:'이민 모집 중', immigrationTitle:'322 서버 이민 신청',
      immigrationBody:'322 서버에서 EZPK와 함께 새로운 시즌을 준비하세요. 신청서를 검토한 후 운영진이 개별적으로 안내드립니다.',
      immigrationButton:'이민 신청하기',
      immigrationProcess:'신청서 제출 → 운영진 검토 → 개별 연락 → 322 서버 합류',
      footer:'역할을 다하고, 서로를 믿고, 끝까지 함께하자!'
    },
    en: {
      brandKicker:'STATE #322 · INTERNATIONAL ALLIANCE',
      brandHeadline:'Play together, grow together, and move with strategy.',
      brandDescription:'Find all the schedules, votes, team assignments, and strategies you need for alliance activities in one place.',
      login:'LOGIN', signup:'SIGN UP',
      featuresTitle:'Everything you need, all in one place',
      featuresDescription:'Keep alliance activities simple and focus more on the game.',
      featureScheduleTitle:'SCHEDULE · VOTE', featureScheduleBody:'CHECK SCHEDULE · JOIN VOTES',
      featureTeamTitle:'TEAM ASSIGNMENT', featureTeamBody:'CHECK MY TEAM · MY ROLE',
      featureStrategyTitle:'STRATEGY', featureStrategyBody:'BATTLE PLAN · ACTION GUIDE',
      quickTitle:'QUICK LINKS', quickSpecs:'EDIT MY SPECS', quickVote:'VOTE', quickBgb:'BGB', quickCapital:'CAPITAL WAR', quickLayout:'ALLIANCE LAYOUT',
      immigrationStatus:'MIGRATION OPEN', immigrationTitle:'State #322 Migration Application',
      immigrationBody:'Prepare for a new season with EZPK in State #322. Our leadership team will review your application and contact you individually.',
      immigrationButton:'APPLY FOR MIGRATION',
      immigrationProcess:'Submit Application → Leadership Review → Individual Contact → Join State #322',
      footer:'Fulfill your role, trust one another, and stay together to the end!'
    },
    pt: {
      brandKicker:'ESTADO #322 · ALIANÇA INTERNACIONAL',
      brandHeadline:'Jogamos juntos, crescemos juntos e agimos com estratégia.',
      brandDescription:'Confira em um só lugar os calendários, votações, equipes e estratégias necessários para as atividades da aliança.',
      login:'ENTRAR', signup:'CADASTRAR',
      featuresTitle:'Tudo o que você precisa em um só lugar',
      featuresDescription:'Consulte as atividades da aliança com facilidade e concentre-se mais no jogo.',
      featureScheduleTitle:'AGENDA · VOTAÇÃO', featureScheduleBody:'VER AGENDA · VOTAR',
      featureTeamTitle:'FORMAÇÃO DE EQUIPES', featureTeamBody:'MINHA EQUIPE · MINHA FUNÇÃO',
      featureStrategyTitle:'ESTRATÉGIA', featureStrategyBody:'PLANO DE BATALHA · INSTRUÇÕES',
      quickTitle:'ACESSO RÁPIDO', quickSpecs:'EDITAR MINHAS ESPECIFICAÇÕES', quickVote:'VOTAÇÃO', quickBgb:'BGB', quickCapital:'GUERRA DA CAPITAL', quickLayout:'MAPA DA ALIANÇA',
      immigrationStatus:'MIGRAÇÃO ABERTA', immigrationTitle:'Solicitação de Migração para o Estado #322',
      immigrationBody:'Prepare-se para uma nova temporada com a EZPK no Estado #322. A liderança analisará sua solicitação e entrará em contato individualmente.',
      immigrationButton:'SOLICITAR MIGRAÇÃO',
      immigrationProcess:'Enviar Solicitação → Análise da Liderança → Contato Individual → Entrar no Estado #322',
      footer:'Cumpram seu papel, confiem uns nos outros e permaneçam juntos até o fim!'
    },
    vi: {
      brandKicker:'BANG #322 · LIÊN MINH QUỐC TẾ',
      brandHeadline:'Cùng vui chơi, cùng phát triển và cùng hành động theo chiến lược.',
      brandDescription:'Xem lịch sự kiện, bình chọn, phân đội và chiến lược cần thiết cho các hoạt động liên minh tại một nơi.',
      login:'ĐĂNG NHẬP', signup:'ĐĂNG KÝ',
      featuresTitle:'Mọi thông tin cần thiết tại một nơi',
      featuresDescription:'Dễ dàng theo dõi hoạt động liên minh và tập trung hơn vào trò chơi.',
      featureScheduleTitle:'LỊCH · BÌNH CHỌN', featureScheduleBody:'XEM LỊCH · THAM GIA BÌNH CHỌN',
      featureTeamTitle:'PHÂN ĐỘI', featureTeamBody:'ĐỘI CỦA TÔI · VAI TRÒ CỦA TÔI',
      featureStrategyTitle:'CHIẾN LƯỢC', featureStrategyBody:'KẾ HOẠCH CHIẾN ĐẤU · HƯỚNG DẪN',
      quickTitle:'TRUY CẬP NHANH', quickSpecs:'SỬA THÔNG SỐ CỦA TÔI', quickVote:'BÌNH CHỌN', quickBgb:'BGB', quickCapital:'CHIẾN TRANH THỦ ĐÔ', quickLayout:'SƠ ĐỒ LIÊN MINH',
      immigrationStatus:'ĐANG MỞ ĐĂNG KÝ DI CƯ', immigrationTitle:'Đăng ký Di cư đến Bang #322',
      immigrationBody:'Hãy chuẩn bị cho mùa giải mới cùng EZPK tại Bang #322. Ban quản lý sẽ xem xét đơn và liên hệ riêng với bạn.',
      immigrationButton:'ĐĂNG KÝ DI CƯ',
      immigrationProcess:'Gửi Đơn → Ban quản lý Xem xét → Liên hệ Riêng → Gia nhập Bang #322',
      footer:'Hãy hoàn thành vai trò của mình, tin tưởng lẫn nhau và sát cánh đến cùng!'
    },
    ar: {
      brandKicker:'الولاية #322 · تحالف دولي',
      brandHeadline:'نلعب معًا، ونتطور معًا، ونتحرك وفق استراتيجية.',
      brandDescription:'اطّلع في مكان واحد على المواعيد والتصويتات وتوزيع الفرق والاستراتيجيات اللازمة لأنشطة التحالف.',
      login:'تسجيل الدخول', signup:'إنشاء حساب',
      featuresTitle:'كل ما تحتاجه في مكان واحد',
      featuresDescription:'تابع أنشطة التحالف بسهولة وركّز أكثر على اللعبة.',
      featureScheduleTitle:'المواعيد · التصويت', featureScheduleBody:'عرض المواعيد · المشاركة في التصويت',
      featureTeamTitle:'توزيع الفرق', featureTeamBody:'فريقي · دوري',
      featureStrategyTitle:'الاستراتيجية', featureStrategyBody:'خطة المعركة · تعليمات العمل',
      quickTitle:'روابط سريعة', quickSpecs:'تعديل مواصفاتي', quickVote:'التصويت', quickBgb:'BGB', quickCapital:'حرب العاصمة', quickLayout:'مخطط التحالف',
      immigrationStatus:'التسجيل للهجرة مفتوح', immigrationTitle:'طلب الانتقال إلى الولاية #322',
      immigrationBody:'استعد لموسم جديد مع EZPK في الولاية #322. ستراجع الإدارة طلبك وتتواصل معك بشكل فردي.',
      immigrationButton:'تقديم طلب الانتقال',
      immigrationProcess:'إرسال الطلب ← مراجعة الإدارة ← تواصل فردي ← الانضمام إلى الولاية #322',
      footer:'أدّوا أدواركم، وثقوا ببعضكم، وابقوا معًا حتى النهاية!'
    },
    ja: {
      brandKicker:'ステート #322 · 国際同盟',
      brandHeadline:'共に楽しみ、共に成長し、戦略的に行動します。',
      brandDescription:'同盟活動に必要なスケジュール、投票、チーム編成、戦略を一か所で確認できます。',
      login:'ログイン', signup:'新規登録',
      featuresTitle:'ゲームに必要な情報を一か所で',
      featuresDescription:'同盟活動を簡単に確認して、ゲームに集中できます。',
      featureScheduleTitle:'日程 · 投票', featureScheduleBody:'日程確認 · 投票参加',
      featureTeamTitle:'チーム編成', featureTeamBody:'自分のチーム · 役割を確認',
      featureStrategyTitle:'戦略案内', featureStrategyBody:'戦闘戦略 · 行動指針',
      quickTitle:'クイックリンク', quickSpecs:'自分のスペックを編集', quickVote:'投票', quickBgb:'BGB', quickCapital:'首都戦', quickLayout:'同盟配置図',
      immigrationStatus:'移住募集中', immigrationTitle:'ステート #322 移住申請',
      immigrationBody:'ステート #322のEZPKで新しいシーズンに備えましょう。運営チームが申請を確認し、個別にご連絡します。',
      immigrationButton:'移住申請をする',
      immigrationProcess:'申請書提出 → 運営確認 → 個別連絡 → ステート #322へ合流',
      footer:'それぞれの役割を果たし、互いを信じ、最後まで共に進もう！'
    },
    th: {
      brandKicker:'รัฐ #322 · พันธมิตรนานาชาติ',
      brandHeadline:'สนุกไปด้วยกัน เติบโตไปด้วยกัน และเคลื่อนไหวอย่างมีกลยุทธ์',
      brandDescription:'ตรวจสอบตารางกิจกรรม การโหวต การจัดทีม และกลยุทธ์ที่จำเป็นสำหรับกิจกรรมพันธมิตรได้ในที่เดียว',
      login:'เข้าสู่ระบบ', signup:'สมัครสมาชิก',
      featuresTitle:'ข้อมูลที่จำเป็นสำหรับเกมในที่เดียว',
      featuresDescription:'ตรวจสอบกิจกรรมพันธมิตรได้ง่ายและมีสมาธิกับเกมมากขึ้น',
      featureScheduleTitle:'ตาราง · โหวต', featureScheduleBody:'ตรวจสอบตาราง · ร่วมโหวต',
      featureTeamTitle:'การจัดทีม', featureTeamBody:'ทีมของฉัน · หน้าที่ของฉัน',
      featureStrategyTitle:'กลยุทธ์', featureStrategyBody:'แผนการรบ · แนวทางปฏิบัติ',
      quickTitle:'เมนูลัด', quickSpecs:'แก้ไขสเปกของฉัน', quickVote:'โหวต', quickBgb:'BGB', quickCapital:'สงครามเมืองหลวง', quickLayout:'ผังพันธมิตร',
      immigrationStatus:'เปิดรับการย้ายเซิร์ฟเวอร์', immigrationTitle:'สมัครย้ายไปยังรัฐ #322',
      immigrationBody:'เตรียมพร้อมสำหรับซีซันใหม่กับ EZPK ในรัฐ #322 ทีมบริหารจะตรวจสอบใบสมัครและติดต่อคุณเป็นรายบุคคล',
      immigrationButton:'สมัครย้ายเซิร์ฟเวอร์',
      immigrationProcess:'ส่งใบสมัคร → ทีมบริหารตรวจสอบ → ติดต่อเป็นรายบุคคล → เข้าร่วมรัฐ #322',
      footer:'ทำหน้าที่ของตน เชื่อใจกัน และอยู่เคียงข้างกันจนถึงที่สุด!'
    },
    'zh-tw': {
      brandKicker:'州 #322 · 國際聯盟',
      brandHeadline:'一起享受遊戲、一起成長，並以策略行動。',
      brandDescription:'在同一處查看聯盟活動所需的行程、投票、隊伍編排與策略。',
      login:'登入', signup:'註冊',
      featuresTitle:'遊戲所需資訊集中一處',
      featuresDescription:'輕鬆查看聯盟活動，更專注於遊戲。',
      featureScheduleTitle:'行程 · 投票', featureScheduleBody:'查看行程 · 參與投票',
      featureTeamTitle:'隊伍編排', featureTeamBody:'查看我的隊伍 · 我的角色',
      featureStrategyTitle:'策略指南', featureStrategyBody:'戰鬥策略 · 行動指引',
      quickTitle:'快速連結', quickSpecs:'編輯我的規格', quickVote:'投票', quickBgb:'BGB', quickCapital:'首都戰', quickLayout:'聯盟配置圖',
      immigrationStatus:'開放移民申請', immigrationTitle:'州 #322 移民申請',
      immigrationBody:'在州 #322與EZPK一起準備新的賽季。管理團隊將審核申請並個別與您聯絡。',
      immigrationButton:'申請移民',
      immigrationProcess:'提交申請 → 管理團隊審核 → 個別聯絡 → 加入州 #322',
      footer:'各司其職、彼此信任，並肩同行直到最後！'
    }
  };
window.EZPK_I18N_V414?.apply('home',HOME_TEXT);

  const supported = Object.keys(HOME_TEXT);
  const language = function () {
    const code = window.EZPKLanguage?.get?.() || 'en';
    return supported.includes(code) ? code : 'en';
  };

  function renderLanguage() {
    const text = HOME_TEXT[language()] || HOME_TEXT.en;
    document.querySelectorAll('[data-home-k]').forEach(function (element) {
      const value = text[element.dataset.homeK];
      if (value != null) element.textContent = value;
    });
    document.querySelectorAll('[data-home-k-aria]').forEach(function (element) {
      const value = text[element.dataset.homeKAria];
      if (value != null) element.setAttribute('aria-label', value);
    });
  }

  function applyAuth(state) {
    if (!state || !state.loaded) return;
    const active = Boolean(state.authenticated && state.member && state.member.status === 'active');
    const anonymous = !state.authenticated;
    document.body.classList.remove('home-auth-pending');
    document.body.classList.toggle('home-auth-member', active);
    document.body.classList.toggle('home-auth-guest', !active);
    document.querySelectorAll('[data-home-member]').forEach(function (element) { element.hidden = !active; });
    document.querySelectorAll('[data-home-guest]').forEach(function (element) { element.hidden = active; });
    document.querySelectorAll('[data-home-anonymous]').forEach(function (element) { element.hidden = !anonymous; });
    document.querySelectorAll('[data-home-migration]').forEach(function (element) { element.hidden = !anonymous; });
  }

  document.querySelectorAll('[data-home-action="login"]').forEach(function (button) {
    button.addEventListener('click', function () { window.dispatchEvent(new CustomEvent('ezpk-open-login')); });
  });
  document.querySelectorAll('[data-home-action="signup"]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (window.EZPKMemberAuth && typeof window.EZPKMemberAuth.goToSignup === 'function') window.EZPKMemberAuth.goToSignup();
      else window.location.href = './signup/';
    });
  });

  window.addEventListener('ezpk-language-change', renderLanguage);
  window.addEventListener('ezpk-auth-ready', function (event) { applyAuth({ loaded:true, ...event.detail }); });
  window.addEventListener('ezpk-auth-change', function (event) { applyAuth({ loaded:true, ...event.detail }); });
  renderLanguage();
  if (window.EZPKMemberAuth) applyAuth(window.EZPKMemberAuth.getState());
})();
