(()=>{
  'use strict';
  const VERSION='422';
  const LEVELS=['normal','compact','tight'];
  let raf=0,ro=null,mo=null,running=false;

  function header(){return document.querySelector('[data-shared-header].site-header:not(.admin-auth-host)');}
  function visible(el){
    if(!el||!el.isConnected||el.hidden)return false;
    const cs=getComputedStyle(el),r=el.getBoundingClientRect();
    return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>2&&r.height>2;
  }
  function primaryLinks(h){return [...h.querySelectorAll('#desktopNavItems > a:not([hidden])')];}
  function actionTargets(h){
    const out=[];
    const alliance=h.querySelector('#allianceSelectorLink');if(visible(alliance))out.push(alliance);
    h.querySelectorAll('#desktopAccount > .account-button').forEach(el=>{if(visible(el))out.push(el)});
    const member=h.querySelector('#desktopAccount .account-member-trigger');if(visible(member))out.push(member);
    const lang=h.querySelector('#langBtn');if(visible(lang))out.push(lang);
    return out;
  }
  function contentFits(el){
    if(!visible(el))return true;
    return el.scrollWidth<=el.clientWidth+1 && el.scrollHeight<=el.clientHeight+2;
  }
  function allPrimaryExposed(h){
    const nav=h.querySelector('#nav'),links=primaryLinks(h);
    if(!visible(nav))return links.length===0;
    const nr=nav.getBoundingClientRect();
    return links.every(a=>{
      if(!visible(a)||!contentFits(a))return false;
      const r=a.getBoundingClientRect();
      return r.left>=nr.left-1 && r.right<=nr.right+1 && r.top>=nr.top-2 && r.bottom<=nr.bottom+2;
    });
  }
  function boundsFit(h){
    if(!visible(h))return true;
    if(h.scrollWidth>h.clientWidth+1)return false;
    const hr=h.getBoundingClientRect();
    const top=[h.querySelector('.brand'),h.querySelector('#nav'),h.querySelector('#allianceSelectorLink'),h.querySelector('#desktopAccount'),h.querySelector('.lang')].filter(visible);
    if(top.some(el=>{const r=el.getBoundingClientRect();return r.left<hr.left-1||r.right>hr.right+1}))return false;
    return allPrimaryExposed(h);
  }
  function applyLevel(h,level){h.dataset.ezpkHeaderFitLevel=level;}
  function audit(h){
    const links=primaryLinks(h),actions=actionTargets(h);
    const primaryExpected=links.length;
    const primaryVisible=links.filter(visible).length;
    const actionOverflow=actions.filter(el=>!contentFits(el)).length;
    const primaryExposed=allPrimaryExposed(h);
    const unresolved=actionOverflow + (primaryVisible===primaryExpected&&primaryExposed&&boundsFit(h)?0:1);
    h.dataset.ezpkHeaderPrimaryExpected=String(primaryExpected);
    h.dataset.ezpkHeaderPrimaryVisible=String(primaryVisible);
    h.dataset.ezpkHeaderFitExpected=String(actions.length);
    h.dataset.ezpkHeaderFitRegistered=String(actions.length);
    h.dataset.ezpkHeaderFitUnresolved=String(unresolved);
    if(unresolved)h.dataset.ezpkHeaderFitOverflow='true';else delete h.dataset.ezpkHeaderFitOverflow;
    return {primaryExpected,primaryVisible,primaryExposed,actionOverflow,unresolved,version:VERSION};
  }
  function refresh(){
    if(running)return;
    const h=header();if(!h)return;
    running=true;
    try{
      if(window.innerWidth<=1199){
        delete h.dataset.ezpkHeaderFitLevel;
        delete h.dataset.ezpkHeaderFitOverflow;
        delete h.dataset.ezpkHeaderPrimaryExpected;
        delete h.dataset.ezpkHeaderPrimaryVisible;
        return;
      }
      let chosen=LEVELS[LEVELS.length-1];
      for(const level of LEVELS){
        applyLevel(h,level);
        // Primary links are never moved to More or removed. Only typography,
        // gaps, and action-control padding change between fit levels.
        if(actionTargets(h).every(contentFits)&&boundsFit(h)){chosen=level;break;}
      }
      applyLevel(h,chosen);
      const result=audit(h);
      window.dispatchEvent(new CustomEvent('ezpk-header-fit-complete',{detail:result}));
    }finally{running=false;}
  }
  function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{raf=0;refresh();});}
  function observe(h){
    if(window.ResizeObserver&&!ro){ro=new ResizeObserver(schedule);ro.observe(h);}
    if(window.MutationObserver&&!mo){
      mo=new MutationObserver(records=>{if(records.some(r=>r.type==='childList'||r.attributeName==='hidden'))schedule();});
      mo.observe(h,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
    }
  }
  function start(){const h=header();if(!h)return;observe(h);schedule();}

  window.EZPKHeaderFit={refresh,schedule,audit:()=>{const h=header();return h?audit(h):null;},version:VERSION};
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
