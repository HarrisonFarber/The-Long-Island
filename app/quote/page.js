import QuoteClient from "../../components/QuoteClient";

export const metadata = {
  title: "Get a Quote",
};

export default function QuotePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" data-reveal>
          <p className="eyebrow">Get a quote</p>
          <h1>Photos in. Price out. It&apos;s that simple.</h1>
          <p style={{ maxWidth: "44rem", marginTop: "1.25rem", fontSize: "1.08rem" }}>
            Tell us about the job, upload a few photos, and we&apos;ll get back to you with a clear,
            no-pressure estimate — usually the same day.
          </p>
        </div>
      </section>
      <QuoteClient />
    </>
  );
}
