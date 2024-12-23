'use client'

import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import dynamic from 'next/dynamic'

// 动态导入 ReactQuill 以避免 SSR 问题
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>加载编辑器...</p>,
})
import 'react-quill/dist/quill.snow.css'

interface BlogEditorProps {
  initialContent: string
  onSubmitAction: (content: string) => Promise<void>
  isEditing?: boolean
  post?: BlogPost
}

export function BlogEditor({
  initialContent,
  onSubmitAction,
  isEditing = false,
  post,
}: BlogEditorProps) {
  const processedContent = useMemo(() => {
    if (!initialContent) return ''
    const matches = initialContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    return matches ? matches[2].trim() : initialContent
  }, [initialContent])

  const [content, setContent] = useState(processedContent)
  const [error, setError] = useState<string>()
  const [isSaving, setIsSaving] = useState(false)

  const handleContentChange = useCallback((value: string) => {
    setContent(value)
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
        <ReactQuill
          theme='snow'
          value={content}
          onChange={handleContentChange}
          className='min-h-[400px]'
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
          }}
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
