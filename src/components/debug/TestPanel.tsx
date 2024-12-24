'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { databaseService } from '@/lib/services/database'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { TestResults } from './TestResults'
import { DatabaseStatus } from './DatabaseStatus'
import { PostsList } from './PostsList'
import { RefreshCw, Database, FileText, Beaker, Trash2, Plus, PlayCircle } from 'lucide-react'

export function TestPanel() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isCreatingData, setIsCreatingData] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<TestResult>({})
  const queryClient = useQueryClient()

  const { refetch: refetchStatus } = useQuery({
    queryKey: ['database-status'],
    queryFn: () => databaseService.getStatus(),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 30,
  })

  // 添加文章列表查询
  const { data: posts } = useQuery({
    queryKey: ['posts-preview'],
    queryFn: () => databaseService.getPostsPreview(),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })

  // 刷新所有数据库相关状态
  const refreshAllDatabaseStats = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['database-status'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] }),
      queryClient.invalidateQueries({ queryKey: ['posts-preview'] }),
    ])
  }

  const handleInitDb = async () => {
    if (!confirm('确定要初始化数据库吗？这将清除所有现有数据！')) return

    setIsInitializing(true)
    try {
      const response = await fetch('/api/init-db', { method: 'POST' })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || '初始化失败')

      // 刷新所有状态
      await refreshAllDatabaseStats()

      toast({
        title: '初始化成功',
        description: `创建了 ${data.data.posts} 篇文章和 ${data.data.tags} 个标签`,
        variant: 'success',
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

      // 刷新所有状态
      await refreshAllDatabaseStats()

      toast({
        title: '测试数据创建成功',
        description: `创建了 ${data.summary.posts} 篇文章和 ${data.summary.tags} 个标签`,
        variant: 'success',
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
    <div className='h-[calc(100vh-4rem)] p-6 bg-gray-50'>
      <div className='h-full max-w-6xl mx-auto flex flex-col space-y-4'>
        {/* 顶部标题栏 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Database className='h-5 w-5 text-gray-700' />
            <h1 className='text-xl font-medium text-gray-900'>数据库测试面板</h1>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={refreshAllDatabaseStats}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-900'
          >
            <RefreshCw className='h-4 w-4' />
            刷新
          </Button>
        </div>

        {/* 主内容区 */}
        <div className='flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0'>
          {/* 左侧面板 */}
          <div className='lg:col-span-1 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
            <div className='p-4 border-b border-gray-100'>
              <h2 className='text-sm font-medium text-gray-900'>数据库状态</h2>
            </div>
            <div className='flex-1 p-4 overflow-y-auto'>
              <DatabaseStatus />
            </div>
          </div>

          {/* 右侧面板 */}
          <div className='lg:col-span-2 flex flex-col min-h-0'>
            {/* 操作区 */}
            <div className='bg-white rounded-lg border border-gray-200 shadow-sm'>
              <div className='p-4'>
                <div className='flex items-center gap-3'>
                  <Button
                    variant='outline'
                    onClick={handleInitDb}
                    disabled={isInitializing}
                    className='flex-1 flex items-center justify-center gap-2 h-9 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200'
                  >
                    <Trash2 className='h-4 w-4' />
                    {isInitializing ? '初始化中...' : '初始化数据库'}
                  </Button>
                  <Button
                    variant='outline'
                    onClick={handleCreateTestData}
                    disabled={isCreatingData}
                    className='flex-1 flex items-center justify-center gap-2 h-9'
                  >
                    <Plus className='h-4 w-4' />
                    {isCreatingData ? '创建中...' : '创建测试数据'}
                  </Button>
                  <Button
                    variant='outline'
                    onClick={handleTestBlog}
                    disabled={isTesting}
                    className='flex-1 flex items-center justify-center gap-2 h-9'
                  >
                    <PlayCircle className='h-4 w-4' />
                    {isTesting ? '测试中...' : '测试博客功能'}
                  </Button>
                </div>
              </div>
            </div>

            {/* 文章列表（可滚动区域） */}
            <div className='flex-1 bg-white rounded-lg border border-gray-200 shadow-sm mt-4 overflow-hidden flex flex-col min-h-0'>
              <div className='p-4 border-b border-gray-100'>
                <h2 className='text-sm font-medium text-gray-900'>文章列表</h2>
              </div>
              <div className='flex-1 overflow-y-auto p-4'>
                <PostsList posts={posts} />
              </div>
            </div>

            {/* 测试结果（固定在底部） */}
            {testResults && Object.keys(testResults).length > 0 && (
              <div className='bg-white rounded-lg border border-gray-200 shadow-sm mt-4'>
                <div className='p-4 border-b border-gray-100'>
                  <h2 className='text-sm font-medium text-gray-900'>测试结果</h2>
                </div>
                <div className='p-4'>
                  <TestResults results={testResults} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
