-- v244: Persist Capital War, Season 6, and BGB team assignments in D1.
CREATE TABLE IF NOT EXISTS strategy_content (
  content_key TEXT PRIMARY KEY,
  content_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_strategy_content_updated_at
  ON strategy_content(updated_at);
