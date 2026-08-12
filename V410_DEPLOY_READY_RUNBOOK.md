# EZPK v410 — Deploy Ready Runbook

## 1. Extract and enter package

Extract `EZPK-v410-deploy-ready.zip` into a clean folder and open a terminal in the package root.

## 2. Dependency preparation

Use the lockfile as supplied. Do not run `npm audit fix` or other dependency-mutating commands as part of this deployment.

```bash
npm install
```

## 3. Static deployment guard

```bash
node scripts/v410-deploy-guard.mjs
```

Expected result: `EZPK v410 deployment preflight PASS`.

## 4. Database migrations

No new migration exists in v410. Migration baseline remains 30 files through `0031_v405_migration_inquiry_soft_delete.sql`.

Do not create or apply a `0032` migration for this release.

## 5. Wrangler dry-run

```bash
npm run deploy:dry-run
```

Proceed only after PASS.

## 6. Deploy

```bash
npm run deploy
```

## 7. Production smoke checks

### Gateway — `https://ezpk322.com/`

On desktop, verify:

- migration-entry card outer left/right edges match the total EZPK1/EZPK2 card-grid outer edges;
- Korean heading reads `연맹 선택`;
- heading-to-description spacing is compact and the description sits close to the alliance cards;
- no inherited global section padding creates a large blank gap;
- State #322 migration copy remains correct;
- mobile layout remains single-column and readable.

### DEV — EZPK1 and EZPK2

Visit each host separately:

- `https://ezpk1.ezpk322.com/dev/`
- `https://ezpk2.ezpk322.com/dev/`

Verify the page header clearly reports the current alliance (`EZPK1 DEV` / `EZPK2 DEV`). After Super Admin login, verify the `연맹 가입 코드 관리` section appears and shows only safe metadata — never the current code plaintext.

Do not change a production join code merely for a smoke test. When an operational code change is actually desired, enter the new code twice, confirm the warning dialog, and verify the new code is accepted by a subsequent signup while the old code is rejected.

### Diagnostic API

Verify `/api/db-test` does not return settings values or `alliance_join_code` plaintext.

## 8. Rollback boundary

v410 has no DB schema change, so a code rollback does not require a DB migration rollback. However, a join-code value changed through `/dev/` is production data and is **not** reverted by rolling Worker code back. If a join code was intentionally changed, manage that value explicitly through the appropriate alliance DEV host.
