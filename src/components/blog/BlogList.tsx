'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/types'

interface BlogListProps {
  posts: Post[]
}

export function BlogList({ posts = [] }: BlogListProps) {
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  // 获取所有唯一的标签
  const allTags = Array.from(
    new Set(
      posts.flatMap((post) => post.tags?.map((t) => ({ id: t.tag.id, name: t.tag.name })) || [])
    )
  )

  // 过滤逻辑
  const filteredPosts = posts?.filter((post) => {
    const matchesTag = !selectedTag || post.tags?.some((t) => t.tag.id === selectedTag)
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTag && matchesSearch
  })

  return (
    <div className='space-y-8'>
      {/* 筛选控件 */}
      <div className='flex gap-4 flex-wrap'>
        <input
          type='text'
          placeholder='搜索文章...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='px-4 py-2 border rounded-lg'
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className='px-4 py-2 border rounded-lg'
        >
          <option value=''>所有标签</option>
          {allTags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      {/* 文章列表 */}
      <div className='grid gap-8'>
        {filteredPosts?.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className='block transition-transform hover:scale-[1.02]'
          >
            <article className='p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow'>
              <h2 className='text-2xl font-bold mb-2 text-gray-900 hover:text-blue-600'>
                {post.title}
              </h2>
              <div className='text-sm text-gray-500 mb-3'>
                {new Date(post.created_at).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <p className='text-gray-600 mb-4'>{post.excerpt}</p>
              {post.tags && (
                <div className='flex gap-2'>
                  {post.tags.map((tag) => (
                    <span
                      key={tag.tag.id}
                      className='px-2 py-1 bg-gray-100 rounded-full text-sm'
                      onClick={(e) => e.preventDefault()} // 防止标签点击触发卡片跳转
                    >
                      {tag.tag.name}
                    </span>
                  ))}
                </div>
              )}
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}
