'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

interface NavbarProps {
  hasResume: boolean
}

export function Navbar({ hasResume }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '0 24px',
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
          background: scrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '1.3rem',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            border: 'none',
            cursor: 'none',
            padding: 0,
          }}
        >
          SR
        </button>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hidden md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'rgba(232,232,232,0.7)',
                border: 'none',
                background: 'transparent',
                cursor: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#a5b4fc' }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(232,232,232,0.7)' }}
            >
              {item.label}
            </button>
          ))}

          {hasResume && (
            <a
              href="/api/admin/resume"
              target="_blank"
              rel="noreferrer"
              className="glow-button glow-button-outline"
              style={{ padding: '8px 20px', fontSize: '0.875rem', textDecoration: 'none', marginLeft: 8 }}
            >
              Resume ↗
            </a>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          style={{ background: 'none', border: 'none', color: '#e8e8e8', cursor: 'none' }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'fixed',
              top: 70,
              left: 0,
              right: 0,
              zIndex: 999,
              background: 'rgba(10,10,10,0.95)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '16px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'rgba(232,232,232,0.8)',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'none',
                  textAlign: 'left',
                }}
              >
                {item.label}
              </button>
            ))}
            {hasResume && (
              <a
                href="/api/admin/resume"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '12px 16px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#a5b4fc',
                  textDecoration: 'none',
                }}
              >
                Resume ↗
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
