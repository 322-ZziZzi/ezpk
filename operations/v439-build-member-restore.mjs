import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { DatabaseSync } from 'node:sqlite';

function arg(name, fallback=null){
  const i=process.argv.indexOf(`--${name}`);
  return i>=0 && i+1<process.argv.length ? process.argv[i+1] : fallback;
}
const backup=arg('backup');
const outDir=arg('out', path.join(process.cwd(),'operations','member_restore_generated'));
if(!backup) throw new Error('Missing --backup <path>');
if(!fs.existsSync(backup)) throw new Error(`Backup not found: ${backup}`);
fs.mkdirSync(outDir,{recursive:true});

const TARGETS = new Map([[64,'Batman'],[99,'EAGLE']]);
const TARGET_IDS = [...TARGETS.keys()];
const SKIP_TABLES = new Set(['sessions']); // never restore stale auth sessions

function qident(s){ return `"${String(s).replace(/"/g,'""')}"`; }
function sqlLiteral(v){
  if(v === null || v === undefined) return 'NULL';
  if(typeof v === 'bigint') return v.toString();
  if(typeof v === 'number') {
    if(!Number.isFinite(v)) throw new Error(`Non-finite numeric value: ${v}`);
    return String(v);
  }
  if(typeof v === 'boolean') return v ? '1' : '0';
  if(v instanceof Uint8Array || Buffer.isBuffer(v)) return `X'${Buffer.from(v).toString('hex')}'`;
  return `'${String(v).replace(/'/g,"''")}'`;
}
function objectKey(obj, cols){ return cols.map(c=>`${c}=${typeof obj[c]==='bigint'?obj[c].toString():String(obj[c])}`).join('|'); }

