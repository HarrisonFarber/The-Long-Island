import { site } from "../../lib/site";

export const metadata = {
  title: "Pay an Invoice",
  robots: { index: false, follow: false },
};

export default function PayIndexPage() {
  return (
    <section className="page-hero" style={{ paddingBottom: "6rem" }}>
      <div className="container" data-reveal>
        <p className="eyebrow">Payments</p>
        <h1>Looking for your invoice?</h1>
        <p style={{ maxWidth: "44rem", marginTop: "1.25rem", fontSize: "1.08rem" }}>
          Your personal payment link was sent to you by email — it looks like{" "}
          <strong>{`${"pay/INV-XXXX"}`}</strong>. Can&apos;t find it? Call{" "}
          <a href={site.phoneHref} style={{ color: "var(--green-bright)" }}>
            {site.phoneDisplay}
          </a>{" "}
          or email {site.email} and we&apos;ll resend it.
        </p>
      </div>
    </section>
  );
}
