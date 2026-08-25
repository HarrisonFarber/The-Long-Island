import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminPassword, sessionCookieHeader, clearSessionCookieHeader } from "../../../../lib/server/auth";

export async function POST(request) {
  const { password } = await request.json().catch(() => ({}));
  const expected = adminPassword();
  const given = String(password || "");

  const expectedHash = crypto.createHash("sha256").update(expected).digest();
  const givenHash = crypto.createHash("sha256").update(given).digest();
  if (!crypto.timingSafeEqual(expectedHash, givenHash)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", sessionCookieHeader());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", clearSessionCookieHeader());
  return response;
}
