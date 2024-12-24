'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { postService } from '@/lib/services/post'
import { PostCard } from '@/components/blog/PostCard'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  // 获取最新的6篇文章
  const { data: posts } = useQuery({
    queryKey: ['featured-posts'],
    queryFn: () => postService.getPosts({ status: 'published', limit: 6 }),
    staleTime: 1000 * 60 * 5,
  })

  const featuredPosts = posts?.slice(0, 3)
  const recentPosts = posts?.slice(3, 6)

  return (
    <div className='min-h-screen'>
      {/* Hero Section - 改进视觉效果 */}
      <section className='relative h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-primary/5'>
        <div className='absolute inset-0 bg-grid-pattern opacity-5' />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4'
        >
          <h1 className='text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-text tracking-tight'>
            探索思维的边界
          </h1>
          <p className='text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto'>
            在这里，我们一起探讨技术、哲学与生活的交织
          </p>
          <div className='flex gap-6 justify-center'>
            <Button size='lg' asChild>
              <Link href='/blog' className='text-lg'>
                开始阅读
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </Button>
            <Button size='lg' variant='outline' asChild>
              <Link href='/about' className='text-lg'>
                了解更多
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Featured Posts Section */}
      <section className='container py-20 space-y-16'>
        {/* 精选文章 */}
        <div className='space-y-8'>
          <div className='flex items-center justify-between'>
            <h2 className='text-3xl font-bold'>精选文章</h2>
            <Button variant='ghost' asChild>
              <Link href='/blog' className='group'>
                查看全部
                <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Link>
            </Button>
          </div>
          <div className='grid gap-8 md:grid-cols-3'>
            {featuredPosts?.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <PostCard post={post} featured />
              </motion.div>
            ))}
          </div>
        </div>

        {/* 最新文章 */}
        <div className='space-y-8'>
          <div className='flex items-center justify-between'>
            <h2 className='text-3xl font-bold'>最新发布</h2>
          </div>
          <div className='grid gap-6 md:grid-cols-3'>
            {recentPosts?.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
