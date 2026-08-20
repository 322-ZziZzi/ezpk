# EZPK v437 Deploy Validation Runbook

## Pre-deploy

1. Confirm `package.json` version is `4.3.7` and `predeploy` points to `scripts/v437-deploy-guard.mjs`.
2. Run `npm ci` in the deployment workspace if dependencies are not already installed.
3. Run `npm run predeploy` and require PASS.
4. Run `npm run deploy:dry-run` after Wrangler dependencies are installed.
5. Confirm `wrangler.jsonc` has `SITE_MODE=SINGLE`, `EZPK2_STATUS=ARCHIVED`, only the EZPK1 `DB` D1 binding, and all three host routes.
6. Do **not** delete the external `ezpk2-members` D1 database.
7. No migration apply is required for v437.

## Post-deploy routing checks

- `https://ezpk322.com/` -> 302 -> `https://ezpk1.ezpk322.com/`
- `https://ezpk322.com/gateway/` -> 302 -> EZPK1 home
- `https://ezpk1.ezpk322.com/gateway/` -> 302 -> EZPK1 home
- `https://ezpk2.ezpk322.com/` -> 302 -> EZPK1 home
- `https://ezpk2.ezpk322.com/members/` -> 302 -> EZPK1 home
- `GET https://ezpk2.ezpk322.com/api/site-context` -> HTTP 410 `ALLIANCE_ARCHIVED`
- Unsafe EZPK2 API methods such as POST must also return HTTP 410 and must never write to EZPK1.

## EZPK1 functional checks

1. EZPK1 home loads normally for guest and authenticated member states.
2. Migration application card is visible on the home page.
3. Migration card changes with all supported language selections and opens `https://ezpk1.ezpk322.com/migration/`.
4. Header contains no desktop Alliance Select control.
5. Mobile drawer contains no alliance selector group.
6. Signup and nickname change continue to enforce duplicate nickname rules inside EZPK1 only.
7. Existing v436 Member Management, rank review, new-member protection, BGB, Request, Vote, Mini Games and Admin flows remain available.

## Rollback

Rollback artifact is the exact v436 base:

`EZPK-v436-deploy-ready.zip`

SHA-256:

`72f5437ddcd8136973507c67ccd3fc17cc0211272abd115d7287730ad0cbf5dc`

Because v437 introduces no database migration and does not delete EZPK2 D1 data, rollback does not require a schema rollback.
