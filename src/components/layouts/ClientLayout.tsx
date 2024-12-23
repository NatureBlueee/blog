'use client'

import { ToastContainer } from '@/components/ui/toast'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
} 