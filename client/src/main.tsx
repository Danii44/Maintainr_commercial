import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "@/components/ui/sonner";
import { CommercialWebsite } from "./pages/CommercialWebsite";
import "./index.css";

const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.replace(/\/+$/, "");
const analyticsWebsiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

if (analyticsEndpoint && analyticsWebsiteId && !document.querySelector('script[data-maintainr-analytics]')) {
  const analyticsScript = document.createElement("script");
  analyticsScript.src = `${analyticsEndpoint}/umami`;
  analyticsScript.defer = true;
  analyticsScript.dataset.websiteId = analyticsWebsiteId;
  analyticsScript.dataset.maintainrAnalytics = "true";
  document.head.appendChild(analyticsScript);
}

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
