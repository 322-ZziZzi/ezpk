# EZPK v423 Deployment Validation Runbook

## 1. Artifact / static preflight

Run:

```bash
npm run predeploy
```

Required: `EZPK v423 deployment preflight PASS`.

Also verify:

- JS/MJS syntax: PASS
- JSON parse: PASS
- D1 migrations: 30/30 byte-exact versus v422
- historical `scripts/v401...v422-deploy-guard.mjs`: byte-exact versus v422
- 23 shared user pages load `/header-fit-v423.css?v=4230` + `/header-fit-v423.js?v=4230`
- no active `/header-fit-v422.*` or `/header-fit-v419.*` references on those pages
- package ZIP CRC / safe unique paths / case-fold uniqueness: PASS
- `V423_FILE_CHECKSUMS.sha256`: all covered files PASS

## 2. PC Header live-host matrix

Test all 14 supported languages:

`en, fr, de, ko, th, ja, pt, es, tr, zh-tw, it, ar, vi, id`

Widths:

`1200, 1201, 1280, 1366, 1440, 1600, 1920`

Also inspect `1199` to prove ownership cleanly switches to the mobile/tablet Drawer.

States:

- Guest
- authenticated Member
- authenticated Admin-capable member

Required on every desktop case:

1. `Vote/BGB/Capital War/Members` or the current Guest Primary set is readable.
2. Computed Primary/More font size is never below 13px.
3. Header has no visual collision between nav and Alliance/Account/Language.
4. `data-ezpk-header-primary-visible >= data-ezpk-header-primary-min-required`.
5. `data-ezpk-header-primary-collision = 0`.
6. `data-ezpk-header-primary-out-of-bounds = 0`.
7. `data-ezpk-header-primary-nav-overflow = 0`.
8. `data-ezpk-header-fit-unresolved = 0`.
9. If a future >4 Primary set causes a move to More, at least four direct Primary items remain and the moved order is preserved.
10. If the active item moves to More, More is visibly active.

## 3. Stale-state regression test

At one live desktop page:

1. Set a long language such as French, Vietnamese, Thai, or Arabic.
2. Resize from 1200 -> 1920 -> 1280 -> 1600.
3. Switch language to Korean/English and back to the long language.
4. Navigate away/back (`pageshow`).

Required: the fitter always re-starts from Normal and selects Compact/Tight only when actual geometry requires it. A prior Tight state must not remain just because it was selected earlier.

## 4. Alliance / account pressure cases

- DUAL mode: Alliance control visible on desktop.
- 1200–1439: compact Alliance label shown.
- >=1440: full Alliance Select label shown.
- full translated label remains in `aria-label` and `title` at every width.
- long member nickname truncates inside the member name only; rank badge remains visible.
- Guest Home/Login/Sign Up remain usable and do not force Primary type below the floor.
- language button remains usable in every locale.

## 5. Mobile/tablet preservation

At 320/360/390/430/900/901/1199:

- hamburger discovery cue remains active (or static emphasis under reduced motion),
- Guest Alliance selector remains at the Drawer top,
- authenticated Alliance selector remains at the Drawer bottom,
- SINGLE mode hides the selector,
- DUAL selector uses existing v421 host navigation/session re-resolution,
- v423 PC fitter does not alter mobile Drawer typography/layout.
