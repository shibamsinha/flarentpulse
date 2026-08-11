import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { PulseMark } from '@/components/brand'
import { cn } from '@/lib/utils'

const STAGES = [
  'Understanding your business',
  'Finding opportunities',
  'Creating content ideas',
  'Building your campaign plan',
]

/**
 * Progress reflects real work in flight — stages advance while the request is
 * open and stop at the last one. Nothing is padded: as soon as the response
 * lands, the caller navigates away.
 */
export function GeneratingOverlay() {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStage((current) => Math.min(current + 1, STAGES.length - 1))
    }, 2600)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 px-5 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          <PulseMark />
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-ink-900">
              Building your personalized growth pack…
            </p>
            <p className="text-[13px] text-ink-500">This usually takes under a minute.</p>
          </div>
        </div>

        <div className="mt-7 h-px w-full overflow-hidden bg-ink-200">
          <div className="relative h-px w-1/3 bg-accent-500">
            <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
        </div>

        <ol className="mt-6 space-y-3.5">
          {STAGES.map((label, index) => {
            const done = index < stage
            const active = index === stage
            return (
              <li
                key={label}
                className={cn(
                  'flex items-center gap-3 text-[14px] transition-colors duration-300',
                  done ? 'text-ink-500' : active ? 'text-ink-900' : 'text-ink-300',
                )}
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  {done ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : active ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-accent-500" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-200" />
                  )}
                </span>
                {label}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
