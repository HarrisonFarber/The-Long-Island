"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "../lib/site";

const MAX_PHOTOS = 6;

export default function QuoteClient() {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null); // { ok, message }
  const [confirmation, setConfirmation] = useState(null); // { id } — set only after a confirmed submission
  const [previews, setPreviews] = useState([]);
  const previewsRef = useRef([]);

  useEffect(() => {
    const min = new Date();
    min.setDate(min.getDate() + 1);
    const input = document.getElementById("preferred_date");
    if (input) {
      input.min = min.toISOString().slice(0, 10);
    }
    return () => previewsRef.current.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, []);

  const handleFiles = (event) => {
    previewsRef.current.forEach((preview) => URL.revokeObjectURL(preview.url));
    const files = Array.from(event.target.files || []).slice(0, MAX_PHOTOS);
    const next = files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
    previewsRef.current = next;
    setPreviews(next);
  };

  const submitLead = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);
    setResult(null);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        body: new FormData(form),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setResult({ ok: false, message: data.error || "Something went wrong. Please try again." });
        return;
      }

      // Success is only reached after the API confirms the lead was saved (response.ok).
      form.reset();
      previewsRef.current.forEach((preview) => URL.revokeObjectURL(preview.url));
      previewsRef.current = [];
      setPreviews([]);
      setResult(null);
      setConfirmation({ id: data.id });
    } catch {
      setResult({
        ok: false,
        message: `We couldn't send your request. Please try again or text us at ${site.phoneDisplay}.`,
      });
    } finally {
      setSending(false);
    }
  };

  if (confirmation) {
    return (
      <section className="section">
        <div className="container grid grid--2">
          <div
            className="card service-card"
            data-reveal
            data-form-status
            role="status"
            aria-live="polite"
            style={{ borderColor: "rgba(105, 181, 72, 0.4)" }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "3.25rem",
                height: "3.25rem",
                borderRadius: "999px",
                background: "rgba(105, 181, 72, 0.12)",
                color: "var(--green-dark)",
                fontSize: "1.6rem",
                marginBottom: "1rem",
              }}
            >
              ✓
            </span>
            <p className="eyebrow">Request received</p>
            <h2>Thanks for submitting your quote request.</h2>
            <p style={{ color: "var(--ink-soft)", marginTop: "0.5rem" }}>
              Someone from our team will be with you shortly. We&apos;ll review your details and
              photos and follow up with a clear, no-obligation quote by email.
            </p>
            {confirmation.id && (
              <div className="note" style={{ marginTop: "1.25rem" }}>
                Your reference number is <strong>{confirmation.id}</strong> — keep it handy if you
                need to reach out.
              </div>
            )}
            <div style={{ marginTop: "1.5rem" }}>
              <button
                className="btn btn--primary"
                type="button"
                onClick={() => setConfirmation(null)}
              >
                Submit another request
              </button>
            </div>
          </div>
          <aside className="card service-card" data-reveal style={{ "--d": "120ms" }}>
            <p className="eyebrow">What happens next</p>
            <h2>From photos to a cleared space.</h2>
            <ul>
              <li>We review your details and photos right away</li>
              <li>You get a clear quote by email — no pressure, no hidden fees</li>
              <li>Accept the quote, pick a date, and the crew shows up on time</li>
              <li>We haul, sweep clean, and make payment easy</li>
            </ul>
            <p className="subtle" style={{ marginTop: "1rem" }}>
              Prefer email? Reach us at {site.email}
            </p>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container grid grid--2">
        <form className="quote-form" onSubmit={submitLead} data-reveal>
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
                  <input id={name} name={name} type={type || "text"} required={name !== "preferred_date"} />
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
            <label htmlFor="photos">Upload photos (up to {MAX_PHOTOS})</label>
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
              {previews.length ? (
                previews.map((preview) => (
                  <div
                    key={preview.url}
                    className="upload-tile"
                    style={{
                      backgroundImage: `url(${preview.url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      color: "transparent",
                    }}
                    title={preview.name}
                  >
                    {preview.name}
                  </div>
                ))
              ) : (
                <div className="upload-tile">Photos help us quote faster</div>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginTop: "1.25rem",
              alignItems: "center",
            }}
          >
            <button className="btn btn--primary" type="submit" disabled={sending}>
              {sending ? "Sending..." : "Send my quote request"}
            </button>
            <span className="subtle">No obligation — quotes are always free.</span>
          </div>
          {result && (
            <div
              className="note"
              data-form-status
              style={{
                marginTop: "1rem",
                ...(result.ok
                  ? {}
                  : { borderLeftColor: "#c0392b", background: "rgba(192, 57, 43, 0.08)" }),
              }}
            >
              {result.message}
            </div>
          )}
        </form>
        <aside className="card service-card" data-reveal style={{ "--d": "120ms" }}>
          <p className="eyebrow">What happens next</p>
          <h2>From photos to a cleared space.</h2>
          <ul>
            <li>We review your details and photos right away</li>
            <li>You get a clear quote by email — no pressure, no hidden fees</li>
            <li>Accept the quote, pick a date, and the crew shows up on time</li>
            <li>We haul, sweep clean, and make payment easy</li>
          </ul>
          <div className="note" style={{ marginTop: "1rem" }}>
            Tip: wide shots of the whole room or pile help us quote faster and more accurately than
            close-ups.
          </div>
          <p className="subtle" style={{ marginTop: "1rem" }}>
            Prefer email? Reach us at {site.email}
          </p>
        </aside>
      </div>
    </section>
  );
}
