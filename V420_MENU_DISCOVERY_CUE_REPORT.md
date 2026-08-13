# EZPK v420 — Persistent Hamburger Discovery Cue Restoration

## Baseline

- Base: `EZPK-v419-deploy-ready.zip`
- Version: `4.2.0 / v420`
- Scope: shared mobile/tablet hamburger discovery cue only; v419 header compact-fit and all application/data contracts remain unchanged.

## Confirmed regression

The cue was still present in source but two CSS contracts had drifted from the historical v248 behavior:

1. The responsive shared header displays the hamburger through `<=1199px`, while the discovery animation was scoped only to `<=900px`.
2. A later rule forced `animation-iteration-count:2`, so the otherwise-infinite 3-second cue stopped after about two cycles.

This made the cue appear absent for 901–1199px and effectively disappear after initial page load at narrower widths.

## v420 remediation

- Discovery cue scope aligned to the responsive header: `@media (max-width:1199px)`.
- Gold glow and subtle horizontal shake retain the original ~3-second `infinite` animation.
- Ring pulse remains `infinite`.
- The accidental two-iteration cap is removed.
- `prefers-reduced-motion: reduce` continues to disable motion while preserving a static gold border/glow.
- `shared-header.js` still assigns `ezpk-menu-discovery-cue` both in initial markup and reconciliation.
- `style.css` cache token advanced to `v=4200` on all 24 user pages that load it.
- No Header interaction, navigation, authentication, alliance selection, language-state, Worker/API, or database behavior was changed.

## Regression protections

`scripts/v420-deploy-guard.mjs` requires:

- cue class in initial and reconciled shared-header markup;
- `<=1199px` discovery scope;
- infinite glow/ring animations;
- no two-iteration limiter;
- reduced-motion static-emphasis contract;
- responsive hamburger visibility contract;
- `style.css?v=4200` cache coherency.

## Validation

- `npm run predeploy`: PASS
- JS/MJS syntax: 71/71 PASS
- JSON parse: 27/27 PASS
- Existing v419 paths removed: 0
- Existing D1 migrations: 30/30 byte-exact
- Historical v414–v419 deploy guards: byte-exact
- Discovery two-iteration limiter: 0 residual occurrences
- Browser runtime breakpoint/motion visual matrix: NOT EXECUTED in this managed environment; perform the runbook checks before production deployment.
