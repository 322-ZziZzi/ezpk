# v397 Migration Excel Import Compatibility Verification

## Root Cause Addressed
- v396 Preview queried `migration_applications.import_batch_id` unconditionally.
- If deployment used `wrangler deploy` without first applying v394 migration `0029_v394_migration_excel_import.sql`, Preview failed with an uncaught D1 error and surfaced only a generic server failure.

## v397 Behavior
- Preview existing-UID lookup no longer depends on `import_batch_id`.
- Import endpoints detect whether the v394 audited-import schema is present.
- When present: existing audited batch/idempotency/provenance behavior is unchanged.
- When absent: safe compatibility mode imports valid rows into the pre-0029 `migration_applications` schema without runtime DDL.
- Compatibility mode still revalidates every row, skips existing DB UIDs, skips every row of a file-internal duplicate UID, and relies on the v392 DB duplicate guard for race safety.
- No runtime schema mutation is performed, so migration 0029 can still be applied later normally.
- Import history returns an explanatory compatibility-mode notice rather than a 500 error when the batch table does not exist.

## Error Visibility
- Preview and Commit failures remain visible inside the modal and include HTTP status.
- Generic INTERNAL_ERROR / REQUEST_FAILED codes now have operator-readable Korean messages.

## Uploaded Workbook Reproduction
- `EZPK_이민신청_업로드양식_v1(1).xlsx`: 64 non-empty data rows.
- Required sheets/version/headers: PASS.
- UID cells stored as text: 64/64 PASS.
- 16-digit numeric UID validation: 64/64 PASS.
- File-internal duplicate UID: 0.
- Required field/range validation before DB duplicate checks: 64/64 PASS.

## Migration Integrity
- Existing migration SQL files are not modified.
- Migration 0029 remains the canonical path to enable audited import batches and row provenance.

## Runtime-Style SQL Verification
- Disposable SQLite with migrations 0001-0028 only: compatibility insert PASS.
- v392 active-UID duplicate trigger after compatibility insert: PASS (`MIGRATION_APPLICATION_EXISTS`).
- Canonical migration 0029 applied after compatibility-mode insert: PASS; existing row received `source=public_form`, `import_batch_id=NULL`.
- Disposable SQLite with all 28 migrations: audited batch table + `source=admin_excel_import` / `import_batch_id` insert PASS.
- `node --check worker.js`: PASS.
- `node --check admin/migration-manager.js`: PASS.
