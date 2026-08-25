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
          <p style={{ marginTop: "1.25rem", maxWidth: "26rem" }}>
            Junk removal, property cleanouts, and hauling for Nassau and Suffolk County. Local
            crews, honest quotes, and spaces you can use again.
          </p>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <div className="footer__links">
            <Link href="/services">Services</Link>
            <Link href="/quote">Get a Quote</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <div className="footer__links">
            <a href={site.phoneHref}>{site.phoneDisplay}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span>{site.serviceArea}</span>
          </div>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>&copy; 2026 {site.name}. All rights reserved.</span>
        <span>{site.tagline}</span>
      </div>
    </footer>
  );
}
