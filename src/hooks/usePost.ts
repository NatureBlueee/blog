'use client'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { BlogPost } from '@/types'

export function usePost(slug: string) {
  return useQuery<BlogPost>({
    queryKey: ['post', slug],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${slug}`)
      if (!res.ok) throw new Error('获取文章失败')
      const data = await res.json()
      return data.data
    },
    onError: (error) => {
      toast.error('获取文章失败', {
        description: error instanceof Error ? error.message : '未知错误',
      })
    },
  })
}
