# EZPK v442 Deploy Validation Runbook

1. `npm ci`
2. `npm run predeploy` → expect `EZPK v442 deployment preflight PASS`
3. `npm run deploy:dry-run`
4. Back up production `ezpk-members` D1 before migration.
5. Confirm exactly `0034_v442_rank_notice_state.sql` is pending.
6. Apply D1 migration: `npx wrangler d1 migrations apply ezpk-members --remote`
7. Run READ-ONLY verification: `./operations/v442-rank-profile-post-migration-verify.ps1`
8. Expected schema: `5.6-v442`; final notice-state sentinels all `0`.
9. Deploy Worker/assets with `npm run deploy`.
10. Logged-in My Page checks:
   - Basic Profile opens by default.
   - current rank + latest change only (no full member history).
   - R1 promotion only / R2 promotion+maintenance / R3 maintenance only / R4-R5 no auto-management block.
   - promotion/maintenance details collapsed by default.
   - v441 current/required colors preserved.
11. Admin Member Management full rank history remains available.
