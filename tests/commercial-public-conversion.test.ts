import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const root = new URL("..", import.meta.url);

describe("public commercial conversion controls", () => {
  it("keeps the header and fixed rail focused on demo and quotation paths", async () => {
    const [header, rail] = await Promise.all([
      readFile(new URL("client/src/components/CommercialHeader.tsx", root), "utf8"),
      readFile(new URL("client/src/components/CommercialConversionRail.tsx", root), "utf8"),
    ]);

    expect(header).not.toContain("Customer portal");
    expect(header).not.toContain("Existing customer portal");
    expect(rail).not.toContain("Customer portal");
    expect(rail).toContain('href="/demo"');
    expect(rail).toContain('href="/quote?intent=demo"');
    expect(rail).toContain('href="/quote?intent=quote"');
  });
});
