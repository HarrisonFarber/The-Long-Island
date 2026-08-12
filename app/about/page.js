import Link from "next/link";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">About</p>
          <h1>Trust signals and local story belong on a real website.</h1>
          <p className="subtle" style={{ maxWidth: "50rem", marginTop: "1rem" }}>
            This page frames the crew as local, careful, and efficient. It also gives the business
            a place for reviews and credibility content later.
          </p>
        </div>
      </section>
      <section className="section section--alt">
        <div className="container grid grid--2">
          <article className="card service-card">
            <p className="eyebrow">Story</p>
            <h2>Built for Long Island work, not generic hauling.</h2>
            <p>
              The website prioritizes local trust, fast request handling, and clean visual hierarchy
              so homeowners and property managers can move from concern to action quickly.
            </p>
          </article>
          <article className="card service-card">
            <p className="eyebrow">Trust</p>
            <h2>Small business communication, big-job organization.</h2>
            <ul>
              <li>Clear quote process</li>
              <li>Photo-driven estimates</li>
              <li>Status tracking ready for admin workflow</li>
              <li>Mobile-first support for Google Business Profile traffic</li>
            </ul>
          </article>
        </div>
        <div className="container" style={{ marginTop: "1rem" }}>
          <Link className="btn btn--primary" href="/contact">
            Contact the crew
          </Link>
        </div>
      </section>
    </>
  );
}
