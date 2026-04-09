'use client'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
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
import type { About, Certificate, Experience, Project, Settings, SkillCategory } from '@/lib/db'

export const Route = createFileRoute('/')({
  component: PortfolioPage,
})

interface PortfolioData {
  projects: Project[]
  skills: SkillCategory[]
  about: About | null
  experience: Experience[]
  certificates: Certificate[]
  settings: Settings
}

function PortfolioPage() {
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [data, setData] = useState<PortfolioData>({
    projects: [],
    skills: [],
    about: null,
    experience: [],
    certificates: [],
    settings: { hasResume: false, seeded: false, siteTitle: 'Portfolio' },
  })

  useEffect(() => {
    fetch('/api/portfolio/data')
      .then((r) => r.json())
      .then(async (d: PortfolioData) => {
        // Auto-seed if not seeded yet
        if (!d.settings?.seeded) {
          const seedRes = await fetch('/api/portfolio/data', { method: 'POST' })
          if (seedRes.ok) {
            const seeded = await fetch('/api/portfolio/data').then((r) => r.json())
            setData(seeded)
          } else {
            setData(d)
          }
        } else {
          setData(d)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <CustomCursor />
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {preloaderDone && (
        <div style={{ opacity: 1, transition: 'opacity 0.5s' }}>
          <Navbar hasResume={data.settings?.hasResume ?? false} />

          <main>
            <Hero about={data.about} />

            <div className="gradient-divider" />
            <AboutSection about={data.about} />

            <div className="gradient-divider" />
            <ProjectsSection projects={data.projects} />

            <div className="gradient-divider" />
            <SkillsSection skills={data.skills} />

            <div className="gradient-divider" />
            <CertificatesSection certificates={data.certificates} />

            <div className="gradient-divider" />
            <ExperienceSection experience={data.experience} />

            <div className="gradient-divider" />
            <ContactSection about={data.about} />
          </main>
        </div>
      )}
    </>
  )
}