const tempDb = path.join(outDir, `source_backup_${process.pid}_${Date.now()}.sqlite`);
try { fs.rmSync(tempDb,{force:true}); } catch {}
const db = new DatabaseSync(tempDb);
try {
  db.exec('PRAGMA foreign_keys=OFF;');
  let sql=fs.readFileSync(backup,'utf8');
  // A D1 export can carry an FK-enable pragma. Keep FK checks disabled while loading
  // the immutable backup snapshot so statement order cannot block the local analysis DB.
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
  const meta=members.map(r=>({id:Number(r.id),nickname:String(r.nickname),login_id:String(r.login_id)})).sort((a,b)=>a.id-b.id);
  for(const m of meta){
    const expected=TARGETS.get(m.id);
    if(!expected || m.nickname.toLowerCase()!==expected.toLowerCase()) throw new Error(`ID ${m.id} nickname mismatch: expected ${expected}, backup has ${m.nickname}`);
  }

  // selected: table -> { rows: Map<stableKey,row>, depth }
  const selected=new Map();
  function addRows(table, rows, depth){
    if(!rows.length) return false;
    const ti=info.get(table); if(!ti) return false;
    let bucket=selected.get(table);
    if(!bucket){ bucket={rows:new Map(),depth}; selected.set(table,bucket); }
    bucket.depth=Math.min(bucket.depth,depth);
    let changed=false;
    for(const r of rows){
      const keyCols=ti.pkCols.length?ti.pkCols:ti.cols;
      const key=objectKey(r,keyCols);
      if(!bucket.rows.has(key)){ bucket.rows.set(key,r); changed=true; }
    }
    return changed;
  }
  addRows('members',members,0);

  // Reconstruct every row that would have been removed through an ON DELETE CASCADE
  // path starting at members(64,99). This avoids a brittle hard-coded table list.
  let progress=true;
  while(progress){
    progress=false;
    for(const table of tables){
      if(SKIP_TABLES.has(table)) continue;
      const ti=info.get(table);
      for(const fk of ti.fks){
        if(String(fk.on_delete).toUpperCase()!=='CASCADE') continue;
        const parent=String(fk.table);
        const parentBucket=selected.get(parent);
        if(!parentBucket) continue;
        const from=String(fk.from), to=String(fk.to);
        if(!from || !to) continue;
        const parentVals=[...new Set([...parentBucket.rows.values()].map(r=>r[to]).filter(v=>v!==null && v!==undefined))];
        if(!parentVals.length) continue;
        const placeholders=parentVals.map(()=>'?').join(',');
        const stmt=db.prepare(`SELECT * FROM ${qident(table)} WHERE ${qident(from)} IN (${placeholders})`);
        const rows=stmt.all(...parentVals);
        if(addRows(table,rows,parentBucket.depth+1)) progress=true;
      }
    }
  }
  selected.delete('sessions');

  // Repair ON DELETE SET NULL references for rows that survive deletion. Only update
  // current rows when the FK column is still NULL, preserving any post-delete edits.
  const repairs=[];
  for(const table of tables){
    if(SKIP_TABLES.has(table)) continue;
    const ti=info.get(table);
    if(!ti.pkCols.length) continue;
    for(const fk of ti.fks){
      if(String(fk.table)!=='members' || String(fk.on_delete).toUpperCase()!=='SET NULL') continue;
      const from=String(fk.from), to=String(fk.to);
      if(to!=='id') continue;
      const rows=db.prepare(`SELECT * FROM ${qident(table)} WHERE ${qident(from)} IN (?,?)`).all(...TARGET_IDS);
      for(const r of rows){
        // If this exact source row is being reinserted after CASCADE, its original FK is already preserved.
        const bucket=selected.get(table);
        const key=objectKey(r,ti.pkCols);
        if(bucket?.rows.has(key)) continue;
        const wherePk=ti.pkCols.map(c=>`${qident(c)}=${sqlLiteral(r[c])}`).join(' AND ');
        repairs.push({table,sql:`UPDATE ${qident(table)} SET ${qident(from)}=${sqlLiteral(r[from])} WHERE ${wherePk} AND ${qident(from)} IS NULL;`});
      }
    }
  }

  const ordered=[...selected.entries()].sort((a,b)=>a[1].depth-b[1].depth || a[0].localeCompare(b[0]));
  const restore=[];
  restore.push('-- EZPK v439 selective member restore: Batman(64) + EAGLE(99)');
  restore.push('-- Source: full pre-delete D1 backup, loaded through local SQLite for robust parsing.');
  restore.push('-- Sessions are intentionally NOT restored.');
  restore.push('PRAGMA foreign_keys=ON;');
  for(const [table,bucket] of ordered){
    const ti=info.get(table);
    const rows=[...bucket.rows.values()];
    if(!rows.length) continue;
    restore.push(`\n-- ${table}: ${rows.length} row(s), cascade depth ${bucket.depth}`);
    for(const r of rows){
      const cols=ti.cols;
      restore.push(`INSERT INTO ${qident(table)} (${cols.map(qident).join(',')}) VALUES(${cols.map(c=>sqlLiteral(r[c])).join(',')});`);
    }
  }
  if(repairs.length){
    restore.push('\n-- Safe SET NULL reference repairs (only when the current FK is still NULL)');
    for(const r of repairs) restore.push(r.sql);
  }
  restore.push('\n-- Existing sessions are not restored; both users must obtain fresh login sessions.');

  const restorePath=path.join(outDir,'restore_batman_eagle_64_99.sql');
  fs.writeFileSync(restorePath,restore.join('\n')+'\n','utf8');

  function sqlQuote(s){return `'${String(s).replace(/'/g,"''")}'`;}
  const ids=meta.map(x=>x.id).join(',');
  const logins=meta.map(x=>sqlQuote(x.login_id)).join(',');
  const nicks=meta.map(x=>sqlQuote(x.nickname.toLowerCase())).join(',');
  const preflight=`SELECT id,login_id,nickname,status FROM members WHERE id IN (${ids}) OR login_id IN (${logins}) OR lower(nickname) IN (${nicks}) ORDER BY id;`;
  const verify=`SELECT id,login_id,nickname,power,industry_level,member_rank,role,status,approval_status,admin_level FROM members WHERE id IN (${ids}) ORDER BY id;`;
  fs.writeFileSync(path.join(outDir,'preflight.sql.txt'),preflight+'\n','utf8');
  fs.writeFileSync(path.join(outDir,'verify.sql.txt'),verify+'\n','utf8');
  fs.writeFileSync(path.join(outDir,'member_meta.json'),JSON.stringify(meta,null,2)+'\n','utf8');

  const counts={}; for(const [table,bucket] of ordered) counts[table]=bucket.rows.size;
  counts.safe_set_null_repairs=repairs.length;
  const summary=[
    'EZPK v439 Batman + EAGLE selective restore build R002',
    `Backup: ${backup}`,
    ...meta.map(m=>`Member ${m.id}: ${m.nickname} (login_id retained privately in generated metadata)`),
    '',
    ...Object.entries(counts).map(([k,v])=>`${k}: ${v}`),
    '',
    `Restore SQL: ${restorePath}`,
    'Sessions restored: 0 (intentional)',
    'Parser: SQLite-backed (no comma/quote splitting)'
  ].join('\n');
  fs.writeFileSync(path.join(outDir,'summary.txt'),summary+'\n','utf8');
  console.log(summary);
} finally {
  try { db.close(); } catch {}
  try { fs.rmSync(tempDb,{force:true}); } catch {}
}
