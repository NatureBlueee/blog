'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiPlus, HiSearch, HiOutlineExclamationCircle } from 'react-icons/hi'
import { useToast } from '@/components/ui/use-toast'
import PostList from '@/components/admin/PostList'
import PageLayout from '@/components/layout/PageLayout'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert } from '@/components/ui/alert'
import { postService } from '@/lib/services/post'
import type { Post } from '@/types'

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await postService.getPosts()
      setPosts(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取文章列表失败'
      setError(message)
      toast({
        variant: 'destructive',
        title: '错误',
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
      post.tags?.some((tag) => tag.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <PageLayout>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>文章管理</h1>
          <div className='flex gap-4'>
            <div className='relative'>
              <HiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='搜索文章...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-10 pr-4 py-2 border rounded-lg'
              />
            </div>
            <Link
              href='/admin/posts/new'
              className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90'
            >
              <HiPlus className='w-5 h-5' />
              新建文章
            </Link>
          </div>
        </div>

        {error && (
          <Alert variant='destructive'>
            <HiOutlineExclamationCircle className='h-4 w-4' />
            <span>{error}</span>
          </Alert>
        )}

        {isLoading ? (
          <div className='space-y-4'>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
          </div>
        ) : (
          <PostList posts={filteredPosts} onRefresh={fetchPosts} />
        )}
      </div>
    </PageLayout>
  )
}
