'use client'

import { useState, useMemo } from 'react'
import { PostCard } from './PostCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Post, Tag } from '@/types'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

interface BlogListProps {
  initialPosts: Post[]
  tags: Tag[]
}

type SortOption = 'latest' | 'oldest'

export function BlogList({ initialPosts, tags = [] }: BlogListProps) {
  const [posts] = useState(initialPosts)
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortOption>('latest')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const postsPerPage = 9

  // 使用防抖的搜索查询
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const filteredAndSortedPosts = useMemo(() => {
    let result = posts

    // 使用防抖后的搜索查询
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase()
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.tag.name.toLowerCase().includes(query))
      )
    }

    // 标签过滤
    if (selectedTag) {
      result = result.filter((post) => post.tags?.some((tag) => tag.tag.slug === selectedTag))
    }

    // 排序
    return [...result].sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()
      return sortBy === 'latest' ? dateB - dateA : dateA - dateB
    })
  }, [posts, selectedTag, sortBy, debouncedSearchQuery])

  // 计算当前页应显示的文章
  const displayedPosts = useMemo(() => {
    return filteredAndSortedPosts.slice(0, page * postsPerPage)
  }, [filteredAndSortedPosts, page])

  // 检查是否还有更多文章
  const hasMore = filteredAndSortedPosts.length > page * postsPerPage

  return (
    <div className='space-y-6'>
      {/* 搜索和过滤控件 */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
          <Input
            type='search'
            placeholder='搜索文章标题、内容或标签...'
            className='pl-10'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1) // 重置页码
            }}
          />
        </div>

        <Button
          variant='outline'
          onClick={() => setSortBy(sortBy === 'latest' ? 'oldest' : 'latest')}
        >
          {sortBy === 'latest' ? '最新发布' : '最早发布'}
        </Button>
      </div>

      {/* 标签过滤 */}
      <div className='flex flex-wrap gap-2'>
        <Badge
          variant={!selectedTag ? 'default' : 'outline'}
          className='cursor-pointer'
          onClick={() => setSelectedTag('')}
        >
          全部
        </Badge>
        {tags.map((tag) => (
          <Badge
            key={tag.slug}
            variant={selectedTag === tag.slug ? 'default' : 'outline'}
            className='cursor-pointer'
            onClick={() => setSelectedTag(tag.slug)}
          >
            {tag.name}
          </Badge>
        ))}
      </div>

      {/* 搜索结果统计 */}
      {searchQuery && (
        <p className='text-sm text-gray-500'>找到 {filteredAndSortedPosts.length} 篇相关文章</p>
      )}

      {/* 文章列表 */}
      {filteredAndSortedPosts.length === 0 ? (
        <div className='text-center py-10 bg-gray-50 rounded-lg'>
          <p className='text-gray-500'>暂无相关文章</p>
        </div>
      ) : (
        <>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {displayedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {hasMore && (
            <div className='text-center'>
              <Button variant='outline' onClick={() => setPage((p) => p + 1)}>
                加载更多
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
