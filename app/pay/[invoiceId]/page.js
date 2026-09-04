import { notFound } from "next/navigation";
import { getRecord } from "../../../lib/server/store";
import { stripeConfigured } from "../../../lib/server/stripe";
import { site } from "../../../lib/site";
import PayActions from "../../../components/PayActions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { invoiceId } = await params;
  return {
    title: `Invoice ${invoiceId}`,
    robots: { index: false, follow: false },
  };
}

export default async function InvoicePage({ params, searchParams }) {
  const { invoiceId } = await params;
  const query = await searchParams;
  const invoice = await getRecord("invoices", invoiceId);

  if (!invoice) {
    notFound();
  }

  const lead = invoice.leadId ? await getRecord("leads", invoice.leadId) : null;
  const justPaid = query?.paid === "1";

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: "56rem" }}>
        <div className="invoice-panel card__body" data-invoice>
          <p className="eyebrow">Invoice</p>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            {invoice.status === "paid" ? "Paid — thank you!" : "Your invoice is ready"}
          </h1>
          <p className="subtle" style={{ marginTop: "0.75rem" }}>
            Invoice <strong data-invoice-id>{invoice.id}</strong>
            {lead ? ` — ${lead.serviceType} at ${lead.address}` : ""}
          </p>
          {justPaid && invoice.status !== "paid" && (
            <div className="note" style={{ marginTop: "1rem" }}>
              Payment received — we&apos;re confirming it now. Your receipt will arrive by email.
            </div>
          )}
          <div className="grid grid--2" style={{ marginTop: "1.5rem" }}>
            <div className="card service-card">
              <h3>Job summary</h3>
              <ul data-line-items>
                {invoice.lineItems.map((item) => (
                  <li key={item.description}>
                    <span>
                      {item.description} — ${item.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card service-card">
              <h3>Total due</h3>
              <p
                style={{
                  fontSize: "2.6rem",
                  fontFamily: "Anton, sans-serif",
                  color: "var(--navy)",
                  lineHeight: 1.1,
                  marginTop: "0.5rem",
                }}
                data-invoice-total
              >
                ${invoice.total.toFixed(2)}
              </p>
              <div style={{ marginTop: "1.25rem" }}>
                <PayActions invoice={invoice} stripeConfigured={stripeConfigured()} />
              </div>
              <p className="subtle" style={{ marginTop: "1.25rem", fontSize: "0.9rem" }}>
                Questions about this invoice? Email {site.email} or text {site.phoneDisplay}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
