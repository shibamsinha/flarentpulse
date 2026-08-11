import { z } from 'zod'

/**
 * The single source of truth for the shape of a Growth Pack.
 * Used by the server to validate the model output before it is ever stored,
 * and by the client to validate anything it loads back out of the database.
 */

export const GOALS = [
  'Get more enquiries',
  'Get more customers',
  'Increase repeat customers',
  'Grow on Instagram',
  'Build brand awareness',
  'Promote a new product/service',
  'Improve online presence',
  'Other',
] as const

export const difficultySchema = z.enum(['Easy', 'Medium', 'Advanced'])
export const impactSchema = z.enum(['Low', 'Medium', 'High'])

export type Difficulty = z.infer<typeof difficultySchema>
export type Impact = z.infer<typeof impactSchema>

export const businessInputSchema = z.object({
  businessName: z.string().trim().min(2, 'Please enter your business name').max(120),
  industry: z.string().trim().min(2, 'Please tell us your industry').max(120),
  location: z.string().trim().min(2, 'Please tell us where you operate').max(160),
  description: z
    .string()
    .trim()
    .min(20, 'A sentence or two about what you do helps a lot')
    .max(1500),
  targetAudience: z
    .string()
    .trim()
    .min(10, 'Tell us briefly who your customers are')
    .max(1000),
  goals: z.array(z.string().trim().min(1).max(80)).min(1, 'Pick at least one goal').max(10),
  website: z.string().trim().max(200).optional().or(z.literal('')),
  instagram: z.string().trim().max(200).optional().or(z.literal('')),
  additionalInformation: z.string().trim().max(1500).optional().or(z.literal('')),
})

export type BusinessInput = z.infer<typeof businessInputSchema>

export const opportunitySchema = z.object({
  title: z.string().min(1),
  why: z.string().min(1),
  action: z.string().min(1),
  difficulty: difficultySchema,
  impact: impactSchema,
})

export const postSchema = z.object({
  title: z.string().min(1),
  concept: z.string().min(1),
  caption: z.string().min(1),
  cta: z.string().min(1),
})

export const reelSchema = z.object({
  hook: z.string().min(1),
  concept: z.string().min(1),
  structure: z.string().min(1),
  cta: z.string().min(1),
})

export const marketingIdeaSchema = z.object({
  title: z.string().min(1),
  why: z.string().min(1),
  execution: z.string().min(1),
  difficulty: difficultySchema,
  impact: impactSchema,
})

export const calendarEntrySchema = z.object({
  day: z.number().int().min(1).max(30),
  type: z.string().min(1),
  topic: z.string().min(1),
  idea: z.string().min(1),
  cta: z.string().min(1),
})

export const growthPackSchema = z.object({
  businessSummary: z.string().min(1),
  opportunities: z.array(opportunitySchema).min(3).max(6),
  social: z.object({
    posts: z.array(postSchema).min(3).max(8),
    reels: z.array(reelSchema).min(2).max(6),
  }),
  whatsapp: z.object({
    welcome: z.string().min(1),
    followUp: z.string().min(1),
    promotion: z.string().min(1),
    reviewRequest: z.string().min(1),
  }),
  google: z.object({
    reviewRequest: z.string().min(1),
    responses: z.object({
      positive: z.string().min(1),
      neutral: z.string().min(1),
      negative: z.string().min(1),
    }),
  }),
  marketing: z.array(marketingIdeaSchema).min(3).max(8),
  // 30 is what we ask for; accept a shorter plan rather than throwing away an
  // otherwise good pack, since the calendar view groups whatever it is given.
  contentCalendar: z.array(calendarEntrySchema).min(12).max(30),
})

export type GrowthPack = z.infer<typeof growthPackSchema>
export type Opportunity = z.infer<typeof opportunitySchema>
export type SocialPost = z.infer<typeof postSchema>
export type ReelIdea = z.infer<typeof reelSchema>
export type MarketingIdea = z.infer<typeof marketingIdeaSchema>
export type CalendarEntry = z.infer<typeof calendarEntrySchema>

export const generateResponseSchema = z.object({
  pack: growthPackSchema,
  source: z.enum(['openai', 'sample']),
})

export type GenerateResponse = z.infer<typeof generateResponseSchema>
