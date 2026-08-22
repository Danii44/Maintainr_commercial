import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const menuItems = mysqlTable("menu_items", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  priceAed: decimal("priceAed", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  isAvailable: int("isAvailable").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  trackingCode: varchar("trackingCode", { length: 24 }).notNull().unique(),
  customerName: varchar("customerName", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  email: varchar("email", { length: 320 }),
  address: text("address").notNull(),
  notes: text("notes"),
  subtotalAed: decimal("subtotalAed", { precision: 10, scale: 2 }).notNull(),
  deliveryFeeAed: decimal("deliveryFeeAed", { precision: 10, scale: 2 }).notNull(),
  vatAed: decimal("vatAed", { precision: 10, scale: 2 }).notNull(),
  totalAed: decimal("totalAed", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cash_on_delivery"]).default("cash_on_delivery").notNull(),
  status: mysqlEnum("status", ["received", "preparing", "ready", "picked_up", "on_the_way", "delivered", "cancelled"]).default("received").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  menuItemId: int("menuItemId").notNull(),
  itemName: varchar("itemName", { length: 160 }).notNull(),
  unitPriceAed: decimal("unitPriceAed", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const orderStatusEvents = mysqlTable("order_status_events", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  status: mysqlEnum("status", ["received", "preparing", "ready", "picked_up", "on_the_way", "delivered", "cancelled"]).notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type OrderStatusEvent = typeof orderStatusEvents.$inferSelect;
