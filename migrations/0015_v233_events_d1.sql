-- v233: move event schedule storage from GitHub JSON to Cloudflare D1 for immediate updates.

CREATE TABLE IF NOT EXISTS event_schedule_meta (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  last_updated TEXT NOT NULL DEFAULT '',
  timezone TEXT NOT NULL DEFAULT 'UTC-02:00',
  timezone_label TEXT NOT NULL DEFAULT 'ST',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slot_no INTEGER NOT NULL UNIQUE CHECK (slot_no BETWEEN 1 AND 9),
  title TEXT NOT NULL DEFAULT '',
  starts_at TEXT NOT NULL DEFAULT '',
  ends_at TEXT NOT NULL DEFAULT '',
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0,1)),
  important INTEGER NOT NULL DEFAULT 0 CHECK (important IN (0,1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_enabled_starts_at ON events(enabled, starts_at);

CREATE INDEX IF NOT EXISTS idx_events_priority_starts_at ON events(important DESC, starts_at);

INSERT INTO event_schedule_meta(id,last_updated,timezone,timezone_label) VALUES(1,'2026.07.27','UTC-02:00','ST') ON CONFLICT(id) DO NOTHING;

INSERT INTO events(slot_no,title,starts_at,ends_at,enabled,important) VALUES(1,'LAST SEASON WAR','2026-07-18T11:00:00-02:00','2026-07-18T13:00:00-02:00',0,0) ON CONFLICT(slot_no) DO NOTHING;

INSERT INTO events(slot_no,title,starts_at,ends_at,enabled,important) VALUES(2,'BGB - A TEAM','2026-07-19T10:00:00-02:00','2026-07-19T10:50:00-02:00',0,0) ON CONFLICT(slot_no) DO NOTHING;

INSERT INTO events(slot_no,title,starts_at,ends_at,enabled,important) VALUES(3,'BGB - B TEAM','2026-07-19T19:00:00-02:00','2026-07-19T19:50:00-02:00',0,0) ON CONFLICT(slot_no) DO NOTHING;

INSERT INTO events(slot_no,title,starts_at,ends_at,enabled,important) VALUES(4,'Frankie A','2026-07-27T11:00:00-02:00','2026-07-27T12:00:00-02:00',1,0) ON CONFLICT(slot_no) DO NOTHING;

INSERT INTO events(slot_no,title,starts_at,ends_at,enabled,important) VALUES(5,'Frankie B','2026-07-27T19:00:00-02:00','2026-07-27T20:00:00-02:00',1,0) ON CONFLICT(slot_no) DO NOTHING;

INSERT INTO events(slot_no,title,starts_at,ends_at,enabled,important) VALUES(6,'Capital Clash','2026-08-01T12:00:00-02:00','2026-08-01T14:00:00-02:00',1,0) ON CONFLICT(slot_no) DO NOTHING;

INSERT INTO events(slot_no,title,starts_at,ends_at,enabled,important) VALUES(7,'Lv.3 Territory Capture','2026-07-28T00:00:00-02:00','2026-07-28T00:20:00-02:00',1,0) ON CONFLICT(slot_no) DO NOTHING;

INSERT INTO events(slot_no,title,starts_at,ends_at,enabled,important) VALUES(8,'Core Embers','2026-07-27T12:00:00-02:00','2026-07-27T13:00:00-02:00',1,0) ON CONFLICT(slot_no) DO NOTHING;

INSERT INTO events(slot_no,title,starts_at,ends_at,enabled,important) VALUES(9,'','','',0,0) ON CONFLICT(slot_no) DO NOTHING;
