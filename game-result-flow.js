(function(){
  'use strict';
  const MOBILE_QUERY='(max-width: 980px)';
  const MOBILE_REVIEW_MS=1800;
  const PC_POPUP_DELAY_MS=420;
  let pendingTimer=0;

  function setOverlay(el,visible){
    if(!el)return;
    window.clearTimeout(pendingTimer);
    if(visible){
      el.hidden=false;
      el.removeAttribute('hidden');
      /* Game scripts hide overlays with inline display:none/pointer-events:none. */
      el.style.removeProperty('display');
      el.style.removeProperty('pointer-events');
      el.setAttribute('aria-hidden','false');
    }else{
      el.hidden=true;
      el.setAttribute('hidden','');
      el.style.display='none';
      el.style.pointerEvents='none';
      el.setAttribute('aria-hidden','true');
    }
  }

  function isInViewport(el){
    if(!el)return false;
    const r=el.getBoundingClientRect();
    return r.top>=0&&r.bottom<=window.innerHeight;
  }

  function currentPlayerRow(nickname){
    const key=String(nickname||'').trim().toLowerCase();
    if(!key)return null;
    return [...document.querySelectorAll('.ranking-row')]
      .find(row=>String(row.dataset.playerKey||'').trim().toLowerCase()===key)||null;
  }

  async function showRanking(options={}){
    const panel=options.panel||document.querySelector('#ranking');
    const shell=options.shell||document.querySelector('#gameShell');
    const result=document.querySelector('#resultOverlay');
    const start=document.querySelector('#startOverlay');
    const confirmed=document.querySelector('#postRankingOverlay');
    const mobile=window.matchMedia(MOBILE_QUERY).matches;

    window.clearTimeout(pendingTimer);
    setOverlay(result,false);
    setOverlay(start,false);
    setOverlay(confirmed,false);

    try{
      if(typeof options.loadRanking==='function')await options.loadRanking();
    }catch(error){
      console.error('[EZPK ranking view] ranking refresh failed:',error);
      /* The replay flow must still continue even if remote ranking refresh fails. */
    }

    const row=currentPlayerRow(options.nickname);
    if(panel){
      panel.classList.remove('ranking-focus');
      void panel.offsetWidth;
      panel.classList.add('ranking-focus');
    }
    if(row)row.classList.add('current-player');

    const rankingTarget=row||panel;
    if(rankingTarget){
      if(mobile){
        rankingTarget.scrollIntoView({behavior:'smooth',block:row?'center':'start'});
      }else if(!isInViewport(panel)){
        panel.scrollIntoView({behavior:'smooth',block:'center'});
      }
    }

    window.setTimeout(()=>panel&&panel.classList.remove('ranking-focus'),1500);
    window.setTimeout(()=>row&&row.classList.remove('current-player'),3000);

    pendingTimer=window.setTimeout(()=>{
      setOverlay(confirmed,true);
      if(mobile&&shell)shell.scrollIntoView({behavior:'smooth',block:'center'});
    },mobile?MOBILE_REVIEW_MS:PC_POPUP_DELAY_MS);
  }

  window.EZPKGameResultFlow={showRanking};
})();
