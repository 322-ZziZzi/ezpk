# v390 Migration Tier Power Verification

Verified: 2026-08-10

## Scope

- Update Migration Step 4 from color-only tier names to the published migration grades.
- Show the published power range directly on each selectable tier card.
- Preserve the existing stored/API enum keys (`gray`, `blue`, `purple`, `gold`) so existing applications and Worker validation remain compatible.

## Published mapping

- `gold` → 특급 / Special → `>200M`
- `purple` → 고급 / Advanced → `90M-200M`
- `blue` → 중급 / Intermediate → `46M-90M`
- `gray` → 일반 / Normal → `0-46M`

The Step 4 card order is now highest to lowest: 특급 → 고급 → 중급 → 일반. The final review also shows the selected grade together with its displayed range.

## Data / API compatibility

- No Migration application payload field changed.
- `migrationTier` still stores one of `gray`, `blue`, `purple`, `gold`.
- Worker validation enum remains unchanged.
- D1 migration `0027_v390_migration_tier_power_ranges.sql` updates the previously prepared `migration_tier_settings` metadata to the new labels/ranges and enables range visibility.
- The published range notation is displayed as provided; Step 4 remains a manual selection and does not auto-classify the applicant from Vehicle 1/2 Power. This avoids inventing a boundary rule for the shared endpoints `46M`, `90M`, and `200M`.

## Localization

- Updated the tier names across all eight existing system UI locales: Korean, English, Portuguese, Vietnamese, Arabic, Japanese, Thai, and Traditional Chinese.
- Numeric power ranges remain language-neutral.

## Validation

- `node --check migration/migration.js`: PASS.
- `node --check admin/migration-manager.js`: PASS.
- Static assertions confirm all four published ranges and the high-to-low Step 4 order.
- All D1 migrations through `0027` apply sequentially to a disposable SQLite database.
- Final `migration_tier_settings` rows match the new labels/ranges and have `power_range_visible = 1`.
- ZIP CRC test: PASS.
