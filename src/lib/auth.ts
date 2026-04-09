// Simple HMAC-based token auth using Web Crypto API (works in all runtimes)

const SECRET = process.env.ADMIN_SECRET ?? 'portfolio-secret-change-in-production'
const PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin123'
const TOKEN_TTL = 24 * 60 * 60 * 1000 // 24 hours

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

async function sign(data: string): Promise<string> {
  const key = await getKey()
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function createToken(): Promise<string> {
  const exp = Date.now() + TOKEN_TTL
  const payload = `admin:${exp}`
  const sig = await sign(payload)
  return `${btoa(payload)}.${sig}`
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const dotIdx = token.indexOf('.')
    if (dotIdx === -1) return false
    const payloadB64 = token.slice(0, dotIdx)
    const sig = token.slice(dotIdx + 1)
    const payload = atob(payloadB64)
    const expectedSig = await sign(payload)
    if (sig !== expectedSig) return false
    const exp = parseInt(payload.split(':')[1] ?? '0', 10)
    return Date.now() < exp
  } catch {
    return false
  }
}

export function checkPassword(password: string): boolean {
  return password === PASSWORD
}

export async function requireAdmin(request: Request): Promise<boolean> {
  const auth = request.headers.get('Authorization') ?? ''
  if (!auth.startsWith('Bearer ')) return false
  return verifyToken(auth.slice(7))
}
