import { BlogPost } from '@/types'

interface PostHeaderProps {
  post: BlogPost
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className='space-y-8 mb-12'>
      <div className='space-y-4'>
        <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>{post.title}</h1>
        {post.excerpt && <p className='text-xl text-muted-foreground'>{post.excerpt}</p>}
      </div>
      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
        <time dateTime={post.created_at}>
          {new Date(post.created_at).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <span>·</span>
        <span>{post.views} 次阅读</span>
        {post.category && (
          <>
            <span>·</span>
            <span>{post.category}</span>
          </>
        )}
      </div>
    </header>
  )
}
