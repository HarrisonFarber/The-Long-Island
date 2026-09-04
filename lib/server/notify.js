import { sendEmail, emailLayout, emailButton } from "./email";
import { signToken } from "./auth";
import { site } from "../site";

/**
 * Every customer/owner notification fires from a status transition, never from
 * UI code directly — add SMS later by extending these functions in one place.
 */

export function siteUrl() {
  return (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function ownerEmail() {
  return process.env.OWNER_EMAIL || site.email;
}

const row = (label, value) =>
  value
    ? `<tr><td style="padding:6px 12px 6px 0;color:#5b6672;white-space:nowrap;">${label}</td><td style="padding:6px 0;"><strong>${value}</strong></td></tr>`
    : "";

export async function notifyNewLead(lead) {
  await sendEmail({
    to: ownerEmail(),
    subject: `New quote request — ${lead.name} (${lead.serviceType})`,
    html: emailLayout(
      "New quote request",
      `<table style="border-collapse:collapse;font-size:14px;">
        ${row("Name", lead.name)}
        ${row("Phone", lead.phone)}
        ${row("Email", lead.email)}
        ${row("Address", lead.address)}
        ${row("Service", lead.serviceType)}
        ${row("Preferred date", lead.preferredDate)}
        ${row("Photos", `${lead.photoUrls?.length || 0} uploaded`)}
       </table>
       ${lead.notes ? `<p style="margin-top:16px;color:#5b6672;">"${lead.notes}"</p>` : ""}
       ${emailButton(`${siteUrl()}/admin`, "Open dashboard")}`
    ),
  });
}

export async function notifyQuoteSent(lead, quote) {
  const acceptUrl = `${siteUrl()}/api/quotes/${quote.id}/accept?token=${signToken(quote.id)}`;
  await sendEmail({
    to: lead.email,
    subject: `Your quote from The Long Island Cleanout Company — $${quote.amount}`,
    html: emailLayout(
      `Your quote: $${quote.amount}`,
      `<p>Hi ${lead.name},</p>
       <p>Thanks for sending over the details${lead.photoUrls?.length ? " and photos" : ""}. Here's our quote for your ${lead.serviceType.toLowerCase()}:</p>
       <p style="font-size:34px;font-weight:bold;color:#0e1520;margin:18px 0;">$${quote.amount}</p>
       ${quote.notes ? `<p style="color:#5b6672;">${quote.notes}</p>` : ""}
       <p>Ready to book? Accept below and we'll reach out to schedule.</p>
       ${emailButton(acceptUrl, "Accept this quote")}
       <p style="color:#8a949e;font-size:13px;">No pressure — reply to this email with any questions.</p>`
    ),
  });
}

export async function notifyQuoteAccepted(lead, quote) {
  await sendEmail({
    to: ownerEmail(),
    subject: `Quote accepted — ${lead.name} ($${quote.amount})`,
    html: emailLayout(
      "Quote accepted",
      `<p><strong>${lead.name}</strong> accepted the $${quote.amount} quote for ${lead.serviceType.toLowerCase()} at ${lead.address}.</p>
       <p>Next step: contact them to schedule.</p>
       <table style="border-collapse:collapse;font-size:14px;">
        ${row("Phone", lead.phone)}
        ${row("Email", lead.email)}
        ${row("Preferred date", lead.preferredDate)}
       </table>
       ${emailButton(`${siteUrl()}/admin`, "Open dashboard")}`
    ),
  });
}

export async function notifyScheduled(lead) {
  await sendEmail({
    to: lead.email,
    subject: "Your cleanout is scheduled",
    html: emailLayout(
      "You're on the schedule",
      `<p>Hi ${lead.name},</p>
       <p>Your ${lead.serviceType.toLowerCase()} at <strong>${lead.address}</strong> is booked${lead.preferredDate ? ` for <strong>${lead.preferredDate}</strong>` : ""}.</p>
       <p>The crew will text ahead on the day. Questions? Just reply to this email or text ${site.phoneDisplay}.</p>`
    ),
  });
}

export async function notifyInvoice(lead, invoice) {
  const payUrl = invoice.paymentLinkUrl || `${siteUrl()}/pay/${invoice.id}`;
  await sendEmail({
    to: lead.email,
    subject: `Invoice ${invoice.id} — $${invoice.total.toFixed(2)}`,
    html: emailLayout(
      "Your invoice is ready",
      `<p>Hi ${lead.name},</p>
       <p>Thanks for choosing us! Here's your invoice for the completed job:</p>
       <p style="font-size:34px;font-weight:bold;color:#0e1520;margin:18px 0;">$${invoice.total.toFixed(2)}</p>
       ${emailButton(payUrl, "Pay invoice")}
       <p style="color:#8a949e;font-size:13px;">Invoice ${invoice.id} — you can also view it any time at ${siteUrl()}/pay/${invoice.id}</p>`
    ),
  });
}

export async function notifyPaid(lead, invoice) {
  await Promise.all([
    sendEmail({
      to: lead.email,
      subject: `Receipt — invoice ${invoice.id} paid`,
      html: emailLayout(
        "Payment received — thank you!",
        `<p>Hi ${lead.name},</p>
         <p>We've received your payment of <strong>$${invoice.total.toFixed(2)}</strong> for invoice ${invoice.id}. This email is your receipt.</p>
         <p>It was a pleasure working with you — enjoy the space!</p>`
      ),
    }),
    sendEmail({
      to: ownerEmail(),
      subject: `Paid — invoice ${invoice.id} ($${invoice.total.toFixed(2)})`,
      html: emailLayout(
        "Invoice paid",
        `<p>${lead.name} paid invoice ${invoice.id} — $${invoice.total.toFixed(2)}.</p>`
      ),
    }),
  ]);
}
