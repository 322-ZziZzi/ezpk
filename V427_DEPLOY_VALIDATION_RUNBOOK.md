# EZPK v427 — Deploy Validation Runbook

## Priority live gate
Use a real active super-admin account first.

1. Open `/admin/` on desktop.
2. Confirm the Header never remains on `확인 중`.
3. Confirm the account control resolves to the verified administrator account.
4. Confirm administrator panels can be selected and data/actions initialize.
5. Repeat with an active sub-admin account and confirm permission-limited panels.

## Mobile administrator gate
Test 320 / 360 / 390 / 430 / 768 / 900 CSS px.

1. Open `/admin/` while already signed in as an active administrator.
2. Confirm the administrator Header fits inside the viewport with no horizontal page scroll.
3. Confirm the hamburger is visible immediately after admin authorization.
4. Tap hamburger: Drawer opens.
5. Select each permitted admin navigation item: target panel activates and Drawer closes.
6. Reopen repeatedly and verify no double-toggle behavior.
7. Rotate portrait/landscape and confirm the Drawer/header remain usable.

## Authentication edge gates
- Signed out: `/admin/` shows administrator login state; no admin body exposure.
- Active normal member: server returns forbidden and admin body remains locked.
- Suspended/left account: no admin unlock.
- Super-admin: all permission groups available.
- Sub-admin: only granted menu permissions visible/usable.

## Regression gates
- Public mobile Alliance selector remains Guest-top / authenticated-bottom.
- Public PC Header remains v424 adaptive behavior.
- Mini Games cards remain v425 normal-flow CTA behavior.
- Verify EZPK1/EZPK2 host-scoped sessions independently.
