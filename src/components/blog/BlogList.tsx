'use client'

import { useState } from 'react'
import { PostCard } from './PostCard'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Post } from '@/types'

interface BlogListProps {
  initialPosts: Post[]
}

export function BlogList({ initialPosts }: BlogListProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [sortBy, setSortBy] = useState('latest')
  const [page, setPage] = useState(1)
  const postsPerPage = 9

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    if (sortBy === 'popular') {
      return (b.views || 0) - (a.views || 0)
    }
    return 0
  })

  const paginatedPosts = sortedPosts.slice(0, page * postsPerPage)
  const hasMore = paginatedPosts.length < sortedPosts.length

  return (
    <div className='space-y-8'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>所有文章</h2>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='排序方式' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='latest'>最新发布</SelectItem>
            <SelectItem value='popular'>最多浏览</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {paginatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className='text-center'>
          <Button variant='outline' onClick={() => setPage((p) => p + 1)}>
            加载更多
          </Button>
        </div>
      )}
    </div>
  )
}
