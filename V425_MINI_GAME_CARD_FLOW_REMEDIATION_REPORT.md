# V425 Mini Games Multilingual Flow-Safe Card Remediation Report

## Result

**STATIC / STRUCTURAL REMEDIATION: PASS**  
**Fresh browser geometry matrix: PENDING live-host verification**

## Root cause

The v424 Mini Games library cards were not translation-safe. Shared and legacy per-game CSS combined fixed/minimum card heights with `position:absolute` actions at the bottom-right. Long translated status/title/description strings could therefore occupy the same visual area as `PLAY` / `CURRENT GAME`. The narrow-mobile rule additionally hid descriptions instead of solving the layout contract, and v419 Text-Fit could independently shrink Mini Games titles/actions.

## v425 remediation

- `game-switcher.css` is now the common PC/tablet/mobile card authority (`?v=4250`) for all eight Mini Games pages.
- Cards are content-driven CSS Grid containers. No fixed `138px/124px/150px` card height is used by the active shared contract.
- `PLAY` and `CURRENT GAME` are direct grid items in the final normal-flow action row; `position:absolute`, `left`, and `right` placement are removed from the active contract.
- The action row uses a 44px minimum height, wraps long action text, stays within card width, and exposes an unclipped focus outline for links.
- Status/title/description wrap independently. Titles support targeted long-word breaking; descriptions prefer natural line breaking and hyphenation.
- Descriptions remain visible on narrow mobile. At `<=560px` the library becomes one column and every card grows to its own natural content height.
- At `561-900px` the existing two-column library remains; at `>=901px` the existing four-column library remains. CSS Grid stretch keeps cards aligned within each row without forcing every card on the page to the same height.
- `text-fit-v425.js` retains the v419 Text-Fit engine for the rest of each Mini Games page but hard-excludes `.game-library` and removes the explicit Mini Games title/action registrations. Translation overflow is therefore solved by layout rather than font shrinking.
- RTL uses logical Grid flow and contains no CTA `left/right` override.

## Preserved boundaries

- v424 PC Header adaptive expansion remains active and unchanged.
- v421 mobile Alliance selector remains unchanged.
- v420 hamburger discovery cue remains unchanged.
- Worker/API contracts and all 30 D1 migrations are unchanged.
- No Mini Game logic, scoring, ranking, or translation copy was changed.

## Static gates

The v425 predeploy guard requires:

- all eight Mini Games pages use `game-switcher.css?v=4250`;
- all eight use `text-fit-v425.js?v=4250` and no longer activate `text-fit-v419.js`;
- card actions are normal-flow Grid row items;
- no fixed card height, line clamp, narrow-mobile description hiding, or card nowrap remains in the active shared contract;
- 44px action minimum;
- long-title and description wrapping rules;
- Mini Games hard exclusion from generic Text-Fit;
- effective 14-language game-switcher coverage from the eight base locales plus the six v414 central remediation locales.

## Browser gate

The managed Chromium binary in this environment times out even for a minimal data-URL page before producing DOM output, so no browser geometry PASS is fabricated. The final live-host gate should cover the 14 languages at 320/360/390/430/560/561/768/900/901/1200/1366/1440/1920 CSS px and 100/125/150% zoom, after fonts are ready, checking zero text/CTA overlap, clipping, and horizontal overflow plus RTL and focus-ring behavior.
