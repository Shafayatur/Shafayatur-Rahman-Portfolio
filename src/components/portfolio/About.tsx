'use client'
import { motion } from 'framer-motion'
import { MapPin, Mail, Github, Linkedin, Twitter } from 'lucide-react'
import type { About } from '@/lib/db'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

interface AboutProps {
  about: About | null
}

export function AboutSection({ about }: AboutProps) {
  if (!about) return null

  return (
    <section id="about" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 64,
            alignItems: 'center',
          }}
        >
          {/* Left: image + stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            variants={fadeUp}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}
          >
            <div
              style={{
                position: 'relative',
                width: 240,
                height: 240,
              }}
            >
              {/* Glow ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: -4,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  zIndex: 0,
                  animation: 'float 6s ease-in-out infinite',
                }}
              />
              <img
                src={about.profileImage ?? '/headshot-on-white.jpg'}
                alt={about.name}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #0a0a0a',
                }}
              />
            </div>

            {/* Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
              {about.highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="glass-card"
                  style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <span style={{ color: '#6366f1', fontSize: '0.9rem' }}>✦</span>
                  <span style={{ fontSize: '0.875rem', color: 'rgba(232,232,232,0.8)' }}>{h}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            variants={fadeUp}
          >
            <p className="section-label">About Me</p>
            <h2 className="section-title" style={{ marginBottom: 24 }}>
              Building the future with{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                intelligent systems
              </span>
            </h2>

            <p
              style={{
                color: 'rgba(232,232,232,0.65)',
                lineHeight: 1.8,
                fontSize: '1rem',
                marginBottom: 32,
              }}
            >
              {about.bio}
            </p>

            {/* Meta info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {about.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(232,232,232,0.5)', fontSize: '0.9rem' }}>
                  <MapPin size={16} color="#6366f1" />
                  {about.location}
                </div>
              )}
              {about.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(232,232,232,0.5)', fontSize: '0.9rem' }}>
                  <Mail size={16} color="#6366f1" />
                  <a href={`mailto:${about.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{about.email}</a>
                </div>
              )}
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 12 }}>
              {about.github && (
                <a
                  href={about.github}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-card"
                  style={{
                    padding: '10px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'rgba(232,232,232,0.8)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  <Github size={16} /> GitHub
                </a>
              )}
              {about.linkedin && (
                <a
                  href={about.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-card"
                  style={{
                    padding: '10px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'rgba(232,232,232,0.8)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  <Linkedin size={16} /> LinkedIn
                </a>
              )}
              {about.twitter && (
                <a
                  href={about.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-card"
                  style={{
                    padding: '10px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'rgba(232,232,232,0.8)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  <Twitter size={16} /> Twitter
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
