(function(){
'use strict';

const extraGames={
 ko:[['보물 사냥','숨겨진 열쇠와 보물을 찾아 탈출하세요.','🗝','treasure-hunter'],['좀비 방어','몰려오는 좀비를 제거하고 최고 웨이브에 도전하세요.','🧟','zombie-defense'],['포탈 탈출','미로를 빠르게 돌파하고 포탈에 도달하세요.','🌀','portal-escape'],['영웅 합성','같은 영웅을 합쳐 최고 등급을 만드세요.','⚔️','hero-merge']],
 en:[['TREASURE HUNTER','Find the key and treasure, then escape fast.','🗝','treasure-hunter'],['ZOMBIE DEFENSE','Destroy zombies and survive rising waves.','🧟','zombie-defense'],['PORTAL ESCAPE','Read the maze and reach the portal fast.','🌀','portal-escape'],['HERO MERGE','Merge matching heroes into the highest tier.','⚔️','hero-merge']],
 ja:[['トレジャーハンター','鍵と宝を見つけて素早く脱出。','🗝','treasure-hunter'],['ゾンビディフェンス','ゾンビを倒してウェーブを突破。','🧟','zombie-defense'],['ポータルエスケープ','迷路を抜けてポータルへ。','🌀','portal-escape'],['ヒーローマージ','同じ英雄を合成しよう。','⚔️','hero-merge']],
 vi:[['SĂN KHO BÁU','Tìm chìa khóa, kho báu rồi thoát nhanh.','🗝','treasure-hunter'],['PHÒNG THỦ ZOMBIE','Tiêu diệt zombie qua nhiều đợt.','🧟','zombie-defense'],['THOÁT QUA CỔNG','Vượt mê cung và đến cổng nhanh.','🌀','portal-escape'],['HỢP NHẤT ANH HÙNG','Hợp nhất anh hùng lên cấp cao nhất.','⚔️','hero-merge']],
 th:[['นักล่าสมบัติ','ค้นหากุญแจและสมบัติแล้วหนีให้เร็ว','🗝','treasure-hunter'],['ป้องกันซอมบี้','กำจัดซอมบี้และผ่านเวฟ','🧟','zombie-defense'],['หลบหนีผ่านพอร์ทัล','ผ่านเขาวงกตไปยังพอร์ทัล','🌀','portal-escape'],['รวมฮีโร่','รวมฮีโร่ไปสู่ระดับสูงสุด','⚔️','hero-merge']],
 ar:[['صائد الكنوز','اعثر على المفتاح والكنز واهرب سريعًا.','🗝','treasure-hunter'],['دفاع الزومبي','اقضِ على الزومبي واصمد.','🧟','zombie-defense'],['الهروب عبر البوابة','اعبر المتاهة إلى البوابة.','🌀','portal-escape'],['دمج الأبطال','ادمج الأبطال لأعلى رتبة.','⚔️','hero-merge']],
 'zh-tw':[['寶藏獵人','找到鑰匙和寶藏後快速逃脫。','🗝','treasure-hunter'],['殭屍防禦','消滅殭屍並挑戰更高波次。','🧟','zombie-defense'],['傳送門逃脫','穿越迷宮抵達傳送門。','🌀','portal-escape'],['英雄合成','合併英雄達到最高等級。','⚔️','hero-merge']],
 pt:[['CAÇADOR DE TESOUROS','Encontre a chave e o tesouro e escape rapidamente.','🗝','treasure-hunter'],['DEFESA ZUMBI','Elimine zumbis e sobreviva a ondas crescentes.','🧟','zombie-defense'],['FUGA PELO PORTAL','Atravesse o labirinto e alcance o portal.','🌀','portal-escape'],['FUSÃO DE HERÓIS','Una heróis iguais até o nível mais alto.','⚔️','hero-merge']]
};

const classicGames={
 ko:[['서바이벌','미사일, 포탄, 드론을 피하며 최대한 오래 생존하세요.','survival'],['탱크 배틀','적 전차를 파괴하고 웨이브를 돌파해 최고 점수에 도전하세요.','tank-battle'],['미사일 디펜스','연쇄 폭발로 적 미사일을 요격하고 도시를 방어하세요.','missile-defense'],['드론 헌터','60초 동안 드론을 조준해 격추하고 연속 명중 보너스를 획득하세요.','drone-hunter']],
 en:[['SURVIVAL','Dodge missiles, shells, and drones and survive as long as possible.','survival'],['TANK BATTLE','Destroy enemy tanks, clear waves, and fight for the highest score.','tank-battle'],['MISSILE DEFENSE','Intercept enemy missiles with chain explosions and defend the city.','missile-defense'],['DRONE HUNTER','Aim and destroy drones for 60 seconds while building a hit streak.','drone-hunter']],
 pt:[['SOBREVIVÊNCIA','Desvie de mísseis, projéteis e drones e sobreviva o máximo possível.','survival'],['BATALHA DE TANQUES','Destrua tanques inimigos, supere ondas e alcance a maior pontuação.','tank-battle'],['DEFESA CONTRA MÍSSEIS','Intercepte mísseis inimigos com explosões em cadeia e defenda a cidade.','missile-defense'],['CAÇADOR DE DRONES','Mire e destrua drones por 60 segundos enquanto cria uma sequência de acertos.','drone-hunter']],
 vi:[['SINH TỒN','Né tên lửa, đạn pháo và drone để sống sót lâu nhất có thể.','survival'],['ĐẠI CHIẾN XE TĂNG','Tiêu diệt xe tăng địch, vượt qua các đợt tấn công và giành điểm cao.','tank-battle'],['PHÒNG THỦ TÊN LỬA','Đánh chặn tên lửa địch bằng vụ nổ dây chuyền và bảo vệ thành phố.','missile-defense'],['THỢ SĂN DRONE','Ngắm và tiêu diệt drone trong 60 giây, duy trì chuỗi bắn trúng.','drone-hunter']],
 ar:[['البقاء','تجنب الصواريخ والقذائف والطائرات المسيّرة وابقَ حياً لأطول وقت ممكن.','survival'],['معركة الدبابات','دمّر دبابات العدو وتجاوز الموجات ونافس على أعلى نتيجة.','tank-battle'],['دفاع الصواريخ','اعترض صواريخ العدو بانفجارات متسلسلة واحمِ المدينة.','missile-defense'],['صائد الطائرات المسيّرة','صوّب وأسقط الطائرات المسيّرة خلال 60 ثانية وحقق سلسلة إصابات.','drone-hunter']],
 ja:[['サバイバル','ミサイル、砲弾、ドローンを避けてできるだけ長く生き残ろう。','survival'],['タンクバトル','敵戦車を破壊し、ウェーブを突破して最高得点を目指そう。','tank-battle'],['ミサイルディフェンス','連鎖爆発で敵ミサイルを迎撃し、都市を守ろう。','missile-defense'],['ドローンハンター','60秒間ドローンを狙撃し、連続命中を重ねよう。','drone-hunter']],
 th:[['เอาชีวิตรอด','หลบขีปนาวุธ กระสุนปืนใหญ่ และโดรนให้อยู่รอดนานที่สุด','survival'],['ศึกรถถัง','ทำลายรถถังศัตรู ผ่านแต่ละเวฟ และทำคะแนนสูงสุด','tank-battle'],['ป้องกันขีปนาวุธ','สกัดขีปนาวุธศัตรูด้วยระเบิดต่อเนื่องและปกป้องเมือง','missile-defense'],['นักล่าโดรน','เล็งและยิงโดรนภายใน 60 วินาที พร้อมรักษาคอมโบการยิง','drone-hunter']],
 'zh-tw':[['生存挑戰','閃避飛彈、砲彈與無人機，盡可能生存更久。','survival'],['戰車對決','摧毀敵方戰車、突破波次並挑戰最高分。','tank-battle'],['飛彈防禦','利用連鎖爆炸攔截敵方飛彈並守護城市。','missile-defense'],['無人機獵手','在60秒內瞄準並擊落無人機，累積連續命中。','drone-hunter']]
};

const labels={
 ko:['지금 플레이 가능','현재 게임','플레이'],
 en:['AVAILABLE NOW','CURRENT GAME','PLAY'],
 pt:['DISPONÍVEL AGORA','JOGO ATUAL','JOGAR'],
 vi:['CÓ THỂ CHƠI NGAY','TRÒ HIỆN TẠI','CHƠI'],
 ar:['متاح الآن','اللعبة الحالية','العب'],
 ja:['今すぐプレイ','現在のゲーム','プレイ'],
 th:['เล่นได้แล้ว','เกมปัจจุบัน','เล่น'],
 'zh-tw':['立即遊玩','目前遊戲','開始']
};

function currentSlug(){
 const explicit=document.body.dataset.game;
 if(explicit)return explicit;
 const path=location.pathname.toLowerCase();
 if(path.includes('/tank-battle/'))return 'tank-battle';
 if(path.includes('/missile-defense/'))return 'missile-defense';
 if(path.includes('/drone-hunter/'))return 'drone-hunter';
 if(path.includes('/game/'))return 'survival';
 return '';
}

function renderClassic(lang,root,current,label){
 const rows=classicGames[lang]||classicGames.en;
 const cards=[...root.querySelectorAll('.game-choice:not(.new-game)')].slice(0,4);
 cards.forEach((card,index)=>{
  const row=rows[index];
  if(!row)return;
  const [title,desc,slug]=row;
  const status=card.querySelector('div:nth-child(2) > span');
  const heading=card.querySelector('h2');
  const paragraph=card.querySelector('p');
  const link=card.querySelector('a');
  const badge=card.querySelector('.current-badge');
  if(status)status.textContent=label[0];
  if(heading)heading.textContent=title;
  if(paragraph)paragraph.textContent=desc;
  if(link)link.textContent=label[2];
  if(badge)badge.textContent=label[1];
  card.classList.toggle('current-game',current===slug);
 });

 if(['survival','tank-battle','missile-defense','drone-hunter'].includes(current)){
  const currentRow=rows.find(row=>row[2]===current);
  const heroTitle=document.querySelector('.mini-game-hero h1');
  if(currentRow&&heroTitle){
   heroTitle.textContent=current==='survival'?'EZPK '+currentRow[0]:currentRow[0];
  }
 }
}

function renderExtra(lang,root,current,label){
 root.querySelectorAll('.new-game').forEach(node=>node.remove());
 const rows=extraGames[lang]||extraGames.en;
 rows.forEach(([title,desc,icon,slug])=>{
  const article=document.createElement('article');
  article.className='game-choice active-game new-game '+(current===slug?'current-game':'');
  article.innerHTML=`<div class="game-choice-icon">${icon}</div><div><span>${label[0]}</span><h2>${title}</h2><p>${desc}</p></div>${current===slug?`<span class="current-badge">${label[1]}</span>`:`<a href="../${slug}/#gameShell">${label[2]}</a>`}`;
  root.appendChild(article);
 });
}

function render(lang){
 lang=extraGames[lang]&&classicGames[lang]?lang:'en';
 const root=document.getElementById('gameLibrary');
 if(!root)return;
 const current=currentSlug();
 const label=labels[lang]||labels.en;
 renderClassic(lang,root,current,label);
 renderExtra(lang,root,current,label);
}

window.addEventListener('ezpk-render-extra-games',event=>render(event.detail?.lang||localStorage.getItem('ezpk-lang-v5')||'en'));
window.addEventListener('ezpk-language-change',event=>render(event.detail?.lang||'en'));
render(localStorage.getItem('ezpk-lang-v5')||'en');
})();
