import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  Instagram,
  MapPin,
  MessageCircle,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EarlyAccessBadge, SiteFooter, SiteHeader } from '@/components/brand'
import { DashboardPreview } from '@/components/dashboard-preview'

const deliverables = [
  {
    icon: Instagram,
    title: 'Social Media Ideas',
    body: 'Five post concepts and three reel outlines, each with a caption and a call to action you can post as written.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Campaigns',
    body: 'Welcome, follow-up, promotion and review-request messages written the way your customers actually talk.',
  },
  {
    icon: Star,
    title: 'Google Reviews',
    body: 'A review request that does not feel like begging, plus replies for positive, neutral and negative reviews.',
  },
  {
    icon: TrendingUp,
    title: 'Marketing Opportunities',
    body: 'Five specific moves for your business, each with why it could work, how to do it, and how hard it is.',
  },
  {
    icon: CalendarDays,
    title: '30-Day Content Calendar',
    body: 'A day-by-day plan so you never open Instagram wondering what to post today.',
  },
]

const inputs = [
  { icon: Target, label: 'Industry', body: 'What works for a salon does not work for a fabricator.' },
  { icon: MapPin, label: 'Location', body: 'Local search and local partnerships, not national advice.' },
  { icon: Users, label: 'Target audience', body: 'Written for the people who actually pay you.' },
  { icon: TrendingUp, label: 'Business goals', body: 'Enquiries, repeat customers or reach — pick yours.' },
]

const steps = [
  {
    title: 'Tell us about your business',
    body: 'Six short questions. Two minutes, no account, no card.',
  },
  {
    title: 'Get your personalized growth pack',
    body: 'Opportunities, content, campaigns and a month-long plan — built around what you told us.',
  },
  {
    title: 'Start using the ideas immediately',
    body: 'Every message and caption is ready to copy. Nothing here needs an agency to run.',
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader>
        <Link to="/generate" className="hidden sm:block">
          <Button size="sm">Build My Growth Pack</Button>
        </Link>
      </SiteHeader>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-ink-200/70">
          <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(70%_55%_at_50%_0%,black,transparent)]" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14 lg:py-24">
            <div className="animate-fade-up">
              <EarlyAccessBadge />
              <h1 className="mt-5 text-[38px] font-semibold leading-[1.05] tracking-tighter text-ink-900 sm:text-[52px] lg:text-[56px]">
                Turn your business
                <br className="hidden sm:block" /> into a growth plan.
              </h1>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-600 sm:text-[17px]">
                Tell us about your business. We'll turn it into practical marketing ideas, content
                and campaigns you can actually use.
              </p>
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

            <div className="animate-fade-up [animation-delay:120ms]">
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b border-ink-200/70">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400">
              How it works
            </p>
            <h2 className="mt-3 max-w-lg text-[28px] font-semibold leading-tight tracking-tighter text-ink-900 sm:text-[34px]">
              Three steps, and you have a month of marketing.
            </h2>
            <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border border-ink-200/80 bg-ink-200/70 sm:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="bg-white p-6 sm:p-7">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-ink-200 text-[13px] font-medium text-ink-500">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-ink-900">{step.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What you'll get */}
        <section className="border-b border-ink-200/70 bg-ink-50/40">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400">
              What you'll get
            </p>
            <h2 className="mt-3 max-w-xl text-[28px] font-semibold leading-tight tracking-tighter text-ink-900 sm:text-[34px]">
              Everything is written for your business, ready to copy.
            </h2>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {deliverables.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="group rounded-xl border border-ink-200/80 bg-white p-6 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-card"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200/80 bg-ink-50 text-ink-600 transition-colors group-hover:border-accent-200 group-hover:bg-accent-50 group-hover:text-accent-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-ink-900">{title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{body}</p>
                </div>
              ))}
              <div className="flex flex-col justify-between rounded-xl border border-dashed border-ink-300/80 bg-white/60 p-6">
                <p className="text-[14px] leading-relaxed text-ink-500">
                  Everything arrives in one dashboard you can come back to any time.
                </p>
                <Link
                  to="/generate"
                  className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-900 hover:text-accent-600"
                >
                  Build yours
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Built for real businesses */}
        <section className="border-b border-ink-200/70">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400">
                Built for real businesses
              </p>
              <h2 className="mt-3 text-[28px] font-semibold leading-tight tracking-tighter text-ink-900 sm:text-[34px]">
                Advice that could only have been written for you.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
                Most marketing advice is written for everyone, which means it fits nobody. Pulse
                takes what you tell us about your business and builds every recommendation from it —
                so you get ideas that reference your services, your city and the customers you're
                trying to reach.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
                No unrealistic budgets. No promises about results. Just the specific, executable
                next moves a good consultant would give you.
              </p>
            </div>
            <div className="grid gap-px self-start overflow-hidden rounded-xl border border-ink-200/80 bg-ink-200/70 sm:grid-cols-2">
              {inputs.map(({ icon: Icon, label, body }) => (
                <div key={label} className="bg-white p-6">
                  <Icon className="h-4 w-4 text-ink-400" />
                  <h3 className="mt-3 text-[14px] font-semibold text-ink-900">{label}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-950 px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background:radial-gradient(60%_60%_at_50%_0%,#818cf8,transparent_70%)]" />
            <div className="relative">
              <h2 className="mx-auto max-w-xl text-[28px] font-semibold leading-tight tracking-tighter text-white sm:text-[34px]">
                Your growth pack is two minutes away.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-300">
                Practical marketing ideas, content and campaigns — personalized for your business.
              </p>
              <Link to="/generate" className="mt-8 inline-block">
                <Button
                  size="lg"
                  className="group bg-white text-ink-900 hover:bg-ink-100 active:bg-ink-200"
                >
                  Build My Growth Pack
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <p className="mt-4 text-[13px] text-ink-400">Free early access</p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
