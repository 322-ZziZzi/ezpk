import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const failures = [];
const config = fs.readFileSync(path.join(root, 'wrangler.jsonc'), 'utf8');
const required = [
  '"SITE_MODE": "DUAL"',
  '"EZPK2_STATUS": "ACTIVE"',
  '"run_worker_first": true',
  '"binding": "DB"',
  '"database_name": "ezpk-members"',
  '"database_id": "aaa29a3a-a221-47e3-a30f-9b4c624dcb56"',
  '"binding": "EZPK2_DB"',
  '"database_name": "ezpk2-members"',
  '"database_id": "7203fea0-0dd3-4332-9c11-44273355a4bb"',
  '"pattern": "ezpk322.com"',
  '"pattern": "ezpk1.ezpk322.com"',
  '"pattern": "ezpk2.ezpk322.com"'
];
for (const value of required) if (!config.includes(value)) failures.push(`missing production config: ${value}`);

const themeCss = path.join(root, 'ezpk-theme.css');
if (!fs.existsSync(themeCss)) failures.push('missing ezpk-theme.css');
else {
  const theme = fs.readFileSync(themeCss, 'utf8');
  for (const value of ['html[data-site="ezpk2"]','--ezpk-page-bg:#f6f8fb','--ezpk-surface:#ffffff','--ezpk-text-primary:#101828']) {
    if (!theme.includes(value)) failures.push(`theme contract missing: ${value}`);
  }
}

const htmlFiles = [];
function walkHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules','.wrangler','.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full);
    else if (entry.isFile() && entry.name === 'index.html') htmlFiles.push(full);
  }
}
walkHtml(root);
if (htmlFiles.length !== 27) failures.push(`expected 27 index.html pages, found ${htmlFiles.length}`);
for (const file of htmlFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root,file);
  if (!text.includes('data-ezpk-theme-bootstrap')) failures.push(`missing theme bootstrap: ${rel}`);
  if (!text.includes('/ezpk-theme.css?v=4060')) failures.push(`missing v406 theme stylesheet: ${rel}`);
  if (text.includes('.bgb-filter select.sort-select')) failures.push(`legacy duplicated BGB inline CSS remains: ${rel}`);
}
const gateway = fs.readFileSync(path.join(root,'gateway','index.html'),'utf8');
if (!gateway.includes('data-theme-context="gateway"')) failures.push('gateway neutral theme context missing');
if (!gateway.includes('/gateway/gateway.css?v=4060')) failures.push('gateway CSS cache version is not v4060');
const sharedHeaderPages = htmlFiles.filter((file)=>fs.readFileSync(file,'utf8').includes('shared-header.js?v='));
if (sharedHeaderPages.length !== 24) failures.push(`expected 24 shared-header pages, found ${sharedHeaderPages.length}`);
for (const file of sharedHeaderPages) { if (!fs.readFileSync(file,'utf8').includes('shared-header.js?v=4060')) failures.push(`shared-header cache version is not v4060: ${path.relative(root,file)}`); }
const bgbHtml = fs.readFileSync(path.join(root,'bgb','index.html'),'utf8');
if (!bgbHtml.includes('bgb.css?v=4060')) failures.push('BGB consolidated CSS cache version is not v4060');

const migrationFiles = fs.readdirSync(path.join(root,'migrations')).filter((name)=>name.endsWith('.sql')).sort();
if (migrationFiles.length !== 30) failures.push(`expected 30 migrations through 0031, found ${migrationFiles.length}`);
if (migrationFiles.at(-1) !== '0031_v405_migration_inquiry_soft_delete.sql') failures.push(`unexpected latest migration: ${migrationFiles.at(-1)}`);

if (failures.length) {
  console.error('EZPK v406 deployment preflight FAILED.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('EZPK v406 deployment preflight PASS: Worker-first DUAL routing, both D1 bindings, 0031-only DB evolution, 27-page host-first theme bootstrap, neutral gateway, and EZPK2 light-theme layer are present.');
