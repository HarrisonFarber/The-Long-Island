import crypto from "crypto";
import { siteUrl } from "./notify";

/**
 * Stripe adapter (plain HTTP, no SDK). With STRIPE_SECRET_KEY set, invoices get
 * a real Checkout session; without it the pay page falls back to a demo
 * "mark as paid" flow so the pipeline is testable end to end.
 */

export const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutUrl(invoice, lead) {
  if (!stripeConfigured()) return "";

  const params = new URLSearchParams({
    mode: "payment",
    success_url: `${siteUrl()}/pay/${invoice.id}?paid=1`,
    cancel_url: `${siteUrl()}/pay/${invoice.id}`,
    // Attach the invoice id to both the session and its payment intent so the
    // webhook can resolve exactly which invoice to mark paid.
    "metadata[invoiceId]": invoice.id,
    "payment_intent_data[metadata][invoiceId]": invoice.id,
  });
  // Stripe rejects a blank customer_email — only send it when we actually have one.
  if (lead?.email) {
    params.set("customer_email", lead.email);
  }
  invoice.lineItems.forEach((item, index) => {
    params.set(`line_items[${index}][quantity]`, "1");
    params.set(`line_items[${index}][price_data][currency]`, "usd");
    params.set(`line_items[${index}][price_data][unit_amount]`, String(Math.round(item.amount * 100)));
    params.set(`line_items[${index}][price_data][product_data][name]`, item.description);
  });

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`Stripe error ${res.status}: ${await res.text()}`);
  const session = await res.json();
  return session.url;
}

export function verifyStripeSignature(rawBody, signatureHeader) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((pair) => pair.split("=").map((s) => s.trim()))
  );
  if (!parts.t || !parts.v1) return false;

  // Reject events older than 5 minutes (replay protection).
  if (Math.abs(Date.now() / 1000 - Number(parts.t)) > 300) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${parts.t}.${rawBody}`)
    .digest("hex");
  return (
    parts.v1.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(parts.v1), Buffer.from(expected))
  );
}
