'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Post, PostFormData } from '@/types'
import { useToast } from '@/components/ui/use-toast'

interface UpdatePostData {
  content: string
  status?: 'draft' | 'published'
}

export function usePost(slug: string) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const updatePost = useCallback(
    async (data: Partial<Post>) => {
      try {
        const response = await fetch(`/api/posts/${slug}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '更新失败')
        }

        const updatedPost = await response.json()
        setPost(updatedPost)

        toast({
          title: '保存成功',
          description: data.status === 'published' ? '文章已发布' : '草稿已保存',
        })

        if (data.status === 'published') {
          router.push('/admin/posts')
        }

        return updatedPost
      } catch (err) {
        const message = err instanceof Error ? err.message : '更新失败'
        setError(message)
        toast({
          title: '保存失败',
          description: message,
          variant: 'destructive',
        })
        throw err
      }
    },
    [slug, router, toast]
  )

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${slug}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '获取文章失败')
        }
        const data = await response.json()
        setPost(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : '获取文章失败'
        setError(message)
        toast({
          title: '加载失败',
          description: message,
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [slug, toast])

  return {
    post,
    isLoading,
    error,
    updatePost,
  }
}
