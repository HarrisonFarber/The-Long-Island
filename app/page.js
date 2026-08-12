import { services, steps, galleryCards, testimonials, servicePills, site } from "../lib/site";

export const metadata = {
  title: "Home",
};

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
          <div className="hero__copy">
            <p className="hero-kicker">Junk removal and cleanouts for Long Island</p>
            <h1 className="hero-title">We clean it out. You move forward.</h1>
            <p>
              Fast, respectful junk removal, property cleanouts, and hauling for homes, rentals,
              estates, and light commercial jobs across Nassau and Suffolk County.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="/quote">
                Request a quote
              </a>
              <a className="btn btn--ghost" href="/services">
                See services
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
                <strong>Long Island</strong>
                <span>local Nassau and Suffolk coverage</span>
              </div>
            </div>
          </div>
          <div className="hero__panel">
            <div className="panel-card">
              <div className="panel-card__label">Fast estimate</div>
              <div className="panel-card__title">Upload photos, get moving</div>
              <p>
                Use the quote form to share job details and upload multiple photos so the crew can
                size up the cleanout quickly.
              </p>
            </div>
            <div className="panel-card">
              <div className="panel-card__label">Trusted locally</div>
              <div className="panel-card__title">Owner-focused service</div>
              <p>
                Designed for property owners, realtors, landlords, and families who want a clean
                space without the stress.
              </p>
            </div>
            <div className="panel-card">
              <div className="panel-card__label">Ready to roll</div>
              <div className="panel-card__title">Clear the job, clear the schedule</div>
              <p>
                Built to read like a premium service brand while staying fast, simple, and local.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section__heading">
            <div>
              <p className="hero-kicker" style={{ color: "var(--green-dark)" }}>
                Services
              </p>
              <h2>Built for the jobs that need to disappear quickly.</h2>
            </div>
            <p>
              From a single couch to a full estate cleanout, the site is organized around the core
              services that matter for local search and lead conversion.
            </p>
          </div>
          <div className="grid grid--3">
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
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__heading">
            <div>
              <p className="hero-kicker" style={{ color: "var(--green-dark)" }}>
                How it works
              </p>
              <h2>Three clean steps from quote to cleared space.</h2>
            </div>
          </div>
          <div className="grid grid--3 steps">
            {steps.map((step) => (
              <article key={step.num} className="card step">
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
          <div>
            <p className="hero-kicker">Service area</p>
            <h2>Nassau and Suffolk County, with Long Island front and center.</h2>
            <p>
              Use this area for local SEO, Google Business Profile consistency, and the watermark
              style silhouette that echoes the brand system in the brief.
            </p>
            <div className="map-box__legend">
              {servicePills.map((pill) => (
                <span key={pill} className="pill">
                  {pill}
                </span>
              ))}
            </div>
          </div>
          <div className="map-box" aria-hidden="true">
            <svg viewBox="0 0 800 480" role="img" aria-label="Simplified Long Island silhouette">
              <rect width="800" height="480" rx="28" fill="#EEF8F0" />
              <path
                d="M120 260c80-70 154-92 240-92 98 0 140 35 201 35 59 0 82-18 120-18 42 0 68 17 99 35-18 25-67 55-118 55-57 0-92-27-146-27-66 0-116 35-196 35-58 0-132-10-200-23z"
                fill="#2A303A"
                opacity="0.86"
              />
              <path
                d="M159 276c72 18 143 20 207 8 79-14 106-42 177-42 50 0 80 20 110 29-62 34-117 55-170 55-61 0-103-18-182-18-59 0-104 5-142 18-42-10-66-27-80-50z"
                fill="#69B548"
                opacity="0.9"
              />
              <circle cx="612" cy="143" r="24" fill="#69B548" />
              <path d="M612 120v46M589 143h46" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section__heading">
            <div>
              <p className="hero-kicker" style={{ color: "var(--green-dark)" }}>
                Gallery preview
              </p>
              <h2>Before and after stories that sell the result.</h2>
            </div>
            <p>
              These are styled placeholders for now. Once the first real jobs come in, swap them
              for real photo assets and keep the same layout.
            </p>
          </div>
          <div className="gallery">
            {galleryCards.map((card) => (
              <article key={card.title} className="card gallery-card">
                <div className="before-after">
                  <div className="before">
                    <span>Before</span>
                  </div>
                  <div className="after">
                    <span>After</span>
                  </div>
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

      <section className="section">
        <div className="container">
          <div className="section__heading">
            <div>
              <p className="hero-kicker" style={{ color: "var(--green-dark)" }}>
                Testimonials
              </p>
              <h2>Social proof belongs near the final CTA.</h2>
            </div>
          </div>
          <div className="grid grid--3">
            {testimonials.map((text) => (
              <article key={text} className="card service-card">
                <p>"{text}"</p>
                <p>
                  <strong>- Placeholder review</strong>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <div className="section__heading">
            <div>
              <p className="hero-kicker">Ready to start</p>
              <h2>Get a quote and clear the clutter.</h2>
            </div>
            <a className="btn btn--primary" href="/quote">
              Start the quote form
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
