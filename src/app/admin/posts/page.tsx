'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiPlus, HiSearch, HiFilter } from 'react-icons/hi'
import PostList from '@/components/admin/PostList'
import PageLayout from '@/components/layout/PageLayout'

export default function AdminPostsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // ... 搜索和筛选逻辑
  
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">文章管理</h1>
          <div className="flex gap-4">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索文章..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            {/* 添加分类和状态筛选 */}
          </div>
        </div>
        <PostList posts={posts} />
      </div>
    </PageLayout>
  )
} 