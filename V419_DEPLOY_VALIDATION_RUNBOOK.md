# EZPK v419 Deploy Validation Runbook

## 1. Static preflight

```bash
npm run predeploy
```

Expected: `EZPK v419 deployment preflight PASS`.

## 2. Syntax

Run `node --check` for every `.js` / `.mjs` source outside generated dependency folders.

## 3. Header runtime matrix

Test 14 locales:

`en fr de ko th ja pt es tr zh-tw it ar vi id`

PC widths:

`1200 1201 1280 1380 1381 1440`

Breakpoint-transition checks:

`900 901 1024 1180 1181 1199`

At each width, verify guest Header and signed-in Header where available. Also repeat representative long locales (`fr`, `de`, `pt`, `es`, `id`, `ar`, `vi`) at 125% and 150% browser zoom.

### Runtime console checks

```js
const h = document.querySelector('[data-shared-header]');
({
  expected: h?.dataset.ezpkHeaderFitExpected,
  registered: h?.dataset.ezpkHeaderFitRegistered,
  unresolved: h?.dataset.ezpkHeaderFitUnresolved,
  overflow: h?.dataset.ezpkHeaderFitOverflow || null,
  level: [...document.querySelectorAll('[data-ezpk-header-fit-level]')].map(el => [el.id || el.className, el.dataset.ezpkHeaderFitLevel]),
  allianceVisible: (() => { const x=document.querySelector('#allianceSelectorLink'); return !!x && getComputedStyle(x).display !== 'none' && !x.hidden; })(),
  languageEllipsis: (() => { const x=document.querySelector('.desktop-language-label'); return x ? getComputedStyle(x).textOverflow : null; })()
});
```

PASS requires expected == registered and unresolved == `0` with no overflow flag.

## 4. Navigation behavior

- Confirm long Header actions do not overlap.
- Confirm primary nav items may move into `More` when space is tight.
- Confirm moved active item causes `More` to retain active highlighting.
- Confirm reopening/changing language does not duplicate items in `More`.
- Resize repeatedly across 1199/1200 and confirm no repeated oscillation/flicker.

## 5. Alliance selector contract

- <=1199px: desktop `.alliance-selector-link` is not displayed.
- <=1199px: the mobile drawer is the only Alliance Select control when DUAL mode is enabled.
- >=1200px: translated desktop Alliance Select is visible and never clipped/ellipsized.

## 6. Language selector

Verify the complete native name is visible, including `Bahasa Indonesia`, and the internal `.desktop-language-label` does not use ellipsis.

## 7. Regression gates

- language-state synchronization from v417
- content/card Text-Fit from v418/v419 body fitter
- migrations 30/30 exact baseline
- no page/card grid layout changes
- user nickname/account-generated data ellipsis unchanged

## 8. Deployment dry-run

When Wrangler is installed:

```bash
npm ci
npm run deploy:dry-run
```
