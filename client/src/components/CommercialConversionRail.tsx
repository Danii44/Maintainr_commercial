import { Building2, CalendarClock, Play, Quote } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { saasDestination } from "../lib/commercialRouting";

export function CommercialConversionRail() {
  const { t } = useLanguage();
  const saasUrl = import.meta.env.VITE_SAAS_APP_URL;

  return <aside aria-label={t("Maintainr evaluation paths", "مسارات تقييم Maintainr")} className="fixed inset-x-3 bottom-3 z-[60] mx-auto flex max-w-5xl items-center justify-between gap-2 rounded-2xl border border-white/10 bg-[#101522]/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl sm:inset-x-5 sm:gap-3 sm:p-2.5">
    <a href="/demo" className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl px-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/10 sm:px-3 sm:text-sm"><Play size={15}/><span className="hidden sm:inline">{t("Explore demo", "استكشف العرض")}</span><span className="sm:hidden">{t("Demo", "عرض")}</span></a>
    <a href="/quote?intent=demo" className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/20 sm:px-3 sm:text-sm"><CalendarClock size={15}/><span>{t("Request demo", "اطلب عرضاً")}</span></a>
    <a href="/quote?intent=quote" className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-400 px-2 text-xs font-semibold text-[#090b12] transition hover:bg-violet-300 sm:px-3 sm:text-sm"><Quote size={15}/><span>{t("Request quote", "اطلب عرض سعر")}</span></a>
    <a href={saasDestination(saasUrl, "/sign-in")} className="hidden min-h-10 items-center justify-center gap-2 rounded-xl px-3 text-xs font-semibold text-slate-300 transition hover:bg-white/[.06] lg:inline-flex"><Building2 size={15}/>{t("Customer portal", "بوابة العملاء")}</a>
  </aside>;
}
