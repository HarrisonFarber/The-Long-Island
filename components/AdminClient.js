"use client";

import { useEffect, useMemo, useState } from "react";

const STATUSES = ["new", "quoted", "accepted", "scheduled", "completed", "paid", "closed_lost"];

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}

function LoginCard({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="quote-form" style={{ maxWidth: "26rem", margin: "0 auto" }}>
      <p className="eyebrow">Admin login</p>
      <h2 style={{ marginBottom: "1rem" }}>Owner access</h2>
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
          />
        </div>
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button className="btn btn--primary" type="submit" disabled={busy}>
            {busy ? "Checking..." : "Log in"}
          </button>
          {error && <span style={{ color: "#c0392b" }}>{error}</span>}
        </div>
        {process.env.NODE_ENV !== "production" && (
          <p className="subtle" style={{ marginTop: "1rem", fontSize: "0.88rem" }}>
            Dev default password: <code>cleanout-admin</code> — set ADMIN_PASSWORD in .env.local to
            change it.
          </p>
        )}
      </form>
    </div>
  );
}

function LeadDetail({ lead, quotes, invoices, onAction, busy }) {
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [items, setItems] = useState([{ description: "Cleanout service", amount: "" }]);

  const leadQuote = quotes.find((quote) => quote.id === lead.quoteId);
  const leadInvoice = invoices.find((invoice) => invoice.id === lead.invoiceId);

  const setItem = (index, key, value) =>
    setItems(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));

  return (
    <div className="card" style={{ padding: "1.4rem", marginTop: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <p className="eyebrow">{lead.id}</p>
          <h3>{lead.name}</h3>
          <p style={{ marginTop: "0.4rem" }}>
            <a href={`tel:${lead.phone}`}>{lead.phone}</a> ·{" "}
            <a href={`mailto:${lead.email}`}>{lead.email}</a>
          </p>
          <p className="subtle">
            {lead.serviceType} — {lead.address}
            {lead.preferredDate ? ` — preferred ${lead.preferredDate}` : ""}
          </p>
          {lead.notes && <p style={{ marginTop: "0.6rem" }}>&ldquo;{lead.notes}&rdquo;</p>}
        </div>
        <label className="field" style={{ minWidth: "180px" }}>
          <span className="subtle">Status</span>
          <select
            value={lead.status}
            disabled={busy}
            onChange={(event) => onAction("status", lead, { status: event.target.value })}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      {lead.photoUrls?.length > 0 && (
        <div className="upload-grid" style={{ marginTop: "1rem", maxWidth: "36rem" }}>
          {lead.photoUrls.map((url) => (
            <a key={url} href={url} target="_blank" rel="noreferrer">
              <div
                className="upload-tile"
                style={{
                  backgroundImage: `url(${url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "transparent",
                }}
              >
                photo
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="grid grid--2" style={{ marginTop: "1.25rem" }}>
        <div className="report">
          <p className="eyebrow" style={{ marginBottom: "0.6rem" }}>
            Quote
          </p>
          {leadQuote ? (
            <p>
              <strong>${leadQuote.amount}</strong> sent{" "}
              {new Date(leadQuote.sentAt).toLocaleDateString()}
              {leadQuote.acceptedAt ? " — accepted ✔" : " — awaiting reply"}
            </p>
          ) : (
            <>
              <div className="field">
                <label>Amount ($)</label>
                <input
                  type="number"
                  min="1"
                  value={quoteAmount}
                  onChange={(event) => setQuoteAmount(event.target.value)}
                />
              </div>
              <div className="field" style={{ marginTop: "0.6rem" }}>
                <label>Notes to customer</label>
                <input
                  value={quoteNotes}
                  onChange={(event) => setQuoteNotes(event.target.value)}
                  placeholder="Includes labor, disposal, and sweep-up"
                />
              </div>
              <button
                className="btn btn--primary"
                style={{ marginTop: "0.85rem" }}
                disabled={busy || !quoteAmount}
                onClick={() =>
                  onAction("send-quote", lead, { amount: Number(quoteAmount), notes: quoteNotes })
                }
              >
                Send quote
              </button>
            </>
          )}
        </div>

        <div className="report">
          <p className="eyebrow" style={{ marginBottom: "0.6rem" }}>
            Invoice
          </p>
          {leadInvoice ? (
            <p>
              <strong>
                {leadInvoice.id} — ${leadInvoice.total.toFixed(2)}
              </strong>{" "}
              ({leadInvoice.status})
              <br />
              <a href={`/pay/${leadInvoice.id}`} target="_blank" rel="noreferrer">
                View payment page →
              </a>
            </p>
          ) : (
            <>
              {items.map((item, index) => (
                <div key={index} style={{ display: "flex", gap: "0.5rem", marginTop: index ? "0.5rem" : 0 }}>
                  <input
                    style={{ flex: 2, minWidth: 0 }}
                    className="field-input"
                    value={item.description}
                    placeholder="Description"
                    onChange={(event) => setItem(index, "description", event.target.value)}
                  />
                  <input
                    className="field-input"
                    style={{ flex: 1, minWidth: 0 }}
                    type="number"
                    min="0"
                    value={item.amount}
                    placeholder="$"
                    onChange={(event) => setItem(index, "amount", event.target.value)}
                  />
                </div>
              ))}
              <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.85rem", flexWrap: "wrap" }}>
                <button
                  className="btn btn--ghost"
                  onClick={() => setItems([...items, { description: "", amount: "" }])}
                >
                  + Line
                </button>
                <button
                  className="btn btn--primary"
                  disabled={busy || !items.some((item) => item.description && Number(item.amount) > 0)}
                  onClick={() => onAction("invoice", lead, { leadId: lead.id, lineItems: items })}
                >
                  Create invoice &amp; send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminClient() {
  const [auth, setAuth] = useState("loading"); // loading | login | ready
  const [data, setData] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState("");

  const load = async () => {
    try {
      const next = await api("/api/admin/data");
      setData(next);
      setAuth("ready");
    } catch (error) {
      if (error.status === 401) setAuth("login");
      else setFlash(error.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onAction = async (action, lead, payload) => {
    setBusy(true);
    setFlash("");
    try {
      if (action === "status") {
        await api(`/api/leads/${lead.id}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else if (action === "send-quote") {
        await api(`/api/leads/${lead.id}/send-quote`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setFlash(`Quote emailed to ${lead.email}.`);
      } else if (action === "invoice") {
        await api("/api/invoices", { method: "POST", body: JSON.stringify(payload) });
        setFlash(`Invoice created and emailed to ${lead.email}.`);
      }
      await load();
    } catch (error) {
      setFlash(error.message);
    } finally {
      setBusy(false);
    }
  };

  const leads = data?.leads || [];
  const filtered = useMemo(
    () => (statusFilter === "all" ? leads : leads.filter((lead) => lead.status === statusFilter)),
    [leads, statusFilter]
  );
  const selected = leads.find((lead) => lead.id === selectedId);
  const revenue = (data?.invoices || [])
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.total, 0);
  const converted = leads.filter((lead) =>
    ["accepted", "scheduled", "completed", "paid"].includes(lead.status)
  ).length;

  if (auth === "loading") {
    return (
      <section className="section">
        <div className="container">
          <p className="subtle">Loading dashboard...</p>
        </div>
      </section>
    );
  }

  if (auth === "login") {
    return (
      <section className="section">
        <div className="container">
          <LoginCard onLogin={load} />
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        {data?.config && (
          <div className="note" style={{ marginBottom: "1.25rem" }}>
            Mode: <strong>{data.config.usingSupabase ? "Supabase" : "local file store"}</strong> · Email:{" "}
            <strong>{data.config.emailConfigured ? "Resend" : "outbox (not sending)"}</strong> · Payments:{" "}
            <strong>{data.config.stripeConfigured ? "Stripe" : "demo mode"}</strong>
            {data.config.defaultPassword && (
              <>
                {" "}
                · <strong style={{ color: "#c0392b" }}>Using default admin password — set ADMIN_PASSWORD before launch.</strong>
              </>
            )}
          </div>
        )}

        <div className="reports">
          <div className="report">
            <strong>{leads.length}</strong>
            <span>Leads received</span>
          </div>
          <div className="report">
            <strong>{(data?.quotes || []).length}</strong>
            <span>Quotes sent</span>
          </div>
          <div className="report">
            <strong>{leads.length ? Math.round((converted / leads.length) * 100) : 0}%</strong>
            <span>Conversion rate</span>
          </div>
          <div className="report">
            <strong>${revenue.toFixed(0)}</strong>
            <span>Revenue collected</span>
          </div>
        </div>

        {flash && (
          <div className="note" style={{ marginBottom: "1rem" }}>
            {flash}
          </div>
        )}

        <div className="card" style={{ padding: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            <div>
              <p className="eyebrow">Requests inbox</p>
              <h2>Newest leads first</h2>
            </div>
            <label className="field" style={{ minWidth: "220px" }}>
              <span className="subtle">Filter by status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div style={{ overflow: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Photos</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedId(selectedId === lead.id ? null : lead.id)}
                    style={{
                      cursor: "pointer",
                      background: selectedId === lead.id ? "rgba(105, 181, 72, 0.08)" : undefined,
                    }}
                  >
                    <td>{lead.id}</td>
                    <td>
                      <strong>{lead.name}</strong>
                      <br />
                      <span className="subtle">{lead.address}</span>
                    </td>
                    <td>{lead.serviceType}</td>
                    <td>{lead.photoUrls?.length || 0}</td>
                    <td>
                      <span className="status">{lead.status}</span>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={5} className="subtle">
                      No leads yet — submissions from the quote form land here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <LeadDetail
            lead={selected}
            quotes={data?.quotes || []}
            invoices={data?.invoices || []}
            onAction={onAction}
            busy={busy}
          />
        )}

        {(data?.outbox || []).length > 0 && (
          <div className="card" style={{ padding: "1.25rem", marginTop: "1.25rem" }}>
            <p className="eyebrow">Recent notifications</p>
            <div style={{ overflow: "auto" }}>
              <table className="table">
                <tbody>
                  {data.outbox.map((mail) => (
                    <tr key={mail.id}>
                      <td className="subtle" style={{ whiteSpace: "nowrap" }}>
                        {mail.createdAt ? new Date(mail.createdAt).toLocaleString() : ""}
                      </td>
                      <td>{mail.to}</td>
                      <td>
                        <strong>{mail.subject}</strong>
                      </td>
                      <td>
                        <span className="status">{mail.sentVia}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
