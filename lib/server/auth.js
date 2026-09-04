import crypto from "crypto";

/**
 * Minimal single-owner admin auth: password check + HMAC-signed session cookie.
 * Set ADMIN_PASSWORD and SESSION_SECRET in production; dev falls back to a
 * default password so the dashboard is usable out of the box.
 */

export const SESSION_COOKIE = "licc_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function secret() {
  return (
    process.env.SESSION_SECRET ||
    crypto.createHash("sha256").update(`licc:${adminPassword()}`).digest("hex")
  );
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "cleanout-admin";
}

export function isDefaultPassword() {
  return !process.env.ADMIN_PASSWORD;
}

function sign(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSessionValue() {
  const issuedAt = String(Date.now());
  return `${issuedAt}.${sign(issuedAt)}`;
}

/**
 * Options passed to NextResponse.cookies.set(). Using the framework cookie API
 * (rather than hand-building a Set-Cookie string) is what Vercel's edge/CDN
 * reliably preserves in production.
 *
 * `secure` is only enabled over HTTPS. On Vercel production that's always true;
 * omitting it would let the browser silently drop the cookie on plain HTTP.
 */
export function sessionCookieOptions() {
  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}

export function clearSessionCookieOptions() {
  return { path: "/", httpOnly: true, sameSite: "lax", maxAge: 0 };
}

export function isAdmin(request) {
  const cookies = request.headers.get("cookie") || "";
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  if (!match) return false;
  const [issuedAt, signature] = match[1].split(".");
  if (!issuedAt || !signature) return false;
  const expected = sign(issuedAt);
  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return false;
  }
  return Date.now() - Number(issuedAt) < SESSION_TTL_MS;
}

export function signToken(value) {
  return sign(`token:${value}`).slice(0, 32);
}

export function verifyToken(value, token) {
  const expected = signToken(value);
  return (
    typeof token === "string" &&
    token.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  );
}
