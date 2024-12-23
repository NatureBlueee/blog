import { useState, useCallback } from 'react'
import { useAutoSave } from './useAutoSave'
import type { PostFormData, PostVersion } from '@/types'

interface EditorState {
  content: string
  metadata: PostFormData
}

interface UseBlogEditorProps {
  initialContent: string
  initialMetadata?: PostFormData
  onSubmit: (content: string, metadata: PostFormData) => Promise<void>
  onVersionSave?: (content: string, metadata: PostFormData, type: 'auto' | 'manual', description?: string) => Promise<void>
  autoSave?: boolean
}

export function useBlogEditor({
  initialContent,
  initialMetadata,
  onSubmit,
  onVersionSave,
  autoSave = false
}: UseBlogEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [metadata, setMetadata] = useState<PostFormData>(initialMetadata || {
    title: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft'
  })

  const editorState: EditorState = {
    content,
    metadata
  }

  const { lastSaved, isSubmitting, error } = useAutoSave({
    data: editorState,
    onSave: async (data) => {
      await onSubmit(data.content, data.metadata)
      if (onVersionSave) {
        await onVersionSave(data.content, data.metadata, 'auto')
      }
    },
    enabled: autoSave,
    interval: 2000
  })

  const handleSubmit = useCallback(async () => {
    await onSubmit(content, metadata)
  }, [content, metadata, onSubmit])

  const handleManualSave = useCallback(async (description?: string) => {
    try {
      await onSubmit(content, metadata)
      if (onVersionSave) {
        await onVersionSave(content, metadata, 'manual', description)
      }
    } catch (error) {
      console.error('保存失败:', error)
      throw error
    }
  }, [content, metadata, onSubmit, onVersionSave])

  return {
    content,
    setContent,
    metadata,
    setMetadata,
    isSubmitting,
    error,
    lastSaved,
    handleSubmit,
    handleManualSave
  }
} 