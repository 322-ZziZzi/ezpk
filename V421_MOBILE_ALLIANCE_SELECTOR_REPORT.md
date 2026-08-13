# EZPK v421 — Mobile Alliance Context Selector Report

Date: 2026-08-13 (Asia/Seoul)

## Baseline
- Base: `EZPK-v420-deploy-ready.zip`
- Base SHA-256: `8f39b4a8f9740a9cff392df5640284584d2ec3de62f1bc7a654cfc777b6e5c89`
- New version: `4.2.1 / v421`

## Implemented scope
- Mobile/tablet hamburger Drawer only (`<=1199px`).
- Desktop Header and desktop Alliance selector remain in the existing v419/v420 structure.
- DUAL mode replaces the old single mobile `Alliance Select` link with a two-button selector.
- Guest: `ALLIANCE` selector inserted at the top of the mobile navigation.
- Authenticated account: selector inserted at the bottom of the mobile navigation.
- SINGLE mode: selector omitted.

## Selector behavior
- Choice labels use the current site-context display name when available and the known peer Alliance name as fallback.
- Selected Alliance uses theme Primary fill; unselected Alliance uses theme surface + Primary outline.
- `aria-pressed` exposes selected state; each button has a 46px minimum touch target.
- EZPK2 is disabled if `/api/site-context` reports it inactive.
- Switching Alliance locks the selector buttons and navigates directly to the target Alliance host.
- No cross-alliance SSO was introduced: the target host resolves its own host-scoped cookie/session and permissions after navigation.
- If a local form appears modified, the user is asked for confirmation before leaving the current Alliance.
- Cross-host switching intentionally lands on the target Alliance home, which is the safe route fallback when the target host's session/permissions are not knowable in advance.

## Preserved behavior
- v420 hamburger gold glow/shake/ring discovery cue preserved.
- v419 desktop Header Compact Fit preserved.
- v419 body Text-Fit and v417 language authority preserved.
- 30/30 D1 migration files byte-exact to v420.
- 19/19 historical deploy guards from v420 byte-exact.
- No v420 path removed.

## Validation
- `npm run predeploy`: PASS
- JavaScript/MJS syntax: 72/72 PASS
- JSON parse: 28/28 PASS
- Alliance section labels: 14/14 language entries present
- Shared Header cache token `v=4210`: 23/23 user pages using Shared Header
- Shared stylesheet cache token `v=4210`: 24/24 user pages using `style.css`
- Migration byte-exact: 30/30 PASS

## Runtime limitation
A fresh browser matrix was not claimed. A local Chromium headless attempt did not complete in this execution environment, so final live-host visual checks remain a deployment gate.
