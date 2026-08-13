# EZPK v418 Multilingual Responsive Text-Fit Remediation Report

## Status

**SOURCE / STATIC VALIDATION: PASS**

Version: `4.1.8 / v418`  
Baseline: `EZPK-v417-deploy-ready.zip`

## Implemented remediation

- Preserved every existing grid/column/card layout. Existing CSS `grid-template-columns` declarations changed: **0**.
- Scoped legacy shared-header `nav` rules to `.site-header` so Home Quick Links and other content `<nav>` elements are no longer forced to `white-space: nowrap`.
- Added `/text-fit-v418.css` and `/text-fit-v418.js` to all **25 user-facing pages**.
- Added group-level `Normal → Compact (92%) → Tight (85%)` fitting.
- Tile/card controls allow natural wrapping up to two lines before shrinking.
- Compact controls remain single-line and are used only for header/small-control contexts.
- Same UI group receives the same fit stage to preserve visual consistency.
- Fit uses actual `scrollWidth/clientWidth`, `scrollHeight/clientHeight`, and rendered line count rather than translation character count.
- Tight mode may slightly reduce horizontal padding; unbreakable translated words can use emergency `overflow-wrap:anywhere` without changing the grid.
- Refit triggers include language change, resize/rotation, ResizeObserver changes, hidden UI becoming visible, `pageshow`, and font readiness.
- User-generated names, rankings, member/account data, and existing ellipsis surfaces are explicitly excluded.
- Native `<select>` elements are intentionally excluded from multiline fitting.
- Removed the old independent Season 6 mobile tab font `clamp()` and the mini-game result-button mobile shrink/nowrap rule so they do not double-shrink under v418.
- Added coverage for Home Quick Links, shared desktop/mobile navigation labels, account actions, Gateway mobile tabs, member gates, BGB/Capital War/Season 6/Vote tabs, Alliance Layout actions, Request actions, mini-game library/result/start controls, My/Signup translated buttons, and other explicit translated interactive controls.

## Root-cause repair

The reported French Home overflow was not only a translation-length issue. `style.css` contained global `nav` / `nav a` rules intended for the shared header. Because Home Quick Links are also a `<nav>`, `nav a { white-space: nowrap; }` prevented the existing wrapping rules from working. v418 scopes those legacy rules to `.site-header`.

## Validation

- `npm run predeploy`: **PASS**
- JS/MJS syntax: **67/67 PASS**
- CSS brace balance: **38/38 PASS**
- Text-Fit assets present: **25/25 user pages PASS**
- Existing grid declarations changed: **0**
- v417 existing paths removed: **0**
- D1 migrations: **30/30 byte-exact PASS**
- Historical v414/v415/v416/v417 guards: **byte-exact PASS**
- Home Quick Links 14-language font-width stress at 320/360/390/430 px: **56/56 predicted fit, 0 predicted overflow**. At 320 px French reaches Tight; at 360 px French reaches Compact; other tested cases fit within the three-stage policy. This is a deterministic font-width approximation, not a browser-runtime claim.

## Runtime boundary

The managed Chromium available in this validation environment has a mandatory `URLBlocklist: ["*"]`, which blocks local, file, and data navigation. Therefore a fresh browser viewport matrix could not be executed here without bypassing an environment security policy. No such bypass was attempted.

Before production promotion, run the supplied v418 runbook in a normal browser/deployment environment across the listed breakpoint boundaries.
