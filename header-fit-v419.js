(function(){
  'use strict';
  if(window.EZPKHeaderFit && window.EZPKHeaderFit.version==='419') return;

  const VERSION='419';
  const SAFETY=5;
  const MAX_PASSES=2;
  const LEVELS=[
    {name:'normal',font:1,pad:1,letter:0},
    {name:'compact',font:.94,pad:.82,letter:-.012},
    {name:'tight',font:.88,pad:.68,letter:-.024}
  ];
  const MIN_FONT=9.5;
  let raf=0;
  let running=false;
  let ro=null;
  let mo=null;
  const originals=new WeakMap();

  function header(){return document.querySelector('[data-shared-header].site-header:not(.admin-auth-host)');}
  function visible(el){
    if(!el || !el.isConnected || el.hidden) return false;
    const cs=getComputedStyle(el),r=el.getBoundingClientRect();
    return cs.display!=='none' && cs.visibility!=='hidden' && r.width>2 && r.height>2;
  }
  function save(el){
    if(originals.has(el)) return;
    originals.set(el,{
      fontSize:el.style.getPropertyValue('font-size'),fontSizeP:el.style.getPropertyPriority('font-size'),
      letter:el.style.getPropertyValue('letter-spacing'),letterP:el.style.getPropertyPriority('letter-spacing'),
      pl:el.style.getPropertyValue('padding-left'),plP:el.style.getPropertyPriority('padding-left'),
      pr:el.style.getPropertyValue('padding-right'),prP:el.style.getPropertyPriority('padding-right')
    });
  }
  function restore(el){
    if(!el) return;
    const o=originals.get(el);
    if(o){
      if(o.fontSize)el.style.setProperty('font-size',o.fontSize,o.fontSizeP||'');else el.style.removeProperty('font-size');
      if(o.letter)el.style.setProperty('letter-spacing',o.letter,o.letterP||'');else el.style.removeProperty('letter-spacing');
      if(o.pl)el.style.setProperty('padding-left',o.pl,o.plP||'');else el.style.removeProperty('padding-left');
      if(o.pr)el.style.setProperty('padding-right',o.pr,o.prP||'');else el.style.removeProperty('padding-right');
    }
    delete el.dataset.ezpkHeaderFitLevel;
    delete el.dataset.ezpkHeaderFitOverflow;
  }
  function ownedTargets(h){
    const out=[];
    const alliance=h.querySelector('#allianceSelectorLink');
    if(alliance)out.push({el:alliance,type:'alliance'});
    h.querySelectorAll('#desktopAccount > .account-button').forEach(el=>out.push({el,type:'auth'}));
    const lang=h.querySelector('#langBtn');
    if(lang)out.push({el:lang,type:'language'});
    return out;
  }
  function actionTargets(h){return ownedTargets(h).filter(({el})=>visible(el));}
  function resetTargets(targets){targets.forEach(({el})=>{save(el);restore(el);});}
  function base(el){
    const cs=getComputedStyle(el);
    return {font:parseFloat(cs.fontSize)||11,pl:parseFloat(cs.paddingLeft)||0,pr:parseFloat(cs.paddingRight)||0};
  }
  function applyLevel(targets,index){
    const lv=LEVELS[index];
    targets.forEach(({el})=>{
      const b=base(el);
      const size=Math.max(MIN_FONT,b.font*lv.font);
      el.style.setProperty('font-size',size.toFixed(2)+'px','important');
      if(lv.letter)el.style.setProperty('letter-spacing',lv.letter+'em','important');
      const minPad=5;
      el.style.setProperty('padding-left',Math.max(minPad,b.pl*lv.pad).toFixed(2)+'px','important');
      el.style.setProperty('padding-right',Math.max(minPad,b.pr*lv.pad).toFixed(2)+'px','important');
      el.dataset.ezpkHeaderFitLevel=lv.name;
    });
  }
  function contentFits(target){
    const el=target.el;
    if(!visible(el)) return true;
    const cs=getComputedStyle(el),r=el.getBoundingClientRect();
    const pl=parseFloat(cs.paddingLeft)||0,pr=parseFloat(cs.paddingRight)||0;
    const hasSafetyPadding=Math.min(pl,pr)>=SAFETY-0.25;
    if(target.type==='language'){
      const label=el.querySelector('.desktop-language-label');
      if(!label) return true;
      const lr=label.getBoundingClientRect();
      const inner=r.width-pl-pr;
      const noEllipsis=getComputedStyle(label).textOverflow!=='ellipsis';
      return noEllipsis && hasSafetyPadding && lr.width<=inner+0.75;
    }
    // Horizontal safety is carried by the guaranteed >=5px inline padding.
    return hasSafetyPadding && el.scrollWidth<=el.clientWidth+0.75 && el.scrollHeight<=el.clientHeight+2;
  }
  function boundsFit(h){
    if(!visible(h)) return true;
    const hr=h.getBoundingClientRect();
    if(h.scrollWidth>h.clientWidth+1) return false;
    const top=[h.querySelector('.brand'),h.querySelector('#nav'),h.querySelector('#allianceSelectorLink'),h.querySelector('#desktopAccount'),h.querySelector('.lang')].filter(visible);
    for(const el of top){const r=el.getBoundingClientRect();if(r.left<hr.left-SAFETY||r.right>hr.right+SAFETY)return false;}
    const nav=h.querySelector('#nav'),items=h.querySelector('#desktopNavItems');
    if(visible(nav)&&visible(items)&&items.scrollWidth>items.clientWidth+1)return false;
    return true;
  }
  function restoreMovedNav(h){
    const desktop=h.querySelector('#desktopNavItems');
    const menu=h.querySelector('#navMoreMenu');
    if(!desktop||!menu)return;
    const group=menu.querySelector('[data-v419-overflow-group]');
    const all=[...desktop.querySelectorAll(':scope > a'),...(group?[...group.querySelectorAll('a[data-v419-nav-index]')]:[])];
    all.sort((a,b)=>(+a.dataset.v419NavIndex||0)-(+b.dataset.v419NavIndex||0)).forEach(a=>desktop.appendChild(a));
    group?.remove();
    syncMoreActive(h);
  }
  function assignNavIndices(h){
    h.querySelectorAll('#desktopNavItems > a').forEach((a,i)=>{if(!a.dataset.v419NavIndex)a.dataset.v419NavIndex=String(i+1);});
  }
  function ensureOverflowGroup(h){
    const menu=h.querySelector('#navMoreMenu');
    if(!menu)return null;
    let g=menu.querySelector('[data-v419-overflow-group]');
    if(!g){
      g=document.createElement('section');g.className='nav-menu-group';g.dataset.v419OverflowGroup='';
      g.innerHTML='<div class="nav-menu-group-items"></div>';
      menu.prepend(g);
    }
    return g.querySelector('.nav-menu-group-items');
  }
  function moveLastPrimaryToMore(h){
    const desktop=h.querySelector('#desktopNavItems');
    if(!desktop)return false;
    const links=[...desktop.querySelectorAll(':scope > a:not([hidden])')];
    if(!links.length)return false;
    const target=links[links.length-1],box=ensureOverflowGroup(h);if(!box)return false;
    box.prepend(target);
    const more=h.querySelector('#navMore');if(more)more.hidden=false;
    syncMoreActive(h);
    return true;
  }
  function primaryNavNeedsRoom(h){
    const nav=h.querySelector('#nav'),items=h.querySelector('#desktopNavItems');
    if(!visible(nav)||!visible(items))return false;
    return items.scrollWidth+SAFETY>items.clientWidth || !boundsFit(h);
  }
  function syncMoreActive(h){
    const more=h.querySelector('#navMore'),menu=h.querySelector('#navMoreMenu');
    if(more&&menu)more.classList.toggle('active',Boolean(menu.querySelector('a.active,a[aria-current="page"]')));
  }
  function countExpected(h){
    let n=0;
    if(visible(h.querySelector('#allianceSelectorLink')))n++;
    n+=h.querySelectorAll('#desktopAccount > .account-button').length;
    if(visible(h.querySelector('#langBtn')))n++;
    return n;
  }
  function observeHeader(h){
    if(!window.MutationObserver)return;
    if(!mo)mo=new MutationObserver(records=>{if(records.some(r=>r.type==='childList'||r.attributeName==='hidden'))schedule();});
    mo.disconnect();
    mo.observe(h,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
  }
  function audit(h,targets){
    const unresolved=targets.filter(t=>!contentFits(t)).length + (boundsFit(h)?0:1);
    h.dataset.ezpkHeaderFitExpected=String(countExpected(h));
    h.dataset.ezpkHeaderFitRegistered=String(targets.length);
    h.dataset.ezpkHeaderFitUnresolved=String(unresolved);
    if(unresolved)h.dataset.ezpkHeaderFitOverflow='true';else delete h.dataset.ezpkHeaderFitOverflow;
    targets.forEach(t=>{if(contentFits(t))delete t.el.dataset.ezpkHeaderFitOverflow;else t.el.dataset.ezpkHeaderFitOverflow='true';});
    return {expected:+h.dataset.ezpkHeaderFitExpected,registered:targets.length,unresolved};
  }
  function refresh(){
    if(running)return;
    const h=header();if(!h)return;
    running=true;
    if(mo)mo.disconnect(); // avoid self-mutation reschedule while primary links are moved/restored.
    try{
      resetTargets(ownedTargets(h));
      if(window.innerWidth<=1199){restoreMovedNav(h);delete h.dataset.ezpkHeaderFitOverflow;return;}
      restoreMovedNav(h);assignNavIndices(h);
      let targets=actionTargets(h);

      // Contract order: base translation/layout -> primary nav to More -> compact fit -> final audit.
      for(let pass=0;pass<MAX_PASSES;pass++){
        let moved=false;
        while(primaryNavNeedsRoom(h)){if(!moveLastPrimaryToMore(h))break;moved=true;}
        targets=actionTargets(h);resetTargets(targets);
        let chosen=LEVELS.length-1;
        for(let i=0;i<LEVELS.length;i++){
          resetTargets(targets);applyLevel(targets,i);
          if(targets.every(contentFits)&&boundsFit(h)){chosen=i;break;}
        }
        resetTargets(targets);applyLevel(targets,chosen);
        if(targets.every(contentFits)&&boundsFit(h))break;
        if(!moved&&!moveLastPrimaryToMore(h))break;
      }
      const result=audit(h,targets);
      h.dataset.ezpkHeaderFitPasses=String(MAX_PASSES);
      window.dispatchEvent(new CustomEvent('ezpk-header-fit-complete',{detail:{...result,version:VERSION}}));
    }finally{
      running=false;
      observeHeader(h);
    }
  }
  function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{raf=0;refresh();});}
  function start(){
    const h=header();if(!h)return;
    if(window.ResizeObserver&&!ro){ro=new ResizeObserver(()=>schedule());ro.observe(h);}
    observeHeader(h);
    schedule();
  }

  window.EZPKHeaderFit={refresh,schedule,audit:()=>{const h=header();return h?audit(h,actionTargets(h)):null;},version:VERSION};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.addEventListener('load',schedule,{once:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('orientationchange',schedule,{passive:true});
  window.addEventListener('pageshow',schedule);
  window.addEventListener('ezpk-language-change',schedule);
  window.addEventListener('ezpk-auth-ready',schedule);
  window.addEventListener('ezpk-auth-change',schedule);
  window.addEventListener('ezpk-header-layout-change',schedule);
  if(document.fonts?.ready)document.fonts.ready.then(schedule).catch(()=>{});
})();
