import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Preloader } from '@/components/portfolio/Preloader'
import { CustomCursor } from '@/components/portfolio/CustomCursor'
import { Navbar } from '@/components/portfolio/Navbar'
import { Hero } from '@/components/portfolio/Hero'
import { AboutSection } from '@/components/portfolio/About'
import { ProjectsSection } from '@/components/portfolio/Projects'
import { SkillsSection } from '@/components/portfolio/Skills'
import { CertificatesSection } from '@/components/portfolio/Certificates'
import { ExperienceSection } from '@/components/portfolio/Experience'
import { ContactSection } from '@/components/portfolio/Contact'
import { getPortfolioData } from '@/lib/portfolio-data'
import { buildHomeMeta, buildPersonJsonLd } from '@/lib/seo'

export const Route = createFileRoute('/')({
  loader: () => getPortfolioData(),
  head: ({ loaderData }) => {
    const about = loaderData?.about ?? null
    const siteUrl = loaderData?.siteUrl ?? ''

    return {
      meta: buildHomeMeta({ about, siteUrl }),
      links: siteUrl ? [{ rel: 'canonical', href: siteUrl }] : [],
      scripts: [
        {
          type: 'application/ld+json',
          children: buildPersonJsonLd({
            about,
            siteUrl,
            skills: loaderData?.skills ?? [],
            projects: loaderData?.projects ?? [],
          }),
        },
      ],
    }
  },
  component: PortfolioPage,
})

function PortfolioPage() {
  const { projects, skills, about, experience, certificates, settings } = Route.useLoaderData()
  const [preloaderDone, setPreloaderDone] = useState(false)

  return (
    <>
      <CustomCursor />
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* Rendered unconditionally and fully visible so the real content ships in
          the SSR HTML — the preloader is an opaque fixed overlay (z-index 9999)
          that hides it from the viewer without hiding it from crawlers.
          Re-keying on `preloaderDone` remounts the tree once the overlay lifts,
          so the entry animations play for the viewer instead of behind it. */}
      <div key={preloaderDone ? 'revealed' : 'loading'}>
        <Navbar hasResume={settings?.hasResume ?? false} />

        <main>
          <Hero about={about} />

          <div className="gradient-divider" />
          <AboutSection about={about} />

          <div className="gradient-divider" />
          <ProjectsSection projects={projects} />

          <div className="gradient-divider" />
          <SkillsSection skills={skills} />

          <div className="gradient-divider" />
          <CertificatesSection certificates={certificates} />

          <div className="gradient-divider" />
          <ExperienceSection experience={experience} />

          <div className="gradient-divider" />
          <ContactSection about={about} />
        </main>
      </div>
    </>
  )
}
