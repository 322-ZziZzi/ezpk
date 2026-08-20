# EZPK v439 Deploy / Migration Reset Runbook

1. Install dependencies: `npm ci`
2. Validate: `npm run predeploy`
3. Optional bundle check: `npm run deploy:dry-run`
4. Deploy: `npm run deploy`
5. If the previous migration cycle must be cleared, run `./operations/v438-reset-migration-cycle.ps1 -ConfirmReset` from PowerShell.
6. Verify reset output shows zero previous-cycle applicant/inquiry/import/rate-limit rows.
7. Submit one controlled EZPK1 test migration application and confirm it is accepted after reset.

Important: the reset clears old cycle data only. v439 keeps EZPK1 migration intake enabled for advance applications before the next migration period.
