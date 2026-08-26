import "server-only";

/**
 * In-process sliding-window limiter (I4 not closed).
 * One process only; multi-instance hosts do not share counts.
 * Limits are engineering defaults until U11 is decided.
 */
export type RateLimitScope = "contribute" | "report" | "select";

const WINDOWS: Record<RateLimitScope, { limit: number; windowMs: number }> = {
  contribute: { limit: 5, windowMs: 10 * 60 * 1000 },
  report: { limit: 8, windowMs: 10 * 60 * 1000 },
  select: { limit: 40, windowMs: 60 * 1000 },
};

const hits = new Map<string, number[]>();
const MAX_KEYS = 8000;

export type RateLimitDecision = "allow" | "limited";

function prune(stamps: number[], windowStart: number): number[] {
  return stamps.filter((time) => time > windowStart);
}

export function consumeRateLimit(
  scope: RateLimitScope,
  clientKey: string,
): RateLimitDecision {
  const { limit, windowMs } = WINDOWS[scope];
  const now = Date.now();
  const windowStart = now - windowMs;
  const bucketKey = `${scope}:${clientKey}`;
  const next = prune(hits.get(bucketKey) ?? [], windowStart);
  if (next.length >= limit) {
    hits.set(bucketKey, next);
    return "limited";
  }
  next.push(now);
  hits.set(bucketKey, next);
  if (hits.size > MAX_KEYS) {
    const retainAfter = now - 10 * 60 * 1000;
    for (const [key, stamps] of hits) {
      const kept = prune(stamps, retainAfter);
      if (kept.length === 0) {
        hits.delete(key);
      } else {
        hits.set(key, kept);
      }
    }
  }
  return "allow";
}
