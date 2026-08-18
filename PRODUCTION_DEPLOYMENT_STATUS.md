# Maintainr Production Deployment Status

**Recorded:** 2026-08-18

## Live Products

| Product | Public URL | Repository | Database boundary |
|---|---|---|---|
| Maintainr SaaS | [maintainr-saas.netlify.app](https://maintainr-saas.netlify.app) | [`Danii44/Maintainr_Saas`](https://github.com/Danii44/Maintainr_Saas) | Dedicated Supabase project `oejssbztdzngukqkobun`; operational organizations, users, tickets, media metadata, sessions, reminders, invitations, and audit tables. |
| Maintainr Commercial | [maintainr-commercial.netlify.app](https://maintainr-commercial.netlify.app) | [`Danii44/Maintainr_commercial`](https://github.com/Danii44/Maintainr_commercial) | Dedicated Supabase project `bmywscqounizewhknbkr`; commercial `quote_requests` table only. |

## Enforced Environment Boundary

The SaaS Netlify project uses `DATABASE_URL`, `JWT_SECRET`, and `AUTH_BASE_URL`. The commercial Netlify project uses `COMMERCIAL_DATABASE_URL` and the public `VITE_SAAS_APP_URL` only. Neither site has the other site’s database connection string.

> The public demo remains browser-only fictional sample activity. It does not query, create, export, or change customer-workspace data.

## Current Commercial Conversion Routes

| Visitor intent | Route | Result |
|---|---|---|
| Explore a safe product preview | `/demo` | Fictitious role-based dashboard with no customer data. |
| Request a guided walkthrough | `/quote?intent=demo` | Writes a labelled guided-demo enquiry only to commercial `quote_requests`. |
| Request a commercial evaluation | `/quote?intent=quote` | Writes a labelled quotation enquiry only to commercial `quote_requests`. |
| Existing customer access | `https://maintainr-saas.netlify.app/sign-in` | Shared secure sign-in that routes the user to the correct role portal. |
| Create a real customer workspace | `https://maintainr-saas.netlify.app/create-workspace` | Self-service Property Manager workspace setup. |

## Validation Evidence

The commercial product passed four Vitest tests and the Netlify build. The SaaS product passed 57 Vitest tests and the Netlify build. The SaaS production database-health endpoint reported a connected and reachable schema. The commercial quotation function deployed successfully, rejected non-POST requests safely, and accepted one clearly labelled QA quotation record; direct verification confirmed that record exists in the commercial `quote_requests` table.

The current commercial conversion update is deployed from commit [`2b5d9ad`](https://github.com/Danii44/Maintainr_commercial/commit/2b5d9ad). It replaces the sign-in-led commercial conversion path with **Request demo**, **Request quote**, and a secondary **Customer portal** handoff. Arabic/RTL rendering was checked on the guided-demo request route.

## Remaining Operator Checks

The two products are deployed and their basic boundaries are verified. Before a customer launch, perform authenticated scenario testing with real Manager, Tenant, Technician, and Owner accounts; configure optional email/S3/SMS providers if the related production features are needed; and attach custom domains when ready. No real user-facing records should be created during those checks without the operator’s approval.

## Design Reference

The Maintainr experience uses an original information architecture informed by public product patterns observed on RunFleet—not copied content, claims, layouts, testimonials, or assets. See [the reference notes](./RUNFLEET_REFERENCE_NOTES.md) and [the Maintainr experience architecture](./REFRESHED_EXPERIENCE_ARCHITECTURE.md).
