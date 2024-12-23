import Link from 'next/link'
import { postService } from '@/lib/services/posts'
import { PostCard } from '@/components/blog/PostCard'

export default async function HomePage() {
  // 获取最新的3篇文章
  const latestPosts = (await postService.getPosts({ status: 'published', limit: 3 })) || []

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative h-[70vh] flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-secondary/10 animate-gradient-x' />
        <div className='relative z-10 text-center space-y-6 max-w-3xl mx-auto px-4'>
          <h1 className='text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-text'>
            探索思维的边界
          </h1>
          <p className='text-xl text-muted-foreground'>
            在这里，我们一起探讨技术、哲学与生活的交织
          </p>
          <div className='flex gap-4 justify-center'>
            <Link
              href='/blog'
              className='px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
            >
              开始阅读
            </Link>
            <Link
              href='/about'
              className='px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors'
            >
              了解更多
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className='container py-16'>
        <h2 className='text-3xl font-bold text-center mb-12'>最新文章</h2>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        {latestPosts.length > 0 && (
          <div className='text-center mt-12'>
            <Link
              href='/blog'
              className='inline-flex items-center text-primary hover:text-primary/90 transition-colors'
            >
              浏览更多文章
              <svg className='ml-2 h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
