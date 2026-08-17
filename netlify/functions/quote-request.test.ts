import { describe, expect, it } from "vitest";
import { handler } from "./quote-request";

describe("commercial quotation endpoint", () => {
  it("rejects non-POST requests without touching a database", async () => {
    const result = await handler({ httpMethod: "GET" } as never, {} as never);
    expect(result).toMatchObject({ statusCode: 405 });
  });

  it("refuses submissions until a separate commercial database is configured", async () => {
    const original = process.env.COMMERCIAL_DATABASE_URL;
    delete process.env.COMMERCIAL_DATABASE_URL;
    const result = await handler({ httpMethod: "POST", body: JSON.stringify({ name: "Danish Ahmad", organizationName: "Northline Properties", email: "danish@example.com", portfolioCategory: "RESIDENTIAL", portfolioSizeRange: "1-10" }) } as never, {} as never);
    if (original === undefined) delete process.env.COMMERCIAL_DATABASE_URL;
    else process.env.COMMERCIAL_DATABASE_URL = original;
    expect(result).toMatchObject({ statusCode: 503 });
  });
});
