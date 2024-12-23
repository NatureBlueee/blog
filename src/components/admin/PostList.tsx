'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { BlogPost } from '@/types'
import {
  HiEye,
  HiPencil,
  HiTrash,
  HiPlus,
  HiClock,
  HiDocumentDuplicate,
  HiArchive,
  HiCheck,
  HiSearch,
} from 'react-icons/hi'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { PostStatusToggle } from '@/components/admin/PostStatusToggle'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface PostVersion {
  id: string
  version_type: 'auto' | 'manual'
  description: string | null
  created_at: string
}

type PostStatus = 'draft' | 'published'

// 添加日期格式化工具函数
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '未知时间'
  try {
    // 确保日期字符串是有效的
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '无效日期'

    return format(date, 'PPP HH:mm:ss', { locale: zhCN })
  } catch (error) {
    console.error('日期格式化错误:', error)
    return '日期格式错误'
  }
}

export default function PostList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all')
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    views: 0,
  })
  const [selectedPost, setSelectedPost] = useState<
    (BlogPost & { versions?: PostVersion[] }) | null
  >(null)
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      try {
        await Promise.all([fetchPosts(), fetchStats()])
      } catch (error) {
        console.error('初始化数据失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [activeTab])

  const fetchPosts = async () => {
    try {
      const url = '/api/posts' + (activeTab !== 'all' ? `?status=${activeTab}` : '')
      console.log('Fetching posts from:', url)

      const response = await fetch(url)
      console.log('Response status:', response.status)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '获取文章列表失败')
      }

      const data = await response.json()
      console.log('Posts data:', {
        count: data.length,
        sample: data[0],
        allDates: data.map((p) => p.updated_at),
      })

      setPosts(data)
    } catch (error) {
      console.error('获取文章列表失败:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/posts/stats')
      if (!response.ok) throw new Error('获取统计数据失败')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }

  const handleViewVersions = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/posts/${post.slug}/versions`)
      if (!response.ok) throw new Error('获取版本历史失败')

      const versions = await response.json()
      setSelectedPost({ ...post, versions })
      setIsVersionsModalOpen(true)
    } catch (error) {
      console.error('获取版本历史失败:', error)
    }
  }

  const handleRestoreVersion = async (post: BlogPost, versionId: string) => {
    try {
      const response = await fetch(`/api/posts/${post.slug}/versions/${versionId}/restore`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('恢复版本失败')

      const updatedPost = await response.json()
      setPosts(posts.map((p) => (p.slug === post.slug ? { ...p, ...updatedPost } : p)))
      setIsVersionsModalOpen(false)
    } catch (error) {
      console.error('恢复版本失败:', error)
    }
  }

  const handleStatusChange = async (post: BlogPost, newStatus: PostStatus) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/posts/${post.slug}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '更新文章状态失败')
      }

      const updatedPost = await response.json()
      setPosts(posts.map((p) => (p.slug === post.slug ? { ...p, ...updatedPost } : p)))
      toast({
        title: '状态更新成功',
        description: `文章《${post.title}》已${newStatus === 'published' ? '发布' : '设为草稿'}`,
      })

      // 更新统计数据
      await fetchStats()
    } catch (error) {
      console.error('更新文章状态失败:', error)
      toast({
        variant: 'destructive',
        title: '操作失败',
        description: error instanceof Error ? error.message : '更新文章状态失败',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPosts = useMemo(() => {
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [posts, searchQuery])

  const handleSelect = (slug: string) => {
    setSelectedPosts((prev) => {
      const newSelection = new Set(prev)
      if (newSelection.has(slug)) {
        newSelection.delete(slug)
      } else {
        newSelection.add(slug)
      }
      return newSelection
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(new Set(filteredPosts.map((post) => post.slug)))
    } else {
      setSelectedPosts(new Set())
    }
  }

  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/posts/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slugs: Array.from(selectedPosts),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '批量删除失败')
      }

      // 更新本地状态
      setPosts(posts.filter((post) => !selectedPosts.has(post.slug)))
      setSelectedPosts(new Set())

      toast({
        title: '删除成功',
        description: `已删除 ${selectedPosts.size} 篇文章`,
      })

      // 更新统计数据
      await fetchStats()
    } catch (error) {
      console.error('批量删除失败:', error)
      toast({
        variant: 'destructive',
        title: '删除失败',
        description: error instanceof Error ? error.message : '批量删除失败',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkArchive = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/posts/bulk-archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedPosts }),
      })

      if (!response.ok) throw new Error('批量归档失败')

      await fetchPosts() // 重新获取文章列表
      setSelectedPosts([])
      toast({ title: '成功', description: '已归档选中的文章' })
    } catch (error) {
      console.error('批量归档失败:', error)
      toast({ variant: 'destructive', title: '错误', description: '批量归档失败' })
    } finally {
      setIsLoading(false)
    }
  }

  // 统计信息卡片
  const StatsSection = ({ stats }: { stats: typeof initialStats }) => {
    return (
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        <div className='p-4 rounded-lg border bg-white shadow-sm'>
          <div className='text-sm text-gray-500'>总文章</div>
          <div className='text-2xl font-bold text-gray-900'>{stats.total}</div>
        </div>

        <div className='p-4 rounded-lg border bg-white shadow-sm'>
          <div className='text-sm text-gray-500'>已发布</div>
          <div className='text-2xl font-bold text-green-600'>{stats.published}</div>
        </div>

        <div className='p-4 rounded-lg border bg-white shadow-sm'>
          <div className='text-sm text-gray-500'>草稿</div>
          <div className='text-2xl font-bold text-yellow-600'>{stats.draft}</div>
        </div>

        <div className='p-4 rounded-lg border bg-white shadow-sm'>
          <div className='text-sm text-gray-500'>总浏览量</div>
          <div className='text-2xl font-bold text-blue-600'>{stats.views}</div>
        </div>
      </div>
    )
  }

  // 批量操作工具栏
  const BulkActionToolbar = () => (
    <div
      className={`
      fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 
      border-t p-4 flex items-center justify-between
      transform transition-transform duration-200
      ${selectedPosts.length > 0 ? 'translate-y-0' : 'translate-y-full'}
    `}
    >
      <div className='flex items-center gap-2'>
        <span className='text-sm text-gray-500'>已选择 {selectedPosts.length} 篇文章</span>
        <Button variant='ghost' size='sm' onClick={() => setSelectedPosts([])} disabled={isLoading}>
          取消选择
        </Button>
      </div>
      <div className='flex items-center gap-2'>
        <Button variant='outline' size='sm' disabled={isLoading} onClick={handleBulkArchive}>
          {isLoading ? (
            <Loader2 className='w-4 h-4 mr-1 animate-spin' />
          ) : (
            <HiArchive className='w-4 h-4 mr-1' />
          )}
          批量归档
        </Button>
        <Button variant='destructive' size='sm' disabled={isLoading} onClick={handleBulkDelete}>
          {isLoading ? (
            <Loader2 className='w-4 h-4 mr-1 animate-spin' />
          ) : (
            <HiTrash className='w-4 h-4 mr-1' />
          )}
          批量删除
        </Button>
      </div>
    </div>
  )

  // 文章列表项
  const PostItem = ({ post }: { post: BlogPost }) => {
    return (
      <div className='p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
        <div className='flex items-start gap-4'>
          <Checkbox aria-label={`选择文章 ${post.title}`} className='peer' />
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <h3 className='font-medium'>{post.title || '无标题'}</h3>
              <Badge variant='secondary'>{post.status === 'published' ? '已发布' : '草稿'}</Badge>
            </div>
            <div className='text-sm text-gray-500 mb-2'>{post.excerpt || '暂无摘要'}</div>
            <div className='flex items-center gap-4 text-sm text-gray-500'>
              <span>更新于: {formatDate(post.updated_at)}</span>
              <span className='flex items-center'>
                <HiEye className='w-4 h-4 mr-1' />
                {post.view_count || 0} 次浏览
              </span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='icon' asChild>
              <Link href={`/admin/posts/${post.slug}/edit`}>
                <HiPencil className='w-4 h-4' />
                <span className='sr-only'>编辑</span>
              </Link>
            </Button>
            <Button variant='ghost' size='icon' onClick={() => handleShowVersions(post)}>
              <HiClock className='w-4 h-4' />
              <span className='sr-only'>历史版本</span>
            </Button>
            <Button variant='ghost' size='icon' onClick={() => handleDeletePost(post)}>
              <HiTrash className='w-4 h-4' />
              <span className='sr-only'>删除</span>
            </Button>
          </div>
        </div>
        <div className='flex items-center gap-2 mt-4'>
          <PostStatusToggle
            postId={post.id}
            initialStatus={post.status as PostStatus}
            onStatusChange={(newStatus) => handleStatusChange(post, newStatus)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 pb-20'>
      <StatsSection stats={stats} />

      {/* 现有的标签和搜索部分 */}
      <div className='flex justify-between items-center'>
        <div className='flex gap-4'>
          {[
            { key: 'all', label: '全部' },
            { key: 'published', label: '已发布' },
            { key: 'draft', label: '草稿' },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <div className='flex gap-4'>
          <div className='relative'>
            <HiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='搜索文章...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 pr-4 py-2 border rounded-lg w-64'
            />
          </div>
          <Button asChild>
            <Link href='/admin/posts/new'>
              <HiPlus className='w-4 h-4 mr-1' />
              新建文章
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-8'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
        </div>
      ) : (
        <div className='space-y-4'>
          {filteredPosts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
          {filteredPosts.length === 0 && (
            <div className='text-center py-8 text-gray-500'>没有找到符合条件的文章</div>
          )}
        </div>
      )}

      {/* 版本历史对话框 */}
      <Dialog open={isVersionsModalOpen} onOpenChange={setIsVersionsModalOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>版本历史</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            {selectedPost?.versions?.map((version) => (
              <div
                key={version.id}
                className='flex items-center justify-between p-4 border rounded-lg'
              >
                <div>
                  <div className='font-medium'>
                    {version.version_type === 'auto' ? '自动保存' : '手动保存'}
                  </div>
                  <div className='text-sm text-gray-500'>{formatDate(version.created_at)}</div>
                  {version.description && <div className='text-sm mt-1'>{version.description}</div>}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => selectedPost && handleRestoreVersion(selectedPost, version.id)}
                >
                  <HiCheck className='w-4 h-4 mr-1' />
                  恢复此版本
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 批量操作工具栏 */}
      <BulkActionToolbar />
    </div>
  )
}
