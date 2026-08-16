'use client'
import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, ClipboardList, MessageSquare, Sparkles } from 'lucide-react'

type Tab = 'ask' | 'match'
type Strength = 'strong' | 'partial'

interface Turn {
  question: string
  answer: string
}

interface MatchRequirement {
  requirement: string
  evidence: string
  strength: Strength
}

interface MatchResult {
  roleTitle: string
  summary: string
  requirements: Array<MatchRequirement>
  notCovered: number
  totalRequirements: number
}

const SUGGESTIONS = [
  'What LLM projects has he built?',
  'Does he have RAG experience?',
  'What is his strongest technical area?',
  'Tell me about his education.',
]

/**
 * Opening line, hardcoded rather than generated: it costs no API quota, never
 * varies, and shows instantly instead of after a round-trip.
 */
const GREETING =
  "Hey — I'm Shafayatur's agent. I've read his resume and everything he's built, so you can get straight answers here instead of waiting on a reply. Ask me anything about his work, or paste a job post in the other tab."

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

function focusOn(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = 'rgba(99,102,241,0.5)'
  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
}
function focusOff(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = 'rgba(255,255,255,0.1)'
  e.target.style.boxShadow = 'none'
}

/** Read an { error } body if present, else fall back to a generic message. */
async function errorFrom(res: Response): Promise<string> {
  try {
    const body = await res.json()
    if (typeof body?.error === 'string') return body.error
  } catch {
    /* non-JSON error body */
  }
  return 'Something went wrong. Please try again.'
}

function ThinkingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18 }}
          style={{ width: 5, height: 5, borderRadius: '50%', background: '#a5b4fc' }}
        />
      ))}
    </span>
  )
}

function AgentAvatar() {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 28,
        height: 28,
        borderRadius: 8,
        background: 'linear-gradient(135deg,#6366f1,#a855f7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Sparkles size={14} color="#fff" />
    </div>
  )
}

