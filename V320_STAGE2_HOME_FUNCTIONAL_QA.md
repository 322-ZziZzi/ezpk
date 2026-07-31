# V320 Stage 2 Home Functional QA

## Base

- `EZPK-v319-home-member-convenience-ui(1).zip`

## Functional verification

- Guest home remains private while authentication is loading.
- Guest state displays only guest sections and hides member sections.
- Active-member state displays member sections and hides guest sections.
- Login action opens the existing shared login flow.
- Sign Up action uses the existing shared registration route.
- Language changes refresh the new home copy without reloading the page.
- Guest state does not request or display event schedule data.
- Active-member state loads the event schedule with session credentials.
- Logout clears schedule markup, hides the schedule, and stops its timer.
- `/api/events` authenticates an active member before reading D1 schedule data.
- Vote, BGB, Capital War, and Members quick-link destinations are valid.

## Regression verification

- JavaScript syntax checks passed.
- Worker dry-run build passed with Wrangler 4.118.0.
- Existing administrator event endpoints remain unchanged.
- Existing shared authentication source remains unchanged.
- No D1 migration is required.

## Result

- All Stage 2 functional checks passed.
- No runtime source correction was required.
