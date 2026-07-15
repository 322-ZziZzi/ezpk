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
    let lastTap=0;
    const pointers=new Map();
    let dragStart=null;
    let pinchStart=null;

    const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
    const applyZoom=(next, focusX=stage.clientWidth/2, focusY=stage.clientHeight/2)=>{
      const previous=zoom;
      const nextZoom=clamp(Math.round(next*100)/100,1,4);
      if(nextZoom===previous) return;

      const contentX=(stage.scrollLeft+focusX)/previous;
      const contentY=(stage.scrollTop+focusY)/previous;
      zoom=nextZoom;
      img.style.width=(zoom*100)+'%';
      stage.classList.toggle('is-zoomed',zoom>1);

      requestAnimationFrame(()=>{
        stage.scrollLeft=contentX*zoom-focusX;
        stage.scrollTop=contentY*zoom-focusY;
        if(zoom===1){stage.scrollLeft=0;stage.scrollTop=0;}
      });
    };

    const reset=()=>applyZoom(1);

    stage.addEventListener('dblclick',(e)=>{
      e.preventDefault();
      const rect=stage.getBoundingClientRect();
      applyZoom(zoom===1?2:1,e.clientX-rect.left,e.clientY-rect.top);
    });

    stage.addEventListener('pointerdown',(e)=>{
      if(e.pointerType==='mouse' && e.button!==0) return;
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
      stage.setPointerCapture?.(e.pointerId);

      if(pointers.size===1 && zoom>1){
        dragStart={x:e.clientX,y:e.clientY,left:stage.scrollLeft,top:stage.scrollTop};
        stage.classList.add('is-dragging');
      }else if(pointers.size===2){
        const pts=[...pointers.values()];
        const dx=pts[0].x-pts[1].x,dy=pts[0].y-pts[1].y;
        pinchStart={distance:Math.hypot(dx,dy),zoom};
        dragStart=null;
      }
    });

    stage.addEventListener('pointermove',(e)=>{
      if(!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});

      if(pointers.size===2 && pinchStart){
        e.preventDefault();
        const pts=[...pointers.values()];
        const dx=pts[0].x-pts[1].x,dy=pts[0].y-pts[1].y;
        const distance=Math.hypot(dx,dy);
        const rect=stage.getBoundingClientRect();
        const focusX=((pts[0].x+pts[1].x)/2)-rect.left;
        const focusY=((pts[0].y+pts[1].y)/2)-rect.top;
        applyZoom(pinchStart.zoom*(distance/pinchStart.distance),focusX,focusY);
      }else if(pointers.size===1 && zoom>1 && dragStart){
        e.preventDefault();
        stage.scrollLeft=dragStart.left-(e.clientX-dragStart.x);
        stage.scrollTop=dragStart.top-(e.clientY-dragStart.y);
      }
    },{passive:false});

    const finishPointer=(e)=>{
      const wasSingle=pointers.size===1;
      pointers.delete(e.pointerId);
      stage.releasePointerCapture?.(e.pointerId);
      stage.classList.remove('is-dragging');
      dragStart=null;
      if(pointers.size<2) pinchStart=null;

      if(wasSingle && e.pointerType==='touch'){
        const now=Date.now();
        if(now-lastTap<320){
          const rect=stage.getBoundingClientRect();
          applyZoom(zoom===1?2:1,e.clientX-rect.left,e.clientY-rect.top);
          lastTap=0;
        }else lastTap=now;
      }
    };
    stage.addEventListener('pointerup',finishPointer);
    stage.addEventListener('pointercancel',finishPointer);

    stage.addEventListener('wheel',(e)=>{
      if(!e.ctrlKey) return;
      e.preventDefault();
      const rect=stage.getBoundingClientRect();
      applyZoom(zoom+(e.deltaY<0?.25:-.25),e.clientX-rect.left,e.clientY-rect.top);
    },{passive:false});

    img.addEventListener('load',reset);
  });
}
initImageViewers();
