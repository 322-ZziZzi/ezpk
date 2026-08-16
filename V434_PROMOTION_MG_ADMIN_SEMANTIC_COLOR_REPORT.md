# EZPK v434 — Promotion M/G + Admin Semantic Light Theme Report

## Scope

v434 is a focused UX/data-contract update over v433. It preserves the v433 BGB Draft/Published contract and prior authentication/request/migration fixes while changing only promotion requirement display-unit handling and EZPK2 light-theme semantics.

## 1. Promotion requirement M/G support

Admin → Member Management → Promotion Conditions now uses a numeric Vehicle #1 requirement plus an explicit `M` / `G` selector for both R2 and R3.

The stored promotion rule keeps three values together:

- `vehicle1PowerValue` — the administrator-entered display value.
- `vehicle1PowerUnit` — `M` or `G`, preserved exactly for display.
- `vehicle1PowerNormalized` — normalized comparison authority in M units.

Examples:

- `500 M` → normalized `500` → member display `필요 500M`.
- `0.5 G` → normalized `500` → member display `필요 0.5G`.

The two rules compare identically but do not overwrite the administrator-selected display unit. Existing normalized-only legacy rules remain compatible and are represented as G values until explicitly re-saved with a chosen unit.

No D1 migration is required because `promotion_rules_v1` is already JSON stored in the existing `settings` table.

## 2. Member promotion light-theme contrast

The existing promotion layout and wording are preserved. EZPK2 only receives semantic state colors:

- Complete: `#15803D`
- Missing/current deficit: `#C2410C`
- Required/goal value: `#A16207`
- In progress: `#1D4ED8`
- Pending/unconfirmed: `#B45309`

Core requirement cards use their state color on the border/inset indicator. Activity rows use state-colored separators. White card backgrounds remain unchanged.

## 3. EZPK2 Admin semantic light-theme system

Neutral foundation:

- Page: `#F1F4F8`
- Surface: `#FFFFFF`
- Subtle/Hover: `#F8FAFC`
- Primary text: `#0B1220`
- Secondary text: `#344054`
- Muted text: `#5D6978`
- Border: `#CBD5E1`
- Strong/input border: `#94A3B8`

Semantic action/status colors:

- Primary / selection / focus: `#1D4ED8`
- Success / active / publish / promotion confirmation: `#15803D`
- Goal / criteria / important value: `#A16207`
- Missing / validation error: `#C2410C`
- Pending: `#B45309`
- Destructive danger: `#B91C1C`
- Support / private: `#7E22CE`
- System: `#0F766E`

Admin navigation groups use the same semantic identities. Primary Save actions use Blue, Publish/Activate/Promotion confirmations use Green, secondary actions use White/Slate, and destructive actions use Red. Success/error/info Toast states are visually separated.

The rules are scoped to EZPK2 Admin selectors and the EZPK2 promotion card. General public-page layout/theme is not globally recolored.

## 4. Compatibility and preserved contracts

Preserved:

- v433 BGB Draft/Published behavior and last-exposure UX.
- v432 BGB `Industry Lv. + #1` member display.
- Existing BGB sorting, auto-assignment, score/balance behavior.
- Admin authentication/Header shell fixes.
- Admin Request Board isolation and migration applicant Request access.
- Migration UID lookup isolation and inquiry compatibility.
- 30 D1 migrations byte-exact from v433.
- Historical deploy guards byte-exact from v433.

## 5. Validation

- Promotion unit smoke: PASS (`500M == 0.5G`, display unit preservation PASS).
- Semantic color contrast smoke: PASS; all tested foreground semantic/neutral colors exceed WCAG AA 4.5:1 against white.
- D1 SQLite schema smoke: 30/30 PASS.
- v434 deployment guard: PASS.
- Final syntax/JSON/checksum/ZIP integrity are recorded in `V434_VALIDATION.json`.

Live visual verification on the production EZPK2 host remains the final browser gate for actual fonts, device scaling, and cached asset behavior.
