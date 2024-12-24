'use client'

import Link from 'next/link'
import type { Post } from '@/types'
import { usePosts } from '@/hooks/usePosts'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const { invalidatePosts } = usePosts()

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.slug}/like`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to like post')
      }

      // 触发文章列表重新获取
      invalidatePosts()
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  return (
    <Link href={`/blog/${post.slug}`} className='block group'>
      <article className='bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
        <div className='p-6'>
          <h2 className='text-2xl font-bold mb-2 group-hover:text-primary transition-colors'>
            {post.title}
          </h2>
          <p className='text-muted-foreground mb-4'>
            {post.excerpt || post.content.substring(0, 150)}...
          </p>
          <div className='flex justify-between items-center text-sm text-muted-foreground'>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            <div className='flex items-center gap-4'>
              <span>{post.views || 0} 次阅读</span>
              <span>{post.likes || 0} 喜欢</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
