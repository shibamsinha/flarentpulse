import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

/**
 * In production the /api/generate endpoint is served by a Netlify Function
 * (netlify/functions/generate.ts). During `vite dev` there is no Netlify
 * runtime, so we mount the exact same handler as dev middleware. This keeps a
 * single implementation of the AI call and guarantees the OpenAI key never
 * reaches the browser in either environment.
 */
function apiDevServer(): Plugin {
  return {
    name: 'flarent-pulse-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/generate', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk as Buffer)
        const body = Buffer.concat(chunks).toString('utf8')

        try {
          const { handleGenerateRequest } = await server.ssrLoadModule(
            '/server/generate.ts',
          )
          const result = await handleGenerateRequest(body)
          res.statusCode = result.status
          res.setHeader('content-type', 'application/json')
          res.end(result.body)
        } catch (err) {
          server.config.logger.error(`[api/generate] ${String(err)}`)
          res.statusCode = 500
          res.setHeader('content-type', 'application/json')
          res.end(
            JSON.stringify({
              error: 'Something went wrong while building your growth pack.',
            }),
          )
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Vite only exposes VITE_-prefixed vars, and only to the browser. The dev
  // API middleware runs in Node, so lift the server-side secrets out of .env
  // into process.env by hand — they stay out of the client bundle because
  // nothing `define`s them.
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['OPENAI_API_KEY', 'OPENAI_MODEL']) {
    if (!process.env[key] && env[key]) process.env[key] = env[key]
  }

  return {
    plugins: [react(), apiDevServer()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shared': path.resolve(__dirname, './shared'),
      },
    },
  }
})
