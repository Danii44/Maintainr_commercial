const baseUrl = process.env.DEMO_API_BASE_URL || "http://127.0.0.1:5173/.netlify/functions/demo-api";
const password = process.env.DEMO_DEFAULT_PASSWORD || "MaintainrDemo2026!";

async function request(cookie, payload) {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `Demo API returned ${response.status}`);
  const nextCookie = response.headers.get("set-cookie")?.split(";")[0] || cookie;
  return { data, cookie: nextCookie };
}

async function signIn(email) {
  const result = await request("", { action: "login", email, password });
  if (!result.cookie) throw new Error(`No session cookie was returned for ${email}`);
  return result;
}

const manager = await signIn("manager@demo.maintainr.app");
const openTicket = manager.data.tickets.find((ticket) => ticket.status === "OPEN");
const technician = manager.data.technicians[0];
if (!openTicket || !technician) throw new Error("The fresh demo baseline must include an open ticket and technician");
await request(manager.cookie, { action: "assign-ticket", ticketId: openTicket.id, technicianId: technician.id });

const technicianSession = await signIn("technician@demo.maintainr.app");
const assignedTicket = technicianSession.data.tickets.find((ticket) => ticket.id === openTicket.id && ticket.status === "ASSIGNED");
if (!assignedTicket) throw new Error("Assigned ticket is not visible to the demo technician");
const started = await request(technicianSession.cookie, { action: "update-ticket", ticketId: assignedTicket.id, status: "IN_PROGRESS" });
const inProgress = started.data.tickets.find((ticket) => ticket.id === assignedTicket.id && ticket.status === "IN_PROGRESS");
if (!inProgress) throw new Error("Technician start-work transition did not persist");
const resolved = await request(technicianSession.cookie, { action: "update-ticket", ticketId: assignedTicket.id, status: "RESOLVED" });
if (!resolved.data.tickets.find((ticket) => ticket.id === assignedTicket.id && ticket.status === "RESOLVED")) throw new Error("Technician resolution did not persist");

const resident = await signIn("resident@demo.maintainr.app");
const created = await request(resident.cookie, { action: "create-ticket", title: "Demo verification request", description: "A safe request created only while verifying the isolated commercial demo workflow." });
if (!created.data.tickets.find((ticket) => ticket.title === "Demo verification request" && ticket.status === "OPEN")) throw new Error("Resident request did not persist");

console.log("Commercial isolated demo workflow: verified");
