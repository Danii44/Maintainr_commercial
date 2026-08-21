-- Run this only in the separate commercial-site PostgreSQL/Supabase project.
-- Never apply this schema to the Maintainr SaaS production database.
-- This script is safe to run more than once.
BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quote_request_status') THEN
    CREATE TYPE quote_request_status AS ENUM ('NEW', 'CONTACTED', 'CLOSED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS quote_requests (
  id bigserial PRIMARY KEY,
  name varchar(255) NOT NULL CHECK (char_length(trim(name)) >= 2),
  organization_name varchar(255) NOT NULL CHECK (char_length(trim(organization_name)) >= 2),
  email varchar(320) NOT NULL,
  phone varchar(32),
  portfolio_category varchar(64) NOT NULL CHECK (portfolio_category IN ('MULTI_FAMILY', 'RESIDENTIAL', 'COMMERCIAL', 'MIXED_USE', 'OTHER')),
  portfolio_size_range varchar(24) NOT NULL CHECK (portfolio_size_range IN ('1-10', '11-50', '51-250', '251-1000', '1000+')),
  message text CHECK (message IS NULL OR char_length(message) <= 2000),
  status quote_request_status NOT NULL DEFAULT 'NEW',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quote_requests_email_created_idx ON quote_requests (email, created_at);
CREATE INDEX IF NOT EXISTS quote_requests_status_created_idx ON quote_requests (status, created_at);

COMMIT;
