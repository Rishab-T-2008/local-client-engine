import { NextRequest, NextResponse } from "next/server";
import { exchangeWhopOAuthCode, isDevBypassEnabled, getDevMockUser } from "@/lib/whop";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from "@/lib/session";
import { membershipStore } from "@/lib/membershipStore";
import { WhopUser } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  let user: WhopUser | null = null;

  // Strict check: Only allow dev mock user when DEV_BYPASS_ENABLED is true in non-production AND code === "mock_dev_code"
  if (isDevBypassEnabled() && code === "mock_dev_code") {
    user = getDevMockUser();
  } else if (code) {
    const result = await exchangeWhopOAuthCode(code);
    if (result.success && result.user) {
      user = result.user;
    } else {
      return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(result.error || "auth_failed")}`, req.url));
    }
  } else {
    return NextResponse.redirect(new URL("/?error=missing_code", req.url));
  }

  if (!user) {
    return NextResponse.redirect(new URL("/?error=auth_failed", req.url));
  }

  // Clear any prior revocation on fresh login (Phase 4)
  await membershipStore.markActive(user.id);

  // Generate signed JWT session token (Phase 2)
  const sessionToken = await createSessionToken(user);

  const response = NextResponse.redirect(new URL("/dashboard", req.url));
  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });

  return response;
}
