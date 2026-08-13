(()=>{
  'use strict';

  const VERSION='424';
  const LEVELS=['normal','compact','tight'];
  const MIN_VISIBLE_PRIMARY=4;
  const PRIMARY_FONT_FLOOR_PX=14;
  const COLLISION_GAP_PX=10;
  const PROMOTE_MARGIN_PX=24;
  const DEMOTE_MARGIN_PX=8;
  const PRIORITY={
    immigration:110,
    vote:100,
    bgb:95,
    capitalWar:90,
    members:85,
    seasonUpcoming:75,
    tip:65,
    request:55,
    allianceLayout:45,
    game:40,
    accounts:35,
    logo:20
  };
  let raf=0,ro=null,running=false,hardResetPending=false;
  let stablePromotedKeys=new Set();
  const relocations=new Map();

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
  function moreLinks(h){const m=navMoreMenu(h);return m?[...m.querySelectorAll('a[data-nav-key]')]:[];}
  function allNavLinks(h){return [...directPrimaryLinks(h),...moreLinks(h)];}
  function keyOf(a){return String(a?.dataset?.navKey||'');}
  function isLocked(a){return !a||a.dataset.navLocked==='true'||a.classList.contains('is-locked');}
  function isActive(a){return Boolean(a?.matches('.active,[aria-current="page"]'));}
  function forceLayout(h){void h.offsetWidth;}
  function applyLevel(h,level){h.dataset.ezpkHeaderFitLevel=level;}

  function cleanupFitOverflowGroup(h){
    const g=navMoreMenu(h)?.querySelector('[data-ezpk-header-fit-more-group]');
    if(g&&!g.querySelector('a[data-nav-key]'))g.remove();
  }
  function overflowItems(h){
    const menu=navMoreMenu(h);if(!menu)return null;
    let group=menu.querySelector('[data-ezpk-header-fit-more-group]');
    if(!group){
      group=document.createElement('section');
      group.className='nav-menu-group header-fit-more-group';
      group.dataset.ezpkHeaderFitMoreGroup='true';
      group.innerHTML='<div class="nav-menu-group-items header-fit-more-items" data-ezpk-header-fit-more-items></div>';
      menu.prepend(group);
    }
    return group.querySelector('[data-ezpk-header-fit-more-items]');
  }
  function relocate(link,target,kind){
    if(!link||!target||relocations.has(link)||!link.parentNode)return false;
    const placeholder=document.createElement('span');
    placeholder.hidden=true;
    placeholder.dataset.ezpkHeaderFitSlot=keyOf(link)||'item';
    link.parentNode.insertBefore(placeholder,link);
    relocations.set(link,{placeholder,kind});
    link.dataset.ezpkHeaderRelocated=kind;
    target.appendChild(link);
    return true;
  }
  function restoreOne(link){
    const rec=relocations.get(link);if(!rec)return;
    const {placeholder}=rec;
    if(placeholder?.isConnected&&link?.isConnected)placeholder.replaceWith(link);
    else if(placeholder?.isConnected)placeholder.remove();
    if(link?.dataset)delete link.dataset.ezpkHeaderRelocated;
    relocations.delete(link);
  }
  function restoreRelocations(h){
    [...relocations.keys()].reverse().forEach(restoreOne);
    cleanupFitOverflowGroup(h);
    syncMoreVisibility(h);
  }
  function promotedKeys(){
    const out=[];
    for(const [link,rec] of relocations)if(rec.kind==='promote')out.push(keyOf(link));
    return out.filter(Boolean);
  }
  function demotedKeys(){
    const out=[];
    for(const [link,rec] of relocations)if(rec.kind==='demote')out.push(keyOf(link));
    return out.filter(Boolean);
  }

  function syncMoreGroupVisibility(h){
    const menu=navMoreMenu(h);if(!menu)return;
    [...menu.querySelectorAll(':scope > .nav-menu-group')].forEach(group=>{
      group.hidden=!group.querySelector('a[data-nav-key]:not([hidden])');
    });
  }
  function syncMoreVisibility(h){
    const more=navMore(h),menu=navMoreMenu(h);if(!more||!menu)return;
    syncMoreGroupVisibility(h);
    const hasItems=Boolean(menu.querySelector('a[data-nav-key]:not([hidden])'));
    more.hidden=window.innerWidth<=1199||!hasItems;
    more.classList.toggle('active',Boolean(menu.querySelector('a.active,a[aria-current="page"]')));
    if(!hasItems){
      menu.hidden=true;
      navMoreButton(h)?.setAttribute('aria-expanded','false');
    }
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
    const nav=h.querySelector('#nav'),items=navVisualItems(h);if(!visible(nav)||!items.length)return 0;
    const nr=nav.getBoundingClientRect();let count=0;
    for(const el of items){const r=el.getBoundingClientRect();if(r.left<nr.left-1||r.right>nr.right+1)count++;}
    return count;
  }
  function navEdgeMargin(h){
    const nav=h.querySelector('#nav'),items=navVisualItems(h);if(!visible(nav)||!items.length)return Infinity;
    const nr=nav.getBoundingClientRect();
    const left=Math.min(...items.map(el=>el.getBoundingClientRect().left));
    const right=Math.max(...items.map(el=>el.getBoundingClientRect().right));
    return Math.min(left-nr.left,nr.right-right);
  }
  function primaryFontFloor(h){
    const sizes=directPrimaryLinks(h).filter(visible).map(a=>parseFloat(getComputedStyle(a).fontSize)||0);
    const more=navMoreButton(h);if(visible(more))sizes.push(parseFloat(getComputedStyle(more).fontSize)||0);
    return sizes.length?Math.min(...sizes):Infinity;
  }
  function geometry(h){
    return {
      collisions:collisionCount(h),
      outOfBounds:outOfBoundsCount(h),
      navOverflow:navContentOverflow(h),
      edgeMargin:navEdgeMargin(h),
      fontFloor:primaryFontFloor(h)
    };
  }
  function fits(h){
    const g=geometry(h);
    return g.collisions===0&&g.outOfBounds===0&&g.navOverflow===0&&g.fontFloor>=PRIMARY_FONT_FLOOR_PX;
  }

  function activeMoreLink(h){return moreLinks(h).find(a=>!isLocked(a)&&isActive(a))||null;}
  function lowestPriorityDemotion(h,exclude=new Set()){
    return directPrimaryLinks(h)
      .filter(a=>!isActive(a)&&!exclude.has(a))
      .sort((a,b)=>(PRIORITY[keyOf(a)]||0)-(PRIORITY[keyOf(b)]||0))[0]||null;
  }
  function sortPromotedTail(h){
    const c=primaryContainer(h);if(!c)return;
    const promoted=directPrimaryLinks(h).filter(a=>relocations.get(a)?.kind==='promote');
    promoted.sort((a,b)=>(PRIORITY[keyOf(b)]||0)-(PRIORITY[keyOf(a)]||0));
    promoted.forEach(a=>c.appendChild(a));
  }
  function promote(link,h){const ok=relocate(link,primaryContainer(h),'promote');if(ok)sortPromotedTail(h);return ok;}
  function demote(link,h){const items=overflowItems(h);return items?relocate(link,items,'demote'):false;}

  function ensureActivePrimary(h){
    const active=activeMoreLink(h);if(!active)return true;
    if(!promote(active,h))return false;
    syncMoreVisibility(h);forceLayout(h);
    while(!fits(h)&&directPrimaryLinks(h).length>MIN_VISIBLE_PRIMARY){
      const target=lowestPriorityDemotion(h,new Set([active]));
      if(!target||!demote(target,h))break;
      syncMoreVisibility(h);forceLayout(h);
    }
    return fits(h)&&directPrimaryLinks(h).some(isActive);
  }

  function ensureMinimumPrimary(h){
    const eligibleTotal=allNavLinks(h).filter(a=>!isLocked(a)).length;
    const target=Math.min(MIN_VISIBLE_PRIMARY,eligibleTotal);
    while(directPrimaryLinks(h).length<target){
      const preferred=preferredPromotionKeys(h).map(key=>findMoreLink(h,key)).find(Boolean);
      const fallback=moreLinks(h).find(a=>!isLocked(a));
      const candidate=preferred||fallback;
      if(!candidate||!promote(candidate,h))return false;
      syncMoreVisibility(h);forceLayout(h);
      if(!fits(h))return false;
    }
    return fits(h);
  }

  function signedInShape(h){
    const keys=new Set(allNavLinks(h).map(keyOf));
    return keys.has('vote')&&keys.has('bgb')&&keys.has('capitalWar')&&!moreLinks(h).some(a=>isLocked(a)&&keyOf(a)==='vote');
  }
  function preferredPromotionKeys(h){
    return signedInShape(h)?['seasonUpcoming','tip','request']:['game','accounts'];
  }
  function findMoreLink(h,key){return moreLinks(h).find(a=>keyOf(a)===key&&!isLocked(a))||null;}
  function promotionCandidates(h){
    const preferred=preferredPromotionKeys(h);
    const active=activeMoreLink(h);
    const activeKey=keyOf(active);
    const stable=preferred.filter(k=>stablePromotedKeys.has(k));
    const fresh=preferred.filter(k=>!stablePromotedKeys.has(k));
    return [...new Set([activeKey,...stable,...fresh].filter(Boolean))];
  }
  function tryPromoteKey(h,key){
    const link=findMoreLink(h,key);if(!link)return false;
    const wasStable=stablePromotedKeys.has(key);
    const threshold=isActive(link)?0:(wasStable?DEMOTE_MARGIN_PX:PROMOTE_MARGIN_PX);
    if(!promote(link,h))return false;
    syncMoreVisibility(h);forceLayout(h);
    const g=geometry(h);
    if(fits(h)&&g.edgeMargin>=threshold)return true;
    restoreOne(link);syncMoreVisibility(h);forceLayout(h);
    return false;
  }

  function attemptLevel(h,level){
    restoreRelocations(h);
    applyLevel(h,level);
    syncMoreVisibility(h);
    forceLayout(h);
    if(!fits(h))return false;
    if(!ensureActivePrimary(h))return false;
    if(!ensureMinimumPrimary(h))return false;
    return fits(h);
  }

  function audit(h){
    const expected=allNavLinks(h).length;
    const visibleDirect=directPrimaryLinks(h).filter(visible).length;
    const eligibleTotal=allNavLinks(h).filter(a=>!isLocked(a)).length;
    const minRequired=Math.min(MIN_VISIBLE_PRIMARY,eligibleTotal);
    const g=geometry(h);
    const keys=allNavLinks(h).map(keyOf).filter(Boolean);
    const duplicateKeys=keys.length-new Set(keys).size;
    const active=allNavLinks(h).find(isActive)||null;
    const activePrimary=!active||directPrimaryLinks(h).includes(active);
    const moreEmpty=!moreLinks(h).some(a=>!a.hidden);
    const staleSlots=h.querySelectorAll('[data-ezpk-header-fit-slot]').length-relocations.size;
    const unresolved=(visibleDirect<minRequired?1:0)+(g.fontFloor<PRIMARY_FONT_FLOOR_PX?1:0)+g.collisions+g.outOfBounds+g.navOverflow+duplicateKeys+(!activePrimary?1:0)+(staleSlots>0?staleSlots:0);
    h.dataset.ezpkHeaderPrimaryExpected=String(expected);
    h.dataset.ezpkHeaderPrimaryVisible=String(visibleDirect);
    h.dataset.ezpkHeaderPrimaryMinRequired=String(minRequired);
    h.dataset.ezpkHeaderPrimaryPromoted=String(promotedKeys().length);
    h.dataset.ezpkHeaderPrimaryDemoted=String(demotedKeys().length);
    h.dataset.ezpkHeaderPrimaryFontFloor=Number.isFinite(g.fontFloor)?g.fontFloor.toFixed(2):'na';
    h.dataset.ezpkHeaderPrimaryCollision=String(g.collisions);
    h.dataset.ezpkHeaderPrimaryOutOfBounds=String(g.outOfBounds);
    h.dataset.ezpkHeaderPrimaryNavOverflow=String(g.navOverflow);
    h.dataset.ezpkHeaderPrimaryEdgeMargin=Number.isFinite(g.edgeMargin)?g.edgeMargin.toFixed(2):'na';
    h.dataset.ezpkHeaderActivePrimary=activePrimary?'true':'false';
    h.dataset.ezpkHeaderMoreEmpty=moreEmpty?'true':'false';
    h.dataset.ezpkHeaderFitUnresolved=String(unresolved);
    if(unresolved)h.dataset.ezpkHeaderFitOverflow='true';else delete h.dataset.ezpkHeaderFitOverflow;
    return {version:VERSION,expected,visibleDirect,minRequired,promoted:promotedKeys(),demoted:demotedKeys(),duplicateKeys,activePrimary,moreEmpty,staleSlots,...g,unresolved};
  }

  function clearAudit(h){
    delete h.dataset.ezpkHeaderFitLevel;
    delete h.dataset.ezpkHeaderFitOverflow;
    for(const k of ['ezpkHeaderPrimaryExpected','ezpkHeaderPrimaryVisible','ezpkHeaderPrimaryMinRequired','ezpkHeaderPrimaryPromoted','ezpkHeaderPrimaryDemoted','ezpkHeaderPrimaryFontFloor','ezpkHeaderPrimaryCollision','ezpkHeaderPrimaryOutOfBounds','ezpkHeaderPrimaryNavOverflow','ezpkHeaderPrimaryEdgeMargin','ezpkHeaderActivePrimary','ezpkHeaderMoreEmpty','ezpkHeaderFitUnresolved'])delete h.dataset[k];
  }

  function refresh(){
    if(running)return;
    const h=header();if(!h)return;
    running=true;
    try{
      if(window.innerWidth<=1199){
        restoreRelocations(h);
        stablePromotedKeys.clear();
        clearAudit(h);
        syncMoreVisibility(h);
        return;
      }
      if(hardResetPending){stablePromotedKeys.clear();hardResetPending=false;}

      // v424 invariant: every measurement starts from the canonical DOM order.
      // Language/auth rebuilds hard-reset promotion hysteresis; resize keeps the
      // last promoted set so 24px promotion / 8px demotion thresholds do not flap.
      restoreRelocations(h);

      let chosen=null;
      for(const level of LEVELS){
        if(attemptLevel(h,level)){chosen=level;break;}
      }
      if(!chosen){
        restoreRelocations(h);
        applyLevel(h,'tight');
        syncMoreVisibility(h);forceLayout(h);
        ensureActivePrimary(h);
        chosen='tight';
      }

      // Keep 15px typography whenever Normal fits; do not compact merely to expose
      // more links. Extra Primary items are promoted only into genuinely spare PC
      // space between the brand and right-side action cluster.
      for(const key of promotionCandidates(h))tryPromoteKey(h,key);

      syncMoreVisibility(h);forceLayout(h);
      const result=audit(h);
      stablePromotedKeys=new Set(promotedKeys());
      window.dispatchEvent(new CustomEvent('ezpk-header-fit-complete',{detail:result}));
    }finally{running=false;}
  }

  function schedule(hard=false){
    if(hard)hardResetPending=true;
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{raf=0;refresh();});
  }
  function refreshNow(hard=false){if(hard)hardResetPending=true;refresh();}
  function observe(h){if(window.ResizeObserver&&!ro){ro=new ResizeObserver(()=>schedule(false));ro.observe(h);}}
  function start(){const h=header();if(!h)return;observe(h);schedule(true);}

  window.EZPKHeaderFit={refresh:()=>refreshNow(false),schedule:()=>schedule(false),audit:()=>{const h=header();return h?audit(h):null;},version:VERSION,MIN_VISIBLE_PRIMARY,PRIMARY_FONT_FLOOR_PX,PROMOTE_MARGIN_PX,DEMOTE_MARGIN_PX};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.addEventListener('load',()=>schedule(true),{once:true});
  window.addEventListener('resize',()=>schedule(false),{passive:true});
  window.addEventListener('orientationchange',()=>schedule(false),{passive:true});
  window.addEventListener('pageshow',()=>schedule(true));
  window.addEventListener('ezpk-language-change',()=>refreshNow(true));
  window.addEventListener('ezpk-auth-ready',()=>refreshNow(true));
  window.addEventListener('ezpk-auth-change',()=>refreshNow(true));
  window.addEventListener('ezpk-header-layout-change',()=>refreshNow(true));
  if(document.fonts?.ready)document.fonts.ready.then(()=>schedule(true)).catch(()=>{});
})();
