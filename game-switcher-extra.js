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
 'zh-cn':[['宝藏猎人','找到钥匙和宝藏后快速逃脱。','🗝','treasure-hunter'],['僵尸防御','消灭僵尸并挑战更高波次。','🧟','zombie-defense'],['传送门逃脱','穿越迷宫抵达传送门。','🌀','portal-escape'],['英雄合成','合并英雄达到最高等级。','⚔️','hero-merge']]
};copy.pt=copy.en;
function render(lang){const root=document.getElementById('gameLibrary');if(!root)return;root.querySelectorAll('.new-game').forEach(x=>x.remove());const current=document.body.dataset.game||'',rows=copy[lang]||copy.en,ko=lang==='ko';rows.forEach(([title,desc,icon,slug])=>{const article=document.createElement('article');article.className='game-choice active-game new-game '+(current===slug?'current-game':'');article.innerHTML=`<div class="game-choice-icon">${icon}</div><div><span>${ko?'지금 플레이 가능':'AVAILABLE NOW'}</span><h2>${title}</h2><p>${desc}</p></div>${current===slug?`<span class="current-badge">${ko?'현재 게임':'CURRENT GAME'}</span>`:`<a href="../${slug}/#gameShell">${ko?'플레이':'PLAY'}</a>`}`;root.appendChild(article)})}
window.addEventListener('ezpk-render-extra-games',e=>render(e.detail?.lang||localStorage.getItem('ezpk-lang-v5')||'en'));
window.addEventListener('ezpk-language-change',e=>render(e.detail?.lang||'en'));
render(localStorage.getItem('ezpk-lang-v5')||'en');
})();
