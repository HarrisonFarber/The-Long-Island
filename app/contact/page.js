import { site } from "../../lib/site";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" data-reveal>
          <p className="eyebrow">Contact</p>
          <h1>Text us or request a quote online — we answer fast.</h1>
          <p style={{ maxWidth: "44rem", marginTop: "1.25rem", fontSize: "1.08rem" }}>
            The quickest ways to reach us are a text or the online quote form — send a few photos and
            job details and a real person from the crew will get right back to you.
          </p>
        </div>
      </section>
      <section className="section" id="contact-details">
        <div className="container grid grid--2">
          <div className="contact-box card__body" data-reveal>
            <p className="eyebrow">Reach us</p>
            <h2>Contact details</h2>
            <ul className="list" style={{ marginTop: "1.25rem" }}>
              <li>
                <span>
                  <strong>Text (preferred):</strong>{" "}
                  <a href={site.smsHref}>{site.phoneDisplay}</a>
                </span>
              </li>
              <li>
                <span>
                  <strong>Email:</strong> <a href={`mailto:${site.email}`}>{site.email}</a>
                </span>
              </li>
              <li>
                <span>
                  <strong>Prefer to talk?</strong> Call <a href={site.phoneHref}>{site.phoneDisplay}</a>
                </span>
              </li>
              <li>
                <span>
                  <strong>Service area:</strong> {site.serviceArea}
                </span>
              </li>
              <li>
                <span>
                  <strong>Hours:</strong> Mon–Sat, early to evening — text for same-day availability
                </span>
              </li>
            </ul>
            <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <a className="btn btn--primary" href="/quote">
                Get a free quote
              </a>
              <a className="btn btn--ghost" href={site.smsHref}>
                Text us
              </a>
            </div>
          </div>
          <div className="contact-box card__body" data-reveal style={{ "--d": "120ms" }}>
            <p className="eyebrow">Where we work</p>
            <h2>All of Long Island</h2>
            <p style={{ marginTop: "1rem" }}>
              Nassau and Suffolk County, from the city line to the East End. If you&apos;re on the
              Island, you&apos;re in our service area.
            </p>
            <div className="map-box" style={{ marginTop: "1.25rem" }}>
              <svg viewBox="0 0 800 360" aria-hidden="true">
                <rect width="800" height="360" rx="24" fill="#EEF6EA" />
                <path
                  d="M110 192c80-72 157-92 238-92 91 0 137 35 199 35 58 0 83-18 119-18 42 0 70 15 104 36-23 29-70 55-118 55-57 0-94-28-148-28-66 0-118 36-196 36-58 0-133-10-198-24z"
                  fill="#18222F"
                  opacity="0.9"
                />
                <path
                  d="M150 208c70 16 138 18 200 8 76-13 102-40 170-40 48 0 77 19 106 28-60 32-112 52-163 52-59 0-99-17-175-17-57 0-100 5-137 17-40-10-63-26-77-48z"
                  fill="#69B548"
                  opacity="0.9"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
