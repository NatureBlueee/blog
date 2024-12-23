'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { BlogPost } from '@/types/blog'

interface SearchBarProps {
  posts: BlogPost[]
}

export default function SearchBar({ posts }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<BlogPost[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(query)
      const excerptMatch = post.excerpt.toLowerCase().includes(query)
      const categoryMatch = post.category.toLowerCase().includes(query)
      const tagsMatch = post.tags.some((tag) => tag.toLowerCase().includes(query))
      return titleMatch || excerptMatch || categoryMatch || tagsMatch
    })

    setSearchResults(results)
  }, [searchQuery, posts])

  return (
    <div className="relative">
      {/* 搜索输入框 */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearching(true)}
          placeholder="搜索文章..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      {/* 搜索结果 */}
      <AnimatePresence>
        {isSearching && searchQuery.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-auto z-50"
          >
            {searchResults.length > 0 ? (
              <div className="p-2">
                {searchResults.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    onClick={() => setIsSearching(false)}
                    className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{post.category}</span>
                      <span>•</span>
                      <time>
                        {new Date(post.date).toLocaleDateString('zh-CN')}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                未找到相关文章
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 点击空白处关闭搜索结果 */}
      {isSearching && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSearching(false)}
        />
      )}
    </div>
  )
} 