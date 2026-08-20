import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

function arg(name, fallback=null){
  const i=process.argv.indexOf(`--${name}`);
  return i>=0 && i+1<process.argv.length ? process.argv[i+1] : fallback;
}
const backup=arg('backup');
const auditPath=arg('eagle-audit');
const outDir=arg('out', path.join(process.cwd(),'operations','member_restore_generated'));
if(!backup) throw new Error('Missing --backup <path>');
if(!auditPath) throw new Error('Missing --eagle-audit <path>');
if(!fs.existsSync(backup)) throw new Error(`Backup not found: ${backup}`);
if(!fs.existsSync(auditPath)) throw new Error(`EAGLE audit not found: ${auditPath}`);
fs.mkdirSync(outDir,{recursive:true});

const SOURCE_NAMES = new Map([[64,'Batman'],[99,'Zeusgoeswild']]);
const FINAL_NAMES = new Map([[64,'Batman'],[99,'EAGLE']]);
const TARGET_IDS = [64,99];
const SKIP_TABLES = new Set(['sessions']);

function qident(s){ return `"${String(s).replace(/"/g,'""')}"`; }
function sqlLiteral(v){
  if(v === null || v === undefined) return 'NULL';
  if(typeof v === 'bigint') return v.toString();
  if(typeof v === 'number') { if(!Number.isFinite(v)) throw new Error(`Non-finite numeric value: ${v}`); return String(v); }
  if(typeof v === 'boolean') return v ? '1' : '0';
  if(v instanceof Uint8Array || Buffer.isBuffer(v)) return `X'${Buffer.from(v).toString('hex')}'`;
  return `'${String(v).replace(/'/g,"''")}'`;
}
function objectKey(obj, cols){ return cols.map(c=>`${c}=${typeof obj[c]==='bigint'?obj[c].toString():String(obj[c])}`).join('|'); }
function parseMaybeJson(v,label){
  if(v && typeof v==='object') return v;
  try { return JSON.parse(String(v||'')); } catch { throw new Error(`Invalid ${label} JSON in EAGLE audit.`); }
}
function kstDateFromSql(ts){
  const s=String(ts||'').trim();
  if(!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s)) throw new Error(`Unexpected SQL timestamp: ${s}`);
  const d=new Date(s.replace(' ','T')+'Z');
  d.setUTCHours(d.getUTCHours()+9);
  return d.toISOString().slice(0,10);
}
function addDays(dateStr,days){ const d=new Date(dateStr+'T00:00:00Z'); d.setUTCDate(d.getUTCDate()+days); return d.toISOString().slice(0,10); }

const auditRaw=fs.readFileSync(auditPath,'utf8').replace(/^\uFEFF/,'');
const audit=JSON.parse(auditRaw);
if(String(audit.action)!=='member_update' || Number(audit.target_id)!==99 || String(audit.target_name).toLowerCase()!=='eagle') throw new Error('EAGLE audit identity mismatch.');
const before=parseMaybeJson(audit.before_data,'before_data');
const after=parseMaybeJson(audit.after_data,'after_data');
if(String(before.nickname||'').toLowerCase()!=='zeusgoeswild') throw new Error(`EAGLE audit before nickname mismatch: ${before.nickname}`);
if(String(after.nickname||'').toLowerCase()!=='eagle') throw new Error(`EAGLE audit after nickname mismatch: ${after.nickname}`);
if(!['R1','R2','R3','R4','R5'].includes(String(after.memberRank||''))) throw new Error('EAGLE audit after memberRank invalid.');
if(!['active','suspended','left'].includes(String(after.status||''))) throw new Error('EAGLE audit after status invalid.');
if(!['member','admin'].includes(String(after.role||''))) throw new Error('EAGLE audit after role invalid.');
if(!(after.adminLevel===null || after.adminLevel===undefined || ['sub','super'].includes(String(after.adminLevel)))) throw new Error('EAGLE audit after adminLevel invalid.');

