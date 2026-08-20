SELECT 'migration_applications' AS table_name, COUNT(*) AS row_count FROM migration_applications;
SELECT 'migration_import_batches' AS table_name, COUNT(*) AS row_count FROM migration_import_batches;
SELECT 'migration_rate_limits' AS table_name, COUNT(*) AS row_count FROM migration_rate_limits;
SELECT 'migration_inquiry_sessions' AS table_name, COUNT(*) AS row_count FROM migration_inquiry_sessions;
SELECT 'migration_inquiries' AS table_name, COUNT(*) AS row_count FROM migration_inquiries;
SELECT 'migration_inquiry_replies' AS table_name, COUNT(*) AS row_count FROM migration_inquiry_replies;
SELECT 'migration_related_admin_logs' AS table_name, COUNT(*) AS row_count
FROM admin_activity_logs
WHERE category = 'migration'
   OR action LIKE 'migration_inquiry_%'
   OR target_type IN (
     'migration_application',
     'migration_application_bulk',
     'migration_import',
     'migration_import_batch',
     'migration_inquiry'
   );
SELECT 'migration_tier_settings_preserved' AS table_name, COUNT(*) AS row_count FROM migration_tier_settings;
