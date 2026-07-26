(() => {
  "use strict";
  const STORAGE_KEY = "ezpk-lang-v5";
  const LANGS = ["ko","en","ja","zh-tw","vi","th","pt","ar"];
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
  function setValue(form, name, value){ if (form.elements[name]) form.elements[name].value = value ?? ""; }
  const REQUEST_LABELS={ko:{label:"내 요청글",open:"요청 게시판 열기",empty:"작성한 요청글이 없습니다.",waiting:"답변 대기",answered:"답변 완료"},en:{label:"My Requests",open:"OPEN REQUEST BOARD",empty:"You have no requests.",waiting:"Waiting",answered:"Answered"},ja:{label:"自分のリクエスト",open:"掲示板を開く",empty:"作成したリクエストはありません。",waiting:"回答待ち",answered:"回答済み"},"zh-tw":{label:"我的請求",open:"開啟請求留言板",empty:"沒有已提交的請求。",waiting:"等待回覆",answered:"已回覆"},vi:{label:"Yêu cầu của tôi",open:"MỞ BẢNG YÊU CẦU",empty:"Bạn chưa có yêu cầu.",waiting:"Đang chờ",answered:"Đã trả lời"},th:{label:"คำขอของฉัน",open:"เปิดกระดานคำขอ",empty:"ยังไม่มีคำขอ",waiting:"รอคำตอบ",answered:"ตอบแล้ว"},pt:{label:"Meus Pedidos",open:"ABRIR QUADRO",empty:"Você não possui pedidos.",waiting:"Aguardando",answered:"Respondido"},ar:{label:"طلباتي",open:"فتح لوحة الطلبات",empty:"لا توجد طلبات مكتوبة.",waiting:"بانتظار الرد",answered:"تم الرد"}};
  function requestLabels(){return REQUEST_LABELS[lang]||REQUEST_LABELS.en}
  async function loadMyRequests(){const box=$("#myRequestsList");if(!box)return;box.innerHTML='<p class="form-note">...</p>';try{const payload=await api('/api/requests?mine=1&page=1&limit=20');const items=payload.data?.items||[],r=requestLabels();box.innerHTML=items.length?items.map(x=>`<a class="my-request-item" href="../request/"><strong>${String(x.title||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}</strong><span class="${x.answered?'answered':''}">${x.answered?r.answered:r.waiting}</span></a>`).join(''):`<p class="form-note">${r.empty}</p>`}catch(e){box.innerHTML=`<p class="form-note">${t('failed')}</p>`}}

  function renderMember(){
    if (!memberData) return;
    const m = memberData.member, s = memberData.specs || {};
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

  async function loadMember(){
    try {
      const payload = await api("/api/member/me");
      memberData = payload.data;
      $("#loadingPanel").hidden = true;
      $("#memberContent").hidden = false;
      renderMember();
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

  accordionList.querySelectorAll(".accordion-item").forEach((item, index) => {
    setAccordionState(item, index === 0);
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
      showToast(t("saved"));
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

  window.addEventListener("ezpk-auth-change", event => {
    if (event.detail?.authenticated) window.location.reload();
  });

  window.addEventListener("ezpk-language-change", e => applyLanguage(e.detail?.lang));
  window.addEventListener("storage", e => { if (e.key === STORAGE_KEY) applyLanguage(e.newValue); });
  applyLanguage(lang);
  loadMember();
})();