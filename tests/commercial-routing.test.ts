import { describe, expect, it } from "vitest";
import { normalizeSaasAppUrl, quoteMessage, saasDestination } from "../client/src/lib/commercialRouting";

describe("commercial consultation routing", () => {
  it("normalizes the public SaaS destination and keeps portal paths separate", () => {
    expect(normalizeSaasAppUrl("https://app.example.com/")).toBe("https://app.example.com");
    expect(saasDestination("https://app.example.com/", "/sign-in")).toBe("https://app.example.com/sign-in");
    expect(saasDestination("", "/create-workspace")).toBe("https://maintainr-saas.netlify.app/create-workspace");
  });

  it("marks commercial enquiries without introducing a public demo intent", () => {
    expect(quoteMessage("Improve maintenance response time")).toBe("[MAINTAINR CONSULTATION REQUEST]\nImprove maintenance response time");
    expect(quoteMessage("")).toBe("[MAINTAINR CONSULTATION REQUEST]");
  });
});
