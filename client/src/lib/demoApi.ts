export type DemoRole = "PROPERTY_MANAGER" | "TENANT" | "TECHNICIAN" | "FLAT_OWNER";
export type DemoAccount = { id: number; email: string; name: string; role: DemoRole; phone: string | null; avatarUrl: string | null; unitCode: string };
export type DemoTicket = { id: number; title: string; description: string; unit: string; status: "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED"; priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"; submittedById: number; assignedToId: number | null; resolutionNotes: string | null; createdAt: string };
export type DemoReminder = { id: number; title: string; description: string; unit: string | null; dueAt: string; isAcknowledged: boolean };
export type DemoPerson = { id: number; email: string; name: string; role: DemoRole; unitCode: string; isActive: boolean };
export type DemoState = { account: DemoAccount; tickets: DemoTicket[]; reminders: DemoReminder[]; technicians: { id: number; name: string }[]; people: DemoPerson[]; isolated: true };

export async function demoRequest(action: string, payload: Record<string, unknown> = {}): Promise<DemoState> {
  const response = await fetch("/.netlify/functions/demo-api", { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, ...payload }) });
  const data = await response.json().catch(() => ({})) as DemoState & { error?: string };
  if (!response.ok) throw new Error(data.error || "The demo workspace is unavailable.");
  return data;
}
