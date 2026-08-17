import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "@/components/ui/sonner";
import { CommercialWebsite } from "./pages/CommercialWebsite";
import { InteractiveDemo } from "./pages/InteractiveDemo";
import "./index.css";

function CommercialSurface() {
  const pathname = typeof window === "undefined" ? "/" : window.location.pathname;
  return <ThemeProvider defaultTheme="dark"><LanguageProvider><Toaster/>{pathname === "/demo" ? <InteractiveDemo/> : <CommercialWebsite/>}</LanguageProvider></ThemeProvider>;
}

createRoot(document.getElementById("root")!).render(
  <CommercialSurface />
);
