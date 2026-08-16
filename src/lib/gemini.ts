/**
 * Minimal Gemini REST client.
 *
 * Uses fetch against the Generative Language API rather than pulling in an SDK —
 * this app makes two simple text calls, so a dependency would be more surface
 * than substance.
 *
 * Requires GEMINI_API_KEY (free key from https://aistudio.google.com/apikey).
 * GEMINI_MODEL is overridable so the model can be swapped without a code change.
 */

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'
const DEFAULT_MODEL = 'gemini-2.5-flash'

export class GeminiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    /** True when the failure is the visitor's fault rather than a server fault. */
    readonly isClientFacing = false,
  ) {
    super(message)
    this.name = 'GeminiError'
  }
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY)
}

interface GenerateOptions {
  /** Steers behaviour and is not visitor-controlled. */
  system: string
  /** The visitor-supplied turn. */
  prompt: string
  temperature?: number
  maxOutputTokens?: number
  /** When set, asks Gemini to emit JSON matching this schema. */
  responseSchema?: Record<string, unknown>
  signal?: AbortSignal
}

/**
 * Single-turn generation. Returns the model's text, or throws GeminiError.
 */
export async function generate({
  system,
  prompt,
  temperature = 0.2,
  maxOutputTokens = 1024,
  responseSchema,
  signal,
}: GenerateOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new GeminiError('GEMINI_API_KEY is not set', 503)
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL

  const body: Record<string, unknown> = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens,
      ...(responseSchema
        ? { responseMimeType: 'application/json', responseSchema }
        : {}),
    },
    // The resume is the user's own public document; the defaults occasionally
    // trip on ordinary CV wording, so relax to the lowest non-off threshold.
    safetySettings: [
      'HARM_CATEGORY_HARASSMENT',
      'HARM_CATEGORY_HATE_SPEECH',
      'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      'HARM_CATEGORY_DANGEROUS_CONTENT',
    ].map((category) => ({ category, threshold: 'BLOCK_ONLY_HIGH' })),
  }

  let res: Response
  try {
    res = await fetch(`${API_BASE}/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(body),
      signal,
    })
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') {
      throw new GeminiError('The request timed out.', 504, true)
    }
    throw new GeminiError('Could not reach the model provider.', 502)
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    // Log the provider's message server-side; never surface it to the visitor,
    // since it can echo request contents and key metadata.
    console.error(`Gemini ${res.status}:`, detail.slice(0, 500))

    if (res.status === 429) {
      throw new GeminiError('The assistant is busy right now. Try again shortly.', 429, true)
    }
    if (res.status === 400 || res.status === 403) {
      throw new GeminiError('The assistant is misconfigured.', 503)
    }
    throw new GeminiError('The assistant is unavailable right now.', 502)
  }

  const data = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> }
      finishReason?: string
    }>
    promptFeedback?: { blockReason?: string }
  }

  if (data.promptFeedback?.blockReason) {
    throw new GeminiError('That request could not be processed.', 422, true)
  }

  const candidate = data.candidates?.[0]
  const text = candidate?.content?.parts?.map((p) => p.text ?? '').join('').trim()

  if (!text) {
    // MAX_TOKENS with no text means the budget was spent before any output.
    if (candidate?.finishReason === 'MAX_TOKENS') {
      throw new GeminiError('The answer was too long to generate.', 502, true)
    }
    throw new GeminiError('The assistant returned an empty response.', 502)
  }

  return text
}
