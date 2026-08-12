# EZPK v411 Deploy-Ready Runbook

v411 is a CSS spacing refinement over v410. No D1 migration is added.

## Before deployment
1. Extract `EZPK-v411-deploy-ready.zip` to a fresh folder.
2. Do **not** run `npm audit fix` or otherwise mutate dependencies/source before validation.
3. Run:
   - `npm install` only if dependencies are not already available on the operator machine.
   - `node scripts/v411-deploy-guard.mjs`
   - `npm run deploy:dry-run`
4. Confirm both D1 databases still show the same migration baseline; no `0032` is expected.

## Deploy
Run the existing production deploy command only after the dry run passes:

`npm run deploy`

## Post-deploy smoke
On desktop, verify `https://ezpk322.com/`:
- migration-entry card and combined EZPK1/EZPK2 grid share the same left/right outer boundaries;
- migration card → `연맹 선택` = visually 77px;
- `연맹 선택` → description = 10px;
- description → alliance cards = 26px;
- Korean heading reads `연맹 선택`;
- EZPK1 and EZPK2 cards remain clickable and route to their own hosts.

On mobile, verify the v410 compact spacing remains intact and no horizontal overflow is introduced.

Also smoke-test `/dev/` join-code management and normal signup once, because those v410 security contracts are preserved by the v411 deployment guard.
