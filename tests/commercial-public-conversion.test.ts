import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const root = new URL("..", import.meta.url);

describe("public commercial conversion controls", () => {
  it("keeps public conversion controls focused on the dedicated Product Experience and consultation path", async () => {
    const [header, entry, site, home, tour, experience, styleManifest] = await Promise.all([
      readFile(new URL("client/src/components/CommercialHeader.tsx", root), "utf8"),
      readFile(new URL("client/src/main.tsx", root), "utf8"),
      readFile(new URL("client/src/pages/CommercialWebsite.tsx", root), "utf8"),
      readFile(new URL("client/src/components/CommercialHomeExperience.tsx", root), "utf8"),
      readFile(new URL("client/src/components/CommercialPortalTour.tsx", root), "utf8"),
      readFile(new URL("client/src/pages/ProductExperiencePage.tsx", root), "utf8"),
      readFile(new URL("client/src/index.css", root), "utf8"),
    ]);
    const themeStyles = (await Promise.all([
      "client/src/styles/tokens.css",
      "client/src/styles/theme.light.css",
      "client/src/styles/theme.dark.css",
      "client/src/styles/base.css",
      "client/src/styles/dashboard.css",
      "client/src/styles/public.css",
      "client/src/styles/marketing.css",
      "client/src/styles/marketing.light.css",
      "client/src/styles/marketing.dark.css",
    ].map(file => readFile(new URL(file, root), "utf8")))).join("\n");

    expect(header).not.toContain("Customer portal");
    expect(header).toContain("ThemeToggle");
    expect(header).toContain("useTheme");
    expect(header).toContain("aria-pressed");
    expect(header).toContain("sticky top-0");
    expect(header).toContain("max-h-[calc(100dvh-78px)]");
    expect(header.toLowerCase()).not.toContain("demo");
    expect(entry).toContain('a[href="#interactive-workspace"]');
    expect(entry).toContain('anchor.setAttribute("href", "/experience")');
    expect(entry).toContain('window.location.replace("/experience")');
    expect(site).toContain("maintainr-v3");
    expect(site).toContain("PageHero");
    expect(site.toLowerCase()).not.toContain("demo");
    expect(site).toContain("whileInView");
    expect(site).toContain("whileHover");
    expect(styleManifest).toContain('@import "./styles/theme.light.css"');
    expect(styleManifest).toContain('@import "./styles/theme.dark.css"');
    expect(styleManifest).toContain('@import "./styles/marketing.css"');
    expect(themeStyles).toContain("scroll-behavior: smooth");
    expect(themeStyles).toContain("prefers-reduced-motion: reduce");
    expect(home).toContain("WHEN WORK GETS LOST");
    expect(home).toContain("HOW MAINTAINR GUIDES THE WORK");
    expect(home).toContain("ONE RECORD. FOUR FOCUSED VIEWS.");
    expect(home).toContain("A CALMER WAY TO START");
    expect(home).toContain("PRACTICAL QUESTIONS");
    expect(home).toContain("marketing-dashboard-stage");
    expect(home).toContain("maintainr-dashboard-manager.webp");
    expect(home).toContain("maintainr-field-evidence-workflow.webp");
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
    expect(experience).toContain("maintainr-demo-shell");
    expect(experience).toContain("Operations workspace");
    expect(experience).toContain("Workspace ready");
    expect(experience).toContain("The same role-aware portal pattern as Maintainr SaaS");
    expect(experience).toContain("Same portal pattern. Separate demo-only records.");
    expect(experience).toContain("Back to overview");
    expect(experience).toContain("Complete your Manager checklist");
    expect(experience).toContain("Account access");
    expect(experience).toContain("Prepare a unit");
    expect(experience).toContain("Add a flat owner");
    const overviewSource = experience.slice(experience.indexOf("function Overview"), experience.indexOf("function Metric"));
    expect(overviewSource).not.toContain("ManagerSetup");
    expect(experience).toContain('label: t("Analytics"');
    expect(experience).toContain('label: t("Calendar"');
    expect(experience).toContain('label: t("Messages"');
    expect(experience).toContain('label: t("Inquiries"');
    expect(experience).toContain("Schedule a visit");
    expect(experience).toContain("Message workspace");
    expect(home).toContain("useReducedMotion");
    expect(home).toContain("marketing-visual-story");
    expect(themeStyles).toContain("prefers-reduced-motion: no-preference");
    expect(themeStyles).toContain("--maintainr-ink-950: #051f20");
    expect(themeStyles).toContain("--maintainr-mint-100: #daf1de");
    expect(themeStyles).toContain("--maintainr-on-dark");
    expect(themeStyles).toContain("maintainr-theme-toggle");
    expect(themeStyles).toContain("commercial-mobile-nav");
    expect(themeStyles).toContain("maintainr-demo-shell");
    expect(themeStyles).toContain("maintainr-demo-card");
    expect(themeStyles).toContain("maintainr-demo-rail-nav-active");
    expect(themeStyles).toContain(".maintainr-marketing-home");
    expect(themeStyles).toContain(".dark .maintainr-marketing-home");
    expect(themeStyles).toContain("marketing-dashboard-browser");
  });
});
