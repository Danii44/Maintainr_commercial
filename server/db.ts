import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, menuItems, orderItems, orderStatusEvents, orders, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listMenuItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(menuItems).where(eq(menuItems.isAvailable, 1));
}

export async function findMenuItems(ids: number[]) {
  const db = await getDb();
  if (!db || ids.length === 0) return [];
  const rows = await db.select().from(menuItems);
  return rows.filter((row) => ids.includes(row.id));
}

export async function createOrder(input: {
  trackingCode: string; customerName: string; phone: string; email?: string; address: string; notes?: string;
  subtotalAed: string; deliveryFeeAed: string; vatAed: string; totalAed: string;
  items: Array<{ menuItemId: number; itemName: string; unitPriceAed: string; quantity: number }>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  return db.transaction(async (tx) => {
    const orderResult = await tx.insert(orders).values({
      trackingCode: input.trackingCode, customerName: input.customerName, phone: input.phone, email: input.email ?? null,
      address: input.address, notes: input.notes ?? null, subtotalAed: input.subtotalAed, deliveryFeeAed: input.deliveryFeeAed,
      vatAed: input.vatAed, totalAed: input.totalAed, paymentMethod: "cash_on_delivery", status: "received",
    });
    const orderId = Number(orderResult[0].insertId);
    await tx.insert(orderItems).values(input.items.map((item) => ({ orderId, menuItemId: item.menuItemId, itemName: item.itemName, unitPriceAed: item.unitPriceAed, quantity: item.quantity })));
    await tx.insert(orderStatusEvents).values({ orderId, status: "received", note: "Order received by Foodking UAE" });
    return { orderId, trackingCode: input.trackingCode };
  });
}

export async function getOrderByTrackingCode(trackingCode: string) {
  const db = await getDb();
  if (!db) return undefined;
  const order = (await db.select().from(orders).where(eq(orders.trackingCode, trackingCode)).limit(1))[0];
  if (!order) return undefined;
  const events = await db.select().from(orderStatusEvents).where(eq(orderStatusEvents.orderId, order.id)).orderBy(desc(orderStatusEvents.createdAt));
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { order, events, items };
}

export async function listOrdersForStaff() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(orderId: number, status: "received" | "preparing" | "ready" | "picked_up" | "on_the_way" | "delivered" | "cancelled", note?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not configured");
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
  await db.insert(orderStatusEvents).values({ orderId, status, note: note ?? null });
  return getOrderByTrackingCode((await db.select({ trackingCode: orders.trackingCode }).from(orders).where(eq(orders.id, orderId)).limit(1))[0]?.trackingCode ?? "");
}
