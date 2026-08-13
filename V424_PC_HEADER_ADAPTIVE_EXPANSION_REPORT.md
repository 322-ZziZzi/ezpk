# EZPK v424 — PC Header Adaptive Expansion / Readability Finalization

Date: 2026-08-13

## Result

v424 implements the confirmed PC Header remediation on top of v423 without changing mobile/tablet navigation, shared authentication behavior, Worker/API contracts, or the D1 migration baseline.

## Why v424 was needed

v423 corrected the severe v422 readability regression by restoring a readable Primary Navigation font floor. Live inspection then showed that wide PC layouts still left meaningful unused space between the Brand and the right-side Alliance / Account / Language action cluster. The Header therefore looked undersized even though enough horizontal capacity remained.

v424 changes the fit model from "protect a small fixed Primary set" to "use the real middle Header allocation intelligently while preserving readability."

## Confirmed PC Header policy

- Primary Navigation typography:
  - Normal: 15px
  - Compact: 14.5px
  - Tight: 14px
  - hard runtime/static floor: 14px
- `More` uses the same readable typography.
- The middle grid track between Brand and the right-side action cluster is the Navigation allocation and is center-aligned within that real available space.
- Normal 15px typography is kept whenever rendered geometry fits. Compact/Tight are not entered merely to expose extra links.
- Extra links are promoted out of `More` only when actual rendered geometry leaves sufficient spare space.
- New promotion requires at least 24px edge breathing room; an already-promoted item is retained down to 8px. This hysteresis prevents resize-boundary flapping.
- Signed-in promotion priority: Season 6 → Tips → Request Board.
- Guest/non-member public promotion priority: Mini Games → Account Market.
- If the current page is inside `More`, it is promoted to Primary first whenever possible. If needed, the lowest-priority non-active Primary item is moved to `More`, while preserving at least four accessible Primary destinations.
- Authenticated non-active-member layouts that begin with only three direct public items must promote an accessible public destination to satisfy the four-item minimum when geometry permits.
- Promoted links retain deterministic ordering. Base Primary order is preserved; promoted links are ordered by the fixed promotion priority instead of by the timing of resize events.
- `More` is hidden when it contains no remaining links and receives active state only when an active destination remains inside it.
- Member nickname truncation is isolated to the nickname. Rank and dropdown indicators are protected from flex shrink.
- 1200–1439px retains the translated short Alliance label; >=1440px retains the full Alliance Select label. Full accessible `aria-label` / `title` remain unchanged.

## Recalculation / stale-state protection

Each layout attempt first restores every relocated anchor to its canonical DOM origin. Normal → Compact → Tight is then evaluated from real geometry.

- resize: preserves the previous promotion set only as hysteresis input;
- language change: hard reset and full recalculation;
- authentication change: hard reset and full recalculation;
- shared navigation rebuild: hard reset and full recalculation;
- pageshow / fonts ready: hard reset and full recalculation.

The `ezpk-header-layout-change` path invokes the v424 fitter synchronously, reducing the visible one-frame "base menu then reflow" effect during navigation/language/auth rebuilds.

## Runtime audit fields

v424 exposes Header audit state via data attributes, including:

- expected navigation links;
- visible Primary count;
- minimum required Primary count;
- promoted / demoted count;
- Primary font floor;
- Primary/action collisions;
- Header out-of-bounds count;
- Navigation overflow count;
- Navigation edge margin;
- active-page-in-Primary status;
- More-empty status;
- unresolved fit count.

## Preserved boundaries

The following v423 assets/contracts are byte-identical in v424:

- `shared-header.js` — therefore v421 mobile Alliance selector logic remains unchanged;
- `style.css` — therefore v420 hamburger discovery cue and v421 mobile selector styling remain unchanged;
- `worker.js`;
- `wrangler.jsonc`;
- all 30 D1 migrations;
- all 22 historical deploy guards present in v423.

v424 only activates the new `header-fit-v424.js/css` on the 23 shared user pages. The previous fitters remain in the archive for provenance but have zero active page references.

## Validation

- `npm run predeploy`: PASS.
- v424 deploy guard: PASS.
- JS/MJS syntax: PASS.
- JSON parse: PASS.
- shared user pages: 23/23 reference `header-fit-v424.js/css?v=4240`.
- active v423/v422/v419 fitter references on those pages: 0.
- v423 visible paths preserved: 363/363 before v424 evidence additions; no baseline path deletion.
- D1 migrations: 30/30 byte-exact vs v423.
- historical deploy guards: 22/22 byte-exact vs v423.

A managed local Chromium headless run was attempted but the process did not terminate and produced no DOM output before the timeout. No browser PASS is claimed. Final deployment still requires the live-host visual matrix described in `V424_DEPLOY_VALIDATION_RUNBOOK.md`.
