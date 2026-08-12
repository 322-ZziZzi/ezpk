# EZPK v406 Deploy Ready Runbook

## Scope
- Carries forward every v405 feature, including Migration Inquiry `MIGRATION · PRIVATE` and super-admin-only soft delete.
- Adds the official EZPK2 Complete Light Theme to every page while preserving EZPK1 Dark Theme.
- Keeps the root alliance Gateway neutral; its EZPK1/EZPK2 cards preview Dark/Light identity with equal visual weight.
- No v406 database migration is added. The latest DB migration remains v405 `0031_v405_migration_inquiry_soft_delete.sql`.

## Theme routing contract
- `ezpk1.ezpk322.com` → Dark Theme.
- `ezpk2.ezpk322.com` → Complete Light Theme.
- legacy `ezpk322.com/*` application routes → EZPK1/Dark behavior.
- Gateway document → Neutral Theme.
- Host/document context is the production source of truth; user cookies/localStorage/query strings do not choose the production theme.

## Database change
v406 adds **no new migration**. Migration inventory remains 30 files through:
`0031_v405_migration_inquiry_soft_delete.sql`.

If production is still on v404, 0031 must be applied to both EZPK1 and EZPK2 before deploying v406. If 0031 was already applied, the migration list should show no pending migrations and it must not be re-created as 0032.

## Safe production order
1. Extract `EZPK-v406-deploy-ready.zip` into a new directory.
2. `npm install`
3. `npm run migrate:ezpk1:list`
4. `npm run migrate:ezpk2:list`
5. If and only if `0031_v405_migration_inquiry_soft_delete.sql` is pending, capture fresh D1 Time Travel bookmarks for **both** databases.
6. Apply the pending 0031 to EZPK1: `npm run migrate:ezpk1:remote`.
7. Apply the pending 0031 to EZPK2: `npm run migrate:ezpk2:remote`.
8. Re-run both migration list commands. Both must show no pending migrations.
9. `npm run deploy:dry-run`
10. `npm run deploy`

Do not run `npm audit fix` as part of this deployment. Do not restore a Time Travel bookmark unless an incident requires recovery.

## Post-deploy smoke test
- Gateway: `https://ezpk322.com/?select=1` remains neutral and shows both alliance cards.
- EZPK1: Dark Theme unchanged on Home, Members, Migration, Request, Admin and representative game pages.
- EZPK2: Light Theme on Home, Members, Migration, Request, Admin, My, Signup, Accounts, Vote, Season, Alliance Layout, games, Inactive and Dev.
- EZPK2 Header visibly identifies `EZPK2`; admin identifies `EZPK2 ADMIN`.
- Buttons, fonts, icons, forms, tables, dropdowns, dialogs, toasts and all focus/disabled/selected states are readable on Light surfaces.
- Game/canvas/export artwork is not recolored; surrounding UI uses the Light Theme.
- Migration Inquiry: `MIGRATION · PRIVATE`; super admin sees Delete, sub-admin does not; soft-deleted inquiry disappears from active lists while replies remain stored.
