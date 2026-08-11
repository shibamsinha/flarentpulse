import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Copies text using the async Clipboard API, with a hidden-textarea fallback
 * for browsers/contexts where it is unavailable (older Safari, non-HTTPS).
 */
async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    // fall through to the legacy path
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

export function CopyButton({
  value,
  label = 'Copy',
  className,
}: {
  value: string
  label?: string
  className?: string
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<number>()

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const handleClick = async () => {
    const ok = await copyText(value)
    setState(ok ? 'copied' : 'failed')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className={cn(
        'inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border px-2 text-[12px] font-medium transition-all duration-150',
        state === 'copied'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : state === 'failed'
            ? 'border-rose-200 bg-rose-50 text-rose-700'
            : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50 hover:text-ink-900',
        className,
      )}
    >
      {state === 'copied' ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {state === 'copied' ? 'Copied' : state === 'failed' ? 'Try again' : label}
    </button>
  )
}
