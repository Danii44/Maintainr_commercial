const fallbackSaasUrl = "https://maintainr-saas.netlify.app";

export function normalizeSaasAppUrl(value?: string) {
  const candidate = value?.trim().replace(/\/+$/, "");
  return candidate || fallbackSaasUrl;
}

export function saasDestination(baseUrl: string, path: "/sign-in" | "/create-workspace") {
  return `${normalizeSaasAppUrl(baseUrl)}${path}`;
}

export function quoteMessage(message: string) {
  const prefix = "[MAINTAINR CONSULTATION REQUEST]";
  return message.trim() ? `${prefix}\n${message.trim()}` : prefix;
}
