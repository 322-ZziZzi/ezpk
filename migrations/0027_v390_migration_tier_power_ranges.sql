-- v390 Migration tier labels and published power ranges
-- Existing persisted keys (gray/blue/purple/gold) remain unchanged for compatibility.
-- The published UI notation is authoritative for display; exact boundary values are not auto-classified.
UPDATE migration_tier_settings SET
  sort_order = 4,
  label_ko = '일반',
  label_en = 'Normal',
  min_power_normalized = 0,
  max_power_normalized = 46,
  power_range_visible = 1,
  updated_at = CURRENT_TIMESTAMP
WHERE tier_key = 'gray';

UPDATE migration_tier_settings SET
  sort_order = 3,
  label_ko = '중급',
  label_en = 'Intermediate',
  min_power_normalized = 46,
  max_power_normalized = 90,
  power_range_visible = 1,
  updated_at = CURRENT_TIMESTAMP
WHERE tier_key = 'blue';

UPDATE migration_tier_settings SET
  sort_order = 2,
  label_ko = '고급',
  label_en = 'Advanced',
  min_power_normalized = 90,
  max_power_normalized = 200,
  power_range_visible = 1,
  updated_at = CURRENT_TIMESTAMP
WHERE tier_key = 'purple';

UPDATE migration_tier_settings SET
  sort_order = 1,
  label_ko = '특급',
  label_en = 'Special',
  min_power_normalized = 200,
  max_power_normalized = NULL,
  power_range_visible = 1,
  updated_at = CURRENT_TIMESTAMP
WHERE tier_key = 'gold';
