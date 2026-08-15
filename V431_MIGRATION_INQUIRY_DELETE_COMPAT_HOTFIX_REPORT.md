# EZPK v431 — Migration Inquiry Delete Compatibility Hotfix

## Scope

v430 restored migration-applicant Request Board access across both the v401 inquiry schema and the later v405 soft-delete schema. One administrator-only path still intentionally rejected deletion on the v401 schema with `MIGRATION_INQUIRY_SOFT_DELETE_SCHEMA_PENDING`.

The production symptom was therefore deterministic: a super-admin could read and manage a migration inquiry, but pressing **Delete** returned the schema-pending code whenever `migration_inquiries.deleted_at` had not yet been deployed remotely.

## Root cause

`handleAdminMigrationInquiryDelete()` had only one deletion implementation:

- update `migration_inquiries.deleted_at` / `deleted_by_member_id`;
- if the columns were missing, return HTTP 409 `MIGRATION_INQUIRY_SOFT_DELETE_SCHEMA_PENDING`.

That protection avoided accidental destructive deletion, but it made the administrator Delete command non-functional on the already-supported v401 inquiry schema.

## v431 contract

Deletion remains restricted to `requireSuperAdmin()`.

1. **v405+ schema:** keep the existing non-destructive soft delete. The row and thread replies remain stored for audit/history.
2. **v401 compatibility schema:** when and only when the soft-delete columns are missing, delete child reply rows first and then delete the exact inquiry row using both internal `id` and `public_id`.
3. The inquiry delete must affect exactly one parent row. A stale/raced/mismatched target returns `MIGRATION_INQUIRY_DELETE_STATE_CHANGED` instead of deleting another row.
4. Admin Audit keeps the pre-delete metadata and records `deleteMode` as either `soft-delete` or `hard-delete-compat`.
5. `MIGRATION_INQUIRY_SOFT_DELETE_SCHEMA_PENDING` is no longer returned by the active v431 delete handler.

## Compatibility smoke

`V431_DELETE_COMPAT_SMOKE.json` executes the real schema definitions using SQLite:

- migrations through `0030`: expected missing-`deleted_at` error is reproduced; compatibility hard delete removes the inquiry and its reply rows; PASS.
- migrations through `0031`: soft delete changes exactly one row, preserves the inquiry and replies, sets `deleted_at`, and closes the inquiry; PASS.

## Preserved contracts

- No D1 migration bytes changed.
- Migration applicant UID lookup/session/Request Board behavior from v429/v430 is unchanged.
- Administrator auth/header fixes from v426/v427 are unchanged.
- Request Board isolation from v428 is unchanged.
- v425 Mini Games, v424 PC Header, v421 mobile Alliance selector, and v420 discovery cue are unchanged.
