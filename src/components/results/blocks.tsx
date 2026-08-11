import type { ReactNode } from 'react'
import { CopyButton } from '@/components/copy-button'
import { cn } from '@/lib/utils'

export function SectionIntro({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-[19px] font-semibold tracking-tight text-ink-900">{title}</h2>
        <p className="mt-1 max-w-xl text-[14px] leading-relaxed text-ink-500">{description}</p>
      </div>
      {children}
    </div>
  )
}

export function Labelled({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-400">{label}</p>
      <div className={cn('mt-1.5 text-[14px] leading-relaxed text-ink-700')}>{children}</div>
    </div>
  )
}

/** A copy-ready block of generated text, preserving the model's line breaks. */
export function MessageBlock({
  title,
  description,
  body,
  className,
}: {
  title: string
  description?: string
  body: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-ink-200/80 bg-white shadow-subtle transition-shadow duration-200 hover:shadow-card',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-ink-200/70 px-5 py-3.5">
        <div>
          <h3 className="text-[14px] font-semibold text-ink-900">{title}</h3>
          {description && <p className="mt-0.5 text-[13px] text-ink-500">{description}</p>}
        </div>
        <CopyButton value={body} />
      </div>
      <p className="whitespace-pre-wrap px-5 py-4 text-[14px] leading-relaxed text-ink-700">
        {body}
      </p>
    </div>
  )
}

export function CtaLine({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-ink-50 px-3 py-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-400">CTA</span>
      <span className="text-[13px] text-ink-700">{value}</span>
    </div>
  )
}
