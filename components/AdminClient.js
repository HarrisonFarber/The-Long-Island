"use client";

import { useEffect, useMemo, useState } from "react";
import { adminSeedLeads } from "../lib/site";

export default function AdminClient() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [leads, setLeads] = useState(adminSeedLeads);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("licc_leads") || "[]");
      if (stored.length) {
        setLeads(stored);
      }
    } catch {
      setLeads(adminSeedLeads);
    }
  }, []);

  const filtered = useMemo(
    () => (statusFilter === "all" ? leads : leads.filter((lead) => lead.status === statusFilter)),
    [leads, statusFilter]
  );

  const total = leads.length;
  const quoted = leads.filter((lead) => lead.status !== "new").length;
  const converted = leads.filter((lead) =>
    ["accepted", "scheduled", "completed", "paid"].includes(lead.status)
  ).length;
  const revenue = 640;

  return (
    <section className="section section--alt">
      <div className="container">
        <div className="reports">
          <div className="report">
            <strong>{total}</strong>
            <span>Leads received</span>
          </div>
          <div className="report">
            <strong>{quoted}</strong>
            <span>Quotes sent</span>
          </div>
          <div className="report">
            <strong>{total ? Math.round((converted / total) * 100) : 0}%</strong>
            <span>Conversion rate</span>
          </div>
          <div className="report">
            <strong>${revenue}</strong>
            <span>Revenue collected</span>
          </div>
        </div>
        <div className="card" style={{ padding: "1rem" }}>
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
                <option value="new">New</option>
                <option value="quoted">Quoted</option>
                <option value="accepted">Accepted</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="paid">Paid</option>
              </select>
            </label>
          </div>
          <div style={{ overflow: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Lead ID</th>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Photos</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.id}</td>
                    <td>
                      <strong>{lead.name}</strong>
                      <br />
                      <span className="subtle">{lead.address}</span>
                    </td>
                    <td>{lead.serviceType}</td>
                    <td>{lead.photoCount || 0}</td>
                    <td>
                      <span className="status">{lead.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
