# V310 Stage 3 — Menu Permission Management

- Added a real two-column System > Menu Permissions screen.
- Loads the current single sub-admin from D1.
- Stores per-menu permissions for Members, Events, Vote, BGB, Capital War, Season, Requests, and Accounts.
- Added GET/PUT `/api/admin/menu-permissions` endpoints restricted to the super admin.
- Saving permissions invalidates the sub-admin sessions and records an admin activity log.
- Added migration `0018_v310_subadmin_menu_permissions.sql`.
- Server-side enforcement of each menu permission is reserved for Stage 4.
