import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const root = new URL("..", import.meta.url);

describe("commercial demo isolation", () => {
  it("keeps dedicated demo tables and a cookie-protected demo API inside the commercial product", async () => {
    const [schema, api, page, routing, env] = await Promise.all([
      readFile(new URL("database/schema/COMMERCIAL_DEMO_SCHEMA.sql", root), "utf8"),
      readFile(new URL("netlify/functions/demo-api.ts", root), "utf8"),
      readFile(new URL("client/src/pages/ProductExperiencePage.tsx", root), "utf8"),
      readFile(new URL("client/src/lib/demoApi.ts", root), "utf8"),
      readFile(new URL(".env.example", root), "utf8"),
    ]);

    expect(schema).toContain("demo_accounts");
    expect(schema).toContain("demo_sessions");
    expect(schema).toContain("demo_tickets");
    expect(schema).toContain("demo_reminders");
    expect(schema).toContain("avatar_url");
    expect(schema).toContain("unit_code");
    expect(schema).not.toContain("create table users");
    expect(api).toContain("COMMERCIAL_DATABASE_URL");
    expect(api).toContain("maintainr_demo_session");
    expect(api).toContain('action === "login"');
    expect(api).toContain('action === "create-ticket"');
    expect(api).toContain('action === "assign-ticket"');
    expect(api).toContain('action === "update-ticket"');
    expect(api).toContain('action === "acknowledge-reminder"');
    expect(api).toContain('action === "update-profile"');
    expect(api).toContain('action === "change-password"');
    expect(api).toContain('action === "manager-create-account"');
    expect(api).toContain('action === "manager-set-account-status"');
    expect(api).not.toContain("MAINTAINR_SAAS_DATABASE_URL");
    expect(api).not.toContain("process.env.DATABASE_URL");
    expect(page).toContain("Open demo workspace");
    expect(page).toContain("Commercial demo database");
    expect(page).toContain("Profile and security");
    expect(page).toContain("People and access");
    expect(page).toContain("Create demo account");
    expect(routing).toContain("/.netlify/functions/demo-api");
    expect(env).toContain("COMMERCIAL_DATABASE_URL");
    expect(env).toContain("Do not use the SaaS DATABASE_URL here");
  });
});
