import { createFileRoute } from '@tanstack/react-router'
import { requireAdmin } from '@/lib/auth'
import {
  getAbout,
  getCertificates,
  getExperience,
  getProjects,
  getSettings,
  getSkills,
  setAbout,
  setCertificates,
  setExperience,
  setProjects,
  setSettings,
  setSkills,
} from '@/lib/db'
import {
  SEED_ABOUT,
  SEED_CERTIFICATES,
  SEED_EXPERIENCE,
  SEED_PROJECTS,
  SEED_SETTINGS,
  SEED_SKILLS,
} from '@/lib/seed-data'

export const Route = createFileRoute('/api/portfolio/data')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const [projects, skills, about, experience, certificates, settings] = await Promise.all([
            getProjects(),
            getSkills(),
            getAbout(),
            getExperience(),
            getCertificates(),
            getSettings(),
          ])
          return Response.json({ projects, skills, about, experience, certificates, settings })
        } catch (err) {
          console.error(err)
          return Response.json({ error: 'Failed to fetch data' }, { status: 500 })
        }
      },

      POST: async ({ request }) => {
        // Seeding overwrites every section, so it always requires admin auth.
        // The old "admin OR first run" rule was unsafe: getSettings() reports
        // `seeded: false` whenever a read fails, so a transient store outage
        // would have let an anonymous POST overwrite real content with demo data.
        const isAdmin = await requireAdmin(request)
        if (!isAdmin) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const settings = await getSettings()
        const url = new URL(request.url)
        const force = url.searchParams.get('force') === 'true'

        if (settings.seeded && !force) {
          return Response.json({ message: 'Already seeded', seeded: true })
        }

        await Promise.all([
          setProjects(SEED_PROJECTS),
          setSkills(SEED_SKILLS),
          setAbout(SEED_ABOUT),
          setExperience(SEED_EXPERIENCE),
          setCertificates(SEED_CERTIFICATES),
          setSettings({ ...SEED_SETTINGS, seeded: true }),
        ])

        return Response.json({ message: 'Seeded successfully' }, { status: 201 })
      },
    },
  },
})
