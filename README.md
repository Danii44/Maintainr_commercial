# Maintainr Commercial

Maintainr Commercial is the standalone bilingual public website for the Maintainr product. It explains the platform, provides public product and quotation paths, and includes an isolated demonstration environment. It is not the customer SaaS application.

> **Database boundary:** This repository must use only `COMMERCIAL_DATABASE_URL`. It must never use the SaaS `DATABASE_URL`, SaaS sessions, customer tickets, customer media, production users, or production workspace data.

## How the product works

| Visitor path | What happens |
|---|---|
| Explore the website | The visitor reads bilingual English/Arabic product, workflow, role, security, FAQ, and company information. |
| Try demo | The visitor opens the isolated `/experience` journey and can explore role-aware sample workflows without accessing customer data. |
| Request a quotation | The visitor submits business contact and portfolio details to the commercial-only quotation endpoint. |
| Create a workspace | The public site sends the visitor to the separately deployed SaaS application at `/create-workspace`. |
| Existing customer sign-in | The public site sends the visitor to the separately deployed SaaS application at `/sign-in`. |

The commercial application does not manage customer work orders. The standalone SaaS at `Danii44/Maintainr_Saas` handles authentication, customer workspaces, maintenance operations, media, reminders, and customer data.

## Required services

You need Node.js 20 or later, pnpm, and a separate PostgreSQL database only if you want quotation persistence or the database-backed demo administration workflow. You also need the public URL of the independently deployed SaaS application.

## Install the commercial database

Create a dedicated commercial PostgreSQL database. Do not reuse the SaaS database. Apply the quotation schema, then the isolated demo schema:

```bash
psql "$COMMERCIAL_DATABASE_URL" -v ON_ERROR_STOP=1 -f COMMERCIAL_SCHEMA.sql
psql "$COMMERCIAL_DATABASE_URL" -v ON_ERROR_STOP=1 -f COMMERCIAL_DEMO_SCHEMA.sql
```

`COMMERCIAL_SCHEMA.sql` stores quotation requests only. `COMMERCIAL_DEMO_SCHEMA.sql` stores isolated sample demo accounts and workflow records only. Neither file contains or should receive SaaS customer data.

## Configure environment values

Copy `.env.example` for local reference. Place real values in the host's server-side secret manager; never commit them.

| Variable | Use |
|---|---|
| `VITE_SAAS_APP_URL` | Public URL of the separately deployed SaaS application; never a credential. |
| `COMMERCIAL_DATABASE_URL` | Server-only database URL for commercial quotation and demo data. |
| `DEMO_DEFAULT_PASSWORD` | Server-only password used only to provision disposable demo accounts. It must never match a live SaaS password. |

## Local commands

```bash
pnpm install
pnpm check
pnpm test
pnpm build
pnpm build:netlify
pnpm demo:setup
pnpm demo:verify
pnpm dev
```

Use `pnpm demo:reset` only against the commercial/demo database when you intentionally want to restore the labelled safe sample state. It never targets the SaaS database.

## Publish safely

For Netlify, use the existing `netlify.toml`, run `pnpm build:netlify`, publish `dist/public`, and deploy `netlify/functions`. Before publishing, test every navigation link, quotation submission, `/experience`, Arabic RTL, mobile layout, and the two SaaS handoff links. Confirm that `VITE_SAAS_APP_URL` points to the live SaaS domain and that no commercial secret appears in browser code.

## Security requirements

Collect only necessary business contact and portfolio data in quotation requests. Keep `COMMERCIAL_DATABASE_URL` and demo setup credentials server-side. Do not add customer reviews, customer names, production screenshots containing customer data, SaaS authentication cookies, or customer records to this repository.

## Kept project structure

The repository retains only active application, deployment, demo, test, and installation assets: `client/`, `netlify/`, `scripts/`, `tests/`, `.env.example`, the two non-duplicate SQL installers, `netlify.toml`, and package/config files. Generated output, credentials, runtime logs, duplicate SQL installers, and superseded documentation are not retained.
