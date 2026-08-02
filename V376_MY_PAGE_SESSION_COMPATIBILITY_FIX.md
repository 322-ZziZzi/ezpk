# v376 · My Page session compatibility fix

- Keeps `/api/member/me` available when the optional v374 rank-change notice
  migration has not been applied yet.
- A missing `member_rank_changes.dismissed_at` column now disables only the
  rank-change notice instead of making My Page appear logged out.
- Existing login cookies, the rolling 365-day session, and all profile data are
  preserved.
- Apply `migrations/0025_v374_rank_change_notice_dismiss.sql` to restore the
  dismissible rank-change notice on environments where that migration is still
  pending.
