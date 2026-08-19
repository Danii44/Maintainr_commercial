import { createHash, scryptSync } from "node:crypto";
import { readFile } from "node:fs/promises";
import { Client } from "pg";

const connectionString = process.env.COMMERCIAL_DATABASE_URL;
if (!connectionString) throw new Error("COMMERCIAL_DATABASE_URL is required. Do not use the live SaaS DATABASE_URL.");

const password = process.env.DEMO_DEFAULT_PASSWORD || "MaintainrDemo2026!";
const hashPassword = (value) => {
  const salt = createHash("sha256").update("maintainr-commercial-demo-v1").digest("hex").slice(0, 32);
  return `scrypt$${salt}$${scryptSync(value, salt, 64).toString("hex")}`;
};

const accounts = [
  ["manager@demo.maintainr.app", "Amina Rahman", "PROPERTY_MANAGER"],
  ["resident@demo.maintainr.app", "Omar Haddad", "TENANT"],
  ["technician@demo.maintainr.app", "Lina Saleh", "TECHNICIAN"],
  ["owner@demo.maintainr.app", "Nadia Karim", "FLAT_OWNER"],
];

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  const schema = await readFile(new URL("../COMMERCIAL_DEMO_SCHEMA.sql", import.meta.url), "utf8");
  await client.query(schema);
  for (const [email, displayName, role] of accounts) {
    await client.query(
      `insert into demo_accounts (email, display_name, role, password_hash, phone, avatar_url, unit_code)
       values ($1, $2, $3, $4, null, null, 'A-204')
       on conflict (email) do update set display_name = excluded.display_name, role = excluded.role, password_hash = excluded.password_hash, phone = null, avatar_url = null, unit_code = excluded.unit_code, is_active = true, updated_at = now()`,
      [email, displayName, role, hashPassword(password)],
    );
  }

  const accountRows = await client.query("select id, email from demo_accounts where email = any($1::text[])", [accounts.map(([email]) => email)]);
  const idFor = (email) => accountRows.rows.find((row) => row.email === email)?.id;
  const managerId = idFor("manager@demo.maintainr.app");
  const residentId = idFor("resident@demo.maintainr.app");
  const technicianId = idFor("technician@demo.maintainr.app");
  const ownerId = idFor("owner@demo.maintainr.app");
  if (!managerId || !residentId || !technicianId || !ownerId) throw new Error("Unable to resolve commercial demo accounts");

  if (process.env.DEMO_RESET === "true") {
    await client.query("delete from demo_sessions");
    await client.query("delete from demo_reminder_acknowledgements");
    await client.query("delete from demo_ticket_activity");
    await client.query("delete from demo_tickets");
    await client.query("delete from demo_reminders");
    await client.query("delete from demo_accounts where email <> all($1::text[])", [accounts.map(([email]) => email)]);
  }

  const count = await client.query("select count(*)::int as count from demo_tickets");
  if (count.rows[0].count === 0) {
    const tickets = [
      ["Kitchen water issue", "Water is collecting under the sink. Access is available after 15:00.", "A-204", "OPEN", "HIGH", residentId, null],
      ["Hallway light check", "The lift hallway light needs a replacement check before evening.", "B-101", "ASSIGNED", "MEDIUM", residentId, technicianId],
      ["Air conditioning follow-up", "Completion notes are ready for management review.", "A-204", "RESOLVED", "MEDIUM", residentId, technicianId],
    ];
    for (const ticket of tickets) {
      await client.query("insert into demo_tickets (title, description, unit_code, status, priority, submitted_by_id, assigned_to_id) values ($1,$2,$3,$4,$5,$6,$7)", ticket);
    }
    const first = await client.query("select id from demo_tickets order by id asc limit 1");
    if (first.rows[0]) await client.query("insert into demo_ticket_activity (ticket_id, actor_id, action, message) values ($1, $2, 'CREATED', 'Demo workspace was initialized')", [first.rows[0].id, managerId]);
  }

  const reminderCount = await client.query("select count(*)::int as count from demo_reminders");
  if (reminderCount.rows[0].count === 0) {
    await client.query("insert into demo_reminders (title, description, unit_code, assigned_to_id, due_at) values ($1,$2,$3,$4,now() + interval '7 days')", ["Monthly safety inspection", "A planned inspection reminder for the Maintainr demonstration workspace.", "A-204", technicianId]);
  }

  console.log("Commercial demo workspace is ready. Demo credentials use the configured DEMO_DEFAULT_PASSWORD.");
} finally {
  await client.end();
}
