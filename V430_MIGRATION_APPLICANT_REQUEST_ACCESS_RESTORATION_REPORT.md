# EZPK v430 — Migration Applicant Request Board Access Restoration

## Result

CONFIRMED code remediation over v429.

## Production symptom

A signed-out migration applicant could successfully look up an existing UID on the Migration page, but following the Request Board CTA showed the normal alliance-member login gate instead of the migration-applicant inquiry UI.

## Root cause

Two independent conditions were conflated by the Request Board bootstrap:

1. v429 intentionally isolated core UID status from optional inquiry features. When inquiry-session issuance failed, it cleared the existing migration inquiry cookie.
2. More importantly, `/api/migration/inquiries` still queried `migration_inquiries.deleted_at` unconditionally. On a production database with the v401 inquiry schema (`0030`) but without the v405 soft-delete column (`0031`), the applicant session could be valid while the inquiry-list request failed with `no such column: deleted_at`. `request.js` then treated the failed inquiry probe as no migration access and displayed the member login gate.

The confirmed original product contract from v401 remains: UID status lookup establishes a Migration Inquiry Session only; it does not require or create a member login session.

## v430 remediation

- `migration_applications` remains the sole core UID status authority.
- Inquiry-session issuance is retried up to two attempts.
- A transient session issuance failure no longer clears an already existing applicant-access cookie. A definitive UID not-found result still clears it.
- Applicant inquiry list supports both schemas:
  - v405+: `deleted_at IS NULL`
  - v401: compatibility query without `deleted_at`
- Applicant open-thread lookup supports both schemas.
- Applicant owned-thread lookup for reply/close supports both schemas.
- Admin reply/close/reopen lookup uses the same compatibility helpers so an applicant thread created on a v401 production schema remains operable by leadership.
- Super-admin soft delete is never converted to destructive hard delete; if the soft-delete columns are unavailable the API returns `MIGRATION_INQUIRY_SOFT_DELETE_SCHEMA_PENDING` instead.

## Compatibility smoke

`V430_SQLITE_COMPAT_SMOKE.json` proves:

- through migration `0029`: core UID status remains available; inquiry session is expectedly unavailable;
- through migration `0030`: session issuance PASS; the `deleted_at` query fails as reproduced, compatibility fallback PASS; list/open/owned/reply/close flow PASS;
- through migration `0031`: primary soft-delete-aware queries and full applicant request flow PASS.

## Protected areas

No D1 migration was edited. v429 migration status core isolation remains. v428 admin Request Board member-request isolation, v427 admin authority/Header shell, v425 Mini Games cards, v424 PC Header, v421 mobile Alliance selector, and v420 discovery cue remain outside this remediation.
