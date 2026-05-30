import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/auth'
import { supabase } from '@/lib/db'

export const Route = createFileRoute('/api/admin/upload')({
    server: {
        handlers: {
            POST: async ({ request }) => {
                if (!(await requireAdmin(request))) {
                    return Response.json({ error: 'Unauthorized' }, { status: 401 })
                }

                if (!supabase) {
                    return Response.json({ error: 'Storage not configured' }, { status: 500 })
                }

                const formData = await request.formData()
                const file = formData.get('image') as File | null
                if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })

                const ext = file.name.split('.').pop() ?? 'jpg'
                const filename = `${crypto.randomUUID()}.${ext}`

                const buffer = await file.arrayBuffer()
                const { error } = await supabase.storage
                    .from('images')
                    .upload(filename, buffer, {
                        contentType: file.type,
                        upsert: false,
                    })

                if (error) {
                    return Response.json({ error: error.message }, { status: 500 })
                }

                const { data } = supabase.storage.from('images').getPublicUrl(filename)

                return Response.json({ url: data.publicUrl })
            },
        },
    },
})