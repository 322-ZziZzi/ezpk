# EZPK v432 Deploy Validation Runbook

## Build authority

- Baseline: `EZPK-v431-deploy-ready.zip`
- Candidate: `EZPK-v432-deploy-ready.zip`
- Version: `4.3.2 / v432`
- Scope: Admin → BGB member stat display only

## Predeploy

Run:

```bash
npm run predeploy
```

Expected: `EZPK v432 deployment preflight PASS`.

## Live administrator gate

Using an administrator account with BGB permission:

1. Open Admin → BGB.
2. Confirm FINAL LINEUP rows display `Industry Lv.` and `#1` rather than `CP`.
3. Confirm FINAL LINEUP PREVIEW displays the same stats.
4. Generate/inspect assignments and confirm assignment-member rows display the same stats.
5. Confirm a member with Vehicle #1 value such as `3.17G` preserves the useful decimal value.
6. Confirm a member without Vehicle #1 data displays `#1 -` and does not show total CP in its place.
7. Change each existing BGB sort option and confirm ordering behavior is unchanged from v431.
8. Run automatic assignment on a test lineup and confirm assignment/balancing behavior is unchanged.
9. Verify BGB save/refresh still works.

## Regression gate

Confirm the previously fixed critical paths remain operational:

- administrator authentication/Header/mobile Drawer
- Admin Request Board loading
- migration UID status lookup
- signed-out migration-applicant Request Board access
- administrator migration-inquiry delete
- Mini Games multilingual card layout

No remote D1 migration is required for v432.
