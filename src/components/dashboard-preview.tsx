import { CalendarDays, Instagram, MessageCircle, Sparkles, Star, TrendingUp } from 'lucide-react'

const metrics = [
  { icon: TrendingUp, value: '12', label: 'Marketing Opportunities' },
  { icon: Instagram, value: '5', label: 'Social Ideas' },
  { icon: MessageCircle, value: '3', label: 'WhatsApp Campaigns' },
  { icon: CalendarDays, value: '30', label: 'Day Content Plan' },
]

/**
 * A faithful, static miniature of the real results dashboard. Rendered in DOM
 * rather than shipped as an image so it stays crisp and matches the product.
 */
export function DashboardPreview() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-x-6 -bottom-6 -top-4 rounded-[28px] bg-gradient-to-b from-ink-100/60 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-ink-200/90 bg-white shadow-lift">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-ink-200/70 bg-ink-50/70 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="ml-2 truncate rounded-md bg-white px-2 py-0.5 text-[10px] text-ink-400 ring-1 ring-ink-200/70">
            pulse.flarent.com/results
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400">
                Business Growth Pack
              </p>
              <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink-900">
                West Dry Cleaners
              </h3>
              <p className="mt-0.5 text-[13px] text-ink-500">Kolkata · Dry Cleaning</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200/70">
              <Sparkles className="h-3 w-3" />
              Ready
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {metrics.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-lg border border-ink-200/80 bg-white p-3 shadow-subtle"
              >
                <Icon className="h-3.5 w-3.5 text-ink-400" strokeWidth={2} />
                <p className="mt-2 text-[22px] font-semibold leading-none tracking-tight text-ink-900">
                  {value}
                </p>
                <p className="mt-1.5 text-[11px] leading-tight text-ink-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-1 overflow-hidden rounded-lg bg-ink-100/70 p-1 text-[11px] font-medium">
            {['Snapshot', 'Social', 'WhatsApp', 'Google', 'Marketing'].map((tab, i) => (
              <span
                key={tab}
                className={
                  i === 0
                    ? 'rounded-md bg-white px-2.5 py-1.5 text-ink-900 shadow-subtle'
                    : 'hidden px-2.5 py-1.5 text-ink-500 sm:block'
                }
              >
                {tab}
              </span>
            ))}
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="rounded-lg border border-ink-200/80 p-3.5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] font-semibold leading-snug text-ink-900">
                  Turn difficult stain rescues into social proof
                </p>
                <span className="hidden shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 sm:block">
                  Easy
                </span>
              </div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500">
                Customers hand over expensive clothes to someone they trust. Publish before/after
                shots of saved garments and the fabrics you handle.
              </p>
            </div>
            <div className="rounded-lg border border-ink-200/80 p-3.5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] font-semibold leading-snug text-ink-900">
                  Ask at pickup, not by message later
                </p>
                <span className="hidden shrink-0 items-center gap-1 rounded bg-accent-50 px-1.5 py-0.5 text-[10px] font-medium text-accent-700 sm:flex">
                  <Star className="h-2.5 w-2.5" />
                  High impact
                </span>
              </div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink-500">
                Send the Google review request while the customer is collecting their order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
