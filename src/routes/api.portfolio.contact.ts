import { createFileRoute } from '@tanstack/react-router'
import { createMessage } from '@/lib/db'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export const Route = createFileRoute('/api/portfolio/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()
          const { name, email, subject, message } = body

          if (!name || !email || !message) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 })
          }

          const msg = await createMessage({ name, email, subject: subject ?? 'Contact Form', message })

          // Send email notification if Resend is configured
          if (resend && process.env.NOTIFY_EMAIL) {
            await resend.emails.send({
              from: 'Portfolio <onboarding@resend.dev>',
              to: process.env.NOTIFY_EMAIL,
              subject: `📬 New message from ${name}: ${subject ?? 'Contact Form'}`,
              html: `
                <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#0a0a0a;color:#f0f0f0;border-radius:12px">
                  <h2 style="margin:0 0 24px;color:#a5b4fc">New Portfolio Message</h2>
                  <table style="width:100%;border-collapse:collapse">
                    <tr><td style="padding:8px 0;color:#888;width:80px">From</td><td style="padding:8px 0;color:#f0f0f0;font-weight:600">${name}</td></tr>
                    <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#a5b4fc">${email}</a></td></tr>
                    <tr><td style="padding:8px 0;color:#888">Subject</td><td style="padding:8px 0;color:#f0f0f0">${subject ?? 'Contact Form'}</td></tr>
                  </table>
                  <div style="margin:24px 0;padding:20px;background:#111;border-radius:8px;border-left:3px solid #6366f1">
                    <p style="margin:0;line-height:1.7;color:#ccc">${message.replace(/\n/g, '<br/>')}</p>
                  </div>
                  <a href="mailto:${email}" style="display:inline-block;padding:10px 24px;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Reply to ${name}</a>
                </div>
              `,
            }).catch((err: unknown) => {
              console.error('Email notification failed:', err)
            })
          }

          return Response.json({ success: true, id: msg.id }, { status: 201 })
        } catch {
          return Response.json({ error: 'Failed to save message' }, { status: 500 })
        }
      },
    },
  },
})