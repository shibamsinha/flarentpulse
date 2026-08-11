import {
  businessInputSchema,
  growthPackSchema,
  type BusinessInput,
  type GrowthPack,
} from '../shared/schema'
import { CALENDAR_SCHEMA, CONTENT_SCHEMA, STRATEGY_SCHEMA } from './json-schema'
import { SYSTEM_PROMPT, buildUserPrompt } from './prompt'
import { buildSamplePack } from './sample'

export type HandlerResult = { status: number; body: string }

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = process.env.OPENAI_MODEL || 'gpt-4.1'
const REQUEST_TIMEOUT_MS = 60_000

function json(status: number, payload: unknown): HandlerResult {
  return { status, body: JSON.stringify(payload) }
}

/** Never leak provider errors to the browser — log them, return something human. */
function friendlyError(status: number, message: string): HandlerResult {
  return json(status, { error: message })
}

/**
 * Models occasionally wrap JSON in prose or a fenced block even when asked not
 * to. Pull the outermost object out before parsing.
 */
function extractJson(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start === -1 || end <= start) throw new Error('No JSON object found in model output')
    return JSON.parse(trimmed.slice(start, end + 1))
  }
}

/**
 * Models routinely return a list of steps as an array where the schema wants a
 * single block of text (`execution`, `structure`, …). Flatten those into
 * newline-separated strings rather than rejecting an otherwise good pack.
 */
function asText(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === 'string' || typeof entry === 'number') return String(entry)
        if (entry && typeof entry === 'object') {
          return Object.values(entry as Record<string, unknown>)
            .filter((part) => typeof part === 'string' || typeof part === 'number')
            .join(' — ')
        }
        return ''
      })
      .filter(Boolean)
      .join('\n')
  }
  if (typeof value === 'number') return String(value)
  return value
}

/** Apply asText to the named keys of an object, in place. */
function flattenFields(item: unknown, keys: string[]) {
  if (!item || typeof item !== 'object') return
  const record = item as Record<string, unknown>
  for (const key of keys) {
    if (key in record) record[key] = asText(record[key])
  }
}

/**
 * Nudge near-miss model output into the schema instead of failing the whole
 * request: flatten arrays into text, clamp list lengths, renumber calendar
 * days, normalise badge values.
 */
function coerce(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return value
  const pack = value as Record<string, any>

  const fixBadge = (v: unknown, allowed: string[], fallback: string) => {
    if (typeof v !== 'string') return fallback
    const match = allowed.find((a) => a.toLowerCase() === v.trim().toLowerCase())
    return match ?? fallback
  }

  pack.businessSummary = asText(pack.businessSummary)

  for (const item of [...(pack.opportunities ?? []), ...(pack.marketing ?? [])]) {
    if (item && typeof item === 'object') {
      flattenFields(item, ['title', 'why', 'action', 'execution'])
      item.difficulty = fixBadge(item.difficulty, ['Easy', 'Medium', 'Advanced'], 'Medium')
      item.impact = fixBadge(item.impact, ['Low', 'Medium', 'High'], 'Medium')
    }
  }

  for (const post of pack.social?.posts ?? []) {
    flattenFields(post, ['title', 'concept', 'caption', 'cta'])
  }
  for (const reel of pack.social?.reels ?? []) {
    flattenFields(reel, ['hook', 'concept', 'structure', 'cta'])
  }
  for (const entry of pack.contentCalendar ?? []) {
    flattenFields(entry, ['type', 'topic', 'idea', 'cta'])
  }
  flattenFields(pack.whatsapp, ['welcome', 'followUp', 'promotion', 'reviewRequest'])
  flattenFields(pack.google, ['reviewRequest'])
  flattenFields(pack.google?.responses, ['positive', 'neutral', 'negative'])

  if (Array.isArray(pack.opportunities)) pack.opportunities = pack.opportunities.slice(0, 6)
  if (Array.isArray(pack.marketing)) pack.marketing = pack.marketing.slice(0, 8)
  if (pack.social && typeof pack.social === 'object') {
    if (Array.isArray(pack.social.posts)) pack.social.posts = pack.social.posts.slice(0, 8)
    if (Array.isArray(pack.social.reels)) pack.social.reels = pack.social.reels.slice(0, 6)
  }
  if (Array.isArray(pack.contentCalendar)) {
    pack.contentCalendar = pack.contentCalendar
      .slice(0, 30)
      .map((entry: any, index: number) => ({ ...entry, day: index + 1 }))
  }

  return pack
}

