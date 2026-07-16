import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Route protection + auth-session refresh.
 *
 * - Supabase configured (prod): delegate to updateSession, which refreshes the
 *   auth cookie and redirects unauthenticated users away from protected routes.
 * - Supabase NOT configured (dev demo mode): pass-through, no auth.
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const configured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!configured) return NextResponse.next();
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on all request paths except:
     * - _next/static and _next/image (build assets)
     * - favicon and common static image files
     * The public /sign/:token and /login, /signup paths are allowed through
     * inside the middleware itself (see isPublicPath).
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
