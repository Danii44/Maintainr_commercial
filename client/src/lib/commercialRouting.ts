export type EvaluationIntent = "demo" | "quote";

const fallbackSaasUrl = "https://maintainr-saas.netlify.app";

export function normalizeSaasAppUrl(value?: string) {
  const candidate = value?.trim().replace(/\/+$/, "");
  return candidate || fallbackSaasUrl;
}

export function saasDestination(baseUrl: string, path: "/sign-in" | "/create-workspace") {
  return `${normalizeSaasAppUrl(baseUrl)}${path}`;
}

export function evaluationIntentFromSearch(search: string): EvaluationIntent {
  return new URLSearchParams(search).get("intent") === "demo" ? "demo" : "quote";
}

export function quoteMessageForIntent(intent: EvaluationIntent, message: string) {
  const prefix = intent === "demo" ? "[GUIDED DEMO REQUEST]" : "[QUOTATION REQUEST]";
  return message.trim() ? `${prefix}\n${message.trim()}` : prefix;
}
