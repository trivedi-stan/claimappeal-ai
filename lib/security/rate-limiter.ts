/**
 * In-memory sliding window rate limiter for Next.js API routes.
 * Suitable for serverless runtime and containerized deployments.
 */

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory store for rate limiting
const store = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      // Remove timestamps older than 1 hour
      record.timestamps = record.timestamps.filter((ts) => now - ts < 3600000);
      if (record.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 300000);
}

export interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check and record a rate-limit event for an identifier (e.g. IP or userId).
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 60, windowSeconds: 60 }
): RateLimitResult {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const windowStart = now - windowMs;

  let record = store.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    store.set(identifier, record);
  }

  // Filter out timestamps outside the active window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  const count = record.timestamps.length;
  const remaining = Math.max(0, options.limit - count);
  const oldestTimestamp = record.timestamps[0] ?? now;
  const reset = Math.ceil((oldestTimestamp + windowMs) / 1000);

  if (count >= options.limit) {
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      reset,
    };
  }

  // Record this hit
  record.timestamps.push(now);

  return {
    success: true,
    limit: options.limit,
    remaining: remaining - 1,
    reset,
  };
}

/**
 * Pre-configured rate limits for different endpoint types:
 */
export const RATE_LIMITS = {
  /** General read endpoints: 100 req/min */
  standard: { limit: 100, windowSeconds: 60 },
  /** Mutation endpoints: 30 req/min */
  mutation: { limit: 30, windowSeconds: 60 },
  /** Expensive AI generation: 5 req/min */
  generation: { limit: 5, windowSeconds: 60 },
  /** Auth endpoints (login/signup attempts): 10 req/min */
  auth: { limit: 10, windowSeconds: 60 },
} as const;
