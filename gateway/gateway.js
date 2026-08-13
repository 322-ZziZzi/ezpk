(()=>{
  'use strict';
  const KEY='ezpk-lang-v5';
  const USER_KEY='ezpk-lang-user-v6';
  const AUTO_KEY='ezpk-lang-auto-v6';
  const COOKIE='ezpk_lang';
  const SUPPORTED=['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id'];
  const META={
    en:{flag:'🇺🇸',name:'English'},fr:{flag:'🇫🇷',name:'Français'},de:{flag:'🇩🇪',name:'Deutsch'},ko:{flag:'🇰🇷',name:'한국어'},th:{flag:'🇹🇭',name:'ไทย'},ja:{flag:'🇯🇵',name:'日本語'},pt:{flag:'🇧🇷',name:'Português'},es:{flag:'🇪🇸',name:'Español'},tr:{flag:'🇹🇷',name:'Türkçe'},'zh-tw':{flag:'🇹🇼',name:'繁體中文'},it:{flag:'🇮🇹',name:'Italiano'},ar:{flag:'🇸🇦',name:'العربية'},vi:{flag:'🇻🇳',name:'Tiếng Việt'},id:{flag:'🇮🇩',name:'Bahasa Indonesia'}
  };
  const T={
    en:{title:'Choose Your Alliance',lead:'Select the EZPK alliance portal you want to enter.',m1:'Main Alliance',b1:'The EZPK main alliance focused on active growth, participation, and teamwork.',e1:'Enter EZPK1',m2:'Sub Alliance',b2:'The EZPK sub alliance for a lighter and more flexible way to play together.',e2:'Enter EZPK2',inactive:'EZPK2 is currently inactive.',footer:'Choose an alliance to continue.',tabMigration:'Migration',tabAlliance:'Alliance Select'},
    fr:{title:'Choisir l’alliance',lead:'Sélectionnez le portail d’alliance EZPK que vous souhaitez utiliser.',m1:'Alliance principale',b1:'L’alliance principale EZPK, axée sur la progression, la participation et la coopération.',e1:'Accéder à EZPK1',m2:'Alliance secondaire',b2:'L’alliance secondaire EZPK pour jouer ensemble de façon plus libre et flexible.',e2:'Accéder à EZPK2',inactive:'EZPK2 est actuellement inactive.',footer:'Choisissez une alliance pour continuer.',tabMigration:'Migration',tabAlliance:'Choisir l’alliance'},
    de:{title:'Allianz wählen',lead:'Wähle das EZPK-Allianzportal, das du öffnen möchtest.',m1:'Hauptallianz',b1:'Die EZPK-Hauptallianz mit Fokus auf Wachstum, Beteiligung und Zusammenarbeit.',e1:'EZPK1 öffnen',m2:'Nebenallianz',b2:'Die EZPK-Nebenallianz für ein freieres und flexibleres gemeinsames Spielerlebnis.',e2:'EZPK2 öffnen',inactive:'EZPK2 ist derzeit inaktiv.',footer:'Wähle eine Allianz, um fortzufahren.',tabMigration:'Migration',tabAlliance:'Allianz wählen'},
    ko:{title:'연맹 선택',lead:'이용할 EZPK 연맹 사이트를 선택해 주세요.',m1:'메인 연맹',b1:'성장과 참여, 협력을 중심으로 함께 운영되는 EZPK 메인 연맹입니다.',e1:'EZPK1 입장',m2:'서브 연맹',b2:'조금 더 자유롭고 가볍게 게임을 함께 즐길 수 있는 EZPK 서브 연맹입니다.',e2:'EZPK2 입장',inactive:'EZPK2는 현재 운영하지 않습니다.',footer:'연맹을 선택하면 해당 사이트로 이동합니다.',tabMigration:'이민 신청',tabAlliance:'연맹 선택'},
    th:{title:'เลือกพันธมิตร',lead:'เลือกเว็บไซต์พันธมิตร EZPK ที่ต้องการเข้าใช้งาน',m1:'พันธมิตรหลัก',b1:'พันธมิตรหลัก EZPK ที่เน้นการเติบโต การมีส่วนร่วม และการร่วมมือ',e1:'เข้า EZPK1',m2:'พันธมิตรรอง',b2:'รูปแบบการเล่นที่ยืดหยุ่นและสบายมากขึ้น',e2:'เข้า EZPK2',inactive:'ขณะนี้ EZPK2 ไม่ได้เปิดใช้งาน',footer:'เลือกพันธมิตรเพื่อดำเนินการต่อ',tabMigration:'สมัครย้าย',tabAlliance:'เลือกพันธมิตร'},
    ja:{title:'同盟選択',lead:'利用するEZPK同盟ポータルを選択してください。',m1:'メイン同盟',b1:'成長・参加・協力を重視するEZPKのメイン同盟です。',e1:'EZPK1へ',m2:'サブ同盟',b2:'より自由で軽いスタイルで一緒に遊べるEZPKのサブ同盟です。',e2:'EZPK2へ',inactive:'EZPK2は現在運営していません。',footer:'同盟を選択して続行してください。',tabMigration:'移住申請',tabAlliance:'同盟選択'},
    pt:{title:'Escolha sua Aliança',lead:'Selecione o portal EZPK que deseja acessar.',m1:'Aliança Principal',b1:'Aliança principal da EZPK com foco em crescimento, participação e cooperação.',e1:'Entrar na EZPK1',m2:'Aliança Secundária',b2:'Uma opção mais leve e flexível para jogar juntos.',e2:'Entrar na EZPK2',inactive:'A EZPK2 está inativa no momento.',footer:'Escolha uma aliança para continuar.',tabMigration:'Migração',tabAlliance:'Escolher aliança'},
    es:{title:'Elige tu alianza',lead:'Selecciona el portal de alianza EZPK al que quieres entrar.',m1:'Alianza principal',b1:'La alianza principal de EZPK, centrada en el crecimiento, la participación y el trabajo en equipo.',e1:'Entrar en EZPK1',m2:'Alianza secundaria',b2:'La alianza secundaria de EZPK para jugar juntos de una forma más libre y flexible.',e2:'Entrar en EZPK2',inactive:'EZPK2 está inactiva actualmente.',footer:'Elige una alianza para continuar.',tabMigration:'Migración',tabAlliance:'Elegir alianza'},
    tr:{title:'İttifak Seç',lead:'Girmek istediğiniz EZPK ittifak portalını seçin.',m1:'Ana İttifak',b1:'Büyüme, katılım ve iş birliğine odaklanan EZPK ana ittifakı.',e1:'EZPK1’e Gir',m2:'Alt İttifak',b2:'Daha özgür ve esnek bir şekilde birlikte oynamak için EZPK alt ittifakı.',e2:'EZPK2’ye Gir',inactive:'EZPK2 şu anda aktif değil.',footer:'Devam etmek için bir ittifak seçin.',tabMigration:'Göç',tabAlliance:'İttifak Seç'},
    'zh-tw':{title:'選擇聯盟',lead:'請選擇要進入的 EZPK 聯盟網站。',m1:'主要聯盟',b1:'重視成長、參與與合作的 EZPK 主要聯盟。',e1:'進入 EZPK1',m2:'次要聯盟',b2:'以更自由、輕鬆的方式一起遊玩的 EZPK 次要聯盟。',e2:'進入 EZPK2',inactive:'EZPK2 目前未啟用。',footer:'請選擇聯盟以繼續。',tabMigration:'移民申請',tabAlliance:'選擇聯盟'},
    it:{title:'Scegli l’alleanza',lead:'Seleziona il portale dell’alleanza EZPK che vuoi utilizzare.',m1:'Alleanza principale',b1:'L’alleanza principale EZPK, incentrata su crescita, partecipazione e collaborazione.',e1:'Entra in EZPK1',m2:'Alleanza secondaria',b2:'L’alleanza secondaria EZPK per giocare insieme in modo più libero e flessibile.',e2:'Entra in EZPK2',inactive:'EZPK2 è attualmente inattiva.',footer:'Scegli un’alleanza per continuare.',tabMigration:'Migrazione',tabAlliance:'Scegli alleanza'},
    ar:{title:'اختر التحالف',lead:'اختر بوابة تحالف EZPK التي تريد الدخول إليها.',m1:'التحالف الرئيسي',b1:'تحالف EZPK الرئيسي للنمو والمشاركة والتعاون.',e1:'الدخول إلى EZPK1',m2:'التحالف الفرعي',b2:'خيار أكثر مرونة وخفة للاستمتاع باللعبة معًا.',e2:'الدخول إلى EZPK2',inactive:'EZPK2 غير نشط حاليًا.',footer:'اختر تحالفًا للمتابعة.',tabMigration:'طلب الهجرة',tabAlliance:'اختيار التحالف'},
    vi:{title:'Chọn Liên minh',lead:'Chọn cổng liên minh EZPK bạn muốn truy cập.',m1:'Liên minh Chính',b1:'Liên minh chính EZPK tập trung vào phát triển, tham gia và phối hợp.',e1:'Vào EZPK1',m2:'Liên minh Phụ',b2:'Lựa chọn linh hoạt và nhẹ nhàng hơn để cùng chơi.',e2:'Vào EZPK2',inactive:'EZPK2 hiện không hoạt động.',footer:'Chọn một liên minh để tiếp tục.',tabMigration:'Đăng ký di cư',tabAlliance:'Chọn liên minh'},
    id:{title:'Pilih Aliansi',lead:'Pilih portal aliansi EZPK yang ingin Anda masuki.',m1:'Aliansi Utama',b1:'Aliansi utama EZPK yang berfokus pada pertumbuhan, partisipasi, dan kerja sama.',e1:'Masuk EZPK1',m2:'Aliansi Sekunder',b2:'Aliansi sekunder EZPK untuk bermain bersama dengan cara yang lebih santai dan fleksibel.',e2:'Masuk EZPK2',inactive:'EZPK2 saat ini tidak aktif.',footer:'Pilih aliansi untuk melanjutkan.',tabMigration:'Migrasi',tabAlliance:'Pilih Aliansi'}
  };
  const GATEWAY_V415={"en":{"pageTitle":"EZPK Alliance Select","portalAria":"EZPK Alliance Portal","sectionsAria":"Gateway sections","migrationAria":"EZPK1 migration application","portalsAria":"Alliance portals"},"fr":{"pageTitle":"Sélection de l’alliance EZPK","portalAria":"Portail de l’alliance EZPK","sectionsAria":"Sections de la passerelle","migrationAria":"Demande de migration EZPK1","portalsAria":"Portails des alliances"},"de":{"pageTitle":"EZPK-Allianz auswählen","portalAria":"EZPK-Allianzportal","sectionsAria":"Portalbereiche","migrationAria":"EZPK1-Migrationsantrag","portalsAria":"Allianzportale"},"ko":{"pageTitle":"EZPK 연맹 선택","portalAria":"EZPK 연맹 포털","sectionsAria":"게이트웨이 구역","migrationAria":"EZPK1 이민 신청","portalsAria":"연맹 포털"},"th":{"pageTitle":"เลือกพันธมิตร EZPK","portalAria":"พอร์ทัลพันธมิตร EZPK","sectionsAria":"ส่วนต่าง ๆ ของเกตเวย์","migrationAria":"การสมัครย้ายไป EZPK1","portalsAria":"พอร์ทัลพันธมิตร"},"ja":{"pageTitle":"EZPK 同盟選択","portalAria":"EZPK 同盟ポータル","sectionsAria":"ゲートウェイセクション","migrationAria":"EZPK1 移住申請","portalsAria":"同盟ポータル"},"pt":{"pageTitle":"Seleção de Aliança EZPK","portalAria":"Portal da Aliança EZPK","sectionsAria":"Seções do portal","migrationAria":"Inscrição de migração EZPK1","portalsAria":"Portais das alianças"},"es":{"pageTitle":"Selección de alianza EZPK","portalAria":"Portal de alianza EZPK","sectionsAria":"Secciones del portal","migrationAria":"Solicitud de migración EZPK1","portalsAria":"Portales de alianzas"},"tr":{"pageTitle":"EZPK İttifak Seçimi","portalAria":"EZPK İttifak Portalı","sectionsAria":"Geçit bölümleri","migrationAria":"EZPK1 göç başvurusu","portalsAria":"İttifak portalları"},"zh-tw":{"pageTitle":"EZPK 聯盟選擇","portalAria":"EZPK 聯盟入口","sectionsAria":"入口區段","migrationAria":"EZPK1 移民申請","portalsAria":"聯盟入口"},"it":{"pageTitle":"Selezione Alleanza EZPK","portalAria":"Portale Alleanza EZPK","sectionsAria":"Sezioni del portale","migrationAria":"Domanda di migrazione EZPK1","portalsAria":"Portali delle alleanze"},"ar":{"pageTitle":"اختيار تحالف EZPK","portalAria":"بوابة تحالف EZPK","sectionsAria":"أقسام البوابة","migrationAria":"طلب الهجرة إلى EZPK1","portalsAria":"بوابات التحالفات"},"vi":{"pageTitle":"Chọn Liên minh EZPK","portalAria":"Cổng Liên minh EZPK","sectionsAria":"Các mục cổng vào","migrationAria":"Đăng ký di cư EZPK1","portalsAria":"Cổng liên minh"},"id":{"pageTitle":"Pilih Aliansi EZPK","portalAria":"Portal Aliansi EZPK","sectionsAria":"Bagian gateway","migrationAria":"Pengajuan migrasi EZPK1","portalsAria":"Portal aliansi"}};
  for(const code of SUPPORTED) Object.assign(T[code],GATEWAY_V415[code]);
  const $=s=>document.querySelector(s),btn=$('#gatewayLangBtn'),menu=$('#gatewayLangMenu');
  function normalize(value){
    const raw=String(value||'').trim().toLowerCase().replaceAll('_','-');
    if(!raw)return'';
    if(raw==='zh-tw'||raw==='zh-hk'||raw==='zh-mo'||raw.startsWith('zh-hant'))return'zh-tw';
    if(raw==='zh'||raw==='zh-cn'||raw.startsWith('zh-hans'))return'';
    if(SUPPORTED.includes(raw))return raw;
    const base=raw.split('-')[0];
    return SUPPORTED.includes(base)?base:'';
  }
  function readCookie(){try{const hit=document.cookie.split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE+'='));return hit?normalize(decodeURIComponent(hit.slice(COOKIE.length+1))):''}catch(_){return''}}
  function writeCookie(lang,maxAge=31536000){const host=String(location.hostname||'').toLowerCase();const pub=host==='ezpk322.com'||host==='ezpk1.ezpk322.com'||host==='ezpk2.ezpk322.com';const parts=[`${COOKIE}=${encodeURIComponent(normalize(lang))}`,'Path=/','SameSite=Lax',`Max-Age=${maxAge}`];if(pub)parts.push('Domain=.ezpk322.com','Secure');document.cookie=parts.join('; ')}
  function explicitPreference(){
    try{const direct=normalize(localStorage.getItem(USER_KEY));if(direct)return direct}catch(_){}
    const cookie=readCookie();if(cookie){try{localStorage.setItem(USER_KEY,cookie)}catch(_){}return cookie}
    try{const legacy=normalize(localStorage.getItem(KEY)),auto=normalize(localStorage.getItem(AUTO_KEY));if(legacy&&legacy!==auto){localStorage.setItem(USER_KEY,legacy);writeCookie(legacy);return legacy}}catch(_){}
    return'';
  }
  function browserLanguage(){const candidates=[];try{if(Array.isArray(navigator.languages))candidates.push(...navigator.languages)}catch(_){}try{if(navigator.language)candidates.push(navigator.language)}catch(_){}for(const item of candidates){const code=normalize(item);if(code)return code}return'en'}
  function language(){return explicitPreference()||browserLanguage()||'en'}
  function syncStorage(lang,explicit=false){const code=normalize(lang)||'en';try{localStorage.setItem(KEY,code);if(explicit){localStorage.setItem(USER_KEY,code);localStorage.removeItem(AUTO_KEY)}else if(!explicitPreference())localStorage.setItem(AUTO_KEY,code)}catch(_){}if(explicit)writeCookie(code);return code}
  let current=syncStorage(language(),false);
  function setMenu(open){menu.hidden=!open;btn.setAttribute('aria-expanded',open?'true':'false')}
  function setActiveTab(name){document.querySelectorAll('[data-gateway-tab]').forEach(el=>{const active=el.dataset.gatewayTab===name;el.classList.toggle('is-active',active);el.setAttribute('aria-pressed',String(active))})}
  function render(){
    const l=current,t=T[l]||T.en,m=META[l]||META.en;
    document.documentElement.lang=l==='zh-tw'?'zh-Hant':l;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.body.classList.toggle('rtl',l==='ar');document.title=t.pageTitle;document.querySelector('.gateway-brand')?.setAttribute('aria-label',t.portalAria);document.querySelector('.gateway-mobile-tabs')?.setAttribute('aria-label',t.sectionsAria);$('#gatewayMigrationEntry')?.setAttribute('aria-label',t.migrationAria);$('#gatewayAllianceCards')?.setAttribute('aria-label',t.portalsAria);
    $('#gatewayTitle').textContent=t.title;$('#gatewayLead').textContent=t.lead;$('#ezpk1Title').textContent=t.m1;$('#ezpk1Body').textContent=t.b1;$('#enterEzpk1').textContent=t.e1;$('#ezpk2Title').textContent=t.m2;$('#ezpk2Body').textContent=t.b2;$('#enterEzpk2').textContent=t.e2;$('#gatewayFooter').textContent=t.footer;$('#gatewayFlag').textContent=m.flag;$('#gatewayLanguageName').textContent=m.name;
    $('#gatewayTabMigration').textContent=t.tabMigration;$('#gatewayTabAlliance').textContent=t.tabAlliance;
    window.EZPKMigrationEntry?.render('gatewayMigrationEntry',l);document.querySelectorAll('[data-lang]').forEach(el=>el.classList.toggle('is-active',el.dataset.lang===l));if(!$('#gatewayStatus').hidden)$('#gatewayStatus').textContent=t.inactive;
  }
  btn.addEventListener('click',e=>{e.stopPropagation();setMenu(menu.hidden)});
  menu.addEventListener('click',e=>{const c=e.target.closest('[data-lang]');if(!c)return;current=syncStorage(c.dataset.lang,true);setMenu(false);render()});
  document.addEventListener('click',e=>{if(!menu.hidden&&!e.target.closest('.gateway-language'))setMenu(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

  const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  document.querySelector('.gateway-mobile-tabs')?.addEventListener('click',e=>{
    const tab=e.target.closest('[data-gateway-scroll]');if(!tab)return;
    const target=tab.dataset.gatewayScroll==='migration'?$('#gatewayMigrationEntry'):$('#gatewayAllianceCards');
    if(!target)return;setActiveTab(tab.dataset.gatewayScroll==='migration'?'migration':'alliance');
    target.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});
  });
  let ticking=false;
  function updateTabsFromScroll(){ticking=false;if(!matchMedia('(max-width:760px)').matches)return;const grid=$('#gatewayAllianceCards');if(!grid)return;const r=grid.getBoundingClientRect();const allianceVisible=r.top<=innerHeight*.72&&r.bottom>128;setActiveTab(allianceVisible?'alliance':'migration')}
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateTabsFromScroll)}},{passive:true});addEventListener('resize',updateTabsFromScroll,{passive:true});

  render();setActiveTab('migration');updateTabsFromScroll();
  fetch('/api/site-context',{credentials:'include',cache:'no-store'}).then(r=>r.json()).then(j=>{if(!j?.ok)return;const d=j.data||{};if(d.mode==='SINGLE'){location.replace('https://ezpk322.com/');return}const migrationEntry=$('#gatewayMigrationEntry');if(migrationEntry)migrationEntry.hidden=d.migrationIntakeEnabled===false;if(!d.ezpk2Active){$('#ezpk2Card').classList.add('is-inactive');$('#ezpk2Card').removeAttribute('href');$('#gatewayStatus').hidden=false;$('#gatewayStatus').textContent=(T[current]||T.en).inactive}}).catch(()=>{});
})();
