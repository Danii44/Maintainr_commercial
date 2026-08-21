import { Menu, Moon, Quote, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

const links = [
  { href: "/experience", en: "Experience", ar: "التجربة", key: "experience" },
  { href: "/product", en: "Platform", ar: "المنصة", key: "product" },
  { href: "/features", en: "Workflow", ar: "مسار العمل", key: "features" },
  { href: "/solutions", en: "For teams", ar: "للفرق", key: "solutions" },
  { href: "/insights", en: "Insights", ar: "رؤى", key: "insights" },
];

function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  if (!toggleTheme) return null;
  const dark = theme === "dark";
  const label = dark ? t("Light mode", "الوضع الفاتح") : t("Dark mode", "الوضع الداكن");
  return <button type="button" onClick={toggleTheme} aria-label={label} aria-pressed={dark} title={label} className={`maintainr-theme-toggle inline-flex items-center justify-center gap-2 rounded-full border text-xs font-semibold transition active:scale-[.97] ${compact ? "size-10" : "min-h-10 px-3"}`}>
    {dark ? <Sun size={16} /> : <Moon size={16} />}
    {!compact && <span className="hidden xl:inline">{label}</span>}
  </button>;
}

export function CommercialHeader({ current }: { current: string }) {
  const { t, direction, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const syncScrollState = () => setScrolled(window.scrollY > 12);
    syncScrollState();
    window.addEventListener("scroll", syncScrollState, { passive: true });
    return () => window.removeEventListener("scroll", syncScrollState);
  }, []);

  return <header className={`maintainr-public-header sticky top-0 z-50 ${scrolled ? "maintainr-public-header-scrolled" : ""}`}><div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 lg:px-8"><a href="/" className="maintainr-public-brand"><span className="maintainr-public-brand-mark"><img src="/assets/images/maintainr-logo-mark.png" alt="" className="maintainr-public-brand-logo" /></span>Maintainr</a><nav className="maintainr-public-nav hidden items-center gap-7 lg:flex">{links.map(link => <a key={link.href} href={link.href} className={current === link.key ? "maintainr-public-nav-link maintainr-public-nav-link-active" : "maintainr-public-nav-link"}>{t(link.en, link.ar)}</a>)}</nav><div className="hidden items-center gap-3 lg:flex"><ThemeToggle/><button onClick={toggleLanguage} className="maintainr-language-toggle">{direction === "rtl" ? "EN" : "ع"}</button><a href="/quote" className="maintainr-public-cta"><Quote size={15} />{t("Talk to us", "تحدث إلينا")}</a></div><div className="flex items-center gap-2 lg:hidden"><ThemeToggle compact/><button onClick={() => setOpen(!open)} className="maintainr-public-menu-toggle" aria-label={t("Open navigation", "فتح التنقل")}>{open ? <X size={19} /> : <Menu size={19} />}</button></div></div>{open && <div className="commercial-mobile-nav maintainr-public-mobile-nav max-h-[calc(100dvh-78px)] overflow-y-auto overscroll-contain lg:hidden"><div className="grid gap-1">{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="maintainr-public-mobile-link">{t(link.en, link.ar)}</a>)}<button type="button" onClick={toggleLanguage} className="maintainr-language-toggle maintainr-public-mobile-link mt-2 text-start">{direction === "rtl" ? "English" : "العربية"}</button><a href="/quote" className="maintainr-public-cta mt-3 justify-center"><Quote size={15} />{t("Talk to us", "تحدث إلينا")}</a></div></div>}</header>;
}
