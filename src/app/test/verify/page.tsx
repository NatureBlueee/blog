'use client'

import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface Stats {
  total: number
  published: number
  draft: number
}

interface Post {
  id: string
  title: string
  slug: string
  status: 'published' | 'draft'
  views: number
  createdAt: string
  content: string
  excerpt: string
  metadata: {
    seo_title?: string
    seo_description?: string
  }
}

export default function VerifyPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // 获取统计数据
        const statsRes = await fetch('/api/posts/stats')
        const statsData = await statsRes.json()

        // 获取所有文章
        const postsRes = await fetch('/api/posts')
        const postsData = await postsRes.json()

        setStats(statsData)
        setPosts(postsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : '数据加载失败')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 格式化日期
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '无日期'

    try {
      const date = parseISO(dateString)
      return format(date, 'yyyy年MM月dd日 HH:mm:ss', { locale: zhCN })
    } catch (err) {
      console.error('日期格式化错误:', err, dateString)
      return '无效日期'
    }
  }

  if (loading) return <div className='p-8'>加载中...</div>
  if (error) return <div className='p-8 text-red-500'>错误: {error}</div>

  return (
    <div className='p-8 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>测试数据验证</h1>

      {/* 统计信息 */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-4'>文章统计</h2>
        <div className='grid grid-cols-3 gap-4'>
          <div className='p-4 bg-blue-100 rounded'>
            <div className='text-2xl font-bold'>{stats?.total || 0}</div>
            <div className='text-sm text-gray-600'>总文章数</div>
          </div>
          <div className='p-4 bg-green-100 rounded'>
            <div className='text-2xl font-bold'>{stats?.published || 0}</div>
            <div className='text-sm text-gray-600'>已发布</div>
          </div>
          <div className='p-4 bg-yellow-100 rounded'>
            <div className='text-2xl font-bold'>{stats?.draft || 0}</div>
            <div className='text-sm text-gray-600'>草稿</div>
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      <div>
        <h2 className='text-xl font-semibold mb-4'>文章列表</h2>
        <div className='space-y-4'>
          {posts.map((post) => (
            <div key={post.id} className='p-4 border rounded hover:shadow-md transition-shadow'>
              <div className='flex justify-between items-start'>
                <h3 className='font-semibold text-lg'>{post.title}</h3>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    post.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {post.status === 'published' ? '已发布' : '草稿'}
                </span>
              </div>

              {post.excerpt && <p className='text-gray-600 mt-2 text-sm'>{post.excerpt}</p>}

              <div className='mt-3 text-sm text-gray-500 space-x-4'>
                <span>
                  <span className='font-medium'>浏览:</span> {post.views}
                </span>
                <span>
                  <span className='font-medium'>创建时间:</span> {formatDate(post.createdAt)}
                </span>
                <span>
                  <span className='font-medium'>Slug:</span> {post.slug}
                </span>
              </div>

              {post.metadata && (
                <div className='mt-2 text-sm text-gray-500'>
                  <div>
                    <span className='font-medium'>SEO 标题:</span> {post.metadata.seo_title || '-'}
                  </div>
                  <div>
                    <span className='font-medium'>SEO 描述:</span>{' '}
                    {post.metadata.seo_description || '-'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
