import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/auth'
import { getAbout, setAbout } from '@/lib/db'

export const Route = createFileRoute('/api/portfolio/about')({
  server: {
    handlers: {
      GET: async () => {
        const about = await getAbout()
        return Response.json(about)
      },

      PUT: async ({ request }) => {
        if (!(await requireAdmin(request))) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const body = await request.json()
        await setAbout(body)
        return Response.json(body)
      },
    },
  },
})
