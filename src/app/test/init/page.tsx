'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'

export default function InitPage() {
  const [isInitializing, setIsInitializing] = useState(false)

  const handleInit = async () => {
    if (!confirm('确定要初始化数据库吗？这将清除所有现有数据！')) {
      return
    }

    setIsInitializing(true)
    try {
      const response = await fetch('/api/init-db', {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '初始化失败')
      }

      const result = await response.json()
      toast({
        title: '初始化成功',
        description: `创建了 ${result.data.posts} 篇文章和 ${result.data.tags} 个标签`,
      })
    } catch (error) {
      console.error('初始化失败:', error)
      toast({
        variant: 'destructive',
        title: '初始化失败',
        description: error instanceof Error ? error.message : '未知错误',
      })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-xl mx-auto space-y-6'>
        <h1 className='text-2xl font-bold'>数据库初始化</h1>
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <h2 className='text-yellow-800 font-semibold mb-2'>警告</h2>
          <p className='text-yellow-700'>
            初始化操作将清除所有现有数据，并重新创建基础数据。请谨慎操作！
          </p>
        </div>
        <Button
          onClick={handleInit}
          disabled={isInitializing}
          variant='destructive'
          className='w-full'
        >
          {isInitializing ? '初始化中...' : '初始化数据库'}
        </Button>
      </div>
    </div>
  )
}