function AskPanel() {
  const [question, setQuestion] = useState('')
  const [turns, setTurns] = useState<Array<Turn>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = async (raw: string) => {
    const q = raw.trim()
    if (!q || loading) return

    setLoading(true)
    setError('')
    setQuestion('')

    try {
      const res = await fetch('/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      })

      if (!res.ok) {
        setError(await errorFrom(res))
        return
      }

      const data = await res.json()
      setTurns((prev) => [...prev, { question: q, answer: data.answer }])
    } catch {
      setError('Could not reach the assistant. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Conversation — always rendered, so the greeting is the first thing
          a visitor sees rather than an empty input box. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
        >
          <AgentAvatar />
          <p
            style={{
              color: 'rgba(232,232,232,0.78)',
              fontSize: '0.9rem',
              lineHeight: 1.75,
              paddingTop: 3,
            }}
          >
            {GREETING}
          </p>
        </motion.div>

        {turns.map((turn, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 16px',
                    borderRadius: '12px 12px 2px 12px',
                    background: 'rgba(99,102,241,0.14)',
                    border: '1px solid rgba(99,102,241,0.22)',
                    color: '#e8e8e8',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                  }}
                >
                  {turn.question}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <AgentAvatar />
                <p
                  style={{
                    color: 'rgba(232,232,232,0.78)',
                    fontSize: '0.9rem',
                    lineHeight: 1.75,
                    paddingTop: 3,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {turn.answer}
                </p>
              </div>
            </motion.div>
          ))}

        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <AgentAvatar />
            <ThinkingDots />
          </div>
        )}
      </div>

      {/* Suggestions, only before the first question */}
      {turns.length === 0 && !loading && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              className="skill-tag"
              data-cursor-hover
              style={{ cursor: 'none', border: '1px solid rgba(99,102,241,0.2)', fontFamily: 'inherit' }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(question)
        }}
        style={{ display: 'flex', gap: 10 }}
      >
        <input
          ref={inputRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={500}
          placeholder="Ask about his experience, projects, or skills…"
          aria-label="Ask a question about Shafayatur"
          style={{ ...inputStyle, flex: 1 }}
          onFocus={focusOn}
          onBlur={focusOff}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          aria-label="Send question"
          className="glow-button glow-button-primary"
          data-cursor-hover
          style={{
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: loading || !question.trim() ? 0.45 : 1,
          }}
        >
          <ArrowUp size={17} />
        </button>
      </form>

      {error && (
        <p style={{ color: '#f87171', fontSize: '0.82rem', marginTop: 12 }} role="alert">
          {error}
        </p>
      )}

      <p style={{ color: 'rgba(232,232,232,0.3)', fontSize: '0.72rem', marginTop: 14, lineHeight: 1.6 }}>
        Answers come only from Shafayatur's resume and the work listed on this site. For anything
        it can't answer, use the contact form below.
      </p>
    </div>
  )
}

function StrengthBadge({ strength }: { strength: Strength }) {
  const strong = strength === 'strong'
  return (
    <span
      style={{
        flexShrink: 0,
        padding: '2px 9px',
        borderRadius: 100,
        fontSize: '0.65rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: strong ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
        border: `1px solid ${strong ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
        color: strong ? '#6ee7b7' : '#fcd34d',
      }}
    >
      {strong ? 'Direct' : 'Related'}
    </span>
  )
}

function MatchPanel() {
  const [jobPost, setJobPost] = useState('')
  const [result, setResult] = useState<MatchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading || jobPost.trim().length < 80) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/assistant/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobPost }),
      })

      if (!res.ok) {
        setError(await errorFrom(res))
        return
      }

      setResult(await res.json())
    } catch {
      setError('Could not reach the assistant. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label
          htmlFor="job-post"
          style={{ fontSize: '0.8rem', color: 'rgba(232,232,232,0.5)' }}
        >
          Paste a job post and see which parts of it his background actually covers.
        </label>
        <textarea
          id="job-post"
          value={jobPost}
          onChange={(e) => setJobPost(e.target.value)}
          rows={7}
          maxLength={8000}
          placeholder="Paste the role description or requirements section here…"
          style={{ ...inputStyle, resize: 'vertical', minHeight: 150, lineHeight: 1.6 }}
          onFocus={focusOn}
          onBlur={focusOff}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            type="submit"
            disabled={loading || jobPost.trim().length < 80}
            className="glow-button glow-button-primary"
            data-cursor-hover
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: loading || jobPost.trim().length < 80 ? 0.45 : 1,
            }}
          >
            {loading ? <>Analysing <ThinkingDots /></> : 'Map to my experience'}
          </button>
          <span style={{ fontSize: '0.72rem', color: 'rgba(232,232,232,0.3)' }}>
            {jobPost.trim().length < 80
              ? `${80 - jobPost.trim().length} more characters`
              : `${jobPost.length.toLocaleString()} characters`}
          </span>
        </div>
      </form>

      {error && (
        <p style={{ color: '#f87171', fontSize: '0.82rem', marginTop: 14 }} role="alert">
          {error}
        </p>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginTop: 28 }}
          >
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#f0f0f0',
                marginBottom: 8,
              }}
            >
              {result.roleTitle}
            </h3>
            {result.summary && (
              <p style={{ color: 'rgba(232,232,232,0.6)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 20 }}>
                {result.summary}
              </p>
            )}

            {result.requirements.length === 0 ? (
              <p style={{ color: 'rgba(232,232,232,0.5)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                Nothing in the material on this site directly covers this posting. Worth a
                conversation rather than a conclusion — the contact form is below.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {result.requirements.map((req, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    style={{
                      display: 'flex',
                      gap: 14,
                      alignItems: 'flex-start',
                      padding: '14px 16px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <span style={{ color: '#e8e8e8', fontSize: '0.86rem', fontWeight: 600 }}>
                        {req.requirement}
                      </span>
                      <span style={{ color: 'rgba(232,232,232,0.55)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                        {req.evidence}
                      </span>
                    </div>
                    <StrengthBadge strength={req.strength} />
                  </motion.div>
                ))}
              </div>
            )}

            <p style={{ color: 'rgba(232,232,232,0.3)', fontSize: '0.72rem', marginTop: 16, lineHeight: 1.6 }}>
              Only requirements with supporting evidence are shown
              {result.notCovered > 0 && `, out of ${result.totalRequirements} found in the posting`}.
              Generated from his resume and listed work — not a hiring assessment.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function AssistantSection() {
  const [tab, setTab] = useState<Tab>('ask')

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: 'ask', label: 'Ask anything', icon: <MessageSquare size={15} /> },
    { id: 'match', label: 'Match a role', icon: <ClipboardList size={15} /> },
  ]

  return (
    <section id="assistant">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 44 }}
        >
          <p className="section-label">AI Assistant</p>
          <h2 className="section-title">
            Ask about{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              my work
            </span>
          </h2>
          <p
            style={{
              color: 'rgba(232,232,232,0.5)',
              marginTop: 16,
              fontSize: '1rem',
              maxWidth: 520,
              margin: '16px auto 0',
            }}
          >
            Grounded in my actual resume and projects — ask a question, or paste a job post to see
            what my background covers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ maxWidth: 760, margin: '0 auto' }}
        >
          {/* Tabs */}
          <div
            role="tablist"
            style={{
              display: 'inline-flex',
              gap: 4,
              padding: 4,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              marginBottom: 20,
            }}
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                data-cursor-hover
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '8px 16px',
                  borderRadius: 7,
                  fontSize: '0.83rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  border: 'none',
                  cursor: 'none',
                  transition: 'background 0.25s, color 0.25s',
                  background: tab === t.id ? 'rgba(99,102,241,0.16)' : 'transparent',
                  color: tab === t.id ? '#a5b4fc' : 'rgba(232,232,232,0.5)',
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div className="glass-card" style={{ padding: 28 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
              >
                {tab === 'ask' ? <AskPanel /> : <MatchPanel />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
