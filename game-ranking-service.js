(function(){
  'use strict';
  const cfg=()=>window.EZPK_SUPABASE_CONFIG||{};
  // v165: Supabase publishableKey is the primary browser credential.
  // anonKey remains only as a backward-compatible fallback for older deployments.
  const key=()=>{const c=cfg();return String(c.publishableKey||c.anonKey||'').trim()};
  const credentialMode=()=>{const c=cfg();return c.publishableKey?'publishableKey':(c.anonKey?'anonKey':'none')};
  const configured=()=>{const c=cfg(),k=key();return !!(c.url&&k&&!String(c.url).includes('YOUR_')&&!String(k).includes('PASTE_'))};
  const headers=(extra={})=>{const k=key();return {apikey:k,Authorization:`Bearer ${k}`,'Content-Type':'application/json',...extra}};
  const monthKey=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`};
  const monthStartISO=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),1).toISOString()};
  const nextMonthISO=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth()+1,1).toISOString()};
  const bestRows=(rows,limit=30)=>{const map=new Map();for(const row of rows||[]){const nickname=String(row?.nickname||'').trim();if(!nickname)continue;const k=nickname.toLowerCase();if(!map.has(k)||Number(row.score)>Number(map.get(k).score))map.set(k,row)}return [...map.values()].sort((a,b)=>Number(b.score)-Number(a.score)||new Date(a.created_at)-new Date(b.created_at)).slice(0,limit)};
  function create(options={}){
    const gameId=String(options.gameId||'').trim();
    const localKey=()=>`${options.localPrefix||`ezpk-ranking-${gameId}-`}${monthKey()}`;
    const localRows=()=>{try{return JSON.parse(localStorage.getItem(localKey())||'[]')}catch{return[]}};
    const saveLocal=(nickname,score)=>{const rows=localRows();rows.push({nickname,score:Number(score)||0,created_at:new Date().toISOString()});localStorage.setItem(localKey(),JSON.stringify(rows.slice(-300)))};
    async function submit(nickname,score){
      saveLocal(nickname,score);
      if(!configured())return {remote:false};
      try{
        const c=cfg();
        const r=await fetch(`${c.url}/rest/v1/game_scores`,{method:'POST',headers:headers({Prefer:'return=minimal'}),body:JSON.stringify({nickname,score:Number(score)||0,game_id:gameId})});
        if(!r.ok)throw new Error(await r.text());
        return {remote:true};
      }catch(error){console.warn(`[${gameId}] Remote score submit failed`,error);return {remote:false,error}}
    }
    async function load(){
      let rows=[],remote=false,error=null;
      if(configured())try{
        const c=cfg();
        const q=`select=nickname,score,created_at&game_id=eq.${encodeURIComponent(gameId)}&created_at=gte.${encodeURIComponent(monthStartISO())}&created_at=lt.${encodeURIComponent(nextMonthISO())}&order=score.desc&limit=300`;
        const r=await fetch(`${c.url}/rest/v1/game_scores?${q}`,{headers:headers()});
        if(!r.ok)throw new Error(await r.text());
        rows=await r.json();remote=true;
      }catch(e){error=e;console.warn(`[${gameId}] Remote ranking load failed`,e)}
      if(!remote)rows=localRows();
      return {rows:bestRows(rows),remote,error,monthKey:monthKey()};
    }
    return {gameId,configured,credentialMode,headers,monthKey,monthStartISO,nextMonthISO,localRows,saveLocal,bestRows,submit,load};
  }
  window.EZPKGameRanking={create,configured,credentialMode,headers,monthKey,monthStartISO,nextMonthISO,bestRows};
})();
