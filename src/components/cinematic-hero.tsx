import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { EarlyAccessBadge } from '@/components/brand'
import { DashboardPreview } from '@/components/dashboard-preview'

gsap.registerPlugin(ScrollTrigger)

/**
 * Cinematic hero.
 *
 * Two separate things happen, and the distinction matters:
 *
 * 1. On load, an entrance timeline plays by itself — the headline wipes in line
 *    by line, the product preview rises and settles, the call to action
 *    arrives. It is over in about 1.4s without the reader doing anything.
 *
 * 2. On scroll, a second scrubbed timeline gives the hero a cinematic exit:
 *    the copy drifts up and fades, the preview eases back, the grid recedes.
 *
 * The entrance is deliberately NOT scroll-driven. A scrubbed intro means the
 * page renders empty until the reader scrolls, which reads as a broken site.
 *
 * Everything uses gsap.from(), so the markup's natural state is the finished
 * state: if GSAP fails to load or throws, the hero is simply a normal hero.
 */
export function CinematicHero() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const lenis = window.__lenis
      lenis?.on('scroll', ScrollTrigger.update)

      const media = gsap.matchMedia()

      media.add(
        {
          animated: '(prefers-reduced-motion: no-preference)',
          parallax: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        },
        (mediaContext) => {
          const { animated, parallax } = mediaContext.conditions as {
            animated: boolean
            parallax: boolean
          }

          if (!animated) return

          // 1. Entrance — plays immediately, no scrolling required.
          const intro = gsap
            .timeline({ defaults: { ease: 'power3.out' } })
            .from('[data-hero-line]', {
              clipPath: 'inset(0% 100% 0% 0%)',
              y: 20,
              duration: 0.9,
              stagger: 0.14,
            })
            .from('[data-hero-sub]', { opacity: 0, y: 16, duration: 0.6 }, '-=0.55')
            .from(
              '[data-hero-preview]',
              { opacity: 0, y: 48, scale: 0.96, duration: 0.9 },
              '-=0.5',
            )
            .from('[data-hero-cta]', { opacity: 0, y: 14, duration: 0.6 }, '-=0.6')

          // The entrance starts by hiding things. If it were ever to stall —
          // a suspended ticker, a throttled tab — the hero would sit blank,
          // which is precisely the failure this rewrite exists to prevent.
          // setTimeout keeps running when rAF does not, so it can finish the
          // job by hand.
          const failsafe = window.setTimeout(() => {
            if (intro.progress() < 1) intro.progress(1)
          }, 2500)

          // 2. Departure — scrubbed against scroll as the hero leaves.
          if (parallax) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: root.current,
                  start: 'top top',
                  end: 'bottom top',
                  scrub: 0.6,
                },
                defaults: { ease: 'none' },
              })
              .to('[data-hero-copy]', { y: -70, opacity: 0.15 }, 0)
              .to('[data-hero-preview]', { y: -30, scale: 0.97, opacity: 0.35 }, 0)
              .to('[data-hero-grid]', { y: -50, opacity: 0.3 }, 0)
          }

          return () => window.clearTimeout(failsafe)
        },
      )

      return () => {
        lenis?.off('scroll', ScrollTrigger.update)
        media.revert()
      }
    }, root)

    // A late webfont changes the headline height and every trigger position.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => context.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-b border-ink-200/70"
    >
      <div
        data-hero-grid
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(70%_55%_at_50%_0%,black,transparent)]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14 lg:py-24">
        <div data-hero-copy>
          <div data-hero-sub>
            <EarlyAccessBadge />
          </div>

          <h1 className="mt-5 text-[38px] font-semibold leading-[1.05] tracking-tighter text-ink-900 sm:text-[52px] lg:text-[56px]">
            <span data-hero-line className="block will-change-[clip-path]">
              Turn your business
            </span>
            <span data-hero-line className="block will-change-[clip-path]">
              into a growth plan.
            </span>
          </h1>

          <p
            data-hero-sub
            className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-600 sm:text-[17px]"
          >
            Tell us about your business. We'll turn it into practical marketing ideas, content and
            campaigns you can actually use.
          </p>

          <div data-hero-cta>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/generate">
                <Button size="lg" className="group">
                  Build My Growth Pack
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <span className="text-[13px] text-ink-500">Free early access</span>
            </div>
            <p className="mt-6 text-[13px] text-ink-400">
              No sign up. No credit card. Your pack is ready in under a minute.
            </p>
          </div>
        </div>

        <div data-hero-preview className="will-change-transform">
          <DashboardPreview />
        </div>
      </div>
    </section>
  )
}
