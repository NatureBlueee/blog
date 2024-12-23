import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import dynamic from 'next/dynamic'

const HeroSection = dynamic(() => import('@/components/home/HeroSection'), {
  ssr: true
})

const LatestPosts = dynamic(() => import('@/components/home/LatestPosts'), {
  ssr: true
})

export default async function HomePage() {
  const posts = await getAllPosts()

  return (
    <main className="flex-1">
      <HeroSection />

      {/* Latest Posts Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">最新文章</h2>
            <Link
              href="/blog"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              查看全部 →
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">暂无文章</p>
            </div>
          ) : (
            <LatestPosts posts={posts} />
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">关于我</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              我是一名热爱技术的前端开发者，专注于 React、Next.js 和 TypeScript。
              通过这个博客，我希望能够分享我的学习经验和技术见解。
            </p>
            <Link
              href="/about"
              className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
            >
              了解更多
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
} 