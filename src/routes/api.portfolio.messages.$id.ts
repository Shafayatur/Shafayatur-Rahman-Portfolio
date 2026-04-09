import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/auth'
import { deleteMessage } from '@/lib/db'

export const Route = createFileRoute('/api/portfolio/messages/$id')({
  server: {
    handlers: {
      DELETE: async ({ request, params }) => {
        if (!(await requireAdmin(request))) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const ok = await deleteMessage(params.id)
        if (!ok) return Response.json({ error: 'Not found' }, { status: 404 })
        return new Response(null, { status: 204 })
      },
    },
  },
})
