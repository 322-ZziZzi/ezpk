# V322 Stage 4 Home Final Release QA

## Base

- `EZPK-v321-stage3-home-i18n-responsive-qa(1).zip`

## Final integrated scope

- Guest home: brand message, EZPK video, Login and Sign Up, three convenience cards, migration application, footer.
- Active-member home: event schedule, Vote/BGB/Capital War/Members quick links, brand message, EZPK video, footer.
- Event schedule is protected in both the UI and `/api/events` Worker route.
- Existing Google Forms migration workflow remains guest-only.
- Existing shared authentication, administrator event management, and D1 data structures remain intact.
- Minimal Command UI and the confirmed 8-language home copy remain intact.

## Final validation

- Required runtime files and all four quick-link destinations exist.
- JavaScript syntax checks passed.
- Guest/member home section order matches the confirmed specification.
- Migration application CTA appears only once.
- Legacy brand-principles markup is absent.
- All 8 languages contain all 25 rendered home keys.
- Confirmed Korean brand and footer copy match exactly.
- PC quick links are 4x1 and mobile quick links are 2x2.
- PC feature cards use 3 columns and mobile feature cards use 1 column.
- Long-copy wrapping and reduced-motion safeguards are present.
- Schedule requests include session credentials and clear on logout.
- `/api/events` authenticates before reading D1 schedule data.
- No new D1 migration was added.
- Wrangler 4.118.0 final dry-run build passed.
- Final ZIP integrity passed.

## Result

- Home improvement Stages 1 through 4 are complete.
- Package is ready for deployment.
- No D1 migration is required before deployment.
