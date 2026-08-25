import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Data layer with two modes:
 *  - Local mode (default): JSON file at .data/db.json + photo files under .data/uploads.
 *    Zero setup — works on any dev machine.
 *  - Supabase mode: set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Rows are stored as
 *    { id, data jsonb } documents (see supabase/schema.sql), photos go to the
 *    "job-photos" storage bucket.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

const COLLECTIONS = ["leads", "quotes", "invoices", "outbox"];

export const usingSupabase = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);

export function newId(prefix) {
  return `${prefix}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
}

/* ---------------- Local JSON mode ---------------- */

const seedDb = () => ({
  leads: [
    {
      id: "LC-1041",
      createdAt: "2026-08-10T12:00:00.000Z",
      name: "James K. (sample)",
      phone: "(631) 555-0199",
      email: "james@example.com",
      address: "Patchogue, NY",
      serviceType: "Junk Removal",
      preferredDate: "2026-08-13",
      notes: "Couch, mattress, and appliances. Sample lead — safe to delete.",
      photoUrls: [],
      status: "completed",
    },
  ],
  quotes: [],
  invoices: [
    {
      id: "INV-2001",
      leadId: "LC-1041",
      createdAt: "2026-08-12T12:00:00.000Z",
      total: 640,
      status: "unpaid",
      paymentLinkUrl: "",
      lineItems: [
        { description: "2-man junk removal crew", amount: 420 },
        { description: "Disposal fee", amount: 120 },
        { description: "Mileage", amount: 100 },
      ],
    },
  ],
  outbox: [],
});

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(seedDb(), null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDb(db) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

/* ---------------- Supabase mode ---------------- */

async function sb(pathname, init = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const res = await fetch(`${process.env.SUPABASE_URL}${pathname}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/* ---------------- Public API ---------------- */

export async function listRecords(collection) {
  if (!COLLECTIONS.includes(collection)) throw new Error(`Unknown collection ${collection}`);
  if (usingSupabase) {
    const rows = await sb(`/rest/v1/${collection}?select=data&order=created_at.desc`);
    return rows.map((row) => row.data);
  }
  const records = readDb()[collection] || [];
  return [...records].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function getRecord(collection, id) {
  if (usingSupabase) {
    const rows = await sb(`/rest/v1/${collection}?select=data&id=eq.${encodeURIComponent(id)}`);
    return rows[0]?.data || null;
  }
  return (readDb()[collection] || []).find((record) => record.id === id) || null;
}

export async function insertRecord(collection, record) {
  const withMeta = { createdAt: new Date().toISOString(), ...record };
  if (usingSupabase) {
    await sb(`/rest/v1/${collection}`, {
      method: "POST",
      body: JSON.stringify({ id: withMeta.id, data: withMeta }),
    });
    return withMeta;
  }
  const db = readDb();
  db[collection] = db[collection] || [];
  db[collection].unshift(withMeta);
  writeDb(db);
  return withMeta;
}

export async function updateRecord(collection, id, patch) {
  const existing = await getRecord(collection, id);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  if (usingSupabase) {
    await sb(`/rest/v1/${collection}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ data: updated }),
    });
    return updated;
  }
  const db = readDb();
  db[collection] = (db[collection] || []).map((record) => (record.id === id ? updated : record));
  writeDb(db);
  return updated;
}

/* ---------------- Photo storage ---------------- */

const SAFE_NAME = /[^a-zA-Z0-9._-]/g;

export async function savePhoto(leadId, file) {
  const safeName = `${Date.now()}-${file.name.replace(SAFE_NAME, "_").slice(-80)}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  if (usingSupabase) {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const objectPath = `${leadId}/${safeName}`;
    const res = await fetch(
      `${process.env.SUPABASE_URL}/storage/v1/object/job-photos/${objectPath}`,
      {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": file.type || "application/octet-stream",
        },
        body: bytes,
      }
    );
    if (!res.ok) throw new Error(`Photo upload failed: ${res.status} ${await res.text()}`);
    return `${process.env.SUPABASE_URL}/storage/v1/object/public/job-photos/${objectPath}`;
  }

  const dir = path.join(UPLOADS_DIR, leadId.replace(SAFE_NAME, "_"));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, safeName), bytes);
  return `/api/uploads/${leadId}/${safeName}`;
}

export function readLocalPhoto(segments) {
  // Resolve inside UPLOADS_DIR only — reject any path that escapes it.
  const resolved = path.resolve(UPLOADS_DIR, ...segments);
  if (!resolved.startsWith(path.resolve(UPLOADS_DIR) + path.sep)) return null;
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) return null;
  return fs.readFileSync(resolved);
}
