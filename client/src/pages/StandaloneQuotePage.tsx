import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, MessageSquareText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { quoteMessage, saasDestination } from "../lib/commercialRouting";

const initialForm = { name: "", organizationName: "", email: "", phone: "", portfolioCategory: "RESIDENTIAL", portfolioSizeRange: "1-10", message: "" };

export function StandaloneQuotePage() {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const saasUrl = import.meta.env.VITE_SAAS_APP_URL;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, message: quoteMessage(form.message) };
      const response = await fetch("/.netlify/functions/quote-request", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : t("We could not send your request. Please try again.", "تعذر إرسال طلبك. يرجى المحاولة مرة أخرى."));
      toast.success(t("Your consultation request has been received.", "تم استلام طلب الاستشارة الخاص بك."));
      setForm(initialForm);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("We could not send your request.", "تعذر إرسال طلبك."));
    } finally {
      setSubmitting(false);
    }
  };

  const label = "mb-2 block text-sm font-medium text-slate-700";
  const control = "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15";

  return <section className="bg-[#f5f7fb] px-5 pb-28 pt-10 text-[#172033] lg:px-8 lg:pt-16">
    <div className="mx-auto max-w-7xl">
      <div className="max-w-3xl"><p className="text-xs font-bold tracking-[.16em] text-teal-700">{t("PLAN A CLEARER OPERATION", "خطط لعملية أوضح")}</p><h1 className="mt-4 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">{t("Tell us how your property operation needs to move faster.", "أخبرنا كيف تحتاج عملياتك العقارية إلى التحرك بشكل أسرع.")}</h1><p className="mt-5 text-lg leading-8 text-slate-600">{t("Share your portfolio and operational goals. We will use this enquiry to understand the workflows, roles, and rollout considerations that matter to your team.", "شارك محفظتك وأهدافك التشغيلية. سنستخدم هذا الاستفسار لفهم مسارات العمل والأدوار واعتبارات الإطلاق التي تهم فريقك.")}</p></div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_.75fr]">
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,.06)] sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><label><span className={label}>{t("Your name", "اسمك")}</span><input required minLength={2} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} className={control} /></label><label><span className={label}>{t("Company name", "اسم الشركة")}</span><input required minLength={2} value={form.organizationName} onChange={event => setForm({ ...form, organizationName: event.target.value })} className={control} /></label><label><span className={label}>{t("Work email", "بريد العمل")}</span><input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} className={control} /></label><label><span className={label}>{t("Phone (optional)", "الهاتف (اختياري)")}</span><input value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} className={control} /></label><label><span className={label}>{t("Portfolio type", "نوع المحفظة")}</span><select value={form.portfolioCategory} onChange={event => setForm({ ...form, portfolioCategory: event.target.value })} className={control}><option value="RESIDENTIAL">{t("Residential", "سكني")}</option><option value="MULTI_FAMILY">{t("Multi-family", "متعدد الوحدات")}</option><option value="COMMERCIAL">{t("Commercial", "تجاري")}</option><option value="MIXED_USE">{t("Mixed-use", "مختلط")}</option><option value="OTHER">{t("Other", "أخرى")}</option></select></label><label><span className={label}>{t("Portfolio size", "حجم المحفظة")}</span><select value={form.portfolioSizeRange} onChange={event => setForm({ ...form, portfolioSizeRange: event.target.value })} className={control}>{["1-10", "11-50", "51-250", "251-1000", "1000+"].map(value => <option value={value} key={value}>{value}</option>)}</select></label></div><label className="mt-5 block"><span className={label}>{t("What would you like to improve? (optional)", "ما الذي ترغب في تحسينه؟ (اختياري)")}</span><textarea value={form.message} maxLength={2000} onChange={event => setForm({ ...form, message: event.target.value })} rows={5} className={control} /></label><button disabled={submitting} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-5 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:opacity-60">{submitting ? t("Sending request…", "جارٍ إرسال الطلب…") : t("Request a consultation", "اطلب استشارة")}<ArrowRight size={16} /></button></form>
        <aside className="h-fit rounded-3xl border border-teal-200 bg-teal-50/70 p-6 sm:p-8"><MessageSquareText size={24} className="text-teal-700" /><h2 className="mt-5 text-2xl font-semibold">{t("A practical next step", "خطوة تالية عملية")}</h2><ol className="mt-5 space-y-4 text-sm leading-6 text-slate-600">{[t("Your request is stored securely for the Maintainr team to review.", "يُحفظ طلبك بأمان ليقوم فريق Maintainr بمراجعته."), t("The conversation is shaped around your portfolio, operating roles, and maintenance workflows.", "تتشكل المحادثة حول محفظتك وأدوارك التشغيلية ومسارات صيانة ممتلكاتك."), t("When you are ready, your organization can create a private Maintainr workspace with its own identity and access controls.", "عندما تكون جاهزاً، يمكن لمؤسستك إنشاء مساحة عمل Maintainr خاصة بهويتها وضوابط الوصول الخاصة بها.")].map((line, index) => <li key={line} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-teal-700 text-xs font-bold text-white">{index + 1}</span>{line}</li>)}</ol><div className="mt-7"><a href={saasDestination(saasUrl, "/create-workspace")} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-teal-300 bg-white px-4 text-sm font-semibold text-teal-800 transition hover:bg-teal-50"><CheckCircle2 size={16} />{t("Create a private workspace", "أنشئ مساحة عمل خاصة")}</a></div><div className="mt-7 rounded-xl border border-teal-200 bg-white/70 p-3 text-xs leading-5 text-slate-600"><ShieldCheck size={16} className="mb-2 text-teal-700" />{t("This form is for commercial consultation only. It does not create a workspace or access any customer records.", "هذا النموذج مخصص للاستشارة التجارية فقط. ولا ينشئ مساحة عمل ولا يصل إلى أي سجلات للعملاء.")}</div></aside>
      </div>
    </div>
  </section>;
}
