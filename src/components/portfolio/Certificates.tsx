'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import type { Certificate } from '@/lib/db'

interface CertificatesProps {
  certificates: Certificate[]
}

export function CertificatesSection({ certificates }: CertificatesProps) {
  const [center, setCenter] = useState(0)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const len = certificates.length

  const prev = () => setCenter((c) => (c - 1 + len) % len)
  const next = () => setCenter((c) => (c + 1) % len)

  // Auto-rotate
  useEffect(() => {
    if (len <= 1) return
    autoRef.current = setInterval(next, 3500)
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [len, center])

  const pauseAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current)
  }

  if (len === 0) return null

  // Determine positions: center, left, right
  const getPosition = (idx: number) => {
    if (idx === center) return 'center'
    if (idx === (center - 1 + len) % len) return 'left'
    if (idx === (center + 1) % len) return 'right'
    return 'hidden'
  }

  const positionStyles: Record<string, React.CSSProperties> = {
    center: {
      transform: 'translateX(0) scale(1)',
      opacity: 1,
      zIndex: 10,
      filter: 'blur(0px)',
    },
    left: {
      transform: 'translateX(-65%) scale(0.78)',
      opacity: 0.6,
      zIndex: 5,
      filter: 'blur(2px)',
    },
    right: {
      transform: 'translateX(65%) scale(0.78)',
      opacity: 0.6,
      zIndex: 5,
      filter: 'blur(2px)',
    },
    hidden: {
      opacity: 0,
      zIndex: 0,
      transform: 'translateX(0) scale(0.6)',
    },
  }

  return (
    <section id="certificates">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p className="section-label">Credentials</p>
          <h2 className="section-title">
            Certificates &{' '}
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Achievements
            </span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <div
          style={{
            position: 'relative',
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
          onMouseEnter={pauseAuto}
        >
          {certificates.map((cert, idx) => {
            const pos = getPosition(idx)
            return (
              <motion.div
                key={cert.id}
                style={{
                  position: 'absolute',
                  width: 380,
                  willChange: 'transform',
                  transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease, filter 0.5s ease',
                  ...positionStyles[pos],
                }}
                data-cursor-hover
              >
                <div
                  className="glass-card"
                  style={{
                    overflow: 'hidden',
                    border: pos === 'center' ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: pos === 'center' ? '0 0 40px rgba(99,102,241,0.15)' : 'none',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                >
                  <img
                    src={cert.image || 'https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?w=400&h=220&fit=crop'}
                    alt={cert.title}
                    style={{ width: '100%', height: 180, objectFit: 'cover' }}
                  />
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div>
                        <h3 style={{ fontWeight: 600, fontSize: '0.95rem', color: '#f0f0f0', marginBottom: 4 }}>
                          {cert.title}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(232,232,232,0.5)' }}>
                          {cert.issuer} · {cert.date}
                        </p>
                      </div>
                      {cert.url && pos === 'center' && (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#6366f1', flexShrink: 0 }}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 32 }}>
          <button
            onClick={() => { pauseAuto(); prev() }}
            className="glass-card"
            style={{ padding: 12, border: 'none', color: '#e8e8e8', cursor: 'none', borderRadius: 10 }}
          >
            <ChevronLeft size={18} />
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {certificates.map((_, i) => (
              <button
                key={i}
                onClick={() => { pauseAuto(); setCenter(i) }}
                style={{
                  width: i === center ? 24 : 8,
                  height: 8,
                  borderRadius: 100,
                  border: 'none',
                  background: i === center ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.2)',
                  transition: 'width 0.3s, background 0.3s',
                  cursor: 'none',
                  padding: 0,
                }}
              />
            ))}
          </div>

          <button
            onClick={() => { pauseAuto(); next() }}
            className="glass-card"
            style={{ padding: 12, border: 'none', color: '#e8e8e8', cursor: 'none', borderRadius: 10 }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
