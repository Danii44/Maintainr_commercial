import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const root = new URL("..", import.meta.url);

describe("public commercial conversion controls", () => {
  it("keeps public conversion controls focused on the dedicated Product Experience and consultation path", async () => {
    const [header, entry, site, home, tour, experience, styles] = await Promise.all([
      readFile(new URL("client/src/components/CommercialHeader.tsx", root), "utf8"),
      readFile(new URL("client/src/main.tsx", root), "utf8"),
      readFile(new URL("client/src/pages/CommercialWebsite.tsx", root), "utf8"),
      readFile(new URL("client/src/components/CommercialHomeExperience.tsx", root), "utf8"),
      readFile(new URL("client/src/components/CommercialPortalTour.tsx", root), "utf8"),
      readFile(new URL("client/src/pages/ProductExperiencePage.tsx", root), "utf8"),
      readFile(new URL("client/src/index.css", root), "utf8"),
    ]);

    expect(header).not.toContain("Customer portal");
    expect(header.toLowerCase()).not.toContain("demo");
    expect(entry).toContain('a[href="#interactive-workspace"]');
    expect(entry).toContain('anchor.setAttribute("href", "/experience")');
    expect(entry).toContain('window.location.replace("/experience")');
    expect(site).toContain("maintainr-v3");
    expect(site).toContain("PageHero");
    expect(site.toLowerCase()).not.toContain("demo");
    expect(site).toContain("whileInView");
    expect(site).toContain("whileHover");
    expect(styles).toContain("scroll-behavior: smooth");
    expect(styles).toContain("prefers-reduced-motion: reduce");
    expect(home).toContain("WHEN WORK BECOMES INVISIBLE");
    expect(home).toContain("PORTFOLIO VISIBILITY");
    expect(home).toContain("ROLE JOURNEYS");
    expect(home).toContain("PLANNED WORK, MADE VISIBLE");
    expect(home).toContain("FOUNDATIONS FOR DAILY USE");
    expect(home).toContain("PRACTICAL QUESTIONS");
    expect(tour).toContain("TAKE A PRODUCT TOUR");
    expect(tour).toContain('href="/experience"');
    expect(tour).toContain('t("Explore the experience", "استكشف التجربة")');
    expect(tour).toContain("Explore the full workspace, not a small preview.");
    expect(tour).not.toContain("Portal roles");
    expect(tour).not.toContain("Role-based view");
    expect(tour).not.toContain("InteractiveWorkspaceExperience");
    expect(site).toContain('"/experience": "experience"');
    expect(experience).toContain("Open demo workspace");
    expect(experience).toContain("Commercial demo database");
    expect(experience).toContain("never connected to live SaaS");
    expect(experience).not.toContain("InteractiveWorkspaceExperience");
    expect(experience).toContain("Profile & security");
    expect(experience).toContain("People and access");
    expect(home).toContain("maintainr-fade-left");
    expect(home).toContain("maintainr-fade-right");
    expect(styles).toContain("prefers-reduced-motion: no-preference");
    expect(styles).toContain("--maintainr-dark-copy");
    expect(styles).toContain(".bg-\\[\\#172033\\]");
    expect(styles).toContain("color: #ffffff !important");
    expect(styles).toContain("text-slate-600");
  });
});
