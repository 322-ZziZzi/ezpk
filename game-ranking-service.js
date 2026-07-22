(function(){
  'use strict';

  const GAME_ID_MAP={
    'survival':'survival',
    'drone-hunter':'drone_hunter',
    'drone_hunter':'drone_hunter',
    'tank-battle':'tank_battle',
    'tank_battle':'tank_battle',
    'missile-defense':'missile_defense',
    'missile_defense':'missile_defense',
    'treasure-hunter':'treasure_hunter',
    'treasure_hunter':'treasure_hunter',
    'zombie-defense':'zombie_defense',
    'zombie_defense':'zombie_defense',
    'portal-escape':'portal_escape',
    'portal_escape':'portal_escape',
    'hero-merge':'hero_merge',
    'hero_merge':'hero_merge'
  };

  const cfg=()=>window.EZPK_SUPABASE_CONFIG||{};
  const key=()=>String(cfg().publishableKey||cfg().anonKey||'').trim();
  const configured=()=>{
    const c=cfg(),k=key();
    return Boolean(c.url&&k&&!String(c.url).includes('YOUR_')&&!k.includes('PASTE_'));
  };
  const headers=(extra={})=>{
    const k=key();
    return {apikey:k,Authorization:`Bearer ${k}`,'Content-Type':'application/json',...extra};
  };
  const monthKey=()=>{
    const d=new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  };
  const monthStartISO=()=>{
    const d=new Date();
    return new Date(d.getFullYear(),d.getMonth(),1).toISOString();
  };
  const nextMonthISO=()=>{
    const d=new Date();
    return new Date(d.getFullYear(),d.getMonth()+1,1).toISOString();
  };
  const normalizeGameId=value=>{
    const raw=String(value||'').trim().toLowerCase();
    return GAME_ID_MAP[raw]||raw.replace(/-/g,'_');
  };
  const legacyGameId=value=>normalizeGameId(value).replace(/_/g,'-');
  const normalizeScore=value=>Math.max(0,Math.min(3600000,Math.round(Number(value)||0)));
  const bestRows=(rows,limit=30)=>{
    const map=new Map();
    for(const row of rows||[]){
      const nickname=String(row?.nickname||'').trim();
      if(!nickname)continue;
      const id=nickname.toLowerCase();
      if(!map.has(id)||Number(row.score)>Number(map.get(id).score))map.set(id,row);
    }
    return [...map.values()]
      .sort((a,b)=>Number(b.score)-Number(a.score)||new Date(a.created_at)-new Date(b.created_at))
      .slice(0,limit);
  };

  function create(options={}){
    const requestedGameId=String(options.gameId||'').trim();
    const gameId=normalizeGameId(requestedGameId);
    const compatibleIds=[...new Set([gameId,legacyGameId(gameId)])];
    const localKey=()=>`${options.localPrefix||`ezpk-ranking-${requestedGameId||gameId}-`}${monthKey()}`;
    const localRows=()=>{
      try{return JSON.parse(localStorage.getItem(localKey())||'[]')}
      catch{return[]}
    };
    const saveLocal=(nickname,score)=>{
      const rows=localRows();
      rows.push({nickname:String(nickname||'').trim(),score:normalizeScore(score),created_at:new Date().toISOString(),game_id:gameId});
      localStorage.setItem(localKey(),JSON.stringify(rows.slice(-300)));
    };

    async function submit(nickname,score){
      const cleanNickname=String(nickname||'').trim().slice(0,16);
      const cleanScore=normalizeScore(score);
      if(!cleanNickname)return {remote:false,error:new Error('Nickname is empty')};

      saveLocal(cleanNickname,cleanScore);
      if(!configured())return {remote:false,local:true,error:new Error('Supabase is not configured')};

      try{
        const c=cfg();
        const response=await fetch(`${String(c.url).replace(/\/$/,'')}/rest/v1/game_scores`,{
          method:'POST',
          headers:headers({Prefer:'return=representation'}),
          body:JSON.stringify({nickname:cleanNickname,score:cleanScore,game_id:gameId})
        });
        const text=await response.text();
        if(!response.ok)throw new Error(`HTTP ${response.status}: ${text||response.statusText}`);
        return {remote:true,local:true,row:text?JSON.parse(text)[0]||null:null,gameId};
      }catch(error){
        console.error(`[${gameId}] Supabase score submit failed`,error);
        return {remote:false,local:true,error,gameId};
      }
    }

    async function load(){
      let rows=[],remote=false,error=null;
      if(configured()){
        try{
          const c=cfg();
          const params=new URLSearchParams();
          params.set('select','nickname,score,created_at,game_id');
          params.set('game_id',`in.(${compatibleIds.join(',')})`);
          params.set('created_at',`gte.${monthStartISO()}`);
          params.append('created_at',`lt.${nextMonthISO()}`);
          params.set('order','score.desc,created_at.asc');
          params.set('limit','300');
          const response=await fetch(`${String(c.url).replace(/\/$/,'')}/rest/v1/game_scores?${params.toString()}`,{headers:headers()});
          const text=await response.text();
          if(!response.ok)throw new Error(`HTTP ${response.status}: ${text||response.statusText}`);
          rows=text?JSON.parse(text):[];
          remote=true;
        }catch(e){
          error=e;
          console.error(`[${gameId}] Supabase ranking load failed`,e);
        }
      }
      if(!remote)rows=localRows();
      return {rows:bestRows(rows),remote,error,monthKey:monthKey(),gameId,compatibleIds};
    }

    return {requestedGameId,gameId,compatibleIds,configured,headers,monthKey,monthStartISO,nextMonthISO,localRows,saveLocal,bestRows,submit,load};
  }

  window.EZPKGameRanking={create,configured,headers,monthKey,monthStartISO,nextMonthISO,bestRows,normalizeGameId};
})();
