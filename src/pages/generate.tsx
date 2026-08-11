import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { businessInputSchema, GOALS, type BusinessInput } from '@shared/schema'
import { Button } from '@/components/ui/button'
import { TextAreaField, TextField } from '@/components/ui/field'
import { EarlyAccessBadge, SiteFooter, SiteHeader } from '@/components/brand'
import { GeneratingOverlay } from '@/components/generating-overlay'
import { scrollToElement } from '@/components/smooth-scroll'
import { GenerationError, generateGrowthPack } from '@/lib/api'
import { saveGeneration } from '@/lib/storage'
import { cn } from '@/lib/utils'

const INDUSTRY_SUGGESTIONS = [
  'Dry Cleaning & Laundry',
  'Interior Design',
  'Real Estate',
  'Restaurant / Café',
  'Salon & Spa',
  'Gym & Fitness',
  'Clothing & Fashion Retail',
  'Jewellery',
  'Bakery',
  'Photography',
  'Event Planning',
  'Travel Agency',
  'Coaching / Tuition Centre',
  'Dental Clinic',
  'Healthcare Clinic',
  'Chartered Accountancy',
  'Legal Services',
  'IT Services & Software',
  'Digital Marketing Agency',
  'Manufacturing',
  'Construction & Civil Works',
  'Furniture',
  'Electronics Retail',
  'Automobile Services',
  'Logistics & Transport',
  'Home Services & Repairs',
  'Pet Care',
]

type FormState = {
  businessName: string
  industry: string
  location: string
  description: string
  targetAudience: string
  goals: string[]
  website: string
  instagram: string
  additionalInformation: string
}

const EMPTY_FORM: FormState = {
  businessName: '',
  industry: '',
  location: '',
  description: '',
  targetAudience: '',
  goals: [],
  website: '',
  instagram: '',
  additionalInformation: '',
}

type FieldErrors = Partial<Record<keyof FormState, string>>

function SectionHeading({ index, title, hint }: { index: string; title: string; hint?: string }) {
  return (
    <div className="mb-5 flex items-baseline gap-3 border-b border-ink-200/70 pb-3">
      <span className="font-mono text-[11px] text-ink-400">{index}</span>
      <h2 className="text-[15px] font-semibold tracking-tight text-ink-900">{title}</h2>
      {hint && <span className="ml-auto text-[12px] text-ink-400">{hint}</span>}
    </div>
  )
}

