import { NextResponse } from "next/server";
import { StorageError } from "./store";

/**
 * Turn an unexpected server error into a clean JSON 500 (never an empty body).
 * Storage/config errors carry a safe, actionable message we can show the admin;
 * anything else is logged server-side and reported generically so no internal
 * detail or secret leaks to the client.
 */
export function serverErrorResponse(error, context) {
  console.error(`[${context}]`, error);
  const message =
    error instanceof StorageError
      ? error.message
      : "Something went wrong on the server. Please try again — if it persists, check the server logs.";
  return NextResponse.json({ error: message }, { status: 500 });
}
