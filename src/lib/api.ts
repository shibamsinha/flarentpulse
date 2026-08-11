import { generateResponseSchema, type BusinessInput, type GenerateResponse } from '@shared/schema'

export class GenerationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GenerationError'
  }
}

const FALLBACK_MESSAGE =
  'We could not build your growth pack just now. Please check your connection and try again.'

/**
 * Calls the server-side generation endpoint. The OpenAI key lives only there.
 */
export async function generateGrowthPack(input: BusinessInput): Promise<GenerateResponse> {
  let response: Response
  try {
    response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    })
  } catch {
    throw new GenerationError(
      'We could not reach Pulse. Please check your internet connection and try again.',
    )
  }

  // Read as text first: when the generation endpoint is missing, a host's SPA
  // fallback answers with the index page, and a bare response.json() would turn
  // a deployment problem into a misleading "check your connection" message.
  const raw = await response.text().catch(() => '')

  let payload: unknown
  try {
    payload = JSON.parse(raw)
  } catch {
    console.error(
      `[api] /api/generate returned ${response.status} ${
        response.headers.get('content-type') ?? 'no content-type'
      } instead of JSON. The serverless function is probably not deployed or not routed. ` +
        `First 200 characters: ${raw.slice(0, 200)}`,
    )
    throw new GenerationError(
      "Pulse's generator isn't responding on this deployment. If you're the site owner, check that the /api/generate function deployed.",
    )
  }

  if (!response.ok) {
    const message = (payload as { error?: string })?.error
    throw new GenerationError(typeof message === 'string' && message ? message : FALLBACK_MESSAGE)
  }

  const parsed = generateResponseSchema.safeParse(payload)
  if (!parsed.success) {
    console.error('[api] generation response failed validation', parsed.error.issues)
    throw new GenerationError(
      'Your growth pack came back incomplete. Please try generating it again.',
    )
  }

  return parsed.data
}
