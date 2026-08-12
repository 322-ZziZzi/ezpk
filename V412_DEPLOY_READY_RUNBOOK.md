# EZPK v412 Deploy-Ready Runbook

v412 is a Gateway responsive-spacing refinement over v411. No D1 migration is added.

## Before deployment
1. Extract `EZPK-v412-deploy-ready.zip` to a fresh folder.
2. Confirm Node/npm and Wrangler prerequisites on the operator machine.
3. Run `npm install` only if dependencies are not already installed for the extracted package. Do **not** run `npm audit fix` as part of deployment preparation.
4. Run:
   - `node scripts/v412-deploy-guard.mjs`
   - `npm run deploy:dry-run`
5. Confirm both D1 migration lists. v412 adds no migration; the latest migration must remain `0031_v405_migration_inquiry_soft_delete.sql`.

## Deployment
Run the normal production deploy only after the deploy guard and Wrangler dry-run pass.

## Production smoke checks
- Desktop Gateway:
  - migration card → `연맹 선택`: 100px rhythm.
  - heading → description: 10px.
  - description → alliance-card grid: 26px.
  - migration card outer width remains aligned with the combined alliance-card grid.
- Mobile Gateway (`<=760px`):
  - migration card → `연맹 선택`: 100px.
  - heading → description: 12px.
  - description → first alliance card: 22px.
  - EZPK1 → EZPK2 card gap: 12px.
- Verify Gateway migration CTA still targets EZPK1.
- Verify EZPK2 migration intake remains hidden/blocked.
- Smoke-test `/dev/` join-code management and a normal signup path because v410 security contracts remain preserved.

## Database
No schema migration is required for v412. Do not create or apply a `0032` migration for this release.
