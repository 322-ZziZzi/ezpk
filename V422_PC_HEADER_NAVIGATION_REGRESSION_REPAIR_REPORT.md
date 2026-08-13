# EZPK v422 — PC Shared Header Navigation Regression Repair

## Status

**SOURCE / STATIC REMEDIATION: PASS**  
**FRESH LIVE-HOST MULTI-VIEWPORT BROWSER GATE: REQUIRED**

## User-reported critical regression

After the PC Alliance Select overflow remediation introduced in v419, the translated shared PC Header could lose all visible primary navigation. The defect affects the common multilingual Header rather than one page-specific translation.

## Root cause

`header-fit-v419.js` solved action-cluster overflow by repeatedly moving the last direct Primary Navigation link from `#desktopNavItems` into the `More` menu. The loop had no minimum-visible-primary invariant. Under a constrained multilingual action cluster (Alliance Select + Home/Login/Sign Up or member account + Current Language), all direct primary links could therefore be reparented out of the top bar. Static width checks covered action labels but did not prove a minimum visible primary-navigation count. The v419 report also left the fresh managed-browser multi-viewport runtime matrix unexecuted.

## v422 correction

- Retires `header-fit-v419` from all 23 shared user pages; historical v419 files remain present for provenance only.
- Adds `header-fit-v422.js/css`.
- The v422 fitter **never moves, removes, prepends, or appends Primary Navigation links**.
- Primary Navigation remains owned by `#desktopNavItems` at every desktop fit level.
- Fit levels `Normal -> Compact -> Tight` only reduce Header gaps, Primary Navigation typography, and action-control typography/padding.
- Adds runtime audit fields `data-ezpk-header-primary-expected` and `data-ezpk-header-primary-visible`; unresolved geometry sets `data-ezpk-header-fit-overflow=true` but never hides the menu.
- Desktop Alliance Select uses the full translated accessible label (`aria-label` + `title`). At 1200–1439px it displays the shorter translated `ALLIANCE` label; at >=1440px it displays the full translated `ALLIANCE SELECT` label.
- <=1199px behavior remains v421 mobile/tablet Drawer ownership.
- v421 Guest-top / authenticated-bottom dual Alliance selector behavior is unchanged.

## Preservation

- DB migrations: unchanged.
- Worker/API contract: unchanged.
- v421 mobile Alliance selector: unchanged.
- v420 hamburger discovery cue: unchanged.
- v417 language authority and v419 body Text-Fit: unchanged.
- PC Alliance Select remains DUAL-only.

## Required live-host gate

Verify Guest, Member, and Admin-capable member at 1200, 1201, 1280, 1380, 1381, 1439, 1440, 1600, and 1920 CSS px in all 14 languages. At each width/language: direct Primary Navigation must remain visible; Alliance Select/Account/Language may compact but must not overlap; `data-ezpk-header-primary-visible` must equal `data-ezpk-header-primary-expected`; `data-ezpk-header-fit-unresolved` should be `0`.
