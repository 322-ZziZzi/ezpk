(() => {
  "use strict";
  const STORAGE_KEY = "ezpk-lang-v5";
  const MAINTENANCE_PROTECTION_EXPANDED_KEY = "ezpk-maintenance-protection-expanded-v1";
  const LANGS = ["en","fr","de","ko","th","ja","pt","es","tr","zh-tw","it","ar","vi","id"];
  const T = {
    ko:{title:"마이페이지",subtitle:"내 프로필과 계정 정보를 관리합니다.",loading:"회원 정보를 불러오는 중입니다.",loginRequired:"로그인이 필요합니다.",loginRequiredBody:"로그인 후 마이페이지를 이용할 수 있습니다.",goHome:"홈으로 이동",loginButton:"로그인",power:"전투력",profilePower:"전투력 (프로필에 표시된 수치)",industry:"산업 레벨",basicProfile:"기본 프로필",detailedSpecs:"세부 스펙",changeNickname:"닉네임 변경",changePassword:"비밀번호 변경",loginId:"로그인 아이디",nickname:"닉네임",memberRank:"회원 등급",saveProfile:"기본 프로필 저장",vehicle1:"차량 1",vehicle2:"차량 2",class:"병종",unit:"단위",seasonWar:"시즌전 참여 가능 여부",bgbHour:"BGB 참여 가능 시간대",discordOptional:"Discord (선택사항)",telegramOptional:"Telegram (선택사항)",serverTimeBasis:"서버 시간 기준",currentServerTime:"현재 서버 시간",yes:"가능",no:"불가능",saveSpecs:"저장",currentNickname:"현재 닉네임",changeStatus:"변경 상태",available:"🟢 지금 변경 가능",waiting:"🔴 7일 후 변경 가능",nextAvailable:"다음 변경 가능일",newNickname:"새 닉네임",changeNicknameButton:"닉네임 변경",currentPassword:"현재 비밀번호",newPassword:"새 비밀번호",confirmPassword:"새 비밀번호 확인",passwordNote:"비밀번호 변경 후 다시 로그인해야 합니다.",changePasswordButton:"비밀번호 변경",member:"멤버",administrator:"관리자",saved:"저장되었습니다.",nicknameChanged:"닉네임이 변경되었습니다.",passwordChanged:"비밀번호가 변경되었습니다. 다시 로그인해 주세요.",failed:"요청을 처리하지 못했습니다.",validation:"입력값을 확인해 주세요.",cooldown:"아직 닉네임을 변경할 수 없습니다.",resetSpecs:"초기화",resetConfirm:"세부 스펙을 모두 초기화하시겠습니까?",cancel:"취소",nicknameChangeNote:"닉네임 변경 후 7일 동안 다시 변경할 수 없습니다.",resetDone:"초기화되었습니다."},
    en:{title:"MY PAGE",subtitle:"Manage your profile and account information.",loading:"Loading member information.",loginRequired:"Login required.",loginRequiredBody:"Please log in to use My Page.",goHome:"GO HOME",loginButton:"LOGIN",power:"Power",profilePower:"CP (Shown on your profile)",industry:"Industry Level",basicProfile:"Basic Profile",detailedSpecs:"Detailed Specs",changeNickname:"Change Nickname",changePassword:"Change Password",loginId:"Login ID",nickname:"Nickname",memberRank:"Member Rank",saveProfile:"SAVE PROFILE",vehicle1:"Vehicle 1",vehicle2:"Vehicle 2",class:"Class",unit:"Unit",seasonWar:"Season War Available",bgbHour:"BGB Available Time",discordOptional:"Discord (Optional)",telegramOptional:"Telegram (Optional)",serverTimeBasis:"Server Time",currentServerTime:"Current Server Time",yes:"Available",no:"Unavailable",saveSpecs:"SAVE",currentNickname:"Current Nickname",changeStatus:"Change Status",available:"🟢 Available Now",waiting:"🔴 Available After 7 Days",nextAvailable:"Next Available",newNickname:"New Nickname",changeNicknameButton:"CHANGE NICKNAME",currentPassword:"Current Password",newPassword:"New Password",confirmPassword:"Confirm New Password",passwordNote:"You must log in again after changing your password.",changePasswordButton:"CHANGE PASSWORD",member:"MEMBER",administrator:"ADMINISTRATOR",saved:"Saved successfully.",nicknameChanged:"Nickname changed.",passwordChanged:"Password changed. Please log in again.",failed:"The request could not be completed.",validation:"Please check the entered values.",cooldown:"Nickname change is not available yet.",resetSpecs:"RESET",resetConfirm:"Reset all detailed specs?",cancel:"CANCEL",nicknameChangeNote:"You cannot change your nickname again for 7 days after a change.",resetDone:"Reset complete."},
    ja:{title:"マイページ",subtitle:"プロフィールとアカウント情報を管理します。",loading:"会員情報を読み込んでいます。",loginRequired:"ログインが必要です。",loginRequiredBody:"ログイン後にマイページをご利用ください。",goHome:"ホームへ",loginButton:"ログイン",power:"戦力",profilePower:"CP（プロフィールに表示される数値）",industry:"産業レベル",basicProfile:"基本プロフィール",detailedSpecs:"詳細スペック",changeNickname:"ニックネーム変更",changePassword:"パスワード変更",loginId:"ログインID",nickname:"ニックネーム",memberRank:"メンバーランク",saveProfile:"プロフィールを保存",vehicle1:"車両1",vehicle2:"車両2",class:"兵種",unit:"単位",seasonWar:"シーズン戦参加",bgbHour:"BGB参加可能時間",discordOptional:"Discord（任意）",telegramOptional:"Telegram（任意）",serverTimeBasis:"サーバー時間基準",currentServerTime:"現在のサーバー時間",yes:"可能",no:"不可",saveSpecs:"保存",currentNickname:"現在のニックネーム",changeStatus:"変更状態",available:"🟢 今すぐ変更可能",waiting:"🔴 7日後に変更可能",nextAvailable:"次回変更可能日時",newNickname:"新しいニックネーム",changeNicknameButton:"ニックネーム変更",currentPassword:"現在のパスワード",newPassword:"新しいパスワード",confirmPassword:"新しいパスワード確認",passwordNote:"変更後は再ログインが必要です。",changePasswordButton:"パスワード変更",member:"メンバー",administrator:"管理者",saved:"保存しました。",nicknameChanged:"ニックネームを変更しました。",passwordChanged:"パスワードを変更しました。再ログインしてください。",failed:"処理できませんでした。",validation:"入力内容を確認してください。",cooldown:"まだニックネームを変更できません。",resetSpecs:"リセット",resetConfirm:"詳細スペックをすべてリセットしますか？",cancel:"キャンセル",nicknameChangeNote:"ニックネーム変更後7日間は再変更できません。",resetDone:"リセットしました。"},
    "zh-tw":{title:"我的頁面",subtitle:"管理個人資料與帳號資訊。",loading:"正在載入會員資訊。",loginRequired:"需要登入。",loginRequiredBody:"登入後即可使用我的頁面。",goHome:"返回首頁",loginButton:"登入",power:"戰力",profilePower:"CP（顯示於個人資料）",industry:"產業等級",basicProfile:"基本資料",detailedSpecs:"詳細規格",changeNickname:"變更暱稱",changePassword:"變更密碼",loginId:"登入 ID",nickname:"暱稱",memberRank:"成員等級",saveProfile:"儲存基本資料",vehicle1:"載具 1",vehicle2:"載具 2",class:"兵種",unit:"單位",seasonWar:"可參加賽季戰",bgbHour:"BGB 可參與時間",discordOptional:"Discord（選填）",telegramOptional:"Telegram（選填）",serverTimeBasis:"依伺服器時間",currentServerTime:"目前伺服器時間",yes:"可以",no:"不可以",saveSpecs:"儲存",currentNickname:"目前暱稱",changeStatus:"變更狀態",available:"🟢 現在可以變更",waiting:"🔴 7 天後可以變更",nextAvailable:"下次可變更時間",newNickname:"新暱稱",changeNicknameButton:"變更暱稱",currentPassword:"目前密碼",newPassword:"新密碼",confirmPassword:"確認新密碼",passwordNote:"變更密碼後需要重新登入。",changePasswordButton:"變更密碼",member:"成員",administrator:"管理員",saved:"已儲存。",nicknameChanged:"暱稱已變更。",passwordChanged:"密碼已變更，請重新登入。",failed:"無法完成要求。",validation:"請確認輸入內容。",cooldown:"目前尚無法變更暱稱。",resetSpecs:"重設",resetConfirm:"要重設所有詳細規格嗎？",cancel:"取消",nicknameChangeNote:"變更暱稱後 7 天內無法再次變更。",resetDone:"已重設。"},
    vi:{title:"TRANG CỦA TÔI",subtitle:"Quản lý hồ sơ và thông tin tài khoản.",loading:"Đang tải thông tin thành viên.",loginRequired:"Cần đăng nhập.",loginRequiredBody:"Vui lòng đăng nhập để sử dụng trang này.",goHome:"VỀ TRANG CHỦ",loginButton:"ĐĂNG NHẬP",power:"Lực chiến",profilePower:"CP (Hiển thị trên hồ sơ)",industry:"Cấp Công nghiệp",basicProfile:"Hồ sơ cơ bản",detailedSpecs:"Thông số chi tiết",changeNickname:"Đổi biệt danh",changePassword:"Đổi mật khẩu",loginId:"ID đăng nhập",nickname:"Biệt danh",memberRank:"Hạng thành viên",saveProfile:"LƯU HỒ SƠ",vehicle1:"Xe 1",vehicle2:"Xe 2",class:"Hệ",unit:"Đơn vị",seasonWar:"Có thể tham gia chiến mùa",bgbHour:"Thời gian tham gia BGB",discordOptional:"Discord (Không bắt buộc)",telegramOptional:"Telegram (Không bắt buộc)",serverTimeBasis:"Theo giờ máy chủ",currentServerTime:"Giờ máy chủ hiện tại",yes:"Có",no:"Không",saveSpecs:"LƯU",currentNickname:"Biệt danh hiện tại",changeStatus:"Trạng thái đổi",available:"🟢 Có thể đổi ngay",waiting:"🔴 Có thể đổi sau 7 ngày",nextAvailable:"Lần đổi tiếp theo",newNickname:"Biệt danh mới",changeNicknameButton:"ĐỔI BIỆT DANH",currentPassword:"Mật khẩu hiện tại",newPassword:"Mật khẩu mới",confirmPassword:"Xác nhận mật khẩu mới",passwordNote:"Bạn phải đăng nhập lại sau khi đổi mật khẩu.",changePasswordButton:"ĐỔI MẬT KHẨU",member:"THÀNH VIÊN",administrator:"QUẢN TRỊ VIÊN",saved:"Đã lưu.",nicknameChanged:"Đã đổi biệt danh.",passwordChanged:"Đã đổi mật khẩu. Vui lòng đăng nhập lại.",failed:"Không thể xử lý yêu cầu.",validation:"Vui lòng kiểm tra dữ liệu.",cooldown:"Chưa thể đổi biệt danh.",resetSpecs:"ĐẶT LẠI",resetConfirm:"Đặt lại toàn bộ thông số chi tiết?",cancel:"HỦY",nicknameChangeNote:"Bạn không thể đổi lại biệt danh trong 7 ngày sau khi thay đổi.",resetDone:"Đã đặt lại."},
    th:{title:"หน้าของฉัน",subtitle:"จัดการโปรไฟล์และข้อมูลบัญชี",loading:"กำลังโหลดข้อมูลสมาชิก",loginRequired:"จำเป็นต้องเข้าสู่ระบบ",loginRequiredBody:"โปรดเข้าสู่ระบบเพื่อใช้หน้าของฉัน",goHome:"กลับหน้าหลัก",loginButton:"เข้าสู่ระบบ",power:"พลังรบ",profilePower:"CP (แสดงบนโปรไฟล์)",industry:"ระดับอุตสาหกรรม",basicProfile:"โปรไฟล์พื้นฐาน",detailedSpecs:"สเปกโดยละเอียด",changeNickname:"เปลี่ยนชื่อเล่น",changePassword:"เปลี่ยนรหัสผ่าน",loginId:"ไอดีเข้าสู่ระบบ",nickname:"ชื่อเล่น",memberRank:"อันดับสมาชิก",saveProfile:"บันทึกโปรไฟล์",vehicle1:"ยานพาหนะ 1",vehicle2:"ยานพาหนะ 2",class:"คลาส",unit:"หน่วย",seasonWar:"เข้าร่วมสงครามซีซัน",bgbHour:"เวลาที่สามารถเข้าร่วม BGB",discordOptional:"Discord (ไม่บังคับ)",telegramOptional:"Telegram (ไม่บังคับ)",serverTimeBasis:"ตามเวลาเซิร์ฟเวอร์",currentServerTime:"เวลาเซิร์ฟเวอร์ปัจจุบัน",yes:"ได้",no:"ไม่ได้",saveSpecs:"บันทึก",currentNickname:"ชื่อเล่นปัจจุบัน",changeStatus:"สถานะการเปลี่ยน",available:"🟢 เปลี่ยนได้ตอนนี้",waiting:"🔴 เปลี่ยนได้หลัง 7 วัน",nextAvailable:"เปลี่ยนได้ครั้งถัดไป",newNickname:"ชื่อเล่นใหม่",changeNicknameButton:"เปลี่ยนชื่อเล่น",currentPassword:"รหัสผ่านปัจจุบัน",newPassword:"รหัสผ่านใหม่",confirmPassword:"ยืนยันรหัสผ่านใหม่",passwordNote:"หลังเปลี่ยนรหัสผ่านต้องเข้าสู่ระบบอีกครั้ง",changePasswordButton:"เปลี่ยนรหัสผ่าน",member:"สมาชิก",administrator:"ผู้ดูแลระบบ",saved:"บันทึกแล้ว",nicknameChanged:"เปลี่ยนชื่อเล่นแล้ว",passwordChanged:"เปลี่ยนรหัสผ่านแล้ว โปรดเข้าสู่ระบบอีกครั้ง",failed:"ไม่สามารถดำเนินการได้",validation:"โปรดตรวจสอบข้อมูล",cooldown:"ยังไม่สามารถเปลี่ยนชื่อเล่นได้",resetSpecs:"รีเซ็ต",resetConfirm:"รีเซ็ตสเปกโดยละเอียดทั้งหมดหรือไม่?",cancel:"ยกเลิก",nicknameChangeNote:"หลังเปลี่ยนชื่อเล่น จะไม่สามารถเปลี่ยนอีกได้เป็นเวลา 7 วัน",resetDone:"รีเซ็ตแล้ว"},
    pt:{title:"MINHA PÁGINA",subtitle:"Gerencie seu perfil e as informações da conta.",loading:"Carregando informações do membro.",loginRequired:"Login necessário.",loginRequiredBody:"Entre para usar a Minha Página.",goHome:"VOLTAR AO INÍCIO",loginButton:"ENTRAR",power:"Poder",profilePower:"CP (Exibido no seu perfil)",industry:"Nível Industrial",basicProfile:"Perfil Básico",detailedSpecs:"Especificações",changeNickname:"Alterar Apelido",changePassword:"Alterar Senha",loginId:"ID de Login",nickname:"Apelido",memberRank:"Patente",saveProfile:"SALVAR PERFIL",vehicle1:"Veículo 1",vehicle2:"Veículo 2",class:"Classe",unit:"Unidade",seasonWar:"Disponível para Guerra da Temporada",bgbHour:"Horário disponível para BGB",discordOptional:"Discord (Opcional)",telegramOptional:"Telegram (Opcional)",serverTimeBasis:"Horário do servidor",currentServerTime:"Horário atual do servidor",yes:"Sim",no:"Não",saveSpecs:"SALVAR",currentNickname:"Apelido Atual",changeStatus:"Status da Alteração",available:"🟢 Disponível Agora",waiting:"🔴 Disponível Após 7 Dias",nextAvailable:"Próxima Disponibilidade",newNickname:"Novo Apelido",changeNicknameButton:"ALTERAR APELIDO",currentPassword:"Senha Atual",newPassword:"Nova Senha",confirmPassword:"Confirmar Nova Senha",passwordNote:"Você deverá entrar novamente após alterar a senha.",changePasswordButton:"ALTERAR SENHA",member:"MEMBRO",administrator:"ADMINISTRADOR",saved:"Salvo com sucesso.",nicknameChanged:"Apelido alterado.",passwordChanged:"Senha alterada. Entre novamente.",failed:"Não foi possível concluir a solicitação.",validation:"Verifique os dados informados.",cooldown:"A alteração de apelido ainda não está disponível.",resetSpecs:"REDEFINIR",resetConfirm:"Redefinir todas as especificações detalhadas?",cancel:"CANCELAR",nicknameChangeNote:"Após alterar o apelido, não será possível alterá-lo novamente por 7 dias.",resetDone:"Redefinição concluída."},
    ar:{title:"صفحتي",subtitle:"إدارة الملف الشخصي ومعلومات الحساب.",loading:"جارٍ تحميل معلومات العضو.",loginRequired:"تسجيل الدخول مطلوب.",loginRequiredBody:"يرجى تسجيل الدخول لاستخدام صفحتي.",goHome:"العودة للرئيسية",loginButton:"تسجيل الدخول",power:"القوة",profilePower:"CP (المعروض في ملفك الشخصي)",industry:"مستوى الصناعة",basicProfile:"الملف الأساسي",detailedSpecs:"المواصفات التفصيلية",changeNickname:"تغيير الاسم",changePassword:"تغيير كلمة المرور",loginId:"معرّف الدخول",nickname:"الاسم",memberRank:"رتبة العضو",saveProfile:"حفظ الملف",vehicle1:"المركبة 1",vehicle2:"المركبة 2",class:"الفئة",unit:"الوحدة",seasonWar:"متاح لحرب الموسم",bgbHour:"وقت التوفر لـ BGB",discordOptional:"Discord (اختياري)",telegramOptional:"Telegram (اختياري)",serverTimeBasis:"حسب وقت الخادم",currentServerTime:"وقت الخادم الحالي",yes:"متاح",no:"غير متاح",saveSpecs:"حفظ",currentNickname:"الاسم الحالي",changeStatus:"حالة التغيير",available:"🟢 متاح للتغيير الآن",waiting:"🔴 متاح بعد 7 أيام",nextAvailable:"موعد التغيير التالي",newNickname:"الاسم الجديد",changeNicknameButton:"تغيير الاسم",currentPassword:"كلمة المرور الحالية",newPassword:"كلمة المرور الجديدة",confirmPassword:"تأكيد كلمة المرور",passwordNote:"يجب تسجيل الدخول مجددًا بعد تغيير كلمة المرور.",changePasswordButton:"تغيير كلمة المرور",member:"عضو",administrator:"مسؤول",saved:"تم الحفظ.",nicknameChanged:"تم تغيير الاسم.",passwordChanged:"تم تغيير كلمة المرور. يرجى تسجيل الدخول مجددًا.",failed:"تعذر تنفيذ الطلب.",validation:"يرجى التحقق من القيم.",cooldown:"لا يمكن تغيير الاسم بعد.",resetSpecs:"إعادة تعيين",resetConfirm:"هل تريد إعادة تعيين جميع المواصفات التفصيلية؟",cancel:"إلغاء",nicknameChangeNote:"لا يمكنك تغيير الاسم مرة أخرى لمدة 7 أيام بعد تغييره.",resetDone:"تمت إعادة التعيين."}
  };
window.EZPK_I18N_V414?.apply('my',T);
const MY_V415={"en":{"groupInfo":"My Information","groupActivity":"Activity","groupAccount":"Account Settings"},"fr":{"groupInfo":"Mes informations","groupActivity":"Activité","groupAccount":"Paramètres du compte"},"de":{"groupInfo":"Meine Informationen","groupActivity":"Aktivität","groupAccount":"Kontoeinstellungen"},"ko":{"groupInfo":"내 정보","groupActivity":"활동","groupAccount":"계정 설정"},"th":{"groupInfo":"ข้อมูลของฉัน","groupActivity":"กิจกรรม","groupAccount":"การตั้งค่าบัญชี"},"ja":{"groupInfo":"自分の情報","groupActivity":"アクティビティ","groupAccount":"アカウント設定"},"pt":{"groupInfo":"Minhas informações","groupActivity":"Atividade","groupAccount":"Configurações da conta"},"es":{"groupInfo":"Mi información","groupActivity":"Actividad","groupAccount":"Ajustes de la cuenta"},"tr":{"groupInfo":"Bilgilerim","groupActivity":"Etkinlik","groupAccount":"Hesap Ayarları"},"zh-tw":{"groupInfo":"我的資訊","groupActivity":"活動","groupAccount":"帳號設定"},"it":{"groupInfo":"Le mie informazioni","groupActivity":"Attività","groupAccount":"Impostazioni account"},"ar":{"groupInfo":"معلوماتي","groupActivity":"النشاط","groupAccount":"إعدادات الحساب"},"vi":{"groupInfo":"Thông tin của tôi","groupActivity":"Hoạt động","groupAccount":"Cài đặt tài khoản"},"id":{"groupInfo":"Informasi Saya","groupActivity":"Aktivitas","groupAccount":"Pengaturan Akun"}};
for(const [code,copy] of Object.entries(MY_V415)){if(T[code])Object.assign(T[code],copy)}

  let lang = normalize(localStorage.getItem(STORAGE_KEY) || document.documentElement.lang || "en");
  let memberData = null;
  const $ = (s, root=document) => root.querySelector(s);

  function normalize(value){ return LANGS.includes(value) ? value : "en"; }
  function t(key){ return (T[lang] && T[lang][key]) || T.en[key] || key; }

  const RANK_TITLES = Object.freeze({
    R1: "Reserve",
    R2: "Support",
    R3: "Core",
    R4: "Officer",
    R5: "Leader"
  });
  const PROMOTION_LABELS={
    ko:{title:"승급 조건",current:"현재",required:"필요",congrats:"승급 조건 달성을 축하합니다.",body:"승급 요청은 요청 게시판에 남겨 주세요.",request:"승급 요청하기",pending:"이미 처리 대기 중인 승급 요청이 있습니다.",view:"요청글 보기"},
    en:{title:"Promotion Requirements",current:"Current",required:"Required",congrats:"Congratulations! You met the promotion requirements.",body:"Please submit your promotion request on the Request Board.",request:"REQUEST PROMOTION",pending:"A promotion request is already pending.",view:"VIEW REQUEST"},
    ja:{title:"昇級条件",current:"現在",required:"必要",congrats:"昇級条件の達成、おめでとうございます。",body:"昇級申請はリクエスト掲示板に投稿してください。",request:"昇級を申請",pending:"処理待ちの昇級申請があります。",view:"申請を見る"},
    "zh-tw":{title:"晉級條件",current:"目前",required:"需要",congrats:"恭喜您達成晉級條件。",body:"請至請求留言板提交晉級申請。",request:"申請晉級",pending:"已有待處理的晉級申請。",view:"查看申請"},
    vi:{title:"Điều kiện thăng hạng",current:"Hiện tại",required:"Yêu cầu",congrats:"Chúc mừng bạn đã đạt điều kiện thăng hạng.",body:"Vui lòng gửi yêu cầu trên Bảng Yêu Cầu.",request:"YÊU CẦU THĂNG HẠNG",pending:"Đã có yêu cầu thăng hạng đang chờ xử lý.",view:"XEM YÊU CẦU"},
    th:{title:"เงื่อนไขเลื่อนระดับ",current:"ปัจจุบัน",required:"ต้องการ",congrats:"ยินดีด้วย คุณผ่านเงื่อนไขการเลื่อนระดับแล้ว",body:"โปรดส่งคำขอที่กระดานคำขอ",request:"ขอเลื่อนระดับ",pending:"มีคำขอเลื่อนระดับที่รอดำเนินการอยู่แล้ว",view:"ดูคำขอ"},
    pt:{title:"Requisitos de promoção",current:"Atual",required:"Necessário",congrats:"Parabéns! Você atingiu os requisitos de promoção.",body:"Envie o pedido no Quadro de Pedidos.",request:"PEDIR PROMOÇÃO",pending:"Já existe um pedido de promoção pendente.",view:"VER PEDIDO"},
    ar:{title:"شروط الترقية",current:"الحالي",required:"المطلوب",congrats:"تهانينا، لقد حققت شروط الترقية.",body:"يرجى إرسال طلب الترقية في لوحة الطلبات.",request:"طلب الترقية",pending:"يوجد طلب ترقية قيد الانتظار بالفعل.",view:"عرض الطلب"}
  };
Object.assign(PROMOTION_LABELS,{
  fr:{title:'Conditions de promotion',current:'Actuel',required:'Requis',congrats:'Félicitations ! Vous remplissez les conditions de promotion.',body:'Veuillez envoyer votre demande de promotion sur le tableau des demandes.',request:'DEMANDER UNE PROMOTION',pending:'Une demande de promotion est déjà en attente.',view:'VOIR LA DEMANDE'},
  de:{title:'Aufstiegsbedingungen',current:'Aktuell',required:'Erforderlich',congrats:'Glückwunsch! Du erfüllst die Aufstiegsbedingungen.',body:'Bitte stelle deinen Aufstiegsantrag im Anfragebereich.',request:'AUFSTIEG BEANTRAGEN',pending:'Ein Aufstiegsantrag wartet bereits auf Bearbeitung.',view:'ANTRAG ANSEHEN'},
  es:{title:'Requisitos de ascenso',current:'Actual',required:'Necesario',congrats:'¡Felicidades! Cumples los requisitos de ascenso.',body:'Envía tu solicitud de ascenso en el tablón de solicitudes.',request:'SOLICITAR ASCENSO',pending:'Ya hay una solicitud de ascenso pendiente.',view:'VER SOLICITUD'},
  tr:{title:'Terfi koşulları',current:'Mevcut',required:'Gerekli',congrats:'Tebrikler! Terfi koşullarını karşıladınız.',body:'Terfi talebinizi İstek Panosu üzerinden gönderin.',request:'TERFİ TALEP ET',pending:'Zaten bekleyen bir terfi talebiniz var.',view:'TALEBİ GÖR'},
  it:{title:'Requisiti di promozione',current:'Attuale',required:'Richiesto',congrats:'Congratulazioni! Hai soddisfatto i requisiti di promozione.',body:'Invia la richiesta di promozione nella bacheca delle richieste.',request:'RICHIEDI PROMOZIONE',pending:'È già presente una richiesta di promozione in attesa.',view:'VEDI RICHIESTA'},
  id:{title:'Syarat kenaikan peringkat',current:'Saat ini',required:'Diperlukan',congrats:'Selamat! Anda memenuhi syarat kenaikan peringkat.',body:'Kirim permintaan kenaikan peringkat melalui Papan Permintaan.',request:'AJUKAN KENAIKAN',pending:'Sudah ada permintaan kenaikan peringkat yang menunggu.',view:'LIHAT PERMINTAAN'}
});

  const ACTIVITY_LABELS={
    ko:{title:"최근 14일 활동",vote:"투표 참여",visit:"사이트 방문",spec:"본인 스펙 업데이트",admin:"운영진 활동 확인",times:"회",days:"일",required:"필요",confirmed:"확인 완료",unconfirmed:"미확인",met:"승급 활동 조건을 달성했습니다.",need:n=>`활동 조건이 ${n}개 더 필요합니다.`,last:"최근 업데이트",none:"업데이트 기록 없음",unchanged:"변경된 내용이 없습니다."},
    en:{title:"Activity in the last 14 days",vote:"Vote participation",visit:"Site visits",spec:"My spec update",admin:"Leader activity confirmation",times:"times",days:"days",required:"Required",confirmed:"Confirmed",unconfirmed:"Not confirmed",met:"Promotion activity requirements met.",need:n=>`${n} more activity requirement${n>1?'s':''} needed.`,last:"Last updated",none:"No update record",unchanged:"No changes were found."},
    ja:{title:"最近14日間の活動",vote:"投票参加",visit:"サイト訪問",spec:"本人によるスペック更新",admin:"運営チームの活動確認",times:"回",days:"日",required:"必要",confirmed:"確認済み",unconfirmed:"未確認",met:"昇級の活動条件を達成しました。",need:n=>`活動条件があと${n}件必要です。`,last:"最終更新",none:"更新履歴なし",unchanged:"変更内容はありません。"},
    "zh-tw":{title:"最近 14 天活動",vote:"投票參與",visit:"網站造訪",spec:"本人規格更新",admin:"管理團隊活動確認",times:"次",days:"天",required:"需要",confirmed:"已確認",unconfirmed:"未確認",met:"已達成晉級活動條件。",need:n=>`還需要 ${n} 項活動條件。`,last:"最近更新",none:"沒有更新紀錄",unchanged:"沒有變更內容。"},
    vi:{title:"Hoạt động trong 14 ngày gần nhất",vote:"Tham gia bỏ phiếu",visit:"Truy cập trang web",spec:"Tự cập nhật thông số",admin:"Xác nhận hoạt động từ ban quản lý",times:"lần",days:"ngày",required:"Cần",confirmed:"Đã xác nhận",unconfirmed:"Chưa xác nhận",met:"Đã đạt điều kiện hoạt động thăng hạng.",need:n=>`Cần thêm ${n} điều kiện hoạt động.`,last:"Cập nhật gần nhất",none:"Chưa có lịch sử cập nhật",unchanged:"Không có thay đổi."},
    th:{title:"กิจกรรมใน 14 วันที่ผ่านมา",vote:"เข้าร่วมโหวต",visit:"เยี่ยมชมเว็บไซต์",spec:"อัปเดตสเปกด้วยตนเอง",admin:"การยืนยันกิจกรรมโดยทีมบริหาร",times:"ครั้ง",days:"วัน",required:"ต้องการ",confirmed:"ยืนยันแล้ว",unconfirmed:"ยังไม่ยืนยัน",met:"ผ่านเงื่อนไขกิจกรรมสำหรับเลื่อนระดับแล้ว",need:n=>`ต้องการเงื่อนไขกิจกรรมเพิ่มอีก ${n} รายการ`,last:"อัปเดตล่าสุด",none:"ไม่มีประวัติการอัปเดต",unchanged:"ไม่มีข้อมูลที่เปลี่ยนแปลง"},
    pt:{title:"Atividade nos últimos 14 dias",vote:"Participação em votações",visit:"Visitas ao site",spec:"Atualização própria de atributos",admin:"Confirmação de atividade pela liderança",times:"vezes",days:"dias",required:"Necessário",confirmed:"Confirmado",unconfirmed:"Não confirmado",met:"Requisitos de atividade para promoção atingidos.",need:n=>`Falta${n>1?'m':''} ${n} requisito${n>1?'s':''} de atividade.`,last:"Última atualização",none:"Sem registro de atualização",unchanged:"Nenhuma alteração encontrada."},
    ar:{title:"النشاط خلال آخر 14 يومًا",vote:"المشاركة في التصويت",visit:"زيارة الموقع",spec:"تحديث المواصفات ذاتيًا",admin:"تأكيد النشاط من الإدارة",times:"مرات",days:"أيام",required:"المطلوب",confirmed:"تم التأكيد",unconfirmed:"غير مؤكد",met:"تم استيفاء شروط نشاط الترقية.",need:n=>`تحتاج إلى ${n} من شروط النشاط الإضافية.`,last:"آخر تحديث",none:"لا يوجد سجل تحديث",unchanged:"لا توجد تغييرات."}
  };
Object.assign(ACTIVITY_LABELS,{
  fr:{title:'Activité des 14 derniers jours',vote:'Participation aux votes',visit:'Visites du site',spec:'Mise à jour de mes caractéristiques',admin:'Confirmation d’activité par la direction',times:'fois',days:'jours',required:'Requis',confirmed:'Confirmé',unconfirmed:'Non confirmé',met:'Conditions d’activité pour la promotion remplies.',need:n=>`${n} condition${n>1?'s':''} d’activité supplémentaire${n>1?'s':''} requise${n>1?'s':''}.`,last:'Dernière mise à jour',none:'Aucune mise à jour',unchanged:'Aucune modification détectée.'},
  de:{title:'Aktivität der letzten 14 Tage',vote:'Teilnahme an Abstimmungen',visit:'Website-Besuche',spec:'Eigene Werte aktualisiert',admin:'Aktivitätsbestätigung durch die Leitung',times:'Mal',days:'Tage',required:'Erforderlich',confirmed:'Bestätigt',unconfirmed:'Nicht bestätigt',met:'Aktivitätsbedingungen für den Aufstieg erfüllt.',need:n=>`Noch ${n} Aktivitätsbedingung${n===1?'':'en'} erforderlich.`,last:'Zuletzt aktualisiert',none:'Kein Aktualisierungsverlauf',unchanged:'Keine Änderungen gefunden.'},
  es:{title:'Actividad de los últimos 14 días',vote:'Participación en votaciones',visit:'Visitas al sitio',spec:'Actualización de mis estadísticas',admin:'Confirmación de actividad por la dirección',times:'veces',days:'días',required:'Necesario',confirmed:'Confirmado',unconfirmed:'Sin confirmar',met:'Se cumplen los requisitos de actividad para el ascenso.',need:n=>`Faltan ${n} requisito${n===1?'':'s'} de actividad.`,last:'Última actualización',none:'Sin historial de actualizaciones',unchanged:'No se encontraron cambios.'},
  tr:{title:'Son 14 gündeki etkinlik',vote:'Oylamaya katılım',visit:'Site ziyaretleri',spec:'Kendi özelliklerini güncelleme',admin:'Yönetim etkinlik onayı',times:'kez',days:'gün',required:'Gerekli',confirmed:'Onaylandı',unconfirmed:'Onaylanmadı',met:'Terfi etkinlik koşulları karşılandı.',need:n=>`${n} etkinlik koşulu daha gerekiyor.`,last:'Son güncelleme',none:'Güncelleme kaydı yok',unchanged:'Değişiklik bulunamadı.'},
  it:{title:'Attività negli ultimi 14 giorni',vote:'Partecipazione alle votazioni',visit:'Visite al sito',spec:'Aggiornamento delle mie statistiche',admin:'Conferma attività da parte della dirigenza',times:'volte',days:'giorni',required:'Richiesto',confirmed:'Confermato',unconfirmed:'Non confermato',met:'Requisiti di attività per la promozione soddisfatti.',need:n=>`Servono ancora ${n} requisito${n===1?'':'i'} di attività.`,last:'Ultimo aggiornamento',none:'Nessun aggiornamento registrato',unchanged:'Nessuna modifica rilevata.'},
  id:{title:'Aktivitas 14 hari terakhir',vote:'Partisipasi pemungutan suara',visit:'Kunjungan situs',spec:'Pembaruan statistik sendiri',admin:'Konfirmasi aktivitas oleh pengurus',times:'kali',days:'hari',required:'Diperlukan',confirmed:'Dikonfirmasi',unconfirmed:'Belum dikonfirmasi',met:'Syarat aktivitas untuk kenaikan peringkat terpenuhi.',need:n=>`Masih perlu ${n} syarat aktivitas.`,last:'Pembaruan terakhir',none:'Tidak ada riwayat pembaruan',unchanged:'Tidak ada perubahan.'}
});

  const MAINTENANCE_LABELS={
    ko:{title:"등급 유지 상태",guide:"최근 30일 활동 조건을 2개 이상 충족해야 현재 등급이 유지됩니다.",vote:"투표 참여",visit:"사이트 방문",spec:"본인 스펙 업데이트",admin:"운영진 활동 확인",times:"회",days:"일",confirmed:"확인 완료",unconfirmed:"미확인",last:"최근",none:"기록 없음",met:"등급 유지 조건을 충족했습니다.",need:"최근 30일 활동이 부족합니다. 등급 유지 조건을 확인해 주세요.",protection:"등급 유지 보호 기간",expand:"보호 기간 상세 보기",collapse:"보호 기간 상세 접기",promotionProtect:d=>`승급 후 10일 동안 강등 검토 대상에서 제외됩니다. · ${d}까지`,demotionProtect:d=>`강등 후 30일 동안 추가 강등 검토 대상에서 제외됩니다. · ${d}까지`,exclusion:d=>`표시된 날짜까지 등급 유지 검토에서 제외됩니다. · ${d}까지`},
    en:{title:"Rank maintenance status",guide:"Meet at least 2 activity requirements in the last 30 days to maintain your current rank.",vote:"Vote participation",visit:"Site visits",spec:"My spec update",admin:"Leader activity confirmation",times:"times",days:"days",confirmed:"Confirmed",unconfirmed:"Not confirmed",last:"Latest",none:"No record",met:"Rank maintenance requirements met.",need:"Activity in the last 30 days is insufficient. Please review the rank maintenance requirements.",protection:"Rank protection period",expand:"Show protection details",collapse:"Hide protection details",promotionProtect:d=>`Excluded from demotion review for 10 days after promotion · Until ${d}`,demotionProtect:d=>`Excluded from further demotion review for 30 days after demotion · Until ${d}`,exclusion:d=>`Excluded from rank maintenance review until ${d}`},
    ja:{title:"ランク維持状況",guide:"現在のランクを維持するには、過去30日間の活動条件を2つ以上満たす必要があります。",vote:"投票参加",visit:"サイト訪問",spec:"本人によるスペック更新",admin:"運営チームの活動確認",times:"回",days:"日",confirmed:"確認済み",unconfirmed:"未確認",last:"最新",none:"記録なし",met:"ランク維持条件を満たしています。",need:"過去30日間の活動が不足しています。ランク維持条件を確認してください。",protection:"ランク保護期間",expand:"保護期間の詳細を表示",collapse:"保護期間の詳細を閉じる",promotionProtect:d=>`昇級後10日間は降格審査の対象外です · ${d}まで`,demotionProtect:d=>`降格後30日間は追加の降格審査の対象外です · ${d}まで`,exclusion:d=>`${d}までランク維持審査の対象外です`},
    "zh-tw":{title:"等級維持狀態",guide:"最近30天內須達成至少2項活動條件，才能維持目前等級。",vote:"投票參與",visit:"網站造訪",spec:"本人規格更新",admin:"管理團隊活動確認",times:"次",days:"天",confirmed:"已確認",unconfirmed:"未確認",last:"最近",none:"沒有紀錄",met:"已達成等級維持條件。",need:"最近30天的活動不足，請確認等級維持條件。",protection:"等級保護期間",expand:"顯示保護期詳情",collapse:"收合保護期詳情",promotionProtect:d=>`晉級後10天內不列入降級審查 · 至 ${d}`,demotionProtect:d=>`降級後30天內不列入再次降級審查 · 至 ${d}`,exclusion:d=>`至 ${d} 前不列入等級維持審查`},
    vi:{title:"Trạng thái duy trì hạng",guide:"Cần đạt ít nhất 2 điều kiện hoạt động trong 30 ngày gần nhất để duy trì hạng hiện tại.",vote:"Tham gia bỏ phiếu",visit:"Truy cập trang web",spec:"Tự cập nhật thông số",admin:"Xác nhận hoạt động từ ban quản lý",times:"lần",days:"ngày",confirmed:"Đã xác nhận",unconfirmed:"Chưa xác nhận",last:"Gần nhất",none:"Không có dữ liệu",met:"Đã đạt điều kiện duy trì hạng.",need:"Hoạt động trong 30 ngày gần nhất chưa đủ. Vui lòng kiểm tra điều kiện duy trì hạng.",protection:"Thời gian bảo vệ hạng",expand:"Xem chi tiết thời gian bảo vệ",collapse:"Thu gọn chi tiết bảo vệ",promotionProtect:d=>`Không bị xét giáng hạng trong 10 ngày sau khi thăng hạng · Đến ${d}`,demotionProtect:d=>`Không bị xét giáng hạng thêm trong 30 ngày sau khi giáng hạng · Đến ${d}`,exclusion:d=>`Không bị xét duy trì hạng đến ${d}`},
    th:{title:"สถานะการรักษาระดับ",guide:"ต้องผ่านเงื่อนไขกิจกรรมอย่างน้อย 2 ข้อใน 30 วันที่ผ่านมาเพื่อรักษาระดับปัจจุบัน",vote:"เข้าร่วมโหวต",visit:"เยี่ยมชมเว็บไซต์",spec:"อัปเดตสเปกด้วยตนเอง",admin:"การยืนยันกิจกรรมโดยทีมบริหาร",times:"ครั้ง",days:"วัน",confirmed:"ยืนยันแล้ว",unconfirmed:"ยังไม่ยืนยัน",last:"ล่าสุด",none:"ไม่มีข้อมูล",met:"ผ่านเงื่อนไขการรักษาระดับแล้ว",need:"กิจกรรมใน 30 วันที่ผ่านมายังไม่เพียงพอ โปรดตรวจสอบเงื่อนไขการรักษาระดับ",protection:"ช่วงคุ้มครองระดับ",expand:"ดูรายละเอียดช่วงคุ้มครอง",collapse:"ซ่อนรายละเอียดช่วงคุ้มครอง",promotionProtect:d=>`ไม่ถูกพิจารณาลดระดับเป็นเวลา 10 วันหลังเลื่อนระดับ · ถึง ${d}`,demotionProtect:d=>`ไม่ถูกพิจารณาลดระดับเพิ่มเติมเป็นเวลา 30 วันหลังลดระดับ · ถึง ${d}`,exclusion:d=>`ไม่ถูกพิจารณาการรักษาระดับจนถึง ${d}`},
    pt:{title:"Status de manutenção da patente",guide:"Cumpra pelo menos 2 requisitos de atividade nos últimos 30 dias para manter a patente atual.",vote:"Participação em votações",visit:"Visitas ao site",spec:"Atualização própria de atributos",admin:"Confirmação de atividade pela liderança",times:"vezes",days:"dias",confirmed:"Confirmado",unconfirmed:"Não confirmado",last:"Mais recente",none:"Sem registro",met:"Requisitos de manutenção da patente atingidos.",need:"A atividade nos últimos 30 dias é insuficiente. Verifique os requisitos de manutenção da patente.",protection:"Período de proteção da patente",expand:"Mostrar detalhes da proteção",collapse:"Ocultar detalhes da proteção",promotionProtect:d=>`Fora da revisão de rebaixamento por 10 dias após a promoção · Até ${d}`,demotionProtect:d=>`Fora de nova revisão de rebaixamento por 30 dias após o rebaixamento · Até ${d}`,exclusion:d=>`Fora da revisão de manutenção da patente até ${d}`},
    ar:{title:"حالة الحفاظ على الرتبة",guide:"يجب استيفاء شرطين على الأقل من شروط النشاط خلال آخر 30 يومًا للحفاظ على الرتبة الحالية.",vote:"المشاركة في التصويت",visit:"زيارة الموقع",spec:"تحديث المواصفات ذاتيًا",admin:"تأكيد النشاط من الإدارة",times:"مرات",days:"أيام",confirmed:"تم التأكيد",unconfirmed:"غير مؤكد",last:"الأحدث",none:"لا يوجد سجل",met:"تم استيفاء شروط الحفاظ على الرتبة.",need:"النشاط خلال آخر 30 يومًا غير كافٍ. يرجى مراجعة شروط الحفاظ على الرتبة.",protection:"فترة حماية الرتبة",expand:"عرض تفاصيل فترة الحماية",collapse:"إخفاء تفاصيل فترة الحماية",promotionProtect:d=>`مستبعد من مراجعة خفض الرتبة لمدة 10 أيام بعد الترقية · حتى ${d}`,demotionProtect:d=>`مستبعد من مراجعة خفض إضافية لمدة 30 يومًا بعد خفض الرتبة · حتى ${d}`,exclusion:d=>`مستبعد من مراجعة الحفاظ على الرتبة حتى ${d}`}
  };
Object.assign(MAINTENANCE_LABELS,{
  fr:{title:'Maintien du rang',guide:'Remplissez au moins 2 conditions d’activité sur les 30 derniers jours pour conserver votre rang actuel.',vote:'Participation aux votes',visit:'Visites du site',spec:'Mise à jour de mes caractéristiques',admin:'Confirmation d’activité par la direction',times:'fois',days:'jours',confirmed:'Confirmé',unconfirmed:'Non confirmé',last:'Dernier',none:'Aucun enregistrement',met:'Conditions de maintien du rang remplies.',need:'L’activité des 30 derniers jours est insuffisante. Vérifiez les conditions de maintien du rang.',protection:'Période de protection du rang',expand:'Afficher les détails de la protection',collapse:'Masquer les détails de la protection',promotionProtect:d=>`Exclu de l’examen de rétrogradation pendant 10 jours après la promotion · Jusqu’au ${d}`,demotionProtect:d=>`Exclu d’un nouvel examen de rétrogradation pendant 30 jours après une rétrogradation · Jusqu’au ${d}`,exclusion:d=>`Exclu de l’examen de maintien du rang jusqu’au ${d}`},
  de:{title:'Rangerhalt',guide:'Erfülle in den letzten 30 Tagen mindestens 2 Aktivitätsbedingungen, um deinen aktuellen Rang zu behalten.',vote:'Teilnahme an Abstimmungen',visit:'Website-Besuche',spec:'Eigene Werte aktualisiert',admin:'Aktivitätsbestätigung durch die Leitung',times:'Mal',days:'Tage',confirmed:'Bestätigt',unconfirmed:'Nicht bestätigt',last:'Zuletzt',none:'Kein Eintrag',met:'Bedingungen für den Rangerhalt erfüllt.',need:'Die Aktivität der letzten 30 Tage reicht nicht aus. Bitte prüfe die Bedingungen für den Rangerhalt.',protection:'Rangschutzzeitraum',expand:'Schutzdetails anzeigen',collapse:'Schutzdetails ausblenden',promotionProtect:d=>`10 Tage nach dem Aufstieg von der Abstiegsprüfung ausgenommen · Bis ${d}`,demotionProtect:d=>`30 Tage nach einem Abstieg von einer weiteren Abstiegsprüfung ausgenommen · Bis ${d}`,exclusion:d=>`Bis ${d} von der Rangerhalt-Prüfung ausgenommen`},
  es:{title:'Estado de mantenimiento de rango',guide:'Cumple al menos 2 requisitos de actividad en los últimos 30 días para mantener tu rango actual.',vote:'Participación en votaciones',visit:'Visitas al sitio',spec:'Actualización de mis estadísticas',admin:'Confirmación de actividad por la dirección',times:'veces',days:'días',confirmed:'Confirmado',unconfirmed:'Sin confirmar',last:'Más reciente',none:'Sin registro',met:'Se cumplen los requisitos para mantener el rango.',need:'La actividad de los últimos 30 días es insuficiente. Revisa los requisitos para mantener el rango.',protection:'Periodo de protección de rango',expand:'Mostrar detalles de protección',collapse:'Ocultar detalles de protección',promotionProtect:d=>`Excluido de la revisión de descenso durante 10 días tras el ascenso · Hasta ${d}`,demotionProtect:d=>`Excluido de otra revisión de descenso durante 30 días tras un descenso · Hasta ${d}`,exclusion:d=>`Excluido de la revisión de mantenimiento de rango hasta ${d}`},
  tr:{title:'Rütbe koruma durumu',guide:'Mevcut rütbenizi korumak için son 30 günde en az 2 etkinlik koşulunu karşılayın.',vote:'Oylamaya katılım',visit:'Site ziyaretleri',spec:'Kendi özelliklerini güncelleme',admin:'Yönetim etkinlik onayı',times:'kez',days:'gün',confirmed:'Onaylandı',unconfirmed:'Onaylanmadı',last:'En son',none:'Kayıt yok',met:'Rütbe koruma koşulları karşılandı.',need:'Son 30 gündeki etkinlik yetersiz. Rütbe koruma koşullarını kontrol edin.',protection:'Rütbe koruma süresi',expand:'Koruma ayrıntılarını göster',collapse:'Koruma ayrıntılarını gizle',promotionProtect:d=>`Terfiden sonra 10 gün boyunca rütbe düşürme değerlendirmesi dışında · ${d} tarihine kadar`,demotionProtect:d=>`Rütbe düşürmeden sonra 30 gün boyunca ek değerlendirme dışında · ${d} tarihine kadar`,exclusion:d=>`${d} tarihine kadar rütbe koruma değerlendirmesi dışında`},
  it:{title:'Mantenimento del grado',guide:'Soddisfa almeno 2 requisiti di attività negli ultimi 30 giorni per mantenere il grado attuale.',vote:'Partecipazione alle votazioni',visit:'Visite al sito',spec:'Aggiornamento delle mie statistiche',admin:'Conferma attività da parte della dirigenza',times:'volte',days:'giorni',confirmed:'Confermato',unconfirmed:'Non confermato',last:'Più recente',none:'Nessun dato',met:'Requisiti di mantenimento del grado soddisfatti.',need:'L’attività degli ultimi 30 giorni non è sufficiente. Controlla i requisiti di mantenimento del grado.',protection:'Periodo di protezione del grado',expand:'Mostra dettagli protezione',collapse:'Nascondi dettagli protezione',promotionProtect:d=>`Escluso dalla verifica di retrocessione per 10 giorni dopo la promozione · Fino al ${d}`,demotionProtect:d=>`Escluso da ulteriori verifiche di retrocessione per 30 giorni dopo una retrocessione · Fino al ${d}`,exclusion:d=>`Escluso dalla verifica di mantenimento del grado fino al ${d}`},
  id:{title:'Status pemeliharaan peringkat',guide:'Penuhi minimal 2 syarat aktivitas dalam 30 hari terakhir untuk mempertahankan peringkat saat ini.',vote:'Partisipasi pemungutan suara',visit:'Kunjungan situs',spec:'Pembaruan statistik sendiri',admin:'Konfirmasi aktivitas oleh pengurus',times:'kali',days:'hari',confirmed:'Dikonfirmasi',unconfirmed:'Belum dikonfirmasi',last:'Terbaru',none:'Tidak ada catatan',met:'Syarat pemeliharaan peringkat terpenuhi.',need:'Aktivitas dalam 30 hari terakhir belum cukup. Periksa syarat pemeliharaan peringkat.',protection:'Masa perlindungan peringkat',expand:'Tampilkan detail perlindungan',collapse:'Sembunyikan detail perlindungan',promotionProtect:d=>`Dikecualikan dari evaluasi penurunan peringkat selama 10 hari setelah naik peringkat · Hingga ${d}`,demotionProtect:d=>`Dikecualikan dari evaluasi penurunan lanjutan selama 30 hari setelah turun peringkat · Hingga ${d}`,exclusion:d=>`Dikecualikan dari evaluasi pemeliharaan peringkat hingga ${d}`}
});

  const RANK_CHANGE_LABELS={
    ko:{title:"등급이 변경되었습니다.",body:(a,b)=>`${a}에서 ${b}로 변경되었습니다.`,date:"등급 변경일",help:"자세한 내용은 운영진에게 문의해 주세요.",dismiss:"다시 보지 않기"},
    en:{title:"Your rank has changed.",body:(a,b)=>`Changed from ${a} to ${b}.`,date:"Rank change date",help:"Please contact the leadership team for details.",dismiss:"Don't show again"},
    ja:{title:"ランクが変更されました。",body:(a,b)=>`${a}から${b}に変更されました。`,date:"ランク変更日",help:"詳細は運営チームにお問い合わせください。",dismiss:"今後表示しない"},
    "zh-tw":{title:"您的等級已變更。",body:(a,b)=>`已從 ${a} 變更為 ${b}。`,date:"等級變更日期",help:"詳情請洽管理團隊。",dismiss:"不再顯示"},
    vi:{title:"Hạng của bạn đã thay đổi.",body:(a,b)=>`Đã đổi từ ${a} sang ${b}.`,date:"Ngày đổi hạng",help:"Vui lòng liên hệ ban quản lý để biết chi tiết.",dismiss:"Không hiển thị lại"},
    th:{title:"ระดับของคุณมีการเปลี่ยนแปลง",body:(a,b)=>`เปลี่ยนจาก ${a} เป็น ${b}`,date:"วันที่เปลี่ยนระดับ",help:"โปรดติดต่อทีมบริหารเพื่อสอบถามรายละเอียด",dismiss:"ไม่ต้องแสดงอีก"},
    pt:{title:"Sua patente foi alterada.",body:(a,b)=>`Alterada de ${a} para ${b}.`,date:"Data da alteração",help:"Entre em contato com a liderança para mais detalhes.",dismiss:"Não mostrar novamente"},
    ar:{title:"تم تغيير رتبتك.",body:(a,b)=>`تم التغيير من ${a} إلى ${b}.`,date:"تاريخ تغيير الرتبة",help:"يرجى التواصل مع الإدارة لمزيد من التفاصيل.",dismiss:"عدم الإظهار مرة أخرى"}
  };
Object.assign(RANK_CHANGE_LABELS,{
  fr:{title:'Votre rang a changé.',body:(a,b)=>`Passage de ${a} à ${b}.`,date:'Date du changement de rang',help:'Contactez l’équipe de direction pour plus de détails.',dismiss:'Ne plus afficher'},
  de:{title:'Dein Rang wurde geändert.',body:(a,b)=>`Von ${a} zu ${b} geändert.`,date:'Datum der Rangänderung',help:'Bitte wende dich für Details an die Leitung.',dismiss:'Nicht mehr anzeigen'},
  es:{title:'Tu rango ha cambiado.',body:(a,b)=>`Cambió de ${a} a ${b}.`,date:'Fecha del cambio de rango',help:'Contacta con el equipo de dirección para más detalles.',dismiss:'No volver a mostrar'},
  tr:{title:'Rütbeniz değişti.',body:(a,b)=>`${a} rütbesinden ${b} rütbesine değiştirildi.`,date:'Rütbe değişim tarihi',help:'Ayrıntılar için yönetim ekibiyle iletişime geçin.',dismiss:'Bir daha gösterme'},
  it:{title:'Il tuo grado è cambiato.',body:(a,b)=>`Modificato da ${a} a ${b}.`,date:'Data modifica grado',help:'Contatta la dirigenza per maggiori dettagli.',dismiss:'Non mostrare più'},
  id:{title:'Peringkat Anda telah berubah.',body:(a,b)=>`Berubah dari ${a} menjadi ${b}.`,date:'Tanggal perubahan peringkat',help:'Hubungi tim pengurus untuk detail lebih lanjut.',dismiss:'Jangan tampilkan lagi'}
});


  function normalizeMemberRank(value){
    const rank = String(value || "R1").toUpperCase();
    return Object.prototype.hasOwnProperty.call(RANK_TITLES, rank) ? rank : "R1";
  }

  function rankLabel(value){
    const rank = normalizeMemberRank(value);
    return `${rank} · ${RANK_TITLES[rank]}`;
  }

  function applyRankStyle(element, value){
    if (!element) return;
    const rank = normalizeMemberRank(value);
    element.classList.remove("rank-r1", "rank-r2", "rank-r3", "rank-r4", "rank-r5");
    element.classList.add(`rank-${rank.toLowerCase()}`);
  }
  function applyLanguage(next){
    lang = normalize(next);
    document.documentElement.lang = lang === "zh-tw" ? "zh-Hant" : lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    const rq=requestLabels(); if($("#myRequestsLabel")) $("#myRequestsLabel").textContent=rq.label; if($("#myRequestsOpenBoard")) $("#myRequestsOpenBoard").textContent=rq.open;
    renderMember();
  }
  function showToast(message, type="success"){
    const toast = $("#toast");
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { toast.hidden = true; }, 3200);
  }
  async function api(path, options={}){
    const response = await fetch(path, {
      credentials:"include",
      headers:{"accept":"application/json", ...(options.body ? {"content-type":"application/json"} : {})},
      ...options
    });
    let payload = null;
    try { payload = await response.json(); } catch (_) {}
    if (!response.ok || !payload?.ok) {
      const error = new Error(payload?.code || "REQUEST_FAILED");
      error.code = payload?.code || "REQUEST_FAILED";
      error.payload = payload;
      throw error;
    }
    return payload;
  }
  function formatPower(value){ return Number(value || 0).toLocaleString(lang === "ko" ? "ko-KR" : undefined); }
  function powerDigits(value){ return String(value ?? "").replace(/\D/g, ""); }
  function formatPowerInput(value){
    const digits = powerDigits(value).replace(/^0+(?=\d)/, "");
    return digits ? Number(digits).toLocaleString("en-US") : "";
  }
  function parsePowerInput(value){
    const digits = powerDigits(value);
    return digits ? Number(digits) : NaN;
  }
  function formatDate(value){
    if (!value) return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : new Intl.DateTimeFormat(lang === "zh-tw" ? "zh-TW" : lang, {dateStyle:"medium",timeStyle:"short"}).format(d);
  }
  function formatDateOnly(value){
    if(!value)return "-";
    const d=new Date(String(value).includes("T")?value:String(value).replace(" ","T")+"Z");
    return Number.isNaN(d.getTime())?String(value):new Intl.DateTimeFormat(lang==="zh-tw"?"zh-TW":lang,{dateStyle:"medium",timeZone:"Asia/Seoul"}).format(d);
  }
  function remainingDays(value){const raw=String(value||''),parsed=/Z$|[+-]\d\d:?\d\d$/.test(raw)?raw:raw.replace(' ','T')+'Z',n=Math.ceil((new Date(parsed).getTime()-Date.now())/86400000);return Number.isFinite(n)?`D-${Math.max(0,n)}`:""}
  function localizedActivityUnit(type,count,labels){if(lang==='pt')return type==='days'?(count===1?'dia':'dias'):(count===1?'vez':'vezes');if(lang==='en')return type==='days'?(count===1?'day':'days'):(count===1?'time':'times');return type==='days'?labels.days:labels.times}
  function setValue(form, name, value){ if (form.elements[name]) form.elements[name].value = value ?? ""; }
  const REQUEST_LABELS={ko:{label:"내 요청글",open:"요청 게시판 열기",empty:"작성한 요청글이 없습니다.",waiting:"답변 대기",answered:"답변 완료"},en:{label:"My Requests",open:"OPEN REQUEST BOARD",empty:"You have no requests.",waiting:"Waiting",answered:"Answered"},ja:{label:"自分のリクエスト",open:"掲示板を開く",empty:"作成したリクエストはありません。",waiting:"回答待ち",answered:"回答済み"},"zh-tw":{label:"我的請求",open:"開啟請求留言板",empty:"沒有已提交的請求。",waiting:"等待回覆",answered:"已回覆"},vi:{label:"Yêu cầu của tôi",open:"MỞ BẢNG YÊU CẦU",empty:"Bạn chưa có yêu cầu.",waiting:"Đang chờ",answered:"Đã trả lời"},th:{label:"คำขอของฉัน",open:"เปิดกระดานคำขอ",empty:"ยังไม่มีคำขอ",waiting:"รอคำตอบ",answered:"ตอบแล้ว"},pt:{label:"Meus Pedidos",open:"ABRIR QUADRO",empty:"Você não possui pedidos.",waiting:"Aguardando",answered:"Respondido"},ar:{label:"طلباتي",open:"فتح لوحة الطلبات",empty:"لا توجد طلبات مكتوبة.",waiting:"بانتظار الرد",answered:"تم الرد"}};
Object.assign(REQUEST_LABELS,{
  fr:{label:'Mes demandes',open:'OUVRIR LE TABLEAU DES DEMANDES',empty:'Vous n’avez aucune demande.',waiting:'En attente',answered:'Répondu'},
  de:{label:'Meine Anfragen',open:'ANFRAGEBEREICH ÖFFNEN',empty:'Du hast keine Anfragen.',waiting:'Wartet auf Antwort',answered:'Beantwortet'},
  es:{label:'Mis solicitudes',open:'ABRIR TABLÓN DE SOLICITUDES',empty:'No tienes solicitudes.',waiting:'Esperando respuesta',answered:'Respondida'},
  tr:{label:'İsteklerim',open:'İSTEK PANOSUNU AÇ',empty:'Henüz isteğiniz yok.',waiting:'Yanıt bekliyor',answered:'Yanıtlandı'},
  it:{label:'Le mie richieste',open:'APRI BACHECA RICHIESTE',empty:'Non hai richieste.',waiting:'In attesa',answered:'Risposta ricevuta'},
  id:{label:'Permintaan saya',open:'BUKA PAPAN PERMINTAAN',empty:'Anda belum memiliki permintaan.',waiting:'Menunggu jawaban',answered:'Dijawab'}
});

  function requestLabels(){return REQUEST_LABELS[lang]||REQUEST_LABELS.en}
  async function loadMyRequests(){const box=$("#myRequestsList");if(!box)return;box.innerHTML='<p class="form-note">...</p>';try{const payload=await api('/api/requests?mine=1&page=1&limit=20');const items=payload.data?.items||[],r=requestLabels();box.innerHTML=items.length?items.map(x=>`<a class="my-request-item" href="../request/"><strong>${String(x.title||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}</strong><span class="${x.answered?'answered':''}">${x.answered?r.answered:r.waiting}</span></a>`).join(''):`<p class="form-note">${r.empty}</p>`}catch(e){box.innerHTML=`<p class="form-note">${t('failed')}</p>`}}

  function renderMember(){
    if (!memberData) return;
    const m = memberData.member, s = memberData.specs || {};
    renderPromotion(memberData.promotion);
    renderRankMaintenance(memberData.rankMaintenance);
    renderRankChangeNotice(memberData.rankChangeNotice);
    $("#summaryNickname").textContent = m.nickname;
    const profileRegistered = m.profileSpecsRegistered !== false && m.power != null && m.industryLevel;
    $("#summaryPower").textContent = profileRegistered ? formatPower(m.power) : "-";
    $("#summaryIndustry").textContent = profileRegistered ? m.industryLevel : "-";
    const role = $("#summaryRole");
    role.textContent = rankLabel(m.memberRank);
    role.classList.toggle("admin", normalizeMemberRank(m.memberRank) === "R5");
    applyRankStyle(role, m.memberRank);
    applyRankStyle($("#summaryAvatar"), m.memberRank);
    applyRankStyle($("#profileMemberIcon"), m.memberRank);
    $("#profileLoginId").value = m.loginId;
    $("#profileNickname").value = m.nickname;
    const profilePowerInput = $("#specsProfilePower");
    if (profilePowerInput) profilePowerInput.value = profileRegistered ? formatPowerInput(m.power) : "";
    setValue($("#specsForm"),"industryLevel",profileRegistered ? m.industryLevel : "");
    $("#profileRankDisplay").value = rankLabel(m.memberRank);
    setValue($("#specsForm"),"vehicle1Class",s.vehicle1Class);
    setValue($("#specsForm"),"vehicle1PowerValue",s.vehicle1PowerValue);
    setValue($("#specsForm"),"vehicle1PowerUnit",s.vehicle1PowerUnit);
    setValue($("#specsForm"),"vehicle2Class",s.vehicle2Class);
    setValue($("#specsForm"),"vehicle2PowerValue",s.vehicle2PowerValue);
    setValue($("#specsForm"),"vehicle2PowerUnit",s.vehicle2PowerUnit);
    setValue($("#specsForm"),"seasonWarAvailable",s.seasonWarAvailable === null ? "" : (s.seasonWarAvailable ? "1" : "0"));
    setValue($("#specsForm"),"bgbAvailableHour",s.bgbAvailableHour);
    setValue($("#specsForm"),"discord",s.discord);
    setValue($("#specsForm"),"telegram",s.telegram);
    const activityText=ACTIVITY_LABELS[lang]||ACTIVITY_LABELS.en;
    $("#specLastUpdatedLabelV369").textContent=activityText.last;
    $("#specLastUpdatedV369").textContent=s.memberSelfUpdatedAt?formatDate(s.memberSelfUpdatedAt):activityText.none;
    $("#currentNickname").textContent = m.nickname;

    const availableAt = m.nicknameChangeAvailableAt ? Date.parse(m.nicknameChangeAvailableAt) : NaN;
    const available = m.firstNicknameChangeFree || !Number.isFinite(availableAt) || Date.now() >= availableAt;
    const badge = $("#nicknameBadge");
    badge.textContent = available ? t("available") : t("waiting");
    badge.className = `status-badge ${available ? "available" : "waiting"}`;
    $("#nextChangeRow").hidden = available;
    $("#nextChangeAt").textContent = available ? "-" : formatDate(m.nicknameChangeAvailableAt);
    $("#nicknameInput").disabled = !available;
    $("#nicknameSubmit").disabled = !available;
  }
  function renderPromotion(p){
    const card=$("#promotionCardV367");if(!card)return;card.hidden=!p;if(!p)return;
    const l=PROMOTION_LABELS[lang]||PROMOTION_LABELS.en,a=ACTIVITY_LABELS[lang]||ACTIVITY_LABELS.en,activity=p.activity;
    $("#promotionRouteV367").textContent=`${p.currentRank} → ${p.targetRank}`;$("#promotionTitleV367").textContent=l.title;$("#promotionCountV367").textContent=`${p.completed} / 2`;$("#promotionProgressV367").style.width=`${p.completed*50}%`;$("#promotionIndustryNameV375").textContent=t('industry');$("#promotionVehicleNameV375").textContent=t('vehicle1');
    $("#promotionIndustryCurrentLabelV372").textContent=l.current;$("#promotionIndustryRequiredLabelV372").textContent=l.required;$("#promotionVehicleCurrentLabelV372").textContent=l.current;$("#promotionVehicleRequiredLabelV372").textContent=l.required;
    $("#promotionIndustryCurrentV372").textContent=p.industry.current||'-';$("#promotionIndustryRequiredV372").textContent=p.industry.required;$("#promotionVehicleCurrentV372").textContent=p.vehicle1.currentNormalized==null?'-':(p.vehicle1.currentNormalized/1000).toFixed(2)+'G';$("#promotionVehicleRequiredV372").textContent=(p.vehicle1.requiredNormalized/1000).toFixed(1)+'G';
    $("#promotionIndustryRequiredV372").className=p.industry.passed?'passed':'failed';$("#promotionVehicleRequiredV372").className=p.vehicle1.passed?'passed':'failed';
    $("#promotionActivityTitleV369").textContent=a.title;$("#promotionActivityCountV369").textContent=`${activity.completed} / 4`;$("#activityVoteLabelV369").textContent=a.vote;$("#activityVisitLabelV369").textContent=a.visit;$("#activitySpecLabelV369").textContent=a.spec;$("#activityAdminLabelV369").textContent=a.admin;
    ['Vote','Visit','Spec'].forEach(key=>{$(`#activity${key}CurrentLabelV373`).textContent=l.current;$(`#activity${key}RequiredLabelV373`).textContent=a.required});
    const setActivity=(key,item,type)=>{const current=$(`#activity${key}CurrentV373`),required=$(`#activity${key}RequiredV373`);current.textContent=`${item.count} ${localizedActivityUnit(type,item.count,a)}`;required.textContent=`${item.required} ${localizedActivityUnit(type,item.required,a)}`;current.className=item.passed?'passed':'failed';required.className='required-value'};
    setActivity('Vote',activity.items.vote,'times');setActivity('Visit',activity.items.visit,'days');setActivity('Spec',activity.items.specUpdate,'times');const admin=$("#activityAdminV369");admin.textContent=activity.items.adminConfirmation.passed?a.confirmed:a.unconfirmed;admin.className=activity.items.adminConfirmation.passed?'passed':'failed';$("#promotionActivityMessageV369").textContent=activity.eligible?a.met:a.need(Math.max(0,activity.required-activity.completed));
    const done=$("#promotionCongratsV367");done.hidden=!p.eligible;if(p.eligible){$("#promotionCongratsTitleV367").textContent=l.congrats;$("#promotionCongratsBodyV367").textContent=p.pendingRequestId?l.pending:l.body;const link=$("#promotionRequestV367");link.textContent=p.pendingRequestId?l.view:l.request;link.href=p.pendingRequestId?`../request/#request-${p.pendingRequestId}`:`../request/?type=promotion&target=${p.targetRank}`}
  }
  function renderRankMaintenance(state){
    const card=$("#rankMaintenanceCardV371");if(!card)return;card.hidden=!state;if(!state)return;
    const l=MAINTENANCE_LABELS[lang]||MAINTENANCE_LABELS.en,a=state.activity,i=a.items;
    $("#maintenanceRankV371").textContent=state.currentRank;$("#maintenanceTitleV371").textContent=l.title;$("#maintenanceCountV371").textContent=`${a.completed} / 4`;$("#maintenanceProgressV371").style.width=`${a.completed*25}%`;$("#maintenanceGuideV371").textContent=l.guide;
    $("#maintenanceVoteLabelV371").textContent=l.vote;$("#maintenanceVisitLabelV371").textContent=l.visit;$("#maintenanceSpecLabelV371").textContent=l.spec;$("#maintenanceAdminLabelV371").textContent=l.admin;
    const set=(valueId,dateId,item,labelText,last)=>{const valueEl=$(valueId);valueEl.textContent=valueId.includes('Admin')?(item.passed?l.confirmed:l.unconfirmed):labelText;valueEl.className=item.passed?'passed':'failed';$(dateId).textContent=last?`${l.last} ${formatDateOnly(last)}`:l.none};
    set("#maintenanceVoteV371","#maintenanceVoteDateV371",i.vote,`${i.vote.count} ${localizedActivityUnit('times',i.vote.count,l)}`,i.vote.latestAt);
    set("#maintenanceVisitV371","#maintenanceVisitDateV371",i.visit,`${i.visit.count} ${localizedActivityUnit('days',i.visit.count,l)}`,i.visit.latestAt);
    set("#maintenanceSpecV371","#maintenanceSpecDateV371",i.specUpdate,`${i.specUpdate.count} ${localizedActivityUnit('times',i.specUpdate.count,l)}`,i.specUpdate.latestAt);
    set("#maintenanceAdminV371","#maintenanceAdminDateV371",i.adminConfirmation,"",i.adminConfirmation.confirmedAt);
    const box=$("#maintenanceProtectionV371"),protectedState=state.protection?.active||state.exclusion?.active;box.hidden=!protectedState;
    if(protectedState){const until=state.exclusion?.active?state.exclusion.until:state.protection.until,body=state.exclusion?.active?l.exclusion(formatDateOnly(until)):state.protection.type==='demotion'?l.demotionProtect(formatDateOnly(until)):l.promotionProtect(formatDateOnly(until)),expanded=localStorage.getItem(MAINTENANCE_PROTECTION_EXPANDED_KEY)==='1';$("#maintenanceProtectionTitleV371").textContent=`${l.protection} · ${remainingDays(until)}`;$("#maintenanceProtectionBodyV371").textContent=body;setMaintenanceProtectionExpanded(expanded,l)}
    const message=$("#maintenanceMessageV371");message.textContent=a.eligible?l.met:l.need;message.className=`maintenance-message ${a.eligible?'passed':'failed'}`;
  }
  function setMaintenanceProtectionExpanded(expanded,labels=MAINTENANCE_LABELS[lang]||MAINTENANCE_LABELS.en){const button=$("#maintenanceProtectionToggleV375"),details=$("#maintenanceProtectionDetailsV375"),chevron=button?.querySelector('.maintenance-protection-chevron');if(!button||!details)return;button.setAttribute('aria-expanded',String(expanded));button.setAttribute('aria-label',expanded?labels.collapse:labels.expand);details.hidden=!expanded;if(chevron)chevron.textContent=expanded?'⌃':'⌄'}
  function renderRankChangeNotice(change){const box=$("#rankChangeNoticeV371");if(!box)return;box.hidden=!change;if(!change)return;const l=RANK_CHANGE_LABELS[lang]||RANK_CHANGE_LABELS.en;$("#rankChangeNoticeTitleV371").textContent=l.title;$("#rankChangeNoticeBodyV371").textContent=`${l.body(change.fromRank,change.toRank)} ${l.help}`;$("#rankChangeNoticeDateV371").textContent=`${l.date} · ${formatDateOnly(change.createdAt)}`;const button=$("#rankChangeDismissV374");button.textContent=l.dismiss;button.dataset.changeId=String(change.id)}

  async function loadMember(){
    try {
      const payload = await api("/api/member/me");
      memberData = payload.data;
      $("#loadingPanel").hidden = true;
      $("#memberContent").hidden = false;
      renderMember();
      if (initialSection === "specs") {
        const specsSection = accordionList.querySelector('[data-section="specs"]');
        window.requestAnimationFrame(() => {
          specsSection?.scrollIntoView({behavior:"auto", block:"start"});
        });
      }
    } catch (error) {
      $("#loadingPanel").hidden = true;
      if (error.code === "UNAUTHORIZED") $("#authRequiredPanel").hidden = false;
      else {
        $("#authRequiredPanel").hidden = false;
        $("#authRequiredPanel h2").textContent = t("failed");
      }
    }
  }

  const accordionList = document.querySelector(".accordion-list");

  function setAccordionState(item, open) {
    const panel = item.querySelector(".accordion-panel");
    const button = item.querySelector(".accordion-trigger");
    const chevron = item.querySelector(".chevron");
    item.classList.toggle("is-open", open);
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    chevron.textContent = open ? "⌄" : "›";
  }

  accordionList.addEventListener("click", event => {
    const trigger = event.target.closest(".accordion-trigger");
    if (!trigger || !accordionList.contains(trigger)) return;

    event.preventDefault();
    const selectedItem = trigger.closest(".accordion-item");
    const willOpen = trigger.getAttribute("aria-expanded") !== "true";
    if (willOpen && selectedItem?.dataset.section === "requests") loadMyRequests();

    accordionList.querySelectorAll(".accordion-item").forEach(item => {
      setAccordionState(item, item === selectedItem ? willOpen : false);
    });
  });

  const requestedSection = new URLSearchParams(window.location.search).get("tab");
  const initialSection = requestedSection === "profile" ? "profile" : "specs";

  accordionList.querySelectorAll(".accordion-item").forEach(item => {
    setAccordionState(item, item.dataset.section === initialSection);
  });

  function updateServerClock(){
    const node = $("#currentServerTime");
    if (!node) return;
    const now = new Date();
    const hours = String((now.getUTCHours() + 22) % 24).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    node.textContent = `${hours}:${minutes}`;
  }
  updateServerClock();
  setInterval(updateServerClock, 30000);

  for (let hour=0; hour<24; hour++) {
    const opt = document.createElement("option");
    opt.value = String(hour);
    opt.textContent = `${String(hour).padStart(2,"0")}:00`;
    $("#bgbHourSelect").append(opt);
  }


  const profilePowerInput = $("#specsProfilePower");
  if (profilePowerInput) {
    profilePowerInput.addEventListener("input", () => {
      profilePowerInput.value = formatPowerInput(profilePowerInput.value);
    });
  }

  $("#specsForm").addEventListener("submit", async event => {
    event.preventDefault();
    const f = event.currentTarget;
    const nullableNumber = value => value === "" ? null : Number(value);
    const profilePower = parsePowerInput(f.elements.power.value);
    const industryLevel = f.elements.industryLevel.value;
    if (!Number.isSafeInteger(profilePower) || profilePower < 1) {
      showToast(t("validation"),"error");
      return;
    }
    const powerFields = [
      [f.elements.vehicle1PowerValue.value, f.elements.vehicle1PowerUnit.value],
      [f.elements.vehicle2PowerValue.value, f.elements.vehicle2PowerUnit.value],
    ];
    if (powerFields.some(([value,unit]) => !window.EZPKVehiclePower?.isValidInput(value,unit,2))) {
      showToast(t("validation"),"error");
      return;
    }
    try {
      const payload = await api("/api/member/specs", {
        method:"PUT",
        body:JSON.stringify({
          power:profilePower,
          industryLevel,
          vehicle1Class:f.elements.vehicle1Class.value || null,
          vehicle1PowerValue:nullableNumber(f.elements.vehicle1PowerValue.value),
          vehicle1PowerUnit:f.elements.vehicle1PowerUnit.value || null,
          vehicle2Class:f.elements.vehicle2Class.value || null,
          vehicle2PowerValue:nullableNumber(f.elements.vehicle2PowerValue.value),
          vehicle2PowerUnit:f.elements.vehicle2PowerUnit.value || null,
          seasonWarAvailable:f.elements.seasonWarAvailable.value === "" ? null : f.elements.seasonWarAvailable.value === "1",
          bgbAvailableHour:nullableNumber(f.elements.bgbAvailableHour.value),
          discord:f.elements.discord.value || null,
          telegram:f.elements.telegram.value || null
        })
      });
      memberData.member.power = payload.data.profile.power;
      memberData.member.industryLevel = payload.data.profile.industryLevel;
      memberData.member.profileSpecsRegistered = true;
      memberData.specs = {...memberData.specs, ...payload.data.specs};
      renderMember();
      const activityText=ACTIVITY_LABELS[lang]||ACTIVITY_LABELS.en;
      showToast(payload.data.changed?t("saved"):activityText.unchanged);
      if(payload.data.changed)await loadMember();
    } catch (e) { showToast(e.code === "VALIDATION_ERROR" ? t("validation") : t("failed"),"error"); }
  });

  const specsResetDialog = $("#specsResetDialog");
  $("#specsResetButton").addEventListener("click", () => {
    if (typeof specsResetDialog.showModal === "function") specsResetDialog.showModal();
    else if (window.confirm(t("resetConfirm"))) resetDetailedSpecs();
  });

  $("#specsResetConfirm").addEventListener("click", async () => {
    await resetDetailedSpecs();
    if (specsResetDialog.open) specsResetDialog.close();
  });

  async function resetDetailedSpecs(){
    const button = $("#specsResetConfirm");
    button.disabled = true;
    try {
      await api("/api/member/specs", {method:"DELETE"});

      // v227: re-fetch the authoritative server state after reset instead of
      // relying only on locally mutated values. This keeps the form, member
      // summary, Member List data and DB state in sync.
      const refreshed = await api("/api/member/me");
      memberData = refreshed.data;
      renderMember();
      showToast(t("resetDone"));
    } catch (e) {
      console.error("[DELETE /api/member/specs]", { code:e.code, payload:e.payload, error:e });
      const code = e.code && e.code !== "REQUEST_FAILED" ? ` (${e.code})` : "";
      showToast(`${t("failed")}${code}`,"error");
    } finally {
      button.disabled = false;
    }
  }

  $("#nicknameForm").addEventListener("submit", async event => {
    event.preventDefault();
    const input = $("#nicknameInput");
    try {
      const payload = await api("/api/member/nickname", {method:"PUT",body:JSON.stringify({nickname:input.value})});
      memberData.member.nickname = payload.data.nickname;
      memberData.member.nicknameChangeCount = payload.data.nicknameChangeCount;
      memberData.member.firstNicknameChangeFree = false;
      memberData.member.nicknameChangeAvailableAt = payload.data.nextChangeAvailableAt;
      input.value = "";
      renderMember();
      showToast(t("nicknameChanged"));
      window.dispatchEvent(new CustomEvent("ezpk-auth-refresh"));
    } catch (e) {
      if (e.code === "NICKNAME_CHANGE_COOLDOWN" && e.payload?.availableAt) {
        memberData.member.nicknameChangeAvailableAt = e.payload.availableAt;
        memberData.member.firstNicknameChangeFree = false;
        renderMember();
        showToast(t("cooldown"),"error");
      } else showToast(e.code === "VALIDATION_ERROR" ? t("validation") : t("failed"),"error");
    }
  });

  $("#passwordForm").addEventListener("submit", async event => {
    event.preventDefault();
    const f = event.currentTarget;
    try {
      await api("/api/member/password", {
        method:"PUT",
        body:JSON.stringify({
          currentPassword:f.elements.currentPassword.value,
          newPassword:f.elements.newPassword.value,
          newPasswordConfirm:f.elements.newPasswordConfirm.value
        })
      });
      f.reset();
      showToast(t("passwordChanged"));
      setTimeout(() => { location.href = "../"; }, 1700);
    } catch (e) { showToast(["INVALID_PASSWORD","PASSWORD_CONFIRM_MISMATCH"].includes(e.code) ? t("validation") : t("failed"),"error"); }
  });

  $("#myLoginButton").addEventListener("click", () => {
    if (window.EZPKSharedHeader?.openLogin) window.EZPKSharedHeader.openLogin();
    else window.dispatchEvent(new CustomEvent("ezpk-open-login"));
  });

  $("#rankChangeDismissV374").addEventListener("click",async event=>{
    const button=event.currentTarget,changeId=Number(button.dataset.changeId);
    if(!changeId||button.disabled)return;
    button.disabled=true;
    try{
      await api("/api/member/rank-change-notice/dismiss",{method:"POST",body:JSON.stringify({changeId})});
      memberData.rankChangeNotice=null;
      renderRankChangeNotice(null);
    }catch(error){button.disabled=false;showToast(t("failed"),"error")}
  });

  $("#maintenanceProtectionToggleV375").addEventListener("click",event=>{const expanded=event.currentTarget.getAttribute('aria-expanded')!=='true';localStorage.setItem(MAINTENANCE_PROTECTION_EXPANDED_KEY,expanded?'1':'0');setMaintenanceProtectionExpanded(expanded)});

  window.addEventListener("ezpk-auth-change", event => {
    if (event.detail?.authenticated) window.location.reload();
  });

  window.addEventListener("ezpk-language-change", e => applyLanguage(e.detail?.lang));
  window.addEventListener("storage", e => { if (e.key === STORAGE_KEY) applyLanguage(e.newValue); });
  applyLanguage(lang);
  loadMember();
})();
