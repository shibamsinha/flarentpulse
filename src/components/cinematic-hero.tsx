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
 * Cinematic scroll hero.
 *
 * The section pins for two and a half viewport heights while a scrubbed
 * timeline plays: the headline wipes in line by line, the product preview
 * rises and settles, then the call to action arrives. Scroll position drives
 * the timeline directly, so scrubbing back up rewinds it.
 *
 * Below 768px, and for anyone who has asked for reduced motion, none of this
 * runs — the same markup renders as an ordinary static hero. Pinning the
 * viewport on a phone fights the user for control of the page.
 */
export function CinematicHero() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      // Keep ScrollTrigger in step with Lenis, which owns the scroll position.
      const lenis = window.__lenis
      lenis?.on('scroll', ScrollTrigger.update)

      const media = gsap.matchMedia()

      media.add(
        {
          animated: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          static: '(max-width: 767px), (prefers-reduced-motion: reduce)',
        },
        (mediaContext) => {
          const { animated } = mediaContext.conditions as { animated: boolean }

          if (!animated) {
            // Static: everything at its resting state, nothing pinned.
            gsap.set('[data-hero-line]', { clipPath: 'inset(0% 0% 0% 0%)', y: 0, opacity: 1 })
            gsap.set('[data-hero-fade]', { opacity: 1, y: 0 })
            gsap.set('[data-hero-preview]', { opacity: 1, y: 0, scale: 1 })
            return
          }

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: '+=250%',
              pin: true,
              pinSpacing: true,
              scrub: 0.8,
              anticipatePin: 1,
            },
            defaults: { ease: 'power2.out' },
          })

          timeline
            // Headline, wiped in one line at a time.
            .fromTo(
              '[data-hero-line]',
              { clipPath: 'inset(0% 100% 0% 0%)', y: 24 },
              { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.1, stagger: 0.5 },
            )
            // Supporting copy.
            .fromTo(
              '[data-hero-sub]',
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.7 },
              '-=0.4',
            )
            // The product itself: rises, settles, comes into focus.
            .fromTo(
              '[data-hero-preview]',
              { opacity: 0, y: 90, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 1.4 },
              '-=0.5',
            )
            // Call to action last, once there is something to act on.
            .fromTo(
              '[data-hero-cta]',
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.7 },
              '-=0.7',
            )
            // The dotted grid drifts and fades as the sequence closes.
            .fromTo(
              '[data-hero-grid]',
              { opacity: 1, y: 0 },
              { opacity: 0.35, y: -40, duration: 1.4 },
              0,
            )
        },
      )

      return () => {
        lenis?.off('scroll', ScrollTrigger.update)
        media.revert()
      }
    }, root)

    // A late-loading webfont changes the headline's height and therefore every
    // trigger position. Recalculate once it settles.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => context.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative flex min-h-dvh items-center overflow-hidden border-b border-ink-200/70"
    >
      <div
        data-hero-grid
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(70%_55%_at_50%_0%,black,transparent)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14">
        <div>
          <div data-hero-fade data-hero-sub>
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
            data-hero-fade
            data-hero-sub
            className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-600 sm:text-[17px]"
          >
            Tell us about your business. We'll turn it into practical marketing ideas, content and
            campaigns you can actually use.
          </p>

          <div data-hero-fade data-hero-cta>
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
