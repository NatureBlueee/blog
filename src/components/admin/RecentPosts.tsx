import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiPencil, HiEye } from 'react-icons/hi'
import { formatDate } from '@/utils/date'

interface Post {
  id: string
  title: string
  excerpt: string
  createdAt: string
  views: number
}

export default function RecentPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRecentPosts()
  }, [])

  const fetchRecentPosts = async () => {
    try {
      const response = await fetch('/api/posts/recent')
      if (!response.ok) throw new Error('获取最近文章失败')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('获取最近文章失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">最近文章</h2>
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
      <h2 className="text-lg font-medium mb-4">最近文章</h2>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <Link 
                href={`/admin/posts/edit/${post.id}`}
                className="text-sm font-medium hover:text-primary truncate block"
              >
                {post.title}
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(post.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="flex items-center text-sm text-gray-500">
                <HiEye className="w-4 h-4 mr-1" />
                {post.views}
              </span>
              <Link
                href={`/admin/posts/edit/${post.id}`}
                className="p-1 hover:text-primary"
              >
                <HiPencil className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 