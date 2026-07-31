# V319 Home Member Convenience UI

## Applied

- Rebuilt the home page around the confirmed lightweight member-convenience structure.
- Added separate guest and active-member home experiences.
- Added the confirmed brand message and complete translations for all 8 supported languages.
- Preserved the muted, looping EZPK YouTube video and fallback cover.
- Added guest-only Login and Sign Up actions using the existing shared authentication UI.
- Added guest-only feature cards for Schedule/Vote, Team Assignment, and Strategy.
- Added active-member quick links for Vote, BGB, Capital War, and Members.
- Applied PC 4x1 and mobile 2x2 quick-link layouts.
- Restricted the event schedule UI and `/api/events` endpoint to authenticated active members.
- Kept the existing Google Forms migration workflow and made the section guest-only.
- Removed the separate legacy brand-principles block.
- Applied the Minimal Command UI direction with restrained gold accents and reduced glow/motion.
- Preserved the confirmed multilingual footer message.

## Files changed

- `index.html`
- `style.css`
- `schedule.js`
- `worker.js`

## Files added

- `home-v319.js`
- `V319_HOME_MEMBER_CONVENIENCE_UI.md`

## Database

- No D1 migration is required.

## Validation

- JavaScript syntax checks passed for the changed runtime files.
- 8 languages and 25 required home translation keys were checked.
- Required guest/member sections and quick-link destinations were checked.
- Active-member protection on the event API was checked.
- PC 4x1 and mobile 2x2 quick-link CSS rules were checked.
