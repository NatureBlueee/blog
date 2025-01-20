import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiPencil, HiEye, HiCalendar, HiTag } from 'react-icons/hi'
import { formatDate } from '@/utils/date'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { postService } from '@/lib/services/post'
import type { Post } from '@/types'

export default function RecentPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRecentPosts()
  }, [])

  const fetchRecentPosts = async () => {
    try {
      setIsLoading(true)
      const data = await postService.getPosts({
        limit: 5,
        orderBy: {
          column: 'created_at',
          order: 'desc',
        },
        withAuthor: true,
        withTags: true,
      })
      setPosts(data)
    } catch (error) {
      console.error('获取最近文章失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>最近文章</h2>
        <div className='space-y-4'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='flex flex-col space-y-3'>
              <Skeleton className='h-6 w-3/4' />
              <Skeleton className='h-4 w-1/4' />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold'>最近文章</h2>
        <Link href='/admin/posts/new' className='text-sm text-primary hover:text-primary/80'>
          写新文章
        </Link>
      </div>
      <div className='space-y-4'>
        {posts.map((post) => (
          <div
            key={post.id}
            className='group p-4 rounded-lg border bg-card hover:bg-accent transition-colors'
          >
            <div className='flex items-start justify-between'>
              <div className='flex-1 min-w-0 space-y-1'>
                <Link
                  href={`/admin/posts/${post.slug}`}
                  className='font-medium hover:text-primary truncate block'
                >
                  {post.title}
                </Link>
                {post.excerpt && (
                  <p className='text-sm text-muted-foreground line-clamp-2'>{post.excerpt}</p>
                )}
                <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                  <span className='flex items-center gap-1'>
                    <HiCalendar className='w-4 h-4' />
                    {formatDate(post.created_at)}
                  </span>
                  <span className='flex items-center gap-1'>
                    <HiEye className='w-4 h-4' />
                    {post.views || 0} 次浏览
                  </span>
                  {post.author && (
                    <span className='text-xs text-muted-foreground'>作者: {post.author.email}</span>
                  )}
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className='flex items-center gap-2 mt-2'>
                    <HiTag className='w-4 h-4 text-muted-foreground' />
                    <div className='flex gap-1'>
                      {post.tags.map(({ tag }) => (
                        <Badge key={tag.id} variant='secondary'>
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className='flex items-center gap-2 ml-4'>
                <Badge variant={post.status === 'published' ? 'success' : 'warning'}>
                  {post.status === 'published' ? '已发布' : '草稿'}
                </Badge>
                <Link
                  href={`/admin/posts/${post.slug}`}
                  className='p-2 hover:text-primary rounded-full hover:bg-accent'
                >
                  <HiPencil className='w-4 h-4' />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
