import { NextResponse } from "next/server";
import { getRecord, insertRecord, updateRecord, newId } from "../../../../../lib/server/store";
import { isAdmin } from "../../../../../lib/server/auth";
import { notifyQuoteSent } from "../../../../../lib/server/notify";

export async function POST(request, { params }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const amount = Number(body.amount);
  const notes = String(body.notes || "").trim().slice(0, 1000);

  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) {
    return NextResponse.json({ error: "Enter a valid quote amount." }, { status: 400 });
  }

  const lead = await getRecord("leads", id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  const quote = {
    id: newId("Q"),
    leadId: lead.id,
    amount: Math.round(amount * 100) / 100,
    notes,
    sentAt: new Date().toISOString(),
    acceptedAt: null,
  };

  await insertRecord("quotes", quote);
  const updated = await updateRecord("leads", id, { status: "quoted", quoteId: quote.id });
  await notifyQuoteSent(updated, quote);

  return NextResponse.json({ ok: true, quote, lead: updated });
}
