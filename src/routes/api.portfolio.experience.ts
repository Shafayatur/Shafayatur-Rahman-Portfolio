import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/auth'
import { createExperience, getExperience } from '@/lib/db'

export const Route = createFileRoute('/api/portfolio/experience')({
  server: {
    handlers: {
      GET: async () => {
        const items = await getExperience()
        return Response.json(items)
      },

      POST: async ({ request }) => {
        if (!(await requireAdmin(request))) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const body = await request.json()
        const item = await createExperience(body)
        return Response.json(item, { status: 201 })
      },
    },
  },
})
