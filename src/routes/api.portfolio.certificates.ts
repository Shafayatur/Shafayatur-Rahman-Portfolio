import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/auth'
import { createCertificate, getCertificates } from '@/lib/db'

export const Route = createFileRoute('/api/portfolio/certificates')({
  server: {
    handlers: {
      GET: async () => {
        const certs = await getCertificates()
        return Response.json(certs)
      },

      POST: async ({ request }) => {
        if (!(await requireAdmin(request))) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const body = await request.json()
        const cert = await createCertificate(body)
        return Response.json(cert, { status: 201 })
      },
    },
  },
})
