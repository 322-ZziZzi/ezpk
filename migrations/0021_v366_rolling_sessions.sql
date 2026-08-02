-- v366: keep active member logins for 365 days and renew on authentication checks.

INSERT INTO settings (key, value, updated_at, updated_by)
VALUES ('session_duration_days', '365', CURRENT_TIMESTAMP, 'system')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP,
  updated_by = 'system';
