import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "whop_session";
const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || "freelance_studio_os_master_session_secret_32_characters_minimum";
  return new TextEncoder().encode(secret);
}

/**
 * GET /api/whop-verify
 * Checks if current request has a valid Whop session cookie.
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });

    return NextResponse.json({
      authenticated: true,
      licenseKey: (payload.licenseKey as string) || "ACTIVE",
      tier: (payload.tier as string) || "PRO",
      username: (payload.username as string) || "Studio Pro Member",
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

/**
 * POST /api/whop-verify
 * Validates Whop license key and sets signed 7-day session cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { licenseKey } = body;

    if (!licenseKey || typeof licenseKey !== "string" || !licenseKey.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid Whop license key." },
        { status: 400 }
      );
    }

    const trimmedKey = licenseKey.trim();
    const masterPasskey = process.env.MASTER_PASSKEY || "DEMO-WHOP-2026";

    let isValid = false;
    let failureReason = "Invalid license key. Please check your Whop dashboard or use DEMO-WHOP-2026.";

    // 1. Master testing/demo key check (DEMO-WHOP-2026 or MASTER_PASSKEY)
    if (trimmedKey === "DEMO-WHOP-2026" || trimmedKey === masterPasskey) {
      isValid = true;
    }
    // 2. Real Whop V2 API validation if live WHOP_API_KEY is configured
    else if (
      process.env.WHOP_API_KEY &&
      process.env.WHOP_API_KEY !== "whop_api_key_test_12345" &&
      !process.env.WHOP_API_KEY.includes("test_")
    ) {
      try {
        const whopRes = await fetch(
          `https://api.whop.com/api/v2/memberships/${encodeURIComponent(trimmedKey)}/validate_license`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (whopRes.ok) {
          const data = await whopRes.json();
          if (data.valid === true || data.status === "valid" || data.action === "allow") {
            isValid = true;
          } else {
            failureReason = data.error || data.message || "License key is invalid or expired on Whop.";
          }
        } else {
          failureReason = "Whop returned an error validating this license key.";
        }
      } catch (err: any) {
        console.error("Whop API validation request error:", err);
        failureReason = "Unable to connect to Whop verification servers.";
      }
    }
    // 3. Fallback when WHOP_API_KEY is not yet configured in .env.local
    else {
      if (
        trimmedKey.startsWith("whop_") ||
        trimmedKey.startsWith("pass_") ||
        trimmedKey.length >= 12
      ) {
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json({ success: false, error: failureReason }, { status: 401 });
    }

    // 4. Sign HS256 JWT using jose
    const secretKey = getSecretKey();
    const sessionToken = await new SignJWT({
      licenseKey: trimmedKey,
      tier: "PRO",
      userId: `whop_${trimmedKey.slice(0, 16)}`,
      username: trimmedKey === "DEMO-WHOP-2026" ? "Demo Agency Operator" : "Studio Pro Member",
      email: "subscriber@whop.member",
      hasAccess: true,
      membershipPlan: "Freelance Studio OS (PRO)",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);

    const response = NextResponse.json({
      success: true,
      licenseKey: trimmedKey,
      tier: "PRO",
      message: "License verified successfully! Access granted to Freelance Studio OS.",
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SEVEN_DAYS_SECONDS,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("whop-verify error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during verification." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/whop-verify
 * Clears session cookie on logout.
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

