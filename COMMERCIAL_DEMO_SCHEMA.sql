-- Maintainr commercial demo workspace schema.
-- Apply only to the separate commercial/demo Supabase database.
-- Never apply this file to the live Maintainr SaaS database.
-- This file is idempotent and contains no production customer data.

BEGIN;

CREATE TABLE IF NOT EXISTS demo_accounts (
  id bigserial PRIMARY KEY,
  email varchar(320) NOT NULL UNIQUE,
  display_name varchar(255) NOT NULL,
  role varchar(32) NOT NULL CHECK (role IN ('PROPERTY_MANAGER', 'TENANT', 'TECHNICIAN', 'FLAT_OWNER')),
  password_hash text NOT NULL,
  phone varchar(32),
  avatar_url text,
  unit_code varchar(32) NOT NULL DEFAULT 'A-204',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE demo_accounts ADD COLUMN IF NOT EXISTS phone varchar(32);
ALTER TABLE demo_accounts ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE demo_accounts ADD COLUMN IF NOT EXISTS unit_code varchar(32) NOT NULL DEFAULT 'A-204';

CREATE TABLE IF NOT EXISTS demo_sessions (
  token_hash char(64) PRIMARY KEY,
  account_id bigint NOT NULL REFERENCES demo_accounts(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_tickets (
  id bigserial PRIMARY KEY,
  title varchar(255) NOT NULL CHECK (char_length(trim(title)) >= 3),
  description text NOT NULL CHECK (char_length(trim(description)) >= 10),
  unit_code varchar(32) NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED')),
  priority varchar(16) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  submitted_by_id bigint NOT NULL REFERENCES demo_accounts(id),
  assigned_to_id bigint REFERENCES demo_accounts(id),
  resolution_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_ticket_activity (
  id bigserial PRIMARY KEY,
  ticket_id bigint NOT NULL REFERENCES demo_tickets(id) ON DELETE CASCADE,
  actor_id bigint NOT NULL REFERENCES demo_accounts(id),
  action varchar(64) NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_reminders (
  id bigserial PRIMARY KEY,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  unit_code varchar(32),
  assigned_to_id bigint REFERENCES demo_accounts(id),
  due_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_reminder_acknowledgements (
  reminder_id bigint NOT NULL REFERENCES demo_reminders(id) ON DELETE CASCADE,
  account_id bigint NOT NULL REFERENCES demo_accounts(id) ON DELETE CASCADE,
  acknowledged_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (reminder_id, account_id)
);

CREATE INDEX IF NOT EXISTS demo_sessions_account_expiry_idx ON demo_sessions(account_id, expires_at);
CREATE INDEX IF NOT EXISTS demo_tickets_unit_status_idx ON demo_tickets(unit_code, status, created_at DESC);
CREATE INDEX IF NOT EXISTS demo_tickets_assignee_status_idx ON demo_tickets(assigned_to_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS demo_ticket_activity_ticket_created_idx ON demo_ticket_activity(ticket_id, created_at DESC);

COMMIT;
