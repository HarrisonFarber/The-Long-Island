import { NextResponse } from "next/server";
import { getRecord, updateRecord } from "../../../../lib/server/store";
import { verifyStripeSignature } from "../../../../lib/server/stripe";
import { notifyPaid } from "../../../../lib/server/notify";

// Webhook handling writes payment status to the persistent store — must run on
// the Node runtime (crypto signature check) and never be cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!verifyStripeSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data?.object;
      const invoiceId = session?.metadata?.invoiceId;
      // Only settle a session that actually collected payment (guards against
      // async/delayed payment methods that complete but aren't paid yet).
      const isPaid = session?.payment_status === "paid";
      const invoice = invoiceId && isPaid ? await getRecord("invoices", invoiceId) : null;

      // Idempotent: a replayed event finds the invoice already "paid" and no-ops.
      if (invoice && invoice.status !== "paid") {
        const paid = await updateRecord("invoices", invoiceId, {
          status: "paid",
          paidAt: new Date().toISOString(),
          paymentMethod: "stripe",
        });
        const lead = await updateRecord("leads", invoice.leadId, { status: "paid" });
        if (lead) {
          await notifyPaid(lead, paid);
        }
      }
    }
  } catch (error) {
    // Signature already verified, so this is a real processing/storage failure.
    // Return 500 so Stripe retries the event instead of dropping the payment.
    console.error("[stripe/webhook] processing failed:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
