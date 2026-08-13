# EZPK v423 — PC Header Readability / Fit Remediation

## Status

**SOURCE / STATIC REMEDIATION: PASS**  
**LOCAL MANAGED CHROMIUM VISUAL MATRIX: NOT COMPLETED (host Chromium process did not terminate under headless dump; no false PASS recorded)**  
**FRESH LIVE-HOST MULTI-VIEWPORT VISUAL GATE: REQUIRED BEFORE PRODUCTION PROMOTION**

## User-reported regression

The v422 PC shared Header kept Primary Navigation present, but its fit CSS could reduce the direct menu typography to `11px` in Normal, `10.3px` in Compact, and `9.5px` in Tight. The resulting `Vote / BGB / Capital War / Members / More` row was visibly too small even when the Header still had usable space.

## v423 correction

### 1. Primary Navigation typography is protected

- Normal: `14px`
- Compact: `14px`
- Tight: `13.5px`
- Runtime/static regression floor: `>=13px`
- `More` uses the same readable floor.

Primary Navigation is no longer the first space-recovery target.

### 2. Real geometry decides whether compaction is needed

The fitter begins every pass by restoring all temporarily moved Primary links and resetting the Header to `normal`. It then measures actual rendered geometry:

- Primary/More versus Alliance/Account/Language collision,
- Header boundary escape,
- Primary items outside the assigned nav region,
- computed Primary font floor.

This replaces stale prior fit state and prevents a previously selected `tight` state from surviving an unrelated resize or language change.

### 3. Space-recovery order

`normal -> compact -> tight` now reduces geometry around the text first:

1. Header column gap,
2. nav item gap,
3. Alliance selector max width / padding,
4. Account action padding,
5. member nickname max width (ellipsis only on the nickname data field),
6. language control max width / padding.

The 1200–1439px compact Alliance label and >=1440 full Alliance label introduced in v422 remain. Full translated Alliance Select text remains available through `aria-label` and `title`.

### 4. Safe More fallback

Only if rendered geometry still fails after Compact/Tight may trailing Primary links move to `More`.

Hard invariant:

`MIN_VISIBLE_PRIMARY = 4`

The fitter will not move a Primary link if doing so would leave fewer than four direct Primary links (or fewer than the total when the menu itself has under four items). Moved links retain their original ordering and are restored before every new measurement. If the moved link is active, `More` receives the active state.

### 5. Account and language pressure containment

- member nickname receives a bounded max width + ellipsis;
- rank badge remains fixed;
- account and language padding shrink before Primary type;
- long member/user data cannot force the Primary Navigation down to tiny typography.

## Runtime audit fields

v423 exposes:

- `data-ezpk-header-primary-expected`
- `data-ezpk-header-primary-visible`
- `data-ezpk-header-primary-min-required`
- `data-ezpk-header-primary-moved`
- `data-ezpk-header-primary-font-floor`
- `data-ezpk-header-primary-collision`
- `data-ezpk-header-primary-out-of-bounds`
- `data-ezpk-header-primary-nav-overflow`
- `data-ezpk-header-fit-unresolved`

These make the visual invariants machine-readable on a live host.

## Preservation

- v421 mobile/tablet Alliance selector: unchanged.
- Guest selector top / authenticated selector bottom: unchanged.
- Cross-Alliance authentication remains host-scoped: unchanged.
- v420 hamburger discovery cue: unchanged.
- v417 language authority / v419 body Text-Fit: unchanged.
- DB/API/Worker contracts: unchanged.
- 30 D1 migrations: byte-exact against v422.
- Historical deployment guards through v422: byte-exact retained.

## Static gate result

- shared user pages with v423 fitter: 23/23
- active v422/v419 fitter references: 0
- Primary explicit font values: 14 / 14 / 13.5px
- More explicit font values: 14 / 14 / 13.5px
- Primary font floor policy: PASS
- minimum visible Primary = 4 guard: PASS
- Normal reset before every measurement: PASS
- geometry collision logic: PASS
- self-triggering MutationObserver fit loop: absent
- `More` active synchronization: PASS

## Required live-host gate

Validate Guest and authenticated Member/Admin-capable Header states for all 14 languages at:

`1199 / 1200 / 1201 / 1280 / 1366 / 1440 / 1600 / 1920 CSS px`

At every desktop width (`>=1200`):

- Primary font >=13px,
- direct Primary visible count >= `data-ezpk-header-primary-min-required`,
- Primary/action collision = 0,
- out-of-bounds = 0,
- nav overflow = 0,
- no duplicate moved Primary item,
- active page remains visible directly or via active `More`,
- no stale Tight state after language change / resize / pageshow.
