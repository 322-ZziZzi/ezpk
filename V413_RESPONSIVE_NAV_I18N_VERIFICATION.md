# EZPK v413 — Gateway Responsive Navigation & 14-Language Verification

## Confirmed scope

v413 integrates all modifications confirmed after v412. It is a code/UI/i18n release. It does not add or alter any D1 schema migration.

### Gateway desktop
- Migration card bottom → `연맹 선택`: **100px**.
- `연맹 선택` → supporting description: **10px**.
- Supporting description → EZPK1/EZPK2 grid: **26px**.
- The migration card and combined alliance-card grid remain aligned to the same Gateway outer width.

### Gateway mobile
- Mobile-only sticky section navigation: `[이민 신청 | 연맹 선택]`.
- `이민 신청` target: top of the State #322 migration-entry card.
- `연맹 선택` target: top of the EZPK1/EZPK2 card area, not the heading.
- Migration card → heading: **80px**.
- Heading → description: **12px**.
- Description → EZPK1 card: **22px**.
- EZPK1 → EZPK2 gap: **12px**.
- Active-tab tracking, `scroll-margin-top`, smooth scroll, reduced-motion fallback, and no URL/hash mutation are preserved.

## 14-language policy
Supported languages are exactly:
`en, fr, de, ko, th, ja, pt, es, tr, zh-tw, it, ar, vi, id`.

All **26 non-DEV user-facing entry pages** are covered by either the shared 14-language header/resolver (24 pages), the dedicated Gateway resolver, or the dedicated inactive-page resolver. `/dev/` remains outside the user-facing multilingual scope by design.

Resolution priority:
1. valid explicitly saved user choice;
2. otherwise browser preferred languages in order;
3. first supported normalized match;
4. otherwise English.

Locale normalization includes common regional variants. `zh-TW`, `zh-HK`, `zh-MO`, and `zh-Hant-*` resolve to Traditional Chinese. `zh-CN` / `zh-Hans-*` are not silently converted to Traditional Chinese; the resolver continues to the next browser preference and finally English.

A user-selected language is persisted as a non-sensitive cross-subdomain language preference. Authentication/session cookies remain host-only and are unchanged. Arabic synchronizes RTL direction and Traditional Chinese uses `zh-Hant`. Missing page-local translation keys use English fallback rather than blank text.

The six newly added languages have native copy in the shared navigation/auth layer, Gateway, Gateway migration entry, migration application/status/inquiry core copy, central shared UI dictionary, in-app browser guide, and inactive-state page. Legacy specialist page-local copy is wired safely through the same language selection and falls back to English per key where a dedicated native string is not present.

## Preserved contracts
- EZPK1 migration intake enabled / EZPK2 intake disabled by host-derived feature gate.
- Gateway migration CTA explicitly targets EZPK1.
- `/dev/` host-scoped Super Admin join-code management preserved.
- `/api/db-test` sensitive-settings redaction preserved.
- Worker and `wrangler.jsonc` are byte-identical to v412.
- Migration count remains 30; latest is `0031_v405_migration_inquiry_soft_delete.sql`; no `0032`.
- All 30 migration files are byte-identical to v412.
