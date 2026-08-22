import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BellRing, Building2, CheckCircle2, ClipboardCheck, FileCheck2, Languages, Quote, Route, ShieldCheck, UserRoundCheck, UsersRound, Wrench } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const visual = {
  dashboard: "/assets/images/maintainr-dashboard-manager.webp",
  dashboardVideo: "/assets/videos/maintainr-dashboard-hero.mp4",
  report: "/assets/images/maintainr-mobile-reporting-workflow.webp",
  evidence: "/assets/images/maintainr-field-evidence-workflow.webp",
  workflowFloat: "/assets/images/maintainr-workflow-float.webp",
};

type RevealDirection = "up" | "left" | "right";

function Reveal({ children, delay = 0, className = "", direction = "up" }: { children: ReactNode; delay?: number; className?: string; direction?: RevealDirection }) {
  const reduce = useReducedMotion();
  const offset = reduce ? 0 : 36;
  const initial = direction === "left" ? { opacity: 0, x: -offset } : direction === "right" ? { opacity: 0, x: offset } : { opacity: 0, y: reduce ? 0 : 18 };
  return <motion.div initial={initial} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: .16, margin: "0px 0px -8% 0px" }} transition={{ duration: .62, delay, ease: [0.23, 1, .32, 1] }} className={className}>{children}</motion.div>;
}

function Eyebrow({ children, inverse = false }: { children: ReactNode; inverse?: boolean }) {
  return <p className={inverse ? "marketing-eyebrow marketing-eyebrow-inverse" : "marketing-eyebrow"}>{children}</p>;
}

function StaggeredHeading({ text }: { text: string }) {
  const reduce = useReducedMotion();
  return <h1 aria-label={text} className="marketing-hero-title">{text.split(" ").map((word, index) => <motion.span key={`${word}-${index}`} aria-hidden="true" initial={reduce ? false : { opacity: 0, y: "0.8em" }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : index * .08, duration: .62, ease: [0.23, 1, .32, 1] }}>{word}{index < text.split(" ").length - 1 ? " " : ""}</motion.span>)}</h1>;
}

