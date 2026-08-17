-- Run this only in the separate commercial-site PostgreSQL/Supabase project.
-- Never apply this schema to the Maintainr SaaS production database.
CREATE TYPE quote_request_status AS ENUM ('NEW', 'CONTACTED', 'CLOSED');

CREATE TABLE quote_requests (
  id bigserial PRIMARY KEY,
  name varchar(255) NOT NULL,
  organization_name varchar(255) NOT NULL,
  email varchar(320) NOT NULL,
  phone varchar(32),
  portfolio_category varchar(64) NOT NULL,
  portfolio_size_range varchar(24) NOT NULL,
  message text,
  status quote_request_status NOT NULL DEFAULT 'NEW',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX quote_requests_email_created_idx ON quote_requests (email, created_at);
CREATE INDEX quote_requests_status_created_idx ON quote_requests (status, created_at);
