'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  HiPlus,
  HiSearch,
  HiPencil,
  HiTrash,
  HiArchive,
  HiEye,
  HiCalendar,
  HiTag,
  HiCheck,
  HiUser,
} from 'react-icons/hi'
import { Loader2 } from 'lucide-react'
import { formatDate } from '@/utils/date'
import { postService } from '@/lib/services/post'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { PostStatusToggle } from './PostStatusToggle'
import type { Post, PostStatus, PostVersion } from '@/types'

interface PostListProps {
  onRefresh?: () => void
}

export default function PostList({ onRefresh }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all')
  const [selectedPost, setSelectedPost] = useState<(Post & { versions?: PostVersion[] }) | null>(
    null
  )
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [activeTab])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const data = await postService.getPosts(activeTab !== 'all' ? activeTab : undefined)
      setPosts(data)
    } catch (error) {
      console.error('获取文章列表失败:', error)
      toast({
        variant: 'destructive',
        title: '获取失败',
        description: error instanceof Error ? error.message : '获取文章列表失败',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewVersions = async (post: Post) => {
    try {
      const versions = await postService.getPostVersions(post.slug)
      setSelectedPost({ ...post, versions })
      setIsVersionsModalOpen(true)
    } catch (error) {
      console.error('获取版本历史失败:', error)
      toast({
        variant: 'destructive',
        title: '获取失败',
        description: '获取版本历史失败',
      })
    }
  }

  const handleRestoreVersion = async (post: Post, versionId: string) => {
    try {
      const updatedPost = await postService.restorePostVersion(post.slug, versionId)
      setPosts(posts.map((p) => (p.slug === post.slug ? { ...p, ...updatedPost } : p)))
      setIsVersionsModalOpen(false)
      toast({
        title: '恢复成功',
        description: '已恢复到选定版本',
      })
    } catch (error) {
      console.error('恢复版本失败:', error)
      toast({
        variant: 'destructive',
        title: '恢复失败',
        description: '恢复版本失败',
      })
    }
  }

  const handleSelect = (slug: string) => {
    setSelectedPosts((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  const handleStatusChange = async (post: Post, newStatus: PostStatus) => {
    try {
      setIsLoading(true)
      const updatedPost = await postService.updatePostStatus(post.slug, newStatus)
      setPosts(posts.map((p) => (p.slug === post.slug ? { ...p, ...updatedPost } : p)))
      toast({
        title: '状态更新成功',
        description: `文章《${post.title}》已${newStatus === 'published' ? '发布' : '设为草稿'}`,
      })
      onRefresh?.()
    } catch (error) {
      console.error('更新文章状态失败:', error)
      toast({
        variant: 'destructive',
        title: '更新失败',
        description: error instanceof Error ? error.message : '更新文章状态失败',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return

    try {
      setIsLoading(true)
      await postService.bulkDeletePosts(Array.from(selectedPosts))
      setPosts(posts.filter((post) => !selectedPosts.has(post.slug)))
      setSelectedPosts(new Set())
      toast({
        title: '删除成功',
        description: `已删除 ${selectedPosts.size} 篇文章`,
      })
      onRefresh?.()
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

  const filteredPosts = useMemo(() => {
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [posts, searchQuery])

  // 复用 RecentPosts 的文章卡片样式
  const PostItem = ({ post }: { post: Post }) => (
    <div className='group p-4 rounded-lg border bg-card hover:bg-accent transition-colors'>
      <div className='flex items-start justify-between'>
        <Checkbox
          checked={selectedPosts.has(post.slug)}
          onCheckedChange={() => handleSelect(post.slug)}
          aria-label={`选择文章 ${post.title}`}
          className='mt-1'
        />
        <div className='flex-1 min-w-0 space-y-1 ml-4'>
          <Link
            href={`/admin/posts/${post.slug}/edit`}
            className='font-medium hover:text-primary truncate block'
          >
            {post.title}
          </Link>
          {post.excerpt && (
            <p className='text-sm text-muted-foreground line-clamp-2'>{post.excerpt}</p>
          )}
          <div className='flex items-center gap-4 text-xs text-muted-foreground'>
            <span className='flex items-center gap-1'>
              <HiCalendar className='w-4 h-4' />
              {formatDate(post.created_at)}
            </span>
            <span className='flex items-center gap-1'>
              <HiEye className='w-4 h-4' />
              {post.views} 次浏览
            </span>
            {post.author?.name && (
              <span className='flex items-center gap-1'>
                <HiUser className='w-4 h-4' />
                {post.author.name}
              </span>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className='flex items-center gap-2 mt-2'>
              <HiTag className='w-4 h-4 text-muted-foreground' />
              <div className='flex gap-1 flex-wrap'>
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant='secondary'>
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className='flex items-center gap-2 ml-4'>
          <PostStatusToggle
            postId={post.id}
            slug={post.slug}
            initialStatus={post.status}
            onStatusChange={(newStatus) => handleStatusChange(post, newStatus)}
          />
          <Button
            variant='ghost'
            size='icon'
            onClick={() => handleViewVersions(post)}
            title='查看版本历史'
          >
            <HiArchive className='w-4 h-4' />
          </Button>
          <Button variant='ghost' size='icon' asChild>
            <Link href={`/admin/posts/${post.slug}/edit`} title='编辑文章'>
              <HiPencil className='w-4 h-4' />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className='space-y-6 pb-20'>
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
        <div className='space-y-4'>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className='h-32 w-full' />
          ))}
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

      {selectedPosts.size > 0 && (
        <div className='fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>
              已选择 {selectedPosts.size} 篇文章
            </span>
            <Button variant='ghost' size='sm' onClick={() => setSelectedPosts(new Set())}>
              取消选择
            </Button>
          </div>
          <div className='flex items-center gap-2'>
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
      )}

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
                  <div className='text-sm text-muted-foreground'>
                    {formatDate(version.created_at)}
                  </div>
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
    </div>
  )
}
