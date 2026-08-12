import { notFound } from "next/navigation";
import { invoices, site } from "../../../lib/site";

export function generateMetadata({ params }) {
  return {
    title: `Invoice ${params.invoiceId}`,
  };
}

export default function InvoicePage({ params }) {
  const invoice = invoices.find((entry) => entry.id === params.invoiceId);

  if (!invoice) {
    notFound();
  }

  return (
    <section className="section">
      <div className="container">
        <div className="invoice-panel card__body" data-invoice>
          <p className="eyebrow">Invoice</p>
          <h1>Payment page</h1>
          <p className="subtle" style={{ marginTop: "0.75rem" }}>
            Reference invoice <strong data-invoice-id>{invoice.id}</strong>
          </p>
          <div className="grid grid--2" style={{ marginTop: "1.2rem" }}>
            <div className="card service-card">
              <h3>Job summary</h3>
              <p>Customer-facing invoice page using the same visual language as the rest of the site.</p>
              <ul data-line-items>
                {invoice.lineItems.map((item) => (
                  <li key={item.description}>
                    <span>
                      {item.description} - ${item.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card service-card">
              <h3>Total due</h3>
              <p
                style={{
                  fontSize: "2.5rem",
                  fontFamily: "Anton, sans-serif",
                  color: "var(--navy)",
                  lineHeight: 1.1,
                }}
                data-invoice-total
              >
                ${invoice.total.toFixed(2)}
              </p>
              <p>
                Use this page for Stripe Checkout, payment links, or a future payment processor
                integration.
              </p>
              <div style={{ marginTop: "1rem" }}>
                <a className="btn btn--primary" href={invoice.paymentLinkUrl || "#"}>
                  Pay invoice
                </a>
              </div>
              <p className="subtle" style={{ marginTop: "1rem" }}>
                {site.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
