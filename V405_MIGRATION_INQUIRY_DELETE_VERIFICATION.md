# EZPK v405 Migration Inquiry Delete Verification

## Confirmed behavior
- Migration Inquiry delete authority: **super admin only** via `requireSuperAdmin`.
- Sub-admins with Request permission can still view/reply/close/reopen, but do not receive the delete control and the delete API rejects them.
- Delete model: **soft delete** using `deleted_at` + `deleted_by_member_id`.
- Delete also sets the thread to `closed` and preserves/sets `closed_at`, so a new inquiry can be opened for the same migration application.
- Applicant list/status, admin list, ownership lookup, admin reply/status paths all exclude `deleted_at IS NOT NULL` records.
- Replies are retained for audit/history and are not physically deleted.
- Admin audit action: `migration_inquiry_deleted`.
- Privacy UX: `MIGRATION · PRIVATE` in admin and `🔒 PRIVATE` on applicant inquiry cards.

## Validation
- Worker / request JS syntax: PASS.
- v404 predecessor migrations: **29/29 byte-identical**.
- New migration inventory: **30 total**, only `0031_v405_migration_inquiry_soft_delete.sql` added.
- Fresh SQLite migration cycles: **2/2 PASS**.
- Soft-delete functional probe: PASS.
  - deleted inquiry hidden from active query
  - existing reply preserved
  - new inquiry for same application allowed after deletion
- DUAL routing / both D1 binding guard: PASS.
