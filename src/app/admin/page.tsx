'use client'

import { useState, useEffect } from 'react'
import { HiPencilAlt, HiDocumentText, HiHome, HiRefresh, HiEye } from 'react-icons/hi'
import { toast } from '@/components/ui/use-toast'
import { DatabaseStatus } from '@/components/debug/DatabaseStatus'
import { postService } from '@/lib/services/post'
import { Button } from '@/components/ui/button'
import RecentPosts from '@/components/admin/RecentPosts'
import type { PostStats } from '@/types'
import { StatCard } from '@/components/ui/stat-card'

export default function AdminDashboard() {
  const [stats, setStats] = useState<PostStats>({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0,
    recentPosts: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const data = await postService.getPostStats()
      setStats(data)
      toast({
        title: '成功',
        description: '数据已更新',
      })
    } catch (error) {
      console.error('获取统计信息失败:', error)
      toast({
        variant: 'destructive',
        title: '错误',
        description: error instanceof Error ? error.message : '获取统计信息失败',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className='container mx-auto space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>仪表盘</h1>
        <Button onClick={fetchStats} disabled={isLoading}>
          <HiRefresh className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <StatCard
          title='总文章'
          value={stats.total}
          icon={<HiDocumentText className='w-8 h-8' />}
          loading={isLoading}
        />
        <StatCard
          title='已发布'
          value={stats.published}
          icon={<HiHome className='w-8 h-8' />}
          loading={isLoading}
        />
        <StatCard
          title='草稿箱'
          value={stats.draft}
          icon={<HiPencilAlt className='w-8 h-8' />}
          loading={isLoading}
        />
        <StatCard
          title='总浏览'
          value={stats.totalViews}
          icon={<HiEye className='w-8 h-8' />}
          loading={isLoading}
        />
      </div>

      {/* 使用 RecentPosts 组件 */}
      <RecentPosts />

      <DatabaseStatus />
    </div>
  )
}
