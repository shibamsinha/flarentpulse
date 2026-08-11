import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary:
    'bg-ink-900 text-white shadow-subtle hover:bg-ink-800 active:bg-ink-950 disabled:bg-ink-300',
  secondary:
    'bg-white text-ink-900 border border-ink-200 shadow-subtle hover:bg-ink-50 hover:border-ink-300',
  outline: 'border border-ink-200 text-ink-700 hover:bg-ink-50 hover:text-ink-900',
  ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-lg gap-2',
  lg: 'h-12 px-6 text-[15px] rounded-xl gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex select-none items-center justify-center font-medium transition-all duration-150',
        'disabled:pointer-events-none disabled:opacity-60',
        'active:scale-[0.985]',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
