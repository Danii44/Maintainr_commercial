import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BellRing, Building2, CheckCircle2, ClipboardCheck, FileCheck2, Languages, Quote, Route, ShieldCheck, Smartphone, UserRoundCheck, UsersRound, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const visual = {
  dashboard: "/assets/images/maintainr-dashboard-manager.png",
  mobileDashboard: "/assets/images/maintainr-dashboard-mobile.png",
  report: "/assets/images/maintainr-mobile-reporting-workflow.webp",
  evidence: "/assets/images/maintainr-field-evidence-workflow.webp",
  coordination: "/assets/images/maintainr-role-coordination-premium.webp",
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

function Primary({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="marketing-primary-action">{children}</a>;
}

function Secondary({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className="marketing-secondary-action">{children}</a>;
}

function DashboardFrame({ t }: { t: (english: string, arabic: string) => string }) {
  const reduce = useReducedMotion();
  return <motion.div initial={{ opacity: 0, y: reduce ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72, delay: .12, ease: [0.23, 1, .32, 1] }} className="marketing-dashboard-stage marketing-dashboard-stage-reference">
    <div className="marketing-dashboard-aura" aria-hidden="true" />
    <span className="marketing-reference-ring marketing-reference-ring-one" aria-hidden="true" />
    <span className="marketing-reference-ring marketing-reference-ring-two" aria-hidden="true" />
    <span className="marketing-reference-drawn-line" aria-hidden="true" />
    <div className="marketing-dashboard-browser">
      <div className="marketing-browser-bar"><span /><span /><span /><p>{t("Maintainr · Property Manager workspace", "Maintainr · مساحة عمل مدير العقار")}</p><div className="marketing-browser-ready"><i />{t("Workspace ready", "مساحة العمل جاهزة")}</div></div>
      <img src={visual.dashboard} alt={t("Maintainr property manager workspace showing open tickets, in-progress work, resolved work, and a next-focus card", "مساحة عمل مدير العقار في Maintainr تعرض التذاكر المفتوحة والعمل الجاري والعمل المنجز وبطاقة التركيز التالية")} className="marketing-dashboard-image" />
      <div className="marketing-status-chip"><CheckCircle2 size={15} />{t("Every update stays with the request", "يبقى كل تحديث مع الطلب")}</div>
      <div className="marketing-reference-float-card"><BellRing size={16} /><span><b>{t("Next step visible", "الخطوة التالية مرئية")}</b><small>{t("One connected maintenance record", "سجل صيانة متصل واحد")}</small></span></div>
    </div>
    <div className="marketing-mobile-proof"><img src={visual.mobileDashboard} alt={t("Maintainr mobile workspace", "مساحة عمل Maintainr على الهاتف")} /><span><Smartphone size={14} />{t("Field-ready", "جاهز للميدان")}</span></div>
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
        <Reveal className="marketing-hero-copy marketing-hero-copy-centered"><Eyebrow>{t("PROPERTY MAINTENANCE, MADE OPERABLE", "صيانة العقارات، أصبحت قابلة للتشغيل")}</Eyebrow><h1>{t("From the first report to the final proof, maintenance moves with", "من أول بلاغ إلى آخر إثبات، تتحرك الصيانة بوضوح")}</h1><em>{t("clarity.", "وثقة.")}</em><p>{t("Maintainr gives every property team one connected workflow for reporting, assigning, progressing, verifying, and reviewing the work that keeps buildings moving.", "يوفر Maintainr لكل فريق عقارات مسار عمل متصلاً واحداً للإبلاغ والتعيين والتقدم والتحقق ومراجعة العمل الذي يحافظ على حركة المباني.")}</p><div className="marketing-hero-actions"><Primary href="/quote"><Quote size={17} />{t("Plan your workflow", "خطط لمسار عملك")}</Primary><Secondary href="#how-it-works">{t("See the workflow", "شاهد مسار العمل")}<ArrowRight size={17} /></Secondary></div><div className="marketing-hero-proof"><span><CheckCircle2 size={15} />{t("One connected record", "سجل متصل واحد")}</span><span><BellRing size={15} />{t("Visible next steps", "خطوات تالية مرئية")}</span><span><Languages size={15} />{t("English + العربية", "العربية + English")}</span></div></Reveal>
        <DashboardFrame t={t} />
      </div>
    </section>

    <section className="marketing-outcome-bar"><div className="marketing-container marketing-outcome-grid"><div><Eyebrow>{t("ONE OPERATING RECORD", "سجل تشغيلي واحد")}</Eyebrow><p>{t("From report to verified result", "من البلاغ إلى نتيجة موثقة")}</p></div><div><Eyebrow>{t("FOUR ROLE VIEWS", "أربعة عروض حسب الدور")}</Eyebrow><p>{t("Focus for every person involved", "تركيز لكل شخص مشارك")}</p></div><div><Eyebrow>{t("ONE CLEAR RHYTHM", "إيقاع واضح واحد")}</Eyebrow><p>{t("Less chasing. Better follow-through.", "متابعة أقل. إنجاز أفضل.")}</p></div></div></section>

    <section className="marketing-section marketing-problem-section"><div className="marketing-container"><Reveal className="marketing-section-intro"><Eyebrow>{t("WHEN WORK GETS LOST", "عندما يضيع العمل")}</Eyebrow><h2>{t("Maintenance should not depend on who remembers the last message.", "لا ينبغي أن تعتمد الصيانة على من يتذكر الرسالة الأخيرة.")}</h2><p>{t("Maintainr brings the detail, responsibility, updates, and evidence into a workflow people can follow without rebuilding context at every handoff.", "يجمع Maintainr التفاصيل والمسؤولية والتحديثات والإثبات في مسار عمل يمكن للناس اتباعه من دون إعادة بناء السياق عند كل تسليم.")}</p></Reveal><div className="marketing-problem-grid">{friction.map(({ icon: Icon, number, title, body }, index) => <Reveal key={title} delay={index * .08}><article className="marketing-problem-card"><span className="marketing-card-icon"><Icon size={21} /></span><p className="marketing-card-number">{number}</p><h3>{title}</h3><p>{body}</p></article></Reveal>)}</div></div></section>

    <section id="how-it-works" className="marketing-section marketing-workflow-section"><div className="marketing-container"><Reveal className="marketing-section-intro marketing-section-intro-center"><Eyebrow>{t("HOW MAINTAINR GUIDES THE WORK", "كيف يوجّه Maintainr العمل")}</Eyebrow><h2>{t("A practical workflow for every maintenance request.", "مسار عمل عملي لكل طلب صيانة.")}</h2><p>{t("Each stage answers the questions that slow teams down: what happened, who owns it, what is next, and what proves it is complete?", "تجيب كل مرحلة عن الأسئلة التي تبطئ الفرق: ماذا حدث، من المسؤول، ما الخطوة التالية، وما الذي يثبت اكتماله؟")}</p></Reveal><div className="marketing-workflow-grid">{guide.map(({ icon: Icon, step, title, body }, index) => <Reveal key={title} delay={index * .06}><article className="marketing-workflow-card"><p>{step}</p><span><Icon size={22} /></span><h3>{title}</h3><p>{body}</p></article></Reveal>)}</div></div></section>

    <div className="marketing-container marketing-stories">
      <WorkflowVisual image={visual.report} alt={t("A resident using a phone to report a maintenance issue while a technician approaches", "ساكنة تستخدم الهاتف للإبلاغ عن مشكلة صيانة بينما يقترب فني")} eyebrow={t("START WITH A BETTER REPORT", "ابدأ ببلاغ أفضل")} title={t("Give the next person the context they need before the work begins.", "امنح الشخص التالي السياق الذي يحتاجه قبل أن يبدأ العمل.")} body={t("A well-structured request makes the first handoff easier. The people involved can see the issue, priority, access detail, and next action in the same place.", "يجعل الطلب المنظم أول تسليم أسهل. يمكن للأشخاص المشاركين رؤية المشكلة والأولوية وتفاصيل الوصول والإجراء التالي في المكان نفسه.")} points={[{ icon: ClipboardCheck, title: t("Capture the essentials", "سجّل الأساسيات"), body: t("Issue detail, priority, photos, and access notes travel together.", "تنتقل تفاصيل المشكلة والأولوية والصور وملاحظات الوصول معاً.") }, { icon: Route, title: t("Make ownership visible", "اجعل المسؤولية مرئية"), body: t("Everyone sees who is responsible for the next step.", "يرى الجميع من المسؤول عن الخطوة التالية.") }]} t={t} />
      <WorkflowVisual reverse image={visual.evidence} alt={t("A technician documenting a completed repair while a property manager reviews the result", "فني يوثق إصلاحاً منجزاً بينما يراجع مدير العقار النتيجة")} eyebrow={t("FINISH WITH CONFIDENCE", "أنهِ العمل بثقة")} title={t("Keep the proof connected to the work it belongs to.", "أبقِ الإثبات متصلاً بالعمل الذي ينتمي إليه.")} body={t("Updates from the field should not disappear into a separate message thread. Maintainr keeps progress, completion notes, and supporting evidence with the original request.", "لا ينبغي أن تختفي تحديثات الميدان في سلسلة رسائل منفصلة. يحافظ Maintainr على التقدم وملاحظات الإنجاز والإثباتات الداعمة مع الطلب الأصلي.")} points={[{ icon: Wrench, title: t("Record progress in the field", "سجّل التقدم في الميدان"), body: t("Technicians update the same request managers are coordinating.", "يحدّث الفنيون الطلب نفسه الذي ينسقه المديرون.") }, { icon: FileCheck2, title: t("Retain a trusted history", "احتفظ بسجل موثوق"), body: t("The result stays ready for the next review, follow-up, or audit.", "تبقى النتيجة جاهزة للمراجعة أو المتابعة أو التدقيق التالي.") }]} t={t} />
    </div>

    <section className="marketing-roles-section"><div className="marketing-container marketing-roles-layout"><Reveal direction="left" className="marketing-roles-copy"><Eyebrow>{t("ONE RECORD. FOUR FOCUSED VIEWS.", "سجل واحد. أربعة عروض مركزة.")}</Eyebrow><h2>{t("The system stays connected while each person sees a clearer next step.", "يبقى النظام متصلاً بينما يرى كل شخص خطوة تالية أوضح.")}</h2><p>{t("Managers, residents, technicians, and owners work from the same source of truth without needing the same screen or the same level of operational detail.", "يعمل المديرون والسكان والفنيون والملاك من المصدر نفسه للحقيقة من دون الحاجة إلى الشاشة نفسها أو المستوى نفسه من التفاصيل التشغيلية.")}</p><a href="/solutions" className="marketing-inline-link">{t("Explore role experiences", "استكشف تجارب الأدوار")}<ArrowRight size={16} /></a></Reveal><Reveal direction="right" delay={.08} className="marketing-roles-image-wrap"><img src={visual.coordination} alt={t("A property manager, technician, and resident coordinated through one maintenance workflow", "مدير عقار وفني وساكن منسقون عبر مسار صيانة واحد")} className="marketing-roles-image" /></Reveal></div><div className="marketing-container marketing-role-grid">{roles.map(({ icon: Icon, title, body }, index) => <Reveal key={title} delay={index * .06}><article className="marketing-role-card"><span><Icon size={20} /></span><h3>{title}</h3><p>{body}</p></article></Reveal>)}</div></section>

    <section className="marketing-platform-section"><div className="marketing-container marketing-platform-layout"><Reveal direction="left" className="marketing-platform-copy"><Eyebrow inverse>{t("A SHARED VIEW OF THE DAY", "عرض مشترك لليوم")}</Eyebrow><h2>{t("See the work, the priority, and the next move—without chasing updates.", "شاهد العمل والأولوية والخطوة التالية من دون ملاحقة التحديثات.")}</h2><p>{t("The manager workspace turns a busy portfolio into a practical operating view. Tickets, reminders, conversations, and next actions are easier to find when the record stays connected.", "تحول مساحة عمل المدير محفظة مشغولة إلى عرض تشغيلي عملي. تصبح التذاكر والتذكيرات والمحادثات والإجراءات التالية أسهل في العثور عليها عندما يبقى السجل متصلاً.")}</p><div className="marketing-platform-points"><div><CheckCircle2 size={18} /><span>{t("Priorities stay visible", "تبقى الأولويات مرئية")}</span></div><div><ShieldCheck size={18} /><span>{t("Evidence stays attached", "يبقى الإثبات مرفقاً")}</span></div></div><Primary href="/experience">{t("Explore the working dashboard", "استكشف لوحة التحكم العملية")}<ArrowRight size={16} /></Primary></Reveal><Reveal direction="right" delay={.1} className="marketing-platform-screen"><div className="marketing-platform-screen-shell"><img src={visual.dashboard} alt={t("Maintainr manager dashboard", "لوحة تحكم مدير Maintainr")} /><div><BellRing size={16} />{t("Follow-up stays visible", "تبقى المتابعة مرئية")}</div></div></Reveal></div></section>

    <section className="marketing-section marketing-adoption-section"><div className="marketing-container"><Reveal className="marketing-section-intro"><Eyebrow>{t("A CALMER WAY TO START", "طريقة أكثر هدوءاً للبدء")}</Eyebrow><h2>{t("Start from the workflow you already know.", "ابدأ من مسار العمل الذي تعرفه بالفعل.")}</h2><p>{t("A useful operating system should fit the people, properties, and maintenance detail that matter to your team—not force a generic process on top of the work.", "يجب أن يتناسب نظام التشغيل المفيد مع الأشخاص والعقارات وتفاصيل الصيانة المهمة لفريقك، لا أن يفرض عملية عامة فوق العمل.")}</p></Reveal><div className="marketing-adoption-grid">{[["01", t("Map your current process", "ارسم عمليتك الحالية"), t("Clarify how a request starts, moves, and closes today.", "وضّح كيف يبدأ الطلب ويتحرك وينغلق اليوم.")], ["02", t("Shape the workspace", "شكّل مساحة العمل"), t("Match roles, properties, units, and operating responsibilities.", "طابق الأدوار والعقارات والوحدات ومسؤوليات التشغيل.")], ["03", t("Build the rhythm", "ابنِ الإيقاع"), t("Use one connected record to make follow-up more dependable.", "استخدم سجلاً متصلاً واحداً لجعل المتابعة أكثر موثوقية.")]].map(([step, title, body], index) => <Reveal key={step} delay={index * .07}><article><p>{step}</p><h3>{title}</h3><p>{body}</p></article></Reveal>)}</div></div></section>

    <section className="marketing-faq-section"><div className="marketing-container marketing-faq-wrap"><Reveal className="marketing-section-intro marketing-section-intro-center"><Eyebrow>{t("PRACTICAL QUESTIONS", "أسئلة عملية")}</Eyebrow><h2>{t("Answers for teams planning their next operating step.", "إجابات للفرق التي تخطط لخطوتها التشغيلية التالية.")}</h2></Reveal><div className="marketing-faq-list">{questions.map(([question, answer], index) => <Reveal key={question} delay={index * .05}><details><summary>{question}<ArrowRight size={18} /></summary><p>{answer}</p></details></Reveal>)}</div></div></section>

    <section className="marketing-final-cta"><div className="marketing-container"><Reveal><div><Eyebrow inverse>{t("READY TO MAKE THE WORK EASIER TO RUN?", "هل أنت جاهز لجعل العمل أسهل في الإدارة؟")}</Eyebrow><h2>{t("Bring a clearer operating rhythm to every property you manage.", "اجلب إيقاعاً تشغيلياً أوضح لكل عقار تديره.")}</h2><p>{t("Tell us how maintenance moves through your portfolio. We will help you shape a workflow that keeps every handoff connected.", "أخبرنا كيف تتحرك الصيانة عبر محفظتك. سنساعدك على تشكيل مسار عمل يبقي كل تسليم متصلاً.")}</p></div><Primary href="/quote"><Quote size={17} />{t("Plan your workflow", "خطط لمسار عملك")}</Primary></Reveal></div></section>
  </main>;
}
