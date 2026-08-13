# EZPK v418 Deploy Validation Runbook

## Required pre-deploy gates

1. Verify ZIP SHA-256 against the supplied `.sha256` file.
2. Run `npm ci` in a clean workspace.
3. Run `npm run predeploy` and require PASS.
4. Run `npm run deploy:dry-run` and require PASS.
5. Serve the exact v418 bytes from a normal HTTP(S) origin.

## Multilingual text-fit runtime matrix

Test all 14 languages: `en fr de ko th ja pt es tr zh-tw it ar vi id`.

Viewport widths: `320, 360, 390, 430, 619, 620, 621, 759, 760, 761, 899, 900, 901, 1024, 1199, 1200, 1201, 1440`.

For each visible `[data-ezpk-text-fit]` target require:

- no `data-ezpk-fit-overflow="true"`;
- translated text remains inside the control bounds;
- tile/card profile uses no more than 2 rendered lines;
- fit level is one of `normal`, `compact`, `tight`;
- changing from a long language back to English recalculates from Normal and does not retain a stale smaller level;
- existing grid column count and card placement remain unchanged;
- no translated UI uses ellipsis solely to hide overflow.

Priority visual pages: Home Quick Links, shared mobile Activity grid, Gateway mobile tabs, BGB team tabs, Capital War strategy controls, Season 6 strategy tabs, Vote mobile tabs, Alliance Layout actions, mini-game start/result controls, My/Signup/Request action buttons.

Also test portrait ↔ landscape rotation, menu/modal opening after initially hidden state, browser resize, back/forward `pageshow`, Arabic RTL, and at least one Android and one iOS system-font environment.
