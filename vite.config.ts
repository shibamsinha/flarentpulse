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
      // Netlify Forms intercepts the urlencoded POST that the feedback form
      // sends. Vite has no such handler and answers 404, so locally the form
      // could only ever show its error state. Stand in for it: log the
      // submission and accept it, the way the deployed site does.
      server.middlewares.use(async (req, res, next) => {
        const contentType = req.headers['content-type'] ?? ''
        if (req.method !== 'POST' || !contentType.includes('application/x-www-form-urlencoded')) {
          return next()
        }

        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk as Buffer)
        const fields = new URLSearchParams(Buffer.concat(chunks).toString('utf8'))

        if (!fields.get('form-name')) return next()

        server.config.logger.info(
          `\n[netlify-forms:dev] "${fields.get('form-name')}" submission\n` +
            [...fields.entries()]
              .filter(([key, value]) => key !== 'form-name' && value)
              .map(([key, value]) => `  ${key}: ${value}`)
              .join('\n') +
            '\n  (in production this is captured by Netlify Forms)\n',
        )

        res.statusCode = 200
        res.setHeader('content-type', 'text/plain')
        res.end('OK')
      })

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
