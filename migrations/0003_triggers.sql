-- EZPK v179-1 free-plan migration: automatic timestamps and power normalization

CREATE TRIGGER IF NOT EXISTS trg_members_updated_at
AFTER UPDATE ON members
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE members
  SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_member_specs_updated_at
AFTER UPDATE ON member_specs
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE member_specs
  SET updated_at = CURRENT_TIMESTAMP
  WHERE member_id = NEW.member_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_settings_updated_at
AFTER UPDATE ON settings
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
  UPDATE settings
  SET updated_at = CURRENT_TIMESTAMP
  WHERE key = NEW.key;
END;

CREATE TRIGGER IF NOT EXISTS trg_specs_normalize_after_insert
AFTER INSERT ON member_specs
FOR EACH ROW
BEGIN
  UPDATE member_specs
  SET
    vehicle1_power_normalized =
      CASE
        WHEN NEW.vehicle1_power_value IS NULL
          OR NEW.vehicle1_power_unit IS NULL
        THEN NULL
        WHEN NEW.vehicle1_power_unit = 'G'
        THEN NEW.vehicle1_power_value * 1000.0
        ELSE NEW.vehicle1_power_value
      END,
    vehicle2_power_normalized =
      CASE
        WHEN NEW.vehicle2_power_value IS NULL
          OR NEW.vehicle2_power_unit IS NULL
        THEN NULL
        WHEN NEW.vehicle2_power_unit = 'G'
        THEN NEW.vehicle2_power_value * 1000.0
        ELSE NEW.vehicle2_power_value
      END
  WHERE member_id = NEW.member_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_specs_normalize_after_update
AFTER UPDATE OF
  vehicle1_power_value,
  vehicle1_power_unit,
  vehicle2_power_value,
  vehicle2_power_unit
ON member_specs
FOR EACH ROW
BEGIN
  UPDATE member_specs
  SET
    vehicle1_power_normalized =
      CASE
        WHEN NEW.vehicle1_power_value IS NULL
          OR NEW.vehicle1_power_unit IS NULL
        THEN NULL
        WHEN NEW.vehicle1_power_unit = 'G'
        THEN NEW.vehicle1_power_value * 1000.0
        ELSE NEW.vehicle1_power_value
      END,
    vehicle2_power_normalized =
      CASE
        WHEN NEW.vehicle2_power_value IS NULL
          OR NEW.vehicle2_power_unit IS NULL
        THEN NULL
        WHEN NEW.vehicle2_power_unit = 'G'
        THEN NEW.vehicle2_power_value * 1000.0
        ELSE NEW.vehicle2_power_value
      END
  WHERE member_id = NEW.member_id;
END;
