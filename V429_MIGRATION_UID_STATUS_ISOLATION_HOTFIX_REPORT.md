# EZPK v429 Migration UID Status Isolation Hotfix Report

## Incident

On the public Migration application page, UID application-status lookup could fail even when the authoritative `migration_applications` row existed.

## Root cause

`GET /api/migration/status` resolved the migration application and then synchronously required two later inquiry features before it returned the core status:

1. insertion into `migration_inquiry_sessions`; and
2. lookup of `migration_inquiries ... WHERE deleted_at IS NULL`.

This made a public UID status read depend on optional migration-inquiry schema. A production database with no v401 inquiry tables, or with v401 inquiry tables but without the later v405 `deleted_at` column, could therefore turn a valid status lookup into an HTTP 500. The same endpoint is also used by the Step 1 duplicate-UID precheck, so this coupling affected both explicit status lookup and duplicate detection.

## v429 correction

- `migration_applications` is now the sole authority for the core UID status result.
- The endpoint first resolves `found / playerName / applicationStatus / updatedAt` independently.
- Migration inquiry session creation and latest inquiry summary are moved behind `optionalMigrationInquiryStatusEnhancement()`.
- Failure of inquiry-session insertion or inquiry-summary lookup is logged but does not suppress the core UID result.
- Inquiry summary supports the v401 schema by retrying without `deleted_at` when that column is absent.
- Missing inquiry tables are treated as an optional-unavailable condition.
- The response exposes `inquiryAvailable`; the Migration UI hides the inquiry CTA if a session could not be established, avoiding a link into a non-functional inquiry flow.
- `migration.js` is cache-busted to `v=4290` on the Migration page.

## Compatibility smoke test

Three D1/SQLite schema states were tested:

- through v394 / migration applications only: core UID status PASS; inquiry enhancement optional-unavailable;
- v401 inquiry tables without v405 soft-delete columns: core UID status PASS; inquiry session PASS; inquiry summary deleted_at compatibility fallback PASS;
- full v405 inquiry schema: core UID status PASS; inquiry session and summary PASS.

See `V429_SQLITE_COMPAT_SMOKE.json`.

## Protected scope

The following remain byte-exact versus v428:

- all 30 D1 migrations;
- all historical deploy guards through v428;
- `shared-header.js`;
- `style.css`;
- `header-fit-v424.js/css`;
- `admin/admin.js`;
- `request/request-admin.js`;
- `wrangler.jsonc`.

Therefore v427 administrator authority/header behavior, v428 Admin Request Board isolation, v425 Mini Games card flow, v424 PC Header, v421 mobile Alliance selector, and v420 discovery cue are not intentionally altered by this hotfix.
