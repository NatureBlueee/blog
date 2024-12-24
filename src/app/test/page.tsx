'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

interface TestResult {
  posts?: number
  content?: boolean
  responseTime?: number
  firstPost?: any
  markdownTest?: boolean
  performance?: {
    apiResponseTime: number
    renderTime: number
    totalTime: number
    markdownParseTime?: number
  }
}

export default function TestPage() {
  const router = useRouter()
  const [isInitializing, setIsInitializing] = useState(false)
  const [isCreatingData, setIsCreatingData] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<TestResult>({})

  // 初始化数据库
  const handleInitDb = async () => {
    if (!confirm('确定要初始化数据库吗？这将清除所有现有数据！')) {
      return
    }

    setIsInitializing(true)
    try {
      const response = await fetch('/api/init-db', { method: 'POST' })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || '初始化失败')

      toast({
        title: '初始化成功',
        description: `数据库已重置并创建基础数据`,
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

  // 创建测试数据
  const handleCreateTestData = async () => {
    setIsCreatingData(true)
    try {
      const res = await fetch('/api/test-data', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || '创建测试数据失败')

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

  // 测试博客功能
  const handleTestBlog = async () => {
    setIsTesting(true)
    const startTime = performance.now()

    try {
      // 测试逻辑参考原有的 TestBlogPage
      const listStartTime = performance.now()
      const postsRes = await fetch('/api/posts')
      const posts = await postsRes.json()
      const listEndTime = performance.now()

      if (!posts.data?.length) {
        throw new Error('无法获取文章列表')
      }

      // 测试单篇文章内容
      const contentStartTime = performance.now()
      const postRes = await fetch(`/api/posts/${posts.data[0].slug}`)
      const post = await postRes.json()
      const contentEndTime = performance.now()

      if (!post.data?.content) {
        throw new Error('无法获取文章内容')
      }

      const endTime = performance.now()

      // 设置测试结果
      setTestResults({
        posts: posts.data.length,
        content: true,
        responseTime: Math.round(listEndTime - listStartTime),
        firstPost: posts.data[0],
        markdownTest: post.data.content.includes('#'),
        performance: {
          apiResponseTime: listEndTime - listStartTime + (contentEndTime - contentStartTime),
          renderTime: endTime - contentEndTime,
          totalTime: endTime - startTime,
          markdownParseTime: contentEndTime - contentStartTime,
        },
      })

      toast({
        title: '测试成功',
        description: `总耗时: ${Math.round(endTime - startTime)}ms`,
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
    <div className='container py-10 space-y-8'>
      <Card className='p-6'>
        <h1 className='text-2xl font-bold mb-6'>博客系统测试面板</h1>

        {/* 操作按钮 */}
        <div className='space-y-6'>
          <div className='flex flex-wrap gap-4'>
            <Button onClick={handleInitDb} disabled={isInitializing} variant='destructive'>
              {isInitializing ? '初始化中...' : '初始化数据库'}
            </Button>

            <Button onClick={handleCreateTestData} disabled={isCreatingData} variant='secondary'>
              {isCreatingData ? '创建中...' : '创建测试数据'}
            </Button>

            <Button onClick={handleTestBlog} disabled={isTesting}>
              {isTesting ? '测试中...' : '测试博客功能'}
            </Button>

            <Button onClick={() => router.push('/blog')} variant='outline'>
              查看博客页面
            </Button>
          </div>

          {/* 测试结果展示 */}
          {Object.keys(testResults).length > 0 && (
            <div className='mt-6 space-y-4'>
              <h2 className='text-xl font-semibold'>测试结果</h2>
              <div className='space-y-2'>
                <p>
                  文章列表: {testResults.posts ? '✅' : '❌'} (共 {testResults.posts} 篇)
                </p>
                <p>文章内容: {testResults.content ? '✅' : '❌'}</p>
                <p>Markdown 渲染: {testResults.markdownTest ? '✅' : '❌'}</p>

                {testResults.firstPost && (
                  <div className='mt-4'>
                    <h3 className='font-medium'>详细信息:</h3>
                    <p>文章标题: {testResults.firstPost.title}</p>
                    <p>标签数量: {testResults.firstPost.tags?.length || 0}</p>
                  </div>
                )}

                {testResults.performance && (
                  <div className='mt-4'>
                    <h3 className='font-medium'>性能指标:</h3>
                    <p>API响应时间: {Math.round(testResults.performance.apiResponseTime)}ms</p>
                    <p>渲染时间: {Math.round(testResults.performance.renderTime)}ms</p>
                    <p>
                      Markdown解析: {Math.round(testResults.performance.markdownParseTime || 0)}ms
                    </p>
                    <p>总耗时: {Math.round(testResults.performance.totalTime)}ms</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
