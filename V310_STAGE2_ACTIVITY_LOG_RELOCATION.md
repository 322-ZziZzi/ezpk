# V310 Stage 2 - Activity Log Relocation

- Removed the member-page tab navigation.
- Removed the administrator activity log panel from Member Management.
- Moved the existing activity-log search, category filter, table, mobile cards, refresh, and pagination UI to System > Activity Logs.
- Reused the existing `/api/admin/logs` API and log-rendering logic.
- Member Management now opens directly with stats, toolbar, list, and detail content.
- Existing desktop/mobile common admin UX and no-auto-scroll behavior remain unchanged.
