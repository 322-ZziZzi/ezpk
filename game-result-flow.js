(function(){
  'use strict';
  const MOBILE_QUERY='(max-width: 980px)';
  const MOBILE_REVIEW_MS=1800;
  const PC_POPUP_DELAY_MS=420;

  function setOverlay(el,visible){
    if(!el)return;
    if(visible){
      el.hidden=false;
      el.removeAttribute('hidden');
    }else{
      el.hidden=true;
      el.setAttribute('hidden','');
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

    setOverlay(result,false);
    setOverlay(start,false);
    setOverlay(confirmed,false);

    if(typeof options.loadRanking==='function')await options.loadRanking();

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

    if(mobile){
      window.setTimeout(()=>{
        setOverlay(confirmed,true);
        if(shell)shell.scrollIntoView({behavior:'smooth',block:'center'});
      },MOBILE_REVIEW_MS);
    }else{
      window.setTimeout(()=>setOverlay(confirmed,true),PC_POPUP_DELAY_MS);
    }
  }

  window.EZPKGameResultFlow={showRanking};
})();
