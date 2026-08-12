"use client";

import { useEffect, useState } from "react";
import { site } from "../lib/site";

const leadKey = "licc_leads";

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "") || fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function QuoteClient() {
  const [status, setStatus] = useState(
    "Next step: connect this form to the database, email, SMS, and admin workflow."
  );
  const [previewNames, setPreviewNames] = useState(["Upload up to 4 photos"]);

  useEffect(() => {
    const min = new Date();
    min.setDate(min.getDate() + 1);
    const input = document.getElementById("preferred_date");
    if (input) {
      input.min = min.toISOString().slice(0, 10);
    }
  }, []);

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 4);
    setPreviewNames(files.length ? files.map((file) => file.name) : ["Upload up to 4 photos"]);
  };

  const submitLead = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const lead = {
      id: `LC-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      address: String(form.get("address") || ""),
      serviceType: String(form.get("service_type") || ""),
      preferredDate: String(form.get("preferred_date") || ""),
      notes: String(form.get("notes") || ""),
      photoCount: event.currentTarget.photos?.files?.length || 0,
      status: "new",
    };

    const existing = readJSON(leadKey, []);
    existing.unshift(lead);
    writeJSON(leadKey, existing);
    setStatus(
      "Quote request saved locally. A backend endpoint can wire this to email, SMS, and the admin inbox next."
    );
    event.currentTarget.reset();
    setPreviewNames(["Upload up to 4 photos"]);
  };

  return (
    <section className="section section--alt">
      <div className="container grid grid--2">
        <form className="quote-form" onSubmit={submitLead}>
          <div className="field-grid">
            {[
              ["name", "Name"],
              ["phone", "Phone"],
              ["email", "Email", "email"],
              ["service_type", "Service type", "select"],
              ["address", "Property address"],
              ["preferred_date", "Preferred date", "date"],
            ].map(([name, label, type]) => (
              <div key={name} className="field">
                <label htmlFor={name}>{label}</label>
                {type === "select" ? (
                  <select id={name} name={name} defaultValue="Junk Removal">
                    <option>Junk Removal</option>
                    <option>Property Cleanout</option>
                    <option>Hauling</option>
                  </select>
                ) : (
                  <input id={name} name={name} type={type || "text"} required />
                )}
              </div>
            ))}
          </div>
          <div className="field" style={{ marginTop: "1rem" }}>
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Tell us about the job, access details, and any bulky items."
            />
          </div>
          <div className="field" style={{ marginTop: "1rem" }}>
            <label htmlFor="photos">Upload photos</label>
            <input
              id="photos"
              name="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <div className="upload-grid" data-photo-preview>
              {previewNames.map((name) => (
                <div key={name} className="upload-tile">
                  {name}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginTop: "1rem",
              alignItems: "center",
            }}
          >
            <button className="btn btn--primary" type="submit">
              Submit request
            </button>
            <span className="subtle">This demo stores submissions locally until the backend is connected.</span>
          </div>
          <div className="note" data-form-status style={{ marginTop: "1rem" }}>
            <strong>{status.startsWith("Next step") ? "Next step:" : "Saved:"}</strong> {status}
          </div>
        </form>
        <aside className="card service-card">
          <p className="eyebrow">What happens next</p>
          <h2>Designed to support the real operational flow.</h2>
          <ul>
            <li>Lead saved with photos and job notes</li>
            <li>Quote sent to the customer with follow-up status</li>
            <li>Accepted jobs move into scheduling and invoicing</li>
            <li>Payment link lands on the invoice page</li>
          </ul>
          <div className="note" style={{ marginTop: "1rem" }}>
            The brief calls for email and SMS notifications on each state transition. This static
            build leaves the hooks in place for that layer.
          </div>
          <p className="subtle" style={{ marginTop: "1rem" }}>
            {site.email}
          </p>
        </aside>
      </div>
    </section>
  );
}
