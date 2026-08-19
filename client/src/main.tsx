import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "@/components/ui/sonner";
import { CommercialWebsite } from "./pages/CommercialWebsite";
import "./index.css";

function CommercialSurface() {
  useEffect(() => {
    if (window.location.hash === "#interactive-workspace") {
      window.location.replace("/experience");
      return;
    }
    document.querySelectorAll<HTMLAnchorElement>('a[href="#interactive-workspace"]').forEach((anchor) => {
      anchor.setAttribute("href", "/experience");
    });
  }, []);

  return <ThemeProvider switchable><LanguageProvider><Toaster/><CommercialWebsite/></LanguageProvider></ThemeProvider>;
}

createRoot(document.getElementById("root")!).render(
  <CommercialSurface />
);
