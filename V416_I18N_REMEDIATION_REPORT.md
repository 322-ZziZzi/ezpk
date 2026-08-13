# EZPK v416 — 14-Language I18N Remediation & Runtime Audit Report

**Version:** 4.1.6 / v416  
**Baseline:** `EZPK-v415-deploy-ready.zip`  
**Baseline SHA-256:** `f5f15678e55606a3b740e8703b74d8b6d02931ae415324c22a5dc991c996f867`  
**Audit date:** 2026-08-13

## Final classification

**SOURCE / STATIC I18N GATE: PASS**  
**14-LANGUAGE DOM RUNTIME MATRIX: 336 CLEAN + 14 TIP HARNESS-LIMITED**  
**UNEXPECTED RUNTIME ERRORS: 0**  
**V416 REMEDIATION SCOPE: PASS**

The 14 Tip combinations are not classified as application failures. The inline CDP harness injects the page into `about:blank`, which has an opaque origin; Tip calls `history.replaceState`, and Chromium blocks that operation before Tip initialization. A direct local HTTP-origin retry was attempted, but this environment blocks Chromium navigation to localhost. Tip remains covered by source/keyset/predeploy validation, while same-origin browser execution remains a deployment-environment gate.

## v416 changes

### Shared header
- Localizes the initial mobile menu `aria-label` in all 14 languages.
- Corrects the shared login modal close-button wiring: the localized close label now targets the actual × button rather than the backdrop.

### Request
- Localizes the Migration return link in all 14 languages.

### BGB
- Localizes `A TEAM`, `B TEAM`, preview close ARIA, tactical-map alt text, and team-list-preview alt text.
- Applies these values before protected BGB data is loaded so the initial DOM does not expose the English fallback.
- Preserves the user-approved fixed terms/facility names.

### Mini-games
- Adds `mini-game-i18n-v416.js` as the common 14-language mini-game UI/accessibility layer.
- Localizes translatable control labels, sound/canvas/joystick/control ARIA, mini-game library accessibility text, and common copy.
- Localizes Tank Battle `FIRE` / `AUTO AIM`, Missile Defense `FIRE`, Hero Merge directional/control accessibility labels, and the new-game shared copy.
- Localizes Zombie Defense dynamic HUD labels and dynamically created zombie accessibility names.
- Replaces the remaining fixed Hero Merge `COMBO` award path with the localized formatter.

### Late full-matrix remediation
- Removed the last non-English fixed `aria-label="Close"` leak from the shared login modal.
- Localized Capital War preview close ARIA, preview alt text, and preview brand during the initial gate render, not only after protected data loads.
- Re-scan result: **0 non-English fixed `Close` ARIA residuals**.

## User-approved fixed-term whitelist

The following are intentionally **not** treated as translation omissions:

- `EZPK`
- `BGB`
- `Discord`
- `CP`
- `Fighter`
- `Shooter`
- `Rider`
- `Leader`
- `Officer`
- `Core`
- `Support`
- `Reserve`
- `Member summary`
- `REFINERY`
- `MILITARY BASE`
- `HOSPITAL`
- `ALLOY FACTORY`
- `TOP 30`
- `322 EZPK WAR PORTAL`

Game-specific hero names and skill names are also intentionally fixed.

## Validation results

- `npm run predeploy`: **PASS**
- v416 guard: **PASS**
- JavaScript / MJS syntax: **63/63 PASS**
- Runtime matrix: **25 pages × 14 languages = 350 combinations executed**
- Clean combinations: **336**
- Known Tip audit-origin limitation: **14**
- Unexpected runtime-error combinations: **0**
- Zombie Defense dynamic 14-language HUD / zombie ARIA: **PASS**
- Hero Merge start-path fatal `ReferenceError` / `TypeError` / `SyntaxError`: **0**
- Non-English fixed `Close` ARIA after final patch: **0**
- D1 migrations: **30/30 byte-exact preserved**
- Historical v414 guard: **byte-exact preserved**
- Historical v415 guard: **byte-exact preserved**
- Logical baseline path deletion: **0**

## Runtime limitation

`wrangler deploy --dry-run` was not executed in this workspace because `node_modules/.bin/wrangler` is not installed. No `node_modules` directory is included in the deployment ZIP. This is recorded as **NOT EXECUTED**, not PASS or FAIL.

## Deployment interpretation

v416 is suitable as the next deploy-ready candidate for the confirmed i18n remediation scope. Before production promotion, execute the normal same-origin/browser smoke test (including Tip) and Wrangler dry-run in the deployment environment where those capabilities are available.
