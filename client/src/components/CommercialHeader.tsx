import { Building2, CalendarClock, Menu, Play, Quote, Wrench, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { saasDestination } from "../lib/commercialRouting";

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
  const saasUrl = import.meta.env.VITE_SAAS_APP_URL;
  const navClass = (active: boolean) => `text-sm transition ${active ? "text-white" : "text-slate-300 hover:text-white"}`;
  return <header className="relative z-50 border-b border-white/[.07] bg-[#080a12]/80 backdrop-blur-xl">
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
      <a href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight text-white"><span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-400 to-cyan-300 text-[#070a12] shadow-lg shadow-violet-500/20"><Wrench size={18}/></span><span>Maintainr</span></a>
      <nav className="hidden items-center gap-6 lg:flex">{links.map(link => <a key={link.href} href={link.href} className={navClass(current === link.key || (link.key === "product" && current === "features"))}>{t(link.en, link.ar)}</a>)}</nav>
      <div className="hidden items-center gap-2 lg:flex">
        <button onClick={toggleLanguage} className="rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[.06]">{direction === "rtl" ? "EN" : "ع"}</button>
        <a href={saasDestination(saasUrl, "/sign-in")} className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-medium text-slate-400 transition hover:bg-white/[.06] hover:text-white"><Building2 size={14}/>{t("Customer portal", "بوابة العملاء")}</a>
        <a href="/quote?intent=demo" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-3 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20"><CalendarClock size={14}/>{t("Request demo", "اطلب عرضاً")}</a>
        <a href="/quote?intent=quote" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-violet-400 px-4 text-sm font-semibold text-[#090b12] shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:bg-violet-300 active:scale-[.97]"><Quote size={15}/>{t("Request quote", "اطلب عرض سعر")}</a>
      </div>
      <button onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-xl border border-white/10 text-white lg:hidden" aria-label={t("Open navigation", "فتح التنقل")}>{open ? <X size={19}/> : <Menu size={19}/>}</button>
    </div>
    {open && <div className="border-t border-white/[.07] bg-[#0b0e18] px-5 pb-6 pt-3 lg:hidden"><div className="grid gap-1">{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm text-slate-200">{t(link.en, link.ar)}</a>)}<div className="mt-3 grid gap-2"><a href="/demo" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-semibold text-white"><Play size={15}/>{t("Explore interactive demo", "استكشف العرض التفاعلي")}</a><a href="/quote?intent=demo" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-4 text-sm font-semibold text-cyan-100"><CalendarClock size={15}/>{t("Request a guided demo", "اطلب عرضاً توضيحياً")}</a><a href="/quote?intent=quote" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-400 px-4 text-sm font-semibold text-[#090b12]"><Quote size={15}/>{t("Request quotation", "اطلب عرض سعر")}</a><a href={saasDestination(saasUrl, "/sign-in")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-slate-300"><Building2 size={15}/>{t("Existing customer portal", "بوابة العميل الحالي")}</a></div></div></div>}
  </header>;
}
