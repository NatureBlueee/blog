'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useSmartSearch } from '@/hooks/useSmartSearch'
import type { BlogPost } from '@/types'
import Link from 'next/link'

interface SearchBarProps {
  posts: BlogPost[]
}

export default function SearchBar({ posts }: SearchBarProps) {
  const [isSearching, setIsSearching] = useState(false)

  // 使用 useSmartSearch hook
  const {
    query,
    setQuery,
    results: searchResults,
  } = useSmartSearch(posts, ['title', 'excerpt', 'content'], {
    enablePinyin: true,
    threshold: 0.1,
    limit: 10,
  })

  // 添加调试日志
  useEffect(() => {
    if (query) {
      console.log({
        query,
        postsCount: posts?.length,
        resultsCount: searchResults?.length,
        firstResult: searchResults[0],
      })
    }
  }, [query, posts, searchResults])

  return (
    <div className='relative'>
      <div className='relative'>
        <input
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsSearching(true)}
          placeholder='搜索文章...'
          className='w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2'
        />
      </div>

      {isSearching && query && (
        <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg'>
          {searchResults.length > 0 ? (
            <ul className='py-2'>
              {searchResults.map((post) => (
                <li key={post.slug} className='px-4 py-2 hover:bg-gray-100'>
                  <Link href={`/blog/${post.slug}`}>
                    <span className='block font-medium'>{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className='px-4 py-3 text-gray-500'>未找到相关文章</div>
          )}
        </div>
      )}
    </div>
  )
}
