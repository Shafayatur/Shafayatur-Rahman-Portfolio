'use client'
import { motion } from 'framer-motion'
import type { SkillCategory } from '@/lib/db'

interface SkillsProps {
  skills: SkillCategory[]
}

function SkillTickerRow({ category, reverse }: { category: SkillCategory; reverse?: boolean }) {
  // Duplicate skills to make it look continuous
  const doubledSkills = [...category.skills, ...category.skills, ...category.skills, ...category.skills]

  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingLeft: 24 }}>
        <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>
        <h3
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: '1rem',
            color: '#f0f0f0',
          }}
        >
          {category.name}
        </h3>
      </div>
      
      <div className="ticker-container">
        <div className={`ticker-content ${reverse ? 'ticker-content-reverse' : ''}`} style={{ '--duration': '40s' } as React.CSSProperties}>
          {doubledSkills.map((skill, i) => (
            <div key={`${skill}-${i}`} className="ticker-item">
              <div className="skill-tag" style={{ fontSize: '0.9rem', padding: '10px 20px', whiteSpace: 'nowrap' }}>
                {skill}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkillsSection({ skills }: SkillsProps) {
  return (
    <section id="skills" style={{ background: 'rgba(255,255,255,0.01)', overflow: 'hidden' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p className="section-label">Expertise</p>
          <h2 className="section-title">
            Skills &{' '}
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Technologies
            </span>
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {skills.map((cat, idx) => (
            <SkillTickerRow key={cat.id} category={cat} reverse={idx % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
