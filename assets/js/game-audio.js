(()=>{
  'use strict';
  const STORAGE_KEY='ezpk-game-muted-v1';
  let ctx=null, master=null, muted=localStorage.getItem(STORAGE_KEY)==='1';
  const lastPlayed=new Map();
  const presets={
    start:{freq:520,duration:.08,type:'sine',gain:.045,cooldown:80},
    shoot:{freq:620,duration:.04,type:'square',gain:.035,cooldown:24},
    hit:{freq:300,duration:.045,type:'square',gain:.03,cooldown:18},
    destroy:{freq:165,duration:.07,type:'sawtooth',gain:.04,cooldown:30},
    item:{freq:760,duration:.09,type:'sine',gain:.04,cooldown:45},
    damage:{freq:90,duration:.18,type:'sawtooth',gain:.045,cooldown:90},
    success:{freq:880,duration:.14,type:'sine',gain:.045,cooldown:100},
    gameOver:{freq:75,duration:.24,type:'sawtooth',gain:.05,cooldown:160},
    combo:{freq:690,duration:.06,type:'square',gain:.035,cooldown:35},
    custom:{freq:350,duration:.05,type:'square',gain:.035,cooldown:0}
  };
  function ensure(){
    try{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return null;
      if(!ctx||ctx.state==='closed'){
        ctx=new AC();
        master=ctx.createGain();
        master.gain.value=muted?0:1;
        master.connect(ctx.destination);
      }
      return ctx;
    }catch{return null}
  }
  function resume(){const ac=ensure();if(ac&&ac.state!=='running')return ac.resume().catch(()=>{});return Promise.resolve()}
  function play(name='custom',options={}){
    if(muted)return;
    const p={...(presets[name]||presets.custom),...options};
    const now=performance.now(),last=lastPlayed.get(name)||0;
    if(p.cooldown&&now-last<p.cooldown)return;
    lastPlayed.set(name,now);
    const ac=ensure();if(!ac)return;
    const sound=()=>{
      try{
        const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;
        o.type=p.type||'square';o.frequency.setValueAtTime(Math.max(20,p.freq||350),t);
        g.gain.setValueAtTime(Math.max(.001,p.gain||.035),t);
        g.gain.exponentialRampToValueAtTime(.001,t+Math.max(.015,p.duration||.05));
        o.connect(g).connect(master);o.start(t);o.stop(t+Math.max(.015,p.duration||.05));
      }catch{}
    };
    if(ac.state==='running')sound();else ac.resume().then(sound).catch(()=>{});
  }
  function setMuted(value){muted=!!value;localStorage.setItem(STORAGE_KEY,muted?'1':'0');if(master)master.gain.value=muted?0:1;return muted}
  function toggle(){return setMuted(!muted)}
  function isMuted(){return muted}
  ['pointerdown','touchstart','keydown'].forEach(type=>window.addEventListener(type,resume,{passive:true}));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)resume()});
  window.addEventListener('pageshow',resume);
  window.GameAudio={play,resume,setMuted,toggle,isMuted};
})();
