-- EZPK v179-1 free-plan migration: public and admin views

CREATE VIEW IF NOT EXISTS public_members AS
SELECT
  m.id,
  m.nickname,
  m.power,
  m.industry_level,
  m.member_rank,
  m.created_at AS joined_at,
  m.updated_at AS basic_updated_at,
  s.vehicle1_class,
  s.vehicle1_power_value,
  s.vehicle1_power_unit,
  s.vehicle1_power_normalized,
  s.vehicle2_class,
  s.vehicle2_power_value,
  s.vehicle2_power_unit,
  s.vehicle2_power_normalized,
  s.season_war_available,
  s.bgb_available_hour,
  s.updated_at AS spec_updated_at,
  CASE
    WHEN
      s.vehicle1_class IS NOT NULL
      AND s.vehicle1_power_value IS NOT NULL
      AND s.vehicle1_power_unit IS NOT NULL
      AND s.vehicle2_class IS NOT NULL
      AND s.vehicle2_power_value IS NOT NULL
      AND s.vehicle2_power_unit IS NOT NULL
      AND s.season_war_available IS NOT NULL
      AND s.bgb_available_hour IS NOT NULL
    THEN 1
    ELSE 0
  END AS spec_completed
FROM members AS m
LEFT JOIN member_specs AS s
  ON s.member_id = m.id
WHERE m.status = 'active';

CREATE VIEW IF NOT EXISTS admin_member_overview AS
SELECT
  m.id,
  m.login_id,
  m.nickname,
  m.power,
  m.industry_level,
  m.member_rank,
  m.role,
  m.status,
  m.must_change_password,
  m.nickname_updated_at,
  m.created_at,
  m.updated_at,
  m.last_login_at,
  m.password_changed_at,
  s.vehicle1_class,
  s.vehicle1_power_value,
  s.vehicle1_power_unit,
  s.vehicle1_power_normalized,
  s.vehicle2_class,
  s.vehicle2_power_value,
  s.vehicle2_power_unit,
  s.vehicle2_power_normalized,
  s.season_war_available,
  s.bgb_available_hour,
  s.discord,
  s.telegram,
  s.created_at AS spec_created_at,
  s.updated_at AS spec_updated_at,
  CASE
    WHEN
      s.vehicle1_class IS NOT NULL
      AND s.vehicle1_power_value IS NOT NULL
      AND s.vehicle1_power_unit IS NOT NULL
      AND s.vehicle2_class IS NOT NULL
      AND s.vehicle2_power_value IS NOT NULL
      AND s.vehicle2_power_unit IS NOT NULL
      AND s.season_war_available IS NOT NULL
      AND s.bgb_available_hour IS NOT NULL
    THEN 1
    ELSE 0
  END AS spec_completed
FROM members AS m
LEFT JOIN member_specs AS s
  ON s.member_id = m.id;
