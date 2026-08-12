# EZPK v407 Deploy Ready Runbook

## Scope
- Carries forward the complete v406 package, including all v405 Migration Inquiry privacy/soft-delete behavior and the v406 EZPK2 Complete Light Theme foundation.
- Strengthens EZPK2 into a High-Contrast Light Theme with a Strong CTA Hierarchy.
- Primary CTA label/icon colors are paired with each CTA background for Normal / Hover / Active states; every validated pair is at least 4.5:1.
- Header authentication hierarchy on EZPK2 is `Sign Up = Primary` and `Login = Secondary`; Login submit and Sign Up submit remain Primary inside their respective flows.
- Inputs, selects, textareas, cards, tables, modal/menu boundaries, disabled controls, destructive actions and Admin controls receive stronger Light Theme contrast.
- EZPK1 Dark Theme and the neutral Gateway are not redesigned.
- No v407 database migration is added. The latest migration remains `0031_v405_migration_inquiry_soft_delete.sql`.

## Theme / CTA contract
- `ezpk1.ezpk322.com` → existing Dark Theme.
- `ezpk2.ezpk322.com` → High-Contrast Light Theme.
- legacy `ezpk322.com/*` application routes → EZPK1 / Dark behavior.
- Gateway document → Neutral Theme.
- Production theme selection remains host/document-context driven; no cookie/localStorage/query-string production theme switch is introduced.
- Primary CTA: filled Gold + dark text + strong Gold border.
- Secondary CTA: filled neutral Gray + dark text + strong Gray border.
- Ghost actions: low-priority only, with visible boundary.
- Danger actions: semantic red surface + dark red text + strong red border.
- Disabled controls remain readable instead of disappearing through opacity.

## Database change
v407 adds **no new migration**. Migration inventory remains 30 files through:
`0031_v405_migration_inquiry_soft_delete.sql`.

If production has not yet applied 0031, apply it to both EZPK1 and EZPK2 after capturing fresh Time Travel bookmarks. If 0031 is already applied, do not create or apply a replacement 0032.

## Safe production order
1. Extract `EZPK-v407-deploy-ready.zip` into a new directory.
2. Run `npm install`.
3. Run `npm run migrate:ezpk1:list`.
4. Run `npm run migrate:ezpk2:list`.
5. If and only if `0031_v405_migration_inquiry_soft_delete.sql` is pending, capture fresh D1 Time Travel bookmarks for **both** databases.
6. Apply pending 0031 to EZPK1 with `npm run migrate:ezpk1:remote`.
7. Apply pending 0031 to EZPK2 with `npm run migrate:ezpk2:remote`.
8. Re-run both migration list commands and confirm there are no pending migrations.
9. Run `npm run deploy:dry-run`.
10. Run `npm run deploy`.

Do not run `npm audit fix` as part of this deployment. Do not alter D1 bindings, `SITE_MODE`, `EZPK2_STATUS`, or the Worker routes during the theme deployment.

## Post-deploy visual smoke test
- EZPK1 Home / Members / Migration / Request / Admin remain visually Dark and functionally unchanged.
- EZPK2 Home / Members / Migration / Request / My / Signup / Admin / Accounts / Vote / Alliance Layout / representative game pages render Light.
- EZPK2 desktop header: Sign Up is visually Primary; Login is clearly Secondary.
- EZPK2 mobile drawer: Sign Up is Primary; Login is Secondary.
- Login modal: Login submit is Primary; Create Account switch action is Secondary.
- Sign Up page: Create Account submit is Primary; Back/Login action is Secondary.
- Primary CTA label and icon remain readable on Normal / Hover / Active states.
- Input/Select/Textarea borders are clearly visible; focus uses a Gold ring.
- Admin Primary/Secondary/Danger controls remain readable despite legacy ID-scoped CSS.
- Tables, dropdowns, modal surfaces and disabled controls retain visible boundaries.
- Game/canvas/export artwork remains unrecolored; only surrounding UI is themed.

## Known verification boundary
Static/package validation is complete, but final production rendering must still be checked in actual desktop and mobile browsers after deployment. Any remaining Light Theme leakage or page-specific contrast issue should be handled as a UI-only follow-up without adding a database migration.
