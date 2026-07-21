(function(){
  'use strict';
  const shells=[...document.querySelectorAll('#gameShell,[data-game-viewport]')];
  if(!shells.length)return;
  function setup(shell){
    shell.setAttribute('data-game-viewport','');
    const interactiveLock=shell.dataset.viewportLock !== 'false';
    shell.dataset.viewportLock=String(interactiveLock);
    const sync=()=>shell.setAttribute('aria-busy',shell.classList.contains('is-playing')?'true':'false');
    new MutationObserver(sync).observe(shell,{attributes:true,attributeFilter:['class']});
    sync();
  }
  shells.forEach(setup);
  window.EZPKGameViewport={
    setPlaying(value,shell=document.querySelector('#gameShell')){
      if(!shell)return;
      shell.classList.toggle('is-playing',Boolean(value));
    },
    setLock(value,shell=document.querySelector('#gameShell')){
      if(shell)shell.dataset.viewportLock=String(Boolean(value));
    }
  };
})();
