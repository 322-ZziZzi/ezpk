import fs from 'node:fs';

const config = fs.readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8');
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

const missing = required.filter((value) => !config.includes(value));
if (missing.length) {
  console.error('EZPK v403 deployment preflight FAILED. Missing expected production configuration:');
  for (const value of missing) console.error(`- ${value}`);
  process.exit(1);
}

console.log('EZPK v403 deployment preflight PASS: Worker-first host routing, DUAL routes and both D1 bindings match production configuration.');
