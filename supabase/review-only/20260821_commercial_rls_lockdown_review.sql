-- REVIEW ONLY — DO NOT APPLY TO PRODUCTION WITHOUT AN APPROVED DEPLOYMENT WINDOW.
-- Target: Maintainr Commercial Supabase project only (bmywscqounizewhknbkr).
-- Never run this script against the live Maintainr SaaS project.
--
-- Intent: block direct anon/authenticated access to quote and isolated-demo
-- tables. The Commercial application uses server-side Netlify Functions with a
-- protected database connection; this script creates no permissive browser-side
-- policies.
--
-- Before execution, confirm:
--   1. COMMERCIAL_DATABASE_URL remains available only to Netlify Functions.
--   2. Quote submissions and demo sessions do not use direct Supabase browser APIs.
--   3. A production backup, rollback owner, and smoke-test window are available.

-- Preflight: this must return exactly the listed Commercial tables.
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = ANY (ARRAY[
    'quote_requests',
    'demo_accounts',
    'demo_sessions',
    'demo_tickets',
    'demo_ticket_activity',
    'demo_reminders',
    'demo_reminder_acknowledgements',
    'demo_inquiries',
    'demo_conversations',
    'demo_conversation_participants',
    'demo_messages',
    'demo_appointments',
    'demo_evidence_assets',
    'demo_notifications'
  ]::text[])
ORDER BY tablename;

BEGIN;

DO $$
DECLARE
  target_table text;
BEGIN
  FOREACH target_table IN ARRAY ARRAY[
    'quote_requests',
    'demo_accounts',
    'demo_sessions',
    'demo_tickets',
    'demo_ticket_activity',
    'demo_reminders',
    'demo_reminder_acknowledgements',
    'demo_inquiries',
    'demo_conversations',
    'demo_conversation_participants',
    'demo_messages',
    'demo_appointments',
    'demo_evidence_assets',
    'demo_notifications'
  ]::text[]
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target_table);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', target_table);
  END LOOP;
END $$;

COMMIT;

-- Postflight: all rows must show rowsecurity = true.
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = ANY (ARRAY[
    'quote_requests',
    'demo_accounts',
    'demo_sessions',
    'demo_tickets',
    'demo_ticket_activity',
    'demo_reminders',
    'demo_reminder_acknowledgements',
    'demo_inquiries',
    'demo_conversations',
    'demo_conversation_participants',
    'demo_messages',
    'demo_appointments',
    'demo_evidence_assets',
    'demo_notifications'
  ]::text[])
ORDER BY tablename;

-- Rollback is intentionally not automated. If an approved deployment proves
-- incompatible, restore from the pre-change backup or issue a separately
-- reviewed script that disables RLS only on the affected table.
--
-- Do not add broad `USING (true)` or `WITH CHECK (true)` policies. If direct
-- Supabase browser access is added later, introduce narrowly scoped policies
-- only after a verified identity-to-demo-account model is designed.
