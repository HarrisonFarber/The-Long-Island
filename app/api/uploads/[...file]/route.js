import { NextResponse } from "next/server";
import { readLocalPhoto } from "../../../../lib/server/store";

const TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".heic": "image/heic",
};

export async function GET(request, { params }) {
  const { file } = await params;
  const bytes = readLocalPhoto(file);
  if (!bytes) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const ext = `.${file[file.length - 1].split(".").pop()}`.toLowerCase();
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
