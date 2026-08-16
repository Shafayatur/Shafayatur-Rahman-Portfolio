import { createFileRoute } from '@tanstack/react-router'
import { MATCH_SCHEMA, buildGrounding, buildMatchSystemPrompt } from '@/lib/assistant'
import { GeminiError, generate, isGeminiConfigured } from '@/lib/gemini'
import { checkRateLimit, clientKey } from '@/lib/rate-limit'

const MIN_POST_CHARS = 80
const MAX_POST_CHARS = 8_000
const TIMEOUT_MS = 30_000

type Strength = 'strong' | 'partial' | 'none'

interface MatchRequirement {
  requirement: string
  evidence: string
  strength: Strength
}

export const Route = createFileRoute('/api/assistant/match')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isGeminiConfigured()) {
          return Response.json({ error: 'The assistant is not configured yet.' }, { status: 503 })
        }

        // Tighter than /ask: each call sends a full job post plus all grounding.
        const limit = checkRateLimit(`match:${clientKey(request)}`, { limit: 4, windowMs: 60_000 })
        if (!limit.allowed) {
          return Response.json(
            { error: `Too many requests. Try again in ${limit.retryAfter}s.` },
            { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
          )
        }

        let jobPost: unknown
        try {
          jobPost = (await request.json())?.jobPost
        } catch {
          return Response.json({ error: 'Invalid request body.' }, { status: 400 })
        }

        if (typeof jobPost !== 'string' || jobPost.trim().length < MIN_POST_CHARS) {
          return Response.json(
            { error: `Paste a bit more of the job post (at least ${MIN_POST_CHARS} characters).` },
            { status: 400 },
          )
        }
        if (jobPost.length > MAX_POST_CHARS) {
          return Response.json(
            { error: `Job posts are limited to ${MAX_POST_CHARS} characters.` },
            { status: 400 },
          )
        }

        const { context } = await buildGrounding()
        if (!context) {
          return Response.json(
            { error: 'There is nothing for the assistant to read yet.' },
            { status: 503 },
          )
        }

        const timeout = AbortSignal.timeout(TIMEOUT_MS)

        try {
          const raw = await generate({
            system: buildMatchSystemPrompt(context),
            prompt: `Job posting:\n\n<posting>\n${jobPost.trim()}\n</posting>\n\nMap its requirements to evidence from the source material.`,
            temperature: 0.1,
            maxOutputTokens: 2048,
            responseSchema: MATCH_SCHEMA as unknown as Record<string, unknown>,
            signal: timeout,
          })

          let parsed: {
            roleTitle?: string
            summary?: string
            requirements?: Array<MatchRequirement>
          }
          try {
            parsed = JSON.parse(raw)
          } catch {
            console.error('Assistant match: model returned non-JSON:', raw.slice(0, 300))
            return Response.json(
              { error: 'Could not read that job post. Try pasting the requirements section.' },
              { status: 502 },
            )
          }

          const all = Array.isArray(parsed.requirements) ? parsed.requirements : []

          // Only surface requirements actually backed by evidence. Unsupported
          // ones are counted, not listed — honest without publishing a list of
          // weaknesses to the person deciding whether to hire him.
          const supported = all.filter(
            (r) => (r.strength === 'strong' || r.strength === 'partial') && r.evidence?.trim(),
          )
          const notCovered = all.length - supported.length

          return Response.json({
            roleTitle: parsed.roleTitle?.trim() || 'This role',
            summary: parsed.summary?.trim() ?? '',
            requirements: supported,
            notCovered,
            totalRequirements: all.length,
          })
        } catch (err) {
          if (err instanceof GeminiError) {
            return Response.json({ error: err.message }, { status: err.status })
          }
          console.error('Assistant match failed:', err)
          return Response.json({ error: 'The assistant is unavailable right now.' }, { status: 502 })
        }
      },
    },
  },
})
