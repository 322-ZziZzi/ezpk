# V310 Stage 4 — Admin Permission Enforcement

## Applied

- Added `GET /api/admin/my-permissions` for the signed-in administrator.
- Sub-admin navigation now displays only permitted menus.
- The `시스템` group remains super-admin only.
- Added server-side permission checks with HTTP 403 (`ADMIN_MENU_FORBIDDEN`).
- Applied permission checks to:
  - Members
  - Events
  - Vote
  - BGB
  - Capital War
  - Season
  - Requests
  - Accounts
- Member-list read access is shared with BGB/Capital War/Season because those managers require member data, while member detail/write operations still require the Members permission.
- Enforced a single sub-admin at the server level (`SUB_ADMIN_ALREADY_EXISTS`).
- Included `admin_level` in authenticated session member queries so super/sub roles are resolved correctly.
- Preserved super-admin-only access for menu permission management and activity logs.
- Preserved the no-auto-scroll administrator UX policy.

## Deployment note

Apply D1 migration `0018_v310_subadmin_menu_permissions.sql` before deployment if it has not already been applied.
