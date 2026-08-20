# EZPK v438 Deploy / Reset Runbook

## 1. Install dependencies and preflight

```powershell
npm ci
npm run predeploy
npm run deploy:dry-run
```

## 2. Deploy v438

```powershell
npm run deploy
```

Verify:

- `https://ezpk322.com` redirects to EZPK1.
- Signed out: migration card is the first home content block.
- Signed in: migration card is not visible.
- No alliance selector or Gateway UI is reachable.
- EZPK2 user URLs redirect; EZPK2 API URLs return 410.

## 3. End-of-cycle migration data reset

Run only from an authenticated Cloudflare/Wrangler environment:

```powershell
.\operations\v438-reset-migration-cycle.ps1 -ConfirmReset
```

The operator exports a full `ezpk-members` SQL backup first. Do not proceed if the backup is missing or empty.

Expected post-reset verification:

- `migration_applications` = 0
- `migration_import_batches` = 0
- `migration_rate_limits` = 0
- `migration_inquiry_sessions` = 0
- `migration_inquiries` = 0
- `migration_inquiry_replies` = 0
- `migration_related_admin_logs` = 0
- `migration_tier_settings_preserved` = 4

No new D1 migration is required.
