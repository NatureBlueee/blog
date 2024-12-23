import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    label, 
    loading = false, 
    variant = 'primary',
    size = 'md',
    className,
    disabled,
    children,
    ...props 
  }, ref) => {
    const baseStyles = 'rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
    const variantStyles = {
      primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50',
      secondary: 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700',
      ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800'
    }
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    }

    return (
      <button
        ref={ref}
        disabled={loading || disabled}
        aria-label={label}
        aria-busy={loading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          loading && 'opacity-70 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center space-x-2">
            <svg 
              className="animate-spin h-4 w-4" 
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>{label}</span>
          </span>
        ) : children || label}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton' 