import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { HiCalendar, HiEye, HiTag } from 'react-icons/hi'
import Link from 'next/link'
import type { Post } from '@/types'

interface PostHeaderProps {
  post: Post
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className='mb-8'>
      <h1 className='text-4xl font-bold mb-4'>{post.title}</h1>

      <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
        <div className='flex items-center gap-1'>
          <HiCalendar className='w-4 h-4' />
          <time dateTime={post.created_at}>
            {format(new Date(post.created_at), 'PPP', { locale: zhCN })}
          </time>
        </div>

        <div className='flex items-center gap-1'>
          <HiEye className='w-4 h-4' />
          <span>{post.views || 0} 次阅读</span>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className='flex items-center gap-2'>
            <HiTag className='w-4 h-4' />
            <div className='flex gap-2'>
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog/tags/${tag.slug}`}
                  className='hover:text-primary transition-colors'
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
