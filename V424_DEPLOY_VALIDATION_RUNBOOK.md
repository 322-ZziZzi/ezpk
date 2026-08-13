# EZPK v424 — Deploy Validation Runbook

Date: 2026-08-13

## 1. Artifact identity

Verify the release ZIP against the companion `.sha256` file before deployment.

## 2. Static preflight

From the extracted package root:

```bash
npm run predeploy
```

Required result: `EZPK v424 deployment preflight PASS`.

The gate checks the full existing multilingual / security / migration baseline plus the v424 PC Header contract.

## 3. PC Header functional policy

For widths >=1200px verify:

- Normal Primary Navigation renders at 15px when space is available.
- Compact may render at 14.5px only after an actual geometry collision.
- Tight may render at 14px only after Compact still collides.
- Primary Navigation never drops below 14px.
- At least four accessible Primary destinations remain visible when four or more accessible destinations exist.
- The current page is promoted out of `More` whenever the available geometry can support it.
- Signed-in wide layouts progressively expose Season 6, Tips, and Request Board from `More` as space becomes available.
- Guest wide layouts may progressively expose Mini Games and Account Market.
- `More` disappears if no links remain inside it.
- Repeated resizing around a threshold does not make an item rapidly flap between Primary and More.
- Long member nicknames ellipsize only the nickname; rank and dropdown indicator remain readable.
- Alliance / Account / Language controls never overlap Primary Navigation.

## 4. Required live-host matrix

Languages:

`en, fr, de, ko, th, ja, pt, es, tr, zh-tw, it, ar, vi, id`

Account states:

- Guest
- active Member
- Admin-capable member

Viewport widths:

`1199, 1200, 1201, 1280, 1366, 1440, 1600, 1920`

Browser zoom:

`100%, 125%, 150%`

At each PC case inspect the Header dataset / visual result and require:

- Primary font >=14px;
- `data-ezpk-header-primary-collision="0"`;
- `data-ezpk-header-primary-out-of-bounds="0"`;
- `data-ezpk-header-primary-nav-overflow="0"`;
- `data-ezpk-header-active-primary="true"` whenever current-route geometry permits the active item to be exposed;
- `data-ezpk-header-fit-unresolved="0"` for supported layouts;
- no duplicated menu destination between Primary and `More`;
- no empty `More` button;
- no visible stale Compact/Tight state after language changes.

## 5. Wide-PC behavior check

At 1600 and 1920px, especially in short-label languages such as Korean/Japanese/Traditional Chinese, confirm that spare Header capacity is used by Navigation instead of leaving a small fixed four-item cluster.

Expected signed-in progression when geometry allows:

`Vote · BGB · Capital War · Members · Season 6 · Tips · Request Board · More`

The exact number is geometry-driven, not hard-coded to viewport width. A long translation, account nickname, or 125/150% zoom may legitimately keep more destinations inside `More`.

## 6. Boundary regression check

- 1199px: v421 mobile/tablet drawer behavior remains authoritative.
- 1200/1201px: PC Header appears without a font-size jump below 14px or overlapping actions.
- 1439/1440px: Alliance selector changes short/full label without breaking Navigation geometry.

## 7. Mobile preservation check

At <=1199px confirm:

- Guest Alliance selector remains at Drawer top.
- Authenticated Alliance selector remains at Drawer bottom.
- DUAL two-button selector behavior is unchanged.
- v420 persistent hamburger discovery cue remains present.
- reduced-motion behavior remains unchanged.

## 8. Browser-validation limitation

The build environment's managed Chromium headless process was attempted for local visual validation but did not terminate before timeout and emitted no usable DOM result. Treat this as **not executed**, not as PASS. The live-host matrix above is the final release gate.
