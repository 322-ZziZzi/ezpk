SELECT 'migration_applications' AS table_name, COUNT(*) AS row_count FROM migration_applications
UNION ALL SELECT 'migration_import_batches', COUNT(*) FROM migration_import_batches
UNION ALL SELECT 'migration_rate_limits', COUNT(*) FROM migration_rate_limits
UNION ALL SELECT 'migration_inquiry_sessions', COUNT(*) FROM migration_inquiry_sessions
UNION ALL SELECT 'migration_inquiries', COUNT(*) FROM migration_inquiries
UNION ALL SELECT 'migration_inquiry_replies', COUNT(*) FROM migration_inquiry_replies
UNION ALL SELECT 'migration_related_admin_logs', COUNT(*) FROM admin_activity_logs
  WHERE category='migration' OR action LIKE 'migration_inquiry_%'
     OR target_type IN ('migration_application','migration_application_bulk','migration_import','migration_import_batch','migration_inquiry')
UNION ALL SELECT 'migration_tier_settings_preserved', COUNT(*) FROM migration_tier_settings;
