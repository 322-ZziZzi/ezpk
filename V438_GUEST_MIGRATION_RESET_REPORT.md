# EZPK v438 — Guest-First Migration Entry + Migration Cycle Reset

## Scope

Base: `EZPK-v437-deploy-ready.zip` (`4.3.7`).

v438 changes only the migration-cycle presentation and operator reset workflow. The v437 SINGLE-alliance routing, EZPK2 archive behavior, member-management baseline, and 31-migration schema are preserved.

## Home behavior

- `#homeMigrationEntry` is the first element inside `.home-main`.
- It starts with the HTML `hidden` attribute while authentication is unresolved.
- When auth resolves as unauthenticated, `home-v319.js` shows the migration entry.
- Any authenticated session hides the migration entry, including non-active member states.
- The existing 14-language migration entry renderer and `/migration/` destination are preserved.

## End-of-cycle D1 reset

Reset target: `ezpk-members` only.

Cleared:

- `migration_applications`
- `migration_import_batches`
- `migration_rate_limits`
- `migration_inquiry_sessions`
- `migration_inquiries`
- `migration_inquiry_replies`
- migration-category / migration-inquiry admin activity rows that can retain applicant-cycle details
- AUTOINCREMENT sequences for the fully emptied migration-cycle tables

Preserved:

- `migration_tier_settings`
- members and admin accounts
- general non-migration admin activity logs
- schema and `_cf_KV`
- all migration files through `0032_v435_rank_review_cycles.sql`
- EZPK2 archived D1 database (not deployment-bound)

## Operator safety

`operations/v438-reset-migration-cycle.ps1` requires `-ConfirmReset`, verifies the target, captures pre-reset counts, exports a full remote SQL backup, performs the reset, and checks post-reset counts.

The deploy artifact does **not** automatically execute a destructive production reset.
