# EZPK v417 Deploy Validation Runbook

1. `npm run predeploy` → PASS.
2. JS/MJS syntax validation → PASS.
3. Confirm `V417_VALIDATION.json`: 686/686 language-state checks PASS.
4. Confirm 30/30 migration SQL byte-exact vs v416.
5. In deployment environment run `npm ci` then `npm run deploy:dry-run`.
6. Smoke-test Alliance Layout language selection, refresh, navigation away/back, and selector/body consistency.
