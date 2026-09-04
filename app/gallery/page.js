import { galleryCards } from "../../lib/site";

export const metadata = {
  title: "Gallery",
};

export default function GalleryPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" data-reveal>
          <p className="eyebrow">Gallery</p>
          <h1>See the difference one visit makes.</h1>
          <p style={{ maxWidth: "44rem", marginTop: "1.25rem", fontSize: "1.08rem" }}>
            Real jobs, real transformations — packed garages, carports, and cluttered side yards
            turned back into usable space.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="gallery gallery--wide">
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
          <div className="cta-band" data-reveal>
            <div>
              <p className="eyebrow" style={{ color: "var(--green-bright)" }}>
                Your turn
              </p>
              <h2>Ready for your own after photo?</h2>
              <p>Send us a few before shots and we&apos;ll take care of the rest.</p>
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
