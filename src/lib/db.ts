import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''

const isSupabaseConfigured = !!(supabaseUrl && supabaseKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
  : null

// In-memory fallback store for local development when Supabase is not configured
const memoryStore: Record<string, any> = {}

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase URL or Key not set. Falling back to an in-memory key-value database for local development.'
  )
}

async function getJSON<T>(key: string): Promise<T | null> {
  if (!supabase) {
    return (memoryStore[key] as T) ?? null
  }
  try {
    const { data, error } = await supabase
      .from('portfolio_store')
      .select('value')
      .eq('key', key)
      .maybeSingle()

    if (error) {
      console.error(`Error getting key ${key} from Supabase:`, error)
      return null
    }
    return (data?.value as T) ?? null
  } catch (err) {
    console.error(`Unhandled error getting key ${key} from Supabase:`, err)
    return null
  }
}

async function setJSON(key: string, value: any): Promise<void> {
  if (!supabase) {
    memoryStore[key] = value
    return
  }
  try {
    const { error } = await supabase
      .from('portfolio_store')
      .upsert({ key, value })

    if (error) {
      console.error(`Error setting key ${key} in Supabase:`, error)
      throw error
    }
  } catch (err) {
    console.error(`Unhandled error setting key ${key} in Supabase:`, err)
    throw err
  }
}

async function deleteKey(key: string): Promise<void> {
  if (!supabase) {
    delete memoryStore[key]
    return
  }
  try {
    const { error } = await supabase
      .from('portfolio_store')
      .delete()
      .eq('key', key)

    if (error) {
      console.error(`Error deleting key ${key} in Supabase:`, error)
      throw error
    }
  } catch (err) {
    console.error(`Unhandled error deleting key ${key} in Supabase:`, err)
    throw err
  }
}

