import { ReactNode } from 'react'
import PageTransition from './PageTransition'
import BackgroundEffect from '../effects/BackgroundEffect'
import { cn } from '@/utils'

interface BaseLayoutProps {
  children: ReactNode
  className?: string
}

export default function BaseLayout({ children, className }: BaseLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-white dark:bg-gray-900", className)}>
      <BackgroundEffect />
      <PageTransition>
        {children}
      </PageTransition>
    </div>
  )
} 