# Maintainr Commercial Supabase Setup

Create a different Supabase project dedicated only to **quotation requests** from the public Maintainr website. It must not be the same project as the production SaaS or the isolated demo project.

1. In this commercial Supabase project, open **SQL Editor** and run `SUPABASE_COMMERCIAL_SCHEMA.sql` once.
2. In Supabase **Connect**, copy the server-side PostgreSQL pooler connection string. Keep the password private.
3. In the `Maintainr_commercial` Netlify site, set `COMMERCIAL_DATABASE_URL` to that connection string.
4. Set `VITE_SAAS_APP_URL` to the final public URL of the separately deployed `Maintainr_Saas` app—for example, `https://app.example.com`.
5. Deploy, open `/quote`, submit a test enquiry, and verify that the record appears only in this commercial database.

> `COMMERCIAL_DATABASE_URL` is a server secret. `VITE_SAAS_APP_URL` is public and must be only the SaaS web address, without a connection string or password.
