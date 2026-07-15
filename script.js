const D=window.EZPK_DATA;let lang=localStorage.getItem('ezpk-lang-v5')||'en';let team='tower';if(!D[lang])lang='en';const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
function render(){const c=D[lang];document.documentElement.lang=lang;document.documentElement.dir=c.dir;document.body.classList.toggle('rtl',c.dir==='rtl');$('#flag').textContent=c.flag;$('#lname').textContent=c.name;$('#lineupImg').src=c.lineup;const s7=$('#season7Img');s7.onerror=()=>{s7.alt='Season 7 image could not be loaded. Please upload the season7 WebP files to the repository root.'};s7.src=c.season7;$$('[data-k]').forEach(e=>{const k=e.dataset.k;if(c.ui[k]!=null)e.innerHTML=c.ui[k]});$('#overall').innerHTML=c.overall.map(x=>`<li>${x}</li>`).join('');renderTeam();$('#ordersGrid').innerHTML=c.orders.map((x,i)=>`<div class="order"><div class="num">${i+1}</div><div>${x}</div></div>`).join('');localStorage.setItem('ezpk-lang-v5',lang)}
function renderTeam(){const t=D[lang].teams[team];$('#team').innerHTML=`<div class="teamcard" style="--accent:${t.accent}"><aside class="quick"><small>${D[lang].ui.quickSummary||'QUICK SUMMARY'}</small><h3>${t.title}</h3><ul>${t.quick.map(x=>`<li>${x}</li>`).join('')}</ul></aside><div class="details">${t.sections.map(([h,b])=>`<div class="detail"><h4>${h}</h4>${Array.isArray(b)?`<ul>${b.map(x=>`<li>${x}</li>`).join('')}</ul>`:`<p>${b}</p>`}</div>`).join('')}</div></div>`}
$('#langBtn').onclick=()=>$('#langMenu').hidden=!$('#langMenu').hidden;$$('#langMenu button').forEach(b=>b.onclick=()=>{lang=b.dataset.l;$('#langMenu').hidden=true;render()});$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');team=b.dataset.t;renderTeam()});$('#menuBtn').onclick=()=>$('#nav').classList.toggle('open');$$('#nav a').forEach(a=>a.onclick=()=>$('#nav').classList.remove('open'));render();

function initImageViewers(){
  $$('.stage').forEach((stage)=>{
    if(stage.dataset.viewerReady==='1') return;
    stage.dataset.viewerReady='1';
    const img=stage.querySelector('img');
    if(!img) return;
    img.draggable=false;
    let zoom=1;
    const tools=document.createElement('div');
    tools.className='image-tools';
    tools.innerHTML='<button type="button" aria-label="Zoom out">−</button><button type="button" aria-label="Reset zoom">↺</button><button type="button" aria-label="Zoom in">＋</button>';
    stage.prepend(tools);
    const [minus,reset,plus]=tools.querySelectorAll('button');
    const apply=(next,center=true)=>{
      const prev=zoom;
      zoom=Math.min(4,Math.max(1,Math.round(next*10)/10));
      const oldLeft=stage.scrollLeft, oldTop=stage.scrollTop;
      const cx=oldLeft+stage.clientWidth/2, cy=oldTop+stage.clientHeight/2;
      img.style.width=(zoom*100)+'%';
      stage.classList.toggle('is-zoomed',zoom>1);
      requestAnimationFrame(()=>{
        if(center && prev>0){
          stage.scrollLeft=cx*(zoom/prev)-stage.clientWidth/2;
          stage.scrollTop=cy*(zoom/prev)-stage.clientHeight/2;
        }
      });
    };
    minus.onclick=()=>apply(zoom-.5);
    plus.onclick=()=>apply(zoom+.5);
    reset.onclick=()=>{apply(1,false);stage.scrollTo({left:0,top:0,behavior:'smooth'})};
    let lastTap=0;
    stage.addEventListener('click',(e)=>{
      if(e.target.closest('.image-tools')) return;
      const now=Date.now();
      if(now-lastTap<320){apply(zoom===1?2:1);lastTap=0}else lastTap=now;
    });
    stage.addEventListener('wheel',(e)=>{
      if(!e.ctrlKey) return;
      e.preventDefault();
      apply(zoom+(e.deltaY<0?.25:-.25));
    },{passive:false});
    let dragging=false,startX=0,startY=0,startLeft=0,startTop=0;
    stage.addEventListener('pointerdown',(e)=>{
      if(zoom<=1 || e.pointerType==='touch' || e.target.closest('.image-tools')) return;
      dragging=true;startX=e.clientX;startY=e.clientY;startLeft=stage.scrollLeft;startTop=stage.scrollTop;
      stage.classList.add('is-dragging');stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove',(e)=>{if(!dragging)return;stage.scrollLeft=startLeft-(e.clientX-startX);stage.scrollTop=startTop-(e.clientY-startY)});
    const stop=()=>{dragging=false;stage.classList.remove('is-dragging')};
    stage.addEventListener('pointerup',stop);stage.addEventListener('pointercancel',stop);
  });
}
initImageViewers();
