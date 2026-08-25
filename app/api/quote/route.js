import { NextResponse } from "next/server";
import { insertRecord, savePhoto, newId } from "../../../lib/server/store";
import { notifyNewLead } from "../../../lib/server/notify";

const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export async function POST(request) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const text = (key, max = 300) => String(form.get(key) || "").trim().slice(0, max);
  const lead = {
    id: newId("LC"),
    name: text("name", 120),
    phone: text("phone", 40),
    email: text("email", 200),
    address: text("address"),
    serviceType: text("service_type", 60) || "Junk Removal",
    preferredDate: text("preferred_date", 20),
    notes: text("notes", 2000),
    photoUrls: [],
    status: "new",
  };

  if (!lead.name || !lead.phone || !lead.email || !lead.address) {
    return NextResponse.json(
      { error: "Name, phone, email, and address are required." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const photos = form
    .getAll("photos")
    .filter((file) => typeof file === "object" && file?.size > 0)
    .slice(0, MAX_PHOTOS);

  for (const photo of photos) {
    if (!photo.type?.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files can be uploaded." }, { status: 400 });
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: "Each photo must be under 10MB." }, { status: 400 });
    }
  }

  try {
    for (const photo of photos) {
      lead.photoUrls.push(await savePhoto(lead.id, photo));
    }
    await insertRecord("leads", lead);
    await notifyNewLead(lead);
  } catch (error) {
    console.error("Quote submission failed:", error);
    return NextResponse.json(
      { error: "Something went wrong saving your request. Please call us instead." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: lead.id });
}
