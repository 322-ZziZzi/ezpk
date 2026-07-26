(() => {
  "use strict";
  const STORAGE_KEY = "ezpk-lang-v5";
  const LANGS = ["ko","en","ja","zh-tw","vi","th","pt","ar"];
  const T = {
    ko:{title:"마이페이지",subtitle:"내 프로필과 계정 정보를 관리합니다.",loading:"회원 정보를 불러오는 중입니다.",loginRequired:"로그인이 필요합니다.",loginRequiredBody:"로그인 후 마이페이지를 이용할 수 있습니다.",goHome:"홈으로 이동",loginButton:"로그인",power:"전투력",industry:"산업 레벨",basicProfile:"기본 프로필",detailedSpecs:"세부 스펙",changeNickname:"닉네임 변경",changePassword:"비밀번호 변경",loginId:"로그인 아이디",nickname:"닉네임",memberRank:"회원 등급",saveProfile:"기본 프로필 저장",vehicle1:"차량 1",vehicle2:"차량 2",class:"병종",unit:"단위",seasonWar:"시즌전 참여 가능 여부",bgbHour:"BGB 참여 가능 시간대",serverTimeBasis:"서버 시간 기준",currentServerTime:"현재 서버 시간",yes:"가능",no:"불가능",saveSpecs:"세부 스펙 저장",currentNickname:"현재 닉네임",changeStatus:"변경 상태",available:"🟢 지금 변경 가능",waiting:"🔴 7일 후 변경 가능",nextAvailable:"다음 변경 가능일",newNickname:"새 닉네임",changeNicknameButton:"닉네임 변경",currentPassword:"현재 비밀번호",newPassword:"새 비밀번호",confirmPassword:"새 비밀번호 확인",passwordNote:"비밀번호 변경 후 다시 로그인해야 합니다.",changePasswordButton:"비밀번호 변경",member:"멤버",administrator:"관리자",saved:"저장되었습니다.",nicknameChanged:"닉네임이 변경되었습니다.",passwordChanged:"비밀번호가 변경되었습니다. 다시 로그인해 주세요.",failed:"요청을 처리하지 못했습니다.",validation:"입력값을 확인해 주세요.",cooldown:"아직 닉네임을 변경할 수 없습니다."},
    en:{title:"MY PAGE",subtitle:"Manage your profile and account information.",loading:"Loading member information.",loginRequired:"Login required.",loginRequiredBody:"Please log in to use My Page.",goHome:"GO HOME",loginButton:"LOGIN",power:"Power",industry:"Industry Level",basicProfile:"Basic Profile",detailedSpecs:"Detailed Specs",changeNickname:"Change Nickname",changePassword:"Change Password",loginId:"Login ID",nickname:"Nickname",memberRank:"Member Rank",saveProfile:"SAVE PROFILE",vehicle1:"Vehicle 1",vehicle2:"Vehicle 2",class:"Class",unit:"Unit",seasonWar:"Season War Available",bgbHour:"BGB Available Time",serverTimeBasis:"Server Time",currentServerTime:"Current Server Time",yes:"Available",no:"Unavailable",saveSpecs:"SAVE SPECS",currentNickname:"Current Nickname",changeStatus:"Change Status",available:"🟢 Available Now",waiting:"🔴 Available After 7 Days",nextAvailable:"Next Available",newNickname:"New Nickname",changeNicknameButton:"CHANGE NICKNAME",currentPassword:"Current Password",newPassword:"New Password",confirmPassword:"Confirm New Password",passwordNote:"You must log in again after changing your password.",changePasswordButton:"CHANGE PASSWORD",member:"MEMBER",administrator:"ADMINISTRATOR",saved:"Saved successfully.",nicknameChanged:"Nickname changed.",passwordChanged:"Password changed. Please log in again.",failed:"The request could not be completed.",validation:"Please check the entered values.",cooldown:"Nickname change is not available yet."},
    ja:{title:"マイページ",subtitle:"プロフィールとアカウント情報を管理します。",loading:"会員情報を読み込んでいます。",loginRequired:"ログインが必要です。",loginRequiredBody:"ログイン後にマイページをご利用ください。",goHome:"ホームへ",loginButton:"ログイン",power:"戦力",industry:"産業レベル",basicProfile:"基本プロフィール",detailedSpecs:"詳細スペック",changeNickname:"ニックネーム変更",changePassword:"パスワード変更",loginId:"ログインID",nickname:"ニックネーム",memberRank:"メンバーランク",saveProfile:"プロフィールを保存",vehicle1:"車両1",vehicle2:"車両2",class:"兵種",unit:"単位",seasonWar:"シーズン戦参加",bgbHour:"BGB参加可能時間",serverTimeBasis:"サーバー時間基準",currentServerTime:"現在のサーバー時間",yes:"可能",no:"不可",saveSpecs:"スペックを保存",currentNickname:"現在のニックネーム",changeStatus:"変更状態",available:"🟢 今すぐ変更可能",waiting:"🔴 7日後に変更可能",nextAvailable:"次回変更可能日時",newNickname:"新しいニックネーム",changeNicknameButton:"ニックネーム変更",currentPassword:"現在のパスワード",newPassword:"新しいパスワード",confirmPassword:"新しいパスワード確認",passwordNote:"変更後は再ログインが必要です。",changePasswordButton:"パスワード変更",member:"メンバー",administrator:"管理者",saved:"保存しました。",nicknameChanged:"ニックネームを変更しました。",passwordChanged:"パスワードを変更しました。再ログインしてください。",failed:"処理できませんでした。",validation:"入力内容を確認してください。",cooldown:"まだニックネームを変更できません。"},
    "zh-tw":{title:"我的頁面",subtitle:"管理個人資料與帳號資訊。",loading:"正在載入會員資訊。",loginRequired:"需要登入。",loginRequiredBody:"登入後即可使用我的頁面。",goHome:"返回首頁",loginButton:"登入",power:"戰力",industry:"產業等級",basicProfile:"基本資料",detailedSpecs:"詳細規格",changeNickname:"變更暱稱",changePassword:"變更密碼",loginId:"登入 ID",nickname:"暱稱",memberRank:"成員等級",saveProfile:"儲存基本資料",vehicle1:"載具 1",vehicle2:"載具 2",class:"兵種",unit:"單位",seasonWar:"可參加賽季戰",bgbHour:"BGB 可參與時間",serverTimeBasis:"依伺服器時間",currentServerTime:"目前伺服器時間",yes:"可以",no:"不可以",saveSpecs:"儲存詳細規格",currentNickname:"目前暱稱",changeStatus:"變更狀態",available:"🟢 現在可以變更",waiting:"🔴 7 天後可以變更",nextAvailable:"下次可變更時間",newNickname:"新暱稱",changeNicknameButton:"變更暱稱",currentPassword:"目前密碼",newPassword:"新密碼",confirmPassword:"確認新密碼",passwordNote:"變更密碼後需要重新登入。",changePasswordButton:"變更密碼",member:"成員",administrator:"管理員",saved:"已儲存。",nicknameChanged:"暱稱已變更。",passwordChanged:"密碼已變更，請重新登入。",failed:"無法完成要求。",validation:"請確認輸入內容。",cooldown:"目前尚無法變更暱稱。"},
    vi:{title:"TRANG CỦA TÔI",subtitle:"Quản lý hồ sơ và thông tin tài khoản.",loading:"Đang tải thông tin thành viên.",loginRequired:"Cần đăng nhập.",loginRequiredBody:"Vui lòng đăng nhập để sử dụng trang này.",goHome:"VỀ TRANG CHỦ",loginButton:"ĐĂNG NHẬP",power:"Lực chiến",industry:"Cấp Công nghiệp",basicProfile:"Hồ sơ cơ bản",detailedSpecs:"Thông số chi tiết",changeNickname:"Đổi biệt danh",changePassword:"Đổi mật khẩu",loginId:"ID đăng nhập",nickname:"Biệt danh",memberRank:"Hạng thành viên",saveProfile:"LƯU HỒ SƠ",vehicle1:"Xe 1",vehicle2:"Xe 2",class:"Hệ",unit:"Đơn vị",seasonWar:"Có thể tham gia chiến mùa",bgbHour:"Thời gian tham gia BGB",serverTimeBasis:"Theo giờ máy chủ",currentServerTime:"Giờ máy chủ hiện tại",yes:"Có",no:"Không",saveSpecs:"LƯU THÔNG SỐ",currentNickname:"Biệt danh hiện tại",changeStatus:"Trạng thái đổi",available:"🟢 Có thể đổi ngay",waiting:"🔴 Có thể đổi sau 7 ngày",nextAvailable:"Lần đổi tiếp theo",newNickname:"Biệt danh mới",changeNicknameButton:"ĐỔI BIỆT DANH",currentPassword:"Mật khẩu hiện tại",newPassword:"Mật khẩu mới",confirmPassword:"Xác nhận mật khẩu mới",passwordNote:"Bạn phải đăng nhập lại sau khi đổi mật khẩu.",changePasswordButton:"ĐỔI MẬT KHẨU",member:"THÀNH VIÊN",administrator:"QUẢN TRỊ VIÊN",saved:"Đã lưu.",nicknameChanged:"Đã đổi biệt danh.",passwordChanged:"Đã đổi mật khẩu. Vui lòng đăng nhập lại.",failed:"Không thể xử lý yêu cầu.",validation:"Vui lòng kiểm tra dữ liệu.",cooldown:"Chưa thể đổi biệt danh."},
    th:{title:"หน้าของฉัน",subtitle:"จัดการโปรไฟล์และข้อมูลบัญชี",loading:"กำลังโหลดข้อมูลสมาชิก",loginRequired:"จำเป็นต้องเข้าสู่ระบบ",loginRequiredBody:"โปรดเข้าสู่ระบบเพื่อใช้หน้าของฉัน",goHome:"กลับหน้าหลัก",loginButton:"เข้าสู่ระบบ",power:"พลังรบ",industry:"ระดับอุตสาหกรรม",basicProfile:"โปรไฟล์พื้นฐาน",detailedSpecs:"สเปกโดยละเอียด",changeNickname:"เปลี่ยนชื่อเล่น",changePassword:"เปลี่ยนรหัสผ่าน",loginId:"ไอดีเข้าสู่ระบบ",nickname:"ชื่อเล่น",memberRank:"อันดับสมาชิก",saveProfile:"บันทึกโปรไฟล์",vehicle1:"ยานพาหนะ 1",vehicle2:"ยานพาหนะ 2",class:"คลาส",unit:"หน่วย",seasonWar:"เข้าร่วมสงครามซีซัน",bgbHour:"เวลาที่สามารถเข้าร่วม BGB",serverTimeBasis:"ตามเวลาเซิร์ฟเวอร์",currentServerTime:"เวลาเซิร์ฟเวอร์ปัจจุบัน",yes:"ได้",no:"ไม่ได้",saveSpecs:"บันทึกสเปก",currentNickname:"ชื่อเล่นปัจจุบัน",changeStatus:"สถานะการเปลี่ยน",available:"🟢 เปลี่ยนได้ตอนนี้",waiting:"🔴 เปลี่ยนได้หลัง 7 วัน",nextAvailable:"เปลี่ยนได้ครั้งถัดไป",newNickname:"ชื่อเล่นใหม่",changeNicknameButton:"เปลี่ยนชื่อเล่น",currentPassword:"รหัสผ่านปัจจุบัน",newPassword:"รหัสผ่านใหม่",confirmPassword:"ยืนยันรหัสผ่านใหม่",passwordNote:"หลังเปลี่ยนรหัสผ่านต้องเข้าสู่ระบบอีกครั้ง",changePasswordButton:"เปลี่ยนรหัสผ่าน",member:"สมาชิก",administrator:"ผู้ดูแลระบบ",saved:"บันทึกแล้ว",nicknameChanged:"เปลี่ยนชื่อเล่นแล้ว",passwordChanged:"เปลี่ยนรหัสผ่านแล้ว โปรดเข้าสู่ระบบอีกครั้ง",failed:"ไม่สามารถดำเนินการได้",validation:"โปรดตรวจสอบข้อมูล",cooldown:"ยังไม่สามารถเปลี่ยนชื่อเล่นได้"},
    pt:{title:"MINHA PÁGINA",subtitle:"Gerencie seu perfil e as informações da conta.",loading:"Carregando informações do membro.",loginRequired:"Login necessário.",loginRequiredBody:"Entre para usar a Minha Página.",goHome:"VOLTAR AO INÍCIO",loginButton:"ENTRAR",power:"Poder",industry:"Nível Industrial",basicProfile:"Perfil Básico",detailedSpecs:"Especificações",changeNickname:"Alterar Apelido",changePassword:"Alterar Senha",loginId:"ID de Login",nickname:"Apelido",memberRank:"Patente",saveProfile:"SALVAR PERFIL",vehicle1:"Veículo 1",vehicle2:"Veículo 2",class:"Classe",unit:"Unidade",seasonWar:"Disponível para Guerra da Temporada",bgbHour:"Horário disponível para BGB",serverTimeBasis:"Horário do servidor",currentServerTime:"Horário atual do servidor",yes:"Sim",no:"Não",saveSpecs:"SALVAR ESPECIFICAÇÕES",currentNickname:"Apelido Atual",changeStatus:"Status da Alteração",available:"🟢 Disponível Agora",waiting:"🔴 Disponível Após 7 Dias",nextAvailable:"Próxima Disponibilidade",newNickname:"Novo Apelido",changeNicknameButton:"ALTERAR APELIDO",currentPassword:"Senha Atual",newPassword:"Nova Senha",confirmPassword:"Confirmar Nova Senha",passwordNote:"Você deverá entrar novamente após alterar a senha.",changePasswordButton:"ALTERAR SENHA",member:"MEMBRO",administrator:"ADMINISTRADOR",saved:"Salvo com sucesso.",nicknameChanged:"Apelido alterado.",passwordChanged:"Senha alterada. Entre novamente.",failed:"Não foi possível concluir a solicitação.",validation:"Verifique os dados informados.",cooldown:"A alteração de apelido ainda não está disponível."},
    ar:{title:"صفحتي",subtitle:"إدارة الملف الشخصي ومعلومات الحساب.",loading:"جارٍ تحميل معلومات العضو.",loginRequired:"تسجيل الدخول مطلوب.",loginRequiredBody:"يرجى تسجيل الدخول لاستخدام صفحتي.",goHome:"العودة للرئيسية",loginButton:"تسجيل الدخول",power:"القوة",industry:"مستوى الصناعة",basicProfile:"الملف الأساسي",detailedSpecs:"المواصفات التفصيلية",changeNickname:"تغيير الاسم",changePassword:"تغيير كلمة المرور",loginId:"معرّف الدخول",nickname:"الاسم",memberRank:"رتبة العضو",saveProfile:"حفظ الملف",vehicle1:"المركبة 1",vehicle2:"المركبة 2",class:"الفئة",unit:"الوحدة",seasonWar:"متاح لحرب الموسم",bgbHour:"وقت التوفر لـ BGB",serverTimeBasis:"حسب وقت الخادم",currentServerTime:"وقت الخادم الحالي",yes:"متاح",no:"غير متاح",saveSpecs:"حفظ المواصفات",currentNickname:"الاسم الحالي",changeStatus:"حالة التغيير",available:"🟢 متاح للتغيير الآن",waiting:"🔴 متاح بعد 7 أيام",nextAvailable:"موعد التغيير التالي",newNickname:"الاسم الجديد",changeNicknameButton:"تغيير الاسم",currentPassword:"كلمة المرور الحالية",newPassword:"كلمة المرور الجديدة",confirmPassword:"تأكيد كلمة المرور",passwordNote:"يجب تسجيل الدخول مجددًا بعد تغيير كلمة المرور.",changePasswordButton:"تغيير كلمة المرور",member:"عضو",administrator:"مسؤول",saved:"تم الحفظ.",nicknameChanged:"تم تغيير الاسم.",passwordChanged:"تم تغيير كلمة المرور. يرجى تسجيل الدخول مجددًا.",failed:"تعذر تنفيذ الطلب.",validation:"يرجى التحقق من القيم.",cooldown:"لا يمكن تغيير الاسم بعد."}
  };

  let lang = normalize(localStorage.getItem(STORAGE_KEY) || document.documentElement.lang || "en");
  let memberData = null;
  const $ = (s, root=document) => root.querySelector(s);

  function normalize(value){ return LANGS.includes(value) ? value : "en"; }
  function t(key){ return (T[lang] && T[lang][key]) || T.en[key] || key; }
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
    $("#summaryPower").textContent = formatPower(m.power);
    $("#summaryIndustry").textContent = m.industryLevel;
    const role = $("#summaryRole");
    role.textContent = `${m.memberRank} · ${m.role === "admin" ? t("administrator") : t("member")}`;
    role.classList.toggle("admin", m.role === "admin");
    $("#profileLoginId").value = m.loginId;
    $("#profileNickname").value = m.nickname;
    setValue($("#profileForm"),"power",m.power);
    setValue($("#profileForm"),"industryLevel",m.industryLevel);
    if (m.role === "admin") {
      $("#profileRank").hidden = true;
      $("#profileRank").disabled = true;
      $("#adminRankDisplay").hidden = false;
    } else {
      $("#profileRank").hidden = false;
      $("#profileRank").disabled = false;
      $("#adminRankDisplay").hidden = true;
      setValue($("#profileForm"),"memberRank",m.memberRank);
    }
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

  $("#profileForm").addEventListener("submit", async event => {
    event.preventDefault();
    const f = event.currentTarget, m = memberData.member;
    try {
      const payload = await api("/api/member/profile", {
        method:"PUT",
        body:JSON.stringify({
          power:Number(f.elements.power.value),
          industryLevel:f.elements.industryLevel.value,
          memberRank:m.role === "admin" ? "R5" : f.elements.memberRank.value
        })
      });
      m.power = payload.data.profile.power;
      m.industryLevel = payload.data.profile.industryLevel;
      m.memberRank = payload.data.profile.memberRank;
      renderMember();
      showToast(t("saved"));
    } catch (e) { showToast(e.code === "VALIDATION_ERROR" ? t("validation") : t("failed"),"error"); }
  });

  $("#specsForm").addEventListener("submit", async event => {
    event.preventDefault();
    const f = event.currentTarget;
    const nullableNumber = value => value === "" ? null : Number(value);
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
      memberData.specs = {...memberData.specs, ...payload.data.specs};
      renderMember();
      showToast(t("saved"));
    } catch (e) { showToast(e.code === "VALIDATION_ERROR" ? t("validation") : t("failed"),"error"); }
  });

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