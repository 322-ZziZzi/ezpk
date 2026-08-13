# V425 Deployment Validation Runbook

## Authority

- Version: `4.2.5 / v425`
- Scope: Mini Games multilingual card flow remediation across PC/tablet/mobile.
- Predecessor: v424.

## Automated predeploy gate

From the extracted package root:

```bash
npm run predeploy
```

Expected: `EZPK v425 deployment preflight PASS`.

The gate inherits the prior application/i18n/security/DB checks and adds the v425 Mini Games card contract checks.

## Mandatory live-host visual matrix

Test all supported languages: `en fr de ko th ja pt es tr zh-tw it ar vi id`.

At minimum test CSS viewport widths:

`320, 360, 390, 430, 560, 561, 768, 900, 901, 1200, 1366, 1440, 1920`

Repeat representative narrow/desktop widths at browser zoom `100%, 125%, 150%`. Wait for `document.fonts.ready` before final geometry adjudication.

For every tested state verify:

1. `PLAY` / translated equivalent never overlaps status/title/description.
2. `CURRENT GAME` / translated equivalent never overlaps status/title/description.
3. No card content is clipped.
4. No card or library creates horizontal page overflow.
5. Mobile <=560px is one column and descriptions remain visible.
6. 561-900px is two columns; >=901px is four columns.
7. Same-row cards align naturally on multi-column layouts; narrow-mobile cards use natural individual height.
8. Long German/French/Spanish/Turkish/Italian/Indonesian strings wrap without font collapse.
9. Arabic RTL keeps icon/text/action order coherent without directional-position hacks.
10. Keyboard focus on each playable card action remains fully visible.
11. Language switching updates card height immediately with no stale inline Text-Fit font sizes.
12. Game switching, current-game state, ranking, scoring, and game launch links still behave normally.

## Synthetic long-copy check

In a non-production test session, temporarily expand card status/title/description/action copy by about 50%. The card must grow vertically; it must not shrink typography, hide the description, clip content, or overlay the action.

## Deployment decision

- Automated gate PASS + live geometry matrix PASS: eligible for deployment.
- Any overlap/clipping/horizontal overflow/RTL/focus failure: do not promote; return to remediation.

Local managed Chromium cannot complete headless rendering in this environment, so browser PASS must come from the normal live-host/browser validation environment.
