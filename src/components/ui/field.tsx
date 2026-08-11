import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const controlStyles =
  'w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 ' +
  'transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent-500/25'

export function FieldShell({
  label,
  hint,
  optional,
  error,
  htmlFor,
  children,
}: {
  label: string
  hint?: string
  optional?: boolean
  error?: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="flex items-baseline gap-2 text-sm font-medium text-ink-800">
        {label}
        {optional && <span className="text-xs font-normal text-ink-400">Optional</span>}
      </label>
      {hint && <p className="-mt-0.5 text-[13px] leading-snug text-ink-500">{hint}</p>}
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-[13px] text-rose-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  optional?: boolean
  error?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, hint, optional, error, className, id, ...props }, ref) => {
    const generatedId = useId()
    const fieldId = id ?? generatedId
    return (
      <FieldShell label={label} hint={hint} optional={optional} error={error} htmlFor={fieldId}>
        <input
          id={fieldId}
          ref={ref}
          aria-invalid={Boolean(error)}
          className={cn(
            controlStyles,
            error ? 'border-rose-300 focus:ring-rose-500/20' : 'border-ink-200 hover:border-ink-300',
            className,
          )}
          {...props}
        />
      </FieldShell>
    )
  },
)
TextField.displayName = 'TextField'

export interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
  optional?: boolean
  error?: string
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, hint, optional, error, className, id, rows = 4, ...props }, ref) => {
    const generatedId = useId()
    const fieldId = id ?? generatedId
    return (
      <FieldShell label={label} hint={hint} optional={optional} error={error} htmlFor={fieldId}>
        <textarea
          id={fieldId}
          ref={ref}
          rows={rows}
          aria-invalid={Boolean(error)}
          className={cn(
            controlStyles,
            'resize-y leading-relaxed',
            error ? 'border-rose-300 focus:ring-rose-500/20' : 'border-ink-200 hover:border-ink-300',
            className,
          )}
          {...props}
        />
      </FieldShell>
    )
  },
)
TextAreaField.displayName = 'TextAreaField'
