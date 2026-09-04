import { NextResponse } from "next/server";
import { getRecord, updateRecord } from "../../../../../lib/server/store";
import { verifyToken } from "../../../../../lib/server/auth";
import { notifyQuoteAccepted, siteUrl } from "../../../../../lib/server/notify";
import { serverErrorResponse } from "../../../../../lib/server/http";

export async function GET(request, { params }) {
  const { id } = await params;
  const token = new URL(request.url).searchParams.get("token");

  try {
    const quote = await getRecord("quotes", id);
    if (!quote || !verifyToken(id, token)) {
      return NextResponse.json({ error: "This link is invalid or has expired." }, { status: 400 });
    }

    if (!quote.acceptedAt) {
      const acceptedQuote = await updateRecord("quotes", id, {
        acceptedAt: new Date().toISOString(),
      });
      const lead = await updateRecord("leads", quote.leadId, { status: "accepted" });
      if (lead) {
        await notifyQuoteAccepted(lead, acceptedQuote);
      }
    }

    return NextResponse.redirect(`${siteUrl()}/quote-accepted`);
  } catch (error) {
    return serverErrorResponse(error, "quotes/[id]/accept");
  }
}
