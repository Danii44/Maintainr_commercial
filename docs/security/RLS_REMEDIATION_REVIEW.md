# Commercial Row Level Security Remediation Review

> **Review-only material.** This document and its companion SQL file are intentionally **not** an instruction to modify the production database automatically. Execute nothing until an authorized owner approves the plan, confirms backups, and schedules a deployment window.

The Commercial Supabase project (`bmywscqounizewhknbkr`) was inspected in read-only mode on 20 August 2026. The audit identified that **RLS was disabled on all 14 public Commercial tables**. This database is correctly separate from the operational SaaS database: it holds public quote enquiries and the isolated product demo only, not live Maintainr property-management records.

Supabase recommends enabling RLS on exposed tables and pairing it with explicit grants; a table with RLS disabled can be accessible to any database role that retains a grant.[1]

## Scope and safety posture

The companion script, [`20260821_commercial_rls_lockdown_review.sql`](../../supabase/review-only/20260821_commercial_rls_lockdown_review.sql), enables RLS and revokes all `anon` and `authenticated` table privileges on the Commercial project. It deliberately creates **no** permissive browser-side policy because the production site submits quote forms and runs the demo through server-side Netlify Functions using a protected `COMMERCIAL_DATABASE_URL`.

| Data domain | Tables protected in Stage 1 |
|---|---|
| Public conversion | `quote_requests` |
| Isolated demo identity and sessions | `demo_accounts`, `demo_sessions` |
| Demo workflow | `demo_tickets`, `demo_ticket_activity`, `demo_reminders`, `demo_reminder_acknowledgements`, `demo_inquiries` |
| Demo communications and scheduling | `demo_conversations`, `demo_conversation_participants`, `demo_messages`, `demo_appointments`, `demo_notifications` |
| Demo evidence | `demo_evidence_assets` |

The demo continues to use the same four roles—**PROPERTY_MANAGER**, **TENANT**, **TECHNICIAN**, and **FLAT_OWNER**—inside its isolated workflow. The RLS lockdown prevents a browser from bypassing the Netlify handler and querying any of these records directly.

## Required review before approval

| Review item | Required acceptance criterion |
|---|---|
| Serverless data path | Confirm `COMMERCIAL_DATABASE_URL` is available only to serverless functions and never embedded in browser assets, analytics, build logs, or documentation. |
| Quote flow | Validate that the public quote endpoint is server-side and rate-limited or otherwise protected from abuse; no direct table insert should be exposed to `anon`. |
| Demo sessions | Validate secure, `HttpOnly`, `SameSite=Lax` demo session cookies and confirm that account, ticket, notification, and conversation filtering happens in the handler. |
| Direct client access | Confirm the commercial site does not use Supabase PostgREST, Realtime, Storage, or RPC from browser code. If it does, pause Stage 1 and design tested policies first. |
| Backup and migration process | Record a backup, named rollback owner, and a committed numbered migration before any live change. |

## Approved deployment sequence

First, restore the Commercial database into a non-production project. Apply the review script only there, then run the automated Commercial tests and manually validate quote submission, demo login, all four role dashboards, ticket creation and assignment, notifications, reminders, conversations, appointments, password change, and logout.

After successful staging verification, take a fresh production backup and deploy the approved migration in a maintenance window. Confirm all 14 tables report `rowsecurity = true`, validate the public quote conversion flow, and repeat the isolated demo journey. Check separately that the live SaaS project is untouched.

## Future direct-client policy design

If a direct Supabase client is deliberately added later, create separate `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies for the exact roles and rows required. Grants and policies are separate protections, and a broad `USING (true)` or `WITH CHECK (true)` policy would defeat the purpose of the lockdown.[1] The demo requires a verified identity-to-`demo_accounts` mapping before any client-side policy can safely filter role, assigned ticket, unit, or conversation-participant access.

## Explicit non-actions

No RLS statement in this repository has been applied to `bmywscqounizewhknbkr`. No quote records, demo accounts, sessions, tickets, notifications, or other production data have been changed. The companion SQL is a **review artifact only**.

## References

[1]: https://supabase.com/docs/guides/database/postgres/row-level-security "Supabase: Row Level Security"