/** One structured-output call. Returns the parsed (not yet validated) object. */
async function callOpenAI(
  apiKey: string,
  input: BusinessInput,
  schema: unknown,
  instruction: string,
): Promise<Record<string, unknown>> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        // Strict structured output: the provider enforces the exact shape, so
        // fields can't be renamed, nested wrongly or dropped.
        response_format: { type: 'json_schema', json_schema: schema },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `${buildUserPrompt(input)}\n\n${instruction}` },
        ],
      }),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      const error = new Error(`OpenAI ${response.status}: ${detail.slice(0, 400)}`) as Error & {
        status?: number
      }
      error.status = response.status
      throw error
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const content = payload.choices?.[0]?.message?.content
    if (!content) throw new Error('OpenAI returned an empty completion')

    return extractJson(content) as Record<string, unknown>
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Build the pack from three parallel calls. Wall-clock time is that of the
 * slowest part rather than the sum, which keeps the whole request inside a
 * serverless function's execution limit.
 */
async function buildPack(apiKey: string, input: BusinessInput): Promise<GrowthPack> {
  const [strategy, content, calendar] = await Promise.all([
    callOpenAI(
      apiKey,
      input,
      STRATEGY_SCHEMA,
      'Write only the business summary, the 4 opportunities and the 5 marketing opportunities.',
    ),
    callOpenAI(
      apiKey,
      input,
      CONTENT_SCHEMA,
      'Write only the social posts and reels, the WhatsApp messages and the Google review content.',
    ),
    callOpenAI(
      apiKey,
      input,
      CALENDAR_SCHEMA,
      'Write only the 30-day content calendar. Vary the format across posts, reels and stories, and make each topic specific to this business.',
    ),
  ])

  return growthPackSchema.parse(coerce({ ...strategy, ...content, ...calendar }))
}

/**
 * Shared entry point for both the Netlify Function and the Vite dev middleware.
 * Takes the raw request body, returns a status + serialized JSON body.
 */
export async function handleGenerateRequest(rawBody: string): Promise<HandlerResult> {
  let parsedBody: unknown
  try {
    parsedBody = JSON.parse(rawBody || '{}')
  } catch {
    return friendlyError(400, 'We could not read that request. Please try again.')
  }

  const input = businessInputSchema.safeParse(parsedBody)
  if (!input.success) {
    return friendlyError(
      400,
      input.error.issues[0]?.message ?? 'Some details were missing. Please check the form.',
    )
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    // No credentials configured: serve a fully valid sample pack so the product
    // is demoable. The UI labels this clearly.
    console.warn('[generate] OPENAI_API_KEY is not set — returning a sample growth pack.')
    return json(200, { pack: buildSamplePack(input.data), source: 'sample' })
  }

  try {
    const pack = await buildPack(apiKey, input.data)
    return json(200, { pack, source: 'openai' })
  } catch (error) {
    const status = (error as { status?: number }).status
    console.error('[generate] generation failed:', error)

    if (status === 429) {
      return friendlyError(
        429,
        'Pulse is handling a lot of requests right now. Please try again in a minute.',
      )
    }
    if (status === 401 || status === 403) {
      return friendlyError(
        502,
        'Pulse is not able to reach its AI service right now. Please try again shortly.',
      )
    }
    if ((error as Error).name === 'AbortError') {
      return friendlyError(
        504,
        'That took longer than expected. Please try generating your pack again.',
      )
    }
    return friendlyError(
      502,
      'We could not finish building your growth pack. Please try again in a moment.',
    )
  }
}
