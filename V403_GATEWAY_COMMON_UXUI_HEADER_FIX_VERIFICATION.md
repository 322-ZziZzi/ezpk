# EZPK v403 — Gateway Common UX/UI + Desktop Header Fix

## Scope
Code/UI-only production hotfix over v402. No schema or D1 migration changes.

## Gateway UX/UI
- Replaces the standalone landing-page look with the existing EZPK common visual language.
- Uses the common `site-header`, `brand`, `brand-mark`, and language-control styling vocabulary.
- Removes the eight permanently visible language pills; language selection is now a common header dropdown.
- Keeps EZPK1 and EZPK2 at equal visual weight.
- Keeps Main Alliance / Sub Alliance as secondary neutral badges.
- Desktop: two equal cards. Mobile: one-column cards.
- Preserves eight-language localization and RTL handling.
- Preserves EZPK2 inactive behavior and SINGLE-mode redirect behavior.

## Desktop header containment
- v402 declared five grid columns but did not switch the desktop shared header from `display:flex` to `display:grid`.
- v403 explicitly uses the five-column desktop grid at >=1200px:
  Brand | Navigation | Alliance Select | Account | Language.
- Navigation gets `min-width:0`; controls are bounded so Language cannot be pushed outside the viewport.
- 1200–1380px receives compact spacing without altering the existing mobile drawer behavior.

## Database boundary
- No D1 migration files changed.
- Do not re-run EZPK1/EZPK2 migrations for this hotfix.
