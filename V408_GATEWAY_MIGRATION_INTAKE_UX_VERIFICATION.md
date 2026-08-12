# EZPK v408 Gateway / Migration Intake UX Verification

## Baseline
- Source baseline: `EZPK-v407-deploy-ready.zip`.
- v408 is a code/UI/config update over v407.
- D1 migration inventory is unchanged: 30 files, latest `0031_v405_migration_inquiry_soft_delete.sql`.
- The v407 EZPK2 High-Contrast Light Theme file is preserved byte-for-byte.

## Gateway (`ezpk322.com`)
Confirmed page order:
1. Header.
2. Existing EZPK1 migration-entry content, reused through `shared-migration-entry.js` and always targeting `https://ezpk1.ezpk322.com/migration/`.
3. `Choose Your Alliance` + description.
4. EZPK1 / EZPK2 selection cards.
5. Footer.

Spacing/selection refinements:
- Desktop Gateway main padding is reduced to `54px 0 72px`.
- Desktop alliance-heading bottom gap is reduced to `28px`; lead top gap is `14px`.
- Mobile Gateway main padding is reduced to `34px 0 48px`; heading bottom gap is `22px`.
- Desktop alliance cards are increased from the v407 250px minimum to 278px minimum (~11.2% taller).
- Mobile cards remain compact at 220px minimum height.
- The old visible migration-entry section is removed from the EZPK1 home page; the `/migration/` function/route remains intact.

## EZPK1 migration page
Korean copy is fixed to:
- Page/hero title: `이민 신청`.
- Membership kicker: `MEMBERSHIP`.
- Membership title: `EZPK1 연맹 가입 조건`.
- Membership subtitle: `원활한 연맹 운영을 위해 아래 가입 기준을 적용하고 있습니다.`.
- Bottom guidance: `보다 자유로운 플레이를 원하시거나 EZPK1 가입 기준에 해당하지 않는 경우 EZPK2로 가입하실 수 있습니다.`.

Eligibility UX:
- R2 values still come from `/api/migration/eligibility`, which reads the existing promotion-rule source (`getPromotionRules()`); no `1G+` or `7+` value is hard-coded into the page.
- Eligibility criteria use a 1×2 vertical stack on desktop and mobile.
- Desktop membership inner padding is 30px, matching the application form’s 30px content line.
- `.migration-shell{padding:0}` and `.migration-hero{padding:0}` explicitly neutralize the global `section` padding that caused excessive desktop whitespace in v407.
- Mobile membership padding remains compact at 18px.
- The EZPK2 migration button remains in source for future reuse but is hidden with `hidden` + `aria-hidden="true"`; only the non-clickable guidance remains visible when EZPK2 is active.

## EZPK2 migration intake
Policy: **EZPK1 ONLY** for new migration applications.

Implementation is reversible rather than destructive:
- `EZPK1_MIGRATION_INTAKE="ENABLED"`.
- `EZPK2_MIGRATION_INTAKE="DISABLED"`.
- Shared Header migration menu is derived from `/api/site-context` and is hidden for EZPK2 while intake is disabled.
- Public `POST /api/migration/applications` returns `403 MIGRATION_INTAKE_DISABLED` in EZPK2 context.
- Admin migration import commit is also blocked in EZPK2 context while intake is disabled.
- Existing status/history/inquiry paths are not disabled or deleted.
- Direct EZPK2 `/migration/` access renders a clean disabled-intake information panel with existing-application status lookup instead of a new-application form.
- The disabled panel has an explicit EZPK2 Light Theme surface override.
- Re-enabling the EZPK2 feature later requires changing the intake feature state rather than rebuilding deleted code.

## Automated verification
- Deployment guard: PASS.
- Worker site-context runtime probe: EZPK1=true, EZPK2=false, root=true — PASS.
- EZPK2 public application POST: `403 MIGRATION_INTAKE_DISABLED` — PASS.
- EZPK2 admin import commit POST: `403 MIGRATION_INTAKE_DISABLED` — PASS.
- HTML pages: 27/27 theme bootstrap and v407 theme stylesheet coverage — PASS.
- Shared Header cache reference: 24/24 at v4080 — PASS.
- CSS parse: 37/37 — PASS.
- Local HTML asset references: 312 checked / 0 missing — PASS.
- JavaScript/MJS syntax: 53/53 — PASS.
- D1 migrations: 30/30 exact vs v407 — PASS.
- Fresh SQLite migration cycles through 0031: 2/2 — PASS.
- `ezpk-theme.css`, `style.css`, and `signup/signup.css` are unchanged from v407 — PASS.

## Verification boundary
A production browser smoke test is still required after deployment. The local container’s browser policy blocked loopback visual navigation, so no claim is made that production desktop/mobile rendering was visually smoke-tested inside this build environment.
