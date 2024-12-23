import Link from 'next/link'
import { motion } from 'framer-motion'
import PageLayout from '@/components/layout/PageLayout'
import { getAllTags } from '@/lib/tag'
import type { BlogTag } from '@/types'

export default async function TagsPage() {
  const tags = await getAllTags()

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          文章标签
        </h1>

        <div className="flex flex-wrap gap-4">
          {tags.map((tag: BlogTag, index: number) => (
            <motion.div
              key={tag.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/blog/tag/${tag.slug}`}
                className="inline-block px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <span className="text-lg font-medium">
                  {tag.name}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({tag.count})
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
} 