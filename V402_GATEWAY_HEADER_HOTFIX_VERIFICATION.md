# EZPK v402 Gateway + Desktop Header Hotfix

## Scope
- Code/config-only hotfix over v401 production.
- No new D1 migration. No database reset. No schema mutation.

## Root cause fixed
`assets.run_worker_first` in v401 only matched API/data paths. Because `/index.html` exists as a static asset, requests to `https://ezpk322.com/` and `/?select=1` were served by Static Assets before `worker.js` ran. Therefore the DUAL gateway routing branch never executed. The same precedence also prevented host-aware inactive-page routing from consistently running for normal static page requests.

## v402 fix
- `wrangler.jsonc`: `assets.run_worker_first = true` so Worker host/context routing executes before static assets. The Worker still delegates normal pages to `env.ASSETS.fetch(request)`.
- Desktop shared-header grid corrected from four to five columns after the v401 Alliance Select control added a fifth visible grid item.
- `style.css` and `shared-header.js` cache keys bumped to `v=4020`.
- No migration files changed.

## Expected production behavior
- `https://ezpk322.com/?select=1` always renders the EZPK1/EZPK2 gateway in DUAL mode.
- `https://ezpk322.com/` renders gateway for a guest unless a supported routing condition intentionally redirects.
- `https://ezpk1.ezpk322.com/` serves EZPK1.
- `https://ezpk2.ezpk322.com/` serves EZPK2 while active.
- EZPK2 inactive/archived host requests are intercepted before static assets and show the inactive UI.
- Desktop header keeps Brand | Navigation | Alliance Select | Account | Language on one grid row; responsive navigation can continue overflowing items into More.
