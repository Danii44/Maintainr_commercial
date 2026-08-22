import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createOrder, getOrderByTrackingCode, listMenuItems, listOrdersForStaff, updateOrderStatus } from "./db";

const statusSchema = z.enum(["received", "preparing", "ready", "picked_up", "on_the_way", "delivered", "cancelled"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  menu: router({ list: publicProcedure.query(() => listMenuItems()) }),
  orders: router({
    create: publicProcedure.input(z.object({
      customerName: z.string().min(2), phone: z.string().min(7), email: z.string().email().optional().or(z.literal("")),
      address: z.string().min(8), notes: z.string().max(500).optional(), subtotalAed: z.number().positive(),
      deliveryFeeAed: z.number().nonnegative(), vatAed: z.number().nonnegative(), totalAed: z.number().positive(),
      items: z.array(z.object({ menuItemId: z.number().int().positive(), itemName: z.string().min(1), unitPriceAed: z.number().positive(), quantity: z.number().int().positive().max(20) })).min(1),
    })).mutation(({ input }) => createOrder({
      ...input, trackingCode: `FK-${Date.now().toString(36).toUpperCase()}`,
      email: input.email || undefined,
      subtotalAed: input.subtotalAed.toFixed(2), deliveryFeeAed: input.deliveryFeeAed.toFixed(2), vatAed: input.vatAed.toFixed(2), totalAed: input.totalAed.toFixed(2),
      items: input.items.map(item => ({ ...item, unitPriceAed: item.unitPriceAed.toFixed(2) })),
    })),
    track: publicProcedure.input(z.object({ trackingCode: z.string().min(4).max(24) })).query(({ input }) => getOrderByTrackingCode(input.trackingCode)),
    listForStaff: adminProcedure.query(() => listOrdersForStaff()),
    updateStatus: adminProcedure.input(z.object({ orderId: z.number().int().positive(), status: statusSchema, note: z.string().max(500).optional() })).mutation(({ input }) => updateOrderStatus(input.orderId, input.status, input.note)),
  }),
});

export type AppRouter = typeof appRouter;
