import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Reveals its children the first time they scroll into view.
 *
 * Deliberately understated — an 18px rise and a fade over half a second, on the
 * same easing curve as the rest of the app. It reads as the page settling, not
 * as an effect. Content is never hidden from a reader who has asked for
 * reduced motion, or from a crawler with JavaScript disabled.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      // Fire a little before the element reaches the fold, so the movement has
      // finished by the time it is properly in view.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )

    observer.observe(node)

    // Failsafe. Content hidden behind opacity:0 must never be able to stay
    // hidden — if the observer has not fired within two seconds for any
    // reason, show it regardless. A missed animation is a non-event; unreadable
    // copy is not.
    const failsafe = window.setTimeout(() => setShown(true), 2000)

    return () => {
      observer.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
      className={cn(
        'transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-[18px] opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
