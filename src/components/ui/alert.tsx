import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
  variant?: 'default' | 'destructive'
  className?: string
}

export function Alert({ 
  children, 
  variant = 'default',
  className 
}: AlertProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border',
        {
          'bg-red-50 border-red-200 text-red-700': variant === 'destructive',
          'bg-gray-50 border-gray-200 text-gray-700': variant === 'default'
        },
        className
      )}
      role="alert"
    >
      {children}
    </div>
  )
} 