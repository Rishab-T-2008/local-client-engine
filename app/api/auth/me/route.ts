import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { membershipStore } from "@/lib/membershipStore";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return NextResponse.json({ user: null });
  }

  const payload = await verifySessionToken(sessionCookie);
  if (!payload || !payload.userId) {
    return NextResponse.json({ user: null });
  }

  // Check if session has been revoked via webhook or administrative action
  const isRevoked = await membershipStore.isRevoked(payload.userId, payload.iat);
  if (isRevoked) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: payload.userId,
      username: payload.username,
      email: payload.email,
      avatar_url: payload.avatar_url,
      hasAccess: payload.hasAccess,
      membershipPlan: payload.membershipPlan,
    },
  });
}

