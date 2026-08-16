# EZPK v435 Deploy / Validation Runbook

## 1. Pre-deploy

1. Keep `EZPK-v434-deploy-ready.zip` as rollback baseline.
2. Install project dependencies in the deployment workspace (`npm ci`) if Wrangler is not already present.
3. Run `npm run predeploy` and require PASS.
4. Confirm migration list contains 31 SQL files and latest is `0032_v435_rank_review_cycles.sql`.

## 2. D1 migration — required before Worker

Run for both databases:

```bash
npm run migrate:ezpk1:list
npm run migrate:ezpk1:remote
npm run migrate:ezpk2:list
npm run migrate:ezpk2:remote
```

Verify `0032_v435_rank_review_cycles.sql` is applied to both D1 databases before deploying v435 Worker code.

## 3. Deploy

```bash
npm run deploy:dry-run
npm run deploy
```

The packaged validation environment did not include an installed Wrangler executable, so the final Wrangler dry-run remains a deployment-host gate after `npm ci`.

## 4. Live rank-review checks

Use non-production-sensitive test members where possible.

- Existing eligible R1/R2 member: first v435 evaluation must start official promotion progress from v435 activation authority, not invented historical days.
- New member: Admin shows `1/10` ... `10/10`; no demotion review/counter before protection ends.
- Promotion opportunity: verify `1/14` increments by KST calendar date and activity eligibility can make the member `검토 가능` before day 14.
- Promotion failure: after the full 14-day opportunity expires without activity eligibility, verify `활동 미달`; it must not auto-restart.
- HOLD recovery: confirm no immediate restart without post-HOLD activity; after fresh activity plus recent-30-day maintenance eligibility, verify a new `1/14` starts.
- Maintenance: verify `x/30`; day 30 remains available, and a failed full cycle becomes `검토 가능` only after completion.
- Backend gates: promotion before `REVIEWABLE` and demotion before maintenance `REVIEWABLE` must return conflict/not-eligible responses.
- Rank promotion/demotion: after completion, verify old cycle state is closed and new-rank maintenance begins at `1/30` (or after remaining new-member protection).
- Manual rank override: changed rank resets previous cycle; same-rank save does not reset. Verify rank-change audit row.
- Bulk rank override: only actually changed members receive reset/audit semantics.

## 5. Regression checks

- Admin promotion rule M/G: `500 M` remains `필요 500M`; `0.5 G` remains `필요 0.5G`; normalized comparison remains equivalent.
- EZPK2 Admin semantic colors remain v434 values.
- BGB Draft Save does not change public Published; Publish does.
- Request Board/admin auth/migration applicant UID access and inquiry delete compatibility remain operational.
- PC/mobile Member Management: compact `x/14`, `x/30`, `x/10` badges do not overflow and action buttons remain usable.

## 6. Rollback note

Do not roll back the D1 schema destructively. If application rollback is needed, deploy the v434 Worker/assets while leaving additive migration 0032 in place; v434 does not depend on or mutate the new table.
