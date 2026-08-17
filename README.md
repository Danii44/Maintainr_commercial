# Maintainr Commercial

Maintainr Commercial is the standalone public product website for Maintainr. It provides bilingual English/Arabic product content, a safe fictional interactive demo dashboard, product and solution pages, FAQs, insights, contact paths, and a real quotation-request form.

## Strict separation from the SaaS product

This repository is deployed separately from [`Danii44/Maintainr_Saas`](https://github.com/Danii44/Maintainr_Saas). It does not contain or connect to customer workspaces, SaaS authentication, production tickets, media, reminder records, customer storage, or the SaaS PostgreSQL database.

| Commercial responsibility | Boundary |
| --- | --- |
| Marketing pages and demo dashboard | Browser-only fictional sample activity; no persistence and no SaaS API calls. |
| Quotation requests | Stored only in a separate commercial PostgreSQL/Supabase project through `COMMERCIAL_DATABASE_URL`. |
| SaaS conversion | Public links use `VITE_SAAS_APP_URL` to send a visitor to the real SaaS `/create-workspace` or `/sign-in` route. |

## Deploy on Netlify

1. Create a **separate** PostgreSQL or Supabase project for commercial quote enquiries.
2. Apply `COMMERCIAL_SCHEMA.sql` only to that commercial database.
3. Create Netlify environment variables from `.env.example`. `COMMERCIAL_DATABASE_URL` is server-only; `VITE_SAAS_APP_URL` is a public URL and never contains credentials.
4. Deploy with `pnpm build:netlify`. Set `dist/public` as the publish directory and `netlify/functions` as the Functions directory.
5. Confirm the demo works without a database connection, submit one quotation request, and verify the real SaaS links navigate to the production application domain.

## Demo safety

The `/demo` route is an interactive visual dashboard that resets in the visitor’s browser. It intentionally cannot create a live SaaS workspace, read a customer ticket, attach a customer file, send a message, export a record, or invoke the SaaS API.
