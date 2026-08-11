import { useState, type FormEvent } from 'react'
import { AlertTriangle, CheckCircle2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const RATING_LABELS = ['Not useful', 'Slightly useful', 'Useful', 'Very useful', 'Excellent']

/** Must match the hidden declaration form in index.html. */
const FORM_NAME = 'pulse-feedback'

export type FeedbackContext = {
  businessName?: string
  industry?: string
  location?: string
}

export function FeedbackForm({
  generationId,
  context,
  className,
}: {
  generationId: string | null
  context?: FeedbackContext
  className?: string
}) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [botField, setBotField] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (rating === 0) {
      setError('Please pick a rating first.')
      return
    }

    setStatus('sending')
    setError(null)

    // Netlify Forms expects a urlencoded POST carrying `form-name`. Sending it
    // to the current path keeps it inside the deploy, which is what the form
    // handler looks for.
    const body = new URLSearchParams({
      'form-name': FORM_NAME,
      'bot-field': botField,
      rating: String(rating),
      comment: comment.trim(),
      generation_id: generationId ?? '',
      business_name: context?.businessName ?? '',
      industry: context?.industry ?? '',
      location: context?.location ?? '',
      page: window.location.pathname,
    })

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })

      if (!response.ok) throw new Error(`Netlify Forms responded ${response.status}`)
      setStatus('sent')
    } catch (submitError) {
      console.error('[feedback] submission failed:', submitError)
      setStatus('error')
      setError("We couldn't send that just now. Please try again in a moment.")
    }
  }

  if (status === 'sent') {
    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-6 animate-fade-in',
          className,
        )}
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="text-[15px] font-semibold text-emerald-900">
            Thank you — your feedback helps us improve Pulse.
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-emerald-800/80">
            We read every response. If you told us something specific, there's a good chance you'll
            see it in the next version.
          </p>
        </div>
      </div>
    )
  }

  const shown = hovered || rating

  return (
    <form
      name={FORM_NAME}
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className={cn('rounded-xl border border-ink-200/80 bg-white p-6 shadow-subtle sm:p-8', className)}
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />

      {/* Honeypot: invisible to people, irresistible to bots. */}
      <p className="hidden" aria-hidden="true">
        <label>
          Leave this field empty
          <input
            type="text"
            name="bot-field"
            tabIndex={-1}
            autoComplete="off"
            value={botField}
            onChange={(event) => setBotField(event.target.value)}
          />
        </label>
      </p>

      <h2 className="text-[19px] font-semibold tracking-tight text-ink-900">
        Help us make Pulse better.
      </h2>
      <p className="mt-1.5 text-[14px] leading-relaxed text-ink-500">
        Pulse is in early access. Two minutes of honesty from you shapes what we build next.
      </p>

      <fieldset className="mt-7">
        <legend className="text-[14px] font-medium text-ink-800">
          How useful was your growth pack?
        </legend>
        <div className="mt-3 flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`${value} out of 5 — ${RATING_LABELS[value - 1]}`}
              aria-pressed={rating === value}
              onMouseEnter={() => setHovered(value)}
              onFocus={() => setHovered(value)}
              onClick={() => {
                setRating(value)
                setError(null)
              }}
              className="rounded-md p-1 transition-transform duration-150 hover:scale-110 active:scale-95"
            >
              <Star
                className={cn(
                  'h-7 w-7 transition-colors duration-150',
                  value <= shown ? 'fill-amber-400 text-amber-400' : 'text-ink-300',
                )}
              />
            </button>
          ))}
          <span className="ml-2 text-[13px] text-ink-500">
            {shown ? RATING_LABELS[shown - 1] : ''}
          </span>
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="feedback-comment" className="text-[14px] font-medium text-ink-800">
          What would make this more useful for your business?
        </label>
        <textarea
          id="feedback-comment"
          rows={4}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={2000}
          placeholder="Tell us what was missing, what felt generic, or what you'd actually use."
          className="mt-2 w-full resize-y rounded-lg border border-ink-200 px-3.5 py-2.5 text-[15px] leading-relaxed text-ink-900 placeholder:text-ink-400 transition-colors hover:border-ink-300 focus:outline-none focus:ring-2 focus:ring-accent-500/25"
        />
      </div>

      {error && (
        <p className="mt-4 flex items-center gap-1.5 text-[13px] text-rose-600">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send Feedback'}
        </Button>
        <span className="text-[13px] text-ink-400">Anonymous. No follow-up unless you ask.</span>
      </div>
    </form>
  )
}
