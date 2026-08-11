# v392 Migration UID Duplicate Guard Verification

Verified: 2026-08-11

## Scope

- Changed duplicate policy from active-only (`received`, `reviewing`, `approved`) to every non-deleted migration application, including `rejected`.
- Duplicate submission message in Korean is now: `이미 신청이 접수된 UID입니다. 신청 현황 조회에서 현재 상태를 확인해 주세요.`
- Equivalent duplicate guidance was updated for all eight existing Migration locales.
- Step 1 checks a valid 16-digit UID before moving forward. If the UID already exists, Step 1 stays open, the duplicate message is shown at the UID field, and the existing status lookup card is prefilled with the current status when available.
- `POST /api/migration/applications` independently rejects the same non-deleted UID with `409 MIGRATION_APPLICATION_EXISTS`, so bypassing the browser UI cannot create a duplicate.
- Added D1 insert/update triggers to close concurrent-request and administrator-edit/restore races.
- Soft-deleted records are excluded from the duplicate rule. An administrator must explicitly delete a record before that UID can be submitted again.

## Database migration

- `migrations/0028_v392_migration_uid_duplicate_guard.sql`
- The migration adds guards without rewriting historical application rows. Any duplicate rows that already existed before v392 are preserved for administrator review; v392 prevents creation of new non-deleted duplicates.
- Existing active-status unique index from v387 remains in place as an additional constraint.

## Expected behavior

- Existing `received` UID → duplicate blocked.
- Existing `reviewing` UID → duplicate blocked.
- Existing `approved` UID → duplicate blocked.
- Existing `rejected` UID → duplicate blocked.
- Existing soft-deleted UID only → new application allowed.
- Concurrent/direct API insert for the same non-deleted UID → database trigger aborts the duplicate.
- Existing historical duplicate rows, if any, remain manageable; ordinary status changes do not create new duplicates and are not blocked solely because of historical data.
- Admin changing an application UID to another non-deleted application's UID → blocked.
- Admin restoring a deleted application while another non-deleted application owns that UID → blocked.

## Verification performed

- `node --check migration/migration.js` PASS.
- `node --check worker.js` PASS.
- All D1 migrations `0001` through `0028` applied sequentially to a disposable SQLite database: PASS.
- Database guard tests for existing `received`, `reviewing`, `approved`, and `rejected` UIDs: PASS; a second non-deleted insert is blocked with `MIGRATION_APPLICATION_EXISTS`.
- Soft-delete then reapply behavior: PASS.
- Restore conflict guard: PASS.
- Administrator UID-edit conflict guard: PASS.
- Static checks for Step 1 duplicate precheck, status prefill, eight-locale duplicate guidance, final POST duplicate check, trigger-error mapping, and v392 cache busting: PASS.
- v391 → v392 scope diff: 0 removed paths, 3 changed paths, 2 added paths: PASS.
- No active-status-only UID duplicate query remains in migration application handling: PASS.
