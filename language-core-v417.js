(function(){
  'use strict';
  if(window.EZPKLanguage && Number(window.EZPKLanguage.version||0)>=417) return;
  const LEGACY='ezpk-lang-v5', USER='ezpk-lang-user-v6', AUTO='ezpk-lang-auto-v6', COOKIE='ezpk_lang';
  const SUPPORTED=Object.freeze(['en','fr','de','ko','th','ja','pt','es','tr','zh-tw','it','ar','vi','id']);
  function normalize(value){
    const raw=String(value||'').trim().toLowerCase().replaceAll('_','-');
    if(!raw)return'';
    if(raw==='zh-tw'||raw==='zh-hk'||raw==='zh-mo'||raw.startsWith('zh-hant'))return'zh-tw';
    if(raw==='zh'||raw==='zh-cn'||raw.startsWith('zh-hans'))return'';
    if(SUPPORTED.includes(raw))return raw;
    const base=raw.split('-')[0];return SUPPORTED.includes(base)?base:'';
  }
  function readCookie(){try{const hit=document.cookie.split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE+'='));return hit?normalize(decodeURIComponent(hit.slice(COOKIE.length+1))):''}catch(_){return''}}
  function writeCookie(lang,maxAge=31536000){
    const code=normalize(lang),host=String(location.hostname||'').toLowerCase();
    const pub=host==='ezpk322.com'||host==='ezpk1.ezpk322.com'||host==='ezpk2.ezpk322.com';
    const parts=[`${COOKIE}=${encodeURIComponent(code)}`,'Path=/','SameSite=Lax',`Max-Age=${maxAge}`];if(pub)parts.push('Domain=.ezpk322.com','Secure');try{document.cookie=parts.join('; ')}catch(_){};
  }
  function browser(){const c=[];try{if(Array.isArray(navigator.languages))c.push(...navigator.languages)}catch(_){}try{if(navigator.language)c.push(navigator.language)}catch(_){}for(const x of c){const n=normalize(x);if(n)return n}return'en'}
  function explicit(){
    try{const u=normalize(localStorage.getItem(USER));if(u)return u}catch(_){}
    const c=readCookie();if(c){try{localStorage.setItem(USER,c)}catch(_){}return c}
    try{const l=normalize(localStorage.getItem(LEGACY)),a=normalize(localStorage.getItem(AUTO));if(l&&l!==a){localStorage.setItem(USER,l);writeCookie(l);return l}}catch(_){}
    return'';
  }
  function get(){return explicit()||browser()||'en'}
  function persist(code,explicitChoice){
    code=normalize(code)||'en';
    try{localStorage.setItem(LEGACY,code);if(explicitChoice){localStorage.setItem(USER,code);localStorage.removeItem(AUTO)}else if(!explicit())localStorage.setItem(AUTO,code)}catch(_){}
    if(explicitChoice)writeCookie(code);return code;
  }
  function emit(code,source){window.dispatchEvent(new CustomEvent('ezpk-language-change',{detail:{lang:code,source:source||'language-core'}}))}
  function set(lang,options={}){const code=persist(lang,options.explicit!==false);if(options.emit!==false)emit(code,options.source||'language-core');return code}
  function reconcile(options={}){const code=get();try{if(normalize(localStorage.getItem(LEGACY))!==code)localStorage.setItem(LEGACY,code)}catch(_){}if(options.emit)emit(code,options.source||'language-core-reconcile');return code}
  function clearPreference(options={}){try{localStorage.removeItem(USER);localStorage.removeItem(LEGACY);localStorage.removeItem(AUTO)}catch(_){}writeCookie('',0);const code=persist(browser(),false);if(options.emit!==false)emit(code,options.source||'language-core');return code}
  window.addEventListener('storage',e=>{
    if(![USER,LEGACY,AUTO].includes(e.key))return;
    if(e.key===LEGACY){let u='';try{u=normalize(localStorage.getItem(USER))}catch(_){}if(u){try{localStorage.setItem(LEGACY,u)}catch(_){}emit(u,'language-core-storage');return}}
    const code=reconcile();writeCookie(code);emit(code,'language-core-storage');
  });
  window.EZPKLanguage={version:417,key:LEGACY,userKey:USER,autoKey:AUTO,cookieKey:COOKIE,supported:SUPPORTED,normalize,get,set,reconcile,clearPreference,detectBrowser:browser};
  reconcile({emit:false});
})();
