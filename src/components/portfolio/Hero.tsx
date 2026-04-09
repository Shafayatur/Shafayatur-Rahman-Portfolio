'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { About } from '@/lib/db'

const ROLES = [
  'AI Engineer',
  'ML Developer',
  'Computer Vision Specialist',
  'Full-Stack Developer',
  'Open Source Contributor',
]

function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[wordIdx % words.length]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting) {
      if (text.length < word.length) {
        timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), speed)
      } else {
        timeout = setTimeout(() => setDeleting(true), pause)
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), speed / 2)
      } else {
        setDeleting(false)
        setWordIdx((i) => i + 1)
      }
    }

    return () => clearTimeout(timeout)
  }, [text, deleting, wordIdx, words, speed, pause])

  return text
}

// Floating particle
function Particle({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 2,
        height: 2,
        borderRadius: '50%',
        background: 'rgba(99,102,241,0.6)',
        animation: `float ${4 + delay}s ease-in-out ${delay}s infinite`,
      }}
    />
  )
}

interface HeroProps {
  about: About | null
}

export function Hero({ about }: HeroProps) {
  const role = useTypewriter(ROLES)

  const scrollToWork = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
  }
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const particles = [
    { x: '10%', y: '20%', delay: 0 },
    { x: '80%', y: '15%', delay: 1 },
    { x: '20%', y: '70%', delay: 2 },
    { x: '70%', y: '65%', delay: 0.5 },
    { x: '50%', y: '30%', delay: 1.5 },
    { x: '35%', y: '80%', delay: 3 },
    { x: '90%', y: '50%', delay: 0.8 },
    { x: '5%', y: '50%', delay: 2.5 },
  ]

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: 0,
      }}
    >
      {/* Background gradient blobs */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}
      </div>

      {/* Grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        {/* Greeting badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 100,
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            marginBottom: 32,
            fontSize: '0.8rem',
            fontWeight: 500,
            color: '#a5b4fc',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'float 2s ease-in-out infinite' }} />
          Available for opportunities
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 24,
            color: '#f0f0f0',
          }}
        >
          {about?.name ?? 'Alex Chen'}
        </motion.h1>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            fontWeight: 500,
            color: 'rgba(232,232,232,0.7)',
            marginBottom: 40,
            minHeight: '2em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span className="gradient-text" style={{ animation: 'none', background: 'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {role}
          </span>
          <span className="typewriter-cursor" />
        </motion.div>

        {/* Bio excerpt */}
        {about?.bio && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            style={{
              maxWidth: 560,
              margin: '0 auto 48px',
              color: 'rgba(232,232,232,0.5)',
              lineHeight: 1.7,
              fontSize: '1rem',
            }}
          >
            {about.bio.slice(0, 160)}…
          </motion.p>
        )}

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <button className="glow-button glow-button-primary" onClick={scrollToWork}>
            View Work
          </button>
          <button className="glow-button glow-button-outline" onClick={scrollToContact}>
            Get in Touch
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            position: 'absolute',
            bottom: -80,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(232,232,232,0.3)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            cursor: 'none',
          }}
          onClick={scrollToWork}
        >
          <span>SCROLL</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
