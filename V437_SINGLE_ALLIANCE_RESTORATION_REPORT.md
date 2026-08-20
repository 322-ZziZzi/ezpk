# EZPK v437 — Single Alliance Restoration Report

## Base authority

- Base artifact: `EZPK-v436-deploy-ready.zip`
- Base version: `4.3.6 / v436`
- Base SHA-256: `72f5437ddcd8136973507c67ccd3fc17cc0211272abd115d7287730ad0cbf5dc`
- Base size: `26,773,979 bytes`
- Base packaged files: `450`

## v437 operating decision

v437 converts the public portal from the v436 dual-alliance model to a deliberately enforced **EZPK1 SINGLE** model.

1. `https://ezpk322.com/` redirects to `https://ezpk1.ezpk322.com/`.
2. Legacy Gateway paths redirect to EZPK1 home and are no longer user-facing.
3. EZPK2 pages redirect to EZPK1 home.
4. EZPK2 `/api/*` requests are **not redirected**. They return HTTP `410` with `ALLIANCE_ARCHIVED`, preventing stale POST/PUT/DELETE traffic from crossing into EZPK1.
5. Production configuration no longer binds `EZPK2_DB` and no longer exposes EZPK2 migration-operation npm scripts.
6. The existing EZPK2 Cloudflare D1 database is **not deleted by this release**. It must be retained as archived historical data.
7. The shared desktop/mobile alliance selector implementation is retired from active shared-header runtime.
8. Cross-alliance nickname duplicate enforcement is removed from the backend. EZPK1 nickname uniqueness continues to be enforced inside the EZPK1 database.
9. The existing multilingual migration application entry is restored on the EZPK1 home page and links to `/migration/`.
10. No new D1 migration is introduced. Existing migration count remains 31 and latest remains `0032_v435_rank_review_cycles.sql`.

## Modified runtime/config files

- `worker.js`
- `wrangler.jsonc`
- `shared-header.js`
- `index.html`
- `inactive/index.html`
- `package.json`
- `package-lock.json`
- `README.md`

## New v437 governance/validation files

- `scripts/v437-deploy-guard.mjs`
- `V437_SINGLE_ALLIANCE_RESTORATION_REPORT.md`
- `V437_DEPLOY_VALIDATION_RUNBOOK.md`
- `V437_VALIDATION.json`
- `V437_FILE_CHECKSUMS.sha256`

## Safety notes

- Keep the `ezpk2.ezpk322.com` Worker route during the archive period. It is intentionally retained so legacy EZPK2 links are intercepted by the Worker rather than becoming uncontrolled/unhandled traffic.
- Do not re-add the EZPK2 D1 binding to the v437 production configuration.
- Do not delete the external `ezpk2-members` D1 database as part of deployment.
- v437 uses temporary HTTP `302` redirects for the root/Gateway/EZPK2 page transition. Permanent redirect conversion can be evaluated after production observation.
- Root-host `/api/*` compatibility remains mapped to EZPK1; user-facing root pages themselves redirect to the canonical EZPK1 host.

## Verification completed in build environment

- v437 deployment guard: PASS
- JavaScript/MJS syntax: 96/96 PASS
- JSON parse validation before v437 validation JSON creation: 61/61 PASS
- Worker route smoke: PASS for root home, root Gateway, EZPK1 Gateway, EZPK2 page, EZPK2 GET API, EZPK2 POST API, EZPK1 site-context
- D1 schema change: none
- Wrangler `deploy --dry-run`: not executed in this build container because the v436 package intentionally does not contain installed `node_modules` / a local `wrangler` binary. The deploy guard and syntax/runtime route checks do not depend on it.
