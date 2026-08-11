/**
 * OpenAI strict structured-output schemas for the growth pack.
 *
 * With `strict: true` the model cannot omit, rename or misplace a field, which
 * removes the whole class of "reels ended up at the top level" failures. Strict
 * mode does not support array length or string length constraints, so counts
 * stay in the prompt and are enforced afterwards by the Zod schema in
 * shared/schema.ts.
 *
 * The pack is requested in three parallel calls rather than one. A single call
 * takes over a minute — longer than a serverless function may run — and three
 * focused calls also produce sharper writing than one sprawling one.
 */

const str = (description: string) => ({ type: 'string', description })

const object = (properties: Record<string, unknown>) => ({
  type: 'object',
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
})

const difficulty = {
  type: 'string',
  enum: ['Easy', 'Medium', 'Advanced'],
  description: 'How hard this is for a small team to execute.',
}

const impact = {
  type: 'string',
  enum: ['Low', 'Medium', 'High'],
  description: 'Potential impact, stated as a possibility and never as a promise.',
}

/** Part 1 — what we understood, the opportunities, and the marketing moves. */
export const STRATEGY_SCHEMA = {
  name: 'growth_pack_strategy',
  strict: true,
  schema: object({
    businessSummary: str('60-100 words reflecting back what you understood about the business.'),
    opportunities: {
      type: 'array',
      description: 'Exactly 4 opportunities, most important first.',
      items: object({
        title: str('A concrete action, not a category.'),
        why: str('25-60 words on why it matters for this specific business.'),
        action: str('25-60 words on exactly what to do first.'),
        difficulty,
        impact,
      }),
    },
    marketing: {
      type: 'array',
      description: 'Exactly 5 marketing opportunities, different from the 4 above.',
      items: object({
        title: str('A concrete marketing move.'),
        why: str('25-60 words on why it could work here.'),
        execution: str('Numbered steps in one string, separated by newlines.'),
        difficulty,
        impact,
      }),
    },
  }),
} as const

/** Part 2 — everything the business sends or posts. */
export const CONTENT_SCHEMA = {
  name: 'growth_pack_content',
  strict: true,
  schema: object({
    social: object({
      posts: {
        type: 'array',
        description: 'Exactly 5 post ideas.',
        items: object({
          title: str('Short name for the post idea.'),
          concept: str('What the post shows and why it works for this business.'),
          caption: str('The ready-to-post caption, 40-90 words over 2-5 short lines.'),
          cta: str('One clear call to action.'),
        }),
      },
      reels: {
        type: 'array',
        description: 'Exactly 3 reel ideas.',
        items: object({
          hook: str('The opening line, in quotes.'),
          concept: str('What the reel shows.'),
          structure: str('A shot-by-shot outline with timings, newline separated.'),
          cta: str('One clear call to action.'),
        }),
      },
    }),
    whatsapp: object({
      welcome: str('Send-ready first reply to a new enquiry, 30-80 words, multi-line.'),
      followUp: str('Send-ready message for an enquiry that went quiet.'),
      promotion: str('Send-ready promotional message for existing customers.'),
      reviewRequest: str('Send-ready message asking a happy customer for a review.'),
    }),
    google: object({
      reviewRequest: str('A message asking a customer for a Google review.'),
      responses: object({
        positive: str('A human reply to a positive review.'),
        neutral: str('A human reply to a neutral review.'),
        negative: str('A calm, non-defensive reply to a negative review.'),
      }),
    }),
  }),
} as const

/** Part 3 — the 30-day plan. */
export const CALENDAR_SCHEMA = {
  name: 'growth_pack_calendar',
  strict: true,
  schema: object({
    contentCalendar: {
      type: 'array',
      description: 'Exactly 30 entries, day 1 through day 30 in order.',
      items: object({
        day: { type: 'integer', description: 'Day number from 1 to 30.' },
        type: str('Post, Reel, Story, WhatsApp, Google or similar.'),
        topic: str('A specific subject, never a category like "Design tips".'),
        idea: str('What to actually make or say.'),
        cta: str('One clear call to action.'),
      }),
    },
  }),
} as const
