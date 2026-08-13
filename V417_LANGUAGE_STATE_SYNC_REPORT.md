# EZPK v417 — Global Language State Synchronization Remediation

**PASS**

- Version: `4.1.7 / v417`
- Base: v416
- Languages: 14
- User pages: 25
- Initial state runtime checks: **350/350 PASS**
- Language-selector transition checks: **336/336 PASS**
- Total state checks: **686/686 PASS**
- Failures: **0**
- DB migrations: **30/30 byte-exact PASS**

## Root cause fixed
Multiple language authorities could diverge, allowing translated body content while the shared language selector still displayed English.

## Remediation
- Added `language-core-v417.js` as the single `window.EZPKLanguage` authority.
- Loaded it on all 25 multilingual user pages.
- Removed user-page direct reads/writes of `ezpk-lang-v5`.
- Removed page ownership of shared Header `#flag/#lname`.
- Removed the Accounts secondary language-menu controller.
- Gateway and Inactive now consume the same authority.
- Added Header reconciliation on language events, pageshow, focus and visibility restoration.
- Added defensive Header label observation.
- Cookie write failures are non-fatal and no longer abort language-change propagation.

## Runtime invariant
`canonical language == html lang == Header language display == user storage == legacy compatibility storage`

The user-approved fixed-term whitelist remains unchanged.
