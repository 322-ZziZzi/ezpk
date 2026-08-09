# v388 Mobile Migration Step Scroll Verification

Verified: 2026-08-09

## Scope

- Mobile/desktop normal Migration step navigation (`Next` / `Previous`).
- Preserve v387 behavior outside the reported navigation-scroll issue.

## Change

- Removed the explicit `window.scrollTo({top:0, behavior:'smooth'})` call from the normal `Next` handler.
- Removed the explicit `window.scrollTo({top:0, behavior:'smooth'})` call from the normal `Previous` handler.
- Kept intentional scrolling for Final Review `Edit`, invalid-submit recovery, and the success state.

## Verification

- `node --check migration/migration.js`: PASS.
- Static navigation-handler assertion: PASS; normal `Next` and `Previous` handlers contain no `scrollTo` / `scrollIntoView`.
- Remaining explicit Migration scroll calls are limited to Final Review `Edit`, invalid-submit recovery, and success-state navigation.
- v387 → v388 file comparison confirms no application source changes outside `migration/migration.js`; README and this verification record are documentation changes only.
- ZIP CRC test: PASS.
