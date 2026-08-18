import { ArrowRight, Quote } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export function CommercialConversionRail() {
  const { t } = useLanguage();
  return <aside aria-label={t("Maintainr product actions", "إجراءات منتج Maintainr")} className="commercial-conversion-rail fixed bottom-3 left-1/2 z-[60] mx-auto grid w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 grid-cols-2 items-center gap-2 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-2xl shadow-slate-900/15 backdrop-blur-xl sm:w-[calc(100%-2.5rem)] sm:gap-3 sm:p-2.5"><a href="/product" className="inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-xl px-2 text-xs font-semibold text-teal-800 transition hover:bg-teal-50 sm:px-3 sm:text-sm"><span>{t("See platform", "شاهد المنصة")}</span><ArrowRight size={15} /></a><a href="/quote" className="maintainr-primary-action inline-flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-2 text-xs font-semibold text-white transition hover:bg-[#115e59] sm:px-3 sm:text-sm"><Quote size={15} /><span>{t("Request consultation", "اطلب استشارة")}</span></a></aside>;
}
