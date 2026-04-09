import { createFileRoute } from '@tanstack/react-router'
import { createMessage } from '@/lib/db'

export const Route = createFileRoute('/api/portfolio/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { name, email, subject, message } = body

          if (!name || !email || !message) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 })
          }

          const msg = await createMessage({ name, email, subject: subject ?? 'Contact Form', message })
          return Response.json({ success: true, id: msg.id }, { status: 201 })
        } catch {
          return Response.json({ error: 'Failed to save message' }, { status: 500 })
        }
      },
    },
  },
})
