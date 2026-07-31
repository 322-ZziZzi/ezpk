# V321 Stage 3 Home i18n and Responsive QA

## Base

- `EZPK-v320-stage2-home-functional-qa(1).zip`

## Corrections

- Replaced the compact home-button font shorthand with explicit, cross-browser typography properties.
- Allowed translated Login and Sign Up labels to wrap safely while preserving the minimum touch height.
- Added safe wrapping to long brand kicker translations.
- Added minimum-width and overflow protection to feature cards.
- Added safe wrapping to immigration titles, copy, process text, and external-form notes.
- Added minimum-width, overflow wrapping, and language-aware hyphenation to quick-link buttons.
- Normalized the brand headline weight for broader browser consistency.

## Verification

- Confirmed all 8 supported languages: Korean, English, Portuguese, Vietnamese, Arabic, Japanese, Thai, and Traditional Chinese.
- Confirmed all 25 rendered home translation keys are populated in every language.
- Confirmed Arabic home text remains compatible with the existing RTL document direction.
- Confirmed PC feature cards use a 3-column layout.
- Confirmed mobile feature cards use a 1-column layout.
- Confirmed PC quick links use a 4x1 layout.
- Confirmed mobile quick links use a 2x2 layout.
- Confirmed long labels can wrap without forcing horizontal page overflow.
- Confirmed the existing shared 8-language system remains intact.
- JavaScript syntax checks passed.

## Files changed

- `style.css`

## Database

- No D1 migration is required.
