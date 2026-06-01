'use client'
import { motion } from 'framer-motion'
import { Briefcase, GraduationCap } from 'lucide-react'
import type { Experience } from '@/lib/db'

interface ExperienceProps {
  experience: Experience[]
}

export function ExperienceSection({ experience }: ExperienceProps) {
  const work = experience.filter((e) => e.type === 'work')
  const education = experience.filter((e) => e.type === 'education')

  return (
    <section id="experience" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p className="section-label">Background</p>
          <h2 className="section-title">
            Experience &{' '}
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Education
            </span>
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 48,
          }}
        >
          {/* Work */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Briefcase size={16} color="#6366f1" />
              </div>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: '#f0f0f0',
                }}
              >
                Work Experience
              </h3>
            </div>
            <TimelineList items={work} />
          </div>

          {/* Education */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(168,85,247,0.15)',
                  border: '1px solid rgba(168,85,247,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GraduationCap size={16} color="#a855f7" />
              </div>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: '#f0f0f0',
                }}
              >
                Education
              </h3>
            </div>
            <TimelineList items={education} />
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineList({ items }: { items: Experience[] }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Vertical line */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 0,
          bottom: 0,
          width: 1,
          background: 'linear-gradient(to bottom, rgba(99,102,241,0.5), transparent)',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{ paddingLeft: 48, position: 'relative' }}
          >
            {/* Dot */}
            <div
              style={{
                position: 'absolute',
                left: 9,
                top: 6,
                width: 15,
                height: 15,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                border: '2px solid #0a0a0a',
                zIndex: 1,
              }}
            />

            <div className="glass-card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                <div>
                  <h4
                    style={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: '#f0f0f0',
                      marginBottom: 2,
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: '#6366f1',
                      fontWeight: 500,
                    }}
                  >
                    {item.company}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(232,232,232,0.4)',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {item.period}
                </span>
              </div>

              <p
                style={{
                  color: 'rgba(232,232,232,0.6)',
                  fontSize: '0.85rem',
                  lineHeight: 1.7,
                  marginBottom: item.tags.length ? 12 : 0,
                }}
              >
                {item.description}
              </p>

              {item.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {item.tags.map((t) => (
                    <span key={t} className="skill-tag" style={{ fontSize: '0.7rem' }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
