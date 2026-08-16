import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const css=fs.readFileSync(path.join(root,'ezpk-theme.css'),'utf8');
const names=['primary','success','goal','missing','pending','danger','support','system','admin-text','admin-text-secondary','admin-text-muted'];
function token(name){const m=css.match(new RegExp(`--v434-${name}:#([0-9A-Fa-f]{6})`));if(!m)throw new Error(`missing --v434-${name}`);return '#'+m[1].toUpperCase()}
function luminance(hex){const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]}
function ratio(a,b){const [x,y]=[luminance(a),luminance(b)].sort((m,n)=>n-m);return (x+.05)/(y+.05)}
const rows=names.map(name=>{const color=token(name),contrast=Number(ratio(color,'#FFFFFF').toFixed(2));return {name,color,background:'#FFFFFF',contrast,aaNormalText:contrast>=4.5}});
const result={version:'v434',pass:rows.every(x=>x.aaNormalText),minimumRequired:4.5,rows};
if(!result.pass)throw new Error('semantic palette contrast below 4.5');
const out=process.argv[2];if(out)fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');else console.log(JSON.stringify(result,null,2));
