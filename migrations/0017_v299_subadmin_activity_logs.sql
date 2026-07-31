ALTER TABLE members ADD COLUMN admin_level TEXT DEFAULT NULL CHECK (admin_level IS NULL OR admin_level IN ('sub','super'));
UPDATE members SET admin_level='super' WHERE role='admin' AND admin_level IS NULL;
CREATE TABLE IF NOT EXISTS admin_activity_logs (
 id INTEGER PRIMARY KEY AUTOINCREMENT, actor_member_id INTEGER, actor_login_id TEXT, actor_nickname TEXT NOT NULL,
 actor_admin_level TEXT NOT NULL CHECK(actor_admin_level IN ('super','sub')), category TEXT NOT NULL, action TEXT NOT NULL,
 target_type TEXT, target_id TEXT, target_name TEXT, before_data TEXT, after_data TEXT,
 result TEXT NOT NULL DEFAULT 'success' CHECK(result IN ('success','denied','failed')), failure_reason TEXT,
 ip_address TEXT, user_agent TEXT, request_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created ON admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_actor ON admin_activity_logs(actor_member_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_category ON admin_activity_logs(category);
