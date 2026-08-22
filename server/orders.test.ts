import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const ctx = {
  user: null,
  req: { protocol: "https", headers: {} },
  res: { clearCookie: () => undefined },
} as unknown as TrpcContext;

describe("orders.create", () => {
  it("rejects a checkout with no line items", async () => {
    const caller = appRouter.createCaller(ctx);
    await expect(caller.orders.create({
      customerName: "Test Customer",
      phone: "+971500000000",
      email: "",
      address: "Dubai Marina, Dubai",
      subtotalAed: 39,
      deliveryFeeAed: 8,
      vatAed: 2.35,
      totalAed: 49.35,
      items: [],
    })).rejects.toThrow();
  });
});
