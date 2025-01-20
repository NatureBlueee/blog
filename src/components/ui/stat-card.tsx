'use client'

import { ReactNode } from 'react'
import { Card } from './card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  description?: string
  className?: string
  loading?: boolean
}

export function StatCard({
  title,
  value,
  icon,
  description,
  className,
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn('p-6 relative overflow-hidden', className)}>
        <div className='space-y-3'>
          <div className='h-4 w-1/2 bg-muted animate-pulse rounded' />
          <div className='h-8 w-1/3 bg-muted animate-pulse rounded' />
          {description && <div className='h-4 w-2/3 bg-muted animate-pulse rounded' />}
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn('p-6', className)}>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <p className='text-sm font-medium text-muted-foreground'>{title}</p>
          <h2 className='text-3xl font-bold'>{value}</h2>
          {description && <p className='text-sm text-muted-foreground'>{description}</p>}
        </div>
        {icon && <div className='text-muted-foreground'>{icon}</div>}
      </div>
    </Card>
  )
}
