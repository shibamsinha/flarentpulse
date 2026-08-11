# Flarent Pulse

**Turn your business into a growth plan.**

A free, early-access AI growth assistant by Flarent IT Labs. A business owner answers six short
questions and gets a Business Growth Pack: opportunities, social content, WhatsApp campaigns,
Google review templates, marketing moves and a 30-day content calendar.

---

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · Zod · Supabase · OpenAI · Netlify
Functions · Lucide icons.

## Running locally

```bash
npm install
```

```bash
npm run dev
```

The app runs at `http://localhost:5173`. `POST /api/generate` is served in dev by Vite middleware
that loads the *same* handler the Netlify Function uses (`server/generate.ts`), so there is one
implementation of the AI call in both environments.

Without any environment variables the whole flow still works end to end: generation returns a
clearly-labelled **sample pack** built from the submitted answers, and packs are stored in the
browser's `localStorage`.

## Environment variables

Copy `.env.example` to `.env` and fill in what you have.

| Variable | Where | Required | Purpose |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | Server only | No (sample pack without it) | Real AI generation. **Never** prefix with `VITE_` — that would inline it into the browser bundle. |
| `OPENAI_MODEL` | Server only | No | Defaults to `gpt-4.1` — inexpensive and fast enough for a serverless function. |
| `VITE_SUPABASE_URL` | Browser | No (localStorage without it) | Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | Browser | No | Supabase anon key, protected by the RLS policies in `supabase/schema.sql`. |

On Netlify, set all four under **Site settings → Environment variables**. Only the `VITE_`-prefixed
ones reach the browser.

## Database

Run `supabase/schema.sql` once in the Supabase SQL editor. It creates `businesses` and
`generations`, and enables row level security:

- anyone may insert a business and a generation;
- a generation is readable only by someone who already has its unguessable UUID;
- `businesses` is not readable with the anon key at all.

No login, no personal contact details are collected.

## Feedback

The feedback form posts to **Netlify Forms** under the name `pulse-feedback`. Submissions appear in
the Netlify dashboard under **Forms → pulse-feedback**, and can be exported as CSV or forwarded by
email or webhook from **Forms → Settings → Form notifications**.

Each submission carries the rating, the comment, and the context needed to make sense of it: the
generation id, and the business name, industry and location when it was sent from a results page.

Netlify discovers forms by parsing the deployed HTML at build time, which a React-rendered form
never appears in — so `index.html` holds a hidden declaration form listing the field names. **If you
add or rename a field in `feedback-form.tsx`, change it in `index.html` too**, or the new field is
dropped on submission.

Locally there is no Netlify to receive the post, so a dev-only middleware in `vite.config.ts`
accepts it and prints the submission to the terminal instead.

## Deploying to Netlify

`netlify.toml` is already configured — build `npm run build`, publish `dist`, functions in
`netlify/functions`, an `/api/*` redirect and an SPA fallback so `/results/:id` survives a reload.

```bash
npx netlify deploy --build --prod
```

## Architecture

```
shared/schema.ts          Zod schema for the growth pack + form input (used by client AND server)
server/prompt.ts          System prompt and per-business user prompt
server/sample.ts          Deterministic sample pack for when no API key is configured
server/generate.ts        Request validation, OpenAI call, JSON repair, schema validation, error mapping
netlify/functions/        Thin Netlify wrapper around server/generate.ts
vite.config.ts            Dev middleware wrapper around the same handler
src/lib/api.ts            Typed client for /api/generate
src/lib/storage.ts        Supabase persistence with a localStorage mirror/fallback
src/pages/                landing · generate · results · feedback · not-found
```

### How the AI output is kept trustworthy

1. The prompt forbids generic advice, invented facts and promised results, requires every
   recommendation to reference the business, industry, location and audience, and includes a
   worked weak-vs-strong example so the model has a concrete quality bar.
2. Output shape is enforced by the provider using strict structured outputs
   (`response_format: json_schema`, `strict: true`), so fields cannot be renamed, dropped or
   nested wrongly.
3. The pack is built from **three parallel calls** — strategy, content, calendar. A single call
   took over a minute, which is longer than a serverless function may run; three concurrent calls
   finish in roughly 15-20 seconds and each one writes more sharply for being focused.
4. The merged response is unwrapped (fenced blocks / stray prose stripped), lightly repaired
   (arrays flattened to text, badge values normalised, list lengths clamped, calendar days
   renumbered), then validated against `growthPackSchema`.
5. Anything that still fails validation becomes a friendly error, never a broken dashboard. Raw
   provider errors are logged server-side and never shown to the user.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server with the API middleware |
| `npm run build` | Type-check then production build |
| `npm run typecheck` | Types only |
| `npm run preview` | Serve the production build (no `/api` — use `netlify dev` for that) |
