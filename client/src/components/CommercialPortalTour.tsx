import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export function CommercialPortalTour() {
  const { t } = useLanguage();
  const points = [
    { icon: LayoutDashboard, title: t("A complete workspace", "مساحة عمل متكاملة"), body: t("Open the dedicated experience to move between Manager, Resident, Technician, and Owner perspectives.", "افتح التجربة المخصصة للتنقل بين وجهات نظر المدير والساكن والفني والمالك.") },
    { icon: CheckCircle2, title: t("Working interactions", "تفاعلات عاملة"), body: t("Create, assign, progress, resolve, and acknowledge work in a browser-session workspace.", "أنشئ العمل وعيّنه وحدّثه وحلّه وأكّده داخل مساحة عمل ضمن جلسة المتصفح.") },
    { icon: ShieldCheck, title: t("Safe by design", "آمن بطبيعته"), body: t("The experience is isolated from customer accounts, production data, and live records.", "التجربة معزولة عن حسابات العملاء وبيانات الإنتاج والسجلات الحية.") },
  ];

  return <section id="product-tour" className="commercial-tour bg-[#f5f7fb] px-5 py-24 lg:px-8">
    <div className="mx-auto max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .62, ease: [0.23, 1, .32, 1] }} className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold tracking-[.18em] text-[#0f766e]">{t("TAKE A PRODUCT TOUR", "استكشف جولة المنتج")}</p>
        <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-.06em] text-[#172033] sm:text-6xl">{t("Explore the full workspace, not a small preview.", "استكشف مساحة العمل الكاملة، لا معاينة صغيرة.")}</h2>
        <p className="mx-auto mt-6 max-w-2xl leading-7 text-[#526176]">{t("Choose a role and work through a complete maintenance flow on its own dedicated experience page.", "اختر دوراً واعمل عبر مسار صيانة كامل في صفحة تجربة مخصصة مستقلة.")}</p>
        <a href="/experience" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0f766e] px-6 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,118,110,.22)] transition hover:-translate-y-0.5 hover:bg-[#115e59] active:scale-[.97]">{t("Explore the experience", "استكشف التجربة")}<ArrowRight size={16}/></a>
      </motion.div>
      <div className="mt-12 grid gap-3 md:grid-cols-3">{points.map(({ icon: Icon, title, body }) => <article key={title} className="rounded-[1.5rem] border border-[#dcefed] bg-white p-6 shadow-[0_14px_34px_rgba(23,32,51,.05)]"><Icon size={21} className="text-[#0f766e]"/><h3 className="mt-7 text-lg font-semibold text-[#172033]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#526176]">{body}</p></article>)}</div>
    </div>
  </section>;
}