function Metric({ value, label, detail, animate = true }: { value: number | string; label: string; detail: string; animate?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(typeof value === "number" && animate ? 0 : value);
  useEffect(() => {
    if (typeof value !== "number" || !animate || !ref.current) return;
    const node = ref.current;
    const reveal = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 900, 1);
        setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (typeof IntersectionObserver === "undefined") { reveal(); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { reveal(); observer.disconnect(); } }, { threshold: .45 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [animate, value]);
  return <div ref={ref} className="marketing-metric"><span className="marketing-metric-value">{display}{typeof value === "number" && value === 24 ? "/7" : ""}</span><div><Eyebrow>{label}</Eyebrow><p>{detail}</p></div></div>;
}

function Primary({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="marketing-primary-action">{children}</a>;
}

function Secondary({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="marketing-secondary-action">{children}</a>;
}

function DashboardFrame({ t }: { t: (english: string, arabic: string) => string }) {
  const reduce = useReducedMotion();
  return <motion.div initial={{ opacity: 0, y: reduce ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72, delay: .12, ease: [0.23, 1, .32, 1] }} className="marketing-dashboard-stage marketing-dashboard-stage-reference marketing-png-hero-stage">
    <div className="marketing-png-live-dashboard">
      <div className="marketing-png-live-dashboard-bar"><span /><span /><span /><p>{t("Live Maintainr workspace", "مساحة عمل Maintainr الحية")}</p><div><i />{t("Ready", "جاهزة")}</div></div>
      {reduce ? <img src={visual.dashboard} alt={t("Maintainr property manager workspace showing open tickets, in-progress work, resolved work, and a next-focus card", "مساحة عمل مدير العقار في Maintainr تعرض التذاكر المفتوحة والعمل الجاري والعمل المنجز وبطاقة التركيز التالية")} /> : <video src={visual.dashboardVideo} poster={visual.dashboard} autoPlay muted loop playsInline preload="metadata" aria-label={t("Animated Maintainr property manager workspace showing open tickets, in-progress work, resolved work, and a next-focus card", "مساحة عمل مدير العقار المتحركة في Maintainr تعرض التذاكر المفتوحة والعمل الجاري والعمل المنجز وبطاقة التركيز التالية")} />}
      <div className="marketing-png-live-dashboard-status"><CheckCircle2 size={15} />{t("Every update stays with the request", "يبقى كل تحديث مع الطلب")}</div>
    </div>
  </motion.div>;
}

function WorkflowVisual({ image, alt, eyebrow, title, body, points, reverse = false, t }: { image: string; alt: string; eyebrow: string; title: string; body: string; points: Array<{ icon: typeof ClipboardCheck; title: string; body: string }>; reverse?: boolean; t: (english: string, arabic: string) => string }) {
  const reduce = useReducedMotion();
  return <section className={reverse ? "marketing-visual-story marketing-visual-story-reverse" : "marketing-visual-story"}>
    <Reveal direction={reverse ? "right" : "left"} className="marketing-visual-image-wrap">
      <div className="marketing-image-glow" aria-hidden="true" /><img src={image} alt={alt} className="marketing-visual-image" />
    </Reveal>
    <Reveal direction={reverse ? "left" : "right"} delay={.08} className="marketing-visual-copy">
      <Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2><p className="marketing-copy-lead">{body}</p>
      <div className="marketing-proof-list">{points.map(({ icon: Icon, title: pointTitle, body: pointBody }) => <div key={pointTitle} className="marketing-proof-item"><span><Icon size={18} /></span><div><h3>{pointTitle}</h3><p>{pointBody}</p></div></div>)}</div>
      <a href="/features" className="marketing-inline-link">{t("Explore the workflow", "استكشف مسار العمل")}<ArrowRight size={16} /></a>
    </Reveal>
  </section>;
}

export function CommercialHomeExperience() {
  const { t } = useLanguage();
  const friction = [
    { icon: ClipboardCheck, number: "01", title: t("The report begins without the right detail.", "يبدأ البلاغ من دون التفاصيل الصحيحة."), body: t("Access notes, priority, photos, and the actual issue are often scattered before anyone can act.", "غالباً ما تتوزع ملاحظات الوصول والأولوية والصور والمشكلة الفعلية قبل أن يتمكن أي شخص من التصرف.") },
    { icon: Route, number: "02", title: t("The handoff loses the context.", "يفقد التسليم السياق."), body: t("When work moves from resident to manager to technician, the next person should not have to rebuild the story.", "عندما ينتقل العمل من الساكن إلى المدير إلى الفني، لا ينبغي للشخص التالي أن يعيد بناء القصة.") },
    { icon: FileCheck2, number: "03", title: t("Completion is difficult to prove later.", "يصعب إثبات الإنجاز لاحقاً."), body: t("A closed request needs a clear outcome, supporting evidence, and a history the team can trust.", "يحتاج الطلب المغلق إلى نتيجة واضحة وإثباتات داعمة وسجل يمكن للفريق الوثوق به.") },
  ];
  const guide = [
    { icon: ClipboardCheck, step: t("01 · Report", "01 · أبلغ"), title: t("Capture the work clearly", "سجّل العمل بوضوح"), body: t("Start with the details, photos, access notes, and priority the next person needs.", "ابدأ بالتفاصيل والصور وملاحظات الوصول والأولوية التي يحتاجها الشخص التالي.") },
    { icon: Route, step: t("02 · Assign", "02 · عيّن"), title: t("Route it to the right owner", "وجّهه إلى المسؤول المناسب"), body: t("Make responsibility and the next action visible without moving the conversation elsewhere.", "اجعل المسؤولية والإجراء التالي مرئيين من دون نقل المحادثة إلى مكان آخر.") },
    { icon: Wrench, step: t("03 · Progress", "03 · تقدّم"), title: t("Keep field updates connected", "أبقِ تحديثات الميدان متصلة"), body: t("Technicians can update the same record while managers and residents stay informed.", "يمكن للفنيين تحديث السجل نفسه بينما يبقى المديرون والسكان على اطلاع.") },
    { icon: CheckCircle2, step: t("04 · Verify", "04 · تحقّق"), title: t("Close with proof", "أغلق بالإثبات"), body: t("Retain the result, evidence, and history so the next decision starts with confidence.", "احتفظ بالنتيجة والإثبات والسجل حتى يبدأ القرار التالي بثقة.") },
  ];
  const roles = [
    { icon: Building2, title: t("Property managers", "مديرو العقارات"), body: t("Set priorities, assign work, and see the portfolio without chasing separate updates.", "حدد الأولويات وعيّن العمل وشاهد المحفظة من دون ملاحقة تحديثات منفصلة.") },
    { icon: UsersRound, title: t("Residents", "السكان"), body: t("Report what is happening and follow the status without wondering who owns the next step.", "أبلغ عما يحدث وتابع الحالة من دون التساؤل عن مسؤول الخطوة التالية.") },
    { icon: Wrench, title: t("Technicians", "الفنيون"), body: t("Arrive with context, add progress from the field, and finish with reliable evidence.", "صل إلى الموقع مع السياق وأضف التقدم من الميدان وأنهِ العمل بإثبات موثوق.") },
    { icon: UserRoundCheck, title: t("Owners", "الملاك"), body: t("Review a trusted history of work connected to the units they need to oversee.", "راجع سجل عمل موثوقاً مرتبطاً بالوحدات التي تحتاج إلى الإشراف عليها.") },
  ];
  const testimonials = [
    { quote: t("The value is simple: every handoff keeps its context, so the team spends less time asking what happened and more time moving the work forward.", "القيمة بسيطة: يحتفظ كل تسليم بسياقه، لذلك يقضي الفريق وقتاً أقل في السؤال عما حدث ووقتاً أكبر في دفع العمل إلى الأمام."), name: t("Operations lead", "قائد العمليات"), detail: t("Property maintenance team", "فريق صيانة عقارات") },
    { quote: t("Maintainr gives each role a focused next step without breaking the shared record behind it.", "يمنح Maintainr كل دور خطوة تالية مركزة من دون فصل السجل المشترك الذي يقف خلفها."), name: t("Portfolio manager", "مدير المحفظة"), detail: t("Multi-property operations", "عمليات متعددة العقارات") },
  ];
  const plans = [
    { name: t("Starter", "البداية"), detail: t("For a team proving the workflow", "لفريق يختبر مسار العمل"), price: t("Talk to us", "تحدث إلينا"), points: [t("Core maintenance records", "سجلات الصيانة الأساسية"), t("Role-based views", "عروض حسب الدور"), t("Clear ticket ownership", "ملكية واضحة للتذاكر")] },
    { name: t("Operations", "العمليات"), detail: t("For teams coordinating daily work", "للفرق التي تنسق العمل اليومي"), price: t("Shape your plan", "شكّل خطتك"), points: [t("Connected reporting and assignment", "إبلاغ وتعيين متصلان"), t("Progress, reminders, and evidence", "تقدم وتذكيرات وإثباتات"), t("Portfolio-level visibility", "رؤية على مستوى المحفظة")] },
    { name: t("Portfolio", "المحفظة"), detail: t("For growing property operations", "لعمليات العقارات المتنامية"), price: t("Plan with us", "خطط معنا"), points: [t("A workspace shaped around your roles", "مساحة عمل مصممة حول أدوارك"), t("Operational history that stays trusted", "سجل تشغيلي يبقى موثوقاً"), t("A dependable rhythm for every property", "إيقاع موثوق لكل عقار")] },
  ];
  const questions = [
    [t("What does Maintainr help a property team do?", "ما الذي يساعد Maintainr فريق العقارات على القيام به؟"), t("It gives the team one connected workflow for reporting, assigning, progressing, verifying, and reviewing maintenance work.", "يوفر للفريق مسار عمل متصلاً واحداً للإبلاغ والتعيين والتقدم والتحقق ومراجعة أعمال الصيانة.")],
    [t("Can each person have a focused view?", "هل يمكن لكل شخص الحصول على عرض مركّز؟"), t("Yes. Managers, residents, technicians, and owners work from the same operational record while seeing the actions that are relevant to them.", "نعم. يعمل المديرون والسكان والفنيون والملاك من السجل التشغيلي نفسه مع رؤية الإجراءات المرتبطة بهم.")],
    [t("How does a team start?", "كيف يبدأ الفريق؟"), t("Begin with the maintenance workflow you use today. Together, we can shape the workspace around your roles, properties, and operating priorities.", "ابدأ بمسار الصيانة الذي تستخدمه اليوم. يمكننا معاً تشكيل مساحة العمل حول أدوارك وعقاراتك وأولوياتك التشغيلية.")],
  ];

  return <main className="maintainr-marketing-home">
    <section className="marketing-hero">
      <div className="marketing-hero-grid" aria-hidden="true" />
      <div className="marketing-hero-orb marketing-hero-orb-one" aria-hidden="true" /><div className="marketing-hero-orb marketing-hero-orb-two" aria-hidden="true" />
      <div className="marketing-container marketing-hero-layout marketing-hero-layout-centered">
        <Reveal className="marketing-hero-copy marketing-hero-copy-centered"><Eyebrow>{t("PROPERTY MAINTENANCE, MADE OPERABLE", "صيانة العقارات، أصبحت قابلة للتشغيل")}</Eyebrow><StaggeredHeading text={t("From the first report to the final proof, maintenance moves with", "من أول بلاغ إلى آخر إثبات، تتحرك الصيانة بوضوح")} /><em>{t("clarity.", "وثقة.")} </em><p>{t("Maintainr gives every property team one connected workflow for reporting, assigning, progressing, verifying, and reviewing the work that keeps buildings moving.", "يوفر Maintainr لكل فريق عقارات مسار عمل متصلاً واحداً للإبلاغ والتعيين والتقدم والتحقق ومراجعة العمل الذي يحافظ على حركة المباني.")}</p><div className="marketing-hero-actions"><Primary href="/quote"><Quote size={17} />{t("Plan your workflow", "خطط لمسار عملك")}</Primary><Secondary href="#how-it-works">{t("See the workflow", "شاهد مسار العمل")}<ArrowRight size={17} /></Secondary></div><div className="marketing-hero-proof"><span><CheckCircle2 size={15} />{t("One connected record", "سجل متصل واحد")}</span><span><BellRing size={15} />{t("Visible next steps", "خطوات تالية مرئية")}</span><span><Languages size={15} />{t("English + العربية", "العربية + English")}</span></div></Reveal>
        <DashboardFrame t={t} />
      </div>
    </section>

    <section className="marketing-outcome-bar"><div className="marketing-container marketing-outcome-grid"><Metric value={1} label={t("OPERATING RECORD", "سجل تشغيلي")} detail={t("One connected source of truth", "مصدر حقيقة متصل واحد")} /><Metric value={4} label={t("ROLE VIEWS", "عروض حسب الدور")} detail={t("Manager, resident, technician, owner", "مدير، ساكن، فني، مالك")} /><Metric value={24} label={t("FOLLOW-UP", "المتابعة")} detail={t("Visibility that stays with the work", "رؤية تبقى مع العمل")} /></div></section>

    <section className="marketing-section marketing-problem-section"><div className="marketing-container"><Reveal className="marketing-section-intro"><Eyebrow>{t("WHEN WORK GETS LOST", "عندما يضيع العمل")}</Eyebrow><h2>{t("Maintenance should not depend on who remembers the last message.", "لا ينبغي أن تعتمد الصيانة على من يتذكر الرسالة الأخيرة.")}</h2><p>{t("Maintainr brings the detail, responsibility, updates, and evidence into a workflow people can follow without rebuilding context at every handoff.", "يجمع Maintainr التفاصيل والمسؤولية والتحديثات والإثبات في مسار عمل يمكن للناس اتباعه من دون إعادة بناء السياق عند كل تسليم.")}</p></Reveal><div className="marketing-problem-grid">{friction.map(({ icon: Icon, number, title, body }, index) => <Reveal key={title} delay={index * .08}><article className="marketing-problem-card"><span className="marketing-card-icon"><Icon size={21} /></span><p className="marketing-card-number">{number}</p><h3>{title}</h3><p>{body}</p></article></Reveal>)}</div></div></section>

    <section id="how-it-works" className="marketing-section marketing-workflow-section"><div className="marketing-container"><Reveal className="marketing-section-intro marketing-section-intro-center"><Eyebrow>{t("HOW MAINTAINR GUIDES THE WORK", "كيف يوجّه Maintainr العمل")}</Eyebrow><h2>{t("A practical workflow for every maintenance request.", "مسار عمل عملي لكل طلب صيانة.")}</h2><p>{t("Each stage answers the questions that slow teams down: what happened, who owns it, what is next, and what proves it is complete?", "تجيب كل مرحلة عن الأسئلة التي تبطئ الفرق: ماذا حدث، من المسؤول، ما الخطوة التالية، وما الذي يثبت اكتماله؟")}</p></Reveal><div className="marketing-workflow-grid">{guide.map(({ icon: Icon, step, title, body }, index) => <Reveal key={title} delay={index * .06}><article className="marketing-workflow-card"><p>{step}</p><span><Icon size={22} /></span><h3>{title}</h3><p>{body}</p></article></Reveal>)}</div></div></section>

    <section className="marketing-proof-dark"><div className="marketing-container"><Reveal className="marketing-section-intro marketing-section-intro-center"><Eyebrow inverse>{t("BUILT FOR THE WORK AHEAD", "مصمم للعمل القادم")}</Eyebrow><h2>{t("A calmer system is easier to trust.", "النظام الأكثر هدوءاً أسهل في الثقة.")}</h2><p>{t("Teams do better work when the record is clear, the next step is visible, and the outcome can be reviewed later.", "تعمل الفرق بشكل أفضل عندما يكون السجل واضحاً والخطوة التالية مرئية ويمكن مراجعة النتيجة لاحقاً.")}</p></Reveal><div className="marketing-testimonial-grid">{testimonials.map(({ quote, name, detail }, index) => <Reveal key={name} delay={index * .08}><blockquote className="marketing-testimonial"><Quote size={22} /><p>“{quote}”</p><footer><strong>{name}</strong><span>{detail}</span></footer></blockquote></Reveal>)}</div></div></section>

    <div className="marketing-container marketing-stories">
      <WorkflowVisual image={visual.report} alt={t("A resident using a phone to report a maintenance issue while a technician approaches", "ساكنة تستخدم الهاتف للإبلاغ عن مشكلة صيانة بينما يقترب فني")} eyebrow={t("START WITH A BETTER REPORT", "ابدأ ببلاغ أفضل")} title={t("Give the next person the context they need before the work begins.", "امنح الشخص التالي السياق الذي يحتاجه قبل أن يبدأ العمل.")} body={t("A well-structured request makes the first handoff easier. The people involved can see the issue, priority, access detail, and next action in the same place.", "يجعل الطلب المنظم أول تسليم أسهل. يمكن للأشخاص المشاركين رؤية المشكلة والأولوية وتفاصيل الوصول والإجراء التالي في المكان نفسه.")} points={[{ icon: ClipboardCheck, title: t("Capture the essentials", "سجّل الأساسيات"), body: t("Issue detail, priority, photos, and access notes travel together.", "تنتقل تفاصيل المشكلة والأولوية والصور وملاحظات الوصول معاً.") }, { icon: Route, title: t("Make ownership visible", "اجعل المسؤولية مرئية"), body: t("Everyone sees who is responsible for the next step.", "يرى الجميع من المسؤول عن الخطوة التالية.") }]} t={t} />
      <WorkflowVisual reverse image={visual.evidence} alt={t("A technician documenting a completed repair while a property manager reviews the result", "فني يوثق إصلاحاً منجزاً بينما يراجع مدير العقار النتيجة")} eyebrow={t("FINISH WITH CONFIDENCE", "أنهِ العمل بثقة")} title={t("Keep the proof connected to the work it belongs to.", "أبقِ الإثبات متصلاً بالعمل الذي ينتمي إليه.")} body={t("Updates from the field should not disappear into a separate message thread. Maintainr keeps progress, completion notes, and supporting evidence with the original request.", "لا ينبغي أن تختفي تحديثات الميدان في سلسلة رسائل منفصلة. يحافظ Maintainr على التقدم وملاحظات الإنجاز والإثباتات الداعمة مع الطلب الأصلي.")} points={[{ icon: Wrench, title: t("Record progress in the field", "سجّل التقدم في الميدان"), body: t("Technicians update the same request managers are coordinating.", "يحدّث الفنيون الطلب نفسه الذي ينسقه المديرون.") }, { icon: FileCheck2, title: t("Retain a trusted history", "احتفظ بسجل موثوق"), body: t("The result stays ready for the next review, follow-up, or audit.", "تبقى النتيجة جاهزة للمراجعة أو المتابعة أو التدقيق التالي.") }]} t={t} />
    </div>

    <section className="marketing-roles-section"><div className="marketing-container marketing-roles-layout"><Reveal direction="left" className="marketing-roles-copy"><Eyebrow>{t("ONE RECORD. FOUR FOCUSED VIEWS.", "سجل واحد. أربعة عروض مركزة.")}</Eyebrow><h2>{t("The system stays connected while each person sees a clearer next step.", "يبقى النظام متصلاً بينما يرى كل شخص خطوة تالية أوضح.")}</h2><p>{t("Managers, residents, technicians, and owners work from the same source of truth without needing the same screen or the same level of operational detail.", "يعمل المديرون والسكان والفنيون والملاك من المصدر نفسه للحقيقة من دون الحاجة إلى الشاشة نفسها أو المستوى نفسه من التفاصيل التشغيلية.")}</p><a href="/solutions" className="marketing-inline-link">{t("Explore role experiences", "استكشف تجارب الأدوار")}<ArrowRight size={16} /></a></Reveal><Reveal direction="right" delay={.08} className="marketing-roles-image-wrap marketing-roles-image-wrap-png"><img src={visual.workflowFloat} alt={t("A visual representation of one connected maintenance workflow", "تمثيل بصري لمسار صيانة واحد متصل")} className="marketing-roles-image marketing-roles-image-png" /></Reveal></div><div className="marketing-container marketing-role-grid">{roles.map(({ icon: Icon, title, body }, index) => <Reveal key={title} delay={index * .06}><article className="marketing-role-card"><span><Icon size={20} /></span><h3>{title}</h3><p>{body}</p></article></Reveal>)}</div></section>

    <section className="marketing-platform-section"><div className="marketing-container marketing-platform-layout"><Reveal direction="left" className="marketing-platform-copy"><Eyebrow inverse>{t("A SHARED VIEW OF THE DAY", "عرض مشترك لليوم")}</Eyebrow><h2>{t("See the work, the priority, and the next move—without chasing updates.", "شاهد العمل والأولوية والخطوة التالية من دون ملاحقة التحديثات.")}</h2><p>{t("The manager workspace turns a busy portfolio into a practical operating view. Tickets, reminders, conversations, and next actions are easier to find when the record stays connected.", "تحول مساحة عمل المدير محفظة مشغولة إلى عرض تشغيلي عملي. تصبح التذاكر والتذكيرات والمحادثات والإجراءات التالية أسهل في العثور عليها عندما يبقى السجل متصلاً.")}</p><div className="marketing-platform-points"><div><CheckCircle2 size={18} /><span>{t("Priorities stay visible", "تبقى الأولويات مرئية")}</span></div><div><ShieldCheck size={18} /><span>{t("Evidence stays attached", "يبقى الإثبات مرفقاً")}</span></div></div><Primary href="/experience">{t("Explore the working dashboard", "استكشف لوحة التحكم العملية")}<ArrowRight size={16} /></Primary></Reveal><Reveal direction="right" delay={.1} className="marketing-platform-screen"><div className="marketing-platform-screen-shell"><img src={visual.dashboard} alt={t("Maintainr manager dashboard", "لوحة تحكم مدير Maintainr")} /><div><BellRing size={16} />{t("Follow-up stays visible", "تبقى المتابعة مرئية")}</div></div></Reveal></div></section>

    <section className="marketing-section marketing-adoption-section"><div className="marketing-container"><Reveal className="marketing-section-intro"><Eyebrow>{t("A CALMER WAY TO START", "طريقة أكثر هدوءاً للبدء")}</Eyebrow><h2>{t("Start from the workflow you already know.", "ابدأ من مسار العمل الذي تعرفه بالفعل.")}</h2><p>{t("A useful operating system should fit the people, properties, and maintenance detail that matter to your team—not force a generic process on top of the work.", "يجب أن يتناسب نظام التشغيل المفيد مع الأشخاص والعقارات وتفاصيل الصيانة المهمة لفريقك، لا أن يفرض عملية عامة فوق العمل.")}</p></Reveal><div className="marketing-adoption-grid">{[["01", t("Map your current process", "ارسم عمليتك الحالية"), t("Clarify how a request starts, moves, and closes today.", "وضّح كيف يبدأ الطلب ويتحرك وينغلق اليوم.")], ["02", t("Shape the workspace", "شكّل مساحة العمل"), t("Match roles, properties, units, and operating responsibilities.", "طابق الأدوار والعقارات والوحدات ومسؤوليات التشغيل.")], ["03", t("Build the rhythm", "ابنِ الإيقاع"), t("Use one connected record to make follow-up more dependable.", "استخدم سجلاً متصلاً واحداً لجعل المتابعة أكثر موثوقية.")]].map(([step, title, body], index) => <Reveal key={step} delay={index * .07}><article><p>{step}</p><h3>{title}</h3><p>{body}</p></article></Reveal>)}</div></div></section>

    <section id="pricing" className="marketing-pricing-section"><div className="marketing-container"><Reveal className="marketing-section-intro marketing-section-intro-center"><Eyebrow>{t("A CLEAR PLACE TO START", "مكان واضح للبدء")}</Eyebrow><h2>{t("Choose the operating rhythm that fits your team.", "اختر الإيقاع التشغيلي الذي يناسب فريقك.")}</h2><p>{t("Every plan starts with the same principle: keep the work, responsibility, and proof connected. Talk with us to shape the right workspace for your properties.", "تبدأ كل خطة بالمبدأ نفسه: إبقاء العمل والمسؤولية والإثبات متصلة. تحدث معنا لتشكيل مساحة العمل المناسبة لعقاراتك.")}</p></Reveal><div className="marketing-pricing-grid">{plans.map(({ name, detail, price, points }, index) => <Reveal key={name} delay={index * .07}><article className={index === 1 ? "marketing-price-card marketing-price-card-featured" : "marketing-price-card"}>{index === 1 && <span className="marketing-price-badge">{t("MOST FLEXIBLE", "الأكثر مرونة")}</span>}<Eyebrow>{name}</Eyebrow><p className="marketing-price-detail">{detail}</p><div className="marketing-price-rule" /> <ul>{points.map(point => <li key={point}><CheckCircle2 size={16} />{point}</li>)}</ul><Primary href="/quote"><Quote size={16} />{price}</Primary></article></Reveal>)}</div></div></section>

    <section className="marketing-faq-section"><div className="marketing-container marketing-faq-wrap"><Reveal className="marketing-section-intro marketing-section-intro-center"><Eyebrow>{t("PRACTICAL QUESTIONS", "أسئلة عملية")}</Eyebrow><h2>{t("Answers for teams planning their next operating step.", "إجابات للفرق التي تخطط لخطوتها التشغيلية التالية.")}</h2></Reveal><div className="marketing-faq-list">{questions.map(([question, answer], index) => <Reveal key={question} delay={index * .05}><details><summary>{question}<ArrowRight size={18} /></summary><p>{answer}</p></details></Reveal>)}</div></div></section>

    <section className="marketing-final-cta"><div className="marketing-container"><Reveal><div><Eyebrow inverse>{t("READY TO MAKE THE WORK EASIER TO RUN?", "هل أنت جاهز لجعل العمل أسهل في الإدارة؟")}</Eyebrow><h2>{t("Bring a clearer operating rhythm to every property you manage.", "اجلب إيقاعاً تشغيلياً أوضح لكل عقار تديره.")}</h2><p>{t("Tell us how maintenance moves through your portfolio. We will help you shape a workflow that keeps every handoff connected.", "أخبرنا كيف تتحرك الصيانة عبر محفظتك. سنساعدك على تشكيل مسار عمل يبقي كل تسليم متصلاً.")}</p></div><Primary href="/quote"><Quote size={17} />{t("Plan your workflow", "خطط لمسار عملك")}</Primary></Reveal></div></section>
  </main>;
}
