'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { databaseService } from '@/lib/services/database'
import { DatabaseStatus } from '@/components/debug/DatabaseStatus'
import { TestResults } from './TestResults'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'

export function TestPanel() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isCreatingData, setIsCreatingData] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<TestResult>({})

  // 移除自动刷新，只在需要时手动获取
  const { data: dbStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['database-status'],
    queryFn: () => databaseService.getStatus(),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 30,
  })

  const handleInitDb = async () => {
    if (!confirm('确定要初始化数据库吗？这将清除所有现有数据！')) return

    setIsInitializing(true)
    try {
      const response = await fetch('/api/init-db', { method: 'POST' })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || '初始化失败')

      await refetchStatus()
      toast({
        title: '初始化成功',
        description: `创建了 ${data.data.posts} 篇文章和 ${data.data.tags} 个标签`,
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

  const handleCreateTestData = async () => {
    setIsCreatingData(true)
    try {
      const res = await fetch('/api/test-data', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || '创建测试数据失败')

      await refetchStatus()
      toast({
        title: '测试数据创建成功',
        description: `创建了 ${data.summary.posts} 篇文章和 ${data.summary.tags} 个标签`,
      })
    } catch (error) {
      console.error('创建测试数据失败:', error)
      toast({
        variant: 'destructive',
        title: '创建失败',
        description: error instanceof Error ? error.message : '创建测试数据失败',
      })
    } finally {
      setIsCreatingData(false)
    }
  }

  const handleTestBlog = async () => {
    setIsTesting(true)
    const startTime = performance.now()

    try {
      // 1. 测试文章列表
      const listStartTime = performance.now()
      const postsRes = await fetch('/api/posts')
      const posts = await postsRes.json()
      const listEndTime = performance.now()

      if (!posts.data?.length) {
        throw new Error('无法获取文章列表')
      }

      // 2. 测试单篇文章内容
      const contentStartTime = performance.now()
      const postRes = await fetch(`/api/posts/${posts.data[0].slug}`)
      const post = await postRes.json()
      const contentEndTime = performance.now()

      if (!post.data?.content) {
        throw new Error('无法获取文章内容')
      }

      const endTime = performance.now()

      // 计算性能指标
      const performanceMetrics = {
        apiResponseTime: listEndTime - listStartTime + (contentEndTime - contentStartTime),
        renderTime: endTime - contentEndTime,
        totalTime: endTime - startTime,
        markdownParseTime: contentEndTime - contentStartTime,
      }

      // 设置测试结果
      setTestResults({
        posts: posts.data.length,
        content: true,
        responseTime: Math.round(performanceMetrics.apiResponseTime),
        firstPost: posts.data[0],
        markdownTest: post.data.content.includes('#'),
        performance: performanceMetrics,
      })

      await refetchStatus()
      toast({
        title: '测试成功',
        description: `总耗时: ${Math.round(performanceMetrics.totalTime)}ms`,
      })
    } catch (error) {
      console.error('测试失败:', error)
      toast({
        variant: 'destructive',
        title: '测试失败',
        description: error instanceof Error ? error.message : '未知错误',
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* 数据库状态面板 */}
        <div className='border rounded-lg p-4'>
          <h2 className='text-lg font-bold mb-4'>数据库状态</h2>
          <DatabaseStatus />
        </div>

        {/* 测试操作面板 */}
        <div className='border rounded-lg p-4'>
          <h2 className='text-lg font-bold mb-4'>测试操作</h2>
          <div className='space-y-4'>
            <Button
              onClick={handleInitDb}
              disabled={isInitializing}
              variant='destructive'
              className='w-full'
            >
              {isInitializing ? '初始化中...' : '初始化数据库'}
            </Button>

            <Button
              onClick={handleCreateTestData}
              disabled={isCreatingData}
              variant='secondary'
              className='w-full'
            >
              {isCreatingData ? '创建中...' : '创建测试数据'}
            </Button>

            <Button
              onClick={handleTestBlog}
              disabled={isTesting}
              variant='default'
              className='w-full'
            >
              {isTesting ? '测试中...' : '测试博客功能'}
            </Button>
          </div>
        </div>
      </div>

      {/* 测试结果面板 */}
      {testResults && Object.keys(testResults).length > 0 && (
        <div className='border rounded-lg p-4'>
          <h2 className='text-lg font-bold mb-4'>测试结果</h2>
          <TestResults results={testResults} />
        </div>
      )}
    </div>
  )
}
