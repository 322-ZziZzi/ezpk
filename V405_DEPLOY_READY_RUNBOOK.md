# EZPK v405 Deploy Ready Runbook

## Scope
- Adds super-admin-only soft deletion for Migration Inquiry requests.
- Deleted inquiries disappear from applicant and admin request lists while replies remain in D1 for audit.
- Deletion closes the inquiry, allowing the applicant to create a new inquiry later.
- Adds `MIGRATION · PRIVATE` / lock privacy indicators.
- No changes to EZPK1/EZPK2 routing, bindings, or existing member/request data.

## Database change
New additive migration: `0031_v405_migration_inquiry_soft_delete.sql`.
It adds nullable `deleted_at` and `deleted_by_member_id` columns and active-query indexes.

## Safe production order
1. `npm install`
2. `npm run migrate:ezpk1:list` → only 0031 should be pending.
3. `npm run migrate:ezpk2:list` → only 0031 should be pending.
4. Capture fresh D1 Time Travel bookmarks for both DBs before applying.
5. `npm run migrate:ezpk1:remote`
6. `npm run migrate:ezpk2:remote`
7. Re-run both migration list commands; both should show no pending migrations.
8. `npm run deploy:dry-run`
9. `npm run deploy`

Do not run `npm audit fix` during this deployment. Do not restore Time Travel unless an incident requires recovery.

## Smoke test
- Super admin: Migration Inquiry shows Delete button.
- Sub admin with Requests permission: can view/reply/close/reopen, but no Delete button and DELETE API returns 403.
- Delete a test inquiry: it disappears from admin list and applicant list.
- Deleted inquiry replies remain in D1.
- Applicant can create a new inquiry after deletion.
- General member requests remain unchanged.
