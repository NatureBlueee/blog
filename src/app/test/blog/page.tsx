'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

export default function TestBlogPage() {
  const [loading, setLoading] = useState(false)

  const handleTest = async (testType: string) => {
    setLoading(true)
    try {
      let response
      switch (testType) {
        case 'posts':
          response = await fetch('/api/posts')
          break
        case 'popular':
          response = await fetch('/api/posts/popular')
          break
        case 'tags':
          response = await fetch('/api/tags')
          break
        default:
          throw new Error('未知的测试类型')
      }

      const data = await response.json()

      toast({
        title: '测试成功',
        description: (
          <pre className='mt-2 w-full rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '测试失败',
        description: error instanceof Error ? error.message : '未知错误',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container py-8'>
      <h1 className='text-2xl font-bold mb-6'>博客功能测试</h1>

      <div className='space-y-4'>
        <div className='p-4 border rounded-lg'>
          <h2 className='text-xl font-semibold mb-4'>API 测试</h2>
          <div className='flex gap-4'>
            <Button onClick={() => handleTest('posts')} disabled={loading}>
              测试文章列表
            </Button>
            <Button onClick={() => handleTest('popular')} disabled={loading}>
              测试热门文章
            </Button>
            <Button onClick={() => handleTest('tags')} disabled={loading}>
              测试标签列表
            </Button>
          </div>
        </div>

        <div className='p-4 border rounded-lg'>
          <h2 className='text-xl font-semibold mb-4'>页面测试</h2>
          <div className='flex gap-4'>
            <Button asChild>
              <a href='/blog' target='_blank'>
                访问博客首页
              </a>
            </Button>
            <Button asChild variant='outline'>
              <a href='/blog/test-post-1' target='_blank'>
                访问测试文章
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
