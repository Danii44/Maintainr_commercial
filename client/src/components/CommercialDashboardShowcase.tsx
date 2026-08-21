import { ArrowRight, BellRing, CheckCircle2, ClipboardCheck, MessageSquareText, Route, Smartphone, Sparkles, Wrench } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

type ShowcaseTone = "home" | "platform" | "workflow";

export function CommercialDashboardShowcase({ tone = "home" }: { tone?: ShowcaseTone }) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const steps = [
    { icon: ClipboardCheck, label: t("Capture once", "سجّل مرة واحدة"), body: t("Turn an issue into a clear request with the detail the next person needs.", "حوّل المشكلة إلى طلب واضح يتضمن التفاصيل التي يحتاجها الشخص التالي.") },
    { icon: Route, label: t("Route with context", "وجّه بالسياق"), body: t("Keep responsibility, priority, appointments, and updates connected to the same record.", "حافظ على المسؤولية والأولوية والمواعيد والتحديثات متصلة بالسجل نفسه.") },
    { icon: CheckCircle2, label: t("Retain the proof", "احتفظ بالإثبات"), body: t("Close the loop with a durable history instead of another forgotten chat thread.", "أغلق الحلقة بسجل دائم بدلاً من سلسلة محادثات منسية أخرى.") },
  ];
  const eyebrow = tone === "workflow" ? t("SEE THE WORK MOVE", "شاهد العمل يتحرك") : tone === "platform" ? t("THE WORKSPACE IN ACTION", "مساحة العمل أثناء التنفيذ") : t("DESIGNED FOR THE DAILY RHYTHM", "مصمم للإيقاع اليومي");
  const title = tone === "workflow"
    ? t("A request becomes a visible next step for the whole team.", "يتحول الطلب إلى خطوة تالية مرئية للفريق بأكمله.")
    : t("See the work, the next step, and the proof—without chasing updates.", "شاهد العمل والخطوة التالية والإثبات دون مطاردة التحديثات.");

  return <section id="dashboard-showcase" className="maintainr-dashboard-showcase maintainr-3d-depth-field relative overflow-hidden bg-[#eaf8f5] px-5 py-24 lg:px-8">
    <div aria-hidden="true" className="pointer-events-none absolute left-[-12rem] top-12 size-[28rem] rounded-full bg-[#82dfd0]/35 blur-3xl" />
    <div aria-hidden="true" className="pointer-events-none absolute bottom-[-16rem] right-[-10rem] size-[34rem] rounded-full bg-[#9ccdf1]/30 blur-3xl" />
    <div className="relative mx-auto max-w-7xl">
      <motion.div initial={{ opacity: 0, y: reduce ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .62, ease: [0.23, 1, .32, 1] }} className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold tracking-[.18em] text-[#0f766e]">{eyebrow}</p>
        <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-.065em] text-[#172033] sm:text-6xl">{title}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#526176]">{t("Maintainr gives every role one calm place to understand what happened, what needs attention, and what should happen next.", "يوفر Maintainr لكل دور مكاناً هادئاً لفهم ما حدث وما يحتاج إلى اهتمام وما الذي يجب أن يحدث بعد ذلك.")}</p>
      </motion.div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.22fr_.78fr] lg:items-center">
        <motion.div initial={{ opacity: 0, x: reduce ? 0 : -34 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .72, ease: [0.23, 1, .32, 1] }} className="relative maintainr-3d-stage">
          <motion.div animate={reduce ? undefined : { y: [0, -7, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }} className="maintainr-3d-dashboard-frame relative overflow-hidden rounded-[2rem] border border-[#a9ded6] bg-white p-2 shadow-[0_28px_70px_rgba(15,118,110,.16)]">
            <img src="/assets/images/maintainr-dashboard-manager.png" alt={t("Maintainr manager dashboard showing maintenance requests and priorities", "لوحة تحكم مدير Maintainr تعرض طلبات الصيانة والأولويات")} className="block aspect-[16/10] w-full rounded-[1.55rem] object-cover object-top" />
            <div className="maintainr-3d-floating-chip absolute left-7 top-7 hidden items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[10px] font-bold tracking-[.14em] text-[#0f766e] shadow-lg sm:flex"><Sparkles size={13} />{t("LIVE WORKSPACE", "مساحة عمل مباشرة")}</div>
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .45, duration: .42 }} className="maintainr-3d-floating-panel absolute bottom-6 left-6 hidden max-w-56 rounded-2xl border border-white/70 bg-[#0b756d] p-3 text-white shadow-2xl sm:block"><div className="flex items-center gap-2 text-xs font-semibold"><BellRing size={15} />{t("Follow-up stays visible", "المتابعة تبقى مرئية")}</div><p className="mt-1 text-[11px] leading-4 text-teal-100">{t("Reminders and updates stay with the request.", "تبقى التذكيرات والتحديثات مع الطلب.")}</p></motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: .94, x: reduce ? 0 : 18 }} whileInView={{ opacity: 1, scale: 1, x: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: .18, duration: .55, ease: [0.23, 1, .32, 1] }} className="maintainr-3d-mobile-frame absolute -bottom-10 -right-4 hidden w-44 overflow-hidden rounded-[1.7rem] border-4 border-white bg-[#0b0f18] p-1 shadow-[0_24px_55px_rgba(23,32,51,.28)] md:block lg:-right-10">
            <img src="/assets/images/maintainr-dashboard-mobile.png" alt={t("Maintainr mobile dashboard navigation", "تنقل لوحة تحكم Maintainr على الهاتف")} className="block w-full rounded-[1.3rem]" />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: reduce ? 0 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .68, ease: [0.23, 1, .32, 1] }}>
          <div className="maintainr-3d-glass-panel rounded-[1.75rem] border border-[#b9e7df] bg-white/85 p-6 shadow-[0_18px_42px_rgba(23,32,51,.07)] backdrop-blur sm:p-8">
            <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-[#d7f7f1] text-[#0f766e]"><MessageSquareText size={21} /></span><div><p className="text-sm font-semibold text-[#172033]">{t("Less chasing. More clarity.", "مطاردة أقل. وضوح أكبر.")}</p><p className="mt-1 text-xs text-[#526176]">{t("A repeatable operating rhythm", "إيقاع تشغيلي قابل للتكرار")}</p></div></div>
            <div className="mt-8 space-y-6">{steps.map(({ icon: Icon, label, body }, index) => <motion.article key={label} initial={{ opacity: 0, y: reduce ? 0 : 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ delay: .14 + index * .1, duration: .42 }} className="flex gap-4"><span className="grid size-9 shrink-0 place-items-center rounded-xl border border-[#9eddd2] bg-[#f4fffd] text-[#0f766e]"><Icon size={17} /></span><div><p className="text-sm font-semibold text-[#172033]">{label}</p><p className="mt-1 text-sm leading-6 text-[#526176]">{body}</p></div></motion.article>)}</div>
            <a href="/experience" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0f766e] px-4 text-sm font-semibold text-white shadow-[0_12px_22px_rgba(15,118,110,.18)] transition hover:-translate-y-0.5 hover:bg-[#115e59] active:scale-[.98]">{t("Explore the working dashboard", "استكشف لوحة التحكم العملية")}<ArrowRight size={16} /></a>
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#c7e8e2] bg-white/55 p-4 text-sm text-[#315653]"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#c9f0e9] text-[#0f766e]"><Smartphone size={18} /></span><p>{t("The same clear workflow adapts to desktop, tablet, and phone screens.", "يتكيف مسار العمل الواضح نفسه مع شاشات سطح المكتب والجهاز اللوحي والهاتف.")}</p></div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: reduce ? 0 : 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ delay: .08, duration: .55 }} className="mt-16 grid gap-3 md:grid-cols-3">
        {[[t("One calm home", "موطن هادئ واحد"), t("Requests, messages, reminders, and next actions stay easy to find.", "تبقى الطلبات والرسائل والتذكيرات والإجراءات التالية سهلة العثور عليها.")], [t("Fewer manual follow-ups", "متابعات يدوية أقل"), t("A connected record makes it easier to keep people informed without rebuilding context.", "يسهّل السجل المتصل إبقاء الأشخاص على اطلاع دون إعادة بناء السياق.")], [t("Ready for the real day", "جاهز لليوم الحقيقي"), t("Use the same workspace in English or Arabic, at the desk or in the field.", "استخدم مساحة العمل نفسها بالإنجليزية أو العربية، على المكتب أو في الميدان.")]].map(([title, body]) => <article key={title} className="maintainr-3d-mini-card rounded-2xl border border-[#b9e7df] bg-white/65 p-5"><p className="text-sm font-semibold text-[#172033]">{title}</p><p className="mt-2 text-sm leading-6 text-[#526176]">{body}</p></article>)}
      </motion.div>
    </div>
  </section>;
}
