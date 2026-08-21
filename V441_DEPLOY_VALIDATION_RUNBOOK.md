# EZPK v441 Deploy Validation Runbook

1. `npm ci`
2. `npm run predeploy` → expect `EZPK v441 deployment preflight PASS`
3. `npm run deploy:dry-run`
4. No D1 migration is required. Do **not** create/apply a v441 migration.
5. Deploy Worker/assets with `npm run deploy`.
6. Logged-in My Page visual check:
   - below-target current = blue
   - satisfied current = green
   - required = gold
   - no shortfall line/text added
