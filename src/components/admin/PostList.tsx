'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { BlogPost } from '@/types'
import { HiEye, HiPencil, HiTrash, HiPlus, HiClock } from 'react-icons/hi'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface PostVersion {
  id: string
  version_type: 'auto' | 'manual'
  description: string | null
  created_at: string
}

export default function PostList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all')
  const [selectedPost, setSelectedPost] = useState<
    (BlogPost & { versions?: PostVersion[] }) | null
  >(null)
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [activeTab])

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        '/api/posts' + (activeTab !== 'all' ? `?status=${activeTab}` : '')
      )
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '获取文章列表失败')
      }
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('获取文章列表失败:', error)
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

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-4'>
          <Button
            variant={activeTab === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveTab('all')}
          >
            全部
          </Button>
          <Button
            variant={activeTab === 'published' ? 'default' : 'outline'}
            onClick={() => setActiveTab('published')}
          >
            已发布
          </Button>
          <Button
            variant={activeTab === 'draft' ? 'default' : 'outline'}
            onClick={() => setActiveTab('draft')}
          >
            草稿
          </Button>
        </div>
        <Link href='/admin/posts/new'>
          <Button>
            <HiPlus className='w-4 h-4 mr-1' />
            新建文章
          </Button>
        </Link>
      </div>

      <div className='grid gap-4'>
        {posts.map((post) => (
          <div key={post.id} className='p-4 border rounded-lg flex justify-between items-center'>
            <div>
              <h3 className='font-medium'>{post.title}</h3>
              <div className='text-sm text-gray-500'>
                {format(new Date(post.updated_at), 'PPP', { locale: zhCN })}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                {post.status === 'published' ? '已发布' : '草稿'}
              </Badge>
              <Button variant='outline' size='sm' onClick={() => handleViewVersions(post)}>
                <HiClock className='w-4 h-4 mr-1' />
                版本历史
              </Button>
              <Link href={`/admin/posts/${post.slug}/edit`}>
                <Button variant='outline' size='sm'>
                  <HiPencil className='w-4 h-4 mr-1' />
                  编辑
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isVersionsModalOpen} onOpenChange={setIsVersionsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>版本历史</DialogTitle>
          </DialogHeader>
          {selectedPost?.versions && (
            <div className='space-y-4'>
              {selectedPost.versions.map((version) => (
                <div
                  key={version.id}
                  className='flex items-center justify-between p-4 border rounded-lg'
                >
                  <div>
                    <div className='text-sm text-gray-500'>
                      {format(new Date(version.created_at), 'PPP HH:mm:ss', { locale: zhCN })}
                    </div>
                    <div className='text-sm'>
                      {version.version_type === 'auto' ? '自动保存' : '手动保存'}
                    </div>
                    {version.description && (
                      <div className='text-sm text-gray-600'>{version.description}</div>
                    )}
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleRestoreVersion(selectedPost, version.id)}
                  >
                    恢复此版本
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
