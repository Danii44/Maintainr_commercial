import type { Handler } from "@netlify/functions";
import { Pool } from "pg";

const allowedCategories = new Set(["MULTI_FAMILY", "RESIDENTIAL", "COMMERCIAL", "MIXED_USE", "OTHER"]);
const allowedSizes = new Set(["1-10", "11-50", "51-250", "251-1000", "1000+"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(statusCode: number, body: Record<string, unknown>) {
  return { statusCode, headers: { "content-type": "application/json", "cache-control": "no-store" }, body: JSON.stringify(body) };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  if (!process.env.COMMERCIAL_DATABASE_URL) return json(503, { error: "Quotation requests are not configured yet." });
  let input: Record<string, unknown>;
  try { input = JSON.parse(event.body ?? "{}"); } catch { return json(400, { error: "Invalid request payload" }); }
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const organizationName = typeof input.organizationName === "string" ? input.organizationName.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim().slice(0, 32) : "";
  const portfolioCategory = typeof input.portfolioCategory === "string" ? input.portfolioCategory : "";
  const portfolioSizeRange = typeof input.portfolioSizeRange === "string" ? input.portfolioSizeRange : "";
  const message = typeof input.message === "string" ? input.message.trim().slice(0, 2000) : "";
  if (name.length < 2 || name.length > 255 || organizationName.length < 2 || organizationName.length > 255 || !emailPattern.test(email) || !allowedCategories.has(portfolioCategory) || !allowedSizes.has(portfolioSizeRange)) return json(400, { error: "Please complete the required quotation details." });
  const pool = new Pool({ connectionString: process.env.COMMERCIAL_DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 2, connectionTimeoutMillis: 8_000 });
  try {
    const duplicate = await pool.query("select id from quote_requests where email = $1 and created_at > now() - interval '15 minutes' limit 1", [email]);
    if (duplicate.rowCount) return json(429, { error: "A quotation request was recently received from this email. Please wait a few minutes." });
    await pool.query("insert into quote_requests (name, organization_name, email, phone, portfolio_category, portfolio_size_range, message) values ($1, $2, $3, $4, $5, $6, $7)", [name, organizationName, email, phone || null, portfolioCategory, portfolioSizeRange, message || null]);
    return json(201, { success: true });
  } catch (error) {
    console.error("[quote-request] failed", error);
    return json(500, { error: "Unable to save quotation request." });
  } finally { await pool.end().catch(() => undefined); }
};
