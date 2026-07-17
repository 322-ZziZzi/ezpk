const D=window.EZPK_DATA;let lang=localStorage.getItem('ezpk-lang-v5')||'en';let team='tower';if(!D[lang])lang='en';const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
function render(){const c=D[lang];document.documentElement.lang=lang;document.documentElement.dir=c.dir;document.body.classList.toggle('rtl',c.dir==='rtl');$('#flag').textContent=c.flag;$('#lname').textContent=c.name;$('#lineupImg').src=c.lineup;const s7=$('#season7Img');s7.onerror=()=>{s7.alt='Season 7 image could not be loaded. Please upload the season7 WebP files to the repository root.'};s7.src=c.season7;$$('[data-k]').forEach(e=>{const k=e.dataset.k;if(c.ui[k]!=null)e.innerHTML=c.ui[k]});$('#overall').innerHTML=c.overall.map(x=>`<li>${x}</li>`).join('');renderTeam();$('#ordersGrid').innerHTML=c.orders.map((x,i)=>`<div class="order"><div class="num">${i+1}</div><div>${x}</div></div>`).join('');localStorage.setItem('ezpk-lang-v5',lang);window.dispatchEvent(new CustomEvent('ezpk-language-change',{detail:{lang}}))}
function renderTeam(){const t=D[lang].teams[team];$('#team').innerHTML=`<div class="teamcard" style="--accent:${t.accent}"><aside class="quick"><small>${D[lang].ui.quickSummary||'QUICK SUMMARY'}</small><h3>${t.title}</h3><ul>${t.quick.map(x=>`<li>${x}</li>`).join('')}</ul></aside><div class="details">${t.sections.map(([h,b])=>`<div class="detail"><h4>${h}</h4>${Array.isArray(b)?`<ul>${b.map(x=>`<li>${x}</li>`).join('')}</ul>`:`<p>${b}</p>`}</div>`).join('')}</div></div>`}
$('#langBtn').onclick=()=>$('#langMenu').hidden=!$('#langMenu').hidden;$$('#langMenu button').forEach(b=>b.onclick=()=>{lang=b.dataset.l;$('#langMenu').hidden=true;render()});$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');team=b.dataset.t;renderTeam()});$('#menuBtn').onclick=()=>$('#nav').classList.toggle('open');$$('#nav a').forEach(a=>a.onclick=()=>$('#nav').classList.remove('open'));render();


// v39: one reliable active-menu rule for every main-page section.
(function setupActiveNavigation(){
  const nav = document.getElementById('nav');
  if (!nav) return;

  const navLinks = [...nav.querySelectorAll('a')];
  const sectionLinks = navLinks.filter(a => {
    const href = a.getAttribute('href') || '';
    return href.startsWith('#');
  });
  const items = sectionLinks.map(link => {
    const id = (link.getAttribute('href') || '').slice(1);
    return { link, section: document.getElementById(id) };
  }).filter(item => item.section);

  function activate(link){
    navLinks.forEach(item => {
      item.classList.remove('active');
      item.removeAttribute('aria-current');
    });
    if (link) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  }

  function linkForHash(hash){
    return sectionLinks.find(link => link.getAttribute('href') === hash) || null;
  }

  function activateFromHash(){
    const hash = window.location.hash;
    const matched = linkForHash(hash);
    if (matched) activate(matched);
  }

  function activateFromScroll(){
    if (!items.length) return;
    const header = document.querySelector('header');
    const offset = (header?.offsetHeight || 72) + 32;
    const probe = window.scrollY + offset;
    let current = items[0];

    for (const item of items) {
      if (item.section.offsetTop <= probe) current = item;
      else break;
    }

    const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (nearBottom) current = items[items.length - 1];
    activate(current.link);
  }

  sectionLinks.forEach(link => {
    link.addEventListener('click', () => {
      activate(link);
      const href = link.getAttribute('href');
      if (href) history.replaceState(null, '', href);
    });
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      activateFromScroll();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener('hashchange', () => {
    activateFromHash();
    window.setTimeout(activateFromScroll, 80);
  });

  window.addEventListener('load', () => {
    activateFromHash();
    window.setTimeout(activateFromScroll, 120);
  });

  activate(linkForHash(window.location.hash) || sectionLinks[0] || null);
})();
