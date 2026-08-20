# EZPK v439 — Migration Pre-Application Intake Continuity

## Decision
The end of a migration period does **not** close the EZPK1 application intake. The portal may collect applications in advance of the next migration period.

## Runtime policy
- EZPK1 migration intake: **ENABLED**.
- EZPK2 remains archived and its intake remains disabled.
- Signed-out visitors: migration entry remains the first home content block.
- Signed-in users: migration entry remains hidden.
- Migration entry copy is restored to the open/recruiting state in all 14 supported languages.
- `/migration/` and its submit/status APIs remain available for EZPK1.

## Cycle reset policy
The v438 reset tooling is intentionally retained. It clears the previous cycle's applicant/inquiry/import/rate-limit data while preserving schema and `migration_tier_settings`. A reset does **not** change the intake feature flag, so new pre-applications may be accepted immediately after reset.

## Database migrations
No new D1 migration is required. Existing migration count remains 31; latest is `0032_v435_rank_review_cycles.sql`.
