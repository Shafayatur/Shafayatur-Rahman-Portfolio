/**
 * Per-IP sliding-window limiter for the public assistant endpoints.
 *
 * Purpose is quota fairness, not security: a free Gemini key has a daily
 * request ceiling, and without this one visitor holding down a button could
 * spend it so real recruiters get errors.
 *
 * Caveat: state is per server instance. On serverless the effective limit is
 * looser than the numbers below because requests spread across instances.
 * That is acceptable here — a free key cannot generate a bill, so the worst
 * case is quota exhaustion, which the caller already degrades gracefully.
 */

interface Window {
  hits: Array<number>
}

const buckets = new Map<string, Window>()

/** Drop idle buckets so the map cannot grow without bound. */
function sweep(now: number, windowMs: number) {
  if (buckets.size < 5000) return
  for (const [key, win] of buckets) {
    if (win.hits.every((t) => now - t > windowMs)) buckets.delete(key)
  }
}

export interface RateLimitResult {
  allowed: boolean
  /** Seconds until the caller may retry. Only meaningful when blocked. */
  retryAfter: number
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now()
  sweep(now, windowMs)

  const win = buckets.get(key) ?? { hits: [] }
  win.hits = win.hits.filter((t) => now - t < windowMs)

  if (win.hits.length >= limit) {
    const oldest = Math.min(...win.hits)
    buckets.set(key, win)
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)) }
  }

  win.hits.push(now)
  buckets.set(key, win)
  return { allowed: true, retryAfter: 0 }
}

/**
 * Best-effort client identity.
 *
 * Proxy headers are spoofable, so this is a fairness signal, not an
 * authentication one.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}
