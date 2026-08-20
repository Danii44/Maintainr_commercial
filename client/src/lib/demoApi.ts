export type DemoRole = "PROPERTY_MANAGER" | "TENANT" | "TECHNICIAN" | "FLAT_OWNER";
export type DemoAccount = { id: number; email: string; name: string; role: DemoRole; phone: string | null; avatarUrl: string | null; unitCode: string };
export type DemoTicket = { id: number; title: string; description: string; unit: string; status: "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED"; priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"; submittedById: number; assignedToId: number | null; resolutionNotes: string | null; createdAt: string };
export type DemoReminder = { id: number; title: string; description: string; unit: string | null; dueAt: string; isAcknowledged: boolean };
export type DemoPerson = { id: number; email: string; name: string; role: DemoRole; unitCode: string; isActive: boolean };
export type DemoInquiry = { id: number; kind: "INQUIRY" | "COMPLAINT"; status: "OPEN" | "IN_REVIEW" | "RESOLVED" | "CLOSED"; subject: string; body: string; unit: string | null; createdAt: string };
export type DemoAppointment = { id: number; title: string; status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED"; scheduledStart: string; scheduledEnd: string; unit: string | null };
export type DemoConversation = { id: number; subject: string; kind: "GENERAL" | "TICKET" | "INQUIRY"; updatedAt: string };
export type DemoNotification = { id: number; type: string; title: string; body: string | null; href: string | null; readAt: string | null; createdAt: string };
export type DemoState = { account: DemoAccount; tickets: DemoTicket[]; reminders: DemoReminder[]; inquiries: DemoInquiry[]; appointments: DemoAppointment[]; conversations: DemoConversation[]; technicians: { id: number; name: string }[]; people: DemoPerson[]; notifications: DemoNotification[]; isolated: true };

export async function demoRequest(action: string, payload: Record<string, unknown> = {}): Promise<DemoState> {
  const response = await fetch("/.netlify/functions/demo-api", { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, ...payload }) });
  const data = await response.json().catch(() => ({})) as DemoState & { error?: string };
  if (!response.ok) throw new Error(data.error || "The demo workspace is unavailable.");
  return data;
}
