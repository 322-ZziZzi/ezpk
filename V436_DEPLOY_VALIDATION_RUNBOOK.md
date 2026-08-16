# EZPK v436 Deploy / Validation Runbook

## 1. Baseline

- Keep the v435 deploy-ready ZIP as rollback application baseline.
- D1 must already contain v435 migration `0032_v435_rank_review_cycles.sql` on both EZPK1 and EZPK2.
- v436 adds **no D1 migration**.

## 2. Pre-deploy

```bash
npm ci
npm run predeploy
npm run deploy:dry-run
```

Require v436 predeploy PASS before deployment.

Optional D1 confirmation:

```bash
npm run migrate:ezpk1:list
npm run migrate:ezpk2:list
```

Both should report no new v436 migration to apply.

## 3. Deploy

```bash
npm run deploy
```

## 4. Member-list performance gate

In Admin → Member Management with the production-size member roster:

1. Open Member Management.
2. Confirm normal member rows/cards render as soon as `/api/admin/members` completes.
3. Confirm no promotion/demotion candidate request is required before the normal list is visible.
4. Search by nickname, change rank filter, change sort, change page size, and paginate.
5. Confirm those actions refresh only the normal list and do not trigger full promotion/demotion review evaluation.

## 5. Promotion review gate

1. Open Promotion Review and confirm review data loads on demand.
2. Confirm the compact card shows target rank and `x/14`/review state.
3. Expand details and verify:
   - permanent spec qualification / first-qualified date;
   - current Industry and Vehicle #1 reference values;
   - Vote / Visit / Spec Update / Admin Confirmation achieved/missing rows;
   - current/required values;
   - completed/required counts and reason text.
4. Expand/collapse repeatedly and confirm no extra API request is made solely by the detail toggle.
5. Verify promotion action still obeys backend `REVIEWABLE` gate.

## 6. Demotion review gate

1. Open Demotion Review and confirm calculation begins only on demand.
2. Verify `x/30`, cycle dates, condition details, completed/required counts, and reason text.
3. Verify a completed failing cycle clearly shows demotion-reviewable state.
4. Verify protected/excluded members remain non-actionable.
5. Verify demotion action still obeys backend maintenance-review gate.

## 7. New-member protection gate

1. Confirm normal member list shows `🛡 신규 보호 x/10` for protected members.
2. Open the New Protection stat/card.
3. Confirm protected R1 members are included, not only R2/R3.
4. Confirm nickname, current rank, `x/10`, and protection end date.
5. Confirm protection expiry removes the badge/roster entry according to KST calendar-day authority.

## 8. EZPK1 / EZPK2 visual gate

### EZPK1

- Review/protection cards match the established EZPK1 Admin dark visual language.
- Desktop and mobile layouts remain readable and compact.

### EZPK2

- Review/protection cards use the existing EZPK2 light semantic Admin language.
- Success/missing/pending/progress/protection treatments reuse EZPK2 semantic tokens.
- Confirm no EZPK1 dark surface is visually forced onto the EZPK2 final UI.

## 9. Regression gate

- v435 14-day promotion / HOLD / recovery rules preserved.
- v435 30-day maintenance/demotion lifecycle preserved.
- v435 10-day new-member protection preserved.
- v434 M/G promotion requirements preserved.
- BGB Draft/Published behavior preserved.
- Request Board, Migration applicant access/UID behavior, and Admin authentication remain operational.

## 10. Rollback

v436 has no new schema. If an application rollback is required, redeploy v435 Worker/assets; leave additive v435 migration 0032 in place.
