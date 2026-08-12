import QuoteClient from "../../components/QuoteClient";

export const metadata = {
  title: "Get a Quote",
};

export default function QuotePage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Get a quote</p>
          <h1>Quote form with photo uploads and preview.</h1>
          <p className="subtle" style={{ maxWidth: "52rem", marginTop: "1rem" }}>
            This front-end is wired to store demo leads in local storage so the admin page and
            payment flow have data to work with right away.
          </p>
        </div>
      </section>
      <QuoteClient />
    </>
  );
}
