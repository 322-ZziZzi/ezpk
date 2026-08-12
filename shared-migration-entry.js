(()=>{
  'use strict';
  const TEXT={
    ko:{status:'이민 모집 중',title:'322 서버 이민 신청',body:'322서버에서 새로운 시작을 준비해보세요.\n신청서를 검토한 후 운영진이 개별적으로 안내드립니다.',button:'이민 신청하기',process:'신청서 제출 → 운영진 검토 → 개별 연락 → 322 서버 합류'},
    en:{status:'MIGRATION OPEN',title:'State #322 Migration Application',body:'Prepare for a new beginning in State #322.\nOur leadership team will review your application and contact you individually.',button:'APPLY FOR MIGRATION',process:'Submit Application → Leadership Review → Individual Contact → Join State #322'},
    pt:{status:'MIGRAÇÃO ABERTA',title:'Solicitação de Migração para o Estado #322',body:'Prepare-se para um novo começo no Estado #322.\nA liderança analisará sua solicitação e entrará em contato individualmente.',button:'SOLICITAR MIGRAÇÃO',process:'Enviar Solicitação → Análise da Liderança → Contato Individual → Entrar no Estado #322'},
    vi:{status:'ĐANG MỞ ĐĂNG KÝ DI CƯ',title:'Đăng ký Di cư đến Bang #322',body:'Hãy chuẩn bị cho một khởi đầu mới tại Bang #322.\nBan quản lý sẽ xem xét đơn và liên hệ riêng với bạn.',button:'ĐĂNG KÝ DI CƯ',process:'Gửi Đơn → Ban quản lý Xem xét → Liên hệ Riêng → Gia nhập Bang #322'},
    ar:{status:'التسجيل للهجرة مفتوح',title:'طلب الانتقال إلى الولاية #322',body:'استعد لبداية جديدة في الولاية #322.\nستراجع الإدارة طلبك وتتواصل معك بشكل فردي.',button:'تقديم طلب الانتقال',process:'إرسال الطلب ← مراجعة الإدارة ← تواصل فردي ← الانضمام إلى الولاية #322'},
    ja:{status:'移住募集中',title:'ステート #322 移住申請',body:'ステート #322で新しいスタートを準備しましょう。\n運営チームが申請を確認し、個別にご連絡します。',button:'移住申請をする',process:'申請書提出 → 運営確認 → 個別連絡 → ステート #322へ合流'},
    th:{status:'เปิดรับการย้ายเซิร์ฟเวอร์',title:'สมัครย้ายไปยังรัฐ #322',body:'เตรียมพร้อมสำหรับการเริ่มต้นใหม่ในรัฐ #322\nทีมบริหารจะตรวจสอบใบสมัครและติดต่อคุณเป็นรายบุคคล',button:'สมัครย้ายเซิร์ฟเวอร์',process:'ส่งใบสมัคร → ทีมบริหารตรวจสอบ → ติดต่อเป็นรายบุคคล → เข้าร่วมรัฐ #322'},
    'zh-tw':{status:'開放移民申請',title:'州 #322 移民申請',body:'在州 #322準備全新的開始。\n管理團隊將審核申請並個別與您聯絡。',button:'申請移民',process:'提交申請 → 管理團隊審核 → 個別聯絡 → 加入州 #322'}
  };
  const normalize=(lang)=>TEXT[lang]?lang:'en';
  function render(root,lang){
    if(typeof root==='string')root=document.getElementById(root);
    if(!root)return;
    const tx=TEXT[normalize(lang)];
    const link=root.querySelector('.immigration-card');
    const status=root.querySelector('.immigration-status');
    const title=root.querySelector('h2');
    const body=root.querySelector('.immigration-copy');
    const button=root.querySelector('.immigration-button');
    const process=root.querySelector('.immigration-process');
    if(link){link.href='https://ezpk1.ezpk322.com/migration/';link.setAttribute('aria-label',tx.title);}
    if(status)status.textContent=tx.status;
    if(title)title.textContent=tx.title;
    if(body)body.textContent=tx.body;
    if(button)button.textContent=tx.button;
    if(process)process.textContent=tx.process;
  }
  window.EZPKMigrationEntry=Object.freeze({render});
})();
