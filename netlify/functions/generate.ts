import { handleGenerateRequest } from '../../server/generate'

/**
 * POST /api/generate  (redirected to /.netlify/functions/generate)
 *
 * The OpenAI key is read from the OPENAI_API_KEY environment variable on the
 * server only. It is never sent to, or referenced by, the browser bundle.
 */
export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    })
  }

  try {
    const rawBody = await request.text()
    const result = await handleGenerateRequest(rawBody)
    return new Response(result.body, {
      status: result.status,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    })
  } catch (error) {
    console.error('[netlify/generate] unhandled error:', error)
    return new Response(
      JSON.stringify({ error: 'Something went wrong while building your growth pack.' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    )
  }
}

export const config = { path: '/api/generate' }
