'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { HiPencil, HiPlus } from 'react-icons/hi'
import { postService } from '@/lib/services/post'

export default function PostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getPosts()
        setPosts(data)
      } catch (error) {
        console.error('获取文章列表失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className='container mx-auto space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>所有文章</h1>
        <Button onClick={() => router.push('/admin/write/new')}>
          <HiPlus className='w-4 h-4 mr-1' />
          新建文章
        </Button>
      </div>

      {loading ? (
        <div>加载中...</div>
      ) : (
        <div className='grid gap-4'>
          {posts.map((post) => (
            <div key={post.id} className='flex justify-between items-center p-4 border rounded-lg'>
              <div>
                <h2 className='font-semibold'>{post.title}</h2>
                <p className='text-sm text-gray-500'>
                  {new Date(post.created_at).toLocaleDateString()}
                  {' · '}
                  {post.status === 'published' ? '已发布' : '草稿'}
                </p>
              </div>
              <Button variant='outline' onClick={() => router.push(`/admin/posts/${post.id}/edit`)}>
                <HiPencil className='w-4 h-4 mr-1' />
                编辑
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
