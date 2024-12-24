'use client'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { BlogPost } from '@/types'

export function usePosts(includeAll = false) {
  return useQuery<BlogPost[]>({
    queryKey: ['posts', includeAll],
    queryFn: async () => {
      const res = await fetch(`/api/posts${includeAll ? '/all' : ''}`, {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      })
      if (!res.ok) throw new Error('获取文章列表失败')
      const { data } = await res.json()
      return includeAll ? data : data.filter((post) => post.status === 'published')
    },
    staleTime: includeAll ? 0 : 1000 * 60, // 管理后台不缓存，前台缓存1分钟
  })
}
