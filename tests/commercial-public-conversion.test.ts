import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const root = new URL("..", import.meta.url);

describe("public commercial conversion controls", () => {
  it("keeps the header and fixed rail focused on the production platform and consultation path", async () => {
    const [header, rail, site, styles] = await Promise.all([
      readFile(new URL("client/src/components/CommercialHeader.tsx", root), "utf8"),
      readFile(new URL("client/src/components/CommercialConversionRail.tsx", root), "utf8"),
      readFile(new URL("client/src/pages/CommercialWebsite.tsx", root), "utf8"),
      readFile(new URL("client/src/index.css", root), "utf8"),
    ]);

    expect(header).not.toContain("Customer portal");
    expect(header.toLowerCase()).not.toContain("demo");
    expect(rail).not.toContain("Customer portal");
    expect(rail.toLowerCase()).not.toContain("demo");
    expect(rail).toContain('href="/product"');
    expect(rail).toContain('href="/quote"');
    expect(site).toContain("maintainr-v3");
    expect(site).toContain("PageHero");
    expect(site.toLowerCase()).not.toContain("demo");
    expect(site).toContain("whileInView");
    expect(site).toContain("whileHover");
    expect(styles).toContain("scroll-behavior: smooth");
    expect(styles).toContain("prefers-reduced-motion: reduce");
  });
});
