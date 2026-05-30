'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, X, ChevronDown } from 'lucide-react'
import type { Project } from '@/lib/db'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const CATEGORY_ORDER = ['AI', 'Machine Learning', 'Data Science', 'Automation', 'Development', 'Other']
const CATEGORY_COLORS: Record<string, string> = {
  'AI': 'linear-gradient(135deg,#6366f1,#a855f7)',
  'Machine Learning': 'linear-gradient(135deg,#a855f7,#ec4899)',
  'Data Science': 'linear-gradient(135deg,#06b6d4,#6366f1)',
  'Automation': 'linear-gradient(135deg,#f59e0b,#ef4444)',
  'Development': 'linear-gradient(135deg,#10b981,#06b6d4)',
  'Other': 'linear-gradient(135deg,#6b7280,#9ca3af)',
}

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS['Other']
}

function ProjectCard({ project, onClick, index }: { project: Project; onClick: () => void; index: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className="glass-card"
      onClick={onClick}
      data-cursor-hover
      style={{ cursor: 'none', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 200 }}>
        <img
          src={project.image || 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop'}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)' }}
          onMouseLeave={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 60%)' }} />
        {project.featured && (
          <div style={{ position: 'absolute', top: 10, right: 10, padding: '2px 8px', borderRadius: 100, background: 'linear-gradient(135deg,#6366f1,#a855f7)', fontSize: '0.65rem', fontWeight: 600, color: '#fff', letterSpacing: '0.05em' }}>
            FEATURED
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: '#f0f0f0' }}>
          {project.title}
        </h3>
        <p style={{ color: 'rgba(232,232,232,0.55)', fontSize: '0.82rem', lineHeight: 1.6, flex: 1 }}>
          {project.description.slice(0, 110)}…
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {project.techStack.slice(0, 4).map((t) => (
            <span key={t} className="skill-tag" style={{ fontSize: '0.68rem' }}>{t}</span>
          ))}
          {project.techStack.length > 4 && (
            <span className="skill-tag" style={{ fontSize: '0.68rem', opacity: 0.6 }}>+{project.techStack.length - 4}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
              style={{ color: 'rgba(232,232,232,0.5)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', textDecoration: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a5b4fc' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(232,232,232,0.5)' }}
            >
              <Github size={13} /> Code
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
              style={{ color: 'rgba(232,232,232,0.5)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', textDecoration: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a5b4fc' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(232,232,232,0.5)' }}
            >
              <ExternalLink size={13} /> Live
            </a>
          )}
          <span style={{ marginLeft: 'auto', color: 'rgba(232,232,232,0.35)', fontSize: '0.78rem', cursor: 'none' }}>View →</span>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 720, width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Full image — contains itself, no crop */}
        <div style={{ position: 'relative', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, maxHeight: 420 }}>
          <img
            src={project.image || 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=500&fit=crop'}
            alt={project.title}
            style={{ width: '100%', height: 'auto', maxHeight: 420, objectFit: 'contain', display: 'block' }}
          />
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 8, color: '#fff', cursor: 'pointer', display: 'flex' }}
          >
            <X size={16} />
          </button>
          {project.category && (
            <div style={{ position: 'absolute', top: 14, left: 14, padding: '3px 10px', borderRadius: 100, background: getCategoryColor(project.category), fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>
              {project.category}
            </div>
          )}
        </div>

        <div style={{ padding: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#f0f0f0', marginBottom: 14 }}>
            {project.title}
          </h2>
          <p style={{ color: 'rgba(232,232,232,0.65)', lineHeight: 1.8, marginBottom: 24 }}>{project.description}</p>

          <div style={{ marginBottom: 24 }}>
            <p className="section-label" style={{ marginBottom: 10 }}>Tech Stack</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {project.techStack.map((t) => <span key={t} className="skill-tag">{t}</span>)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 14 }}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="glow-button glow-button-outline" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Github size={15} /> GitHub
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="glow-button glow-button-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ExternalLink size={15} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CategoryGroup({ category, projects, onSelect }: { category: string; projects: Project[]; onSelect: (p: Project) => void }) {
  const [open, setOpen] = useState(false)
  const color = getCategoryColor(category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ marginBottom: 12 }}
    >
      {/* Category header */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 14,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: open ? '12px 12px 0 0' : 12, padding: '14px 20px',
          cursor: 'pointer', transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.055)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = open ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.03)' }}
      >
        {/* Color dot */}
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1rem', color: '#f0f0f0', flex: 1, textAlign: 'left' }}>
          {category}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'rgba(232,232,232,0.35)', marginRight: 8 }}>
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </span>
        <ChevronDown
          size={16}
          color="rgba(232,232,232,0.4)"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0 }}
        />
      </button>

      {/* Collapsible grid */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              border: '1px solid rgba(255,255,255,0.07)', borderTop: 'none',
              borderRadius: '0 0 12px 12px', padding: 16,
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16,
              background: 'rgba(255,255,255,0.015)',
            }}>
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} onClick={() => onSelect(p)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null)

  // Group projects by category
  const grouped = projects.reduce<Record<string, Project[]>>((acc, p) => {
    const cat = p.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(p)
    return acc
  }, {})

  // Sort categories by preferred order, then alphabetically
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a)
    const bi = CATEGORY_ORDER.indexOf(b)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return a.localeCompare(b)
  })

  return (
    <section id="projects">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
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

        <div>
          {sortedCategories.map((cat) => (
            <CategoryGroup key={cat} category={cat} projects={grouped[cat]} onSelect={setSelected} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}