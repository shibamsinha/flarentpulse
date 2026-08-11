import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function PulseMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-[7px] bg-ink-900',
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="h-[18px] w-[18px]" aria-hidden="true">
        <path
          d="M5 17h4.4l2.7-7.7a1 1 0 0 1 1.9.05l3.7 12.6a1 1 0 0 0 1.9.03l2.1-7.1H27"
          fill="none"
          stroke="#a5b4fc"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function Wordmark({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-2.5">
      <PulseMark />
      <span className="text-[15px] font-semibold tracking-tight text-ink-900">
        Flarent <span className="text-ink-400 transition-colors group-hover:text-ink-600">Pulse</span>
      </span>
    </Link>
  )
}

export function EarlyAccessBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white/70 px-2.5 py-1 text-[11px] font-medium text-ink-600 backdrop-blur',
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-500" />
      </span>
      Early Access
    </span>
  )
}

export function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Wordmark />
        <div className="flex items-center gap-3">{children}</div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-200/70 bg-ink-50/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <PulseMark className="h-6 w-6 rounded-md" />
            <span className="text-sm font-semibold text-ink-900">Flarent Pulse</span>
          </div>
          <p className="text-[13px] text-ink-500">A product by Flarent IT Labs.</p>
        </div>
        <p className="text-[12px] leading-relaxed text-ink-400 sm:max-w-xs sm:text-right">
          Pulse gives suggestions, not guarantees. Use what fits your business and ignore what
          doesn't.
        </p>
      </div>
    </footer>
  )
}
