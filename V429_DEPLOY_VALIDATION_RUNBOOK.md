# EZPK v429 Deploy Validation Runbook

## Required predeploy

```bash
npm run predeploy
```

Expected: `EZPK v429 deployment preflight PASS`.

## Live migration UID checks

Use a signed-out browser on the EZPK1 Migration page.

1. Enter an existing 16-digit UID in Application Status Lookup.
2. Confirm the authoritative current application state is displayed.
3. Enter a non-existing 16-digit UID and confirm Not Found is displayed.
4. Enter an invalid-length UID and confirm client validation without a network-dependent failure.
5. Start a new migration application and enter an already-active UID in Step 1; confirm duplicate-UID prevention still blocks progression.
6. If the inquiry subsystem is available, confirm the private-inquiry CTA appears and Request Board access works.
7. If the inquiry subsystem is unavailable or partially migrated, confirm the UID status still appears and the inquiry CTA is absent rather than producing a broken path.
8. Confirm rate limiting still returns the localized retry/rate state rather than exposing raw server errors.

## Production schema check

Verify D1 migration state for EZPK1 and EZPK2 separately. The UID status hotfix is backward-compatible, but production should still ultimately have all migrations through `0031_v405_migration_inquiry_soft_delete.sql` applied where migration inquiries are enabled.

## Regression checks

- Admin page authentication/Header/mobile drawer from v427.
- Admin Request Board ordinary requests and migration inquiry merge from v428.
- PC Header from v424.
- Mini Games cards from v425.
- Mobile Alliance selector from v421.
