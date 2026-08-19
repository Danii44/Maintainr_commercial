import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Handler, HandlerEvent } from "@netlify/functions";
import { Pool, type PoolClient } from "pg";

type DemoRole = "PROPERTY_MANAGER" | "TENANT" | "TECHNICIAN" | "FLAT_OWNER";
type Account = { id: number; email: string; displayName: string; role: DemoRole; phone: string | null; avatarUrl: string | null; unitCode: string };
type DemoTicket = { id: number; title: string; description: string; unit: string; status: "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED"; priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"; submittedById: number; assignedToId: number | null; resolutionNotes: string | null; createdAt: string };
type DemoReminder = { id: number; title: string; description: string; unit: string | null; dueAt: string; isAcknowledged: boolean };

const COOKIE_NAME = "maintainr_demo_session";
const SESSION_MS = 1000 * 60 * 60 * 8;
const passwordPattern = /^scrypt\$([a-f0-9]+)\$([a-f0-9]+)$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(statusCode: number, body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return { statusCode, headers: { "content-type": "application/json", "cache-control": "no-store", ...headers }, body: JSON.stringify(body) };
}

function cookie(token: string, event: HandlerEvent) {
  const secure = event.headers["x-forwarded-proto"] === "https" || process.env.NODE_ENV === "production";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MS / 1000}${secure ? "; Secure" : ""}`;
}

function clearCookie(event: HandlerEvent) {
  const secure = event.headers["x-forwarded-proto"] === "https" || process.env.NODE_ENV === "production";
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
}

function readCookie(event: HandlerEvent) {
  const raw = event.headers.cookie ?? "";
  return raw.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
}

function hashToken(token: string) { return createHash("sha256").update(token).digest("hex"); }

function verifyPassword(password: string, encoded: string) {
  const match = encoded.match(passwordPattern);
  if (!match) return false;
  const actual = scryptSync(password, match[1], 64).toString("hex");
  const expected = Buffer.from(match[2], "hex");
  const candidate = Buffer.from(actual, "hex");
  return expected.length === candidate.length && timingSafeEqual(expected, candidate);
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
}

function getPool() {
  const connectionString = process.env.COMMERCIAL_DATABASE_URL;
  if (!connectionString) throw new Error("Commercial demo database is not configured");
  return new Pool({ connectionString, ssl: { rejectUnauthorized: false }, max: 2, connectionTimeoutMillis: 8_000 });
}

function publicAccount(account: Account) { return { id: account.id, email: account.email, name: account.displayName, role: account.role, phone: account.phone, avatarUrl: account.avatarUrl, unitCode: account.unitCode }; }

async function currentAccount(client: PoolClient, event: HandlerEvent): Promise<Account | null> {
  const token = readCookie(event);
  if (!token) return null;
  const result = await client.query<Account>(
    `select a.id, a.email, a.display_name as "displayName", a.role, a.phone, a.avatar_url as "avatarUrl", a.unit_code as "unitCode"
     from demo_sessions s join demo_accounts a on a.id = s.account_id
     where s.token_hash = $1 and s.expires_at > now() and a.is_active = true limit 1`,
    [hashToken(token)],
  );
  return result.rows[0] ?? null;
}

async function stateFor(client: PoolClient, account: Account) {
  const conditions = ["true"];
  const values: unknown[] = [];
  if (account.role === "TENANT" || account.role === "FLAT_OWNER") { values.push(account.unitCode); conditions.push(`t.unit_code = $${values.length}`); }
  if (account.role === "TECHNICIAN") { values.push(account.id); conditions.push(`t.assigned_to_id = $${values.length}`); }
  const tickets = await client.query<DemoTicket>(
    `select t.id, t.title, t.description, t.unit_code as unit, t.status, t.priority, t.submitted_by_id as "submittedById", t.assigned_to_id as "assignedToId", t.resolution_notes as "resolutionNotes", t.created_at as "createdAt"
     from demo_tickets t where ${conditions.join(" and ")} order by t.created_at desc`, values,
  );
  const reminderConditions = ["true"];
  const reminderValues: unknown[] = [account.id];
  if (account.role === "TENANT" || account.role === "FLAT_OWNER") { reminderValues.push(account.unitCode); reminderConditions.push(`(r.unit_code is null or r.unit_code = $${reminderValues.length})`); }
  if (account.role === "TECHNICIAN") { reminderValues.push(account.id); reminderConditions.push(`(r.assigned_to_id is null or r.assigned_to_id = $${reminderValues.length})`); }
  const reminders = await client.query<DemoReminder>(
    `select r.id, r.title, r.description, r.unit_code as unit, r.due_at as "dueAt", exists(select 1 from demo_reminder_acknowledgements a where a.reminder_id = r.id and a.account_id = $1) as "isAcknowledged"
     from demo_reminders r where ${reminderConditions.join(" and ")} order by r.due_at asc`, reminderValues,
  );
  const technicians = account.role === "PROPERTY_MANAGER" ? await client.query<{ id: number; name: string }>("select id, display_name as name from demo_accounts where role = 'TECHNICIAN' and is_active = true order by id") : { rows: [] };
  const people = account.role === "PROPERTY_MANAGER" ? await client.query<{ id: number; email: string; name: string; role: DemoRole; unitCode: string; isActive: boolean }>("select id, email, display_name as name, role, unit_code as \"unitCode\", is_active as \"isActive\" from demo_accounts order by role, display_name") : { rows: [] };
  return { account: publicAccount(account), tickets: tickets.rows, reminders: reminders.rows, technicians: technicians.rows, people: people.rows, isolated: true };
}

function canManage(role: DemoRole) { return role === "PROPERTY_MANAGER"; }
function canWork(role: DemoRole) { return role === "TECHNICIAN"; }

async function body(event: HandlerEvent) { try { return JSON.parse(event.body ?? "{}") as Record<string, unknown>; } catch { return {}; } }

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: { "access-control-allow-methods": "GET, POST, OPTIONS", "access-control-allow-headers": "content-type", "access-control-allow-credentials": "true" }, body: "" };
  const pool = getPool();
  const client = await pool.connect();
  try {
    const input = event.httpMethod === "POST" ? await body(event) : { action: "session" };
    const action = typeof input.action === "string" ? input.action : "";
    if (action === "login") {
      const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
      const password = typeof input.password === "string" ? input.password : "";
      if (!emailPattern.test(email) || password.length < 8) return json(400, { error: "Enter a valid demo email and password." });
      const result = await client.query<Account & { passwordHash: string }>("select id, email, display_name as \"displayName\", role, phone, avatar_url as \"avatarUrl\", unit_code as \"unitCode\", password_hash as \"passwordHash\" from demo_accounts where email = $1 and is_active = true limit 1", [email]);
      const account = result.rows[0];
      if (!account || !verifyPassword(password, account.passwordHash)) return json(401, { error: "Demo email or password is not valid." });
      const token = randomBytes(32).toString("base64url");
      await client.query("delete from demo_sessions where expires_at <= now()");
      await client.query("insert into demo_sessions (token_hash, account_id, expires_at) values ($1,$2,now() + interval '8 hours')", [hashToken(token), account.id]);
      return json(200, await stateFor(client, account), { "set-cookie": cookie(token, event) });
    }
    if (action === "logout") {
      const token = readCookie(event);
      if (token) await client.query("delete from demo_sessions where token_hash = $1", [hashToken(token)]);
      return json(200, { success: true }, { "set-cookie": clearCookie(event) });
    }
    const account = await currentAccount(client, event);
    if (!account) return json(401, { error: "Please sign in to the isolated demo workspace." });
    if (action === "session") return json(200, await stateFor(client, account));
    if (action === "update-profile") {
      const name = typeof input.name === "string" ? input.name.trim() : "";
      const phone = typeof input.phone === "string" ? input.phone.trim() : "";
      const avatarUrl = typeof input.avatarUrl === "string" ? input.avatarUrl.trim() : "";
      if (name.length < 2 || name.length > 120) return json(400, { error: "Enter a profile name between 2 and 120 characters." });
      if (avatarUrl && !/^https:\/\//.test(avatarUrl)) return json(400, { error: "Use a secure HTTPS profile image URL or leave it blank." });
      await client.query("update demo_accounts set display_name = $1, phone = $2, avatar_url = nullif($3, ''), updated_at = now() where id = $4", [name, phone || null, avatarUrl, account.id]);
      const updated = await currentAccount(client, event);
      if (!updated) return json(401, { error: "Your demo session has ended." });
      return json(200, await stateFor(client, updated));
    }
    if (action === "change-password") {
      const currentPassword = typeof input.currentPassword === "string" ? input.currentPassword : "";
      const nextPassword = typeof input.nextPassword === "string" ? input.nextPassword : "";
      if (nextPassword.length < 8 || nextPassword.length > 128) return json(400, { error: "Use a new demo password between 8 and 128 characters." });
      const current = await client.query<{ passwordHash: string }>("select password_hash as \"passwordHash\" from demo_accounts where id = $1 limit 1", [account.id]);
      if (!current.rows[0] || !verifyPassword(currentPassword, current.rows[0].passwordHash)) return json(401, { error: "Your current demo password is not correct." });
      await client.query("update demo_accounts set password_hash = $1, updated_at = now() where id = $2", [hashPassword(nextPassword), account.id]);
      await client.query("delete from demo_sessions where account_id = $1 and token_hash <> $2", [account.id, hashToken(readCookie(event) || "")]);
      return json(200, await stateFor(client, account));
    }
    if (action === "manager-create-account") {
      if (!canManage(account.role)) return json(403, { error: "Only the demo manager can create demo accounts." });
      const name = typeof input.name === "string" ? input.name.trim() : "";
      const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
      const role = input.role;
      const unitCode = typeof input.unitCode === "string" ? input.unitCode.trim().toUpperCase() : "A-204";
      if (name.length < 2 || !emailPattern.test(email) || (role !== "TENANT" && role !== "TECHNICIAN" && role !== "FLAT_OWNER")) return json(400, { error: "Enter a name, email, supported role, and unit for the demo account." });
      try {
        await client.query("insert into demo_accounts (email, display_name, role, password_hash, unit_code) values ($1,$2,$3,$4,$5)", [email, name, role, hashPassword(process.env.DEMO_DEFAULT_PASSWORD || "MaintainrDemo2026!"), unitCode || "A-204"]);
      } catch (error) {
        if ((error as { code?: string }).code === "23505") return json(409, { error: "A demo account with that email already exists." });
        throw error;
      }
      return json(200, await stateFor(client, account));
    }
    if (action === "manager-set-account-status") {
      if (!canManage(account.role)) return json(403, { error: "Only the demo manager can manage demo accounts." });
      const accountId = Number(input.accountId);
      const isActive = input.isActive === true;
      if (!Number.isInteger(accountId) || accountId === account.id) return json(400, { error: "Choose another valid demo account to manage." });
      await client.query("update demo_accounts set is_active = $1, updated_at = now() where id = $2", [isActive, accountId]);
      if (!isActive) await client.query("delete from demo_sessions where account_id = $1", [accountId]);
      return json(200, await stateFor(client, account));
    }
    if (action === "create-ticket") {
      if (account.role !== "TENANT") return json(403, { error: "Only the demo resident can create a new request." });
      const title = typeof input.title === "string" ? input.title.trim() : "";
      const description = typeof input.description === "string" ? input.description.trim() : "";
      if (title.length < 3 || description.length < 10) return json(400, { error: "Add a title and at least 10 characters of detail." });
      const created = await client.query<{ id: number }>("insert into demo_tickets (title, description, unit_code, priority, submitted_by_id) values ($1,$2,'A-204','MEDIUM',$3) returning id", [title, description, account.id]);
      await client.query("insert into demo_ticket_activity (ticket_id, actor_id, action, message) values ($1,$2,'CREATED','Resident submitted a demo request')", [created.rows[0].id, account.id]);
      return json(200, await stateFor(client, account));
    }
    if (action === "assign-ticket") {
      if (!canManage(account.role)) return json(403, { error: "Only the demo manager can assign a request." });
      const ticketId = Number(input.ticketId); const technicianId = Number(input.technicianId);
      if (!Number.isInteger(ticketId) || !Number.isInteger(technicianId)) return json(400, { error: "Choose a valid request and technician." });
      const assignment = await client.query("update demo_tickets set assigned_to_id = $1, status = 'ASSIGNED', updated_at = now() where id = $2 and status = 'OPEN' returning id", [technicianId, ticketId]);
      if (!assignment.rowCount) return json(409, { error: "This demo request is no longer available for assignment." });
      await client.query("insert into demo_ticket_activity (ticket_id, actor_id, action, message) values ($1,$2,'ASSIGNED','Manager assigned the demo technician')", [ticketId, account.id]);
      return json(200, await stateFor(client, account));
    }
    if (action === "update-ticket") {
      if (!canWork(account.role)) return json(403, { error: "Only the demo technician can progress assigned work." });
      const ticketId = Number(input.ticketId); const nextStatus = input.status;
      if (!Number.isInteger(ticketId) || (nextStatus !== "IN_PROGRESS" && nextStatus !== "RESOLVED")) return json(400, { error: "Choose a valid demo work status." });
      const permittedCurrent = nextStatus === "IN_PROGRESS" ? "ASSIGNED" : "IN_PROGRESS";
      const result = await client.query("update demo_tickets set status = $1::varchar, resolution_notes = case when $1::text = 'RESOLVED' then 'Resolution recorded in the isolated demo workspace.' else resolution_notes end, updated_at = now() where id = $2 and assigned_to_id = $3 and status = $4 returning id", [nextStatus, ticketId, account.id, permittedCurrent]);
      if (!result.rowCount) return json(409, { error: "This demo ticket cannot move to that status now." });
      await client.query("insert into demo_ticket_activity (ticket_id, actor_id, action, message) values ($1,$2,$3,'Technician updated the demo workflow')", [ticketId, account.id, nextStatus]);
      return json(200, await stateFor(client, account));
    }
    if (action === "acknowledge-reminder") {
      const reminderId = Number(input.reminderId);
      if (!Number.isInteger(reminderId)) return json(400, { error: "Choose a valid demo reminder." });
      const accessible = await client.query("select id from demo_reminders where id = $1 and (assigned_to_id is null or assigned_to_id = $2 or $3 = 'PROPERTY_MANAGER')", [reminderId, account.id, account.role]);
      if (!accessible.rowCount) return json(403, { error: "This demo reminder is not available for the current role." });
      await client.query("insert into demo_reminder_acknowledgements (reminder_id, account_id) values ($1,$2) on conflict (reminder_id, account_id) do update set acknowledged_at = now()", [reminderId, account.id]);
      return json(200, await stateFor(client, account));
    }
    return json(400, { error: "Unknown demo action." });
  } catch (error) {
    console.error("[demo-api] failed", error instanceof Error ? error.message : "unknown error");
    return json(500, { error: "The isolated demo workspace is temporarily unavailable." });
  } finally {
    client.release();
    await pool.end();
  }
};
