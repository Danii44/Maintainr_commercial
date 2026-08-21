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
  const schema = await readFile(new URL("../database/schema/COMMERCIAL_DEMO_SCHEMA.sql", import.meta.url), "utf8");
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
    await client.query("delete from demo_messages");
    await client.query("delete from demo_conversation_participants");
    await client.query("delete from demo_conversations");
    await client.query("delete from demo_evidence_assets");
    await client.query("delete from demo_appointments");
    await client.query("delete from demo_inquiries");
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

  const inquiryCount = await client.query("select count(*)::int as count from demo_inquiries");
  if (inquiryCount.rows[0].count === 0) {
    await client.query("insert into demo_inquiries (unit_code, created_by_id, assigned_to_id, kind, status, subject, body) values ('A-204',$1,$2,'INQUIRY','IN_REVIEW','Visit access-time question','Can the afternoon technician visit be confirmed for the resident?')", [ownerId, managerId]);
  }

  const firstTicket = await client.query("select id from demo_tickets order by id asc limit 1");
  const appointmentCount = await client.query("select count(*)::int as count from demo_appointments");
  if (appointmentCount.rows[0].count === 0) {
    await client.query("insert into demo_appointments (unit_code, ticket_id, technician_id, created_by_id, title, notes, status, scheduled_start, scheduled_end) values ('A-204',$1,$2,$3,'Kitchen water inspection','Demo appointment for the isolated commercial workspace.','CONFIRMED',now() + interval '2 days',now() + interval '2 days 2 hours')", [firstTicket.rows[0]?.id ?? null, technicianId, managerId]);
  }

  const conversationCount = await client.query("select count(*)::int as count from demo_conversations");
  if (conversationCount.rows[0].count === 0) {
    const conversation = await client.query("insert into demo_conversations (ticket_id, subject, kind, created_by_id) values ($1,'Kitchen access update','TICKET',$2) returning id", [firstTicket.rows[0]?.id ?? null, managerId]);
    const conversationId = conversation.rows[0].id;
    await client.query("insert into demo_conversation_participants (conversation_id, account_id) values ($1,$2),($1,$3),($1,$4),($1,$5)", [conversationId, managerId, residentId, technicianId, ownerId]);
    await client.query("insert into demo_messages (conversation_id, author_id, body) values ($1,$2,'The technician visit is confirmed for the afternoon window.'),($1,$3,'Thank you. Access will be arranged for the resident.')", [conversationId, managerId, residentId]);
  }

  console.log("Commercial demo workspace is ready. Demo credentials use the configured DEMO_DEFAULT_PASSWORD.");
} finally {
  await client.end();
}
