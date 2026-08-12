# EZPK v401 — Multi-Alliance / Migration Inquiry Verification

## Scope

v401 introduces shared-code operation for EZPK1 and EZPK2 while keeping member/auth/operational data in separate D1 databases.

Known production bindings:

- EZPK1: `DB` -> `ezpk-members` (existing production database; preserve in place)
- EZPK2: `EZPK2_DB` -> `ezpk2-members` (new independent database)

The Worker must choose the database from the trusted request hostname. No query string, form field, or client-provided alliance identifier may choose a D1 binding.

## Cloudflare configuration note

This deploy-ready package has the production multi-alliance Wrangler configuration resolved.

- EZPK1: `DB` -> `ezpk-members` -> `aaa29a3a-a221-47e3-a30f-9b4c624dcb56`
- EZPK2: `EZPK2_DB` -> `ezpk2-members` -> `7203fea0-0dd3-4332-9c11-44273355a4bb`

`wrangler.jsonc` and `wrangler.v401.multi-alliance.template.jsonc` both contain the resolved DUAL-mode routes, variables, and D1 bindings. The existing `DB` -> `ezpk-members` binding must not be removed, renamed, or repointed.

## Safe database order

1. Back up the current EZPK1 production D1 before applying the new migration.
2. Initialize the empty EZPK2 D1 with migrations `0001` through `0030`.
3. On EZPK1, list migration state first and apply only the pending migration(s); v401 adds `0030_v401_multi_alliance_migration_inquiries.sql`.
4. Never reset, drop, truncate, recreate, or wholesale-delete the EZPK1 production database as part of deployment.
5. Database recovery is an incident action, not a normal code rollback mechanism.

## Required runtime configuration

DUAL operation expects:

- `SITE_MODE=DUAL`
- `EZPK2_STATUS=ACTIVE`
- custom domains/routes for `ezpk322.com`, `ezpk1.ezpk322.com`, and `ezpk2.ezpk322.com`
- D1 bindings `DB` and `EZPK2_DB`
- the pre-existing secrets/settings used by v400 (for example password pepper/setup configuration)

For EZPK2 shutdown, set `EZPK2_STATUS=INACTIVE` first. The Worker blocks EZPK2 write APIs and serves the inactive notice. `ARCHIVED` is treated as non-active as well. In SINGLE mode, use `SITE_MODE=SINGLE`; root then remains the latest EZPK1 application and database rather than restoring an old build/database.

## v401 functional verification checklist

- Root `/` in DUAL mode shows the equal-weight EZPK1/EZPK2 gateway when there is no valid routing hint/member session.
- Existing root paths such as `/migration/` and `/request/` continue to resolve as EZPK1 compatibility paths.
- `ezpk1.ezpk322.com` uses only `DB`; `ezpk2.ezpk322.com` uses only `EZPK2_DB`.
- EZPK1 and EZPK2 member cookies/sessions do not authenticate the other host.
- A game nickname already present in one alliance member DB is rejected on signup/nickname change/bulk member creation in the other alliance.
- After a member is actually deleted, a later signup is a new member with a new member ID and no inherited tier, permission, vote, request, layout, join-date, or activity state.
- The system account `ezpk_koala` remains excluded from normal member duplicate/count semantics where the existing system-account rules apply.
- EZPK1 Migration displays the R2 requirements read from `promotion_rules_v1`; changing the admin R2 rule changes the displayed eligibility values without a separate Migration setting.
- EZPK2 Migration does not show the EZPK1 eligibility card.
- EZPK2 CTA is shown on EZPK1 Migration only while EZPK2 is ACTIVE; in-progress form data is not carried to EZPK2.
- Migration Step 1 renders nickname -> UID -> Discord -> Next -> UID status lookup.
- UID status lookup establishes only a Migration Inquiry Session and never a member login/session.
- Normal `/api/requests` remains active-member-only.
- A Migration Inquiry Session can read/write only inquiries linked to its own `migration_application_id`.
- Migration inquiry requester nickname is derived server-side from the migration application.
- Admin request management visibly distinguishes MEMBER and MIGRATION_APPLICANT records and masks migration UID by default.
- An INACTIVE/ARCHIVED EZPK2 direct visit shows the inactive page and all non-exempt writes return `ALLIANCE_INACTIVE`.
- `SITE_MODE=SINGLE` makes root operate as current/latest EZPK1 without reverting application or D1 state.

## Static validation performed during package generation

- `worker.js` handler-call/definition cross-check: no missing `handle*` function references.
- JavaScript syntax checks passed for the v401-modified Worker/UI scripts.
- Every SQL migration `0001` through `0030` applied successfully in order to a clean SQLite validation database with foreign keys enabled.
- Local HTML script/stylesheet references were checked for missing files.
- v401 migration is additive; it does not contain `DROP` or `TRUNCATE` operations.

## Member deletion caveat retained from the existing schema

v401 keeps the confirmed policy that an actually deleted account does not carry identity/history into a later signup. Some older tables have foreign-key actor references that can legally prevent hard deletion of a historically referenced account. v401 reports this as `MEMBER_DELETE_REFERENCED_HISTORY` instead of allowing a partial delete. Do not weaken or erase historical foreign-key evidence merely to force deletion without a separately reviewed schema migration.

## Deploy-ready configuration resolution

- EZPK2 D1 UUID supplied by operator: `7203fea0-0dd3-4332-9c11-44273355a4bb`
- Production `wrangler.jsonc` now contains both `DB` and `EZPK2_DB` bindings.
- `SITE_MODE=DUAL`, `EZPK2_STATUS=ACTIVE`.
- `npm run deploy` now invokes `wrangler deploy`; no deployment was executed while generating this package.
- Remote D1 migrations were not applied while generating this package.

