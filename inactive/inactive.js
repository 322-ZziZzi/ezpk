(()=>{
  'use strict';
  const LEGACY='ezpk-lang-v5',USER='ezpk-lang-user-v6',AUTO='ezpk-lang-auto-v6',COOKIE='ezpk_lang';
  const SUPPORTED=['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id'];
  const T={
    en:['EZPK2 is currently inactive','This alliance portal is not accepting new activity at this time. Existing data is preserved.','Go to EZPK1','Alliance Select'],
    fr:['EZPK2 est actuellement inactive','Ce portail d’alliance n’accepte pas de nouvelle activité pour le moment. Les données existantes sont conservées.','Aller à EZPK1','Choisir l’alliance'],
    de:['EZPK2 ist derzeit inaktiv','Dieses Allianzportal nimmt derzeit keine neuen Aktivitäten an. Bestehende Daten bleiben erhalten.','Zu EZPK1','Allianz wählen'],
    ko:['EZPK2는 현재 운영하지 않습니다','현재 이 연맹 사이트에서는 새로운 활동을 받지 않습니다. 기존 데이터는 안전하게 보존됩니다.','EZPK1으로 이동','연맹 선택'],
    th:['ขณะนี้ EZPK2 ไม่ได้เปิดใช้งาน','เว็บไซต์พันธมิตรนี้ยังไม่รับกิจกรรมใหม่ ข้อมูลเดิมยังคงถูกเก็บรักษาไว้','ไป EZPK1','เลือกพันธมิตร'],
    ja:['EZPK2は現在運営していません','現在この同盟サイトでは新しい活動を受け付けていません。既存データは保持されています。','EZPK1へ移動','同盟選択'],
    pt:['EZPK2 está inativa','Este portal não está aceitando novas atividades. Os dados existentes são preservados.','Ir para EZPK1','Escolher aliança'],
    es:['EZPK2 está inactiva actualmente','Este portal de alianza no acepta nueva actividad en este momento. Los datos existentes se conservan.','Ir a EZPK1','Elegir alianza'],
    tr:['EZPK2 şu anda aktif değil','Bu ittifak portalı şu anda yeni etkinlik kabul etmiyor. Mevcut veriler korunmaktadır.','EZPK1’e Git','İttifak Seç'],
    'zh-tw':['EZPK2 目前未啟用','此聯盟網站目前不接受新的活動，既有資料會繼續保留。','前往 EZPK1','選擇聯盟'],
    it:['EZPK2 è attualmente inattiva','Questo portale dell’alleanza al momento non accetta nuove attività. I dati esistenti vengono conservati.','Vai a EZPK1','Scegli alleanza'],
    ar:['EZPK2 غير نشط حاليًا','بوابة التحالف لا تقبل نشاطًا جديدًا حاليًا، وتبقى البيانات الحالية محفوظة.','الانتقال إلى EZPK1','اختيار التحالف'],
    vi:['EZPK2 hiện không hoạt động','Cổng liên minh này hiện không nhận hoạt động mới. Dữ liệu hiện có vẫn được bảo toàn.','Đi đến EZPK1','Chọn liên minh'],
    id:['EZPK2 saat ini tidak aktif','Portal aliansi ini saat ini tidak menerima aktivitas baru. Data yang ada tetap disimpan.','Ke EZPK1','Pilih Aliansi']
  };
  function normalize(value){const raw=String(value||'').trim().toLowerCase().replaceAll('_','-');if(!raw)return'';if(raw==='zh-tw'||raw==='zh-hk'||raw==='zh-mo'||raw.startsWith('zh-hant'))return'zh-tw';if(raw==='zh'||raw==='zh-cn'||raw.startsWith('zh-hans'))return'';if(SUPPORTED.includes(raw))return raw;const base=raw.split('-')[0];return SUPPORTED.includes(base)?base:''}
  function cookie(){try{const hit=document.cookie.split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE+'='));return hit?normalize(decodeURIComponent(hit.slice(COOKIE.length+1))):''}catch(_){return''}}
  function explicit(){try{const direct=normalize(localStorage.getItem(USER));if(direct)return direct}catch(_){}const c=cookie();if(c)return c;try{const legacy=normalize(localStorage.getItem(LEGACY)),auto=normalize(localStorage.getItem(AUTO));if(legacy&&legacy!==auto)return legacy}catch(_){}return''}
  function browser(){const candidates=[];try{if(Array.isArray(navigator.languages))candidates.push(...navigator.languages)}catch(_){}try{if(navigator.language)candidates.push(navigator.language)}catch(_){}for(const v of candidates){const l=normalize(v);if(l)return l}return'en'}
  const l=explicit()||browser()||'en',t=T[l]||T.en;
  try{localStorage.setItem(LEGACY,l);if(!explicit())localStorage.setItem(AUTO,l)}catch(_){}
  document.documentElement.lang=l==='zh-tw'?'zh-Hant':l;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.body.classList.toggle('rtl',l==='ar');
  document.querySelector('#inactiveTitle').textContent=t[0];document.querySelector('#inactiveBody').textContent=t[1];document.querySelector('#inactiveButton').textContent=t[2];document.querySelector('#inactiveSelect').textContent=t[3];
})();
