'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export function PostsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const category = searchParams.get('category') || 'all'
  
  const handleSearch = (value: string) => {
    setSearch(value)
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set('search', value)
      } else {
        params.delete('search')
      }
      params.set('page', '1')
      router.push(`/blog?${params.toString()}`)
    })
  }
  
  const handleCategoryChange = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (value !== 'all') {
        params.set('category', value)
      } else {
        params.delete('category')
      }
      params.set('page', '1')
      router.push(`/blog?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="w-full sm:w-72">
        <input
          type="search"
          placeholder="搜索文章..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <select
        value={category}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="all">所有分类</option>
        <option value="frontend">前端开发</option>
        <option value="backend">后端开发</option>
        <option value="devops">DevOps</option>
        {/* 可以从API获取分类列表 */}
      </select>
    </div>
  )
} 