import { services } from "../../lib/site";

export const metadata = {
  title: "Services",
};

const faqs = [
  [
    "How fast can you come out?",
    "Same-day or next-day in most cases. Tell us your preferred date on the quote form and we'll confirm the earliest slot the crew can make.",
  ],
  [
    "How do photo quotes work?",
    "Snap a few pictures of the items or the space, upload them with the quote form, and we'll send back a clear price — no walkthrough needed for most jobs.",
  ],
  [
    "Can you handle large jobs?",
    "Yes. From a single couch to full estate and multi-room cleanouts, we size the crew and truck to the job.",
  ],
  [
    "What areas do you serve?",
    "All of Nassau and Suffolk County. If you're on Long Island, you're covered.",
  ],
];

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" data-reveal>
          <p className="eyebrow">Services</p>
          <h1>One call clears it all.</h1>
          <p style={{ maxWidth: "44rem", marginTop: "1.25rem", fontSize: "1.08rem" }}>
            Junk removal, property cleanouts, and hauling — handled by a local crew that shows up on
            time, works carefully, and leaves the space broom-clean.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid grid--3">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="card service-card"
              data-reveal
              style={{ "--d": `${index * 110}ms` }}
            >
              <div className="service-card__icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul>
                {service.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="section section--alt">
        <div className="container">
          <div className="section__heading" data-reveal>
            <div>
              <p className="eyebrow">FAQs</p>
              <h2>Quick answers before you book.</h2>
            </div>
          </div>
          <div className="grid grid--2">
            {faqs.map(([question, answer], index) => (
              <article
                key={question}
                className="card service-card"
                data-reveal
                style={{ "--d": `${(index % 2) * 110}ms` }}
              >
                <h3>{question}</h3>
                <p style={{ marginTop: "0.6rem" }}>{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="cta-band" data-reveal>
            <div>
              <p className="eyebrow" style={{ color: "var(--green-bright)" }}>
                Get started
              </p>
              <h2>Tell us about the job.</h2>
              <p>Photos plus a few details is all it takes to get a fast, honest quote.</p>
            </div>
            <a className="btn btn--primary" href="/quote">
              Get a free quote
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
