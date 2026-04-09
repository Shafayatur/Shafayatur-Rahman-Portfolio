import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/auth'
import { getMessages, markMessageRead } from '@/lib/db'

export const Route = createFileRoute('/api/portfolio/messages')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!(await requireAdmin(request))) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const messages = await getMessages()
        return Response.json(messages)
      },

      PUT: async ({ request }) => {
        if (!(await requireAdmin(request))) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const { id } = await request.json()
        await markMessageRead(id)
        return Response.json({ success: true })
      },
    },
  },
})
