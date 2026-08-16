import { createFileRoute } from '@tanstack/react-router'

/**
 * robots.txt — allow the public page, keep crawlers out of the admin CMS and
 * the JSON API, and point them at the sitemap.
 */
export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin

        const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${origin}/sitemap.xml
`

        return new Response(body, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=3600',
          },
        })
      },
    },
  },
})
