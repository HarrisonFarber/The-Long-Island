import { NextResponse } from "next/server";
import { getRecord, updateRecord } from "../../../../lib/server/store";
import { isAdmin } from "../../../../lib/server/auth";
import { notifyScheduled } from "../../../../lib/server/notify";

const STATUSES = ["new", "quoted", "accepted", "scheduled", "completed", "paid", "closed_lost"];

export async function PATCH(request, { params }) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json().catch(() => ({}));
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const lead = await getRecord("leads", id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  const previous = lead.status;
  const updated = await updateRecord("leads", id, { status });

  // Notifications fire on state transitions, not UI actions.
  if (status === "scheduled" && previous !== "scheduled") {
    await notifyScheduled(updated);
  }

  return NextResponse.json({ ok: true, lead: updated });
}
