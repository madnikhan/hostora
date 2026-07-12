const hits = new Map<string, { count: number; reset: number }>();

/** Simple in-memory rate limit (per server instance). */
export function rateLimit(
  key: string,
  limit = 8,
  windowMs = 60_000,
): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const row = hits.get(key);
  if (!row || now > row.reset) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return { ok: true };
  }
  if (row.count >= limit) {
    return { ok: false, retryAfterSec: Math.ceil((row.reset - now) / 1000) };
  }
  row.count += 1;
  return { ok: true };
}
