# EZPK v415 — Deploy Validation Runbook

1. Use Node.js/npm in the normal deployment environment.
2. Run `npm ci`.
3. Run `npm run predeploy` — must report the EZPK v415 deployment preflight PASS message.
4. Run `npm run deploy:dry-run` — validates the Cloudflare Worker build without publishing.
5. Perform a browser smoke matrix for all 14 languages across the 25 multilingual user entry pages, prioritizing dynamic dialogs, generated images, canvas games, and ARIA/alt state changes.
6. Deploy only after the runtime smoke gate is accepted.

No database migration is required for v415. The existing 30 migration files are unchanged from v414.
