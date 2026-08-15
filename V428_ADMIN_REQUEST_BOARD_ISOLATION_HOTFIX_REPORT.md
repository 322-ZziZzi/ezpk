# EZPK v428 — Admin Request Board Isolation Hotfix

## Status
CONFIRMED IMPLEMENTED / STATIC + SQL COMPATIBILITY VALIDATION PASS

## Reported production symptom
An authenticated administrator could enter the Admin page, but the Request Board manager could not load requests.

## Root cause
`GET /api/admin/requests` loads ordinary `member_requests` and then merges optional migration applicant inquiries from `migration_inquiries` into the same response. In v427, the migration merge exception handler ignored only a completely missing table. Any other migration-side schema/read failure — including a staged DB where `migration_inquiries` exists but the later `deleted_at` soft-delete column is not yet present — aborted the whole endpoint. This made ordinary member Request Board data unavailable even though the member request tables themselves were healthy.

This violated the intended isolation comment already present in the handler: optional migration inquiry data must never take down ordinary member requests.

## v428 remediation
- Ordinary member requests are loaded first and remain authoritative.
- Migration inquiries are merged as an isolated optional source.
- Missing `migration_inquiries.deleted_at` triggers a compatibility query without the soft-delete filter rather than aborting the endpoint.
- Missing migration-inquiry tables, thread-read failures, or other migration-side merge failures return ordinary member requests with a non-fatal `partial` warning.
- Per-inquiry thread failure no longer aborts the complete list.
- `request-admin.js` retries list loading once after a short delay for transient failures.
- The Request manager listens for `ezpk-admin-ready`; if Request is already the active panel, it loads automatically.
- `window.EZPKRequestAdmin` exposes minimal diagnostics (`load`, page, loading, last error).
- Updated request-manager cache token: `v=4280`.

## Compatibility smoke tests
SQLite migrations were executed in-memory in two shapes:
1. Full current 30-migration schema: member request query PASS; migration inquiry query with `deleted_at` PASS.
2. Schema through v401 (`0030`) without v405 soft-delete migration (`0031`): expected `deleted_at` query failure reproduced; v428 compatibility query without `deleted_at` PASS.

## Protected behavior
- v427 Admin authority/Header Shell remains unchanged except for the Admin page request-manager cache reference.
- v425 Mini Games layout remains unchanged.
- v424 PC Header fitter remains unchanged.
- v421 public mobile Alliance selector remains unchanged.
- v420 hamburger discovery cue remains unchanged.
- D1 migrations are unchanged 30/30 byte-exact from v427.
- Historical deploy guards v401–v427 are unchanged 26/26 byte-exact.

## Live gate
Production authenticated Admin Request Board should verify:
- ordinary member requests load,
- migration inquiries load when schema is current,
- Request refresh/pagination work,
- reply/edit/delete actions work,
- sub-admin with Requests permission can load,
- sub-admin without Requests permission receives the intended permission denial.
