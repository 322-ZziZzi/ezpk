# EZPK v430 Deploy Validation Runbook

## Predeploy

1. Verify artifact SHA-256 against the distributed `.sha256` file.
2. Extract to a clean directory.
3. Run `npm run predeploy` and require PASS.
4. Confirm all 30 D1 migration files are unchanged from v429.

## Production live gate — signed-out migration applicant

Use a UID that already has a non-deleted migration application.

1. Sign out of the normal alliance member account.
2. Open Migration and perform UID status lookup.
3. Confirm status and verified player nickname render.
4. Confirm the Request Board inquiry CTA is visible when applicant access was established.
5. Open Request Board without member login.
6. Require migration-applicant UI, not the alliance-member login gate.
7. Create a new inquiry and confirm it appears immediately.
8. Refresh the page and confirm the same applicant thread remains visible.
9. Add a follow-up reply and confirm persistence.
10. Close the inquiry and confirm status changes to closed.

## Admin side

1. Open Admin > Requests with a permitted administrator.
2. Confirm the migration inquiry appears alongside normal member requests.
3. Reply to an open migration inquiry.
4. Close/reopen the inquiry.
5. If production D1 has not applied `0031_v405_migration_inquiry_soft_delete.sql`, confirm delete reports the schema-pending condition rather than deleting records destructively.

## Negative gates

- Unknown 16-digit UID: `found:false`; old applicant-access cookie is cleared.
- Invalid UID shape: validation error.
- Active alliance-member session: migration applicant status/inquiry access remains disallowed as before.
- No inquiry tables (schema through 0029): core UID status must still work; Request Board inquiry CTA may be unavailable.

## Recommended production D1 check

Run the remote migration list for EZPK1 and confirm whether `0030_v401_multi_alliance_migration_inquiries.sql` and `0031_v405_migration_inquiry_soft_delete.sql` are applied. v430 supports the v401 inquiry schema, but applying the current migration baseline remains recommended.
