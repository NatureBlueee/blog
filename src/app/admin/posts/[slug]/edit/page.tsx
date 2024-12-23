'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { PostStatusToggle } from '@/components/admin/PostStatusToggle'
import { BlogEditor } from '@/components/blog/BlogEditor'
import type { BlogPost } from '@/types'

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.slug}`)
        if (!response.ok) throw new Error('文章获取失败')
        const data = await response.json()
        setPost(data)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: '错误',
          description: error instanceof Error ? error.message : '文章获取失败',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

  const handleUpdatePost = async (content: string) => {
    try {
      if (!post) throw new Error('文章不存在')

      const response = await fetch(`/api/posts/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          title: post.title,
          excerpt: post.excerpt,
          tags: post.tags,
          status: post.status,
          metadata: post.metadata,
          updated_at: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '更新失败')
      }

      const updatedPost = await response.json()
      setPost(updatedPost)

      toast({
        title: '成功',
        description: '文章已更新',
      })
    } catch (error) {
      console.error('更新文章失败:', error)
      toast({
        variant: 'destructive',
        title: '错误',
        description: error instanceof Error ? error.message : '更新失败',
      })
      throw error
    }
  }

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (!post) {
    return <div>文章不存在</div>
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>{post.title}</h1>
        <PostStatusToggle
          postId={post.id}
          slug={post.slug}
          initialStatus={post.status}
          onStatusChange={async (newStatus) => {
            try {
              const updatedPost = await updatePost({ status: newStatus })
              setPost(updatedPost)
            } catch (error) {
              console.error('更新状态失败:', error)
            }
          }}
        />
      </div>

      <BlogEditor
        initialContent={post.content}
        onSubmitAction={handleUpdatePost}
        isEditing={true}
        post={post}
      />
    </div>
  )
}
