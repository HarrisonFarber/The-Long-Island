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

// Serverless hosts (Vercel, AWS Lambda, Netlify) have a read-only filesystem,
// so the local JSON file store cannot be used there — persistent data must live
// in Supabase.
const IS_SERVERLESS = Boolean(
  process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT ||
    process.env.NETLIFY
);

const STORAGE_SETUP_MESSAGE =
  "Persistent storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY " +
  "(and run supabase/schema.sql) — the local file store cannot run on a read-only serverless filesystem.";

/**
 * Thrown when the data layer can't reach a persistent store. Its message is
 * safe to surface to the admin UI (it contains setup guidance, never secrets).
 */
export class StorageError extends Error {
  constructor(message) {
    super(message);
    this.name = "StorageError";
  }
}

// Guard the file-store code paths: if we're on a serverless host without
// Supabase configured, fail loudly with setup guidance instead of an opaque
// ENOENT from mkdir on the read-only filesystem.
function assertFileStoreUsable() {
  if (IS_SERVERLESS) throw new StorageError(STORAGE_SETUP_MESSAGE);
}

// PostgREST 404s on a doubled slash, so normalize a trailing slash away.
function supabaseBaseUrl() {
  return (process.env.SUPABASE_URL || "").replace(/\/$/, "");
}

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
  assertFileStoreUsable();
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(seedDb(), null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch (error) {
    if (error instanceof StorageError) throw error;
    if (error.code === "EROFS" || error.code === "ENOENT" || error.code === "EACCES") {
      throw new StorageError(STORAGE_SETUP_MESSAGE);
    }
    throw error;
  }
}

function writeDb(db) {
  assertFileStoreUsable();
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (error) {
    if (error.code === "EROFS" || error.code === "ENOENT" || error.code === "EACCES") {
      throw new StorageError(STORAGE_SETUP_MESSAGE);
    }
    throw error;
  }
}

/* ---------------- Supabase mode ---------------- */

async function sb(pathname, init = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let res;
  try {
    res = await fetch(`${supabaseBaseUrl()}${pathname}`, {
      ...init,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...init.headers,
      },
    });
  } catch (error) {
    // Network/DNS failure reaching Supabase — never includes the key.
    throw new StorageError(`Could not reach the database: ${error.message}`);
  }
  if (!res.ok) {
    const body = await res.text();
    // Log the full response server-side; surface a safe, key-free message.
    console.error(`Supabase ${res.status} on ${pathname}: ${body}`);
    if (res.status === 401 || res.status === 403) {
      throw new StorageError("Database rejected the credentials — check SUPABASE_SERVICE_ROLE_KEY.");
    }
    if (res.status === 404) {
      throw new StorageError(
        "Database table not found — run supabase/schema.sql in your Supabase project."
      );
    }
    throw new StorageError(`Database request failed (${res.status}).`);
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
    const base = supabaseBaseUrl();
    const objectPath = `${leadId}/${safeName}`;
    const res = await fetch(`${base}/storage/v1/object/job-photos/${objectPath}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": file.type || "application/octet-stream",
      },
      body: bytes,
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`Photo upload failed: ${res.status} ${body}`);
      throw new StorageError(
        "Photo upload failed — check the Supabase 'job-photos' storage bucket exists and is public."
      );
    }
    return `${base}/storage/v1/object/public/job-photos/${objectPath}`;
  }

  assertFileStoreUsable();
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
