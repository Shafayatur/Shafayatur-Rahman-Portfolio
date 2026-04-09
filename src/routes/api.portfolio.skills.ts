import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/auth'
import { createSkillCategory, deleteSkillCategory, getSkills, setSkills, updateSkillCategory } from '@/lib/db'

export const Route = createFileRoute('/api/portfolio/skills')({
  server: {
    handlers: {
      GET: async () => {
        const skills = await getSkills()
        return Response.json(skills)
      },

      POST: async ({ request }) => {
        if (!(await requireAdmin(request))) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const body = await request.json()

        // Full replace or create category
        if (body.replace && Array.isArray(body.categories)) {
          await setSkills(body.categories)
          return Response.json(body.categories)
        }

        const cat = await createSkillCategory(body)
        return Response.json(cat, { status: 201 })
      },

      PUT: async ({ request }) => {
        if (!(await requireAdmin(request))) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const body = await request.json()
        const updated = await updateSkillCategory(body.id, body)
        if (!updated) return Response.json({ error: 'Not found' }, { status: 404 })
        return Response.json(updated)
      },

      DELETE: async ({ request }) => {
        if (!(await requireAdmin(request))) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const { id } = await request.json()
        const ok = await deleteSkillCategory(id)
        if (!ok) return Response.json({ error: 'Not found' }, { status: 404 })
        return new Response(null, { status: 204 })
      },
    },
  },
})
