'use client'

import { useState, useEffect } from 'react'
import type { BlogPost } from '@/types'

interface UsePostReturn {
  post: BlogPost | null
  isLoading: boolean
  error: string | null
  updatePost: (content: string, metadata: PostFormData) => Promise<any>
}

export function usePost(slug?: string): UsePostReturn {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setIsLoading(false)
      return
    }

    const fetchPost = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/posts/${slug}`)
        if (!response.ok) throw new Error('Failed to fetch post')
        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  const updatePost = async (content: string, metadata: PostFormData) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, metadata })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '保存失败')
      }

      return response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { post, isLoading, error, updatePost }
} 