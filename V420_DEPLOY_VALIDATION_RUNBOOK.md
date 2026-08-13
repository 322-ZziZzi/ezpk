# EZPK v420 — Deployment Validation Runbook

## Mandatory preflight

1. Verify artifact SHA-256 and ZIP CRC.
2. Run `npm run predeploy`; require PASS.
3. Confirm all 30 D1 migrations are unchanged from v419.
4. Do not run a database migration for v420; none is added.

## Hamburger discovery-cue runtime gate

Test at widths **900, 901, 1199, and 1200px** with normal motion settings.

- 900px: hamburger visible; gold glow/subtle shake repeats continuously.
- 901px: hamburger visible; same repeating cue remains active.
- 1199px: hamburger visible; same repeating cue remains active.
- 1200px: desktop header active; hamburger is not the responsive navigation control.
- Observe for at least 9 seconds at 900/901/1199px to prove the cue continues beyond two cycles.
- Opening and closing the drawer must not permanently remove the cue.
- Login state and previous menu-use state must not suppress the cue.

## Reduced-motion gate

With `prefers-reduced-motion: reduce`:

- no shake/pulse animation;
- hamburger keeps the static gold border/glow emphasis;
- menu remains fully usable.

## Regression smoke

- Language selection and v417 language-state synchronization.
- v419 desktop Header compact-fit and Alliance Select.
- Drawer open/close, outside click/close behavior, navigation links, Login/Sign-up/Account actions.
- No unexpected horizontal overflow at 900/901/1199/1200px.

Production promotion requires all mandatory runtime gates to pass in a normal browser environment.
