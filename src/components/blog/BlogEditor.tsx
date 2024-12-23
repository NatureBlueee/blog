'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'

interface BlogEditorProps {
  initialContent?: string
  onSubmitAction: (content: string) => Promise<void>
  isEditing?: boolean
  post?: {
    slug: string
    content: string
  }
}

export function BlogEditor({
  initialContent = '',
  onSubmitAction,
  isEditing = false,
  post,
}: BlogEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [error, setError] = useState<string>()
  const [isSaving, setIsSaving] = useState(false)

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    setError(undefined)
  }, [])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await onSubmitAction(content)
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='border rounded-lg'>
        <Textarea
          data-testid='markdown-editor'
          value={content}
          onChange={handleContentChange}
          className='min-h-[400px] resize-none'
        />
      </div>

      {error && (
        <Alert variant='destructive'>
          <p>{error}</p>
        </Alert>
      )}

      <div className='flex justify-end'>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? '保存中...' : '保存'}
        </Button>
      </div>
    </div>
  )
}
