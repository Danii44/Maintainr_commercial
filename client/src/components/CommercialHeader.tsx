import { ArrowRight, Menu, Quote, Wrench, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const links = [
  { href: "/product", en: "Platform", ar: "المنصة", key: "product" },
  { href: "/features", en: "Workflow", ar: "مسار العمل", key: "features" },
  { href: "/solutions", en: "For teams", ar: "للفرق", key: "solutions" },
  { href: "/insights", en: "Insights", ar: "رؤى", key: "insights" },
];

export function CommercialHeader({ current }: { current: string }) {
  const { t, direction, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  return <header className="maintainr-shell-header relative z-50 border-b border-white/10 bg-[#0b1720] text-white">
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8"><a href="/" className="inline-flex items-center gap-2.5 font-semibold tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-[#d7f7f1] text-[#0b5f57]"><Wrench size={18} /></span><span>Maintainr</span></a><nav className="hidden items-center gap-6 lg:flex">{links.map(link => <a key={link.href} href={link.href} className={`text-sm transition ${current === link.key ? "text-white" : "text-slate-300 hover:text-[#d7f7f1]"}`}>{t(link.en, link.ar)}</a>)}</nav><div className="hidden items-center gap-3 lg:flex"><button onClick={toggleLanguage} className="rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10">{direction === "rtl" ? "EN" : "ع"}</button><a href="/quote" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#d7f7f1] px-4 text-sm font-semibold text-[#083b38] transition hover:bg-white active:scale-[.97]"><Quote size={15} />{t("Talk to us", "تحدث إلينا")}</a></div><button onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-xl border border-white/15 text-white lg:hidden" aria-label={t("Open navigation", "فتح التنقل")}>{open ? <X size={19} /> : <Menu size={19} />}</button></div>
    {open && <div className="border-t border-white/10 bg-[#0b1720] px-5 pb-6 pt-3 lg:hidden"><div className="grid gap-1">{links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm text-slate-200 hover:bg-white/10">{t(link.en, link.ar)}</a>)}<a href="/quote" className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#d7f7f1] px-4 text-sm font-semibold text-[#083b38]"><Quote size={15} />{t("Talk to us", "تحدث إلينا")}</a></div></div>}
  </header>;
}
