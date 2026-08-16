import { createFileRoute } from '@tanstack/react-router'

/**
 * Sitemap for the portfolio.
 *
 * The public site is a single page whose sections are in-page anchors, so the
 * sitemap lists one canonical URL. /admin is intentionally excluded.
 */
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin
        const lastmod = new Date().toISOString().slice(0, 10)

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`

        return new Response(xml, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=3600',
          },
        })
      },
    },
  },
})
