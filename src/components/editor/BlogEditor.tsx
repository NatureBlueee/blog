'use client'

import { useState, useCallback, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { QuillIntegration } from './QuillIntegration'
import type { PostFormData } from '@/types'
import { toast } from '@/components/ui/use-toast'
import { HiSave } from 'react-icons/hi'
import { useDebounce } from '@/hooks/useDebounce'

interface BlogEditorProps {
  initialData?: {
    title?: string
    content?: string
    excerpt?: string
    category?: string
    tags?: string[]
    status?: 'draft' | 'published'
    slug?: string
    published_at?: string
  }
  onSave: (content: string, metadata: PostFormData) => Promise<void>
  autoSaveInterval?: number // 自动保存间隔（毫秒），默认 30 秒
}

interface PostFormData {
  title: string
  excerpt?: string
  tags?: string[] // 将存储在 metadata 中
  status?: 'draft' | 'published'
}

export function BlogEditor({
  initialData = {},
  onSave,
  autoSaveInterval = 30000,
}: BlogEditorProps) {
  const [content, setContent] = useState(initialData.content || '')
  const [metadata, setMetadata] = useState<PostFormData>({
    title: initialData.title || '',
    excerpt: initialData.excerpt || '',
    tags: initialData.tags || [],
    status: initialData.status || 'draft',
  })
  const [error, setError] = useState<string>()
  const [isSaving, setIsSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date>()

  // 使用 debounce 处理内容变化
  const debouncedContent = useDebounce(content, 1000)
  const debouncedMetadata = useDebounce(metadata, 1000)

  const handleSave = async (showToast = true) => {
    if (!metadata.title) {
      setError('请输入文章标题')
      return
    }

    try {
      setIsSaving(true)
      setError(undefined)

      // 生成 slug
      const slug = metadata.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      await onSave(content, {
        ...metadata,
        slug,
        metadata: { tags: metadata.tags }, // 将标签存储在 metadata 字段中
      })

      setLastSavedAt(new Date())
      if (showToast) {
        toast({
          title: '成功',
          description: '文章已保存',
        })
      }
    } catch (error) {
      console.error('保存失败:', error)
      setError(error instanceof Error ? error.message : '保存失败')
      toast({
        variant: 'destructive',
        title: '错误',
        description: error instanceof Error ? error.message : '保存失败',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // 自动保存
  useEffect(() => {
    if (!metadata.title) {
      console.log('自动保存：等待标题输入...')
      return
    }

    console.log('自动保存：设置定时器...')
    const timer = setInterval(() => {
      console.log('自动保存：尝试保存...')
      handleSave(false)
    }, autoSaveInterval)

    return () => {
      console.log('自动保存：清理定时器...')
      clearInterval(timer)
    }
  }, [debouncedContent, debouncedMetadata])

  // 添加内容变化的调试信息
  useEffect(() => {
    console.log('内容已更新，等待防抖...')
  }, [content, metadata])

  useEffect(() => {
    console.log('防抖后的内容已更新')
  }, [debouncedContent, debouncedMetadata])

  // 内容变化时的保存状态提示
  useEffect(() => {
    if (lastSavedAt) {
      const minutes = Math.floor((Date.now() - lastSavedAt.getTime()) / 60000)
      if (minutes > 0) {
        toast({
          title: '提示',
          description: `上次保存于 ${minutes} 分钟前`,
        })
      }
    }
  }, [lastSavedAt])

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Input
          placeholder='文章标题'
          value={metadata.title}
          onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
          className='text-2xl font-bold border-none focus-visible:ring-0'
        />
        <Input
          placeholder='文章摘要'
          value={metadata.excerpt}
          onChange={(e) => setMetadata({ ...metadata, excerpt: e.target.value })}
        />
        <Input
          placeholder='分类'
          value={metadata.category}
          onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
        />
        <Input
          placeholder='标签（用逗号分隔）'
          value={metadata.tags.join(',')}
          onChange={(e) =>
            setMetadata({ ...metadata, tags: e.target.value.split(',').map((t) => t.trim()) })
          }
        />
      </div>

      <QuillIntegration content={content} onChange={setContent} className='min-h-[400px]' />

      {error && (
        <Alert variant='destructive'>
          <p>{error}</p>
        </Alert>
      )}

      <div className='flex justify-between items-center'>
        <span className='text-sm text-gray-500'>
          {lastSavedAt && `上次保存: ${lastSavedAt.toLocaleTimeString()}`}
        </span>
        <Button onClick={() => handleSave(true)} disabled={isSaving}>
          <HiSave className='w-4 h-4 mr-1' />
          保存草稿
        </Button>
      </div>
    </div>
  )
}
