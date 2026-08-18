import { FormEvent, useState } from "react";
import { ArrowRight, CalendarClock, CheckCircle2, MessageSquareText, Play, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { evaluationIntentFromSearch, quoteMessageForIntent, saasDestination } from "../lib/commercialRouting";

const initialForm = { name: "", organizationName: "", email: "", phone: "", portfolioCategory: "RESIDENTIAL", portfolioSizeRange: "1-10", message: "" };

export function StandaloneQuotePage() {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const intent = evaluationIntentFromSearch(typeof window === "undefined" ? "" : window.location.search);
  const isDemoRequest = intent === "demo";
  const saasUrl = import.meta.env.VITE_SAAS_APP_URL;
  const intentTitle = isDemoRequest ? t("Request a guided demo", "اطلب عرضاً توضيحياً") : t("Request a tailored quotation", "اطلب عرض سعر مناسباً");
  const intentBody = isDemoRequest
    ? t("Tell us about your portfolio and the role workflows you want to review. We will use this request only to plan a relevant product walkthrough.", "أخبرنا عن محفظتك ومسارات الأدوار التي تريد مراجعتها. سنستخدم هذا الطلب فقط لتخطيط جولة منتج مناسبة.")
    : t("Tell us how your property operation works so a commercial evaluation can reflect your portfolio and intended operating model.", "أخبرنا كيف تعمل عملياتك العقارية ليعكس التقييم التجاري محفظتك ونموذج التشغيل المقصود.");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, message: quoteMessageForIntent(intent, form.message) };
      const response = await fetch("/.netlify/functions/quote-request", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : t("We could not send your request. Please try again.", "تعذر إرسال طلبك. يرجى المحاولة مرة أخرى."));
      toast.success(isDemoRequest ? t("Your guided-demo request has been received.", "تم استلام طلب العرض التوضيحي الخاص بك.") : t("Your quotation request has been received.", "تم استلام طلب عرض السعر الخاص بك."));
      setForm(initialForm);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("We could not send your request.", "تعذر إرسال طلبك."));
    } finally {
      setSubmitting(false);
    }
  };

  const label = "mb-2 block text-sm font-medium text-slate-200";
  const control = "w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/50";
  const intentCard = (active: boolean) => `group rounded-2xl border p-4 transition ${active ? "border-cyan-300/40 bg-cyan-300/[.08]" : "border-white/[.08] bg-white/[.025] hover:border-white/20"}`;

  return <section className="mx-auto max-w-7xl px-5 pb-20 pt-10 lg:px-8 lg:pt-16">
    <div className="max-w-3xl">
      <p className="text-xs font-bold tracking-[.16em] text-cyan-200">{t("PLAN YOUR EVALUATION", "خطط لتقييمك")}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">{intentTitle}</h1>
      <p className="mt-5 text-lg leading-8 text-slate-300">{intentBody}</p>
    </div>
    <div className="mt-9 grid max-w-4xl gap-3 md:grid-cols-2">
      <a href="/quote?intent=demo" className={intentCard(isDemoRequest)}>
        <CalendarClock size={19} className="text-cyan-200"/>
        <strong className="mt-4 block">{t("Request a guided demo", "اطلب عرضاً توضيحياً")}</strong>
        <span className="mt-1 block text-sm leading-6 text-slate-400">{t("Discuss the roles, workflows, and operating questions that matter to your team.", "ناقش الأدوار ومسارات العمل والأسئلة التشغيلية التي تهم فريقك.")}</span>
      </a>
      <a href="/quote?intent=quote" className={intentCard(!isDemoRequest)}>
        <MessageSquareText size={19} className="text-violet-200"/>
        <strong className="mt-4 block">{t("Request a quotation", "اطلب عرض سعر")}</strong>
        <span className="mt-1 block text-sm leading-6 text-slate-400">{t("Share your portfolio scope and intended rollout for a commercial evaluation.", "شارك نطاق محفظتك وخطة الإطلاق المقصودة لتقييم تجاري.")}</span>
      </a>
    </div>
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_.75fr]">
      <form onSubmit={submit} className="rounded-3xl border border-white/[.08] bg-[#0e111d] p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label><span className={label}>{t("Your name", "اسمك")}</span><input required minLength={2} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} className={control}/></label>
          <label><span className={label}>{t("Company name", "اسم الشركة")}</span><input required minLength={2} value={form.organizationName} onChange={event => setForm({ ...form, organizationName: event.target.value })} className={control}/></label>
          <label><span className={label}>{t("Work email", "بريد العمل")}</span><input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} className={control}/></label>
          <label><span className={label}>{t("Phone (optional)", "الهاتف (اختياري)")}</span><input value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} className={control}/></label>
          <label><span className={label}>{t("Portfolio type", "نوع المحفظة")}</span><select value={form.portfolioCategory} onChange={event => setForm({ ...form, portfolioCategory: event.target.value })} className={control}><option value="RESIDENTIAL">{t("Residential", "سكني")}</option><option value="MULTI_FAMILY">{t("Multi-family", "متعدد الوحدات")}</option><option value="COMMERCIAL">{t("Commercial", "تجاري")}</option><option value="MIXED_USE">{t("Mixed-use", "مختلط")}</option><option value="OTHER">{t("Other", "أخرى")}</option></select></label>
          <label><span className={label}>{t("Portfolio size", "حجم المحفظة")}</span><select value={form.portfolioSizeRange} onChange={event => setForm({ ...form, portfolioSizeRange: event.target.value })} className={control}>{["1-10", "11-50", "51-250", "251-1000", "1000+"].map(value => <option value={value} key={value}>{value}</option>)}</select></label>
        </div>
        <label className="mt-5 block"><span className={label}>{isDemoRequest ? t("What should we show in the guided demo? (optional)", "ما الذي يجب أن نعرضه في العرض التوضيحي؟ (اختياري)") : t("What would you like to improve? (optional)", "ما الذي ترغب في تحسينه؟ (اختياري)")}</span><textarea value={form.message} maxLength={2000} onChange={event => setForm({ ...form, message: event.target.value })} rows={5} className={control}/></label>
        <button disabled={submitting} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-400 px-5 text-sm font-semibold text-[#090b12] transition hover:bg-violet-300 disabled:opacity-60">{submitting ? t("Sending request…", "جارٍ إرسال الطلب…") : isDemoRequest ? t("Request guided demo", "اطلب عرضاً توضيحياً") : t("Request quotation", "اطلب عرض السعر")}<ArrowRight size={16}/></button>
      </form>
      <aside className="h-fit rounded-3xl border border-cyan-300/15 bg-cyan-300/[.05] p-6 sm:p-8">
        <MessageSquareText size={24} className="text-cyan-200"/>
        <h2 className="mt-5 text-2xl font-semibold">{t("A clear next step", "خطوة تالية واضحة")}</h2>
        <ol className="mt-5 space-y-4 text-sm leading-6 text-slate-300">{[
          isDemoRequest ? t("Your guided-demo request is saved in the commercial site’s separate quotation database.", "يُحفظ طلب العرض التوضيحي في قاعدة بيانات عروض الأسعار المنفصلة للموقع التجاري.") : t("Your quotation request is saved in the commercial site’s separate quotation database.", "يُحفظ طلب عرض السعر في قاعدة بيانات عروض الأسعار المنفصلة للموقع التجاري."),
          t("The conversation can be shaped around your portfolio, operating roles, and intended workflow.", "يمكن تشكيل المحادثة حول محفظتك والأدوار التشغيلية ومسار العمل المقصود."),
          t("You can explore the fictional demo now or start a real private workspace separately.", "يمكنك استكشاف العرض الخيالي الآن أو بدء مساحة عمل خاصة حقيقية بشكل منفصل.")
        ].map((line, index) => <li key={line} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-cyan-300 text-xs font-bold text-[#07101a]">{index + 1}</span>{line}</li>)}</ol>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><a href="/demo" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-semibold text-white transition hover:bg-white/[.06]"><Play size={16}/>{t("Explore demo now", "استكشف العرض الآن")}</a><a href={saasDestination(saasUrl, "/create-workspace")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 text-sm font-semibold text-[#07101a] transition hover:bg-cyan-200"><CheckCircle2 size={16}/>{t("Create private workspace", "أنشئ مساحة عمل خاصة")}</a></div>
        <div className="mt-7 rounded-xl border border-white/[.08] bg-black/15 p-3 text-xs leading-5 text-slate-400"><ShieldCheck size={16} className="mb-2 text-cyan-200"/>{t("This form does not create a customer workspace and it cannot access any SaaS organization records.", "هذا النموذج لا ينشئ مساحة عمل للعميل ولا يمكنه الوصول إلى أي سجلات لمؤسسة SaaS.")}</div>
      </aside>
    </div>
  </section>;
}
