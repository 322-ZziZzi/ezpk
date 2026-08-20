import fs from 'node:fs';
import path from 'node:path';

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
const TARGET_IDS = new Set([...TARGETS.keys()]);

function splitSqlValues(s){
  const out=[]; let buf=''; let inQuote=false;
  for(let i=0;i<s.length;i++){
    const ch=s[i];
    if(ch==="'"){
      buf+=ch;
      if(inQuote && s[i+1]==="'") { buf+=s[++i]; continue; }
      inQuote=!inQuote; continue;
    }
    if(ch===',' && !inQuote){ out.push(buf.trim()); buf=''; continue; }
    buf+=ch;
  }
  if(buf.length || s.endsWith(',')) out.push(buf.trim());
  return out;
}
function decodeSqlString(raw){
  raw=raw.trim();
  if(/^NULL$/i.test(raw)) return null;
  if(raw.startsWith("'") && raw.endsWith("'")) return raw.slice(1,-1).replace(/''/g,"'");
  return raw;
}
function intVal(raw){
  if(raw==null) return null;
  const t=String(raw).trim();
  return /^-?\d+$/.test(t) ? Number(t) : null;
}

const text=fs.readFileSync(backup,'utf8');
const lines=text.split(/\r?\n/);
const rows=[];
for(const line of lines){
  if(!line.startsWith('INSERT INTO ')) continue;
  const m=line.match(/^INSERT INTO\s+"([^"]+)"\s*\((.*?)\)\s*VALUES\((.*)\);\s*$/);
  if(!m) continue;
  const table=m[1];
  const columns=[...m[2].matchAll(/"([^"]+)"/g)].map(x=>x[1]);
  const values=splitSqlValues(m[3]);
  if(columns.length!==values.length) throw new Error(`Column/value mismatch in table ${table}`);
  const by={}; columns.forEach((c,i)=>by[c]=values[i]);
  rows.push({table,columns,values,by,line});
}

const members=rows.filter(r=>r.table==='members' && TARGET_IDS.has(intVal(r.by.id)));
if(members.length!==2) throw new Error(`Expected 2 member rows, found ${members.length}`);
const meta=[];
for(const r of members){
  const id=intVal(r.by.id), nick=decodeSqlString(r.by.nickname), login=decodeSqlString(r.by.login_id);
  const expected=TARGETS.get(id);
  if(String(nick).toLowerCase()!==expected.toLowerCase()) throw new Error(`ID ${id} nickname mismatch: expected ${expected}, backup has ${nick}`);
  meta.push({id,nickname:nick,login_id:login});
}
meta.sort((a,b)=>a.id-b.id);

const subjectTables = new Map([
  ['members','id'],
  ['member_specs','member_id'],
  ['member_nickname_history','member_id'],
  ['member_admin_memos','member_id'],
  ['vote_responses','member_id'],
  ['vote_member_states','member_id'],
  ['vote_member_exclusions','member_id'],
  ['vote_eligible_members','member_id'],
  ['subadmin_menu_permissions','member_id'],
  ['alliance_layout_positions','member_id'],
  ['member_daily_visits','member_id'],
  ['member_activity_logs','member_id'],
  ['member_activity_confirmations','member_id'],
  ['member_rank_changes','member_id'],
  ['member_demotion_exclusions','member_id'],
  ['member_rank_review_states','member_id'],
]);
const selected=new Map();
for(const [table,col] of subjectTables){
  const rs=rows.filter(r=>r.table===table && TARGET_IDS.has(intVal(r.by[col])));
  selected.set(table,rs);
}

// Indirect cascade: vote_response_options is deleted through vote_responses.
const voteResponseIds=new Set((selected.get('vote_responses')||[]).map(r=>intVal(r.by.id)).filter(Number.isInteger));
selected.set('vote_response_options', rows.filter(r=>r.table==='vote_response_options' && voteResponseIds.has(intVal(r.by.response_id))));

const order=[
  'members','member_specs','member_nickname_history','member_admin_memos',
  'vote_responses','vote_response_options','vote_member_states','vote_member_exclusions','vote_eligible_members',
  'subadmin_menu_permissions','alliance_layout_positions','member_daily_visits','member_activity_logs',
  'member_activity_confirmations','member_rank_changes','member_demotion_exclusions','member_rank_review_states'
];

// Reference-only rows survive member deletion but their FK columns may become NULL (SET NULL).
// Repair only when the current value is still NULL, so post-delete edits are never overwritten.
const repairSpecs=[
  ['member_nickname_history','id',['changed_by_member_id']],
  ['member_admin_memos','member_id',['updated_by_member_id']],
  ['member_requests','id',['member_id','answered_by_member_id']],
  ['admin_logs','id',['admin_member_id','target_member_id']],
  ['alliance_layout_versions','id',['created_by_member_id','updated_by_member_id','published_by_member_id']],
  ['migration_applications','id',['deleted_by_member_id']],
  ['migration_inquiry_replies','id',['admin_member_id']],
  ['migration_inquiries','id',['deleted_by_member_id']],
];
const repairs=[];
for(const [table,pk,cols] of repairSpecs){
  for(const r of rows.filter(x=>x.table===table)){
    const pkRaw=r.by[pk]; if(pkRaw==null) continue;
    for(const col of cols){
      const n=intVal(r.by[col]);
      if(!TARGET_IDS.has(n)) continue;
      // Rows restored from cascade are handled by INSERT and do not need repair.
      if(table==='member_nickname_history' && TARGET_IDS.has(intVal(r.by.member_id))) continue;
      if(table==='member_admin_memos' && TARGET_IDS.has(intVal(r.by.member_id))) continue;
      repairs.push(`UPDATE "${table}" SET "${col}"=${n} WHERE "${pk}"=${pkRaw} AND "${col}" IS NULL;`);
    }
  }
}

const restore=[];
restore.push('-- EZPK v439 selective member restore: Batman(64) + EAGLE(99)');
restore.push('-- Generated from full pre-reset backup. Sessions are intentionally NOT restored.');
restore.push('PRAGMA foreign_keys=ON;');
for(const table of order){
  const rs=selected.get(table)||[];
  if(rs.length){
    restore.push(`\n-- ${table}: ${rs.length} row(s)`);
    for(const r of rs) restore.push(r.line);
  }
}
if(repairs.length){
  restore.push('\n-- Safe SET NULL reference repairs (only when still NULL)');
  restore.push(...repairs);
}
restore.push('\n-- Do not restore sessions. Existing users must create fresh login sessions.');

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

const counts={}; for(const table of order) counts[table]=(selected.get(table)||[]).length;
counts.reference_repairs=repairs.length;
const summary=[
  'EZPK v439 Batman + EAGLE selective restore build',
  `Backup: ${backup}`,
  ...meta.map(m=>`Member ${m.id}: ${m.nickname} (login_id retained privately in generated metadata)`),
  '',
  ...Object.entries(counts).map(([k,v])=>`${k}: ${v}`),
  '',
  `Restore SQL: ${restorePath}`,
  'Sessions restored: 0 (intentional)'
].join('\n');
fs.writeFileSync(path.join(outDir,'summary.txt'),summary+'\n','utf8');
console.log(summary);
