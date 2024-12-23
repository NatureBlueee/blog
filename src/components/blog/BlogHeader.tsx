import Image from 'next/image'
import type { BlogPost } from '@/types'

interface BlogHeaderProps {
  post: BlogPost
}

export default function BlogHeader({ post }: BlogHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="text-4xl font-bold mb-4">
        {post.title}
      </h1>
      
      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <span>{post.author.name}</span>
        </div>
        
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        
        {post.readTime && (
          <span>· {post.readTime} 分钟阅读</span>
        )}
      </div>
    </div>
  )
} 