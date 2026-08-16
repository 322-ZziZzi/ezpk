# EZPK v436 Member Management UX / Performance Report

## Baseline

- Base: `EZPK-v435-deploy-ready(1).zip`
- New version: `v436 / 4.3.6`
- Scope: Admin → Member Management performance, new-member-protection visibility, promotion/demotion evidence UX, and alliance-specific presentation.
- Database: no new migration. `0032_v435_rank_review_cycles.sql` remains latest.

## 1. Immediate member-list rendering

v435 waited for `/api/admin/promotion-candidates` and `/api/admin/demotion-candidates` after `/api/admin/members` before rendering. Because promotion/maintenance evaluation performs per-member activity/state work, the normal member list could appear unavailable for a long time with roughly 85 members.

v436 changes the loading contract:

1. Request `/api/admin/members`.
2. Render the returned member rows/cards immediately.
3. Do not request promotion or demotion review data until that review panel is opened.

Search, rank filter, sort, pagination, page-size changes, and ordinary list refresh now remain on the lightweight member-list path.

## 2. Lazy review evaluation

- Promotion review: `/api/admin/promotion-candidates` only when Promotion Review is opened or explicitly refreshed.
- Demotion review: `/api/admin/demotion-candidates` only when Demotion Review is opened or explicitly refreshed.
- New-member protection: `/api/admin/new-member-protection` only when the protection roster is opened or explicitly refreshed.
- Review caches are invalidated after mutations that can change rank/spec/protection/review eligibility.

This isolates the known expensive review evaluation from the primary list UX. Deeper N+1 query consolidation remains a safe follow-up optimization and is not required for the immediate-list fix.

## 3. New-member protection visibility

v435 counted protected R1/R2/R3 members but the demotion review source only enumerated R2/R3, which could hide newly joined R1 members from the visible protection roster.

v436:

- exposes a lightweight protected-member query covering active/approved R1/R2/R3 members;
- returns `newMemberProtection.active`, `day`, `totalDays`, and `until` on normal member rows;
- shows `🛡 신규 보호 x/10` in the general member list;
- provides a dedicated protection roster showing nickname, rank, `x/10`, and protection end date;
- allows protected R1 members to appear in the demotion deferred/protection context without evaluating all historical R1 members.

## 4. Promotion evidence UX

Promotion cards remain compact until expanded. The expanded view shows:

- target rank and current 14-day opportunity progress;
- permanent spec qualification and first qualification timestamp;
- current Industry and Vehicle #1 values as reference values, not as a revocation of permanent qualification;
- activity evidence for Vote, Site Visit, Spec Update, and Admin Confirmation;
- achieved/missing state using both symbols/text and semantic color;
- completed count, required count, and remaining requirement count;
- a plain-language reason for the current promotion decision.

The expanded detail uses review data already returned by the promotion endpoint; opening `<details>` does not create another API request.

## 5. Demotion evidence UX

Demotion cards show 30-day maintenance cycle progress and, when expanded:

- each maintenance activity condition with achieved/missing status;
- current/required values;
- cycle start and due date;
- completed/required counts and remaining conditions;
- whether the member is merely being observed or is actually reviewable for demotion;
- a plain-language reason for the current decision;
- new-member protection details and exclusion context where relevant.

For a `REVIEWABLE` maintenance state, the backend exposes review-window activity evidence so the admin can see the basis of the completed review cycle instead of only a present-time summary.

## 6. Admin confirmation evidence

Where available, expanded review details can show:

- Login activity check;
- Event participation check;
- Alliance activity check;
- confirmer;
- confirmation time;
- memo.

No additional API request is triggered by expanding the detail.

## 7. Alliance-specific UX/UI

Functional logic remains shared, but visual presentation is not forcibly unified.

### EZPK1

- Retains the existing dark Admin design language.
- v436 review/protection components inherit the existing dark surfaces, borders, spacing, and status treatment.

### EZPK2

- Retains the existing light semantic Admin system introduced in v434.
- v436 overrides are explicitly scoped under `html[data-site="ezpk2"] #adminApp`.
- Existing Primary/Success/Goal/Missing/Pending/Danger semantic tokens are reused for review status, progress, and protection UI.
- EZPK1 dark styling is not applied as the EZPK2 final presentation.

## 8. Accessibility / responsive behavior

- Review/protection stat cards are keyboard operable with Enter/Space.
- Status does not rely on color alone; ✓/✕ and text accompany semantic colors.
- Progress uses a bar plus numeric `x/14`, `x/30`, or `x/10` representation.
- Mobile uses compact wrapping/two-level information hierarchy instead of forcing desktop density.

## 9. Database / deployment

No migration `0033` is added. v436 depends on the v435 rank-review schema already deployed to both:

- EZPK1: `ezpk-members`
- EZPK2: `ezpk2-members`

The confirmed deployment baseline has `0031` and `0032` applied to both databases and `member_rank_review_states` present.
