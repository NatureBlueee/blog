import Link from 'next/link'
import { motion } from 'framer-motion'
import PageLayout from '@/components/layout/PageLayout'
import { getAllCategories } from '@/lib/category'
import type { BlogCategory } from '@/types'

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          文章分类
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category: BlogCategory, index: number) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/blog/category/${category.slug}`}
                className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <h2 className="text-2xl font-semibold mb-2">
                  {category.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {category.description || `${category.name}分类下的所有文章`}
                </p>
                <span className="text-primary">
                  {category.count} 篇文章 →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
} 