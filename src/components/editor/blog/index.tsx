'use client'

import { useCallback, useState } from 'react'
import { useBlogStore } from '@/store/blog'
import { BaseEditor } from '@/components/editor/BaseEditor'
import { MDXComponents } from '@/components/mdx/MDXComponents'
import type { BlogEditorProps } from '@/types/blog'

export function BlogEditor({
  initialContent,
  post,
  isEditing,
  onSubmitAction
}: BlogEditorProps) {
  const { updatePost } = useBlogStore()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = useCallback(async (content: string) => {
    try {
      setIsSaving(true)
      setError(null)
      
      await onSubmitAction(content)
      
      if (isEditing && post?.slug) {
        await updatePost(post.slug, { 
          content,
          ...post
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [onSubmitAction, isEditing, post, updatePost])

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded">
          {error}
        </div>
      )}
      
      <BaseEditor
        initialContent={initialContent}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        previewComponents={MDXComponents}
        autoSave={isEditing}
        isSubmitting={isSaving}
      />
    </div>
  )
} 