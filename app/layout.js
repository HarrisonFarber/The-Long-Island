import "../styles.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: {
    default: "The Long Island Cleanout Company",
    template: "%s | The Long Island Cleanout Company",
  },
  description:
    "Long Island junk removal, property cleanouts, and hauling for Nassau and Suffolk County. Fast quotes, reliable crews, and local service.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/logo.svg" type="image/svg+xml" />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <a className="floating-call" href="tel:+15165550100">
          Call now
        </a>
      </body>
    </html>
  );
}
