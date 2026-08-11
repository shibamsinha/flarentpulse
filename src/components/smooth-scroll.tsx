import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { useLocation } from 'react-router-dom'

/**
 * Lenis smooth scrolling, app-wide.
 *
 * Lenis animates the real window scroll rather than transforming a wrapper, so
 * `position: sticky` (the header and the results tab bar) keeps working.
 *
 * The instance is published on `window.__lenis` so the few places that scroll
 * programmatically can hand the request to Lenis instead of fighting it with a
 * native `window.scrollTo`.
 */

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export function scrollToTop(immediate = false) {
  const lenis = window.__lenis
  if (lenis) {
    lenis.scrollTo(0, { immediate })
    return
  }
  window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
}

export function scrollToElement(target: Element, offset = -120) {
  const lenis = window.__lenis
  if (lenis) {
    lenis.scrollTo(target as HTMLElement, { offset })
    return
  }
  target.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const location = useLocation()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Someone who has asked for less motion should get the browser's own
    // scrolling, untouched.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      // A little over half a second of glide: enough to feel smooth, short
      // enough that the page still goes where you flicked it.
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      // Leave touch scrolling to the OS — hijacking it on a phone feels wrong
      // and costs battery.
      syncTouch: false,
    })

    lenisRef.current = lenis
    window.__lenis = lenis

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
      delete window.__lenis
    }
  }, [])

  // A new route should start at the top, with no glide from the old position.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return <>{children}</>
}
