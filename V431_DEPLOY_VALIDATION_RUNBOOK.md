# EZPK v431 Deploy Validation Runbook

## Pre-deploy

1. Verify the package SHA-256 against `EZPK-v431-deploy-ready.zip.sha256`.
2. Extract to a clean directory.
3. Run `npm run predeploy` and require PASS.
4. Confirm all 30 files under `migrations/` are byte-exact to v430.

## Production live gate

Use a **super-admin** account.

1. Open Admin → Request Board.
2. Locate a `MIGRATION · PRIVATE` inquiry.
3. Press Delete and confirm.
4. Require the inquiry to disappear after the automatic list refresh.
5. Refresh the page and require that it remains absent.
6. From the migration applicant side, UID lookup and Request Board access must continue to work; the deleted thread must not reappear.
7. Create a new migration inquiry for the same application and confirm the old deleted thread does not block the new one.

## Schema-dependent expected behavior

- If remote D1 has migration `0031_v405_migration_inquiry_soft_delete.sql`, deletion is soft and auditable in `migration_inquiries`.
- If remote D1 is still on the v401 inquiry schema (`0030` only), v431 uses the super-admin-only compatibility hard delete and writes the pre-delete metadata to Admin Audit.

Applying `0031` remotely remains the preferred long-term state because it preserves the full inquiry/reply thread in D1 after deletion, but v431 no longer requires that migration merely for the Delete button to function.
