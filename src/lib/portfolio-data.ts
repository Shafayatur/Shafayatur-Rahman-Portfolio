import { createServerFn } from '@tanstack/react-start'
import { getRequestUrl } from '@tanstack/react-start/server'
// Read-only accessors only — no setters are imported here on purpose, so this
// module cannot write to the store even by accident. See getPortfolioData below.
import {
  getAbout,
  getCertificates,
  getExperience,
  getProjects,
  getSettings,
  getSkills,
} from './db'
import type { About, Certificate, Experience, Project, Settings, SkillCategory } from './db'

export interface PortfolioData {
  projects: Project[]
  skills: SkillCategory[]
  about: About | null
  experience: Experience[]
  certificates: Certificate[]
  settings: Settings
  /** Absolute origin of this deployment, used to build canonical/OG URLs. */
  siteUrl: string
}

const EMPTY_SETTINGS: Settings = { hasResume: false, seeded: false, siteTitle: 'Portfolio' }

/**
 * Resolve the absolute origin for this request.
 *
 * Derived from the incoming request so canonical and OG URLs are correct on
 * every deployment (production, preview, local) without configuration.
 * `VITE_SITE_URL` overrides it if you need to pin a custom domain.
 */
function resolveSiteUrl(): string {
  const configured = process.env.VITE_SITE_URL ?? process.env.SITE_URL
  if (configured) return configured.replace(/\/+$/, '')
  try {
    return getRequestUrl({ xForwardedHost: true, xForwardedProto: true }).origin
  } catch {
    return ''
  }
}

/**
 * Loads every section of the portfolio in one server round-trip.
 *
 * Runs on the server during SSR, so the rendered HTML already contains the
 * real content instead of an empty shell that fills in after hydration.
 *
 * STRICTLY READ-ONLY. This runs on every public page load, so it must never
 * write to the store. Seeding deliberately lives behind `POST /api/portfolio/data`
 * instead: `getSettings()` falls back to `{ seeded: false }` whenever a read
 * fails (db.ts swallows errors and returns null), so seeding from here would
 * let one transient Supabase blip overwrite real content with placeholder data.
 */
export const getPortfolioData = createServerFn().handler(async (): Promise<PortfolioData> => {
  const siteUrl = resolveSiteUrl()

  try {
    const [settings, projects, skills, about, experience, certificates] = await Promise.all([
      getSettings(),
      getProjects(),
      getSkills(),
      getAbout(),
      getExperience(),
      getCertificates(),
    ])

    return { projects, skills, about, experience, certificates, settings, siteUrl }
  } catch (err) {
    // A store outage should degrade the page, not blank it with a 500.
    console.error('Failed to load portfolio data:', err)
    return {
      projects: [],
      skills: [],
      about: null,
      experience: [],
      certificates: [],
      settings: EMPTY_SETTINGS,
      siteUrl,
    }
  }
})
