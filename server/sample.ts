import type { BusinessInput, CalendarEntry, GrowthPack } from '../shared/schema'

/**
 * Deterministic sample pack.
 *
 * Used when OPENAI_API_KEY is not configured (local development, demos) so the
 * entire product flow stays testable end to end. It is templated from the real
 * form input rather than hard-coded, so it stays honest about the business —
 * but it is clearly labelled as a sample in the UI.
 */

const city = (location: string) => location.split(',')[0]?.trim() || location

const article = (word: string) => (/^[aeiou]/i.test(word.trim()) ? 'an' : 'a')

export function buildSamplePack(input: BusinessInput): GrowthPack {
  const name = input.businessName
  const town = city(input.location)
  const industry = input.industry.toLowerCase()
  const goal = input.goals[0] ?? 'Get more enquiries'
  const audience = input.targetAudience.replace(/\.$/, '')

  const businessSummary =
    `${name} is ${article(industry)} ${industry} business in ${input.location}. ` +
    `In your words: ${input.description.replace(/\s+/g, ' ').trim()} ` +
    `You're trying to reach ${audience}, and the goal you picked first is "${goal.toLowerCase()}". ` +
    `The plan below is built around showing proof of your work to people in and around ${town}, and making it easy for them to start a conversation.`

  const opportunities: GrowthPack['opportunities'] = [
    {
      title: 'Turn finished work into proof people can see',
      why: `Most ${industry} buyers in ${town} compare two or three options before they enquire, and they judge on evidence — what you delivered, for whom, and how it went. Right now that evidence lives in your camera roll, not where customers look.`,
      action:
        'Pick your six best recent jobs. For each one capture a before shot, an after shot and two lines on what the customer wanted. Publish one every few days and keep the same set as a highlight so a new visitor can see all six in thirty seconds.',
      difficulty: 'Easy',
      impact: 'High',
    },
    {
      title: `Own the "${industry} in ${town}" search moment`,
      why: 'People who search with a place name are usually close to deciding. A complete Google Business Profile with recent photos and recent reviews is what decides who they call first.',
      action: `Fill every field on your Google Business Profile — services, area served, hours, ten current photos. Then ask your last ten happy customers for a review using the message in the Google tab, one person at a time.`,
      difficulty: 'Easy',
      impact: 'High',
    },
    {
      title: 'Answer the questions people ask before they trust you',
      why: `Your customers — ${audience} — usually hesitate on the same handful of things: what it costs, how long it takes, and what happens if something goes wrong. Answering those in public removes the reason to keep shopping around.`,
      action:
        'Write down the five questions you answer on every enquiry call. Make one post or reel per question. Reuse the same answers as your WhatsApp replies so nobody waits.',
      difficulty: 'Easy',
      impact: 'Medium',
    },
    {
      title: 'Stop letting old enquiries go cold',
      why: 'Enquiries that did not convert are the cheapest audience you have — they already know you and already wanted the service. Most small businesses never contact them again.',
      action:
        'Export the last three months of WhatsApp enquiries that went quiet. Send the follow-up message in the WhatsApp tab, personalised with what they originally asked about. Ten a day, no bulk broadcast.',
      difficulty: 'Medium',
      impact: 'Medium',
    },
  ]

  const posts: GrowthPack['social']['posts'] = [
    {
      title: 'Before and after, one project',
      concept: `A two-image post of one recent ${industry} job in ${town}. First image is the starting point, second is the finished result. The caption carries the story, not the design.`,
      caption: `Where this started, and where it ended up.\n\nThe brief was simple: ${input.description.split('.')[0]?.trim().toLowerCase()}. We worked through it step by step with the client until it felt right.\n\nIf you're planning something similar in ${town}, send us a message — happy to talk it through.\n\n#${town.replace(/\s+/g, '')} #${industry.replace(/[^a-z0-9]/gi, '')}`,
      cta: 'DM us to talk about your project.',
    },
    {
      title: 'The question we get asked every week',
      concept:
        'Take the single most common question from enquiry calls and answer it properly in the caption. Plain text on a clean background works better than a stock photo here.',
      caption: `"How much does it cost?"\n\nHonest answer: it depends on scope, and anyone who quotes you before understanding the scope is guessing.\n\nHere's what actually moves the number — size, materials, and how much of the existing setup we keep.\n\nAsk us and we'll give you a realistic range on a call.`,
      cta: 'Send us your requirement for a realistic range.',
    },
    {
      title: 'Meet the people doing the work',
      concept: `A photo of you or your team mid-work, not posed. People buy from people, and this is the post that makes ${name} feel like a real team rather than a listing.`,
      caption: `That's the team on site this week.\n\nWe're a small group in ${town} and the same people who take your call are the ones who do the work. That's why we don't take on more than we can finish properly.\n\nSay hello if you see us around.`,
      cta: 'Follow along to see what we work on next.',
    },
    {
      title: 'One customer, in their words',
      concept:
        'A short quote from a real customer over a photo of their finished job. Ask permission, use their first name only.',
      caption: `"They told me what was possible and what wasn't, and then they did exactly that."\n\nThat's the review we're proudest of. Not the adjectives — the fact that the work matched what we said it would be.\n\nThank you for trusting us with it.`,
      cta: 'Read more reviews on our Google profile.',
    },
    {
      title: 'A mistake worth avoiding',
      concept:
        'One thing you regularly see customers get wrong before they come to you. Useful on its own, even to someone who never hires you — which is exactly why it gets shared.',
      caption: `The most expensive mistake we see: deciding on the finish before deciding on the function.\n\nIt's the part people change their mind on later, and changing it later is where the cost goes up.\n\nDecide how you'll use the space first. Everything else gets easier.`,
      cta: 'Save this for when you start planning.',
    },
  ]

  const reels: GrowthPack['social']['reels'] = [
    {
      hook: `"Three things to check before you hire anyone for ${industry} in ${town}"`,
      concept:
        'You talking straight to camera for under thirty seconds, one point per shot. No music over your voice.',
      structure:
        '0-3s: say the hook while walking into a site.\n3-10s: point one — ask to see work they finished, not renders.\n10-18s: point two — get the scope in writing before any payment.\n18-26s: point three — confirm who is actually on site day to day.\n26-30s: "That\'s it. Ask us anything."',
      cta: 'Comment "CHECK" and we\'ll send you the full list.',
    },
    {
      hook: '"Day one versus day done"',
      concept: 'A fast transformation reel from your own project footage, cut on the beat.',
      structure:
        '0-2s: the original state, no commentary.\n2-8s: three or four quick clips of work in progress.\n8-14s: the reveal, held longer than feels comfortable.\n14-20s: on-screen text with the timeline and location.',
      cta: 'DM us for a consultation.',
    },
    {
      hook: '"What this actually costs — no round numbers"',
      concept:
        'A calm explainer that breaks a typical job into its parts. Builds trust precisely because most competitors will not do it.',
      structure:
        '0-4s: the hook, said plainly.\n4-12s: part one and what drives its cost.\n12-20s: part two, same.\n20-28s: the one thing people underestimate.\n28-32s: "Send us your requirement and we\'ll do this for your project."',
      cta: 'Send us your requirement on WhatsApp.',
    },
  ]

  const whatsapp: GrowthPack['whatsapp'] = {
    welcome: `Hello, thank you for reaching out to ${name}.\n\nSo we can help properly, could you share:\n1. What you're looking to get done\n2. Where in ${town} you're located\n3. A rough timeline\n\nWe'll come back to you today with the next step.`,
    followUp: `Hello, this is ${name}. You had enquired with us about your requirement a little while ago.\n\nJust checking in — is this still something you're planning? If the timing changed, no problem at all, do let us know and we'll follow up later.\n\nIf it helps, we can share a few similar projects we've completed in ${town}.`,
    promotion: `Hello, a quick update from ${name}.\n\nWe have space for a few new projects this month, so we can start sooner than usual.\n\nIf you've been planning something, this is a good time to have the conversation. Reply here and we'll set up a call.`,
    reviewRequest: `Hello, thank you again for working with us.\n\nIf you were happy with how it went, a short review on Google would genuinely help other people in ${town} find us. It takes about a minute:\n\n[paste your Google review link]\n\nAnd if anything fell short, please tell us here first — we'd rather fix it.`,
  }

  const google: GrowthPack['google'] = {
    reviewRequest: `Hello, this is ${name}.\n\nIt was a pleasure working with you. If you have a minute, a review on Google would help other people in ${town} decide with more confidence.\n\nHere's the link: [paste your Google review link]\n\nEven a line or two about what the process was like makes a difference. Thank you.`,
    responses: {
      positive: `Thank you so much for taking the time to write this. It was a pleasure working with you, and we're glad the result matched what you had in mind. If you ever need anything else, we're right here in ${town}.`,
      neutral: `Thank you for the honest feedback — we'd rather hear it than not. If there was a part of the experience that could have been better, we'd like to know the specifics so we can fix it for the next customer. You can reach us directly on the number listed on our profile.`,
      negative: `We're sorry this didn't go the way it should have, and we understand your frustration. This isn't the standard we hold ourselves to. Please contact us directly on the number on our profile — we'd like to understand exactly what happened and put it right.`,
    },
  }

  const marketing: GrowthPack['marketing'] = [
    {
      title: 'Complete and maintain your Google Business Profile',
      why: `Searches like "${industry} near me" in ${town} are the closest thing to a customer raising their hand. The profile with recent photos and recent reviews gets the call.`,
      execution:
        '1. Claim and verify the profile.\n2. Fill services, service area, hours and a description that names your actual services.\n3. Upload ten current photos of finished work.\n4. Add one photo a week.\n5. Reply to every review within two days using the templates in the Google tab.',
      difficulty: 'Easy',
      impact: 'High',
    },
    {
      title: 'A referral ask built into project handover',
      why: 'The moment a customer is happiest is the moment the job finishes. Almost nobody asks then, so the goodwill goes unused.',
      execution: `1. Add a final step to your handover: thank the customer, ask if they know one person planning something similar.\n2. Send the WhatsApp review request the same evening.\n3. Log who said yes and follow up once, a week later.\n4. Keep it a personal ask — no printed referral scheme.`,
      difficulty: 'Easy',
      impact: 'Medium',
    },
    {
      title: `Partner with two non-competing businesses in ${town}`,
      why: `Businesses in ${town} that serve the same customers just before or just after you already have the trust and the timing. A steady trickle of warm introductions beats cold reach.`,
      execution:
        '1. List five local businesses your customers use around the same time.\n2. Approach two in person, not by message.\n3. Offer something concrete first — feature their work to your audience.\n4. Agree a simple mutual introduction, and review it after two months.',
      difficulty: 'Medium',
      impact: 'Medium',
    },
    {
      title: 'A one-page enquiry guide you can send instantly',
      why: 'Most enquiries stall because the customer does not know what to ask or what to expect. A short guide makes you the one who made it easy.',
      execution: `1. Write one page: how the process works, what affects cost, typical timeline, what you need from them.\n2. Save it as a PDF named for ${name}.\n3. Send it in the first WhatsApp reply to every enquiry.\n4. Note which question still comes up and add it next month.`,
      difficulty: 'Easy',
      impact: 'Medium',
    },
    {
      title: 'A small, tightly targeted local ad test',
      why: `A modest budget aimed only at ${town} and the areas you actually serve tells you within two weeks whether paid reach is worth continuing — without committing to it.`,
      execution:
        '1. Pick your single best-performing organic post.\n2. Promote it to a radius around your service area only, matched to your customer age range.\n3. Run it for fourteen days on a small daily budget you are comfortable losing.\n4. Measure enquiries received, not likes.\n5. Stop or scale based on that one number.',
      difficulty: 'Advanced',
      impact: 'Medium',
    },
  ]

  const rotation: Array<Pick<CalendarEntry, 'type' | 'topic' | 'idea' | 'cta'>> = [
    {
      type: 'Post',
      topic: 'Before and after from a recent project',
      idea: `Two images from one ${industry} job, with two lines on what the client asked for.`,
      cta: 'DM us to talk about your project.',
    },
    {
      type: 'Story',
      topic: 'Behind the scenes today',
      idea: 'Three quick clips from whatever you are actually working on. Unpolished is fine.',
      cta: 'Reply to this story with any question.',
    },
    {
      type: 'Reel',
      topic: 'One mistake to avoid',
      idea: 'A mistake your customers commonly make before they come to you, explained in under thirty seconds.',
      cta: 'Save this for when you start planning.',
    },
    {
      type: 'Post',
      topic: 'Customer in their own words',
      idea: 'A short quote from a real customer over a photo of their finished job.',
      cta: 'Read more reviews on our Google profile.',
    },
    {
      type: 'Story',
      topic: 'Poll: which one would you pick?',
      idea: 'Two options from a real project. Low effort, and it tells you what your audience prefers.',
      cta: 'Vote and tell us why.',
    },
    {
      type: 'Reel',
      topic: 'Process, start to finish',
      idea: 'A timelapse of one stage of the work with on-screen text for each step.',
      cta: 'DM us for a consultation.',
    },
    {
      type: 'Post',
      topic: 'Answering an enquiry question',
      idea: 'Take a question from this week\'s calls and answer it fully in the caption.',
      cta: 'Send us your requirement and we\'ll answer yours.',
    },
  ]

  const contentCalendar: CalendarEntry[] = Array.from({ length: 30 }, (_, i) => {
    const base = rotation[i % rotation.length]
    return { day: i + 1, ...base }
  })

  contentCalendar[0] = {
    day: 1,
    type: 'Post',
    topic: `Introduce ${name} properly`,
    idea: `Who you are, what you do, where in ${town} you work, and who you do it for. Pin this post.`,
    cta: 'Follow for project updates from around ' + town + '.',
  }
  contentCalendar[14] = {
    day: 15,
    type: 'Reel',
    topic: 'Two weeks of work in sixty seconds',
    idea: 'Cut together the best clips from the first fortnight. It costs nothing new to make.',
    cta: 'DM us to start yours.',
  }
  contentCalendar[29] = {
    day: 30,
    type: 'Post',
    topic: 'The month in review',
    idea: 'A grid of everything you completed this month, with a thank you to the customers involved.',
    cta: 'Taking bookings for next month — message us.',
  }

  return {
    businessSummary,
    opportunities,
    social: { posts, reels },
    whatsapp,
    google,
    marketing,
    contentCalendar,
  }
}
