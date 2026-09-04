"use client";

import { useState } from "react";

export default function PayActions({ invoice, stripeConfigured = false }) {
  const [state, setState] = useState(invoice.status); // unpaid | paying | paid | error

  if (state === "paid" || invoice.status === "paid") {
    return (
      <div className="note">
        <strong>Paid — thank you!</strong> A receipt has been emailed to you.
      </div>
    );
  }

  if (invoice.paymentLinkUrl) {
    return (
      <a className="btn btn--primary" href={invoice.paymentLinkUrl}>
        Pay ${invoice.total.toFixed(2)} securely
      </a>
    );
  }

  // Stripe is live but this invoice has no checkout link (e.g. it was created
  // before Stripe was configured). The demo fallback is disabled in this mode,
  // so don't offer it — point the customer to us for a fresh link.
  if (stripeConfigured) {
    return (
      <div className="note">
        This invoice doesn&apos;t have a payment link yet. Please contact us and we&apos;ll resend a
        secure payment link.
      </div>
    );
  }

  const demoPay = async () => {
    setState("paying");
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/demo-pay`, { method: "POST" });
      if (!response.ok) throw new Error();
      setState("paid");
    } catch {
      setState("error");
    }
  };

  return (
    <div style={{ display: "grid", gap: "0.75rem", justifyItems: "start" }}>
      <button className="btn btn--primary" onClick={demoPay} disabled={state === "paying"}>
        {state === "paying" ? "Processing..." : `Pay $${invoice.total.toFixed(2)} (demo)`}
      </button>
      <span className="subtle" style={{ fontSize: "0.88rem" }}>
        Demo mode — connect Stripe to take real card payments here.
      </span>
      {state === "error" && <span style={{ color: "#c0392b" }}>Payment failed — try again.</span>}
    </div>
  );
}
