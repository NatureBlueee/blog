import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { BlogPost } from '@/types'

const POSTS_QUERY_KEY = ['posts']

export function usePosts() {
  const queryClient = useQueryClient()

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: async () => {
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
      const host = window.location.host
      const baseUrl = `${protocol}://${host}`
      const response = await fetch(`${baseUrl}/api/posts`)
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      return data.data
    },
  })

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY })
  }

  return {
    posts,
    isLoading,
    error,
    invalidatePosts,
  }
}
