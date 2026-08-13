# EZPK v415 — 14-Language i18n Remediation Report

## Release

- Version: **4.1.5 / v415**
- Baseline: `EZPK-v414-deploy-ready(1).zip`
- Baseline SHA-256: `3b1fc6a8c4e8e88051b0bcd33cc7ce431a397b165e2b4101632ca215c30c0de7`
- Supported languages (14): `en, fr, de, ko, th, ja, pt, es, tr, zh-tw, it, ar, vi, id`
- Multilingual user-page scope: **25 entry pages** (Admin/DEV excluded from the 14-language user-page scope)

## Final static verdict

**PASS — audited v414 translation leaks and runtime localization defects have been remediated at source level.**

The v415 guard now checks all 14 languages for effective required-key parity, verifies the complete 14-language shape of every v415 remediation overlay, and regression-blocks the known v414 hard-coded execution paths.

## Remediated areas

- Shared Header: removed the Korean-only login recovery fallback and uses the active-language account label.
- New Games / Hero Merge / Zombie Defense: removed undefined `tx()` calls and localized gameplay/status text such as Toxic Hit, Barricade, Bomb, First Kill, Rapid Fire, Game Over, Auto Merge, Chain Merge, New Hero, Top Hero, Merge Rush, and ranking/replay completion copy.
- Request: localized edit dialog, private badge/privacy notice, refresh labels, section copy, and locale-aware date formatting for all 14 languages.
- My: localized section headings and Vehicle #1 promotion labels.
- Accounts: corrected legacy Vehicle #1/#2 clones, localized modal/accessibility copy, and localized generated account-image labels.
- Capital War: localized hero/kicker/versus labels, preview accessibility, and generated team-image labels.
- Season 5: localized archive/finale copy and image accessibility; corrected legacy text that incorrectly referred to Season 6.
- Classic Games: localized Tank double/triple/combo, Missile combo, and Drone defense-line canvas text.
- Logo: corrected Korean footer/section English residue and localized preview/edition accessibility copy.
- BGB: localized dynamic team-name output and generated-image labels.
- Season 6: localized fixed hero/season labels and guide/detail accessibility text.
- Tip / Vote: localized fixed categories/footer/close labels and locale-aware Vote date formatting.
- Gateway / Home / Members / Game: localized previously fixed page-title and accessibility labels.
- Additional re-audit correction: Korean Home `STATE #322 · INTERNATIONAL ALLIANCE` → `서버 #322 · 국제 연맹`; Korean Logo `EZPK MEMBER` → `EZPK 연맹원`.

## Validation

- `npm run predeploy`: **PASS**
- All JS/MJS `node --check`: **PASS**
- 14-language effective dictionary key parity: **PASS**
- v415 remediation overlay key-shape parity across all 14 languages: **PASS**
- Known v414 hard-coded runtime regression checks: **PASS**
- Existing migration baseline: **30/30 byte-exact preserved**
- Baseline paths removed: **0**
- Historical `scripts/v414-deploy-guard.mjs`: **byte-exact preserved**

## Runtime verification boundary

The browser **14 languages × 25 pages = 350 combinations** matrix was not executed in this environment because local browser navigation is blocked by the execution environment. `wrangler deploy --dry-run` also could not be executed here because Wrangler is not installed in the validation runtime; the package retains Wrangler as a dev dependency and can run the dry-run after `npm ci` in the deployment environment.

Accordingly, v415 is **source/static i18n-remediation PASS**, while the 350-combination browser matrix remains a recommended deployment verification gate rather than a claimed result.
