import { NextResponse } from "next/server";
import { getRecord, updateRecord } from "../../../../../lib/server/store";
import { stripeConfigured } from "../../../../../lib/server/stripe";
import { notifyPaid } from "../../../../../lib/server/notify";

/**
 * Demo payment for local/dev use only. Once Stripe is configured this route
 * refuses to run — real payments must come through the webhook.
 */
export async function POST(request, { params }) {
  if (stripeConfigured()) {
    return NextResponse.json({ error: "Demo payments are disabled." }, { status: 403 });
  }

  const { id } = await params;
  const invoice = await getRecord("invoices", id);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }
  if (invoice.status === "paid") {
    return NextResponse.json({ ok: true, invoice });
  }

  const paid = await updateRecord("invoices", id, {
    status: "paid",
    paidAt: new Date().toISOString(),
    paymentMethod: "demo",
  });
  const lead = await updateRecord("leads", invoice.leadId, { status: "paid" });
  if (lead) {
    await notifyPaid(lead, paid);
  }

  return NextResponse.json({ ok: true, invoice: paid });
}
