import { WhopUser } from "./types";

const WHOP_API_BASE = "https://api.whop.com/api/v2";

export function isDevBypassEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.DEV_BYPASS_ENABLED === "true";
}

export function getDevMockUser(): WhopUser {
  return {
    id: "user_dev_agency_pro",
    username: "AgencyProBuilder",
    email: "operator@localclientengine.com",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    hasAccess: true,
    membershipPlan: "Pro Membership ($19/mo)",
    validUntil: "2029-12-31T23:59:59Z",
  };
}

export function getWhopOAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_WHOP_CLIENT_ID || "app_test_client_id";
  const redirectUri = process.env.WHOP_REDIRECT_URI || "http://localhost:3000/api/auth/callback";
  
  if (isDevBypassEnabled()) {
    // If dev bypass is active, direct route to callback with mock code
    return `/api/auth/callback?code=mock_dev_code`;
  }

  return `https://whop.com/oauth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
}

export async function verifyWhopLicenseKey(licenseKey: string): Promise<{ valid: boolean; user?: WhopUser; error?: string }> {
  if (!licenseKey || typeof licenseKey !== "string" || licenseKey.trim().length === 0) {
    return { valid: false, error: "License key is required" };
  }

  if (isDevBypassEnabled() && licenseKey.startsWith("mock_")) {
    return { valid: true, user: getDevMockUser() };
  }

  const apiKey = process.env.WHOP_API_KEY;
  if (!apiKey) {
    return { valid: false, error: "WHOP_API_KEY is not configured on server" };
  }

  try {
    const res = await fetch(`${WHOP_API_BASE}/memberships/${encodeURIComponent(licenseKey.trim())}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return { valid: false, error: `Invalid license: ${res.statusText}` };
    }

    const data = await res.json();
    const isActive = data.status === "active" || data.valid === true;

    return {
      valid: isActive,
      user: {
        id: data.user?.id || data.id,
        username: data.user?.username || "WhopSubscriber",
        email: data.user?.email || "subscriber@whop.com",
        hasAccess: isActive,
        membershipPlan: data.plan?.name || "Pro Membership",
        validUntil: data.expires_at || undefined,
      },
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown verification error";
    return { valid: false, error: errorMessage };
  }
}

export async function exchangeWhopOAuthCode(code: string): Promise<{ success: boolean; user?: WhopUser; error?: string }> {
  if (isDevBypassEnabled() && code === "mock_dev_code") {
    return {
      success: true,
      user: getDevMockUser(),
    };
  }

  const clientId = process.env.NEXT_PUBLIC_WHOP_CLIENT_ID;
  const clientSecret = process.env.WHOP_CLIENT_SECRET;
  const redirectUri = process.env.WHOP_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

  if (!clientId || !clientSecret) {
    return { success: false, error: "Whop OAuth credentials not configured" };
  }

  try {
    const tokenRes = await fetch("https://api.whop.com/api/v2/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return { success: false, error: "Failed to exchange OAuth token" };
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile
    const userRes = await fetch(`${WHOP_API_BASE}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      return { success: false, error: "Failed to fetch Whop user profile" };
    }

    const userData = await userRes.json();

    // Verify actual product entitlement on OAuth login
    const requiredPlanIds = (process.env.WHOP_REQUIRED_PLAN_IDS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (requiredPlanIds.length === 0) {
      return { success: false, error: "WHOP_REQUIRED_PLAN_IDS is not configured on server" };
    }

    const apiKey = process.env.WHOP_API_KEY;
    if (!apiKey) {
      return { success: false, error: "WHOP_API_KEY is not configured on server" };
    }

    // Call Whop's List Memberships API using server API key to confirm user holds an entitled plan
    const membershipsRes = await fetch(
      `https://api.whop.com/api/v5/app/memberships?user_id=${encodeURIComponent(userData.id)}&valid=true`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    if (!membershipsRes.ok) {
      return { success: false, error: "Failed to verify membership status" };
    }

    const membershipsData = await membershipsRes.json();
    const memberships: Array<{ plan_id?: string; valid?: boolean }> = membershipsData.data || [];
    const hasEntitledMembership = memberships.some(
      (m) => m.valid && m.plan_id && requiredPlanIds.includes(m.plan_id)
    );

    if (!hasEntitledMembership) {
      return { success: false, error: "No active membership for this product" };
    }

    const matchingMembership = memberships.find(
      (m) => m.valid && m.plan_id && requiredPlanIds.includes(m.plan_id)
    );

    return {
      success: true,
      user: {
        id: userData.id,
        username: userData.username || "WhopUser",
        email: userData.email,
        avatar_url: userData.profile_pic_url,
        hasAccess: hasEntitledMembership,
        membershipPlan: matchingMembership?.plan_id || "Active Whop Member",
      },
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "OAuth error";
    return { success: false, error: errorMessage };
  }
}

