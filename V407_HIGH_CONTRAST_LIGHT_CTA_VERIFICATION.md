# EZPK v407 High-Contrast Light Theme + Strong CTA Verification

## Confirmed implementation
- Source baseline: `EZPK-v406-deploy-ready`.
- Package version: `4.0.7`.
- 27/27 `index.html` pages keep the synchronous host-first theme bootstrap.
- 27/27 pages load `/ezpk-theme.css?v=4070`.
- EZPK2 browser `theme-color` bootstrap is updated to `#f1f4f8`.
- EZPK2 page background, passive card border, interactive control border and shadows are strengthened.
- Primary CTA tokens are `#e2a51b` / `#1c1400` with dedicated Hover and Active surfaces.
- Secondary CTA tokens are `#dfe5ed` / `#172033` with dedicated Hover and Active surfaces.
- Header guest hierarchy is explicitly `Sign Up = Primary`, `Login = Secondary` on desktop and mobile.
- Login modal submit is Primary; Create Account switch action is Secondary.
- Sign Up submit is Primary; Login/back action is Secondary.
- Inputs/Selects/Textareas use a stronger control border and Gold focus ring.
- Password visibility controls use the Secondary control hierarchy instead of a low-contrast icon-only treatment.
- Admin ID-scoped legacy button/input rules receive higher-specificity EZPK2 overrides so button labels cannot fall back to white-on-light surfaces.
- Danger actions use a semantic red surface/border/text pairing.
- Disabled controls use explicit readable colors with `opacity: 1` rather than fading the whole control.
- Table header/divider, selected/pressed states, dropdown/menu borders and modal shadows are strengthened.
- v407 visual rules are scoped only to `html[data-site="ezpk2"]`; EZPK1/Gateway theme behavior is preserved.
- v407 theme additions contain no layout geometry declarations.

## Automated validation
- HTML pages: 27/27 PASS.
- Theme bootstrap: 27/27 PASS.
- v407 theme stylesheet: 27/27 PASS.
- Light browser theme-color bootstrap: 27/27 PASS.
- CSS parse: 37/37 PASS.
- JavaScript/MJS syntax: 51 files PASS.
- Local HTML asset references: 311 checked / 0 missing.
- v407 layout-isolation gate: PASS.
- v407 EZPK2-only scope gate: PASS.
- Worker source: byte-identical to v406.
- Wrangler production config: byte-identical to v406.
- Shared Header source: byte-identical to v406; only HTML cache reference changes to v4070.
- Base `style.css` and `signup/signup.css`: byte-identical to v406; contrast remediation is isolated in the final theme layer.
- D1 migrations: 30/30 byte-identical to v406; no 0032 introduced.
- Fresh SQLite migration cycles through 0031: 2/2 PASS.
- Deployment preflight guard: PASS.

## CTA contrast gate
All validated text/background pairs meet or exceed 4.5:1:
- Primary Normal: 8.38:1.
- Primary Hover: 6.40:1.
- Primary Active: 4.67:1.
- Secondary Normal: 12.84:1.
- Secondary Hover: 11.21:1.
- Secondary Active: 9.92:1.
- Danger Normal: 7.18:1.
- Danger Hover: 6.94:1.
- Disabled control: 4.79:1.
- Placeholder on White input: 4.97:1.

## Regression boundary
- No Worker routing change.
- No D1 binding/config change.
- No DB schema change beyond the already-existing 0031 inventory.
- No EZPK1 Light Theme override.
- No Gateway redesign.
- No game/canvas/export palette recoloring.
- No layout geometry change in the v407 theme layer.

## Production visual verification still required
Automated validation proves package integrity and token/state contrast, but it cannot fully replace the real production browser. After deployment, smoke-test representative EZPK2 pages on desktop and mobile, especially Header auth actions, Login modal, Sign Up, Admin action rows, dropdown/modal open states, disabled buttons and selected tabs.
