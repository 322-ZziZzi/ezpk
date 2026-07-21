(function(){
'use strict';
const game=document.body.dataset.game, cfg=window.EZPK_SUPABASE_CONFIG||{}, $=s=>document.querySelector(s);
let score=0,start=0,timer=null,nick='',cleanupGame=()=>{};
const names={
 'treasure-hunter':['TREASURE HUNTER','Find the hidden key and treasure, then escape.','MOVES','Tap tiles to reveal the key, treasure, and exit. Collect both items before opening the exit.','Fewer moves earn a higher score. Avoid bombs.'],
 'zombie-defense':['ZOMBIE DEFENSE','Destroy the incoming zombies before they break through.','WAVE','Tap incoming zombies before they reach the defense line. Clear the required kills to advance to the next wave.','Faster kills and higher waves earn more points.'],
 'portal-escape':['PORTAL ESCAPE','Find the shortest safe route to the portal.','SCORE','Move one tile at a time and guide your unit through the open path to the portal. Walls cannot be crossed.','Reach the portal in as few moves as possible.'],
 'hero-merge':['HERO MERGE','Merge matching heroes and build the highest tier.','SCORE','Swipe inside the board or use the direction buttons. Matching heroes merge into the next tier.','Plan each move carefully and build the highest-tier hero.']};
const n=names[game];
$('#gameTitle').textContent=n[0];$('#gameLead').textContent=n[1];$('#scoreLabel').textContent=n[2];
$('#mobileInfoTitle').textContent=n[0];$('#mobileInfoText').textContent=n[3];$('#mobileInfoControl').textContent=n[4];
const monthKey=()=>new Date().toISOString().slice(0,7),monthStartISO=()=>monthKey()+'-01T00:00:00.000Z',nextMonthISO=()=>{const d=new Date();return new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1)).toISOString()};
function headers(extra={}){return {'apikey':cfg.anonKey,'Authorization':`Bearer ${cfg.anonKey}`,'Content-Type':'application/json',...extra}}
function configured(){return cfg.url&&cfg.anonKey&&!String(cfg.url).includes('YOUR_')}
function localRows(){try{return JSON.parse(localStorage.getItem(`ezpk-ranking-${game}-${monthKey()}`)||'[]')}catch{return[]}}
function saveLocal(){let r=localRows();r.push({nickname:nick,score,created_at:new Date().toISOString()});localStorage.setItem(`ezpk-ranking-${game}-${monthKey()}`,JSON.stringify(r.slice(-300)))}
async function submit(){saveLocal();if(configured())try{await fetch(`${cfg.url}/rest/v1/game_scores`,{method:'POST',headers:headers({Prefer:'return=minimal'}),body:JSON.stringify({nickname:nick,score,game_id:game})})}catch(e){console.warn(e)}await loadRanking()}
function best(rows){const m=new Map();rows.forEach(r=>{const k=String(r.nickname).toLowerCase();if(!m.has(k)||+r.score>+m.get(k).score)m.set(k,r)});return [...m.values()].sort((a,b)=>b.score-a.score).slice(0,30)}
async function loadRanking(){let rows=[],remote=false;$('#rankingStatus').textContent='Loading ranking...';if(configured())try{const q=`select=nickname,score,created_at&game_id=eq.${game}&created_at=gte.${encodeURIComponent(monthStartISO())}&created_at=lt.${encodeURIComponent(nextMonthISO())}&order=score.desc&limit=300`;const r=await fetch(`${cfg.url}/rest/v1/game_scores?${q}`,{headers:headers()});rows=await r.json();remote=r.ok}catch(e){}if(!remote)rows=localRows();rows=best(rows);window.EZPKRankingPanel.renderRows(rows);$('#rankingStatus').textContent=rows.length?'':'No scores yet.';$('#rankingTitle').textContent='Monthly '+n[0]+' Ranking';$('#rankingNote').textContent='A new ranking starts on the first day of each month. Only each nickname’s best score is shown.';$('#monthChip').textContent=monthKey()}
function update(){ $('#scoreValue').textContent=score.toLocaleString(); if(start)$('#timeValue').textContent=((Date.now()-start)/1000).toFixed(1)+'s'}
function resetRuntime(){cleanupGame();cleanupGame=()=>{};clearInterval(timer);timer=null}
function begin(){nick=$('#nickname').value.trim();if(!nick)return alert('Enter a nickname.');resetRuntime();window.EZPKGameViewport?.setPlaying(true);localStorage.setItem('ezpk-game-nickname',nick);score=0;start=Date.now();$('#scoreLabel').textContent=n[2];$('#startOverlay').hidden=true;$('#resultOverlay').hidden=true;timer=setInterval(update,100);build();update()}
async function finish(msg){resetRuntime();window.EZPKGameViewport?.setPlaying(false);update();$('#finalScore').textContent=score.toLocaleString();$('#resultText').textContent=msg;$('#resultOverlay').hidden=false;await submit()}
function makeGrid(size,extra=''){const stage=$('#stage');stage.innerHTML=`<div class="newgame-grid ${extra}" style="--grid-size:${size}"></div>`;return stage.firstElementChild}
function treasure(){
 const size=6,total=size*size,g=makeGrid(size,'treasure-grid');
 const slots=[...Array(total).keys()];const take=()=>slots.splice(Math.floor(Math.random()*slots.length),1)[0];
 const key=take(),treasure=take(),exit=take(),bombs=new Set(Array.from({length:4},take));let gotK=false,gotT=false,moves=0,ended=false;
 for(let i=0;i<total;i++){const b=document.createElement('button');b.type='button';b.className='newgame-cell';b.textContent='?';b.addEventListener('click',()=>{if(ended||b.classList.contains('revealed'))return;moves++;b.classList.add('revealed');let symbol='·';if(i===key){symbol='🗝';gotK=true}else if(i===treasure){symbol='💰';gotT=true}else if(i===exit)symbol='🚪';else if(bombs.has(i))symbol='💣';b.textContent=symbol;if(bombs.has(i))score=Math.max(0,score-80);else score+=15;$('#scoreValue').textContent=moves;if(i===exit&&gotK&&gotT){ended=true;score=Math.max(100,2200-moves*45);finish(`Escaped in ${moves} moves.`)}});g.appendChild(b)}
}
function zombies(){
 const stage=$('#stage');stage.innerHTML='<div class="zombie-field"><div class="defense-line"></div></div>';const field=stage.firstElementChild;
 let wave=1,kills=0,escaped=0,ended=false,spawnTimer=null;const movers=new Set();
 const required=()=>4+wave*2;
 function updateWave(){ $('#scoreLabel').textContent=`WAVE ${wave}`; }
 function removeMover(entry){clearInterval(entry.id);movers.delete(entry);entry.el.remove()}
 function spawnOne(){if(ended)return;const z=document.createElement('button');z.type='button';z.className='zombie';z.textContent='🧟';z.style.left=(4+Math.random()*88)+'%';field.appendChild(z);let y=-12;const entry={el:z,id:null};entry.id=setInterval(()=>{y+=0.42+wave*0.045;z.style.top=y+'%';if(y>=84){removeMover(entry);escaped++;if(escaped>=3){ended=true;finish(`Defense broke at wave ${wave}.`)}}},30);movers.add(entry);z.addEventListener('click',()=>{if(ended||!movers.has(entry))return;removeMover(entry);kills++;score+=100+wave*20;update();if(kills>=required()){wave++;kills=0;escaped=0;updateWave()}})}
 updateWave();spawnOne();spawnTimer=setInterval(spawnOne,Math.max(330,900-wave*35));
 cleanupGame=()=>{ended=true;clearInterval(spawnTimer);[...movers].forEach(removeMover)};
}
function portal(){
 const size=7,total=size*size,g=makeGrid(size,'portal-grid');let player=0,portal=total-1,moves=0,ended=false;
 const cells=Array(total).fill('open');
 // Keep one guaranteed route open: top row to the right, then last column downward.
 const safe=new Set();for(let c=0;c<size;c++)safe.add(c);for(let r=0;r<size;r++)safe.add(r*size+size-1);
 for(let i=0;i<total;i++)if(!safe.has(i)&&Math.random()<.24)cells[i]='wall';
 function paint(){g.innerHTML='';cells.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.className='newgame-cell '+(c==='wall'?'wall ':'')+(i===player?'player ':'')+(i===portal?'portal':'');b.textContent=i===player?'🛡':i===portal?'🌀':c==='wall'?'':'·';b.addEventListener('click',()=>move(i));g.appendChild(b)})}
 function move(i){if(ended)return;const dx=Math.abs((i%size)-(player%size)),dy=Math.abs(Math.floor(i/size)-Math.floor(player/size));if(dx+dy!==1||cells[i]==='wall')return;player=i;moves++;score=Math.max(0,1500-moves*25);paint();update();if(player===portal){ended=true;finish(`Portal reached in ${moves} moves.`)}}paint();
}
function merge(){
 const stage=$('#stage');stage.innerHTML='<div class="merge-game"><div class="merge-board" aria-label="Hero merge board"></div><div class="merge-controls"><button type="button" data-d="left">◀</button><button type="button" data-d="up">▲</button><button type="button" data-d="down">▼</button><button type="button" data-d="right">▶</button></div></div>';
 const wrap=stage.firstElementChild,g=wrap.querySelector('.merge-board');let board=Array(16).fill(0),ended=false,touchStart=null;
 function add(){const empty=board.map((v,i)=>v?null:i).filter(v=>v!==null);if(empty.length)board[empty[Math.floor(Math.random()*empty.length)]]=Math.random()<.9?1:2}
 function draw(){g.innerHTML='';board.forEach(v=>{const t=document.createElement('div');t.className='merge-tile tier-'+Math.min(v,6);t.textContent=v?['','🪖','⚔️','🛡','👑','🔥','⭐'][Math.min(v,6)]+' '+(2**v):'';g.appendChild(t)})}
 function line(arr){let a=arr.filter(Boolean);for(let i=0;i<a.length-1;i++)if(a[i]===a[i+1]){a[i]++;score+=2**a[i]*10;a.splice(i+1,1)}while(a.length<4)a.push(0);return a}
 function canMove(){if(board.includes(0))return true;for(let r=0;r<4;r++)for(let c=0;c<4;c++){const v=board[r*4+c];if(c<3&&board[r*4+c+1]===v)return true;if(r<3&&board[(r+1)*4+c]===v)return true}return false}
 function shift(d){if(ended)return;const old=board.join();let nb=Array(16).fill(0);for(let k=0;k<4;k++){let arr=[];for(let j=0;j<4;j++){const r=d==='up'||d==='down'?j:k,c=d==='up'||d==='down'?k:j;arr.push(board[r*4+c])}if(d==='right'||d==='down')arr.reverse();arr=line(arr);if(d==='right'||d==='down')arr.reverse();for(let j=0;j<4;j++){const r=d==='up'||d==='down'?j:k,c=d==='up'||d==='down'?k:j;nb[r*4+c]=arr[j]}}board=nb;if(board.join()!==old){add();draw();update()}if(!canMove()){ended=true;score+=Math.max(...board)*100;finish('No more moves.')}}
 wrap.querySelectorAll('[data-d]').forEach(b=>b.addEventListener('click',()=>shift(b.dataset.d)));
 const keyHandler=e=>{const map={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};if(map[e.key]){e.preventDefault();shift(map[e.key])}};document.addEventListener('keydown',keyHandler);
 g.addEventListener('pointerdown',e=>{touchStart={x:e.clientX,y:e.clientY}});g.addEventListener('pointerup',e=>{if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;touchStart=null;if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;shift(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'))});
 add();add();draw();cleanupGame=()=>{ended=true;document.removeEventListener('keydown',keyHandler)};
}
function build(){({'treasure-hunter':treasure,'zombie-defense':zombies,'portal-escape':portal,'hero-merge':merge}[game])()}
$('#startBtn').onclick=begin;$('#retryBtn').onclick=begin;$('#rankingBtn').onclick=()=>{window.EZPKRankingPanel.focusPlayer(nick);$('#resultOverlay').hidden=true};$('#refreshRanking').onclick=loadRanking;$('#nickname').value=localStorage.getItem('ezpk-game-nickname')||'';loadRanking();
})();
