import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
export const commercialThemeStorageKey = "maintainr-commercial-theme";
export function resolveCommercialTheme(stored: string | null): Theme { return stored === "dark" ? "dark" : "light"; }

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => switchable ? resolveCommercialTheme(localStorage.getItem(commercialThemeStorageKey)) : defaultTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    if (switchable) localStorage.setItem(commercialThemeStorageKey, theme);
  }, [theme, switchable]);

  const toggleTheme = switchable ? () => setTheme(previous => previous === "light" ? "dark" : "light") : undefined;

  return <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
