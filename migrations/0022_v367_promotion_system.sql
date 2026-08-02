-- EZPK v367: configurable R2/R3 promotion workflow
ALTER TABLE member_requests ADD COLUMN request_type TEXT NOT NULL DEFAULT 'general';
ALTER TABLE member_requests ADD COLUMN promotion_target_rank TEXT;
CREATE INDEX IF NOT EXISTS idx_member_requests_promotion_pending
  ON member_requests(member_id,request_type,promotion_target_rank,answered_at);
INSERT INTO settings(key,value,updated_at,updated_by)
VALUES('promotion_rules_v1','{"R2":{"industryLevel":7,"vehicle1PowerNormalized":1000},"R3":{"industryLevel":8,"vehicle1PowerNormalized":1300}}',CURRENT_TIMESTAMP,'migration')
ON CONFLICT(key) DO NOTHING;
INSERT INTO settings(key,value,updated_at,updated_by) VALUES('member_db_schema_version','5.1-v367',CURRENT_TIMESTAMP,'migration')
ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP,updated_by='migration';
