# EZPK v426 — Administrator Auth & Mobile Drawer Critical Hotfix

## Scope
v426 is a surgical hotfix over v425 for two administrator-page failures reported on the live UI:

1. A valid administrator could reach `/admin/`, but the gate could remain at `관리자 세션을 확인하고 있습니다.` and the administration UI would not become usable.
2. On mobile, the administrator hamburger menu could be unavailable/unopenable while the gate was unresolved.

No DB migration, Worker API contract, public navigation, v424 PC Header behavior, v421 mobile Alliance selector, v420 discovery cue, or v425 Mini Games card contract is changed.

## Source-level failure path
The v425 administrator page had a fragile critical-loading chain:

- `admin.js` (which starts `verifyAdminSession`) appeared after the parser-blocking external XLSX CDN script and several other scripts.
- `initAdminLoginGate()` waited for `DOMContentLoaded`, so any later parser-blocking dependency could delay the actual auth gate even after `admin.js` was fetched.
- Administrator HTML still referenced critical local assets using old `v=4150` / `v=4160` cache tokens even though `shared-header.js` / `style.css` had evolved materially through later versions. This allowed stale browser assets to be mixed with the current deployed HTML/assets.
- The administrator mobile Header is intentionally hidden until `body.admin-unlocked`; therefore a delayed auth gate also suppresses the administrator hamburger UX. In addition, its button visibility was partially dependent on older shared mobile rules instead of an explicit administrator rule.

This path can produce the exact combined symptom: auth remains in the initial checking state, and the admin mobile Drawer cannot be used.

## v426 remediation

### Critical auth bootstrap ordering
`admin/index.html` now loads in this order:

1. current first-party i18n
2. current `shared-header.js`
3. current vehicle-power helper
4. **`admin.js` critical auth/bootstrap**
5. optional/local manager scripts
6. XLSX as an **async optional dependency**

The XLSX CDN can no longer block administrator session verification.

### Immediate, idempotent admin gate
`admin.js` now:

- starts the auth gate immediately when `#adminLogin` already exists (which is true at the bottom-of-body script position), instead of waiting for `DOMContentLoaded`;
- protects initialization with `adminLoginGateInitialized`;
- retries `/api/auth/me` up to three times with timeouts;
- exposes a diagnostic `window.EZPKAdminBootstrap` state;
- records phases: `checking`, `authorizing`, `verified`, `forbidden`, `signed-out`, `error`;
- keeps the server `/api/auth/me` result authoritative and only uses already-delivered shared-header state as a supplement after direct request failure.

### Manager-ready sequencing
Administrator authentication can complete immediately, but `ezpk-admin-ready` and initial operational-data loading are announced after the local DOM/parser chain is complete. This prevents a fast auth response from racing manager scripts that register `ezpk-admin-ready` listeners later in the document.

The optional async XLSX script does not participate in this gate.

### Cache coherency
All first-party CSS/JS referenced by `admin/index.html` now use `v=4260`, including:

- `style.css`
- `admin.css`
- `shared-header.js`
- `admin.js`
- manager scripts and admin-specific styles

This intentionally forces browsers to fetch one coherent v426 administrator asset set instead of reusing old v415/v416 URLs.

### Mobile administrator hamburger/Drawer
At `<=900px`, `admin.css` now explicitly guarantees:

- administrator `#menuBtn` is a visible 42×42 grid button;
- administrator Drawer is display-enabled after verified unlock;
- the existing `.admin-mobile-navigation-host` receives `.admin-card-navigation` immediately, independent of later manager initialization.

## Validation status
Static/source validation and packaging gates PASS. Live authenticated browser execution cannot be performed from this environment because it does not possess the user's production administrator session. Final live gate should verify a real super-admin and sub-admin on desktop and mobile.
