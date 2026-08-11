(() => {
  'use strict';

  const LANG_KEY='ezpk-lang-v5';
  const LANGS=['ko','en','pt','vi','ar','ja','th','zh-tw'];
  const TIER_POWER=Object.freeze({gray:'0-46M',blue:'46M-90M',purple:'90M-200M',gold:'>200M'});
  const TEXT={
    ko:{
      pageTitle:'EZPK 이민 신청',heroKicker:'322 서버 · EZPK 이민 신청',heroTitle:'EZPK 이민 신청',heroBody:'EZPK와 함께할 새로운 동료를 기다리고 있습니다. 입력한 내용을 확인한 후 운영진이 개별적으로 연락드립니다.',
      stepCounter:'{step}단계 / 7단계',next:'다음',prev:'이전',submit:'이민 신청 제출',submitting:'제출 중...',edit:'수정',required:'필수',optional:'선택',notEntered:'미입력',example:'예) 1.23',
      steps:[['신청자 정보','게임 내 신원과 연락 가능한 정보를 입력해주세요.'],['현재 정보','현재 플레이 중인 서버와 연맹 정보를 입력해주세요.'],['이민 프로필','차량 파워와 현재 성장 정보를 알려주세요.'],['이민 등급','현재 본인에게 해당하는 이민 등급을 선택해주세요.'],['이민 사유','이민을 결정한 이유와 EZPK에 합류하고 싶은 이유를 자유롭게 작성해주세요.'],['동반 이민','함께 이동하는 그룹이나 추천인이 있다면 입력해주세요.'],['최종 확인','제출하기 전에 입력한 내용을 확인해주세요.']],
      f:{playerName:'게임 닉네임',gameUid:'게임 UID',discord:'Discord',currentState:'현재 서버',currentAlliance:'현재 연맹',vehicle1:'1번 차량 파워',vehicle2:'2번 차량 파워',industry:'산업 레벨',spending:'과금 타입',tier:'이민 등급',reason:'이민 신청 사유',notes:'추가 전달사항',group:'함께 이민하는 그룹',referrer:'추천인'},
      p:{playerName:'게임 닉네임을 입력해주세요.',uid:'0000 0000 0000 0000',discord:'@사용자명',state:'322',alliance:'소속 연맹이 없다면 비워두세요.',reason:'이민 신청 사유를 입력해주세요.',notes:'운영진에게 추가로 전달할 내용이 있다면 입력해주세요.',group:'함께 이민하는 연맹 / 그룹 / 친구',referrer:'EZPK 멤버의 게임 닉네임'},
      discordHelp:'Discord를 사용하지 않는 경우 게임 내 DM으로 연락드립니다.',industrySummary:'산업 레벨 {value} / 10',spendingSummary:'{value} / 10 · {label}',
      spending:['무과금 / 소과금','중과금','고과금','핵과금'],tiers:{gray:'일반',blue:'중급',purple:'고급',gold:'특급'},
      review:['신청자 정보','현재 정보','이민 프로필','이민 등급','이민 사유','동반 이민'],
      errors:{required:'필수 항목입니다.',uid:'게임 UID는 숫자 16자리로 입력해주세요.',uidTooLong:'UID는 16자리 숫자만 입력할 수 있습니다.',state:'현재 서버는 숫자만 입력해주세요.',power:'0보다 큰 숫자를 소수점 최대 2자리까지 입력해주세요.',unit:'차량 파워 단위를 선택해주세요.',industry:'산업 레벨을 선택해주세요.',spending:'과금 타입을 선택해주세요.',tier:'이민 등급을 선택해주세요.',reason:'이민 신청 사유를 입력해주세요.',duplicate:'이미 신청이 접수된 UID입니다. 신청 현황 조회에서 현재 상태를 확인해 주세요.',rate:'잠시 후 다시 시도해주세요. 요청이 너무 많습니다.',retry:'이민 신청을 제출하지 못했습니다. 잠시 후 다시 시도해주세요.'},
      successTitle:'이민 신청이 접수되었습니다',successBody1:'이민 신청이 정상적으로 제출되었습니다.',successBody2:'EZPK 운영진이 신청 내용을 확인한 후 게임 내 DM 또는 Discord를 통해 연락드릴 예정입니다.',successBody3:'검토까지 시간이 소요될 수 있습니다.',home:'홈으로 돌아가기'
    },
    en:{
      pageTitle:'EZPK Migration Application',heroKicker:'STATE #322 · EZPK MIGRATION',heroTitle:'EZPK Migration Application',heroBody:'We are looking for new players to join EZPK. Our leadership team will review your application and contact you individually.',
      stepCounter:'Step {step} / 7',next:'Next',prev:'Previous',submit:'Submit Migration Application',submitting:'Submitting...',edit:'Edit',required:'Required',optional:'Optional',notEntered:'Not entered',example:'Example: 1.23',
      steps:[['Applicant Information','Enter your in-game identity and contact information.'],['Current Information','Tell us your current state and alliance.'],['Migration Profile','Enter your vehicle power and current progression.'],['Migration Tier','Select the migration tier that applies to you.'],['Reason for Migration','Tell us why you want to migrate and join EZPK.'],['Migrating Together','Add a group or referrer if applicable.'],['Final Review','Review your information before submitting.']],
      f:{playerName:'Player Name',gameUid:'Game UID',discord:'Discord',currentState:'Current State',currentAlliance:'Current Alliance',vehicle1:'Vehicle 1 Power',vehicle2:'Vehicle 2 Power',industry:'Industry Level',spending:'Spending Type',tier:'Migration Tier',reason:'Reason for Migration',notes:'Additional Notes',group:'Migrating Group',referrer:'Referrer'},
      p:{playerName:'Enter your in-game name.',uid:'0000 0000 0000 0000',discord:'@username',state:'322',alliance:'Leave blank if you are not in an alliance.',reason:'Tell us why you are applying.',notes:'Add anything else you want the leadership team to know.',group:'Alliance / group / friends migrating with you',referrer:'In-game name of an EZPK member'},
      discordHelp:'If you do not use Discord, we will contact you by in-game DM.',industrySummary:'Industry Level {value} / 10',spendingSummary:'{value} / 10 · {label}',
      spending:['Free / Light Spender','Moderate Spender','Heavy Spender','Whale'],tiers:{gray:'Normal',blue:'Intermediate',purple:'Advanced',gold:'Special'},review:['Applicant Information','Current Information','Migration Profile','Migration Tier','Reason for Migration','Migrating Together'],
      errors:{required:'This field is required.',uid:'Game UID must contain exactly 16 digits.',uidTooLong:'Game UID can contain up to 16 digits.',state:'Current State must contain digits only.',power:'Enter a number greater than 0 with up to 2 decimal places.',unit:'Select a power unit.',industry:'Select your Industry Level.',spending:'Select your Spending Type.',tier:'Select your Migration Tier.',reason:'Enter your reason for migration.',duplicate:'An application has already been submitted for this UID. Check Application Status to view its current status.',rate:'Too many requests. Please try again later.',retry:'We could not submit your application. Please try again shortly.'},
      successTitle:'Migration Application Received',successBody1:'Your migration application was submitted successfully.',successBody2:'EZPK leadership will review your application and contact you through in-game DM or Discord.',successBody3:'The review may take some time.',home:'Return Home'
    },
    pt:{
      pageTitle:'Solicitação de Migração EZPK',heroKicker:'ESTADO #322 · MIGRAÇÃO EZPK',heroTitle:'Solicitação de Migração EZPK',heroBody:'Estamos procurando novos jogadores para se juntarem à EZPK. A liderança analisará sua solicitação e entrará em contato individualmente.',
      stepCounter:'Etapa {step} / 7',next:'Próximo',prev:'Anterior',submit:'Enviar Solicitação de Migração',submitting:'Enviando...',edit:'Editar',required:'Obrigatório',optional:'Opcional',notEntered:'Não informado',example:'Ex.: 1.23',
      steps:[['Informações do Candidato','Informe sua identidade no jogo e um meio de contato.'],['Informações Atuais','Informe seu estado e aliança atuais.'],['Perfil de Migração','Informe o poder dos veículos e seu progresso atual.'],['Nível de Migração','Selecione o nível de migração correspondente.'],['Motivo da Migração','Conte por que deseja migrar e entrar na EZPK.'],['Migração em Grupo','Informe grupo ou indicação, se houver.'],['Revisão Final','Confira as informações antes de enviar.']],
      f:{playerName:'Nome no Jogo',gameUid:'UID do Jogo',discord:'Discord',currentState:'Estado Atual',currentAlliance:'Aliança Atual',vehicle1:'Poder do Veículo 1',vehicle2:'Poder do Veículo 2',industry:'Nível Industrial',spending:'Tipo de Gastos',tier:'Nível de Migração',reason:'Motivo da Migração',notes:'Observações Adicionais',group:'Grupo que Migra Junto',referrer:'Indicação'},
      p:{playerName:'Digite seu nome no jogo.',uid:'0000 0000 0000 0000',discord:'@usuario',state:'322',alliance:'Deixe em branco se não estiver em uma aliança.',reason:'Conte o motivo da sua solicitação.',notes:'Adicione outras informações para a liderança.',group:'Aliança / grupo / amigos que migram com você',referrer:'Nome no jogo de um membro da EZPK'},discordHelp:'Se você não usa Discord, entraremos em contato por DM no jogo.',industrySummary:'Nível Industrial {value} / 10',spendingSummary:'{value} / 10 · {label}',spending:['Gratuito / Baixo gasto','Gasto médio','Alto gasto','Gasto muito alto'],tiers:{gray:'Normal',blue:'Intermediário',purple:'Avançado',gold:'Especial'},review:['Informações do Candidato','Informações Atuais','Perfil de Migração','Nível de Migração','Motivo da Migração','Migração em Grupo'],
      errors:{required:'Este campo é obrigatório.',uid:'O UID deve conter exatamente 16 dígitos.',uidTooLong:'O UID pode conter no máximo 16 dígitos.',state:'O Estado Atual deve conter apenas números.',power:'Digite um número maior que 0 com até 2 casas decimais.',unit:'Selecione a unidade de poder.',industry:'Selecione o Nível Industrial.',spending:'Selecione o Tipo de Gastos.',tier:'Selecione o Nível de Migração.',reason:'Informe o motivo da migração.',duplicate:'Já existe uma solicitação enviada para este UID. Consulte o status da solicitação para ver a situação atual.',rate:'Muitas solicitações. Tente novamente mais tarde.',retry:'Não foi possível enviar a solicitação. Tente novamente em instantes.'},
      successTitle:'Solicitação de Migração Recebida',successBody1:'Sua solicitação de migração foi enviada com sucesso.',successBody2:'A liderança da EZPK analisará a solicitação e entrará em contato por DM no jogo ou Discord.',successBody3:'A análise pode levar algum tempo.',home:'Voltar ao Início'
    },
    vi:{
      pageTitle:'Đơn Đăng ký Di cư EZPK',heroKicker:'BANG #322 · DI CƯ EZPK',heroTitle:'Đơn Đăng ký Di cư EZPK',heroBody:'EZPK đang chờ đón những người chơi mới. Ban quản lý sẽ xem xét đơn và liên hệ riêng với bạn.',stepCounter:'Bước {step} / 7',next:'Tiếp theo',prev:'Quay lại',submit:'Gửi Đơn Di cư',submitting:'Đang gửi...',edit:'Sửa',required:'Bắt buộc',optional:'Tùy chọn',notEntered:'Chưa nhập',example:'Ví dụ: 1.23',
      steps:[['Thông tin Người đăng ký','Nhập danh tính trong game và thông tin liên hệ.'],['Thông tin Hiện tại','Cho biết bang và liên minh hiện tại.'],['Hồ sơ Di cư','Nhập sức mạnh xe và tiến độ hiện tại.'],['Hạng Di cư','Chọn hạng di cư phù hợp.'],['Lý do Di cư','Hãy cho biết lý do bạn muốn di cư và gia nhập EZPK.'],['Di cư Cùng nhau','Nhập nhóm hoặc người giới thiệu nếu có.'],['Xác nhận Cuối','Kiểm tra thông tin trước khi gửi.']],
      f:{playerName:'Tên trong Game',gameUid:'UID Game',discord:'Discord',currentState:'Bang Hiện tại',currentAlliance:'Liên minh Hiện tại',vehicle1:'Sức mạnh Xe 1',vehicle2:'Sức mạnh Xe 2',industry:'Cấp Công nghiệp',spending:'Mức Chi tiêu',tier:'Hạng Di cư',reason:'Lý do Di cư',notes:'Thông tin Bổ sung',group:'Nhóm Di cư Cùng',referrer:'Người Giới thiệu'},
      p:{playerName:'Nhập tên trong game.',uid:'0000 0000 0000 0000',discord:'@tennguoidung',state:'322',alliance:'Để trống nếu không thuộc liên minh.',reason:'Nhập lý do đăng ký di cư.',notes:'Thêm thông tin muốn gửi đến ban quản lý.',group:'Liên minh / nhóm / bạn bè đi cùng',referrer:'Tên trong game của thành viên EZPK'},discordHelp:'Nếu không dùng Discord, chúng tôi sẽ liên hệ qua DM trong game.',industrySummary:'Cấp Công nghiệp {value} / 10',spendingSummary:'{value} / 10 · {label}',spending:['Không nạp / Nạp ít','Nạp trung bình','Nạp nhiều','Nạp rất nhiều'],tiers:{gray:'Thường',blue:'Trung cấp',purple:'Cao cấp',gold:'Đặc biệt'},review:['Thông tin Người đăng ký','Thông tin Hiện tại','Hồ sơ Di cư','Hạng Di cư','Lý do Di cư','Di cư Cùng nhau'],
      errors:{required:'Đây là mục bắt buộc.',uid:'UID phải gồm đúng 16 chữ số.',uidTooLong:'UID chỉ có thể chứa tối đa 16 chữ số.',state:'Bang hiện tại chỉ được nhập số.',power:'Nhập số lớn hơn 0 với tối đa 2 chữ số thập phân.',unit:'Chọn đơn vị sức mạnh.',industry:'Chọn Cấp Công nghiệp.',spending:'Chọn Mức Chi tiêu.',tier:'Chọn Hạng Di cư.',reason:'Nhập lý do di cư.',duplicate:'UID này đã được dùng để gửi đơn. Hãy kiểm tra Trạng thái Đơn để xem tình trạng hiện tại.',rate:'Có quá nhiều yêu cầu. Vui lòng thử lại sau.',retry:'Không thể gửi đơn. Vui lòng thử lại sau ít phút.'},
      successTitle:'Đã Nhận Đơn Di cư',successBody1:'Đơn di cư của bạn đã được gửi thành công.',successBody2:'Ban quản lý EZPK sẽ xem xét và liên hệ qua DM trong game hoặc Discord.',successBody3:'Quá trình xem xét có thể mất một thời gian.',home:'Về Trang chủ'
    },
    ar:{
      pageTitle:'طلب الهجرة إلى EZPK',heroKicker:'الولاية #322 · هجرة EZPK',heroTitle:'طلب الهجرة إلى EZPK',heroBody:'نرحب بلاعبين جدد للانضمام إلى EZPK. ستراجع الإدارة طلبك وتتواصل معك بشكل فردي.',stepCounter:'الخطوة {step} / 7',next:'التالي',prev:'السابق',submit:'إرسال طلب الهجرة',submitting:'جارٍ الإرسال...',edit:'تعديل',required:'مطلوب',optional:'اختياري',notEntered:'غير مُدخل',example:'مثال: 1.23',
      steps:[['بيانات مقدم الطلب','أدخل هويتك داخل اللعبة ومعلومات التواصل.'],['المعلومات الحالية','أدخل الولاية والتحالف الحاليين.'],['ملف الهجرة','أدخل قوة المركبات ومستوى تقدمك الحالي.'],['فئة الهجرة','اختر فئة الهجرة المناسبة لك.'],['سبب الهجرة','اكتب سبب رغبتك في الهجرة والانضمام إلى EZPK.'],['الهجرة مع آخرين','أدخل المجموعة أو الشخص الذي قام بترشيحك إن وجد.'],['المراجعة النهائية','راجع معلوماتك قبل الإرسال.']],
      f:{playerName:'اسم اللاعب',gameUid:'UID اللعبة',discord:'Discord',currentState:'الولاية الحالية',currentAlliance:'التحالف الحالي',vehicle1:'قوة المركبة 1',vehicle2:'قوة المركبة 2',industry:'مستوى الصناعة',spending:'نوع الإنفاق',tier:'فئة الهجرة',reason:'سبب الهجرة',notes:'ملاحظات إضافية',group:'المجموعة المهاجرة معك',referrer:'المرشِّح'},
      p:{playerName:'أدخل اسمك داخل اللعبة.',uid:'0000 0000 0000 0000',discord:'@username',state:'322',alliance:'اتركه فارغًا إذا لم تكن في تحالف.',reason:'اكتب سبب تقديم طلب الهجرة.',notes:'أضف أي معلومات أخرى تريد إيصالها للإدارة.',group:'التحالف / المجموعة / الأصدقاء المهاجرون معك',referrer:'اسم عضو EZPK داخل اللعبة'},discordHelp:'إذا لم تستخدم Discord فسنتواصل معك عبر رسالة داخل اللعبة.',industrySummary:'مستوى الصناعة {value} / 10',spendingSummary:'{value} / 10 · {label}',spending:['مجاني / إنفاق منخفض','إنفاق متوسط','إنفاق مرتفع','إنفاق كثيف'],tiers:{gray:'عادي',blue:'متوسط',purple:'متقدم',gold:'خاص'},review:['بيانات مقدم الطلب','المعلومات الحالية','ملف الهجرة','فئة الهجرة','سبب الهجرة','الهجرة مع آخرين'],
      errors:{required:'هذا الحقل مطلوب.',uid:'يجب أن يتكون UID من 16 رقمًا بالضبط.',uidTooLong:'يمكن أن يتكون UID من 16 رقمًا كحد أقصى.',state:'يجب أن تحتوي الولاية الحالية على أرقام فقط.',power:'أدخل رقمًا أكبر من 0 وبحد أقصى منزلتين عشريتين.',unit:'اختر وحدة القوة.',industry:'اختر مستوى الصناعة.',spending:'اختر نوع الإنفاق.',tier:'اختر فئة الهجرة.',reason:'أدخل سبب الهجرة.',duplicate:'تم تقديم طلب بالفعل باستخدام UID هذا. تحقق من حالة الطلب لمعرفة حالته الحالية.',rate:'طلبات كثيرة جدًا. حاول مرة أخرى لاحقًا.',retry:'تعذر إرسال الطلب. حاول مرة أخرى بعد قليل.'},
      successTitle:'تم استلام طلب الهجرة',successBody1:'تم إرسال طلب الهجرة بنجاح.',successBody2:'ستراجع إدارة EZPK الطلب وتتواصل معك عبر رسالة داخل اللعبة أو Discord.',successBody3:'قد تستغرق المراجعة بعض الوقت.',home:'العودة إلى الرئيسية'
    },
    ja:{
      pageTitle:'EZPK 移住申請',heroKicker:'ステート #322 · EZPK MIGRATION',heroTitle:'EZPK 移住申請',heroBody:'EZPKで一緒に活動する新しい仲間を募集しています。運営チームが申請内容を確認し、個別にご連絡します。',stepCounter:'{step} / 7 ステップ',next:'次へ',prev:'戻る',submit:'移住申請を送信',submitting:'送信中...',edit:'修正',required:'必須',optional:'任意',notEntered:'未入力',example:'例) 1.23',
      steps:[['申請者情報','ゲーム内の本人情報と連絡先を入力してください。'],['現在の情報','現在のステートと同盟を入力してください。'],['移住プロフィール','車両戦力と現在の成長情報を入力してください。'],['移住等級','該当する移住等級を選択してください。'],['移住理由','移住を決めた理由とEZPKに参加したい理由を記入してください。'],['同伴移住','一緒に移住するグループや紹介者がいれば入力してください。'],['最終確認','送信前に入力内容を確認してください。']],
      f:{playerName:'ゲームニックネーム',gameUid:'ゲームUID',discord:'Discord',currentState:'現在のステート',currentAlliance:'現在の同盟',vehicle1:'車両1 戦力',vehicle2:'車両2 戦力',industry:'産業レベル',spending:'課金タイプ',tier:'移住等級',reason:'移住申請理由',notes:'追加事項',group:'一緒に移住するグループ',referrer:'紹介者'},
      p:{playerName:'ゲーム内の名前を入力してください。',uid:'0000 0000 0000 0000',discord:'@ユーザー名',state:'322',alliance:'無所属の場合は空欄にしてください。',reason:'移住申請の理由を入力してください。',notes:'運営へ追加で伝えたい内容があれば入力してください。',group:'一緒に移住する同盟 / グループ / 友人',referrer:'EZPKメンバーのゲーム内ニックネーム'},discordHelp:'Discordを使用していない場合はゲーム内DMでご連絡します。',industrySummary:'産業レベル {value} / 10',spendingSummary:'{value} / 10 · {label}',spending:['無課金 / 微課金','中課金','高課金','重課金'],tiers:{gray:'一般',blue:'中級',purple:'上級',gold:'特級'},review:['申請者情報','現在の情報','移住プロフィール','移住等級','移住理由','同伴移住'],
      errors:{required:'必須項目です。',uid:'ゲームUIDは16桁の数字で入力してください。',uidTooLong:'ゲームUIDは16桁までの数字のみ入力できます。',state:'現在のステートは数字のみ入力してください。',power:'0より大きい数値を小数点以下2桁まで入力してください。',unit:'戦力の単位を選択してください。',industry:'産業レベルを選択してください。',spending:'課金タイプを選択してください。',tier:'移住等級を選択してください。',reason:'移住理由を入力してください。',duplicate:'このUIDではすでに申請が提出されています。移住申請ステータス確認で現在の状況をご確認ください。',rate:'リクエストが多すぎます。しばらくしてから再度お試しください。',retry:'申請を送信できませんでした。しばらくしてから再度お試しください。'},
      successTitle:'移住申請を受け付けました',successBody1:'移住申請が正常に送信されました。',successBody2:'EZPK運営が内容を確認後、ゲーム内DMまたはDiscordでご連絡します。',successBody3:'確認には時間がかかる場合があります。',home:'ホームへ戻る'
    },
    th:{
      pageTitle:'ใบสมัครย้ายเซิร์ฟเวอร์ EZPK',heroKicker:'รัฐ #322 · EZPK MIGRATION',heroTitle:'ใบสมัครย้ายเซิร์ฟเวอร์ EZPK',heroBody:'เรากำลังรอสมาชิกใหม่ที่จะเข้าร่วม EZPK ทีมบริหารจะตรวจสอบใบสมัครและติดต่อคุณเป็นรายบุคคล',stepCounter:'ขั้นตอน {step} / 7',next:'ถัดไป',prev:'ก่อนหน้า',submit:'ส่งใบสมัครย้ายเซิร์ฟเวอร์',submitting:'กำลังส่ง...',edit:'แก้ไข',required:'จำเป็น',optional:'ไม่บังคับ',notEntered:'ไม่ได้ระบุ',example:'ตัวอย่าง: 1.23',
      steps:[['ข้อมูลผู้สมัคร','กรอกตัวตนในเกมและข้อมูลติดต่อของคุณ'],['ข้อมูลปัจจุบัน','กรอกรัฐและพันธมิตรปัจจุบัน'],['โปรไฟล์การย้าย','กรอกพลังรถและความคืบหน้าปัจจุบัน'],['ระดับการย้าย','เลือกระดับการย้ายที่ตรงกับคุณ'],['เหตุผลในการย้าย','บอกเหตุผลที่ต้องการย้ายและเข้าร่วม EZPK'],['ย้ายมาด้วยกัน','กรอกกลุ่มหรือผู้แนะนำ หากมี'],['ตรวจสอบขั้นสุดท้าย','ตรวจสอบข้อมูลก่อนส่งใบสมัคร']],
      f:{playerName:'ชื่อในเกม',gameUid:'UID เกม',discord:'Discord',currentState:'รัฐปัจจุบัน',currentAlliance:'พันธมิตรปัจจุบัน',vehicle1:'พลังรถ 1',vehicle2:'พลังรถ 2',industry:'ระดับอุตสาหกรรม',spending:'ประเภทการเติม',tier:'ระดับการย้าย',reason:'เหตุผลในการย้าย',notes:'ข้อมูลเพิ่มเติม',group:'กลุ่มที่ย้ายมาด้วยกัน',referrer:'ผู้แนะนำ'},
      p:{playerName:'กรอกชื่อในเกม',uid:'0000 0000 0000 0000',discord:'@ชื่อผู้ใช้',state:'322',alliance:'เว้นว่างหากไม่ได้อยู่ในพันธมิตร',reason:'กรอกเหตุผลในการสมัครย้าย',notes:'เพิ่มข้อมูลอื่นที่ต้องการแจ้งทีมบริหาร',group:'พันธมิตร / กลุ่ม / เพื่อนที่ย้ายมาด้วยกัน',referrer:'ชื่อในเกมของสมาชิก EZPK'},discordHelp:'หากไม่ได้ใช้ Discord เราจะติดต่อผ่าน DM ในเกม',industrySummary:'ระดับอุตสาหกรรม {value} / 10',spendingSummary:'{value} / 10 · {label}',spending:['ไม่เติม / เติมน้อย','เติมปานกลาง','เติมสูง','เติมหนัก'],tiers:{gray:'ทั่วไป',blue:'ระดับกลาง',purple:'ขั้นสูง',gold:'พิเศษ'},review:['ข้อมูลผู้สมัคร','ข้อมูลปัจจุบัน','โปรไฟล์การย้าย','ระดับการย้าย','เหตุผลในการย้าย','ย้ายมาด้วยกัน'],
      errors:{required:'จำเป็นต้องกรอกข้อมูลนี้',uid:'UID เกมต้องเป็นตัวเลข 16 หลัก',uidTooLong:'UID เกมกรอกได้สูงสุด 16 หลักเท่านั้น',state:'รัฐปัจจุบันต้องเป็นตัวเลขเท่านั้น',power:'กรอกตัวเลขมากกว่า 0 และทศนิยมไม่เกิน 2 ตำแหน่ง',unit:'เลือกหน่วยพลัง',industry:'เลือกระดับอุตสาหกรรม',spending:'เลือกประเภทการเติม',tier:'เลือกระดับการย้าย',reason:'กรอกเหตุผลในการย้าย',duplicate:'มีการส่งใบสมัครด้วย UID นี้แล้ว โปรดตรวจสอบสถานะใบสมัครเพื่อดูสถานะปัจจุบัน',rate:'มีคำขอมากเกินไป โปรดลองอีกครั้งภายหลัง',retry:'ไม่สามารถส่งใบสมัครได้ โปรดลองอีกครั้งในภายหลัง'},
      successTitle:'ได้รับใบสมัครย้ายแล้ว',successBody1:'ส่งใบสมัครย้ายเรียบร้อยแล้ว',successBody2:'ทีมบริหาร EZPK จะตรวจสอบและติดต่อผ่าน DM ในเกมหรือ Discord',successBody3:'การตรวจสอบอาจใช้เวลาสักระยะ',home:'กลับหน้าหลัก'
    },
    'zh-tw':{
      pageTitle:'EZPK 移民申請',heroKicker:'州 #322 · EZPK MIGRATION',heroTitle:'EZPK 移民申請',heroBody:'EZPK 正在等待新的夥伴加入。管理團隊將審核您的申請，並個別與您聯絡。',stepCounter:'第 {step} 步 / 共 7 步',next:'下一步',prev:'上一步',submit:'提交移民申請',submitting:'提交中...',edit:'修改',required:'必填',optional:'選填',notEntered:'未填寫',example:'例：1.23',
      steps:[['申請人資訊','請輸入遊戲內身分與聯絡資訊。'],['目前資訊','請輸入目前所在州與聯盟。'],['移民資料','請輸入車輛戰力與目前成長資訊。'],['移民等級','請選擇目前適用的移民等級。'],['移民原因','請說明決定移民以及想加入 EZPK 的原因。'],['同行移民','如有同行群組或推薦人，請填寫。'],['最終確認','提交前請確認輸入內容。']],
      f:{playerName:'遊戲暱稱',gameUid:'遊戲 UID',discord:'Discord',currentState:'目前州',currentAlliance:'目前聯盟',vehicle1:'1 號車輛戰力',vehicle2:'2 號車輛戰力',industry:'產業等級',spending:'課金類型',tier:'移民等級',reason:'移民申請原因',notes:'補充說明',group:'同行移民群組',referrer:'推薦人'},
      p:{playerName:'請輸入遊戲暱稱。',uid:'0000 0000 0000 0000',discord:'@使用者名稱',state:'322',alliance:'若無所屬聯盟可留空。',reason:'請輸入移民申請原因。',notes:'如有其他想告知管理團隊的內容，請填寫。',group:'同行的聯盟 / 群組 / 朋友',referrer:'EZPK 成員的遊戲暱稱'},discordHelp:'若未使用 Discord，我們會透過遊戲內 DM 聯絡您。',industrySummary:'產業等級 {value} / 10',spendingSummary:'{value} / 10 · {label}',spending:['無課 / 微課','中課','高課','重課'],tiers:{gray:'一般',blue:'中級',purple:'高級',gold:'特級'},review:['申請人資訊','目前資訊','移民資料','移民等級','移民原因','同行移民'],
      errors:{required:'此欄位為必填。',uid:'遊戲 UID 必須為 16 位數字。',uidTooLong:'遊戲 UID 最多只能輸入 16 位數字。',state:'目前州只能輸入數字。',power:'請輸入大於 0 且最多 2 位小數的數值。',unit:'請選擇戰力單位。',industry:'請選擇產業等級。',spending:'請選擇課金類型。',tier:'請選擇移民等級。',reason:'請輸入移民原因。',duplicate:'此 UID 已提交過移民申請。請至移民申請狀態查詢查看目前狀態。',rate:'請求過於頻繁，請稍後再試。',retry:'無法提交申請，請稍後再試。'},
      successTitle:'已收到移民申請',successBody1:'您的移民申請已成功提交。',successBody2:'EZPK 管理團隊審核後，將透過遊戲內 DM 或 Discord 與您聯絡。',successBody3:'審核可能需要一些時間。',home:'返回首頁'
    }
  };

  const STATUS_TEXT=Object.freeze({
    ko:{title:'이민 신청 상태 조회',help:'신청할 때 사용한 16자리 게임 UID를 입력하면 현재 진행 상태를 확인할 수 있습니다.',placeholder:'16자리 게임 UID',button:'조회',checking:'조회 중...',invalid:'게임 UID는 숫자 16자리로 입력해주세요.',tooLong:'UID는 16자리 숫자만 입력할 수 있습니다.',notFound:'해당 UID로 접수된 이민 신청을 찾을 수 없습니다.',rate:'조회 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',retry:'신청 상태를 조회하지 못했습니다. 잠시 후 다시 시도해주세요.',updated:'최근 상태 변경 · {date}',statuses:{received:['접수 중','신청서 접수가 완료되어 검토를 기다리고 있습니다.'],reviewing:['검토 중','운영진이 신청 내용을 검토하고 있습니다.'],approved:['승인','이민 신청이 승인되었습니다. 운영진의 연락을 확인해주세요.'],rejected:['거절','이민 신청이 승인되지 않았습니다.']}},
    en:{title:'Check Application Status',help:'Enter the 16-digit Game UID used for your application to check its current status.',placeholder:'16-digit Game UID',button:'Check Status',checking:'Checking...',invalid:'Game UID must contain exactly 16 digits.',tooLong:'Game UID can contain up to 16 digits.',notFound:'No migration application was found for this UID.',rate:'Too many status checks. Please try again later.',retry:'We could not check the application status. Please try again shortly.',updated:'Last status change · {date}',statuses:{received:['Received','Your application has been received and is waiting for review.'],reviewing:['Under Review','The leadership team is reviewing your application.'],approved:['Approved','Your migration application has been approved. Please check for a message from leadership.'],rejected:['Rejected','Your migration application was not approved.']}},
    pt:{title:'Consultar Status da Solicitação',help:'Digite o UID de 16 dígitos usado na solicitação para consultar o status atual.',placeholder:'UID de 16 dígitos',button:'Consultar',checking:'Consultando...',invalid:'O UID deve conter exatamente 16 dígitos.',tooLong:'O UID pode conter no máximo 16 dígitos.',notFound:'Nenhuma solicitação de migração foi encontrada para este UID.',rate:'Muitas consultas. Tente novamente mais tarde.',retry:'Não foi possível consultar o status. Tente novamente em instantes.',updated:'Última alteração de status · {date}',statuses:{received:['Recebida','Sua solicitação foi recebida e aguarda análise.'],reviewing:['Em análise','A liderança está analisando sua solicitação.'],approved:['Aprovada','Sua solicitação de migração foi aprovada. Verifique as mensagens da liderança.'],rejected:['Recusada','Sua solicitação de migração não foi aprovada.']}},
    vi:{title:'Kiểm tra Trạng thái Đơn',help:'Nhập UID Game 16 chữ số đã dùng khi đăng ký để xem trạng thái hiện tại.',placeholder:'UID Game 16 chữ số',button:'Kiểm tra',checking:'Đang kiểm tra...',invalid:'UID phải gồm đúng 16 chữ số.',tooLong:'UID chỉ có thể chứa tối đa 16 chữ số.',notFound:'Không tìm thấy đơn di cư cho UID này.',rate:'Có quá nhiều lượt kiểm tra. Vui lòng thử lại sau.',retry:'Không thể kiểm tra trạng thái. Vui lòng thử lại sau ít phút.',updated:'Thay đổi trạng thái gần nhất · {date}',statuses:{received:['Đã tiếp nhận','Đơn của bạn đã được tiếp nhận và đang chờ xem xét.'],reviewing:['Đang xem xét','Ban quản lý đang xem xét đơn của bạn.'],approved:['Đã duyệt','Đơn di cư của bạn đã được duyệt. Vui lòng kiểm tra tin nhắn từ ban quản lý.'],rejected:['Bị từ chối','Đơn di cư của bạn không được duyệt.']}},
    ar:{title:'التحقق من حالة الطلب',help:'أدخل UID اللعبة المكوّن من 16 رقمًا والمستخدم في الطلب لمعرفة حالته الحالية.',placeholder:'UID اللعبة من 16 رقمًا',button:'تحقق',checking:'جارٍ التحقق...',invalid:'يجب أن يتكون UID من 16 رقمًا بالضبط.',tooLong:'يمكن أن يتكون UID من 16 رقمًا كحد أقصى.',notFound:'لم يتم العثور على طلب هجرة لهذا UID.',rate:'طلبات تحقق كثيرة جدًا. حاول مرة أخرى لاحقًا.',retry:'تعذر التحقق من حالة الطلب. حاول مرة أخرى بعد قليل.',updated:'آخر تغيير للحالة · {date}',statuses:{received:['تم الاستلام','تم استلام طلبك وهو بانتظار المراجعة.'],reviewing:['قيد المراجعة','تقوم الإدارة بمراجعة طلبك.'],approved:['تمت الموافقة','تمت الموافقة على طلب الهجرة. يرجى التحقق من رسائل الإدارة.'],rejected:['مرفوض','لم تتم الموافقة على طلب الهجرة.']}},
    ja:{title:'移住申請ステータス確認',help:'申請時に使用した16桁のゲームUIDを入力すると、現在の進行状況を確認できます。',placeholder:'16桁のゲームUID',button:'確認',checking:'確認中...',invalid:'ゲームUIDは16桁の数字で入力してください。',tooLong:'ゲームUIDは16桁までの数字のみ入力できます。',notFound:'このUIDの移住申請は見つかりませんでした。',rate:'確認リクエストが多すぎます。しばらくしてから再度お試しください。',retry:'申請ステータスを確認できませんでした。しばらくしてから再度お試しください。',updated:'最終ステータス変更 · {date}',statuses:{received:['受付中','申請を受け付けました。審査開始までお待ちください。'],reviewing:['審査中','運営チームが申請内容を審査しています。'],approved:['承認','移住申請が承認されました。運営からの連絡をご確認ください。'],rejected:['否決','移住申請は承認されませんでした。']}},
    th:{title:'ตรวจสอบสถานะใบสมัคร',help:'กรอก UID เกม 16 หลักที่ใช้สมัครเพื่อตรวจสอบสถานะปัจจุบัน',placeholder:'UID เกม 16 หลัก',button:'ตรวจสอบ',checking:'กำลังตรวจสอบ...',invalid:'UID เกมต้องเป็นตัวเลข 16 หลัก',tooLong:'UID เกมกรอกได้สูงสุด 16 หลักเท่านั้น',notFound:'ไม่พบใบสมัครย้ายสำหรับ UID นี้',rate:'มีการตรวจสอบมากเกินไป โปรดลองอีกครั้งภายหลัง',retry:'ไม่สามารถตรวจสอบสถานะได้ โปรดลองอีกครั้งในภายหลัง',updated:'เปลี่ยนสถานะล่าสุด · {date}',statuses:{received:['รับใบสมัครแล้ว','รับใบสมัครของคุณแล้วและกำลังรอการตรวจสอบ'],reviewing:['กำลังตรวจสอบ','ทีมบริหารกำลังตรวจสอบใบสมัครของคุณ'],approved:['อนุมัติ','ใบสมัครย้ายของคุณได้รับการอนุมัติแล้ว โปรดตรวจสอบข้อความจากทีมบริหาร'],rejected:['ปฏิเสธ','ใบสมัครย้ายของคุณไม่ได้รับการอนุมัติ']}},
    'zh-tw':{title:'查詢移民申請狀態',help:'輸入申請時使用的 16 位遊戲 UID，即可查看目前進度。',placeholder:'16 位遊戲 UID',button:'查詢',checking:'查詢中...',invalid:'遊戲 UID 必須為 16 位數字。',tooLong:'遊戲 UID 最多只能輸入 16 位數字。',notFound:'找不到此 UID 的移民申請。',rate:'查詢次數過多，請稍後再試。',retry:'目前無法查詢申請狀態，請稍後再試。',updated:'最近狀態變更 · {date}',statuses:{received:['已接收','申請已成功接收，正在等待審核。'],reviewing:['審核中','管理團隊正在審核您的申請。'],approved:['已批准','您的移民申請已批准，請留意管理團隊的聯絡。'],rejected:['已拒絕','您的移民申請未獲批准。']}}
  });

  const app=document.getElementById('migrationApp');
  const shell=document.getElementById('migrationFormShell');
  const success=document.getElementById('migrationSuccess');
  const form=document.getElementById('migrationForm');
  const body=document.getElementById('migrationStepBody');
  const counter=document.getElementById('migrationStepCounter');
  const title=document.getElementById('migrationStepTitle');
  const desc=document.getElementById('migrationStepDescription');
  const progress=document.getElementById('migrationProgressBar');
  const prev=document.getElementById('migrationPrev');
  const next=document.getElementById('migrationNext');
  const submitError=document.getElementById('migrationSubmitError');
  let step=0, errors={}, submitting=false;
  const statusLookup={uid:'',phase:'idle',applicationStatus:'',updatedAt:''};
  const state={playerName:'',gameUid:'',discord:'',currentState:'',currentAlliance:'',vehicle1PowerValue:'',vehicle1PowerUnit:'',vehicle2PowerValue:'',vehicle2PowerUnit:'',industryLevel:null,spendingLevel:null,migrationTier:'',migrationReason:'',additionalNotes:'',migrationGroup:'',referrer:''};

  const esc=(value)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const lang=()=>{const code=localStorage.getItem(LANG_KEY)||'en';return LANGS.includes(code)?code:'en'};
  const t=()=>TEXT[lang()]||TEXT.en;
  const statusT=()=>STATUS_TEXT[lang()]||STATUS_TEXT.en;
  const fill=(text,values={})=>Object.entries(values).reduce((out,[k,v])=>out.replaceAll(`{${k}}`,String(v)),text);
  const requiredMark=()=>`<span class="migration-required" aria-hidden="true">*</span>`;
  const errorHtml=(key)=>errors[key]?`<div class="migration-error" data-error-for="${key}" role="alert">${esc(errors[key])}</div>`:'';
  const invalid=(key)=>errors[key]?' aria-invalid="true"':'';

  function setInlineFieldError(key,message){
    errors[key]=message;
    const el=body.querySelector(`[data-field="${key}"]`);
    if(!el)return;
    el.setAttribute('aria-invalid','true');
    let node=body.querySelector(`[data-error-for="${key}"]`);
    if(!node){node=document.createElement('div');node.className='migration-error';node.dataset.errorFor=key;node.setAttribute('role','alert');el.closest('.migration-field')?.appendChild(node);}
    node.textContent=message;
  }
  function clearInlineFieldError(key){
    delete errors[key];
    const el=body.querySelector(`[data-field="${key}"]`);
    el?.removeAttribute('aria-invalid');
    body.querySelector(`[data-error-for="${key}"]`)?.remove();
  }
  function updateStatusInlineError(input,message=''){
    if(!input)return;
    const wrap=input.closest('.migration-status-input-wrap');
    let node=wrap?.querySelector('[data-status-error]');
    if(message){
      input.setAttribute('aria-invalid','true');
      if(!node&&wrap){node=document.createElement('div');node.className='migration-error';node.dataset.statusError='';node.setAttribute('role','alert');wrap.appendChild(node);}
      if(node)node.textContent=message;
    }else{
      input.removeAttribute('aria-invalid');
      node?.remove();
    }
  }

  function field(key,label,value,opts={}){
    const type=opts.type||'text',req=opts.required?requiredMark():'';
    const attr=[`data-field="${key}"`,`value="${esc(value)}"`,`type="${type}"`,opts.placeholder?`placeholder="${esc(opts.placeholder)}"`:'',opts.inputmode?`inputmode="${opts.inputmode}"`:'',opts.maxlength?`maxlength="${opts.maxlength}"`:'',invalid(key)].filter(Boolean).join(' ');
    return `<div class="migration-field"><label for="mig-${key}">${esc(label)}${req}</label><input id="mig-${key}" ${attr}>${opts.help?`<div class="migration-help">${esc(opts.help)}</div>`:''}${errorHtml(key)}</div>`;
  }
  function textarea(key,label,value,opts={}){
    return `<div class="migration-field"><label for="mig-${key}">${esc(label)}${opts.required?requiredMark():''}</label><textarea id="mig-${key}" data-field="${key}" placeholder="${esc(opts.placeholder||'')}" maxlength="${opts.maxlength||2000}"${invalid(key)}>${esc(value)}</textarea>${errorHtml(key)}</div>`;
  }
  function segments(fieldName,selected,values){return `<div class="migration-segments">${values.map(v=>`<button type="button" data-choice-field="${fieldName}" data-choice-value="${v}" class="${selected===v?'selected':''}" aria-pressed="${selected===v}">${v}</button>`).join('')}</div>`}
  function numberChoices(fieldName,selected){return `<div class="migration-number-grid">${Array.from({length:10},(_,i)=>i+1).map(v=>`<button type="button" data-choice-field="${fieldName}" data-choice-value="${v}" class="${Number(selected)===v?'selected':''}" aria-pressed="${Number(selected)===v}">${v}</button>`).join('')}</div>`}
  function spendingLabel(value){if(value<=3)return t().spending[0];if(value<=6)return t().spending[1];if(value<=8)return t().spending[2];return t().spending[3]}
  function powerField(index){const tx=t(),key=`vehicle${index}PowerValue`,unit=`vehicle${index}PowerUnit`,required=index===1;return `<div class="migration-field"><div class="migration-field-label">${esc(index===1?tx.f.vehicle1:tx.f.vehicle2)}${required?requiredMark():''}</div><div class="migration-power-row"><input data-field="${key}" type="text" inputmode="decimal" value="${esc(state[key])}" placeholder="${esc(tx.example)}"${invalid(key)}>${segments(unit,state[unit],['G','M'])}</div><div class="migration-help">${esc(tx.example)}</div>${errorHtml(key)}${errorHtml(unit)}</div>`}

  function formatStatusDate(value){
    if(!value)return '';
    const raw=String(value).trim();
    const parsed=new Date(/[zZ]$|[+-]\d{2}:?\d{2}$/.test(raw)?raw:raw.replace(' ','T')+'Z');
    if(Number.isNaN(parsed.getTime()))return '';
    try{return new Intl.DateTimeFormat(lang(),{year:'numeric',month:'short',day:'numeric'}).format(parsed);}catch(_){return parsed.toISOString().slice(0,10);}
  }
  function renderStatusLookup(){
    const tx=statusT();
    let result='';
    const inlineError=statusLookup.phase==='invalid-too-long'?tx.tooLong:statusLookup.phase==='invalid'?tx.invalid:'';
    if(statusLookup.phase==='not-found')result=`<div class="migration-status-message" role="status">${esc(tx.notFound)}</div>`;
    if(statusLookup.phase==='rate')result=`<div class="migration-status-message error" role="alert">${esc(tx.rate)}</div>`;
    if(statusLookup.phase==='error')result=`<div class="migration-status-message error" role="alert">${esc(tx.retry)}</div>`;
    if(statusLookup.phase==='found'){
      const info=tx.statuses[statusLookup.applicationStatus]||tx.statuses.received;
      const date=formatStatusDate(statusLookup.updatedAt);
      result=`<div class="migration-status-result status-${esc(statusLookup.applicationStatus)}" role="status"><span class="migration-status-badge">${esc(info[0])}</span><p>${esc(info[1])}</p>${date?`<small>${esc(fill(tx.updated,{date}))}</small>`:''}</div>`;
    }
    return `<section class="migration-status-lookup" aria-labelledby="migration-status-title"><div class="migration-status-copy"><h3 id="migration-status-title">${esc(tx.title)}</h3><p>${esc(tx.help)}</p></div><div class="migration-status-controls"><div class="migration-status-input-wrap"><input id="migrationStatusUid" data-status-uid type="text" inputmode="numeric" autocomplete="off" maxlength="32" value="${esc(statusLookup.uid)}" placeholder="${esc(tx.placeholder)}" aria-label="${esc(tx.placeholder)}"${inlineError?' aria-invalid="true"':''}>${inlineError?`<div class="migration-error" data-status-error role="alert">${esc(inlineError)}</div>`:''}</div><button type="button" class="migration-button migration-button-secondary migration-status-button" data-status-check ${statusLookup.phase==='loading'?'disabled':''}>${esc(statusLookup.phase==='loading'?tx.checking:tx.button)}</button></div>${result}</section>`;
  }

  function renderStep(){
    const tx=t();document.title=tx.pageTitle;
    document.querySelectorAll('[data-migration-k]').forEach(el=>{const val=tx[el.dataset.migrationK];if(val!=null)el.textContent=val});
    counter.textContent=fill(tx.stepCounter,{step:step+1});title.textContent=tx.steps[step][0];desc.textContent=tx.steps[step][1];progress.style.width=`${((step+1)/7)*100}%`;
    prev.textContent=tx.prev;prev.hidden=step===0;next.textContent=step===6?tx.submit:tx.next;next.disabled=submitting;
    submitError.hidden=true;submitError.textContent='';
    if(step===0)body.innerHTML=field('playerName',tx.f.playerName,state.playerName,{required:true,placeholder:tx.p.playerName,maxlength:64})+field('gameUid',tx.f.gameUid,state.gameUid,{required:true,placeholder:tx.p.uid,inputmode:'numeric',maxlength:32})+field('discord',tx.f.discord,state.discord,{placeholder:tx.p.discord,maxlength:100,help:tx.discordHelp})+renderStatusLookup();
    if(step===1)body.innerHTML=field('currentState',tx.f.currentState,state.currentState,{required:true,placeholder:tx.p.state,inputmode:'numeric',maxlength:9})+field('currentAlliance',tx.f.currentAlliance,state.currentAlliance,{placeholder:tx.p.alliance,maxlength:64});
    if(step===2)body.innerHTML=powerField(1)+powerField(2)+`<div class="migration-field"><div class="migration-field-label">${esc(tx.f.industry)}${requiredMark()}</div>${numberChoices('industryLevel',state.industryLevel)}<div class="migration-choice-summary">${state.industryLevel?esc(fill(tx.industrySummary,{value:state.industryLevel})):''}</div>${errorHtml('industryLevel')}</div><div class="migration-field"><div class="migration-field-label">${esc(tx.f.spending)}${requiredMark()}</div>${numberChoices('spendingLevel',state.spendingLevel)}<div class="migration-choice-summary">${state.spendingLevel?esc(fill(tx.spendingSummary,{value:state.spendingLevel,label:spendingLabel(state.spendingLevel)})):''}</div>${errorHtml('spendingLevel')}</div>`;
    if(step===3)body.innerHTML=`<div class="migration-field"><div class="migration-field-label">${esc(tx.f.tier)}${requiredMark()}</div><div class="migration-tier-grid">${['gold','purple','blue','gray'].map(v=>`<button type="button" class="migration-tier-card ${state.migrationTier===v?'selected':''}" data-choice-field="migrationTier" data-choice-value="${v}" aria-pressed="${state.migrationTier===v}" aria-label="${esc(`${tx.tiers[v]} ${TIER_POWER[v]}`)}"><span class="migration-tier-name">${esc(tx.tiers[v])}</span><span class="migration-tier-power">${esc(TIER_POWER[v])}</span></button>`).join('')}</div>${errorHtml('migrationTier')}</div>`;
    if(step===4)body.innerHTML=textarea('migrationReason',tx.f.reason,state.migrationReason,{required:true,placeholder:tx.p.reason,maxlength:2000})+textarea('additionalNotes',tx.f.notes,state.additionalNotes,{placeholder:tx.p.notes,maxlength:2000});
    if(step===5)body.innerHTML=field('migrationGroup',tx.f.group,state.migrationGroup,{placeholder:tx.p.group,maxlength:200})+field('referrer',tx.f.referrer,state.referrer,{placeholder:tx.p.referrer,maxlength:64});
    if(step===6)body.innerHTML=renderReview();
  }

  function reviewRow(label,value,full=false){return `<div class="migration-review-row${full?' full':''}"><dt>${esc(label)}</dt><dd>${esc(value||t().notEntered)}</dd></div>`}
  function reviewCard(index,rows){return `<section class="migration-review-card"><div class="migration-review-head"><h3>${esc(t().review[index])}</h3><button class="migration-review-edit" type="button" data-edit-step="${index}">${esc(t().edit)}</button></div><dl class="migration-review-grid">${rows}</dl></section>`}
  function formatPower(value,unit){return value&&unit?`${value} ${unit}`:t().notEntered}
  function renderReview(){const tx=t();return `<div class="migration-review">${reviewCard(0,reviewRow(tx.f.playerName,state.playerName)+reviewRow(tx.f.gameUid,state.gameUid)+reviewRow(tx.f.discord,state.discord))}${reviewCard(1,reviewRow(tx.f.currentState,state.currentState)+reviewRow(tx.f.currentAlliance,state.currentAlliance))}${reviewCard(2,reviewRow(tx.f.vehicle1,formatPower(state.vehicle1PowerValue,state.vehicle1PowerUnit))+reviewRow(tx.f.vehicle2,formatPower(state.vehicle2PowerValue,state.vehicle2PowerUnit))+reviewRow(tx.f.industry,state.industryLevel?`${state.industryLevel} / 10`:tx.notEntered)+reviewRow(tx.f.spending,state.spendingLevel?`${state.spendingLevel} / 10 · ${spendingLabel(state.spendingLevel)}`:tx.notEntered))}${reviewCard(3,reviewRow(tx.f.tier,state.migrationTier?`${tx.tiers[state.migrationTier]} · ${TIER_POWER[state.migrationTier]}`:tx.notEntered))}${reviewCard(4,reviewRow(tx.f.reason,state.migrationReason,true)+reviewRow(tx.f.notes,state.additionalNotes,true))}${reviewCard(5,reviewRow(tx.f.group,state.migrationGroup)+reviewRow(tx.f.referrer,state.referrer))}</div>`}

  function collectStep(){body.querySelectorAll('[data-field]').forEach(el=>{state[el.dataset.field]=el.value.trim()});}
  function validPower(value){return /^\d+(?:\.\d{1,2})?$/.test(String(value).trim())&&Number(value)>0}
  function validate(index){const tx=t();errors={};if(index===0){if(!state.playerName)errors.playerName=tx.errors.required;if(state.gameUid.length>16)errors.gameUid=tx.errors.uidTooLong;else if(!/^\d{16}$/.test(state.gameUid))errors.gameUid=tx.errors.uid;}if(index===1){if(!/^\d+$/.test(state.currentState))errors.currentState=tx.errors.state;}if(index===2){if(!validPower(state.vehicle1PowerValue))errors.vehicle1PowerValue=tx.errors.power;if(!['M','G'].includes(state.vehicle1PowerUnit))errors.vehicle1PowerUnit=tx.errors.unit;if(state.vehicle2PowerValue||state.vehicle2PowerUnit){if(!validPower(state.vehicle2PowerValue))errors.vehicle2PowerValue=tx.errors.power;if(!['M','G'].includes(state.vehicle2PowerUnit))errors.vehicle2PowerUnit=tx.errors.unit;}if(!Number.isInteger(Number(state.industryLevel))||Number(state.industryLevel)<1||Number(state.industryLevel)>10)errors.industryLevel=tx.errors.industry;if(!Number.isInteger(Number(state.spendingLevel))||Number(state.spendingLevel)<1||Number(state.spendingLevel)>10)errors.spendingLevel=tx.errors.spending;}if(index===3&&!['gray','blue','purple','gold'].includes(state.migrationTier))errors.migrationTier=tx.errors.tier;if(index===4&&!state.migrationReason)errors.migrationReason=tx.errors.reason;return Object.keys(errors).length===0}
  function firstInvalidStep(){for(let i=0;i<6;i++){if(!validate(i))return i;}errors={};return -1}

  body.addEventListener('input',event=>{const statusInput=event.target.closest('[data-status-uid]');if(statusInput){const digits=statusInput.value.replace(/\D/g,'');if(statusInput.value!==digits)statusInput.value=digits;statusLookup.uid=statusInput.value;statusLookup.applicationStatus='';statusLookup.updatedAt='';if(statusLookup.phase!=='loading')statusLookup.phase=statusInput.value.length>16?'invalid-too-long':'idle';updateStatusInlineError(statusInput,statusInput.value.length>16?statusT().tooLong:'');statusInput.closest('.migration-status-lookup')?.querySelectorAll('.migration-status-message,.migration-status-result').forEach(node=>node.remove());return;}const el=event.target.closest('[data-field]');if(!el)return;if(el.dataset.field==='gameUid'){const digits=el.value.replace(/\D/g,'');if(el.value!==digits)el.value=digits;state.gameUid=el.value.trim();if(el.value.length>16)setInlineFieldError('gameUid',t().errors.uidTooLong);else if(errors.gameUid)clearInlineFieldError('gameUid');return;}if(el.dataset.field==='currentState')el.value=el.value.replace(/\D/g,'').slice(0,9);state[el.dataset.field]=el.value.trim();if(errors[el.dataset.field])clearInlineFieldError(el.dataset.field);});
  body.addEventListener('click',async event=>{const statusCheck=event.target.closest('[data-status-check]');if(statusCheck){await checkMigrationStatus();return;}const choice=event.target.closest('[data-choice-field]');if(choice){collectStep();const key=choice.dataset.choiceField;let value=choice.dataset.choiceValue;if(['industryLevel','spendingLevel'].includes(key))value=Number(value);state[key]=value;delete errors[key];renderStep();return;}const edit=event.target.closest('[data-edit-step]');if(edit){step=Number(edit.dataset.editStep);errors={};renderStep();window.scrollTo({top:0,behavior:'smooth'});}});
  prev.addEventListener('click',()=>{if(submitting)return;collectStep();errors={};step=Math.max(0,step-1);renderStep();});
  next.addEventListener('click',async()=>{if(submitting)return;collectStep();if(step<6){if(!validate(step)){renderStep();return;}if(step===0&&await blockDuplicateUidAtStepOne())return;errors={};step++;renderStep();return;}await submit();});
  form.addEventListener('submit',event=>event.preventDefault());
  body.addEventListener('keydown',event=>{if(event.key==='Enter'&&event.target.closest('[data-status-uid]')){event.preventDefault();checkMigrationStatus();}});

  async function blockDuplicateUidAtStepOne(){
    try{
      const response=await fetch(`/api/migration/status?uid=${encodeURIComponent(state.gameUid)}`,{method:'GET',credentials:'include',headers:{accept:'application/json'},cache:'no-store'});
      const payload=await response.json().catch(()=>null);
      if(!response.ok||!payload?.ok||!payload.data?.found)return false;
      errors={gameUid:t().errors.duplicate};
      statusLookup.uid=state.gameUid;
      statusLookup.applicationStatus=String(payload.data.applicationStatus||'');
      statusLookup.updatedAt=String(payload.data.updatedAt||'');
      statusLookup.phase=STATUS_TEXT.en.statuses[statusLookup.applicationStatus]?'found':'idle';
      renderStep();
      return true;
    }catch(_){return false;}
  }

  async function checkMigrationStatus(){
    if(statusLookup.phase==='loading')return;
    const input=body.querySelector('[data-status-uid]');
    const uid=String(input?.value||statusLookup.uid).replace(/\D/g,'');
    statusLookup.uid=uid;
    if(uid.length>16){statusLookup.phase='invalid-too-long';statusLookup.applicationStatus='';statusLookup.updatedAt='';renderStep();return;}
    if(!/^\d{16}$/.test(uid)){statusLookup.phase='invalid';statusLookup.applicationStatus='';statusLookup.updatedAt='';renderStep();return;}
    statusLookup.phase='loading';statusLookup.applicationStatus='';statusLookup.updatedAt='';renderStep();
    try{
      const response=await fetch(`/api/migration/status?uid=${encodeURIComponent(uid)}`,{method:'GET',credentials:'include',headers:{accept:'application/json'},cache:'no-store'});
      const payload=await response.json().catch(()=>null);
      if(response.status===429){statusLookup.phase='rate';renderStep();return;}
      if(!response.ok||!payload?.ok){statusLookup.phase='error';renderStep();return;}
      if(!payload.data?.found){statusLookup.phase='not-found';renderStep();return;}
      statusLookup.applicationStatus=String(payload.data.applicationStatus||'');
      statusLookup.updatedAt=String(payload.data.updatedAt||'');
      statusLookup.phase=STATUS_TEXT.en.statuses[statusLookup.applicationStatus]?'found':'error';
      renderStep();
    }catch(_){statusLookup.phase='error';renderStep();}
  }

  async function submit(){collectStep();const invalidStep=firstInvalidStep();if(invalidStep>=0){step=invalidStep;renderStep();window.scrollTo({top:0,behavior:'smooth'});return;}submitting=true;next.textContent=t().submitting;next.disabled=true;submitError.hidden=true;
    try{const response=await fetch('/api/migration/applications',{method:'POST',credentials:'include',headers:{'content-type':'application/json','accept':'application/json'},body:JSON.stringify({...state,website:document.getElementById('migrationHoneypot').value})});const payload=await response.json().catch(()=>null);if(!response.ok||!payload?.ok){const code=payload?.code||'';throw Object.assign(new Error(code||'SUBMIT_FAILED'),{code,status:response.status});}shell.hidden=true;success.hidden=false;renderStatic();window.scrollTo({top:0,behavior:'smooth'});}catch(error){const tx=t();submitError.textContent=error.code==='MIGRATION_APPLICATION_EXISTS'?tx.errors.duplicate:error.code==='MIGRATION_RATE_LIMITED'?tx.errors.rate:tx.errors.retry;submitError.hidden=false;}finally{submitting=false;if(!shell.hidden){next.disabled=false;next.textContent=t().submit;}}
  }

  function renderStatic(){const tx=t();document.title=tx.pageTitle;document.querySelectorAll('[data-migration-k]').forEach(el=>{const value=tx[el.dataset.migrationK];if(value!=null)el.textContent=value});}
  function onLanguageChange(){collectStep();renderStep();renderStatic();}
  window.addEventListener('ezpk-language-change',onLanguageChange);

  function handleAuth(raw){const stateAuth=raw||{};if(!stateAuth.loaded)return;if(stateAuth.authenticated){window.location.replace('../');return;}document.body.classList.remove('migration-auth-pending');app.hidden=false;renderStep();renderStatic();}
  window.addEventListener('ezpk-auth-ready',event=>handleAuth({loaded:true,...event.detail}));
  window.addEventListener('ezpk-auth-change',event=>handleAuth({loaded:true,...event.detail}));
  const auth=window.EZPKMemberAuth?.getState?.();if(auth?.loaded)handleAuth(auth);
})();
