import { createFileRoute } from '@tanstack/react-router'
import { checkPassword, createToken, isAuthConfigured } from '@/lib/auth'
import { checkRateLimit, clientKey } from '@/lib/rate-limit'

export const Route = createFileRoute('/api/admin/login')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAuthConfigured()) {
          return Response.json(
            { error: 'Admin access is not configured.' },
            { status: 503 },
          )
        }

        // A single password with no lockout is otherwise brute-forceable.
        const limit = checkRateLimit(`login:${clientKey(request)}`, {
          limit: 5,
          windowMs: 10 * 60_000,
        })
        if (!limit.allowed) {
          return Response.json(
            { error: 'Too many attempts. Try again later.' },
            { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
          )
        }

        try {
          const { password } = await request.json()
          if (!checkPassword(password)) {
            return Response.json({ error: 'Invalid password' }, { status: 401 })
          }
          const token = await createToken()
          return Response.json({ token })
        } catch {
          return Response.json({ error: 'Login failed' }, { status: 500 })
        }
      },
    },
  },
})
