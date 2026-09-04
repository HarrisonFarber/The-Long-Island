"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, site } from "../lib/site";
import LogoMark from "./LogoMark";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="topbar">
        <div className="container topbar__inner">
          <div className="topbar__meta">
            <span>{site.serviceArea}</span>
          </div>
          <div className="topbar__actions">
            <a href={site.smsHref}>Text {site.phoneDisplay}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="brand" href="/">
            <LogoMark ariaLabel={site.name} />
            <span className="brand__text">
              <strong>The Long Island</strong>
              <span>Cleanout Company</span>
            </span>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            data-menu-toggle
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
          </button>
          <nav className={`nav ${open ? "is-open" : ""}`} data-nav>
            {navLinks.map((link) => {
              const linkPath = new URL(link.href, "http://localhost").pathname;
              const active = pathname === linkPath;
              return (
                <Link
                  key={link.href}
                  data-nav-link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="header-actions">
            <Link className="btn btn--ghost" href="/quote">
              Get a Quote
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
