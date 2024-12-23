'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiPencilAlt, HiDocumentText, HiHome } from 'react-icons/hi'
import { toast } from '@/components/ui/use-toast'
import { DatabaseStatus } from '@/components/debug/DatabaseStatus'

interface PostStats {
  total: number
  published: number
  draft: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<PostStats>({
    total: 0,
    published: 0,
    draft: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/posts/stats')
        if (!response.ok) throw new Error('获取统计信息失败')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('获取统计信息失败:', error)
        toast({
          variant: 'destructive',
          title: '错误',
          description: '获取统计信息失败',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>仪表盘</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='p-6 bg-card rounded-lg border shadow-sm animate-pulse'>
                <div className='h-16 bg-muted rounded' />
              </div>
            ))}
          </>
        ) : (
          <>
            <div className='p-6 bg-card rounded-lg border shadow-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>总文章数</p>
                  <h2 className='text-3xl font-bold'>{stats.total}</h2>
                </div>
                <HiDocumentText className='w-8 h-8 text-muted-foreground' />
              </div>
            </div>

            <div className='p-6 bg-card rounded-lg border shadow-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>已发布</p>
                  <h2 className='text-3xl font-bold'>{stats.published}</h2>
                </div>
                <HiHome className='w-8 h-8 text-muted-foreground' />
              </div>
            </div>

            <div className='p-6 bg-card rounded-lg border shadow-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>草稿箱</p>
                  <h2 className='text-3xl font-bold'>{stats.draft}</h2>
                </div>
                <HiPencilAlt className='w-8 h-8 text-muted-foreground' />
              </div>
            </div>
          </>
        )}
      </div>

      <DatabaseStatus />
    </div>
  )
}
