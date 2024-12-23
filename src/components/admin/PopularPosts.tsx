import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiTrendingUp, HiEye } from 'react-icons/hi'

interface PopularPost {
  id: string
  title: string
  views: number
  trend: number
}

export default function PopularPosts() {
  const [posts, setPosts] = useState<PopularPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPopularPosts()
  }, [])

  const fetchPopularPosts = async () => {
    try {
      const response = await fetch('/api/posts/popular')
      if (!response.ok) throw new Error('获取热门文章失败')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('获取热门文章失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">热门文章</h2>
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium mb-4">热门文章</h2>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="flex items-center justify-between">
            <Link 
              href={`/admin/posts/edit/${post.id}`}
              className="flex-1 text-sm font-medium hover:text-primary truncate"
            >
              {post.title}
            </Link>
            <div className="flex items-center gap-4 ml-4">
              <span className="flex items-center text-sm text-gray-500">
                <HiEye className="w-4 h-4 mr-1" />
                {post.views}
              </span>
              <span className={`flex items-center text-sm ${
                post.trend > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                <HiTrendingUp className={`w-4 h-4 mr-1 ${
                  post.trend < 0 ? 'rotate-180' : ''
                }`} />
                {Math.abs(post.trend)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 