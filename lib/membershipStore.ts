/**
 * Membership Revocation Store Interface and In-Memory Implementation
 * 
 * Defines the contract for tracking real-time membership cancellations and revocations,
 * ensuring access is cut off immediately without waiting for JWT expiration.
 */

export interface MembershipStore {
  /**
   * Mark a user's membership as revoked at the specified timestamp in seconds.
   */
  markRevoked(userId: string, revokedAtSeconds: number): Promise<void> | void;

  /**
   * Mark a user's membership as active, clearing any prior revocation status.
   */
  markActive(userId: string): Promise<void> | void;

  /**
   * Check if a user's membership has been revoked.
   * If sinceIssuedAtSeconds is provided, returns true if the revocation occurred
   * at or after the token's issued-at timestamp.
   */
  isRevoked(userId: string, sinceIssuedAtSeconds?: number): Promise<boolean>;
}

/**
 * Default in-memory implementation of MembershipStore using a JavaScript Map.
 * 
 * ARCHITECTURE NOTE FOR SERVERLESS / PRODUCTION DEPLOYMENTS:
 * This in-memory version stores revocation timestamps in process memory. In serverless
 * or multi-container environments (such as Vercel, AWS Lambda, or Kubernetes clusters),
 * memory is not shared across isolated serverless instances.
 * For production multi-instance deployments, swap this implementation for an external
 * fast key-value store such as Redis (e.g. Upstash Redis, AWS ElastiCache) or Vercel KV.
 * The MembershipStore interface makes this a one-line replacement:
 *   export const membershipStore = new RedisMembershipStore(redisClient);
 */
export class InMemoryMembershipStore implements MembershipStore {
  // Map of userId -> revokedAt timestamp in seconds
  private revokedUsers: Map<string, number> = new Map();

  markRevoked(userId: string, revokedAtSeconds: number = Math.floor(Date.now() / 1000)): void {
    if (!userId) return;
    this.revokedUsers.set(userId, revokedAtSeconds);
  }

  markActive(userId: string): void {
    if (!userId) return;
    this.revokedUsers.delete(userId);
  }

  async isRevoked(userId: string, sinceIssuedAtSeconds?: number): Promise<boolean> {
    if (!userId) return false;
    const revokedAt = this.revokedUsers.get(userId);
    if (revokedAt === undefined) {
      return false;
    }

    // If a token's issued-at timestamp is provided, check if the revocation happened
    // at or after the session was created.
    if (sinceIssuedAtSeconds !== undefined) {
      return revokedAt >= sinceIssuedAtSeconds;
    }

    return true;
  }
}

// Export singleton instance
export const membershipStore: MembershipStore = new InMemoryMembershipStore();

