import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "@/components/ui/sonner";
import { CommercialWebsite } from "./pages/CommercialWebsite";
import "./index.css";

function CommercialSurface() {
  return <ThemeProvider switchable><LanguageProvider><Toaster/><CommercialWebsite/></LanguageProvider></ThemeProvider>;
}

createRoot(document.getElementById("root")!).render(
  <CommercialSurface />
);
