# EZPK v427 — Admin Authority / Header Shell Hotfix Report

## Severity
Critical administrator runtime regression.

## User-visible symptom reproduced from the reported runtime
- Administrator content could become visible/usable enough to reach the admin shell.
- The shared Header account area remained on `확인 중`.
- On mobile, the administrator hamburger was unavailable/unreliable.

## Root cause
The administrator page had two independent authentication consumers:

1. `admin/admin.js` verified administrator access.
2. `shared-header.js` separately bootstrapped the public account state through `/api/auth/me`.

The screenshot showed the administrator body while the Header still displayed `확인 중`, proving the two states could diverge. The mobile hamburger binding was also owned by the shared Header's later initialization path, so a partial Header bootstrap could leave the administrator body unlocked while the mobile control remained unusable.

## v427 remediation
### 1. Single administrator authority
`GET /api/admin/my-permissions` is now the canonical administrator bootstrap endpoint. It already enforces `requireAdmin`; v427 extends the successful payload with the verified public member representation.

`admin/admin.js` therefore no longer performs `/api/auth/me?admin_verify=...` followed by a second permission request. One server-authoritative response provides:
- verified administrator member
- `adminLevel`
- menu permissions

### 2. Administrator Header no longer runs public startup auth
For `data-admin-context=true`, `shared-header.js` does not call the normal public `loadAuth()` startup path and does not render the normal loading account state during language application. The administrator Header account UI is driven by the verified administrator member delivered by `admin/admin.js`.

### 3. Independent mobile administrator drawer binding
Immediately after the shared Header creates the administrator Header and Drawer DOM, an administrator-specific shell binds `#menuBtn` in capture phase. It owns open/close behavior for the admin context and stops the normal public handler from double-toggling. This binding exists before later public Header initialization.

### 4. Cache coherence
All 23 shared user pages and the administrator page reference `shared-header.js?v=4270`, eliminating mixed old/new shared Header bytes after deployment. Administrator first-party assets use `v=4270`.

### 5. Mobile viewport containment
The unlocked administrator shell is constrained to the viewport on <=900px so horizontal content cannot push the hamburger off-screen.

## Protected behavior
- v425 Mini Games card flow remediation unchanged.
- v424 adaptive PC Header fitter unchanged.
- v421 mobile Alliance selector semantics unchanged for non-admin pages.
- v420 hamburger discovery cue unchanged for public pages.
- 30 D1 migrations unchanged byte-for-byte.
- Worker change is backward-compatible: an existing admin-permissions response only gains `data.member`.

## Browser runtime limitation
A real production administrator session is not available inside this build environment. Static/source gates and package integrity are verified, but the final authenticated live-host check remains required.
