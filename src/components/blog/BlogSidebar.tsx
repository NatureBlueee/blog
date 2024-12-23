'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiTag } from 'react-icons/hi'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface Tag {
  id: string
  name: string
  slug: string
  post_count?: number
}

export function BlogSidebar() {
  const [tags, setTags] = useState<Tag[]>([])
  const [popularPosts, setPopularPosts] = useState<
    Array<{ id: string; title: string; slug: string; views: number }>
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // 获取标签列表
        const tagsRes = await fetch('/api/tags')
        const tagsData = await tagsRes.json()

        // 获取热门文章
        const popularRes = await fetch('/api/posts/popular?limit=5')
        const popularData = await popularRes.json()

        setTags(tagsData)
        setPopularPosts(popularData)
      } catch (err) {
        console.error('加载侧边栏数据失败:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <Skeleton className='h-[600px]' />
  }

  return (
    <div className='space-y-8'>
      {/* 热门文章 */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4'>热门文章</h3>
        <div className='space-y-4'>
          {popularPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className='flex items-start gap-3 group'
            >
              <span className='text-2xl font-bold text-muted-foreground/50'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className='text-sm group-hover:text-primary transition-colors'>
                {post.title}
              </span>
            </Link>
          ))}
        </div>
      </Card>

      {/* 标签云 */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4'>标签</h3>
        <div className='flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/blog/tags/${tag.slug}`}
              className='inline-flex items-center px-3 py-1 rounded-full bg-secondary/50 hover:bg-secondary text-sm transition-colors'
            >
              <HiTag className='w-4 h-4 mr-1' />
              {tag.name}
              {tag.post_count && (
                <span className='ml-1 text-xs text-muted-foreground'>({tag.post_count})</span>
              )}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
