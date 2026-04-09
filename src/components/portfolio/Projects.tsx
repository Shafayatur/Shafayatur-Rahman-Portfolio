'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, X } from 'lucide-react'
import type { Project } from '@/lib/db'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

interface ProjectCardProps {
  project: Project
  onClick: () => void
  index: number
}

function ProjectCard({ project, onClick, index }: ProjectCardProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="glass-card"
      onClick={onClick}
      data-cursor-hover
      style={{
        cursor: 'none',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 220 }}>
        <img
          src={project.image || 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop'}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)' }}
          onMouseLeave={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 60%)',
          }}
        />
        {project.featured && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              padding: '3px 10px',
              borderRadius: 100,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '0.05em',
            }}
          >
            FEATURED
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#f0f0f0',
          }}
        >
          {project.title}
        </h3>
        <p style={{ color: 'rgba(232,232,232,0.55)', fontSize: '0.875rem', lineHeight: 1.6, flex: 1 }}>
          {project.description.slice(0, 120)}…
        </p>

        {/* Tech stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {project.techStack.slice(0, 4).map((t) => (
            <span key={t} className="skill-tag" style={{ fontSize: '0.7rem' }}>
              {t}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="skill-tag" style={{ fontSize: '0.7rem', opacity: 0.6 }}>
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: 'rgba(232,232,232,0.5)', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', textDecoration: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a5b4fc' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(232,232,232,0.5)' }}
            >
              <Github size={14} /> Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: 'rgba(232,232,232,0.5)', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', textDecoration: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a5b4fc' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(232,232,232,0.5)' }}
            >
              <ExternalLink size={14} /> Live
            </a>
          )}
          <span
            style={{ marginLeft: 'auto', color: 'rgba(232,232,232,0.35)', fontSize: '0.8rem', cursor: 'none' }}
          >
            View details →
          </span>
        </div>
      </div>
    </motion.div>
  )
}

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 680,
          width: '100%',
          background: '#111',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          overflow: 'hidden',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={project.image || 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop'}
            alt={project.title}
            style={{ width: '100%', height: 280, objectFit: 'cover' }}
          />
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(0,0,0,0.7)',
              border: 'none',
              borderRadius: 8,
              padding: 8,
              color: '#fff',
              cursor: 'none',
              display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 32 }}>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '1.6rem',
              fontWeight: 700,
              color: '#f0f0f0',
              marginBottom: 16,
            }}
          >
            {project.title}
          </h2>

          <p style={{ color: 'rgba(232,232,232,0.65)', lineHeight: 1.8, marginBottom: 24 }}>
            {project.description}
          </p>

          <div style={{ marginBottom: 24 }}>
            <p className="section-label" style={{ marginBottom: 10 }}>Tech Stack</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {project.techStack.map((t) => (
                <span key={t} className="skill-tag">{t}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="glow-button glow-button-outline" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Github size={16} /> GitHub
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="glow-button glow-button-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

interface ProjectsProps {
  projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsProps) {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <section id="projects">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p className="section-label">Portfolio</p>
          <h2 className="section-title">
            Selected{' '}
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Work
            </span>
          </h2>
          <p style={{ color: 'rgba(232,232,232,0.5)', marginTop: 16, fontSize: '1rem', maxWidth: 480, margin: '16px auto 0' }}>
            A collection of projects spanning AI/ML systems, full-stack applications, and open-source tools.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onClick={() => setSelected(p)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}
