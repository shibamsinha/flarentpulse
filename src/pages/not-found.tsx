import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SiteFooter, SiteHeader } from '@/components/brand'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-24">
        <div className="max-w-sm text-center">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-400">404</p>
          <h1 className="mt-3 text-[24px] font-semibold tracking-tight text-ink-900">
            This page doesn't exist
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-500">
            The link may be old or mistyped. Everything starts from the home page.
          </p>
          <Link to="/" className="mt-6 inline-block">
            <Button>Go home</Button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
