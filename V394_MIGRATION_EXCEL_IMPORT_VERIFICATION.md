# v394 Migration Excel Import Verification

## Scope
- Added super-admin-only migration application Excel import.
- Existing Excel export and image download remain unchanged for authorized migration admins.
- Added separate official import template: `admin/EZPK_이민신청_업로드양식_v1.xlsx`.

## UX / Permission
- Korean buttons: `업로드 양식 다운로드`, `엑셀 업로드`, `업로드 검토`, `신청서 N건 등록`.
- Import controls are hidden unless `adminLevel === super`.
- Preview, commit, and import-history APIs independently enforce `requireSuperAdmin` and return 403 for non-super admins.

## Import Safety
- .xlsx only, client file limit 5 MB.
- Max 500 non-empty application rows per import.
- Official template/version and exact header set are validated before preview.
- UID cells must be text cells and values must be exactly 16 digits.
- File-internal duplicate UIDs mark all duplicate rows as skipped.
- Existing non-deleted UIDs are skipped.
- Preview shows total / ready / duplicate / invalid counts and row-level reasons.
- Final commit revalidates all rows against current DB state.
- Imported records always start with `application_status=received` and `contact_status=not_contacted`.
- Imported records use `source=admin_excel_import` and retain `import_batch_id` provenance.
- Existing public submissions retain `source=public_form` by default.

## Idempotency / Audit
- Each commit uses a unique idempotency key.
- `migration_import_batches.idempotency_key` is UNIQUE.
- Replayed committed/partial requests return the prior batch result instead of inserting again.
- Processing-batch retries recognize rows already inserted by the same batch.
- Batch records store template version, original filename, SHA-256, actor, row counts, status, and timestamps.
- A migration admin activity log is written for each completed Excel import batch.
- Recent 20 import batches are shown in the super-admin upload modal.

## Template
- Template SHA-256: `b931d73f2b68d8944e0d8bdf8da7139e367ebb65c08eac7e434a8ad90c22ad02`
- UID column is preformatted as Text.
- Vehicle unit, industry level, spending type, and migration tier columns have spreadsheet data validation.
- Separate 안내 sheet documents version, required fields, limits, UID precision warning, and allowed values.

## Database
- Added migration `0029_v394_migration_excel_import.sql`.
- Added `migration_import_batches` table.
- Added `migration_applications.source` and `migration_applications.import_batch_id`.
- Existing v392 active-UID duplicate triggers remain unchanged and protect imports as a final DB-level guard.

## Validation Performed
- `node --check worker.js`: PASS.
- `node --check admin/migration-manager.js`: PASS.
- All migration SQL files sequentially applied to disposable SQLite DB: PASS.
- Migration application import provenance columns/table existence: PASS.
- Imported application insert with batch provenance: PASS.
- Existing DB duplicate UID trigger against an imported UID: PASS.
- Official XLSX template parsed/inspected after export: PASS.
