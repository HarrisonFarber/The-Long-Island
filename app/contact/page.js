import { site } from "../../lib/site";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1>Make it easy to call, email, or find the business.</h1>
        </div>
      </section>
      <section className="section section--alt" id="contact-details">
        <div className="container grid grid--2">
          <div className="contact-box card__body">
            <h2>Contact details</h2>
            <p style={{ marginTop: "1rem" }}>
              <strong>Email:</strong> <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p>
              <strong>Phone:</strong> <a href={site.phoneHref}>{site.phoneDisplay}</a>
            </p>
            <p>
              <strong>Service area:</strong> {site.serviceArea}
            </p>
            <p>
              <strong>Hours:</strong> add operating hours after finalizing schedule
            </p>
            <div className="note" style={{ marginTop: "1rem" }}>
              The brief did not include a real address or phone number yet, so this page is
              structured to drop those in later without redesign work.
            </div>
          </div>
          <div className="contact-box card__body">
            <h2>Map placeholder</h2>
            <p style={{ marginTop: "1rem" }}>
              Once the address is finalized, embed the Google Map and keep the listing name, phone,
              and website consistent with the Google Business Profile.
            </p>
            <div className="map-box" style={{ marginTop: "1rem" }}>
              <svg viewBox="0 0 800 360" aria-hidden="true">
                <rect width="800" height="360" rx="24" fill="#EEF8F0" />
                <path
                  d="M110 192c80-72 157-92 238-92 91 0 137 35 199 35 58 0 83-18 119-18 42 0 70 15 104 36-23 29-70 55-118 55-57 0-94-28-148-28-66 0-118 36-196 36-58 0-133-10-198-24z"
                  fill="#1B1F26"
                  opacity="0.88"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
