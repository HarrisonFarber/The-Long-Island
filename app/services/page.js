import { services } from "../../lib/site";

export const metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Services</p>
          <h1>Every service page should earn its place in search.</h1>
          <p className="subtle" style={{ maxWidth: "52rem", marginTop: "1rem" }}>
            This page expands the three core services with local intent, clear conversion language,
            and practical details that help users decide fast.
          </p>
        </div>
      </section>
      <section className="section section--alt">
        <div className="container grid grid--3">
          {services.map((service) => (
            <article key={service.id} className="card service-card">
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
      <section className="section">
        <div className="container">
          <div className="section__heading">
            <div>
              <p className="eyebrow">FAQs</p>
              <h2>Short answers help users convert.</h2>
            </div>
          </div>
          <div className="grid grid--2">
            {[
              ["How fast can you come out?", "Same-day or next-day is the ideal target when crew scheduling allows."],
              ["Do you take photos for quotes?", "Yes. Multiple photo uploads are built into the quote form to speed up estimates."],
              ["Can you handle large jobs?", "The website is structured to support both small pickups and larger property cleanouts."],
              ["What areas do you serve?", "Nassau and Suffolk County, with local SEO and Google Business Profile consistency in mind."],
            ].map(([question, answer]) => (
              <article key={question} className="card service-card">
                <h3>{question}</h3>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
