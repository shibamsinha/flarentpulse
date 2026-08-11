import { Component, type ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SmoothScroll } from '@/components/smooth-scroll'
import LandingPage from '@/pages/landing'
import GeneratePage from '@/pages/generate'
import ResultsPage from '@/pages/results'
import FeedbackPage from '@/pages/feedback'
import NotFoundPage from '@/pages/not-found'

/** Last line of defence — a render crash should never leave a blank screen. */
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('[app] unhandled render error:', error)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="flex min-h-dvh items-center justify-center px-5">
        <div className="max-w-sm text-center">
          <h1 className="text-[20px] font-semibold tracking-tight text-ink-900">
            Something went wrong
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-500">
            Reloading usually fixes it. Your saved growth packs are unaffected.
          </p>
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-ink-900 px-4 text-sm font-medium text-white transition-colors hover:bg-ink-800"
          >
            Back to Flarent Pulse
          </button>
        </div>
      </div>
    )
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SmoothScroll>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/results/:id" element={<ResultsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </SmoothScroll>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
