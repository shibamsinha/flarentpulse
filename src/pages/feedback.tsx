import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { EarlyAccessBadge, SiteFooter, SiteHeader } from '@/components/brand'
import { FeedbackForm } from '@/components/feedback-form'

/**
 * Standalone feedback route. Accepts ?generation=<id> so a link sent after the
 * fact can still be tied back to the pack it refers to.
 */
export default function FeedbackPage() {
  const [params] = useSearchParams()
  const generationId = params.get('generation')

  return (
    <div className="flex min-h-dvh flex-col bg-ink-50/40">
      <SiteHeader>
        <EarlyAccessBadge className="hidden sm:inline-flex" />
      </SiteHeader>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-ink-500 transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>

          <div className="mt-6 animate-fade-up">
            <h1 className="text-[32px] font-semibold leading-tight tracking-tighter text-ink-900">
              Tell us what you think.
            </h1>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-600">
              Pulse is an early-access experiment from Flarent IT Labs. Your feedback decides what
              we build next.
            </p>
          </div>

          <FeedbackForm generationId={generationId} className="mt-8" />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
