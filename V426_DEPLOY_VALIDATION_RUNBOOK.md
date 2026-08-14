# EZPK v426 — Deploy Validation Runbook

## Critical live gates

### Administrator authentication
For EZPK1 and EZPK2 independently where an administrator account exists:

1. Log in as an active super administrator.
2. Open `/admin/` directly.
3. Confirm the initial checking state resolves without manual refresh.
4. Confirm `document.documentElement.dataset.ezpkAdminAuth` reaches `verified`.
5. Confirm the admin app becomes usable and operational data loads.
6. Repeat with an active sub-admin and confirm only permitted panels are available.
7. Test signed-out and non-admin accounts and confirm they do not unlock the admin app.

### Mobile administrator Drawer
At 320 / 360 / 390 / 430 / 768 / 900 CSS px:

1. Verify the administrator Header appears after successful auth.
2. Verify the hamburger button is visible and at least 42×42 CSS px.
3. Open it and confirm the Drawer becomes visible.
4. Confirm administrator navigation groups are present inside the Drawer.
5. Open/close each accordion group.
6. Select an allowed admin panel and confirm the Drawer closes and the panel activates.
7. Repeat for super-admin and sub-admin permission sets.
8. Test browser back while the Drawer is open.

### Cache-coherency gate
In DevTools Network, hard reload `/admin/` and verify critical first-party assets are requested with `?v=4260`. There must be no active `v=4150` or `v=4160` administrator critical asset URL.

### Optional XLSX isolation
Throttle or block `cdn.jsdelivr.net` and reload `/admin/`.

Expected:
- administrator authentication still completes;
- admin page/Drawer remain usable;
- only Excel import/export functions may report that the XLSX library is unavailable.

## Regression gates
- v425 Mini Games card layout unchanged.
- v424 PC Header behavior unchanged.
- v421 mobile Alliance selector unchanged.
- v420 hamburger discovery cue unchanged on normal user pages.
- D1 migrations remain 30/30 byte-exact.
