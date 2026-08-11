import { Suspense, lazy, useEffect, useRef, useState } from 'react'

// Dynamically imported so the Spline runtime lands in its own chunk and is
// never part of the initial page download.
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

function SceneFallback({ label = 'Loading scene' }: { label?: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center" role="status" aria-live="polite">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
      <span className="sr-only">{label}</span>
    </div>
  )
}

/**
 * Spline 3D scene, adapted from 21st.dev (@serafimcloud/splite).
 *
 * Two changes from the original, both about not making a first-time visitor pay
 * for it: the scene only starts downloading once it scrolls into view, and a
 * failure to load degrades to empty space rather than breaking the section.
 */
export function SplineScene({ scene, className }: SplineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    // Honour a reduced-motion preference by never starting the scene.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {shouldLoad && !failed ? (
        <Suspense fallback={<SceneFallback />}>
          <Spline
            scene={scene}
            className="!h-full !w-full"
            onError={() => setFailed(true)}
          />
        </Suspense>
      ) : null}
    </div>
  )
}
