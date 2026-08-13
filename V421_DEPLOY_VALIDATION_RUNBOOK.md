# EZPK v421 — Deployment Validation Runbook

## Required mobile/tablet checks
1. Test DUAL mode at 320, 360, 390, 430, 768, 900, 901, 1024, 1199 px.
2. Guest: `ALLIANCE` is the first Drawer navigation section; account controls remain at the bottom.
3. Authenticated member/admin: account profile stays at the top; `ALLIANCE` is the last navigation section.
4. Verify selected Alliance uses the current theme Primary treatment and the peer Alliance uses outlined contrast.
5. Verify `aria-pressed=true` only on the current Alliance.
6. Verify minimum touch target is at least 44 px (implementation target 46 px).
7. Verify long Alliance names do not escape the buttons.
8. Verify EZPK2 disabled state when site-context marks EZPK2 inactive.
9. Switch from EZPK1 to EZPK2 and confirm navigation reaches the EZPK2 host; confirm EZPK2 independently resolves Guest/Member/Admin from its own session.
10. Switch back to EZPK1 and confirm the same host-scoped authentication behavior.
11. Modify a form, attempt a switch, and verify confirmation is shown; cancel must keep the current Alliance.
12. During an accepted switch, buttons must lock so repeated taps cannot race.
13. SINGLE mode: mobile Alliance selector must not render.

## Desktop regression
- At 1200, 1280, 1380, 1440 px verify the existing desktop Alliance Select remains unchanged.
- Verify current Language/Login/Sign-up/Account Header Fit remains valid.

## Discovery cue regression
- At <=1199 px verify v420 hamburger gold glow + subtle shake + ring continues infinitely.
- With `prefers-reduced-motion: reduce`, motion must stop while static emphasis remains.

## Static deployment gates
- `npm run predeploy` must PASS.
- 30 migrations must remain byte-exact.
- ZIP CRC, unsafe-path, duplicate-path, case-fold collision and V421 checksum manifest must PASS.
