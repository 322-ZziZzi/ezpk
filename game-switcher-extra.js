(function(){
'use strict';
const copy={
 ko:[['보물 사냥','숨겨진 열쇠와 보물을 찾아 탈출하세요.','🗝','treasure-hunter'],['좀비 방어','몰려오는 좀비를 제거하고 최고 웨이브에 도전하세요.','🧟','zombie-defense'],['포탈 탈출','미로를 빠르게 돌파하고 포탈에 도달하세요.','🌀','portal-escape'],['영웅 합성','같은 영웅을 합쳐 최고 등급을 만드세요.','⚔️','hero-merge']],
 en:[['TREASURE HUNTER','Find the key and treasure, then escape fast.','🗝','treasure-hunter'],['ZOMBIE DEFENSE','Destroy zombies and survive rising waves.','🧟','zombie-defense'],['PORTAL ESCAPE','Read the maze and reach the portal fast.','🌀','portal-escape'],['HERO MERGE','Merge matching heroes into the highest tier.','⚔️','hero-merge']],
 ja:[['トレジャーハンター','鍵と宝を見つけて素早く脱出。','🗝','treasure-hunter'],['ゾンビディフェンス','ゾンビを倒してウェーブを突破。','🧟','zombie-defense'],['ポータルエスケープ','迷路を抜けてポータルへ。','🌀','portal-escape'],['ヒーローマージ','同じ英雄を合成しよう。','⚔️','hero-merge']],
 vi:[['SĂN KHO BÁU','Tìm chìa khóa, kho báu rồi thoát nhanh.','🗝','treasure-hunter'],['PHÒNG THỦ ZOMBIE','Tiêu diệt zombie qua nhiều đợt.','🧟','zombie-defense'],['THOÁT QUA CỔNG','Vượt mê cung và đến cổng nhanh.','🌀','portal-escape'],['HỢP NHẤT ANH HÙNG','Hợp nhất anh hùng lên cấp cao nhất.','⚔️','hero-merge']],
 th:[['นักล่าสมบัติ','ค้นหากุญแจและสมบัติแล้วหนีให้เร็ว','🗝','treasure-hunter'],['ป้องกันซอมบี้','กำจัดซอมบี้และผ่านเวฟ','🧟','zombie-defense'],['หลบหนีผ่านพอร์ทัล','ผ่านเขาวงกตไปยังพอร์ทัล','🌀','portal-escape'],['รวมฮีโร่','รวมฮีโร่ไปสู่ระดับสูงสุด','⚔️','hero-merge']],
 ar:[['صائد الكنوز','اعثر على المفتاح والكنز واهرب سريعًا.','🗝','treasure-hunter'],['دفاع الزومبي','اقضِ على الزومبي واصمد.','🧟','zombie-defense'],['الهروب عبر البوابة','اعبر المتاهة إلى البوابة.','🌀','portal-escape'],['دمج الأبطال','ادمج الأبطال لأعلى رتبة.','⚔️','hero-merge']],
 'zh-tw':[['寶藏獵人','找到鑰匙和寶藏後快速逃脫。','🗝','treasure-hunter'],['殭屍防禦','消滅殭屍並挑戰更高波次。','🧟','zombie-defense'],['傳送門逃脫','穿越迷宮抵達傳送門。','🌀','portal-escape'],['英雄合成','合併英雄達到最高等級。','⚔️','hero-merge']],
 pt:[['CAÇADOR DE TESOUROS','Encontre a chave e o tesouro e escape rapidamente.','🗝','treasure-hunter'],['DEFESA ZUMBI','Elimine zumbis e sobreviva a ondas crescentes.','🧟','zombie-defense'],['FUGA PELO PORTAL','Atravesse o labirinto e alcance o portal.','🌀','portal-escape'],['FUSÃO DE HERÓIS','Una heróis iguais até o nível mais alto.','⚔️','hero-merge']]
};
const labels={ko:['지금 플레이 가능','현재 게임','플레이'],en:['AVAILABLE NOW','CURRENT GAME','PLAY'],pt:['DISPONÍVEL AGORA','JOGO ATUAL','JOGAR'],vi:['CÓ THỂ CHƠI NGAY','TRÒ HIỆN TẠI','CHƠI'],ar:['متاح الآن','اللعبة الحالية','العب'],ja:['今すぐプレイ','現在のゲーム','プレイ'],th:['เล่นได้แล้ว','เกมปัจจุบัน','เล่น'],'zh-tw':['立即遊玩','目前遊戲','開始']};
function render(lang){lang=copy[lang]?lang:'en';const root=document.getElementById('gameLibrary');if(!root)return;root.querySelectorAll('.new-game').forEach(x=>x.remove());const current=document.body.dataset.game||'',rows=copy[lang],label=labels[lang]||labels.en;rows.forEach(([title,desc,icon,slug])=>{const article=document.createElement('article');article.className='game-choice active-game new-game '+(current===slug?'current-game':'');article.innerHTML=`<div class="game-choice-icon">${icon}</div><div><span>${label[0]}</span><h2>${title}</h2><p>${desc}</p></div>${current===slug?`<span class="current-badge">${label[1]}</span>`:`<a href="../${slug}/#gameShell">${label[2]}</a>`}`;root.appendChild(article)})}
window.addEventListener('ezpk-render-extra-games',e=>render(e.detail?.lang||localStorage.getItem('ezpk-lang-v5')||'en'));
window.addEventListener('ezpk-language-change',e=>render(e.detail?.lang||'en'));
render(localStorage.getItem('ezpk-lang-v5')||'en');
})();