export default function GeneratePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const toggleGoal = (goal: string) => {
    setErrors((current) => ({ ...current, goals: undefined }))
    setForm((current) => ({
      ...current,
      goals: current.goals.includes(goal)
        ? current.goals.filter((item) => item !== goal)
        : [...current.goals, goal],
    }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitError(null)

    const parsed = businessInputSchema.safeParse(form)
    if (!parsed.success) {
      const nextErrors: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState | undefined
        if (key && !nextErrors[key]) nextErrors[key] = issue.message
      }
      setErrors(nextErrors)
      const firstKey = Object.keys(nextErrors)[0]
      const firstField = document.querySelector(`[data-field="${firstKey}"]`)
      if (firstField) scrollToElement(firstField)
      return
    }

    setIsGenerating(true)
    try {
      const input: BusinessInput = parsed.data
      const { pack, source } = await generateGrowthPack(input)
      const record = await saveGeneration(input, pack, source)
      navigate(`/results/${record.id}`, { replace: true })
    } catch (error) {
      setIsGenerating(false)
      setSubmitError(
        error instanceof GenerationError
          ? error.message
          : 'Something went wrong on our side. Please try again in a moment.',
      )
      window.__lenis
        ? window.__lenis.scrollTo(document.body.scrollHeight)
        : window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-ink-50/40">
      <SiteHeader>
        <EarlyAccessBadge className="hidden sm:inline-flex" />
      </SiteHeader>

      {isGenerating && <GeneratingOverlay />}

      <main className="flex-1">
        <div className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-ink-500 transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>

          <div className="mt-6 animate-fade-up">
            <h1 className="text-[32px] font-semibold leading-tight tracking-tighter text-ink-900 sm:text-[38px]">
              Tell us about your business.
            </h1>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-600">
              The more we understand, the more useful your growth pack becomes.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-8">
            <section className="rounded-xl border border-ink-200/80 bg-white p-5 shadow-subtle sm:p-7">
              <SectionHeading index="01" title="The basics" />
              <div className="space-y-5">
                <div data-field="businessName">
                  <TextField
                    label="Business name"
                    placeholder="e.g. West Dry Cleaners"
                    value={form.businessName}
                    onChange={(e) => update('businessName', e.target.value)}
                    error={errors.businessName}
                    autoComplete="organization"
                    maxLength={120}
                  />
                </div>
                <div data-field="industry">
                  <TextField
                    label="Industry"
                    hint="Type your own or pick from the list."
                    placeholder="e.g. Dry Cleaning & Laundry"
                    list="industry-suggestions"
                    value={form.industry}
                    onChange={(e) => update('industry', e.target.value)}
                    error={errors.industry}
                    maxLength={120}
                  />
                  <datalist id="industry-suggestions">
                    {INDUSTRY_SUGGESTIONS.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                </div>
                <div data-field="location">
                  <TextField
                    label="Location"
                    placeholder="e.g. Kolkata, India"
                    value={form.location}
                    onChange={(e) => update('location', e.target.value)}
                    error={errors.location}
                    maxLength={160}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-ink-200/80 bg-white p-5 shadow-subtle sm:p-7">
              <SectionHeading index="02" title="What you do, and who for" />
              <div className="space-y-5">
                <div data-field="description">
                  <TextAreaField
                    label="What does your business do?"
                    placeholder="Tell us briefly about your products or services."
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    error={errors.description}
                    maxLength={1500}
                    rows={4}
                  />
                </div>
                <div data-field="targetAudience">
                  <TextAreaField
                    label="Who are your customers?"
                    placeholder="e.g. Working professionals and families within 3 km who need regular laundry and garment care."
                    value={form.targetAudience}
                    onChange={(e) => update('targetAudience', e.target.value)}
                    error={errors.targetAudience}
                    maxLength={1000}
                    rows={3}
                  />
                </div>
              </div>
            </section>

            <section
              data-field="goals"
              className="rounded-xl border border-ink-200/80 bg-white p-5 shadow-subtle sm:p-7"
            >
              <SectionHeading index="03" title="What are you trying to achieve?" hint="Pick any" />
              <div className="flex flex-wrap gap-2">
                {GOALS.map((goal) => {
                  const selected = form.goals.includes(goal)
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      aria-pressed={selected}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-medium transition-all duration-150 active:scale-[0.98]',
                        selected
                          ? 'border-ink-900 bg-ink-900 text-white'
                          : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50 hover:text-ink-900',
                      )}
                    >
                      {selected && <Check className="h-3.5 w-3.5" />}
                      {goal}
                    </button>
                  )
                })}
              </div>
              {errors.goals && (
                <p className="mt-3 flex items-center gap-1.5 text-[13px] text-rose-600">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {errors.goals}
                </p>
              )}
            </section>

            <section className="rounded-xl border border-ink-200/80 bg-white p-5 shadow-subtle sm:p-7">
              <SectionHeading index="04" title="Anything that helps us" hint="All optional" />
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    label="Website"
                    optional
                    placeholder="e.g. westdrycleaners.in"
                    value={form.website}
                    onChange={(e) => update('website', e.target.value)}
                    error={errors.website}
                    inputMode="url"
                    maxLength={200}
                  />
                  <TextField
                    label="Instagram"
                    optional
                    placeholder="e.g. @westdrycleaners"
                    value={form.instagram}
                    onChange={(e) => update('instagram', e.target.value)}
                    error={errors.instagram}
                    maxLength={200}
                  />
                </div>
                <TextAreaField
                  label="Anything else?"
                  optional
                  hint="Offers you run, competitors, what has not worked before."
                  placeholder="Anything you'd want a consultant to know."
                  value={form.additionalInformation}
                  onChange={(e) => update('additionalInformation', e.target.value)}
                  error={errors.additionalInformation}
                  maxLength={1500}
                  rows={3}
                />
              </div>
            </section>

            {submitError && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-[14px] text-rose-800 animate-fade-in">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-medium">We couldn't build your pack</p>
                  <p className="mt-0.5 leading-relaxed text-rose-700">{submitError}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col items-start gap-3 pb-4 sm:flex-row sm:items-center">
              <Button
                type="submit"
                size="lg"
                disabled={isGenerating}
                className="group w-full sm:w-auto"
              >
                {isGenerating ? 'Generating…' : 'Generate My Growth Pack'}
                {!isGenerating && (
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                )}
              </Button>
              <p className="text-[13px] text-ink-500">
                Takes under a minute. Nothing is shared with anyone.
              </p>
            </div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
