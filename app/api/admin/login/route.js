import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  adminPassword,
  createSessionValue,
  sessionCookieOptions,
  clearSessionCookieOptions,
  SESSION_COOKIE,
} from "../../../../lib/server/auth";

// Auth must never be cached and needs the Node runtime for `crypto`.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  response.cookies.set(SESSION_COOKIE, createSessionValue(), sessionCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", clearSessionCookieOptions());
  return response;
}
