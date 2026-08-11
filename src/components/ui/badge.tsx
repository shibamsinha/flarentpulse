import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import type { Difficulty, Impact } from '@shared/schema'

type Tone = 'neutral' | 'accent' | 'green' | 'amber' | 'rose'

const tones: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-600 ring-ink-200/70',
  accent: 'bg-accent-50 text-accent-700 ring-accent-200/70',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200/70',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200/70',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}

const difficultyTone: Record<Difficulty, Tone> = {
  Easy: 'green',
  Medium: 'amber',
  Advanced: 'rose',
}

const impactTone: Record<Impact, Tone> = {
  Low: 'neutral',
  Medium: 'accent',
  High: 'accent',
}

export function DifficultyBadge({ value }: { value: Difficulty }) {
  return <Badge tone={difficultyTone[value] ?? 'neutral'}>{value}</Badge>
}

export function ImpactBadge({ value }: { value: Impact }) {
  return <Badge tone={impactTone[value] ?? 'neutral'}>{value} impact</Badge>
}
