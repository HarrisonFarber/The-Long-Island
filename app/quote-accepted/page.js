import Link from "next/link";
import { site } from "../../lib/site";

export const metadata = {
  title: "Quote Accepted",
};

export default function QuoteAcceptedPage() {
  return (
    <section className="page-hero" style={{ paddingBottom: "6rem" }}>
      <div className="container" data-reveal>
        <p className="eyebrow">You&apos;re booked in</p>
        <h1>Quote accepted — we&apos;ll text you to schedule.</h1>
        <p style={{ maxWidth: "44rem", marginTop: "1.25rem", fontSize: "1.08rem" }}>
          Thanks for choosing The Long Island Cleanout Company. We&apos;ve been notified and will
          text you shortly to lock in your date. Questions in the meantime? Text{" "}
          <a href={site.smsHref} style={{ color: "var(--green-bright)" }}>
            {site.phoneDisplay}
          </a>
          .
        </p>
        <div style={{ marginTop: "2rem" }}>
          <Link className="btn btn--primary" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
