# v387 Migration Implementation Verification

Verified: 2026-08-09

## Scope

- Guest-only `/migration/` 7-step application flow and success state.
- Eight-language system UI: Korean, English, Portuguese, Vietnamese, Arabic, Japanese, Thai, Traditional Chinese.
- Applicant free-text preservation without automatic translation.
- D1 migration `0026_v387_migration_applications.sql`.
- Public submission and administrator Migration Worker APIs.
- Administrator list/detail/status/contact/memo/history workflow.
- Superadmin edit, soft-delete, deleted-list, and restore workflow.
- English Excel export and English full-screen image export.
- Anonymous-only Home/Header Migration visibility and authenticated direct-route redirect.

## Verification performed

- JavaScript syntax checks passed for the changed JavaScript files.
- All D1 migrations from 0001 through 0026 were applied sequentially to a disposable SQLite database.
- Migration active-UID uniqueness and rejected/deleted reapplication behavior were exercised.
- Worker + D1 integration suite: 46/46 checks passed, including validation, duplicate handling, multilingual free text, permissions, status/contact/memo, audit, soft delete/restore, byte body limit, honeypot, and rate limit behavior.
- Applicant browser DOM suite passed the full 7-step flow, live validation, formatted UID paste normalization, multilingual state preservation, review/submission, all eight localized success states, and JavaScript error checks.
- Administrator browser DOM suite passed list/detail, approval confirmation, independent contact state, superadmin controls, deleted-list/detail, English image generation as a real data-URL `<img>`, and English Excel export while preserving applicant free text.
- Duplicate HTML ID checks passed for root, Migration, and admin pages.
- Referenced local assets were checked for the root, Migration, and admin pages with no missing local references.
- The eight locale dictionaries were checked for matching key structure.

## Environment limitation

A Wrangler dev-server validation was attempted but the environment's package registry mirror returned a 404 while installing a Wrangler dependency (`youch-core-0.3.3.tgz`). Therefore a Wrangler-hosted runtime test was not completed in this environment. This is separate from the Worker + SQLite integration and browser DOM verification above.
