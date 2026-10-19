import { NextRequest, NextResponse } from "next/server";
import { BusinessInput } from "@/lib/types";
import { generateDeliverables } from "@/lib/templates";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { membershipStore } from "@/lib/membershipStore";

export async function POST(req: NextRequest) {
  // Defense-in-depth session check before parsing body or generating deliverables
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return NextResponse.json(
      { error: "Unauthorized: Active subscription required" },
      { status: 401 }
    );
  }

  const session = await verifySessionToken(sessionCookie);
  if (!session || !session.userId || !session.hasAccess) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or expired session" },
      { status: 401 }
    );
  }

  const isRevoked = await membershipStore.isRevoked(session.userId, session.iat);
  if (isRevoked) {
    return NextResponse.json(
      { error: "Unauthorized: Subscription has been cancelled or revoked" },
      { status: 401 }
    );
  }

  try {
    const body: BusinessInput = await req.json();

    if (!body.businessName || !body.niche || !body.location) {
      return NextResponse.json(
        { error: "businessName, niche, and location are required fields." },
        { status: 400 }
      );
    }

    const payload: BusinessInput = {
      businessName: body.businessName.trim(),
      niche: body.niche,
      specificType: body.specificType?.trim() || "Local Business",
      location: body.location.trim(),
      targetPriceAnchor: Number(body.targetPriceAnchor) || 2500,
      targetPriceFloor: Number(body.targetPriceFloor) || 800,
      currency: body.currency?.trim() || "USD",
      keyServices: Array.isArray(body.keyServices)
        ? body.keyServices.filter((s) => typeof s === "string" && s.trim().length > 0)
        : [],
    };

    const deliverables = generateDeliverables(payload);

    return NextResponse.json({
      success: true,
      data: deliverables,
      metadata: {
        generatedAt: new Date().toISOString(),
        businessName: payload.businessName,
        niche: payload.niche,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
