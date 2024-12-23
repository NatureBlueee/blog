'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { BlogPost } from '@/types'

interface LatestPostsProps {
  posts: BlogPost[]
}

export default function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.slice(0, 6).map((post: BlogPost, index) => (
        <motion.article
          key={post.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          <Link href={`/blog/${post.slug}`}>
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>{post.category}</span>
                <span>•</span>
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3">
                {post.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  )
}