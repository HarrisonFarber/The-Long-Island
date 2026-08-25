import Link from "next/link";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" data-reveal>
          <p className="eyebrow">About us</p>
          <h1>Long Island born. Long Island based.</h1>
          <p style={{ maxWidth: "44rem", marginTop: "1.25rem", fontSize: "1.08rem" }}>
            We&apos;re a local cleanout crew — not a franchise — helping neighbors across Nassau and
            Suffolk County reclaim their garages, basements, and properties.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid grid--2">
          <article className="card service-card" data-reveal>
            <p className="eyebrow">Our story</p>
            <h2>Built for Long Island work, not generic hauling.</h2>
            <p style={{ marginTop: "0.75rem" }}>
              Every job we take is local, which means we know the neighborhoods, the transfer
              stations, and what it takes to turn a packed space around fast. Homeowners, realtors,
              and landlords call us when they need it done right the first time.
            </p>
          </article>
          <article className="card service-card" data-reveal style={{ "--d": "120ms" }}>
            <p className="eyebrow">Why neighbors choose us</p>
            <h2>Small-business care, big-job capability.</h2>
            <ul>
              <li>Clear, upfront quotes — photos in, price out</li>
              <li>Careful crews that respect your home and your time</li>
              <li>Estate and sensitive cleanouts handled with discretion</li>
              <li>Broom-clean finish and easy payment on every job</li>
            </ul>
          </article>
        </div>
        <div className="container" data-reveal style={{ marginTop: "1.5rem" }}>
          <Link className="btn btn--primary" href="/contact">
            Talk to the crew
          </Link>
        </div>
      </section>
    </>
  );
}
