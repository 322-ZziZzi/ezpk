-- EZPK v179-1 free-plan migration: indexes

CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);

CREATE INDEX IF NOT EXISTS idx_members_role_status ON members(role, status);

CREATE INDEX IF NOT EXISTS idx_members_nickname ON members(nickname COLLATE NOCASE);

CREATE INDEX IF NOT EXISTS idx_members_status_rank ON members(status, member_rank);

CREATE INDEX IF NOT EXISTS idx_members_status_industry ON members(status, industry_level);

CREATE INDEX IF NOT EXISTS idx_members_status_power ON members(status, power DESC);

CREATE INDEX IF NOT EXISTS idx_members_created_at ON members(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_members_last_login ON members(last_login_at DESC);

CREATE INDEX IF NOT EXISTS idx_members_nickname_updated ON members(nickname_updated_at);

CREATE INDEX IF NOT EXISTS idx_specs_vehicle1_class ON member_specs(vehicle1_class);

CREATE INDEX IF NOT EXISTS idx_specs_vehicle2_class ON member_specs(vehicle2_class);

CREATE INDEX IF NOT EXISTS idx_specs_vehicle1_power ON member_specs(vehicle1_power_normalized DESC);

CREATE INDEX IF NOT EXISTS idx_specs_vehicle2_power ON member_specs(vehicle2_power_normalized DESC);

CREATE INDEX IF NOT EXISTS idx_specs_season_available ON member_specs(season_war_available);

CREATE INDEX IF NOT EXISTS idx_specs_bgb_hour ON member_specs(bgb_available_hour);

CREATE INDEX IF NOT EXISTS idx_specs_updated_at ON member_specs(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_sessions_member ON sessions(member_id);

CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_sessions_member_expires ON sessions(member_id, expires_at);

CREATE INDEX IF NOT EXISTS idx_nickname_history_member ON member_nickname_history(member_id);

CREATE INDEX IF NOT EXISTS idx_nickname_history_member_changed ON member_nickname_history(member_id, changed_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_member_id);

CREATE INDEX IF NOT EXISTS idx_admin_logs_target ON admin_logs(target_member_id);

CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);

CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs(created_at DESC);
