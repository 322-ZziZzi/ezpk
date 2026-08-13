# EZPK v419 — Shared PC Header Compact Text-Fit Remediation

## Status

**STATIC / CONTRACT VALIDATION: PASS**  
**FRESH MANAGED-BROWSER MULTI-VIEWPORT RUNTIME MATRIX: NOT EXECUTED IN THIS ENVIRONMENT**

v419 addresses the v418 PC shared-header overflow defect where translated `Alliance Select` text (for example Portuguese `ESCOLHER ALIANÇA`) could exceed the control boundary.

## Root causes fixed

1. v418 explicitly listed `.alliance-selector-link` as a Text-Fit target but also excluded every computed `text-overflow: ellipsis` element, so the target could silently fail registration.
2. v418's generic compact minimum font was above the 10–11px base typography already used by small PC header controls, making its shrink levels ineffective for those controls.
3. PC Header actions used rigid max-width values, especially 1200–1380px, without a coordinated action-cluster / navigation space contract.
4. v418 predeploy checked source tokens but did not expose expected-vs-registered Header targets or unresolved runtime overflow state.
5. <=1199px could retain a desktop Alliance Select while the mobile drawer already supplied its own selector.

## v419 implementation

- Adds `header-fit-v419.js` and `header-fit-v419.css` as a dedicated PC Header fitter.
- Keeps page/card Text-Fit separate in `text-fit-v419.js`; shared-header elements are hard-excluded from the body fitter to prevent double fitting.
- Explicit translated body Text-Fit targets may bypass soft `ellipsis` exclusion, while native form controls and user-generated/nickname data remain hard exclusions.
- Desktop Header action cluster covers visible Alliance Select, guest Home/Login/Sign-up actions, and Current Language.
- Signed-in member nickname remains an intentional user-data ellipsis; it contributes to Header geometry but is not auto-shrunk.
- Header uses only `Normal -> Compact -> Tight`, with a 9.5px absolute Header floor and >=5px inline safety padding.
- Current Language validates the actual `.desktop-language-label` slot, not merely the outer button.
- Primary navigation is moved from the right edge into `More` before Header typography is tightened when space is insufficient.
- Nav movement and Header fit are capped at two fit passes.
- Header self-mutations are disconnected from its MutationObserver while links are restored/moved to avoid a self-trigger loop.
- Active navigation state is synchronized when an active primary item moves into `More`.
- Desktop Fit inline typography is reset when switching to <=1199px.
- Desktop Alliance Select is completely hidden at <=1199px; the drawer selector is the only selector there.
- `shared-header.js` emits layout-change notifications after navigation, language, account, and responsive-state changes.
- User pages with shared Header now use `shared-header.js?v=4190`; active `style.css` and Text-Fit assets use v4190 cache tokens.

## Design preservation

- Existing content/card grids changed: **0**.
- Existing v418 file paths removed: **0**.
- Database migrations changed: **0 / 30**.
- v414–v418 historical deploy guards remain byte-exact relative to v418.
- User-generated content and nickname ellipsis policies remain intact.

## Static validation

- `npm run predeploy`: PASS
- JS/MJS `node --check`: PASS (70 files before v419 documentation packaging)
- JSON parse: PASS
- 14-language deterministic Header label width stress at the 1200–1380px compact contract: PASS for Alliance Select, native language label, Home, Login, and Sign-up strings.
- v418 migrations: 30/30 byte-exact.
- v418 historical `text-fit-v418.js`, `text-fit-v418.css`, and `v418-deploy-guard.mjs`: byte-exact preserved.

## Required production/runtime gate

On a normal browser environment, validate all 14 languages at least at:

`900, 901, 1024, 1180, 1181, 1199, 1200, 1201, 1280, 1380, 1381, 1440px`

and browser zoom `100%, 125%, 150%`, with guest and signed-in Header states.

Required invariant:

- expected Header Fit targets == registered targets
- `data-ezpk-header-fit-unresolved="0"`
- no `data-ezpk-header-fit-overflow="true"`
- no Current Language label ellipsis
- no Header element overlap
- no Header horizontal overflow
- no font below the v419 Header floor
- desktop Alliance Select absent at <=1199px
- mobile drawer Alliance Select available when site context is DUAL

`wrangler deploy --dry-run` remains a deployment-environment gate when the Wrangler binary is available.
