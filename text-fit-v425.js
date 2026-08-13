(function(){
  'use strict';
  if(window.EZPKTextFit && window.EZPKTextFit.version==='425') return;

  const LEVELS = {
    tile: [
      {name:'normal', scale:1, letter:0},
      {name:'compact', scale:.92, letter:-.01},
      {name:'tight', scale:.85, letter:-.02}
    ],
    compact: [
      {name:'normal', scale:1, letter:0},
      {name:'compact', scale:.92, letter:-.01},
      {name:'tight', scale:.85, letter:-.025}
    ]
  };
  const MIN_FONT = {tile:12.5, compact:12};
  const SAFE_PX = 2.5;
  const groups = new Map();
  const targetToGroup = new WeakMap();
  const observedRoots = new WeakSet();
  let raf=0;

  const EXCLUDE = [
    '.ranking-list','.ranking-panel','.member-list','.member-grid','.member-card','.assigned-list','.final-lineup',
    '.cw-member-grid','.team-member-grid','.account-grid','.board-list','.search-results','[data-user-content]',
    '[contenteditable="true"]','.rank-name','.team-member-name','.assigned-member','.final-member','.cw-member',
    '.board-title','.account-card','.mobile-account-profile','.game-library'
  ].join(',');

  const SPECS = [
    {root:'.home-quick-grid', items:':scope > a', profile:'tile'},
    {root:'.home-account-actions', items:'button,a', profile:'tile'},
    {root:'#mobileDrawerAccount .mobile-account-actions', items:'button', profile:'tile'},
    {root:'#mobileDrawerItems .nav-menu-group-items', items:'.nav-label', profile:'tile'},
    {root:'.member-login-actions', items:'button,a', profile:'tile'},
    {root:'.member-gate-row', items:'button,a', profile:'tile'},
    {root:'.team-tabs', items:'button', profile:'tile'},
    {root:'.preview-actions', items:'button,a', profile:'tile'},
    {root:'.cw-strategy-tabs', items:'button,[role="tab"]', profile:'tile'},
    {root:'.strategy-tabs', items:'button,[role="tab"]', profile:'tile'},
    {root:'.vote-mobile-tabs', items:'button', profile:'tile'},
    {root:'.gateway-mobile-tabs', items:'button', profile:'tile'},
    {root:'.member-view-switch', items:'button', profile:'tile'},
    {root:'#resultOverlay .result-actions', items:'button,a', profile:'tile'},
    {root:'#postRankingOverlay .post-ranking-card', items:'button,a', profile:'tile'},
    {root:'#startOverlay .overlay-card,#startOverlay .newgame-card', items:'button:not([aria-label="Sound"])', profile:'tile'},
    {root:'.dialog-actions', items:'button,a', profile:'tile'},
    {root:'.confirm-dialog-actions', items:'button,a', profile:'tile'},
    {root:'.team-image-actions', items:'button,a', profile:'tile'},
    {root:'.mobile-layout-overview', items:'.open-fullscreen,.layout-image-view', profile:'tile'},
    {root:'.layout-tools', items:'.find-me,.layout-image-view', profile:'tile'},
    {root:'.request-pagination', items:'button', profile:'tile'},
    {root:'.vote-roster-controls', items:'button', profile:'tile'},
    {root:'.vote-page-shell', items:'.vote-result-button,.vote-more-button', profile:'tile'},
    {root:'.request-form', items:'.request-submit', profile:'tile'},
    {root:'.migration-reply-actions', items:'button', profile:'tile'},
    {root:'.sort-bar', items:'button', profile:'compact'},
    {root:'.protected-toolbar', items:'button,a', profile:'compact'},
    {root:'.bgb-password-row', items:'button', profile:'tile'},
    {root:'.overlay-card', items:'button:not(.ranking-head button):not([aria-label="Sound"])', profile:'tile'},
    {root:'.newgame-card', items:'button:not([aria-label="Sound"])', profile:'tile'}
  ];

  const TRANSLATED_INTERACTIVE = [
    'button[data-t]','a[data-t]','button[data-k]','a[data-k]','button[data-home-k]','a[data-home-k]',
    'button[data-i18n]','a[data-i18n]',
    'button[data-member-login]','a[data-member-signup]','a[data-migration-return-link]',
    'button[data-auth-text]','a[data-auth-text]'
  ].join(',');

  function visibleText(el){
    return String(el.textContent||'').replace(/\s+/g,' ').trim();
  }
  function isHardExcluded(el){
    if(!el || el.matches('select,option,input,textarea')) return true;
    if(el.closest('[data-shared-header]')) return true; // v419: shared PC header has a dedicated fitter.
    if(el.closest(EXCLUDE)) return true;
    const text=visibleText(el);
    if(!text) return true;
    if(text.length<=1 && /^[×+−↻←→▲▼◀▶☰🔊🔇]$/.test(text)) return true;
    return false;
  }
  function isSoftExcluded(el){
    if(!el) return true;
    return getComputedStyle(el).textOverflow==='ellipsis';
  }
  function isExcluded(el,explicit=false){
    return isHardExcluded(el) || (!explicit && isSoftExcluded(el));
  }
  function measurable(el){
    if(!el || !el.isConnected) return false;
    const r=el.getBoundingClientRect();
    const cs=getComputedStyle(el);
    return !el.hidden && cs.display!=='none' && cs.visibility!=='hidden' && r.width>2 && r.height>2;
  }
  function groupKey(root,profile){
    if(!root.__ezpkFitId) root.__ezpkFitId='g'+Math.random().toString(36).slice(2);
    return root.__ezpkFitId+':'+profile;
  }
  function ensureGroup(root,profile){
    const key=groupKey(root,profile);
    if(!groups.has(key)) groups.set(key,{key,root,profile,targets:new Set()});
    if(window.ResizeObserver && !observedRoots.has(root)){
      const ro=new ResizeObserver(()=>schedule(root));
      ro.observe(root); observedRoots.add(root);
    }
    return groups.get(key);
  }
  function register(root, el, profile, explicit=false){
    if(!root || !el || isExcluded(el,explicit)) return;
    if(targetToGroup.has(el)) return;
    if(!el.__ezpkFitOriginal){
      el.__ezpkFitOriginal={
        fontSize:el.style.getPropertyValue('font-size'),
        fontSizePriority:el.style.getPropertyPriority('font-size'),
        letterSpacing:el.style.getPropertyValue('letter-spacing'),
        letterSpacingPriority:el.style.getPropertyPriority('letter-spacing'),
        paddingLeft:el.style.getPropertyValue('padding-left'),
        paddingLeftPriority:el.style.getPropertyPriority('padding-left'),
        paddingRight:el.style.getPropertyValue('padding-right'),
        paddingRightPriority:el.style.getPropertyPriority('padding-right'),
        overflowWrap:el.style.getPropertyValue('overflow-wrap'),
        overflowWrapPriority:el.style.getPropertyPriority('overflow-wrap')
      };
    }
    const g=ensureGroup(root,profile);
    g.targets.add(el); targetToGroup.set(el,g);
    el.dataset.ezpkTextFit=profile;
  }
  function registerKnown(scope=document){
    SPECS.forEach(spec=>{
      scope.querySelectorAll(spec.root).forEach(root=>{
        root.querySelectorAll(spec.items).forEach(el=>register(root,el,spec.profile,true));
      });
    });
    scope.querySelectorAll(TRANSLATED_INTERACTIVE).forEach(el=>{
      if(targetToGroup.has(el)||isExcluded(el,true)) return;
      const root=el.parentElement||el;
      register(root,el,'tile',true);
    });
  }
  function baseSize(el){
    if(!el.__ezpkFitBase){
      const n=parseFloat(getComputedStyle(el).fontSize)||16;
      const cs=getComputedStyle(el);
      el.__ezpkFitBase=n;
      el.__ezpkFitPadding={left:parseFloat(cs.paddingLeft)||0,right:parseFloat(cs.paddingRight)||0};
    }
    return el.__ezpkFitBase;
  }
  function clearTarget(el){
    const o=el.__ezpkFitOriginal||{};
    if(o.fontSize) el.style.setProperty('font-size',o.fontSize,o.fontSizePriority||'');
    else el.style.removeProperty('font-size');
    if(o.letterSpacing) el.style.setProperty('letter-spacing',o.letterSpacing,o.letterSpacingPriority||'');
    else el.style.removeProperty('letter-spacing');
    if(o.paddingLeft) el.style.setProperty('padding-left',o.paddingLeft,o.paddingLeftPriority||''); else el.style.removeProperty('padding-left');
    if(o.paddingRight) el.style.setProperty('padding-right',o.paddingRight,o.paddingRightPriority||''); else el.style.removeProperty('padding-right');
    if(o.overflowWrap) el.style.setProperty('overflow-wrap',o.overflowWrap,o.overflowWrapPriority||''); else el.style.removeProperty('overflow-wrap');
    delete el.dataset.ezpkFitEmergency;
    delete el.dataset.ezpkFitLevel;
    delete el.dataset.ezpkFitOverflow;
    // Re-read the page's intended base typography after layout/breakpoint changes.
    el.__ezpkFitBase=null;
    el.__ezpkFitPadding=null;
  }
  function applyLevel(el, profile, level){
    const spec=LEVELS[profile][level];
    const base=baseSize(el);
    const size=base<=MIN_FONT[profile] ? base : Math.max(MIN_FONT[profile], base*spec.scale);
    el.style.setProperty('font-size',size.toFixed(2)+'px','important');
    if(spec.letter) el.style.setProperty('letter-spacing',spec.letter+'em','important');
    else { const o=el.__ezpkFitOriginal||{}; if(o.letterSpacing) el.style.setProperty('letter-spacing',o.letterSpacing,o.letterSpacingPriority||''); else el.style.removeProperty('letter-spacing'); }
    const pad=el.__ezpkFitPadding||{left:0,right:0};
    const padScale=level===2?.82:(level===1?.92:1);
    if(level>0){
      if(pad.left>6) el.style.setProperty('padding-left',Math.max(6,pad.left*padScale).toFixed(2)+'px','important');
      if(pad.right>6) el.style.setProperty('padding-right',Math.max(6,pad.right*padScale).toFixed(2)+'px','important');
    }
    el.dataset.ezpkFitLevel=spec.name;
  }
  function lineCount(el){
    try{
      const range=document.createRange();
      range.selectNodeContents(el);
      const rects=Array.from(range.getClientRects()).filter(r=>r.width>.5&&r.height>.5);
      if(!rects.length) return 1;
      const rows=[];
      rects.forEach(r=>{ if(!rows.some(y=>Math.abs(y-r.top)<2.5)) rows.push(r.top); });
      return Math.max(1,rows.length);
    }catch(_){ return 1; }
  }
  function fits(el,profile){
    if(!measurable(el)) return true;
    const horizontal=el.scrollWidth<=el.clientWidth+SAFE_PX;
    const vertical=el.scrollHeight<=el.clientHeight+SAFE_PX;
    const lines=lineCount(el);
    if(profile==='compact') return horizontal && vertical && lines<=1;
    return horizontal && vertical && lines<=2;
  }
  function fitGroup(g){
    const targets=Array.from(g.targets).filter(el=>el.isConnected && !isHardExcluded(el));
    if(!targets.length) return;
    targets.forEach(clearTarget);
    const shown=targets.filter(measurable);
    if(!shown.length) return;
    let chosen=LEVELS[g.profile].length-1;
    for(let level=0; level<LEVELS[g.profile].length; level++){
      shown.forEach(el=>applyLevel(el,g.profile,level));
      if(shown.every(el=>fits(el,g.profile))){ chosen=level; break; }
    }
    shown.forEach(el=>applyLevel(el,g.profile,chosen));
    shown.forEach(el=>{
      if(!fits(el,g.profile) && g.profile==='tile'){
        el.style.setProperty('overflow-wrap','anywhere','important');
        el.dataset.ezpkFitEmergency='wrap';
      }else{
        const o=el.__ezpkFitOriginal||{}; if(o.overflowWrap) el.style.setProperty('overflow-wrap',o.overflowWrap,o.overflowWrapPriority||''); else el.style.removeProperty('overflow-wrap');
        delete el.dataset.ezpkFitEmergency;
      }
      if(!fits(el,g.profile)) el.dataset.ezpkFitOverflow='true';
      else delete el.dataset.ezpkFitOverflow;
    });
    g.root.dataset.ezpkFitGroupLevel=LEVELS[g.profile][chosen].name;
  }
  function refresh(container=document){
    registerKnown(container===document?document:container);
    groups.forEach(g=>{
      if(container!==document && !container.contains(g.root) && container!==g.root && !g.root.contains(container)) return;
      fitGroup(g);
    });
    window.dispatchEvent(new CustomEvent('ezpk-text-fit-complete',{detail:{at:Date.now()}}));
  }
  function schedule(container=document){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{raf=0; refresh(container||document);});
  }

  window.EZPKTextFit={refresh,schedule,version:'425'};
  document.addEventListener('DOMContentLoaded',()=>schedule(document),{once:true});
  window.addEventListener('load',()=>schedule(document),{once:true});
  window.addEventListener('resize',()=>schedule(document),{passive:true});
  window.addEventListener('orientationchange',()=>schedule(document),{passive:true});
  window.addEventListener('pageshow',()=>schedule(document));
  window.addEventListener('ezpk-language-change',()=>schedule(document));
  document.addEventListener('click',()=>setTimeout(()=>schedule(document),0),true);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(()=>schedule(document)).catch(()=>{});

  const mo=new MutationObserver(records=>{
    let relevant=false;
    for(const r of records){
      if(r.type==='childList' || ['hidden','class','aria-hidden'].includes(r.attributeName||'')){relevant=true;break;}
    }
    if(relevant) schedule(document);
  });
  function startObserver(){ if(document.body) mo.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class','aria-hidden']}); }
  if(document.body) startObserver(); else document.addEventListener('DOMContentLoaded',startObserver,{once:true});
})();
