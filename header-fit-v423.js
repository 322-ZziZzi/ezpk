(()=>{
  'use strict';

  const VERSION='423';
  const LEVELS=['normal','compact','tight'];
  const MIN_VISIBLE_PRIMARY=4;
  const PRIMARY_FONT_FLOOR_PX=13;
  const COLLISION_GAP_PX=8;
  let raf=0,ro=null,running=false;

  function header(){return document.querySelector('[data-shared-header].site-header:not(.admin-auth-host)');}
  function visible(el){
    if(!el||!el.isConnected||el.hidden)return false;
    const cs=getComputedStyle(el),r=el.getBoundingClientRect();
    return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0&&r.width>2&&r.height>2;
  }
  function primaryContainer(h){return h.querySelector('#desktopNavItems');}
  function navMore(h){return h.querySelector('#navMore');}
  function navMoreMenu(h){return h.querySelector('#navMoreMenu');}
  function navMoreButton(h){return h.querySelector('#navMoreButton');}
  function directPrimaryLinks(h){const c=primaryContainer(h);return c?[...c.querySelectorAll(':scope > a[data-nav-key]')]:[];}
  function movedPrimaryLinks(h){return [...h.querySelectorAll('[data-ezpk-header-fit-more-items] > a[data-ezpk-header-primary-moved="true"]')];}
  function allPrimaryLinks(h){return [...directPrimaryLinks(h),...movedPrimaryLinks(h)].sort((a,b)=>(Number(a.dataset.ezpkHeaderPrimaryOrder)||0)-(Number(b.dataset.ezpkHeaderPrimaryOrder)||0));}

  function assignPrimaryOrder(h){
    const links=directPrimaryLinks(h);
    links.forEach((a,i)=>{if(!a.hasAttribute('data-ezpk-header-primary-order'))a.dataset.ezpkHeaderPrimaryOrder=String(i);});
  }
  function overflowGroup(h,create=false){
    const menu=navMoreMenu(h);if(!menu)return null;
    let group=menu.querySelector('[data-ezpk-header-fit-more-group]');
    if(!group&&create){
      group=document.createElement('section');
      group.className='nav-menu-group header-fit-more-group';
      group.dataset.ezpkHeaderFitMoreGroup='true';
      group.innerHTML='<div class="nav-menu-group-items header-fit-more-items" data-ezpk-header-fit-more-items></div>';
      menu.prepend(group);
    }
    return group;
  }
  function restorePrimary(h){
    const c=primaryContainer(h);if(!c)return;
    const moved=movedPrimaryLinks(h);
    if(moved.length){
      moved.sort((a,b)=>(Number(a.dataset.ezpkHeaderPrimaryOrder)||0)-(Number(b.dataset.ezpkHeaderPrimaryOrder)||0));
      moved.forEach(a=>{delete a.dataset.ezpkHeaderPrimaryMoved;c.appendChild(a);});
    }
    const group=overflowGroup(h,false);
    if(group)group.remove();
    syncMoreActive(h);
  }
  function ensureOrdersAfterRestore(h){
    directPrimaryLinks(h).forEach((a,i)=>a.dataset.ezpkHeaderPrimaryOrder=String(i));
  }
  function syncMoreActive(h){
    const more=navMore(h),menu=navMoreMenu(h);if(!more||!menu)return;
    more.classList.toggle('active',Boolean(menu.querySelector('a.active,a[aria-current="page"]')));
  }
  function moveLastPrimaryToMore(h){
    const links=directPrimaryLinks(h);
    const minRequired=Math.min(MIN_VISIBLE_PRIMARY,links.length);
    if(links.length<=minRequired)return false;
    const target=links[links.length-1];
    const group=overflowGroup(h,true),items=group?.querySelector('[data-ezpk-header-fit-more-items]');
    if(!items)return false;
    target.dataset.ezpkHeaderPrimaryMoved='true';
    items.prepend(target);
    syncMoreActive(h);
    return true;
  }

  function actionContainers(h){
    return [h.querySelector('#allianceSelectorLink'),h.querySelector('#desktopAccount'),h.querySelector('.lang')].filter(visible);
  }
  function navVisualItems(h){
    const items=directPrimaryLinks(h).filter(visible);
    const more=navMore(h);if(visible(more))items.push(more);
    return items;
  }
  function horizontalConflict(a,b,gap=COLLISION_GAP_PX){
    if(!visible(a)||!visible(b))return false;
    const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
    const vertical=ar.bottom>br.top+1&&br.bottom>ar.top+1;
    if(!vertical)return false;
    return !(ar.right+gap<=br.left||br.right+gap<=ar.left);
  }
  function collisionCount(h){
    let count=0;
    for(const n of navVisualItems(h))for(const a of actionContainers(h))if(horizontalConflict(n,a))count++;
    return count;
  }
  function outOfBoundsCount(h){
    const hr=h.getBoundingClientRect();let count=0;
    const targets=[h.querySelector('.brand'),h.querySelector('#nav'),...actionContainers(h)].filter(visible);
    for(const el of targets){const r=el.getBoundingClientRect();if(r.left<hr.left-1||r.right>hr.right+1)count++;}
    return count;
  }
  function navContentOverflow(h){
    const nav=h.querySelector('#nav'),items=navVisualItems(h);if(!visible(nav))return 0;
    const nr=nav.getBoundingClientRect();
    let count=0;
    for(const el of items){const r=el.getBoundingClientRect();if(r.left<nr.left-1||r.right>nr.right+1)count++;}
    return count;
  }
  function primaryFontFloor(h){
    const links=directPrimaryLinks(h).filter(visible);
    const more=navMoreButton(h);const sizes=links.map(a=>parseFloat(getComputedStyle(a).fontSize)||0);
    if(visible(more))sizes.push(parseFloat(getComputedStyle(more).fontSize)||0);
    return sizes.length?Math.min(...sizes):Infinity;
  }
  function geometry(h){
    return {
      collisions:collisionCount(h),
      outOfBounds:outOfBoundsCount(h),
      navOverflow:navContentOverflow(h),
      fontFloor:primaryFontFloor(h)
    };
  }
  function fits(h){
    const g=geometry(h);
    return g.collisions===0&&g.outOfBounds===0&&g.navOverflow===0&&g.fontFloor>=PRIMARY_FONT_FLOOR_PX;
  }
  function applyLevel(h,level){h.dataset.ezpkHeaderFitLevel=level;}
  function forceLayout(h){void h.offsetWidth;}

  function audit(h){
    const expected=allPrimaryLinks(h).length;
    const visibleDirect=directPrimaryLinks(h).filter(visible).length;
    const minRequired=Math.min(MIN_VISIBLE_PRIMARY,expected);
    const moved=movedPrimaryLinks(h).length;
    const g=geometry(h);
    const duplicateKeys=(()=>{
      const keys=allPrimaryLinks(h).map(a=>a.dataset.navKey).filter(Boolean);return keys.length-new Set(keys).size;
    })();
    const unresolved=(visibleDirect<minRequired?1:0)+(g.fontFloor<PRIMARY_FONT_FLOOR_PX?1:0)+g.collisions+g.outOfBounds+g.navOverflow+duplicateKeys;
    h.dataset.ezpkHeaderPrimaryExpected=String(expected);
    h.dataset.ezpkHeaderPrimaryVisible=String(visibleDirect);
    h.dataset.ezpkHeaderPrimaryMinRequired=String(minRequired);
    h.dataset.ezpkHeaderPrimaryMoved=String(moved);
    h.dataset.ezpkHeaderPrimaryFontFloor=Number.isFinite(g.fontFloor)?g.fontFloor.toFixed(2):'na';
    h.dataset.ezpkHeaderPrimaryCollision=String(g.collisions);
    h.dataset.ezpkHeaderPrimaryOutOfBounds=String(g.outOfBounds);
    h.dataset.ezpkHeaderPrimaryNavOverflow=String(g.navOverflow);
    h.dataset.ezpkHeaderFitUnresolved=String(unresolved);
    if(unresolved)h.dataset.ezpkHeaderFitOverflow='true';else delete h.dataset.ezpkHeaderFitOverflow;
    return {version:VERSION,expected,visibleDirect,minRequired,moved,duplicateKeys,...g,unresolved};
  }

  function refresh(){
    if(running)return;
    const h=header();if(!h)return;
    running=true;
    try{
      if(window.innerWidth<=1199){
        restorePrimary(h);
        delete h.dataset.ezpkHeaderFitLevel;
        delete h.dataset.ezpkHeaderFitOverflow;
        for(const k of ['ezpkHeaderPrimaryExpected','ezpkHeaderPrimaryVisible','ezpkHeaderPrimaryMinRequired','ezpkHeaderPrimaryMoved','ezpkHeaderPrimaryFontFloor','ezpkHeaderPrimaryCollision','ezpkHeaderPrimaryOutOfBounds','ezpkHeaderPrimaryNavOverflow','ezpkHeaderFitUnresolved'])delete h.dataset[k];
        return;
      }

      // Every pass begins from the full, uncompressed Primary Navigation.
      // This prevents Compact/Tight state from surviving a resize or language change.
      restorePrimary(h);
      ensureOrdersAfterRestore(h);
      applyLevel(h,'normal');
      forceLayout(h);

      let chosen='normal';
      if(!fits(h)){
        applyLevel(h,'compact');
        forceLayout(h);
        chosen='compact';
      }
      if(!fits(h)){
        applyLevel(h,'tight');
        forceLayout(h);
        chosen='tight';
      }

      // Only after action padding/gaps have compacted may lower-priority trailing
      // Primary items move into More, and never below four visible Primary items.
      while(!fits(h)&&directPrimaryLinks(h).length>MIN_VISIBLE_PRIMARY){
        if(!moveLastPrimaryToMore(h))break;
        forceLayout(h);
      }

      applyLevel(h,chosen);
      const result=audit(h);
      window.dispatchEvent(new CustomEvent('ezpk-header-fit-complete',{detail:result}));
    }finally{running=false;}
  }
  function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{raf=0;refresh();});}
  function observe(h){if(window.ResizeObserver&&!ro){ro=new ResizeObserver(schedule);ro.observe(h);}}
  function start(){const h=header();if(!h)return;observe(h);schedule();}

  window.EZPKHeaderFit={refresh,schedule,audit:()=>{const h=header();return h?audit(h):null;},version:VERSION,MIN_VISIBLE_PRIMARY,PRIMARY_FONT_FLOOR_PX};
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
