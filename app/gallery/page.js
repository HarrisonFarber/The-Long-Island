import { galleryCards } from "../../lib/site";

export const metadata = {
  title: "Gallery",
};

export default function GalleryPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Gallery</p>
          <h1>Before and after photos that carry the proof.</h1>
          <p className="subtle" style={{ maxWidth: "50rem", marginTop: "1rem" }}>
            Use this layout for real job photos later. For now it is a clean, conversion-friendly
            placeholder grid.
          </p>
        </div>
      </section>
      <section className="section section--alt">
        <div className="container">
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
    </>
  );
}
