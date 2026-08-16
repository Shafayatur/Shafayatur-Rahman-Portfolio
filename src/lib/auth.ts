// Simple HMAC-based token auth using Web Crypto API (works in all runtimes)
//
// There are deliberately NO fallback values for the secret or password.
// This file is public, so a hardcoded default is equivalent to no auth at all:
// anyone could read the default here and mint a valid admin token. When the
// environment is not configured, auth fails closed and nobody gets in.

const SECRET = process.env.ADMIN_SECRET
const PASSWORD = process.env.ADMIN_PASSWORD
const TOKEN_TTL = 24 * 60 * 60 * 1000 // 24 hours

/** False when ADMIN_SECRET or ADMIN_PASSWORD is missing; admin access is then denied outright. */
export function isAuthConfigured(): boolean {
  return Boolean(SECRET && PASSWORD)
}

if (!isAuthConfigured()) {
  console.error(
    '[auth] ADMIN_SECRET and/or ADMIN_PASSWORD are not set. Admin access is disabled until both are configured.',
  )
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

async function sign(data: string, secret: string): Promise<string> {
  const key = await getKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Length-independent, constant-time string comparison.
 *
 * A plain `===` short-circuits on the first differing byte, which leaks how
 * much of a guess was correct through response timing.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = new TextEncoder().encode(a)
  const bBytes = new TextEncoder().encode(b)
  // Compare a fixed number of bytes so the loop count does not reveal lengths.
  const len = Math.max(aBytes.length, bBytes.length)
  let diff = aBytes.length ^ bBytes.length
  for (let i = 0; i < len; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0)
  }
  return diff === 0
}

export async function createToken(): Promise<string> {
  if (!SECRET) throw new Error('ADMIN_SECRET is not configured')
  const exp = Date.now() + TOKEN_TTL
  const payload = `admin:${exp}`
  const sig = await sign(payload, SECRET)
  return `${btoa(payload)}.${sig}`
}

export async function verifyToken(token: string): Promise<boolean> {
  if (!SECRET) return false
  try {
    const dotIdx = token.indexOf('.')
    if (dotIdx === -1) return false
    const payloadB64 = token.slice(0, dotIdx)
    const sig = token.slice(dotIdx + 1)
    const payload = atob(payloadB64)
    if (!payload.startsWith('admin:')) return false
    const expectedSig = await sign(payload, SECRET)
    if (!timingSafeEqual(sig, expectedSig)) return false
    const exp = Number.parseInt(payload.slice('admin:'.length), 10)
    return Number.isFinite(exp) && Date.now() < exp
  } catch {
    return false
  }
}

export function checkPassword(password: unknown): boolean {
  if (!PASSWORD) return false
  if (typeof password !== 'string') return false
  return timingSafeEqual(password, PASSWORD)
}

export async function requireAdmin(request: Request): Promise<boolean> {
  const auth = request.headers.get('Authorization') ?? ''
  if (!auth.startsWith('Bearer ')) return false
  return verifyToken(auth.slice(7))
}
