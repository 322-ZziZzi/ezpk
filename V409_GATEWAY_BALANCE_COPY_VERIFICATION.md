# EZPK v409 — Gateway Balance & Server 322 Migration Copy Verification

Status: **PASS / DEPLOY-READY SOURCE PACKAGE**

## Confirmed scope

v409 is a UI/copy-only refinement over v408. It does not add or alter the D1 schema and does not change the confirmed EZPK1-only migration-intake policy.

### Gateway PC balance

- The Gateway migration entry card and the total EZPK1/EZPK2 alliance selection grid now use the same outer width: `100%` of the shared Gateway container (`max 1080px`).
- Migration entry card desktop padding reduced from `48px 52px` to `34px 40px` so its visual weight is closer to the alliance selection cards.
- Migration entry section bottom gap reduced from `46px` to `34px`.
- Alliance cards remain `min-height: 278px` on desktop; they were not enlarged again.
- Mobile v408 sizing remains intentionally compact (`min-height: 220px` alliance cards).

### Alliance heading rhythm

Desktop Gateway heading spacing is now:

- `Choose Your Alliance` → description: `10px`
- description → alliance card grid: `16px`

This keeps the heading group visually attached to the EZPK1/EZPK2 cards while retaining the common EZPK page spacing rhythm.

### Migration entry copy

Korean copy is confirmed as:

> 322서버에서 새로운 시작을 준비해보세요.  
> 신청서를 검토한 후 운영진이 개별적으로 안내드립니다.

The shared 8-language migration-entry copy was updated with the same server-centric meaning and no longer describes migration as joining EZPK specifically.

### Preserved migration policy

- EZPK1 migration intake: ENABLED
- EZPK2 migration intake: DISABLED, not deleted
- Gateway migration CTA destination: EZPK1 migration page
- EZPK2 migration menu/form/CTA: hidden while disabled
- EZPK2 direct new-application submissions: server-side blocked
- Historical application/inquiry/audit data: preserved

## Validation summary

- v409 predeploy guard: PASS
- JavaScript/MJS syntax: PASS
- CSS parse: PASS
- 27/27 page theme bootstrap preserved
- 24/24 shared-header pages preserve v408 header contract
- 30 D1 migrations preserved byte-for-byte vs v408
- Latest migration remains `0031_v405_migration_inquiry_soft_delete.sql`
- Fresh SQLite migration cycles: 2/2 PASS
- No DB migration added in v409

Production desktop/mobile visual smoke is still required after deployment.
