'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'

interface PostStatusToggleProps {
  postId: string
  slug: string
  initialStatus?: 'draft' | 'published'
  onStatusChange?: (status: 'draft' | 'published') => void
}

export function PostStatusToggle({
  postId,
  slug,
  initialStatus = 'draft',
  onStatusChange,
}: PostStatusToggleProps) {
  const [status, setStatus] = useState<'draft' | 'published'>(initialStatus)
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (checked: boolean) => {
    if (!slug) {
      toast({
        variant: 'destructive',
        title: '错误',
        description: '文章标识符缺失',
      })
      return
    }

    try {
      setIsLoading(true)
      const newStatus = checked ? 'published' : 'draft'

      const response = await fetch(`/api/posts/${slug}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '更新状态失败')
      }

      setStatus(newStatus)
      onStatusChange?.(newStatus)

      toast({
        title: '状态更新成功',
        description: `文章已${newStatus === 'published' ? '发布' : '设为草稿'}`,
      })
    } catch (error) {
      console.error('更新状态失败:', error)
      setStatus(initialStatus) // 恢复原始状态
      toast({
        variant: 'destructive',
        title: '更新失败',
        description: error instanceof Error ? error.message : '无法更新文章状态，请稍后重试',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex items-center space-x-2'>
      <Switch
        id={`post-status-${postId}`}
        checked={status === 'published'}
        onCheckedChange={handleStatusChange}
        disabled={isLoading}
        aria-label='切换文章状态'
      />
      <Label htmlFor={`post-status-${postId}`}>{status === 'published' ? '已发布' : '草稿'}</Label>
    </div>
  )
}
