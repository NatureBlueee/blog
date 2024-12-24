'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

interface PerformanceMetrics {
  apiResponseTime: number
  renderTime: number
  totalTime: number
  markdownParseTime?: number
}

interface TestResult {
  posts?: number
  content?: boolean
  responseTime?: number
  firstPost?: {
    title: string
    excerpt: string
    tags: Array<{ tag: { name: string } }>
    created_at: string
  }
  markdownTest?: boolean
  performance?: PerformanceMetrics
}

export default function TestBlogPage() {
  const router = useRouter()
  const [creatingData, setCreatingData] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResults, setTestResults] = useState<TestResult>({})

  const handleCreateTestData = async () => {
    setCreatingData(true)
    try {
      const res = await fetch('/api/test-data', {
        method: 'POST',
      })
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
      setCreatingData(false)
    }
  }

  const handleTestBlog = async () => {
    setTesting(true)
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

      setTestResults({
        posts: posts.data.length,
        content: true,
        responseTime: Math.round(performanceMetrics.apiResponseTime),
        firstPost: posts.data[0],
        markdownTest: post.data.content.includes('#'),
        performance: performanceMetrics,
      })

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
      setTesting(false)
    }
  }

  return (
    <div className='container py-10 space-y-8'>
      <Card className='p-6'>
        <h2 className='text-2xl font-bold mb-4'>博客功能测试</h2>
        <div className='space-y-4'>
          <div className='flex gap-4'>
            <Button onClick={handleCreateTestData} disabled={creatingData} variant='secondary'>
              {creatingData ? '创建中...' : '创建测试数据'}
            </Button>

            <Button onClick={handleTestBlog} disabled={testing}>
              {testing ? '测试中...' : '测试博客功能'}
            </Button>

            <Button onClick={() => router.push('/blog')} variant='outline'>
              查看博客页面
            </Button>
          </div>

          {/* 显示测试结果 */}
          {Object.keys(testResults).length > 0 && (
            <div className='mt-4 space-y-2'>
              <h3 className='text-lg font-semibold'>测试结果：</h3>
              <div className='space-y-2'>
                <p>
                  文章列表: {testResults.posts ? '✅' : '❌'} (共 {testResults.posts} 篇)
                </p>
                <p>文章内容: {testResults.content ? '✅' : '❌'}</p>
                <p>Markdown 渲染: {testResults.markdownTest ? '✅' : '❌'}</p>

                {testResults.firstPost && (
                  <div className='mt-2'>
                    <p className='font-medium'>详细信息:</p>
                    <p>文章标题: {testResults.firstPost.title}</p>
                    <p>标签数量: {testResults.firstPost.tags.length}</p>
                  </div>
                )}

                {testResults.performance && (
                  <div className='mt-2'>
                    <p className='font-medium'>性能指标:</p>
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