const tempDb = path.join(outDir, `source_backup_${process.pid}_${Date.now()}.sqlite`);
try { fs.rmSync(tempDb,{force:true}); } catch {}
const db = new DatabaseSync(tempDb);
try {
  db.exec('PRAGMA foreign_keys=OFF;');
  let sql=fs.readFileSync(backup,'utf8').replace(/^\uFEFF/,'');
  sql=sql.replace(/PRAGMA\s+foreign_keys\s*=\s*ON\s*;/gi,'PRAGMA foreign_keys=OFF;');
  db.exec(sql);
  const tables=db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all().map(r=>String(r.name));
  const tableSet=new Set(tables);
  if(!tableSet.has('members')) throw new Error('Backup did not load a members table.');

  const info=new Map();
  for(const table of tables){
    const cols=db.prepare(`PRAGMA table_info(${qident(table)})`).all();
    const fks=db.prepare(`PRAGMA foreign_key_list(${qident(table)})`).all();
    const pkCols=cols.filter(c=>Number(c.pk)>0).sort((a,b)=>Number(a.pk)-Number(b.pk)).map(c=>String(c.name));
    info.set(table,{cols:cols.map(c=>String(c.name)),pkCols,fks});
  }

  const members=db.prepare('SELECT * FROM members WHERE id IN (?,?) ORDER BY id').all(...TARGET_IDS);
  if(members.length!==2) throw new Error(`Expected 2 member rows in backup, found ${members.length}.`);
  for(const m of members){
    const expected=SOURCE_NAMES.get(Number(m.id));
    if(!expected || String(m.nickname).toLowerCase()!==expected.toLowerCase()) throw new Error(`ID ${m.id} backup nickname mismatch: expected ${expected}, backup has ${m.nickname}`);
  }
  const eagle=members.find(r=>Number(r.id)===99);
  eagle.nickname=String(after.nickname);
  eagle.member_rank=String(after.memberRank);
  eagle.status=String(after.status);
  eagle.role=String(after.role);
  eagle.admin_level=after.adminLevel==null?null:String(after.adminLevel);
  eagle.updated_at=String(audit.created_at);

  const meta=members.map(r=>({id:Number(r.id),source_nickname:SOURCE_NAMES.get(Number(r.id)),final_nickname:FINAL_NAMES.get(Number(r.id)),login_id:String(r.login_id)})).sort((a,b)=>a.id-b.id);

  const selected=new Map();
  function addRows(table, rows, depth){
    if(!rows.length) return false;
    const ti=info.get(table); if(!ti) return false;
    let bucket=selected.get(table); if(!bucket){ bucket={rows:new Map(),depth}; selected.set(table,bucket); }
    bucket.depth=Math.min(bucket.depth,depth); let changed=false;
    for(const r of rows){ const keyCols=ti.pkCols.length?ti.pkCols:ti.cols; const key=objectKey(r,keyCols); if(!bucket.rows.has(key)){ bucket.rows.set(key,r); changed=true; } }
    return changed;
  }
  addRows('members',members,0);
  let progress=true;
  while(progress){
    progress=false;
    for(const table of tables){
      if(SKIP_TABLES.has(table)) continue;
      const ti=info.get(table);
      for(const fk of ti.fks){
        if(String(fk.on_delete).toUpperCase()!=='CASCADE') continue;
        const parent=String(fk.table), parentBucket=selected.get(parent); if(!parentBucket) continue;
        const from=String(fk.from),to=String(fk.to); if(!from||!to) continue;
        const parentVals=[...new Set([...parentBucket.rows.values()].map(r=>r[to]).filter(v=>v!==null&&v!==undefined))]; if(!parentVals.length) continue;
        const rows=db.prepare(`SELECT * FROM ${qident(table)} WHERE ${qident(from)} IN (${parentVals.map(()=>'?').join(',')})`).all(...parentVals);
        if(addRows(table,rows,parentBucket.depth+1)) progress=true;
      }
    }
  }
  selected.delete('sessions');

  const repairs=[];
  for(const table of tables){
    if(SKIP_TABLES.has(table)) continue;
    const ti=info.get(table); if(!ti.pkCols.length) continue;
    for(const fk of ti.fks){
      if(String(fk.table)!=='members'||String(fk.on_delete).toUpperCase()!=='SET NULL'||String(fk.to)!=='id') continue;
      const from=String(fk.from), rows=db.prepare(`SELECT * FROM ${qident(table)} WHERE ${qident(from)} IN (?,?)`).all(...TARGET_IDS);
      for(const r of rows){
        const bucket=selected.get(table),key=objectKey(r,ti.pkCols); if(bucket?.rows.has(key)) continue;
        const wherePk=ti.pkCols.map(c=>`${qident(c)}=${sqlLiteral(r[c])}`).join(' AND ');
        repairs.push(`UPDATE ${qident(table)} SET ${qident(from)}=${sqlLiteral(r[from])} WHERE ${wherePk} AND ${qident(from)} IS NULL;`);
      }
    }
  }

  const ordered=[...selected.entries()].sort((a,b)=>a[1].depth-b[1].depth || a[0].localeCompare(b[0]));
  const restore=[];
  restore.push('-- EZPK v439 selective member restore R003: Batman(64) + EAGLE(99)');
  restore.push('-- EAGLE source row is backup ID 99 (Zeusgoeswild), patched from authoritative member_update audit to final EAGLE state.');
  restore.push('-- Sessions are intentionally NOT restored.');
  restore.push('PRAGMA foreign_keys=ON;');
  for(const [table,bucket] of ordered){
    const ti=info.get(table),rows=[...bucket.rows.values()]; if(!rows.length) continue;
    restore.push(`\n-- ${table}: ${rows.length} row(s), cascade depth ${bucket.depth}`);
    for(const r of rows){ const cols=ti.cols; restore.push(`INSERT INTO ${qident(table)} (${cols.map(qident).join(',')}) VALUES(${cols.map(c=>sqlLiteral(r[c])).join(',')});`); }
  }
  if(repairs.length){ restore.push('\n-- Safe SET NULL reference repairs'); restore.push(...repairs); }

  const actorId=audit.actor_member_id==null?null:Number(audit.actor_member_id);
  if(before.nickname!==after.nickname && tableSet.has('member_nickname_history')){
    restore.push('\n-- Recreate EAGLE post-backup nickname transition recorded by admin audit');
    restore.push(`INSERT INTO "member_nickname_history" ("member_id","old_nickname","new_nickname","changed_by","changed_by_member_id","changed_at") VALUES(99,${sqlLiteral(before.nickname)},${sqlLiteral(after.nickname)},'admin',${sqlLiteral(actorId)},${sqlLiteral(audit.created_at)});`);
  }
  if(String(before.memberRank)!==String(after.memberRank) && tableSet.has('member_rank_changes')){
    restore.push('\n-- Recreate EAGLE post-backup manual rank change recorded by admin audit');
    restore.push(`INSERT INTO "member_rank_changes" ("member_id","change_type","from_rank","to_rank","reason","changed_by_member_id","protection_until","created_at") VALUES(99,'manual',${sqlLiteral(before.memberRank)},${sqlLiteral(after.memberRank)},'관리자 직접 변경',${sqlLiteral(actorId)},NULL,${sqlLiteral(audit.created_at)});`);
    if(tableSet.has('member_rank_review_states')){
      const auditDay=kstDateFromSql(audit.created_at),joinedDay=kstDateFromSql(eagle.created_at),protectionUntil=addDays(joinedDay,9);
      const protectedNow=auditDay<=protectionUntil,track=['R1','R2','R3'].includes(String(after.memberRank));
      const maintenanceStart=(track&&!protectedNow)?auditDay:null,block=['R1','R2'].includes(String(after.memberRank))?1:0;
      restore.push(`INSERT INTO "member_rank_review_states" ("member_id","rank_snapshot","maintenance_cycle_started_on","maintenance_status","new_member_protection_until","promotion_unlock_after_maintenance","last_evaluated_at","updated_at") VALUES(99,${sqlLiteral(after.memberRank)},${sqlLiteral(maintenanceStart)},'ACTIVE',${sqlLiteral(protectionUntil)},${block},${sqlLiteral(audit.created_at)},${sqlLiteral(audit.created_at)}) ON CONFLICT("member_id") DO UPDATE SET "rank_snapshot"=excluded."rank_snapshot","promotion_target_rank"=NULL,"spec_qualified_at"=NULL,"promotion_cycle_started_on"=NULL,"promotion_activity_qualified_at"=NULL,"promotion_status"=NULL,"promotion_hold_started_at"=NULL,"promotion_rule_fingerprint"=NULL,"maintenance_cycle_started_on"=excluded."maintenance_cycle_started_on","maintenance_status"='ACTIVE',"maintenance_reviewable_at"=NULL,"maintenance_last_completed_on"=NULL,"maintenance_verified_at"=NULL,"new_member_protection_until"=excluded."new_member_protection_until","promotion_unlock_after_maintenance"=excluded."promotion_unlock_after_maintenance","last_evaluated_at"=excluded."last_evaluated_at","updated_at"=excluded."updated_at";`);
    }
  }
  restore.push('\n-- Old sessions intentionally omitted; fresh login sessions required.');

  const restorePath=path.join(outDir,'restore_batman_eagle_64_99.sql'); fs.writeFileSync(restorePath,restore.join('\n')+'\n','utf8');
  function sqlQuote(s){return `'${String(s).replace(/'/g,"''")}'`;}
  const ids='64,99',logins=meta.map(x=>sqlQuote(x.login_id)).join(','),nicks=[...FINAL_NAMES.values()].map(x=>sqlQuote(x.toLowerCase())).join(',');
  fs.writeFileSync(path.join(outDir,'preflight.sql.txt'),`SELECT id,login_id,nickname,status FROM members WHERE id IN (${ids}) OR login_id IN (${logins}) OR lower(nickname) IN (${nicks}) ORDER BY id;\n`,'utf8');
  fs.writeFileSync(path.join(outDir,'verify.sql.txt'),`SELECT id,login_id,nickname,power,industry_level,member_rank,role,status,approval_status,admin_level FROM members WHERE id IN (${ids}) ORDER BY id;\n`,'utf8');
  fs.writeFileSync(path.join(outDir,'member_meta.json'),JSON.stringify(meta,null,2)+'\n','utf8');
  const counts={}; for(const [table,bucket] of ordered) counts[table]=bucket.rows.size; counts.safe_set_null_repairs=repairs.length;
  const summary=['EZPK v439 Batman + EAGLE selective restore build R003',`Backup: ${backup}`,'Member 64: Batman -> Batman','Member 99: Zeusgoeswild -> EAGLE (audit-confirmed same member_id)','',`EAGLE audit: ${audit.created_at} / log id ${audit.id}`,...Object.entries(counts).map(([k,v])=>`${k}: ${v}`),'',`Restore SQL: ${restorePath}`,'Sessions restored: 0 (intentional)','Parser: SQLite-backed','EAGLE latest member fields patched from admin_activity_logs.before_data/after_data'].join('\n');
  fs.writeFileSync(path.join(outDir,'summary.txt'),summary+'\n','utf8'); console.log(summary);
} finally { try{db.close();}catch{} try{fs.rmSync(tempDb,{force:true});}catch{} }
