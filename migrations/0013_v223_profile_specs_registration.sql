-- EZPK v223: distinguish unregistered profile specs from real values
ALTER TABLE member_specs ADD COLUMN profile_specs_registered INTEGER NOT NULL DEFAULT 0 CHECK (profile_specs_registered IN (0,1));

-- All rows that existed before v223 already came from the old mandatory signup flow.
UPDATE member_specs SET profile_specs_registered = 1;
