
(function(){
  'use strict';
  const D=window.EZPK_DATA||{};
  let lang=localStorage.getItem('ezpk-lang-v5')||'en';
  if(!D[lang]) lang='en';
  const copy={
    ko:{title:'EZPK 로고',subtitle:'전통과 품격, 두 가지 정체성을 담은 EZPK 공식 엠블럼',guideTitle:'로고 이미지 저장 안내',guideBody:'다운로드용 이미지를 열어 원본 크기로 확인할 수 있습니다.',mobileGuide:'📱 모바일: 이미지를 길게 눌러 저장하세요.',pcGuide:'🖥️ PC: 이미지 위에서 마우스 오른쪽 버튼을 눌러 저장하세요.',legacyDescription:'EZPK의 역사와 전사의 정신을 상징하는 오리지널 공식 엠블럼',royalDescription:'명예, 단결, 품격과 새로운 도약을 상징하는 로열 공식 엠블럼',openImage:'다운로드용 이미지 열기',previewGuide:'모바일에서는 이미지를 길게 눌러 저장하고, PC에서는 마우스 오른쪽 버튼을 눌러 저장하세요.',close:'닫기',footer:'EZPK의 공식 엠블럼을 확인하고 저장하세요.'},
    en:{title:'EZPK LOGO',subtitle:'Official EZPK emblems representing two identities: legacy and prestige.',guideTitle:'How to save the logo images',guideBody:'Open a download image to view it at its original size.',mobileGuide:'📱 Mobile: Press and hold the image to save it.',pcGuide:'🖥️ PC: Right-click the image and choose save.',legacyDescription:'The original official emblem representing EZPK history and warrior spirit.',royalDescription:'The royal official emblem representing honor, unity, prestige, and a new rise.',openImage:'OPEN DOWNLOAD IMAGE',previewGuide:'On mobile, press and hold the image to save it. On PC, right-click the image to save it.',close:'CLOSE',footer:'View and save the official EZPK emblems.'},
    pt:{title:'LOGO EZPK',subtitle:'Emblemas oficiais da EZPK que representam tradição e prestígio.',guideTitle:'Como salvar as imagens',guideBody:'Abra a imagem para visualizá-la no tamanho original.',mobileGuide:'📱 Celular: pressione e segure a imagem para salvar.',pcGuide:'🖥️ PC: clique com o botão direito na imagem para salvar.',legacyDescription:'O emblema oficial original que representa a história e o espírito guerreiro da EZPK.',royalDescription:'O emblema real que representa honra, união, prestígio e uma nova ascensão.',openImage:'ABRIR IMAGEM PARA DOWNLOAD',previewGuide:'No celular, pressione e segure a imagem. No PC, clique com o botão direito para salvar.',close:'FECHAR',footer:'Veja e salve os emblemas oficiais da EZPK.'},
    vi:{title:'LOGO EZPK',subtitle:'Biểu tượng chính thức của EZPK thể hiện truyền thống và phẩm giá.',guideTitle:'Hướng dẫn lưu hình ảnh',guideBody:'Mở hình ảnh tải xuống để xem ở kích thước gốc.',mobileGuide:'📱 Di động: nhấn giữ hình ảnh để lưu.',pcGuide:'🖥️ PC: nhấp chuột phải vào hình ảnh để lưu.',legacyDescription:'Biểu tượng chính thức nguyên bản tượng trưng cho lịch sử và tinh thần chiến binh EZPK.',royalDescription:'Biểu tượng hoàng gia tượng trưng cho danh dự, đoàn kết, phẩm giá và bước tiến mới.',openImage:'MỞ HÌNH ẢNH TẢI XUỐNG',previewGuide:'Trên di động, nhấn giữ hình ảnh để lưu. Trên PC, nhấp chuột phải để lưu.',close:'ĐÓNG',footer:'Xem và lưu các biểu tượng chính thức của EZPK.'},
    ar:{title:'شعار EZPK',subtitle:'الشعارات الرسمية لـ EZPK التي تمثل الإرث والهيبة.',guideTitle:'طريقة حفظ صور الشعار',guideBody:'افتح صورة التنزيل لعرضها بالحجم الأصلي.',mobileGuide:'📱 الجوال: اضغط مطولاً على الصورة لحفظها.',pcGuide:'🖥️ الكمبيوتر: انقر بزر الفأرة الأيمن على الصورة لحفظها.',legacyDescription:'الشعار الرسمي الأصلي الذي يرمز إلى تاريخ EZPK وروح المحارب.',royalDescription:'الشعار الملكي الذي يرمز إلى الشرف والوحدة والهيبة والانطلاقة الجديدة.',openImage:'فتح صورة التنزيل',previewGuide:'على الجوال اضغط مطولاً على الصورة، وعلى الكمبيوتر انقر بزر الفأرة الأيمن لحفظها.',close:'إغلاق',footer:'استعرض واحفظ الشعارات الرسمية لـ EZPK.'},
    ja:{title:'EZPK ロゴ',subtitle:'伝統と品格、二つのアイデンティティを表すEZPK公式エンブレム',guideTitle:'ロゴ画像の保存方法',guideBody:'ダウンロード用画像を開くと、原寸で確認できます。',mobileGuide:'📱 モバイル：画像を長押しして保存してください。',pcGuide:'🖥️ PC：画像を右クリックして保存してください。',legacyDescription:'EZPKの歴史と戦士の精神を象徴するオリジナル公式エンブレム',royalDescription:'名誉、団結、品格、そして新たな飛躍を象徴するロイヤル公式エンブレム',openImage:'ダウンロード画像を開く',previewGuide:'モバイルでは画像を長押し、PCでは右クリックして保存してください。',close:'閉じる',footer:'EZPK公式エンブレムを確認して保存できます。'},
    th:{title:'โลโก้ EZPK',subtitle:'ตราสัญลักษณ์ทางการของ EZPK ที่สะท้อนมรดกและศักดิ์ศรี',guideTitle:'วิธีบันทึกรูปโลโก้',guideBody:'เปิดรูปสำหรับดาวน์โหลดเพื่อดูในขนาดต้นฉบับ',mobileGuide:'📱 มือถือ: กดรูปค้างไว้เพื่อบันทึก',pcGuide:'🖥️ PC: คลิกขวาที่รูปเพื่อบันทึก',legacyDescription:'ตราสัญลักษณ์ต้นฉบับที่สื่อถึงประวัติศาสตร์และจิตวิญญาณนักรบของ EZPK',royalDescription:'ตราสัญลักษณ์ราชวงศ์ที่สื่อถึงเกียรติยศ ความเป็นหนึ่ง ศักดิ์ศรี และการก้าวขึ้นใหม่',openImage:'เปิดรูปสำหรับดาวน์โหลด',previewGuide:'บนมือถือให้กดรูปค้างไว้ บน PC ให้คลิกขวาที่รูปเพื่อบันทึก',close:'ปิด',footer:'ดูและบันทึกตราสัญลักษณ์ทางการของ EZPK'},
    'zh-tw':{title:'EZPK 標誌',subtitle:'承載傳統與榮耀、展現兩種精神的 EZPK 官方徽章',guideTitle:'標誌圖片儲存說明',guideBody:'開啟下載用圖片，即可查看原始尺寸。',mobileGuide:'📱 手機：長按圖片即可儲存。',pcGuide:'🖥️ 電腦：在圖片上按滑鼠右鍵儲存。',legacyDescription:'象徵 EZPK 歷史與戰士精神的原創官方徽章',royalDescription:'象徵榮譽、團結、尊榮與全新飛躍的皇家官方徽章',openImage:'開啟下載用圖片',previewGuide:'手機請長按圖片儲存；電腦請按滑鼠右鍵儲存。',close:'關閉',footer:'查看並儲存 EZPK 官方徽章。'}
  };
  const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
  function render(){
    const c=D[lang]||D.en, t=copy[lang]||copy.en;
    document.documentElement.lang=lang;
    document.documentElement.dir=c.dir||'ltr';
    document.body.classList.toggle('rtl',(c.dir||'ltr')==='rtl');
    if($('#flag')) $('#flag').textContent=c.flag||'';
    if($('#lname')) $('#lname').textContent=c.name||'';
    $$('[data-k]').forEach(el=>{const k=el.dataset.k;if(c.ui&&c.ui[k]!=null)el.innerHTML=c.ui[k]});
    $$('[data-logo-k]').forEach(el=>{const k=el.dataset.logoK;if(t[k]!=null)el.textContent=t[k]});
    localStorage.setItem('ezpk-lang-v5',lang);
  }
  $('#langBtn').onclick=()=>$('#langMenu').hidden=!$('#langMenu').hidden;
  $$('#langMenu button').forEach(b=>b.onclick=()=>{lang=b.dataset.l;if(!copy[lang])lang='en';$('#langMenu').hidden=true;render()});
  $('#menuBtn').onclick=()=>$('#nav').classList.toggle('open');
  $$('#nav a').forEach(a=>a.onclick=()=>$('#nav').classList.remove('open'));
  const modal=$('#logoPreviewModal'), image=$('#logoPreviewImage'), title=$('#logoPreviewTitle');
  function openPreview(file,edition){image.src='./'+file+'?v=950';title.textContent=edition;$('#logoPreviewGuide').textContent=(copy[lang]||copy.en).previewGuide;modal.hidden=false;document.body.classList.add('logo-modal-open');setTimeout(()=>$('#logoPreviewClose').focus(),0)}
  function closePreview(){modal.hidden=true;image.removeAttribute('src');document.body.classList.remove('logo-modal-open')}
  $$('[data-logo-open]').forEach(btn=>btn.addEventListener('click',()=>openPreview(btn.dataset.logoOpen,btn.dataset.edition)));
  $$('[data-logo-close]').forEach(el=>el.addEventListener('click',closePreview));
  $('#logoPreviewClose').addEventListener('click',closePreview);$('#logoPreviewDone').addEventListener('click',closePreview);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closePreview()});
  render();
})();
