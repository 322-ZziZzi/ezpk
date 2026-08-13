# EZPK v413 — Deploy-Ready Runbook

## Artifact
`EZPK-v413-deploy-ready.zip`

## Before production deploy
1. Extract the package to a clean directory.
2. Verify the published SHA-256 and ZIP integrity.
3. Run `npm ci` (or use the operator machine's already-controlled Wrangler environment). Do **not** run `npm audit fix` as part of deployment.
4. Run `npm run predeploy`; the v413 deployment guard must PASS.
5. Run `npm run migrate:ezpk1:list` and `npm run migrate:ezpk2:list`. v413 introduces no new migration, but production migration state must still be verified.
6. If `0031_v405_migration_inquiry_soft_delete.sql` is pending on either D1, capture a fresh Time Travel bookmark for **each** affected database before applying it, apply only the pending migration, and re-list both databases. Do not reset or destructively recreate a production database.
7. Run `npm run deploy:dry-run` on the operator machine and require PASS.
8. Deploy only after the above gates pass.

## Post-deploy smoke
Check desktop and mobile on Gateway, EZPK1 and EZPK2. Verify desktop Gateway spacing 100/10/26; mobile spacing 80/12/22/12; sticky mobile tabs and both scroll targets; 14-language selector; first-visit browser language detection; persistence of an explicit language choice across Gateway/EZPK1/EZPK2; unsupported-language English fallback; Arabic RTL; EZPK2 light theme; EZPK1 migration availability; EZPK2 new migration intake rejection; login/signup; Request access; `/dev/` join-code management as Super Admin.

## Important
The generation container does not contain the deployment `node_modules`/Wrangler install, so `wrangler deploy --dry-run` is intentionally **not claimed as executed here**. It remains an operator-machine gate.
