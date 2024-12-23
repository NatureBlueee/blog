'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { QuillIntegration } from './QuillIntegration'
import type { PostFormData } from '@/types'

interface BlogEditorProps {
  initialData?: {
    title?: string
    content?: string
    excerpt?: string
    category?: string
    tags?: string[]
    status?: 'draft' | 'published'
  }
  onSave: (content: string, metadata: PostFormData) => Promise<void>
}

export function BlogEditor({ initialData = {}, onSave }: BlogEditorProps) {
  const [content, setContent] = useState(initialData.content || '')
  const [metadata, setMetadata] = useState<PostFormData>({
    title: initialData.title || '',
    excerpt: initialData.excerpt || '',
    category: initialData.category || '',
    tags: initialData.tags || [],
    status: initialData.status || 'draft',
  })
  const [error, setError] = useState<string>()
  const [isSaving, setIsSaving] = useState(false)

  const handleManualSave = async (status: 'draft' | 'published') => {
    if (!metadata.title) {
      setError('请输入文章标题')
      return
    }

    try {
      setIsSaving(true)
      setError(undefined)
      await onSave(content, { ...metadata, status })
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Input
          placeholder='文章标题'
          value={metadata.title}
          onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
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

      <div className='flex justify-end space-x-2'>
        <Button variant='outline' onClick={() => handleManualSave('draft')} disabled={isSaving}>
          保存草稿
        </Button>
        <Button onClick={() => handleManualSave('published')} disabled={isSaving}>
          {isSaving ? '保存中...' : '发布'}
        </Button>
      </div>
    </div>
  )
}
