'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Send, Github, Linkedin, CheckCircle } from 'lucide-react'
import type { About } from '@/lib/db'

interface ContactProps {
  about: About | null
}

export function ContactSection({ about }: ContactProps) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/portfolio/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '14px 18px',
    color: '#e8e8e8',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
  }

  return (
    <section id="contact">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p className="section-label">Get in Touch</p>
          <h2 className="section-title">
            Let's{' '}
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Work Together
            </span>
          </h2>
          <p style={{ color: 'rgba(232,232,232,0.5)', marginTop: 16, maxWidth: 480, margin: '16px auto 0' }}>
            Have a project in mind or want to collaborate? I'm always open to interesting opportunities.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 48,
            alignItems: 'start',
          }}
        >
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            {about?.email && (
              <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={18} color="#6366f1" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(232,232,232,0.4)', marginBottom: 2 }}>Email</p>
                  <a href={`mailto:${about.email}`} style={{ color: '#e8e8e8', textDecoration: 'none', fontWeight: 500 }}>
                    {about.email}
                  </a>
                </div>
              </div>
            )}

            {about?.github && (
              <a
                href={about.github}
                target="_blank"
                rel="noreferrer"
                className="glass-card"
                style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none' }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Github size={18} color="#6366f1" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(232,232,232,0.4)', marginBottom: 2 }}>GitHub</p>
                  <p style={{ color: '#e8e8e8', fontWeight: 500 }}>View my code</p>
                </div>
              </a>
            )}

            {about?.linkedin && (
              <a
                href={about.linkedin}
                target="_blank"
                rel="noreferrer"
                className="glass-card"
                style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none' }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Linkedin size={18} color="#6366f1" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(232,232,232,0.4)', marginBottom: 2 }}>LinkedIn</p>
                  <p style={{ color: '#e8e8e8', fontWeight: 500 }}>Connect with me</p>
                </div>
              </a>
            )}
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card"
                  style={{
                    padding: 48,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                    border: '1px solid rgba(99,102,241,0.3)',
                  }}
                >
                  <CheckCircle size={48} color="#6366f1" />
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.2rem', color: '#f0f0f0' }}>
                    Message sent!
                  </h3>
                  <p style={{ color: 'rgba(232,232,232,0.5)', fontSize: '0.9rem' }}>
                    Thanks for reaching out. I'll get back to you soon.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="glow-button glow-button-outline"
                    style={{ marginTop: 8 }}
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="glass-card"
                  style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(232,232,232,0.5)', display: 'block', marginBottom: 6 }}>
                        Name *
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(232,232,232,0.5)', display: 'block', marginBottom: 6 }}>
                        Email *
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(232,232,232,0.5)', display: 'block', marginBottom: 6 }}>
                      Subject
                    </label>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'rgba(232,232,232,0.5)', display: 'block', marginBottom: 6 }}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell me about your project..."
                      style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                      onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>

                  {status === 'error' && (
                    <p style={{ color: '#f87171', fontSize: '0.85rem' }}>
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="glow-button glow-button-primary"
                    style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    {status === 'loading' ? (
                      <>
                        <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="gradient-divider" style={{ marginTop: 80 }} />
      <div className="container" style={{ paddingTop: 32, paddingBottom: 32, textAlign: 'center' }}>
        <p style={{ color: 'rgba(232,232,232,0.3)', fontSize: '0.85rem' }}>
          Built with TanStack Start · Deployed on Vercel
          <span style={{ margin: '0 12px', opacity: 0.3 }}>·</span>
          <a href="/admin" style={{ color: 'rgba(232,232,232,0.3)', textDecoration: 'none' }}>Admin</a>
        </p>
      </div>
    </section>
  )
}
