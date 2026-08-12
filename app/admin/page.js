import AdminClient from "../../components/AdminClient";

export const metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Admin</p>
          <h1>Operations dashboard prototype.</h1>
          <p className="subtle" style={{ maxWidth: "54rem", marginTop: "1rem" }}>
            This view previews the requests inbox, reporting, and status tracking that the brief
            calls for. It reads from local storage so the quote form has a visible workflow right
            away.
          </p>
        </div>
      </section>
      <AdminClient />
    </>
  );
}
