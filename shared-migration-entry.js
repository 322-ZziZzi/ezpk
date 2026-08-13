(()=>{
  'use strict';
  const TEXT={
    en:{status:'MIGRATION OPEN',title:'State #322 Migration Application',body:'Prepare for a new beginning in State #322.\nOur leadership team will review your application and contact you individually.',button:'APPLY FOR MIGRATION',process:'Submit Application → Leadership Review → Individual Contact → Join State #322'},
    fr:{status:'MIGRATION OUVERTE',title:'Demande de migration vers l’État #322',body:'Préparez un nouveau départ dans l’État #322.\nNotre équipe dirigeante examinera votre demande et vous contactera individuellement.',button:'DEMANDER LA MIGRATION',process:'Envoyer la demande → Examen de la direction → Contact individuel → Rejoindre l’État #322'},
    de:{status:'MIGRATION OFFEN',title:'Migrationsantrag für Staat #322',body:'Bereite dich auf einen Neuanfang in Staat #322 vor.\nUnsere Allianzleitung prüft deinen Antrag und kontaktiert dich persönlich.',button:'MIGRATION BEANTRAGEN',process:'Antrag senden → Prüfung durch die Leitung → Persönlicher Kontakt → Staat #322 beitreten'},
    ko:{status:'이민 모집 중',title:'322 서버 이민 신청',body:'322서버에서 새로운 시작을 준비해보세요.\n신청서를 검토한 후 운영진이 개별적으로 안내드립니다.',button:'이민 신청하기',process:'신청서 제출 → 운영진 검토 → 개별 연락 → 322 서버 합류'},
    th:{status:'เปิดรับการย้ายเซิร์ฟเวอร์',title:'สมัครย้ายไปยังรัฐ #322',body:'เตรียมพร้อมสำหรับการเริ่มต้นใหม่ในรัฐ #322\nทีมบริหารจะตรวจสอบใบสมัครและติดต่อคุณเป็นรายบุคคล',button:'สมัครย้ายเซิร์ฟเวอร์',process:'ส่งใบสมัคร → ทีมบริหารตรวจสอบ → ติดต่อเป็นรายบุคคล → เข้าร่วมรัฐ #322'},
    ja:{status:'移住募集中',title:'ステート #322 移住申請',body:'ステート #322で新しいスタートを準備しましょう。\n運営チームが申請を確認し、個別にご連絡します。',button:'移住申請をする',process:'申請書提出 → 運営確認 → 個別連絡 → ステート #322へ合流'},
    pt:{status:'MIGRAÇÃO ABERTA',title:'Solicitação de Migração para o Estado #322',body:'Prepare-se para um novo começo no Estado #322.\nA liderança analisará sua solicitação e entrará em contato individualmente.',button:'SOLICITAR MIGRAÇÃO',process:'Enviar Solicitação → Análise da Liderança → Contato Individual → Entrar no Estado #322'},
    es:{status:'MIGRACIÓN ABIERTA',title:'Solicitud de migración al Estado #322',body:'Prepárate para un nuevo comienzo en el Estado #322.\nNuestro equipo de liderazgo revisará tu solicitud y se pondrá en contacto contigo de forma individual.',button:'SOLICITAR MIGRACIÓN',process:'Enviar solicitud → Revisión del liderazgo → Contacto individual → Unirse al Estado #322'},
    tr:{status:'GÖÇ BAŞVURULARI AÇIK',title:'Eyalet #322 Göç Başvurusu',body:'Eyalet #322’de yeni bir başlangıca hazırlanın.\nYönetim ekibimiz başvurunuzu inceleyip sizinle bireysel olarak iletişime geçecektir.',button:'GÖÇ BAŞVURUSU YAP',process:'Başvuruyu Gönder → Yönetim İncelemesi → Bireysel İletişim → Eyalet #322’ye Katıl'},
    'zh-tw':{status:'開放移民申請',title:'州 #322 移民申請',body:'在州 #322準備全新的開始。\n管理團隊將審核申請並個別與您聯絡。',button:'申請移民',process:'提交申請 → 管理團隊審核 → 個別聯絡 → 加入州 #322'},
    it:{status:'MIGRAZIONE APERTA',title:'Domanda di migrazione allo Stato #322',body:'Preparati a un nuovo inizio nello Stato #322.\nIl nostro team di leadership esaminerà la domanda e ti contatterà individualmente.',button:'RICHIEDI MIGRAZIONE',process:'Invia domanda → Revisione leadership → Contatto individuale → Unisciti allo Stato #322'},
    ar:{status:'التسجيل للهجرة مفتوح',title:'طلب الانتقال إلى الولاية #322',body:'استعد لبداية جديدة في الولاية #322.\nستراجع الإدارة طلبك وتتواصل معك بشكل فردي.',button:'تقديم طلب الانتقال',process:'إرسال الطلب ← مراجعة الإدارة ← تواصل فردي ← الانضمام إلى الولاية #322'},
    vi:{status:'ĐANG MỞ ĐĂNG KÝ DI CƯ',title:'Đăng ký Di cư đến Bang #322',body:'Hãy chuẩn bị cho một khởi đầu mới tại Bang #322.\nBan quản lý sẽ xem xét đơn và liên hệ riêng với bạn.',button:'ĐĂNG KÝ DI CƯ',process:'Gửi Đơn → Ban quản lý Xem xét → Liên hệ Riêng → Gia nhập Bang #322'},
    id:{status:'MIGRASI DIBUKA',title:'Pendaftaran Migrasi ke State #322',body:'Bersiaplah untuk memulai awal baru di State #322.\nTim pengurus akan meninjau pendaftaran Anda dan menghubungi Anda secara pribadi.',button:'AJUKAN MIGRASI',process:'Kirim Pendaftaran → Tinjauan Pengurus → Kontak Pribadi → Bergabung ke State #322'}
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
