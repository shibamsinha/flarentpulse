import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TabDef = {
  id: string
  label: string
  shortLabel: string
  icon: LucideIcon
}

/**
 * Horizontal, scrollable tab bar. On mobile it behaves like a swipeable strip
 * with short labels rather than a shrunken desktop row.
 */
export function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="sticky top-14 z-30 -mx-5 border-b border-ink-200/70 bg-white/85 px-5 backdrop-blur-md sm:-mx-8 sm:px-8">
      <div
        role="tablist"
        aria-label="Growth pack sections"
        className="flex gap-1 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const selected = tab.id === active
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-150',
                selected
                  ? 'bg-ink-900 text-white'
                  : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900',
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function TabPanel({
  id,
  active,
  children,
}: {
  id: string
  active: string
  children: React.ReactNode
}) {
  if (id !== active) return null
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      key={id}
      className="animate-fade-up py-8 sm:py-10"
    >
      {children}
    </div>
  )
}
