# EZPK v401 — Deploy-Ready Runbook

Status: **CONFIG RESOLVED — NOT DEPLOYED**

This package resolves the production multi-alliance Wrangler configuration with the operator-provided EZPK2 D1 UUID. It does **not** apply remote migrations or deploy the Worker by itself.

## Resolved bindings

- EZPK1: `DB` -> `ezpk-members` -> `aaa29a3a-a221-47e3-a30f-9b4c624dcb56`
- EZPK2: `EZPK2_DB` -> `ezpk2-members` -> `7203fea0-0dd3-4332-9c11-44273355a4bb`
- `SITE_MODE=DUAL`
- `EZPK2_STATUS=ACTIVE`
- Custom domains: `ezpk322.com`, `ezpk1.ezpk322.com`, `ezpk2.ezpk322.com`

## Safe production sequence

Run all commands from this project directory. Stop immediately on any unexpected output.

1. Authenticate/identity check if needed: `npx wrangler whoami`
2. Inspect EZPK1 pending migrations: `npm run migrate:ezpk1:list`
3. Inspect EZPK2 pending migrations: `npm run migrate:ezpk2:list`
4. Apply migrations to the new EZPK2 DB first: `npm run migrate:ezpk2:remote`
5. Re-list EZPK2 migrations and confirm none remain pending.
6. Apply only pending migrations to EZPK1: `npm run migrate:ezpk1:remote`
7. Re-list EZPK1 migrations and confirm none remain pending.
8. Optional build/config validation: `npm run deploy:dry-run`
9. Deploy Worker: `npm run deploy`
10. Smoke-test root Gateway, EZPK1, EZPK2, login separation, migration, inquiry access, and database isolation.

## Production safety invariants

- Never reset or recreate `ezpk-members`.
- Never point `EZPK2_DB` at the EZPK1 database.
- Do not deploy before the EZPK2 schema is initialized.
- Existing EZPK1 data is not copied into EZPK2.
- Migration Applicant sessions are not member login sessions.
- Member deletion followed by signup is treated as a new member and does not restore past member history.
