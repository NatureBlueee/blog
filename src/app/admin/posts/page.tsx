'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HiPlus, HiSearch } from 'react-icons/hi'
import PostList from '@/components/admin/PostList'
import PageLayout from '@/components/layout/PageLayout'

export default function AdminPostsPage() {
  const [search, setSearch] = useState('')
  
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
            <Link 
              href="/admin/posts/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <HiPlus className="w-5 h-5" />
              新建文章
            </Link>
          </div>
        </div>
        <PostList />
      </div>
    </PageLayout>
  )
} 