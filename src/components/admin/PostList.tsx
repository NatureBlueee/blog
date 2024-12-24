'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { usePosts } from '@/hooks/usePosts'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { BlogPost } from '@/types'
import {
  HiEye,
  HiPencil,
  HiTrash,
  HiPlus,
  HiClock,
  HiDocumentDuplicate,
  HiSearch,
} from 'react-icons/hi'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function PostList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false)

  const queryClient = useQueryClient()
  const { data: posts, isLoading } = usePosts(true)

  // 获取文章统计数据
  const { data: stats } = useQuery({
    queryKey: ['posts-stats'],
    queryFn: async () => {
      const res = await fetch('/api/posts/stats')
      if (!res.ok) throw new Error('获取统计数据失败')
      return res.json()
    },
  })

  // 更新文章状态的 mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ slug, status }: { slug: string; status: 'published' | 'draft' }) => {
      const res = await fetch(`/api/posts/${slug}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('更新文章状态失败')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['posts-stats'] })
      toast.success('文章状态已更新')
    },
    onError: (error) => {
      toast.error('更新失败', {
        description: error instanceof Error ? error.message : '未知错误',
      })
    },
  })

  // 过滤掉已删除的文章
  const filteredPosts = posts?.filter((post) => !post.deleted_at)

  return (
    <div className='space-y-6'>
      {/* 搜索栏 */}
      <div className='flex items-center gap-4'>
        <Input
          type='search'
          placeholder='搜索文章...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='max-w-sm'
          icon={<HiSearch className='h-4 w-4' />}
        />
        <Link href='/admin/posts/new' passHref>
          <Button>
            <HiPlus className='mr-2 h-4 w-4' />
            新建文章
          </Button>
        </Link>
      </div>

      {/* 文章统计 */}
      <div className='grid grid-cols-3 gap-4'>
        <Card className='p-4'>
          <div className='text-2xl font-bold'>{stats?.total || 0}</div>
          <div className='text-sm text-gray-600'>总文章数</div>
        </Card>
        <Card className='p-4'>
          <div className='text-2xl font-bold'>{stats?.published || 0}</div>
          <div className='text-sm text-gray-600'>已发布</div>
        </Card>
        <Card className='p-4'>
          <div className='text-2xl font-bold'>{stats?.draft || 0}</div>
          <div className='text-sm text-gray-600'>草稿</div>
        </Card>
      </div>

      {/* 文章列表 */}
      <div className='space-y-4'>
        {isLoading ? (
          <div className='text-center py-8'>加载中...</div>
        ) : !filteredPosts?.length ? (
          <div className='text-center py-8'>暂无文章</div>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-semibold'>{post.title}</h3>
                  <div className='text-sm text-gray-500 space-x-2'>
                    <span>{format(new Date(post.created_at), 'PPP', { locale: zhCN })}</span>
                    {post.published_at && (
                      <span>
                        • 发布于 {format(new Date(post.published_at), 'PPP', { locale: zhCN })}
                      </span>
                    )}
                    <span>• {post.view_count} 次阅读</span>
                    <span>• {post.likes} 次点赞</span>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                    {post.status === 'published' ? '已发布' : '草稿'}
                  </Badge>
                  <Link href={`/admin/posts/${post.slug}/edit`} passHref>
                    <Button variant='ghost' size='sm'>
                      <HiPencil className='h-4 w-4' />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* 版本历史对话框 */}
      <Dialog open={isVersionsModalOpen} onOpenChange={setIsVersionsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>版本历史</DialogTitle>
          </DialogHeader>
          {/* 版本历史内容 */}
        </DialogContent>
      </Dialog>
    </div>
  )
}
