# EZPK v409 — Deploy Ready Runbook

## Package purpose

v409 refines the `ezpk322.com` Gateway desktop balance and the Server 322 migration-entry copy. It preserves the v408 EZPK1/EZPK2 migration-intake feature gates and all existing database contracts.

## Before deploy

1. Extract the package into a clean directory.
2. Do **not** run `npm audit fix` or otherwise mutate dependencies as part of deployment preparation.
3. Confirm Node/npm/Docker/Wrangler environment matches the operator environment already used for EZPK deployment.
4. Run:

```powershell
npm run predeploy
npm run deploy:dry-run
```

Both must pass before production deployment.

## Database

v409 contains **no new migration**. The migration directory remains 30 files with latest:

`0031_v405_migration_inquiry_soft_delete.sql`

If production already has 0031 applied, do not reapply or create a new migration for v409. If 0031 is still pending from the earlier release track, follow the existing safe D1 backup/Time Travel + migration runbook before deploying application code.

## Deploy

After predeploy and dry-run pass:

```powershell
npm run deploy
```

## Production smoke

Check on desktop and mobile:

- `https://ezpk322.com/`
  - migration card outer width aligns with the full EZPK1/EZPK2 grid outer width on PC
  - migration card is visually balanced against the alliance cards
  - migration copy shows the confirmed Server 322 wording
  - `Choose Your Alliance` title/description is close to the alliance cards (`10px / 16px` rhythm)
  - EZPK1 and EZPK2 cards remain equal-width and responsive
- `https://ezpk1.ezpk322.com/migration/`
  - v408 confirmed Membership/form UX remains intact
  - EZPK1 migration intake remains available
- `https://ezpk2.ezpk322.com/`
  - migration menu/CTA remains hidden
  - EZPK2 migration intake remains disabled

Do not modify WAF/DNS/Worker security settings as part of this visual deployment unless separately diagnosed and approved.
