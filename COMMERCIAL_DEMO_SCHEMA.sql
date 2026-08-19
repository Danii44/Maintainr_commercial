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

CREATE TABLE IF NOT EXISTS demo_inquiries (
  id bigserial PRIMARY KEY,
  unit_code varchar(32),
  created_by_id bigint NOT NULL REFERENCES demo_accounts(id),
  assigned_to_id bigint REFERENCES demo_accounts(id),
  kind varchar(24) NOT NULL DEFAULT 'INQUIRY' CHECK (kind IN ('INQUIRY', 'COMPLAINT')),
  status varchar(24) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_REVIEW', 'RESOLVED', 'CLOSED')),
  subject varchar(255) NOT NULL,
  body text NOT NULL,
  resolution text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_conversations (
  id bigserial PRIMARY KEY,
  ticket_id bigint REFERENCES demo_tickets(id) ON DELETE SET NULL,
  inquiry_id bigint REFERENCES demo_inquiries(id) ON DELETE SET NULL,
  subject varchar(255) NOT NULL,
  kind varchar(24) NOT NULL DEFAULT 'GENERAL' CHECK (kind IN ('GENERAL', 'TICKET', 'INQUIRY')),
  created_by_id bigint NOT NULL REFERENCES demo_accounts(id),
  is_closed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_conversation_participants (
  conversation_id bigint NOT NULL REFERENCES demo_conversations(id) ON DELETE CASCADE,
  account_id bigint NOT NULL REFERENCES demo_accounts(id) ON DELETE CASCADE,
  last_read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, account_id)
);

CREATE TABLE IF NOT EXISTS demo_messages (
  id bigserial PRIMARY KEY,
  conversation_id bigint NOT NULL REFERENCES demo_conversations(id) ON DELETE CASCADE,
  author_id bigint NOT NULL REFERENCES demo_accounts(id),
  body text NOT NULL CHECK (char_length(trim(body)) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_appointments (
  id bigserial PRIMARY KEY,
  unit_code varchar(32),
  ticket_id bigint REFERENCES demo_tickets(id) ON DELETE SET NULL,
  technician_id bigint REFERENCES demo_accounts(id) ON DELETE SET NULL,
  created_by_id bigint NOT NULL REFERENCES demo_accounts(id),
  title varchar(255) NOT NULL,
  notes text,
  status varchar(24) NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
  scheduled_start timestamptz NOT NULL,
  scheduled_end timestamptz NOT NULL CHECK (scheduled_end > scheduled_start),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_evidence_assets (
  id bigserial PRIMARY KEY,
  ticket_id bigint REFERENCES demo_tickets(id) ON DELETE CASCADE,
  inquiry_id bigint REFERENCES demo_inquiries(id) ON DELETE CASCADE,
  uploaded_by_id bigint NOT NULL REFERENCES demo_accounts(id),
  evidence_url text NOT NULL,
  file_name varchar(255) NOT NULL,
  content_type varchar(128) NOT NULL,
  purpose varchar(32) NOT NULL CHECK (purpose IN ('ISSUE_EVIDENCE', 'COMPLETION_PROOF', 'INQUIRY_ATTACHMENT')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS demo_sessions_account_expiry_idx ON demo_sessions(account_id, expires_at);
CREATE INDEX IF NOT EXISTS demo_tickets_unit_status_idx ON demo_tickets(unit_code, status, created_at DESC);
CREATE INDEX IF NOT EXISTS demo_tickets_assignee_status_idx ON demo_tickets(assigned_to_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS demo_ticket_activity_ticket_created_idx ON demo_ticket_activity(ticket_id, created_at DESC);
CREATE INDEX IF NOT EXISTS demo_inquiries_status_idx ON demo_inquiries(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS demo_inquiries_unit_idx ON demo_inquiries(unit_code, created_at DESC);
CREATE INDEX IF NOT EXISTS demo_conversation_participants_account_idx ON demo_conversation_participants(account_id, conversation_id);
CREATE INDEX IF NOT EXISTS demo_messages_conversation_created_idx ON demo_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS demo_appointments_unit_start_idx ON demo_appointments(unit_code, scheduled_start);
CREATE INDEX IF NOT EXISTS demo_appointments_technician_start_idx ON demo_appointments(technician_id, scheduled_start);
CREATE INDEX IF NOT EXISTS demo_evidence_assets_ticket_idx ON demo_evidence_assets(ticket_id, created_at);

CREATE TABLE IF NOT EXISTS demo_notifications (
  id bigserial PRIMARY KEY,
  account_id bigint NOT NULL REFERENCES demo_accounts(id) ON DELETE CASCADE,
  type varchar(48) NOT NULL,
  title varchar(255) NOT NULL,
  body text,
  href varchar(512),
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS demo_notifications_account_unread_idx ON demo_notifications(account_id, read_at, created_at DESC);

COMMIT;
