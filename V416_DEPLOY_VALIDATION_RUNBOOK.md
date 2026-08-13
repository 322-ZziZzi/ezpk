# EZPK v416 — Deploy Validation Runbook

## Candidate

- Version: `4.1.6` / `v416`
- Baseline: `EZPK-v415-deploy-ready.zip`
- Required languages: `en fr de ko th ja pt es tr zh-tw it ar vi id`

## Pre-deploy gates

1. Verify the ZIP SHA-256 against the adjacent `.sha256` file.
2. Extract into a clean directory.
3. Run `npm run predeploy` and require PASS.
4. Run syntax checking for all `.js` / `.mjs` files or the project's normal CI equivalent.
5. Confirm `migrations/` still contains 30 SQL migration files and no new v416 migration.
6. Install exact deployment dependencies in the normal deployment environment, then run `npm run deploy:dry-run`.
7. Serve the site from a real HTTP(S) origin and smoke-test all 14 language choices. Include `/tip/` specifically because the offline `about:blank` audit harness cannot execute its `history.replaceState` call.
8. Verify the approved fixed-term whitelist remains unchanged and is not reported as an i18n failure.

## v416 regression checks

- Initial mobile menu accessibility label follows the selected language.
- Login modal × button accessibility label follows the selected language.
- Request Migration return link follows the selected language.
- BGB A/B team labels, preview close ARIA, tactical-map alt, and team-preview alt follow the selected language.
- Capital War preview close/alt metadata is localized before protected data loads.
- All mini-game translatable UI/control/accessibility copy follows the selected language.
- Zombie Defense dynamic HUD and zombie ARIA are localized after game start.
- Hero Merge starts without the former undefined-translation-function runtime path.

## Fixed terms

Do not translate or fail the build for the approved whitelist recorded in `V416_I18N_REMEDIATION_REPORT.md` and `V416_VALIDATION.json`.

## Promotion criterion

Promote only after the deployment-environment dry-run and same-origin browser smoke test pass. v416's repository/source validation is already PASS.
