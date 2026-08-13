# EZPK v422 — Deploy Validation Runbook

1. Run `npm run predeploy`; required result: PASS.
2. Verify all JS/MJS with `node --check` and all JSON parse successfully.
3. Compare all D1 migrations byte-for-byte with v421: required 30/30 exact.
4. Confirm v421 paths removed: 0.
5. Confirm 23 shared user pages load `shared-header.js?v=4220` and `header-fit-v422.js/css?v=4220`; no active page may reference `header-fit-v419`.
6. Desktop >=1200px: `#desktopNavItems` direct anchors must never be reparented to `More` by the fitter.
7. Desktop 1200–1439px: compact translated Alliance label visible; full translated text remains in `aria-label` and `title`.
8. Desktop >=1440px: full translated Alliance Select label visible.
9. <=1199px: v421 mobile Drawer selector remains the only Alliance selector; Guest top / authenticated bottom.
10. Live-host browser matrix: 14 languages × Guest/Member/Admin-capable × 1200/1201/1280/1380/1381/1439/1440/1600/1920. Required: primary visible == expected, unresolved=0, no overlap.
11. ZIP CRC, unsafe paths, duplicates, case-fold collisions and V422 checksum manifest must pass.
