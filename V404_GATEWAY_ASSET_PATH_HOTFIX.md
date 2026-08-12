# EZPK v404 Gateway Asset Path Hotfix

## Root cause
The Gateway HTML is served by the Worker at the public root URL (`https://ezpk322.com/?select=1`) while the physical HTML file lives at `/gateway/index.html`. Relative references such as `gateway.css` and `gateway.js` were therefore resolved by the browser as `/gateway.css` and `/gateway.js`, not `/gateway/gateway.css` and `/gateway/gateway.js`. The common `/style.css` loaded, but Gateway-specific CSS/JS did not, leaving the alliance cards as raw browser links.

## Fix
- `/style.css?v=4040`
- `/gateway/gateway.css?v=4040`
- `/gateway/gateway.js?v=4040`

No D1 schema or migration changes. Worker routing and DB bindings are unchanged.
