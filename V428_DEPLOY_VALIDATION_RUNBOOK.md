# EZPK v428 Deploy Validation Runbook

## Critical Admin Request Board gate
1. Sign in as super admin and open `/admin/`.
2. Open `요청`.
3. Confirm ordinary member requests render and the status leaves `요청을 불러오는 중...`.
4. Confirm Refresh and pagination work.
5. Answer one test request and reload it.
6. If migration inquiries exist, confirm they merge into the same list.
7. Sign in as a sub-admin with Requests permission and repeat the list load.
8. Remove Requests permission from a test sub-admin and confirm Request access is denied rather than hanging.

## Regression gate
- Admin authority/header from v427 remains functional.
- Mobile Admin hamburger/Drawer remains functional at 320/360/390/430/768/900px.
- PC Header v424 and public mobile Alliance selector v421 are unchanged.
- Mini Games v425 layout is unchanged.

## Database deployment check
Run the normal D1 migration list for both EZPK databases. v428 introduces no new migration. If production has migration inquiries but does not yet have the v405 soft-delete columns, v428 can still show member requests and uses a compatibility read for migration inquiries, but the canonical migration set should still be brought fully current.
