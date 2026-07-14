-- Initial D1 schema. Additive-only from here on: new migrations add
-- nullable columns or new tables, never rename/drop columns the currently
-- deployed Functions still read (see docs/guides/DEPLOYING.md).

CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  received_at TEXT NOT NULL,
  updated_at TEXT,
  source TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  county TEXT,
  case_type TEXT,
  preferred_language TEXT,
  accident_date TEXT,
  injured TEXT,
  police_responded TEXT,
  fault_belief TEXT,
  spoke_with_insurance TEXT,
  description TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  consent INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_leads_received_at ON leads (received_at);

CREATE TABLE admin_users (
  email TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('superadmin', 'admin', 'user')),
  created_at TEXT NOT NULL
);

-- Seed the two accounts that were hardcoded in the old in-process adminAuth.js.
INSERT INTO admin_users (email, role, created_at) VALUES
  ('iam.mmonell@outlook.com', 'superadmin', datetime('now')),
  ('m.monellrodz@gmail.com', 'admin', datetime('now'));

-- Sessions and one-time login codes used to live in an in-memory Map, which
-- only worked because there was a single long-running Node process. Workers
-- are stateless per-request, so both need to live in D1 now.
CREATE TABLE admin_sessions (
  sid TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  expires_at INTEGER NOT NULL -- epoch ms
);

CREATE TABLE admin_login_codes (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  token TEXT NOT NULL,
  expires_at INTEGER NOT NULL, -- epoch ms
  attempts INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_login_codes_token ON admin_login_codes (token);

-- Naive per-IP rate limit for public endpoints (was an in-memory Map; Workers
-- have no shared memory across requests, so this moves to D1).
CREATE TABLE rate_limit_hits (
  ip TEXT NOT NULL,
  hit_at INTEGER NOT NULL -- epoch ms
);

CREATE INDEX idx_rate_limit_ip_time ON rate_limit_hits (ip, hit_at);
