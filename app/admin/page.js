import AdminClient from "../../components/AdminClient";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Admin</p>
          <h1>Operations dashboard.</h1>
          <p className="subtle" style={{ maxWidth: "44rem", marginTop: "1rem", color: "rgba(255,255,255,0.72)" }}>
            Incoming quote requests, quoting, invoicing, and payment tracking — all in one place.
          </p>
        </div>
      </section>
      <AdminClient />
    </>
  );
}
