# EZPK v410 — Gateway / DEV Join Code Verification

## Scope

v410 is a code/UI/security refinement over v409. It does **not** add or modify any D1 schema migration.

### Gateway PC correction

- Explicitly neutralizes the global `section { padding: 78px 4vw; }` spacing on the Gateway heading and alliance grid.
- `.gateway-heading` now has `padding:0` and keeps the confirmed compact rhythm:
  - title → description: 10px
  - description → alliance cards: 16px
- `.gateway-grid` now has `padding:0` and `width:100%`.
- The EZPK1 migration-entry card remains `width:100%` in the same 1080px Gateway container.
- Therefore the migration card outer width and the total EZPK1/EZPK2 alliance-grid outer width share the same left/right guides on desktop.
- Korean heading changed from `연맹을 선택해 주세요` to `연맹 선택`.
- Confirmed State #322 migration copy from v409 remains unchanged.

### `/dev/` alliance join-code management

- Each alliance host manages only its own scoped D1 setting `alliance_join_code`.
  - `ezpk1.ezpk322.com/dev/` → EZPK1 D1
  - `ezpk2.ezpk322.com/dev/` → EZPK2 D1
- The management UI is visible only for an authenticated Super Admin.
- The Worker independently enforces Super Admin authorization on both metadata read and update endpoints.
- Dedicated endpoints:
  - `GET /api/dev/alliance-join-code`
  - `PUT /api/dev/alliance-join-code`
- Current code plaintext is never returned by the management endpoint.
- Safe metadata only: site/display name, configured state, updated time, updated-by.
- New code validation: 6–32 characters, `A-Z a-z 0-9 _ -`.
- New code and confirmation must match.
- A final confirmation modal warns that the prior code becomes invalid immediately.
- No grace period: successful update immediately replaces the prior code for new signups.
- Existing members and sessions are unaffected.
- Update rate limit: max 5 successful join-code updates by the same admin per minute.
- Audit action: `alliance_join_code_updated`; old/new plaintext is never written to audit data.
- The static DEV signup tester no longer contains the default join code as a pre-filled plaintext value.

### `/api/db-test` hardening

`GET /api/db-test` no longer returns `SELECT key, value FROM settings`. It now returns database-health metadata only and explicitly marks sensitive settings as redacted. This prevents `alliance_join_code` and other settings values from being exposed through the diagnostic API.

## Database baseline

- Migration count: 30
- Latest migration: `0031_v405_migration_inquiry_soft_delete.sql`
- v410 migration files are byte-identical to the v409 migration baseline.
- No `0032` migration is introduced.

## Validation performed

- v410 deploy guard: PASS
- JS/MJS syntax: 55/55 PASS
- CSS parse: 37/37 PASS
- HTML index theme bootstrap: 27/27 PASS
- Local HTML asset references: 382 checked / 0 missing
- Fresh SQLite migration cycle 1: 30/30 PASS
- Fresh SQLite migration cycle 2: 30/30 PASS
- v409 migration digest comparison: 30/30 byte-exact PASS
- Old `/api/db-test` settings-value query: absent
- Gateway global-section collision: explicit heading/grid padding reset present
- DEV plaintext default join code: removed from rendered DEV HTML

## Remaining operator checks

The build container does not replace the production/operator Cloudflare check. Before deploy, run `npm run deploy:dry-run` on the operator machine. After deploy, perform desktop/mobile production smoke checks on the Gateway and both alliance DEV hosts.
