'use client'
import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Briefcase,
  Code2,
  User,
  Clock,
  Award,
  MessageSquare,
  FileText,
  LogOut,
  Trash2,
  Edit3,
  Save,
  X,
  Eye,
  Database,
  Upload,
  ImageIcon,
} from 'lucide-react'
import type { About, Certificate, Experience, Message, Project, SkillCategory } from '@/lib/db'

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboard,
})

type Section = 'overview' | 'projects' | 'skills' | 'about' | 'experience' | 'certificates' | 'messages' | 'resume'

function AdminDashboard() {
  const [section, setSection] = useState<Section>('overview')
  const [token, setToken] = useState('')

  // Data state
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<SkillCategory[]>([])
  const [about, setAbout] = useState<About | null>(null)
  const [experience, setExperience] = useState<Experience[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [hasResume, setHasResume] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    document.body.classList.add('admin-mode')
    const t = localStorage.getItem('admin_token')
    if (!t) { window.location.href = '/admin'; return }
    setToken(t)
    return () => document.body.classList.remove('admin-mode')
  }, [])

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token])

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadAll = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const [dataRes, msgRes] = await Promise.all([
        fetch('/api/portfolio/data'),
        fetch('/api/portfolio/messages', { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (dataRes.ok) {
        const d = await dataRes.json()
        setProjects(d.projects ?? [])
        setSkills(d.skills ?? [])
        setAbout(d.about ?? null)
        setExperience(d.experience ?? [])
        setCertificates(d.certificates ?? [])
        setHasResume(d.settings?.hasResume ?? false)
      }
      if (msgRes.ok) {
        setMessages(await msgRes.json())
      }
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) loadAll()
  }, [token, loadAll])

  const logout = () => {
    localStorage.removeItem('admin_token')
    window.location.href = '/admin'
  }

  const reseed = async () => {
    if (!confirm('This will reset all demo data. Continue?')) return
    await fetch('/api/portfolio/data?force=true', {
      method: 'POST',
      headers: authHeaders(),
    })
    await loadAll()
    showToast('Demo data reset successfully')
  }

  // ── Sidebar ──────────────────────────────────────────────
  const NAV_ITEMS: { id: Section; icon: React.ReactNode; label: string; badge?: number }[] = [
    { id: 'overview', icon: <LayoutDashboard size={16} />, label: 'Overview' },
    { id: 'projects', icon: <Briefcase size={16} />, label: 'Projects', badge: projects.length },
    { id: 'skills', icon: <Code2 size={16} />, label: 'Skills' },
    { id: 'about', icon: <User size={16} />, label: 'About' },
    { id: 'experience', icon: <Clock size={16} />, label: 'Experience', badge: experience.length },
    { id: 'certificates', icon: <Award size={16} />, label: 'Certificates', badge: certificates.length },
    { id: 'messages', icon: <MessageSquare size={16} />, label: 'Messages', badge: messages.filter((m) => !m.read).length || undefined },
    { id: 'resume', icon: <FileText size={16} />, label: 'Resume' },
  ]

  const sidebarStyle: React.CSSProperties = {
    width: 240,
    background: '#0f0f0f',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 12px',
    flexShrink: 0,
    height: '100vh',
    position: 'sticky',
    top: 0,
    overflowY: 'auto',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>SR</span>
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f0f0f0' }}>Admin</p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(232,232,232,0.4)' }}>Portfolio CMS</p>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${section === item.id ? 'active' : ''}`}
              onClick={() => setSection(item.id)}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span
                  style={{
                    background: item.id === 'messages' ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'rgba(99,102,241,0.2)',
                    color: item.id === 'messages' ? '#fff' : '#a5b4fc',
                    borderRadius: 100,
                    padding: '1px 7px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a
            href="/"
            target="_blank"
            className="admin-nav-item"
          >
            <Eye size={16} /> View Site
          </a>
          <button className="admin-nav-item" onClick={reseed}>
            <Database size={16} /> Reset Demo Data
          </button>
          <button className="admin-nav-item" onClick={logout} style={{ color: 'rgba(248,113,113,0.7)' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <div style={{ width: 32, height: 32, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : (
          <>
            {section === 'overview' && <OverviewSection projects={projects} messages={messages} experience={experience} certificates={certificates} />}
            {section === 'projects' && <ProjectsAdmin projects={projects} setProjects={setProjects} token={token} showToast={showToast} />}
            {section === 'skills' && <SkillsAdmin skills={skills} setSkills={setSkills} token={token} showToast={showToast} />}
            {section === 'about' && <AboutAdmin about={about} setAbout={setAbout} token={token} showToast={showToast} />}
            {section === 'experience' && <ExperienceAdmin experience={experience} setExperience={setExperience} token={token} showToast={showToast} />}
            {section === 'certificates' && <CertificatesAdmin certificates={certificates} setCertificates={setCertificates} token={token} showToast={showToast} />}
            {section === 'messages' && <MessagesAdmin messages={messages} setMessages={setMessages} token={token} showToast={showToast} />}
            {section === 'resume' && <ResumeAdmin hasResume={hasResume} setHasResume={setHasResume} token={token} showToast={showToast} />}
          </>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: toast.type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(248,113,113,0.15)',
            border: `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)'}`,
            color: toast.type === 'success' ? '#86efac' : '#fca5a5',
            padding: '12px 20px',
            borderRadius: 10,
            fontSize: '0.875rem',
            fontWeight: 500,
            zIndex: 9999,
            animation: 'fadeUp 0.3s ease',
          }}
        >
          {toast.text}
        </div>
      )}
    </div>
  )
}

