import { NextResponse } from "next/server";
import { listRecords, usingSupabase } from "../../../../lib/server/store";
import { isAdmin, isDefaultPassword } from "../../../../lib/server/auth";
import { stripeConfigured } from "../../../../lib/server/stripe";
import { serverErrorResponse } from "../../../../lib/server/http";

// Reads the session cookie per-request — must always run dynamically.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [leads, quotes, invoices, outbox] = await Promise.all([
      listRecords("leads"),
      listRecords("quotes"),
      listRecords("invoices"),
      listRecords("outbox"),
    ]);

    return NextResponse.json({
      leads,
      quotes,
      invoices,
      outbox: outbox.slice(0, 8),
      config: {
        usingSupabase,
        stripeConfigured: stripeConfigured(),
        emailConfigured: Boolean(process.env.RESEND_API_KEY),
        defaultPassword: isDefaultPassword(),
      },
    });
  } catch (error) {
    return serverErrorResponse(error, "admin/data");
  }
}
