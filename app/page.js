import { services, steps, galleryCards, testimonials, servicePills, site } from "../lib/site";

export const metadata = {
  title: "Home",
};

const marqueeItems = [
  "Junk Removal",
  "Property Cleanouts",
  "Hauling",
  "Nassau County",
  "Suffolk County",
  "Same-Day Service",
  "Photo Quotes",
  "Licensed & Local",
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: site.name,
            description: "Junk removal, property cleanouts, and hauling serving Nassau and Suffolk County, NY.",
            email: site.email,
            areaServed: ["Nassau County, NY", "Suffolk County, NY"],
            url: "/",
            priceRange: "$$",
          }),
        }}
      />

      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy" data-reveal>
            <span className="hero-badge">Now booking across Long Island</span>
            <h1 className="hero-title">
              We clean it out. <span className="accent">You move forward.</span>
            </h1>
            <p>
              Fast, respectful junk removal, property cleanouts, and hauling for homes, rentals,
              estates, and light commercial jobs across Nassau and Suffolk County.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="/quote">
                Get a free quote
              </a>
              <a className="btn btn--ghost" href="/services">
                Explore services
              </a>
            </div>
            <div className="hero__stats">
              <div className="stat">
                <strong>Same day</strong>
                <span>when the schedule allows</span>
              </div>
              <div className="stat">
                <strong>3 steps</strong>
                <span>quote, haul, clean</span>
              </div>
              <div className="stat">
                <strong>100% local</strong>
                <span>Nassau &amp; Suffolk crews</span>
              </div>
            </div>
          </div>
          <div className="hero__panel" data-reveal style={{ "--d": "150ms" }}>
            <div className="panel-card">
              <div className="panel-card__label">Fast estimate</div>
              <div className="panel-card__title">Snap photos, get a price</div>
              <p>
                Upload photos with the quote form and get a clear estimate fast — no walkthrough
                needed for most jobs.
              </p>
            </div>
            <div className="panel-card">
              <div className="panel-card__label">Trusted locally</div>
              <div className="panel-card__title">Careful, respectful crews</div>
              <p>
                Homeowners, realtors, and landlords count on us for cleanouts handled with care —
                even the tough ones.
              </p>
            </div>
            <div className="panel-card">
              <div className="panel-card__label">Done right</div>
              <div className="panel-card__title">Swept clean at the finish</div>
              <p>
                Every job ends with a broom-clean space and a simple payment handoff. No surprises,
                no mess left behind.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].flatMap((pass) =>
            marqueeItems.map((item) => (
              <span key={`${pass}-${item}`} className="marquee__item">
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section__heading" data-reveal>
            <div>
              <p className="eyebrow">Services</p>
              <h2>Whatever needs to go, we haul it.</h2>
            </div>
            <p>
              From a single couch to a full estate cleanout — one request covers the lifting,
              loading, hauling, and disposal.
            </p>
          </div>
          <div className="grid grid--3">
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
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section__heading" data-reveal>
            <div>
              <p className="eyebrow">How it works</p>
              <h2>Three clean steps from quote to cleared space.</h2>
            </div>
          </div>
          <div className="grid grid--3 steps">
            {steps.map((step, index) => (
              <article
                key={step.num}
                className="card step"
                data-reveal
                style={{ "--d": `${index * 110}ms` }}
              >
                <div className="step__num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container map-wrap">
          <div data-reveal>
            <p className="eyebrow">Service area</p>
            <h2>Covering Nassau and Suffolk County, end to end.</h2>
            <p style={{ marginTop: "1rem" }}>
              We&apos;re Long Island born and based — no franchises, no out-of-town crews. If
              you&apos;re on the Island, you&apos;re in our service area.
            </p>
            <div className="map-box__legend">
              {servicePills.map((pill) => (
                <span key={pill} className="pill">
                  {pill}
                </span>
              ))}
            </div>
          </div>
          <div className="map-box" data-reveal style={{ "--d": "150ms" }}>
            <img className="map-box__logo" src="/assets/logo.jpg" alt={site.name} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__heading" data-reveal>
            <div>
              <p className="eyebrow">Recent work</p>
              <h2>Before and after, the proof is in the space.</h2>
            </div>
            <p>
              Garages, carports, side yards, and storage spaces — see the kind of transformation one
              visit makes.
            </p>
          </div>
          <div className="gallery">
            {galleryCards.map((card, index) => (
              <article
                key={card.title}
                className="card gallery-card"
                data-reveal
                style={{ "--d": `${index * 90}ms` }}
              >
                <div className="gallery-card__media">
                  <img
                    src={card.image}
                    alt={`${card.title} — before and after`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="card__body">
                  <strong>{card.title}</strong>
                  <p>{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section__heading" data-reveal>
            <div>
              <p className="eyebrow">Reviews</p>
              <h2>Neighbors who moved forward.</h2>
            </div>
          </div>
          <div className="grid grid--3">
            {testimonials.map((testimonial, index) => (
              <figure
                key={testimonial.text}
                className="card quote-card"
                data-reveal
                style={{ "--d": `${index * 110}ms` }}
              >
                <span className="quote-card__stars" aria-label="5 star review">
                  ★★★★★
                </span>
                <blockquote>&ldquo;{testimonial.text}&rdquo;</blockquote>
                <figcaption>{testimonial.location}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band" data-reveal>
            <div>
              <p className="eyebrow" style={{ color: "var(--green-bright)" }}>
                Ready when you are
              </p>
              <h2>Clear the clutter this week.</h2>
              <p>
                Send a few photos and job details — we&apos;ll get back to you with a straightforward
                quote, fast.
              </p>
            </div>
            <a className="btn btn--primary" href="/quote">
              Start your free quote
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
