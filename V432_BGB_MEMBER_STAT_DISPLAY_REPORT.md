# EZPK v432 — Admin BGB Member Stat Display

## Scope

v432 is a presentation-only Admin → BGB change over the confirmed v431 baseline.

The BGB member rows previously displayed the member rank, Industry Level value, and total Combat Power (`CP`). v432 replaces only that visible total-CP field with the member's Vehicle #1 power.

## Confirmed display contract

The following BGB member-row surfaces now use the same presentation:

- FINAL LINEUP selection list
- FINAL LINEUP PREVIEW
- Location assignment member list

Visible secondary stats:

`<Rank> · Industry Lv. <industry> · #1 <vehicle-1-power>`

Examples:

- `R4 · Industry Lv. i30 · #1 3.17G`
- missing Vehicle #1 value: `R3 · Industry Lv. i27 · #1 -`

## Data authority

`#1` is sourced only from the current Alliance Member record already returned by the administrator member API:

- `vehicle1PowerValue`
- `vehicle1PowerUnit`
- `vehicle1PowerNormalized`

The existing `EZPKVehiclePower.formatMember(member, 1, ...)` authority formats the value. v432 allows up to two decimals so values such as `3.17G` remain meaningful.

Migration application data is not consulted and total Combat Power is never used as a fallback when Vehicle #1 is missing.

## Intentionally unchanged

v432 does **not** change:

- BGB list sorting controls or their existing sort keys
- `compareVehiclePriority()`
- automatic BGB assignment
- refinery balancing and total-CP calculations
- BGB scoring, participation, wins/losses, or saved `bgb.json` contract
- Member Manager presentation outside the BGB panel
- Worker/API contracts
- D1 schema or migrations
- v431 migration-inquiry delete behavior
- v430 migration-applicant Request Board behavior
- v429 UID status lookup behavior
- v428 Request Board isolation
- v427 administrator authority/header shell
- v425 Mini Games layout and earlier responsive/header contracts

## Cache coherency

Only the changed administrator script is cache-busted on the administrator page:

`admin.js?v=4320`

The existing shared Header and Vehicle Power assets remain at their unchanged authorities/tokens.

## Static/smoke verification

`V432_BGB_DISPLAY_SMOKE.json` verifies:

- `3.17 G` → `3.17G`
- `987.5 M` → `987.5M`
- normalized-only Vehicle #1 data → the expected M/G value
- missing Vehicle #1 + present total CP → `-` (no CP fallback)

`v432-deploy-guard.mjs` additionally requires all three BGB member-row renderers to use `Industry Lv. + #1` and preserves the existing sort/assignment signatures.
