# Maintainr Commercial Demo Database Setup

The commercial website and the live Maintainr SaaS portal are intentionally independent products. The commercial database contains only quotation requests and the isolated public demo workspace. The live SaaS database contains real organizations, users, properties, tickets, reminders, and customer records. **Do not use one connection string for both applications.**

| Product | Database variable | Allowed data | Never store here |
|---|---|---|---|
| Commercial website and demo | `COMMERCIAL_DATABASE_URL` | Quote requests, `demo_*` accounts, sessions, tickets, reminders, and activity | Live organizations, customer users, production tickets, production reminders |
| Live Maintainr SaaS | `DATABASE_URL` | Real tenant workspaces, users, properties, tickets, reminders, and attachments | Commercial quotations and public demo rows |

## Local commercial demo

The local commercial server uses the same server-side demo API that future Netlify builds will deploy. After setting `COMMERCIAL_DATABASE_URL` in the local server environment, initialize or restore the safe demo data with:

```bash
pnpm demo:setup
pnpm demo:reset
```

`demo:setup` applies `COMMERCIAL_DEMO_SCHEMA.sql`, creates the public demo identities, and seeds demo-only maintenance data if no demo tickets exist. `demo:reset` removes **only** the `demo_*` workflow data and recreates the baseline. It does not remove quotation requests and cannot connect to the live SaaS database.

The default local demo password is `MaintainrDemo2026!`. Before any public deployment, set a different `DEMO_DEFAULT_PASSWORD` server-side, run `pnpm demo:reset`, and share only the intended public demo credentials. These accounts are for evaluation only and must not reuse any real-user or production password.

| Role | Demo email |
|---|---|
| Property Manager | `manager@demo.maintainr.app` |
| Resident | `resident@demo.maintainr.app` |
| Technician | `technician@demo.maintainr.app` |
| Owner | `owner@demo.maintainr.app` |

## Future Netlify configuration

When you decide to publish, connect the **commercial repository** to its own Netlify site and set these server-side environment variables:

```text
COMMERCIAL_DATABASE_URL=<commercial Supabase connection string>
DEMO_DEFAULT_PASSWORD=<new public-demo-only password>
VITE_SAAS_APP_URL=<the separately deployed SaaS URL>
```

Use `pnpm build:netlify` as the build command. It publishes the static website and compiles both `quote-request` and `demo-api` functions. The demo browser sends requests only to `/.netlify/functions/demo-api`; the database URL is never exposed to browser code.

The SaaS repository must use a different Netlify site and its own `DATABASE_URL`. Its deployment must not define `COMMERCIAL_DATABASE_URL`.
