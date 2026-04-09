import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/auth'
import { deleteResume, getResume, setResume } from '@/lib/db'

export const Route = createFileRoute('/api/admin/resume')({
  server: {
    handlers: {
      GET: async () => {
        const blob = await getResume()
        if (!blob) return Response.json({ error: 'No resume uploaded' }, { status: 404 })
        return new Response(blob, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="resume.pdf"',
          },
        })
      },

      POST: async ({ request }) => {
        if (!(await requireAdmin(request))) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const formData = await request.formData()
        const file = formData.get('resume') as File | null
        if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })
        const buffer = await file.arrayBuffer()
        await setResume(buffer)
        return Response.json({ success: true })
      },

      DELETE: async ({ request }) => {
        if (!(await requireAdmin(request))) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        await deleteResume()
        return new Response(null, { status: 204 })
      },
    },
  },
})
