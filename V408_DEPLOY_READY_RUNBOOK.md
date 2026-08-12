# EZPK v408 Deploy Ready Runbook

## Scope
v408 applies the confirmed Gateway and migration-intake UX changes while preserving the v407 theme and the existing D1 schema baseline.

Key behavior:
- Gateway order: Header → EZPK1 migration entry → Alliance title/description → EZPK1/EZPK2 cards → Footer.
- Gateway desktop/mobile vertical spacing is reduced; desktop alliance cards are slightly taller.
- EZPK1 Home no longer displays the former migration entry section.
- EZPK1 `/migration/` has the revised Membership copy, 1×2 eligibility layout, and corrected PC inner spacing/alignment.
- EZPK2 migration intake is disabled by one site-context feature gate, not deleted.
- EZPK2 hides the public migration menu/form and rejects new application creation server-side while retaining historical status/inquiry access.

## Database change
v408 adds **no new migration**.

Migration inventory remains 30 files through:
`0031_v405_migration_inquiry_soft_delete.sql`.

If production has not yet applied 0031, apply that existing migration to both EZPK1 and EZPK2 only after capturing fresh Time Travel bookmarks. If 0031 is already applied, do not create or apply a replacement 0032.

## Production configuration expected
`wrangler.jsonc` keeps:
- `SITE_MODE = DUAL`.
- `EZPK2_STATUS = ACTIVE`.
- `EZPK1_MIGRATION_INTAKE = ENABLED`.
- `EZPK2_MIGRATION_INTAKE = DISABLED`.
- Existing EZPK1/EZPK2 D1 bindings and all three custom-domain routes.
- `run_worker_first = true`.

## Safe production order
1. Extract `EZPK-v408-deploy-ready.zip` into a new directory; do not overwrite the currently running working directory.
2. Run `node scripts/v408-deploy-guard.mjs` and require PASS.
3. Ensure the intended Wrangler toolchain is available. If using the existing project workflow, run `npm install`; do **not** run `npm audit fix`.
4. Run `npm run migrate:ezpk1:list`.
5. Run `npm run migrate:ezpk2:list`.
6. If and only if `0031_v405_migration_inquiry_soft_delete.sql` is pending, capture fresh D1 Time Travel bookmarks for **both** databases before applying it.
7. Apply pending 0031 to EZPK1 with `npm run migrate:ezpk1:remote`.
8. Apply pending 0031 to EZPK2 with `npm run migrate:ezpk2:remote`.
9. Re-run both migration list commands and confirm there are no pending migrations.
10. Run `npm run deploy:dry-run` and require PASS.
11. Run `npm run deploy`.

Do not change the D1 database IDs, custom-domain routes, `SITE_MODE`, or EZPK2 lifecycle state as part of this release. Do not add a 0032 migration for v408.

## Post-deploy smoke test
- `ezpk322.com`: migration entry appears above `Choose Your Alliance`; EZPK1/EZPK2 cards remain equal-width; desktop cards are slightly taller; mobile remains compact.
- `ezpk1.ezpk322.com`: old Home migration entry is absent; other Home sections remain intact.
- EZPK1 shared Header: guest Migration menu remains visible.
- `ezpk1.ezpk322.com/migration/`: title is `이민 신청`; Membership copy is correct; R2 values match current Admin promotion rules; criteria are vertically stacked; form and membership content share the same left/right alignment.
- EZPK1 migration page: EZPK2 explanatory text may appear while EZPK2 is active, but no EZPK2 migration button is visible.
- EZPK2 shared Header: guest Migration menu is absent on desktop and mobile.
- Direct `ezpk2.ezpk322.com/migration/`: no new-application form; disabled-intake notice and historical status lookup remain available.
- Direct EZPK2 new-application POST is rejected with `403 MIGRATION_INTAKE_DISABLED`.
- EZPK1 new migration application flow still submits normally.
- Existing migration applicant UID status lookup and Migration Inquiry behavior still work.
- EZPK2 Light Theme and EZPK1 Dark Theme remain unchanged outside the new migration-disabled panel treatment.

## Re-enable EZPK2 migration later
The feature is intentionally retained. To reopen EZPK2 migration intake later, change the EZPK2 intake feature state to enabled and deploy after normal preflight/smoke testing. Do not restore deleted code or create a schema migration solely to re-enable the feature.

## Build-environment boundary
Static validation, syntax validation, Worker feature-gate probes, and fresh SQLite migration cycles passed. `wrangler deploy --dry-run` must still be executed on the operator machine before production deployment; the build container’s on-demand Wrangler invocation did not complete within its execution window.
