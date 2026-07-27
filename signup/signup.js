(() => {
  "use strict";
  const STORAGE_KEY = "ezpk-lang-v5";
  const SUPPORTED = ["ko","en","pt","vi","ar","ja","th","zh-tw"];
  const T = {
    ko:{title:"회원가입",subtitle:"연맹원 계정을 생성합니다.",loginId:"아이디",loginHelp:"4~32자의 영문 소문자, 숫자, 점, 밑줄, 하이픈을 사용할 수 있습니다.",password:"비밀번호",passwordHelp:"영문과 숫자를 포함해 8자 이상 입력하세요.",passwordConfirm:"비밀번호 확인",nickname:"닉네임",nicknameHelp:"게임 닉네임",power:"전투력",powerHelp:"프로필에 표시된 수치",joinCodeHelp:"R5 또는 R4에게 문의",industry:"산업 레벨",rank:"회원 등급",joinCode:"연맹 가입 코드",submit:"회원가입",haveAccount:"이미 계정이 있으신가요?",login:"로그인",success:"회원가입이 완료되었습니다.",loginTaken:"이미 사용 중인 아이디입니다.",nicknameTaken:"이미 사용 중인 닉네임입니다.",passwordMismatch:"비밀번호가 일치하지 않습니다.",invalidPassword:"비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다.",invalidCode:"가입 코드가 올바르지 않습니다.",invalidId:"아이디 형식이 올바르지 않습니다.",validation:"입력값을 확인해 주세요.",disabled:"현재 회원가입이 중지되어 있습니다.",failed:"회원가입을 처리하지 못했습니다.",show:"비밀번호 보기",hide:"비밀번호 숨기기"},
    en:{title:"SIGN UP",subtitle:"Create an alliance member account.",loginId:"Login ID",loginHelp:"Use 4–32 lowercase letters, numbers, periods, underscores, or hyphens.",password:"Password",passwordHelp:"Use at least 8 characters including letters and numbers.",passwordConfirm:"Confirm Password",nickname:"Nickname",nicknameHelp:"In-game nickname",power:"COMBAT POWER",powerHelp:"Shown on your profile",joinCodeHelp:"Ask R5 or R4",industry:"Industry Level",rank:"Member Rank",joinCode:"Alliance Join Code",submit:"SIGN UP",haveAccount:"Already have an account?",login:"LOGIN",success:"Registration completed.",loginTaken:"This login ID is already in use.",nicknameTaken:"This nickname is already in use.",passwordMismatch:"Passwords do not match.",invalidPassword:"Use at least 8 characters including letters and numbers.",invalidCode:"The alliance join code is incorrect.",invalidId:"The login ID format is invalid.",validation:"Please check the entered values.",disabled:"Registration is currently disabled.",failed:"Registration could not be completed.",show:"Show password",hide:"Hide password"},
    pt:{title:"CADASTRO",subtitle:"Crie uma conta de membro da aliança.",loginId:"ID de Login",loginHelp:"Use 4–32 letras minúsculas, números, pontos, sublinhados ou hífens.",password:"Senha",passwordHelp:"Use pelo menos 8 caracteres com letras e números.",passwordConfirm:"Confirmar Senha",nickname:"Apelido",nicknameHelp:"Apelido no jogo",power:"Poder",powerHelp:"Valor exibido no perfil",joinCodeHelp:"Pergunte ao R5 ou R4",industry:"Nível Industrial",rank:"Patente",joinCode:"Código da Aliança",submit:"CADASTRAR",haveAccount:"Já tem uma conta?",login:"ENTRAR",success:"Cadastro concluído.",loginTaken:"Este ID de login já está em uso.",nicknameTaken:"Este apelido já está em uso.",passwordMismatch:"As senhas não coincidem.",invalidPassword:"Use pelo menos 8 caracteres com letras e números.",invalidCode:"O código da aliança está incorreto.",invalidId:"O formato do ID de login é inválido.",validation:"Verifique os dados informados.",disabled:"O cadastro está desativado no momento.",failed:"Não foi possível concluir o cadastro.",show:"Mostrar senha",hide:"Ocultar senha"},
    vi:{title:"ĐĂNG KÝ",subtitle:"Tạo tài khoản thành viên liên minh.",loginId:"ID đăng nhập",loginHelp:"Dùng 4–32 chữ thường, số, dấu chấm, gạch dưới hoặc gạch ngang.",password:"Mật khẩu",passwordHelp:"Ít nhất 8 ký tự, gồm chữ và số.",passwordConfirm:"Xác nhận mật khẩu",nickname:"Biệt danh",nicknameHelp:"Tên trong game",power:"Lực chiến",powerHelp:"Chỉ số trên hồ sơ",joinCodeHelp:"Hỏi R5 hoặc R4",industry:"Cấp Công nghiệp",rank:"Hạng thành viên",joinCode:"Mã gia nhập liên minh",submit:"ĐĂNG KÝ",haveAccount:"Đã có tài khoản?",login:"ĐĂNG NHẬP",success:"Đăng ký hoàn tất.",loginTaken:"ID đăng nhập này đã được sử dụng.",nicknameTaken:"Biệt danh này đã được sử dụng.",passwordMismatch:"Mật khẩu không khớp.",invalidPassword:"Dùng ít nhất 8 ký tự gồm chữ và số.",invalidCode:"Mã gia nhập liên minh không đúng.",invalidId:"Định dạng ID đăng nhập không hợp lệ.",validation:"Vui lòng kiểm tra dữ liệu.",disabled:"Đăng ký hiện đang tạm dừng.",failed:"Không thể hoàn tất đăng ký.",show:"Hiện mật khẩu",hide:"Ẩn mật khẩu"},
    ar:{title:"إنشاء حساب",subtitle:"إنشاء حساب لعضو في التحالف.",loginId:"معرّف الدخول",loginHelp:"استخدم 4–32 حرفًا صغيرًا أو رقمًا أو نقطة أو شرطة سفلية أو واصلة.",password:"كلمة المرور",passwordHelp:"8 أحرف على الأقل وتتضمن حروفًا وأرقامًا.",passwordConfirm:"تأكيد كلمة المرور",nickname:"الاسم",nicknameHelp:"الاسم داخل اللعبة",power:"القوة",powerHelp:"القيمة الظاهرة في الملف",joinCodeHelp:"اسأل R5 أو R4",industry:"مستوى الصناعة",rank:"رتبة العضو",joinCode:"رمز الانضمام للتحالف",submit:"إنشاء حساب",haveAccount:"لديك حساب بالفعل؟",login:"تسجيل الدخول",success:"اكتمل إنشاء الحساب.",loginTaken:"معرّف الدخول مستخدم بالفعل.",nicknameTaken:"هذا الاسم مستخدم بالفعل.",passwordMismatch:"كلمتا المرور غير متطابقتين.",invalidPassword:"استخدم 8 أحرف على الأقل مع حروف وأرقام.",invalidCode:"رمز الانضمام غير صحيح.",invalidId:"صيغة معرّف الدخول غير صحيحة.",validation:"يرجى التحقق من البيانات.",disabled:"إنشاء الحسابات متوقف حاليًا.",failed:"تعذر إنشاء الحساب.",show:"إظهار كلمة المرور",hide:"إخفاء كلمة المرور"},
    ja:{title:"新規登録",subtitle:"同盟メンバーのアカウントを作成します。",loginId:"ログインID",loginHelp:"4〜32文字の英小文字、数字、ピリオド、アンダースコア、ハイフンが使用できます。",password:"パスワード",passwordHelp:"英字と数字を含む8文字以上で入力してください。",passwordConfirm:"パスワード確認",nickname:"ニックネーム",nicknameHelp:"ゲーム内ニックネーム",power:"戦力",powerHelp:"プロフィール表示値",joinCodeHelp:"R5またはR4に確認",industry:"産業レベル",rank:"メンバーランク",joinCode:"同盟参加コード",submit:"登録",haveAccount:"すでにアカウントをお持ちですか？",login:"ログイン",success:"登録が完了しました。",loginTaken:"このログインIDはすでに使用されています。",nicknameTaken:"このニックネームはすでに使用されています。",passwordMismatch:"パスワードが一致しません。",invalidPassword:"英字と数字を含む8文字以上で入力してください。",invalidCode:"同盟参加コードが正しくありません。",invalidId:"ログインIDの形式が正しくありません。",validation:"入力内容を確認してください。",disabled:"現在、新規登録は停止されています。",failed:"登録を完了できませんでした。",show:"パスワードを表示",hide:"パスワードを隠す"},
    th:{title:"สมัครสมาชิก",subtitle:"สร้างบัญชีสมาชิกพันธมิตร",loginId:"ไอดีเข้าสู่ระบบ",loginHelp:"ใช้ตัวอักษรอังกฤษพิมพ์เล็ก ตัวเลข จุด ขีดล่าง หรือขีดกลาง 4–32 ตัว",password:"รหัสผ่าน",passwordHelp:"อย่างน้อย 8 ตัวอักษร และต้องมีตัวอักษรกับตัวเลข",passwordConfirm:"ยืนยันรหัสผ่าน",nickname:"ชื่อเล่น",nicknameHelp:"ชื่อในเกม",power:"พลังรบ",powerHelp:"ค่าที่แสดงในโปรไฟล์",joinCodeHelp:"สอบถาม R5 หรือ R4",industry:"ระดับอุตสาหกรรม",rank:"อันดับสมาชิก",joinCode:"รหัสเข้าร่วมพันธมิตร",submit:"สมัครสมาชิก",haveAccount:"มีบัญชีอยู่แล้ว?",login:"เข้าสู่ระบบ",success:"สมัครสมาชิกเสร็จสิ้น",loginTaken:"ไอดีนี้ถูกใช้แล้ว",nicknameTaken:"ชื่อเล่นนี้ถูกใช้แล้ว",passwordMismatch:"รหัสผ่านไม่ตรงกัน",invalidPassword:"ใช้อย่างน้อย 8 ตัวอักษร โดยมีตัวอักษรและตัวเลข",invalidCode:"รหัสเข้าร่วมพันธมิตรไม่ถูกต้อง",invalidId:"รูปแบบไอดีไม่ถูกต้อง",validation:"โปรดตรวจสอบข้อมูล",disabled:"ขณะนี้ปิดการสมัครสมาชิก",failed:"ไม่สามารถสมัครสมาชิกได้",show:"แสดงรหัสผ่าน",hide:"ซ่อนรหัสผ่าน"},
    "zh-tw":{title:"註冊",subtitle:"建立聯盟成員帳號。",loginId:"登入 ID",loginHelp:"可使用 4–32 個英文小寫字母、數字、句點、底線或連字號。",password:"密碼",passwordHelp:"至少 8 個字元，並包含英文字母與數字。",passwordConfirm:"確認密碼",nickname:"暱稱",nicknameHelp:"遊戲暱稱",power:"戰力",powerHelp:"個人資料顯示數值",joinCodeHelp:"詢問 R5 或 R4",industry:"產業等級",rank:"成員等級",joinCode:"聯盟加入代碼",submit:"註冊",haveAccount:"已經有帳號了嗎？",login:"登入",success:"註冊完成。",loginTaken:"此登入 ID 已被使用。",nicknameTaken:"此暱稱已被使用。",passwordMismatch:"密碼不一致。",invalidPassword:"至少輸入 8 個字元，並包含英文字母與數字。",invalidCode:"聯盟加入代碼不正確。",invalidId:"登入 ID 格式不正確。",validation:"請確認輸入內容。",disabled:"目前已暫停註冊。",failed:"無法完成註冊。",show:"顯示密碼",hide:"隱藏密碼"}
  };

  let lang = normalize(localStorage.getItem(STORAGE_KEY) || "en");
  const form = document.querySelector("#signupForm");
  const errorBox = document.querySelector("#signupError");
  const submit = document.querySelector("#signupSubmit");
  const toast = document.querySelector("#signupToast");

  function normalize(value){ return SUPPORTED.includes(value) ? value : "en"; }
  function tr(key){ return T[lang]?.[key] || T.en[key] || key; }

  function applyLanguage(next){
    lang = normalize(next);
    document.documentElement.lang = lang === "zh-tw" ? "zh-Hant" : lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = tr(el.dataset.i18n));
    document.querySelectorAll("[data-toggle]").forEach(updateToggle);
  }

  function updateToggle(button){
    const input = form.elements[button.dataset.toggle];
    button.setAttribute("aria-label", input.type === "password" ? tr("show") : tr("hide"));
  }

  function showToast(message){
    toast.textContent = message;
    toast.hidden = false;
  }

  function showError(message){
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  document.querySelectorAll("[data-toggle]").forEach(button => {
    button.addEventListener("click", () => {
      const input = form.elements[button.dataset.toggle];
      input.type = input.type === "password" ? "text" : "password";
      updateToggle(button);
    });
  });

  document.querySelector("#openLogin").addEventListener("click", () => {
    if (window.EZPKSharedHeader?.openLogin) window.EZPKSharedHeader.openLogin();
    else window.dispatchEvent(new CustomEvent("ezpk-open-login"));
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    errorBox.hidden = true;

    if (form.elements.password.value !== form.elements.passwordConfirm.value) {
      showError(tr("passwordMismatch"));
      return;
    }

    submit.disabled = true;
    try {
      const response = await fetch("/api/auth/signup", {
        method:"POST",
        credentials:"include",
        headers:{"content-type":"application/json","accept":"application/json"},
        body:JSON.stringify({
          loginId:form.elements.loginId.value,
          password:form.elements.password.value,
          passwordConfirm:form.elements.passwordConfirm.value,
          nickname:form.elements.nickname.value,
          allianceCode:form.elements.allianceCode.value
        })
      });

      let payload = null;
      try { payload = await response.json(); } catch (_) {}

      if (!response.ok || !payload?.ok) {
        const code = payload?.code || "REQUEST_FAILED";
        const map = {
          LOGIN_ID_TAKEN:"loginTaken",
          NICKNAME_TAKEN:"nicknameTaken",
          PASSWORD_CONFIRM_MISMATCH:"passwordMismatch",
          INVALID_PASSWORD:"invalidPassword",
          INVALID_ALLIANCE_CODE:"invalidCode",
          INVALID_LOGIN_ID:"invalidId",
          VALIDATION_ERROR:"validation",
          SIGNUP_DISABLED:"disabled"
        };
        showError(tr(map[code] || "failed"));
        return;
      }

      showToast(tr("success"));
      if (window.EZPKSharedHeader?.refreshAuth) {
        await window.EZPKSharedHeader.refreshAuth();
      }
      setTimeout(() => { window.location.href = "../my/?tab=specs"; }, 900);
    } catch (_) {
      showError(tr("failed"));
    } finally {
      submit.disabled = false;
    }
  });

  window.addEventListener("ezpk-language-change", event => applyLanguage(event.detail?.lang));
  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY) applyLanguage(event.newValue);
  });

  applyLanguage(lang);
})();