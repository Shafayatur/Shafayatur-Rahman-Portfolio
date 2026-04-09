import { createFileRoute } from '@tanstack/react-router'
import { checkPassword, createToken } from '@/lib/auth'

export const Route = createFileRoute('/api/admin/login')({
  server: {
    handlers: {
      POST: async ({ request }) => {
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
