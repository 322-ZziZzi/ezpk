# v391 Migration UID Status Lookup Verification

Verified: 2026-08-11

## Scope

- Added a UID-based migration application status lookup card at the bottom of Migration Step 1.
- Lookup accepts the same 16-digit Game UID format used by the migration application.
- Public result states map directly to the existing authoritative application states:
  - `received` → Received / 접수 중
  - `reviewing` → Under Review / 검토 중
  - `approved` → Approved / 승인
  - `rejected` → Rejected / 거절
- The lookup returns the latest non-deleted application for the UID, so a new application after a prior rejection displays the newest state.
- The public API returns only `found`, `applicationStatus`, and `updatedAt`; it does not expose applicant content, Discord, administrator memo, contact status, or rejection reason.
- Added a lookup-specific IP rate limit using a separately scoped salted hash in the existing temporary `migration_rate_limits` table.
- Added localized lookup UI for all eight existing Migration locales.
- No D1 schema migration is required.

## API

- `GET /api/migration/status?uid=<16-digit-uid>`
- Guest-only, matching the existing public Migration page behavior.
- Invalid UID: `400 VALIDATION_ERROR`
- Not found: `200 { ok: true, data: { found: false } }`
- Lookup rate limit: `429 MIGRATION_STATUS_RATE_LIMITED`

## Verification performed

- `node --check migration/migration.js` PASS.
- `node --check worker.js` PASS.
- All existing D1 migration SQL files applied sequentially to a disposable SQLite database: PASS.
- Latest non-deleted UID query behavior tested for rejected → reapplication received ordering: PASS.
- Worker endpoint mock integration verified all four states, not-found behavior, invalid UID validation, and lookup-specific rate limiting: PASS.
- Static checks verified Step 1 lookup rendering, 8-locale status text, API route, CSS, and v391 cache-busting references: PASS.

## Database impact

None. The feature uses the existing `migration_applications.application_status`, `game_uid`, `deleted_at`, and `updated_at` columns plus the existing `migration_rate_limits` table.
