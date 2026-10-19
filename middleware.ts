import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { membershipStore } from "@/lib/membershipStore";

export const config = {
  matcher: ["/dashboard/:path*", "/api/generate"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  let isAuthorized = false;

  if (sessionCookie) {
    const payload = await verifySessionToken(sessionCookie);
    if (payload && payload.userId && payload.hasAccess) {
      // Real-time revocation check (Phase 4)
      const isRevoked = await membershipStore.isRevoked(payload.userId, payload.iat);
      if (!isRevoked) {
        isAuthorized = true;
      }
    }
  }

  if (!isAuthorized) {
    // Return 401 JSON for API requests
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized: Active subscription required" },
        { status: 401 }
      );
    }

    // Redirect dashboard requests to landing page with error parameter
    const redirectUrl = new URL("/?error=subscription_required", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

