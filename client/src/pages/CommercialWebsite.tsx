import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, ClipboardCheck, Clock3, FileCheck2, Globe2, LayoutDashboard, ListTodo, Quote, ShieldCheck, Sparkles, UsersRound, Wrench } from "lucide-react";
import { useEffect, useMemo, type ReactNode } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { CommercialConversionRail } from "../components/CommercialConversionRail";
import { CommercialHeader } from "../components/CommercialHeader";
import { CommercialHomeExperience } from "../components/CommercialHomeExperience";
import { StandaloneQuotePage } from "./StandaloneQuotePage";

const visuals = {
  command: "/images/maintainr-hero-command-center.webp",
  roles: "/images/maintainr-role-coordination.webp",
  evidence: "/images/maintainr-trust-boundary.webp",
};

type PageKey = "home" | "product" | "features" | "solutions" | "quote" | "faq" | "insights" | "about" | "contact";

const pageByPath: Record<string, PageKey> = {
  "/": "home", "/product": "product", "/features": "features", "/solutions": "solutions", "/quote": "quote", "/faq": "faq", "/insights": "insights", "/about": "about", "/contact": "contact",
};

function Brand() {
  return <a href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight text-white"><span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#0f766e] to-[#0ea5e9] text-white shadow-lg shadow-teal-500/20"><Wrench size={18} /></span><span>Maintainr</span></a>;
}

