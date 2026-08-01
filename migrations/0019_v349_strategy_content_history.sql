-- v349: Preserve the previous strategy payload before every D1 overwrite.
CREATE TABLE IF NOT EXISTS strategy_content_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_key TEXT NOT NULL,
  content_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_strategy_content_history_key_created
  ON strategy_content_history(content_key, created_at DESC);