// ── Overview ───────────────────────────────────────────────────────────────

function OverviewSection({ projects, messages, experience, certificates }: {
  projects: Project[]; messages: Message[]; experience: Experience[]; certificates: Certificate[]
}) {
  const stats = [
    { label: 'Projects', value: projects.length, icon: <Briefcase size={20} />, color: '#6366f1' },
    { label: 'Unread Messages', value: messages.filter((m) => !m.read).length, icon: <MessageSquare size={20} />, color: '#a855f7' },
    { label: 'Experience Entries', value: experience.length, icon: <Clock size={20} />, color: '#ec4899' },
    { label: 'Certificates', value: certificates.length, icon: <Award size={20} />, color: '#f59e0b' },
  ]

  return (
    <div>
      <AdminHeader title="Overview" subtitle="Your portfolio at a glance" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {stats.map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ color: s.color }}>{s.icon}</div>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: '#f0f0f0', fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</span>
            </div>
            <p style={{ color: 'rgba(232,232,232,0.5)', fontSize: '0.85rem' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ fontWeight: 600, color: '#f0f0f0', marginBottom: 16, fontSize: '0.95rem' }}>Recent Messages</h3>
        {messages.length === 0 ? (
          <p style={{ color: 'rgba(232,232,232,0.4)', fontSize: '0.875rem' }}>No messages yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.slice(-5).reverse().map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {!m.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 500, fontSize: '0.875rem', color: '#f0f0f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name} — {m.subject}</p>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(232,232,232,0.4)' }}>{new Date(m.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Projects ────────────────────────────────────────────────────────────────

function ProjectsAdmin({ projects, setProjects, token, showToast }: {
  projects: Project[]; setProjects: (p: Project[]) => void; token: string; showToast: (t: string, type?: 'success' | 'error') => void
}) {
  const [editing, setEditing] = useState<Partial<Project> | null>(null)
  const [isNew, setIsNew] = useState(false)

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  const blankProject: Partial<Project> = {
    title: '', description: '', techStack: [], image: '', github: '', liveUrl: '', featured: false, category: '',
  }

  const save = async () => {
    if (!editing) return
    const techStack = typeof editing.techStack === 'string'
      ? (editing.techStack as unknown as string).split(',').map((s) => s.trim()).filter(Boolean)
      : editing.techStack ?? []

    const payload = { ...editing, techStack }

    if (isNew) {
      const res = await fetch('/api/portfolio/projects', { method: 'POST', headers, body: JSON.stringify(payload) })
      if (res.ok) {
        const p = await res.json()
        setProjects([...projects, p])
        showToast('Project created')
      } else showToast('Failed to create', 'error')
    } else {
      const res = await fetch(`/api/portfolio/projects/${editing.id}`, { method: 'PUT', headers, body: JSON.stringify(payload) })
      if (res.ok) {
        const p = await res.json()
        setProjects(projects.map((x) => x.id === p.id ? p : x))
        showToast('Project updated')
      } else showToast('Failed to update', 'error')
    }
    setEditing(null)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return
    const res = await fetch(`/api/portfolio/projects/${id}`, { method: 'DELETE', headers })
    if (res.ok) {
      setProjects(projects.filter((p) => p.id !== id))
      showToast('Project deleted')
    } else showToast('Failed to delete', 'error')
  }

  return (
    <div>
      <AdminHeader title="Projects" subtitle={`${projects.length} projects`} action={{ label: '+ Add Project', onClick: () => { setEditing(blankProject); setIsNew(true) } }} />

      {editing && (
        <FormModal title={isNew ? 'New Project' : 'Edit Project'} onClose={() => setEditing(null)} onSave={save}>
          <FormRow label="Title"><AdminInput value={editing.title ?? ''} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Project title" /></FormRow>
          <FormRow label="Description"><AdminTextarea value={editing.description ?? ''} onChange={(v) => setEditing({ ...editing, description: v })} rows={4} placeholder="Project description" /></FormRow>
          <FormRow label="Tech Stack (comma-separated)"><AdminInput value={Array.isArray(editing.techStack) ? editing.techStack.join(', ') : (editing.techStack ?? '')} onChange={(v) => setEditing({ ...editing, techStack: v as unknown as string[] })} placeholder="React, TypeScript, Python" /></FormRow>
          <FormRow label="Category">
            <select
              value={editing.category ?? ''}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              style={{ width: '100%', ...inputBaseStyle }}
            >
              <option value="">— Select category —</option>
              <option value="AI">AI</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="Automation">Automation</option>
              <option value="Development">Development</option>
              <option value="CV">CV</option>
              <option value="Other">Other</option>
            </select>
          </FormRow>
          <FormRow label="Image"><ImageUploader value={editing.image ?? ''} onChange={(v) => setEditing({ ...editing, image: v })} token={token} /></FormRow>
          <FormRow label="GitHub URL"><AdminInput value={editing.github ?? ''} onChange={(v) => setEditing({ ...editing, github: v })} placeholder="https://github.com/..." /></FormRow>
          <FormRow label="Live URL"><AdminInput value={editing.liveUrl ?? ''} onChange={(v) => setEditing({ ...editing, liveUrl: v })} placeholder="https://..." /></FormRow>
          <FormRow label="Featured">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#e8e8e8', fontSize: '0.875rem' }}>
              <input type="checkbox" checked={editing.featured ?? false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} style={{ width: 16, height: 16, accentColor: '#6366f1' }} />
              Show as featured project
            </label>
          </FormRow>
        </FormModal>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {projects.map((p) => (
          <div key={p.id} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            {p.image && <img src={p.image} alt={p.title} style={{ width: 60, height: 44, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <p style={{ fontWeight: 600, color: '#f0f0f0', fontSize: '0.9rem' }}>{p.title}</p>
                {p.featured && <span style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', borderRadius: 4, padding: '1px 6px', fontSize: '0.65rem' }}>FEATURED</span>}
              </div>
              <p style={{ color: 'rgba(232,232,232,0.4)', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.techStack.join(' · ')}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <AdminIconButton onClick={() => { setEditing(p); setIsNew(false) }} icon={<Edit3 size={14} />} />
              <AdminIconButton onClick={() => remove(p.id)} icon={<Trash2 size={14} />} danger />
            </div>
          </div>
        ))}
        {projects.length === 0 && <EmptyState message="No projects yet. Add your first project!" />}
      </div>
    </div>
  )
}

// ── Skills ──────────────────────────────────────────────────────────────────

function SkillsAdmin({ skills, setSkills, token, showToast }: {
  skills: SkillCategory[]; setSkills: (s: SkillCategory[]) => void; token: string; showToast: (t: string, type?: 'success' | 'error') => void
}) {
  const [editing, setEditing] = useState<SkillCategory | null>(null)

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  const save = async () => {
    if (!editing) return
    const skillsList = typeof editing.skills === 'string'
      ? (editing.skills as unknown as string).split(',').map((s) => s.trim()).filter(Boolean)
      : editing.skills

    const updated = skills.find((s) => s.id === editing.id)
      ? skills.map((s) => s.id === editing.id ? { ...editing, skills: skillsList } : s)
      : [...skills, { ...editing, id: crypto.randomUUID(), skills: skillsList }]

    const res = await fetch('/api/portfolio/skills', {
      method: 'POST',
      headers,
      body: JSON.stringify({ replace: true, categories: updated }),
    })
    if (res.ok) { setSkills(updated); showToast('Skills saved') }
    else showToast('Failed to save', 'error')
    setEditing(null)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this category?')) return
    const updated = skills.filter((s) => s.id !== id)
    await fetch('/api/portfolio/skills', { method: 'POST', headers, body: JSON.stringify({ replace: true, categories: updated }) })
    setSkills(updated)
    showToast('Category deleted')
  }

  return (
    <div>
      <AdminHeader title="Skills" subtitle="Manage skill categories" action={{ label: '+ Add Category', onClick: () => setEditing({ id: '', name: '', icon: '🛠️', skills: [] }) }} />

      {editing && (
        <FormModal title="Skill Category" onClose={() => setEditing(null)} onSave={save}>
          <FormRow label="Category Name"><AdminInput value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} placeholder="AI / ML" /></FormRow>
          <FormRow label="Icon (emoji)"><AdminInput value={editing.icon} onChange={(v) => setEditing({ ...editing, icon: v })} placeholder="🧠" /></FormRow>
          <FormRow label="Skills (comma-separated)"><AdminTextarea value={Array.isArray(editing.skills) ? editing.skills.join(', ') : (editing.skills as unknown as string)} onChange={(v) => setEditing({ ...editing, skills: v as unknown as string[] })} placeholder="TensorFlow, PyTorch, OpenCV" rows={3} /></FormRow>
        </FormModal>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {skills.map((cat) => (
          <div key={cat.id} className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                <p style={{ fontWeight: 600, color: '#f0f0f0', fontSize: '0.9rem' }}>{cat.name}</p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <AdminIconButton onClick={() => setEditing(cat)} icon={<Edit3 size={13} />} />
                <AdminIconButton onClick={() => remove(cat.id)} icon={<Trash2 size={13} />} danger />
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {cat.skills.map((s) => (
                <span key={s} className="skill-tag" style={{ fontSize: '0.7rem' }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
        {skills.length === 0 && <EmptyState message="No skill categories yet." />}
      </div>
    </div>
  )
}

// ── About ───────────────────────────────────────────────────────────────────

function AboutAdmin({ about, setAbout, token, showToast }: {
  about: About | null; setAbout: (a: About) => void; token: string; showToast: (t: string, type?: 'success' | 'error') => void
}) {
  const [form, setForm] = useState<About>(about ?? {
    name: '', role: '', bio: '', location: '', email: '', github: '', linkedin: '', twitter: '', profileImage: '', highlights: [],
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (about) setForm(about) }, [about])

  const save = async () => {
    setSaving(true)
    const highlights = typeof form.highlights === 'string'
      ? (form.highlights as unknown as string).split('\n').filter(Boolean)
      : form.highlights

    const res = await fetch('/api/portfolio/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, highlights }),
    })
    setSaving(false)
    if (res.ok) { setAbout({ ...form, highlights }); showToast('About section saved') }
    else showToast('Failed to save', 'error')
  }

  return (
    <div>
      <AdminHeader title="About" subtitle="Edit your profile" />
      <div className="glass-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
        <FormRow label="Full Name"><AdminInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Your name" /></FormRow>
        <FormRow label="Role / Title"><AdminInput value={form.role} onChange={(v) => setForm({ ...form, role: v })} placeholder="AI Engineer" /></FormRow>
        <FormRow label="Bio"><AdminTextarea value={form.bio} onChange={(v) => setForm({ ...form, bio: v })} rows={5} placeholder="Tell your story..." /></FormRow>
        <FormRow label="Location"><AdminInput value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="San Francisco, CA" /></FormRow>
        <FormRow label="Email"><AdminInput value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@example.com" /></FormRow>
        <FormRow label="GitHub URL"><AdminInput value={form.github} onChange={(v) => setForm({ ...form, github: v })} placeholder="https://github.com/..." /></FormRow>
        <FormRow label="LinkedIn URL"><AdminInput value={form.linkedin} onChange={(v) => setForm({ ...form, linkedin: v })} placeholder="https://linkedin.com/in/..." /></FormRow>
        <FormRow label="Twitter URL"><AdminInput value={form.twitter ?? ''} onChange={(v) => setForm({ ...form, twitter: v })} placeholder="https://twitter.com/..." /></FormRow>
        <FormRow label="Profile Image"><ImageUploader value={form.profileImage ?? ''} onChange={(v) => setForm({ ...form, profileImage: v })} token={token} /></FormRow>
        <FormRow label="Highlights (one per line)">
          <AdminTextarea
            value={Array.isArray(form.highlights) ? form.highlights.join('\n') : (form.highlights as unknown as string)}
            onChange={(v) => setForm({ ...form, highlights: v as unknown as string[] })}
            rows={4}
            placeholder="5+ years in AI/ML&#10;Published research..."
          />
        </FormRow>

        <button
          onClick={save}
          disabled={saving}
          className="glow-button glow-button-primary"
          style={{ alignSelf: 'flex-start', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          {saving ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Saving…</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>
    </div>
  )
}

// ── Experience ──────────────────────────────────────────────────────────────

function ExperienceAdmin({ experience, setExperience, token, showToast }: {
  experience: Experience[]; setExperience: (e: Experience[]) => void; token: string; showToast: (t: string, type?: 'success' | 'error') => void
}) {
  const [editing, setEditing] = useState<Partial<Experience> | null>(null)
  const [isNew, setIsNew] = useState(false)

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  const blank: Partial<Experience> = { type: 'work', title: '', company: '', period: '', description: '', tags: [] }

  const save = async () => {
    if (!editing) return
    const tags = typeof editing.tags === 'string'
      ? (editing.tags as unknown as string).split(',').map((s) => s.trim()).filter(Boolean)
      : editing.tags ?? []

    const payload = { ...editing, tags }

    if (isNew) {
      const res = await fetch('/api/portfolio/experience', { method: 'POST', headers, body: JSON.stringify(payload) })
      if (res.ok) { const e = await res.json(); setExperience([...experience, e]); showToast('Entry added') }
      else showToast('Failed', 'error')
    } else {
      const res = await fetch(`/api/portfolio/experience/${editing.id}`, { method: 'PUT', headers, body: JSON.stringify(payload) })
      if (res.ok) { const e = await res.json(); setExperience(experience.map((x) => x.id === e.id ? e : x)); showToast('Entry updated') }
      else showToast('Failed', 'error')
    }
    setEditing(null)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this entry?')) return
    const res = await fetch(`/api/portfolio/experience/${id}`, { method: 'DELETE', headers })
    if (res.ok) { setExperience(experience.filter((e) => e.id !== id)); showToast('Deleted') }
  }

  return (
    <div>
      <AdminHeader title="Experience & Education" subtitle="Manage your timeline" action={{ label: '+ Add Entry', onClick: () => { setEditing(blank); setIsNew(true) } }} />

      {editing && (
        <FormModal title={isNew ? 'New Entry' : 'Edit Entry'} onClose={() => setEditing(null)} onSave={save}>
          <FormRow label="Type">
            <select
              value={editing.type ?? 'work'}
              onChange={(e) => setEditing({ ...editing, type: e.target.value as 'work' | 'education' })}
              style={{ width: '100%', ...inputBaseStyle }}
            >
              <option value="work">Work</option>
              <option value="education">Education</option>
            </select>
          </FormRow>
          <FormRow label="Title"><AdminInput value={editing.title ?? ''} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Software Engineer" /></FormRow>
          <FormRow label="Company / School"><AdminInput value={editing.company ?? ''} onChange={(v) => setEditing({ ...editing, company: v })} placeholder="Company name" /></FormRow>
          <FormRow label="Period"><AdminInput value={editing.period ?? ''} onChange={(v) => setEditing({ ...editing, period: v })} placeholder="2021 – Present" /></FormRow>
          <FormRow label="Description"><AdminTextarea value={editing.description ?? ''} onChange={(v) => setEditing({ ...editing, description: v })} rows={3} placeholder="What you did..." /></FormRow>
          <FormRow label="Tags (comma-separated)"><AdminInput value={Array.isArray(editing.tags) ? editing.tags.join(', ') : (editing.tags as unknown as string ?? '')} onChange={(v) => setEditing({ ...editing, tags: v as unknown as string[] })} placeholder="Python, React, AWS" /></FormRow>
        </FormModal>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {experience.map((e) => (
          <div key={e.id} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.type === 'work' ? '#6366f1' : '#a855f7', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, color: '#f0f0f0', fontSize: '0.9rem' }}>{e.title}</p>
              <p style={{ color: 'rgba(232,232,232,0.4)', fontSize: '0.8rem' }}>{e.company} · {e.period}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <AdminIconButton onClick={() => { setEditing(e); setIsNew(false) }} icon={<Edit3 size={14} />} />
              <AdminIconButton onClick={() => remove(e.id)} icon={<Trash2 size={14} />} danger />
            </div>
          </div>
        ))}
        {experience.length === 0 && <EmptyState message="No experience entries yet." />}
      </div>
    </div>
  )
}

// ── Certificates ────────────────────────────────────────────────────────────

function CertificatesAdmin({ certificates, setCertificates, token, showToast }: {
  certificates: Certificate[]; setCertificates: (c: Certificate[]) => void; token: string; showToast: (t: string, type?: 'success' | 'error') => void
}) {
  const [editing, setEditing] = useState<Partial<Certificate> | null>(null)
  const [isNew, setIsNew] = useState(false)

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  const blank: Partial<Certificate> = { title: '', issuer: '', date: '', image: '', url: '' }

  const save = async () => {
    if (!editing) return
    if (isNew) {
      const res = await fetch('/api/portfolio/certificates', { method: 'POST', headers, body: JSON.stringify(editing) })
      if (res.ok) { const c = await res.json(); setCertificates([...certificates, c]); showToast('Certificate added') }
    } else {
      const res = await fetch(`/api/portfolio/certificates/${editing.id}`, { method: 'PUT', headers, body: JSON.stringify(editing) })
      if (res.ok) { const c = await res.json(); setCertificates(certificates.map((x) => x.id === c.id ? c : x)); showToast('Updated') }
    }
    setEditing(null)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this certificate?')) return
    await fetch(`/api/portfolio/certificates/${id}`, { method: 'DELETE', headers })
    setCertificates(certificates.filter((c) => c.id !== id))
    showToast('Deleted')
  }

  return (
    <div>
      <AdminHeader title="Certificates" subtitle="Manage your credentials" action={{ label: '+ Add Certificate', onClick: () => { setEditing(blank); setIsNew(true) } }} />

      {editing && (
        <FormModal title={isNew ? 'New Certificate' : 'Edit Certificate'} onClose={() => setEditing(null)} onSave={save}>
          <FormRow label="Title"><AdminInput value={editing.title ?? ''} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="TensorFlow Developer Certificate" /></FormRow>
          <FormRow label="Issuer"><AdminInput value={editing.issuer ?? ''} onChange={(v) => setEditing({ ...editing, issuer: v })} placeholder="Google" /></FormRow>
          <FormRow label="Date"><AdminInput value={editing.date ?? ''} onChange={(v) => setEditing({ ...editing, date: v })} placeholder="2023" /></FormRow>
          <FormRow label="Image"><ImageUploader value={editing.image ?? ''} onChange={(v) => setEditing({ ...editing, image: v })} token={token} /></FormRow>
          <FormRow label="Certificate URL"><AdminInput value={editing.url ?? ''} onChange={(v) => setEditing({ ...editing, url: v })} placeholder="https://credential.net/..." /></FormRow>
        </FormModal>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {certificates.map((c) => (
          <div key={c.id} className="glass-card" style={{ overflow: 'hidden' }}>
            {c.image && <img src={c.image} alt={c.title} style={{ width: '100%', height: 120, objectFit: 'cover' }} />}
            <div style={{ padding: 16 }}>
              <p style={{ fontWeight: 600, color: '#f0f0f0', fontSize: '0.875rem', marginBottom: 4 }}>{c.title}</p>
              <p style={{ color: 'rgba(232,232,232,0.5)', fontSize: '0.8rem', marginBottom: 12 }}>{c.issuer} · {c.date}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <AdminIconButton onClick={() => { setEditing(c); setIsNew(false) }} icon={<Edit3 size={13} />} />
                <AdminIconButton onClick={() => remove(c.id)} icon={<Trash2 size={13} />} danger />
              </div>
            </div>
          </div>
        ))}
        {certificates.length === 0 && <EmptyState message="No certificates yet." />}
      </div>
    </div>
  )
}

// ── Messages ────────────────────────────────────────────────────────────────

function MessagesAdmin({ messages, setMessages, token, showToast }: {
  messages: Message[]; setMessages: (m: Message[]) => void; token: string; showToast: (t: string, type?: 'success' | 'error') => void
}) {
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  const [selected, setSelected] = useState<Message | null>(null)

  const markRead = async (id: string) => {
    await fetch('/api/portfolio/messages', { method: 'PUT', headers, body: JSON.stringify({ id }) })
    setMessages(messages.map((m) => m.id === id ? { ...m, read: true } : m))
  }

  const remove = async (id: string) => {
    await fetch(`/api/portfolio/messages/${id}`, { method: 'DELETE', headers })
    setMessages(messages.filter((m) => m.id !== id))
    if (selected?.id === id) setSelected(null)
    showToast('Message deleted')
  }

  return (
    <div>
      <AdminHeader title="Messages" subtitle={`${messages.filter((m) => !m.read).length} unread`} />

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.length === 0 && <EmptyState message="No messages yet." />}
          {[...messages].reverse().map((m) => (
            <div
              key={m.id}
              onClick={() => { setSelected(m); if (!m.read) markRead(m.id) }}
              className="glass-card"
              style={{
                padding: '14px 18px',
                cursor: 'pointer',
                borderColor: selected?.id === m.id ? 'rgba(99,102,241,0.4)' : undefined,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {!m.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: m.read ? 400 : 600, color: '#f0f0f0', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</p>
                <p style={{ color: 'rgba(232,232,232,0.4)', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.subject}</p>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(232,232,232,0.3)' }}>{new Date(m.createdAt).toLocaleDateString()}</span>
                <AdminIconButton onClick={(e) => { e.stopPropagation(); remove(m.id) }} icon={<Trash2 size={12} />} danger />
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontWeight: 600, color: '#f0f0f0', marginBottom: 4 }}>{selected.subject}</h3>
                <p style={{ color: 'rgba(232,232,232,0.5)', fontSize: '0.8rem' }}>From: {selected.name} &lt;{selected.email}&gt;</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(232,232,232,0.4)', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <p style={{ color: 'rgba(232,232,232,0.7)', lineHeight: 1.7, fontSize: '0.9rem' }}>{selected.message}</p>
            <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
              <a href={`mailto:${selected.email}`} className="glow-button glow-button-primary" style={{ textDecoration: 'none', fontSize: '0.8rem', padding: '8px 16px' }}>Reply via Email</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Resume ──────────────────────────────────────────────────────────────────

function ResumeAdmin({ hasResume, setHasResume, token, showToast }: {
  hasResume: boolean; setHasResume: (v: boolean) => void; token: string; showToast: (t: string, type?: 'success' | 'error') => void
}) {
  const [uploading, setUploading] = useState(false)
  const headers = { Authorization: `Bearer ${token}` }

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('resume', file)
    const res = await fetch('/api/admin/resume', { method: 'POST', headers, body: fd })
    setUploading(false)
    if (res.ok) { setHasResume(true); showToast('Resume uploaded successfully') }
    else showToast('Upload failed', 'error')
  }

  const remove = async () => {
    if (!confirm('Delete resume?')) return
    await fetch('/api/admin/resume', { method: 'DELETE', headers })
    setHasResume(false)
    showToast('Resume deleted')
  }

  return (
    <div>
      <AdminHeader title="Resume" subtitle="Manage your downloadable resume" />

      <div className="glass-card" style={{ padding: 32, maxWidth: 480 }}>
        {hasResume ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} color="#6366f1" />
              </div>
              <div>
                <p style={{ fontWeight: 600, color: '#f0f0f0', fontSize: '0.95rem' }}>resume.pdf</p>
                <p style={{ color: 'rgba(232,232,232,0.4)', fontSize: '0.8rem' }}>Uploaded and active</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="/api/admin/resume" target="_blank" rel="noreferrer" className="glow-button glow-button-outline" style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '8px 16px' }}>
                Preview ↗
              </a>
              <label className="glow-button glow-button-outline" style={{ cursor: 'pointer', fontSize: '0.85rem', padding: '8px 16px' }}>
                Replace
                <input type="file" accept=".pdf" onChange={upload} style={{ display: 'none' }} />
              </label>
              <button onClick={remove} className="glow-button" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#fca5a5', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <FileText size={48} color="rgba(99,102,241,0.5)" style={{ margin: '0 auto 16px', display: 'block' }} />
            <p style={{ color: '#f0f0f0', fontWeight: 600, marginBottom: 8 }}>No resume uploaded</p>
            <p style={{ color: 'rgba(232,232,232,0.4)', fontSize: '0.875rem', marginBottom: 20 }}>Upload a PDF to enable the Resume button in the navbar.</p>
            <label className="glow-button glow-button-primary" style={{ cursor: 'pointer' }}>
              {uploading ? 'Uploading…' : 'Upload Resume (PDF)'}
              <input type="file" accept=".pdf" onChange={upload} style={{ display: 'none' }} disabled={uploading} />
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function AdminHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#f0f0f0', marginBottom: 4 }}>{title}</h1>
        {subtitle && <p style={{ color: 'rgba(232,232,232,0.4)', fontSize: '0.875rem' }}>{subtitle}</p>}
      </div>
      {action && (
        <button onClick={action.onClick} className="glow-button glow-button-primary" style={{ cursor: 'pointer', fontSize: '0.85rem', padding: '10px 20px' }}>
          {action.label}
        </button>
      )}
    </div>
  )
}

const inputBaseStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 14px',
  color: '#e8e8e8',
  fontSize: '0.875rem',
  outline: 'none',
  fontFamily: 'inherit',
  cursor: 'auto',
}

function AdminInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ ...inputBaseStyle, width: '100%' }}
    />
  )
}

function AdminTextarea({ value, onChange, rows = 3, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      style={{ ...inputBaseStyle, width: '100%', resize: 'vertical' }}
    />
  )
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(232,232,232,0.5)', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  )
}

function FormModal({ title, onClose, onSave, children }: { title: string; onClose: () => void; onSave: () => void; children: React.ReactNode }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 560, background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontWeight: 600, color: '#f0f0f0', fontSize: '1rem' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(232,232,232,0.4)', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={onClose} className="glow-button glow-button-outline" style={{ cursor: 'pointer', padding: '8px 20px', fontSize: '0.875rem' }}>Cancel</button>
          <button onClick={onSave} className="glow-button glow-button-primary" style={{ cursor: 'pointer', padding: '8px 20px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Save size={14} /> Save
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminIconButton({ onClick, icon, danger }: { onClick: (e: React.MouseEvent) => void; icon: React.ReactNode; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: danger ? 'rgba(248,113,113,0.1)' : 'rgba(99,102,241,0.1)',
        border: `1px solid ${danger ? 'rgba(248,113,113,0.2)' : 'rgba(99,102,241,0.2)'}`,
        color: danger ? '#fca5a5' : '#a5b4fc',
        borderRadius: 6,
        padding: '6px 8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'background 0.2s',
      }}
    >
      {icon}
    </button>
  )
}

function ImageUploader({ value, onChange, token }: { value: string; onChange: (v: string) => void; token: string }) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('image', file)
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })
    setUploading(false)
    if (res.ok) {
      const { url } = await res.json()
      onChange(url)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {value && (
        <div style={{ position: 'relative', width: '100%', height: 120, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button
            onClick={() => onChange('')}
            style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', padding: '2px 6px', fontSize: '0.75rem' }}
          >
            ✕
          </button>
        </div>
      )}
      <label style={{
        display: 'flex', alignItems: 'center', gap: 8, cursor: uploading ? 'not-allowed' : 'pointer',
        background: 'rgba(99,102,241,0.1)', border: '1px dashed rgba(99,102,241,0.4)',
        borderRadius: 8, padding: '10px 14px', color: '#a5b4fc', fontSize: '0.875rem',
        opacity: uploading ? 0.6 : 1,
      }}>
        {uploading
          ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(165,180,252,0.3)', borderTopColor: '#a5b4fc', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Uploading…</>
          : <><Upload size={14} /> {value ? 'Replace image' : 'Upload image'}</>
        }
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} style={{ display: 'none' }} />
      </label>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="glass-card" style={{ padding: 32, textAlign: 'center', color: 'rgba(232,232,232,0.4)', fontSize: '0.875rem' }}>
      {message}
    </div>
  )
}