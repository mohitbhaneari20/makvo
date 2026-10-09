import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on pages and route handlers; skip static files and images.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)"],
};
