import { FormEvent, useState } from "react";
import { ArrowRight, MessageSquareText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";

const initialForm = { name: "", organizationName: "", email: "", phone: "", portfolioCategory: "RESIDENTIAL", portfolioSizeRange: "1-10", message: "" };

export function StandaloneQuotePage() {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/.netlify/functions/quote-request", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : t("We could not send your quotation request. Please try again.", "تعذر إرسال طلب عرض السعر. يرجى المحاولة مرة أخرى."));
      toast.success(t("Your quotation request has been received.", "تم استلام طلب عرض السعر الخاص بك."));
      setForm(initialForm);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("We could not send your quotation request.", "تعذر إرسال طلب عرض السعر الخاص بك."));
    } finally {
      setSubmitting(false);
    }
  };
  const label = "mb-2 block text-sm font-medium text-slate-200";
  const control = "w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/50";
  return <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-4 lg:grid-cols-[1fr_.75fr] lg:px-8"><form onSubmit={submit} className="rounded-3xl border border-white/[.08] bg-[#0e111d] p-6 sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><label><span className={label}>{t("Your name", "اسمك")}</span><input required minLength={2} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} className={control}/></label><label><span className={label}>{t("Company name", "اسم الشركة")}</span><input required minLength={2} value={form.organizationName} onChange={event => setForm({ ...form, organizationName: event.target.value })} className={control}/></label><label><span className={label}>{t("Work email", "بريد العمل")}</span><input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} className={control}/></label><label><span className={label}>{t("Phone (optional)", "الهاتف (اختياري)")}</span><input value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} className={control}/></label><label><span className={label}>{t("Portfolio type", "نوع المحفظة")}</span><select value={form.portfolioCategory} onChange={event => setForm({ ...form, portfolioCategory: event.target.value })} className={control}><option value="RESIDENTIAL">{t("Residential", "سكني")}</option><option value="MULTI_FAMILY">{t("Multi-family", "متعدد الوحدات")}</option><option value="COMMERCIAL">{t("Commercial", "تجاري")}</option><option value="MIXED_USE">{t("Mixed-use", "مختلط")}</option><option value="OTHER">{t("Other", "أخرى")}</option></select></label><label><span className={label}>{t("Portfolio size", "حجم المحفظة")}</span><select value={form.portfolioSizeRange} onChange={event => setForm({ ...form, portfolioSizeRange: event.target.value })} className={control}>{["1-10", "11-50", "51-250", "251-1000", "1000+"].map(value => <option value={value} key={value}>{value}</option>)}</select></label></div><label className="mt-5 block"><span className={label}>{t("What would you like to improve? (optional)", "ما الذي ترغب في تحسينه؟ (اختياري)")}</span><textarea value={form.message} maxLength={2000} onChange={event => setForm({ ...form, message: event.target.value })} rows={5} className={control}/></label><button disabled={submitting} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-400 px-5 text-sm font-semibold text-[#090b12] transition hover:bg-violet-300 disabled:opacity-60">{submitting ? t("Sending request…", "جارٍ إرسال الطلب…") : t("Request quotation", "اطلب عرض السعر")}<ArrowRight size={16}/></button></form><aside className="h-fit rounded-3xl border border-cyan-300/15 bg-cyan-300/[.05] p-6 sm:p-8"><MessageSquareText size={24} className="text-cyan-200"/><h2 className="mt-5 text-2xl font-semibold">{t("What happens next?", "ماذا يحدث بعد ذلك؟")}</h2><ol className="mt-5 space-y-4 text-sm leading-6 text-slate-300">{[t("Your enquiry is saved in the commercial site’s separate quotation database.", "يُحفظ استفسارك في قاعدة بيانات عروض الأسعار المنفصلة للموقع التجاري."), t("The evaluation conversation is based on your portfolio and intended operating flow.", "تعتمد محادثة التقييم على محفظتك ومسار التشغيل المقصود."), t("You can still explore the fictional demo or create a real SaaS workspace separately.", "لا يزال بإمكانك استكشاف العرض الخيالي أو إنشاء مساحة عمل SaaS حقيقية بشكل منفصل.")].map((line, index) => <li key={line} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-cyan-300 text-xs font-bold text-[#07101a]">{index + 1}</span>{line}</li>)}</ol><div className="mt-7 rounded-xl border border-white/[.08] bg-black/15 p-3 text-xs leading-5 text-slate-400"><ShieldCheck size={16} className="mb-2 text-cyan-200"/>{t("This form does not create a customer workspace and it cannot access any SaaS organization records.", "هذا النموذج لا ينشئ مساحة عمل للعميل ولا يمكنه الوصول إلى أي سجلات لمؤسسة SaaS.")}</div></aside></section>;
}
