# EZPK v440 / 4.4.0 — Deployment Validation Runbook

## Authority

Deployment candidate revision: **R002**. R001 was superseded before any production migration because its qualification table still had an accidental member `ON DELETE CASCADE`. R002 removes that cascade and adds a post-migration durability sentinel.

Baseline: v439 / 4.3.9
Target: v440 / 4.4.0
New D1 migration: `0033_v440_rank_lifecycle_integrity.sql`
Production DB: `ezpk-members`

Do not run the old migration-cycle RESET tooling as part of v440 deployment. Migration applicant data is unrelated to this rank-lifecycle migration and must remain untouched.

## 1. Extract v440 and install dependencies if needed

```powershell
npm install
```

## 2. Static predeploy guard

```powershell
npm run predeploy
```

Expected:

```text
EZPK v440 deployment preflight PASS
```

## 3. Optional Worker bundle dry-run

```powershell
npm run deploy:dry-run
```

This is non-deploying and should finish without build errors.

## 4. Create a production D1 backup before migration

From the v440 repository root:

```powershell
$Stamp = Get-Date -Format "yyyyMMdd_HHmmss"
npx wrangler d1 export ezpk-members --remote --output="operations\backups\ezpk-members_before_v440_$Stamp.sql"
Get-FileHash "operations\backups\ezpk-members_before_v440_$Stamp.sql" -Algorithm SHA256
```

Keep the backup before continuing.

## 5. Confirm pending migration

```powershell
npx wrangler d1 migrations list ezpk-members --remote
```

`0033_v440_rank_lifecycle_integrity.sql` should be pending exactly once.

## 6. Apply migration 0033

```powershell
npx wrangler d1 migrations apply ezpk-members --remote
```

Do not deploy the Worker if migration 0033 fails.

## 7. Run READ-ONLY post-migration verification

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\operations\v440-rank-lifecycle-post-migration-verify.ps1
```

Expected final sentinels:

- `r1_maintenance_cycles = 0`
- `qualification_link_misses = 0`
- `missing_r2_r3_cycles = 0`
- `invalid_legacy_quality = 0`
- `legacy_public_snapshot_leaks = 0`
- `qualification_member_fk_rows = 0`
- `qualification_cascade_fk_rows = 0`

Also confirm `schema_version = 5.5-v440`.

## 8. Deploy v440 Worker/assets

```powershell
npm run deploy
```

## 9. Post-deploy functional checks

Check at minimum:

1. EZPK1 guest home still shows migration intake first and intake remains OPEN.
2. Signed-in home hides the migration entry.
3. R1 My Page has no rank-maintenance card.
4. An R1 promotion card can show permanent qualification and/or re-entry state.
5. R2/R3 My Page shows exact 30-day maintenance cycle dates.
6. My Page rank history loads recent events and full history.
7. Admin promotion candidates load and promotion action requires REVIEWABLE state.
8. Admin demotion candidates contain only R2/R3.
9. Admin rank history includes manual/promotion/demotion/correction/restore types where present.
10. EZPK2 remains archived and normal EZPK2 API routes remain unavailable.

## Rollback boundary

If migration 0033 succeeds but deployment fails, do not manually edit/delete the new tables. Restore/deployment recovery should be performed from the pre-v440 D1 export only if a verified rollback is necessary. Preserve the backup and deployment logs.
