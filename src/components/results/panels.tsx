import { Fragment } from 'react'
import { Clapperboard, ImageIcon, Quote } from 'lucide-react'
import type { BusinessInput, GrowthPack } from '@shared/schema'
import { CopyButton } from '@/components/copy-button'
import { DifficultyBadge, ImpactBadge } from '@/components/ui/badge'
import { CtaLine, Labelled, MessageBlock, SectionIntro } from './blocks'

/* ---------------------------------- Snapshot --------------------------------- */

export function SnapshotPanel({
  pack,
  business,
}: {
  pack: GrowthPack
  business: BusinessInput
}) {
  return (
    <div className="space-y-10">
      <section>
        <SectionIntro
          title="What we understand about your business"
          description="If anything here is off, regenerate with a bit more detail — the rest of the pack is built on this."
        >
          <CopyButton value={pack.businessSummary} />
        </SectionIntro>
        <div className="rounded-xl border border-ink-200/80 bg-white p-6 shadow-subtle">
          <Quote className="h-4 w-4 text-ink-300" />
          <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-ink-700">
            {pack.businessSummary}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-ink-200/70 pt-4">
            {business.goals.map((goal) => (
              <span
                key={goal}
                className="rounded-md bg-ink-50 px-2 py-1 text-[12px] text-ink-600 ring-1 ring-inset ring-ink-200/70"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionIntro
          title="Your biggest opportunities"
          description="Ranked by what we'd do first if this were our business."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {pack.opportunities.map((opportunity, index) => (
            <article
              key={opportunity.title}
              className="flex flex-col rounded-xl border border-ink-200/80 bg-white p-5 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[11px] text-ink-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-wrap justify-end gap-1.5">
                  <DifficultyBadge value={opportunity.difficulty} />
                  <ImpactBadge value={opportunity.impact} />
                </div>
              </div>
              <h3 className="mt-3 text-[16px] font-semibold leading-snug tracking-tight text-ink-900">
                {opportunity.title}
              </h3>
              <div className="mt-4 space-y-4">
                <Labelled label="Why it matters">{opportunity.why}</Labelled>
                <Labelled label="Recommended action">{opportunity.action}</Labelled>
              </div>
              <div className="mt-5 flex justify-end border-t border-ink-200/70 pt-4">
                <CopyButton
                  label="Copy"
                  value={`${opportunity.title}\n\nWhy it matters: ${opportunity.why}\n\nRecommended action: ${opportunity.action}`}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ----------------------------------- Social ---------------------------------- */

export function SocialPanel({ pack }: { pack: GrowthPack }) {
  return (
    <div className="space-y-10">
      <section>
        <SectionIntro
          title={`${pack.social.posts.length} post ideas`}
          description="Captions are ready to post as written. Change the details, keep the structure."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {pack.social.posts.map((post) => (
            <article
              key={post.title}
              className="flex flex-col rounded-xl border border-ink-200/80 bg-white shadow-subtle transition-shadow duration-200 hover:shadow-card"
            >
              <header className="flex items-start justify-between gap-3 border-b border-ink-200/70 p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-500 ring-1 ring-inset ring-ink-200/70">
                    <ImageIcon className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-ink-900">
                    {post.title}
                  </h3>
                </div>
                <CopyButton label="Copy caption" value={post.caption} />
              </header>
              <div className="flex flex-1 flex-col gap-4 p-5">
                <Labelled label="Concept">{post.concept}</Labelled>
                <Labelled label="Caption">
                  <p className="whitespace-pre-wrap rounded-lg bg-ink-50/70 p-3.5 text-[14px] leading-relaxed text-ink-800 ring-1 ring-inset ring-ink-200/60">
                    {post.caption}
                  </p>
                </Labelled>
                <div className="mt-auto">
                  <CtaLine value={post.cta} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionIntro
          title={`${pack.social.reels.length} reel ideas`}
          description="Shot-by-shot outlines you can film on a phone."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {pack.social.reels.map((reel) => (
            <article
              key={reel.hook}
              className="flex flex-col rounded-xl border border-ink-200/80 bg-white shadow-subtle transition-shadow duration-200 hover:shadow-card"
            >
              <header className="border-b border-ink-200/70 p-5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-ink-50 text-ink-500 ring-1 ring-inset ring-ink-200/70">
                  <Clapperboard className="h-3.5 w-3.5" />
                </span>
                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-400">
                  Hook
                </p>
                <h3 className="mt-1.5 text-[15px] font-semibold leading-snug tracking-tight text-ink-900">
                  {reel.hook}
                </h3>
              </header>
              <div className="flex flex-1 flex-col gap-4 p-5">
                <Labelled label="Concept">{reel.concept}</Labelled>
                <Labelled label="Structure">
                  <p className="whitespace-pre-wrap rounded-lg bg-ink-50/70 p-3.5 text-[13.5px] leading-relaxed text-ink-800 ring-1 ring-inset ring-ink-200/60">
                    {reel.structure}
                  </p>
                </Labelled>
                <div className="mt-auto space-y-3">
                  <CtaLine value={reel.cta} />
                  <CopyButton
                    className="w-full justify-center"
                    label="Copy reel plan"
                    value={`Hook: ${reel.hook}\n\nConcept: ${reel.concept}\n\nStructure:\n${reel.structure}\n\nCTA: ${reel.cta}`}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ---------------------------------- WhatsApp --------------------------------- */

export function WhatsAppPanel({ pack }: { pack: GrowthPack }) {
  const messages = [
    {
      title: 'Welcome message',
      description: 'The first reply when someone messages you.',
      body: pack.whatsapp.welcome,
    },
    {
      title: 'Lead follow-up',
      description: 'For enquiries that went quiet.',
      body: pack.whatsapp.followUp,
    },
    {
      title: 'Promotional message',
      description: 'For customers who already know you.',
      body: pack.whatsapp.promotion,
    },
    {
      title: 'Review request',
      description: 'Send it the same day the work finishes.',
      body: pack.whatsapp.reviewRequest,
    },
  ]

  return (
    <section>
      <SectionIntro
        title="WhatsApp campaigns"
        description="Send these one to one. Personalise the first line each time — it is the difference between a reply and a block."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {messages.map((message) => (
          <MessageBlock key={message.title} {...message} />
        ))}
      </div>
    </section>
  )
}

/* ----------------------------------- Google ---------------------------------- */

export function GooglePanel({ pack }: { pack: GrowthPack }) {
  const responses = [
    { title: 'Positive review', body: pack.google.responses.positive },
    { title: 'Neutral review', body: pack.google.responses.neutral },
    { title: 'Negative review', body: pack.google.responses.negative },
  ]

  return (
    <div className="space-y-10">
      <section>
        <SectionIntro
          title="Ask for a Google review"
          description="Send it to one customer at a time, right after the work is done."
        />
        <MessageBlock title="Review request" body={pack.google.reviewRequest} />
      </section>

      <section>
        <SectionIntro
          title="Review response templates"
          description="Reply to every review within two days. Public replies are read by future customers, not just the reviewer."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {responses.map((response) => (
            <MessageBlock key={response.title} {...response} />
          ))}
        </div>
      </section>
    </div>
  )
}

/* --------------------------------- Marketing --------------------------------- */

export function MarketingPanel({ pack }: { pack: GrowthPack }) {
  return (
    <section>
      <SectionIntro
        title="Marketing opportunities"
        description="Each one includes how to execute it. Start with the Easy, High impact rows."
      />
      <div className="space-y-4">
        {pack.marketing.map((idea, index) => (
          <article
            key={idea.title}
            className="rounded-xl border border-ink-200/80 bg-white p-5 shadow-subtle transition-shadow duration-200 hover:shadow-card sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-1 font-mono text-[11px] text-ink-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="max-w-lg text-[16px] font-semibold leading-snug tracking-tight text-ink-900">
                  {idea.title}
                </h3>
              </div>
              <div className="flex gap-1.5">
                <DifficultyBadge value={idea.difficulty} />
                <ImpactBadge value={idea.impact} />
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Labelled label="Why it could work">{idea.why}</Labelled>
              <Labelled label="How to execute it">
                <p className="whitespace-pre-wrap">{idea.execution}</p>
              </Labelled>
            </div>

            <div className="mt-5 flex justify-end border-t border-ink-200/70 pt-4">
              <CopyButton
                value={`${idea.title}\n\nWhy it could work: ${idea.why}\n\nHow to execute it:\n${idea.execution}\n\nDifficulty: ${idea.difficulty} · Potential impact: ${idea.impact}`}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

/* --------------------------------- Calendar ---------------------------------- */

const typeTone = (type: string) => {
  const normalized = type.toLowerCase()
  if (normalized.includes('reel') || normalized.includes('video'))
    return 'bg-accent-50 text-accent-700 ring-accent-200/70'
  if (normalized.includes('story')) return 'bg-amber-50 text-amber-700 ring-amber-200/70'
  if (normalized.includes('whatsapp') || normalized.includes('message'))
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200/70'
  return 'bg-ink-100 text-ink-600 ring-ink-200/70'
}

export function CalendarPanel({ pack }: { pack: GrowthPack }) {
  const weeks: Array<{ label: string; days: GrowthPack['contentCalendar'] }> = []
  const entries = [...pack.contentCalendar].sort((a, b) => a.day - b.day)

  for (let index = 0; index < entries.length; index += 7) {
    weeks.push({
      label: `Week ${Math.floor(index / 7) + 1}`,
      days: entries.slice(index, index + 7),
    })
  }

  const fullPlanText = entries
    .map((entry) => `Day ${entry.day} — ${entry.type}\n${entry.topic}\n${entry.idea}\nCTA: ${entry.cta}`)
    .join('\n\n')

  return (
    <section>
      <SectionIntro
        title="30-day content plan"
        description="One item a day. Skip a day if you must, but keep the order — it builds on itself."
      >
        <CopyButton label="Copy full plan" value={fullPlanText} />
      </SectionIntro>

      <div className="space-y-8">
        {weeks.map((week) => (
          <Fragment key={week.label}>
            <div>
              <div className="mb-3 flex items-center gap-3">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                  {week.label}
                </h3>
                <span className="h-px flex-1 bg-ink-200/70" />
                <span className="text-[12px] text-ink-400">
                  Day {week.days[0]?.day}–{week.days[week.days.length - 1]?.day}
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-ink-200/80 bg-white shadow-subtle">
                {week.days.map((entry, index) => (
                  <div
                    key={entry.day}
                    className={`flex flex-col gap-3 p-4 transition-colors hover:bg-ink-50/60 sm:flex-row sm:items-start sm:gap-5 sm:p-5 ${
                      index > 0 ? 'border-t border-ink-200/70' : ''
                    }`}
                  >
                    <div className="flex shrink-0 items-center gap-3 sm:w-24 sm:flex-col sm:items-start sm:gap-2">
                      <span className="text-[13px] font-semibold text-ink-900">Day {entry.day}</span>
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${typeTone(
                          entry.type,
                        )}`}
                      >
                        {entry.type}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[14.5px] font-medium leading-snug text-ink-900">
                        {entry.topic}
                      </p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-500">{entry.idea}</p>
                      <p className="mt-2 text-[13px] text-ink-600">
                        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-400">
                          CTA{' '}
                        </span>
                        {entry.cta}
                      </p>
                    </div>

                    <CopyButton
                      className="self-start"
                      value={`Day ${entry.day} — ${entry.type}\n${entry.topic}\n${entry.idea}\nCTA: ${entry.cta}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  )
}
