import { createFileRoute } from '@tanstack/react-router'
import { buildAskSystemPrompt, buildGrounding } from '@/lib/assistant'
import { GeminiError, generate, isGeminiConfigured } from '@/lib/gemini'
import { checkRateLimit, clientKey } from '@/lib/rate-limit'

const MAX_QUESTION_CHARS = 500
const TIMEOUT_MS = 25_000

export const Route = createFileRoute('/api/assistant/ask')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isGeminiConfigured()) {
          return Response.json(
            { error: 'The assistant is not configured yet.' },
            { status: 503 },
          )
        }

        const limit = checkRateLimit(`ask:${clientKey(request)}`, { limit: 8, windowMs: 60_000 })
        if (!limit.allowed) {
          return Response.json(
            { error: `Too many questions. Try again in ${limit.retryAfter}s.` },
            { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
          )
        }

        let question: unknown
        try {
          question = (await request.json())?.question
        } catch {
          return Response.json({ error: 'Invalid request body.' }, { status: 400 })
        }

        if (typeof question !== 'string' || !question.trim()) {
          return Response.json({ error: 'Please enter a question.' }, { status: 400 })
        }
        if (question.length > MAX_QUESTION_CHARS) {
          return Response.json(
            { error: `Questions are limited to ${MAX_QUESTION_CHARS} characters.` },
            { status: 400 },
          )
        }

        const { context, hasResume } = await buildGrounding()
        if (!context) {
          return Response.json(
            { error: 'There is nothing for the assistant to read yet.' },
            { status: 503 },
          )
        }

        const timeout = AbortSignal.timeout(TIMEOUT_MS)

        try {
          const answer = await generate({
            system: buildAskSystemPrompt(context),
            // Delimited so the model treats the visitor's text as data, and
            // reminded after it — trailing instructions resist injection better.
            prompt: `A visitor asks:\n\n<question>\n${question.trim()}\n</question>\n\nAnswer using only the source material.`,
            temperature: 0.2,
            maxOutputTokens: 600,
            signal: timeout,
          })

          return Response.json({ answer, groundedOnResume: hasResume })
        } catch (err) {
          if (err instanceof GeminiError) {
            return Response.json({ error: err.message }, { status: err.status })
          }
          console.error('Assistant ask failed:', err)
          return Response.json({ error: 'The assistant is unavailable right now.' }, { status: 502 })
        }
      },
    },
  },
})
