import { Menu, Quote, Wrench, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const links = [
  { href: "/", en: "Home", ar: "الرئيسية", key: "home" },
  { href: "/product", en: "Platform", ar: "المنصة", key: "product" },
  { href: "/features", en: "Workflows", ar: "مسارات العمل", key: "features" },
  { href: "/solutions", en: "By role", ar: "حسب الدور", key: "solutions" },
  { href: "/faq", en: "FAQs", ar: "الأسئلة الشائعة", key: "faq" },
];

export function CommercialHeader({ current }: { current: string }) {
  const { t, direction, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const navClass = (active: boolean) => `text-sm transition ${active ? "text-teal-800" : "text-slate-600 hover:text-teal-800"}`;
  return <header className="relative z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
      <a href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight text-slate-950"><span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#0f766e] to-[#0ea5e9] text-white shadow-lg shadow-teal-500/20"><Wrench size={18} /></span><span>Maintainr</span></a>
      <nav className="hidden items-center gap-6 lg:flex">{links.map(link => <a key={link.href} href={link.href} className={navClass(current === link.key || (link.key === "product" && current === "features"))}>{t(link.en, link.ar)}</a>)}</nav>
      <div className="hidden items-center gap-2 lg:flex"><button onClick={toggleLanguage} className="rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">{direction === "rtl" ? "EN" : "ع"}</button><a href="/quote" className="maintainr-primary-action inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#0f766e] px-4 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:-translate-y-0.5 hover:bg-[#115e59] active:scale-[.97]"><Quote size={15} />{t("Request a consultation", "اطلب استشارة")}</a></div>
      <button onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-900 lg:hidden" aria-label={t("Open navigation", "فتح التنقل")}>{open ? <X size={19} /> : <Menu size={19} />}</button>
    </div>
    {open && <div className="border-t border-slate-200 bg-white px-5 pb-6 pt-3 shadow-lg lg:hidden"><div className="grid gap-1">{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm text-slate-700 hover:bg-slate-50">{t(link.en, link.ar)}</a>)}<div className="mt-3"><a href="/quote" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 text-sm font-semibold text-white"><Quote size={15} />{t("Request a consultation", "اطلب استشارة")}</a></div></div></div>}
  </header>;
}
