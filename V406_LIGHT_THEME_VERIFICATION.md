# EZPK v406 Complete Light Theme Verification

## Confirmed implementation
- Source baseline: `EZPK-v405-deploy-ready`.
- 27/27 `index.html` pages receive a synchronous host-first theme bootstrap before CSS rendering.
- 27/27 pages load `/ezpk-theme.css?v=4060` as the final theme layer.
- EZPK2 uses Light Theme tokens for page/surface/text/button/form/table/dialog/menu/border/shadow/status UI.
- EZPK1 remains on the predecessor Dark Theme because all Light overrides are scoped to `html[data-site="ezpk2"]`.
- Gateway uses `data-theme-context="gateway"` and remains neutral; EZPK2 card now previews the Light identity.
- `theme-color` and `color-scheme` are set before normal styles render; Dev also receives a generated theme-color meta value.
- Shared in-app-browser guide no longer hardcodes Dark-only UI colors; it consumes shared theme tokens.
- Browser titles are prefixed with EZPK2 context where needed.
- BGB filter/spec inline CSS duplicated across 19 HTML files was removed and consolidated into `bgb/bgb.css`.
- The theme layer intentionally contains no layout geometry declarations (`display`, `position`, `width`, `height`, grid/flex layout, margin, padding), protecting the existing responsive layout and desktop header fix.
- Game/canvas/export visual content is excluded from recoloring; surrounding controls and panels are themed.

## Static validation
- HTML coverage: 27/27 PASS.
- CSS parse: 37/37 PASS.
- JavaScript syntax: 45/45 PASS.
- Local HTML asset references checked: 311, missing: 0.
- BGB duplicated inline blocks: 19 → 0 PASS.
- v406 theme layout-isolation gate: PASS.
- WCAG token contrast checks: PASS for primary, secondary, accent, primary-button, success, danger and info text on intended Light surfaces.
- D1 migrations: 30/30 byte-identical to v405; no 0032 introduced.
- Fresh SQLite migration cycles: 2/2 PASS through 0031.
- `worker.js`: byte-identical to v405.
- `wrangler.jsonc`: byte-identical to v405.
- v406 deploy preflight guard: PASS.

## Regression boundaries
- EZPK1 DB/Worker routing is unchanged.
- EZPK2 DB/Worker routing is unchanged.
- v405 Migration Inquiry soft-delete behavior is unchanged.
- No export/image/game canvas palette migration is performed.
- No user-selectable production theme preference is introduced.

## Production visual verification still required
Static validation cannot replace a real-device/browser production smoke test. After deployment, inspect representative EZPK1/EZPK2 pages on desktop and mobile, including open dropdown/dialog states, autofill, disabled controls and game pages. Any Light/Dark leakage should be treated as a v406 UI regression and corrected without a new DB migration.
