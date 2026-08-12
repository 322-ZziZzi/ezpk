# EZPK v411 — Gateway Desktop Spacing Verification

## Scope
v411 is a spacing-only refinement over v410 for the `ezpk322.com` Gateway desktop layout. It does not change database schema, Worker business logic, migration intake policy, DEV join-code management, or the corrected Gateway width alignment.

## Confirmed desktop rhythm
- Bottom of the `322 서버 이민 신청` entry card → `연맹 선택` heading: **77px**.
- `연맹 선택` heading → supporting description: **10px**.
- Supporting description → EZPK1/EZPK2 alliance-card grid: **26px**.
- The migration-entry card and the total EZPK1/EZPK2 alliance-grid continue to use the same outer `1080px` Gateway container and remain width-aligned.

## CSS contract
- `.gateway-migration-section{width:100%;padding:0 0 77px...}`
- `.gateway-heading{...margin:0 auto 26px;padding:0...}`
- `.gateway-heading p{...margin:10px auto 0...}`
- `.gateway-grid{display:grid;width:100%;padding:0...}`

The mobile overrides from v410 are intentionally preserved (`32px` migration-section bottom spacing and `22px` heading-to-grid spacing at `max-width:760px`).

## Preserved v410 contracts
- Gateway global `section` padding collision remains neutralized.
- Korean Gateway heading remains `연맹 선택`.
- Server #322 migration copy remains unchanged.
- EZPK1/EZPK2 migration intake policy remains unchanged.
- `/dev/` host-scoped Super Admin join-code management remains unchanged.
- `/api/db-test` sensitive-settings redaction remains unchanged.

## Database
- Schema change: **NO**.
- Migration count: **30**.
- Latest migration: `0031_v405_migration_inquiry_soft_delete.sql`.
- New `0032`: **NO**.
- All 30 migration files are byte-identical to v410.

## Validation
- v411 deployment guard: PASS.
- JS/MJS syntax: 56/56 PASS.
- CSS parse: 37/37 PASS.
- Theme bootstrap: 27/27 PASS.
- Local HTML references: 382 checked / 0 missing.
- Fresh SQLite migration cycles: 2/2 PASS.
- v410 migration digest/byte crosscheck: 30/30 PASS.
- ZIP CRC / internal checksum / path-safety validation: required and recorded in `V411_VALIDATION.json`.
