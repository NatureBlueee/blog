import Link from 'next/link'
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts'
import { BlogCategory, BlogTag } from '@/types'

export default async function BlogPage() {
  const [posts, categories, tags] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
    getAllTags()
  ])

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* 分类导航 */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">分类浏览</h2>
          <Link href="/blog/categories" className="text-primary hover:underline">
            查看全部 →
          </Link>
        </div>
        <div className="flex flex-wrap gap-4">
          {categories.map((category: BlogCategory) => (
            <Link
              key={category.slug}
              href={`/blog/category/${category.slug}`}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              {category.name} ({category.count})
            </Link>
          ))}
        </div>
      </div>

      {/* 标签云 */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">热门标签</h2>
          <Link href="/blog/tags" className="text-primary hover:underline">
            查看全部 →
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {tags.slice(0, 15).map((tag: BlogTag) => (
            <Link
              key={tag.slug}
              href={`/blog/tag/${tag.slug}`}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 文章列表 */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <Link href={`/blog/${post.slug}`}>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
} 