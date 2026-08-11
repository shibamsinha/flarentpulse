import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  FlaskConical,
  Instagram,
  LayoutGrid,
  Loader2,
  MapPin,
  MessageCircle,
  Search,
  SearchX,
  Star,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EarlyAccessBadge, SiteFooter, SiteHeader } from '@/components/brand'
import { FeedbackForm } from '@/components/feedback-form'
import { scrollToTop } from '@/components/smooth-scroll'
import { TabBar, TabPanel, type TabDef } from '@/components/results/tabs'
import {
  CalendarPanel,
  GooglePanel,
  MarketingPanel,
  SnapshotPanel,
  SocialPanel,
  WhatsAppPanel,
} from '@/components/results/panels'
import { getGeneration, type StoredGeneration } from '@/lib/storage'

const TABS: TabDef[] = [
  { id: 'snapshot', label: 'Business Snapshot', shortLabel: 'Snapshot', icon: LayoutGrid },
  { id: 'social', label: 'Social Media', shortLabel: 'Social', icon: Instagram },
  { id: 'whatsapp', label: 'WhatsApp', shortLabel: 'WhatsApp', icon: MessageCircle },
  { id: 'google', label: 'Google', shortLabel: 'Google', icon: Star },
  { id: 'marketing', label: 'Marketing', shortLabel: 'Marketing', icon: TrendingUp },
  { id: 'calendar', label: '30-Day Plan', shortLabel: '30 Days', icon: CalendarDays },
]

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; record: StoredGeneration }
  | { status: 'missing' }
  | { status: 'error' }

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-ink-50/40">
      <SiteHeader>
        <EarlyAccessBadge className="hidden sm:inline-flex" />
      </SiteHeader>
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  )
}

function CenteredState({
  icon: Icon,
  title,
  body,
  children,
}: {
  icon: typeof SearchX
  title: string
  body: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-5 py-24">
      <div className="max-w-sm text-center animate-fade-up">
        <span className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-400 shadow-subtle">
          <Icon className="h-5 w-5" />
        </span>
        <h1 className="mt-5 text-[20px] font-semibold tracking-tight text-ink-900">{title}</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{body}</p>
        {children && <div className="mt-6 flex justify-center gap-3">{children}</div>}
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>()
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [activeTab, setActiveTab] = useState('snapshot')

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    if (!id) {
      setState({ status: 'missing' })
      return
    }

    getGeneration(id)
      .then((record) => {
        if (cancelled) return
        setState(record ? { status: 'ready', record } : { status: 'missing' })
      })
      .catch((error) => {
        console.error('[results] failed to load generation:', error)
        if (!cancelled) setState({ status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [id])

  // Hand the scroll to Lenis so switching tabs glides back up rather than
  // snapping — and so it doesn't fight the smooth-scroll loop.
  useEffect(() => {
    scrollToTop()
  }, [activeTab])

  if (state.status === 'loading') {
    return (
      <Shell>
        <div className="flex flex-1 items-center justify-center px-5 py-24">
          <div className="flex items-center gap-2.5 text-[14px] text-ink-500">
            <Loader2 className="h-4 w-4 animate-spin text-accent-500" />
            Loading your growth pack…
          </div>
        </div>
      </Shell>
    )
  }

  if (state.status === 'missing') {
    return (
      <Shell>
        <CenteredState
          icon={SearchX}
          title="We couldn't find that growth pack"
          body="The link may be from another device or browser. Building a new one takes about two minutes."
        >
          <Link to="/generate">
            <Button>Build a new pack</Button>
          </Link>
          <Link to="/">
            <Button variant="secondary">Go home</Button>
          </Link>
        </CenteredState>
      </Shell>
    )
  }

  if (state.status === 'error') {
    return (
      <Shell>
        <CenteredState
          icon={Search}
          title="Something went wrong loading this page"
          body="This is usually a connection problem. Try reloading — your pack is saved."
        >
          <Button onClick={() => window.location.reload()}>Reload</Button>
          <Link to="/generate">
            <Button variant="secondary">Build a new pack</Button>
          </Link>
        </CenteredState>
      </Shell>
    )
  }

  const { record } = state
  const { pack, business } = record

  const metrics = [
    { label: 'Marketing Opportunities', value: pack.marketing.length + pack.opportunities.length },
    { label: 'Social Content Ideas', value: pack.social.posts.length + pack.social.reels.length },
    { label: 'WhatsApp Campaigns', value: Object.keys(pack.whatsapp).length },
    { label: 'Content Calendar', value: pack.contentCalendar.length },
  ]

  return (
    <Shell>
      {/* Pack header */}
      <div className="border-b border-ink-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-ink-500 transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Flarent Pulse
          </Link>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4 animate-fade-up">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-400">
                Business Growth Pack
              </p>
              <h1 className="mt-2 text-[30px] font-semibold leading-tight tracking-tighter text-ink-900 sm:text-[38px]">
                {business.businessName}
              </h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-[14px] text-ink-500">
                <MapPin className="h-3.5 w-3.5" />
                {business.location} · {business.industry}
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <span className="text-[12px] text-ink-400">
                Generated{' '}
                {new Date(record.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <Link to="/generate">
                <Button variant="secondary" size="sm">
                  Build another pack
                </Button>
              </Link>
            </div>
          </div>

          {record.source === 'sample' && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-[13.5px] leading-relaxed text-amber-900">
              <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                <span className="font-medium">Sample pack.</span> This deployment has no AI
                credentials configured, so Pulse built a structured example from your answers. Set{' '}
                <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[12px]">
                  OPENAI_API_KEY
                </code>{' '}
                on the server to generate the real thing.
              </p>
            </div>
          )}

          <div className="mt-7">
            <p className="text-[15px] text-ink-600">
              Here's what we think could help your business grow.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-ink-200/80 bg-white p-4 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
                >
                  <p className="text-[26px] font-semibold leading-none tracking-tighter text-ink-900">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-[12.5px] leading-tight text-ink-500">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto w-full max-w-6xl flex-1 px-5 sm:px-8">
        <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

        <TabPanel id="snapshot" active={activeTab}>
          <SnapshotPanel pack={pack} business={business} />
        </TabPanel>
        <TabPanel id="social" active={activeTab}>
          <SocialPanel pack={pack} />
        </TabPanel>
        <TabPanel id="whatsapp" active={activeTab}>
          <WhatsAppPanel pack={pack} />
        </TabPanel>
        <TabPanel id="google" active={activeTab}>
          <GooglePanel pack={pack} />
        </TabPanel>
        <TabPanel id="marketing" active={activeTab}>
          <MarketingPanel pack={pack} />
        </TabPanel>
        <TabPanel id="calendar" active={activeTab}>
          <CalendarPanel pack={pack} />
        </TabPanel>

        <div className="border-t border-ink-200/70 py-10 sm:py-14">
          <FeedbackForm generationId={record.id} />
        </div>
      </div>
    </Shell>
  )
}
