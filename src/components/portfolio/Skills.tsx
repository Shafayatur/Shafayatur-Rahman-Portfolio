'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SkillCategory } from '@/lib/db'

export function SkillsSection({ skills }: { skills: SkillCategory[] }) {
  const [active, setActive] = useState(0)

  if (!skills.length) return null

  const current = skills[active]

  return (
    <section id="skills" style={{ background: 'rgba(255,255,255,0.01)', overflow: 'hidden' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <p className="section-label">Expertise</p>
          <h2 className="section-title">
            Skills &{' '}
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Technologies
            </span>
          </h2>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
          {skills.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setActive(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 20px', borderRadius: 100, cursor: 'pointer',
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.875rem',
                transition: 'all 0.2s',
                background: active === i ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'rgba(255,255,255,0.05)',
                border: active === i ? '1px solid transparent' : '1px solid rgba(255,255,255,0.08)',
                color: active === i ? '#fff' : 'rgba(232,232,232,0.55)',
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
              <span style={{
                fontSize: '0.7rem', padding: '1px 7px', borderRadius: 100,
                background: active === i ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)',
                color: active === i ? '#fff' : 'rgba(232,232,232,0.4)',
              }}>
                {cat.skills.length}
              </span>
            </button>
          ))}
        </div>

        {/* Skills panel */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, overflow: 'hidden',
        }}>
          {/* Scrolling ticker */}
          <div className="ticker-container" style={{ padding: '18px 0' }}>
            <div
              key={current.id}
              className="ticker-content"
              style={{ '--duration': `${Math.max(10, current.skills.length * 2.5)}s` } as React.CSSProperties}
            >
              {[...current.skills, ...current.skills, ...current.skills, ...current.skills].map((skill, i) => (
                <div key={i} className="ticker-item">
                  <span className="skill-tag" style={{ fontSize: '0.875rem', padding: '7px 18px', whiteSpace: 'nowrap' }}>
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}