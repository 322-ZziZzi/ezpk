-- EZPK v439 migration-cycle reset
-- Purpose: remove all applicant-cycle data while preserving schema, migrations,
-- member/admin accounts, and migration_tier_settings for the next cycle.
-- Order is child-first to satisfy foreign-key relationships.

DELETE FROM migration_inquiry_replies;
DELETE FROM migration_inquiries;
DELETE FROM migration_inquiry_sessions;
DELETE FROM migration_applications;
DELETE FROM migration_import_batches;
DELETE FROM migration_rate_limits;

-- Remove migration-cycle audit entries that may retain applicant names, file names,
-- rejection reasons, memo snapshots, inquiry titles, or related identifiers.
DELETE FROM admin_activity_logs
WHERE category = 'migration'
   OR action LIKE 'migration_inquiry_%'
   OR target_type IN ('migration_application','migration_application_bulk','migration_import','migration_import_batch','migration_inquiry');

-- Reset AUTOINCREMENT counters only for tables that are now fully empty.
DELETE FROM sqlite_sequence
WHERE name IN (
  'migration_inquiry_replies',
  'migration_inquiries',
  'migration_inquiry_sessions',
  'migration_applications',
  'migration_import_batches'
);
