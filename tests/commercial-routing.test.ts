import { describe, expect, it } from "vitest";
import { evaluationIntentFromSearch, normalizeSaasAppUrl, quoteMessageForIntent, saasDestination } from "../client/src/lib/commercialRouting";

describe("commercial conversion routing", () => {
  it("normalizes the public SaaS destination and keeps portal paths separate", () => {
    expect(normalizeSaasAppUrl("https://app.example.com/")).toBe("https://app.example.com");
    expect(saasDestination("https://app.example.com/", "/sign-in")).toBe("https://app.example.com/sign-in");
    expect(saasDestination("", "/create-workspace")).toBe("https://maintainr-saas.netlify.app/create-workspace");
  });

  it("marks guided-demo and quotation requests in the commercial submission payload", () => {
    expect(evaluationIntentFromSearch("?intent=demo")).toBe("demo");
    expect(evaluationIntentFromSearch("?intent=quote")).toBe("quote");
    expect(quoteMessageForIntent("demo", "Show role workflows")).toBe("[GUIDED DEMO REQUEST]\nShow role workflows");
    expect(quoteMessageForIntent("quote", "")).toBe("[QUOTATION REQUEST]");
  });
});
