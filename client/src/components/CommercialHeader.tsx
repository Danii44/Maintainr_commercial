import { CalendarClock, Menu, Play, Quote, Wrench, X } from "lucide-react";
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
  const navClass = (active: boolean) => `text-sm transition ${active ? "text-slate-950" : "text-slate-600 hover:text-slate-950"}`;
  return <header className="relative z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-white/[.07] dark:bg-[#080a12]/80">
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
      <a href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight text-slate-950 dark:text-white"><span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-400 text-white shadow-lg shadow-violet-500/20"><Wrench size={18}/></span><span>Maintainr</span></a>
      <nav className="hidden items-center gap-6 lg:flex">{links.map(link => <a key={link.href} href={link.href} className={`${navClass(current === link.key || (link.key === "product" && current === "features"))} dark:${current === link.key || (link.key === "product" && current === "features") ? "text-white" : "text-slate-300 hover:text-white"}`}>{t(link.en, link.ar)}</a>)}</nav>
      <div className="hidden items-center gap-2 lg:flex"><button onClick={toggleLanguage} className="rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[.06]">{direction === "rtl" ? "EN" : "ع"}</button><a href="/quote?intent=demo" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 text-xs font-semibold text-teal-800 transition hover:bg-teal-100 dark:border-cyan-300/25 dark:bg-cyan-300/10 dark:text-cyan-100 dark:hover:bg-cyan-300/20"><CalendarClock size={14}/>{t("Request demo", "اطلب عرضاً")}</a><a href="/quote?intent=quote" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:bg-violet-700 active:scale-[.97] dark:bg-violet-400 dark:text-[#090b12] dark:hover:bg-violet-300"><Quote size={15}/>{t("Request quote", "اطلب عرض سعر")}</a></div>
      <button onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-900 lg:hidden dark:border-white/10 dark:text-white" aria-label={t("Open navigation", "فتح التنقل")}>{open ? <X size={19}/> : <Menu size={19}/>}</button>
    </div>
    {open && <div className="border-t border-slate-200 bg-white px-5 pb-6 pt-3 shadow-lg lg:hidden dark:border-white/[.07] dark:bg-[#0b0e18]"><div className="grid gap-1">{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[.06]">{t(link.en, link.ar)}</a>)}<div className="mt-3 grid gap-2"><a href="/demo" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-800 dark:border-white/15 dark:text-white"><Play size={15}/>{t("Explore interactive demo", "استكشف العرض التفاعلي")}</a><a href="/quote?intent=demo" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 text-sm font-semibold text-teal-800 dark:border-cyan-300/25 dark:bg-cyan-300/10 dark:text-cyan-100"><CalendarClock size={15}/>{t("Request a guided demo", "اطلب عرضاً توضيحياً")}</a><a href="/quote?intent=quote" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white dark:bg-violet-400 dark:text-[#090b12]"><Quote size={15}/>{t("Request quotation", "اطلب عرض سعر")}</a></div></div></div>}
  </header>;
}
