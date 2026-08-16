import type { About, Project, SkillCategory } from './db'

export const DEFAULT_NAME = 'Shafayatur Rahman'
export const DEFAULT_ROLE = 'AI & Data Engineer'
export const DEFAULT_DESCRIPTION =
  'AI & Data Engineer specializing in data analysis, AI automation, machine learning, and full-stack web application development.'

/** Fallback share image shipped in /public. */
export const FALLBACK_OG_IMAGE = '/headshot-on-white.jpg'

/** Truncate at a word boundary so meta descriptions never end mid-word. */
export function truncate(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\-–—]$/, '')}…`
}

/** Make a possibly-relative URL absolute against the site origin. */
export function absoluteUrl(path: string, siteUrl: string): string {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  if (!siteUrl) return path
  return `${siteUrl}${path.startsWith('/') ? '' : '/'}${path}`
}

/**
 * True only for a real profile URL.
 *
 * Placeholder values like "https://twitter.com" are bare domains with no
 * profile path — asserting those in `sameAs` would claim an identity that
 * isn't yours, so they're rejected.
 */
function isProfileUrl(url: string | undefined): url is string {
  if (!url || !/^https?:\/\//i.test(url)) return false
  try {
    return new URL(url).pathname.replace(/\/+$/, '').length > 0
  } catch {
    return false
  }
}

/** Pull an @handle out of a Twitter/X profile URL, if there is one. */
function twitterHandle(url?: string): string | undefined {
  if (!url) return undefined
  const match = url.match(/(?:twitter\.com|x\.com)\/@?([A-Za-z0-9_]{1,15})/i)
  return match ? `@${match[1]}` : undefined
}

export interface SeoInput {
  about: About | null
  siteUrl: string
}

export interface MetaTag {
  title?: string
  name?: string
  property?: string
  content?: string
}

/**
 * Build the full meta set for the homepage: standard SEO, Open Graph
 * (Facebook/LinkedIn/Slack) and Twitter/X cards.
 */
export function buildHomeMeta({ about, siteUrl }: SeoInput): Array<MetaTag> {
  const name = about?.name || DEFAULT_NAME
  const role = about?.role || DEFAULT_ROLE
  const title = `${name} — ${role}`
  const description = about?.bio ? truncate(about.bio) : DEFAULT_DESCRIPTION
  const image = absoluteUrl(about?.profileImage || FALLBACK_OG_IMAGE, siteUrl)
  const handle = twitterHandle(about?.twitter)

  const meta: Array<MetaTag> = [
    { title },
    { name: 'description', content: description },
    { name: 'author', content: name },
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    { name: 'theme-color', content: '#0a0a0a' },

    // Open Graph
    { property: 'og:type', content: 'profile' },
    { property: 'og:site_name', content: name },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:locale', content: 'en_US' },

    // Twitter / X
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ]

  if (siteUrl) meta.push({ property: 'og:url', content: siteUrl })
  if (image) {
    meta.push(
      { property: 'og:image', content: image },
      { property: 'og:image:alt', content: `${name} — ${role}` },
      { name: 'twitter:image', content: image },
    )
  }
  if (handle) {
    meta.push({ name: 'twitter:creator', content: handle }, { name: 'twitter:site', content: handle })
  }

  return meta
}

/**
 * schema.org JSON-LD describing the person and the site, so search engines can
 * render a knowledge panel / rich result instead of a plain blue link.
 */
export function buildPersonJsonLd({
  about,
  skills,
  projects,
  siteUrl,
}: SeoInput & { skills: Array<SkillCategory>; projects: Array<Project> }): string {
  const name = about?.name || DEFAULT_NAME
  const role = about?.role || DEFAULT_ROLE
  const description = about?.bio ? truncate(about.bio, 300) : DEFAULT_DESCRIPTION

  const sameAs = [about?.github, about?.linkedin, about?.twitter].filter(isProfileUrl)

  // Flatten every skill category into a single knowsAbout list.
  const knowsAbout = Array.from(new Set(skills.flatMap((category) => category.skills))).slice(0, 40)

  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': siteUrl ? `${siteUrl}/#person` : undefined,
    name,
    jobTitle: role,
    description,
    url: siteUrl || undefined,
  }

  if (about?.profileImage || siteUrl) {
    person.image = absoluteUrl(about?.profileImage || FALLBACK_OG_IMAGE, siteUrl)
  }
  if (about?.email) person.email = `mailto:${about.email}`
  if (about?.location?.trim()) {
    person.address = { '@type': 'PostalAddress', addressLocality: about.location.trim() }
  }
  if (sameAs.length) person.sameAs = sameAs
  if (knowsAbout.length) person.knowsAbout = knowsAbout

  // Surface featured work as creative works attributed to the person.
  const featured = projects.filter((project) => project.featured).slice(0, 10)
  if (featured.length) {
    person.subjectOf = featured.map((project) => ({
      '@type': 'CreativeWork',
      name: project.title,
      description: truncate(project.description, 200),
      url: project.liveUrl || project.github || undefined,
      keywords: project.techStack.join(', '),
    }))
  }

  const graph: Array<Record<string, unknown>> = [person]

  if (siteUrl) {
    graph.push({
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: `${name} — Portfolio`,
      description,
      inLanguage: 'en',
      publisher: { '@id': `${siteUrl}/#person` },
    })
  }

  // Drop undefined values so the emitted JSON-LD stays clean.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, (_key, value) =>
    value === undefined ? undefined : value,
  )
}
