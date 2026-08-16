# EZPK v435 Rank Review Cycle Report

## Baseline

- Base: `EZPK-v434-deploy-ready.zip`
- New version: `v435 / 4.3.5`
- Scope: Member Management rank-review lifecycle only; preserve v434 M/G promotion rules, semantic Admin colors, BGB Draft/Published, Request Board, migration applicant access, and prior fixes.

## Confirmed behavior implemented

### Promotion

- Upper-rank spec qualification is persisted with `spec_qualified_at`.
- First qualification opens a 14-calendar-day promotion opportunity (`1/14` ... `14/14`).
- The counter is an opportunity-day counter, not a 14-day continuous-pass streak.
- If the promotion activity condition becomes eligible within the opportunity, state becomes `REVIEWABLE` immediately.
- If the opportunity ends without activity eligibility, state becomes `HOLD`; it does not automatically start another 14-day cycle.
- HOLD re-entry requires the recent 30-day maintenance activity condition to be eligible and fresh post-HOLD activity evidence. This prevents an already-PASS 30-day state from immediately reopening promotion with no new activity.

### Maintenance / demotion

- R1/R2/R3 lifecycle state uses 30-calendar-day maintenance review cycles.
- The displayed `x/30` is the current review-cycle day, not a continuous-failure streak.
- A 30-day cycle is evaluated only after the full day 30 has completed; day 30 remains available for activity.
- A completed failing cycle becomes `REVIEWABLE`; actual demotion is blocked in the backend until this state is reached and current activity is still insufficient.
- A passing cycle advances to the next 30-day cycle.
- If a reviewable member becomes active again before an admin acts, the demotion review clears and a new maintenance cycle starts.

### New member protection

- New alliance members receive 10 KST calendar days of demotion protection using the canonical `members.created_at` / joined-at authority.
- The first maintenance cycle begins after that protection ends.
- Promotion is not blocked by new-member protection.

### Rank changes

- Promotion, demotion, and administrator rank override end the previous rank-review state and initialize the new rank lifecycle.
- An actual rank change never carries old `x/14` or `x/30` progress to the new rank.
- Saving the same rank does not reset the lifecycle.
- New R1/R2 ranks set a maintenance-unlock gate so a next-rank promotion opportunity cannot open immediately; maintenance must be verified first.
- Single and bulk administrator rank changes create `member_rank_changes` audit rows. Promotion/demotion snapshots retain cycle/review context.

## Data authority

Migration `0032_v435_rank_review_cycles.sql` adds `member_rank_review_states` with current rank snapshot, promotion target, spec qualification time, promotion cycle/start/status, HOLD time, rule fingerprint, maintenance cycle/status, new-member protection end date, next-promotion maintenance gate, and evaluation timestamps.

It also records `rank_review_system_v1_started_on` at migration application time. Existing members therefore begin official v435 cycles from activation authority; no historical `8/14` or `18/30` values are guessed.

## Admin UX

Member Management keeps the list compact:

- Promotion: `R1 → R2 · 8/14`, `검토 가능`, `활동 미달`, or `유지 확인 중`.
- Demotion: `R3 → R2 · 18/30` or `검토 가능`.
- New member: `신규 보호 · 4/10`.
- Activity counts/details remain in existing detail/confirmation flows rather than crowding the candidate row.

## Deployment order

This version requires D1 migration 0032 before the v435 Worker. Apply migrations to **both** `ezpk-members` (EZPK1) and `ezpk2-members` (EZPK2), then deploy Worker/assets.
