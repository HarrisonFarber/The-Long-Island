import { insertRecord, newId } from "./store";

/**
 * Email adapter: sends through Resend when RESEND_API_KEY is set; otherwise the
 * message lands in the "outbox" collection (visible on the admin dashboard) and
 * is logged to the console, so the whole flow is testable with no account.
 */

export async function sendEmail({ to, subject, html }) {
  const record = {
    id: newId("MAIL"),
    to,
    subject,
    sentVia: process.env.RESEND_API_KEY ? "resend" : "outbox",
  };

  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "The LI Cleanout Company <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error(`Resend error ${res.status}: ${await res.text()}`);
      record.sentVia = "failed";
    }
  } else {
    console.log(`[outbox] To: ${to} — ${subject}`);
  }

  await insertRecord("outbox", record);
  return record;
}

export function emailLayout(title, bodyHtml) {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f5f7f4;font-family:Arial,Helvetica,sans-serif;color:#121a23;">
    <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
      <div style="background:#0e1520;border-radius:14px 14px 0 0;padding:20px 24px;">
        <span style="color:#8fd960;font-weight:bold;letter-spacing:2px;font-size:12px;text-transform:uppercase;">
          The Long Island Cleanout Company
        </span>
      </div>
      <div style="background:#ffffff;border-radius:0 0 14px 14px;padding:28px 24px;">
        <h1 style="margin:0 0 16px;font-size:22px;color:#0e1520;">${title}</h1>
        ${bodyHtml}
      </div>
      <p style="text-align:center;color:#8a949e;font-size:12px;margin-top:16px;">
        We clean it out. You move forward. — Nassau &amp; Suffolk County, NY
      </p>
    </div>
  </body>
</html>`;
}

export function emailButton(url, label) {
  return `<p style="margin:24px 0;">
    <a href="${url}" style="background:#69b548;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;font-size:13px;">
      ${label}
    </a>
  </p>`;
}
