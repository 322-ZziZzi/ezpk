# EZPK v403 Deploy-Ready Runbook

This is a code/UI-only hotfix over the already-migrated v401/v402 production database state.

1. Extract the package into a new folder.
2. Run `npm install`.
3. Run `npm run deploy:dry-run`.
4. Confirm both D1 bindings, `SITE_MODE=DUAL`, `EZPK2_STATUS=ACTIVE`.
5. Run `npm run deploy`.
6. If Wrangler warns that local configuration differs from Dashboard, confirm the expected three custom domains and two D1 bindings, then continue.
7. Do **not** run D1 migrations for v403.

Post-deploy smoke checks:
- `https://ezpk322.com/?select=1`: common EZPK-style selector, EZPK1 + EZPK2 cards, header language dropdown.
- `https://ezpk1.ezpk322.com/`: desktop header remains inside viewport; Language is visible.
- `https://ezpk2.ezpk322.com/`: same desktop header behavior and independent data context.
