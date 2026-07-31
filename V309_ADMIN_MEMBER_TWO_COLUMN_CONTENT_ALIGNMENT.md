# EZPK v309 — Admin Member Two-Column & Content Alignment

## Applied changes

- Renamed the administrator navigation item `회원` to `연맹원`.
- Standardized administrator-facing roster terminology such as 전체/활성/정지/탈퇴 회원 to 연맹원.
- Aligned the Member, Capital War, and Vote pages to the same administrator content frame.
- Matched the page introduction start position, heading/description spacing, divider, and first-content spacing.
- Restored the Member Management desktop layout to a two-column list/detail view.
- Kept the existing mobile Member Management card and full-screen detail behavior unchanged.
- Preserved the no-auto-scroll navigation policy.
- Updated cache-busting versions for changed administrator CSS and JavaScript assets.

## Desktop Member Management

- Left: member statistics, controls, and roster list.
- Right: selected member detail/edit panel.
- Selecting a member updates the right detail panel without hiding the list or scrolling the page.

## Mobile

- Existing one-column card list and slide-in detail panel are retained without structural changes.
