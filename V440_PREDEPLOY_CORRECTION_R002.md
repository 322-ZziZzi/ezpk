# EZPK v440 / 4.4.0 — Pre-Deploy Correction R002

## Status

R002 supersedes the first v440 deploy-ready candidate **before any production 0033 migration or v440 Worker deployment**.

## Correction

The first candidate defined `member_rank_spec_qualifications.member_id` with `ON DELETE CASCADE`. That contradicted the confirmed permanent-qualification policy because an accidental member deletion would also delete earned R2/R3 qualification.

R002 removes the foreign key entirely. This is intentional:

- `members.id` is `INTEGER PRIMARY KEY AUTOINCREMENT`.
- accidental deletion leaves qualification rows preserved by the original member id;
- exact-id recovery can relink them;
- a normal new registration receives a newer id and does not inherit the preserved qualification;
- immutable rank history already uses the same non-cascading identity-snapshot principle.

## Added regression gates

- v440 smoke now asserts the qualification table has no `REFERENCES members` / `ON DELETE CASCADE`.
- v440 deploy guard fails if the cascade is reintroduced.
- post-migration READ-ONLY verification reports both qualification FK count and cascade-FK count; both must be zero.

## Production impact

None yet. Migration 0033 had not been applied and v440 had not been deployed when this correction was made.
