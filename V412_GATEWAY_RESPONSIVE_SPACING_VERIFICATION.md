# EZPK v412 — Gateway Responsive Spacing Verification

## Scope
v412 is a spacing-only refinement over v411 for the `ezpk322.com` Gateway. It preserves the corrected Gateway width alignment, State #322 migration copy, migration-intake policy, `/dev/` join-code management, and `/api/db-test` security hardening.

## Confirmed desktop rhythm
- Bottom of the `322 서버 이민 신청` entry card → `연맹 선택` heading: **100px**.
- `연맹 선택` heading → supporting description: **10px**.
- Supporting description → EZPK1/EZPK2 alliance-card grid: **26px**.
- The migration-entry card and the total EZPK1/EZPK2 alliance-grid remain aligned to the same outer Gateway width.

## Confirmed mobile rhythm (`max-width: 760px`)
- Bottom of the `322 서버 이민 신청` entry card → `연맹 선택` heading: **100px**.
- `연맹 선택` heading → supporting description: **12px**.
- Supporting description → first alliance card: **22px**.
- EZPK1 card → EZPK2 card: **12px**.
- The one-column alliance-card layout is preserved.

## CSS contract
- Desktop `.gateway-migration-section{...padding:0 0 100px...}`.
- Desktop `.gateway-heading{...margin:0 auto 26px...}`.
- Desktop `.gateway-heading p{...margin:10px auto 0...}`.
- Mobile `.gateway-migration-section{padding:0 0 100px}`.
- Mobile `.gateway-heading{margin-bottom:22px}`.
- Mobile `.gateway-heading p{margin-top:12px...}`.
- Mobile `.gateway-grid{grid-template-columns:1fr;gap:12px}`.
- Gateway CSS cache key is advanced to `v=4120`.

## Preserved contracts
- Gateway global `section` padding collision remains neutralized.
- Korean Gateway heading remains `연맹 선택`.
- Server #322 migration copy remains unchanged.
- EZPK1 migration intake remains enabled; EZPK2 migration intake remains disabled-not-deleted.
- `/dev/` host-scoped Super Admin join-code management remains unchanged.
- `/api/db-test` continues to redact sensitive settings.

## Database
- Schema change: **NO**.
- Migration count: **30**.
- Latest migration: `0031_v405_migration_inquiry_soft_delete.sql`.
- New `0032`: **NO**.
- All 30 migration files are byte-identical to v411.

## Validation
- v412 deployment guard: PASS.
- JS/MJS syntax: 57/57 PASS.
- CSS parse: 37/37 PASS.
- Theme bootstrap: 27/27 PASS.
- Local HTML references: 382 checked / 0 missing.
- Fresh SQLite migration cycles: 2/2 PASS.
- v411 migration byte crosscheck: 30/30 PASS.
- ZIP CRC, internal checksum and path-safety checks are recorded in `V412_VALIDATION.json`.
