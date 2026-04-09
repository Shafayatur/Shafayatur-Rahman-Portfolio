import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/auth'
import { createProject, getProjects } from '@/lib/db'

export const Route = createFileRoute('/api/portfolio/projects')({
  server: {
    handlers: {
      GET: async () => {
        const projects = await getProjects()
        return Response.json(projects)
      },

      POST: async ({ request }) => {
        if (!(await requireAdmin(request))) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const body = await request.json()
        const project = await createProject(body)
        return Response.json(project, { status: 201 })
      },
    },
  },
})
