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

  let lang = normalize(window.EZPKLanguage?.get?.() || document.documentElement.lang || "en");
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


  const LIFECYCLE_LABELS={
    ko:{qualified:'영구 스펙 자격',qualifiedAt:'최초 자격 기록',retained:'현재 스펙이 기준보다 낮아져도 이미 획득한 승급 스펙 자격은 유지됩니다.',currentOk:'현재 스펙도 승급 기준을 충족합니다.',promotionActivity:'승급 검토 주기 활동',reentryActivity:'재승급 검토 재개 활동',cycle:(d,t,s,e)=>`승급 검토 · ${d}/${t} · ${s} ~ ${e}`,reviewable:(d,t,s,e)=>`검토 가능 · ${d}/${t}에 활동 조건 충족 · ${s} ~ ${e}`,hold:(s,e)=>`활동 미달로 보류 · 실패 주기 ${s} ~ ${e}`,waitMaintenance:'R2 등급 유지 주기 완료 후 다음 승급 검토가 시작됩니다.',waitReentry:(c,f)=>`재승급 검토 재개 조건 · 최근 30일 활동 ${c}/4 · 보류/강등 이후 새 활동 ${f?'확인':'필요'}`,holdHelp:'보류 해제에는 최근 30일 활동 2/4 이상과 보류 이후 새로운 활동 기록이 필요합니다.',maintenanceGuide:'현재 30일 등급 유지 주기에서 활동 조건 4개 중 2개 이상을 충족하면 등급을 유지합니다.',maintenanceCycle:(d,s,e)=>`등급 유지 검토 · ${d}/30 · ${s} ~ ${e}`,maintenanceProtected:d=>`신규 보호 중 · 보호 종료 ${d}`,recoveryTitle:'강등 검토 복구 상태',recoveryBody:c=>`현재 최근 30일 활동 ${c}/4 · 2/4 이상으로 회복되면 강등 검토가 자동 해제됩니다.`,newMemberProtect:d=>`가입 후 10일 동안 강등 검토에서 제외됩니다 · ${d}까지`},
    en:{qualified:'Permanent spec qualification',qualifiedAt:'First qualification record',retained:'Your earned promotion spec qualification remains valid even if current specs later fall below the threshold.',currentOk:'Your current specs also meet the promotion threshold.',promotionActivity:'Promotion-cycle activity',reentryActivity:'Re-promotion re-entry activity',cycle:(d,t,s,e)=>`Promotion review · ${d}/${t} · ${s} – ${e}`,reviewable:(d,t,s,e)=>`Reviewable · activity met on ${d}/${t} · ${s} – ${e}`,hold:(s,e)=>`On hold for insufficient activity · failed cycle ${s} – ${e}`,waitMaintenance:'The next promotion review starts after the R2 maintenance cycle is completed.',waitReentry:(c,f)=>`Re-entry requirement · last 30 days ${c}/4 · fresh post-change activity ${f?'confirmed':'required'}`,holdHelp:'Re-entry requires at least 2/4 activity conditions in the last 30 days plus fresh activity after the hold.',maintenanceGuide:'Meet at least 2 of 4 activity conditions during the current 30-day maintenance cycle.',maintenanceCycle:(d,s,e)=>`Rank maintenance · ${d}/30 · ${s} – ${e}`,maintenanceProtected:d=>`New-member protection · until ${d}`,recoveryTitle:'Demotion-review recovery',recoveryBody:c=>`Current rolling 30-day activity: ${c}/4. Reaching 2/4 clears the demotion review automatically.`,newMemberProtect:d=>`Excluded from demotion review for the first 10 days after joining · Until ${d}`},
    ja:{qualified:'永久スペック資格',qualifiedAt:'初回資格記録',retained:'現在のスペックが基準を下回っても、一度取得した昇級スペック資格は維持されます。',currentOk:'現在のスペックも昇級基準を満たしています。',promotionActivity:'昇級審査サイクル活動',reentryActivity:'再昇級審査再開活動',cycle:(d,t,s,e)=>`昇級審査 · ${d}/${t} · ${s}～${e}`,reviewable:(d,t,s,e)=>`審査可能 · ${d}/${t}で活動条件達成 · ${s}～${e}`,hold:(s,e)=>`活動不足で保留 · 失敗サイクル ${s}～${e}`,waitMaintenance:'R2ランク維持サイクル完了後に次の昇級審査を開始します。',waitReentry:(c,f)=>`再開条件 · 最近30日 ${c}/4 · 変更後の新しい活動 ${f?'確認済み':'必要'}`,holdHelp:'再開には最近30日で2/4以上と、保留後の新しい活動記録が必要です。',maintenanceGuide:'現在の30日ランク維持サイクルで4条件中2つ以上を満たしてください。',maintenanceCycle:(d,s,e)=>`ランク維持審査 · ${d}/30 · ${s}～${e}`,maintenanceProtected:d=>`新規メンバー保護中 · ${d}まで`,recoveryTitle:'降格審査の回復状態',recoveryBody:c=>`現在の最近30日活動 ${c}/4。2/4以上に回復すると降格審査は自動解除されます。`,newMemberProtect:d=>`加入後10日間は降格審査の対象外です · ${d}まで`},
    'zh-tw':{qualified:'永久規格資格',qualifiedAt:'首次資格紀錄',retained:'即使目前規格低於門檻，已取得的晉級規格資格仍會保留。',currentOk:'目前規格也符合晉級門檻。',promotionActivity:'晉級審查週期活動',reentryActivity:'再次晉級審查重啟活動',cycle:(d,t,s,e)=>`晉級審查 · ${d}/${t} · ${s}～${e}`,reviewable:(d,t,s,e)=>`可審查 · ${d}/${t} 達成活動條件 · ${s}～${e}`,hold:(s,e)=>`活動不足而暫停 · 失敗週期 ${s}～${e}`,waitMaintenance:'完成 R2 等級維持週期後開始下一次晉級審查。',waitReentry:(c,f)=>`重啟條件 · 最近30天 ${c}/4 · 等級變更後新活動 ${f?'已確認':'需要'}`,holdHelp:'重啟需要最近30天至少2/4，且暫停後有新的活動紀錄。',maintenanceGuide:'在目前30天等級維持週期中，4項活動條件至少達成2項。',maintenanceCycle:(d,s,e)=>`等級維持審查 · ${d}/30 · ${s}～${e}`,maintenanceProtected:d=>`新成員保護中 · 至 ${d}`,recoveryTitle:'降級審查恢復狀態',recoveryBody:c=>`目前滾動30天活動 ${c}/4；恢復至2/4以上會自動解除降級審查。`,newMemberProtect:d=>`加入後前10天不列入降級審查 · 至 ${d}`},
    vi:{qualified:'Điều kiện thông số vĩnh viễn',qualifiedAt:'Lần ghi nhận đầu tiên',retained:'Điều kiện thông số đã đạt vẫn được giữ ngay cả khi thông số hiện tại giảm xuống dưới ngưỡng.',currentOk:'Thông số hiện tại cũng đạt ngưỡng thăng hạng.',promotionActivity:'Hoạt động chu kỳ xét thăng hạng',reentryActivity:'Hoạt động mở lại xét thăng hạng',cycle:(d,t,s,e)=>`Xét thăng hạng · ${d}/${t} · ${s} – ${e}`,reviewable:(d,t,s,e)=>`Có thể xét · đạt hoạt động ngày ${d}/${t} · ${s} – ${e}`,hold:(s,e)=>`Tạm giữ do thiếu hoạt động · chu kỳ ${s} – ${e}`,waitMaintenance:'Chu kỳ xét thăng hạng tiếp theo bắt đầu sau khi hoàn thành duy trì R2.',waitReentry:(c,f)=>`Điều kiện mở lại · 30 ngày ${c}/4 · hoạt động mới sau thay đổi ${f?'đã có':'cần thêm'}`,holdHelp:'Cần ít nhất 2/4 trong 30 ngày gần nhất và hoạt động mới sau khi bị giữ.',maintenanceGuide:'Đạt ít nhất 2/4 điều kiện trong chu kỳ duy trì hạng 30 ngày hiện tại.',maintenanceCycle:(d,s,e)=>`Duy trì hạng · ${d}/30 · ${s} – ${e}`,maintenanceProtected:d=>`Đang bảo vệ thành viên mới · đến ${d}`,recoveryTitle:'Khôi phục xét hạ hạng',recoveryBody:c=>`Hoạt động 30 ngày hiện tại ${c}/4. Khi đạt 2/4, xét hạ hạng sẽ tự hủy.`,newMemberProtect:d=>`Miễn xét hạ hạng trong 10 ngày đầu sau khi gia nhập · Đến ${d}`},
    th:{qualified:'สิทธิ์สเปกถาวร',qualifiedAt:'บันทึกสิทธิ์ครั้งแรก',retained:'สิทธิ์สเปกเลื่อนระดับที่เคยได้รับจะคงอยู่ แม้สเปกปัจจุบันลดต่ำกว่าเกณฑ์',currentOk:'สเปกปัจจุบันผ่านเกณฑ์เลื่อนระดับด้วย',promotionActivity:'กิจกรรมรอบพิจารณาเลื่อนระดับ',reentryActivity:'กิจกรรมเพื่อเปิดการพิจารณาเลื่อนระดับอีกครั้ง',cycle:(d,t,s,e)=>`พิจารณาเลื่อนระดับ · ${d}/${t} · ${s} – ${e}`,reviewable:(d,t,s,e)=>`พร้อมพิจารณา · ผ่านกิจกรรมวันที่ ${d}/${t} · ${s} – ${e}`,hold:(s,e)=>`พักเนื่องจากกิจกรรมไม่พอ · รอบ ${s} – ${e}`,waitMaintenance:'รอบเลื่อนระดับถัดไปจะเริ่มหลังจบรอบรักษา R2',waitReentry:(c,f)=>`เงื่อนไขเปิดใหม่ · 30 วัน ${c}/4 · กิจกรรมใหม่หลังเปลี่ยนระดับ ${f?'ยืนยันแล้ว':'จำเป็น'}`,holdHelp:'ต้องมีอย่างน้อย 2/4 ใน 30 วันล่าสุด และมีกิจกรรมใหม่หลังถูกพัก',maintenanceGuide:'ผ่านอย่างน้อย 2 จาก 4 เงื่อนไขในรอบรักษาระดับ 30 วันปัจจุบัน',maintenanceCycle:(d,s,e)=>`รักษาระดับ · ${d}/30 · ${s} – ${e}`,maintenanceProtected:d=>`คุ้มครองสมาชิกใหม่ · ถึง ${d}`,recoveryTitle:'สถานะฟื้นตัวจากการพิจารณาลดระดับ',recoveryBody:c=>`กิจกรรม 30 วันปัจจุบัน ${c}/4 เมื่อถึง 2/4 การพิจารณาลดระดับจะถูกยกเลิกอัตโนมัติ`,newMemberProtect:d=>`ยกเว้นการพิจารณาลดระดับ 10 วันแรกหลังเข้าร่วม · ถึง ${d}`},
    pt:{qualified:'Qualificação permanente de atributos',qualifiedAt:'Primeiro registro de qualificação',retained:'A qualificação de atributos já conquistada permanece válida mesmo se os atributos atuais caírem abaixo do limite.',currentOk:'Os atributos atuais também atendem ao limite de promoção.',promotionActivity:'Atividade do ciclo de promoção',reentryActivity:'Atividade para reabrir a promoção',cycle:(d,t,s,e)=>`Revisão de promoção · ${d}/${t} · ${s} – ${e}`,reviewable:(d,t,s,e)=>`Pronto para revisão · atividade atingida em ${d}/${t} · ${s} – ${e}`,hold:(s,e)=>`Em espera por atividade insuficiente · ciclo ${s} – ${e}`,waitMaintenance:'A próxima revisão de promoção começa após concluir o ciclo de manutenção R2.',waitReentry:(c,f)=>`Reentrada · últimos 30 dias ${c}/4 · nova atividade após mudança ${f?'confirmada':'necessária'}`,holdHelp:'A reentrada exige pelo menos 2/4 nos últimos 30 dias e nova atividade após a espera.',maintenanceGuide:'Atenda a pelo menos 2 de 4 condições no ciclo atual de manutenção de 30 dias.',maintenanceCycle:(d,s,e)=>`Manutenção de patente · ${d}/30 · ${s} – ${e}`,maintenanceProtected:d=>`Proteção de novo membro · até ${d}`,recoveryTitle:'Recuperação da revisão de rebaixamento',recoveryBody:c=>`Atividade móvel de 30 dias: ${c}/4. Ao atingir 2/4, a revisão é cancelada automaticamente.`,newMemberProtect:d=>`Fora da revisão de rebaixamento nos primeiros 10 dias após entrar · Até ${d}`},
    fr:{qualified:'Qualification permanente des caractéristiques',qualifiedAt:'Premier enregistrement',retained:'La qualification acquise reste valide même si les caractéristiques actuelles repassent sous le seuil.',currentOk:'Les caractéristiques actuelles atteignent aussi le seuil de promotion.',promotionActivity:'Activité du cycle de promotion',reentryActivity:'Activité de réouverture de promotion',cycle:(d,t,s,e)=>`Examen de promotion · ${d}/${t} · ${s} – ${e}`,reviewable:(d,t,s,e)=>`Examen possible · activité validée à ${d}/${t} · ${s} – ${e}`,hold:(s,e)=>`En attente pour activité insuffisante · cycle ${s} – ${e}`,waitMaintenance:'Le prochain examen commence après le cycle de maintien R2.',waitReentry:(c,f)=>`Réouverture · 30 jours ${c}/4 · nouvelle activité ${f?'confirmée':'requise'}`,holdHelp:'Il faut au moins 2/4 sur les 30 derniers jours et une nouvelle activité après la mise en attente.',maintenanceGuide:'Remplissez au moins 2 des 4 conditions pendant le cycle actuel de maintien de 30 jours.',maintenanceCycle:(d,s,e)=>`Maintien du rang · ${d}/30 · ${s} – ${e}`,maintenanceProtected:d=>`Protection nouveau membre · jusqu’au ${d}`,recoveryTitle:'Récupération avant rétrogradation',recoveryBody:c=>`Activité glissante sur 30 jours : ${c}/4. À 2/4, l’examen de rétrogradation est levé automatiquement.`,newMemberProtect:d=>`Exclu de l’examen de rétrogradation pendant les 10 premiers jours · Jusqu’au ${d}`},
    de:{qualified:'Dauerhafte Werte-Qualifikation',qualifiedAt:'Erste Qualifikation',retained:'Eine einmal erreichte Aufstiegsqualifikation bleibt erhalten, auch wenn aktuelle Werte später unter den Grenzwert fallen.',currentOk:'Die aktuellen Werte erfüllen ebenfalls den Aufstiegsgrenzwert.',promotionActivity:'Aktivität im Aufstiegszyklus',reentryActivity:'Aktivität zur Wiederfreigabe',cycle:(d,t,s,e)=>`Aufstiegsprüfung · ${d}/${t} · ${s} – ${e}`,reviewable:(d,t,s,e)=>`Prüfbar · Aktivität an ${d}/${t} erfüllt · ${s} – ${e}`,hold:(s,e)=>`Wegen zu geringer Aktivität pausiert · Zyklus ${s} – ${e}`,waitMaintenance:'Die nächste Aufstiegsprüfung beginnt nach Abschluss des R2-Erhaltungszyklus.',waitReentry:(c,f)=>`Wiederfreigabe · 30 Tage ${c}/4 · neue Aktivität ${f?'bestätigt':'erforderlich'}`,holdHelp:'Erforderlich sind mindestens 2/4 in den letzten 30 Tagen und neue Aktivität nach der Pause.',maintenanceGuide:'Erfülle mindestens 2 von 4 Bedingungen im aktuellen 30-Tage-Erhaltungszyklus.',maintenanceCycle:(d,s,e)=>`Rangerhalt · ${d}/30 · ${s} – ${e}`,maintenanceProtected:d=>`Neumitglied-Schutz · bis ${d}`,recoveryTitle:'Erholung der Abstiegsprüfung',recoveryBody:c=>`Aktuelle 30-Tage-Aktivität ${c}/4. Ab 2/4 wird die Abstiegsprüfung automatisch aufgehoben.`,newMemberProtect:d=>`In den ersten 10 Tagen nach Beitritt von der Abstiegsprüfung ausgenommen · Bis ${d}`},
    es:{qualified:'Calificación permanente de estadísticas',qualifiedAt:'Primer registro',retained:'La calificación obtenida se conserva aunque las estadísticas actuales bajen del umbral.',currentOk:'Las estadísticas actuales también cumplen el umbral de ascenso.',promotionActivity:'Actividad del ciclo de ascenso',reentryActivity:'Actividad para reabrir el ascenso',cycle:(d,t,s,e)=>`Revisión de ascenso · ${d}/${t} · ${s} – ${e}`,reviewable:(d,t,s,e)=>`Listo para revisión · actividad cumplida en ${d}/${t} · ${s} – ${e}`,hold:(s,e)=>`En espera por actividad insuficiente · ciclo ${s} – ${e}`,waitMaintenance:'La siguiente revisión empieza al completar el ciclo de mantenimiento R2.',waitReentry:(c,f)=>`Reentrada · 30 días ${c}/4 · nueva actividad ${f?'confirmada':'necesaria'}`,holdHelp:'Se requieren al menos 2/4 en los últimos 30 días y actividad nueva después de la espera.',maintenanceGuide:'Cumple al menos 2 de 4 condiciones en el ciclo actual de mantenimiento de 30 días.',maintenanceCycle:(d,s,e)=>`Mantenimiento de rango · ${d}/30 · ${s} – ${e}`,maintenanceProtected:d=>`Protección de nuevo miembro · hasta ${d}`,recoveryTitle:'Recuperación de revisión de descenso',recoveryBody:c=>`Actividad móvil de 30 días: ${c}/4. Al llegar a 2/4 se elimina automáticamente la revisión.`,newMemberProtect:d=>`Excluido de revisión de descenso durante los primeros 10 días · Hasta ${d}`},
    tr:{qualified:'Kalıcı özellik yeterliliği',qualifiedAt:'İlk yeterlilik kaydı',retained:'Bir kez kazanılan terfi özellik yeterliliği, güncel değerler eşik altına düşse bile korunur.',currentOk:'Güncel özellikler de terfi eşiğini karşılıyor.',promotionActivity:'Terfi döngüsü etkinliği',reentryActivity:'Yeniden terfi açma etkinliği',cycle:(d,t,s,e)=>`Terfi incelemesi · ${d}/${t} · ${s} – ${e}`,reviewable:(d,t,s,e)=>`İncelenebilir · etkinlik ${d}/${t} gününde tamamlandı · ${s} – ${e}`,hold:(s,e)=>`Yetersiz etkinlik nedeniyle beklemede · döngü ${s} – ${e}`,waitMaintenance:'Sonraki terfi incelemesi R2 koruma döngüsü tamamlanınca başlar.',waitReentry:(c,f)=>`Yeniden giriş · 30 gün ${c}/4 · değişiklik sonrası yeni etkinlik ${f?'onaylandı':'gerekli'}`,holdHelp:'Son 30 günde en az 2/4 ve bekleme sonrası yeni etkinlik gerekir.',maintenanceGuide:'Mevcut 30 günlük rütbe koruma döngüsünde 4 koşuldan en az 2’sini karşılayın.',maintenanceCycle:(d,s,e)=>`Rütbe koruma · ${d}/30 · ${s} – ${e}`,maintenanceProtected:d=>`Yeni üye koruması · ${d} tarihine kadar`,recoveryTitle:'Rütbe düşürme incelemesi toparlanması',recoveryBody:c=>`Güncel 30 günlük etkinlik ${c}/4. 2/4 olduğunda inceleme otomatik kaldırılır.`,newMemberProtect:d=>`Katılımdan sonraki ilk 10 gün rütbe düşürme incelemesi dışında · ${d} tarihine kadar`},
    it:{qualified:'Qualifica permanente delle statistiche',qualifiedAt:'Prima registrazione',retained:'La qualifica già ottenuta resta valida anche se le statistiche attuali scendono sotto la soglia.',currentOk:'Le statistiche attuali soddisfano anche la soglia di promozione.',promotionActivity:'Attività del ciclo di promozione',reentryActivity:'Attività per riaprire la promozione',cycle:(d,t,s,e)=>`Revisione promozione · ${d}/${t} · ${s} – ${e}`,reviewable:(d,t,s,e)=>`Pronto per revisione · attività raggiunta a ${d}/${t} · ${s} – ${e}`,hold:(s,e)=>`In attesa per attività insufficiente · ciclo ${s} – ${e}`,waitMaintenance:'La prossima revisione inizia dopo il ciclo di mantenimento R2.',waitReentry:(c,f)=>`Rientro · 30 giorni ${c}/4 · nuova attività ${f?'confermata':'necessaria'}`,holdHelp:'Servono almeno 2/4 negli ultimi 30 giorni e nuova attività dopo l’attesa.',maintenanceGuide:'Soddisfa almeno 2 di 4 condizioni nel ciclo attuale di mantenimento di 30 giorni.',maintenanceCycle:(d,s,e)=>`Mantenimento grado · ${d}/30 · ${s} – ${e}`,maintenanceProtected:d=>`Protezione nuovo membro · fino al ${d}`,recoveryTitle:'Recupero revisione retrocessione',recoveryBody:c=>`Attività mobile 30 giorni: ${c}/4. A 2/4 la revisione viene annullata automaticamente.`,newMemberProtect:d=>`Escluso dalla revisione retrocessione nei primi 10 giorni · Fino al ${d}`},
    ar:{qualified:'أهلية المواصفات الدائمة',qualifiedAt:'أول سجل للأهلية',retained:'تبقى أهلية مواصفات الترقية المكتسبة سارية حتى إذا انخفضت المواصفات الحالية لاحقًا عن الحد.',currentOk:'المواصفات الحالية تحقق حد الترقية أيضًا.',promotionActivity:'نشاط دورة مراجعة الترقية',reentryActivity:'نشاط إعادة فتح الترقية',cycle:(d,t,s,e)=>`مراجعة الترقية · ${d}/${t} · ${s} – ${e}`,reviewable:(d,t,s,e)=>`جاهز للمراجعة · تحقق النشاط في ${d}/${t} · ${s} – ${e}`,hold:(s,e)=>`معلّق بسبب نقص النشاط · الدورة ${s} – ${e}`,waitMaintenance:'تبدأ مراجعة الترقية التالية بعد إكمال دورة الحفاظ على R2.',waitReentry:(c,f)=>`إعادة الدخول · آخر 30 يومًا ${c}/4 · نشاط جديد ${f?'مؤكد':'مطلوب'}`,holdHelp:'يلزم 2/4 على الأقل خلال آخر 30 يومًا مع نشاط جديد بعد التعليق.',maintenanceGuide:'حقق شرطين على الأقل من أصل 4 خلال دورة الحفاظ الحالية لمدة 30 يومًا.',maintenanceCycle:(d,s,e)=>`الحفاظ على الرتبة · ${d}/30 · ${s} – ${e}`,maintenanceProtected:d=>`حماية العضو الجديد · حتى ${d}`,recoveryTitle:'التعافي من مراجعة التخفيض',recoveryBody:c=>`النشاط الحالي لآخر 30 يومًا ${c}/4. عند 2/4 تُلغى مراجعة التخفيض تلقائيًا.`,newMemberProtect:d=>`مستثنى من مراجعة التخفيض خلال أول 10 أيام بعد الانضمام · حتى ${d}`},
    id:{qualified:'Kualifikasi statistik permanen',qualifiedAt:'Catatan kualifikasi pertama',retained:'Kualifikasi yang sudah diperoleh tetap berlaku meski statistik saat ini turun di bawah ambang.',currentOk:'Statistik saat ini juga memenuhi ambang kenaikan.',promotionActivity:'Aktivitas siklus kenaikan',reentryActivity:'Aktivitas untuk membuka kembali kenaikan',cycle:(d,t,s,e)=>`Tinjauan kenaikan · ${d}/${t} · ${s} – ${e}`,reviewable:(d,t,s,e)=>`Siap ditinjau · aktivitas terpenuhi pada ${d}/${t} · ${s} – ${e}`,hold:(s,e)=>`Ditahan karena aktivitas kurang · siklus ${s} – ${e}`,waitMaintenance:'Tinjauan kenaikan berikutnya dimulai setelah siklus pemeliharaan R2 selesai.',waitReentry:(c,f)=>`Masuk kembali · 30 hari ${c}/4 · aktivitas baru ${f?'terkonfirmasi':'diperlukan'}`,holdHelp:'Perlu minimal 2/4 dalam 30 hari terakhir dan aktivitas baru setelah penahanan.',maintenanceGuide:'Penuhi minimal 2 dari 4 syarat dalam siklus pemeliharaan 30 hari saat ini.',maintenanceCycle:(d,s,e)=>`Pemeliharaan peringkat · ${d}/30 · ${s} – ${e}`,maintenanceProtected:d=>`Perlindungan anggota baru · hingga ${d}`,recoveryTitle:'Pemulihan tinjauan penurunan',recoveryBody:c=>`Aktivitas 30 hari berjalan ${c}/4. Saat mencapai 2/4, tinjauan penurunan dibatalkan otomatis.`,newMemberProtect:d=>`Dikecualikan dari tinjauan penurunan selama 10 hari pertama setelah bergabung · Hingga ${d}`}
  };

  const RANK_HISTORY_LABELS={
    ko:{title:'등급 이력',current:'현재 등급',none:'등급 변경 이력이 없습니다.',latest:'최근 변경',more:'전체 이력 보기',less:'최근 이력만 보기',detail:'판정 상세',partial:'기존 기록 · 상세 판정 데이터 일부 없음',types:{PROMOTION:'승급',DEMOTION:'강등',MANUAL_ADJUSTMENT:'관리자 변경',CORRECTION:'기록 보정',RESTORE:'데이터 복원'},reasons:{PROMOTION_REQUIREMENTS_MET:'승급 조건 충족',MAINTENANCE_ACTIVITY_FAILED:'등급 유지 활동 조건 미달',ADMIN_MANUAL_ADJUSTMENT:'관리자 직접 변경',RANK_DATA_CORRECTION:'등급 데이터 보정',DATA_RESTORE:'데이터 복원'}},
    en:{title:'Rank History',current:'Current rank',none:'No rank-change history.',latest:'Latest change',more:'VIEW FULL HISTORY',less:'SHOW RECENT ONLY',detail:'Decision details',partial:'Legacy record · some decision details are unavailable',types:{PROMOTION:'Promotion',DEMOTION:'Demotion',MANUAL_ADJUSTMENT:'Admin adjustment',CORRECTION:'Correction',RESTORE:'Data restore'},reasons:{PROMOTION_REQUIREMENTS_MET:'Promotion requirements met',MAINTENANCE_ACTIVITY_FAILED:'Rank-maintenance activity failed',ADMIN_MANUAL_ADJUSTMENT:'Admin manual adjustment',RANK_DATA_CORRECTION:'Rank data correction',DATA_RESTORE:'Data restore'}},
    ja:{title:'ランク履歴',current:'現在のランク',none:'ランク変更履歴はありません。',latest:'最新の変更',more:'すべての履歴を見る',less:'最近の履歴のみ',detail:'判定詳細',partial:'既存記録 · 判定データの一部なし',types:{PROMOTION:'昇級',DEMOTION:'降格',MANUAL_ADJUSTMENT:'管理者変更',CORRECTION:'記録補正',RESTORE:'データ復元'},reasons:{PROMOTION_REQUIREMENTS_MET:'昇級条件達成',MAINTENANCE_ACTIVITY_FAILED:'ランク維持活動不足',ADMIN_MANUAL_ADJUSTMENT:'管理者による変更',RANK_DATA_CORRECTION:'ランクデータ補正',DATA_RESTORE:'データ復元'}},
    'zh-tw':{title:'等級紀錄',current:'目前等級',none:'沒有等級變更紀錄。',latest:'最近變更',more:'查看完整紀錄',less:'僅顯示最近紀錄',detail:'判定詳情',partial:'既有紀錄 · 部分判定資料缺少',types:{PROMOTION:'晉級',DEMOTION:'降級',MANUAL_ADJUSTMENT:'管理員變更',CORRECTION:'紀錄修正',RESTORE:'資料復原'},reasons:{PROMOTION_REQUIREMENTS_MET:'達成晉級條件',MAINTENANCE_ACTIVITY_FAILED:'等級維持活動未達標',ADMIN_MANUAL_ADJUSTMENT:'管理員手動變更',RANK_DATA_CORRECTION:'等級資料修正',DATA_RESTORE:'資料復原'}},
    vi:{title:'Lịch sử hạng',current:'Hạng hiện tại',none:'Chưa có lịch sử đổi hạng.',latest:'Thay đổi gần nhất',more:'XEM TOÀN BỘ LỊCH SỬ',less:'CHỈ XEM GẦN ĐÂY',detail:'Chi tiết quyết định',partial:'Bản ghi cũ · thiếu một phần dữ liệu quyết định',types:{PROMOTION:'Thăng hạng',DEMOTION:'Hạ hạng',MANUAL_ADJUSTMENT:'Điều chỉnh quản trị',CORRECTION:'Hiệu chỉnh',RESTORE:'Khôi phục dữ liệu'},reasons:{PROMOTION_REQUIREMENTS_MET:'Đạt điều kiện thăng hạng',MAINTENANCE_ACTIVITY_FAILED:'Không đạt hoạt động duy trì hạng',ADMIN_MANUAL_ADJUSTMENT:'Quản trị điều chỉnh thủ công',RANK_DATA_CORRECTION:'Hiệu chỉnh dữ liệu hạng',DATA_RESTORE:'Khôi phục dữ liệu'}},
    th:{title:'ประวัติระดับ',current:'ระดับปัจจุบัน',none:'ไม่มีประวัติการเปลี่ยนระดับ',latest:'การเปลี่ยนล่าสุด',more:'ดูประวัติทั้งหมด',less:'ดูเฉพาะล่าสุด',detail:'รายละเอียดการตัดสิน',partial:'บันทึกเดิม · ข้อมูลการตัดสินบางส่วนไม่มี',types:{PROMOTION:'เลื่อนระดับ',DEMOTION:'ลดระดับ',MANUAL_ADJUSTMENT:'ผู้ดูแลปรับ',CORRECTION:'แก้ไขข้อมูล',RESTORE:'กู้คืนข้อมูล'},reasons:{PROMOTION_REQUIREMENTS_MET:'ผ่านเงื่อนไขเลื่อนระดับ',MAINTENANCE_ACTIVITY_FAILED:'กิจกรรมรักษาระดับไม่ผ่าน',ADMIN_MANUAL_ADJUSTMENT:'ผู้ดูแลเปลี่ยนโดยตรง',RANK_DATA_CORRECTION:'แก้ไขข้อมูลระดับ',DATA_RESTORE:'กู้คืนข้อมูล'}},
    pt:{title:'Histórico de Patente',current:'Patente atual',none:'Sem histórico de alteração.',latest:'Última alteração',more:'VER HISTÓRICO COMPLETO',less:'MOSTRAR APENAS RECENTES',detail:'Detalhes da decisão',partial:'Registro antigo · alguns dados da decisão não estão disponíveis',types:{PROMOTION:'Promoção',DEMOTION:'Rebaixamento',MANUAL_ADJUSTMENT:'Ajuste administrativo',CORRECTION:'Correção',RESTORE:'Restauração'},reasons:{PROMOTION_REQUIREMENTS_MET:'Requisitos de promoção atingidos',MAINTENANCE_ACTIVITY_FAILED:'Atividade de manutenção insuficiente',ADMIN_MANUAL_ADJUSTMENT:'Alteração manual do administrador',RANK_DATA_CORRECTION:'Correção de dados da patente',DATA_RESTORE:'Restauração de dados'}},
    fr:{title:'Historique de rang',current:'Rang actuel',none:'Aucun historique de changement.',latest:'Dernier changement',more:'VOIR TOUT L’HISTORIQUE',less:'AFFICHER LES RÉCENTS',detail:'Détails de décision',partial:'Ancien enregistrement · certains détails sont indisponibles',types:{PROMOTION:'Promotion',DEMOTION:'Rétrogradation',MANUAL_ADJUSTMENT:'Ajustement admin',CORRECTION:'Correction',RESTORE:'Restauration'},reasons:{PROMOTION_REQUIREMENTS_MET:'Conditions de promotion remplies',MAINTENANCE_ACTIVITY_FAILED:'Activité de maintien insuffisante',ADMIN_MANUAL_ADJUSTMENT:'Ajustement manuel admin',RANK_DATA_CORRECTION:'Correction des données de rang',DATA_RESTORE:'Restauration des données'}},
    de:{title:'Rangverlauf',current:'Aktueller Rang',none:'Keine Rangänderungen vorhanden.',latest:'Letzte Änderung',more:'GESAMTEN VERLAUF ANZEIGEN',less:'NUR LETZTE ANZEIGEN',detail:'Entscheidungsdetails',partial:'Altdaten · einige Entscheidungsdetails fehlen',types:{PROMOTION:'Aufstieg',DEMOTION:'Abstieg',MANUAL_ADJUSTMENT:'Admin-Anpassung',CORRECTION:'Korrektur',RESTORE:'Datenwiederherstellung'},reasons:{PROMOTION_REQUIREMENTS_MET:'Aufstiegsbedingungen erfüllt',MAINTENANCE_ACTIVITY_FAILED:'Rangerhalt-Aktivität nicht erfüllt',ADMIN_MANUAL_ADJUSTMENT:'Manuelle Admin-Änderung',RANK_DATA_CORRECTION:'Korrektur der Rangdaten',DATA_RESTORE:'Datenwiederherstellung'}},
    es:{title:'Historial de rango',current:'Rango actual',none:'No hay historial de cambios.',latest:'Último cambio',more:'VER HISTORIAL COMPLETO',less:'MOSTRAR SOLO RECIENTES',detail:'Detalles de decisión',partial:'Registro anterior · faltan algunos datos de decisión',types:{PROMOTION:'Ascenso',DEMOTION:'Descenso',MANUAL_ADJUSTMENT:'Ajuste de administrador',CORRECTION:'Corrección',RESTORE:'Restauración'},reasons:{PROMOTION_REQUIREMENTS_MET:'Requisitos de ascenso cumplidos',MAINTENANCE_ACTIVITY_FAILED:'Actividad de mantenimiento insuficiente',ADMIN_MANUAL_ADJUSTMENT:'Ajuste manual del administrador',RANK_DATA_CORRECTION:'Corrección de datos de rango',DATA_RESTORE:'Restauración de datos'}},
    tr:{title:'Rütbe geçmişi',current:'Mevcut rütbe',none:'Rütbe değişikliği geçmişi yok.',latest:'Son değişiklik',more:'TÜM GEÇMİŞİ GÖR',less:'YALNIZCA SON KAYITLAR',detail:'Karar ayrıntıları',partial:'Eski kayıt · bazı karar verileri yok',types:{PROMOTION:'Terfi',DEMOTION:'Rütbe düşürme',MANUAL_ADJUSTMENT:'Yönetici değişikliği',CORRECTION:'Düzeltme',RESTORE:'Veri geri yükleme'},reasons:{PROMOTION_REQUIREMENTS_MET:'Terfi koşulları karşılandı',MAINTENANCE_ACTIVITY_FAILED:'Rütbe koruma etkinliği yetersiz',ADMIN_MANUAL_ADJUSTMENT:'Yönetici manuel değişikliği',RANK_DATA_CORRECTION:'Rütbe verisi düzeltmesi',DATA_RESTORE:'Veri geri yükleme'}},
    it:{title:'Cronologia grado',current:'Grado attuale',none:'Nessuna modifica del grado.',latest:'Ultima modifica',more:'VEDI CRONOLOGIA COMPLETA',less:'MOSTRA SOLO RECENTI',detail:'Dettagli decisione',partial:'Registro precedente · alcuni dettagli non disponibili',types:{PROMOTION:'Promozione',DEMOTION:'Retrocessione',MANUAL_ADJUSTMENT:'Modifica admin',CORRECTION:'Correzione',RESTORE:'Ripristino dati'},reasons:{PROMOTION_REQUIREMENTS_MET:'Requisiti di promozione soddisfatti',MAINTENANCE_ACTIVITY_FAILED:'Attività di mantenimento insufficiente',ADMIN_MANUAL_ADJUSTMENT:'Modifica manuale admin',RANK_DATA_CORRECTION:'Correzione dati grado',DATA_RESTORE:'Ripristino dati'}},
    ar:{title:'سجل الرتبة',current:'الرتبة الحالية',none:'لا يوجد سجل لتغيير الرتبة.',latest:'آخر تغيير',more:'عرض السجل الكامل',less:'عرض السجل الأخير فقط',detail:'تفاصيل القرار',partial:'سجل قديم · بعض بيانات القرار غير متاحة',types:{PROMOTION:'ترقية',DEMOTION:'تخفيض',MANUAL_ADJUSTMENT:'تعديل إداري',CORRECTION:'تصحيح',RESTORE:'استعادة بيانات'},reasons:{PROMOTION_REQUIREMENTS_MET:'استيفاء شروط الترقية',MAINTENANCE_ACTIVITY_FAILED:'عدم كفاية نشاط الحفاظ على الرتبة',ADMIN_MANUAL_ADJUSTMENT:'تعديل يدوي من الإدارة',RANK_DATA_CORRECTION:'تصحيح بيانات الرتبة',DATA_RESTORE:'استعادة البيانات'}},
    id:{title:'Riwayat peringkat',current:'Peringkat saat ini',none:'Belum ada riwayat perubahan.',latest:'Perubahan terbaru',more:'LIHAT RIWAYAT LENGKAP',less:'TAMPILKAN YANG TERBARU',detail:'Detail keputusan',partial:'Catatan lama · sebagian detail keputusan tidak tersedia',types:{PROMOTION:'Kenaikan',DEMOTION:'Penurunan',MANUAL_ADJUSTMENT:'Penyesuaian admin',CORRECTION:'Koreksi',RESTORE:'Pemulihan data'},reasons:{PROMOTION_REQUIREMENTS_MET:'Syarat kenaikan terpenuhi',MAINTENANCE_ACTIVITY_FAILED:'Aktivitas pemeliharaan tidak terpenuhi',ADMIN_MANUAL_ADJUSTMENT:'Perubahan manual admin',RANK_DATA_CORRECTION:'Koreksi data peringkat',DATA_RESTORE:'Pemulihan data'}}
  };



  const PROFILE_RANK_LABELS={
    ko:{management:'등급 관리',promotionDetail:'활동 상세 보기',maintenanceDetail:'등급 유지 상세 보기'},
    en:{management:'Rank Management',promotionDetail:'View activity details',maintenanceDetail:'View maintenance details'},
    fr:{management:'Gestion du rang',promotionDetail:"Voir le détail de l’activité",maintenanceDetail:'Voir le détail du maintien'},
    de:{management:'Rangverwaltung',promotionDetail:'Aktivitätsdetails anzeigen',maintenanceDetail:'Erhaltungsdetails anzeigen'},
    th:{management:'การจัดการอันดับ',promotionDetail:'ดูรายละเอียดกิจกรรม',maintenanceDetail:'ดูรายละเอียดการรักษาระดับ'},
    ja:{management:'ランク管理',promotionDetail:'活動詳細を見る',maintenanceDetail:'ランク維持詳細を見る'},
    pt:{management:'Gestão de patente',promotionDetail:'Ver detalhes de atividade',maintenanceDetail:'Ver detalhes de manutenção'},
    es:{management:'Gestión de rango',promotionDetail:'Ver detalles de actividad',maintenanceDetail:'Ver detalles de mantenimiento'},
    tr:{management:'Rütbe yönetimi',promotionDetail:'Etkinlik ayrıntılarını gör',maintenanceDetail:'Rütbe koruma ayrıntılarını gör'},
    'zh-tw':{management:'等級管理',promotionDetail:'查看活動詳細',maintenanceDetail:'查看等級維持詳細'},
    it:{management:'Gestione grado',promotionDetail:'Vedi dettagli attività',maintenanceDetail:'Vedi dettagli mantenimento'},
    ar:{management:'إدارة الرتبة',promotionDetail:'عرض تفاصيل النشاط',maintenanceDetail:'عرض تفاصيل الحفاظ على الرتبة'},
    vi:{management:'Quản lý hạng',promotionDetail:'Xem chi tiết hoạt động',maintenanceDetail:'Xem chi tiết duy trì hạng'},
    id:{management:'Manajemen peringkat',promotionDetail:'Lihat detail aktivitas',maintenanceDetail:'Lihat detail pemeliharaan'}
  };
  function profileRankLabels(){return PROFILE_RANK_LABELS[lang]||PROFILE_RANK_LABELS.en}

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
  function kstDateKey(value=Date.now()){
    if(typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value))return value;
    const raw=value instanceof Date?value:(typeof value==='number'?new Date(value):new Date(/Z$|[+-]\d\d:?\d\d$/.test(String(value||''))?String(value):String(value||'').replace(' ','T')+'Z'));
    if(Number.isNaN(raw.getTime()))return '';
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(raw),map=Object.fromEntries(parts.map(x=>[x.type,x.value]));
    return `${map.year}-${map.month}-${map.day}`;
  }
  function kstDayDiff(start,end){const a=kstDateKey(start),b=kstDateKey(end);if(!a||!b)return NaN;return Math.round((Date.parse(`${b}T00:00:00Z`)-Date.parse(`${a}T00:00:00Z`))/86400000)}
  function remainingDays(value){const n=kstDayDiff(kstDateKey(),value);return Number.isFinite(n)?`D-${Math.max(0,n)}`:''}
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
    renderProfileRankOverview(memberData.latestRankChange);
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
    $("#profileRankDisplay").textContent = normalizeMemberRank(m.memberRank);
    applyRankStyle($("#profileRankDisplay"),m.memberRank);
    const rankManagement=$("#profileRankManagementV442");if(rankManagement)rankManagement.hidden=!(memberData.promotion||memberData.rankMaintenance);
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
  function promotionRequiredPowerText(vehicle){const unit=vehicle?.requiredUnit==='M'?'M':'G',value=Number(vehicle?.requiredValue);if(Number.isFinite(value)&&value>0)return `${Number(value.toFixed(2))}${unit}`;const normalized=Number(vehicle?.requiredNormalized);return Number.isFinite(normalized)&&normalized>0?`${Number((normalized/1000).toFixed(2))}G`:'-'}
  function promotionCurrentState(passed,current){if(passed)return'passed';const n=Number(String(current??'').replace(/^I/i,''));return Number.isFinite(n)&&n>0?'progress':'failed'}
  function setPromotionBoxState(el,state){const box=el?.closest('.promotion-condition,.promotion-activity-item');if(!box)return;box.classList.remove('is-complete','is-progress','is-missing','is-pending');box.classList.add(state==='passed'?'is-complete':state==='progress'?'is-progress':state==='pending'?'is-pending':'is-missing')}
  function promotionActivitySource(p){
    if(p?.review?.status==='WAIT_REENTRY')return p.reentry?.recoveryActivity||p.activity;
    return p?.reviewActivity||p?.cycleActivity||p?.activity;
  }
  function promotionQualifiedDay(p){
    const r=p?.review;if(!r?.startedOn||!r?.activityQualifiedAt)return r?.day||0;
    const d=kstDayDiff(r.startedOn,r.activityQualifiedAt);return Number.isFinite(d)?Math.max(1,Math.min(r.totalDays||14,d+1)):(r.day||0);
  }
  function renderPromotion(p){
    const card=$("#promotionCardV367");if(!card)return;card.hidden=!p;if(!p)return;
    const l=PROMOTION_LABELS[lang]||PROMOTION_LABELS.en,a=ACTIVITY_LABELS[lang]||ACTIVITY_LABELS.en,life=LIFECYCLE_LABELS[lang]||LIFECYCLE_LABELS.en,activity=promotionActivitySource(p),profile=profileRankLabels();
    const detailSummary=$("#promotionDetailsSummaryV442");if(detailSummary)detailSummary.textContent=profile.promotionDetail;
    const permanentComplete=p.specEligible?2:Number(p.completed||0);
    $("#promotionRouteV367").textContent=`${p.currentRank} → ${p.targetRank}`;$("#promotionTitleV367").textContent=l.title;$("#promotionCountV367").textContent=`${permanentComplete} / 2`;$("#promotionProgressV367").style.width=`${permanentComplete*50}%`;$("#promotionIndustryNameV375").textContent=t('industry');$("#promotionVehicleNameV375").textContent=t('vehicle1');
    $("#promotionIndustryCurrentLabelV372").textContent=l.current;$("#promotionIndustryRequiredLabelV372").textContent=l.required;$("#promotionVehicleCurrentLabelV372").textContent=l.current;$("#promotionVehicleRequiredLabelV372").textContent=l.required;
    const indCurrent=$("#promotionIndustryCurrentV372"),indRequired=$("#promotionIndustryRequiredV372"),vehicleCurrent=$("#promotionVehicleCurrentV372"),vehicleRequired=$("#promotionVehicleRequiredV372");
    indCurrent.textContent=p.industry.current||'-';indRequired.textContent=p.industry.required;vehicleCurrent.textContent=p.vehicle1.currentNormalized==null?'-':`${Number((p.vehicle1.currentNormalized/1000).toFixed(2))}G`;vehicleRequired.textContent=promotionRequiredPowerText(p.vehicle1);
    const indState=promotionCurrentState(p.industry.passed,p.industry.current),vehicleState=promotionCurrentState(p.vehicle1.passed,p.vehicle1.currentNormalized);indCurrent.className=indState;vehicleCurrent.className=vehicleState;indRequired.className='required-value';vehicleRequired.className='required-value';setPromotionBoxState(indCurrent,indState);setPromotionBoxState(vehicleCurrent,vehicleState);

    const qual=$("#promotionQualificationV440");qual.hidden=!p.qualification;
    if(p.qualification){$("#promotionQualificationTitleV440").textContent=life.qualified;$("#promotionQualificationBodyV440").textContent=`${life.qualifiedAt} · ${formatDateOnly(p.qualification.qualifiedAt)} · ${p.currentSpecEligible?life.currentOk:life.retained}`}
    const review=p.review||{},meta=$("#promotionCycleMetaV440");let metaText='';
    if(review.status==='IN_PROGRESS'&&review.startedOn&&review.dueOn)metaText=life.cycle(review.day||1,review.totalDays||14,formatDateOnly(review.startedOn),formatDateOnly(review.dueOn));
    else if(review.status==='REVIEWABLE'&&review.startedOn&&review.dueOn)metaText=life.reviewable(promotionQualifiedDay(p),review.totalDays||14,formatDateOnly(review.startedOn),formatDateOnly(review.dueOn));
    else if(review.status==='HOLD'&&review.startedOn&&review.dueOn)metaText=life.hold(formatDateOnly(review.startedOn),formatDateOnly(review.dueOn));
    else if(review.status==='WAIT_MAINTENANCE')metaText=life.waitMaintenance;
    else if(review.status==='WAIT_REENTRY')metaText=life.waitReentry(p.reentry?.recoveryActivity?.completed||0,Boolean(p.reentry?.freshActivity));
    meta.textContent=metaText;meta.hidden=!metaText;

    if(activity?.items){
      $("#promotionActivityTitleV369").textContent=review.status==='WAIT_REENTRY'?life.reentryActivity:life.promotionActivity;$("#promotionActivityCountV369").textContent=`${activity.completed} / 4`;$("#activityVoteLabelV369").textContent=a.vote;$("#activityVisitLabelV369").textContent=a.visit;$("#activitySpecLabelV369").textContent=a.spec;$("#activityAdminLabelV369").textContent=a.admin;
      ['Vote','Visit','Spec'].forEach(key=>{$(`#activity${key}CurrentLabelV373`).textContent=l.current;$(`#activity${key}RequiredLabelV373`).textContent=a.required});
      const setActivity=(key,item,type)=>{const current=$(`#activity${key}CurrentV373`),required=$(`#activity${key}RequiredV373`),state=item.passed?'passed':Number(item.count)>0?'progress':'failed';current.textContent=`${item.count} ${localizedActivityUnit(type,item.count,a)}`;required.textContent=`${item.required} ${localizedActivityUnit(type,item.required,a)}`;current.className=state;required.className='required-value';setPromotionBoxState(current,state)};
      setActivity('Vote',activity.items.vote,'times');setActivity('Visit',activity.items.visit,'days');setActivity('Spec',activity.items.specUpdate,'times');const admin=$("#activityAdminV369"),adminState=activity.items.adminConfirmation.passed?'passed':'pending';admin.textContent=activity.items.adminConfirmation.passed?a.confirmed:a.unconfirmed;admin.className=adminState;setPromotionBoxState(admin,adminState);
      const msg=$("#promotionActivityMessageV369");
      if(review.status==='WAIT_REENTRY')msg.textContent=life.waitReentry(activity.completed||0,Boolean(p.reentry?.freshActivity));
      else if(review.status==='HOLD'){const hr=p.holdRecovery;msg.textContent=hr?`${life.holdHelp} ${life.waitReentry(hr.activity?.completed||0,Boolean(hr.freshActivity))}`:life.holdHelp}
      else msg.textContent=activity.eligible?a.met:a.need(Math.max(0,activity.required-activity.completed));
    }
    const done=$("#promotionCongratsV367");done.hidden=!p.eligible;if(p.eligible){$("#promotionCongratsTitleV367").textContent=l.congrats;$("#promotionCongratsBodyV367").textContent=p.pendingRequestId?l.pending:l.body;const link=$("#promotionRequestV367");link.textContent=p.pendingRequestId?l.view:l.request;link.href=p.pendingRequestId?`../request/#request-${p.pendingRequestId}`:`../request/?type=promotion&target=${p.targetRank}`}
  }
  function renderRankMaintenance(state){
    const card=$("#rankMaintenanceCardV371");if(!card)return;card.hidden=!state;if(!state)return;
    const l=MAINTENANCE_LABELS[lang]||MAINTENANCE_LABELS.en,life=LIFECYCLE_LABELS[lang]||LIFECYCLE_LABELS.en,a=state.activity,i=a?.items||{},profile=profileRankLabels();
    const detailSummary=$("#maintenanceDetailsSummaryV442");if(detailSummary)detailSummary.textContent=profile.maintenanceDetail;
    $("#maintenanceRankV371").textContent=state.currentRank;$("#maintenanceTitleV371").textContent=l.title;$("#maintenanceCountV371").textContent=`${a?.completed||0} / 4`;$("#maintenanceProgressV371").style.width=`${(a?.completed||0)*25}%`;$("#maintenanceGuideV371").textContent=life.maintenanceGuide;
    const cycle=state.cycle||{},cycleMeta=$("#maintenanceCycleMetaV440");let cycleText='';
    if(state.protection?.active&&state.protection.type==='new_member'&&!cycle.startedOn)cycleText=life.maintenanceProtected(formatDateOnly(state.protection.until));
    else if(cycle.startedOn&&cycle.dueOn)cycleText=life.maintenanceCycle(cycle.day||1,formatDateOnly(cycle.startedOn),formatDateOnly(cycle.dueOn));
    cycleMeta.textContent=cycleText;cycleMeta.hidden=!cycleText;
    $("#maintenanceVoteLabelV371").textContent=l.vote;$("#maintenanceVisitLabelV371").textContent=l.visit;$("#maintenanceSpecLabelV371").textContent=l.spec;$("#maintenanceAdminLabelV371").textContent=l.admin;
    const emptyItem={passed:false,count:0,required:1};
    const set=(valueId,dateId,item,labelText,last)=>{item=item||emptyItem;const valueEl=$(valueId);valueEl.textContent=valueId.includes('Admin')?(item.passed?l.confirmed:l.unconfirmed):labelText;valueEl.className=item.passed?'passed':'failed';$(dateId).textContent=last?`${l.last} ${formatDateOnly(last)}`:l.none};
    set("#maintenanceVoteV371","#maintenanceVoteDateV371",i.vote,`${i.vote?.count||0} ${localizedActivityUnit('times',i.vote?.count||0,l)}`,i.vote?.latestAt);
    set("#maintenanceVisitV371","#maintenanceVisitDateV371",i.visit,`${i.visit?.count||0} ${localizedActivityUnit('days',i.visit?.count||0,l)}`,i.visit?.latestAt);
    set("#maintenanceSpecV371","#maintenanceSpecDateV371",i.specUpdate,`${i.specUpdate?.count||0} ${localizedActivityUnit('times',i.specUpdate?.count||0,l)}`,i.specUpdate?.latestAt);
    set("#maintenanceAdminV371","#maintenanceAdminDateV371",i.adminConfirmation,"",i.adminConfirmation?.confirmedAt);
    const box=$("#maintenanceProtectionV371"),protectedState=state.protection?.active||state.exclusion?.active;box.hidden=!protectedState;
    if(protectedState){const until=state.exclusion?.active?state.exclusion.until:state.protection.until;let body;if(state.exclusion?.active)body=l.exclusion(formatDateOnly(until));else if(state.protection.type==='new_member')body=life.newMemberProtect(formatDateOnly(until));else body=state.protection.type==='demotion'?l.demotionProtect(formatDateOnly(until)):l.promotionProtect(formatDateOnly(until));const expanded=localStorage.getItem(MAINTENANCE_PROTECTION_EXPANDED_KEY)==='1';$("#maintenanceProtectionTitleV371").textContent=`${l.protection} · ${remainingDays(until)}`;$("#maintenanceProtectionBodyV371").textContent=body;setMaintenanceProtectionExpanded(expanded,l)}
    const recovery=$("#maintenanceRecoveryV440");recovery.hidden=!state.reviewEligible;if(state.reviewEligible){$("#maintenanceRecoveryTitleV440").textContent=life.recoveryTitle;$("#maintenanceRecoveryBodyV440").textContent=life.recoveryBody(state.recoveryActivity?.completed||0)}
    const message=$("#maintenanceMessageV371");
    if(state.protection?.active&&state.protection.type==='new_member'){message.textContent=life.maintenanceProtected(formatDateOnly(state.protection.until));message.className='maintenance-message passed'}
    else{message.textContent=a?.eligible?l.met:l.need;message.className=`maintenance-message ${a?.eligible?'passed':'failed'}`}
  }

  function rankHistoryLabels(){return RANK_HISTORY_LABELS[lang]||RANK_HISTORY_LABELS.en}
  function rankHistoryTypeLabel(item,labels){return labels.types?.[item.type]||item.type||'-'}
  function rankHistorySummary(item,labels){if(!item)return labels.none;return `${formatDateOnly(item.createdAt)} · ${item.fromRank} → ${item.toRank} · ${rankHistoryTypeLabel(item,labels)}`}
  function renderProfileRankOverview(change){
    if(!memberData?.member)return;
    const labels=rankHistoryLabels(),profile=profileRankLabels(),rank=normalizeMemberRank(memberData.member.memberRank);
    const currentLabel=$("#profileCurrentRankLabelV442"),rankEl=$("#profileRankDisplay"),latest=$("#profileRankLatestV442"),management=$("#profileRankManagementTitleV442");
    if(currentLabel)currentLabel.textContent=labels.current;
    if(rankEl){rankEl.textContent=rank;applyRankStyle(rankEl,rank)}
    if(latest)latest.textContent=change?`${labels.latest} · ${rankHistorySummary(change,labels)}`:labels.none;
    if(management)management.textContent=profile.management;
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
  const initialSection = requestedSection === "specs" ? "specs" : "profile";

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
  applyLanguage(lang);
  loadMember();
})();
