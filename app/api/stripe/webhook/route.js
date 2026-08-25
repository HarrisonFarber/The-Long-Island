import { NextResponse } from "next/server";
import { getRecord, updateRecord } from "../../../../lib/server/store";
import { verifyStripeSignature } from "../../../../lib/server/stripe";
import { notifyPaid } from "../../../../lib/server/notify";

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!verifyStripeSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object;
    const invoiceId = session?.metadata?.invoiceId;
    const invoice = invoiceId ? await getRecord("invoices", invoiceId) : null;

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

  return NextResponse.json({ received: true });
}
