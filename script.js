const D=window.EZPK_DATA;let lang=localStorage.getItem('ezpk-lang-v5')||'en';let team='tower';if(!D[lang])lang='en';const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
function render(){const c=D[lang];document.documentElement.lang=lang;document.documentElement.dir=c.dir;document.body.classList.toggle('rtl',c.dir==='rtl');$('#flag').textContent=c.flag;$('#lname').textContent=c.name;$('#lineupImg').src=c.lineup;const s7=$('#season7Img');s7.onerror=()=>{s7.alt='Season 7 image could not be loaded. Please upload the season7 WebP files to the repository root.'};s7.src=c.season7;$$('[data-k]').forEach(e=>{const k=e.dataset.k;if(c.ui[k]!=null)e.innerHTML=c.ui[k]});$('#overall').innerHTML=c.overall.map(x=>`<li>${x}</li>`).join('');renderTeam();$('#ordersGrid').innerHTML=c.orders.map((x,i)=>`<div class="order"><div class="num">${i+1}</div><div>${x}</div></div>`).join('');localStorage.setItem('ezpk-lang-v5',lang);window.dispatchEvent(new CustomEvent('ezpk-language-change',{detail:{lang}}))}
function renderTeam(){const t=D[lang].teams[team];$('#team').innerHTML=`<div class="teamcard" style="--accent:${t.accent}"><aside class="quick"><small>${D[lang].ui.quickSummary||'QUICK SUMMARY'}</small><h3>${t.title}</h3><ul>${t.quick.map(x=>`<li>${x}</li>`).join('')}</ul></aside><div class="details">${t.sections.map(([h,b])=>`<div class="detail"><h4>${h}</h4>${Array.isArray(b)?`<ul>${b.map(x=>`<li>${x}</li>`).join('')}</ul>`:`<p>${b}</p>`}</div>`).join('')}</div></div>`}
$('#langBtn').onclick=()=>$('#langMenu').hidden=!$('#langMenu').hidden;$$('#langMenu button').forEach(b=>b.onclick=()=>{lang=b.dataset.l;$('#langMenu').hidden=true;render()});$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');team=b.dataset.t;renderTeam()});$('#menuBtn').onclick=()=>$('#nav').classList.toggle('open');$$('#nav a').forEach(a=>a.onclick=()=>$('#nav').classList.remove('open'));render();


// v38: use one active-menu rule for all main-page sections.
(function setupActiveNavigation(){
  const navLinks=[...document.querySelectorAll('#nav a')];
  const sectionLinks=navLinks.filter(a=>a.getAttribute('href')?.startsWith('#'));
  const sections=sectionLinks
    .map(a=>({a,section:document.querySelector(a.getAttribute('href'))}))
    .filter(x=>x.section);

  function activate(link){
    navLinks.forEach(a=>a.classList.remove('active'));
    if(link) link.classList.add('active');
  }

  sectionLinks.forEach(a=>a.addEventListener('click',()=>activate(a)));

  if('IntersectionObserver' in window && sections.length){
    const visible=new Map();
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>visible.set(entry.target,entry.intersectionRatio));
      let best=null;
      for(const item of sections){
        const ratio=visible.get(item.section)||0;
        if(ratio>0 && (!best || ratio>best.ratio)) best={...item,ratio};
      }
      if(best) activate(best.a);
    },{rootMargin:'-20% 0px -55% 0px',threshold:[0,0.1,0.25,0.5,0.75]});
    sections.forEach(x=>observer.observe(x.section));
  }

  const initialHash=location.hash||'#schedule';
  activate(sectionLinks.find(a=>a.getAttribute('href')===initialHash)||sectionLinks[0]);
})();
