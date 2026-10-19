import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { WhopUser } from "./types";

export interface SessionPayload extends JWTPayload {
  userId: string;
  username: string;
  email: string;
  avatar_url?: string;
  hasAccess: boolean;
  membershipPlan?: string;
  iat?: number;
  exp?: number;
}

export const SESSION_COOKIE_NAME = "whop_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24 hours

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be configured with at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Creates and signs an HS256 JWT session token containing user details.
 */
export async function createSessionToken(user: WhopUser): Promise<string> {
  const secretKey = getSecretKey();

  return await new SignJWT({
    userId: user.id,
    username: user.username,
    email: user.email,
    avatar_url: user.avatar_url || "",
    hasAccess: user.hasAccess,
    membershipPlan: user.membershipPlan || "",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);
}

/**
 * Verifies a JWT session token and returns the payload.
 * Returns null on any verification failure or invalid token without throwing.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    if (!payload.userId || typeof payload.userId !== "string") {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

