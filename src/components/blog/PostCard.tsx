import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  post: {
    slug: string
    title: string
    excerpt: string
    created_at: string
    author?: {
      name: string
      avatar: string
    }
    category?: string
    tags?: string[]
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className='group block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900'
    >
      <div className='p-6'>
        {post.category && (
          <span className='inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100'>
            {post.category}
          </span>
        )}

        <h2 className='mt-4 text-xl font-semibold text-gray-900 group-hover:text-primary dark:text-gray-100'>
          {post.title}
        </h2>

        <p className='mt-3 text-gray-600 line-clamp-3 dark:text-gray-300'>{post.excerpt}</p>

        <div className='mt-6 flex items-center gap-4'>
          {post.author?.avatar && (
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={40}
              height={40}
              className='rounded-full'
            />
          )}
          <div>
            {post.author?.name && (
              <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                {post.author.name}
              </p>
            )}
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
