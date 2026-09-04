import { NextResponse } from "next/server";
import { getRecord, insertRecord, updateRecord, newId } from "../../../lib/server/store";
import { isAdmin } from "../../../lib/server/auth";
import { createCheckoutUrl } from "../../../lib/server/stripe";
import { notifyInvoice } from "../../../lib/server/notify";
import { serverErrorResponse } from "../../../lib/server/http";

export async function POST(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  try {
    const lead = await getRecord("leads", String(body.leadId || ""));
    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    const lineItems = (Array.isArray(body.lineItems) ? body.lineItems : [])
      .map((item) => ({
        description: String(item.description || "").trim().slice(0, 200),
        amount: Math.round(Number(item.amount) * 100) / 100,
      }))
      .filter((item) => item.description && Number.isFinite(item.amount) && item.amount > 0);

    if (!lineItems.length) {
      return NextResponse.json({ error: "Add at least one line item." }, { status: 400 });
    }

    const invoice = {
      id: newId("INV"),
      leadId: lead.id,
      lineItems,
      total: Math.round(lineItems.reduce((sum, item) => sum + item.amount, 0) * 100) / 100,
      status: "unpaid",
      paymentLinkUrl: "",
      paidAt: null,
    };

    try {
      invoice.paymentLinkUrl = await createCheckoutUrl(invoice, lead);
    } catch (error) {
      console.error("Stripe checkout creation failed:", error);
      return NextResponse.json(
        { error: "Stripe rejected the checkout session — check your keys." },
        { status: 502 }
      );
    }

    await insertRecord("invoices", invoice);
    await updateRecord("leads", lead.id, { status: "completed", invoiceId: invoice.id });
    await notifyInvoice(lead, invoice);

    return NextResponse.json({ ok: true, invoice });
  } catch (error) {
    return serverErrorResponse(error, "invoices POST");
  }
}