function Action({ href, children, tone = "primary" }: { href: string; children: ReactNode; tone?: "primary" | "outline" }) {
  const className = tone === "primary"
    ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-5 text-sm font-semibold text-white shadow-lg shadow-teal-900/15 transition hover:-translate-y-0.5 hover:bg-[#115e59] active:scale-[.97]"
    : "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 active:scale-[.97]";
  return <a href={href} className={className}>{children}</a>;
}

function Eyebrow({ children }: { children: ReactNode }) { return <p className="text-xs font-bold tracking-[.16em] text-teal-700">{children}</p>; }

function PageHero({ eyebrow, title, body, visual = visuals.command, children }: { eyebrow: string; title: string; body: string; visual?: string; children?: ReactNode }) {
  return <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_86%_6%,rgba(14,165,233,.12),transparent_28%),radial-gradient(circle_at_8%_42%,rgba(45,212,191,.12),transparent_26%),linear-gradient(135deg,#ffffff,#f5fbfc)]"><div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1fr_.85fr] lg:items-center lg:px-8 lg:py-24"><div><Eyebrow>{eyebrow}</Eyebrow><h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-.055em] text-[#172033] sm:text-5xl lg:text-6xl">{title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{body}</p>{children}</div><div className="relative min-h-[270px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,.10)]"><img src={visual} alt="" className="h-full min-h-[270px] w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-tr from-[#0f766e]/15 via-transparent to-sky-300/20" /></div></div></section>;
}

function SectionTitle({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) { return <div className="max-w-2xl"><Eyebrow>{eyebrow}</Eyebrow><h2 className="mt-3 text-3xl font-semibold tracking-[-.045em] text-[#172033] sm:text-4xl">{title}</h2>{body && <p className="mt-4 leading-7 text-slate-600">{body}</p>}</div>; }

function ProductPage() {
  const { t } = useLanguage();
  const capabilities = [
    { icon: ClipboardCheck, title: t("Structured requests", "طلبات منظمة"), body: t("Capture the issue, context, preferred access, and relevant evidence in one accountable record.", "سجل المشكلة والسياق ووقت الوصول المفضل والأدلة ذات الصلة في سجل واحد مسؤول.") },
    { icon: LayoutDashboard, title: t("Focused dashboards", "لوحات تحكم مركزة"), body: t("See the work that needs attention without searching through disconnected updates.", "شاهد العمل الذي يحتاج إلى اهتمام دون البحث في تحديثات منفصلة.") },
    { icon: FileCheck2, title: t("Verified completion", "إنجاز موثق"), body: t("Keep resolution notes and completion evidence attached to the work they explain.", "احتفظ بملاحظات الحل وأدلة الإنجاز مرتبطة بالعمل الذي تشرحه.") },
    { icon: Clock3, title: t("Planned maintenance", "صيانة مخططة"), body: t("Coordinate recurring obligations with visible responsibility and a dependable history.", "نسق الالتزامات المتكررة بمسؤولية مرئية وسجل موثوق.") },
  ];
  return <><PageHero eyebrow={t("THE MAINTAINR PLATFORM", "منصة Maintainr")} title={t("A practical operating system for property maintenance.", "نظام تشغيل عملي لصيانة العقارات.")} body={t("Maintainr brings requests, decisions, field work, evidence, and history into a single role-aware workspace that property teams can use every day.", "يجمع Maintainr الطلبات والقرارات والعمل الميداني والإثبات والسجل في مساحة عمل واحدة حسب الدور يمكن لفرق العقارات استخدامها يومياً.")}><div className="mt-8 flex flex-wrap gap-3"><Action href="/quote"><Quote size={16} />{t("Request a consultation", "اطلب استشارة")}</Action><Action href="/features" tone="outline">{t("Explore workflows", "استكشف مسارات العمل")}</Action></div></PageHero><section className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><SectionTitle eyebrow={t("DESIGNED AROUND THE WORK", "مصمم حول العمل")} title={t("One clear record, instead of another disconnected tool.", "سجل واضح واحد بدلاً من أداة منفصلة أخرى.")} body={t("The system is designed around the choices a property team needs to make at each stage of maintenance—not around complicated screens.", "صمم النظام حول الخيارات التي يحتاج فريق العقارات إلى اتخاذها في كل مرحلة من مراحل الصيانة، وليس حول شاشات معقدة.")} /><div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{capabilities.map(({ icon: Icon, title, body }) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,.05)]"><Icon size={20} className="text-teal-700" /><h3 className="mt-5 text-lg font-semibold text-[#172033]">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></article>)}</div></section></>;
}

function FeaturesPage() {
  const { t } = useLanguage();
  const stages = [
    { icon: ClipboardCheck, label: t("Capture once", "سجّل مرة واحدة"), body: t("Give the request the detail it needs from the beginning.", "امنح الطلب التفاصيل التي يحتاجها من البداية.") },
    { icon: ListTodo, label: t("Assign with clarity", "أسند بوضوح"), body: t("Make responsibility, priority, and status visible to the right people.", "اجعل المسؤولية والأولوية والحالة مرئية للأشخاص المناسبين.") },
    { icon: Wrench, label: t("Update in the field", "حدّث في الميدان"), body: t("Let technicians move the work forward from a focused mobile-ready portal.", "دع الفنيين يدفعون العمل إلى الأمام من بوابة مركزة ومهيأة للجوال.") },
    { icon: ShieldCheck, label: t("Verify and retain", "تحقق واحتفظ"), body: t("Close the work with proof and preserve the decision trail.", "أغلق العمل بالإثبات واحفظ مسار القرار.") },
  ];
  return <><PageHero eyebrow={t("WORKFLOWS", "مسارات العمل")} title={t("Make every maintenance handoff understandable.", "اجعل كل تسليم للصيانة مفهوماً.")} body={t("Maintainr is built to reduce the gaps between reporting, coordination, field work, and follow-up while preserving the information each person needs to act.", "صمم Maintainr لتقليل الفجوات بين الإبلاغ والتنسيق والعمل الميداني والمتابعة مع حفظ المعلومات التي يحتاجها كل شخص للتصرف.")} visual={visuals.evidence} /><section className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="grid gap-4 md:grid-cols-2">{stages.map(({ icon: Icon, label, body }, index) => <motion.article initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }} key={label} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_12px_30px_rgba(15,23,42,.05)]"><span className="grid size-11 place-items-center rounded-xl bg-teal-50 text-teal-700"><Icon size={20} /></span><p className="mt-6 text-[11px] font-bold tracking-[.15em] text-sky-700">0{index + 1}</p><h2 className="mt-2 text-xl font-semibold text-[#172033]">{label}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{body}</p></motion.article>)}</div><div className="mt-12"><Action href="/quote"><Quote size={16} />{t("Discuss your operational goals", "ناقش أهدافك التشغيلية")}</Action></div></section></>;
}

function SolutionsPage() {
  const { t } = useLanguage();
  const roles = [
    { icon: Building2, title: t("Property managers", "مديرو العقارات"), points: [t("Coordinate work across properties", "نسق العمل عبر العقارات"), t("Assign priorities and technicians", "أسند الأولويات والفنيين"), t("See a durable operational history", "شاهد سجلاً تشغيلياً دائماً")] },
    { icon: UsersRound, title: t("Residents", "السكان"), points: [t("Report an issue with clear guidance", "أبلغ عن مشكلة بإرشادات واضحة"), t("Follow progress in one place", "تابع التقدم في مكان واحد"), t("Understand the completed outcome", "افهم النتيجة المكتملة")] },
    { icon: Wrench, title: t("Technicians", "الفنيون"), points: [t("Receive contextual assigned work", "استلم عملاً معيناً بسياق واضح"), t("Update progress where it matters", "حدّث التقدم في المكان المهم"), t("Attach proof before closing work", "أرفق الإثبات قبل إغلاق العمل")] },
    { icon: LayoutDashboard, title: t("Owners", "الملاك"), points: [t("Stay informed without operational noise", "ابق على اطلاع دون ضوضاء تشغيلية"), t("Review resolved maintenance activity", "راجع نشاط الصيانة المحلول"), t("Keep aligned with the property team", "ابق متوافقاً مع فريق العقار")] },
  ];
  return <><PageHero eyebrow={t("ROLE-BASED OPERATIONS", "عمليات حسب الدور")} title={t("Different responsibilities. One maintenance truth.", "مسؤوليات مختلفة. حقيقة صيانة واحدة.")} body={t("Maintainr gives every participant a focused experience while preserving the single shared record that keeps the organization aligned.", "يوفر Maintainr لكل مشارك تجربة مركزة مع الحفاظ على السجل المشترك الواحد الذي يبقي المؤسسة متوافقة.")} visual={visuals.roles} /><section className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="grid gap-4 md:grid-cols-2">{roles.map(({ icon: Icon, title, points }) => <article key={title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_12px_30px_rgba(15,23,42,.05)]"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-teal-50 text-teal-700"><Icon size={21} /></span><h2 className="text-xl font-semibold text-[#172033]">{title}</h2></div><ul className="mt-6 space-y-3">{points.map(point => <li key={point} className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 size={16} className="shrink-0 text-teal-600" />{point}</li>)}</ul></article>)}</div></section></>;
}

function FaqPage() {
  const { t } = useLanguage();
  const questions = [
    { q: t("How does Maintainr make maintenance easier to manage?", "كيف يجعل Maintainr إدارة الصيانة أسهل؟"), a: t("It brings the request, owner, updates, evidence, and history together so teams can act with the context they need.", "يجمع الطلب والمالك والتحديثات والإثبات والسجل معاً حتى تتمكن الفرق من التصرف بالسياق الذي تحتاجه.") },
    { q: t("Can each company have its own workspace identity?", "هل يمكن لكل شركة أن يكون لها هوية مساحة العمل الخاصة بها؟"), a: t("Yes. Each organization can use its own name, logo, colors, and workspace settings without affecting another organization.", "نعم. يمكن لكل مؤسسة استخدام اسمها وشعارها وألوانها وإعدادات مساحة العمل الخاصة بها دون التأثير في مؤسسة أخرى.") },
    { q: t("Do participants use separate accounts?", "هل يستخدم المشاركون حسابات منفصلة؟"), a: t("Yes. Managers, residents, technicians, and owners have role-aware access that keeps each person's actions understandable.", "نعم. يمتلك المديرون والسكان والفنيون والملاك وصولاً حسب الدور يجعل إجراءات كل شخص مفهومة.") },
    { q: t("Is Arabic supported across the experience?", "هل العربية مدعومة في التجربة بالكامل؟"), a: t("Yes. Maintainr supports Arabic and English with responsive right-to-left presentation.", "نعم. يدعم Maintainr العربية والإنجليزية مع عرض متجاوب من اليمين إلى اليسار.") },
  ];
  return <><PageHero eyebrow={t("FREQUENTLY ASKED QUESTIONS", "الأسئلة الشائعة")} title={t("Clear answers for property teams planning a better operation.", "إجابات واضحة لفرق العقارات التي تخطط لعملية أفضل.")} body={t("Understand how the platform supports a clearer, more accountable maintenance workflow.", "افهم كيف تدعم المنصة مسار صيانة أوضح وأكثر مسؤولية.")} visual={visuals.evidence} /><section className="mx-auto max-w-4xl px-5 py-20 lg:px-8"><div className="space-y-3">{questions.map(({ q, a }) => <details key={q} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,.04)]"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#172033]">{q}<ArrowRight size={18} className="text-teal-700 transition group-open:rotate-90" /></summary><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{a}</p></details>)}</div></section></>;
}

function InsightsPage() { const { t } = useLanguage(); const posts = [{ tag: t("OPERATIONS", "العمليات"), title: t("Why a maintenance request needs more than a message", "لماذا يحتاج طلب الصيانة إلى أكثر من رسالة"), body: t("A dependable maintenance record carries the context from the person reporting the issue to the person verifying completion.", "يحمل سجل الصيانة الموثوق السياق من الشخص الذي يبلغ عن المشكلة إلى الشخص الذي يتحقق من الإنجاز.") }, { tag: t("WORKFLOW", "مسار العمل"), title: t("Making work visible without making every role a manager", "جعل العمل مرئياً دون تحويل كل دور إلى مدير"), body: t("Role-aware portals protect simplicity while keeping the operational history shared.", "تحمي البوابات حسب الدور البساطة مع الحفاظ على السجل التشغيلي مشتركاً.") }, { tag: t("ACCESS", "الوصول"), title: t("A bilingual maintenance system people can actually use", "نظام صيانة ثنائي اللغة يمكن للناس استخدامه بالفعل"), body: t("Clear language and right-to-left support make the next action easier to understand across the organization.", "تجعل اللغة الواضحة ودعم الكتابة من اليمين إلى اليسار الإجراء التالي أسهل للفهم عبر المؤسسة.") }]; return <><PageHero eyebrow={t("INSIGHTS", "المقالات")} title={t("Practical thinking for clearer property operations.", "تفكير عملي لعمليات عقارية أوضح.")} body={t("These resources explore the operating principles behind accountable maintenance.", "تستكشف هذه الموارد المبادئ التشغيلية وراء الصيانة المسؤولة.")} /><section className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="grid gap-4 md:grid-cols-3">{posts.map((post, index) => <motion.article initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} key={post.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,.05)]"><Eyebrow>{post.tag}</Eyebrow><h2 className="mt-5 text-xl font-semibold leading-7 text-[#172033]">{post.title}</h2><p className="mt-4 text-sm leading-7 text-slate-600">{post.body}</p><span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-teal-700">{t("Coming soon", "قريباً")}<ArrowRight size={16} /></span></motion.article>)}</div></section></>; }

function AboutPage() { const { t } = useLanguage(); return <><PageHero eyebrow={t("ABOUT MAINTAINR", "عن Maintainr")} title={t("Designed for a maintenance operation people can understand and trust.", "مصمم لعملية صيانة يمكن للناس فهمها والثقة بها.")} body={t("Maintainr is built around a straightforward principle: work should keep its context as it moves across the people responsible for the outcome.", "بني Maintainr حول مبدأ مباشر: يجب أن يحتفظ العمل بسياقه أثناء انتقاله بين الأشخاص المسؤولين عن النتيجة.")} visual={visuals.roles} /><section className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="grid gap-4 md:grid-cols-3">{[{ icon: Sparkles, title: t("Clarity", "الوضوح"), body: t("Make the next action and current ownership easy to see.", "اجعل الإجراء التالي والملكية الحالية سهلين للرؤية.") }, { icon: ShieldCheck, title: t("Accountability", "المسؤولية"), body: t("Keep status, evidence, and history connected to the real work.", "حافظ على اتصال الحالة والأدلة والسجل بالعمل الحقيقي.") }, { icon: Globe2, title: t("Access", "الوصول"), body: t("Give every participant an understandable experience in English or Arabic.", "امنح كل مشارك تجربة مفهومة بالعربية أو الإنجليزية.") }].map(({ icon: Icon, title, body }) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,.05)]"><Icon size={22} className="text-teal-700" /><h2 className="mt-5 text-xl font-semibold text-[#172033]">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{body}</p></article>)}</div></section></>; }

function ContactPage() { const { t } = useLanguage(); return <><PageHero eyebrow={t("CONTACT", "تواصل")} title={t("Start the right conversation for your property operation.", "ابدأ المحادثة المناسبة لعملياتك العقارية.")} body={t("Use a consultation request to discuss your portfolio, maintenance workflow, and the outcomes your team needs to achieve.", "استخدم طلب استشارة لمناقشة محفظتك ومسار صيانة ممتلكاتك والنتائج التي يحتاج فريقك إلى تحقيقها.")} visual={visuals.evidence} /><section className="mx-auto max-w-5xl px-5 py-20 lg:px-8"><div className="grid gap-4 md:grid-cols-2"><a href="/quote" className="rounded-3xl border border-teal-200 bg-teal-50 p-7 transition hover:-translate-y-1"><Quote size={22} className="text-teal-700" /><h2 className="mt-5 text-xl font-semibold text-[#172033]">{t("Request a consultation", "اطلب استشارة")}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{t("For property companies planning a clearer operational workflow.", "لشركات العقارات التي تخطط لمسار عمل تشغيلي أوضح.")}</p></a><a href="/sign-in" className="rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1"><Building2 size={22} className="text-sky-700" /><h2 className="mt-5 text-xl font-semibold text-[#172033]">{t("Existing customer sign in", "تسجيل دخول عميل حالي")}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{t("For invited people and organizations already using Maintainr.", "للأشخاص المدعوين والمؤسسات التي تستخدم Maintainr بالفعل.")}</p></a></div></section></>; }

export function CommercialWebsite() {
  const { direction, t } = useLanguage();
  useEffect(() => {
    const appUrl = import.meta.env.VITE_SAAS_APP_URL?.replace(/\/$/, "");
    const redirectToSaas = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest('a[href="/create-workspace"], a[href="/sign-in"]') as HTMLAnchorElement | null;
      if (!anchor || !appUrl) return;
      event.preventDefault();
      window.location.assign(`${appUrl}${anchor.getAttribute("href")}`);
    };
    document.addEventListener("click", redirectToSaas);
    return () => document.removeEventListener("click", redirectToSaas);
  }, []);
  const page = pageByPath[typeof window === "undefined" ? "/" : window.location.pathname] ?? "home";
  const content = useMemo(() => ({ home: <CommercialHomeExperience />, product: <ProductPage />, features: <FeaturesPage />, solutions: <SolutionsPage />, quote: <StandaloneQuotePage />, faq: <FaqPage />, insights: <InsightsPage />, about: <AboutPage />, contact: <ContactPage /> }), []);
  return <div dir={direction} className="min-h-screen overflow-x-hidden bg-[#f5f7fb] text-[#172033] selection:bg-teal-200 selection:text-[#172033]"><CommercialHeader current={page} /><main>{content[page]}</main><footer className="border-t border-slate-800 bg-[#101423] px-5 py-10 text-white"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.25fr_1fr_1fr] lg:px-3"><div><Brand /><p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">{t("Maintainr gives property teams one clearer way to coordinate maintenance work.", "يمنح Maintainr فرق العقارات طريقة أوضح واحدة لتنسيق أعمال الصيانة.")}</p></div><div><p className="text-xs font-bold tracking-[.14em] text-slate-400">{t("PRODUCT", "المنتج")}</p><div className="mt-4 grid gap-2 text-sm text-slate-200"><a href="/product">{t("Platform", "المنصة")}</a><a href="/features">{t("Workflows", "مسارات العمل")}</a><a href="/solutions">{t("By role", "حسب الدور")}</a><a href="/faq">{t("FAQs", "الأسئلة الشائعة")}</a></div></div><div><p className="text-xs font-bold tracking-[.14em] text-slate-400">{t("START", "ابدأ")}</p><div className="mt-4 grid gap-2 text-sm text-slate-200"><a href="/quote">{t("Request a consultation", "اطلب استشارة")}</a><a href="/create-workspace">{t("Create workspace", "أنشئ مساحة عمل")}</a><a href="/sign-in">{t("Existing customer sign in", "تسجيل دخول عميل حالي")}</a></div></div></div></footer><CommercialConversionRail /></div>;
}