function store() {
  return {
    get: async (key: string, options?: { type: 'json' | 'blob' }) => {
      if (options?.type === 'blob') {
        const record = await getJSON<{ base64: string }>(`${key}_file`)
        if (!record) return null
        const buffer = Buffer.from(record.base64, 'base64')
        return new Blob([buffer], { type: 'application/pdf' })
      }
      return getJSON(key)
    },
    setJSON: async (key: string, value: any) => {
      await setJSON(key, value)
    },
    set: async (key: string, data: ArrayBuffer) => {
      const base64 = Buffer.from(data).toString('base64')
      await setJSON(`${key}_file`, { base64 })
    },
    delete: async (key: string) => {
      await deleteKey(key)
      await deleteKey(`${key}_file`)
    },
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  image: string
  github?: string
  liveUrl?: string
  featured: boolean
  createdAt: string
  category?: string
}

export interface SkillCategory {
  id: string
  name: string
  skills: string[]
  icon: string
}

export interface About {
  name: string
  role: string
  bio: string
  location: string
  email: string
  github: string
  linkedin: string
  twitter?: string
  profileImage?: string
  highlights: string[]
}

export interface Experience {
  id: string
  type: 'work' | 'education'
  title: string
  company: string
  period: string
  description: string
  tags: string[]
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  image?: string
  url?: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  read: boolean
}

export interface Settings {
  hasResume: boolean
  seeded: boolean
  siteTitle: string
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const data = await store().get('projects', { type: 'json' })
  return (data as Project[]) ?? []
}

export async function setProjects(projects: Project[]): Promise<void> {
  await store().setJSON('projects', projects)
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
  const projects = await getProjects()
  const newProject: Project = {
    ...project,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  await setProjects([...projects, newProject])
  return newProject
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const projects = await getProjects()
  const idx = projects.findIndex((p) => p.id === id)
  if (idx === -1) return null
  projects[idx] = { ...projects[idx], ...updates, id }
  await setProjects(projects)
  return projects[idx]
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getProjects()
  const filtered = projects.filter((p) => p.id !== id)
  if (filtered.length === projects.length) return false
  await setProjects(filtered)
  return true
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export async function getSkills(): Promise<SkillCategory[]> {
  const data = await store().get('skills', { type: 'json' })
  return (data as SkillCategory[]) ?? []
}

export async function setSkills(skills: SkillCategory[]): Promise<void> {
  await store().setJSON('skills', skills)
}

export async function updateSkillCategory(id: string, updates: Partial<SkillCategory>): Promise<SkillCategory | null> {
  const skills = await getSkills()
  const idx = skills.findIndex((s) => s.id === id)
  if (idx === -1) return null
  skills[idx] = { ...skills[idx], ...updates, id }
  await setSkills(skills)
  return skills[idx]
}

export async function createSkillCategory(cat: Omit<SkillCategory, 'id'>): Promise<SkillCategory> {
  const skills = await getSkills()
  const newCat: SkillCategory = { ...cat, id: crypto.randomUUID() }
  await setSkills([...skills, newCat])
  return newCat
}

export async function deleteSkillCategory(id: string): Promise<boolean> {
  const skills = await getSkills()
  const filtered = skills.filter((s) => s.id !== id)
  if (filtered.length === skills.length) return false
  await setSkills(filtered)
  return true
}

// ─── About ────────────────────────────────────────────────────────────────────

export async function getAbout(): Promise<About | null> {
  const data = await store().get('about', { type: 'json' })
  return (data as About) ?? null
}

export async function setAbout(about: About): Promise<void> {
  await store().setJSON('about', about)
}

// ─── Experience ───────────────────────────────────────────────────────────────

export async function getExperience(): Promise<Experience[]> {
  const data = await store().get('experience', { type: 'json' })
  return (data as Experience[]) ?? []
}

export async function setExperience(items: Experience[]): Promise<void> {
  await store().setJSON('experience', items)
}

export async function createExperience(item: Omit<Experience, 'id'>): Promise<Experience> {
  const items = await getExperience()
  const newItem: Experience = { ...item, id: crypto.randomUUID() }
  await setExperience([...items, newItem])
  return newItem
}

export async function updateExperience(id: string, updates: Partial<Experience>): Promise<Experience | null> {
  const items = await getExperience()
  const idx = items.findIndex((e) => e.id === id)
  if (idx === -1) return null
  items[idx] = { ...items[idx], ...updates, id }
  await setExperience(items)
  return items[idx]
}

export async function deleteExperience(id: string): Promise<boolean> {
  const items = await getExperience()
  const filtered = items.filter((e) => e.id !== id)
  if (filtered.length === items.length) return false
  await setExperience(filtered)
  return true
}

// ─── Certificates ─────────────────────────────────────────────────────────────

export async function getCertificates(): Promise<Certificate[]> {
  const data = await store().get('certificates', { type: 'json' })
  return (data as Certificate[]) ?? []
}

export async function setCertificates(certs: Certificate[]): Promise<void> {
  await store().setJSON('certificates', certs)
}

export async function createCertificate(cert: Omit<Certificate, 'id'>): Promise<Certificate> {
  const certs = await getCertificates()
  const newCert: Certificate = { ...cert, id: crypto.randomUUID() }
  await setCertificates([...certs, newCert])
  return newCert
}

export async function updateCertificate(id: string, updates: Partial<Certificate>): Promise<Certificate | null> {
  const certs = await getCertificates()
  const idx = certs.findIndex((c) => c.id === id)
  if (idx === -1) return null
  certs[idx] = { ...certs[idx], ...updates, id }
  await setCertificates(certs)
  return certs[idx]
}

export async function deleteCertificate(id: string): Promise<boolean> {
  const certs = await getCertificates()
  const filtered = certs.filter((c) => c.id !== id)
  if (filtered.length === certs.length) return false
  await setCertificates(filtered)
  return true
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function getMessages(): Promise<Message[]> {
  const data = await store().get('messages', { type: 'json' })
  return (data as Message[]) ?? []
}

export async function createMessage(msg: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<Message> {
  const messages = await getMessages()
  const newMsg: Message = {
    ...msg,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    read: false,
  }
  await store().setJSON('messages', [...messages, newMsg])
  return newMsg
}

export async function markMessageRead(id: string): Promise<void> {
  const messages = await getMessages()
  const idx = messages.findIndex((m) => m.id === id)
  if (idx !== -1) {
    messages[idx].read = true
    await store().setJSON('messages', messages)
  }
}

export async function deleteMessage(id: string): Promise<boolean> {
  const messages = await getMessages()
  const filtered = messages.filter((m) => m.id !== id)
  if (filtered.length === messages.length) return false
  await store().setJSON('messages', filtered)
  return true
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<Settings> {
  const data = await store().get('settings', { type: 'json' })
  return (data as Settings) ?? { hasResume: false, seeded: false, siteTitle: 'Portfolio' }
}

export async function setSettings(settings: Partial<Settings>): Promise<void> {
  const current = await getSettings()
  await store().setJSON('settings', { ...current, ...settings })
}

// ─── Resume ───────────────────────────────────────────────────────────────────

export async function getResume(): Promise<Blob | null> {
  return (await store().get('resume', { type: 'blob' })) as Blob | null
}

export async function setResume(data: ArrayBuffer): Promise<void> {
  await store().set('resume', data)
  await setSettings({ hasResume: true })
  // The cached text belongs to the previous file — drop it so the next reader
  // re-extracts from the new upload rather than answering from a stale resume.
  await deleteKey('resume_text')
}

export async function deleteResume(): Promise<void> {
  await store().delete('resume')
  await setSettings({ hasResume: false })
  await deleteKey('resume_text')
}

/** Raw PDF bytes, for text extraction. Returns null when nothing is uploaded. */
export async function getResumeBytes(): Promise<Uint8Array | null> {
  const record = await getJSON<{ base64: string }>('resume_file')
  if (!record?.base64) return null
  return new Uint8Array(Buffer.from(record.base64, 'base64'))
}

export interface ResumeText {
  text: string
  pages: number
  extractedAt: string
}

/**
 * Extracted resume text, cached so the PDF is only parsed once per upload
 * rather than on every visitor question.
 */
export async function getResumeText(): Promise<ResumeText | null> {
  return getJSON<ResumeText>('resume_text')
}

export async function setResumeText(value: ResumeText): Promise<void> {
  await setJSON('resume_text', value)
}