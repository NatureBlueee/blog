'use client'

import { TestPanel } from '@/components/debug/TestPanel'

export default function TestPage() {
  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>测试面板</h1>
      <TestPanel />
    </div>
  )
}
