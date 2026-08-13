# EZPK v414 — Deploy-Ready Runbook

## 1. Identity

Deploy only the exact `EZPK-v414-deploy-ready.zip` artifact and verify its published SHA-256 before extraction/use.

v414 is a code/UI/i18n release. It contains no D1 schema migration beyond the existing 30 migrations through `0031_v405_migration_inquiry_soft_delete.sql`.

## 2. Pre-deploy checks

From the extracted v414 root:

```bash
npm run predeploy
npm run deploy:dry-run
```

Both commands must pass on the operator machine. Do not use `npm audit fix` as part of this deployment.

Confirm remote migrations independently for both D1 databases before deployment:

```bash
npm run migrate:ezpk1:list
npm run migrate:ezpk2:list
```

Expected application baseline: 30 migrations through `0031`, with no `0032` from v414.

## 3. Deploy

After the guard, dry-run, and remote migration-list checks pass:

```bash
npm run deploy
```

No D1 migration apply is required solely for v414 because v414 adds no migration.

## 4. Post-deploy smoke

Check desktop and mobile for:
- Gateway desktop spacing: 100 / 10 / 26px.
- Gateway mobile spacing: 80 / 12 / 22 / 12px.
- Mobile sticky `[이민 신청 | 연맹 선택]` navigation and both scroll targets.
- EZPK1 Dark / EZPK2 Light theme separation.
- EZPK1 migration intake available; EZPK2 new migration intake unavailable while historical lookup remains reachable.
- Language selector exposes exactly 14 languages.
- With no saved choice, browser-language auto detection works; unsupported browser languages fall back to English.
- A manually selected language persists across Gateway/EZPK1/EZPK2.
- Spot-check every newly added locale (`fr/de/es/tr/it/id`) on Home, Accounts, Members, Request, Season 6, Tips, and mini-games.
- Arabic RTL and Traditional Chinese rendering.
- Season 6 new-language guides render native localized HTML rather than English text-bearing guide images.

## 5. Operator-only surfaces

`/admin/` and `/dev/` are internal operator consoles and remain outside the public 14-language contract in v414. Verify their existing security/access behavior, but do not use their fixed operator-language copy as a public i18n failure.

## 6. Rollback boundary

A code rollback does not imply a database rollback. Because v414 has no DB schema change, rollback should restore the prior Worker/static code version while leaving the current D1 databases intact unless there is an independently authorized database-recovery reason.
