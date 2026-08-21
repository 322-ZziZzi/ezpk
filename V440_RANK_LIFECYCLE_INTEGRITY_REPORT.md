# EZPK v440 / 4.4.0 — Rank Lifecycle Integrity & History

## Status

Implementation complete as a local deploy-ready candidate. Production D1 migration and Worker deployment are **not executed** by this build process.

## Production READ-ONLY preflight authority

The final R006 production D1 preflight completed 60/60 SELECT-only checks with no requested mutations. The preflight established:

- active approved rank census: R1 32 / R2 40 / R3 20 / R4 10 / R5 1
- orphan review states: 0
- rank snapshot mismatches: 0
- duplicate pending promotion pairs: 0
- multiple active demotion exclusions: 0
- invalid legacy history JSON: 0
- invalid active admin confirmations: 0
- legacy R1 rows requiring v440 semantic migration: 15
- existing persisted spec-qualification rows: 3
- one active R3 row whose new-member protection had ended but whose maintenance cycle had not yet been materialized

## v440 policy implementation

### R1

- No 30-day rank-maintenance lifecycle.
- No R1 demotion candidate path.
- Legacy R1 maintenance state is retired by migration 0033.
- Legacy anti-bounce intent is preserved as `promotion_reentry_required` / `promotion_reentry_started_on`.
- Re-entry requires rolling-30 activity >= 2/4 plus fresh post-change activity.

### Permanent target-rank qualification

**R002 deployment correction:** `member_rank_spec_qualifications` deliberately has no foreign key to `members`. Because `members.id` is AUTOINCREMENT, an accidental deletion cannot cascade-delete permanent qualification, and an exact-ID restore can relink the preserved rows. New registrations receive new ids and do not inherit orphaned qualification.

`member_rank_spec_qualifications` stores permanent qualification by `(member_id,target_rank)` for R2 and R3.

- Existing v435 `spec_qualified_at` values are backfilled first and retain their original dates.
- Current observed spec qualification at v440 activation can create `BASELINE_CURRENT_SPEC`; this does not invent an earlier historical date.
- Runtime first qualification uses `LIVE_SPEC_QUALIFICATION`.
- Rule changes do not erase previously earned qualification.
- Rank changes do not delete the permanent qualification table.
- Promotion commit authority requires permanent target qualification + persistent `REVIEWABLE` state; current specs are not rechecked at commit time.

### Promotion lifecycle

- Fixed 14 KST-calendar-day opportunity cycle.
- Activity may make the cycle `REVIEWABLE` early.
- Full day 14 is available before transition to `HOLD`.
- `HOLD` re-entry uses rolling-30 activity >= 2/4 plus fresh post-HOLD evidence.
- R1 re-entry is separate from rank maintenance.
- R2 `WAIT_MAINTENANCE` remains a separate chain-promotion safeguard.

### R2/R3 maintenance

- Maintenance applies only to R2/R3.
- Official display/evaluation uses fixed-cycle `cycleActivity`.
- Failed-cycle evidence is preserved as `failedCycleActivity`.
- `recoveryActivity` is rolling 30 days and is used only for recovery/demotion-cancel safety.
- A `REVIEWABLE` member who recovers to 2/4 before admin demotion returns to ACTIVE.
- Migration 0033 materializes missing R2/R3 post-protection cycles using a data-driven rule; this covers the single production R3 preflight case without hard-coding a member ID.

### KST activity boundaries

Rolling 14/30-day activity delegates to the existing date-bounded activity helper, so vote, visit, member-spec-update and admin-confirmation evidence all use KST calendar dates consistently.

### Immutable rank history

`member_rank_history_events` is the new authority for rank-change history.

- No foreign key to mutable `members`; history survives member deletion.
- Event types: PROMOTION / DEMOTION / MANUAL_ADJUSTMENT / CORRECTION / RESTORE.
- Identity and actor snapshots are stored at decision time.
- Public and private activity/audit snapshots are separate.
- Legacy `member_rank_changes` rows are backfilled as `LEGACY_PARTIAL` without fabricating missing historical decision data.
- Legacy free-form reason and raw snapshot remain admin/private only.
- R4/R5 history is supported.

### Transactional rank mutation

Promotion, demotion and admin rank changes construct the guarded member update, immutable history insert and lifecycle reset as one D1 batch. The history insert is gated by SQLite `changes()=1` from the immediately preceding guarded UPDATE, so a stale/no-op rank update cannot create a false history event.

## My Page

- Permanent qualification banner and first qualification date.
- Current spec remains visible separately from permanent qualification authority.
- Exact promotion cycle day/range and HOLD/WAIT states.
- R1 re-entry live indicators.
- Exact R2/R3 maintenance cycle day/range.
- New-member protection and KST D-day.
- REVIEWABLE recovery status uses rolling 30-day activity.
- Recent rank history + lazy full-history view.
- Member history API exposes public snapshots only.
- Lifecycle/history strings supplied for all 14 supported languages.

## Admin Member Management

- WAIT_REENTRY is distinct from WAIT_MAINTENANCE.
- R1 is excluded from demotion-maintenance candidate evaluation.
- Demotion confirmation shows failed fixed-cycle evidence.
- History includes new event types and immutable identity snapshots.
- Internal notes/private audit data remain admin-only.

## Local validation

PASS:

- `node --check worker.js`
- `node --check my/my.js`
- `node --check admin/member-manager-v188.js`
- `node scripts/v440-rank-lifecycle-smoke.mjs` — 32/32 checks
- `node scripts/v440-deploy-guard.mjs`
- seeded v435-schema → migration 0033 apply
- R1 legacy maintenance → promotion re-entry assertion
- exact preservation of three seeded legacy qualification dates
- R2 WAIT_MAINTENANCE preservation
- post-protection R3 missing-cycle materialization
- legacy history backfill as LEGACY_PARTIAL
- immutable history survives member deletion
- permanent qualification schema has no member FK/delete cascade
- SQLite `changes()=1` history guard positive/no-op behavior
- My/Admin HTML duplicate-ID checks

Not executed in this Linux build container:

- `wrangler deploy --dry-run` because the extracted deploy package intentionally has no installed `node_modules` / local Wrangler binary. The package retains Wrangler as a dev dependency and Windows operator validation runs after dependency availability.

## Production state

- Migration 0033: NOT APPLIED remotely.
- v440 Worker: NOT DEPLOYED remotely.
- EZPK1 migration intake: unchanged/open.
- EZPK2 runtime/DB: untouched.
