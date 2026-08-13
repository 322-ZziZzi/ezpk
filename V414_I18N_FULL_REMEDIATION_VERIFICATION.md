# EZPK v414 — 14-Language Full Remediation Verification

## Release scope

v414 is a code/UI/i18n-only remediation release over v413. It resolves the source-level translation gaps identified by `V413_I18N_FULL_AUDIT.md` across all multilingual user/member surfaces. The internal operator consoles `/admin/` and `/dev/` remain outside the public multilingual contract; their existing operator-language behavior is unchanged.

Supported languages are exactly:

`en, fr, de, ko, th, ja, pt, es, tr, zh-tw, it, ar, vi, id`

Language resolution remains:
1. a valid explicitly saved user choice;
2. otherwise browser preferred languages in order;
3. the first supported normalized match;
4. otherwise English.

Arabic retains RTL handling. Traditional Chinese remains `zh-Hant`; `zh-CN` / `zh-Hans-*` are not silently mapped to Traditional Chinese.

## Remediation completed

- Replaced the v413 English-clone/fallback implementation for the six newly added languages (`fr`, `de`, `es`, `tr`, `it`, `id`) with native page-local copy across the legacy specialist modules.
- Added native translations for all required Season/strategy content in `data.js` for the six new languages. Required strategy leaf shape matches English for every locale; no non-invariant strategy leaf remains byte-identical to English.
- Replaced the six new languages' Season 6 English text-image fallback with native localized HTML guide panels for all three text-bearing guide families. This removes the need to show English guide images as the final localized UI for those locales.
- Filled the Japanese shared-header `myAccount` omission.
- Expanded Request promotion-prefill copy to all 14 languages.
- Filled Season 6 hero-information copy for Thai, Japanese, and the six new languages.
- Added native auxiliary dictionaries that previously caused silent English fallbacks: Alliance Layout zoom/image controls; BGB member gate/YOU badge; Members list-view labels; Season 6 member gate/YOU badge; Capital War YOU badge; My promotion/activity/rank-maintenance/rank-change/request labels; mini-game Missile Defense cards; Drone Hunter language labels.
- Moved the v413 audit's remaining reachable user-visible hard-coded BGB error, Capital War countdown state, New Game labels, Request loading/status copy, and ranking ARIA copy into localized dictionaries or required locale data.
- Required dynamic function-valued keys (`request.total`, Alliance Layout count/building labels) are now present in the v414 central native bundle as well as the page runtime completion paths.

## Full key-set audit

The v414 deployment guard compares the English required leaf-key set against the effective locale dictionary (legacy source + v414 native patch) for the specialist dictionaries covering Accounts, Members, Home, Logo, Schedule, Season 5, Signup, Request, Vote, My, Alliance Layout, Season 6 labels, Season 6 hero information, BGB, Capital War, Tips 1/2/3, the four mini-game families, and New Game.

Result: **PASS — no required key omissions for `fr/de/es/tr/it/id`.**

The six new locales are also rejected if an entire supported dictionary is implemented as an exact English clone. English-equivalent invariant terms such as product/game names, CP/VIP, hero names, or standardized abbreviations remain permitted where semantically intentional.

## Page coverage

- Total entry pages: 27.
- Multilingual user/member entry pages: 25.
- Internal operator-only entry pages: 2 (`/admin/`, `/dev/`).
- Central v414 i18n bootstrap present on multilingual user/member pages: **25/25 PASS**.
- Static language × page coverage matrix: **14 × 25 = 350/350 PASS**.
- Page-specific scripts that call the v414 native patch load after `i18n-v414.js`: **PASS**.

A headless browser runtime matrix was not claimed in the build environment because local Chromium navigation is sandbox-blocked. Production/operator browser smoke remains a release step.

## Gateway contracts preserved

Desktop:
- Migration card → `연맹 선택`: 100px.
- Heading → description: 10px.
- Description → alliance-card grid: 26px.

Mobile:
- Sticky `[이민 신청 | 연맹 선택]` navigation preserved.
- Migration card → heading: 80px.
- Heading → description: 12px.
- Description → EZPK1 card: 22px.
- EZPK1 → EZPK2: 12px.

Width alignment, scroll targets, active-tab tracking, reduced-motion behavior, and no URL/hash mutation remain unchanged.

## Database / Worker preservation

- D1 schema change: **NO**.
- Migration count: **30**.
- Latest migration: `0031_v405_migration_inquiry_soft_delete.sql`.
- New `0032`: **NO**.
- v413 → v414 migration bytes: **30/30 exact PASS**.
- Fresh SQLite migration cycles: **2/2 PASS**.
- `worker.js`: byte-identical to v413.
- `wrangler.jsonc`: byte-identical to v413.
- EZPK1 migration intake enabled / EZPK2 migration intake disabled: preserved.
- `/dev/` host-scoped join-code management and `/api/db-test` settings redaction: preserved.

## Static validation

- `npm run predeploy` / v414 deployment guard: **PASS**.
- JavaScript / MJS syntax: **60/60 PASS**.
- CSS parse: **37/37 PASS**.
- Local HTML refs: **384/384 PASS, 0 missing**.
- Migration byte crosscheck: **30/30 PASS**.
- Fresh SQLite migration application: **2/2 PASS**.

`npm run deploy:dry-run` could not run in the build container because the Wrangler executable is not installed there (`wrangler: not found`). It remains mandatory on the operator machine before production deployment.
