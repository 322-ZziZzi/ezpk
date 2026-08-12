# EZPK v402 Deploy Ready Runbook

This is a code/config-only hotfix. Databases are already at migration 0030 from v401 deployment. Do not reinitialize either D1 database.

1. `npm install` (only if this is a fresh extracted folder)
2. `npm run migrate:ezpk1:list` → expected `No migrations to apply!`
3. `npm run migrate:ezpk2:list` → expected `No migrations to apply!`
4. `npm run deploy:dry-run` → verify DB, EZPK2_DB, SITE_MODE=DUAL, EZPK2_STATUS=ACTIVE and Worker-first assets configuration from local wrangler.jsonc.
5. `npm run deploy`
6. Smoke test `https://ezpk322.com/?select=1`, root gateway, EZPK1/EZPK2 hosts, and desktop header.

No D1 migration apply is required for v402.
