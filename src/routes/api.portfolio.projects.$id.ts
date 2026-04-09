import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/auth'
import { deleteProject, updateProject } from '@/lib/db'

export const Route = createFileRoute('/api/portfolio/projects/$id')({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        if (!(await requireAdmin(request))) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const body = await request.json()
        const updated = await updateProject(params.id, body)
        if (!updated) return Response.json({ error: 'Not found' }, { status: 404 })
        return Response.json(updated)
      },

      DELETE: async ({ request, params }) => {
        if (!(await requireAdmin(request))) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const ok = await deleteProject(params.id)
        if (!ok) return Response.json({ error: 'Not found' }, { status: 404 })
        return new Response(null, { status: 204 })
      },
    },
  },
})
