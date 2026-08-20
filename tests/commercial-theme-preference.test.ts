import { describe, expect, it } from "vitest";
import { commercialThemeStorageKey, resolveCommercialTheme } from "../client/src/contexts/ThemeContext";

describe("commercial theme preference", () => {
  it("uses the light commercial interface by default and restores only the supported dark preference", () => {
    expect(resolveCommercialTheme(null)).toBe("light");
    expect(resolveCommercialTheme("unexpected")).toBe("light");
    expect(resolveCommercialTheme("dark")).toBe("dark");
    expect(commercialThemeStorageKey).toBe("maintainr-commercial-theme");
  });
});
