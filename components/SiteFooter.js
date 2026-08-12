import Link from "next/link";
import { site } from "../lib/site";
import LogoMark from "./LogoMark";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <Link className="brand" href="/">
            <LogoMark ariaLabel="" />
            <span className="brand__text">
              <strong>{site.name}</strong>
              <span>{site.tagline}</span>
            </span>
          </Link>
          <p style={{ marginTop: "1rem" }}>
            Nassau and Suffolk County junk removal, property cleanouts, and hauling.
          </p>
        </div>
        <div>
          <p className="eyebrow">Pages</p>
          <p>
            <Link href="/services">Services</Link>
          </p>
          <p>
            <Link href="/quote">Quote</Link>
          </p>
          <p>
            <Link href="/gallery">Gallery</Link>
          </p>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <p>
            <a href={site.phoneHref}>{site.phoneDisplay}</a>
          </p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p>{site.cityState}</p>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>Copyright 2026 {site.name}</span>
      </div>
    </footer>
  );
}
