import type { NextRequest } from "next/server";
import { getSearchSuggestions } from "@/lib/products";

/** Suggestions for the search box while someone types: GET /api/search?q=sari */
export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  // The catalogue only changes with a new deploy, so a browser can reuse an answer for a few minutes.
  return Response.json(getSearchSuggestions(q), { headers: { "Cache-Control": "public, max-age=300" } });
}
