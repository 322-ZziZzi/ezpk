(function(){
  'use strict';
  const lang=localStorage.getItem('ezpk-lang-v5')||'en';
  const copy={
    ko:[['TREASURE HUNTER','숨겨진 보물과 열쇠를 찾아 최소 클릭으로 탈출하세요.','보물 사냥','🗝','treasure-hunter'],['ZOMBIE DEFENSE','몰려오는 좀비를 빠르게 제거하고 최대 웨이브에 도전하세요.','좀비 방어','🧟','zombie-defense'],['PORTAL ESCAPE','무작위 미로에서 위험을 피하고 포탈까지 최단 경로로 이동하세요.','포탈 탈출','🌀','portal-escape'],['HERO MERGE','같은 등급의 영웅을 합쳐 최고 등급과 점수를 완성하세요.','영웅 합성','⚔️','hero-merge']],
    en:[['TREASURE HUNTER','Find the hidden treasure and key, then escape with the fewest moves.','Treasure Hunter','🗝','treasure-hunter'],['ZOMBIE DEFENSE','Destroy incoming zombies and survive as many waves as possible.','Zombie Defense','🧟','zombie-defense'],['PORTAL ESCAPE','Navigate a random maze, avoid danger, and reach the portal fast.','Portal Escape','🌀','portal-escape'],['HERO MERGE','Merge matching heroes to build the highest tier and score.','Hero Merge','⚔️','hero-merge']],
    vi:[['TREASURE HUNTER','Tìm kho báu và chìa khóa, rồi thoát với ít lượt nhất.','Săn Kho Báu','🗝','treasure-hunter'],['ZOMBIE DEFENSE','Tiêu diệt zombie và sống sót qua nhiều đợt nhất có thể.','Phòng Thủ Zombie','🧟','zombie-defense'],['PORTAL ESCAPE','Vượt mê cung ngẫu nhiên và đến cổng dịch chuyển thật nhanh.','Thoát Qua Cổng','🌀','portal-escape'],['HERO MERGE','Hợp nhất các anh hùng giống nhau để đạt cấp cao nhất.','Hợp Nhất Anh Hùng','⚔️','hero-merge']],
    pt:[['TREASURE HUNTER','Encontre o tesouro e a chave e escape com poucos movimentos.','Caça ao Tesouro','🗝','treasure-hunter'],['ZOMBIE DEFENSE','Elimine zumbis e sobreviva ao maior número de ondas.','Defesa Zumbi','🧟','zombie-defense'],['PORTAL ESCAPE','Atravesse o labirinto e alcance o portal rapidamente.','Fuga pelo Portal','🌀','portal-escape'],['HERO MERGE','Combine heróis iguais para alcançar o nível máximo.','Fusão de Heróis','⚔️','hero-merge']],
    'zh-tw':[['TREASURE HUNTER','尋找寶藏與鑰匙，用最少步數成功逃脫。','寶藏獵人','🗝','treasure-hunter'],['ZOMBIE DEFENSE','快速消滅殭屍，挑戰最高波次。','殭屍防禦','🧟','zombie-defense'],['PORTAL ESCAPE','穿越隨機迷宮並快速抵達傳送門。','傳送門逃脫','🌀','portal-escape'],['HERO MERGE','合併相同英雄，提升至最高等級。','英雄合成','⚔️','hero-merge']],
    ja:[['TREASURE HUNTER','宝と鍵を見つけ、最少手数で脱出しよう。','トレジャーハンター','🗝','treasure-hunter'],['ZOMBIE DEFENSE','ゾンビを倒し、最高ウェーブを目指そう。','ゾンビディフェンス','🧟','zombie-defense'],['PORTAL ESCAPE','ランダム迷路を抜けてポータルへ急げ。','ポータルエスケープ','🌀','portal-escape'],['HERO MERGE','同じ英雄を合成して最高ランクを目指そう。','ヒーローマージ','⚔️','hero-merge']],
    th:[['TREASURE HUNTER','ค้นหาสมบัติและกุญแจ แล้วหนีด้วยจำนวนครั้งน้อยที่สุด','นักล่าสมบัติ','🗝','treasure-hunter'],['ZOMBIE DEFENSE','กำจัดซอมบี้และเอาชีวิตรอดให้ได้หลายเวฟที่สุด','ป้องกันซอมบี้','🧟','zombie-defense'],['PORTAL ESCAPE','ผ่านเขาวงกตแบบสุ่มและไปถึงประตูมิติให้เร็ว','หลบหนีผ่านพอร์ทัล','🌀','portal-escape'],['HERO MERGE','รวมฮีโร่ระดับเดียวกันเพื่อสร้างระดับสูงสุด','รวมฮีโร่','⚔️','hero-merge']],
    ar:[['TREASURE HUNTER','اعثر على الكنز والمفتاح واهرب بأقل عدد من الحركات.','صائد الكنوز','🗝','treasure-hunter'],['ZOMBIE DEFENSE','اقضِ على الزومبي واصمد لأكبر عدد من الموجات.','دفاع الزومبي','🧟','zombie-defense'],['PORTAL ESCAPE','اعبر المتاهة العشوائية ووصل إلى البوابة بسرعة.','الهروب عبر البوابة','🌀','portal-escape'],['HERO MERGE','ادمج الأبطال المتشابهين للوصول إلى أعلى رتبة.','دمج الأبطال','⚔️','hero-merge']]
  };
  const root=document.getElementById('gameLibrary'); if(!root||root.dataset.extraReady)return;
  root.dataset.extraReady='1'; const current=document.body.dataset.game||''; const rows=copy[lang]||copy.en;
  rows.forEach(([title,desc,label,icon,slug])=>{
    const article=document.createElement('article');
    article.className='game-choice active-game new-game '+(current===slug?'current-game':'');
    article.innerHTML=`<div class="game-choice-icon">${icon}</div><div><span>${lang==='ko'?'지금 플레이 가능':'AVAILABLE NOW'}</span><h2>${title}</h2><p>${desc}</p></div>${current===slug?`<span class="current-badge">${lang==='ko'?'현재 게임':'CURRENT GAME'}</span>`:`<a href="../${slug}/#gameShell">${lang==='ko'?'플레이':'PLAY'}</a>`}`;
    root.appendChild(article);
  });
})();
